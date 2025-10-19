import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

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

  // Protect admin routes with simple cookie gate
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/images/:path*', '/admin/:path*'],
}
