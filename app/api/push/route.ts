import { NextRequest, NextResponse } from "next/server"
import { createPublicClient, http } from "viem"
import { polygon } from "viem/chains"
import { addDappBalance, isOrderProcessed, markOrderProcessed, addOrderRecord, storePushRecord } from "@/lib/kv"

interface PushRequest {
  orderId: string
  address: string
  amount: number
  timestamp: number
  signature: string
}

// 构造签名消息（项目方需要用同样的格式签名）
function buildSignMessage(orderId: string, address: string, amount: number, timestamp: number): string {
  return `Push CASE to Dapp\nOrderId: ${orderId}\nAddress: ${address}\nAmount: ${amount}\nTimestamp: ${timestamp}`
}

// 验证以太坊签名（使用公钥地址验证）
async function verifySignature(
  orderId: string,
  address: string,
  amount: number,
  timestamp: number,
  signature: string
): Promise<boolean> {
  const signerAddress = process.env.PUSH_SIGNER_ADDRESS
  if (!signerAddress) {
    console.error("PUSH_SIGNER_ADDRESS not configured")
    return false
  }

  try {
    const publicClient = createPublicClient({
      chain: polygon,
      transport: http(process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com"),
    })

    const message = buildSignMessage(orderId, address, amount, timestamp)

    const valid = await publicClient.verifyMessage({
      address: signerAddress as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    })

    return valid
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

// 验证时间戳（5 分钟内有效）
function isTimestampValid(timestamp: number): boolean {
  const now = Date.now()
  const diff = Math.abs(now - timestamp)
  return diff < 5 * 60 * 1000 // 5 分钟
}

// 验证以太坊地址格式
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export async function POST(request: NextRequest) {
  try {
    const body: PushRequest = await request.json()
    const { orderId, address, amount, timestamp, signature } = body

    // 参数验证
    if (!orderId || !address || !amount || !timestamp || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!isValidAddress(address)) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 })
    }

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // 验证时间戳
    if (!isTimestampValid(timestamp)) {
      return NextResponse.json({ error: "Timestamp expired" }, { status: 400 })
    }

    // 验证签名（用公钥地址验证项目方签名）
    const isValid = await verifySignature(orderId, address, amount, timestamp, signature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // 检查订单是否已处理
    const processed = await isOrderProcessed(orderId)
    if (processed) {
      return NextResponse.json({ error: "Order already processed" }, { status: 409 })
    }

    // 处理订单
    // 1. 存储原始数据和签名（可供查询验证）
    await storePushRecord(orderId, {
      orderId,
      address,
      amount,
      timestamp,
      signature,
      processedAt: Date.now(),
    })

    // 2. 累加余额
    const newBalance = await addDappBalance(address, amount)

    // 3. 标记订单已处理
    await markOrderProcessed(orderId)

    // 4. 记录订单到用户记录
    await addOrderRecord(address, {
      orderId,
      type: "push",
      amount,
      timestamp,
      createdAt: Date.now(),
    })

    return NextResponse.json({
      success: true,
      newBalance,
    })
  } catch (error) {
    console.error("Push API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
