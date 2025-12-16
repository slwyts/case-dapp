"use client"

import { useLanguage } from "@/hooks/use-language"
import { usePathname } from "next/navigation"

export function Footer() {
  const { t } = useLanguage()
  const pathname = usePathname()

  if (pathname !== "/") {
    return null
  }

  return (
    <footer className="bg-muted/50 backdrop-blur-xl border-t border-gold/20 mt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          <div>
            <h3 className="text-gold font-semibold mb-3">{t.footer.disclaimer}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">{t.footer.disclaimerText}</p>
          </div>
          <div className="pt-6 border-t border-gold/20">
            <p className="text-sm text-muted-foreground text-center">{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
