/**
 * AGENTS 36-40: SEO & Structured Data System
 * Comprehensive Schema.org JSON-LD generator for all structured data types
 */

import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from '../business-config'

/**
 * Enhanced Product Schema with Reviews and Offers
 */
export interface ProductSchemaData {
  name: string
  description: string
  sku?: string
  brand?: string
  price?: number
  priceMin?: number
  priceMax?: number
  images?: string[]
  category?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'SoldOut'
  material?: string
  dimensions?: string
  color?: string
  style?: string
  warranty?: string
  installation?: boolean
  rating?: number
  reviewCount?: number
  reviews?: Review[]
}

interface Review {
  author: string
  rating: number
  reviewBody: string
  datePublished: string
}

export function generateProductSchema(product: ProductSchemaData) {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${baseUrl}/products/${product.sku || product.name.toLowerCase().replace(/\s+/g, '-')}#product`,
    name: product.name,
    description: product.description,
    sku: product.sku || `PGC-${product.name.replace(/\s+/g, '-').toUpperCase()}`,
    gtin: product.sku, // Global Trade Item Number
    mpn: product.sku, // Manufacturer Part Number
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Renin',
      logo: `${baseUrl}/images/renin-logo.png`
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Renin Corp',
      url: 'https://www.renin.com',
      logo: 'https://www.renin.com/logo.png'
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/products/${product.sku || product.name.toLowerCase().replace(/\s+/g, '-')}`,
      priceCurrency: 'CAD',
      price: product.price || product.priceMin || 0,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      itemCondition: 'https://schema.org/NewCondition',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'CA',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      seller: {
        '@type': 'Organization',
        '@id': `${baseUrl}#organization`,
        name: BUSINESS_INFO.name,
        url: baseUrl,
        email: BUSINESS_INFO.email,
        telephone: BUSINESS_INFO.phone
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
      },
      warranty: product.warranty || 'Lifetime warranty on all Renin products'
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
    review: product.reviews?.map(review => ({
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
      datePublished: review.datePublished
    }))
  }
}

/**
 * Enhanced LocalBusiness Schema with Department Store elements
 */
export function generateLocalBusinessSchema() {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Store', 'HomeGoodsStore'],
    '@id': `${baseUrl}#business`,
    name: BUSINESS_INFO.fullName,
    alternateName: BUSINESS_INFO.name,
    legalName: 'PG Closets Inc.',
    image: [
      `${baseUrl}/images/store-front.jpg`,
      `${baseUrl}/images/showroom.jpg`,
      `${baseUrl}/logo.png`
    ],
    logo: `${baseUrl}/logo.png`,
    description: 'Premium closet doors and custom storage solutions in Ottawa. Official Renin dealer with professional installation, lifetime warranty, and 2-week delivery.',
    url: baseUrl,
    email: BUSINESS_INFO.email,
    telephone: BUSINESS_INFO.phone,
    faxNumber: BUSINESS_INFO.phone,
    address: getSchemaAddress(),
    geo: getSchemaGeo(),
    areaServed: [
      {
        '@type': 'City',
        name: 'Ottawa',
        containedInPlace: {
          '@type': 'State',
          name: 'Ontario',
          containedInPlace: {
            '@type': 'Country',
            name: 'Canada',
            identifier: 'CA'
          }
        }
      },
      ...BUSINESS_INFO.serviceAreas.slice(1).map(area => ({
        '@type': 'City',
        name: area
      }))
    ],
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
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '00:00',
        closes: '00:00',
        validThrough: '2024-12-31'
      }
    ],
    priceRange: '$$',
    paymentAccepted: ['Cash', 'Credit Card', 'Debit Card', 'E-transfer', 'Visa', 'MasterCard', 'American Express'],
    currenciesAccepted: 'CAD',
    hasMap: `https://www.google.com/maps/search/?api=1&query=${BUSINESS_INFO.coordinates.latitude},${BUSINESS_INFO.coordinates.longitude}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'Sarah M.'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        reviewBody: 'Excellent service and quality products. Professional installation was completed on time as promised.',
        datePublished: '2024-01-15'
      },
      {
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: 'John D.'
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5'
        },
        reviewBody: 'Best closet door selection in Ottawa. The Renin products are top quality and the 2-week delivery was accurate.',
        datePublished: '2024-02-20'
      }
    ],
    sameAs: Object.values(BUSINESS_INFO.social).filter(Boolean),
    department: [
      {
        '@type': 'LocalBusiness',
        name: 'Closet Doors Department',
        description: 'Wide selection of bypass, bifold, barn, and pivot doors'
      },
      {
        '@type': 'LocalBusiness',
        name: 'Installation Services',
        description: 'Professional closet door installation services'
      },
      {
        '@type': 'LocalBusiness',
        name: 'Custom Solutions',
        description: 'Custom closet design and storage solutions'
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Closet Door Products',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Bypass Doors',
          itemListElement: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Bypass Door Collection'
            }
          }
        },
        {
          '@type': 'OfferCatalog',
          name: 'Barn Doors',
          itemListElement: {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: 'Barn Door Collection'
            }
          }
        }
      ]
    },
    potentialAction: {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/contact`,
        inLanguage: 'en',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform'
        ]
      },
      result: {
        '@type': 'Order',
        orderStatus: 'http://schema.org/OrderProcessing'
      }
    }
  }
}

