"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { useTheme } from "@/hooks/use-theme"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-gold/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full overflow-hidden group-hover:scale-110 transition-transform">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <span className="text-xl text-gold bg-clip-text">
                CasE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-gold relative group",
                    pathname === link.href ? "text-gold" : "text-foreground/70",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-gold transition-all",
                      pathname === link.href ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-gold/10">
                {theme === "dark" ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5 text-gold" />}
              </Button>

              {/* Language Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "zh" : "en")}
                className="rounded-full border-gold/30 hover:bg-gold/10 hover:border-gold text-gold font-medium"
              >
                {language === "en" ? "中文" : "English"}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
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
          "fixed inset-0 z-40 md:hidden transition-all duration-300",
          mobileMenuOpen ? "visible" : "invisible",
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
            mobileMenuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-gold/20 transition-transform duration-300 flex flex-col",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gold/20">
            <Link href="/" className="flex items-center gap-3" onClick={handleNavigation}>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-gold to-gold/60 bg-clip-text text-transparent">
                CasE
              </span>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleNavigation}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Menu Links */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavigation}
                  className={cn(
                    "text-base font-medium transition-colors px-4 py-3 rounded-lg",
                    pathname === link.href
                      ? "text-gold bg-gold/10 border border-gold/20"
                      : "text-foreground/70 hover:text-gold hover:bg-gold/5",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Menu Footer */}
          <div className="p-6 border-t border-gold/20">
            <p className="text-xs text-muted-foreground text-center">{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </>
  )
}
