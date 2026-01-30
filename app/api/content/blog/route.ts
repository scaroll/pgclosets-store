import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export const maxDuration = 30

// Type definitions
type BlogPostStatus = 'draft' | 'published'
interface BlogPostWhereInput {
  status?: BlogPostStatus
  slug?: string
  tags?: { has: string }
  featured?: boolean
}
const createBlogPostSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
})
const updateBlogPostSchema = createBlogPostSchema.partial()
// GET /api/content/blog - Get blog posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const slug = searchParams.get('slug')
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const featured = searchParams.get('featured') === 'true'
    const where: BlogPostWhereInput = {}
    if (status) where.status = status as BlogPostStatus
    if (slug) where.slug = slug
    if (tag) where.tags = { has: tag }
    if (featured) where.featured = true
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          content: true,
          coverImage: true,
          author: true,
          tags: true,
          metaTitle: true,
          metaDescription: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ])
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('[BLOG_GET_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// POST /api/content/blog - Create new blog post
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    // Only allow authenticated users with admin role
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 })
    }
    const body = await req.json()
    const validated = createBlogPostSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }
    const {
      slug,
      title,
      excerpt,
      content,
      coverImage,
      author,
      tags,
      metaTitle,
      metaDescription,
      status,
    } = validated.data
    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    })
    if (existingPost) {
      return NextResponse.json(
        { error: 'Blog post with this slug already exists' },
        { status: 409 }
      )
    }
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        coverImage,
        author,
        tags,
        metaTitle,
        metaDescription,
        status,
        publishedAt: status === 'published' ? new Date() : null,
      },
    })
    return NextResponse.json({
      success: true,
      post,
      message: 'Blog post created successfully',
    })
  } catch (error) {
    console.error('[BLOG_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// PUT /api/content/blog - Update blog post
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
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 })
    }
    const body = await req.json()
    const validated = updateBlogPostSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validated.error.errors },
        { status: 400 }
      )
    }
    const updateData = validated.data
    // Set publishedAt if status is changing to published
    if (updateData.status === 'published') {
      const existingPost = await prisma.blogPost.findUnique({
        where: { id },
        select: { status: true },
      })
      if (existingPost?.status !== 'published') {
        ;(updateData as { publishedAt?: Date }).publishedAt = new Date()
      }
    }
    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    })
    return NextResponse.json({
      success: true,
      post,
      message: 'Blog post updated successfully',
    })
  } catch (error) {
    console.error('[BLOG_UPDATE_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
// DELETE /api/content/blog - Delete blog post
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    // Only allow authenticated users with admin role
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin authentication required' }, { status: 403 })
    }
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 })
    }
    await prisma.blogPost.delete({
      where: { id },
    })
    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    })
  } catch (error) {
    console.error('[BLOG_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
