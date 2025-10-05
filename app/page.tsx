import type { Metadata } from 'next'
import HomePage from "./HomePage"

export const metadata: Metadata = {
  title: 'PG Closets | Elevated Taste Without Pretense | Ottawa\'s Premium Closet Doors',
  description: 'Transform your Ottawa home with sophisticated closet door solutions. Official Renin dealer offering curated collections, professional installation, and lifetime warranty. Elevated taste without pretense.',
  keywords: 'luxury closet doors Ottawa, Renin dealer, premium storage solutions, elevated home design, sophisticated interiors, Ottawa home renovation',
  openGraph: {
    title: 'PG Closets | Elevated Taste Without Pretense',
    description: 'Transform your Ottawa home with sophisticated closet door solutions. Official Renin dealer offering curated collections and professional installation.',
    url: 'https://www.pgclosets.com',
    siteName: 'PG Closets',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PG Closets - Elevated Taste Without Pretense'
      }
    ],
    locale: 'en_CA',
    type: 'website',
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
  alternates: {
    canonical: '/'
  },
  twitter: {
    title: 'PG Closets | Elevated Taste Without Pretense',
    card: 'summary_large_image',
    description: 'Transform your Ottawa home with sophisticated closet door solutions.',
    images: ['/og-image.jpg'],
  }
}

export default function Home() {
  return <HomePage />
}