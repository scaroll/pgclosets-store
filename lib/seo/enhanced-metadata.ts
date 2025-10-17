/**
 * AGENTS 36-40: Enhanced Dynamic Metadata Generation
 * Advanced metadata generation with full SEO capabilities
 */

import type { Metadata } from 'next'
import { BUSINESS_INFO } from '../business-config'

export interface EnhancedMetadataOptions {
  title?: string
  description?: string
  keywords?: string[]
  openGraph?: {
    title?: string
    description?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
      secureUrl?: string
    }>
    videos?: Array<{
      url: string
      width?: number
      height?: number
      secureUrl?: string
      type?: string
    }>
    audio?: Array<{
      url: string
      secureUrl?: string
      type?: string
    }>
    type?: 'website' | 'article' | 'book' | 'profile' | 'product' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station'
    locale?: string
    alternateLocale?: string[]
    siteName?: string
    determiner?: 'a' | 'an' | 'the' | 'auto' | ''
    publishedTime?: string
    modifiedTime?: string
    expirationTime?: string
    authors?: string[]
    section?: string
    tags?: string[]
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player'
    site?: string
    siteId?: string
    creator?: string
    creatorId?: string
    title?: string
    description?: string
    images?: Array<{
      url: string
      alt?: string
    }>
    app?: {
      id: {
        iphone?: string
        ipad?: string
        googleplay?: string
      }
      url?: {
        iphone?: string
        ipad?: string
        googleplay?: string
      }
    }
    player?: {
      url: string
      width?: number
      height?: number
      stream?: string
    }
  }
  robots?: {
    index?: boolean
    follow?: boolean
    nocache?: boolean
    noarchive?: boolean
    nositelinkssearchbox?: boolean
    nosnippet?: boolean
    noimageindex?: boolean
    noyaca?: boolean
    notranslate?: boolean
    unavailable_after?: string
    googleBot?: {
      index?: boolean
      follow?: boolean
      noimageindex?: boolean
      'max-video-preview'?: number | string
      'max-image-preview'?: 'none' | 'standard' | 'large'
      'max-snippet'?: number
    }
  }
  alternates?: {
    canonical?: string
    languages?: {
      [lang: string]: string | Array<{ url: string; title?: string }>
    }
    media?: {
      [media: string]: string | Array<{ url: string; title?: string }>
    }
    types?: {
      [type: string]: string | Array<{ url: string; title?: string }>
    }
  }
  verification?: {
    google?: string | string[]
    yandex?: string | string[]
    yahoo?: string | string[]
    bing?: string | string[]
    baidu?: string | string[]
    facebook?: string | string[]
    twitter?: string | string[]
    other?: {
      [name: string]: string | string[]
    }
  }
  applicationName?: string
  referrer?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url'
  viewport?: string | {
    width?: string | number
    height?: string | number
    initialScale?: number
    maximumScale?: number
    minimumScale?: number
    userScalable?: 'yes' | 'no'
    viewportFit?: 'auto' | 'contain' | 'cover'
  }
  themeColor?: string | Array<{
    media?: string
    color: string
  }>
  colorScheme?: 'normal' | 'light' | 'dark' | 'light dark' | 'dark light' | 'only light' | 'only dark'
  category?: string
  classification?: string
  bookmarks?: string | string[]
  generator?: string
  abstract?: string
  archives?: string | string[]
  assets?: string | string[]
  appleWebApp?: {
    capable?: boolean
    title?: string
    statusBarStyle?: 'default' | 'black' | 'black-translucent'
    startupImage?: string | Array<{
      url: string
      media?: string
    }>
  }
  formatDetection?: {
    email?: boolean
    address?: boolean
    telephone?: boolean
  }
  itunes?: {
    app?: {
      appId: string
      appArgument?: string
      affiliateData?: string
    }
  }
  appLinks?: {
    ios?: {
      url?: string
      app_store_id?: string
      app_name?: string
    }
    android?: {
      url?: string
      package?: string
      app_name?: string
    }
    web?: {
      url?: string
      should_fallback?: boolean
    }
  }
  other?: {
    [name: string]: string | number | Array<string | number>
  }
}

