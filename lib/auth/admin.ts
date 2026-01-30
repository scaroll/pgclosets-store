/**
 * Simple Admin Authentication System
 * Password-only auth using signed cookies (jose)
 */

import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { createHash, timingSafeEqual } from 'crypto'

// ============================================================================
// Constants
// ============================================================================

const COOKIE_NAME = 'admin_session'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
const SESSION_DURATION = 7 * 24 * 60 * 60 // 7 days in seconds

// Use AUTH_SECRET for signing, or generate a warning
const SECRET_KEY = process.env.AUTH_SECRET || ''

if (!SECRET_KEY) {
  console.warn('WARNING: AUTH_SECRET not set. Admin auth will not work securely.')
}

// Convert secret to Uint8Array for jose
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(SECRET_KEY)
}

// ============================================================================
// Types
// ============================================================================

interface AdminSession {
  authenticated: boolean
  expiresAt: number
}

interface SessionResult {
  valid: boolean
  session: AdminSession | null
}

// ============================================================================
// Password Verification
// ============================================================================

/**
 * Verify admin password using timing-safe comparison
 * Uses SHA-256 hash to compare passwords without exposing the actual value
 */
export async function verifyAdmin(password: string): Promise<boolean> {
  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD not configured')
    return false
  }

  if (!SECRET_KEY) {
    console.error('AUTH_SECRET not configured')
    return false
  }

  // Use timing-safe comparison via crypto hashes
  const passwordHash = createHash('sha256').update(password).digest()
  const storedHash = createHash('sha256').update(ADMIN_PASSWORD).digest()

  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(passwordHash, storedHash)
}

// ============================================================================
// Session Management
// ============================================================================

/**
 * Create an admin session and set the signed cookie
 */
export async function createAdminSession(): Promise<void> {
  const cookieStore = await cookies()

  const session: AdminSession = {
    authenticated: true,
    expiresAt: Date.now() + SESSION_DURATION * 1000,
  }

  // Create signed JWT
  const token = await new SignJWT({ session })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .setIssuedAt()
    .sign(getSecretKey())

  // Set httpOnly cookie for security
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/admin',
    maxAge: SESSION_DURATION,
  })
}

/**
 * Get and verify the current admin session from cookies
 */
export async function getAdminSession(): Promise<SessionResult> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)

  if (!token) {
    return { valid: false, session: null }
  }

  try {
    const { payload } = await jwtVerify(token.value, getSecretKey())

    if (!payload.session || typeof payload.session !== 'object') {
      return { valid: false, session: null }
    }

    const session = payload.session as AdminSession

    // Check expiration
    if (Date.now() > session.expiresAt) {
      return { valid: false, session: null }
    }

    return { valid: true, session }
  } catch {
    // Invalid JWT
    return { valid: false, session: null }
  }
}

/**
 * Clear the admin session (logout)
 */
export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Check if current user is authenticated as admin
 * Convenience function for route protection
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const result = await getAdminSession()
  return result.valid
}
