import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Determine if we have valid Upstash credentials
const redisUrl = process.env.REDIS_URL || ''
const isUpstash = redisUrl.startsWith('https://')

// Create Redis client or mock
let redis: any

if (isUpstash) {
  redis = new Redis({
    url: process.env.REDIS_URL!,
    token: process.env.REDIS_TOKEN!,
  })
} else {
  console.warn(
    '⚠️  REDIS_URL is not an Upstash HTTPS URL. Rate limiting will be disabled (allowing all requests).'
  )
  // Mock Redis for local dev
  redis = {
    incr: async () => 1,
    expire: async () => 1,
    eval: async () => [1, 1, 1, 1], // Mock Lua script response
  }
}

// Helper to create limiter (graceful fallback)
const createLimiter = (options: any) => {
  if (!isUpstash) {
    // Return a mock limiter that always allows
    return {
      limit: async () => ({ success: true, limit: 100, remaining: 99, reset: 0 }),
    } as any as Ratelimit
  }
  return new Ratelimit({
    ...options,
    redis,
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

export const generalRateLimiter = createLimiter({
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
  analytics: true,
  prefix: 'ratelimit:general',
})

// Helper function to get client identifier
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}

// Helper function to check rate limit
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier)

    return {
      allowed: success,
      remaining,
      reset,
    }
  } catch (error) {
    console.error('Rate limit error:', error)
    // Fail open
    return { allowed: true, remaining: 1, reset: 0 }
  }
}
