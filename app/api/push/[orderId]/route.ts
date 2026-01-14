import { NextRequest, NextResponse } from "next/server"
import { getPushRecord } from "@/lib/kv"

// GET /api/push/[orderId] - 查询订单原始数据和签名
export async function GET(request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    const record = await getPushRecord(orderId)

    if (!record) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // 返回完整记录（包含签名，可供验证）
    return NextResponse.json({
      orderId: record.orderId,
      address: record.address,
      amount: record.amount,
      timestamp: record.timestamp,
      signature: record.signature,
      processedAt: record.processedAt,
      // 附带签名消息格式，方便验证
      signMessage: `Push CASE to Dapp\nOrderId: ${record.orderId}\nAddress: ${record.address}\nAmount: ${record.amount}\nTimestamp: ${record.timestamp}`,
    })
  } catch (error) {
    console.error("Get push record error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
