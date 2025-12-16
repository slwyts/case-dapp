"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Gift, Clock, Bell, CheckCircle2, ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useState, useRef } from "react"

export default function AirdropPage() {
  const { t } = useLanguage()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const toastShown = useRef(false)

  useEffect(() => {
    if (!toastShown.current) {
      toastShown.current = true
      toast.info(t.airdrop.notOpen, {
        description: t.airdrop.description,
        duration: 5000,
        position: "top-center",
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubscribe = () => {
    setIsSubscribed(true)
    toast.success(t.airdrop.subscribed, {
      description: t.airdrop.subscribedDesc,
      duration: 3000,
      position: "top-center",
    })
  }

  const features = [
    { icon: Gift, title: t.airdrop.feature1, desc: t.airdrop.feature1Desc },
    { icon: Clock, title: t.airdrop.feature2, desc: t.airdrop.feature2Desc },
    { icon: Bell, title: t.airdrop.feature3, desc: t.airdrop.feature3Desc },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30" />
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px] animate-pulse" />
      </div>

      {/* Hero */}
      <section className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 animate-pulse">
            <Gift className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary">{t.airdrop.title}</h1>
            <p className="text-lg text-muted-foreground">{t.airdrop.subtitle}</p>
          </div>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-center gap-3 text-primary">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-semibold">{t.airdrop.notOpen}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div
            className="grid md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: "150ms" }}
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <Card
                  key={idx}
                  className="group hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-5 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="px-4 py-12">
        <div
          className="max-w-md mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "300ms" }}
        >
          <Card className="overflow-hidden">
            <CardContent className="p-6 text-center space-y-4">
              {isSubscribed ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-7 w-7 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{t.airdrop.subscribed}</h3>
                    <p className="text-sm text-muted-foreground">{t.airdrop.subscribedDesc}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Bell className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{t.airdrop.ctaTitle}</h3>
                    <p className="text-sm text-muted-foreground">{t.airdrop.ctaDesc}</p>
                  </div>
                  <Button
                    size="lg"
                    onClick={handleSubscribe}
                    className="h-11 px-6 transition-transform hover:scale-105 active:scale-95"
                  >
                    {t.airdrop.subscribe}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Info */}
      <section className="px-4 py-12">
        <div
          className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "450ms" }}
        >
          <p className="text-sm text-muted-foreground">{t.airdrop.footerNote}</p>
        </div>
      </section>
    </div>
  )
}
