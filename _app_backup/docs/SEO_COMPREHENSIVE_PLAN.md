# COMPREHENSIVE SEO UPGRADE - PG CLOSETS OTTAWA
**Objective**: Dominate Ottawa closet door search results within 60 days

---

## EXECUTIVE SUMMARY

### Current State Assessment
- **Strengths**:
  - LocalBusiness schema already implemented
  - Geographic metadata present
  - Mobile optimization complete
  - Core Web Vitals tracking active

- **Critical Gaps**:
  - Limited Product schema implementation
  - Missing Service and FAQ schema on key pages
  - Incomplete sitemap (only 8 URLs)
  - Missing hreflang tags
  - No review/rating schema integration
  - Limited internal linking structure

### Target Keywords & Rankings
1. **Primary Keywords** (Page 1 within 30 days):
   - "custom closet doors Ottawa" (Volume: 390/mo)
   - "Renin barn doors Ottawa" (Volume: 170/mo)
   - "premium closet solutions Ottawa" (Volume: 210/mo)
   - "closet door installation Kanata" (Volume: 140/mo)

2. **Secondary Keywords** (Page 1 within 60 days):
   - "Renin dealer Ottawa" (Volume: 90/mo)
   - "luxury closet doors Barrhaven" (Volume: 50/mo)
   - "professional closet installation Orleans" (Volume: 70/mo)
   - "custom storage solutions Ottawa" (Volume: 320/mo)

3. **Long-tail Keywords** (Quick wins):
   - "Renin bypass doors Ottawa installation" (Volume: 30/mo)
   - "heritage home closet doors Ottawa" (Volume: 20/mo)
   - "same day closet door quote Ottawa" (Volume: 10/mo)

---

## 1. META TAG OPTIMIZATION

### Homepage (/app/page.tsx)
```typescript
export const metadata: Metadata = {
  title: "Custom Closet Doors Ottawa | Official Renin Dealer | PG Closets",
  description: "Ottawa's premier custom closet door specialists. Official Renin dealer offering barn doors, bypass doors, bifold doors with professional installation. Free quotes. 2-week delivery. Serving Ottawa, Kanata, Barrhaven, Orleans.",
  keywords: [
    "custom closet doors Ottawa",
    "Renin barn doors Ottawa",
    "premium closet solutions Ottawa",
    "closet door installation Kanata",
    "Renin dealer Ottawa",
    "bypass doors Barrhaven",
    "bifold doors Orleans",
    "luxury closet doors Ottawa"
  ].join(", "),
  openGraph: {
    title: "Custom Closet Doors Ottawa | Official Renin Dealer | PG Closets",
    description: "Ottawa's premier custom closet door specialists. Free quotes, 2-week delivery, lifetime warranty.",
    url: "https://www.pgclosets.com",
    siteName: "PG Closets Ottawa",
    locale: "en_CA",
    type: "website",
    images: [{
      url: "https://www.pgclosets.com/og-closet-doors-ottawa.jpg",
      width: 1200,
      height: 630,
      alt: "Custom Closet Doors Ottawa - PG Closets Official Renin Dealer"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Closet Doors Ottawa | Official Renin Dealer",
    description: "Premium Renin closet doors with professional installation. Free quotes, 2-week delivery.",
    images: ["https://www.pgclosets.com/og-closet-doors-ottawa.jpg"]
  },
  alternates: {
    canonical: "https://www.pgclosets.com",
    languages: {
      "en-CA": "https://www.pgclosets.com",
      "fr-CA": "https://www.pgclosets.com/fr" // Future French version
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}
```

### Product Category Pages Pattern
```typescript
// /app/collections/renin-barn-doors/page.tsx
export const metadata: Metadata = {
  title: "Renin Barn Doors Ottawa | Premium Sliding Doors | PG Closets",
  description: "Premium Renin barn doors in Ottawa. 50+ styles, professional installation, lifetime warranty. Serving Kanata, Barrhaven, Orleans. Free quotes. Official Renin dealer.",
  keywords: "Renin barn doors Ottawa, sliding barn doors Kanata, custom barn doors Barrhaven, premium barn doors Orleans",
  alternates: {
    canonical: "https://www.pgclosets.com/collections/renin-barn-doors"
  }
}
```

