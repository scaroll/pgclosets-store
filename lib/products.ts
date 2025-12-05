import { prisma } from './prisma'
import { reninProducts } from '@/data/renin-products-integrated'

const shouldUseStaticData = !process.env.DATABASE_URL

/**
 * Get a single product by slug, with fallback to static data
 */
export async function getProduct(slug: string) {
  // Try database first if available
  if (!shouldUseStaticData) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
            parent: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
        variants: {
          orderBy: {
            name: 'asc',
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (product) {
      // Calculate average rating
      const averageRating =
        product.reviews.length > 0
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
          : 0

      return {
        ...product,
        averageRating,
        reviewCount: product.reviews.length,
      }
    }
  }

  // Fallback to static data
  return getStaticProduct(slug)
}

/**
 * Get a product from static Renin data
 */
function getStaticProduct(slug: string) {
  const product = reninProducts.find(p => p.handle === slug)

  if (!product) {
    return null
  }

  // Convert Renin product to expected format
  const price = product.variants?.[0]?.price ?? 49900

  return {
    id: product.id,
    name: product.title,
    slug: product.handle,
    description: product.description,
    shortDesc:
      product.description?.slice(0, 150) + (product.description?.length > 150 ? '...' : ''),
    price,
    salePrice: null,
    images: product.images?.map(img => img.url) ?? [product.thumbnail ?? '/placeholder.jpg'],
    inStock: true,
    stockCount: 100,
    featured: false,
    bestseller: false,
    category: product.collection
      ? {
          id: product.collection.id,
          name: product.collection.title,
          slug: product.collection.handle.replace('renin-', ''),
          parentId: null,
          parent: null,
        }
      : null,
    variants:
      product.variants?.map(v => ({
        id: v.id,
        name: v.title,
        price: v.price,
        sku: v.sku,
        inStock: true,
        stockCount: v.inventory_quantity,
      })) ?? [],
    reviews: [],
    averageRating: 4.5, // Default rating for static products
    reviewCount: 0,
    features: product.tags ?? [],
    specifications: (product.metadata?.specifications as Record<string, string>) ?? {},
    createdAt: new Date(product.created_at),
    updatedAt: new Date(product.updated_at),
  }
}

export async function getProducts(options?: {
  categoryId?: string
  featured?: boolean
  bestseller?: boolean
  limit?: number
  skip?: number
}) {
  const { categoryId, featured, bestseller, limit, skip } = options || {}

  const products = await prisma.product.findMany({
    where: {
      ...(categoryId && { categoryId }),
      ...(featured !== undefined && { featured }),
      ...(bestseller !== undefined && { bestseller }),
      inStock: true,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      reviews: {
        select: {
          rating: true,
        },
      },
    },
    take: limit,
    skip,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return products.map(product => ({
    ...product,
    averageRating:
      product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0,
    reviewCount: product.reviews.length,
  }))
}

export async function getCategories() {
  return await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(numPrice)
}
