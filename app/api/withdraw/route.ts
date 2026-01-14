import { NextRequest, NextResponse } from "next/server"
import { createWalletClient, createPublicClient, http, parseUnits } from "viem"
import { polygon } from "viem/chains"
import { privateKeyToAccount } from "viem/accounts"
import { getDappBalance, getNonce, setDappBalance, incrementNonce, addWithdrawalRecord, addOrderRecord } from "@/lib/kv"
import { erc20Abi, CASE_DECIMALS } from "@/lib/case-token"

interface WithdrawRequest {
  address: string
  signature: string
}

// 验证以太坊地址格式
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

// 构造签名消息
function buildSignMessage(address: string, nonce: number): string {
  return `Withdraw all CASE from Dapp\nAddress: ${address}\nNonce: ${nonce}`
}

// 验证以太坊签名
async function verifyEthSignature(address: string, message: string, signature: string): Promise<boolean> {
  try {
    const publicClient = createPublicClient({
      chain: polygon,
      transport: http(process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com"),
    })

    const valid = await publicClient.verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    })

    return valid
  } catch (error) {
    console.error("Signature verification error:", error)
    return false
  }
}

// 执行转账
async function transferCASE(toAddress: string, amount: number): Promise<string> {
  const privateKey = process.env.HOT_WALLET_PRIVATE_KEY
  const tokenAddress = process.env.NEXT_PUBLIC_CASE_TOKEN_ADDRESS

  if (!privateKey) {
    throw new Error("HOT_WALLET_PRIVATE_KEY not configured")
  }

  if (!tokenAddress) {
    throw new Error("CASE_TOKEN_ADDRESS not configured")
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`)

  const walletClient = createWalletClient({
    account,
    chain: polygon,
    transport: http(process.env.NEXT_PUBLIC_POLYGON_RPC || "https://polygon-rpc.com"),
  })

  // 转换数量为 wei
  const amountInWei = parseUnits(amount.toString(), CASE_DECIMALS)

  // 发送 ERC20 转账
  const hash = await walletClient.writeContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "transfer",
    args: [toAddress as `0x${string}`, amountInWei],
  })

  return hash
}

export async function POST(request: NextRequest) {
  try {
    const body: WithdrawRequest = await request.json()
    const { address, signature } = body

    // 参数验证
    if (!address || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!isValidAddress(address)) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 })
    }

    // 获取当前 nonce 和余额
    const [nonce, balance] = await Promise.all([getNonce(address), getDappBalance(address)])

    // 检查余额
    if (balance <= 0) {
      return NextResponse.json({ error: "No balance to withdraw" }, { status: 400 })
    }

    // 构造并验证签名消息
    const message = buildSignMessage(address, nonce)
    const isValid = await verifyEthSignature(address, message, signature)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // 执行转账
    let txHash: string
    try {
      txHash = await transferCASE(address, balance)
    } catch (error) {
      console.error("Transfer error:", error)
      return NextResponse.json({ error: "Transfer failed" }, { status: 500 })
    }

    // 转账成功后，更新状态
    // 1. 清零余额
    await setDappBalance(address, 0)

    // 2. 递增 nonce
    await incrementNonce(address)

    // 3. 记录提现
    await addWithdrawalRecord(address, {
      amount: balance,
      txHash,
      timestamp: Date.now(),
    })

    // 4. 记录到订单列表（用于前端显示）
    await addOrderRecord(address, {
      orderId: `withdraw-${txHash}`,
      type: "withdraw",
      amount: balance,
      timestamp: Date.now(),
      createdAt: Date.now(),
      txHash,
    })

    return NextResponse.json({
      success: true,
      txHash,
      amount: balance,
    })
  } catch (error) {
    console.error("Withdraw API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
