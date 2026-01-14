// QuickSwap V2 Router ABI (只包含需要的方法)
export const quickswapRouterAbi = [
  {
    name: "swapExactTokensForTokens",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }],
  },
  {
    name: "getAmountsOut",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "path", type: "address[]" },
    ],
    outputs: [{ name: "amounts", type: "uint256[]" }],
  },
] as const

// ERC20 Approve ABI
export const erc20ApproveAbi = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
] as const

// Token 配置
export interface TokenConfig {
  symbol: string
  name: string
  address: `0x${string}`
  decimals: number
  logo: string // "case" | "usdt" 用于识别显示哪个 SVG
}

// QuickSwap V2 Router 地址
export const QUICKSWAP_ROUTER = process.env.NEXT_PUBLIC_QUICKSWAP_ROUTER as `0x${string}` | undefined

// USDT 地址 (Polygon)
export const USDT_ADDRESS = process.env.NEXT_PUBLIC_USDT_ADDRESS as `0x${string}` | undefined

// CASE Token 地址
export const CASE_ADDRESS = process.env.NEXT_PUBLIC_CASE_TOKEN_ADDRESS as `0x${string}` | undefined

// 支持的代币列表
export const SUPPORTED_TOKENS: Record<string, TokenConfig> = {
  CASE: {
    symbol: "CASE",
    name: "CasE Token",
    address: CASE_ADDRESS || "0x0",
    decimals: 18,
    logo: "case",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    address: USDT_ADDRESS || "0x0",
    decimals: 6, // USDT on Polygon is 6 decimals
    logo: "usdt",
  },
}

// 滑点设置 (默认 0.5%)
export const DEFAULT_SLIPPAGE = 0.5

// 计算最小输出金额（考虑滑点）
export function calculateMinAmountOut(amountOut: bigint, slippage: number = DEFAULT_SLIPPAGE): bigint {
  const slippageBps = BigInt(Math.floor(slippage * 100)) // 转换为基点
  const minOut = amountOut - (amountOut * slippageBps) / BigInt(10000)
  return minOut
}

// 解析代币数量
export function parseTokenAmount(amount: string, decimals: number): bigint {
  if (!amount || isNaN(Number(amount))) return BigInt(0)
  const [integer, fraction = ""] = amount.split(".")
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals)
  return BigInt(integer + paddedFraction)
}

// 格式化代币数量
export function formatTokenAmount(amount: bigint, decimals: number, displayDecimals: number = 4): string {
  if (amount === BigInt(0)) return "0"
  
  const str = amount.toString().padStart(decimals + 1, "0")
  const integerPart = str.slice(0, -decimals) || "0"
  const fractionPart = str.slice(-decimals)
  
  // 截取显示位数
  const displayFraction = fractionPart.slice(0, displayDecimals)
  
  // 移除末尾的 0
  const trimmedFraction = displayFraction.replace(/0+$/, "")
  
  if (trimmedFraction) {
    return `${Number(integerPart).toLocaleString()}.${trimmedFraction}`
  }
  return Number(integerPart).toLocaleString()
}

// 获取交易截止时间（默认 20 分钟后）
export function getDeadline(minutes: number = 20): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + minutes * 60)
}
