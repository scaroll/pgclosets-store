import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { RateLimiter } from '@/lib/auth'

// Mock @vercel/kv
vi.mock('@vercel/kv', () => ({
  kv: {
    set: vi.fn(),
    del: vi.fn(),
    pipeline: vi.fn(),
    zremrangebyscore: vi.fn(),
    zcard: vi.fn(),
    zrange: vi.fn(),
    zrem: vi.fn(),
  },
}))

describe('RateLimiter', () => {
  beforeEach(() => {
    // Clear any existing rate limit data
    vi.clearAllMocks()
  })

  afterEach(async () => {
    // Cleanup
    RateLimiter.cleanup()
  })

  describe('Memory-backed rate limiting (fallback)', () => {
    it('should allow requests within the limit', async () => {
      const identifier = 'test-user-1'
      const maxRequests = 5
      const windowMs = 60000 // 1 minute

      // First request should be allowed
      const result1 = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(result1.allowed).toBe(true)
      expect(result1.remaining).toBe(4)

      // Second request should be allowed
      const result2 = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(result2.allowed).toBe(true)
      expect(result2.remaining).toBe(3)
    })

    it('should block requests exceeding the limit', async () => {
      const identifier = 'test-user-2'
      const maxRequests = 3
      const windowMs = 60000

      // Make 3 allowed requests
      for (let i = 0; i < maxRequests; i++) {
        const result = await RateLimiter.check(identifier, maxRequests, windowMs)
        expect(result.allowed).toBe(true)
      }

      // 4th request should be blocked
      const blockedResult = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(blockedResult.allowed).toBe(false)
      expect(blockedResult.remaining).toBe(0)
    })

    it('should reset rate limit after window expires', async () => {
      const identifier = 'test-user-3'
      const maxRequests = 2
      const windowMs = 100 // Very short window for testing

      // Exhaust the rate limit
      await RateLimiter.check(identifier, maxRequests, windowMs)
      await RateLimiter.check(identifier, maxRequests, windowMs)

      const blockedResult = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(blockedResult.allowed).toBe(false)

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, windowMs + 50))

      // Should be allowed again
      const allowedResult = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(allowedResult.allowed).toBe(true)
      expect(allowedResult.remaining).toBe(1)
    })

    it('should handle different identifiers independently', async () => {
      const identifier1 = 'test-user-4'
      const identifier2 = 'test-user-5'
      const maxRequests = 2
      const windowMs = 60000

      // Exhaust rate limit for identifier1
      await RateLimiter.check(identifier1, maxRequests, windowMs)
      await RateLimiter.check(identifier1, maxRequests, windowMs)

      const blocked1 = await RateLimiter.check(identifier1, maxRequests, windowMs)
      expect(blocked1.allowed).toBe(false)

      // identifier2 should still be allowed
      const allowed2 = await RateLimiter.check(identifier2, maxRequests, windowMs)
      expect(allowed2.allowed).toBe(true)
    })
  })

  describe('Rate limit reset', () => {
    it('should reset rate limit for specific identifier', async () => {
      const identifier = 'test-user-6'
      const maxRequests = 2
      const windowMs = 60000

      // Exhaust rate limit
      await RateLimiter.check(identifier, maxRequests, windowMs)
      await RateLimiter.check(identifier, maxRequests, windowMs)

      const blocked = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(blocked.allowed).toBe(false)

      // Reset rate limit
      await RateLimiter.reset(identifier)

      // Should be allowed again
      const allowed = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(allowed.allowed).toBe(true)
      expect(allowed.remaining).toBe(1)
    })
  })

  describe('Rate limit status', () => {
    it('should return current rate limit status without incrementing', async () => {
      const identifier = 'test-user-7'
      const maxRequests = 5
      const windowMs = 60000

      // Make 2 requests
      await RateLimiter.check(identifier, maxRequests, windowMs)
      await RateLimiter.check(identifier, maxRequests, windowMs)

      // Check status (should not increment)
      const status = await RateLimiter.status(identifier, maxRequests, windowMs)
      expect(status.count).toBe(2)
      expect(status.remaining).toBe(3)

      // Verify status didn't increment by making another request
      const result = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(result.remaining).toBe(2) // Should be 2, not 1
    })

    it('should return zero count for new identifier', async () => {
      const identifier = 'test-user-8'
      const maxRequests = 5
      const windowMs = 60000

      const status = await RateLimiter.status(identifier, maxRequests, windowMs)
      expect(status.count).toBe(0)
      expect(status.remaining).toBe(5)
      expect(status.resetTime).toBeNull()
    })
  })

  describe('Cleanup functionality', () => {
    it('should clean up expired entries from memory store', async () => {
      const identifier = 'test-user-9'
      const maxRequests = 5
      const windowMs = 100 // Short window

      // Create some entries
      await RateLimiter.check(identifier, maxRequests, windowMs)

      // Wait for window to expire
      await new Promise(resolve => setTimeout(resolve, windowMs + 50))

      // Trigger cleanup by making a new request
      await RateLimiter.check(identifier, maxRequests, windowMs)

      // The count should be reset
      const status = await RateLimiter.status(identifier, maxRequests, windowMs)
      expect(status.count).toBe(1)
    })
  })

  describe('Concurrent requests', () => {
    it('should handle concurrent requests correctly', async () => {
      const identifier = 'test-user-10'
      const maxRequests = 10
      const windowMs = 60000

      // Make 10 concurrent requests
      const promises = Array(10).fill(null).map(() =>
        RateLimiter.check(identifier, maxRequests, windowMs)
      )

      const results = await Promise.all(promises)

      // All should be allowed
      const allowedCount = results.filter(r => r.allowed).length
      expect(allowedCount).toBe(10)

      // Next request should be blocked
      const blocked = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(blocked.allowed).toBe(false)
    })
  })

  describe('Default parameters', () => {
    it('should use default values when not specified', async () => {
      const identifier = 'test-user-11'

      // Use default parameters (100 requests, 15 minutes)
      const result = await RateLimiter.check(identifier)

      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(99)
      expect(result.resetTime).toBeGreaterThan(Date.now())
    })
  })

  describe('Edge cases', () => {
    it('should handle zero max requests', async () => {
      const identifier = 'test-user-12'
      const maxRequests = 0
      const windowMs = 60000

      const result = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should handle very large max requests', async () => {
      const identifier = 'test-user-13'
      const maxRequests = 1000000
      const windowMs = 60000

      const result = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(999999)
    })

    it('should handle special characters in identifier', async () => {
      const identifier = 'test@user#14:with:special:chars'
      const maxRequests = 5
      const windowMs = 60000

      const result = await RateLimiter.check(identifier, maxRequests, windowMs)
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(4)
    })
  })

  describe('Distributed scenario simulation', () => {
    it('should handle rate limiting across multiple instances (memory fallback)', async () => {
      // Simulate multiple server instances using the same identifier
      const identifier = 'distributed-user-1'
      const maxRequests = 5
      const windowMs = 60000

      // Instance 1 makes 3 requests
      for (let i = 0; i < 3; i++) {
        const result = await RateLimiter.check(identifier, maxRequests, windowMs)
        expect(result.allowed).toBe(true)
      }

      // In memory mode, each instance tracks independently
      // This demonstrates the limitation that will be fixed with Redis
      const status = await RateLimiter.status(identifier, maxRequests, windowMs)
      expect(status.count).toBe(3)

      // Reset to simulate new instance
      await RateLimiter.reset(identifier)

      // Verify reset worked
      const statusAfterReset = await RateLimiter.status(identifier, maxRequests, windowMs)
      expect(statusAfterReset.count).toBe(0)
    })
  })

  describe('Performance', () => {
    it('should handle rapid sequential requests efficiently', async () => {
      const identifier = 'perf-test-1'
      const maxRequests = 100
      const windowMs = 60000

      const startTime = Date.now()

      // Make 50 rapid requests
      for (let i = 0; i < 50; i++) {
        await RateLimiter.check(identifier, maxRequests, windowMs)
      }

      const duration = Date.now() - startTime

      // Should complete in reasonable time (< 1 second for 50 requests)
      expect(duration).toBeLessThan(1000)
    })
  })

  describe('Memory leak prevention', () => {
    it('should not accumulate unlimited entries', async () => {
      const maxRequests = 5
      const windowMs = 60000

      // Create many different rate limit entries
      for (let i = 0; i < 100; i++) {
        await RateLimiter.check(`temp-user-${i}`, maxRequests, windowMs)
      }

      // Cleanup should be scheduled
      // In a real scenario, expired entries would be cleaned up periodically

      // Verify cleanup method exists and works
      RateLimiter.cleanup()

      // After cleanup, memory should be cleared
      const status = await RateLimiter.status('temp-user-1', maxRequests, windowMs)
      expect(status.count).toBe(0)
    })
  })
})
