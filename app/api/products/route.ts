import { SAMPLE_PRODUCTS as products } from '@/lib/products'
import { NextResponse } from 'next/server'

// Type definitions
interface ProductVariant {
  id: string
  title: string
  sku: string
  price: number
  inventory_quantity: number
}

export interface ProductTag {
  value: string
  count: number
}

interface ProductCollection {
  id: string
  title: string
  handle: string
}

interface FormattedProduct {
  id: string
  title: string
  handle: string
  description: string
  thumbnail: string
  created_at: string
  updated_at: string
  images: Array<{ url: string; altText: string }>
  variants: ProductVariant[]
  tags: string[]
  collection: ProductCollection
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const collectionTitle = searchParams.get('collection')
  const limit = searchParams.get('limit')

  try {
    let filteredProducts = [...products]

    // Filter by search query
    if (query) {
      const searchTerm = query.toLowerCase()
      filteredProducts = filteredProducts.filter(
        product =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by collection/category
    if (collectionTitle && collectionTitle !== 'All Categories') {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === collectionTitle.toLowerCase()
      )
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit)
      if (!isNaN(limitNum)) {
        filteredProducts = filteredProducts.slice(0, limitNum)
      }
    }

    // Transform to match the expected API response format
    const formattedProducts: FormattedProduct[] = filteredProducts.map(product => ({
      id: product.id,
      title: product.name,
      handle: product.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
      description: product.description,
      thumbnail: product.images?.[0] || '/placeholder.jpg',
      created_at: new Date().toISOString(), // Mock date
      updated_at: new Date().toISOString(), // Mock date
      images: product.images?.map(img => ({ url: img, altText: product.name })) || [
        { url: '/placeholder.jpg', altText: product.name },
      ],
      variants: [
        {
          id: `${product.id}-variant`,
          title: 'Default',
          sku: product.id,
          price: product.price,
          inventory_quantity: 100, // Assume in stock
        },
      ],
      tags: [product.category],
      collection: {
        id: product.category,
        title: product.category,
        handle: product.category.toLowerCase().replace(/\s+/g, '-'),
      },
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error) {
    console.error('[PRODUCTS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
