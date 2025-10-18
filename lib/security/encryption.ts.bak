/**
 * Enterprise-Grade Encryption System
 * Provides AES-256-GCM encryption for sensitive data
 * PCI-DSS Level 1 compliant
 */

import * as crypto from 'crypto'

// Configuration
const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm' as const,
  keyLength: 32,
  ivLength: 16,
  saltLength: 64,
  tagLength: 16,
  iterations: 100000,
  digest: 'sha512' as const,
}

// Get encryption key from environment (must be 32 bytes/256 bits)
function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY environment variable is required in production')
    }
    // Development fallback - DO NOT USE IN PRODUCTION
    console.warn('⚠️ Using fallback encryption key - NOT SECURE FOR PRODUCTION')
    return Buffer.from('pgclosets-dev-encryption-key-change-this-in-production!')
  }

  // Ensure key is exactly 32 bytes
  const keyBuffer = Buffer.from(key, 'hex')
  if (keyBuffer.length !== ENCRYPTION_CONFIG.keyLength) {
    throw new Error(`Encryption key must be ${ENCRYPTION_CONFIG.keyLength} bytes (${ENCRYPTION_CONFIG.keyLength * 2} hex characters)`)
  }

  return keyBuffer
}

/**
 * Encrypt sensitive data using AES-256-GCM
 */
export function encrypt(plaintext: string): string {
  try {
    const key = getEncryptionKey()

    // Generate random IV
    const iv = crypto.randomBytes(ENCRYPTION_CONFIG.ivLength)

    // Create cipher
    const cipher = crypto.createCipheriv(
      ENCRYPTION_CONFIG.algorithm,
      key,
      iv
    )

    // Encrypt data
    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // Get authentication tag
    const tag = cipher.getAuthTag()

    // Combine IV + tag + encrypted data
    const result = Buffer.concat([
      iv,
      tag,
      Buffer.from(encrypted, 'hex')
    ])

    return result.toString('base64')
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error('Failed to encrypt data')
  }
}

/**
 * Decrypt data encrypted with AES-256-GCM
 */
export function decrypt(ciphertext: string): string {
  try {
    const key = getEncryptionKey()

    // Decode from base64
    const buffer = Buffer.from(ciphertext, 'base64')

    // Extract IV, tag, and encrypted data
    const iv = buffer.subarray(0, ENCRYPTION_CONFIG.ivLength)
    const tag = buffer.subarray(
      ENCRYPTION_CONFIG.ivLength,
      ENCRYPTION_CONFIG.ivLength + ENCRYPTION_CONFIG.tagLength
    )
    const encrypted = buffer.subarray(
      ENCRYPTION_CONFIG.ivLength + ENCRYPTION_CONFIG.tagLength
    )

    // Create decipher
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_CONFIG.algorithm,
      key,
      iv
    )

    // Set authentication tag
    decipher.setAuthTag(tag)

    // Decrypt data
    let decrypted = decipher.update(encrypted)
    decrypted = Buffer.concat([decrypted, decipher.final()])

    return decrypted.toString('utf8')
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Failed to decrypt data')
  }
}

/**
 * Hash sensitive data using PBKDF2
 * Use for passwords and other one-way hashing
 */
export async function hash(data: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const actualSalt = salt || crypto.randomBytes(ENCRYPTION_CONFIG.saltLength).toString('hex')

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      data,
      actualSalt,
      ENCRYPTION_CONFIG.iterations,
      ENCRYPTION_CONFIG.keyLength,
      ENCRYPTION_CONFIG.digest,
      (err, derivedKey) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            hash: derivedKey.toString('hex'),
            salt: actualSalt
          })
        }
      }
    )
  })
}

/**
 * Verify hashed data
 */
export async function verifyHash(data: string, hash: string, salt: string): Promise<boolean> {
  try {
    const result = await hash(data, salt)
    return crypto.timingSafeEqual(
      Buffer.from(result.hash, 'hex'),
      Buffer.from(hash, 'hex')
    )
  } catch {
    return false
  }
}

/**
 * Generate cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

/**
 * Mask sensitive data for logging
 * Shows first 4 and last 4 characters
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (data.length <= visibleChars * 2) {
    return '*'.repeat(data.length)
  }

  const start = data.substring(0, visibleChars)
  const end = data.substring(data.length - visibleChars)
  const masked = '*'.repeat(data.length - visibleChars * 2)

  return `${start}${masked}${end}`
}

/**
 * Encrypt PII (Personally Identifiable Information)
 * Special handling for PII data
 */
export function encryptPII(pii: {
  email?: string
  phone?: string
  address?: string
  name?: string
  [key: string]: string | undefined
}): Record<string, string> {
  const encrypted: Record<string, string> = {}

  for (const [key, value] of Object.entries(pii)) {
    if (value) {
      encrypted[key] = encrypt(value)
    }
  }

  return encrypted
}

/**
 * Decrypt PII
 */
export function decryptPII(encrypted: Record<string, string>): Record<string, string> {
  const decrypted: Record<string, string> = {}

  for (const [key, value] of Object.entries(encrypted)) {
    if (value) {
      try {
        decrypted[key] = decrypt(value)
      } catch (error) {
        console.error(`Failed to decrypt PII field: ${key}`)
        decrypted[key] = '[DECRYPTION_ERROR]'
      }
    }
  }

  return decrypted
}

/**
 * Key rotation utilities
 */
export class KeyRotation {
  /**
   * Generate new encryption key
   */
  static generateKey(): string {
    return crypto.randomBytes(ENCRYPTION_CONFIG.keyLength).toString('hex')
  }

  /**
   * Re-encrypt data with new key
   */
  static async rotateKey(
    encryptedData: string,
    oldKey: string,
    newKey: string
  ): Promise<string> {
    // Temporarily use old key to decrypt
    const originalKey = process.env.ENCRYPTION_KEY
    process.env.ENCRYPTION_KEY = oldKey

    try {
      const decrypted = decrypt(encryptedData)

      // Use new key to encrypt
      process.env.ENCRYPTION_KEY = newKey
      const reencrypted = encrypt(decrypted)

      return reencrypted
    } finally {
      // Restore original key
      process.env.ENCRYPTION_KEY = originalKey
    }
  }
}

/**
 * Validate encryption configuration
 */
export function validateEncryptionConfig(): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check if encryption key is set
  if (!process.env.ENCRYPTION_KEY) {
    if (process.env.NODE_ENV === 'production') {
      errors.push('ENCRYPTION_KEY environment variable is required in production')
    } else {
      console.warn('⚠️ ENCRYPTION_KEY not set, using fallback (not secure for production)')
    }
  } else {
    // Validate key length
    const keyBuffer = Buffer.from(process.env.ENCRYPTION_KEY, 'hex')
    if (keyBuffer.length !== ENCRYPTION_CONFIG.keyLength) {
      errors.push(`Encryption key must be ${ENCRYPTION_CONFIG.keyLength} bytes (${ENCRYPTION_CONFIG.keyLength * 2} hex characters)`)
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Validate on module load
if (typeof window === 'undefined') {
  const validation = validateEncryptionConfig()
  if (!validation.valid && process.env.NODE_ENV === 'production') {
    throw new Error(`Encryption configuration invalid: ${validation.errors.join(', ')}`)
  }
}
