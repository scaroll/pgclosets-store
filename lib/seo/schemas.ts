/**
 * SEO JSON-LD Schema Generators
 * Comprehensive structured data for search engines
 */

import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo } from '../business-config'

/**
 * Organization Schema
 * Used on homepage and contact pages
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BUSINESS_INFO.urls.main}/#organization`,
    name: BUSINESS_INFO.name,
    legalName: BUSINESS_INFO.fullName,
    url: BUSINESS_INFO.urls.main,
    logo: {
      '@type': 'ImageObject',
      url: `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.logo}`,
      width: '512',
      height: '512',
    },
    image: `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.ogImage}`,
    description: 'Official Renin dealer providing premium closet doors and storage solutions in Ottawa with expert installation and lifetime warranty.',
    email: BUSINESS_INFO.email,
    telephone: BUSINESS_INFO.phone,
    address: getSchemaAddress(),
    geo: getSchemaGeo(),
    areaServed: BUSINESS_INFO.serviceAreas.map(area => ({
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
 * LocalBusiness Schema
 * Enhanced local SEO for Ottawa market
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS_INFO.urls.main}/#localbusiness`,
    name: BUSINESS_INFO.name,
    image: `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.ogImage}`,
    description: 'Ottawa\'s trusted source for premium closet doors and storage solutions. Official Renin dealer with professional installation services.',
    telephone: BUSINESS_INFO.phone,
    email: BUSINESS_INFO.email,
    address: getSchemaAddress(),
    geo: getSchemaGeo(),
    url: BUSINESS_INFO.urls.main,
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    areaServed: BUSINESS_INFO.serviceAreas.map(area => ({
      '@type': 'City',
      name: area,
      containedInPlace: {
        '@type': 'State',
        name: 'Ontario',
      },
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Closet Door Solutions',
      itemListElement: BUSINESS_INFO.services.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service,
        },
      })),
    },
  }
}

/**
 * Product Schema Generator
 * For individual product pages
 */
export function getProductSchema(product: {
  id: string
  name: string
  description: string
  price?: number
  currency?: string
  brand?: string
  image?: string | string[]
  category?: string
  sku?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  rating?: {
    value: number
    count: number
  }
  reviews?: Array<{
    author: string
    rating: number
    comment: string
    date: string
  }>
  features?: string[]
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${BUSINESS_INFO.urls.main}/products/${product.id}/#product`,
    name: product.name,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Renin',
    },
    manufacturer: {
      '@type': 'Organization',
      name: product.brand || 'Renin',
    },
  }

  // Handle single image or array of images
  if (product.image) {
    const images = Array.isArray(product.image) ? product.image : [product.image]
    schema.image = images.map((img) =>
      img.startsWith('http') ? img : `${BUSINESS_INFO.urls.main}${img}`
    )
  }

  if (product.sku) {
    schema.sku = product.sku
  }

  if (product.category) {
    schema.category = product.category
  }

  if (product.price) {
    // Calculate priceValidUntil (1 year from now)
    const priceValidUntil = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    )
      .toISOString()
      .split('T')[0]

    schema.offers = {
      '@type': 'Offer',
      url: `${BUSINESS_INFO.urls.main}/products/${product.id}`,
      priceCurrency: product.currency || 'CAD',
      price: product.price,
      priceValidUntil,
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: BUSINESS_INFO.name,
      },
    }
  }

  if (product.rating && product.rating.count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Add individual reviews if available
  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      datePublished: review.date,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.comment,
    }))
  }

  // Add features as additionalProperty
  if (product.features && product.features.length > 0) {
    schema.additionalProperty = product.features.map((feature) => ({
      '@type': 'PropertyValue',
      name: 'Feature',
      value: feature,
    }))
  }

  return schema
}

/**
 * BreadcrumbList Schema Generator
 * For navigation breadcrumbs
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BUSINESS_INFO.urls.main}${item.url}`,
    })),
  }
}

/**
 * FAQ Schema Generator
 * For FAQ pages and sections
 */
export function getFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Review Schema Generator
 * For product reviews
 */
export function getReviewSchema(reviews: Array<{
  author: string
  rating: number
  reviewBody: string
  datePublished: string
  productName?: string
}>) {
  return reviews.map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '5',
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    itemReviewed: review.productName
      ? {
          '@type': 'Product',
          name: review.productName,
        }
      : {
          '@type': 'Organization',
          name: BUSINESS_INFO.name,
        },
  }))
}

/**
 * WebPage Schema Generator
 * For general pages
 */
export function getWebPageSchema(page: {
  url: string
  name: string
  description: string
  datePublished?: string
  dateModified?: string
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${BUSINESS_INFO.urls.main}${page.url}/#webpage`,
    url: `${BUSINESS_INFO.urls.main}${page.url}`,
    name: page.name,
    description: page.description,
    isPartOf: {
      '@id': `${BUSINESS_INFO.urls.main}/#website`,
    },
    about: {
      '@id': `${BUSINESS_INFO.urls.main}/#organization`,
    },
  }

  if (page.datePublished) {
    schema.datePublished = page.datePublished
  }

  if (page.dateModified) {
    schema.dateModified = page.dateModified
  }

  return schema
}

/**
 * Website Schema
 * For site-wide use
 */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS_INFO.urls.main}/#website`,
    url: BUSINESS_INFO.urls.main,
    name: BUSINESS_INFO.name,
    description: 'Ottawa\'s premier source for closet doors and storage solutions.',
    publisher: {
      '@id': `${BUSINESS_INFO.urls.main}/#organization`,
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
}

/**
 * Service Schema Generator
 * For service pages
 */
export function getServiceSchema(service: {
  name: string
  description: string
  url: string
  serviceType?: string
  areaServed?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@id': `${BUSINESS_INFO.urls.main}/#organization`,
    },
    serviceType: service.serviceType || service.name,
    areaServed: (service.areaServed || BUSINESS_INFO.serviceAreas).map(area => ({
      '@type': 'City',
      name: area,
    })),
    offers: {
      '@type': 'Offer',
      url: `${BUSINESS_INFO.urls.main}${service.url}`,
      priceCurrency: 'CAD',
    },
  }
}

/**
 * Helper function to render JSON-LD script tag
 */
export function renderSchema(schema: object) {
  return {
    __html: JSON.stringify(schema),
  }
}
