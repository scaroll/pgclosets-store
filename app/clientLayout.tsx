"use client"
import type React from "react"
import Script from "next/script"
// import { CartDrawer } from "@/components/store/cart-drawer" // Removed - quote-based business
import SkipNavigation from "@/components/navigation/SkipNavigation"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-black">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-8THLNNP89K" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8THLNNP89K');
        `}
      </Script>

      {/* Skip Navigation Link for Accessibility */}
      <SkipNavigation />

      <main id="main-content" role="main" tabIndex={-1}>
        {children}
      </main>

      {/* Cart removed - quote-based business model */}
    </div>
  )
}