/**
 * Generate comprehensive base metadata for all pages
 */
export function generateEnhancedBaseMetadata(): Metadata {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${BUSINESS_INFO.name} - ${BUSINESS_INFO.tagline} | Premium Closet Solutions Ottawa`,
      template: `%s | ${BUSINESS_INFO.name} Ottawa`
    },
    description: 'Premium closet doors and custom storage solutions in Ottawa. Official Renin dealer offering professional installation, lifetime warranty, and 2-week delivery. Transform your space with quality closet systems.',
    keywords: [
      'closet doors ottawa',
      'renin dealer ottawa',
      'custom closets ottawa',
      'barn doors ottawa',
      'bifold doors ottawa',
      'bypass doors ottawa',
      'closet installation ottawa',
      'storage solutions ottawa',
      'closet organizers ottawa',
      'wardrobe doors ottawa',
      'sliding closet doors',
      'mirror closet doors',
      'french closet doors',
      'pivot closet doors',
      'closet systems ottawa',
      'pantry organization ottawa',
      'home organization ottawa',
      'interior doors ottawa',
      'room dividers ottawa',
      'custom millwork ottawa'
    ],
    authors: [
      { name: BUSINESS_INFO.name, url: baseUrl },
      { name: 'PG Closets Team', url: `${baseUrl}/about` }
    ],
    creator: BUSINESS_INFO.name,
    publisher: BUSINESS_INFO.name,
    generator: 'Next.js',
    applicationName: BUSINESS_INFO.name,
    referrer: 'origin-when-cross-origin',
    formatDetection: {
      email: false,
      address: false,
      telephone: false
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
      userScalable: 'yes',
      viewportFit: 'cover'
    },
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#1e293b' }
    ],
    colorScheme: 'light dark',
    openGraph: {
      type: 'website',
      locale: 'en_CA',
      alternateLocale: ['fr_CA'],
      url: baseUrl,
      siteName: BUSINESS_INFO.name,
      title: `${BUSINESS_INFO.name} - ${BUSINESS_INFO.tagline}`,
      description: 'Premium closet doors and custom storage solutions in Ottawa. Official Renin dealer.',
      determiner: '',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${BUSINESS_INFO.name} - Premium Closet Solutions`,
          secureUrl: `${baseUrl}/og-image.jpg`
        },
        {
          url: `${baseUrl}/og-image-square.jpg`,
          width: 1200,
          height: 1200,
          alt: `${BUSINESS_INFO.name} Logo`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: '@pgclosets',
      creator: '@pgclosets',
      title: `${BUSINESS_INFO.name} - ${BUSINESS_INFO.tagline}`,
      description: 'Premium closet doors and custom storage solutions in Ottawa',
      images: [
        {
          url: `${baseUrl}/twitter-image.jpg`,
          alt: BUSINESS_INFO.name
        }
      ]
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1
      }
    },
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
          color: '#1e293b'
        }
      ]
    },
    manifest: '/manifest.json',
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION
    },
    appLinks: {
      ios: {
        app_name: BUSINESS_INFO.name
      },
      android: {
        app_name: BUSINESS_INFO.name
      },
      web: {
        url: baseUrl,
        should_fallback: true
      }
    },
    category: 'Home & Garden',
    classification: 'Business',
    other: {
      'msapplication-TileColor': '#1e293b',
      'msapplication-TileImage': '/mstile-144x144.png',
      'msapplication-config': '/browserconfig.xml',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black-translucent',
      'apple-mobile-web-app-title': BUSINESS_INFO.name,
      'mobile-web-app-capable': 'yes',
      'HandheldFriendly': 'true',
      'MobileOptimized': '320',
      'geo.region': `CA-${BUSINESS_INFO.address.province}`,
      'geo.placename': BUSINESS_INFO.address.city,
      'geo.position': `${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`,
      'ICBM': `${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`,
      'DC.title': BUSINESS_INFO.fullName,
      'DC.creator': BUSINESS_INFO.name,
      'DC.publisher': BUSINESS_INFO.name,
      'DC.language': 'en-CA',
      'rating': 'general',
      'distribution': 'global',
      'revisit-after': '7 days',
      'author': BUSINESS_INFO.name,
      'copyright': `© ${new Date().getFullYear()} ${BUSINESS_INFO.name}. All rights reserved.`,
      'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFY
    }
  }
}

