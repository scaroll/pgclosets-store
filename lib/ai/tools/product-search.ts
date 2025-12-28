import { prisma } from '@/lib/db/client'
import { tool } from 'ai'
import { z } from 'zod'

export const productSearchTool = tool({
  description: 'Search for products by name, category, or description',
  parameters: z.object({
    query: z.string().optional().describe('Search query string'),
    category: z.string().optional().describe('Product category filter'),
    maxPrice: z.number().optional().describe('Maximum price in cents'),
    limit: z.number().default(5).describe('Number of results to return'),
  }),
  execute: async ({ query, category, maxPrice, limit = 5 }) => {
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
    } catch (error) {
      console.error('Product search error:', error)
      return { error: 'Failed to search products' }
    }
  },
})
