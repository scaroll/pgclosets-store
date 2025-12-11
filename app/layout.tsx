import type { Metadata } from 'next'
import { SessionProvider } from '@/components/auth/session-provider'
import { ThemeProvider } from '@/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema'
import { GoogleAnalytics } from '@/analytics/google-analytics'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgclosets.com'),
  title: {
    default: 'PG Closets | Premium Closet Doors Ottawa | Official Renin Dealer',
    template: '%s | PG Closets Ottawa',
  },
  description:
    "Ottawa's premier closet door specialists. Official Renin dealer offering barn doors, bypass doors, bifold doors & professional installation. Free consultations.",
  keywords: [
    'closet doors Ottawa',
    'barn doors Ottawa',
    'Renin dealer Ottawa',
    'bypass closet doors',
    'bifold doors Ottawa',
    'closet door installation Ottawa',
    'sliding closet doors',
    'custom closet doors Ontario',
    'Ottawa closet solutions',
    'Kanata closet doors',
    'Barrhaven closet doors',
  ],
  authors: [{ name: 'PG Closets' }],
  creator: 'PG Closets',
  publisher: 'PG Closets',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://www.pgclosets.com',
    siteName: 'PG Closets',
    title: 'PG Closets | Premium Closet Doors Ottawa | Official Renin Dealer',
    description:
      "Ottawa's premier closet door specialists. Official Renin dealer offering barn doors, bypass doors, bifold doors & professional installation.",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PG Closets - Premium Closet Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG Closets | Premium Closet Doors',
    description: 'Transform your home with premium closet doors.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <OrganizationSchema />
        <LocalBusinessSchema />
      </head>
      <body
        className="font-sans antialiased"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>

        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  )
}
