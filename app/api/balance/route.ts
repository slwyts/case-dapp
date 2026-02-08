import { NextRequest, NextResponse } from "next/server"
import { getDappBalance, getNonce, getOrderRecords, getBindingByUserId } from "@/lib/kv"

// 验证以太坊地址格式
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    let address = searchParams.get("address")
    const userId = searchParams.get("userId")

    if (!address && userId) {
      const binding = await getBindingByUserId(userId)
      address = binding?.address || null
      if (!address) {
        return NextResponse.json({ error: "UserId not bound" }, { status: 404 })
      }
    }

    if (!address) {
      return NextResponse.json({ error: "Missing address parameter" }, { status: 400 })
    }

    if (!isValidAddress(address)) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 })
    }

    // 获取余额、nonce 和订单记录
    const [balance, nonce, orders] = await Promise.all([
      getDappBalance(address),
      getNonce(address),
      getOrderRecords(address, 20),
    ])

    return NextResponse.json({
      balance,
      nonce,
      orders,
    })
  } catch (error) {
    console.error("Balance API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
