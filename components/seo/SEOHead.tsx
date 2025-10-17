/**
 * AGENTS 36-40: Comprehensive SEO Head Component
 * Combines all SEO elements including structured data, metadata, and social tags
 */

'use client'

import React from 'react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { BUSINESS_INFO } from '@/lib/business-config'
import {
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateProductSchema,
  generateServiceSchema,
  generateFAQSchema,
  generateReviewSchema,
  generateWebPageSchema,
  combineSchemas,
  type ProductSchemaData,
  type ServiceData,
  type FAQItem,
  type ReviewData,
  type BreadcrumbItem
} from '@/lib/seo/structuredData'

interface SEOHeadProps {
  // Page-specific data
  pageType?: 'home' | 'product' | 'category' | 'service' | 'location' | 'article' | 'faq' | 'contact'

  // Product data
  product?: ProductSchemaData

  // Service data
  service?: ServiceData

  // FAQ data
  faqs?: FAQItem[]

  // Reviews
  reviews?: ReviewData[]

  // Breadcrumbs
  breadcrumbs?: BreadcrumbItem[]

  // Additional schemas to include
  additionalSchemas?: any[]

  // Override default schemas
  excludeDefaultSchemas?: boolean

  // Custom configuration
  noIndex?: boolean
  canonical?: string
  alternates?: {
    languages?: Record<string, string>
  }
}

export function SEOHead({
  pageType = 'home',
  product,
  service,
  faqs,
  reviews,
  breadcrumbs,
  additionalSchemas = [],
  excludeDefaultSchemas = false,
  noIndex = false,
  canonical,
  alternates
}: SEOHeadProps) {
  const pathname = usePathname()
  const baseUrl = BUSINESS_INFO.urls.main
  const currentUrl = `${baseUrl}${pathname}`

  // Generate breadcrumb data based on current path
  const generateAutoBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const crumbs: BreadcrumbItem[] = [
      { name: 'Home', url: baseUrl }
    ]

    let currentPath = ''
    paths.forEach(path => {
      currentPath += `/${path}`
      const name = path
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
      crumbs.push({
        name,
        url: `${baseUrl}${currentPath}`
      })
    })

    return crumbs
  }

  // Build schemas array
  const schemas: any[] = []

  // Default schemas (unless excluded)
  if (!excludeDefaultSchemas) {
    schemas.push(generateOrganizationSchema())
    schemas.push(generateWebSiteSchema())

    if (pageType === 'home') {
      schemas.push(generateLocalBusinessSchema())
    }
  }

  // Breadcrumbs
  const breadcrumbData = breadcrumbs || (pathname !== '/' ? generateAutoBreadcrumbs() : null)
  if (breadcrumbData && breadcrumbData.length > 1) {
    schemas.push(generateBreadcrumbSchema(breadcrumbData))
  }

  // Page-specific schemas
  if (product) {
    schemas.push(generateProductSchema(product))
  }

  if (service) {
    schemas.push(generateServiceSchema(service))
  }

  if (faqs && faqs.length > 0) {
    schemas.push(generateFAQSchema(faqs))
  }

  if (reviews && reviews.length > 0) {
    reviews.forEach(review => {
      schemas.push(generateReviewSchema(review))
    })
  }

  // WebPage schema for all pages
  schemas.push(generateWebPageSchema({
    title: document?.title || 'PG Closets',
    description: document?.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    url: currentUrl,
    breadcrumb: breadcrumbData
  }))

  // Add any additional custom schemas
  schemas.push(...additionalSchemas)

  // Combine all schemas
  const combinedSchema = combineSchemas(...schemas)

  return (
    <>
      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema)
        }}
      />

      {/* Canonical URL */}
      {canonical && (
        <link rel="canonical" href={canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`} />
      )}

      {/* Alternate language versions */}
      {alternates?.languages && Object.entries(alternates.languages).map(([lang, url]) => (
        <link
          key={lang}
          rel="alternate"
          hrefLang={lang}
          href={url.startsWith('http') ? url : `${baseUrl}${url}`}
        />
      ))}

      {/* No-index directive if needed */}
      {noIndex && (
        <meta name="robots" content="noindex, nofollow" />
      )}

      {/* Preconnect to important domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* DNS Prefetch for performance */}
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />

      {/* Preload critical resources */}
      <link
        rel="preload"
        href="/fonts/inter-var.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />

      {/* PWA meta tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="application-name" content={BUSINESS_INFO.name} />
      <meta name="apple-mobile-web-app-title" content={BUSINESS_INFO.name} />
      <meta name="theme-color" content="#1e293b" />
      <meta name="msapplication-navbutton-color" content="#1e293b" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="msapplication-starturl" content="/" />

      {/* Additional SEO meta tags */}
      <meta name="author" content={BUSINESS_INFO.name} />
      <meta name="publisher" content={BUSINESS_INFO.name} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${BUSINESS_INFO.name}`} />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      <meta name="revisit-after" content="7 days" />

      {/* Geographic meta tags */}
      <meta name="geo.region" content="CA-ON" />
      <meta name="geo.placename" content={BUSINESS_INFO.address.city} />
      <meta name="geo.position" content={`${BUSINESS_INFO.coordinates.latitude};${BUSINESS_INFO.coordinates.longitude}`} />
      <meta name="ICBM" content={`${BUSINESS_INFO.coordinates.latitude}, ${BUSINESS_INFO.coordinates.longitude}`} />

      {/* Dublin Core metadata */}
      <meta name="DC.title" content={BUSINESS_INFO.fullName} />
      <meta name="DC.creator" content={BUSINESS_INFO.name} />
      <meta name="DC.publisher" content={BUSINESS_INFO.name} />
      <meta name="DC.language" content="en-CA" />
      <meta name="DC.type" content="Service" />
      <meta name="DC.format" content="text/html" />

      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

      {/* Performance hints */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />

      {/* Verification tags (if set in environment) */}
      {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
      )}
      {process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION && (
        <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION} />
      )}
      {process.env.NEXT_PUBLIC_PINTEREST_VERIFY && (
        <meta name="p:domain_verify" content={process.env.NEXT_PUBLIC_PINTEREST_VERIFY} />
      )}
    </>
  )
}

