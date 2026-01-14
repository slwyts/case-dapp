"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, ExternalLink, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, X, Check, Download, Loader2 } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import QRCode from "react-qr-code"
import { cn } from "@/lib/utils"
import { getStoredTransactions, saveTransaction, type LocalTransaction } from "@/lib/transactions"
import type { TranslationKey } from "@/lib/i18n"

interface DappOrder {
  orderId: string
  amount: number
  timestamp: number
  type: "push" | "withdraw"
}

interface WithdrawModalProps {
  showWithdraw: boolean
  withdrawAnimating: boolean
  onClose: () => void
  onWithdraw: () => void
  dappBalance: number
  isWithdrawing: boolean
  t: TranslationKey
}

function WithdrawModal({
  showWithdraw,
  withdrawAnimating,
  onClose,
  onWithdraw,
  dappBalance,
  isWithdrawing,
  t,
}: WithdrawModalProps) {
  if (!showWithdraw) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out",
          withdrawAnimating ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <Card
        className={cn(
          "relative w-full max-w-md border-primary/30 bg-card shadow-2xl transition-all duration-300 ease-out",
          withdrawAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
        )}
      >
        <CardHeader className="relative border-b border-border pb-4">
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <Download className="h-5 w-5" />
            {t.my.withdraw} CasE
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 hover:bg-primary/10"
            disabled={isWithdrawing}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t.my.dappBalance}</p>
            <p className="text-2xl font-bold text-primary">{dappBalance.toLocaleString()} CASE</p>
          </div>

          <p className="text-sm text-muted-foreground">{t.my.withdrawDesc}</p>

          <Button
            onClick={onWithdraw}
            className="w-full h-12 text-base font-semibold"
            disabled={isWithdrawing || dappBalance <= 0}
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.my.withdrawing}
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                {t.my.withdrawAll}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">{t.my.signToWithdraw}</p>
        </CardContent>
      </Card>
    </div>
  )
}

interface ReceiveModalProps {
  showReceive: boolean
  receiveAnimating: boolean
  onClose: () => void
  onCopy: () => void
  copied: boolean
  t: TranslationKey
  fullAddress: string
}

function ReceiveModal({ showReceive, receiveAnimating, onClose, onCopy, copied, t, fullAddress }: ReceiveModalProps) {
  if (!showReceive) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out",
          receiveAnimating ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <Card
        className={cn(
          "relative w-full max-w-md border-primary/30 bg-card shadow-2xl transition-all duration-300 ease-out",
          receiveAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
        )}
      >
        <CardHeader className="relative border-b border-border pb-4">
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <ArrowDownLeft className="h-5 w-5" />
            {t.my.receive} CasE
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-inner">
              <QRCode value={fullAddress} size={180} level="H" bgColor="#ffffff" fgColor="#000000" />
            </div>
            <p className="text-sm text-muted-foreground text-center">{t.my.scanQR}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">{t.my.yourAddress}</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono bg-muted px-3 py-3 rounded-lg text-foreground break-all">
                {fullAddress}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={onCopy}
                className="shrink-0 h-10 w-10 bg-transparent hover:bg-primary hover:text-primary-foreground"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">{t.my.onlySendCasE}</p>
        </CardContent>
      </Card>
    </div>
  )
}

interface SendModalProps {
  showSend: boolean
  sendAnimating: boolean
  onClose: () => void
  onSend: () => void
  sendAddress: string
  setSendAddress: (address: string) => void
  sendAmount: string
  setSendAmount: (amount: string) => void
  balance: string
  balanceRaw: bigint | undefined
  isSending: boolean
  t: TranslationKey
}

