import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from 'geist/font/sans'
import { Toaster } from "sonner"
import { CartProvider } from "@/components/commerce/cart-context"
import { MedusaCartProvider } from "@/components/medusa/cart-provider"
import { AnalyticsProvider, AnalyticsDebugInfo } from "@/components/analytics/analytics-provider"
import { PG_CLOSETS_TRACKING } from "@/lib/analytics"
import { getCart } from "@/lib/pgclosets"
import { generateOrganizationSchema, generateBaseMetadata } from "@/lib/seo"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { FontPreloader, CriticalCSS } from "@/components/performance/font-optimization"
import "./globals.css"


export const metadata: Metadata = {
  ...generateBaseMetadata({
    title: "PG Closets - Premium Barn Doors & Closet Systems Ottawa | Authorized Renin Dealer",
    description: "Transform your Ottawa home with premium barn doors and closet systems. Authorized Renin dealer offering professional installation, custom solutions, and quality craftsmanship. Free consultation available."
  }),
  keywords: [
    'barn doors Ottawa',
    'closet systems Ottawa',
    'Renin dealer Ottawa',
    'custom barn doors',
    'sliding barn doors',
    'closet installation Ottawa',
    'home renovation Ottawa',
    'interior doors Ottawa',
    'barn door hardware',
    'closet organization'
  ],
  authors: [{ name: 'PG Closets' }],
  creator: 'PG Closets',
  publisher: 'PG Closets',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://paddle-payments-nl5k9vde7-peoples-group.vercel.app'),
  generator: 'Next.js'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Initialize cart for enhanced commerce features
  const cart = getCart()

  return (
    <html lang="en" className={GeistSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema())
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />
        <link rel="preconnect" href="https://images.renin.ca" />
        <link rel="dns-prefetch" href="//paddle.js.com" />
        <CriticalCSS />
      </head>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <FontPreloader />
        <AnalyticsProvider 
          measurementId={PG_CLOSETS_TRACKING.MEASUREMENT_ID}
          enableCookieConsent={true}
          companyName={PG_CLOSETS_TRACKING.COMPANY_NAME}
          privacyPolicyUrl="/privacy"
          debug={process.env.NODE_ENV === 'development'}
        >
          <CartProvider cartPromise={cart}>
            <MedusaCartProvider>
              {children}
              <Toaster position="bottom-right" closeButton />
              <AnalyticsDebugInfo />
            </MedusaCartProvider>
          </CartProvider>
        </AnalyticsProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}