/**
 * Generate enhanced product metadata with rich snippets support
 */
export function generateEnhancedProductMetadata(
  product: {
    name: string
    description: string
    price?: number
    priceMin?: number
    priceMax?: number
    sku?: string
    category?: string
    brand?: string
    images?: string[]
    availability?: string
    rating?: number
    reviewCount?: number
    material?: string
    color?: string
    dimensions?: string
  },
  options?: EnhancedMetadataOptions
): Metadata {
  const baseUrl = BUSINESS_INFO.urls.main
  const base = generateEnhancedBaseMetadata()

  const title = options?.title || `${product.name} - ${product.category || 'Product'} | ${BUSINESS_INFO.name} Ottawa`
  const description = options?.description ||
    `${product.description}. Professional installation available. ${product.price ? `From $${product.price} CAD.` : ''} Official Renin dealer with lifetime warranty.`

  const productUrl = `${baseUrl}/products/${product.sku || product.name.toLowerCase().replace(/\s+/g, '-')}`

  return {
    ...base,
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      `${product.category?.toLowerCase()} ottawa`,
      `renin ${product.name.toLowerCase()}`,
      `buy ${product.name.toLowerCase()}`,
      `${product.name.toLowerCase()} installation`,
      ...(product.material ? [`${product.material.toLowerCase()} closet doors`] : []),
      ...(product.color ? [`${product.color.toLowerCase()} closet doors`] : []),
      ...(options?.keywords || [])
    ],
    openGraph: {
      ...base.openGraph,
      type: 'product',
      title,
      description,
      url: productUrl,
      images: product.images?.map((url, index) => ({
        url: url.startsWith('http') ? url : `${baseUrl}${url}`,
        width: 1200,
        height: index === 0 ? 630 : 1200,
        alt: `${product.name} - View ${index + 1}`
      })) || base.openGraph?.images,
      ...options?.openGraph
    },
    twitter: {
      ...base.twitter,
      title,
      description,
      images: product.images?.slice(0, 1).map(url => ({
        url: url.startsWith('http') ? url : `${baseUrl}${url}`,
        alt: product.name
      })) || base.twitter?.images,
      ...options?.twitter
    },
    alternates: {
      canonical: productUrl,
      ...options?.alternates
    },
    robots: options?.robots || base.robots,
    other: {
      ...base.other,
      'product:price:amount': (product.price || product.priceMin)?.toString(),
      'product:price:currency': 'CAD',
      'product:availability': product.availability || 'in stock',
      'product:condition': 'new',
      'product:brand': product.brand || 'Renin',
      'product:retailer': BUSINESS_INFO.name,
      'product:category': product.category,
      'product:material': product.material,
      'product:color': product.color,
      'product:rating': product.rating?.toString(),
      'product:rating_count': product.reviewCount?.toString(),
      'og:price:amount': (product.price || product.priceMin)?.toString(),
      'og:price:currency': 'CAD',
      ...options?.other
    }
  }
}

/**
 * Generate metadata for collection/category pages with pagination support
 */
