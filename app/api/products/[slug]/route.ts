import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const slugSchema = z.string().min(1).max(255);

function isCuid(str: string): boolean {
  // CUID pattern: starts with 'c' followed by alphanumeric characters, typically 25 chars
  return /^c[a-z0-9]{24}$/.test(str);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const validated = slugSchema.safeParse(slug);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid product slug' },
        { status: 400 }
      );
    }

    let product = null;

    // Try to find by ID if it looks like a CUID, otherwise by handle
    if (isCuid(validated.data)) {
      // Search by database ID
      product = await prisma.product.findUnique({
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
    } else {
      // Search by handle
      product = await prisma.product.findUnique({
        where: {
          handle: validated.data,
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
    }

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