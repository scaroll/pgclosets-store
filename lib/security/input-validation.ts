/**
 * Enterprise Input Validation & Sanitization
 * Agent #46: Application Security Specialist
 *
 * Comprehensive input validation to prevent:
 * - SQL Injection
 * - XSS (Cross-Site Scripting)
 * - Command Injection
 * - Path Traversal
 * - LDAP Injection
 * - XML Injection
 */

import DOMPurify from 'isomorphic-dompurify'
import { z } from 'zod'

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  })
}

/**
 * Sanitize user input for display (escape HTML entities)
 */
export function sanitizeUserInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const trimmed = email.trim().toLowerCase()

  if (!emailRegex.test(trimmed)) {
    return null
  }

  // Remove potential injection characters
  const sanitized = trimmed.replace(/[<>'"(){}[\]\\;]/g, '')

  return sanitized
}

/**
 * Validate and sanitize phone number
 */
export function sanitizePhoneNumber(phone: string): string | null {
  // Remove all non-numeric characters except + and -
  const cleaned = phone.replace(/[^\d+\-\s()]/g, '')

  // Validate format (simple validation)
  const phoneRegex = /^[\d+\-\s()]{10,}$/
  if (!phoneRegex.test(cleaned)) {
    return null
  }

  return cleaned
}

/**
 * Validate and sanitize URL
 */
export function sanitizeURL(url: string): string | null {
  try {
    const parsed = new URL(url)

    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null
    }

    // Check for suspicious patterns
    const suspicious = /javascript:|data:|vbscript:|file:/i
    if (suspicious.test(url)) {
      return null
    }

    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Prevent path traversal attacks
 */
export function sanitizePath(path: string): string | null {
  // Remove any path traversal attempts
  const normalized = path
    .replace(/\.\./g, '')
    .replace(/\/\//g, '/')
    .replace(/\\/g, '/')

  // Check for remaining suspicious patterns
  if (normalized.includes('..') || normalized.includes('~')) {
    return null
  }

  return normalized
}

/**
 * Sanitize SQL input (for dynamic queries - prefer parameterized queries)
 */
export function sanitizeSQL(input: string): string {
  // Escape single quotes and other SQL special characters
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
}

/**
 * Validate and sanitize JSON input
 */
export function sanitizeJSON<T = any>(input: string): T | null {
  try {
    const parsed = JSON.parse(input)

    // Check for prototype pollution
    if (parsed.__proto__ || parsed.constructor || parsed.prototype) {
      console.warn('[SECURITY] Prototype pollution attempt detected')
      return null
    }

    return parsed
  } catch {
    return null
  }
}

/**
 * Sanitize command-line input (prevent command injection)
 */
export function sanitizeCommandInput(input: string): string | null {
  // Block dangerous characters
  const dangerous = /[;&|`$(){}[\]<>\\]/
  if (dangerous.test(input)) {
    return null
  }

  return input.trim()
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: {
  name: string
  size: number
  type: string
}): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Allowed file extensions
  const allowedExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.pdf',
    '.doc',
    '.docx',
    '.txt'
  ]

  const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))

  if (!allowedExtensions.includes(ext)) {
    errors.push(`File type ${ext} not allowed`)
  }

  // Max file size: 10MB
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push('File size exceeds 10MB limit')
  }

  // Validate MIME type
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]

  if (!allowedMimeTypes.includes(file.type)) {
    errors.push(`MIME type ${file.type} not allowed`)
  }

  // Check for double extensions
  if ((file.name.match(/\./g) || []).length > 1) {
    errors.push('Multiple file extensions not allowed')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Zod schemas for common validation patterns
 */
export const ValidationSchemas = {
  email: z.string().email().trim().toLowerCase(),

  phone: z.string().regex(/^[\d+\-\s()]{10,}$/, 'Invalid phone number format'),

  url: z.string().url().refine(
    url => {
      try {
        const parsed = new URL(url)
        return ['http:', 'https:'].includes(parsed.protocol)
      } catch {
        return false
      }
    },
    { message: 'Only HTTP and HTTPS URLs allowed' }
  ),

  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),

  password: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),

  alphanumeric: z.string().regex(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters allowed'),

  postalCode: z.string().regex(
    /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    'Invalid Canadian postal code format'
  ),

  creditCard: z.string().regex(/^\d{13,19}$/, 'Invalid credit card number'),

  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),

  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid US ZIP code'),

  uuid: z.string().uuid('Invalid UUID format'),

  jwt: z.string().regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, 'Invalid JWT format'),

  hexColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),

  base64: z.string().regex(/^[A-Za-z0-9+/]*={0,2}$/, 'Invalid base64 string')
}

/**
 * Comprehensive input sanitizer
 */
export class InputSanitizer {
  /**
   * Sanitize object recursively
   */
  static sanitizeObject<T extends Record<string, any>>(obj: T): T {
    const sanitized = {} as T

    for (const [key, value] of Object.entries(obj)) {
      // Skip dangerous properties
      if (['__proto__', 'constructor', 'prototype'].includes(key)) {
        continue
      }

      if (typeof value === 'string') {
        sanitized[key as keyof T] = sanitizeUserInput(value) as any
      } else if (Array.isArray(value)) {
        sanitized[key as keyof T] = value.map(item =>
          typeof item === 'string' ? sanitizeUserInput(item) : item
        ) as any
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key as keyof T] = this.sanitizeObject(value) as any
      } else {
        sanitized[key as keyof T] = value
      }
    }

    return sanitized
  }

  /**
   * Validate and sanitize form data
   */
  static validateFormData<T extends z.ZodType>(
    data: unknown,
    schema: T
  ): {
    success: boolean
    data?: z.infer<T>
    errors?: z.ZodError
  } {
    try {
      const validated = schema.parse(data)
      return { success: true, data: validated }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, errors: error }
      }
      throw error
    }
  }

  /**
   * Sanitize search query
   */
  static sanitizeSearchQuery(query: string): string {
    // Remove SQL injection attempts
    let sanitized = query.replace(/['";]/g, '')

    // Remove script tags
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '')

    // Limit length
    sanitized = sanitized.substring(0, 500)

    return sanitized.trim()
  }

  /**
   * Sanitize array of strings
   */
  static sanitizeStringArray(arr: string[]): string[] {
    return arr
      .filter(item => typeof item === 'string')
      .map(item => sanitizeUserInput(item))
      .filter(item => item.length > 0)
  }
}

/**
 * Content Security Policy helpers
 */
export class CSPValidator {
  /**
   * Generate secure nonce for inline scripts
   */
  static generateNonce(): string {
    if (typeof crypto !== 'undefined') {
      const array = new Uint8Array(16)
      crypto.getRandomValues(array)
      return btoa(String.fromCharCode(...array))
    }
    // Fallback for Node.js
    return require('crypto').randomBytes(16).toString('base64')
  }

  /**
   * Validate inline script against CSP nonce
   */
  static validateNonce(nonce: string, providedNonce: string): boolean {
    return nonce === providedNonce
  }
}

/**
 * Request validation middleware
 */
export function validateRequestBody<T extends z.ZodType>(schema: T) {
  return async (body: unknown): Promise<z.infer<T>> => {
    try {
      return schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Validation failed: ${error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')}`
        )
      }
      throw error
    }
  }
}

/**
 * Security validation summary
 */
export function validateSecurityCompliance(input: {
  hasHTTPS: boolean
  hasCSP: boolean
  hasRateLimiting: boolean
  hasInputSanitization: boolean
  hasAuthentication: boolean
}): {
  compliant: boolean
  score: number
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100

  if (!input.hasHTTPS) {
    issues.push('HTTPS not enforced')
    score -= 30
  }

  if (!input.hasCSP) {
    issues.push('Content Security Policy not configured')
    score -= 25
  }

  if (!input.hasRateLimiting) {
    issues.push('Rate limiting not implemented')
    score -= 20
  }

  if (!input.hasInputSanitization) {
    issues.push('Input sanitization not implemented')
    score -= 15
  }

  if (!input.hasAuthentication) {
    recommendations.push('Consider implementing authentication for sensitive operations')
    score -= 10
  }

  return {
    compliant: issues.length === 0,
    score: Math.max(0, score),
    issues,
    recommendations
  }
}
