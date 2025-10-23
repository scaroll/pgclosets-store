import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const startTime = Date.now()

  // Bypass cached 404s for public images by rewriting to dynamic assets handler
  if (pathname.startsWith('/images/')) {
    const rest = pathname.replace(/^\/images\//, '')
    const url = req.nextUrl.clone()
    url.pathname = `/assets/${rest}`
    const sp = new URLSearchParams(search)
    sp.set('v', '2')
    url.search = `?${sp.toString()}`
    return NextResponse.rewrite(url)
  }

  // Protect admin routes with basic security
  if (
    pathname.startsWith('/admin') &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/admin/login/submit')
  ) {
    const cookie = req.cookies.get('pg_admin')?.value
    const enabled = Boolean(process.env.ADMIN_DASHBOARD_KEY)
    if (!cookie || cookie !== '1') {
      const url = req.nextUrl.clone()
      url.pathname = '/admin/login'
      url.search = `?next=${encodeURIComponent(pathname + (search || ''))}`
      return NextResponse.redirect(url)
    }
  }

  // Continue with the request
  const response = NextResponse.next()

  // Add basic security headers (compatible with Edge Runtime)
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=*, usb=(), interest-cohort=()')

  // Add performance monitoring headers
  response.headers.set('x-middleware-time', `${Date.now() - startTime}ms`)
  response.headers.set('x-middleware-version', '1.0.0')

  return response
}

export const config = {
  matcher: [
    '/images/:path*',
    '/admin/:path*',
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
