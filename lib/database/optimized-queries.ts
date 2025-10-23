/**
 * Optimized Database Query System
 *
 * This module provides optimized database queries to reduce N+1 problems:
 * - Batch loading strategies
 * - Query optimization
 * - Connection pooling
 * - Caching integration
 * - Pagination optimization
 */

import { cache } from '@/lib/caching/performance-cache'

// Database connection configuration
interface DatabaseConfig {
  maxConnections: number
  connectionTimeout: number
  idleTimeout: number
  maxLifetime: number
}

const DB_CONFIG: DatabaseConfig = {
  maxConnections: 20,
  connectionTimeout: 10000, // 10 seconds
  idleTimeout: 30000, // 30 seconds
  maxLifetime: 3600000 // 1 hour
}

/**
 * Query Builder for optimized database operations
 */
class QueryBuilder {
  private tableName: string
  private selects: string[] = []
  private joins: string[] = []
  private wheres: string[] = []
  private orderBys: string[] = []
  private limitValue?: number
  private offsetValue?: number
  private params: any[] = []

  constructor(tableName: string) {
    this.tableName = tableName
  }

  select(columns: string[]): this {
    this.selects = columns
    return this
  }

  join(table: string, condition: string): this {
    this.joins.push(`INNER JOIN ${table} ON ${condition}`)
    return this
  }

  leftJoin(table: string, condition: string): this {
    this.joins.push(`LEFT JOIN ${table} ON ${condition}`)
    return this
  }

  where(condition: string, params?: any[]): this {
    this.wheres.push(condition)
    if (params) {
      this.params.push(...params)
    }
    return this
  }

  orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this.orderBys.push(`${column} ${direction}`)
    return this
  }

  limit(count: number): this {
    this.limitValue = count
    return this
  }

  offset(count: number): this {
    this.offsetValue = count
    return this
  }

  build(): { query: string; params: any[] } {
    let query = `SELECT ${this.selects.length > 0 ? this.selects.join(', ') : '*'}`
    query += ` FROM ${this.tableName}`

    if (this.joins.length > 0) {
      query += ` ${this.joins.join(' ')}`
    }

    if (this.wheres.length > 0) {
      query += ` WHERE ${this.wheres.join(' AND ')}`
    }

    if (this.orderBys.length > 0) {
      query += ` ORDER BY ${this.orderBys.join(', ')}`
    }

    if (this.limitValue !== undefined) {
      query += ` LIMIT ${this.limitValue}`
    }

    if (this.offsetValue !== undefined) {
      query += ` OFFSET ${this.offsetValue}`
    }

    return { query, params: [...this.params] }
  }
}

/**
 * Batch Loading System
 */
class BatchLoader {
  private pendingLoads = new Map<string, Set<any>>()
  private loadingPromises = new Map<string, Promise<any[]>>()

  /**
   * Schedule a batch load for items of the same type
   */
  async loadItems<T>(
    type: string,
    ids: any[],
    loadFn: (ids: any[]) => Promise<T[]>
  ): Promise<T[]> {
    // Filter out items already being loaded
    const pendingIds = ids.filter(id => {
      const pending = this.pendingLoads.get(type)
      return !pending?.has(id)
    })

    if (pendingIds.length === 0) {
      return []
    }

    // Add to pending loads
    const pending = this.pendingLoads.get(type) || new Set()
    pendingIds.forEach(id => pending.add(id))
    this.pendingLoads.set(type, pending)

    // Get or create loading promise
    let loadingPromise = this.loadingPromises.get(type)
    if (!loadingPromise) {
      loadingPromise = this.executeBatchLoad(type, loadFn)
      this.loadingPromises.set(type, loadingPromise)
    }

    return loadingPromise
  }

  private async executeBatchLoad<T>(
    type: string,
    loadFn: (ids: any[]) => Promise<T[]>
  ): Promise<T[]> {
    const pendingIds = Array.from(this.pendingLoads.get(type) || [])

    try {
      const results = await loadFn(pendingIds)
      return results
    } finally {
      // Clean up
      this.pendingLoads.delete(type)
      this.loadingPromises.delete(type)
    }
  }
}

