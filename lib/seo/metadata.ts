import type { Metadata } from 'next'
import { BUSINESS_INFO } from '../business-config'

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string
  canonical?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  noIndex?: boolean
}

/**
 * Generate comprehensive metadata for pages
 */
export function generateMetadata(params: SEOMetadata): Metadata {
  const baseUrl = BUSINESS_INFO.urls.main
  const canonicalUrl = params.canonical ? `${baseUrl}${params.canonical}` : baseUrl

  return {
    metadataBase: new URL(baseUrl),
    title: params.title,
    description: params.description,
    keywords: params.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: params.noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    openGraph: {
      type: params.type || 'website',
      siteName: BUSINESS_INFO.name,
      title: params.title,
      description: params.description,
      url: canonicalUrl,
      locale: 'en_CA',
      images: [
        {
          url: params.image || BUSINESS_INFO.urls.ogImage,
          width: 1200,
          height: 630,
          alt: params.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description: params.description,
      images: [params.image || BUSINESS_INFO.urls.ogImage],
      creator: '@pgclosets',
    },
    other: {
      'geo.region': `CA-${BUSINESS_INFO.address.province}`,
      'geo.placename': BUSINESS_INFO.address.city,
      'geo.position': `${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`,
      ICBM: `${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`,
    },
  }
}

/**
 * Generate metadata for product pages
 */
export function generateProductMetadata(product: {
  name: string
  description: string
  id: string
  category: string
  price: number
  image?: string
}): Metadata {
  const title = `${product.name} - ${product.category} | ${BUSINESS_INFO.name}`
  const description = `${product.description}. Professional installation available in Ottawa. From $${product.price} CAD. Official Renin dealer with lifetime warranty.`

  return generateMetadata({
    title,
    description,
    keywords: `${product.name}, ${product.category}, Ottawa closet doors, Renin ${product.category.toLowerCase()}, custom closets Ottawa`,
    canonical: `/products/${product.id}`,
    image: product.image,
    type: 'product',
  })
}

/**
 * Generate metadata for location pages
 */
export function generateLocationMetadata(location: string): Metadata {
  const title = `Custom Closets ${location} | ${BUSINESS_INFO.name}`
  const description = `Professional closet door installation and storage solutions in ${location}. Official Renin dealer with lifetime warranty. Free consultation. Expert installation.`

  return generateMetadata({
    title,
    description,
    keywords: `custom closets ${location}, closet doors ${location}, storage solutions ${location}, closet installation ${location}, Renin dealer ${location}`,
    canonical: `/${location.toLowerCase().replace(/\s+/g, '-')}`,
  })
}

/**
 * Generate metadata for service pages
 */
export function generateServiceMetadata(service: {
  name: string
  description: string
  slug: string
}): Metadata {
  const title = `${service.name} | ${BUSINESS_INFO.name}`
  const description = `${service.description}. Professional service in Ottawa and surrounding areas. Official Renin dealer with lifetime warranty.`

  return generateMetadata({
    title,
    description,
    keywords: `${service.name} Ottawa, ${service.slug} services, professional ${service.slug}, Ottawa home improvement`,
    canonical: `/services/${service.slug}`,
  })
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(category: {
  name: string
  description: string
  slug: string
  productCount: number
}): Metadata {
  const title = `${category.name} - ${category.productCount}+ Options | ${BUSINESS_INFO.name}`
  const description = `${category.description}. Shop ${category.productCount}+ ${category.name.toLowerCase()} with professional installation. Official Renin dealer in Ottawa.`

  return generateMetadata({
    title,
    description,
    keywords: `${category.name} Ottawa, ${category.slug}, custom ${category.slug}, Renin ${category.slug}, closet ${category.slug}`,
    canonical: `/products/${category.slug}`,
  })
}

/**
 * Generate metadata for blog posts
 */
export function generateBlogMetadata(post: {
  title: string
  excerpt: string
  slug: string
  author?: string
  publishedAt?: string
  image?: string
}): Metadata {
  const title = `${post.title} | ${BUSINESS_INFO.name} Blog`
  const description = post.excerpt

  return generateMetadata({
    title,
    description,
    canonical: `/blog/${post.slug}`,
    image: post.image,
    type: 'article',
  })
}

/**
 * Get structured keywords for Ottawa local SEO
 */
export function getLocalKeywords(baseKeywords: string[]): string {
  const locationModifiers = [
    'Ottawa',
    'Kanata',
    'Barrhaven',
    'Orleans',
    'Nepean',
    'NCR',
    'Eastern Ontario',
  ]

  const serviceModifiers = [
    'installation',
    'dealer',
    'service',
    'professional',
    'custom',
  ]

  const allKeywords = [
    ...baseKeywords,
    ...baseKeywords.flatMap(keyword =>
      locationModifiers.slice(0, 3).map(loc => `${keyword} ${loc}`)
    ),
    ...baseKeywords.flatMap(keyword =>
      serviceModifiers.slice(0, 2).map(service => `${service} ${keyword}`)
    ),
  ]

  return allKeywords.join(', ')
}
