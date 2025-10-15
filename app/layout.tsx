import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
// CSS Loading Order (Agent 3 Strategy): OnceUI → Apple → Custom
import "@once-ui-system/core/css/tokens.css";
import "@once-ui-system/core/css/styles.css";
// Apple Design System - 50 Agent Upgrade (loads after OnceUI for cascade priority)
import "../styles/apple-typography.css";
import "../styles/apple-colors.css";
import "../styles/apple-spacing.css";
import "../styles/apple-glass.css";
import "../styles/apple-polish.css";
// PG Closets Custom Styles
import "./globals-unified.css";
import "../styles/mobile-performance.css";
import "../styles/mobile-touch.css";
import "../styles/mobile-enhancements.css";
import ClientLayout from "./clientLayout";
import { OnceUIProviders } from "./providers";
import PerformanceMonitor from "../components/performance/performance-monitor";
import { BUSINESS_INFO } from "../lib/business-config";
import {
  generateLocalBusinessSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
} from "../lib/seo/local-business-schema";
import { Suspense } from "react";
import Script from "next/script";
import { Toaster } from "sonner";
import { ValuePropBanner } from "../components/conversion/ValuePropBanner";
import { MobileStickyCTA } from "../components/conversion/MobileStickyCTA";
import { StickyMobileBar } from "../components/navigation/StickyMobileBar";
import { VercelToolbarWrapper } from "../components/VercelToolbar";
import { CoreWebVitalsTracker } from "../components/analytics/CoreWebVitalsTracker";
// import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/next"

// Optimized font loading - Premium pairing for luxury aesthetic
// Inter: Clean, modern body text with variable font support
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  fallback: ["system-ui", "arial"],
});

// Cormorant Garamond: Elegant display font for headings
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PG Closets Ottawa",
  },
  formatDetection: {
    telephone: false,
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION || "",
    },
  },
  other: {
    "geo.region": `CA-${BUSINESS_INFO.address.province}`,
    "geo.placename": BUSINESS_INFO.address.city,
    "geo.position": `${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`,
    ICBM: `${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`,
    distribution: "local",
    coverage: "Ottawa, Ontario, Canada",
    target: "all",
    HandheldFriendly: "True",
    MobileOptimized: "320",
    "mobile-web-app-capable": "yes",
  },
  icons: {
    other: [
      {
        rel: "preload",
        url: "/images/elegant-barn-door-closet.png",
        // @ts-ignore
        as: "image",
        fetchpriority: "high",
      },
      {
        rel: "preconnect",
        url: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        url: "https://fonts.gstatic.com",
        // @ts-ignore
        crossOrigin: "anonymous",
      },
      {
        rel: "preconnect",
        url: "https://www.google-analytics.com",
      },
      {
        rel: "preconnect",
        url: "https://www.googletagmanager.com",
      },
      {
        rel: "dns-prefetch",
        url: "https://www.renin.com",
      },
      {
        rel: "dns-prefetch",
        url: "https://images.unsplash.com",
      },
      {
        rel: "dns-prefetch",
        url: "https://cdn.renin.com",
      },
      {
        rel: "dns-prefetch",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
};

// Next.js 15: Viewport metadata must be exported as a separate function
export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  };
}

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
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className={inter.className} suppressHydrationWarning>
        <OnceUIProviders>
          {/* Value Proposition Banner - Trust Signals */}
          <ValuePropBanner />
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

          {/* Enhanced Mobile Sticky Bar - Primary CTA */}
          <StickyMobileBar />

          {/* Legacy Mobile Sticky CTA - Keep for backward compatibility */}
          <div className="hidden">
            <MobileStickyCTA />
          </div>

          {/* Performance Monitoring */}
          <PerformanceMonitor />

          {/* Core Web Vitals Tracking - Phase 6 */}
          <CoreWebVitalsTracker />

          <Suspense fallback={null}>
            {/* <Analytics /> */}
            {/* <SpeedInsights /> */}
          </Suspense>

          {/* Vercel Toolbar for visual inspection */}
          <VercelToolbarWrapper />
        </OnceUIProviders>
      </body>
    </html>
  );
}
