import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { OrganizationJsonLd, LocalBusinessJsonLd } from '@/components/seo/json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://pgclosets.com'),
  title: {
    default: 'PG Closets | Crafted to Close',
    template: '%s | PG Closets',
  },
  description: 'Custom closet doors handcrafted in Ottawa since 2009.',
  keywords: ['closet doors', 'custom doors', 'Ottawa', 'luxury', 'handcrafted'],
  authors: [{ name: 'PG Closets' }],
  creator: 'PG Closets',
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://pgclosets.com',
    siteName: 'PG Closets',
    title: 'PG Closets | Crafted to Close',
    description: 'Custom closet doors handcrafted in Ottawa since 2009.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PG Closets - Crafted to Close',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG Closets | Crafted to Close',
    description: 'Custom closet doors handcrafted in Ottawa since 2009.',
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
}

export const viewport: Viewport = {
  themeColor: '#FAFAFA',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
      </head>
      <body className="min-h-screen bg-[var(--color-surface)] antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
