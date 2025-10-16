import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"
import { kv } from "@vercel/kv"
import { env, isProduction } from "./env-validation"
import crypto from "crypto"

// Types
export interface User {
  id: string
  email: string
  role: "admin" | "user"
  name?: string
  createdAt: Date
}

export interface SessionData {
  userId: string
  email: string
  role: string
  isAdmin: boolean
  exp: number
  iat: number
}

// Configuration from validated environment
const JWT_SECRET = env.JWT_SECRET
const JWT_EXPIRES_IN = "7d" // 7 days
const CSRF_SECRET = env.CSRF_SECRET

// JWT utilities
class AuthTokenManager {
  private static secret = new TextEncoder().encode(JWT_SECRET)

  static async createToken(user: User): Promise<string> {
    const payload: Omit<SessionData, "iat"> = {
      userId: user.id,
      email: user.email,
      role: user.role,
      isAdmin: user.role === "admin",
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
    }

    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(this.secret)
  }

  static async verifyToken(token: string): Promise<SessionData | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret)

      // Type guard to ensure payload has required fields
      if (
        payload &&
        typeof payload === 'object' &&
        'userId' in payload &&
        'email' in payload &&
        'role' in payload &&
        'isAdmin' in payload &&
        'exp' in payload
      ) {
        return payload as SessionData
      }

      return null
    } catch (error) {
      console.error("Token verification failed:", error)
      return null
    }
  }

  static async refreshToken(oldToken: string): Promise<string | null> {
    const session = await this.verifyToken(oldToken)
    if (!session) return null

    // Check if token expires within 1 day
    const now = Math.floor(Date.now() / 1000)
    const oneDayFromNow = now + (24 * 60 * 60)

    if (session.exp > oneDayFromNow) {
      return oldToken // Token is still fresh
    }

    // Create new token with same user data
    const user: User = {
      id: session.userId,
      email: session.email,
      role: session.role as "admin" | "user",
      createdAt: new Date()
    }

    return await this.createToken(user)
  }
}

// CSRF protection
class CSRFProtection {
  static generateToken(): string {
    return crypto.randomBytes(32).toString("hex")
  }

  static createHash(token: string): string {
    return crypto
      .createHmac("sha256", CSRF_SECRET)
      .update(token)
      .digest("hex")
  }

  static validateToken(token: string, hash: string): boolean {
    const expectedHash = this.createHash(token)
    return crypto.timingSafeEqual(
      Buffer.from(expectedHash, "hex"),
      Buffer.from(hash, "hex")
    )
  }

  static setCSRFCookie(response: NextResponse): string {
    const token = this.generateToken()
    const hash = this.createHash(token)

    response.cookies.set("csrf-token", hash, {
      httpOnly: true,
      secure: isProduction(),
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/"
    })

    return token
  }
}

// Session management
class SessionManager {
  static async createSession(user: User): Promise<{ token: string; session: SessionData }> {
    const token = await AuthTokenManager.createToken(user)
    const session = await AuthTokenManager.verifyToken(token)

    if (!session) {
      throw new Error("Failed to create session")
    }

    return { token, session }
  }

  static async getSession(request?: NextRequest): Promise<SessionData | null> {
    let token: string | undefined

    if (request) {
      // Server-side: get from request
      const authHeader = request.headers.get("authorization")
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      } else {
        token = request.cookies.get("session")?.value
      }
    } else {
      // Server component: get from cookies
      const cookieStore = await cookies()
      token = cookieStore.get("session")?.value
    }

    if (!token) return null

    return await AuthTokenManager.verifyToken(token)
  }

  static async requireAuth(request: NextRequest): Promise<SessionData> {
    const session = await this.getSession(request)

    if (!session) {
      throw new Error("Authentication required")
    }

    return session
  }

  static async requireAdmin(request: NextRequest): Promise<SessionData> {
    const session = await this.requireAuth(request)

    if (!session.isAdmin) {
      throw new Error("Admin access required")
    }

    return session
  }

  static setSessionCookie(response: NextResponse, token: string): void {
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: isProduction(),
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/"
    })
  }

  static clearSession(response: NextResponse): void {
    response.cookies.delete("session")
    response.cookies.delete("csrf-token")
  }
}

// Input validation and sanitization
class InputValidator {
  static sanitizeString(input: string): string {
    return input
      .trim()
      .replace(/[<>'"&]/g, (char) => {
        switch (char) {
          case '<': return '&lt;'
          case '>': return '&gt;'
          case '"': return '&quot;'
          case "'": return '&#x27;'
          case '&': return '&amp;'
          default: return char
        }
      })
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  }

