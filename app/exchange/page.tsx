"use client"

import { useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { useSwap } from "@/hooks/use-swap"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownUp, Wallet, Zap, Shield, TrendingUp, Loader2, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { saveTransaction } from "@/lib/transactions"
import { SUPPORTED_TOKENS, formatTokenAmount } from "@/lib/swap"

// CASE Token Logo - 使用 logo.png
function CaseLogo({ size = 20 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="CASE"
      width={size}
      height={size}
      className="rounded-full"
    />
  )
}

// USDT Logo SVG
function UsdtLogo({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#26A17B"/>
      <path d="M55.2 52.5v-0.1c-0.3 0-1.8 0.1-5.2 0.1-2.7 0-4.5-0.1-5.1-0.1v0.1c-10.1-0.4-17.6-2.1-17.6-4.1s7.5-3.7 17.6-4.1v6.5c0.6 0 2.5 0.1 5.2 0.1 3.2 0 4.8-0.1 5.1-0.1v-6.5c10.1 0.4 17.5 2.1 17.5 4.1s-7.5 3.7-17.5 4.1zm0-8.9v-5.8h14.5v-9h-39.5v9h14.5v5.8c-11.4 0.5-20 2.7-20 5.3s8.6 4.8 20 5.3v19h10.5v-19c11.4-0.5 19.9-2.7 19.9-5.3s-8.5-4.8-19.9-5.3z" fill="white"/>
    </svg>
  )
}

// Token Icon 组件
function TokenIcon({ token, size = 20 }: { token: string; size?: number }) {
  const tokenConfig = SUPPORTED_TOKENS[token]
  if (tokenConfig?.logo === "usdt") {
    return <UsdtLogo size={size} />
  }
  return <CaseLogo size={size} />
}

// 代币选择器组件
function TokenSelector({ 
  token, 
  onSelect, 
  disabled = false,
}: { 
  token: string
  onSelect: (token: string) => void
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const availableTokens = Object.keys(SUPPORTED_TOKENS)

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className="w-28 h-12 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground font-semibold bg-transparent transition-colors flex items-center gap-2 justify-between"
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <TokenIcon token={token} size={20} />
          <span>{token}</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute top-full mt-1 left-0 right-0 z-[101] bg-card border border-primary/30 rounded-lg shadow-2xl overflow-hidden animate-slide-down">
            {availableTokens.map((t) => {
              return (
                <button
                  key={t}
                  onClick={() => {
                    onSelect(t)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-left"
                >
                  <TokenIcon token={t} size={20} />
                  <span className="font-medium text-sm">{t}</span>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default function ExchangePage() {
  const { t } = useLanguage()
  const { isConnected, fullAddress, isCorrectChain, switchToPolygon } = useWallet()
  const [fromAmount, setFromAmount] = useState("")
  const [fromToken, setFromToken] = useState<string>("CASE")
  const [toToken, setToToken] = useState<string>("USDT")
  const [isSwapping, setIsSwapping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // 使用 swap hook
  const {
    fromBalanceFormatted,
    toBalanceFormatted,
    fromBalance,
    estimatedOutputFormatted,
    exchangeRate,
    isLoadingQuote,
    needsApproval,
    isApproving,
    approve,
    swap,
    refetchBalances,
  } = useSwap({
    fromToken,
    toToken,
    fromAmount,
    userAddress: fullAddress,
  })

  // 切换代币
  const handleSwapTokens = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const tempToken = fromToken
      setFromToken(toToken)
      setToToken(tempToken)
      setFromAmount("")
      setIsAnimating(false)
    }, 300)
  }

  // 输入金额变化
  const handleFromAmountChange = (value: string) => {
    // 只允许数字和小数点
    if (value && !/^\d*\.?\d*$/.test(value)) return
    setFromAmount(value)
  }

  // 点击 MAX
  const handleMaxClick = () => {
    if (fromBalance) {
      const tokenConfig = SUPPORTED_TOKENS[fromToken]
      const maxAmount = formatTokenAmount(fromBalance, tokenConfig?.decimals || 18, tokenConfig?.decimals || 18)
      setFromAmount(maxAmount.replace(/,/g, ""))
    }
  }

  // 授权
  const handleApprove = async () => {
    try {
      await approve()
      toast.success("Approval successful!")
    } catch (error) {
      console.error("Approve error:", error)
      const message = error instanceof Error ? error.message : "Approval failed"
      toast.error(message)
    }
  }

  // 执行闪兑
  const handleSwap = async () => {
    if (!fromAmount || Number(fromAmount) <= 0) {
      toast.error(t.exchange.invalidAmount)
      return
    }

    if (!isCorrectChain) {
      try {
        await switchToPolygon()
      } catch {
        toast.error("Please switch to Polygon network")
        return
      }
    }

    setIsSwapping(true)
    try {
      const txHash = await swap()
      
      // 保存交易记录
      if (fullAddress) {
        saveTransaction(fullAddress, {
          txHash,
          type: "swap",
          amount: fromAmount,
          fromToken,
          toToken,
          fromAmount,
          toAmount: estimatedOutputFormatted,
          timestamp: Date.now(),
          status: "completed",
        })
      }

      toast.success(
        t.exchange.swapSuccess
          .replace("{from}", fromAmount)
          .replace("{fromToken}", fromToken)
          .replace("{to}", estimatedOutputFormatted)
          .replace("{toToken}", toToken),
      )
      
      setFromAmount("")
      refetchBalances()
    } catch (error) {
      console.error("Swap error:", error)
      const message = error instanceof Error ? error.message : "Swap failed"
      toast.error(message)
    } finally {
      setIsSwapping(false)
    }
  }

  // 获取按钮状态
  const getButtonState = () => {
    if (!isConnected) {
      return { disabled: true, text: "Connect Wallet in Navbar", icon: <Wallet className="h-5 w-5" /> }
    }
    if (!isCorrectChain) {
      return { disabled: false, text: "Switch to Polygon", icon: null, onClick: switchToPolygon }
    }
    if (isApproving) {
      return { disabled: true, text: "Approving...", icon: <Loader2 className="h-5 w-5 animate-spin" /> }
    }
    if (needsApproval && fromAmount) {
      return { disabled: false, text: `Approve ${fromToken}`, icon: null, onClick: handleApprove }
    }
    if (isSwapping) {
      return { disabled: true, text: t.exchange.swapping, icon: <Loader2 className="h-5 w-5 animate-spin" /> }
    }
    if (!fromAmount || Number(fromAmount) <= 0) {
      return { disabled: true, text: t.exchange.swapNow, icon: null }
    }
    return { disabled: false, text: t.exchange.swapNow, icon: null, onClick: handleSwap }
  }

  const buttonState = getButtonState()

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-size-[4rem_4rem]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="container mx-auto max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-3xl md:text-4xl font-bold text-primary">{t.exchange.title}</h1>
          <p className="text-muted-foreground">{t.exchange.subtitle}</p>
        </div>

        {/* Swap Card */}
        <Card
          className="border-primary/20 bg-card/90 backdrop-blur shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "100ms" }}
        >
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg text-primary">
              <ArrowDownUp className="h-5 w-5" />
              {t.exchange.swap}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* From Token */}
            <div
              className={`space-y-2 transition-all duration-300 ${
                isAnimating ? "opacity-50 -translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">{t.exchange.from}</Label>
                {isConnected && (
                  <span className="text-xs text-muted-foreground">
                    {t.exchange.balance}: {fromBalanceFormatted} {fromToken}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="h-12 text-lg border-primary/20 focus-visible:ring-primary pr-16 flex-1"
                    disabled={isSwapping || isApproving}
                  />
                  {isConnected && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleMaxClick}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary hover:bg-primary/10 text-xs"
                      disabled={isSwapping || isApproving}
                    >
                      MAX
                    </Button>
                  )}
                </div>
                <TokenSelector
                  token={fromToken}
                  onSelect={(t) => {
                    if (t === toToken) {
                      // 如果选了对方的币，交换两个代币
                      setToToken(fromToken)
                    }
                    setFromToken(t)
                  }}
                  disabled={isSwapping || isApproving}
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center py-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleSwapTokens}
                disabled={isSwapping || isApproving}
                className="rounded-full h-10 w-10 border-primary/30 hover:bg-primary hover:text-secondary-foreground hover:rotate-180 hover:shadow-lg hover:shadow-primary/30 bg-transparent"
                style={{ transition: "all 0.5s cubic-bezier(0.65, 0.05, 0.1, 1)" }}
              >
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {/* To Token */}
            <div
              className={`space-y-2 transition-all duration-300 ${
                isAnimating ? "opacity-50 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">{t.exchange.to}</Label>
                {isConnected && (
                  <span className="text-xs text-muted-foreground">
                    {t.exchange.balance}: {toBalanceFormatted} {toToken}
                  </span>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="0.00"
                    value={isLoadingQuote ? "..." : estimatedOutputFormatted !== "0" ? estimatedOutputFormatted : ""}
                    readOnly
                    className="flex-1 h-12 text-lg border-primary/20 bg-muted/50"
                  />
                </div>
                <TokenSelector
                  token={toToken}
                  onSelect={(t) => {
                    if (t === fromToken) {
                      // 如果选了对方的币，交换两个代币
                      setFromToken(toToken)
                    }
                    setToToken(t)
                  }}
                  disabled={isSwapping || isApproving}
                />
              </div>
            </div>

            {/* Exchange Rate */}
            {fromAmount && exchangeRate > 0 && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.exchange.rate}:</span>
                  <span className="text-primary font-semibold">
                    1 {fromToken} ≈ {exchangeRate.toFixed(6)} {toToken}
                  </span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              size="lg"
              onClick={buttonState.onClick}
              disabled={buttonState.disabled}
              className="w-full h-12 font-semibold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                {buttonState.icon}
                {buttonState.text}
              </span>
            </Button>
            
            {/* Powered by */}
            <p className="text-xs text-center text-muted-foreground">
              Powered by QuickSwap V2
            </p>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <div
          className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: "200ms" }}
        >
          <Card className="border-primary/10 bg-card/80 backdrop-blur hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{t.exchange.instant}</p>
              <p className="text-sm font-semibold text-foreground">{t.exchange.fastSwaps}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-card/80 backdrop-blur hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{t.exchange.secure}</p>
              <p className="text-sm font-semibold text-foreground">{t.exchange.onChain}</p>
            </CardContent>
          </Card>
          <Card className="border-primary/10 bg-card/80 backdrop-blur hover:border-primary/30 transition-all hover:-translate-y-1 duration-300">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{t.exchange.lowFees}</p>
              <p className="text-sm font-semibold text-foreground">{t.exchange.bestRates}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