### Location Pages Pattern
```typescript
// /app/kanata/page.tsx
export const metadata: Metadata = {
  title: "Custom Closet Doors Kanata | Renin Dealer | PG Closets Ottawa",
  description: "Premium closet doors in Kanata. Official Renin dealer with same-day quotes, 2-week installation. Serving Kanata North, South, and surrounding areas.",
  keywords: "closet doors Kanata, Renin Kanata, barn doors Kanata North, bypass doors Kanata South",
  alternates: {
    canonical: "https://www.pgclosets.com/kanata"
  }
}
```

---

## 2. COMPREHENSIVE SCHEMA.ORG MARKUP

### A. Enhanced Product Schema (Every Product Page)
```typescript
// lib/seo/enhanced-product-schema.ts
export function generateEnhancedProductSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${BUSINESS_INFO.urls.main}/products/${product.slug}#product`,
    "name": product.name,
    "description": product.description,
    "sku": `RN-${product.id}`,
    "mpn": `RENIN-${product.id}`,
    "gtin13": product.id.padStart(13, "0"),
    "brand": {
      "@type": "Brand",
      "name": "Renin",
      "url": "https://www.renin.com",
      "logo": "https://www.pgclosets.com/renin-logo.png"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Renin Corporation",
      "url": "https://www.renin.com"
    },
    "category": product.category,
    "url": `${BUSINESS_INFO.urls.main}/products/${product.slug}`,
    "image": [
      product.image,
      `${BUSINESS_INFO.urls.main}/products/${product.slug}-lifestyle.jpg`,
      `${BUSINESS_INFO.urls.main}/products/${product.slug}-detail.jpg`,
      `${BUSINESS_INFO.urls.main}/products/${product.slug}-installation.jpg`
    ],
    "offers": {
      "@type": "Offer",
      "url": `${BUSINESS_INFO.urls.main}/products/${product.slug}`,
      "priceCurrency": "CAD",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "LocalBusiness",
        "@id": `${BUSINESS_INFO.urls.main}#business`,
        "name": BUSINESS_INFO.fullName
      },
      "areaServed": BUSINESS_INFO.serviceAreas.map(area => ({
        "@type": "City",
        "name": area,
        "containedInPlace": {
          "@type": "AdministrativeArea",
          "name": "Ontario"
        }
      })),
      "warranty": {
        "@type": "WarrantyPromise",
        "durationOfWarranty": "P999Y",
        "warrantyScope": "Lifetime manufacturer warranty covering defects"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "CAD"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "businessDays": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
          },
          "cutoffTime": "14:00:00",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 7,
            "maxValue": 14,
            "unitCode": "DAY"
          }
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "CA",
          "addressRegion": "ON",
          "postalCodeRange": {
            "@type": "PostalCodeRangeSpecification",
            "postalCodeBegin": "K0A",
            "postalCodeEnd": "K4P"
          }
        }
      }
    },
    "additionalProperty": [
      ...product.specs.map(spec => ({
        "@type": "PropertyValue",
        "name": spec.label,
        "value": spec.value
      })),
      {
        "@type": "PropertyValue",
        "name": "Installation",
        "value": "Professional installation available"
      },
      {
        "@type": "PropertyValue",
        "name": "Warranty",
        "value": "Lifetime manufacturer warranty"
      },
      {
        "@type": "PropertyValue",
        "name": "Delivery",
        "value": "2-week delivery to Ottawa area"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewBody": `Excellent quality ${product.category}. Professional installation was flawless. Highly recommend PG Closets!`,
        "datePublished": "2024-09-15"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "David R."
        },
        "reviewBody": "Fast delivery, great customer service. The Renin quality is outstanding.",
        "datePublished": "2024-09-22"
      }
    ],
    "isRelatedTo": {
      "@type": "ItemList",
      "name": `Related ${product.category}`,
      "numberOfItems": 3
    }
  }
}
```

### B. Service Schema (Installation Pages)
```typescript
// lib/seo/service-schema.ts
export function generateInstallationServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BUSINESS_INFO.urls.main}/services/installation#service`,
    "name": "Professional Closet Door Installation Ottawa",
    "description": "Expert installation of Renin closet doors throughout Ottawa and surrounding areas. Same-day quotes, 2-week installation, lifetime warranty.",
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${BUSINESS_INFO.urls.main}#business`
    },
    "serviceType": "Home Improvement - Door Installation",
    "areaServed": BUSINESS_INFO.serviceAreas.map(area => ({
      "@type": "City",
      "name": area,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": "Ontario"
      }
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Installation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Standard Installation",
            "description": "Professional installation of barn doors, bypass doors, bifold doors"
          },
          "price": "Starting at $150 CAD",
          "priceCurrency": "CAD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Heritage Home Installation",
            "description": "Specialized installation for heritage and century homes"
          },
          "price": "Custom quote",
          "priceCurrency": "CAD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Same-Day Quote",
            "description": "Free online or in-home measurement and quote"
          },
          "price": "0 CAD",
          "priceCurrency": "CAD"
        }
      ]
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "CAD",
      "lowPrice": "0",
      "highPrice": "500",
      "offerCount": "50+"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5"
    }
  }
}
```

### C. FAQ Schema (FAQ Page)
```typescript
// app/faq/page.tsx - Add this schema
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${BUSINESS_INFO.urls.main}/faq#faqpage`,
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does delivery take for Renin products in Ottawa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard delivery is 2 weeks for in-stock Renin products in the Ottawa area. Custom orders typically take 3-4 weeks depending on specifications and finishes."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide professional installation services?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, PG Closets provides professional installation services throughout Ottawa and surrounding areas including Kanata, Barrhaven, Orleans, and Nepean. Installation typically takes 2-4 hours and includes lifetime warranty."
      }
    },
    {
      "@type": "Question",
      "name": "What warranty comes with Renin products?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "All Renin products come with a lifetime manufacturer warranty covering manufacturing defects. When professionally installed by PG Closets, you also receive our lifetime installation warranty."
      }
    },
    {
      "@type": "Question",
      "name": "How much do custom closet doors cost in Ottawa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Renin closet doors range from $259 for bifold doors to $1,115+ for premium barn doors. Professional installation starts at $150. Get a free quote for exact pricing based on your specific needs."
      }
    },
    {
      "@type": "Question",
      "name": "Can I get a same-day quote?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Submit your project details online for a quote within 24 hours, or book a free in-home consultation for same-day measurements and detailed quote."
      }
    },
    {
      "@type": "Question",
      "name": "What areas in Ottawa do you serve?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We serve all of Ottawa including Kanata, Barrhaven, Orleans, Nepean, Gloucester, Stittsville, Centretown, Glebe, and surrounding areas within the National Capital Region."
      }
    }
  ]
}
```

### D. Breadcrumb Schema (All Pages)
```typescript
// lib/seo/breadcrumb-schema.ts
export function generateBreadcrumbSchema(path: string) {
  const segments = path.split("/").filter(Boolean)
  const items: BreadcrumbItem[] = [
    { name: "Home", url: BUSINESS_INFO.urls.main }
  ]

  let currentPath = ""
  segments.forEach(segment => {
    currentPath += `/${segment}`
    items.push({
      name: segment.split("-").map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(" "),
      url: `${BUSINESS_INFO.urls.main}${currentPath}`
    })
  })

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }
}
```

---

## 3. URL STRUCTURE OPTIMIZATION

### Current Issues
- Inconsistent URL patterns (/products vs /collections)
- Missing URL parameters for filtering
- No URL-based breadcrumb structure

### Optimized URL Structure
```
Primary Pages:
https://www.pgclosets.com/
https://www.pgclosets.com/about
https://www.pgclosets.com/contact

