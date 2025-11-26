import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pgclosets.com'),
  title: {
    default: 'PG Closets | Premium Closet Doors & Storage Solutions | Ottawa',
    template: '%s | PG Closets',
  },
  description: 'Transform your home with premium closet doors and storage solutions. Official Renin dealer serving Ottawa with expert installation and lifetime warranty.',
  keywords: ['closet doors', 'barn doors', 'bifold doors', 'Ottawa', 'Renin dealer', 'custom closets', 'storage solutions', 'bypass doors', 'pivot doors', 'sliding doors', 'closet organizers', 'home organization'],
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
    title: 'PG Closets | Premium Closet Doors & Storage Solutions',
    description: 'Transform your home with premium closet doors. Official Renin dealer in Ottawa.',
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
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, var(--font-inter), sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  )
}
