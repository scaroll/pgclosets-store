import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./clientLayout"
import type React from "react"
import { Suspense } from "react"
import Script from "next/script"
// import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pgclosets.com"),
  title: {
    default: "PG Closets | Custom Closets & Storage Solutions in Ottawa",
    template: "%s | PG Closets",
  },
  description:
    "Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts. Request your free quote today.",
  keywords:
    "custom closets Ottawa, closet design Ottawa, storage solutions Ottawa, pantry organization, garage storage, closet installation, home organization Ottawa, custom storage NCR",
  authors: [{ name: "PG Closets" }],
  creator: "PG Closets",
  publisher: "PG Closets",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "PG Closets",
    url: "https://www.pgclosets.com",
    title: "PG Closets | Custom Closets & Storage Solutions in Ottawa",
    description:
      "Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts.",
    locale: "en_CA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PG Closets - Custom Storage Solutions Ottawa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PG Closets | Custom Closets & Storage Solutions in Ottawa",
    description:
      "Custom closets, pantries, and storage solutions in Ottawa and the NCR. Professional design, installation, and service by local experts.",
    images: ["/og-image.jpg"],
    creator: "@pgclosets",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GA_ID,
  },
  other: {
    "geo.region": "CA-ON",
    "geo.placename": "Ottawa",
    "geo.position": "45.4215;-75.6972",
    ICBM: "45.4215, -75.6972",
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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

        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  )
}
