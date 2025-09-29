import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/mobile-performance.css";
import "../styles/mobile-touch.css";
import ClientLayout from "./clientLayout";
import PerformanceMonitor from "../components/performance/performance-monitor";
import { BUSINESS_INFO } from "../lib/business-config";
import {
  generateLocalBusinessSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
} from "../lib/seo/local-business-schema";
import type React from "react";
import { Suspense } from "react";
import Script from "next/script";
import { Toaster } from "sonner";
// import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/next"

// Optimized font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

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
  robots:
    "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
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
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate structured data for SEO
  const localBusinessSchema = generateLocalBusinessSchema();
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Local Business Schema for Ottawa market dominance */}
        <Script
          id="local-business-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />

        {/* Website Schema for enhanced search features */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Organization Schema for brand authority */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        {/* SEO Meta Tags for Ottawa Local Search */}
        {/* Essential Mobile Viewport - Optimized for mobile performance */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover, user-scalable=yes"
        />

        {/* Mobile web app meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PG Closets Ottawa" />

        {/* Prevent automatic telephone number detection */}
        <meta name="format-detection" content="telephone=no" />

        {/* Geographic and Local Business Meta */}
        <meta
          name="geo.region"
          content={`CA-${BUSINESS_INFO.address.province}`}
        />
        <meta name="geo.placename" content={BUSINESS_INFO.address.city} />
        <meta
          name="geo.position"
          content={`${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`}
        />
        <meta
          name="ICBM"
          content={`${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`}
        />
        <meta name="distribution" content="local" />
        <meta name="coverage" content="Ottawa, Ontario, Canada" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="MobileOptimized" content="320" />

        {/* Local Business Verification */}
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION}
        />
        <meta
          name="msvalidate.01"
          content={process.env.NEXT_PUBLIC_BING_VERIFICATION}
        />

        {/* Preconnect to important domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.renin.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />

        {/* Canonical URL */}
        <link rel="canonical" href={BUSINESS_INFO.urls.main} />
      </head>
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
                  custom_map: {
                    'custom_dimension_1': 'service_area',
                    'custom_dimension_2': 'product_category'
                  }
                });

                // Track local business events
                gtag('event', 'page_view', {
                  'service_area': '${BUSINESS_INFO.address.city}',
                  'business_type': 'local_business',
                  'product_focus': 'renin_closet_doors'
                });
              `}
            </Script>
          </>
        )}

        {/* Google My Business integration */}
        <Script id="gmb-integration" strategy="afterInteractive">
          {`
            // Google My Business click tracking
            function trackGMBClick(action) {
              if (typeof gtag !== 'undefined') {
                gtag('event', 'gmb_interaction', {
                  'event_category': 'Local Business',
                  'event_label': action,
                  'service_area': '${BUSINESS_INFO.address.city}'
                });
              }
            }
            window.trackGMBClick = trackGMBClick;
          `}
        </Script>

        <Suspense
          fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}
        >
          <ClientLayout>{children}</ClientLayout>
        </Suspense>

        <Toaster richColors />

        {/* Performance Monitoring */}
        <PerformanceMonitor />
        <Suspense fallback={null}>
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </Suspense>
      </body>
    </html>
  );
}
