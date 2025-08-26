"use client"
import type React from "react"
import { useEffect } from "react"
import Script from "next/script"
import { AuthProvider } from "@/contexts/AuthContext"
import { reportWebVitals } from "@/lib/web-vitals"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Web Vitals reporting for Core Web Vitals monitoring
    reportWebVitals()
  }, [])

  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}