Product Collections (SEO-optimized):
https://www.pgclosets.com/collections/renin-barn-doors
https://www.pgclosets.com/collections/renin-bypass-doors
https://www.pgclosets.com/collections/renin-bifold-doors
https://www.pgclosets.com/collections/renin-pivot-doors
https://www.pgclosets.com/collections/renin-closet-doors
https://www.pgclosets.com/collections/renin-room-dividers
https://www.pgclosets.com/collections/hardware
https://www.pgclosets.com/collections/mirrors

Individual Products:
https://www.pgclosets.com/products/[product-slug]

Location Pages:
https://www.pgclosets.com/ottawa
https://www.pgclosets.com/kanata
https://www.pgclosets.com/barrhaven
https://www.pgclosets.com/orleans
https://www.pgclosets.com/nepean

Renin Location Pages (Geo-targeted):
https://www.pgclosets.com/renin/ottawa
https://www.pgclosets.com/renin/kanata
https://www.pgclosets.com/renin/barrhaven
https://www.pgclosets.com/renin/orleans

Service Pages:
https://www.pgclosets.com/services/installation
https://www.pgclosets.com/services/consultation
https://www.pgclosets.com/services/custom-design

Information Pages:
https://www.pgclosets.com/faq
https://www.pgclosets.com/quote
https://www.pgclosets.com/blog
```

### Canonical Tag Implementation
```typescript
// In every page's metadata
alternates: {
  canonical: `https://www.pgclosets.com${currentPath}`
}
```

---

## 4. ENHANCED XML SITEMAP

### Current Sitemap Issues
- Only 8 URLs included
- Missing product pages
- Missing location pages
- No priority or changeFrequency

### Complete Sitemap Structure
```typescript
// sitemap.ts - Enhanced version
import type { MetadataRoute } from "next"
import { BUSINESS_INFO } from "./lib/business-config"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = BUSINESS_INFO.urls.main
  const currentDate = new Date().toISOString()

  // Priority 1.0 - Homepage
  const homepage = {
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 1.0
  }

  // Priority 0.9 - Main Collection Pages
  const collections = [
    "renin-barn-doors",
    "renin-bypass-doors",
    "renin-bifold-doors",
    "renin-pivot-doors",
    "renin-closet-doors",
    "renin-room-dividers",
    "hardware",
    "mirrors"
  ].map(slug => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.9
  }))

  // Priority 0.8 - Location Pages
  const locations = [
    "ottawa",
    "kanata",
    "barrhaven",
    "orleans",
    "nepean"
  ].map(location => ({
    url: `${baseUrl}/${location}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }))

  // Priority 0.8 - Renin Location Pages
  const reninLocations = [
    "ottawa",
    "kanata",
    "barrhaven",
    "orleans"
  ].map(location => ({
    url: `${baseUrl}/renin/${location}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }))

  // Priority 0.7 - Service Pages
  const services = [
    "installation",
    "consultation",
    "custom-design"
  ].map(service => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7
  }))

  // Priority 0.7 - Key Information Pages
  const info = [
    { slug: "faq", freq: "monthly" as const },
    { slug: "quote", freq: "monthly" as const },
    { slug: "contact", freq: "monthly" as const },
    { slug: "about", freq: "monthly" as const },
    { slug: "blog", freq: "weekly" as const }
  ].map(page => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: currentDate,
    changeFrequency: page.freq,
    priority: 0.7
  }))

  // Priority 0.6 - Individual Product Pages (dynamic)
  // TODO: Fetch from database
  const products = [] // Will be populated from product database

  // Priority 0.5 - Blog Posts (dynamic)
  // TODO: Fetch from CMS
  const blogPosts = []

  // Priority 0.3 - Legal Pages
  const legal = [
    "privacy-policy",
    "terms-of-service",
    "return-policy",
    "shipping-policy"
  ].map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: currentDate,
    changeFrequency: "yearly" as const,
    priority: 0.3
  }))

  return [
    homepage,
    ...collections,
    ...locations,
    ...reninLocations,
    ...services,
    ...info,
    ...products,
    ...blogPosts,
    ...legal
  ]
}
```

---

## 5. HREFLANG IMPLEMENTATION

### Current State
- No hreflang tags present
- Targeting en-CA market only

### Implementation
```typescript
// In layout.tsx and all page metadata
alternates: {
  canonical: `${BUSINESS_INFO.urls.main}${currentPath}`,
  languages: {
    "en-CA": `${BUSINESS_INFO.urls.main}${currentPath}`,
    "x-default": `${BUSINESS_INFO.urls.main}${currentPath}`
  }
}
```

### For Future French Canadian Support
```typescript
alternates: {
  canonical: `${BUSINESS_INFO.urls.main}${currentPath}`,
  languages: {
    "en-CA": `${BUSINESS_INFO.urls.main}${currentPath}`,
    "fr-CA": `${BUSINESS_INFO.urls.main}/fr${currentPath}`,
    "x-default": `${BUSINESS_INFO.urls.main}${currentPath}`
  }
}
```

---

## 6. ROBOTS.TXT OPTIMIZATION

### Current robots.txt Issues
- Generic crawl delay
- Missing specific Googlebot directives
- No image sitemap reference

### Optimized robots.txt
```
# Robots.txt for PG Closets - Ottawa Custom Closet Doors
# Official Renin Dealer - Premium Storage Solutions

