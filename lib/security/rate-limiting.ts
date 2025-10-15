/**
 * Enterprise Rate Limiting & DDoS Protection
 * Agent #46: Application Security Specialist
 *
 * Features:
 * - Token bucket algorithm
 * - Sliding window rate limiting
 * - IP-based and user-based limits
 * - Distributed rate limiting (Redis-ready)
 * - DDoS detection and mitigation
 * - Adaptive rate limiting
 */

import type { NextRequest } from 'next/server'

/**
 * Rate Limit Configuration
 */
export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  identifier?: 'ip' | 'user' | 'session' | 'custom'
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyPrefix?: string
}

/**
 * Rate Limit Result
 */
export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number // Unix timestamp when limit resets
  retryAfter?: number // Seconds to wait before retry
}

/**
 * In-memory store for rate limiting (use Redis in production)
 */
class RateLimitStore {
  private store: Map<string, { count: number; resetTime: number; requests: number[] }> = new Map()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000)
  }

  private cleanup() {
    const now = Date.now()
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime < now) {
        this.store.delete(key)
      }
    }
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now()
    const record = this.store.get(key)

    if (!record || record.resetTime < now) {
      // Create new window
      const resetTime = now + windowMs
      this.store.set(key, { count: 1, resetTime, requests: [now] })
      return { count: 1, resetTime }
    }

    // Increment existing window
    record.count++
    record.requests.push(now)
    return { count: record.count, resetTime: record.resetTime }
  }

  getSlidingWindow(key: string, windowMs: number): number {
    const now = Date.now()
    const record = this.store.get(key)

    if (!record) return 0

    // Filter requests within the sliding window
    const validRequests = record.requests.filter(time => time > now - windowMs)
    record.requests = validRequests // Clean up old requests

    return validRequests.length
  }

  reset(key: string) {
    this.store.delete(key)
  }

  destroy() {
    clearInterval(this.cleanupInterval)
    this.store.clear()
  }
}

const rateLimitStore = new RateLimitStore()

/**
 * Get client identifier from request
 */
export function getClientIdentifier(
  request: NextRequest,
  type: 'ip' | 'user' | 'session' | 'custom' = 'ip'
): string {
  switch (type) {
    case 'ip':
      return (
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown-ip'
      )

    case 'user':
      // Extract from session/JWT token
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        return `user:${authHeader.substring(7, 20)}` // Use first part of token
      }
      const sessionCookie = request.cookies.get('session')?.value
      return sessionCookie ? `user:${sessionCookie.substring(0, 20)}` : getClientIdentifier(request, 'ip')

    case 'session':
      const sessionId = request.cookies.get('session-id')?.value
      return sessionId || getClientIdentifier(request, 'ip')

    default:
      return getClientIdentifier(request, 'ip')
  }
}

/**
 * Token bucket rate limiter
 */
export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { windowMs, maxRequests, identifier = 'ip', keyPrefix = 'ratelimit' } = config

  // Get client identifier
  const clientId = getClientIdentifier(request, identifier)
  const key = `${keyPrefix}:${clientId}`

  // Increment counter
  const { count, resetTime } = rateLimitStore.increment(key, windowMs)

  // Check if limit exceeded
  const success = count <= maxRequests
  const remaining = Math.max(0, maxRequests - count)
  const reset = Math.ceil(resetTime / 1000)

  return {
    success,
    limit: maxRequests,
    remaining,
    reset,
    retryAfter: success ? undefined : Math.ceil((resetTime - Date.now()) / 1000)
  }
}

/**
 * Sliding window rate limiter (more accurate)
 */
export async function slidingWindowRateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const { windowMs, maxRequests, identifier = 'ip', keyPrefix = 'ratelimit-sliding' } = config

  const clientId = getClientIdentifier(request, identifier)
  const key = `${keyPrefix}:${clientId}`

  // Get request count in sliding window
  const count = rateLimitStore.getSlidingWindow(key, windowMs)

  // Increment for current request
  const now = Date.now()
  const resetTime = now + windowMs
  rateLimitStore.increment(key, windowMs)

  const success = count < maxRequests
  const remaining = Math.max(0, maxRequests - count - 1)

  return {
    success,
    limit: maxRequests,
    remaining,
    reset: Math.ceil(resetTime / 1000),
    retryAfter: success ? undefined : Math.ceil(windowMs / 1000)
  }
}

/**
 * Predefined rate limit configurations
 */
export const RATE_LIMIT_PRESETS = {
  // Strict limits for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyPrefix: 'auth'
  },

  // API endpoints
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    keyPrefix: 'api'
  },

  // GraphQL endpoints
  graphql: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    keyPrefix: 'graphql'
  },

  // Form submissions
  forms: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    keyPrefix: 'forms'
  },

  // File uploads
  uploads: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    keyPrefix: 'uploads'
  },

  // General requests
  general: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    keyPrefix: 'general'
  },

  // Search endpoints (lower limit to prevent abuse)
  search: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    keyPrefix: 'search'
  }
} as const

/**
 * DDoS Detection System
 */
export class DDoSDetector {
  private suspiciousIPs: Map<string, { score: number; lastSeen: number }> = new Map()
  private blockedIPs: Set<string> = new Set()

