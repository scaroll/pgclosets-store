// @ts-nocheck - Product schema Decimal type issues
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.product.groupBy({
      by: ['category'],
      where: {
        status: 'active'
      },
      _count: {
        id: true
      },
      orderBy: {
        category: 'asc'
      }
    });

    const formattedCategories = categories.map(cat => ({
      name: cat.category,
      slug: cat.category.toLowerCase().replace(/\s+/g, '-'),
      count: cat._count.id,
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('[CATEGORIES_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}