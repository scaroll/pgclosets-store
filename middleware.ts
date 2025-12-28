import { auth } from '@/auth'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const PROTECTED_ADMIN_ROUTES = ['/admin']
const PUBLIC_ROUTES = ['/api/health', '/api/auth']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Security headers
  const headers = new Headers(req.headers)
  headers.set('X-Frame-Options', 'DENY')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Check if route is protected
  const isAdminRoute = PROTECTED_ADMIN_ROUTES.some(route => pathname.startsWith(route))

  if (isAdminRoute) {
    const session = await auth()

    if (!session || session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }
  }

  return NextResponse.next({ headers })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