export function generateCollectionMetadata(
  collection: {
    name: string
    description: string
    slug: string
    productCount?: number
    page?: number
    totalPages?: number
    image?: string
  },
  options?: EnhancedMetadataOptions
): Metadata {
  const baseUrl = BUSINESS_INFO.urls.main
  const base = generateEnhancedBaseMetadata()

  const pageInfo = collection.page && collection.page > 1 ? ` - Page ${collection.page}` : ''
  const title = `${collection.name}${pageInfo} | ${collection.productCount ? `${collection.productCount}+ Options` : 'Shop Now'} | ${BUSINESS_INFO.name}`
  const description = `${collection.description}. Browse our selection of ${collection.name.toLowerCase()} with professional installation in Ottawa.${pageInfo}`

  const collectionUrl = `${baseUrl}/products/${collection.slug}${collection.page && collection.page > 1 ? `?page=${collection.page}` : ''}`

  return {
    ...base,
    title,
    description,
    keywords: [
      `${collection.name.toLowerCase()} ottawa`,
      `${collection.slug} collection`,
      `shop ${collection.name.toLowerCase()}`,
      `${collection.name.toLowerCase()} installation`,
      `renin ${collection.name.toLowerCase()}`,
      ...(options?.keywords || [])
    ],
    openGraph: {
      ...base.openGraph,
      title,
      description,
      url: collectionUrl,
      images: collection.image ? [{
        url: collection.image.startsWith('http') ? collection.image : `${baseUrl}${collection.image}`,
        width: 1200,
        height: 630,
        alt: collection.name
      }] : base.openGraph?.images,
      ...options?.openGraph
    },
    twitter: {
      ...base.twitter,
      title,
      description,
      ...options?.twitter
    },
    alternates: {
      canonical: collectionUrl,
      ...options?.alternates
    },
    robots: {
      ...base.robots,
      ...(collection.page && collection.page > 1 ? { index: false } : {}),
      ...options?.robots
    },
    other: {
      ...base.other,
      'collection:product_count': collection.productCount?.toString(),
      'collection:page': collection.page?.toString(),
      'collection:total_pages': collection.totalPages?.toString(),
      ...options?.other
    }
  }
}

/**
 * Generate metadata for local landing pages
 */
export function generateLocalLandingPageMetadata(
  location: {
    name: string
    description?: string
    coordinates?: { lat: number; lng: number }
    population?: number
    slug: string
  },
  options?: EnhancedMetadataOptions
): Metadata {
  const baseUrl = BUSINESS_INFO.urls.main
  const base = generateEnhancedBaseMetadata()

  const title = `Closet Doors ${location.name} | Professional Installation & Custom Solutions | ${BUSINESS_INFO.name}`
  const description = location.description ||
    `Premium closet doors and custom storage solutions in ${location.name}. Official Renin dealer with professional installation, lifetime warranty, and 2-week delivery to ${location.name} residents.`

  const locationUrl = `${baseUrl}/areas/${location.slug}`

  return {
    ...base,
    title,
    description,
    keywords: [
      `closet doors ${location.name.toLowerCase()}`,
      `closet installation ${location.name.toLowerCase()}`,
      `custom closets ${location.name.toLowerCase()}`,
      `renin dealer ${location.name.toLowerCase()}`,
      `barn doors ${location.name.toLowerCase()}`,
      `bifold doors ${location.name.toLowerCase()}`,
      `storage solutions ${location.name.toLowerCase()}`,
      `closet organizers ${location.name.toLowerCase()}`,
      `home organization ${location.name.toLowerCase()}`,
      ...(options?.keywords || [])
    ],
    openGraph: {
      ...base.openGraph,
      title,
      description,
      url: locationUrl,
      ...options?.openGraph
    },
    twitter: {
      ...base.twitter,
      title,
      description,
      ...options?.twitter
    },
    alternates: {
      canonical: locationUrl,
      ...options?.alternates
    },
    other: {
      ...base.other,
      'geo.region': 'CA-ON',
      'geo.placename': location.name,
      'geo.position': location.coordinates ?
        `${location.coordinates.lat};${location.coordinates.lng}` :
        `${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`,
      'ICBM': location.coordinates ?
        `${location.coordinates.lat}, ${location.coordinates.lng}` :
        `${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`,
      'location:city': location.name,
      'location:province': 'Ontario',
      'location:country': 'Canada',
      'location:population': location.population?.toString(),
      ...options?.other
    }
  }
}