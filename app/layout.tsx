import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Open_Sans } from "next/font/google"
import { Toaster } from "sonner"
import { CartProvider } from "@/hooks/use-cart"
import { AnalyticsProvider, AnalyticsDebugInfo } from "@/components/analytics/analytics-provider"
import { PG_CLOSETS_TRACKING } from "@/lib/analytics"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "PG Closets - Premium Closet Systems & Barn Doors",
  description:
    "Transform your space with premium closet systems and barn doors. Quality craftsmanship for discerning homeowners.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${openSans.style.fontFamily};
  --font-heading: ${montserrat.variable};
  --font-body: ${openSans.variable};
}
        `}</style>
      </head>
      <body className="font-sans antialiased">
        <AnalyticsProvider 
          measurementId={PG_CLOSETS_TRACKING.MEASUREMENT_ID}
          enableCookieConsent={true}
          companyName={PG_CLOSETS_TRACKING.COMPANY_NAME}
          privacyPolicyUrl="/privacy"
          debug={process.env.NODE_ENV === 'development'}
        >
          <CartProvider>
            {children}
            <Toaster position="bottom-right" closeButton />
            <AnalyticsDebugInfo />
          </CartProvider>
        </AnalyticsProvider>
      </body>
    </html>
  )
}