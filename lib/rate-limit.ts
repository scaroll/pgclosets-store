import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client
const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

// Different rate limiters for different endpoints
export const chatRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
  prefix: 'ratelimit:chat',
});

export const aiRecommendationsRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
  analytics: true,
  prefix: 'ratelimit:ai-recommendations',
});

export const authRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '5 m'), // 5 requests per 5 minutes
  analytics: true,
  prefix: 'ratelimit:auth',
});

export const checkoutRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 m'), // 3 requests per minute
  analytics: true,
  prefix: 'ratelimit:checkout',
});

export const generalRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
  analytics: true,
  prefix: 'ratelimit:general',
});

export const bookingRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
  analytics: true,
  prefix: 'ratelimit:booking',
});

// Helper function to get client identifier
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
  return ip;
}

// Helper function to check rate limit
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit
): Promise<{ allowed: boolean; remaining: number; reset: number }> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  return {
    allowed: success,
    remaining,
    reset,
  };
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