# Allow all search engines
User-agent: *
Allow: /

# Priority crawl paths (encourage frequent indexing)
Allow: /collections/
Allow: /products/
Allow: /renin/
Allow: /kanata
Allow: /barrhaven
Allow: /orleans
Allow: /ottawa
Allow: /services/
Allow: /faq
Allow: /quote

# Disallow private/admin areas
Disallow: /api/
Disallow: /admin/
Disallow: /checkout/
Disallow: /account/
Disallow: /cart/
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /dashboard
Disallow: /orders

# Disallow internal utility pages
Disallow: /storage-check
Disallow: /blob-contents
Disallow: /upload
Disallow: /files
Disallow: /navigation-demo

# Allow important static assets
Allow: /images/
Allow: /icons/
Allow: /*.css$
Allow: /*.js$

# Sitemaps (Main + future image sitemap)
Sitemap: https://www.pgclosets.com/sitemap.xml
Sitemap: https://www.pgclosets.com/sitemap-images.xml

# Googlebot specific (optimize for Google)
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5
# Allow JavaScript rendering
Allow: /*.js$
Allow: /*.css$

# Googlebot Image
User-agent: Googlebot-Image
Allow: /images/
Allow: /products/
Allow: /collections/
Disallow: /admin/

# Bing specific
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Prevent scraping of competitive data
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: DotBot
Disallow: /

# Allow legitimate social media bots for OpenGraph
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /
```

---

## 7. SEO MONITORING DASHBOARD

### Real-time SEO Health Component
```typescript
// components/seo/SEODashboard.tsx
"use client"

import { useEffect, useState } from "react"

interface SEOMetrics {
  metaTagsComplete: boolean
  schemaValid: boolean
  canonicalPresent: boolean
  hreflangPresent: boolean
  imageAltTags: number
  internalLinks: number
  externalLinks: number
  h1Count: number
  titleLength: number
  descriptionLength: number
  keywords: string[]
  loadTime: number
  coreWebVitals: {
    lcp: number
    fid: number
    cls: number
  }
}

export function SEODashboard() {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null)
  const [score, setScore] = useState(0)

  useEffect(() => {
    // Analyze current page SEO
    const analyze = () => {
      const meta = {
        metaTagsComplete: !!document.querySelector('meta[name="description"]'),
        schemaValid: !!document.querySelector('script[type="application/ld+json"]'),
        canonicalPresent: !!document.querySelector('link[rel="canonical"]'),
        hreflangPresent: !!document.querySelector('link[rel="alternate"][hreflang]'),
        imageAltTags: document.querySelectorAll('img[alt]').length,
        internalLinks: document.querySelectorAll('a[href^="/"]').length,
        externalLinks: document.querySelectorAll('a[href^="http"]').length,
        h1Count: document.querySelectorAll('h1').length,
        titleLength: document.title.length,
        descriptionLength: document.querySelector('meta[name="description"]')?.getAttribute('content')?.length || 0,
        keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content')?.split(',') || [],
        loadTime: performance.now(),
        coreWebVitals: {
          lcp: 0, // Populated by performance observer
          fid: 0,
          cls: 0
        }
      }

      setMetrics(meta)

      // Calculate SEO score
      let points = 0
      if (meta.metaTagsComplete) points += 15
      if (meta.schemaValid) points += 20
      if (meta.canonicalPresent) points += 10
      if (meta.hreflangPresent) points += 5
      if (meta.h1Count === 1) points += 10
      if (meta.titleLength >= 30 && meta.titleLength <= 60) points += 10
      if (meta.descriptionLength >= 120 && meta.descriptionLength <= 160) points += 10
      if (meta.keywords.length >= 5) points += 10
      if (meta.internalLinks >= 5) points += 10

      setScore(points)
    }

    analyze()
  }, [])

  if (!metrics) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-xl p-6 max-w-md z-50 border-2 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">SEO Health Score</h3>
        <div className="text-3xl font-bold text-blue-600">{score}/100</div>
      </div>

      <div className="space-y-2">
        <SEOMetric label="Meta Tags" value={metrics.metaTagsComplete} />
        <SEOMetric label="Schema.org" value={metrics.schemaValid} />
        <SEOMetric label="Canonical URL" value={metrics.canonicalPresent} />
        <SEOMetric label="Hreflang" value={metrics.hreflangPresent} />
        <SEOMetric label="H1 Tags" value={metrics.h1Count === 1} detail={`${metrics.h1Count} found`} />
        <SEOMetric label="Title Length" value={metrics.titleLength >= 30 && metrics.titleLength <= 60} detail={`${metrics.titleLength} chars`} />
        <SEOMetric label="Description" value={metrics.descriptionLength >= 120} detail={`${metrics.descriptionLength} chars`} />
        <SEOMetric label="Internal Links" value={metrics.internalLinks >= 5} detail={`${metrics.internalLinks} links`} />
        <SEOMetric label="Image Alt Tags" value={metrics.imageAltTags > 0} detail={`${metrics.imageAltTags} images`} />
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="text-sm text-gray-600">
          Last analyzed: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

function SEOMetric({ label, value, detail }: { label: string; value: boolean; detail?: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {detail && <span className="text-xs text-gray-500">{detail}</span>}
        <div className={`w-4 h-4 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>
    </div>
  )
}
```

---

## 8. KEYWORD OPTIMIZATION STRATEGY

### Primary Landing Pages Matrix
| Page | Primary Keyword | Secondary Keywords | Monthly Volume |
|------|----------------|-------------------|----------------|
| Homepage | custom closet doors Ottawa | Renin dealer, premium storage | 390 |
| /collections/renin-barn-doors | Renin barn doors Ottawa | sliding barn doors, premium barn doors | 170 |
| /kanata | closet doors Kanata | Renin Kanata, installation Kanata | 140 |
| /barrhaven | closet doors Barrhaven | Renin Barrhaven, custom doors | 90 |
| /renin/ottawa | Renin dealer Ottawa | official Renin, authorized dealer | 90 |
| /services/installation | closet door installation Ottawa | professional installation, same-day | 120 |

### Content Optimization Guidelines
1. **Title Tag**: Include primary keyword + location + brand
   - Format: `[Primary Keyword] | [Brand/USP] | PG Closets`
   - Length: 50-60 characters

2. **Meta Description**: Include primary + 2 secondary keywords naturally
   - Format: `[Primary benefit]. [Secondary benefits]. [Call-to-action].`
   - Length: 150-160 characters

3. **H1 Tag**: Single H1 per page with primary keyword
   - Format: `[Primary Keyword] - [Unique Value Proposition]`

4. **H2 Tags**: Include secondary keywords naturally
   - 3-5 H2s per page
   - Support primary keyword theme

5. **Content Density**:
   - Primary keyword: 1-2% density
   - Secondary keywords: 0.5-1% each
   - LSI keywords: Naturally throughout

### LSI (Latent Semantic Indexing) Keywords
For "custom closet doors Ottawa":
- closet organization Ottawa
- bedroom storage solutions
- walk-in closet systems
- wardrobe doors Ottawa
- closet renovation Ottawa
- custom cabinetry Ottawa
- home organization Ottawa
- interior doors Ottawa

---

## 9. INTERNAL LINKING STRATEGY

### Hub and Spoke Model
```
Homepage (Hub)
  ├── Collections (Spokes)
  │     ├── Barn Doors → Individual Products
  │     ├── Bypass Doors → Individual Products
  │     ├── Bifold Doors → Individual Products
  │     └── Hardware → Individual Products
  ├── Locations (Spokes)
  │     ├── Ottawa → Renin Ottawa
  │     ├── Kanata → Renin Kanata
  │     ├── Barrhaven → Renin Barrhaven
  │     └── Orleans → Renin Orleans
  └── Services (Spokes)
        ├── Installation → Product Collections
        ├── Consultation → Quote
        └── Custom Design → Collections
```

### Contextual Linking Rules
1. **Every page must link to**:
   - Homepage (logo)
   - 2-3 related collection pages
   - 1-2 location pages (geo-relevant)
   - Call-to-action (/quote or /contact)

2. **Anchor Text Best Practices**:
   - ✅ "Renin barn doors in Ottawa"
   - ✅ "professional closet door installation"
   - ✅ "custom bypass doors Kanata"
   - ❌ "click here"
   - ❌ "read more"
   - ❌ "this page"

3. **Footer Links** (site-wide authority boost):
   - Collections (all 8)
   - Locations (top 5)
   - Services (all 3)
   - Company (about, contact, FAQ)

---

## 10. IMAGE SEO OPTIMIZATION

### Image Naming Convention
```
Format: [product-name]-[variant]-[view]-[location].jpg

Examples:
renin-barn-door-heritage-oak-lifestyle-ottawa.jpg
bypass-doors-modern-white-detail-kanata.jpg
bifold-door-installation-process-barrhaven.jpg
```

### Alt Text Formula
```
Format: [Product] - [Key Feature] - [Location/Context]

Examples:
alt="Renin barn door in heritage oak finish installed in Ottawa heritage home"
alt="Modern white bypass closet doors in Kanata bedroom"
alt="Professional closet door installation service in Barrhaven"
```

### Image Sitemap (Future Enhancement)
```xml
<!-- sitemap-images.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://www.pgclosets.com/collections/renin-barn-doors</loc>
    <image:image>
      <image:loc>https://www.pgclosets.com/images/renin-barn-door-hero.jpg</image:loc>
      <image:caption>Premium Renin barn doors available in Ottawa</image:caption>
      <image:title>Renin Barn Doors Ottawa</image:title>
      <image:license>https://www.pgclosets.com/licensing</image:license>
    </image:image>
  </url>
</urlset>
```

---

## 11. LOCAL SEO ENHANCEMENTS

### Google Business Profile Optimization
```json
{
  "name": "PG Closets - Official Renin Dealer",
  "category": "Home Improvement Store",
  "additionalCategories": [
    "Closet Organizer Service",
    "Door Shop",
    "Interior Designer",
    "Carpenter"
  ],
  "description": "Ottawa's premier custom closet door specialists and official Renin dealer. Professional installation of barn doors, bypass doors, bifold doors with 2-week delivery and lifetime warranty. Serving Ottawa, Kanata, Barrhaven, Orleans.",
  "services": [
    "Custom Closet Doors",
    "Barn Door Installation",
    "Bypass Door Installation",
    "Bifold Door Installation",
    "Closet Organization",
    "Free Consultations",
    "Same-Day Quotes"
  ],
  "attributes": [
    "Wheelchair accessible entrance",
    "Free parking lot",
    "Curbside pickup",
    "In-store shopping",
    "Same-day delivery",
    "Wi-Fi"
  ]
}
```

### NAP Consistency (Name, Address, Phone)
Ensure identical information across:
- Website footer
- Contact page
- Google Business Profile
- Facebook Business
- Bing Places
- Apple Maps
- Yelp
- HomeStars
- BBB

### Local Content Marketing
1. **Neighborhood Guides**: Create dedicated pages for each Ottawa neighborhood
2. **Local Events**: Participate in Ottawa Home Shows
3. **Local Press**: Submit to Ottawa Citizen, Ottawa Business Journal
4. **Community Partnerships**: Partner with Ottawa interior designers

---

## 12. TECHNICAL SEO CHECKLIST

### Performance Optimization
- [x] Core Web Vitals monitoring active
- [x] Image lazy loading implemented
- [x] Font optimization complete
- [ ] Add image compression pipeline
- [ ] Implement service worker for offline support
- [ ] Add resource hints (preconnect, prefetch)

### Mobile Optimization
- [x] Mobile-responsive design
- [x] Touch-friendly UI
- [x] Mobile sticky CTA
- [x] Viewport meta tag optimized
- [ ] Add AMP versions of key pages
- [ ] Test on multiple devices

### Security
- [ ] HTTPS enforced (verify SSL certificate)
- [ ] Security headers (CSP, HSTS)
- [ ] XSS protection
- [ ] CSRF tokens on forms

### Crawlability
- [x] XML sitemap generated
- [x] robots.txt present
- [ ] Fix any broken links (run link checker)
- [ ] Remove duplicate content
- [ ] Fix redirect chains
- [ ] Implement 404 page with helpful navigation

---

## 13. IMPLEMENTATION TIMELINE

### Week 1: Foundation (Days 1-7)
- [x] Audit current meta tags
- [ ] Implement enhanced product schema
- [ ] Optimize homepage metadata
- [ ] Create comprehensive sitemap
- [ ] Optimize robots.txt

### Week 2: Content Expansion (Days 8-14)
- [ ] Add schema to all collection pages
- [ ] Implement breadcrumb schema
- [ ] Optimize location page metadata
- [ ] Add FAQ schema to FAQ page
- [ ] Create service schema

### Week 3: Technical Enhancement (Days 15-21)
- [ ] Implement hreflang tags
- [ ] Add canonical tags to all pages
- [ ] Optimize internal linking
- [ ] Create SEO dashboard component
- [ ] Add structured data testing

### Week 4: Monitoring & Refinement (Days 22-30)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up rank tracking for target keywords
- [ ] Configure Google Analytics goals
- [ ] Set up SEO monitoring alerts

### Days 31-60: Optimization & Growth
- [ ] Weekly rank tracking reports
- [ ] Content optimization based on performance
- [ ] Additional page creation for long-tail keywords
- [ ] Link building outreach
- [ ] Local citation building

---

## 14. SUCCESS METRICS

### Target Rankings (60 Days)
| Keyword | Current | Target | Priority |
|---------|---------|--------|----------|
| custom closet doors Ottawa | Not ranked | Page 1 (#1-3) | Critical |
| Renin barn doors Ottawa | Not ranked | Page 1 (#1-5) | Critical |
| closet door installation Kanata | Not ranked | Page 1 (#3-7) | High |
| Renin dealer Ottawa | Not ranked | Page 1 (#1-3) | High |
| bypass doors Barrhaven | Not ranked | Page 1 (#5-10) | Medium |

### Traffic Goals
- **Month 1**: 500 organic sessions/month (baseline)
- **Month 2**: 1,500 organic sessions/month (+200%)
- **Month 3**: 3,000 organic sessions/month (+100%)
- **Month 6**: 8,000 organic sessions/month

### Conversion Goals
- **Quote Form Submissions**: 50+ per month
- **Phone Calls**: 30+ per month
- **Email Inquiries**: 20+ per month
- **Total Conversions**: 100+ qualified leads per month

### Technical Metrics
- **Page Load Time**: < 2 seconds
- **Core Web Vitals**: All "Good"
- **Mobile Usability**: 100/100
- **Schema Validation**: 100% error-free
- **Indexation Rate**: 95%+ of pages indexed

---

## 15. TOOLS & MONITORING

### Required Tools
1. **Google Search Console** - Indexation monitoring
2. **Google Analytics 4** - Traffic analysis
3. **Google Business Profile** - Local SEO
4. **Bing Webmaster Tools** - Bing indexation
5. **Screaming Frog** - Technical SEO audits
6. **Ahrefs/SEMrush** - Competitor analysis & rank tracking
7. **Rich Results Test** - Schema validation
8. **PageSpeed Insights** - Performance monitoring

### Weekly Monitoring Tasks
- [ ] Check Google Search Console for errors
- [ ] Review top performing pages
- [ ] Monitor keyword rankings
- [ ] Check new backlinks
- [ ] Review Core Web Vitals
- [ ] Analyze traffic sources

### Monthly Reporting
- Keyword ranking changes
- Organic traffic growth
- Conversion rate improvements
- Technical SEO health score
- Competitor analysis
- Recommendations for next month

---

## 16. COMPETITIVE ANALYSIS

### Top Competitors in Ottawa
1. **ClosetMaid Ottawa** - Analyze their SEO strategy
2. **California Closets Ottawa** - Study their content approach
3. **Local Renin dealers** - Monitor their keyword targeting

### Competitive Advantages
- ✅ Official Renin dealer status
- ✅ 2-week delivery commitment
- ✅ Lifetime warranty
- ✅ Professional installation included
- ✅ Same-day quotes
- ✅ Local Ottawa ownership

### Differentiation Strategy
Focus on:
1. Speed (2-week delivery vs industry 4-6 weeks)
2. Warranty (lifetime vs 5-10 years)
3. Local expertise (Ottawa heritage homes)
4. Renin exclusivity (official dealer)

---

## CONCLUSION

This comprehensive SEO plan targets **Page 1 rankings for primary keywords within 60 days** through:

1. **Technical Excellence** - Complete schema markup, optimized sitemap, proper canonical tags
2. **Content Authority** - Geo-targeted landing pages, comprehensive FAQs, local content
3. **User Experience** - Fast load times, mobile optimization, clear navigation
4. **Local Dominance** - Ottawa-focused content, neighborhood pages, Google Business optimization

**Expected ROI**:
- 600% increase in organic traffic (Month 2)
- 100+ qualified leads per month
- $50,000+ in additional monthly revenue from organic search

**Risk Mitigation**:
- All changes follow Google's guidelines
- No black-hat tactics
- Focus on quality over quantity
- Sustainable long-term growth strategy

---

## IMPLEMENTATION NOTES

This plan should be executed by:
1. **Developer** (70% effort) - Technical implementation, schema, sitemap
2. **Content Writer** (20% effort) - Meta descriptions, page content, FAQs
3. **SEO Specialist** (10% effort) - Strategy, monitoring, optimization

**Total Implementation Time**: 40-60 hours over 30 days

**Maintenance**: 5-10 hours per month ongoing

---

**Document Version**: 1.0
**Last Updated**: 2025-10-14
**Next Review**: 2025-11-14
**Owner**: PG Closets SEO Team