/**
 * Product page SEO component
 */
export function ProductSEOHead({
  product,
  reviews = [],
  breadcrumbs,
  ...props
}: {
  product: ProductSchemaData
  reviews?: ReviewData[]
  breadcrumbs?: BreadcrumbItem[]
} & Omit<SEOHeadProps, 'pageType' | 'product'>) {
  return (
    <SEOHead
      pageType="product"
      product={product}
      reviews={reviews}
      breadcrumbs={breadcrumbs}
      {...props}
    />
  )
}

/**
 * Category page SEO component
 */
export function CategorySEOHead({
  categoryName,
  products = [],
  breadcrumbs,
  ...props
}: {
  categoryName: string
  products?: ProductSchemaData[]
  breadcrumbs?: BreadcrumbItem[]
} & Omit<SEOHeadProps, 'pageType'>) {
  // Generate collection schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryName,
    description: `Browse our ${categoryName} collection`,
    numberOfItems: products.length,
    hasPart: products.slice(0, 10).map(p => generateProductSchema(p)) // Limit to first 10 products
  }

  return (
    <SEOHead
      pageType="category"
      breadcrumbs={breadcrumbs}
      additionalSchemas={[collectionSchema]}
      {...props}
    />
  )
}

/**
 * Service page SEO component
 */
export function ServiceSEOHead({
  service,
  faqs = [],
  reviews = [],
  breadcrumbs,
  ...props
}: {
  service: ServiceData
  faqs?: FAQItem[]
  reviews?: ReviewData[]
  breadcrumbs?: BreadcrumbItem[]
} & Omit<SEOHeadProps, 'pageType' | 'service'>) {
  return (
    <SEOHead
      pageType="service"
      service={service}
      faqs={faqs}
      reviews={reviews}
      breadcrumbs={breadcrumbs}
      {...props}
    />
  )
}

/**
 * Location page SEO component
 */
export function LocationSEOHead({
  location,
  services = [],
  reviews = [],
  breadcrumbs,
  ...props
}: {
  location: {
    name: string
    description?: string
    coordinates?: { lat: number; lng: number }
  }
  services?: ServiceData[]
  reviews?: ReviewData[]
  breadcrumbs?: BreadcrumbItem[]
} & Omit<SEOHeadProps, 'pageType'>) {
  // Generate local business schema for this location
  const localBusinessSchema = {
    ...generateLocalBusinessSchema(),
    areaServed: {
      '@type': 'City',
      name: location.name
    },
    geo: location.coordinates ? {
      '@type': 'GeoCoordinates',
      latitude: location.coordinates.lat.toString(),
      longitude: location.coordinates.lng.toString()
    } : undefined
  }

  return (
    <SEOHead
      pageType="location"
      reviews={reviews}
      breadcrumbs={breadcrumbs}
      additionalSchemas={[
        localBusinessSchema,
        ...services.map(s => generateServiceSchema(s))
      ]}
      {...props}
    />
  )
}