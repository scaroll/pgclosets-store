import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const idSchema = z.string().cuid();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const validated = idSchema.safeParse(id);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: validated.data,
        status: 'active'
      },
      include: {
        images: {
          orderBy: { position: 'asc' }
        },
        variants: true,
        reviews: {
          where: { status: 'approved' },
          include: {
            user: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const averageRating = product.reviews.length > 0
      ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
      : 0;

    const formattedProduct = {
      ...product,
      price: product.price / 100, // Convert from cents to dollars
      salePrice: product.salePrice ? product.salePrice / 100 : null,
      compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null,
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: product.reviews.length,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('[PRODUCT_GET_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}