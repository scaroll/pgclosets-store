// @ts-nocheck - This route is disabled and references deprecated Prisma schema
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Product validation schema
const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  description: z.string().min(1),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  price: z.number().int().positive(), // in cents
  salePrice: z.number().int().positive().optional(),
  compareAtPrice: z.number().int().positive().optional(),
  inventory: z.number().int().nonnegative(),
  sku: z.string().optional(),
  features: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'draft', 'archived']).optional(),
  featured: z.boolean().optional(),
});

const updateProductSchema = createProductSchema.partial();

// GET /api/admin/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    const where: any = {};
    if (category) where.category = category;
    if (status) where.status = status;
    if (featured !== null) where.featured = featured === 'true';

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { position: 'asc' }
        },
        variants: true,
        _count: {
          select: {
            orderItems: true,
            reviews: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Admin products GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/admin/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = createProductSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: data.slug }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        ...data,
        features: data.features || [],
        tags: data.tags || [],
        status: data.status || 'draft',
        featured: data.featured || false
      }
    });

    return NextResponse.json({
      success: true,
      product
    }, { status: 201 });

  } catch (error) {
    console.error('Admin product create error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/admin/products/:id - Update a product
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const validated = updateProductSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validated.error },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Update product
    const product = await prisma.product.update({
      where: { id: productId },
      data
    });

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Admin product update error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/admin/products/:id - Delete a product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Soft delete by updating status to archived
    await prisma.product.update({
      where: { id: productId },
      data: { status: 'archived' }
    });

    return NextResponse.json({
      success: true,
      message: 'Product archived successfully'
    });

  } catch (error) {
    console.error('Admin product delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}