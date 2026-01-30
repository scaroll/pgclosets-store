// Phase 0: Minimal middleware - NO auth, NO database calls
// Security headers only
import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const headers = new Headers(req.headers)
  // Basic security headers
  headers.set('X-Frame-Options', 'SAMEORIGIN')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return NextResponse.next({ headers })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
