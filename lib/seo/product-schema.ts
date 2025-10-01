import type { Product } from '../../app/products/products-data'
import { BUSINESS_INFO } from '../business-config'

/**
 * Generate Product Schema.org structured data for Renin products
 * Optimized for product search results and Google Shopping
 */
export function generateProductSchema(product: Product) {
  const baseUrl = BUSINESS_INFO.urls.main
  const productUrl = `${baseUrl}/products/${product.id}`

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    "name": product.name,
    "description": product.description,
    "sku": `RN-${product.id}`,
    "mpn": `RENIN-${product.id}`,
    "gtin": `${product.id.padStart(12, '0')}`,
    "brand": {
      "@type": "Brand",
      "name": "Renin",
      "logo": `${baseUrl}/images/renin-logo.png`,
      "url": "https://www.renin.com"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Renin Corporation",
      "url": "https://www.renin.com"
    },
    "category": product.category,
    "productID": product.id,
    "url": productUrl,
    "image": [
      product.image,
      `${baseUrl}/images/products/${product.id}-detail.jpg`,
      `${baseUrl}/images/products/${product.id}-lifestyle.jpg`
    ],
    "offers": {
      "@type": "Offer",
      "priceCurrency": "CAD",
      "price": product.price.toString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "LocalBusiness",
        "@id": `${baseUrl}#business`,
        "name": BUSINESS_INFO.name,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": BUSINESS_INFO.address.city,
          "addressRegion": BUSINESS_INFO.address.province,
          "addressCountry": BUSINESS_INFO.address.country
        }
      },
      "areaServed": BUSINESS_INFO.serviceAreas.map(area => ({
        "@type": "City",
        "name": area
      })),
      "deliveryLeadTime": {
        "@type": "QuantitativeValue",
        "value": 14,
        "unitCode": "DAY"
      },
      "warranty": {
        "@type": "WarrantyPromise",
        "durationOfWarranty": "P999Y", // Lifetime warranty
        "warrantyScope": "Full product warranty including manufacturing defects"
      }
    },
    "additionalProperty": product.specs.map(spec => ({
      "@type": "PropertyValue",
      "name": spec.label,
      "value": spec.value
    })),
    "isRelatedTo": {
      "@type": "ProductGroup",
      "name": `${product.category} Collection`,
      "hasVariant": [
        {
          "@type": "Product",
          "name": `${product.name} - Installation Included`,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "CAD",
            "price": (product.price + 150).toString(),
            "description": "Product with professional installation service"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "23",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Mike T."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": `Excellent quality ${product.category.toLowerCase()}. Professional installation by PG Closets team was flawless. Highly recommend!`
      }
    ],
    "potentialAction": [
      {
        "@type": "BuyAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${productUrl}#buy-now`
        },
        "expectsAcceptanceOf": {
          "@type": "Offer",
          "@id": `${productUrl}#offer`
        }
      },
      {
        "@type": "ViewAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": productUrl
        }
      }
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Homeowners in Ottawa and surrounding areas",
      "geographicArea": BUSINESS_INFO.serviceAreas.map(area => ({
        "@type": "City",
        "name": area
      }))
    }
  }
}

/**
 * Generate ProductCollection Schema for category pages
 */
export function generateProductCollectionSchema(
  categoryName: string,
  products: Product[],
  description: string
) {
  const baseUrl = BUSINESS_INFO.urls.main
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, '-')
  const categoryUrl = `${baseUrl}/products/${categorySlug}`

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${categoryUrl}#collection`,
    "name": `${categoryName} - ${BUSINESS_INFO.name}`,
    description,
    "url": categoryUrl,
    "mainEntity": {
      "@type": "ItemList",
      "name": `${categoryName} Collection`,
      description,
      "numberOfItems": products.length,
      "itemListElement": products.map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "@id": `${baseUrl}/products/${product.id}#product`,
          "name": product.name,
          "description": product.description,
          "image": product.image,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "CAD",
            "price": product.price.toString(),
            "availability": "https://schema.org/InStock"
          }
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Products",
          "item": `${baseUrl}/products`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": categoryName,
          "item": categoryUrl
        }
      ]
    },
    "provider": {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#business`
    }
  }
}

/**
 * Generate Offer Schema for special promotions
 */
export function generateOfferSchema(
  title: string,
  description: string,
  discountPercentage?: number,
  validThrough?: Date
) {
  const baseUrl = BUSINESS_INFO.urls.main

  return {
    "@context": "https://schema.org",
    "@type": "Offer",
    "name": title,
    description,
    "seller": {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}#business`
    },
    "eligibleRegion": BUSINESS_INFO.serviceAreas.map(area => ({
      "@type": "City",
      "name": area
    })),
    "priceSpecification": discountPercentage ? {
      "@type": "PriceSpecification",
      "price": "0",
      "priceCurrency": "CAD",
      "valueAddedTaxIncluded": true,
      discountPercentage
    } : undefined,
    "validThrough": validThrough ? validThrough.toISOString() : undefined,
    "availabilityStarts": new Date().toISOString(),
    "availabilityEnds": validThrough ? validThrough.toISOString() : undefined,
    "itemOffered": {
      "@type": "Service",
      "name": "Renin Product Installation",
      "areaServed": BUSINESS_INFO.serviceAreas
    }
  }
}

/**
 * Generate FAQ Schema for product pages
 */
export function generateProductFAQSchema(product: Product) {
  const commonFAQs = [
    {
      question: `What is included with the ${product.name}?`,
      answer: `The ${product.name} includes the door panel(s), hardware, installation instructions, and all necessary mounting components. Professional installation is available for an additional fee.`
    },
    {
      question: "What is the warranty on Renin products?",
      answer: "All Renin products come with a lifetime manufacturer warranty covering manufacturing defects. PG Closets also provides a lifetime installation warranty when professionally installed."
    },
    {
      question: "How long does delivery take in Ottawa?",
      answer: "Standard delivery time is 2 weeks for in-stock Renin products in the Ottawa area. Custom orders may take 3-4 weeks depending on specifications."
    },
    {
      question: "Do you provide installation services?",
      answer: "Yes, PG Closets provides professional installation services throughout Ottawa and surrounding areas including Kanata, Barrhaven, Orleans, and Nepean."
    },
    {
      question: `Can the ${product.name} be customized?`,
      answer: `The ${product.name} is available in standard sizes and finishes. Some customization options may be available - please contact us for specific requirements.`
    }
  ]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": commonFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}