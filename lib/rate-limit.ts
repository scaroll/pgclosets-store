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

// In-memory store for the fallback limiter
const localStore = new Map<string, { count: number; resetTime: number }>()

// Robust In-Memory Rate Limiter Class
class InMemoryRateLimiter {
  private windowMs: number
  private limitCount: number

  constructor(limitCount: number, windowString: string) {
    this.limitCount = limitCount
    this.windowMs = this.parseWindow(windowString)
  }

  private parseWindow(window: string): number {
    const value = parseInt(window.replace(/\D/g, ''), 10)
    if (window.endsWith('s')) return value * 1000
    if (window.endsWith('m')) return value * 60 * 1000
    if (window.endsWith('h')) return value * 60 * 60 * 1000
    return value // default ms
  }

  async limit(
    identifier: string
  ): Promise<{
    success: boolean
    limit: number
    remaining: number
    reset: number
    pending: Promise<unknown>
  }> {
    await Promise.resolve()

    if (this.limitCount <= 0) {
      return {
        success: false,
        limit: this.limitCount,
        remaining: 0,
        reset: Date.now() + this.windowMs,
        pending: Promise.resolve(),
      }
    }

    const now = Date.now()
    const key = identifier
    const record = localStore.get(key)

    if (!record || now > record.resetTime) {
      const resetTime = now + this.windowMs
      localStore.set(key, { count: 1, resetTime })
      return {
        success: true,
        limit: this.limitCount,
        remaining: this.limitCount - 1,
        reset: resetTime,
        pending: Promise.resolve(),
      }
    }

    if (record.count >= this.limitCount) {
      return {
        success: false,
        limit: this.limitCount,
        remaining: 0,
        reset: record.resetTime,
        pending: Promise.resolve(),
      }
    }

    record.count++
    return {
      success: true,
      limit: this.limitCount,
      remaining: this.limitCount - record.count,
      reset: record.resetTime,
      pending: Promise.resolve(),
    }
  }
}

// Create Redis client or mock
let redis: Redis | MockRedis

if (isUpstash) {
  redis = new Redis({
    url: process.env.REDIS_URL ?? '',
    token: process.env.REDIS_TOKEN ?? '',
  })
} else {
  // Only warn once in development
  if (process.env.NODE_ENV !== 'production') {
    warn('⚠️  REDIS_URL is not an Upstash HTTPS URL. Using in-memory rate limiting.')
  }

  // Mock Redis for local dev to satisfy types if needed elsewhere,
  // but we will bypass it in createLimiter for the robust in-memory implementation.
  redis = {
    incr: () => Promise.resolve(1),
    expire: () => Promise.resolve(1),
    eval: () => Promise.resolve([1, 1, 1, 1] as [number, number, number, number]),
  }
}

// Helper to create limiter (graceful fallback)
const createLimiter = (options: {
  limiter: ReturnType<typeof Ratelimit.slidingWindow>
  analytics?: boolean
  prefix: string
  // We need to capture the window config to recreate logic for in-memory
  // Since we can't easily extract it from the Ratelimit.slidingWindow return,
  // we might need to pass duration/limit explicitly if we want true parity.
  // BUT: standardizing to a simple interface is easier.
  config: { limit: number; window: string }
}): {
  limit: (
    identifier: string
  ) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }>
} => {
  if (!isUpstash) {
    // Return our robust in-memory limiter
    return new InMemoryRateLimiter(options.config.limit, options.config.window)
  }

  // Return Upstash Ratelimit
  // We need to reconstruct the arguments for Ratelimit because we passed `limiter` instance passed in.
  // Actually, standard usage of Helper was just passing `limiter` result.
  // Let's adjust the signature to take limit/window/unit
  return new Ratelimit({
    redis: redis as Redis,
    limiter: options.limiter,
    analytics: options.analytics,
    prefix: options.prefix,
  })
}

// Different rate limiters for different endpoints
// Note: We are passing explicit config for the fallback
export const chatRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  config: { limit: 10, window: '1m' },
  analytics: true,
  prefix: 'ratelimit:chat',
})

export const aiRecommendationsRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  config: { limit: 5, window: '1m' },
  analytics: true,
  prefix: 'ratelimit:ai-recommendations',
})

export const authRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(5, '5 m'),
  config: { limit: 5, window: '5m' },
  analytics: true,
  prefix: 'ratelimit:auth',
})

export const checkoutRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(3, '1 m'),
  config: { limit: 3, window: '1m' },
  analytics: true,
  prefix: 'ratelimit:checkout',
})

export const bookingRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  config: { limit: 5, window: '1m' },
  analytics: true,
  prefix: 'ratelimit:booking',
})

export const generalRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(20, '1 m'),
  config: { limit: 20, window: '1m' },
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
// We need to accept the generic return type of createLimiter
export async function checkRateLimit(
  identifier: string,
  limiter: {
    limit: (
      identifier: string
    ) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }>
  }
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

// In-memory helper for explicit usage if needed (keeping backward compatibility if referenced elsewhere)
export class RateLimiterClass {
  static check(identifier: string, maxRequests: number = 100, windowMs: number = 900000) {
    if (maxRequests <= 0) {
      return { allowed: false, remaining: 0, reset: Date.now() + windowMs }
    }

    // Re-implementing checkLogic using the same static store approach as before for compatibility:

    const now = Date.now()
    const existing = localStore.get(identifier)

    if (!existing || now > existing.resetTime) {
      const resetTime = now + windowMs
      localStore.set(identifier, { count: 1, resetTime })
      return { allowed: true, remaining: maxRequests - 1, reset: resetTime }
    }

    if (existing.count >= maxRequests) {
      return { allowed: false, remaining: 0, reset: existing.resetTime }
    }

    existing.count++
    return { allowed: true, remaining: maxRequests - existing.count, reset: existing.resetTime }
  }

  static reset(identifier: string): void {
    localStore.delete(identifier)
  }

  static status(
    identifier: string,
    maxRequests: number = 100,
    _windowMs: number = 900000
  ): { count: number; remaining: number; resetTime: number | null } {
    const now = Date.now()
    const existing = localStore.get(identifier)

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
    for (const [key, value] of localStore.entries()) {
      if (now > value.resetTime) {
        localStore.delete(key)
      }
    }
  }
}

export const RateLimiter = RateLimiterClass
