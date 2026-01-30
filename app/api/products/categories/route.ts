import { type NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const maxDuration = 30

// Type definitions
interface ProductCategory {
  name: string
  slug: string
  count: number
}
export async function GET(_req: NextRequest) {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: {
        status: 'active',
      },
      _count: {
        id: true,
      },
      orderBy: {
        category: 'asc',
      },
    })
    const formattedCategories: ProductCategory[] = categories.map(cat => ({
      name: cat.category,
      slug: cat.category.toLowerCase().replace(/\s+/g, '-'),
      count: cat._count.id,
    }))
    return NextResponse.json(formattedCategories)
  } catch (error) {
    console.error('[CATEGORIES_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
