import Script from 'next/script'
import { BUSINESS_INFO } from '@/lib/business-config'

interface StructuredDataProps {
  type?: 'full' | 'localBusiness' | 'organization' | 'website'
}

/**
 * StructuredData Component
 *
 * Generates Schema.org JSON-LD structured data for SEO.
 * Helps search engines understand the business and improve rich snippet display.
 *
 * @param type - Type of structured data to include (default: 'full')
 */
export function StructuredData({ type = 'full' }: StructuredDataProps) {
  // Local Business Schema
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS_INFO.urls.main}#organization`,
    name: BUSINESS_INFO.name,
    description: 'Premium custom closets, pantries, and storage solutions in Ottawa. Renin authorized dealer.',
    url: BUSINESS_INFO.urls.main,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    priceRange: '$$',
    image: BUSINESS_INFO.urls.ogImage,
    logo: `${BUSINESS_INFO.urls.main}/logo.png`,
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
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: BUSINESS_INFO.coordinates.latitude,
        longitude: BUSINESS_INFO.coordinates.longitude,
      },
      geoRadius: '50000', // 50km service radius
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      BUSINESS_INFO.social.facebook || '',
      BUSINESS_INFO.social.instagram || '',
    ].filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Custom Storage Solutions',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Closet Design & Installation',
            description: 'Professional custom closet design and installation services',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pantry Organization Systems',
            description: 'Custom pantry shelving and organization solutions',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Garage Storage Solutions',
            description: 'Professional garage organization and storage systems',
          },
        },
      ],
    },
  }

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BUSINESS_INFO.urls.main}#organization`,
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.urls.main,
    logo: `${BUSINESS_INFO.urls.main}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_INFO.phone,
      email: BUSINESS_INFO.email,
      contactType: 'customer service',
      areaServed: 'CA-ON',
      availableLanguage: ['en'],
    },
  }

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS_INFO.urls.main}#website`,
    url: BUSINESS_INFO.urls.main,
    name: BUSINESS_INFO.name,
    description: 'Custom closets and storage solutions in Ottawa',
    publisher: {
      '@id': `${BUSINESS_INFO.urls.main}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BUSINESS_INFO.urls.main}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Breadcrumb Schema (for home page)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BUSINESS_INFO.urls.main,
      },
    ],
  }

  const getSchema = () => {
    switch (type) {
      case 'localBusiness':
        return localBusinessSchema
      case 'organization':
        return organizationSchema
      case 'website':
        return websiteSchema
      case 'full':
      default:
        return {
          '@context': 'https://schema.org',
          '@graph': [
            localBusinessSchema,
            organizationSchema,
            websiteSchema,
            breadcrumbSchema,
          ],
        }
    }
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getSchema()),
      }}
    />
  )
}