/**
 * Optimized Product Queries
 */
export class ProductQueries {
  private batchLoader = new BatchLoader()

  /**
   * Get products with all related data in a single query
   */
  static async getProductsWithDetails(
    categoryIds?: string[],
    limit: number = 20,
    offset: number = 0
  ): Promise<any[]> {
    const cacheKey = `products_details_${categoryIds?.join(',') || 'all'}_${limit}_${offset}`

    // Check cache first
    const cached = cache.getProduct(cacheKey)
    if (cached) {
      return cached
    }

    const query = new QueryBuilder('products p')
      .select([
        'p.id',
        'p.name',
        'p.slug',
        'p.description',
        'p.price',
        'p.category_id',
        'c.name as category_name',
        'c.slug as category_slug',
        'pi.url as image_url',
        'pi.alt_text as image_alt',
        'p.created_at',
        'p.updated_at'
      ])
      .leftJoin('categories c', 'c.id = p.category_id')
      .leftJoin('product_images pi', 'pi.product_id = p.id AND pi.is_primary = true')
      .orderBy('p.created_at', 'DESC')
      .limit(limit)
      .offset(offset)

    if (categoryIds && categoryIds.length > 0) {
      query.where(`p.category_id IN (${categoryIds.map(() => '?').join(',')})`, categoryIds)
    }

    const { query: sql, params } = query.build()

    try {
      // Simulate database query (replace with actual database call)
      // const results = await db.query(sql, params)
      const results = await this.simulateQuery(sql, params)

      // Cache the results
      cache.setProduct(cacheKey, results, 5 * 60 * 1000) // 5 minutes

      return results
    } catch (error) {
      console.error('Failed to fetch products:', error)
      return []
    }
  }

  /**
   * Get single product with all related data
   */
  static async getProductBySlug(slug: string): Promise<any | null> {
    const cacheKey = `product_slug_${slug}`

    // Check cache first
    const cached = cache.getProduct(cacheKey)
    if (cached) {
      return cached
    }

    const query = new QueryBuilder('products p')
      .select([
        'p.id',
        'p.name',
        'p.slug',
        'p.description',
        'p.price',
        'p.category_id',
        'c.name as category_name',
        'c.slug as category_slug',
        'p.specifications',
        'p.features',
        'p.created_at',
        'p.updated_at'
      ])
      .leftJoin('categories c', 'c.id = p.category_id')
      .where('p.slug = ?', [slug])
      .limit(1)

    const { query: sql, params } = query.build()

    try {
      // const product = await db.queryOne(sql, params)
      const product = await this.simulateQuery(sql, params)

      if (product && product.length > 0) {
        // Fetch related images in batch
        const images = await this.getProductImages([product[0].id])
        product[0].images = images

        // Cache the result
        cache.setProduct(cacheKey, product[0], 10 * 60 * 1000) // 10 minutes

        return product[0]
      }

      return null
    } catch (error) {
      console.error('Failed to fetch product:', error)
      return null
    }
  }

  /**
   * Get product images in batch
   */
  static async getProductImages(productIds: string[]): Promise<any[]> {
    if (productIds.length === 0) return []

    const cacheKey = `product_images_${productIds.join(',')}`

    // Check cache first
    const cached = cache.getProduct(cacheKey)
    if (cached) {
      return cached
    }

    const query = new QueryBuilder('product_images')
      .select(['product_id', 'url', 'alt_text', 'is_primary', 'sort_order'])
      .where(`product_id IN (${productIds.map(() => '?').join(',')})`, productIds)
      .orderBy('sort_order', 'ASC')

    const { query: sql, params } = query.build()

    try {
      // const images = await db.query(sql, params)
      const images = await this.simulateQuery(sql, params)

      // Group images by product_id
      const groupedImages = images.reduce((acc, image) => {
        if (!acc[image.product_id]) {
          acc[image.product_id] = []
        }
        acc[image.product_id].push(image)
        return acc
      }, {} as Record<string, any[]>)

      // Cache the result
      cache.setProduct(cacheKey, groupedImages, 10 * 60 * 1000)

      return groupedImages
    } catch (error) {
      console.error('Failed to fetch product images:', error)
      return {}
    }
  }

