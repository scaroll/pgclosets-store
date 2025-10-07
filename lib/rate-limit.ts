/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API protection
 *
 * For production with multiple instances, consider using:
 * - Redis (Upstash, Vercel KV)
 * - Vercel Edge Config
 * - Database-backed rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter: number;
}

// In-memory store for rate limiting
// Note: This will reset on server restart and won't work across multiple instances
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval (runs every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

// Automatic cleanup of expired entries
let cleanupTimer: NodeJS.Timeout | null = null;

function startCleanup() {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => rateLimitStore.delete(key));

    if (keysToDelete.length > 0) {
      console.log(`[Rate Limit] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }, CLEANUP_INTERVAL);

  // Prevent the timer from keeping the process alive
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

// Start cleanup on module load
startCleanup();

/**
 * Check if a request is allowed based on rate limiting rules
 *
 * @param identifier - Unique identifier (usually IP address)
 * @param options - Rate limiting configuration
 * @returns Rate limit result with allowed status and metadata
 *
 * @example
 * const result = await checkRateLimit(ip, { maxRequests: 3, windowMs: 60000 });
 * if (!result.allowed) {
 *   return NextResponse.json({ error: 'Too many requests' }, {
 *     status: 429,
 *     headers: { 'Retry-After': String(Math.ceil(result.retryAfter / 1000)) }
 *   });
 * }
 */
export async function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const { maxRequests, windowMs } = options;
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  // Get or create entry
  let entry = rateLimitStore.get(key);

  // Entry doesn't exist or has expired
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, entry);

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: entry.resetTime,
      retryAfter: 0,
    };
  }

  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: entry.resetTime - now,
    };
  }

  // Increment counter
  entry.count++;

  return {
    allowed: true,
    remaining: maxRequests - entry.count,
    resetTime: entry.resetTime,
    retryAfter: 0,
  };
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or admin override
 *
 * @param identifier - Unique identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  const key = `ratelimit:${identifier}`;
  rateLimitStore.delete(key);
  console.log(`[Rate Limit] Reset limit for: ${identifier}`);
}

/**
 * Get current rate limit status without incrementing
 *
 * @param identifier - Unique identifier to check
 * @param options - Rate limiting configuration
 * @returns Current rate limit status
 */
export function getRateLimitStatus(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const { maxRequests, windowMs } = options;
  const now = Date.now();
  const key = `ratelimit:${identifier}`;

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: now + windowMs,
      retryAfter: 0,
    };
  }

  return {
    allowed: entry.count < maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    resetTime: entry.resetTime,
    retryAfter: entry.count >= maxRequests ? entry.resetTime - now : 0,
  };
}

/**
 * Clear all rate limit entries
 * USE WITH CAUTION - primarily for testing
 */
export function clearAllRateLimits(): void {
  const count = rateLimitStore.size;
  rateLimitStore.clear();
  console.log(`[Rate Limit] Cleared all ${count} entries`);
}

/**
 * Get statistics about current rate limiting
 * Useful for monitoring and debugging
 */
export function getRateLimitStats(): {
  totalEntries: number;
  activeEntries: number;
  expiredEntries: number;
} {
  const now = Date.now();
  let activeEntries = 0;
  let expiredEntries = 0;

  for (const entry of rateLimitStore.values()) {
    if (now > entry.resetTime) {
      expiredEntries++;
    } else {
      activeEntries++;
    }
  }

  return {
    totalEntries: rateLimitStore.size,
    activeEntries,
    expiredEntries,
  };
}

// Export cleanup function for graceful shutdown
export function stopRateLimitCleanup(): void {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;
    console.log('[Rate Limit] Stopped cleanup timer');
  }
}
