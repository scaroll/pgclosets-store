import type { Metadata } from 'next'
import './globals.css'
import '@/styles/apple-glass.css'
import '@/styles/mobile-optimizations.css'
import '@/styles/performance-optimizations.css'
import { Inter, Playfair_Display } from 'next/font/google'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/ScrollProgress'
import { PerformanceOptimizer } from '@/components/performance/PerformanceOptimizer'
import { CoreWebVitalsOptimizer, PerformanceUtilities } from '@/components/performance/CoreWebVitalsOptimizer'
import Script from 'next/script'
// import { StructuredData } from '@/components/StructuredData'
import { BUSINESS_INFO } from '@/lib/business-config'
import Analytics from '@/app/components/Analytics'
import { Toaster } from 'sonner'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/comprehensive-schema'
import LiveChatWidget from '@/components/chat/LiveChatWidget'
import AbandonedCartRecovery from '@/components/marketing/AbandonedCartRecovery'
import LimitedTimeOffer from '@/components/marketing/LimitedTimeOffer'
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider'
import AccessibilityTesting from '@/components/accessibility/AccessibilityTesting'
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls'

// Font optimization with preloading and display swap
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-body',
  display: 'swap',
  preload: false,
  weight: ['400', '500', '600', '700'],
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-display',
  display: 'swap',
  preload: false,
  weight: ['400', '700'],
  adjustFontFallback: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS_INFO.urls.main),
  alternates: {
    canonical: '/',
  },
  title: {
    default: `${BUSINESS_INFO.name} | Custom Closets & Storage Solutions in Ottawa`,
    template: `%s | ${BUSINESS_INFO.name}`
  },
  description: 'Premium custom closets, pantries & storage solutions in Ottawa. Professional design & installation by local experts. Renin authorized dealer.',
  keywords: [
    // Primary keywords
    'custom closets Ottawa',
    'closet design Ottawa',
    'storage solutions Ottawa',
    // Secondary keywords
    'pantry organization Ottawa',
    'garage storage Ottawa',
    'closet installation Ottawa',
    'home organization Ottawa',
    'custom storage NCR',
    // Long-tail keywords
    'Renin closet doors Ottawa',
    'custom pantry shelving Ottawa',
    'walk-in closet design Ottawa',
    'closet organization systems',
    // Additional context
    'closet renovation Ottawa',
    'storage specialists Ottawa',
    'custom cabinetry Ottawa',
    'home improvement Ottawa',
  ],
  authors: [{ name: BUSINESS_INFO.name, url: BUSINESS_INFO.urls.main }],
  creator: BUSINESS_INFO.name,
  publisher: BUSINESS_INFO.name,
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: BUSINESS_INFO.urls.main,
    siteName: `${BUSINESS_INFO.name} - Custom Storage Solutions Ottawa`,
    title: `${BUSINESS_INFO.name} | Premium Custom Closets & Storage in Ottawa`,
    description: 'Transform your space with premium custom closets and storage solutions. Professional design & installation in Ottawa. Renin authorized dealer.',
    images: [
      {
        url: BUSINESS_INFO.urls.ogImage,
        width: 1200,
        height: 630,
        alt: `${BUSINESS_INFO.name} - Premium Custom Storage Solutions Ottawa`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BUSINESS_INFO.name} | Custom Closets & Storage Ottawa`,
    description: 'Premium custom closets and storage solutions in Ottawa. Professional design & installation.',
    images: [BUSINESS_INFO.urls.ogImage],
    creator: '@pgclosets',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Performance optimization metadata
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'geo.region': `CA-${BUSINESS_INFO.address.province}`,
    'geo.placename': BUSINESS_INFO.address.city,
    'geo.position': `${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`,
    ICBM: `${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const shouldInjectToolbar =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_TOOLBAR === '1'

  // Generate sitewide schemas
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebSiteSchema()
  const graphSchema = {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema, websiteSchema]
  }

  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Mobile Viewport Configuration - Critical for mobile UX */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, viewport-fit=cover" />

        {/* Critical Resource Hints - Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.renin.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://hebbkx1anhila5yf.public.blob.vercel-storage.com" />

        {/* Preload critical assets - Hero image optimized */}
        <link
          rel="preload"
          as="image"
          href="/images/optimized/elegant-barn-door-closet/mobile.webp"
          type="image/webp"
          // @ts-ignore - Next.js supports this
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/optimized/elegant-barn-door-closet/tablet.webp"
          type="image/webp"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/optimized/elegant-barn-door-closet/desktop.webp"
          type="image/webp"
          media="(min-width: 1024px)"
          fetchPriority="high"
        />

        {/* Inline critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS - Inlined for immediate rendering */
            body{margin:0;padding:0;background:#F9FAFB;font-family:Inter,system-ui,-apple-system,sans-serif;line-height:1.6}
            .dark body{background:#1a1a1a}
            *{box-sizing:border-box}
            /* Critical layout styles */
            .min-h-screen{min-height:100vh}
            .container{width:100%;max-width:1200px;margin:0 auto;padding:0 1rem}
            /* Loading prevention */
            img{max-width:100%;height:auto}
            /* Font loading optimization */
            .font-sans-body{font-family:Inter,system-ui,-apple-system,sans-serif}
            .font-serif-display{font-family:Playfair Display,Georgia,serif}
            /* Performance optimizations */
            .will-change-transform{will-change:transform}
            .contain-layout{contain:layout}
            @media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
          `
        }} />

        {/* Global Structured Data for SEO - Organization and Website schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graphSchema) }}
        />
      </head>
      <body className="antialiased font-sans-body">
        {/* Performance optimization components */}
        <PerformanceUtilities />
        <CoreWebVitalsOptimizer
          enableMonitoring={process.env.NODE_ENV === 'production'}
          reportingEndpoint="/api/analytics/web-vitals"
        />

        <AccessibilityProvider>
          <PerformanceOptimizer
            enableMonitoring={process.env.NODE_ENV === 'production'}
            enablePreloading={true}
            enablePrefetching={true}
          >
            {/* Enhanced skip links for keyboard navigation */}
            <nav aria-label="Skip navigation" className="fixed top-4 left-4 z-[100] space-y-2">
              <a
                href="#main-content"
                className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Skip to main content
              </a>
              <a
                href="#navigation"
                className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-12 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Skip to navigation
              </a>
              <a
                href="#footer"
                className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Skip to footer
              </a>
            </nav>

            <AccessibilityControls />
            <ScrollProgress />
            <div id="navigation">
              <Navigation />
            </div>

            <main id="main-content" className="min-h-screen contain-layout" tabIndex={-1} role="main" aria-label="Main content">
              {children}
            </main>

            <footer id="footer" role="contentinfo">
              <Footer />
            </footer>

        {/* Premium E-commerce Features */}
        <LimitedTimeOffer />
        <AbandonedCartRecovery />
        <LiveChatWidget />

        {/* Accessibility Testing Component - Development only */}
        {process.env.NODE_ENV === 'development' && <AccessibilityTesting />}

        {/* Analytics Component - Handles GA and Vercel Analytics */}
        <Analytics />

        {/* Toaster for notifications */}
        <Toaster
          position="top-right"
          expand={false}
          richColors
          closeButton
          important
        />

          {/* Google Analytics */}
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
                    'product_focus': 'custom_closets_storage'
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

          {/* Web Vitals tracking - load after page interactive */}
          <Script
            id="web-vitals"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if('PerformanceObserver' in window){
                  const observer=new PerformanceObserver(list=>{
                    list.getEntries().forEach(entry=>{
                      if(entry.name==='first-contentful-paint'){
                        console.log('FCP:',entry.startTime);
                      }
                      if(entry.entryType==='largest-contentful-paint'){
                        console.log('LCP:',entry.startTime);
                      }
                    });
                  });
                  observer.observe({entryTypes:['paint','largest-contentful-paint']});
                }
              `
            }}
          />

          {/* Accessibility enhancements */}
          <Script id="accessibility-enhancements" strategy="afterInteractive">
            {`
              // Enhanced keyboard navigation
              document.addEventListener('keydown', function(e) {
                // Alt + S: Skip to main content
                if (e.altKey && e.key === 's') {
                  e.preventDefault();
                  const main = document.getElementById('main-content');
                  if (main) {
                    main.focus();
                    main.scrollIntoView({ behavior: 'smooth' });
                  }
                }

                // Alt + N: Skip to navigation
                if (e.altKey && e.key === 'n') {
                  e.preventDefault();
                  const nav = document.getElementById('navigation');
                  if (nav) {
                    nav.focus();
                    nav.scrollIntoView({ behavior: 'smooth' });
                  }
                }

                // Alt + F: Skip to search
                if (e.altKey && e.key === 'f') {
                  e.preventDefault();
                  const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
                  if (searchInput) {
                    searchInput.focus();
                    searchInput.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              });

              // Detect keyboard-only navigation
              let keyboardNavigation = false;
              document.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                  keyboardNavigation = true;
                  document.body.classList.add('keyboard-navigation');
                }
              });

              document.addEventListener('mousedown', function() {
                keyboardNavigation = false;
                document.body.classList.remove('keyboard-navigation');
              });

              // Focus trap for modals
              function createFocusTrap(container) {
                const focusableElements = container.querySelectorAll(
                  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                container.addEventListener('keydown', function(e) {
                  if (e.key === 'Tab') {
                    if (e.shiftKey) {
                      if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                      }
                    } else {
                      if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                      }
                    }
                  }
                });

                // Apply to existing modals
                document.querySelectorAll('[role="dialog"]').forEach(createFocusTrap);
              });
            `}
          </Script>

          {shouldInjectToolbar && (
            <Script
              id="vercel-toolbar"
              src="https://vercel.live/toolbar"
              strategy="afterInteractive"
            />
          )}
        </PerformanceOptimizer>
      </AccessibilityProvider>
      </body>
    </html>
  )
}
