import { prisma } from './db/client'

export async function getProduct(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { position: 'asc' },
      },
      variants: {
        orderBy: { name: 'asc' },
      },
    },
  })

  if (!product) {
    return null
  }

  return product
}

export async function getProducts(options?: {
  category?: string
  featured?: boolean
  limit?: number
  skip?: number
}) {
  const { category, featured, limit, skip } = options || {}

  const products = await prisma.product.findMany({
    where: {
      ...(category && { category }),
      ...(featured !== undefined && { featured }),
      status: 'active',
    },
    include: {
      images: {
        take: 1,
        orderBy: { position: 'asc' },
      },
    },
    take: limit,
    skip,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return products
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(numPrice / 100) // Price is stored in cents
}
