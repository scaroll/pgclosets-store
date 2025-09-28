"use client"

import Script from 'next/script'

interface ProductSchemaProps {
  product: {
    id: string | number
    name: string
    description: string
    price: number
    originalPrice?: number
    currency?: string
    brand?: string
    category?: string
    images: string[]
    sku?: string
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
    condition?: 'New' | 'Used' | 'Refurbished'
    rating?: number
    reviewCount?: number
    weight?: string
    dimensions?: {
      length?: string
      width?: string
      height?: string
    }
    material?: string
    color?: string
    warranty?: string
  }
  businessInfo?: {
    name: string
    url: string
  }
}

/**
 * Enhanced Product Schema Component
 * Generates comprehensive structured data for products
 */
export function EnhancedProductSchema({
  product,
  businessInfo = { name: "PG Closets", url: "https://www.pgclosets.com" }
}: ProductSchemaProps) {
  const baseUrl = businessInfo.url

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${baseUrl}/products/${product.id}`,
    "name": product.name,
    "description": product.description,
    "image": product.images.map(img =>
      img.startsWith('http') ? img : `${baseUrl}${img}`
    ),
    "brand": {
      "@type": "Brand",
      "name": product.brand || "Renin"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": product.brand || "Renin"
    },
    "sku": product.sku || `PG-${product.id}`,
    "mpn": product.sku || `PG-${product.id}`,
    "category": product.category || "Closet Doors",
    "productID": product.id,
    "url": `${baseUrl}/products/${product.id}`,

    // Offers information
    "offers": {
      "@type": "Offer",
      "url": `${baseUrl}/products/${product.id}`,
      "priceCurrency": product.currency || "CAD",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      "availability": `https://schema.org/${product.availability || 'InStock'}`,
      "itemCondition": `https://schema.org/${product.condition || 'New'}Condition`,
      "seller": {
        "@type": "Organization",
        "name": businessInfo.name,
        "url": businessInfo.url
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Ottawa",
          "addressRegion": "ON",
          "addressCountry": "CA"
        },
        {
          "@type": "City",
          "name": "Kanata",
          "addressRegion": "ON",
          "addressCountry": "CA"
        },
        {
          "@type": "City",
          "name": "Barrhaven",
          "addressRegion": "ON",
          "addressCountry": "CA"
        }
      ],
      "deliveryLeadTime": {
        "@type": "QuantitativeValue",
        "minValue": 10,
        "maxValue": 14,
        "unitCode": "DAY"
      },
      "warranty": {
        "@type": "WarrantyPromise",
        "durationOfWarranty": product.warranty || "P999Y", // Lifetime warranty
        "warrantyScope": "Full product and installation warranty"
      }
    },

    // Additional product properties
    ...(product.weight && {
      "weight": {
        "@type": "QuantitativeValue",
        "value": product.weight
      }
    }),

    ...(product.dimensions && {
      "depth": product.dimensions.length && {
        "@type": "QuantitativeValue",
        "value": product.dimensions.length
      },
      "width": product.dimensions.width && {
        "@type": "QuantitativeValue",
        "value": product.dimensions.width
      },
      "height": product.dimensions.height && {
        "@type": "QuantitativeValue",
        "value": product.dimensions.height
      }
    }),

    ...(product.material && {
      "material": product.material
    }),

    ...(product.color && {
      "color": product.color
    }),

    // Ratings and reviews
    ...(product.rating && product.reviewCount && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount,
        "bestRating": 5,
        "worstRating": 1
      }
    }),

    // Additional properties for closet doors
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Installation Service",
        "value": "Professional installation included"
      },
      {
        "@type": "PropertyValue",
        "name": "Service Area",
        "value": "Ottawa and surrounding areas"
      },
      {
        "@type": "PropertyValue",
        "name": "Delivery Time",
        "value": "2-week delivery guarantee"
      }
    ],

    // Keywords for better discovery
    "keywords": [
      "closet doors ottawa",
      "custom closet doors",
      product.brand?.toLowerCase() || "renin",
      product.category?.toLowerCase() || "closet doors",
      "home improvement",
      "interior doors"
    ].join(", ")
  }

  return (
    <Script
      id={`product-schema-${product.id}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

/**
 * Product Collection Schema
 * For product listing pages
 */
interface ProductCollectionSchemaProps {
  products: Array<{
    id: string | number
    name: string
    price: number
    image?: string
    url?: string
  }>
  collectionName: string
  collectionDescription?: string
}

export function ProductCollectionSchema({
  products,
  collectionName,
  collectionDescription
}: ProductCollectionSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": collectionName,
    "description": collectionDescription || `Browse our ${collectionName.toLowerCase()} collection`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "@id": `https://www.pgclosets.com/products/${product.id}`,
          "name": product.name,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "CAD"
          },
          ...(product.image && {
            "image": product.image.startsWith('http')
              ? product.image
              : `https://www.pgclosets.com${product.image}`
          })
        }
      }))
    }
  }

  return (
    <Script
      id="product-collection-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}

/**
 * Service Schema for installation services
 */
interface ServiceSchemaProps {
  serviceName: string
  description: string
  price?: number
  areaServed?: string[]
}

export function ServiceSchema({
  serviceName,
  description,
  price,
  areaServed = ["Ottawa", "Kanata", "Barrhaven", "Orleans", "Nepean"]
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "PG Closets",
      "url": "https://www.pgclosets.com"
    },
    "areaServed": areaServed.map(area => ({
      "@type": "City",
      "name": area,
      "addressRegion": "ON",
      "addressCountry": "CA"
    })),
    "serviceType": "Home Improvement",
    "category": "Closet Installation",
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": "CAD"
      }
    }),
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Warranty",
        "value": "Lifetime warranty on installation"
      },
      {
        "@type": "PropertyValue",
        "name": "Delivery Time",
        "value": "2-week delivery guarantee"
      }
    ]
  }

  return (
    <Script
      id="service-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  )
}