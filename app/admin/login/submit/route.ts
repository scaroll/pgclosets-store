import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { checkAuthRateLimit, getClientIdentifier } from '@/lib/rate-limit'

export async function POST(req: Request) {
  try {
    // Rate limiting for admin login attempts
    const identifier = getClientIdentifier(req)
    const rateLimitResult = await checkAuthRateLimit(req)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': '300',
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          }
        }
      )
    }

    const form = await req.formData()
    const provided = String(form.get('key') || '')
    const next = String(form.get('next') || '/admin')
    const expected = process.env.ADMIN_DASHBOARD_KEY || ''

    if (!expected) {
      return NextResponse.json(
        { error: 'Admin authentication not properly configured' },
        { status: 500 },
      )
    }

    // Add timing attack protection
    const expectedBuffer = Buffer.from(expected)
    const providedBuffer = Buffer.from(provided)

    // Secure comparison with constant time to prevent timing attacks
    let match = expectedBuffer.length === providedBuffer.length
    if (match) {
      for (let i = 0; i < expectedBuffer.length; i++) {
        if (expectedBuffer[i] !== providedBuffer[i]) {
          match = false
          break
        }
      }
    }

    if (!match) {
      // Log failed attempt for security monitoring
      console.warn(`[Admin] Failed login attempt from IP: ${getClientIdentifier(req)} at ${new Date().toISOString()}`)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create secure session
    const res = NextResponse.redirect(new URL(next, req.url))
    res.cookies.set('pg_admin_session', crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours instead of 7 days
      // Add additional security attributes
      partitioned: true,
    })

    // Log successful admin login
    console.log(`[Admin] Successful login from IP: ${getClientIdentifier(req)} at ${new Date().toISOString()}`)

    return res
  } catch (error) {
    console.error('[Admin] Login error:', error)
    return NextResponse.json(
      { error: 'Authentication service temporarily unavailable' },
      { status: 500 }
    )
  }
}

