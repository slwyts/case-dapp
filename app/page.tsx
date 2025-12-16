"use client"

import { useLanguage } from "@/hooks/use-language"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Sparkles, Copy, Check, Zap, Shield, Users, Globe, TrendingUp, Layers } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function HomePage() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("0x034b070a87d61e945148728f81be810310d2db7e2")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const advantageIcons = [Users, Shield, TrendingUp, Layers, Globe, Zap]

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
          entry.target.classList.remove("opacity-0", "translate-y-8")
        }
      })
    }, observerOptions)

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observer.observe(el))

    return () => {
      elements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
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
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[150px] animate-pulse" />
        <div
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-4xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold shadow-lg shadow-primary/10">
            <Sparkles className="h-4 w-4" />
            {t.hero.welcome}
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-primary tracking-tight leading-tight">
            {t.hero.title}
          </h1>

          <p className="text-2xl sm:text-3xl text-foreground/90 font-semibold">{t.hero.subtitle}</p>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.hero.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/exchange">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base font-semibold h-14 px-10 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                {t.nav.exchange}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/airdrop">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base font-semibold h-14 px-10 bg-transparent hover:bg-primary hover:text-primary-foreground border-primary/30 hover:border-primary transition-all"
              >
                {t.nav.airdrop}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-24 bg-linear-to-b from-transparent via-primary/5 to-transparent scroll-animate opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">{t.mission.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.mission.subtitle}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[t.mission.point1, t.mission.point2, t.mission.point3].map((point, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-linear-to-br from-card via-card to-primary/5 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="p-8">
                  <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/25 transition-all duration-500 shadow-lg">
                    <Image
                      src={`/img-${idx + 1}.png`}
                      alt={`Mission icon ${idx + 1}`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-base text-foreground/80 leading-relaxed">{point}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="px-4 py-24 scroll-animate opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">{t.advantages.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.advantages.subtitle}</p>
          </div>

          <div className="space-y-6">
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
                <div
                  key={idx}
                  className="group flex items-start gap-6 p-6 rounded-2xl border-l-4 border-primary/40 bg-linear-to-r from-primary/5 to-transparent hover:border-primary hover:from-primary/10 transition-all duration-500"
                >
                  <div className="shrink-0 w-16 h-16 rounded-xl bg-primary/15 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/25 transition-all duration-500 shadow-lg">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 pt-2">
                    <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="px-4 py-24 bg-linear-to-b from-transparent via-primary/5 to-transparent scroll-animate opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">{t.roadmap.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.roadmap.subtitle}</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { date: t.roadmap.jun2025, desc: t.roadmap.jun2025desc },
                { date: t.roadmap.jul2025, desc: t.roadmap.jul2025desc },
                { date: t.roadmap.sep2025, desc: t.roadmap.sep2025desc },
                { date: t.roadmap.jan2026, desc: t.roadmap.jan2026desc },
                { date: t.roadmap.later, desc: t.roadmap.laterdesc },
              ].map((item, idx) => (
                <div key={idx} className="relative group lg:pt-16">
                  <div className="hidden lg:flex absolute top-5 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary border-4 border-background items-center justify-center group-hover:scale-125 transition-transform duration-300 shadow-lg shadow-primary/50 z-10">
                    <div className="w-3 h-3 rounded-full bg-background animate-pulse" />
                  </div>

                  <div className="relative rounded-2xl border border-primary/20 bg-card p-6 hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 h-full">
                    <div className="flex lg:flex-col items-center lg:items-start gap-3 mb-3">
                      <div className="lg:hidden w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
                      <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed lg:text-center">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Economics Section */}
      <section className="px-4 py-24 scroll-animate opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-primary mb-4">{t.economics.title}</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.economics.description}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5 shadow-xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-primary mb-6">Token Details</h3>
                <div className="space-y-4">
                  {[
                    { label: "Symbol", value: "CasE" },
                    { label: "Precision", value: "18" },
                    { label: "Total Supply", value: "3.5B" },
                  ].map((stat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl bg-background/50 hover:bg-primary/5 transition-colors"
                    >
                      <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
                      <span className="text-2xl font-bold text-primary">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5 shadow-xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-primary mb-6">Contract Address</h3>
                <div className="space-y-4">
                  <code className="block text-xs sm:text-sm font-mono text-foreground bg-background/50 px-4 py-4 rounded-xl overflow-x-auto break-all leading-relaxed">
                    0x034b070a87d61e945148728f81be810310d2db7e2
                  </code>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="w-full h-12 font-semibold border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all bg-transparent"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-5 w-5 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-5 w-5" />
                        Copy Address
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">{t.economics.tradeTitle}</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: "UniSwap", desc: t.economics.uniswapDesc },
                { name: "QuickSwap", desc: t.economics.quickswapDesc },
                { name: "SushiSwap", desc: t.economics.sushiswapDesc },
                { name: "LBank", desc: t.economics.lbankDesc },
              ].map((exchange, idx) => (
                <Card
                  key={idx}
                  className="group border-primary/20 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 h-full"
                >
                  <CardContent className="p-5 flex flex-col h-full">
                    <h4 className="font-bold text-primary mb-2 text-center text-lg group-hover:scale-105 transition-transform">
                      {exchange.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4 text-center flex-1 leading-relaxed">
                      {exchange.desc}
                    </p>
                    <Button
                      size="sm"
                      className="w-full text-xs font-semibold shadow-lg hover:shadow-xl transition-shadow"
                    >
                      {t.economics.trade}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 scroll-animate opacity-0 translate-y-8 transition-all duration-700">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-primary/30 bg-linear-to-br from-primary/10 via-primary/5 to-transparent p-12 text-center overflow-hidden shadow-2xl hover:shadow-primary/20 transition-shadow duration-500">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary">
                {t.hero.welcome} {t.hero.title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t.hero.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/exchange">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 font-semibold shadow-xl shadow-primary/25">
                    {t.nav.exchange}
                  </Button>
                </Link>
                <Link href="/airdrop">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-12 px-8 font-semibold bg-transparent hover:bg-primary hover:text-primary-foreground border-primary/30"
                  >
                    {t.nav.airdrop}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
