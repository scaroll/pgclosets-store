"use client"
import type React from "react"
import Script from "next/script"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-gray-900">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-8THLNNP89K" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-8THLNNP89K');
        `}
      </Script>

      {children}
    </div>
  )
}
