"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, ExternalLink, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, X, Check } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import QRCode from "react-qr-code"
import type { TranslationKey } from "@/lib/i18n"

interface ReceiveModalProps {
  showReceive: boolean
  receiveAnimating: boolean
  onClose: () => void
  onCopy: () => void
  copied: boolean
  t: TranslationKey
  fullAddress: string
}

function ReceiveModal({
  showReceive,
  receiveAnimating,
  onClose,
  onCopy,
  copied,
  t,
  fullAddress,
}: ReceiveModalProps) {
  if (!showReceive) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          receiveAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <Card
        className={`relative w-full max-w-md border-primary/30 bg-card shadow-2xl transition-all duration-300 ease-out ${
          receiveAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
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
  t,
}: SendModalProps) {
  if (!showSend) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          sendAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <Card
        className={`relative w-full max-w-md border-primary/30 bg-card shadow-2xl transition-all duration-300 ease-out ${
          sendAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"
        }`}
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
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="amount" className="text-sm font-medium">
                {t.my.amount}
              </Label>
              <button
                type="button"
                onClick={() => setSendAmount("12500.50")}
                className="text-xs text-primary hover:underline"
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
            disabled={!sendAddress || !sendAmount}
          >
            <ArrowUpRight className="mr-2 h-5 w-5" />
            {t.my.send} CasE
          </Button>

          <p className="text-xs text-muted-foreground text-center">{t.my.verifyAddress}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MyPage() {
  const { t } = useLanguage()
  const [isConnected, setIsConnected] = useState(false)
  const [showReceive, setShowReceive] = useState(false)
  const [showSend, setShowSend] = useState(false)
  const [sendAddress, setSendAddress] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [receiveAnimating, setReceiveAnimating] = useState(false)
  const [sendAnimating, setSendAnimating] = useState(false)

  const walletAddress = "0x1234...5678"
  const fullAddress = "0x1234567890abcdef1234567890abcdef12345678"
  const balance = "12,500.50"

  const transactions = [
    { id: 1, type: "swap", amount: "+1,000 CASE", time: "2025-12-16 10:30:00", status: "completed" },
    { id: 2, type: "receive", amount: "+500 CASE", time: "2025-12-15 15:20:00", status: "completed" },
    { id: 3, type: "send", amount: "-250 CASE", time: "2025-12-14 09:15:00", status: "completed" },
  ]

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

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress)
    setCopied(true)
    toast.success(t.my.addressCopied)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConnectWallet = () => {
    setIsConnected(true)
    toast.success(t.my.walletConnected)
  }

  const handleSend = () => {
    if (!sendAddress || !sendAmount) {
      toast.error(t.my.fillAllFields)
      return
    }
    toast.success(t.my.sendingTo.replace("{amount}", sendAmount).replace("{address}", sendAddress.slice(0, 10)))
    closeSendModal()
    setSendAddress("")
    setSendAmount("")
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
              <p className="text-base text-muted-foreground">{t.my.connectDescription}</p>
            </div>
            <Button size="lg" onClick={handleConnectWallet} className="w-full font-semibold shadow-lg">
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
        fullAddress={fullAddress}
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
        balance={balance}
        t={t}
      />

      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{t.my.title}</h1>
          <p className="text-sm text-muted-foreground">{t.my.viewWallet}</p>
        </div>

        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <Wallet className="h-5 w-5" />
              {t.my.wallet}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono bg-muted/50 px-3 py-2 rounded-lg text-foreground">
                {walletAddress}
              </code>
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyAddress}
                className="h-9 w-9 bg-transparent hover:bg-primary hover:text-primary-foreground"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">{t.my.balance}</p>
              <p className="text-3xl font-bold text-primary">{balance} CASE</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Link href="/exchange" className="block">
                <Button
                  variant="outline"
                  className="w-full flex-col h-auto py-3 bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mb-1" />
                  <span className="text-xs">{t.my.swap}</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={openReceiveModal}
                className="w-full flex-col h-auto py-3 bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ArrowDownLeft className="h-4 w-4 mb-1" />
                <span className="text-xs">{t.my.receive}</span>
              </Button>
              <Button
                variant="outline"
                onClick={openSendModal}
                className="w-full flex-col h-auto py-3 bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <ArrowUpRight className="h-4 w-4 mb-1" />
                <span className="text-xs">{t.my.send}</span>
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
              {transactions.map((tx, idx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        tx.type === "swap"
                          ? "bg-blue-500/20"
                          : tx.type === "receive"
                            ? "bg-green-500/20"
                            : "bg-red-500/20"
                      }`}
                    >
                      {tx.type === "swap" && <RefreshCw className="h-4 w-4 text-blue-400" />}
                      {tx.type === "receive" && <ArrowDownLeft className="h-4 w-4 text-green-400" />}
                      {tx.type === "send" && <ArrowUpRight className="h-4 w-4 text-red-400" />}
                    </div>
                    <div>
                      <p className="font-medium capitalize text-sm">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        tx.amount.startsWith("+") ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {tx.amount}
                    </p>
                    <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-primary">{t.my.quickLinks}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="https://locdao.life"
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
