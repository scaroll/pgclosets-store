import { NextRequest, NextResponse } from 'next/server'
import { createHash, randomBytes } from 'crypto'

interface SecurityConfig {
  rateLimiting: {
    enabled: boolean
    requests: number
    window: number
    blockDuration: number
  }
  csrf: {
    enabled: boolean
    tokenExpiry: number
  }
  securityHeaders: {
    enabled: boolean
    csp: string
    hsts: boolean
    frameOptions: string
    contentTypeOptions: boolean
    referrerPolicy: string
    permissionsPolicy: string
  }
  ipBlocking: {
    enabled: boolean
    maxAttempts: number
    windowMs: number
    suspiciousThreshold: number
  }
  inputValidation: {
    enabled: boolean
    maxFieldLength: number
    allowedTags: string[]
    sqlInjectionPatterns: RegExp[]
    xssPatterns: RegExp[]
  }
  ddosProtection: {
    enabled: boolean
    threshold: number
    burstLimit: number
  }
  sessionSecurity: {
    enabled: boolean
    maxAge: number
    secure: boolean
    httpOnly: boolean
    sameSite: string
  }
  auditLogging: {
    enabled: boolean
    logLevel: 'info' | 'warn' | 'error'
    retention: number
  }
}

const securityConfig: SecurityConfig = {
  rateLimiting: {
    enabled: true,
    requests: 100, // 100 requests per window
    window: 60 * 1000, // 1 minute
    blockDuration: 15 * 60 * 1000, // 15 minutes
  },
  csrf: {
    enabled: true,
    tokenExpiry: 60 * 60 * 1000, // 1 hour
  },
  securityHeaders: {
    enabled: true,
    csp: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://checkout.stripe.com https://vitals.vercel-insights.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https: https://www.pgclosets.com https://cdn.renin.com https://www.renin.com https://renin.com https://images.unsplash.com https://hebbkx1anhila5yf.public.blob.vercel-storage.com https://www.google-analytics.com https://www.googletagmanager.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://www.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com; frame-src 'self' https://js.stripe.com https://checkout.stripe.com; media-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests;`,
    hsts: true,
    frameOptions: 'SAMEORIGIN',
    contentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: 'camera=(), microphone=(), geolocation=(), payment=*, usb=(), interest-cohort=()',
  },
  ipBlocking: {
    enabled: true,
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    suspiciousThreshold: 10,
  },
  inputValidation: {
    enabled: true,
    maxFieldLength: 10000,
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    sqlInjectionPatterns: [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
      /(--|\/\*|\*\/|;|'|")/,
      /(\bOR\b.*?=.*\bAND\b|\bAND\b.*?=.*\bOR\b)/gi,
      /(\b1\s*=\s*1\b|\btrue\b.*=\btrue\b)/gi,
    ],
    xssPatterns: [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
    ],
  },
  ddosProtection: {
    enabled: true,
    threshold: 1000, // requests per minute
    burstLimit: 50, // concurrent requests
  },
  sessionSecurity: {
    enabled: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  },
  auditLogging: {
    enabled: true,
    logLevel: 'info',
    retention: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
}

class SecurityMiddleware {
  private rateLimitStore = new Map<string, { count: number; resetTime: number; blocked: boolean }>()
  private ipBlockStore = new Map<string, { blocked: boolean; until: number; attempts: number }>()
  private csrfStore = new Map<string, { token: string; expires: number }>()
  private suspiciousActivityStore = new Map<string, { count: number; lastActivity: number }>()

  async processRequest(request: NextRequest): Promise<NextResponse | null> {
    const startTime = Date.now()
    const ip = this.getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Initialize security context
    const securityContext = {
      ip,
      userAgent,
      startTime,
      requestId: this.generateRequestId(),
    }

    try {
      // 1. DDoS Protection
      if (securityConfig.ddosProtection.enabled && !this.checkDDoSProtection(ip)) {
        await this.logSecurityEvent('DDOS_BLOCKED', securityContext)
        return this.createErrorResponse('Too many requests', 429, 'DDOS_PROTECTION')
      }

      // 2. IP Blocking
      if (securityConfig.ipBlocking.enabled && this.isIPBlocked(ip)) {
        await this.logSecurityEvent('IP_BLOCKED', securityContext)
        return this.createErrorResponse('Access denied', 403, 'IP_BLOCKED')
      }

      // 3. Rate Limiting
      if (securityConfig.rateLimiting.enabled && !this.checkRateLimit(ip)) {
        await this.logSecurityEvent('RATE_LIMIT_EXCEEDED', securityContext)
        return this.createErrorResponse('Rate limit exceeded', 429, 'RATE_LIMIT')
      }

      // 4. Input Validation (for POST/PUT requests)
      if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
        const validationResult = await this.validateInput(request, securityContext)
        if (!validationResult.valid) {
          await this.logSecurityEvent('INPUT_VALIDATION_FAILED', {
            ...securityContext,
            reason: validationResult.reason,
          })
          return this.createErrorResponse('Invalid input', 400, 'INPUT_VALIDATION')
        }
      }

      // 5. CSRF Protection (for state-changing requests)
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
        const csrfResult = this.checkCSRF(request)
        if (!csrfResult.valid) {
          await this.logSecurityEvent('CSRF_INVALID', securityContext)
          return this.createErrorResponse('Invalid CSRF token', 403, 'CSRF_PROTECTION')
        }
      }

      // 6. Suspicious Activity Detection
      this.detectSuspiciousActivity(request, securityContext)

      return null // Continue processing
    } catch (error) {
      await this.logSecurityEvent('SECURITY_MIDDLEWARE_ERROR', {
        ...securityContext,
        error: error?.message,
      })
      return null // Don't block on middleware errors
    }
  }

  async processResponse(request: NextRequest, response: NextResponse): Promise<NextResponse> {
    // Add security headers
    if (securityConfig.securityHeaders.enabled) {
      response.headers.set('X-Content-Type-Options', 'nosniff')
      response.headers.set('X-Frame-Options', securityConfig.securityHeaders.frameOptions)
      response.headers.set('X-XSS-Protection', '1; mode=block')
      response.headers.set('Referrer-Policy', securityConfig.securityHeaders.referrerPolicy)
      response.headers.set('Permissions-Policy', securityConfig.securityHeaders.permissionsPolicy)
      response.headers.set('Content-Security-Policy', securityConfig.securityHeaders.csp)

      if (securityConfig.securityHeaders.hsts && process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
      }
    }

    // Add custom security headers
    response.headers.set('X-Security-Scan', 'Protected by Enterprise Security Middleware')
    response.headers.set('X-Request-ID', this.generateRequestId())
    response.headers.set('X-Response-Time', `${Date.now() - parseInt(request.headers.get('x-start-time') || '0')}ms`)

    // Remove sensitive headers
    response.headers.delete('x-powered-by')
    response.headers.delete('server')

    return response
  }

  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const real = request.headers.get('x-real-ip')
    const ip = forwarded?.split(',')[0] || real || 'unknown'
    return ip.trim()
  }

  private generateRequestId(): string {
    return randomBytes(16).toString('hex')
  }

  private checkDDoSProtection(ip: string): boolean {
    const now = Date.now()
    const windowMs = 60 * 1000 // 1 minute window
    const key = `ddos:${ip}`

    let data = this.rateLimitStore.get(key)
    if (!data || now > data.resetTime) {
      data = { count: 0, resetTime: now + windowMs, blocked: false }
      this.rateLimitStore.set(key, data)
    }

    data.count++

    // Check burst limit
    if (data.count > securityConfig.ddosProtection.burstLimit) {
      data.blocked = true
      return false
    }

    // Check sustained threshold
    if (data.count > securityConfig.ddosProtection.threshold) {
      data.blocked = true
      data.resetTime = now + (15 * 60 * 1000) // Block for 15 minutes
      return false
    }

    return true
  }

  private checkRateLimit(ip: string): boolean {
    const now = Date.now()
    const config = securityConfig.rateLimiting
    const key = `rate:${ip}`

    let data = this.rateLimitStore.get(key)
    if (!data || now > data.resetTime) {
      data = { count: 0, resetTime: now + config.window, blocked: false }
      this.rateLimitStore.set(key, data)
    }

    if (data.blocked && now < data.resetTime) {
      return false // Still blocked
    }

    data.count++
    if (data.count > config.requests) {
      data.blocked = true
      data.resetTime = now + config.blockDuration
      return false
    }

    return true
  }

  private isIPBlocked(ip: string): boolean {
    const now = Date.now()
    const data = this.ipBlockStore.get(ip)

    if (!data) return false

    if (data.blocked && now < data.until) {
      return false // IP is still blocked
    }

    if (now >= data.until) {
      this.ipBlockStore.delete(ip) // Unblock if time has passed
      return false
    }

    return false
  }

  private async validateInput(request: NextRequest, securityContext: any): Promise<{ valid: boolean; reason?: string }> {
    try {
      const contentType = request.headers.get('content-type')

      if (contentType?.includes('application/json')) {
        const body = await request.clone().json()
        return this.validateJSONInput(body)
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.clone().formData()
        return this.validateFormData(formData)
      } else if (contentType?.includes('multipart/form-data')) {
        // Skip validation for file uploads (handled separately)
        return { valid: true }
      }
    } catch (error) {
      return { valid: false, reason: 'Invalid request body' }
    }

    return { valid: true }
  }

  private validateJSONInput(data: any): { valid: boolean; reason?: string } {
    if (typeof data !== 'object' || data === null) {
      return { valid: false, reason: 'Invalid JSON structure' }
    }

    return this.validateInputObject(data)
  }

  private validateFormData(formData: FormData): { valid: boolean; reason?: string } {
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        const result = this.validateString(value, key)
        if (!result.valid) {
          return result
        }
      }
    }
    return { valid: true }
  }

  private validateInputObject(obj: any, path = ''): { valid: boolean; reason?: string } {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key

      if (typeof value === 'string') {
        const result = this.validateString(value, currentPath)
        if (!result.valid) {
          return result
        }
      } else if (typeof value === 'object' && value !== null) {
        const result = this.validateInputObject(value, currentPath)
        if (!result.valid) {
          return result
        }
      }
    }
    return { valid: true }
  }

  private validateString(value: string, field: string): { valid: boolean; reason?: string } {
    // Check length
    if (value.length > securityConfig.inputValidation.maxFieldLength) {
      return { valid: false, reason: `Field ${field} exceeds maximum length` }
    }

    // Check for SQL injection
    for (const pattern of securityConfig.inputValidation.sqlInjectionPatterns) {
      if (pattern.test(value)) {
        return { valid: false, reason: `Potential SQL injection in field ${field}` }
      }
    }

    // Check for XSS
    for (const pattern of securityConfig.inputValidation.xssPatterns) {
      if (pattern.test(value)) {
        return { valid: false, reason: `Potential XSS in field ${field}` }
      }
    }

    return { valid: true }
  }

  private checkCSRF(request: NextRequest): { valid: boolean } {
    const config = securityConfig.csrf
    if (!config.enabled) {
      return { valid: true }
    }

    // Skip CSRF for API routes and specific endpoints
    const pathname = request.nextUrl.pathname
    if (pathname.startsWith('/api/') || pathname.startsWith('/webhooks/')) {
      return { valid: true }
    }

    const token = request.headers.get('x-csrf-token') || request.cookies.get('csrf-token')?.value
    const sessionToken = request.cookies.get('session-token')?.value

    if (!token || !sessionToken) {
      return { valid: false }
    }

    const storedToken = this.csrfStore.get(sessionToken)
    if (!storedToken || storedToken.token !== token || Date.now() > storedToken.expires) {
      return { valid: false }
    }

    return { valid: true }
  }

  private detectSuspiciousActivity(request: NextRequest, securityContext: any) {
    const ip = securityContext.ip
    const userAgent = securityContext.userAgent
    const pathname = request.nextUrl.pathname

    // Detect patterns
    const suspiciousPatterns = [
      /admin/i,
      /wp-admin/i,
      /phpmyadmin/i,
      /\.env/i,
      /\.git/i,
      /\.svn/i,
      /config/i,
      /backup/i,
      /test/i,
      /debug/i,
    ]

    const isSuspiciousPath = suspiciousPatterns.some(pattern => pattern.test(pathname))
    const isSuspiciousUserAgent = /bot|crawler|spider|scraper/i.test(userAgent) && !/[Cc]rawler|Googlebot|Bingbot|facebookexternalhit/i.test(userAgent)

    if (isSuspiciousPath || isSuspiciousUserAgent) {
      const key = `suspicious:${ip}`
      const now = Date.now()
      let data = this.suspiciousActivityStore.get(key)

      if (!data) {
        data = { count: 0, lastActivity: now }
        this.suspiciousActivityStore.set(key, data)
      }

      data.count++
      data.lastActivity = now

      // Block if threshold exceeded
      if (data.count >= securityConfig.ipBlocking.suspiciousThreshold) {
        this.ipBlockStore.set(ip, {
          blocked: true,
          until: now + (60 * 60 * 1000), // Block for 1 hour
          attempts: data.count,
        })
      }
    }
  }

  private createErrorResponse(message: string, status: number, code: string): NextResponse {
    return NextResponse.json(
      { error: message, code, timestamp: Date.now() },
      { status }
    )
  }

  private async logSecurityEvent(event: string, context: any) {
    if (!securityConfig.auditLogging.enabled) {
      return
    }

    try {
      await fetch('/api/security/audit-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          context,
          timestamp: Date.now(),
          level: securityConfig.auditLogging.logLevel,
        }),
      }).catch(() => {
        // Silently fail to avoid impacting user experience
      })
    } catch (error) {
      console.error('Failed to log security event:', error)
    }
  }

  // Public methods for token generation
  generateCSRFToken(sessionId: string): string {
    const token = createHash('sha256')
      .update(sessionId + Date.now() + randomBytes(32).toString('hex'))
      .digest('hex')

    this.csrfStore.set(sessionId, {
      token,
      expires: Date.now() + securityConfig.csrf.tokenExpiry,
    })

    return token
  }

  cleanup() {
    // Clean up expired entries
    const now = Date.now()

    this.rateLimitStore.forEach((data, key) => {
      if (now > data.resetTime) {
        this.rateLimitStore.delete(key)
      }
    })

    this.ipBlockStore.forEach((data, key) => {
      if (now > data.until) {
        this.ipBlockStore.delete(key)
      }
    })

    this.csrfStore.forEach((data, key) => {
      if (now > data.expires) {
        this.csrfStore.delete(key)
      }
    })
  }
}

// Export singleton instance
export const securityMiddleware = new SecurityMiddleware()

// Middleware export for Next.js
export function middleware(request: NextRequest) {
  return securityMiddleware.processRequest(request)
}

// Cleanup expired entries every 5 minutes
setInterval(() => {
  securityMiddleware.cleanup()
}, 5 * 60 * 1000)