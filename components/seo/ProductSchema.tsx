import { Product } from "@/types/commerce"

interface ProductSchemaProps {
  product: Product
  reviews?: {
    rating: number
    count: number
  }
}

export function ProductSchema({ product, reviews }: ProductSchemaProps) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    sku: `PGC-${product.title.replace(/\s+/g, '-').toUpperCase()}`,
    brand: {
      "@type": "Brand",
      name: "Renin",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Renin Corp",
      url: "https://www.renin.com"
    },
    offers: {
      "@type": "Offer",
      price: product.variants[0]?.price || 0,
      priceCurrency: "CAD",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "PG Closets",
        url: "https://pgclosets.com",
        telephone: "(613) 422-5800",
        email: "info@pgclosets.com"
      }
    },
    image: product.thumbnail ? [product.thumbnail] : [],
    category: product.collection?.title || "Closet Doors",
    ...(reviews && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviews.rating.toString(),
        reviewCount: reviews.count.toString(),
        bestRating: "5",
        worstRating: "1"
      }
    })
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}

// Breadcrumb schema for product pages
export function ProductBreadcrumbSchema({ product }: { product: Product }) {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://pgclosets.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://pgclosets.com/products"
      },
      ...(product.collection ? [{
        "@type": "ListItem",
        "position": 3,
        "name": product.collection.title,
        "item": `https://pgclosets.com/products?collection=${product.collection.handle}`
      }] : []),
      {
        "@type": "ListItem",
        "position": product.collection ? 4 : 3,
        "name": product.title,
        "item": `https://pgclosets.com/products/${product.handle}`
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  )
}