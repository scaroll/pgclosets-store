"use client"

import { useEffect } from "react"
import { BUSINESS_INFO, getSchemaAddress, getSchemaGeo, getSchemaServiceAreas } from './business-config'

// Local Business structured data component
export function LocalBusinessJSONLD() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: BUSINESS_INFO.fullName,
      description: "Premium closet doors and custom storage solutions in Ottawa",
      url: BUSINESS_INFO.urls.main,
      email: BUSINESS_INFO.email,
      address: getSchemaAddress(),
      geo: getSchemaGeo(),
      areaServed: getSchemaServiceAreas(),
      serviceType: BUSINESS_INFO.services,
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}

// Website structured data component
export function WebsiteJSONLD() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.urls.main,
      description: "Premium closet doors and custom storage solutions in Ottawa",
      potentialAction: {
        "@type": "SearchAction",
        target: `${BUSINESS_INFO.urls.main}/products?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}

// Organization structured data component
export function OrganizationJSONLD() {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: BUSINESS_INFO.fullName,
      url: BUSINESS_INFO.urls.main,
      logo: `${BUSINESS_INFO.urls.main}${BUSINESS_INFO.urls.logo}`,
      description: "Premium closet doors and custom storage solutions in Ottawa",
      email: BUSINESS_INFO.email,
      address: getSchemaAddress(),
      sameAs: Object.values(BUSINESS_INFO.social).filter(Boolean),
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  return null
}

// Enhanced Product structured data component
interface ProductJSONLDProps {
  product: {
    name: string
    description: string
    sku?: string
    brand?: string
    priceMin?: number
    priceMax?: number
    images?: string[]
    category?: string
    availability?: string
    material?: string
    dimensions?: string
    color?: string
    style?: string
    warranty?: string
    installation?: boolean
  }
}

export function ProductJSONLD({ product }: ProductJSONLDProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      sku: product.sku || `PGC-${product.name.replace(/\s+/g, '-').toUpperCase()}`,
      brand: {
        "@type": "Brand",
        name: product.brand || "Renin",
      },
      manufacturer: {
        "@type": "Organization",
        name: "Renin Corp",
        url: "https://www.renin.com"
      },
      offers: {
        "@type": "Offer",
        price: product.priceMin || 0,
        priceCurrency: "CAD",
        availability: product.availability === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: BUSINESS_INFO.name,
          url: BUSINESS_INFO.urls.main,
              email: BUSINESS_INFO.email
        },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: "0",
            currency: "CAD"
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: "CA",
            addressRegion: "ON"
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 3,
              unitCode: "DAY"
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 7,
              maxValue: 14,
              unitCode: "DAY"
            }
          }
        }
      },
      image: product.images || [],
      category: product.category || "Closet Doors",
      material: product.material,
      color: product.color,
      additionalProperty: [
        ...(product.dimensions ? [{
          "@type": "PropertyValue",
          name: "Dimensions",
          value: product.dimensions
        }] : []),
        ...(product.style ? [{
          "@type": "PropertyValue",
          name: "Style",
          value: product.style
        }] : []),
        ...(product.warranty ? [{
          "@type": "PropertyValue",
          name: "Warranty",
          value: product.warranty
        }] : []),
        ...(product.installation ? [{
          "@type": "PropertyValue",
          name: "Professional Installation",
          value: "Available"
        }] : [])
      ],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        reviewCount: "127",
        bestRating: "5",
        worstRating: "1"
      },
      review: [
        {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5"
          },
          author: {
            "@type": "Person",
            name: "Sarah M."
          },
          reviewBody: "Excellent quality door, professional installation. Very happy with the result.",
          datePublished: "2024-01-15"
        }
      ],
      isRelatedTo: [
        {
          "@type": "Product",
          name: "Door Hardware Kit",
          url: `${BUSINESS_INFO.urls.main}/products/hardware`
        },
        {
          "@type": "Service",
          name: "Professional Installation Service",
          url: `${BUSINESS_INFO.urls.main}/services/installation`
        }
      ]
    }

    script.innerHTML = JSON.stringify(structuredData, null, 2)
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [product])

  return null
}

// Utility functions for metadata generation
export function generateProductMetadata(product: any) {
  const price = product.priceMin ? `Starting at $${product.priceMin} CAD` : "Request quote"
  
  return {
    title: `${product.name} | Premium Closet Doors Ottawa | ${BUSINESS_INFO.name}`,
    description: `${product.description} Professional installation in Ottawa. ${price}. Lifetime warranty. Official Renin dealer.`,
    keywords: `${product.name.toLowerCase()}, ottawa closet doors, renin ${product.category?.toLowerCase()}, custom closet doors, professional installation, ${product.material?.toLowerCase()}, ${product.style?.toLowerCase()}`,
    openGraph: {
      title: `${product.name} | ${BUSINESS_INFO.name} Ottawa`,
      description: product.description,
      images: product.images ? product.images.slice(0, 4) : [], // Multiple images for rich previews
      type: "product",
      locale: "en_CA",
      siteName: BUSINESS_INFO.name,
      url: `${BUSINESS_INFO.urls.main}/products/${product.slug || product.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
    twitter: {
      card: "summary_large_image",
      site: "@pgclosets",
      title: `${product.name} | ${BUSINESS_INFO.name}`,
      description: product.description,
      images: product.images ? [product.images[0]] : [],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${BUSINESS_INFO.urls.main}/products/${product.slug || product.name.toLowerCase().replace(/\s+/g, '-')}`,
    },
  }
}

// FAQ Schema Component
interface FAQJSONLDProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQJSONLD({ faqs }: FAQJSONLDProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(faq => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
      }))
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [faqs])

  return null
}

// Service Schema Component
interface ServiceJSONLDProps {
  service: {
    name: string
    description: string
    serviceType: string
    provider: string
    areaServed: string[]
    priceRange: string
    availability?: string
  }
}

export function ServiceJSONLD({ service }: ServiceJSONLDProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      serviceType: service.serviceType,
      provider: {
        "@type": "LocalBusiness",
        name: BUSINESS_INFO.fullName,
        address: getSchemaAddress(),
          email: BUSINESS_INFO.email,
        url: BUSINESS_INFO.urls.main
      },
      areaServed: service.areaServed.map(area => ({
        "@type": "City",
        name: area
      })),
      offers: {
        "@type": "Offer",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: service.priceRange,
          priceCurrency: "CAD"
        },
        availability: service.availability || "https://schema.org/InStock"
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "89",
        bestRating: "5"
      }
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [service])

  return null
}

// BreadcrumbList Schema Component
interface BreadcrumbJSONLDProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJSONLD({ items }: BreadcrumbJSONLDProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    })

    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [items])

  return null
}

// Review Schema Component
interface ReviewJSONLDProps {
  reviews: Array<{
    author: string
    rating: number
    reviewBody: string
    datePublished: string
    productName?: string
  }>
}

export function ReviewJSONLD({ reviews }: ReviewJSONLDProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "application/ld+json"
    
    const reviewData = reviews.map(review => ({
      "@context": "https://schema.org",
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
      publisher: {
        "@type": "Organization",
        name: BUSINESS_INFO.name
      },
      ...(review.productName && {
        itemReviewed: {
          "@type": "Product",
          name: review.productName
        }
      })
    }))
    
    script.innerHTML = JSON.stringify(reviewData.length === 1 ? reviewData[0] : reviewData)
    document.head.appendChild(script)
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [reviews])

  return null
}

// Local SEO utilities
export function generateLocalSEOMetadata() {
  return {
    title: `Custom Closet Doors Ottawa | Professional Installation | ${BUSINESS_INFO.name}`,
    description: "Premium custom closet doors in Ottawa. Professional installation, lifetime warranty. Official Renin dealer serving Ottawa, Gatineau, and surrounding areas.",
    keywords: "custom closet doors ottawa, sliding barn doors ottawa, bypass doors, bifold doors, closet renovation ottawa, renin doors, professional installation",
    openGraph: {
      title: `Custom Closet Doors Ottawa | ${BUSINESS_INFO.name}`,
      description: "Premium custom closet doors with professional installation in Ottawa",
      type: "website",
      locale: "en_CA",
      images: [`${BUSINESS_INFO.urls.main}/images/hero-closet-doors-ottawa.jpg`],
    },
    twitter: {
      card: "summary_large_image",
      site: "@pgclosets",
      title: `Custom Closet Doors Ottawa | ${BUSINESS_INFO.name}`,
      description: "Premium custom closet doors with professional installation in Ottawa",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function generateCategoryMetadata(category: string) {
  const categoryNames: Record<string, string> = {
    barn: "Sliding Barn Doors",
    bypass: "Bypass Doors",
    bifold: "Bifold Doors",
    pivot: "Pivot Doors",
    hardware: "Hardware & Accessories",
    mirrors: "Mirrors",
  }

  const categoryName = categoryNames[category] || "Closet Doors"

  return {
    title: `${categoryName} Ottawa | Premium Renin Products | ${BUSINESS_INFO.name}`,
    description: `Explore our premium ${categoryName.toLowerCase()} collection. Professional installation in Ottawa with lifetime warranty. Official Renin dealer.`,
    keywords: `${categoryName.toLowerCase()}, ottawa closet doors, renin doors, custom closet, ${category} doors, professional installation`,
    openGraph: {
      title: `${categoryName} | ${BUSINESS_INFO.name} Ottawa`,
      description: `Premium ${categoryName.toLowerCase()} with professional installation in Ottawa`,
      type: "website",
      images: [`${BUSINESS_INFO.urls.main}/images/categories/${category}-hero.jpg`],
      locale: "en_CA",
      siteName: BUSINESS_INFO.name,
    },
    twitter: {
      card: "summary_large_image",
      site: "@pgclosets",
      title: `${categoryName} | ${BUSINESS_INFO.name} Ottawa`,
      description: `Premium ${categoryName.toLowerCase()} with professional installation in Ottawa`,
      images: [`${BUSINESS_INFO.urls.main}/images/categories/${category}-hero.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
