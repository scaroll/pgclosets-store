import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'
// Type definitions
interface FeaturedProduct {
  id: string
  name: string
  slug: string
  description: string
  category: string
  price: number
  salePrice: number | null
  compareAtPrice: number | null
  image: string
  altText: string
  sku: string
  inventory: number
  tags: string[]
  rating: number
  reviewCount: number
}
const featuredQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val) : 10)),
  category: z.string().optional(),
})
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = featuredQuerySchema.safeParse(Object.fromEntries(searchParams))
    if (!query.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
    }
    const { limit, category } = query.data
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        status: 'active',
        ...(category && { category }),
      },
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1,
        },
        variants: {
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
    })
    const formattedProducts: FeaturedProduct[] = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      category: product.category,
      price: product.price / 100,
      salePrice: product.salePrice ? product.salePrice / 100 : null,
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null,
      image: product.images[0]?.url || '/placeholder.svg',
      altText: product.images[0]?.alt || product.name,
      sku: product.sku,
      inventory: product.inventory,
      tags: product.tags,
      rating: 0, // TODO: Calculate from reviews
      reviewCount: 0, // TODO: Count from reviews
    }))
    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('[FEATURED_PRODUCTS_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
