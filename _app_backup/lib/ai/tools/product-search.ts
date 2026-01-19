import { prisma } from '@/lib/db/client'
import { tool } from 'ai'
import { z } from 'zod'

const productSearchSchema = z.object({
  query: z.string().optional().describe('Search query string'),
  category: z.string().optional().describe('Product category filter'),
  maxPrice: z.number().optional().describe('Maximum price in cents'),
  limit: z.number().default(5).describe('Number of results to return'),
})

export const productSearchTool = tool({
  description: 'Search for products by name, category, or description',
  inputSchema: productSearchSchema,
  execute: async input => {
    const { query, category, maxPrice, limit = 5 } = input
    try {
      const products = await prisma.product.findMany({
        where: {
          status: 'active',
          ...(category && { category }),
          ...(maxPrice && { price: { lte: maxPrice } }),
          ...(query && {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
            ],
          }),
        },
        include: {
          images: { take: 1, orderBy: { position: 'asc' } },
        },
        take: limit,
      })

      return { products }
    } catch {
      return { error: 'Failed to search products' }
    }
  },
})

export const searchProductsTool = productSearchTool

const getProductDetailsSchema = z.object({
  productId: z.string().describe('Product ID'),
})

export const getProductDetailsTool = tool({
  description: 'Get detailed information about a specific product',
  inputSchema: getProductDetailsSchema,
  execute: async input => {
    const { productId } = input
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: {
          images: { orderBy: { position: 'asc' } },
          variants: true,
        },
      })

      if (!product) {
        return { error: 'Product not found' }
      }

      return { product }
    } catch {
      return { error: 'Failed to get product details' }
    }
  },
})

const compareProductsSchema = z.object({
  productIds: z.array(z.string()).min(2).describe('Product IDs to compare'),
})

export const compareProductsTool = tool({
  description: 'Compare multiple products side by side',
  inputSchema: compareProductsSchema,
  execute: async input => {
    const { productIds } = input
    try {
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: {
          images: { take: 1, orderBy: { position: 'asc' } },
        },
      })

      return { products }
    } catch {
      return { error: 'Failed to compare products' }
    }
  },
})

const recommendProductsSchema = z.object({
  category: z.string().optional().describe('Product category preference'),
  budget: z.number().optional().describe('Maximum budget in cents'),
  features: z.array(z.string()).optional().describe('Required features'),
  limit: z.number().default(3).describe('Number of recommendations'),
})

export const recommendProductsTool = tool({
  description: 'Recommend products based on project requirements',
  inputSchema: recommendProductsSchema,
  execute: async input => {
    const { category, budget, features, limit = 3 } = input
    try {
      const products = await prisma.product.findMany({
        where: {
          status: 'active',
          ...(category && { category }),
          ...(budget && { price: { lte: budget } }),
          ...(features && { features: { hasSome: features } }),
        },
        include: {
          images: { take: 1, orderBy: { position: 'asc' } },
        },
        take: limit,
      })

      return { products }
    } catch {
      return { error: 'Failed to recommend products' }
    }
  },
})
