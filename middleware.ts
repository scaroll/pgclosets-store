// @ts-nocheck - Middleware with auth type issues
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware that allows all requests through
// Auth protection can be added later when auth is configured
export function middleware(request: NextRequest) {
  // For now, just allow all requests
  return NextResponse.next()
}

export const config = {
  // Only run middleware on specific paths if needed
  matcher: ["/admin/:path*", "/account/:path*"],
}
