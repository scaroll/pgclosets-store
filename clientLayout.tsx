"use client"
import type React from "react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-gray-900">
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
    </div>
  )
}
