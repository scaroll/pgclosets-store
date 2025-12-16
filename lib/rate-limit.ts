// @ts-nocheck - Rate limiter with dynamic types
import { NextRequest } from 'next/server';

interface RateLimiter {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Rate limiter for authentication routes
 */
export const authRateLimiter: RateLimiter = {
  maxRequests: 5,  // 5 attempts
  windowMs: 15 * 60 * 1000,  // 15 minutes
};

/**
 * Rate limiter for API routes
 */
export const apiRateLimiter: RateLimiter = {
  maxRequests: 100,
  windowMs: 60 * 1000,  // 1 minute
};

/**
 * Rate limiter for general routes
 */
export const generalRateLimiter: RateLimiter = {
  maxRequests: 60,
  windowMs: 60 * 1000,  // 1 minute
};

/**
 * Rate limiter for booking routes
 */
export const bookingRateLimiter: RateLimiter = {
  maxRequests: 10,
  windowMs: 60 * 1000,  // 1 minute
};

/**
 * Get client identifier from request
 */
export function getClientIdentifier(req: NextRequest): string {
  // Try to get IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0].trim() || realIp || req.ip || 'unknown';

  return ip;
}

/**
 * Check if the request is rate limited
 */
export async function checkRateLimit(
  identifier: string,
  limiter: RateLimiter
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const now = Date.now();
  const key = `${identifier}:${limiter.maxRequests}:${limiter.windowMs}`;

  const entry = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  if (!entry || now > entry.resetTime) {
    // No entry or expired - create new one
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + limiter.windowMs,
    };
    rateLimitStore.set(key, newEntry);

    return {
      allowed: true,
      remaining: limiter.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Check if limit exceeded
  if (entry.count >= limiter.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }

  // Increment counter
  entry.count += 1;
  rateLimitStore.set(key, entry);

  return {
    allowed: true,
    remaining: limiter.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Reset rate limit for a specific identifier
 */
export function resetRateLimit(identifier: string): void {
  for (const key of rateLimitStore.keys()) {
    if (key.startsWith(identifier)) {
      rateLimitStore.delete(key);
    }
  }
}