  static validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long")
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter")
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter")
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number")
    }

    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push("Password must contain at least one special character")
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  static validateFileUpload(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      errors.push(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`)
    }

    if (file.size > maxSize) {
      errors.push(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`)
    }

    // Check for malicious file extensions
    const maliciousExtensions = [".exe", ".bat", ".cmd", ".scr", ".pif", ".com"]
    const fileName = file.name.toLowerCase()

    if (maliciousExtensions.some(ext => fileName.endsWith(ext))) {
      errors.push("File type not allowed for security reasons")
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

// Rate limiting
class RateLimiter {
  // In-memory fallback store for development/testing or when Redis is unavailable
  private static memoryStore = new Map<string, { count: number; resetTime: number }>()
  private static cleanupInterval: NodeJS.Timeout | null = null
  private static isRedisAvailable: boolean | null = null
  private static redisCheckTime: number = 0
  private static readonly REDIS_CHECK_INTERVAL = 60000 // Re-check Redis availability every 60 seconds

  /**
   * Check if Redis (Vercel KV) is available
   * Caches the result for REDIS_CHECK_INTERVAL to avoid excessive checks
   */
  private static async checkRedisAvailability(): Promise<boolean> {
    const now = Date.now()

    // Return cached result if within check interval
    if (this.isRedisAvailable !== null && (now - this.redisCheckTime) < this.REDIS_CHECK_INTERVAL) {
      return this.isRedisAvailable
    }

    try {
      // Try a simple ping operation
      await kv.set('rate_limiter_health_check', 'ok', { ex: 5 })
      await kv.del('rate_limiter_health_check')
      this.isRedisAvailable = true
      this.redisCheckTime = now
      return true
    } catch (error) {
      console.warn('[RateLimiter] Redis unavailable, falling back to in-memory store:', error)
      this.isRedisAvailable = false
      this.redisCheckTime = now
      return false
    }
  }

  /**
   * Start cleanup interval for in-memory store to prevent memory leaks
   */
  private static startCleanup(): void {
    if (this.cleanupInterval) return

    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      let cleaned = 0

      for (const [key, record] of this.memoryStore.entries()) {
        if (now > record.resetTime) {
          this.memoryStore.delete(key)
          cleaned++
        }
      }

      if (cleaned > 0) {
        console.log(`[RateLimiter] Cleaned ${cleaned} expired entries from memory store`)
      }
    }, 5 * 60 * 1000)

    // Ensure cleanup stops when process exits
    if (typeof process !== 'undefined' && process.on) {
      process.on('exit', () => {
        if (this.cleanupInterval) {
          clearInterval(this.cleanupInterval)
        }
      })
    }
  }

  /**
   * Check rate limit using Redis or in-memory fallback
   * Maintains the same API as the original implementation
   *
   * @param identifier - Unique identifier for rate limiting (e.g., IP address, user ID)
   * @param maxRequests - Maximum number of requests allowed in the window
   * @param windowMs - Time window in milliseconds
   * @returns Rate limit status with allowed, remaining, and resetTime
   */
  static async check(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 15 * 60 * 1000
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const key = `rate_limit:${identifier}`
    const windowSeconds = Math.ceil(windowMs / 1000)

    // Check if Redis is available
    const useRedis = await this.checkRedisAvailability()

    if (useRedis) {
      try {
        return await this.checkRedis(key, maxRequests, windowMs, windowSeconds, now)
      } catch (error) {
        console.error('[RateLimiter] Redis operation failed, falling back to memory:', error)
        // Fall through to in-memory implementation
        this.isRedisAvailable = false
      }
    }

    // Use in-memory fallback
    return this.checkMemory(key, maxRequests, windowMs, now)
  }

  /**
   * Redis-backed rate limit check using sliding window algorithm
   */
  private static async checkRedis(
    key: string,
    maxRequests: number,
    windowMs: number,
    windowSeconds: number,
    now: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    // Use Redis sorted set for sliding window rate limiting
    // Score is timestamp, member is unique request ID
    const requestId = `${now}:${crypto.randomBytes(8).toString('hex')}`
    const windowStart = now - windowMs

    // Remove old entries and add current request in a transaction
    const pipeline = [
      ['zremrangebyscore', key, 0, windowStart],
      ['zadd', key, now, requestId],
      ['zcard', key],
      ['expire', key, windowSeconds + 10] // Add 10s buffer
    ]

    let count: number
    try {
      // Execute Redis pipeline
      const results = await kv.pipeline(...pipeline as any)
      count = results[2] as number // zcard result
    } catch (error) {
      throw new Error(`Redis pipeline failed: ${error}`)
    }

    const allowed = count <= maxRequests
    const remaining = Math.max(0, maxRequests - count)
    const resetTime = now + windowMs

    // If over limit, remove the request we just added
    if (!allowed) {
      await kv.zrem(key, requestId)
    }

    return { allowed, remaining, resetTime }
  }

  /**
   * In-memory fallback rate limit check
   */
  private static checkMemory(
    key: string,
    maxRequests: number,
    windowMs: number,
    now: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    // Start cleanup on first use
    this.startCleanup()

    const record = this.memoryStore.get(key)

    if (!record || now > record.resetTime) {
      const newRecord = {
        count: 1,
        resetTime: now + windowMs
      }
      this.memoryStore.set(key, newRecord)

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: newRecord.resetTime
      }
    }

    if (record.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      }
    }

    record.count++
    return {
      allowed: true,
      remaining: maxRequests - record.count,
      resetTime: record.resetTime
    }
  }

  /**
   * Reset rate limit for a specific identifier
   * Useful for testing or administrative overrides
   */
  static async reset(identifier: string): Promise<void> {
    const key = `rate_limit:${identifier}`

    // Try Redis first
    if (this.isRedisAvailable !== false) {
      try {
        await kv.del(key)
      } catch (error) {
        console.warn('[RateLimiter] Redis delete failed:', error)
      }
    }

    // Also clean from memory store
    this.memoryStore.delete(key)
  }

  /**
   * Get current rate limit status without incrementing
   * Useful for displaying rate limit information to users
   */
  static async status(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 15 * 60 * 1000
  ): Promise<{ count: number; remaining: number; resetTime: number | null }> {
    const key = `rate_limit:${identifier}`
    const now = Date.now()
    const useRedis = await this.checkRedisAvailability()

    if (useRedis) {
      try {
        const windowStart = now - windowMs
        await kv.zremrangebyscore(key, 0, windowStart)
        const count = await kv.zcard(key) || 0

        // Get the oldest entry to determine reset time
        const oldest = await kv.zrange(key, 0, 0, { withScores: true })
        const resetTime = oldest.length > 0 ? (oldest[1] as number) + windowMs : null

        return {
          count,
          remaining: Math.max(0, maxRequests - count),
          resetTime
        }
      } catch (error) {
        console.error('[RateLimiter] Redis status check failed:', error)
      }
    }

    // Memory fallback
    const record = this.memoryStore.get(key)
    if (!record || now > record.resetTime) {
      return { count: 0, remaining: maxRequests, resetTime: null }
    }

    return {
      count: record.count,
      remaining: Math.max(0, maxRequests - record.count),
      resetTime: record.resetTime
    }
  }

  /**
   * Clean up resources (stop cleanup interval)
   * Call this when shutting down the application
   */
  static cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.memoryStore.clear()
  }
}

