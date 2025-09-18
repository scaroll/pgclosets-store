import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./clientLayout"
import PerformanceMonitor from "@/components/performance/performance-monitor"
import { BUSINESS_INFO } from "@/lib/business-config"
import type React from "react"
import { Suspense } from "react"
import Script from "next/script"
// import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/next"

// Optimized font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_INFO.urls.main),
  title: {
    default: `${BUSINESS_INFO.name} | Custom Closets & Storage Solutions in Ottawa`,
    template: `%s | ${BUSINESS_INFO.name}`,
  },
  description:
    "Custom closets, pantries & storage solutions in Ottawa. Professional design & installation by local experts.",
  keywords:
    "custom closets Ottawa, closet design Ottawa, storage solutions Ottawa, pantry organization, garage storage, closet installation, home organization Ottawa, custom storage NCR",
  authors: [{ name: BUSINESS_INFO.name }],
  creator: BUSINESS_INFO.name,
  publisher: BUSINESS_INFO.name,
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: BUSINESS_INFO.name,
    url: BUSINESS_INFO.urls.main,
    title: `${BUSINESS_INFO.name} | Custom Closets & Storage Solutions in Ottawa`,
    description:
      "Custom closets, pantries & storage solutions in Ottawa. Professional design & installation by local experts.",
    locale: "en_CA",
    images: [
      {
        url: BUSINESS_INFO.urls.ogImage,
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} - Custom Storage Solutions Ottawa`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_INFO.name} | Custom Closets & Storage Solutions in Ottawa`,
    description:
      "Custom closets, pantries & storage solutions in Ottawa. Professional design & installation by local experts.",
    images: [BUSINESS_INFO.urls.ogImage],
    creator: "@pgclosets",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GA_ID,
  },
  other: {
    "geo.region": `CA-${BUSINESS_INFO.address.province}`,
    "geo.placename": BUSINESS_INFO.address.city,
    "geo.position": `${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`,
    ICBM: `${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`,
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}

        <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>

        {/* Performance Monitoring */}
        <PerformanceMonitor />

        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  )
}
