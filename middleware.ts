import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify, type JWTPayload } from "jose"

// Security configuration
const SECURITY_CONFIG = {
  ADMIN_PATHS: ["/admin", "/api/admin"],
  PROTECTED_PATHS: ["/upload", "/files", "/storage-check", "/blob-contents", "/api/upload", "/api/delete"],
  PUBLIC_PATHS: ["/api/health", "/api/status", "/api/products", "/api/quotes/quick"],
  MAX_REQUEST_SIZE: 10 * 1024 * 1024, // 10MB
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
}

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Session management
interface SessionData {
  userId: string
  role: string
  isAdmin: boolean
  exp: number
}

// JWT verification
async function verifyToken(token: string): Promise<SessionData | null> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")
    const { payload } = await jwtVerify(token, secret)

    // Type guard to ensure payload has required fields
    if (
      payload &&
      typeof payload === 'object' &&
      'userId' in payload &&
      'email' in payload &&
      'role' in payload &&
      'isAdmin' in payload &&
      'exp' in payload
    ) {
      return payload as SessionData
    }

    return null
  } catch {
    return null
  }
}

// Rate limiting function
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const key = `rate_limit:${ip}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW
    })
    return true
  }

  if (record.count >= SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  record.count++
  return true
}

// CSRF token validation
function validateCSRFToken(request: NextRequest): boolean {
  const csrfHeader = request.headers.get("x-csrf-token")
  const csrfCookie = request.cookies.get("csrf-token")?.value

  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return false
  }

  return true
}

// Input sanitization
function sanitizeInput(value: string): string {
  return value
    .replace(/[<>'"&]/g, (char) => {
      switch (char) {
        case '<': return '&lt;'
        case '>': return '&gt;'
        case '"': return '&quot;'
        case "'": return '&#x27;'
        case '&': return '&amp;'
        default: return char
      }
    })
}

// Security headers
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.vercel.com https://www.google-analytics.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ")
  )

  // Additional security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

  return response
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = (request as any).ip || request.headers.get("x-forwarded-for") || "unknown"

  // Rate limiting check
  if (!checkRateLimit(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "900" // 15 minutes
      }
    })
  }

  // Check if path requires authentication
  const isAdminPath = SECURITY_CONFIG.ADMIN_PATHS.some(path => pathname.startsWith(path))
  const isProtectedPath = SECURITY_CONFIG.PROTECTED_PATHS.some(path => pathname.startsWith(path))
  const isPublicPath = SECURITY_CONFIG.PUBLIC_PATHS.some(path => pathname.startsWith(path))

  // Block admin paths in production without proper authentication
  if (isAdminPath && process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization")
    const sessionCookie = request.cookies.get("session")?.value

    let isAuthenticated = false
    let isAdmin = false

    // Check JWT token from Authorization header or session cookie
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const session = await verifyToken(token)
      if (session && session.isAdmin) {
        isAuthenticated = true
        isAdmin = true
      }
    } else if (sessionCookie) {
      const session = await verifyToken(sessionCookie)
      if (session && session.isAdmin) {
        isAuthenticated = true
        isAdmin = true
      }
    }

    if (!isAuthenticated || !isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  }

  // Protect upload and file management endpoints
  if (isProtectedPath && !isPublicPath) {
    const authHeader = request.headers.get("authorization")
    const sessionCookie = request.cookies.get("session")?.value

    let isAuthenticated = false

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const session = await verifyToken(token)
      isAuthenticated = !!session
    } else if (sessionCookie) {
      const session = await verifyToken(sessionCookie)
      isAuthenticated = !!session
    }

    if (!isAuthenticated) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
  }

  // CSRF protection for state-changing operations
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method) && !isPublicPath) {
    if (!validateCSRFToken(request)) {
      return new NextResponse("CSRF token validation failed", { status: 403 })
    }
  }

  // Request size validation
  const contentLength = request.headers.get("content-length")
  if (contentLength && parseInt(contentLength) > SECURITY_CONFIG.MAX_REQUEST_SIZE) {
    return new NextResponse("Request too large", { status: 413 })
  }

  // Input validation for query parameters
  const url = request.nextUrl
  const sanitizedSearchParams = new URLSearchParams()

  url.searchParams.forEach((value, key) => {
    sanitizedSearchParams.set(key, sanitizeInput(value))
  })

  // Create response and add security headers
  const response = NextResponse.next()
  return addSecurityHeaders(response)
}

export const config = {
  matcher: [
    // Admin routes
    "/admin/:path*",
    "/api/admin/:path*",
    // Protected file operations
    "/upload",
    "/files",
    "/storage-check",
    "/blob-contents",
    "/api/upload",
    "/api/delete",
    // API routes for CSRF and security headers
    "/api/:path*",
    // All pages for security headers
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}