  /**
   * Search products with optimized full-text search
   */
  static async searchProducts(
    searchTerm: string,
    filters: {
      categoryIds?: string[]
      minPrice?: number
      maxPrice?: number
      sortBy?: 'price' | 'name' | 'created_at'
      sortOrder?: 'ASC' | 'DESC'
    } = {},
    pagination: {
      limit: number
      offset: number
    } = { limit: 20, offset: 0 }
  ): Promise<{ products: any[]; total: number }> {
    const cacheKey = `search_${searchTerm}_${JSON.stringify(filters)}_${pagination.limit}_${pagination.offset}`

    // Check cache first
    const cached = cache.getSearch(cacheKey)
    if (cached) {
      return cached
    }

    const query = new QueryBuilder('products p')
      .select([
        'p.id',
        'p.name',
        'p.slug',
        'p.description',
        'p.price',
        'p.category_id',
        'c.name as category_name',
        'pi.url as image_url'
      ])
      .leftJoin('categories c', 'c.id = p.category_id')
      .leftJoin('product_images pi', 'pi.product_id = p.id AND pi.is_primary = true')

    // Build search conditions
    const conditions: string[] = []
    const params: any[] = []

    if (searchTerm) {
      conditions.push('(p.name ILIKE ? OR p.description ILIKE ?)')
      params.push(`%${searchTerm}%`, `%${searchTerm}%`)
    }

    if (filters.categoryIds && filters.categoryIds.length > 0) {
      conditions.push(`p.category_id IN (${filters.categoryIds.map(() => '?').join(',')})`)
      params.push(...filters.categoryIds)
    }

    if (filters.minPrice !== undefined) {
      conditions.push('p.price >= ?')
      params.push(filters.minPrice)
    }

    if (filters.maxPrice !== undefined) {
      conditions.push('p.price <= ?')
      params.push(filters.maxPrice)
    }

    if (conditions.length > 0) {
      query.where(conditions.join(' AND '), params)
    }

    // Add ordering
    const sortBy = filters.sortBy || 'created_at'
    const sortOrder = filters.sortOrder || 'DESC'
    query.orderBy(sortBy, sortOrder)

    // Add pagination
    query.limit(pagination.limit)
    query.offset(pagination.offset)

    const { query: sql, params: queryParams } = query.build()

    try {
      // const products = await db.query(sql, queryParams)
      const products = await this.simulateQuery(sql, queryParams)

      // Get total count for pagination
      const countQuery = new QueryBuilder('products p')
        .select(['COUNT(*) as total'])

      if (conditions.length > 0) {
        countQuery.where(conditions.join(' AND '), params)
      }

      const { query: countSql, params: countParams } = countQuery.build()
      // const countResult = await db.queryOne(countSql, countParams)
      const countResult = await this.simulateQuery(countSql, countParams)
      const total = countResult[0]?.total || 0

      const result = { products, total }

      // Cache the result
      cache.setSearch(cacheKey, result, 2 * 60 * 1000) // 2 minutes for search results

      return result
    } catch (error) {
      console.error('Failed to search products:', error)
      return { products: [], total: 0 }
    }
  }

  /**
   * Simulate database query (replace with actual implementation)
   */
  private static async simulateQuery(query: string, params: any[]): Promise<any[]> {
    // This is a simulation - replace with actual database calls
    console.log('Executing query:', query, 'with params:', params)

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10))

    // Return mock data
    return []
  }
}

/**
 * Connection Pool Manager
 */
export class ConnectionPool {
  private connections: any[] = []
  private waitingQueue: Array<{
    resolve: (connection: any) => void
    reject: (error: Error) => void
    timestamp: number
  }> = []

  constructor(private config: DatabaseConfig) {}

