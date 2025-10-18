/**
 * Website Schema Generator
 * Creates structured data for the website with search functionality
 */

import { BUSINESS_INFO } from '../business-config'

export interface WebSiteSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  url: string
  potentialAction?: {
    '@type': string
    target: {
      '@type': string
      urlTemplate: string
    }
    'query-input': string
  }
  publisher?: {
    '@type': string
    name: string
    logo: {
      '@type': string
      url: string
    }
  }
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BUSINESS_INFO.name,
    description:
      'Custom closet doors and storage solutions in Ottawa. Official Renin dealer with professional installation.',
    url: BUSINESS_INFO.urls.main,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BUSINESS_INFO.urls.main}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name,
      logo: {
        '@type': 'ImageObject',
        url: `${BUSINESS_INFO.urls.main}/brand/logo.png`,
      },
    },
  }
}

/**
 * Generate JSON-LD script tag for WebSite
 */
export function generateWebSiteScriptTag(): string {
  const schema = generateWebSiteSchema()
  return JSON.stringify(schema)
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.fullName,
    url: BUSINESS_INFO.urls.main,
    logo: `${BUSINESS_INFO.urls.main}/brand/logo.png`,
    description:
      'Custom closet doors and storage solutions in Ottawa. Official Renin dealer with professional installation, 2-week delivery, and lifetime warranty.',
    email: BUSINESS_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.city,
      addressRegion: BUSINESS_INFO.address.province,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.coordinates.latitude,
      longitude: BUSINESS_INFO.coordinates.longitude,
    },
    areaServed: BUSINESS_INFO.serviceAreas.map((area) => ({
      '@type': 'City',
      name: area,
    })),
    sameAs: [
      BUSINESS_INFO.social.facebook,
      BUSINESS_INFO.social.instagram,
      BUSINESS_INFO.social.linkedin,
    ].filter(Boolean),
  }
}

/**
 * Generate JSON-LD script tag for Organization
 */
export function generateOrganizationScriptTag(): string {
  const schema = generateOrganizationSchema()
  return JSON.stringify(schema)
}
