# Rate Limiter Migration Guide

## Overview

This document describes the migration from an in-memory rate limiter to a production-ready Redis-backed solution using Vercel KV.

## Security Issue (Fixed)

### Previous Implementation
The original `RateLimiter` class used an in-memory `Map<string, {count, resetTime}>` which had critical security vulnerabilities:

1. **Server Restart Vulnerability**: Rate limits reset on server restart
2. **Distributed Deployment Issue**: Multiple server instances don't share rate limit state
3. **Memory Leak**: No cleanup mechanism for expired entries
4. **No Persistence**: Rate limits are lost on process restart

### New Implementation
The new `RateLimiter` uses Vercel KV (Redis) with intelligent fallback:

- **Redis-backed** (Production): Persistent, distributed rate limiting
- **In-memory fallback** (Development): Automatic fallback when Redis unavailable
- **Automatic cleanup**: Expired entries are removed to prevent memory leaks
- **Sliding window algorithm**: More accurate rate limiting using Redis sorted sets

## Features

### 1. Production-Ready Redis Backend
- Uses Vercel KV for persistent, distributed rate limiting
- Sliding window algorithm using Redis sorted sets
- Atomic operations via Redis pipelines
- Automatic key expiration with TTL

### 2. Intelligent Fallback
- Automatically falls back to in-memory storage when Redis is unavailable
- Caches Redis availability check for 60 seconds to reduce overhead
- Graceful error handling with automatic recovery

### 3. Memory Leak Prevention
- Automatic cleanup of expired entries every 5 minutes
- Process exit handlers to stop cleanup intervals
- Clear separation between memory and Redis storage

### 4. Same API Surface
The new implementation maintains the same API as before:

```typescript
// Check rate limit (now async)
const result = await RateLimiter.check(identifier, maxRequests, windowMs)

// Reset rate limit
await RateLimiter.reset(identifier)

// New: Get status without incrementing
const status = await RateLimiter.status(identifier, maxRequests, windowMs)

// New: Cleanup resources
RateLimiter.cleanup()
```

## Deployment Requirements

### Vercel Deployment (Recommended)

1. **Add Vercel KV Integration**:
   - Go to your Vercel project dashboard
   - Navigate to "Storage" > "Create Database"
   - Select "KV (Redis)" and create a new KV database
   - Vercel will automatically set environment variables:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`

2. **Deploy**:
   ```bash
   git push origin main
   # Vercel will automatically deploy with KV configured
   ```

3. **Verify**:
   - Check deployment logs for `[RateLimiter] Redis unavailable` warnings
   - If Redis is working, you won't see these warnings

### Manual Redis Setup (Alternative)

If not using Vercel, you can use any Redis provider:

1. **Get Redis Connection**:
   - [Redis Cloud](https://redis.com/redis-enterprise-cloud/)
   - [Upstash](https://upstash.com/)
   - Self-hosted Redis

2. **Set Environment Variables**:
   ```bash
   KV_REST_API_URL=your_redis_url
   KV_REST_API_TOKEN=your_redis_token
   ```

3. **Configure @vercel/kv**:
   The `@vercel/kv` package works with any Redis provider that supports REST API.

### Local Development

No Redis required for local development:

1. The rate limiter will automatically use in-memory fallback
2. You'll see a warning in logs: `[RateLimiter] Redis unavailable, falling back to in-memory store`
3. This is expected and safe for development

**Optional**: Run local Redis for testing:
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Set environment variables
KV_REST_API_URL=redis://localhost:6379
```

## Migration Steps

### 1. Code Changes (Already Complete)

- ✅ Installed `@vercel/kv` package
- ✅ Updated `RateLimiter` class to use Redis
- ✅ Updated all calling code to handle async rate limiter
- ✅ Added comprehensive tests
- ✅ Updated `.env.example` with documentation

### 2. Breaking Changes

**API Change**: `RateLimiter.check()` is now async

**Before**:
```typescript
const rateLimit = RateLimiter.check(`upload:${ip}`, 10, 60 * 1000)
if (!rateLimit.allowed) {
  // Handle rate limit
}
```