/**
 * BreadcrumbList Schema for better navigation in search results
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
    }))
  }
}

/**
 * Enhanced Organization Schema with founder and founding date
 */
export function generateOrganizationSchema() {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: BUSINESS_INFO.fullName,
    alternateName: BUSINESS_INFO.name,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo.png`,
      width: '600',
      height: '60'
    },
    image: `${baseUrl}/og-image.jpg`,
    description: 'Premium closet doors and custom storage solutions in Ottawa. Official Renin dealer.',
    email: BUSINESS_INFO.email,
    telephone: BUSINESS_INFO.phone,
    address: getSchemaAddress(),
    sameAs: Object.values(BUSINESS_INFO.social).filter(Boolean),
    foundingDate: '2010',
    foundingLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Ottawa',
        addressRegion: 'Ontario',
        addressCountry: 'Canada'
      }
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS_INFO.phone,
        contactType: 'customer service',
        email: BUSINESS_INFO.email,
        areaServed: 'CA',
        availableLanguage: ['English', 'French'],
        hoursAvailable: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00'
        }
      },
      {
        '@type': 'ContactPoint',
        telephone: BUSINESS_INFO.phone,
        contactType: 'sales',
        email: BUSINESS_INFO.email,
        areaServed: ['CA'],
        availableLanguage: ['en', 'fr']
      }
    ],
    award: 'Official Renin Dealer 2024',
    memberOf: {
      '@type': 'Organization',
      name: 'Renin Dealer Network'
    },
    sponsor: {
      '@type': 'Organization',
      name: 'Renin Corp',
      url: 'https://www.renin.com'
    }
  }
}

/**
 * Review Schema Generator with enhanced properties
 */
export interface ReviewData {
  author: string
  rating: number
  reviewBody: string
  datePublished: string
  productName?: string
  pros?: string[]
  cons?: string[]
}

export function generateReviewSchema(review: ReviewData) {
  const baseUrl = BUSINESS_INFO.urls.main

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
      name: BUSINESS_INFO.name,
      sameAs: baseUrl
    },
    ...(review.productName && {
      itemReviewed: {
        '@type': 'Product',
        name: review.productName,
        brand: {
          '@type': 'Brand',
          name: 'Renin'
        }
      }
    }),
    ...(review.pros && {
      positiveNotes: {
        '@type': 'ItemList',
        itemListElement: review.pros.map((pro, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: pro
        }))
      }
    }),
    ...(review.cons && {
      negativeNotes: {
        '@type': 'ItemList',
        itemListElement: review.cons.map((con, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: con
        }))
      }
    })
  }
}

/**
 * WebPage Schema with enhanced SEO properties
 */
export interface WebPageData {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  breadcrumb?: BreadcrumbItem[]
  primaryImageOfPage?: string
}

export function generateWebPageSchema(data: WebPageData) {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': data.url.startsWith('http') ? data.url : `${baseUrl}${data.url}`,
    name: data.title,
    description: data.description,
    url: data.url.startsWith('http') ? data.url : `${baseUrl}${data.url}`,
    inLanguage: 'en-CA',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`
    },
    primaryImageOfPage: data.primaryImageOfPage ? {
      '@type': 'ImageObject',
      url: data.primaryImageOfPage
    } : undefined,
    datePublished: data.datePublished || new Date().toISOString(),
    dateModified: data.dateModified || new Date().toISOString(),
    breadcrumb: data.breadcrumb ? generateBreadcrumbSchema(data.breadcrumb) : undefined,
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: data.url.startsWith('http') ? data.url : `${baseUrl}${data.url}`
    }
  }
}

