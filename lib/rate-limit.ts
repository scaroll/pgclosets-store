import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// eslint-disable-next-line no-console
const warn = console.warn

// Determine if we have valid Upstash credentials
const redisUrl = process.env.REDIS_URL || ''
const isUpstash = redisUrl.startsWith('https://')

// Mock Redis interface for local development
interface MockRedis {
  incr: () => Promise<number>
  expire: () => Promise<number>
  eval: () => Promise<[number, number, number, number]>
}

// Create Redis client or mock
let redis: Redis | MockRedis

if (isUpstash) {
  redis = new Redis({
    url: process.env.REDIS_URL ?? '',
    token: process.env.REDIS_TOKEN ?? '',
  })
} else {
  warn(
    '⚠️  REDIS_URL is not an Upstash HTTPS URL. Rate limiting will be disabled (allowing all requests).'
  )
  // Mock Redis for local dev
  redis = {
    incr: () => Promise.resolve(1),
    expire: () => Promise.resolve(1),
    eval: () => Promise.resolve([1, 1, 1, 1]), // Mock Lua script response
  }
}

// Helper to create limiter (graceful fallback)
const createLimiter = (options: {
  limiter: ReturnType<typeof Ratelimit.slidingWindow>
  analytics?: boolean
  prefix: string
}): Ratelimit => {
  if (!isUpstash) {
    // Return a mock limiter that always allows
    return {
      limit: () => Promise.resolve({ success: true, limit: 100, remaining: 99, reset: 0 }),
    } as unknown as Ratelimit
  }
  return new Ratelimit({
    ...options,
    redis: redis as Redis,
  })
}

// Different rate limiters for different endpoints
export const chatRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
  prefix: 'ratelimit:chat',
})

export const aiRecommendationsRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
  analytics: true,
  prefix: 'ratelimit:ai-recommendations',
})

export const authRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(5, '5 m'), // 5 requests per 5 minutes
  analytics: true,
  prefix: 'ratelimit:auth',
})

export const checkoutRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(3, '1 m'), // 3 requests per minute
  analytics: true,
  prefix: 'ratelimit:checkout',
})

export const bookingRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
  analytics: true,
  prefix: 'ratelimit:booking',
})

export const generalRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
  analytics: true,
  prefix: 'ratelimit:general',
})

// Helper function to get client identifier
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? (forwarded.split(',')[0] ?? 'unknown') : 'unknown'
  return ip.trim()
}

// Helper function to check rate limit
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  try {
    const { success, remaining, reset } = await limiter.limit(identifier)

    return {
      allowed: success,
      remaining,
      reset,
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Rate limit error:', error)
    // Fail open
    return { allowed: true, remaining: 1, reset: 0 }
  }
}

// In-memory rate limiter class for testing/fallback
class RateLimiterClass {
  private static store = new Map<string, { count: number; resetTime: number }>()

  static check(
    identifier: string,
    maxRequests = 100,
    windowMs = 900000
  ): { allowed: boolean; remaining: number; reset: number } {
    const now = Date.now()
    const existing = RateLimiterClass.store.get(identifier)

    if (!existing || now > existing.resetTime) {
      const resetTime = now + windowMs
      RateLimiterClass.store.set(identifier, { count: 1, resetTime })
      return { allowed: true, remaining: maxRequests - 1, reset: resetTime }
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0, reset: existing.resetTime }
    }

    existing.count++
    return { allowed: true, remaining: maxRequests - existing.count, reset: existing.resetTime }
  }

  static reset(identifier: string): void {
    RateLimiterClass.store.delete(identifier)
  }

  static status(
    identifier: string,
    maxRequests = 100,
    _windowMs = 900000 // Unused but kept for API consistency
  ): { count: number; remaining: number; resetTime: number | null } {
    const now = Date.now()
    const existing = RateLimiterClass.store.get(identifier)

    if (!existing || now > existing.resetTime) {
      return { count: 0, remaining: maxRequests, resetTime: null }
    }

    return {
      count: existing.count,
      remaining: maxRequests - existing.count,
      resetTime: existing.resetTime,
    }
  }

  static cleanup(): void {
    const now = Date.now()
    for (const [key, value] of RateLimiterClass.store.entries()) {
      if (now > value.resetTime) {
        RateLimiterClass.store.delete(key)
      }
    }
  }
}

export const RateLimiter = RateLimiterClass