**After**:
```typescript
const rateLimit = await RateLimiter.check(`upload:${ip}`, 10, 60 * 1000)
if (!rateLimit.allowed) {
  // Handle rate limit
}
```

**Impact**: All files using `RateLimiter.check()` have been updated:
- `/app/api/upload/route.ts`
- `/app/api/delete/route.ts`

### 3. Testing

Run the comprehensive test suite:

```bash
npm run test tests/lib/rate-limiter.test.ts
```

**Test Coverage**:
- ✅ Basic rate limiting (allow/block)
- ✅ Window expiration
- ✅ Different identifiers
- ✅ Rate limit reset
- ✅ Status checking (non-incrementing)
- ✅ Concurrent requests
- ✅ Edge cases (zero limit, special characters)
- ✅ Cleanup functionality
- ✅ Performance benchmarks
- ✅ Memory leak prevention

### 4. Deployment Verification

After deploying to production:

1. **Check Logs** for Redis connectivity:
   ```
   # Good (Redis working)
   [RateLimiter] Using Redis for rate limiting

   # Fallback (Redis unavailable)
   [RateLimiter] Redis unavailable, falling back to in-memory store
   ```

2. **Test Rate Limiting**:
   ```bash
   # Make multiple rapid requests
   for i in {1..20}; do
     curl -X POST https://your-domain.com/api/upload \
       -H "Authorization: Bearer YOUR_TOKEN" \
       -F "file=@test.jpg"
   done

   # Should eventually return 429 (rate limit exceeded)
   ```

3. **Verify Distributed Behavior**:
   - Rate limits should persist across server restarts
   - Rate limits should be shared across multiple server instances
   - Rate limits should not reset when deploying new versions

## Performance Characteristics

### Redis Mode (Production)
- **Latency**: ~10-50ms per check (includes Redis network roundtrip)
- **Throughput**: Handles thousands of requests per second
- **Memory**: Minimal (keys expire automatically)
- **Scalability**: Fully distributed across all server instances

### Memory Mode (Development/Fallback)
- **Latency**: <1ms per check (in-memory)
- **Throughput**: Very high (limited by CPU only)
- **Memory**: Grows with unique identifiers, cleaned every 5 minutes
- **Scalability**: Limited to single server instance

## Monitoring

### Key Metrics to Monitor

1. **Rate Limit Hit Rate**:
   - How often are requests being blocked?
   - May indicate need to adjust limits

2. **Redis Availability**:
   - Monitor for fallback warnings
   - Indicates Redis connectivity issues

3. **Response Time**:
   - Rate limiter should add <50ms to request time
   - Higher latency may indicate Redis performance issues

4. **Memory Usage** (if using fallback):
   - Monitor for memory leaks
   - Should see cleanup logs every 5 minutes

### Logging

The rate limiter logs important events:

```typescript
// Redis unavailable
console.warn('[RateLimiter] Redis unavailable, falling back to in-memory store:', error)

// Redis operation failed
console.error('[RateLimiter] Redis operation failed, falling back to memory:', error)

// Cleanup performed
console.log('[RateLimiter] Cleaned 15 expired entries from memory store')
```

## Troubleshooting

### Issue: Rate limits reset on deployment

**Cause**: Redis is not configured or unavailable

**Solution**:
1. Check Vercel KV is connected to your project
2. Verify environment variables are set:
   ```bash
   vercel env ls
   # Should show KV_REST_API_URL and KV_REST_API_TOKEN
   ```
3. Check deployment logs for connection errors

### Issue: Rate limits not shared across instances

**Cause**: Using in-memory fallback instead of Redis

**Solution**:
1. Enable Redis in production (see Deployment Requirements)
2. Check for "[RateLimiter] Redis unavailable" warnings in logs
3. Verify Redis credentials are correct

### Issue: High Redis latency

**Cause**: Redis server is geographically distant or overloaded

**Solution**:
1. Use Vercel KV (automatically co-located with your deployment)
2. Check Redis server performance metrics
3. Consider caching strategy for high-traffic endpoints

### Issue: Memory growing in development

