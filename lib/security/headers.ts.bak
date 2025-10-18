/**
 * Enterprise Security Headers Configuration
 * Agent #46: Application Security Specialist
 *
 * Comprehensive security headers implementation for PG Closets
 * - Content Security Policy (CSP) with nonce support
 * - Cross-Origin policies
 * - Security response headers
 * - HTTPS enforcement
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import crypto from 'crypto'

/**
 * Generate cryptographically secure nonce for CSP
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString('base64')
}

/**
 * Security Headers Configuration
 */
export const SECURITY_HEADERS = {
  // Strict Transport Security - Force HTTPS
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Legacy XSS Protection (deprecated but still used by older browsers)
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy - Privacy-conscious
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy - Restrict powerful features
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=(self)',
    'payment=(self)',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'autoplay=(self)',
    'encrypted-media=(self)',
    'picture-in-picture=(self)'
  ].join(', '),

  // Cross-Origin Policies
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',

  // DNS Prefetch Control
  'X-DNS-Prefetch-Control': 'on',

  // Download Options (IE only, but harmless)
  'X-Download-Options': 'noopen',

  // Permitted Cross-Domain Policies
  'X-Permitted-Cross-Domain-Policies': 'none'
} as const

/**
 * Content Security Policy Configuration
 * Strict CSP with nonce-based script execution
 */
export function generateCSP(nonce?: string): string {
  const cspNonce = nonce || generateNonce()

  const csp = {
    // Default fallback - restrict everything to same origin
    'default-src': ["'self'"],

    // Scripts - nonce-based with fallback to trusted CDNs
    'script-src': [
      "'self'",
      `'nonce-${cspNonce}'`,
      "'strict-dynamic'", // Allow scripts loaded by trusted scripts
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://cdn.vercel-insights.com',
      'https://*.vercel.app'
    ],

    // Styles - allow inline with nonce, Google Fonts
    'style-src': [
      "'self'",
      `'nonce-${cspNonce}'`,
      "'unsafe-inline'", // Required for styled-components and Tailwind
      'https://fonts.googleapis.com'
    ],

    // Fonts - Google Fonts CDN
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'data:'
    ],

    // Images - allow various sources for product images
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://www.renin.com',
      'https://cdn.shopify.com',
      'https://images.unsplash.com',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'https://*.vercel-storage.com'
    ],

    // Media - same as images
    'media-src': [
      "'self'",
      'https:',
      'blob:'
    ],

    // Connections - APIs and analytics
    'connect-src': [
      "'self'",
      'https://www.google-analytics.com',
      'https://analytics.google.com',
      'https://www.googletagmanager.com',
      'https://vitals.vercel-insights.com',
      'https://vercel.live',
      'wss://ws-us3.pusher.com',
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_API_URL || ''
    ].filter(Boolean),

    // Object/Embed - block plugins
    'object-src': ["'none'"],

    // Frames - restrict to same origin
    'frame-src': [
      "'self'",
      'https://www.google.com', // reCAPTCHA if used
      'https://challenges.cloudflare.com' // Turnstile if used
    ],

    // Frame ancestors - prevent embedding (clickjacking)
    'frame-ancestors': ["'none'"],

    // Base URI - prevent base tag injection
    'base-uri': ["'self'"],

    // Form action - restrict form submissions
    'form-action': ["'self'"],

    // Upgrade insecure requests
    'upgrade-insecure-requests': [],

    // Block all mixed content
    'block-all-mixed-content': [],

    // Worker sources
    'worker-src': ["'self'", 'blob:'],

    // Manifest source
    'manifest-src': ["'self'"]
  }

  // Build CSP string
  const cspString = Object.entries(csp)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')

  return cspString
}

/**
 * Apply all security headers to response
 */
