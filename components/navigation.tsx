"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, Wallet, LogOut, ExternalLink, ChevronRight, Globe } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "@/hooks/use-theme"
import { useWallet } from "@/hooks/use-wallet"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  const handleNavigation = () => {
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/airdrop", label: t.nav.airdrop },
    { href: "/exchange", label: t.nav.exchange },
    { href: "/my", label: t.nav.my },
  ]

  const quickLinks = [
    { href: "https://www.locdao.life", label: t.my.mainSite, external: true },
    { href: "https://www.polygonscan.com", label: t.my.explorer, external: true },
  ]

  const handleWalletAction = () => {
    if (isConnected) {
      disconnectWallet()
    } else {
      connectWallet()
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 group-hover:scale-110 transition-all duration-300">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold text-primary group-hover:text-primary/80 transition-colors">CasE</span>
            </Link>

            <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg relative group",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {/* PC端快捷链接 */}
              <div className="border-l border-primary/20 ml-2 pl-2 flex items-center gap-1">
                {quickLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 transition-all duration-300 px-3 py-2 rounded-lg flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Wallet Button */}
              <Button
                variant={isConnected ? "outline" : "default"}
                size="sm"
                onClick={handleWalletAction}
                className={cn(
                  "rounded-full text-xs sm:text-sm transition-all duration-300",
                  isConnected
                    ? "border-primary/30 hover:bg-primary/10 hover:border-primary"
                    : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25",
                  "hidden sm:inline-flex",
                )}
              >
                {isConnected ? (
                  <>
                    <LogOut className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    {walletAddress}
                  </>
                ) : (
                  <>
                    <Wallet className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    {t.nav.connectWallet}
                  </>
                )}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "zh" : "en")}
                className="rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary text-primary font-medium hidden sm:flex"
              >
                {language === "en" ? "中文" : "English"}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary/10"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          mobileMenuOpen ? "visible" : "invisible",
        )}
        style={{ transition: "visibility 0.4s cubic-bezier(0.65, 0.05, 0.1, 1)" }}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/70 backdrop-blur-sm",
            mobileMenuOpen ? "opacity-100" : "opacity-0",
          )}
          style={{ transition: "opacity 0.4s cubic-bezier(0.65, 0.05, 0.1, 1)" }}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background/98 backdrop-blur-xl border-r border-primary/20 flex flex-col shadow-2xl",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
          style={{ transition: "transform 0.4s cubic-bezier(0.65, 0.05, 0.1, 1)" }}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-primary/20 bg-primary/5">
            <Button variant="ghost" size="icon" onClick={handleNavigation} className="hover:bg-primary/10">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Main Navigation Links */}
            <div>
              <h3 
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2"
                style={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(-10px)",
                  transition: "all 0.35s cubic-bezier(0.65, 0.05, 0.1, 1) 0.1s",
                }}
              >
                {t.nav.navigation}
              </h3>
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavigation}
                    className={cn(
                      "text-sm font-medium px-4 py-3 rounded-lg flex items-center justify-between group",
                      pathname === link.href
                        ? "text-primary bg-primary/15 border border-primary/30 shadow-sm"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/5 border border-transparent",
                    )}
                    style={{
                      opacity: mobileMenuOpen ? 1 : 0,
                      transform: mobileMenuOpen ? "translateY(0)" : "translateY(-10px)",
                      transition: "all 0.35s cubic-bezier(0.65, 0.05, 0.1, 1) 0.1s",
                    }}
                  >
                    <span>{link.label}</span>
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        pathname === link.href ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                      )}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links Section */}
            <div>
              <h3 
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2"
                style={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(-10px)",
                  transition: "all 0.35s cubic-bezier(0.65, 0.05, 0.1, 1) 0.1s",
                }}
              >
                {t.my.quickLinks}
              </h3>
              <div className="flex flex-col gap-1">
                {quickLinks.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-foreground/70 hover:text-primary hover:bg-primary/5 px-4 py-3 rounded-lg flex items-center justify-between group border border-transparent hover:border-primary/20"
                    style={{
                      opacity: mobileMenuOpen ? 1 : 0,
                      transform: mobileMenuOpen ? "translateY(0)" : "translateY(-10px)",
                      transition: "all 0.35s cubic-bezier(0.65, 0.05, 0.1, 1) 0.1s",
                    }}
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile-only actions */}
            <div className="pt-4 border-t border-primary/10 space-y-2">
              {/* Wallet Connection */}
              <Button
                variant={isConnected ? "outline" : "default"}
                onClick={handleWalletAction}
                className={cn(
                  "w-full justify-start text-sm font-medium",
                  isConnected ? "border-primary/30 hover:bg-primary/10" : "bg-primary hover:bg-primary/90",
                )}
                style={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(-10px)",
                  transition: "all 0.35s cubic-bezier(0.65, 0.05, 0.1, 1) 0.1s",
                }}
              >
                {isConnected ? (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    {walletAddress}
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    {t.nav.connectWallet}
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setLanguage(language === "en" ? "zh" : "en")
                }}
                className="w-full justify-start text-sm font-medium border-primary/30 hover:bg-primary/10"
                style={{
                  opacity: mobileMenuOpen ? 1 : 0,
                  transform: mobileMenuOpen ? "translateY(0)" : "translateY(-10px)",
                  transition: "all 0.35s cubic-bezier(0.65, 0.05, 0.1, 1) 0.1s",
                }}
              >
                <Globe className="mr-2 h-4 w-4" />
                {language === "en" ? "语言切换" : "Switch Language"}
              </Button>
            </div>
          </div>

          {/* Menu Footer */}
          <div className="p-6 border-t border-primary/20 bg-primary/5">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </>
  )
}