**Cause**: In-memory fallback accumulating rate limit entries

**Solution**:
1. This is normal for development (automatic cleanup every 5 minutes)
2. Restart server to clear memory
3. Call `RateLimiter.cleanup()` manually if needed

## Configuration Options

### Rate Limit Defaults

Configured in `.env` or `.env.local`:

```bash
# General API rate limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes

# Lead submission rate limiting
LEAD_RATE_LIMIT_MAX_REQUESTS=3
LEAD_RATE_LIMIT_WINDOW_MS=3600000  # 1 hour
```

### Per-Endpoint Configuration

Rate limits can be customized per endpoint:

```typescript
// Upload endpoint: 10 uploads per minute
const rateLimit = await RateLimiter.check(
  `upload:${ip}`,
  10,
  60 * 1000
)

// Delete endpoint: 5 deletions per minute
const rateLimit = await RateLimiter.check(
  `delete:${ip}`,
  5,
  60 * 1000
)
```

## Advanced Usage

### Custom Identifiers

Use composite identifiers for fine-grained rate limiting:

```typescript
// Per-user rate limiting
await RateLimiter.check(`user:${userId}:api`, 1000, 3600000)

// Per-IP rate limiting
await RateLimiter.check(`ip:${ipAddress}:login`, 5, 300000)

// Per-action rate limiting
await RateLimiter.check(`action:${action}:${userId}`, 10, 60000)
```

### Rate Limit Headers

Add standard rate limit headers to responses:

```typescript
const rateLimit = await RateLimiter.check(identifier, maxRequests, windowMs)

return NextResponse.json(data, {
  headers: {
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': rateLimit.remaining.toString(),
    'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
  }
})
```

### Dynamic Rate Limits

Adjust limits based on user tier:

```typescript
const limits = {
  free: { maxRequests: 10, windowMs: 3600000 },    // 10/hour
  pro: { maxRequests: 100, windowMs: 3600000 },     // 100/hour
  enterprise: { maxRequests: 1000, windowMs: 3600000 } // 1000/hour
}

const userLimit = limits[user.tier] || limits.free
const rateLimit = await RateLimiter.check(
  `user:${user.id}`,
  userLimit.maxRequests,
  userLimit.windowMs
)
```

## Security Considerations

1. **Identifier Selection**: Use stable identifiers (IP, user ID)
   - Don't use easily forgeable values (client-provided IDs)
   - Consider using `x-forwarded-for` header carefully

2. **Rate Limit Bypass**: Implement multiple layers
   - IP-based rate limiting
   - User-based rate limiting
   - Action-based rate limiting

3. **DDoS Protection**: Rate limiting is one layer
   - Supplement with CDN-level protection (Cloudflare, etc.)
   - Implement connection limiting
   - Use request validation

4. **Privacy**: Rate limit data may contain PII
   - Use hashed identifiers when possible
   - Implement data retention policies
   - Comply with GDPR/privacy regulations

## Rollback Plan

If issues arise after deployment:

1. **Temporary**: Force memory fallback by disconnecting Redis
   - Remove `KV_REST_API_URL` environment variable
   - System will automatically fall back to in-memory

2. **Permanent**: Revert to previous implementation
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

Note: In-memory fallback is NOT suitable for production with multiple instances.

## Future Enhancements

Potential improvements for future iterations:

1. **Token Bucket Algorithm**: More flexible rate limiting
2. **Weighted Rate Limits**: Different costs for different actions
3. **Dynamic Adjustments**: AI-based rate limit tuning
4. **Geofencing**: Different limits per region
5. **Circuit Breaker**: Automatic backoff on system overload
6. **Metrics Dashboard**: Real-time rate limit monitoring
7. **Redis Cluster**: High availability setup

## Support

For issues or questions:

1. Check logs for error messages
2. Review this documentation
3. Check Redis/Vercel KV dashboard
4. Contact DevOps team for production issues

## References

- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)
- [@vercel/kv Package](https://www.npmjs.com/package/@vercel/kv)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
- [Redis Sorted Sets](https://redis.io/docs/data-types/sorted-sets/)