  /**
   * Get a connection from the pool
   */
  async getConnection(): Promise<any> {
    // Return available connection
    if (this.connections.length > 0) {
      return this.connections.pop()
    }

    // Create new connection if under limit
    if (this.getTotalConnections() < this.config.maxConnections) {
      return this.createConnection()
    }

    // Wait for available connection
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'))
      }, this.config.connectionTimeout)

      this.waitingQueue.push({
        resolve: (connection) => {
          clearTimeout(timeout)
          resolve(connection)
        },
        reject: (error) => {
          clearTimeout(timeout)
          reject(error)
        },
        timestamp: Date.now()
      })
    })
  }

  /**
   * Release a connection back to the pool
   */
  releaseConnection(connection: any): void {
    if (this.waitingQueue.length > 0) {
      // Give to next waiting request
      const waiting = this.waitingQueue.shift()
      if (waiting) {
        waiting.resolve(connection)
      }
    } else {
      // Add back to pool
      this.connections.push(connection)
    }
  }

  /**
   * Create a new database connection
   */
  private async createConnection(): Promise<any> {
    // Simulate connection creation
    await new Promise(resolve => setTimeout(resolve, 100))

    return {
      id: Math.random().toString(36),
      createdAt: Date.now(),
      query: async (sql: string, params: any[]) => {
        // Simulate query execution
        return []
      }
    }
  }

  /**
   * Get total connections (active + pooled)
   */
  private getTotalConnections(): number {
    return this.connections.length + this.waitingQueue.length
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    // Close all connections
    this.connections = []

    // Reject all waiting requests
    this.waitingQueue.forEach(waiting => {
      waiting.reject(new Error('Connection pool closed'))
    })
    this.waitingQueue = []
  }
}

/**
 * Query Performance Monitor
 */
export class QueryMonitor {
  private queryStats = new Map<string, {
    count: number
    totalTime: number
    avgTime: number
    maxTime: number
    minTime: number
    lastExecuted: number
  }>()

  /**
   * Record query execution
   */
  recordQuery(query: string, executionTime: number): void {
    const existing = this.queryStats.get(query) || {
      count: 0,
      totalTime: 0,
      avgTime: 0,
      maxTime: 0,
      minTime: Infinity,
      lastExecuted: 0
    }

    existing.count++
    existing.totalTime += executionTime
    existing.avgTime = existing.totalTime / existing.count
    existing.maxTime = Math.max(existing.maxTime, executionTime)
    existing.minTime = Math.min(existing.minTime, executionTime)
    existing.lastExecuted = Date.now()

    this.queryStats.set(query, existing)

    // Log slow queries
    if (executionTime > 1000) {
      console.warn('Slow query detected:', {
        query: query.substring(0, 100) + '...',
        executionTime: `${executionTime}ms`,
        avgTime: `${existing.avgTime.toFixed(2)}ms`
      })
    }
  }

  /**
   * Get query statistics
   */
  getStats() {
    const stats = Array.from(this.queryStats.entries()).map(([query, data]) => ({
      query: query.substring(0, 100) + '...',
      ...data
    }))

    return {
      totalQueries: stats.length,
      slowQueries: stats.filter(s => s.avgTime > 500),
      topSlowQueries: stats
        .sort((a, b) => b.avgTime - a.avgTime)
        .slice(0, 10),
      mostFrequent: stats
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
    }
  }
}

// Global instances
export const connectionPool = new ConnectionPool(DB_CONFIG)
export const queryMonitor = new QueryMonitor()

/**
 * Execute query with monitoring and connection pooling
 */
export async function executeQuery<T = any>(
  queryFn: (connection: any) => Promise<T>
): Promise<T> {
  const startTime = performance.now()

  try {
    const connection = await connectionPool.getConnection()

    try {
      const result = await queryFn(connection)
      const executionTime = performance.now() - startTime

      // Monitor performance
      queryMonitor.recordQuery('query', executionTime)

      return result
    } finally {
      connectionPool.releaseConnection(connection)
    }
  } catch (error) {
    const executionTime = performance.now() - startTime
    console.error('Query failed:', error, `after ${executionTime.toFixed(2)}ms`)
    throw error
  }
}