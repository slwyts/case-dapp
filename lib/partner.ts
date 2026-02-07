import { getPartnerTokenCache, setPartnerTokenCache } from "@/lib/kv"

const DEFAULT_BASE_URL = "https://web3.linkprofit.cn:8890"

interface PartnerTokenResult {
  accessToken: string
  tokenType: string
  expiresIn: number
  clientName?: string
  permissions?: string
}

interface PartnerTokenResponse {
  success?: boolean
  message?: string
  code?: number
  timestamp?: number
  result?: PartnerTokenResult
}

export function getPartnerBaseUrl(): string {
  return process.env.PARTNER_API_BASE_URL || DEFAULT_BASE_URL
}

export async function getPartnerAccessToken(): Promise<PartnerTokenResult> {
  const cached = await getPartnerTokenCache()
  if (cached && cached.expiresAt > Date.now() + 60_000) {
    return {
      accessToken: cached.accessToken,
      tokenType: cached.tokenType,
      expiresIn: Math.floor((cached.expiresAt - Date.now()) / 1000),
      clientName: cached.clientName,
      permissions: cached.permissions,
    }
  }

  const username = process.env.PARTNER_AUTH_USERNAME
  const password = process.env.PARTNER_AUTH_PASSWORD
  const clientName = process.env.PARTNER_CLIENT_NAME || "DAPP客户端"

  if (!username || !password) {
    throw new Error("Partner auth credentials not configured")
  }

  const response = await fetch(`${getPartnerBaseUrl()}/common/auth/api/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, clientName }),
    cache: "no-store",
  })

  const data: PartnerTokenResponse = await response.json()

  if (!response.ok || !data.result) {
    const message = data.message || "Failed to fetch partner token"
    throw new Error(message)
  }

  const expiresAt = Date.now() + (data.result.expiresIn || 0) * 1000
  await setPartnerTokenCache({
    accessToken: data.result.accessToken,
    tokenType: data.result.tokenType,
    expiresAt,
    clientName: data.result.clientName,
    permissions: data.result.permissions,
  })

  return data.result
}

export function buildPartnerAuthHeader(token: PartnerTokenResult): string {
  return `${token.tokenType} ${token.accessToken}`
}
