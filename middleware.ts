import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Block sensitive routes from unauthenticated public access in production
const blockedPrefixes = [
  "/admin",
  "/upload",
  "/files",
  "/storage-check",
  "/blob-contents",
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isBlocked = blockedPrefixes.some((p) => pathname.startsWith(p))
  if (isBlocked && process.env.NODE_ENV === "production") {
    return new NextResponse("Not Found", { status: 404 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/upload",
    "/files",
    "/storage-check",
    "/blob-contents",
  ],
}

