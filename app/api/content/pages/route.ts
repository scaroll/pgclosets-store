import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
// Type definitions
type PageStatus = 'draft' | 'published'
interface PageWhereInput {
  status?: PageStatus
  slug?: string
}
const createPageSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(['draft', 'published']).default('published'),
})
const updatePageSchema = createPageSchema.partial()
// GET /api/content/pages - Get all pages
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const slug = searchParams.get('slug')
    const where: PageWhereInput = {}
    if (status) where.status = status as PageStatus
    if (slug) where.slug = slug
    const pages = await prisma.page.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Don't include content in list view unless specifically requested
        ...(searchParams.has('includeContent') && { content: true }),
      },
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('[PAGES_GET_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// POST /api/content/pages - Create new page
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    // Only allow authenticated users with admin role
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 })
    }
    const body = await req.json()
    const validated = createPageSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }
    const { slug, title, content, metaTitle, metaDescription, status } = validated.data
    // Check if slug already exists
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    })
    if (existingPage) {
      return NextResponse.json({ error: 'Page with this slug already exists' }, { status: 409 })
    }
    const page = await prisma.page.create({
      data: {
        slug,
        title,
        content,
        metaTitle,
        metaDescription,
        status,
      },
    })
    return NextResponse.json({
      success: true,
      page,
      message: 'Page created successfully',
    })
  } catch (error) {
    console.error('[PAGE_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// PUT /api/content/pages - Update page
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    // Only allow authenticated users with admin role
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 })
    }
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 })
    }
    const body = await req.json()
    const validated = updatePageSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }
    const page = await prisma.page.update({
      where: { id },
      data: validated.data,
    })
    return NextResponse.json({
      success: true,
      page,
      message: 'Page updated successfully',
    })
  } catch (error) {
    console.error('[PAGE_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
