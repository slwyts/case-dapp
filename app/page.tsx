"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Copy, Check, Zap, Shield, Users, Globe, TrendingUp, Layers } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function HomePage() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("0x034b070a87d61e945148728f81be810310d2db7e2")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const advantageIcons = [Users, Shield, TrendingUp, Layers, Globe, Zap]

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.5)">
              <path
                d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                strokeOpacity="0.15"
              />
              <path
                d="M28 0L56 16L56 50L28 66L0 50L0 16Z"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                strokeOpacity="0.08"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px] animate-pulse" />
        <div
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {t.hero.welcome}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary tracking-tight">{t.hero.title}</h1>

          <p className="text-xl sm:text-2xl text-foreground font-medium">{t.hero.subtitle}</p>

          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.hero.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link href="/exchange">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base font-semibold h-12 px-8 bg-transparent hover:text-white"
              >
                {t.nav.exchange}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-3">{t.mission.title}</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.mission.subtitle}</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[t.mission.point1, t.mission.point2, t.mission.point3].map((point, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-colors duration-300">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform duration-300">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{point}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-3">{t.advantages.title}</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.advantages.subtitle}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: t.advantages.clear, desc: t.advantages.clearDesc },
              { title: t.advantages.decentral, desc: t.advantages.decentralDesc },
              { title: t.advantages.transparent, desc: t.advantages.transparentDesc },
              { title: t.advantages.onchain, desc: t.advantages.onchainDesc },
              { title: t.advantages.local, desc: t.advantages.localDesc },
              { title: t.advantages.crossplatform, desc: t.advantages.crossplatformDesc },
            ].map((item, idx) => {
              const Icon = advantageIcons[idx]
              return (
                <Card key={idx} className="group hover:border-primary/50 transition-all duration-300">
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-3">{t.roadmap.title}</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">{t.roadmap.subtitle}</p>
          <div className="relative">
            
            <div className="hidden lg:block absolute top-3 left-0 right-0 h-px bg-primary/30" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { date: t.roadmap.jun2025, desc: t.roadmap.jun2025desc },
                { date: t.roadmap.jul2025, desc: t.roadmap.jul2025desc },
                { date: t.roadmap.sep2025, desc: t.roadmap.sep2025desc },
                { date: t.roadmap.jan2026, desc: t.roadmap.jan2026desc },
                { date: t.roadmap.later, desc: t.roadmap.laterdesc },
              ].map((item, idx) => (
                <div key={idx} className="relative group lg:pt-10">
                  
                  <div className="hidden lg:flex absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-background border-2 border-primary items-center justify-center group-hover:scale-125 transition-transform duration-300">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <Card className="h-full hover:border-primary/50 transition-colors duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2 lg:justify-center">
                        <div className="lg:hidden w-2 h-2 rounded-full bg-primary" />
                        <span className="text-sm font-bold text-primary">{item.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed lg:text-center">{item.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Token Info Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-3">{t.economics.title}</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto text-sm leading-relaxed">
            {t.economics.description}
          </p>

          {/* Token Stats Card */}
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-3 divide-x divide-border">
                {[
                  { label: "Symbol", value: "CasE" },
                  { label: "Precision", value: "18" },
                  { label: "Supply", value: "3.5B" },
                ].map((stat, idx) => (
                  <div key={idx} className="p-5 text-center hover:bg-muted/50 transition-colors duration-300">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-primary">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-5">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Contract Address</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs sm:text-sm font-mono text-foreground bg-muted px-3 py-2 rounded-lg overflow-x-auto">
                    0x034b070a87d61e945148728f81be810310d2db7e2
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                    className="shrink-0 h-9 w-9 bg-transparent"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <h3 className="text-lg font-semibold text-foreground text-center mb-4">{t.economics.tradeTitle}</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "UniSwap", desc: t.economics.uniswapDesc },
              { name: "QuickSwap", desc: t.economics.quickswapDesc },
              { name: "SushiSwap", desc: t.economics.sushiswapDesc },
              { name: "LBank", desc: t.economics.lbankDesc },
            ].map((exchange, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-all duration-300 h-full">
                <CardContent className="p-4 flex flex-col h-full">
                  <h4 className="font-bold text-primary mb-1 text-center">{exchange.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 text-center flex-1">{exchange.desc}</p>
                  <Button size="sm" className="w-full text-xs mt-auto">
                    {t.economics.trade}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Card className="border-primary/30 bg-linear-to-br from-primary/10 via-primary/5 to-transparent">
            <CardContent className="p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
                {t.hero.welcome} {t.hero.title}
              </h2>
              <p className="text-muted-foreground mb-6">{t.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/exchange">
                  <Button size="lg" className="w-full sm:w-auto h-11 px-6 ">
                    {t.nav.exchange}
                  </Button>
                </Link>
                <Link href="/airdrop">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-11 px-6 bg-transparent hover:text-white">
                    {t.nav.airdrop}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
