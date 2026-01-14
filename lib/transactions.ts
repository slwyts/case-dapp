// 本地交易记录类型（转账和闪兑）
export interface LocalTransaction {
  txHash: string
  type: "send" | "swap"
  amount: string
  to?: string           // 转账接收地址
  fromToken?: string    // 闪兑：源代币
  toToken?: string      // 闪兑：目标代币
  fromAmount?: string   // 闪兑：源数量
  toAmount?: string     // 闪兑：目标数量
  timestamp: number
  status: "pending" | "completed" | "failed"
}

// localStorage 存储交易记录的 key
const TRANSACTIONS_STORAGE_KEY = "case_transactions"

// 从 localStorage 获取交易记录
export function getStoredTransactions(address: string): LocalTransaction[] {
  if (typeof window === "undefined") return []
  try {
    const key = `${TRANSACTIONS_STORAGE_KEY}_${address.toLowerCase()}`
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 保存交易记录到 localStorage
export function saveTransaction(address: string, tx: LocalTransaction) {
  if (typeof window === "undefined") return
  try {
    const key = `${TRANSACTIONS_STORAGE_KEY}_${address.toLowerCase()}`
    const existing = getStoredTransactions(address)
    // 检查是否已存在相同 txHash 的记录
    const exists = existing.some(t => t.txHash === tx.txHash)
    if (!exists) {
      const updated = [tx, ...existing].slice(0, 50) // 最多保留 50 条
      localStorage.setItem(key, JSON.stringify(updated))
    }
  } catch (error) {
    console.error("Failed to save transaction:", error)
  }
}

// 更新交易记录状态
export function updateTransactionStatus(address: string, txHash: string, status: LocalTransaction["status"]) {
  if (typeof window === "undefined") return
  try {
    const key = `${TRANSACTIONS_STORAGE_KEY}_${address.toLowerCase()}`
    const existing = getStoredTransactions(address)
    const updated = existing.map(tx => 
      tx.txHash === txHash ? { ...tx, status } : tx
    )
    localStorage.setItem(key, JSON.stringify(updated))
  } catch (error) {
    console.error("Failed to update transaction:", error)
  }
}
