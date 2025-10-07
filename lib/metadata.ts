/**
 * SEO Metadata Helper Functions
 * Generates consistent, optimized metadata for all page types
 */

import { Metadata } from 'next'
import { BUSINESS_INFO } from './business-config'

const SITE_NAME = 'PG Closets'
const CANONICAL_URL = 'https://www.pgclosets.com'
const DEFAULT_OG_IMAGE = `${CANONICAL_URL}/og-image.png`

// Base metadata used across all pages
const baseMetadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  alternates: {
    canonical: CANONICAL_URL,
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

/**
 * Generate metadata for homepage
 */
export function generateHomeMetadata(): Metadata {
  const title = 'Custom Closet Doors & Storage Solutions Ottawa | PG Closets'
  const description = 'Transform your space with premium closet doors and storage solutions. Official Renin dealer serving Ottawa, Kanata, Barrhaven. Professional installation, 2-week delivery.'

  return {
    ...baseMetadata,
    title,
    description,
    keywords: [
      'closet doors Ottawa',
      'custom closet doors',
      'Renin closet doors',
      'closet installation Ottawa',
      'bypass closet doors',
      'bifold doors',
      'barn doors Ottawa',
      'storage solutions Ottawa',
      'closet organizers',
      'Ottawa closets',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url: CANONICAL_URL,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'PG Closets - Custom Closet Doors Ottawa',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

/**
 * Generate metadata for products hub page
 */
export function generateProductsHubMetadata(): Metadata {
  const title = 'Premium Closet Doors - Bypass, Bifold, Barn & More | PG Closets'
  const description = 'Explore our complete range of premium closet doors. Bypass, bifold, barn, pivot, and swing doors. Official Renin dealer with professional installation across Ottawa.'
  const url = `${CANONICAL_URL}/products`

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      'closet doors',
      'bypass doors',
      'bifold doors',
      'barn doors',
      'pivot doors',
      'swing doors',
      'Renin doors',
      'custom closet doors',
      'Ottawa closet doors',
      'door installation',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Premium Closet Doors Collection - PG Closets',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

/**
 * Generate metadata for product category pages
 */
export function generateCategoryMetadata(category: string): Metadata {
  const categoryTitles: Record<string, string> = {
    bypass: 'Bypass Closet Doors',
    bifold: 'Bifold Closet Doors',
    pivot: 'Pivot Doors',
    swing: 'Swing Doors',
    'barn-sliding': 'Barn & Sliding Doors',
    'room-dividers': 'Room Dividers',
  }

  const categoryDescriptions: Record<string, string> = {
    bypass: 'Space-saving bypass closet doors with smooth gliding track systems. Perfect for closets and wardrobes in Ottawa homes.',
    bifold: 'Classic bifold closet doors that maximize accessibility. Professional installation across Ottawa and surrounding areas.',
    pivot: 'Modern pivot doors that make a statement. Custom sizes and finishes available with expert installation.',
    swing: 'Traditional swing doors for closets and rooms. Quality craftsmanship with professional installation guaranteed.',
    'barn-sliding': 'Rustic barn and modern sliding doors. Transform any space with our premium door systems and hardware.',
    'room-dividers': 'Versatile room dividers and partition solutions. Create functional spaces with style and elegance.',
  }

  const title = `${categoryTitles[category] || category} Ottawa | PG Closets`
  const description = categoryDescriptions[category] || `Explore our ${category} collection with professional installation across Ottawa.`
  const url = `${CANONICAL_URL}/products/${category}`

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      `${category} doors`,
      `${category} closet doors Ottawa`,
      'custom closet doors',
      'Renin doors',
      'door installation Ottawa',
      'closet door replacement',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${categoryTitles[category]} - PG Closets Ottawa`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

/**
 * Generate metadata for product detail pages
 */
export function generateProductMetadata(product: {
  name: string
  description: string
  category: string
  slug: string
  image?: string
}): Metadata {
  const title = `${product.name} | Custom Closet Doors Ottawa`
  const description = product.description.slice(0, 160) || `${product.name} - Premium closet door with professional installation across Ottawa. Official Renin dealer.`
  const url = `${CANONICAL_URL}/products/${product.category}/${product.slug}`
  const image = product.image || DEFAULT_OG_IMAGE

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      product.name,
      'closet door',
      product.category,
      'Renin',
      'Ottawa',
      'custom doors',
      'door installation',
    ],
    openGraph: {
      type: 'product',
      locale: 'en_CA',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

/**
 * Generate metadata for location pages
 */
export function generateLocationMetadata(location: string): Metadata {
  const title = `${location} Custom Closet Doors | PG Closets`
  const description = `Professional closet door installation serving ${location}. Custom bypass, bifold, barn and pivot doors. Official Renin dealer with 2-week delivery and lifetime warranty.`
  const url = `${CANONICAL_URL}/locations/${location.toLowerCase()}`

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      `closet doors ${location}`,
      `${location} closet installation`,
      `custom closets ${location}`,
      'Renin dealer',
      'door installation',
      'closet organizers',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `PG Closets serving ${location}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

/**
 * Generate metadata for FAQ page
 */
export function generateFAQMetadata(): Metadata {
  const title = 'Frequently Asked Questions | PG Closets'
  const description = 'Find answers to common questions about closet doors, installation, pricing, and our services. Expert advice from Ottawa\'s trusted closet door specialists.'
  const url = `${CANONICAL_URL}/faq`

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      'closet door FAQ',
      'installation questions',
      'closet door pricing',
      'Renin warranty',
      'Ottawa closets',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'PG Closets FAQ',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

/**
 * Generate metadata for contact page
 */
export function generateContactMetadata(): Metadata {
  const title = 'Contact Us - Ottawa Closet Door Specialists | PG Closets'
  const description = 'Get in touch for a free consultation. Professional closet door installation serving Ottawa and surrounding areas. Email info@pgclosets.ca or request a quote online.'
  const url = `${CANONICAL_URL}/contact`

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      'contact PG Closets',
      'Ottawa closet doors',
      'free quote',
      'closet consultation',
      'door installation Ottawa',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Contact PG Closets Ottawa',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

/**
 * Generate metadata for installation service page
 */
export function generateInstallationMetadata(): Metadata {
  const title = 'Professional Closet Door Installation Ottawa | PG Closets'
  const description = 'Expert closet door installation across Ottawa. Certified installers, 2-week delivery, lifetime warranty. Transform your space with professional service you can trust.'
  const url = `${CANONICAL_URL}/services/installation`

  return {
    ...baseMetadata,
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: [
      'closet door installation Ottawa',
      'professional installation',
      'door installer',
      'closet installation service',
      'Ottawa installers',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: 'Professional Installation - PG Closets',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

/**
 * Generate canonical URL for any page
 */
export function generateCanonicalUrl(path: string): string {
  // Remove trailing slash except for root
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '')
  return `${CANONICAL_URL}${cleanPath}`
}
