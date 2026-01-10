/**
 * ProductSchema Component
 * Renders JSON-LD structured data for product pages
 */

import { getProductSchema, renderSchema } from '@/lib/seo/schemas'

export interface ProductSchemaProps {
  product: {
    id: string
    name: string
    description: string
    price?: number
    currency?: string
    brand?: string
    image?: string
    category?: string
    sku?: string
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
    rating?: {
      value: number
      count: number
    }
  }
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = getProductSchema(product)

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD schema from trusted source via renderSchema
      dangerouslySetInnerHTML={renderSchema(schema)}
    />
  )
}

/**
 * Helper component for multiple products (product listing pages)
 */
export interface ProductListSchemaProps {
  products: Array<{
    id: string
    name: string
    description: string
    price?: number
    currency?: string
    brand?: string
    image?: string
    category?: string
    sku?: string
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
    rating?: {
      value: number
      count: number
    }
  }>
}

export function ProductListSchema({ products }: ProductListSchemaProps) {
  return (
    <>
      {products.map(product => (
        <ProductSchema key={product.id} product={product} />
      ))}
    </>
  )
}
