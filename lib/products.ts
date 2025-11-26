import { prisma } from './prisma'

export async function getProduct(slug: string) {
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

  if (!product) {
    return null
  }

  // Calculate average rating
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
        product.reviews.length
      : 0

  return {
    ...product,
    averageRating,
    reviewCount: product.reviews.length,
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

  return products.map((product) => ({
    ...product,
    averageRating:
      product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          product.reviews.length
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
