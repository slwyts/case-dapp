"use client"

import type React from "react"
import { LanguageProvider } from "@/hooks/use-language"
import { ThemeProvider } from "@/hooks/use-theme"
import { WalletProvider } from "@/hooks/use-wallet"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <WalletProvider>
          {children}
          <Toaster position="top-center" closeButton />
        </WalletProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
