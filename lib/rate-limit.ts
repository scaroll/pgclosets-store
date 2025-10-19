import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const hasRedis = Boolean(process.env.REDIS_URL && process.env.REDIS_TOKEN)
const redis = hasRedis
  ? new Redis({ url: process.env.REDIS_URL!, token: process.env.REDIS_TOKEN! })
  : undefined

function createLimiter(
  prefix: string,
  window: Parameters<typeof Ratelimit.slidingWindow>[1],
  points: Parameters<typeof Ratelimit.slidingWindow>[0],
) {
  if (!redis) return undefined
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(points, window),
    analytics: true,
    prefix,
  })
}

export const chatRateLimiter = createLimiter('ratelimit:chat', '1 m', 10)
export const aiRecommendationsRateLimiter = createLimiter('ratelimit:ai-recommendations', '1 m', 5)
export const authRateLimiter = createLimiter('ratelimit:auth', '5 m', 5)
export const checkoutRateLimiter = createLimiter('ratelimit:checkout', '1 m', 3)
export const generalRateLimiter = createLimiter('ratelimit:general', '1 m', 20)
export const bookingRateLimiter = createLimiter('ratelimit:booking', '1 m', 5)

// Helper function to get client identifier
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

// Helper function to check rate limit
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit | undefined,
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  if (!limiter) {
    return { allowed: true, remaining: 999999, reset: Date.now() + 60_000 }
  }
  const { success, remaining, reset } = await limiter.limit(identifier)
  return { allowed: success, remaining, reset }
}

// Specific rate limit checkers for common use cases
export async function checkChatRateLimit(req: Request) {
  const identifier = getClientIdentifier(req);
  return checkRateLimit(identifier, chatRateLimiter);
}

export async function checkAuthRateLimit(req: Request) {
  const identifier = getClientIdentifier(req);
  return checkRateLimit(identifier, authRateLimiter);
}

export async function checkCheckoutRateLimit(req: Request) {
  const identifier = getClientIdentifier(req);
  return checkRateLimit(identifier, checkoutRateLimiter);
}

export async function checkBookingRateLimit(req: Request) {
  const identifier = getClientIdentifier(req);
  return checkRateLimit(identifier, bookingRateLimiter);
}
