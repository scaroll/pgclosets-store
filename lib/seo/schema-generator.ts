/**
 * AGENT 4-6: Schema Markup Agents - Comprehensive Schema.org Generator
 * Generates Product, LocalBusiness, FAQ, Service, and other schema types
 */

import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from '../business-config'
import type { Neighborhood } from './neighborhoods'

/**
 * AGENT 4: Product Schema Generator
 */
export interface ProductSchemaInput {
  name: string
  description: string
  sku?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  images?: string[]
  category?: string
  availability?: 'in_stock' | 'out_of_stock' | 'preorder'
  material?: string
  dimensions?: string
  color?: string
  style?: string
  warranty?: string
  installation?: boolean
  rating?: number
  reviewCount?: number
}

export function generateProductSchema(product: ProductSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku || `PGC-${product.name.replace(/\s+/g, '-').toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Renin',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Renin Corp',
      url: 'https://www.renin.com'
    },
    offers: {
      '@type': 'Offer',
      price: product.priceMin || 0,
      priceCurrency: 'CAD',
      availability:
        product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : product.availability === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/PreOrder',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: BUSINESS_INFO.name,
        url: BUSINESS_INFO.urls.main,
        telephone: BUSINESS_INFO.phone,
        email: BUSINESS_INFO.email
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'CAD'
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'CA',
          addressRegion: 'ON'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 3,
            unitCode: 'DAY'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 7,
            maxValue: 14,
            unitCode: 'DAY'
          }
        }
      }
    },
    image: product.images || [],
    category: product.category || 'Closet Doors',
    material: product.material,
    color: product.color,
    additionalProperty: [
      ...(product.dimensions ? [{
        '@type': 'PropertyValue',
        name: 'Dimensions',
        value: product.dimensions
      }] : []),
      ...(product.style ? [{
        '@type': 'PropertyValue',
        name: 'Style',
        value: product.style
      }] : []),
      ...(product.warranty ? [{
        '@type': 'PropertyValue',
        name: 'Warranty',
        value: product.warranty
      }] : []),
      ...(product.installation ? [{
        '@type': 'PropertyValue',
        name: 'Professional Installation',
        value: 'Available'
      }] : [])
    ],
    aggregateRating: product.rating && product.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1'
    } : undefined,
  }
}

/**
 * AGENT 5: LocalBusiness Schema Generator
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS_INFO.urls.main}#business`,
    name: BUSINESS_INFO.fullName,
    image: `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.logo}`,
    description: 'Premium closet doors and custom storage solutions in Ottawa. Official Renin dealer with professional installation.',
    url: BUSINESS_INFO.urls.main,
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    address: getSchemaAddress(),
    geo: getSchemaGeo(),
    areaServed: BUSINESS_INFO.serviceAreas.map(area => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Ontario'
      }
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
    paymentAccepted: 'Cash, Credit Card, Debit Card, E-transfer',
    currenciesAccepted: 'CAD',
    hasMap: `https://www.google.com/maps/search/?api=1&query=${BUSINESS_INFO.coordinates.latitude},${BUSINESS_INFO.coordinates.longitude}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    sameAs: Object.values(BUSINESS_INFO.social).filter(Boolean),
  }
}

/**
 * AGENT 6: FAQ Schema Generator
 */
export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
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
 * Service Schema Generator
 */
export interface ServiceSchemaInput {
  name: string
  description: string
  serviceType: string
  areaServed?: string[]
  priceRange?: string
}

export function generateServiceSchema(service: ServiceSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS_INFO.fullName,
      address: getSchemaAddress(),
      telephone: BUSINESS_INFO.phone,
      email: BUSINESS_INFO.email,
      url: BUSINESS_INFO.urls.main
    },
    areaServed: (service.areaServed || BUSINESS_INFO.serviceAreas).map(area => ({
      '@type': 'City',
      name: area
    })),
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: service.priceRange || '$$',
        priceCurrency: 'CAD'
      },
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '89',
      bestRating: '5'
    }
  }
}

/**
 * Website Schema Generator
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS_INFO.urls.main}#website`,
    name: BUSINESS_INFO.name,
    url: BUSINESS_INFO.urls.main,
    description: 'Premium closet doors and custom storage solutions in Ottawa',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BUSINESS_INFO.urls.main}/products?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${BUSINESS_INFO.urls.main}#organization`
    }
  }
}

/**
 * Organization Schema Generator
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BUSINESS_INFO.urls.main}#organization`,
    name: BUSINESS_INFO.fullName,
    url: BUSINESS_INFO.urls.main,
    logo: `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.logo}`,
    description: 'Premium closet doors and custom storage solutions in Ottawa',
    email: BUSINESS_INFO.email,
    telephone: BUSINESS_INFO.phone,
    address: getSchemaAddress(),
    sameAs: Object.values(BUSINESS_INFO.social).filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_INFO.phone,
      contactType: 'customer service',
      email: BUSINESS_INFO.email,
      areaServed: 'CA',
      availableLanguage: ['en', 'fr']
    }
  }
}

/**
 * Breadcrumb Schema Generator
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
      item: item.url
    }))
  }
}

/**
 * Review Schema Generator
 */
export interface ReviewInput {
  author: string
  rating: number
  reviewBody: string
  datePublished: string
  productName?: string
}

export function generateReviewSchema(review: ReviewInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    publisher: {
      '@type': 'Organization',
      name: BUSINESS_INFO.name
    },
    ...(review.productName && {
      itemReviewed: {
        '@type': 'Product',
        name: review.productName
      }
    })
  }
}

/**
 * Neighborhood Landing Page Schema
 */
export function generateNeighborhoodSchema(neighborhood: Neighborhood) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Custom Closet Installation in ${neighborhood.name}`,
    description: neighborhood.description,
    provider: {
      '@type': 'LocalBusiness',
      name: BUSINESS_INFO.fullName,
      telephone: BUSINESS_INFO.phone,
      email: BUSINESS_INFO.email,
      address: getSchemaAddress(),
      url: BUSINESS_INFO.urls.main,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: neighborhood.coordinates.lat.toString(),
        longitude: neighborhood.coordinates.lng.toString()
      }
    },
    areaServed: {
      '@type': 'City',
      name: neighborhood.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Ontario',
        containedInPlace: {
          '@type': 'Country',
          name: 'Canada'
        }
      }
    },
    serviceType: 'Home Improvement',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5'
    },
    ...(neighborhood.testimonial && {
      review: {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: neighborhood.testimonial.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        reviewBody: neighborhood.testimonial.text
      }
    })
  }
}

/**
 * Product Collection Schema
 */
export function generateProductCollectionSchema(
  name: string,
  description: string,
  products: ProductSchemaInput[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: generateProductSchema(product)
    }))
  }
}

/**
 * HowTo Schema Generator (for installation guides)
 */
export interface HowToStep {
  name: string
  text: string
  image?: string
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image })
    }))
  }
}
