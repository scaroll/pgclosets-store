/**
 * DIVISION 14: PERFORMANCE ENGINEERING
 * Advanced Caching Strategy - Agents 5-6
 *
 * Comprehensive caching system with:
 * - Redis integration
 * - CDN configuration
 * - Multi-layer caching
 * - Cache warming
 * - Performance monitoring
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface CacheConfig {
  redis?: {
    enabled: boolean;
    url?: string;
    ttl: number;
    maxMemory?: string;
    evictionPolicy?: 'allkeys-lru' | 'volatile-lru' | 'allkeys-lfu';
  };
  memory?: {
    enabled: boolean;
    maxSize: number; // in MB
    ttl: number;
  };
  cdn?: {
    enabled: boolean;
    provider: 'vercel' | 'cloudflare' | 'cloudfront';
    ttl: number;
    staleWhileRevalidate?: number;
  };
  strategy: 'stale-while-revalidate' | 'cache-first' | 'network-first' | 'cache-only';
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  size: number; // in bytes
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  avgLatency: number;
  totalSize: number;
  evictions: number;
}

export type CacheStrategy = 'stale-while-revalidate' | 'cache-first' | 'network-first';

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const LUXURY_CACHE_CONFIG: CacheConfig = {
  redis: {
    enabled: process.env.REDIS_URL !== undefined,
    url: process.env.REDIS_URL,
    ttl: 3600, // 1 hour
    maxMemory: '256mb',
    evictionPolicy: 'allkeys-lru',
  },
  memory: {
    enabled: true,
    maxSize: 50, // 50MB
    ttl: 300, // 5 minutes
  },
  cdn: {
    enabled: true,
    provider: 'vercel',
    ttl: 31536000, // 1 year for static assets
    staleWhileRevalidate: 86400, // 1 day
  },
  strategy: 'stale-while-revalidate',
};

// ============================================================================
// MULTI-LAYER CACHE MANAGER
// ============================================================================

export class MultiLayerCache {
  private config: CacheConfig;
  private memoryCache = new Map<string, CacheEntry>();
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    avgLatency: 0,
    totalSize: 0,
    evictions: 0,
  };
  private latencies: number[] = [];

  constructor(config: CacheConfig = LUXURY_CACHE_CONFIG) {
    this.config = config;
    this.startCleanupInterval();
  }

  /**
   * Get value from cache with multi-layer strategy
   */
  async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();

    try {
      // Layer 1: Memory cache (fastest)
      if (this.config.memory?.enabled) {
        const memResult = this.getFromMemory<T>(key);
        if (memResult !== null) {
          this.recordHit(startTime);
          return memResult;
        }
      }

      // Layer 2: Redis cache (fast)
      if (this.config.redis?.enabled) {
        const redisResult = await this.getFromRedis<T>(key);
        if (redisResult !== null) {
          // Populate memory cache
          if (this.config.memory?.enabled) {
            this.setInMemory(key, redisResult, this.config.memory.ttl);
          }
          this.recordHit(startTime);
          return redisResult;
        }
      }

      // Cache miss
      this.recordMiss(startTime);
      return null;

    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      this.recordMiss(startTime);
      return null;
    }
  }

  /**
   * Set value in cache with multi-layer strategy
   */
  async set<T>(
    key: string,
    value: T,
    options?: {
      ttl?: number;
      tags?: string[];
      priority?: 'high' | 'medium' | 'low';
    }
  ): Promise<void> {
    const ttl = options?.ttl || this.config.memory?.ttl || 300;

    try {
      // Set in memory cache
      if (this.config.memory?.enabled) {
        this.setInMemory(key, value, ttl);
      }

      // Set in Redis cache
      if (this.config.redis?.enabled) {
        await this.setInRedis(key, value, ttl, options?.tags);
      }

    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  /**
   * Invalidate cache entry
   */
  async invalidate(key: string): Promise<void> {
    try {
      // Remove from memory
      this.memoryCache.delete(key);

      // Remove from Redis
      if (this.config.redis?.enabled) {
        await this.deleteFromRedis(key);
      }

    } catch (error) {
      console.error(`Cache invalidate error for key ${key}:`, error);
    }
  }

  /**
   * Invalidate by pattern
   */
  async invalidatePattern(pattern: string): Promise<number> {
    let count = 0;

    try {
      // Invalidate memory cache
      for (const key of this.memoryCache.keys()) {
        if (this.matchPattern(key, pattern)) {
          this.memoryCache.delete(key);
          count++;
        }
      }

      // Invalidate Redis cache
      if (this.config.redis?.enabled) {
        const redisCount = await this.deletePatternFromRedis(pattern);
        count += redisCount;
      }

      console.log(`Invalidated ${count} cache entries matching pattern: ${pattern}`);
      return count;

    } catch (error) {
      console.error(`Cache pattern invalidate error:`, error);
      return count;
    }
  }

  /**
   * Get or compute value with caching
   */
  async getOrCompute<T>(
    key: string,
    computeFn: () => Promise<T>,
    options?: {
      ttl?: number;
      tags?: string[];
      strategy?: CacheStrategy;
    }
  ): Promise<T> {
    const strategy = options?.strategy || this.config.strategy;

    // Try cache first for cache-first strategy
    if (strategy === 'cache-first') {
      const cached = await this.get<T>(key);
      if (cached !== null) {
        return cached;
      }
    }

    // Compute value
    const value = await computeFn();

    // Cache the result
    await this.set(key, value, {
      ttl: options?.ttl,
      tags: options?.tags,
    });

    return value;
  }

  /**
   * Warm cache with data
   */
  async warmCache(
    entries: Array<{ key: string; value: any; ttl?: number }>
  ): Promise<void> {
    console.log(`Warming cache with ${entries.length} entries...`);

    const startTime = performance.now();

    await Promise.all(
      entries.map(entry =>
        this.set(entry.key, entry.value, { ttl: entry.ttl })
      )
    );

    const duration = performance.now() - startTime;
    console.log(`✅ Cache warmed in ${duration.toFixed(2)}ms`);
  }

  /**
   * Get cache metrics
   */
  getMetrics(): CacheMetrics {
    const totalRequests = this.metrics.hits + this.metrics.misses;
    this.metrics.hitRate = totalRequests > 0
      ? this.metrics.hits / totalRequests
      : 0;

    this.metrics.avgLatency = this.latencies.length > 0
      ? this.latencies.reduce((sum, l) => sum + l, 0) / this.latencies.length
      : 0;

    this.metrics.totalSize = Array.from(this.memoryCache.values())
      .reduce((sum, entry) => sum + entry.size, 0);

    return { ...this.metrics };
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    this.memoryCache.clear();

    if (this.config.redis?.enabled) {
      await this.clearRedis();
    }

    this.resetMetrics();
    console.log('✅ Cache cleared');
  }

  // ============================================================================
  // PRIVATE METHODS - Memory Cache
  // ============================================================================

  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);

    if (!entry) {
      return null;
    }

    // Check TTL
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl * 1000) {
      this.memoryCache.delete(key);
      this.metrics.evictions++;
      return null;
    }

    // Update hits
    entry.hits++;
    return entry.value as T;
  }

  private setInMemory<T>(key: string, value: T, ttl: number): void {
    // Check size limit
    if (this.config.memory?.enabled && this.config.memory.maxSize) {
      this.enforceMemoryLimit();
    }

    const size = this.estimateSize(value);

    this.memoryCache.set(key, {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      size,
    });
  }

  private enforceMemoryLimit(): void {
    const maxSizeBytes = (this.config.memory?.maxSize || 50) * 1024 * 1024;
    const currentSize = Array.from(this.memoryCache.values())
      .reduce((sum, entry) => sum + entry.size, 0);

    if (currentSize > maxSizeBytes) {
      // Evict least recently used entries
      const entries = Array.from(this.memoryCache.entries())
        .sort((a, b) => {
          // Sort by hits (ascending) then timestamp (ascending)
          if (a[1].hits !== b[1].hits) {
            return a[1].hits - b[1].hits;
          }
          return a[1].timestamp - b[1].timestamp;
        });

      let freedSize = 0;
      for (const [key, entry] of entries) {
        this.memoryCache.delete(key);
        freedSize += entry.size;
        this.metrics.evictions++;

        if (currentSize - freedSize <= maxSizeBytes * 0.8) {
          break;
        }
      }

      console.log(`Evicted ${this.metrics.evictions} entries, freed ${this.formatBytes(freedSize)}`);
    }
  }

  // ============================================================================
  // PRIVATE METHODS - Redis Cache (Placeholder)
  // ============================================================================

  private async getFromRedis<T>(key: string): Promise<T | null> {
    // Placeholder for Redis integration
    // In production, use: const redis = new Redis(this.config.redis.url)
    // return await redis.get(key)
    return null;
  }

  private async setInRedis<T>(
    key: string,
    value: T,
    ttl: number,
    tags?: string[]
  ): Promise<void> {
    // Placeholder for Redis integration
    // In production, use: await redis.setex(key, ttl, JSON.stringify(value))
    // If tags: await redis.sadd(`tag:${tag}`, key)
  }

  private async deleteFromRedis(key: string): Promise<void> {
    // Placeholder for Redis integration
    // In production, use: await redis.del(key)
  }

  private async deletePatternFromRedis(pattern: string): Promise<number> {
    // Placeholder for Redis integration
    // In production, use: const keys = await redis.keys(pattern)
    // await redis.del(...keys)
    return 0;
  }

  private async clearRedis(): Promise<void> {
    // Placeholder for Redis integration
    // In production, use: await redis.flushdb()
  }

  // ============================================================================
  // PRIVATE METHODS - Utilities
  // ============================================================================

  private estimateSize(value: any): number {
    try {
      return new Blob([JSON.stringify(value)]).size;
    } catch {
      return 0;
    }
  }

  private matchPattern(key: string, pattern: string): boolean {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(key);
  }

  private recordHit(startTime: number): void {
    this.metrics.hits++;
    const latency = performance.now() - startTime;
    this.latencies.push(latency);

    // Keep only last 1000 latencies
    if (this.latencies.length > 1000) {
      this.latencies.shift();
    }
  }

  private recordMiss(startTime: number): void {
    this.metrics.misses++;
    const latency = performance.now() - startTime;
    this.latencies.push(latency);

    if (this.latencies.length > 1000) {
      this.latencies.shift();
    }
  }

  private resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      avgLatency: 0,
      totalSize: 0,
      evictions: 0,
    };
    this.latencies = [];
  }

  private startCleanupInterval(): void {
    if (typeof window === 'undefined') {
      setInterval(() => {
        this.cleanupExpiredEntries();
      }, 60000); // Every minute
    }
  }

  private cleanupExpiredEntries(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.memoryCache.entries()) {
      if (now - entry.timestamp > entry.ttl * 1000) {
        this.memoryCache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Cleaned up ${cleaned} expired cache entries`);
    }
  }

  private formatBytes(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  }
}

// ============================================================================
// CDN CACHE HELPERS
// ============================================================================

/**
 * Generate CDN cache headers
 */
export function getCDNCacheHeaders(
  type: 'static' | 'dynamic' | 'api' | 'image',
  config: CacheConfig = LUXURY_CACHE_CONFIG
): Record<string, string> {
  const headers: Record<string, string> = {};

  switch (type) {
    case 'static':
      headers['Cache-Control'] = `public, max-age=${config.cdn?.ttl || 31536000}, immutable`;
      break;

    case 'image':
      const imageCache = config.cdn?.ttl || 31536000;
      const swr = config.cdn?.staleWhileRevalidate || 86400;
      headers['Cache-Control'] = `public, max-age=${imageCache}, stale-while-revalidate=${swr}`;
      break;

    case 'dynamic':
      headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
      break;

    case 'api':
      headers['Cache-Control'] = 'no-store, max-age=0';
      break;
  }

  return headers;
}

/**
 * Generate cache key
 */
export function generateCacheKey(
  namespace: string,
  params: Record<string, any>
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return `${namespace}:${sortedParams}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

// Singleton instance
export const cacheManager = new MultiLayerCache();

// Export utility functions
export { getCDNCacheHeaders, generateCacheKey };
export default MultiLayerCache;
