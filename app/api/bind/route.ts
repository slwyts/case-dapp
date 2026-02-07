import { NextRequest, NextResponse } from "next/server"
import { buildPartnerAuthHeader, getPartnerAccessToken, getPartnerBaseUrl } from "@/lib/partner"
import { getBindingByAddress, getBindingByUserId, setBinding } from "@/lib/kv"

interface BindRequestBody {
  userId?: string
  address?: string
}

interface BindResponseBody {
  success?: boolean
  message?: string
  code?: number
  timestamp?: number
  result?: boolean
}

function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
    const userId = searchParams.get("userId")

    if (!address && !userId) {
      return NextResponse.json({ error: "Missing address or userId" }, { status: 400 })
    }

    const record = address ? await getBindingByAddress(address) : await getBindingByUserId(userId as string)

    if (!record) {
      return NextResponse.json({ bound: false }, { status: 200 })
    }

    return NextResponse.json({ bound: true, binding: record })
  } catch (error) {
    console.error("Bind status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: BindRequestBody = await request.json()
    const { userId, address } = body

    if (!userId || !address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!isValidAddress(address)) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 })
    }

    const token = await getPartnerAccessToken()
    const response = await fetch(`${getPartnerBaseUrl()}/common/digital/asset/bind/address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accessToken: buildPartnerAuthHeader(token),
      },
      body: JSON.stringify({
        userId,
        evmAddress: address,
        timestamp: Date.now(),
      }),
      cache: "no-store",
    })

    const data: BindResponseBody = await response.json()

    if (!response.ok || !data.result) {
      return NextResponse.json(
        {
          error: data.message || "Bind failed",
          upstreamStatus: response.status,
          upstream: data,
        },
        { status: 400 }
      )
    }

    const record = { userId, address, boundAt: Date.now() }
    await setBinding(record)

    return NextResponse.json({ success: true, binding: record })
  } catch (error) {
    console.error("Bind API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
