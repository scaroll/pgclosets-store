/**
 * Local Business Schema for PG Closets
 * Provides rich search results and local SEO optimization
 */

import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from '../business-config'

export interface LocalBusinessSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  logo: string
  image: string
  email: string
  address: ReturnType<typeof getSchemaAddress>
  geo: ReturnType<typeof getSchemaGeo>
  openingHoursSpecification: Array<{
    '@type': string
    dayOfWeek: string[]
    opens: string
    closes: string
  }>
  priceRange: string
  areaServed: Array<{
    '@type': string
    name: string
  }>
  hasOfferCatalog?: {
    '@type': string
    name: string
    itemListElement: Array<{
      '@type': string
      itemOffered: {
        '@type': string
        name: string
      }
    }>
  }
  aggregateRating?: {
    '@type': string
    ratingValue: string
    reviewCount: string
  }
}

/**
 * Generate LocalBusiness structured data
 */
export function generateLocalBusinessSchema(): LocalBusinessSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS_INFO.name,
    description: 'Custom closet doors and storage solutions in Ottawa. Official Renin dealer with professional installation, 2-week delivery, and lifetime warranty.',
    url: BUSINESS_INFO.urls.main,
    logo: `${BUSINESS_INFO.urls.main}/brand/logo.png`,
    image: `${BUSINESS_INFO.urls.main}/og-image.png`,
    email: BUSINESS_INFO.email,
    address: getSchemaAddress(),
    geo: getSchemaGeo(),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday'],
        opens: '10:00',
        closes: '16:00',
      },
    ],
    priceRange: '$$',
    areaServed: BUSINESS_INFO.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Closet Door Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Closet Design',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Closet Door Installation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Storage Solutions',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pantry Organization',
          },
        },
      ],
    },
  }
}

/**
 * Generate JSON-LD script tag for LocalBusiness
 */
export function generateLocalBusinessScriptTag(): string {
  const schema = generateLocalBusinessSchema()
  return JSON.stringify(schema)
}
