"use client"

import type React from "react"

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="page-enter"
      style={{ animationTimingFunction: "cubic-bezier(0.65, 0.05, 0.1, 1)" }}
    >
      {children}
    </div>
  )
}
