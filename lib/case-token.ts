// ERC20 标准 ABI（只包含需要的方法）
export const erc20Abi = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    name: "symbol",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const

// CASE Token 合约地址（从环境变量读取）
export const CASE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CASE_TOKEN_ADDRESS as `0x${string}` | undefined

// Token 精度（CASE 是 18 位）
export const CASE_DECIMALS = 18

// 格式化 token 余额（从 wei 转换为可读数字）
export function formatTokenBalance(balance: bigint | undefined, decimals: number = CASE_DECIMALS): string {
  if (!balance) return "0"
  const divisor = BigInt(10 ** decimals)
  const integerPart = balance / divisor
  const fractionalPart = balance % divisor
  const fractionalStr = fractionalPart.toString().padStart(decimals, "0").slice(0, 2)
  return `${integerPart.toLocaleString()}.${fractionalStr}`
}

// 解析 token 数量（从可读数字转换为 wei）
export function parseTokenAmount(amount: string | number, decimals: number = CASE_DECIMALS): bigint {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount
  return BigInt(Math.floor(numAmount * 10 ** decimals))
}
