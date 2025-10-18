/**
 * Comprehensive JSON-LD Schema Generator
 * Central utility for all structured data schemas across the site
 */

import { BUSINESS_INFO } from '../business-config'

/**
 * Organization Schema - Sitewide identity
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BUSINESS_INFO.urls.main}#organization`,
    name: BUSINESS_INFO.fullName,
    alternateName: BUSINESS_INFO.name,
    url: BUSINESS_INFO.urls.main,
    logo: {
      '@type': 'ImageObject',
      url: `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.logo}`,
      width: 400,
      height: 400,
      caption: `${BUSINESS_INFO.name} Logo`
    },
    description: 'Premium closet doors and custom storage solutions in Ottawa. Official Renin dealer with professional installation.',
    email: BUSINESS_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.city,
      addressRegion: BUSINESS_INFO.address.province,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.coordinates.latitude,
      longitude: BUSINESS_INFO.coordinates.longitude
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: BUSINESS_INFO.email,
      areaServed: 'CA-ON',
      availableLanguage: ['en', 'fr']
    },
    sameAs: Object.values(BUSINESS_INFO.social).filter(Boolean),
    foundingDate: '2020',
    slogan: 'Official Renin Dealer - Professional Installation, Lifetime Warranty, 2-Week Delivery'
  }
}

/**
 * LocalBusiness Schema - For homepage and location pages
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HomeImprovementBusiness'],
    '@id': `${BUSINESS_INFO.urls.main}#business`,
    name: BUSINESS_INFO.fullName,
    alternateName: BUSINESS_INFO.name,
    description: 'Official Renin dealer providing custom closet doors, storage solutions, and professional installation services throughout Ottawa and surrounding areas.',
    url: BUSINESS_INFO.urls.main,
    email: BUSINESS_INFO.email,
    logo: {
      '@type': 'ImageObject',
      url: `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.logo}`,
      width: 400,
      height: 400
    },
    image: [
      `${BUSINESS_INFO.urls.main}/images/pg-closets-showroom.jpg`,
      `${BUSINESS_INFO.urls.main}/images/renin-products-display.jpg`,
      `${BUSINESS_INFO.urls.main}/images/custom-closets-ottawa.jpg`
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_INFO.address.street,
      addressLocality: BUSINESS_INFO.address.city,
      addressRegion: BUSINESS_INFO.address.province,
      postalCode: BUSINESS_INFO.address.postalCode,
      addressCountry: BUSINESS_INFO.address.country
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_INFO.coordinates.latitude,
      longitude: BUSINESS_INFO.coordinates.longitude
    },
    areaServed: BUSINESS_INFO.serviceAreas.map(area => ({
      '@type': 'City',
      name: area
    })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00'
      }
    ],
    priceRange: '$$',
    currenciesAccepted: 'CAD',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    sameAs: Object.values(BUSINESS_INFO.social).filter(Boolean),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Renin Closet Doors & Storage Solutions',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Barn Doors',
          description: 'Custom barn door installations with premium Renin hardware'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Bifold Doors',
          description: 'Space-saving bifold closet doors with modern designs'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Bypass Doors',
          description: 'Sliding bypass doors for maximum closet access'
        },
        {
          '@type': 'OfferCatalog',
          name: 'Storage Solutions',
          description: 'Complete custom storage and organization systems'
        }
      ]
    }
  }
}

/**
 * WebSite Schema - Search action and site identity
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS_INFO.urls.main}#website`,
    url: BUSINESS_INFO.urls.main,
    name: `${BUSINESS_INFO.name} - Custom Closets & Storage Solutions Ottawa`,
    description: 'Official Renin dealer in Ottawa providing custom closet doors, storage solutions, and professional installation.',
    publisher: {
      '@id': `${BUSINESS_INFO.urls.main}#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BUSINESS_INFO.urls.main}/products/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-CA'
  }
}

/**
 * Product Schema - For individual product pages
 */
export interface ProductSchemaInput {
  name: string
  description: string
  sku?: string
  price: number
  salePrice?: number | null
  images: string[]
  category: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  rating?: number
  reviewCount?: number
  url: string
}

export function generateProductSchema(product: ProductSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${product.url}#product`,
    name: product.name,
    description: product.description,
    sku: product.sku || `PGC-${product.name.replace(/\s+/g, '-').toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: 'Renin',
      logo: `${BUSINESS_INFO.urls.main}/images/renin-logo.png`,
      url: 'https://www.renin.com'
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Renin Corporation',
      url: 'https://www.renin.com'
    },
    category: product.category,
    url: product.url,
    image: product.images,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CAD',
      price: ((product.salePrice || product.price) / 100).toFixed(2),
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: `https://schema.org/${product.availability}`,
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'LocalBusiness',
        '@id': `${BUSINESS_INFO.urls.main}#business`,
        name: BUSINESS_INFO.name,
        url: BUSINESS_INFO.urls.main,
        email: BUSINESS_INFO.email
      },
      ...(product.salePrice && {
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: (product.salePrice / 100).toFixed(2),
          priceCurrency: 'CAD'
        }
      })
    },
    ...(product.rating && product.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating.toFixed(1),
        reviewCount: product.reviewCount.toString(),
        bestRating: '5',
        worstRating: '1'
      }
    })
  }
}

/**
 * BreadcrumbList Schema - For navigation hierarchy
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BUSINESS_INFO.urls.main}${item.url}`
    }))
  }
}

/**
 * FAQPage Schema - For FAQ pages
 */
export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${BUSINESS_INFO.urls.main}/faq#faqpage`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * CollectionPage Schema - For product collection/category pages
 */
export interface CollectionSchemaInput {
  name: string
  description: string
  url: string
  numberOfItems: number
  products: ProductSchemaInput[]
}

export function generateCollectionPageSchema(collection: CollectionSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${collection.url}#collection`,
    name: collection.name,
    description: collection.description,
    url: collection.url,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: BUSINESS_INFO.urls.main
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Products',
          item: `${BUSINESS_INFO.urls.main}/products`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: collection.name,
          item: collection.url
        }
      ]
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: collection.numberOfItems,
      itemListElement: collection.products.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          '@id': `${product.url}#product`,
          name: product.name,
          image: product.images[0],
          offers: {
            '@type': 'Offer',
            priceCurrency: 'CAD',
            price: ((product.salePrice || product.price) / 100).toFixed(2),
            availability: `https://schema.org/${product.availability}`
          }
        }
      }))
    }
  }
}

/**
 * Combined Graph Schema - For comprehensive page-level schemas
 */
export function generateGraphSchema(schemas: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  }
}
