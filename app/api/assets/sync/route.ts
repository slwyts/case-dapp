import { NextRequest, NextResponse } from "next/server"
import { buildPartnerAuthHeader, getPartnerAccessToken, getPartnerBaseUrl } from "@/lib/partner"
import {
  addDappBalance,
  addOrderRecord,
  getBindingByAddress,
  isAssetProcessed,
  markAssetProcessed,
  setLastAssetSync,
} from "@/lib/kv"

interface AssetRecord {
  id?: string
  assetId?: string
  userId?: string
  amount?: number | string
  assetType?: string
  orderSn?: string
  status?: string
  createTime?: string
}

interface AssetQueryResponse {
  success?: boolean
  message?: string
  code?: number
  data?: {
    records?: AssetRecord[]
    total?: number
    size?: number
    current?: number
    pages?: number
  }
  result?: {
    records?: AssetRecord[]
    total?: number
    size?: number
    current?: number
    pages?: number
  }
}

function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

function parseAmount(amount: number | string | undefined): number | null {
  if (amount === undefined || amount === null) return null
  const value = typeof amount === "string" ? Number(amount) : amount
  if (Number.isNaN(value) || value <= 0) return null
  return value
}

function parseTimestamp(createTime?: string): number {
  if (!createTime) return Date.now()
  const parsed = Date.parse(createTime)
  return Number.isNaN(parsed) ? Date.now() : parsed
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const body = await request.json().catch(() => ({}))
    const address = body.address || searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Missing address" }, { status: 400 })
    }

    if (!isValidAddress(address)) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 })
    }

    const binding = await getBindingByAddress(address)
    if (!binding) {
      return NextResponse.json({ error: "Address not bound" }, { status: 400 })
    }

    const token = await getPartnerAccessToken()
    const pageSize = 50
    let current = 1
    let pages = 1
    let totalFetched = 0
    let newRecords = 0

    while (current <= pages && current <= 10) {
      const response = await fetch(`${getPartnerBaseUrl()}/common/digital/asset/assets/query/page`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accessToken: buildPartnerAuthHeader(token),
        },
        body: JSON.stringify({
          userId: binding.userId,
          evmAddress: address,
          pageNumber: current,
          pageSize,
        }),
        cache: "no-store",
      })

      const data: AssetQueryResponse = await response.json()

      if (!response.ok) {
        return NextResponse.json({ error: data.message || "Asset query failed" }, { status: 400 })
      }

      const payload = data.data || data.result || {}
      const records = payload.records || []
      pages = payload.pages || 1
      totalFetched += records.length

      for (const record of records) {
        const assetId = record.assetId || record.id || record.orderSn
        if (!assetId) continue

        if (record.assetType && record.assetType.toUpperCase() !== "CASE") {
          continue
        }

        const processed = await isAssetProcessed(address, assetId)
        if (processed) continue

        const amount = parseAmount(record.amount)
        if (!amount) continue

        await addDappBalance(address, amount)
        await addOrderRecord(address, {
          orderId: assetId,
          type: "push",
          amount,
          timestamp: parseTimestamp(record.createTime),
          createdAt: Date.now(),
        })
        await markAssetProcessed(address, assetId)
        newRecords += 1
      }

      current += 1
    }

    await setLastAssetSync(address, Date.now())

    return NextResponse.json({
      success: true,
      newRecords,
      totalFetched,
    })
  } catch (error) {
    console.error("Asset sync error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