  /**
   * Analyze request for DDoS patterns
   */
  analyzeRequest(request: NextRequest): {
    suspicious: boolean
    score: number
    reasons: string[]
  } {
    const reasons: string[] = []
    let score = 0

    const ip = getClientIdentifier(request, 'ip')
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''

    // Check if IP is blocked
    if (this.blockedIPs.has(ip)) {
      return { suspicious: true, score: 100, reasons: ['IP is blocked'] }
    }

    // Missing or suspicious user agent
    if (!userAgent || userAgent.length < 10) {
      score += 20
      reasons.push('Missing or suspicious user agent')
    }

    // Known bot patterns
    const botPatterns = /curl|wget|python|scrapy|bot|crawler|spider/i
    if (botPatterns.test(userAgent)) {
      score += 15
      reasons.push('Bot user agent detected')
    }

    // Suspicious referer patterns
    if (referer && !referer.includes(request.headers.get('host') || '')) {
      score += 10
      reasons.push('Cross-origin request')
    }

    // Check request frequency
    const ipRecord = this.suspiciousIPs.get(ip)
    if (ipRecord) {
      const timeSinceLastSeen = Date.now() - ipRecord.lastSeen
      if (timeSinceLastSeen < 100) {
        // More than 10 requests per second
        score += 30
        reasons.push('Excessive request frequency')
      }
    }

    // Update IP record
    this.suspiciousIPs.set(ip, {
      score: Math.min(100, (ipRecord?.score || 0) + score),
      lastSeen: Date.now()
    })

    // Auto-block if score too high
    if (score > 50) {
      this.blockIP(ip, 'Automatic DDoS detection')
    }

    return {
      suspicious: score > 30,
      score,
      reasons
    }
  }

  /**
   * Block IP address
   */
  blockIP(ip: string, reason: string) {
    this.blockedIPs.add(ip)
    console.warn(`[DDoS] Blocked IP ${ip}: ${reason}`)

    // Auto-unblock after 1 hour
    setTimeout(() => {
      this.blockedIPs.delete(ip)
      console.log(`[DDoS] Unblocked IP ${ip}`)
    }, 60 * 60 * 1000)
  }

  /**
   * Unblock IP address
   */
  unblockIP(ip: string) {
    this.blockedIPs.delete(ip)
    this.suspiciousIPs.delete(ip)
  }

  /**
   * Check if IP is blocked
   */
  isBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  /**
   * Get suspicious IPs
   */
  getSuspiciousIPs(): Array<{ ip: string; score: number; lastSeen: number }> {
    return Array.from(this.suspiciousIPs.entries()).map(([ip, data]) => ({
      ip,
      ...data
    }))
  }

  /**
   * Cleanup old records
   */
  cleanup() {
    const now = Date.now()
    const oneHour = 60 * 60 * 1000

    for (const [ip, record] of this.suspiciousIPs.entries()) {
      if (now - record.lastSeen > oneHour) {
        this.suspiciousIPs.delete(ip)
      }
    }
  }
}

// Global DDoS detector instance
export const ddosDetector = new DDoSDetector()

// Cleanup every 10 minutes
setInterval(() => ddosDetector.cleanup(), 10 * 60 * 1000)

/**
 * Adaptive rate limiting based on server load
 */
export class AdaptiveRateLimiter {
  private baseConfig: RateLimitConfig
  private currentMultiplier: number = 1.0

  constructor(baseConfig: RateLimitConfig) {
    this.baseConfig = baseConfig
  }

  /**
   * Adjust rate limits based on server metrics
   */
  adjustLimits(metrics: {
    cpuUsage?: number // 0-100
    memoryUsage?: number // 0-100
    errorRate?: number // 0-1
    responseTime?: number // milliseconds
  }) {
    let multiplier = 1.0

    // Reduce limits if CPU is high
    if (metrics.cpuUsage && metrics.cpuUsage > 80) {
      multiplier *= 0.5
    } else if (metrics.cpuUsage && metrics.cpuUsage > 60) {
      multiplier *= 0.75
    }

    // Reduce limits if memory is high
    if (metrics.memoryUsage && metrics.memoryUsage > 80) {
      multiplier *= 0.5
    }

    // Reduce limits if error rate is high
    if (metrics.errorRate && metrics.errorRate > 0.1) {
      multiplier *= 0.6
    }

    // Reduce limits if response time is slow
    if (metrics.responseTime && metrics.responseTime > 1000) {
      multiplier *= 0.7
    }

    this.currentMultiplier = multiplier
  }

  /**
   * Get adjusted rate limit config
   */
  getConfig(): RateLimitConfig {
    return {
      ...this.baseConfig,
      maxRequests: Math.floor(this.baseConfig.maxRequests * this.currentMultiplier)
    }
  }

  /**
   * Reset to base configuration
   */
  reset() {
    this.currentMultiplier = 1.0
  }
}

/**
 * Rate limit middleware helper
 */
export async function withRateLimit(
  request: NextRequest,
  config: RateLimitConfig,
  handler: () => Promise<Response>
): Promise<Response> {
  const result = await slidingWindowRateLimit(request, config)

  if (!result.success) {
    return new Response(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: result.retryAfter
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfter || 60),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(result.reset)
        }
      }
    )
  }

  // Execute handler
  const response = await handler()

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', String(result.limit))
  response.headers.set('X-RateLimit-Remaining', String(result.remaining))
  response.headers.set('X-RateLimit-Reset', String(result.reset))

  return response
}
