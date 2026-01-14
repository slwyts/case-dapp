import { createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { polygon } from "viem/chains"

// 项目方签名器私钥（模拟项目方调用）
const SIGNER_PRIVATE_KEY = "0xa69c7d073066de6257edacbe950b2ca33e1c8b8f1eeb95d29a5bba4f0395dd89"
const API_URL = "http://localhost:3000/api/push"

const targetAddress = "0xA4b76D7Cae384C9a5fD5f573Cef74BFdB980E966"
const amount = 1

async function main() {
  // 从私钥创建账户（模拟项目方）
  const account = privateKeyToAccount(SIGNER_PRIVATE_KEY)
  console.log("Signer address:", account.address)

  // 创建钱包客户端
  const walletClient = createWalletClient({
    account,
    chain: polygon,
    transport: http("https://polygon-rpc.com"),
  })

  // 生成 orderId 和 timestamp
  const orderId = `test-${Date.now()}`
  const timestamp = Date.now()

  // 构造签名消息（与 API 中的格式一致）
  const message = `Push CASE to Dapp\nOrderId: ${orderId}\nAddress: ${targetAddress}\nAmount: ${amount}\nTimestamp: ${timestamp}`
  
  console.log("Message to sign:", message)

  // 签名
  const signature = await walletClient.signMessage({ message })
  console.log("Signature:", signature)

  // 调用 API
  const requestBody = {
    orderId,
    address: targetAddress,
    amount,
    timestamp,
    signature,
  }

  console.log("Request body:", JSON.stringify(requestBody, null, 2))

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })

  const result = await response.json()
  console.log("Response:", response.status, result)
}

main().catch(console.error)
