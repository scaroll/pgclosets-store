import { prisma } from '@/lib/prisma'
import { authRateLimiter, checkRateLimit, getClientIdentifier } from '@/lib/rate-limit'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const maxDuration = 30

// Force Node.js runtime - Prisma and bcryptjs are incompatible with Edge Runtime
export const runtime = 'nodejs'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(req: NextRequest) {
  try {
    // Check if database is available
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Login service temporarily unavailable',
        },
        { status: 503 }
      )
    }

    // Rate limiting
    const identifier = getClientIdentifier(req)
    const { allowed } = await checkRateLimit(identifier, authRateLimiter)
    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Too many login attempts',
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const validated = loginSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Invalid input',
          details: validated.error.errors,
        },
        { status: 400 }
      )
    }

    const { email, password } = validated.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true,
      },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      )
    }

    // Create JWT token
    const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret'
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      csrfToken: null, // Not used in JWT auth
      message: 'Login successful',
    })

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return response
  } catch (error) {
    console.error('[LOGIN_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
