/**
 * Product Schema Generator
 * Creates structured data for individual product pages
 */

import { BUSINESS_INFO } from '../business-config'

export interface ProductSchemaInput {
  name: string
  description: string
  image: string
  sku?: string
  brand?: string
  category: string
  price?: number
  availability?: 'InStock' | 'PreOrder' | 'OutOfStock'
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition'
  url: string
  reviews?: {
    ratingValue: number
    reviewCount: number
  }
}

export interface ProductSchema {
  '@context': string
  '@type': string
  name: string
  description: string
  image: string | string[]
  sku?: string
  brand: {
    '@type': string
    name: string
  }
  category: string
  offers: {
    '@type': string
    url: string
    priceCurrency: string
    price?: number
    availability: string
    seller: {
      '@type': string
      name: string
    }
  }
  aggregateRating?: {
    '@type': string
    ratingValue: number
    reviewCount: number
  }
  itemCondition?: string
}

/**
 * Generate Product structured data
 */
export function generateProductSchema(product: ProductSchemaInput): ProductSchema {
  const schema: ProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Renin',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: 'CAD',
      availability: `https://schema.org/${product.availability || 'InStock'}`,
      seller: {
        '@type': 'Organization',
        name: BUSINESS_INFO.name,
      },
    },
  }

  // Add optional fields
  if (product.sku) {
    schema.sku = product.sku
  }

  if (product.price) {
    schema.offers.price = product.price
  }

  if (product.condition) {
    schema.itemCondition = `https://schema.org/${product.condition}`
  }

  if (product.reviews && product.reviews.reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.reviews.ratingValue,
      reviewCount: product.reviews.reviewCount,
    }
  }

  return schema
}

/**
 * Generate JSON-LD script tag for Product
 */
export function generateProductScriptTag(product: ProductSchemaInput): string {
  const schema = generateProductSchema(product)
  return JSON.stringify(schema)
}

/**
 * Generate Product Collection schema for category pages
 */
export function generateProductCollectionSchema(
  category: string,
  products: ProductSchemaInput[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category} Closet Doors`,
    description: `Browse our collection of ${category} closet doors with professional installation across Ottawa.`,
    url: `${BUSINESS_INFO.urls.main}/products/${category}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: generateProductSchema(product),
      })),
    },
  }
}

/**
 * Generate JSON-LD script tag for Product Collection
 */
export function generateProductCollectionScriptTag(
  category: string,
  products: ProductSchemaInput[]
): string {
  const schema = generateProductCollectionSchema(category, products)
  return JSON.stringify(schema)
}
