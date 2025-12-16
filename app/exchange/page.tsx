"use client"

import { useState } from "react"
import { useLanguage } from "@/hooks/use-language"
import { useWallet } from "@/hooks/use-wallet"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownUp, Wallet, Zap, Shield, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export default function ExchangePage() {
  const { t } = useLanguage()
  const { isConnected } = useWallet()
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const [fromToken, setFromToken] = useState<"CASE" | "USDT">("CASE")
  const [toToken, setToToken] = useState<"CASE" | "USDT">("USDT")
  const [isSwapping, setIsSwapping] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const exchangeRate = 0.5
  const balance = { CASE: "10,000", USDT: "5,000" }

  const handleSwapTokens = () => {
    setIsAnimating(true)

    setTimeout(() => {
      setFromToken(toToken)
      setToToken(fromToken)
      setFromAmount(toAmount)
      setToAmount(fromAmount)
      setIsAnimating(false)
    }, 300)
  }

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value) {
      const numValue = Number.parseFloat(value)
      if (fromToken === "CASE") {
        setToAmount((numValue * exchangeRate).toFixed(2))
      } else {
        setToAmount((numValue / exchangeRate).toFixed(2))
      }
    } else {
      setToAmount("")
    }
  }

  const handleMaxClick = () => {
    const maxBalance = fromToken === "CASE" ? balance.CASE : balance.USDT
    handleFromAmountChange(maxBalance.replace(",", ""))
  }

  const handleSwap = () => {
    if (!fromAmount || Number.parseFloat(fromAmount) <= 0) {
      toast.error(t.exchange.invalidAmount)
      return
    }
    setIsSwapping(true)
    setTimeout(() => {
      toast.success(
        t.exchange.swapSuccess
          .replace("{from}", fromAmount)
          .replace("{fromToken}", fromToken)
          .replace("{to}", toAmount)
          .replace("{toToken}", toToken),
      )
      setFromAmount("")
      setToAmount("")
      setIsSwapping(false)
    }, 1500)
  }

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
                    {t.exchange.balance}: {fromToken === "CASE" ? balance.CASE : balance.USDT} {fromToken}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="h-12 text-lg border-primary/20 focus-visible:ring-primary pr-16 flex-1"
                  />
                  {isConnected && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleMaxClick}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary hover:bg-primary/10 text-xs"
                    >
                      MAX
                    </Button>
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-24 h-12 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground font-semibold bg-transparent transition-colors"
                >
                  {fromToken}
                </Button>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center py-2">
              <Button
                size="icon"
                variant="outline"
                onClick={handleSwapTokens}
                className="rounded-full h-10 w-10 border-primary/30 hover:bg-primary hover:text-secondary-foreground transition-all hover:rotate-180 duration-300 bg-transparent"
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
                    {t.exchange.balance}: {toToken === "CASE" ? balance.CASE : balance.USDT} {toToken}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={toAmount}
                  readOnly
                  className="flex-1 h-12 text-lg border-primary/20 bg-muted/50"
                />
                <Button
                  variant="outline"
                  className="w-24 h-12 border-primary/30 text-foreground hover:bg-primary hover:text-primary-foreground font-semibold bg-transparent transition-colors"
                >
                  {toToken}
                </Button>
              </div>
            </div>

            {/* Exchange Rate */}
            {fromAmount && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{t.exchange.rate}:</span>
                  <span className="text-primary font-semibold">
                    1 {fromToken} = {fromToken === "CASE" ? exchangeRate : 1 / exchangeRate} {toToken}
                  </span>
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              size="lg"
              onClick={handleSwap}
              disabled={!isConnected || isSwapping || !fromAmount}
              className="w-full h-12 font-semibold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {!isConnected ? (
                <span className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Connect Wallet in Navbar
                </span>
              ) : isSwapping ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {t.exchange.swapping}
                </span>
              ) : (
                t.exchange.swapNow
              )}
            </Button>
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