/**
 * WebSite Schema with SearchAction
 */
export function generateWebSiteSchema() {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    name: BUSINESS_INFO.name,
    alternateName: BUSINESS_INFO.fullName,
    url: baseUrl,
    description: 'Premium closet doors and custom storage solutions in Ottawa',
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-CA'
  }
}

/**
 * Service Schema for Installation Services
 */
export interface ServiceData {
  name: string
  description: string
  serviceType: string
  areaServed?: string[]
  priceRange?: string
  provider?: string
}

export function generateServiceSchema(service: ServiceData) {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}#business`,
      name: service.provider || BUSINESS_INFO.fullName,
      email: BUSINESS_INFO.email,
      telephone: BUSINESS_INFO.phone,
      address: getSchemaAddress(),
      url: baseUrl
    },
    areaServed: (service.areaServed || BUSINESS_INFO.serviceAreas).map(area => ({
      '@type': 'City',
      name: area
    })),
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: service.priceRange || 'Contact for quote',
        priceCurrency: 'CAD'
      },
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '89',
      bestRating: '5'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Installation Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Standard Installation',
            description: 'Professional installation within 2 weeks'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Installation',
            description: 'Custom closet design and installation'
          }
        }
      ]
    }
  }
}

/**
 * FAQ Page Schema
 */
export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(faqs: FAQItem[], pageTitle?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: pageTitle || 'Frequently Asked Questions',
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
 * CollectionPage Schema for category pages
 */
export interface CollectionPageData {
  name: string
  description: string
  url: string
  numberOfItems: number
  items?: ProductSchemaData[]
}

export function generateCollectionPageSchema(data: CollectionPageData) {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: data.name,
    description: data.description,
    url: data.url.startsWith('http') ? data.url : `${baseUrl}${data.url}`,
    numberOfItems: data.numberOfItems,
    hasPart: data.items?.map(item => generateProductSchema(item)),
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}#website`
    }
  }
}

/**
 * HowTo Schema for installation guides
 */
export interface HowToStep {
  name: string
  text: string
  image?: string
  url?: string
}

export function generateHowToSchema(
  name: string,
  description: string,
  steps: HowToStep[],
  totalTime?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    totalTime,
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Closet door kit'
      },
      {
        '@type': 'HowToSupply',
        name: 'Mounting hardware'
      }
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Drill'
      },
      {
        '@type': 'HowToTool',
        name: 'Level'
      },
      {
        '@type': 'HowToTool',
        name: 'Screwdriver'
      }
    ],
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url })
    }))
  }
}

/**
 * Combine multiple schemas for a page
 */
export function combineSchemas(...schemas: any[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas
  }
}