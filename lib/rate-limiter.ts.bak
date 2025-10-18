import { NextRequest, NextResponse } from 'next/server';

/**
 * Rate Limiter Implementation
 * Prevents API abuse with IP-based request throttling
 */

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, RateLimitRecord>();

export interface RateLimitConfig {
  maxRequests: number; // Max requests per window
  windowMs: number; // Time window in milliseconds
  message?: string; // Custom error message
}

/**
 * Default rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  chat: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute
    message: 'Too many chat requests. Please wait before sending more messages.',
  },
  recommendations: {
    maxRequests: 20,
    windowMs: 60 * 1000, // 20 requests per minute
    message: 'Too many recommendation requests. Please try again later.',
  },
  search: {
    maxRequests: 30,
    windowMs: 60 * 1000, // 30 requests per minute
    message: 'Too many search requests. Please slow down.',
  },
  embeddings: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 10 requests per minute
    message: 'Too many embedding requests. Please wait before trying again.',
  },
  default: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 50 requests per minute
    message: 'Too many requests. Please try again later.',
  },
} as const;

/**
 * Get client IP address from request
 */
function getClientIp(req: NextRequest): string {
  // Check common headers for client IP
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to Vercel's geo header
  const vercelIp = req.headers.get('x-vercel-forwarded-for');
  if (vercelIp) {
    return vercelIp.split(',')[0].trim();
  }

  // Ultimate fallback
  return 'unknown';
}

/**
 * Clean up expired entries from rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every minute
setInterval(cleanupExpiredEntries, 60 * 1000);

/**
 * Check if request should be rate limited
 * Returns null if allowed, error response if rate limited
 */
export function checkRateLimit(
  req: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.default
): NextResponse | null {
  const clientIp = getClientIp(req);
  const key = `${clientIp}:${req.nextUrl.pathname}`;
  const now = Date.now();

  // Get or create rate limit record
  let record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Create new record
    record = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, record);
    return null; // Allow request
  }

  // Increment count
  record.count++;

  // Check if limit exceeded
  if (record.count > config.maxRequests) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);

    return NextResponse.json(
      {
        success: false,
        error: 'Rate limit exceeded',
        message: config.message || 'Too many requests',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(record.resetTime).toISOString(),
        },
      }
    );
  }

  // Allow request
  return null;
}

/**
 * Rate limiter middleware wrapper
 * Usage: export const POST = withRateLimit(handler, RATE_LIMITS.chat);
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  config: RateLimitConfig = RATE_LIMITS.default
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Check rate limit
    const rateLimitResponse = checkRateLimit(req, config);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Add rate limit headers to successful responses
    const clientIp = getClientIp(req);
    const key = `${clientIp}:${req.nextUrl.pathname}`;
    const record = rateLimitStore.get(key);

    try {
      const response = await handler(req);

      if (record) {
        const remaining = Math.max(0, config.maxRequests - record.count);
        response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
        response.headers.set('X-RateLimit-Remaining', remaining.toString());
        response.headers.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
      }

      return response;
    } catch (error) {
      console.error('[Rate Limiter] Handler error:', error);
      throw error;
    }
  };
}

/**
 * Get rate limit status for a client
 * Useful for debugging and monitoring
 */
export function getRateLimitStatus(
  req: NextRequest,
  config: RateLimitConfig = RATE_LIMITS.default
): {
  limit: number;
  remaining: number;
  reset: Date;
  blocked: boolean;
} {
  const clientIp = getClientIp(req);
  const key = `${clientIp}:${req.nextUrl.pathname}`;
  const now = Date.now();

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    return {
      limit: config.maxRequests,
      remaining: config.maxRequests,
      reset: new Date(now + config.windowMs),
      blocked: false,
    };
  }

  const remaining = Math.max(0, config.maxRequests - record.count);
  const blocked = record.count > config.maxRequests;

  return {
    limit: config.maxRequests,
    remaining,
    reset: new Date(record.resetTime),
    blocked,
  };
}

/**
 * Reset rate limit for a specific client (admin function)
 */
export function resetRateLimit(clientIp: string, pathname: string): void {
  const key = `${clientIp}:${pathname}`;
  rateLimitStore.delete(key);
}

/**
 * Get all rate limit statistics (monitoring)
 */
export function getRateLimitStats(): {
  totalKeys: number;
  entries: Array<{
    key: string;
    count: number;
    resetTime: string;
  }>;
} {
  const entries = Array.from(rateLimitStore.entries()).map(([key, record]) => ({
    key,
    count: record.count,
    resetTime: new Date(record.resetTime).toISOString(),
  }));

  return {
    totalKeys: rateLimitStore.size,
    entries,
  };
}
