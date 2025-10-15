/**
 * SEO AGENT #7: Metadata Generation Helpers
 * Consistent, optimized metadata across all pages
 * Targets Ottawa closet door keywords for maximum visibility
 */

import type { Metadata } from "next"
import { BUSINESS_INFO } from "../business-config"

interface PageMetadataInput {
  title: string
  description: string
  keywords?: string[]
  path: string
  image?: string
  noIndex?: boolean
  article?: boolean
}

/**
 * Generate complete metadata for any page
 * Includes all SEO essentials: title, description, OG, Twitter, canonical, hreflang
 */
export function generatePageMetadata(input: PageMetadataInput): Metadata {
  const {
    title,
    description,
    keywords = [],
    path,
    image = BUSINESS_INFO.urls.ogImage,
    noIndex = false,
    article = false
  } = input

  const fullUrl = `${BUSINESS_INFO.urls.main}${path}`
  const imageUrl = image.startsWith('http') ? image : `${BUSINESS_INFO.urls.main}${image}`

  return {
    title: `${title} | ${BUSINESS_INFO.name}`,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: BUSINESS_INFO.name }],
    creator: BUSINESS_INFO.name,
    publisher: BUSINESS_INFO.name,
    robots: noIndex ? {
      index: false,
      follow: false
    } : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },
    alternates: {
      canonical: fullUrl,
      languages: {
        "en-CA": fullUrl,
        "x-default": fullUrl
      }
    },
    openGraph: {
      type: article ? "article" : "website",
      siteName: BUSINESS_INFO.fullName,
      url: fullUrl,
      title: `${title} | ${BUSINESS_INFO.name}`,
      description,
      locale: "en_CA",
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: `${title} - ${BUSINESS_INFO.name}`
      }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${BUSINESS_INFO.name}`,
      description,
      images: [imageUrl],
      creator: "@pgclosets"
    },
    other: {
      "geo.region": `CA-${BUSINESS_INFO.address.province}`,
      "geo.placename": BUSINESS_INFO.address.city,
      "geo.position": `${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`,
      ICBM: `${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`
    }
  }
}

/**
 * Generate metadata for product collection pages
 * Optimized for "Renin [product type] Ottawa" searches
 */
export function generateCollectionMetadata(
  collectionName: string,
  collectionType: string,
  slug: string
): Metadata {
  const locationKeywords = ["Ottawa", "Kanata", "Barrhaven", "Orleans", "Nepean"]

  return generatePageMetadata({
    title: `${collectionName} | Premium ${collectionType} Ottawa`,
    description: `Shop premium ${collectionName.toLowerCase()} in Ottawa. Official Renin dealer with professional installation, lifetime warranty, and 2-week delivery. Serving ${locationKeywords.join(", ")}.`,
    keywords: [
      `${collectionName} Ottawa`,
      `Renin ${collectionType} Ottawa`,
      `${collectionType} Kanata`,
      `${collectionType} Barrhaven`,
      `custom ${collectionType} Ottawa`,
      `premium ${collectionType}`,
      `${collectionType} installation Ottawa`,
      `Renin dealer Ottawa`
    ],
    path: `/collections/${slug}`,
    image: `/og-${slug}.jpg`
  })
}

/**
 * Generate metadata for location landing pages
 * Hyper-targeted for geo-specific searches
 */
export function generateLocationMetadata(
  location: string,
  slug: string
): Metadata {
  return generatePageMetadata({
    title: `Custom Closet Doors ${location} | Official Renin Dealer`,
    description: `Premium closet doors in ${location}. Official Renin dealer with same-day quotes, 2-week installation, lifetime warranty. Barn doors, bypass doors, bifold doors. Serving ${location} and surrounding areas.`,
    keywords: [
      `closet doors ${location}`,
      `Renin ${location}`,
      `custom closet doors ${location}`,
      `barn doors ${location}`,
      `bypass doors ${location}`,
      `bifold doors ${location}`,
      `closet door installation ${location}`,
      `Renin dealer ${location}`,
      `premium storage solutions ${location}`
    ],
    path: `/${slug}`,
    image: `/og-${slug}-location.jpg`
  })
}

/**
 * Generate metadata for Renin location pages
 * Emphasizes official dealer status and location
 */
export function generateReninLocationMetadata(
  location: string,
  slug: string,
  neighborhoods?: string[]
): Metadata {
  const neighborhoodText = neighborhoods
    ? ` serving ${neighborhoods.join(", ")}`
    : ""

  return generatePageMetadata({
    title: `Renin Closet Doors ${location} | Official Dealer | Same-Day Service`,
    description: `Official Renin dealer in ${location}${neighborhoodText}. Premium barn doors, bypass doors, bifold doors with professional installation. Same-day quotes, 2-week delivery, lifetime warranty.`,
    keywords: [
      `Renin doors ${location}`,
      `Renin closet doors ${location}`,
      `Renin barn doors ${location}`,
      `Renin dealer ${location}`,
      `official Renin ${location}`,
      `Renin installation ${location}`,
      ...(neighborhoods || []).map(n => `Renin ${n}`)
    ],
    path: `/renin/${slug}`,
    image: `/og-renin-${slug}.jpg`
  })
}

/**
 * Generate metadata for service pages
 * Focuses on service + location combination
 */
export function generateServiceMetadata(
  serviceName: string,
  serviceDescription: string,
  slug: string
): Metadata {
  return generatePageMetadata({
    title: `${serviceName} Ottawa | Professional Service`,
    description: `${serviceDescription} Serving Ottawa, Kanata, Barrhaven, Orleans, and surrounding areas. Same-day quotes available.`,
    keywords: [
      `${serviceName.toLowerCase()} Ottawa`,
      `${serviceName.toLowerCase()} Kanata`,
      `${serviceName.toLowerCase()} Barrhaven`,
      `professional ${serviceName.toLowerCase()}`,
      `${serviceName.toLowerCase()} service Ottawa`,
      "Renin installation",
      "closet door installation"
    ],
    path: `/services/${slug}`
  })
}

/**
 * Generate metadata for individual product pages
 * Rich product-specific optimization
 */
export function generateProductMetadata(
  productName: string,
  productDescription: string,
  category: string,
  sku: string,
  price: number,
  slug: string
): Metadata {
  return generatePageMetadata({
    title: `${productName} | ${category} | Official Renin Dealer`,
    description: `${productDescription} $${price.toFixed(2)} CAD. Official Renin dealer with professional installation available. Free quotes, 2-week delivery, lifetime warranty.`,
    keywords: [
      productName,
      `Renin ${productName}`,
      `${category} Ottawa`,
      `${productName} Ottawa`,
      `buy ${productName}`,
      `${productName} installation`,
      "Renin dealer Ottawa"
    ],
    path: `/products/${slug}`,
    image: `/products/${slug}-main.jpg`
  })
}

/**
 * SEO-optimized keyword targeting for Ottawa market
 */
export const OTTAWA_SEO_KEYWORDS = {
  primary: [
    "custom closet doors Ottawa",
    "Renin barn doors Ottawa",
    "premium closet solutions Ottawa",
    "closet door installation Kanata"
  ],
  secondary: [
    "Renin dealer Ottawa",
    "bypass doors Barrhaven",
    "bifold doors Orleans",
    "luxury closet doors Ottawa",
    "professional closet installation",
    "custom storage solutions Ottawa"
  ],
  longTail: [
    "Renin barn doors Ottawa same day quote",
    "custom closet doors Kanata professional installation",
    "heritage home closet doors Ottawa",
    "premium bypass doors Barrhaven lifetime warranty",
    "Renin closet doors Ottawa 2 week delivery"
  ],
  locations: [
    "Ottawa",
    "Kanata",
    "Barrhaven",
    "Orleans",
    "Nepean",
    "Gloucester",
    "Stittsville",
    "Centretown",
    "Glebe",
    "Westboro"
  ],
  productTypes: [
    "barn doors",
    "bypass doors",
    "bifold doors",
    "pivot doors",
    "sliding doors",
    "french doors",
    "closet doors",
    "interior doors",
    "room dividers"
  ]
}

/**
 * Helper to create location-specific keyword variations
 */
export function generateLocationKeywords(
  productType: string,
  location: string
): string[] {
  return [
    `${productType} ${location}`,
    `Renin ${productType} ${location}`,
    `custom ${productType} ${location}`,
    `${productType} installation ${location}`,
    `premium ${productType} ${location}`,
    `${productType} dealer ${location}`
  ]
}

/**
 * Helper to validate metadata quality
 */
export function validateMetadata(metadata: Partial<Metadata>): {
  valid: boolean
  issues: string[]
} {
  const issues: string[] = []

  // Check title length (30-60 chars optimal)
  const title = metadata.title?.toString() || ""
  if (title.length < 30) {
    issues.push(`Title too short: ${title.length} chars (aim for 30-60)`)
  } else if (title.length > 60) {
    issues.push(`Title too long: ${title.length} chars (aim for 30-60)`)
  }

  // Check description length (120-160 chars optimal)
  const description = metadata.description || ""
  if (description.length < 120) {
    issues.push(`Description too short: ${description.length} chars (aim for 120-160)`)
  } else if (description.length > 160) {
    issues.push(`Description too long: ${description.length} chars (aim for 120-160)`)
  }

  // Check for keywords
  if (!metadata.keywords || metadata.keywords.toString().split(",").length < 5) {
    issues.push("Not enough keywords (aim for 5-10)")
  }

  // Check for canonical URL
  if (!metadata.alternates?.canonical) {
    issues.push("Missing canonical URL")
  }

  // Check for OpenGraph
  if (!metadata.openGraph) {
    issues.push("Missing OpenGraph tags")
  }

  // Check for Twitter Card
  if (!metadata.twitter) {
    issues.push("Missing Twitter Card tags")
  }

  return {
    valid: issues.length === 0,
    issues
  }
}