// Security utilities
class SecurityUtils {
  static generateSecureId(): string {
    return crypto.randomBytes(16).toString("hex")
  }

  static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, CSRF_SECRET, 100000, 64, "sha512", (err, derivedKey) => {
        if (err) reject(err)
        else resolve(derivedKey.toString("hex"))
      })
    })
  }

  static verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, CSRF_SECRET, 100000, 64, "sha512", (err, derivedKey) => {
        if (err) reject(err)
        else resolve(crypto.timingSafeEqual(Buffer.from(hash, "hex"), derivedKey))
      })
    })
  }

  static createApiKey(): string {
    return `pgc_${crypto.randomBytes(32).toString("hex")}`
  }

  static logSecurityEvent(event: string, details: any): void {
    console.log(`[SECURITY] ${new Date().toISOString()} - ${event}`, details)

    // In production, send to security monitoring service
    if (isProduction()) {
      // TODO: Integrate with security monitoring (e.g., Sentry, DataDog)
    }
  }
}

// Default admin user for setup (remove in production)
export const DEFAULT_ADMIN = {
  id: "admin-pgclosets-2025",
  email: "admin@pgclosets.com",
  role: "admin" as const,
  name: "PG Closets Admin",
  createdAt: new Date()
}

// Export all utilities
export {
  AuthTokenManager,
  SessionManager,
  CSRFProtection,
  InputValidator,
  RateLimiter,
  SecurityUtils
}