export function applySecurityHeaders(
  response: NextResponse,
  options: {
    nonce?: string
    enableCSP?: boolean
    reportOnly?: boolean
  } = {}
): NextResponse {
  const { nonce, enableCSP = true, reportOnly = false } = options

  // Apply standard security headers
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Apply CSP
  if (enableCSP) {
    const csp = generateCSP(nonce)
    const cspHeader = reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'
    response.headers.set(cspHeader, csp)
  }

  // Add security metadata
  response.headers.set('X-Security-Headers-Applied', 'true')
  response.headers.set('X-Security-Version', '1.0.0')

  return response
}

/**
 * Validate request security
 */
export function validateRequestSecurity(request: NextRequest): {
  valid: boolean
  issues: string[]
  warnings: string[]
} {
  const issues: string[] = []
  const warnings: string[] = []

  // Check HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto')
    if (proto !== 'https') {
      issues.push('Request not using HTTPS')
    }
  }

  // Check for suspicious headers
  const suspiciousHeaders = [
    'x-forwarded-host',
    'x-original-url',
    'x-rewrite-url'
  ]

  suspiciousHeaders.forEach(header => {
    if (request.headers.has(header)) {
      warnings.push(`Suspicious header detected: ${header}`)
    }
  })

  // Check Content-Type for POST/PUT/PATCH
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type')
    if (!contentType) {
      warnings.push('Missing Content-Type header for mutation request')
    }
  }

  // Check Origin/Referer for CSRF protection
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const origin = request.headers.get('origin')
    const referer = request.headers.get('referer')

    if (!origin && !referer) {
      warnings.push('Missing Origin and Referer headers for state-changing request')
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings
  }
}

/**
 * Security headers middleware for API routes
 */
export function withSecurityHeaders(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest) => {
    // Validate request
    const validation = validateRequestSecurity(req)

    if (!validation.valid) {
      return new NextResponse(
        JSON.stringify({ error: 'Security validation failed', issues: validation.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Execute handler
    const response = await handler(req)

    // Apply security headers
    return applySecurityHeaders(response, { enableCSP: false })
  }
}

/**
 * Report CSP violations (for monitoring)
 */
export async function reportCSPViolation(violation: {
  documentUri: string
  violatedDirective: string
  effectiveDirective: string
  originalPolicy: string
  blockedUri: string
  sourceFile?: string
  lineNumber?: number
  columnNumber?: number
}) {
  // Log violation
  console.error('[CSP VIOLATION]', {
    directive: violation.violatedDirective,
    blocked: violation.blockedUri,
    source: violation.sourceFile,
    timestamp: new Date().toISOString()
  })

  // Send to monitoring service
  if (process.env.SECURITY_WEBHOOK_URL) {
    try {
      await fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'csp_violation',
          severity: 'warning',
          violation,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error('Failed to report CSP violation:', error)
    }
  }
}

/**
 * Security headers validation for testing
 */
export function validateSecurityHeaders(headers: Headers): {
  valid: boolean
  missing: string[]
  warnings: string[]
  score: number
} {
  const missing: string[] = []
  const warnings: string[] = []
  let score = 100

  // Check critical headers
  const criticalHeaders = [
    'Strict-Transport-Security',
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options'
  ]

  criticalHeaders.forEach(header => {
    if (!headers.has(header)) {
      missing.push(header)
      score -= 20
    }
  })

  // Check recommended headers
  const recommendedHeaders = [
    'Referrer-Policy',
    'Permissions-Policy',
    'Cross-Origin-Opener-Policy'
  ]

  recommendedHeaders.forEach(header => {
    if (!headers.has(header)) {
      warnings.push(`Recommended header missing: ${header}`)
      score -= 5
    }
  })

  // Validate CSP complexity
  const csp = headers.get('Content-Security-Policy')
  if (csp) {
    if (csp.includes("'unsafe-eval'")) {
      warnings.push('CSP allows unsafe-eval')
      score -= 10
    }
    if (!csp.includes("'strict-dynamic'")) {
      warnings.push('CSP does not use strict-dynamic')
      score -= 5
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
    score: Math.max(0, score)
  }
}
