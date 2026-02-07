import { kv } from "@vercel/kv"

// KV key 前缀
const BALANCE_PREFIX = "balance:"
const NONCE_PREFIX = "nonce:"
const ORDERS_PREFIX = "orders:"
const PROCESSED_ORDERS_KEY = "processed_orders"
const WITHDRAWALS_PREFIX = "withdrawals:"
const PUSH_RECORDS_PREFIX = "push:"
const PARTNER_TOKEN_KEY = "partner:token"
const BINDING_BY_ADDRESS_PREFIX = "binding:address:"
const BINDING_BY_USER_PREFIX = "binding:user:"
const ASSET_PROCESSED_PREFIX = "asset:processed:"
const ASSET_LAST_SYNC_PREFIX = "asset:lastsync:"

// 订单记录类型
export interface OrderRecord {
  orderId: string
  type: "push" | "withdraw"
  amount: number
  timestamp: number
  createdAt: number
  txHash?: string  // 提现时有 txHash
}

// 提现记录类型
export interface WithdrawalRecord {
  amount: number
  txHash: string
  timestamp: number
}

// Push 原始记录类型（存储签名用于验证）
export interface PushRecord {
  orderId: string
  address: string
  amount: number
  timestamp: number
  signature: string
  processedAt: number
}

export interface BindingRecord {
  userId: string
  address: string
  boundAt: number
}

export interface PartnerTokenCache {
  accessToken: string
  tokenType: string
  expiresAt: number
  clientName?: string
  permissions?: string
}

// 获取用户 Dapp 余额
export async function getDappBalance(address: string): Promise<number> {
  const key = `${BALANCE_PREFIX}${address.toLowerCase()}`
  const balance = await kv.get<number>(key)
  return balance || 0
}

// 增加用户 Dapp 余额
export async function addDappBalance(address: string, amount: number): Promise<number> {
  const key = `${BALANCE_PREFIX}${address.toLowerCase()}`
  const newBalance = await kv.incrbyfloat(key, amount)
  return newBalance
}

// 设置用户 Dapp 余额（用于提现后清零）
export async function setDappBalance(address: string, amount: number): Promise<void> {
  const key = `${BALANCE_PREFIX}${address.toLowerCase()}`
  await kv.set(key, amount)
}

// 获取用户 nonce（用于防重放）
export async function getNonce(address: string): Promise<number> {
  const key = `${NONCE_PREFIX}${address.toLowerCase()}`
  const nonce = await kv.get<number>(key)
  return nonce || 0
}

// 递增用户 nonce
export async function incrementNonce(address: string): Promise<number> {
  const key = `${NONCE_PREFIX}${address.toLowerCase()}`
  const newNonce = await kv.incr(key)
  return newNonce
}

// 检查订单是否已处理
export async function isOrderProcessed(orderId: string): Promise<boolean> {
  const result = await kv.sismember(PROCESSED_ORDERS_KEY, orderId)
  return result === 1
}

// 标记订单为已处理
export async function markOrderProcessed(orderId: string): Promise<void> {
  await kv.sadd(PROCESSED_ORDERS_KEY, orderId)
}

// 添加订单记录
export async function addOrderRecord(address: string, order: OrderRecord): Promise<void> {
  const key = `${ORDERS_PREFIX}${address.toLowerCase()}`
  await kv.lpush(key, JSON.stringify(order))
}

// 获取用户订单记录（最近 50 条）
export async function getOrderRecords(address: string, limit: number = 50): Promise<OrderRecord[]> {
  const key = `${ORDERS_PREFIX}${address.toLowerCase()}`
  const records = await kv.lrange(key, 0, limit - 1)
  return records.map((r) => (typeof r === "string" ? JSON.parse(r) : r))
}

// 添加提现记录
export async function addWithdrawalRecord(address: string, withdrawal: WithdrawalRecord): Promise<void> {
  const key = `${WITHDRAWALS_PREFIX}${address.toLowerCase()}`
  await kv.lpush(key, JSON.stringify(withdrawal))
}

// 获取用户提现记录
export async function getWithdrawalRecords(address: string, limit: number = 50): Promise<WithdrawalRecord[]> {
  const key = `${WITHDRAWALS_PREFIX}${address.toLowerCase()}`
  const records = await kv.lrange(key, 0, limit - 1)
  return records.map((r) => (typeof r === "string" ? JSON.parse(r) : r))
}

// 存储 Push 原始记录（包含签名，可供查询验证）
export async function storePushRecord(orderId: string, record: PushRecord): Promise<void> {
  const key = `${PUSH_RECORDS_PREFIX}${orderId}`
  await kv.set(key, JSON.stringify(record))
}

// 获取 Push 原始记录
export async function getPushRecord(orderId: string): Promise<PushRecord | null> {
  const key = `${PUSH_RECORDS_PREFIX}${orderId}`
  const record = await kv.get<string>(key)
  if (!record) return null
  return typeof record === "string" ? JSON.parse(record) : record
}

// 获取项目方 token 缓存
export async function getPartnerTokenCache(): Promise<PartnerTokenCache | null> {
  const record = await kv.get<string>(PARTNER_TOKEN_KEY)
  if (!record) return null
  return typeof record === "string" ? JSON.parse(record) : record
}

// 设置项目方 token 缓存
export async function setPartnerTokenCache(token: PartnerTokenCache): Promise<void> {
  await kv.set(PARTNER_TOKEN_KEY, JSON.stringify(token))
}

// 绑定关系
export async function setBinding(record: BindingRecord): Promise<void> {
  const addressKey = `${BINDING_BY_ADDRESS_PREFIX}${record.address.toLowerCase()}`
  const userKey = `${BINDING_BY_USER_PREFIX}${record.userId}`
  await kv.set(addressKey, JSON.stringify(record))
  await kv.set(userKey, JSON.stringify(record))
}

export async function getBindingByAddress(address: string): Promise<BindingRecord | null> {
  const key = `${BINDING_BY_ADDRESS_PREFIX}${address.toLowerCase()}`
  const record = await kv.get<string>(key)
  if (!record) return null
  return typeof record === "string" ? JSON.parse(record) : record
}

export async function getBindingByUserId(userId: string): Promise<BindingRecord | null> {
  const key = `${BINDING_BY_USER_PREFIX}${userId}`
  const record = await kv.get<string>(key)
  if (!record) return null
  return typeof record === "string" ? JSON.parse(record) : record
}

// 资产幂等处理
export async function isAssetProcessed(address: string, assetId: string): Promise<boolean> {
  const key = `${ASSET_PROCESSED_PREFIX}${address.toLowerCase()}`
  const result = await kv.sismember(key, assetId)
  return result === 1
}

export async function markAssetProcessed(address: string, assetId: string): Promise<void> {
  const key = `${ASSET_PROCESSED_PREFIX}${address.toLowerCase()}`
  await kv.sadd(key, assetId)
}

export async function getLastAssetSync(address: string): Promise<number> {
  const key = `${ASSET_LAST_SYNC_PREFIX}${address.toLowerCase()}`
  const value = await kv.get<number>(key)
  return value || 0
}

export async function setLastAssetSync(address: string, timestamp: number): Promise<void> {
  const key = `${ASSET_LAST_SYNC_PREFIX}${address.toLowerCase()}`
  await kv.set(key, timestamp)
}