function SendModal({
  showSend,
  sendAnimating,
  onClose,
  onSend,
  sendAddress,
  setSendAddress,
  sendAmount,
  setSendAmount,
  balance,
  balanceRaw,
  isSending,
  t,
}: SendModalProps) {
  if (!showSend) return null

  // 设置最大金额
  const handleSetMax = () => {
    if (balanceRaw) {
      // 转换为可读数字（保留完整精度）
      const maxAmount = Number(balanceRaw) / 1e18
      setSendAmount(maxAmount.toString())
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out",
          sendAnimating ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <Card
        className={cn(
          "relative w-full max-w-md border-primary/30 bg-card shadow-2xl transition-all duration-300 ease-out",
          sendAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4",
        )}
      >
        <CardHeader className="relative border-b border-border pb-4">
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5" />
            {t.my.send} CasE
          </CardTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">{t.my.availableBalance}</p>
            <p className="text-2xl font-bold text-primary">{balance} CASE</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-sm font-medium">
              {t.my.recipientAddress}
            </Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={sendAddress}
              onChange={(e) => setSendAddress(e.target.value)}
              className="bg-transparent border-border focus:border-primary"
              disabled={isSending}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount" className="text-sm font-medium">
                {t.my.amount}
              </Label>
              <button
                type="button"
                onClick={handleSetMax}
                className="text-xs text-primary hover:underline"
                disabled={isSending}
              >
                {t.my.max}
              </button>
            </div>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                className="bg-transparent border-border focus:border-primary pr-16"
                disabled={isSending}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">CASE</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.my.networkFee}</span>
              <span className="text-foreground">~0.001 MATIC</span>
            </div>
          </div>

          <Button
            onClick={onSend}
            className="w-full h-12 text-base font-semibold"
            disabled={!sendAddress || !sendAmount || isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t.my.sending}
              </>
            ) : (
              <>
                <ArrowUpRight className="mr-2 h-5 w-5" />
                {t.my.send} CasE
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">{t.my.verifyAddress}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MyPage() {
  const { t } = useLanguage()
  const { isConnected, walletAddress, fullAddress, walletBalance, walletBalanceRaw, connectWallet, signMessage, sendToken, isSendingToken, refetchWalletBalance } = useWallet()
  const [showReceive, setShowReceive] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [receiveAnimating, setReceiveAnimating] = useState(false)
  const [sendAnimating, setSendAnimating] = useState(false)
  const [withdrawAnimating, setWithdrawAnimating] = useState(false)

  // Dapp 余额相关状态
  const [dappBalance, setDappBalance] = useState<number>(0)
  const [nonce, setNonce] = useState<number>(0)
  const [dappOrders, setDappOrders] = useState<DappOrder[]>([])
  const [isLoadingDapp, setIsLoadingDapp] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)

  // 本地交易记录状态
  const [localTransactions, setLocalTransactions] = useState<LocalTransaction[]>([])

  const displayAddress = walletAddress || "0x0000...0000"
  const actualFullAddress = fullAddress || "0x0000000000000000000000000000000000000000"

  // 加载本地交易记录
  useEffect(() => {
    if (fullAddress) {
      const txs = getStoredTransactions(fullAddress)
      setLocalTransactions(txs)
    }
  }, [fullAddress])

  // 获取 Dapp 余额
  const fetchDappBalance = useCallback(async () => {
    if (!fullAddress) return
    setIsLoadingDapp(true)
    try {
      const res = await fetch(`/api/balance?address=${fullAddress}`)
      const data = await res.json()
      if (!res.ok) {
        console.error("Failed to fetch dapp balance:", data.error)
        return
      }
      setDappBalance(data.balance || 0)
      setNonce(data.nonce || 0)
      setDappOrders(data.orders || [])
    } catch (error) {
      console.error("Failed to fetch dapp balance:", error)
    } finally {
      setIsLoadingDapp(false)
    }
  }, [fullAddress])

  // 连接钱包后获取 Dapp 余额
  useEffect(() => {
    if (isConnected && fullAddress) {
      fetchDappBalance()
    }
  }, [isConnected, fullAddress, fetchDappBalance])

  // 刷新所有余额
  const handleRefreshBalance = async () => {
    await Promise.all([fetchDappBalance(), refetchWalletBalance()])
    toast.success(t.my.refreshing)
  }

  const openReceiveModal = () => {
    setShowReceive(true)
    setTimeout(() => setReceiveAnimating(true), 10)
  }

  const closeReceiveModal = () => {
    setReceiveAnimating(false)
    setTimeout(() => setShowReceive(false), 300)
  }

  const openSendModal = () => {
    setShowSend(true)
    setTimeout(() => setSendAnimating(true), 10)
  }

  const closeSendModal = () => {
    setSendAnimating(false)
    setTimeout(() => setShowSend(false), 300)
  }

  const openWithdrawModal = () => {
    setShowWithdraw(true)
    setTimeout(() => setWithdrawAnimating(true), 10)
  }

  const closeWithdrawModal = () => {
    setWithdrawAnimating(false)
    setTimeout(() => setShowWithdraw(false), 300)
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(actualFullAddress)
    setCopied(true)
    toast.success(t.my.addressCopied)
    setTimeout(() => setCopied(false), 2000)
  }

  // 提现处理
  const handleWithdraw = async () => {
    if (!fullAddress || dappBalance <= 0) {
      toast.error(t.my.noBalance)
      return
    }

    setIsWithdrawing(true)
    try {
      // 1. 构造签名消息
      const message = `Withdraw all CASE from Dapp\nAddress: ${fullAddress}\nNonce: ${nonce}`

      // 2. 签名
      const signature = await signMessage(message)

      // 3. 调用提现 API
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: fullAddress, signature }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(t.my.withdrawSuccess.replace("{txHash}", data.txHash.slice(0, 10) + "..."))
        // 刷新余额
        fetchDappBalance()
        refetchWalletBalance()
        closeWithdrawModal()
      } else {
        toast.error(data.error || t.my.withdrawFailed)
      }
    } catch (error) {
      console.error("Withdraw error:", error)
      toast.error(t.my.withdrawFailed)
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleSend = async () => {
    if (!sendAddress || !sendAmount || !fullAddress) {
      toast.error(t.my.fillAllFields)
      return
    }

    try {
      // 调用链上转账
      const txHash = await sendToken(sendAddress, sendAmount)
      
      // 保存交易记录到 localStorage
      const newTx: LocalTransaction = {
        txHash,
        type: "send",
        amount: sendAmount,
        to: sendAddress,
        timestamp: Date.now(),
        status: "completed",
      }
      saveTransaction(fullAddress, newTx)
      setLocalTransactions(prev => [newTx, ...prev].slice(0, 50))
      
      toast.success(t.my.sendSuccess.replace("{txHash}", txHash.slice(0, 10) + "..."))
      
      // 刷新余额
      refetchWalletBalance()
      
      // 关闭弹窗并清空表单
      closeSendModal()
      setSendAddress("")
      setSendAmount("")
    } catch (error) {
      console.error("Send error:", error)
      const errorMessage = error instanceof Error ? error.message : t.my.sendFailed
      toast.error(errorMessage)
    }
  }
  if (!isConnected) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 animate-in fade-in duration-700">
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        </div>

        <Card className="max-w-md w-full border-primary/20 bg-card/80 backdrop-blur">
          <CardContent className="p-12 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 animate-pulse">
              <Wallet className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary">{t.my.title}</h2>
              <p className="text-base text-muted-foreground">{t.my.connectWalletHint}</p>
            </div>
            <Button size="lg" onClick={connectWallet} className="w-full font-semibold shadow-lg">
              <Wallet className="mr-2 h-5 w-5" />
              {t.my.connectWallet}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 py-12 animate-in fade-in duration-700">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.05)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.05)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      <ReceiveModal
        showReceive={showReceive}
        receiveAnimating={receiveAnimating}
        onClose={closeReceiveModal}
        onCopy={handleCopyAddress}
        copied={copied}
        t={t}
        fullAddress={actualFullAddress}
      />
      <SendModal
        showSend={showSend}
        sendAnimating={sendAnimating}
        onClose={closeSendModal}
        onSend={handleSend}
        sendAddress={sendAddress}
        setSendAddress={setSendAddress}
        sendAmount={sendAmount}
        setSendAmount={setSendAmount}
        balance={walletBalance}
        balanceRaw={walletBalanceRaw}
        isSending={isSendingToken}
        t={t}
      />
      <WithdrawModal
        showWithdraw={showWithdraw}
        withdrawAnimating={withdrawAnimating}
        onClose={closeWithdrawModal}
        onWithdraw={handleWithdraw}
        dappBalance={dappBalance}
        isWithdrawing={isWithdrawing}
        t={t}
      />

      <div className="container mx-auto max-w-4xl space-y-6">
        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Wallet className="h-5 w-5" />
              {t.my.wallet}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs font-mono bg-muted/50 px-3 py-2 rounded-lg text-foreground break-all">
                {fullAddress}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyAddress}
                className="h-9 w-9 bg-transparent hover:bg-primary hover:text-primary-foreground"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={handleRefreshBalance}
                disabled={isLoadingDapp}
                className="h-9 w-9 bg-transparent hover:bg-primary hover:text-primary-foreground"
              >
                <RefreshCw className={cn("h-4 w-4", isLoadingDapp && "animate-spin")} />
              </Button>
            </div>

            {/* 双余额显示 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{t.my.dappBalance}</p>
                <p className="text-xl font-bold text-primary">
                  {isLoadingDapp ? "..." : dappBalance.toLocaleString()} CASE
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{t.my.walletBalance}</p>
                <p className="text-xl font-bold text-primary">{walletBalance} CASE</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <Link href="/exchange" className="block">
                <Button
                  variant="outline"
                  className="w-full flex-col h-auto py-3 bg-transparent hover:bg-primary hover:text-secondary-foreground transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mb-1" />
                  <span className="text-xs">{t.my.swap}</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={openReceiveModal}
                className="w-full flex-col h-auto py-3 bg-transparent hover:bg-primary hover:text-secondary-foreground transition-colors"
              >
                <ArrowDownLeft className="h-4 w-4 mb-1" />
                <span className="text-xs">{t.my.receive}</span>
              </Button>
              <Button
                variant="outline"
                onClick={openSendModal}
                className="w-full flex-col h-auto py-3 bg-transparent hover:bg-primary hover:text-secondary-foreground transition-colors"
              >
                <ArrowUpRight className="h-4 w-4 mb-1" />
                <span className="text-xs">{t.my.send}</span>
              </Button>
              <Button
                variant="outline"
                onClick={openWithdrawModal}
                disabled={dappBalance <= 0}
                className="w-full flex-col h-auto py-3 bg-transparent hover:bg-primary hover:text-secondary-foreground transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4 mb-1" />
                <span className="text-xs">{t.my.withdraw}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-primary">{t.my.transactions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dappOrders.length === 0 && localTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">{t.my.noTransactions}</p>
              ) : (
                <>
                  {/* Dapp 订单记录（入账/提现） */}
                  {dappOrders.map((order, idx) => (
                    <div
                      key={order.orderId}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            order.type === "push" ? "bg-green-500/20" : "bg-orange-500/20"
                          }`}
                        >
                          {order.type === "push" ? (
                            <ArrowDownLeft className="h-4 w-4 text-green-400" />
                          ) : (
                            <Download className="h-4 w-4 text-orange-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize text-sm">
                            {order.type === "push" ? "Received" : "Withdraw"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold text-sm ${
                            order.type === "push" ? "text-green-400" : "text-orange-400"
                          }`}
                        >
                          {order.type === "push" ? "+" : "-"}
                          {order.amount.toLocaleString()} CASE
                        </p>
                        <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {/* 本地交易记录（转账/闪兑） */}
                  {localTransactions.map((tx, idx) => (
                    <a
                      key={tx.txHash}
                      href={`https://polygonscan.com/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors animate-in fade-in slide-in-from-bottom-2 cursor-pointer"
                      style={{ animationDelay: `${(dappOrders.length + idx) * 50}ms` }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            tx.type === "send" ? "bg-red-500/20" : "bg-blue-500/20"
                          }`}
                        >
                          {tx.type === "send" ? (
                            <ArrowUpRight className="h-4 w-4 text-red-400" />
                          ) : (
                            <RefreshCw className="h-4 w-4 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {tx.type === "send" ? t.my.send : t.exchange.swap}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {tx.type === "send" ? (
                          <p className="font-semibold text-sm text-red-400">
                            -{tx.amount} CASE
                          </p>
                        ) : (
                          <p className="font-semibold text-sm text-blue-400">
                            {tx.fromAmount} {tx.fromToken} → {tx.toAmount} {tx.toToken}
                          </p>
                        )}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            tx.status === "completed" 
                              ? "border-green-500/50 text-green-400" 
                              : tx.status === "pending"
                              ? "border-yellow-500/50 text-yellow-400"
                              : "border-red-500/50 text-red-400"
                          }`}
                        >
                          {tx.status === "completed" ? "Completed" : tx.status === "pending" ? "Pending" : "Failed"}
                        </Badge>
                      </div>
                    </a>
                  ))}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-primary">{t.my.quickLinks}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="https://www.locdao.life"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-primary/10 transition-colors group"
            >
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {t.my.mainSite}
              </span>
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>
            <a
              href="https://polygonscan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-primary/10 transition-colors group"
            >
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {t.my.explorer}
              </span>
              <ExternalLink className="h-4 w-4 text-primary" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
