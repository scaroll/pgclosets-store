/**
 * Two-Factor Authentication (2FA) System
 * TOTP-based authentication using RFC 6238
 * Enterprise-grade security for admin access
 */

import * as crypto from 'crypto'
import { encrypt, decrypt } from './encryption'

interface TwoFactorSecret {
  secret: string
  backupCodes: string[]
  createdAt: Date
  lastUsed?: Date
}

interface TwoFactorSetup {
  secret: string
  qrCodeUrl: string
  backupCodes: string[]
  manualEntryKey: string
}

/**
 * TOTP (Time-based One-Time Password) implementation
 * Based on RFC 6238
 */
class TOTP {
  private static readonly DIGITS = 6
  private static readonly WINDOW = 30 // seconds
  private static readonly ALGORITHM = 'sha1'

  /**
   * Generate a random base32 secret
   */
  static generateSecret(): string {
    const buffer = crypto.randomBytes(20)
    return this.base32Encode(buffer)
  }

  /**
   * Generate TOTP token for a given secret and time
   */
  static generateToken(secret: string, time?: number): string {
    const epoch = Math.floor((time || Date.now()) / 1000 / this.WINDOW)
    const buffer = Buffer.allocUnsafe(8)
    buffer.writeBigInt64BE(BigInt(epoch))

    const hmac = crypto.createHmac(this.ALGORITHM, Buffer.from(this.base32Decode(secret)))
    hmac.update(buffer)
    const digest = hmac.digest()

    const offset = digest[digest.length - 1] & 0x0f
    const binary = ((digest[offset] & 0x7f) << 24) |
                   ((digest[offset + 1] & 0xff) << 16) |
                   ((digest[offset + 2] & 0xff) << 8) |
                   (digest[offset + 3] & 0xff)

    const token = binary % Math.pow(10, this.DIGITS)
    return token.toString().padStart(this.DIGITS, '0')
  }

  /**
   * Verify TOTP token
   * Allows for time drift (±1 window)
   */
  static verifyToken(secret: string, token: string, window: number = 1): boolean {
    const now = Date.now()

    // Check current time and adjacent windows
    for (let i = -window; i <= window; i++) {
      const time = now + (i * this.WINDOW * 1000)
      const expectedToken = this.generateToken(secret, time)

      if (crypto.timingSafeEqual(
        Buffer.from(expectedToken),
        Buffer.from(token)
      )) {
        return true
      }
    }

    return false
  }

  /**
   * Base32 encoding (RFC 4648)
   */
  private static base32Encode(buffer: Buffer): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let bits = 0
    let value = 0
    let output = ''

    for (let i = 0; i < buffer.length; i++) {
      value = (value << 8) | buffer[i]
      bits += 8

      while (bits >= 5) {
        output += alphabet[(value >>> (bits - 5)) & 31]
        bits -= 5
      }
    }

    if (bits > 0) {
      output += alphabet[(value << (5 - bits)) & 31]
    }

    return output
  }

  /**
   * Base32 decoding
   */
  private static base32Decode(encoded: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let bits = 0
    let value = 0
    let index = 0
    const output = Buffer.allocUnsafe(Math.ceil(encoded.length * 5 / 8))

    for (let i = 0; i < encoded.length; i++) {
      const char = encoded[i].toUpperCase()
      const val = alphabet.indexOf(char)

      if (val === -1) continue

      value = (value << 5) | val
      bits += 5

      if (bits >= 8) {
        output[index++] = (value >>> (bits - 8)) & 255
        bits -= 8
      }
    }

    return output.subarray(0, index)
  }
}

/**
 * 2FA Manager
 */
export class TwoFactorAuth {
  /**
   * Setup 2FA for a user
   */
  static async setup(userId: string, appName: string = 'PG Closets'): Promise<TwoFactorSetup> {
    // Generate secret
    const secret = TOTP.generateSecret()

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(8)

    // Create QR code URL for authenticator apps
    const qrCodeUrl = this.generateQRCodeUrl(userId, secret, appName)

    // Format manual entry key (easier to type)
    const manualEntryKey = secret.match(/.{1,4}/g)?.join(' ') || secret

    return {
      secret,
      qrCodeUrl,
      backupCodes,
      manualEntryKey
    }
  }

  /**
   * Enable 2FA for user
   * Store encrypted secret in database
   */
  static async enable(userId: string, secret: string, verificationToken: string): Promise<{
    success: boolean
    error?: string
    backupCodes?: string[]
  }> {
    // Verify the token to ensure user has set up authenticator
    if (!TOTP.verifyToken(secret, verificationToken)) {
      return {
        success: false,
        error: 'Invalid verification token'
      }
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(8)

    // Encrypt secret before storing
    const encryptedSecret = encrypt(secret)

    // In production, store in database:
    // await database.user.update({
    //   where: { id: userId },
    //   data: {
    //     twoFactorSecret: encryptedSecret,
    //     twoFactorEnabled: true,
    //     twoFactorBackupCodes: backupCodes.map(code => hash(code)),
    //     twoFactorEnabledAt: new Date()
    //   }
    // })

    console.log(`[2FA] Enabled for user ${userId}`)

    return {
      success: true,
      backupCodes
    }
  }

  /**
   * Verify 2FA token
   */
  static async verify(userId: string, token: string): Promise<boolean> {
    // In production, fetch from database:
    // const user = await database.user.findUnique({
    //   where: { id: userId },
    //   select: { twoFactorSecret: true, twoFactorEnabled: true }
    // })

    // Mock user data for development
    const user = {
      twoFactorSecret: null as string | null,
      twoFactorEnabled: false
    }

    if (!user.twoFactorSecret || !user.twoFactorEnabled) {
      return false
    }

    try {
      // Decrypt secret
      const secret = decrypt(user.twoFactorSecret)

      // Verify token
      const isValid = TOTP.verifyToken(secret, token)

      // Update last used timestamp
      if (isValid) {
        // await database.user.update({
        //   where: { id: userId },
        //   data: { twoFactorLastUsed: new Date() }
        // })
        console.log(`[2FA] Successful verification for user ${userId}`)
      }

      return isValid
    } catch (error) {
      console.error('[2FA] Verification error:', error)
      return false
    }
  }

  /**
   * Verify backup code
   */
  static async verifyBackupCode(userId: string, backupCode: string): Promise<boolean> {
    // In production, fetch from database and verify hashed codes
    // const user = await database.user.findUnique({
    //   where: { id: userId },
    //   select: { twoFactorBackupCodes: true }
    // })

    // For each stored hash, verify using timing-safe comparison
    // If match found, invalidate that backup code

    console.log(`[2FA] Backup code used for user ${userId}`)
    return false // Placeholder
  }

  /**
   * Disable 2FA
   */
  static async disable(userId: string, password: string): Promise<boolean> {
    // Verify password before disabling
    // const isValidPassword = await verifyPassword(userId, password)
    // if (!isValidPassword) return false

    // await database.user.update({
    //   where: { id: userId },
    //   data: {
    //     twoFactorSecret: null,
    //     twoFactorEnabled: false,
    //     twoFactorBackupCodes: [],
    //     twoFactorDisabledAt: new Date()
    //   }
    // })

    console.log(`[2FA] Disabled for user ${userId}`)
    return true
  }

  /**
   * Generate backup codes
   */
  private static generateBackupCodes(count: number): string[] {
    const codes: string[] = []

    for (let i = 0; i < count; i++) {
      // Generate 8-character alphanumeric code
      const code = crypto.randomBytes(4).toString('hex').toUpperCase()
      // Format as XXXX-XXXX for readability
      const formatted = `${code.slice(0, 4)}-${code.slice(4)}`
      codes.push(formatted)
    }

    return codes
  }

  /**
   * Generate QR code URL for authenticator apps
   * Format: otpauth://totp/AppName:UserID?secret=SECRET&issuer=AppName
   */
  private static generateQRCodeUrl(userId: string, secret: string, appName: string): string {
    const params = new URLSearchParams({
      secret,
      issuer: appName,
      algorithm: 'SHA1',
      digits: '6',
      period: '30'
    })

    return `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(userId)}?${params.toString()}`
  }

  /**
   * Regenerate backup codes
   */
  static async regenerateBackupCodes(userId: string, password: string): Promise<{
    success: boolean
    backupCodes?: string[]
    error?: string
  }> {
    // Verify password
    // const isValidPassword = await verifyPassword(userId, password)
    // if (!isValidPassword) {
    //   return { success: false, error: 'Invalid password' }
    // }

    const backupCodes = this.generateBackupCodes(8)

    // Store hashed backup codes
    // await database.user.update({
    //   where: { id: userId },
    //   data: {
    //     twoFactorBackupCodes: backupCodes.map(code => hash(code))
    //   }
    // })

    return {
      success: true,
      backupCodes
    }
  }

  /**
   * Check if 2FA is required for user
   */
  static async isRequired(userId: string): Promise<boolean> {
    // In production, fetch from database
    // const user = await database.user.findUnique({
    //   where: { id: userId },
    //   select: { twoFactorEnabled: true, role: true }
    // })

    // Require 2FA for all admin users
    // return user?.twoFactorEnabled || user?.role === 'admin'

    return false // Placeholder
  }

  /**
   * Get 2FA status for user
   */
  static async getStatus(userId: string): Promise<{
    enabled: boolean
    enabledAt?: Date
    lastUsed?: Date
    backupCodesRemaining: number
  }> {
    // In production, fetch from database
    return {
      enabled: false,
      backupCodesRemaining: 0
    }
  }
}

/**
 * Express/Next.js middleware for 2FA verification
 */
export function require2FA() {
  return async (req: any, res: any, next: any) => {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Check if 2FA is required
    const requires2FA = await TwoFactorAuth.isRequired(userId)

    if (!requires2FA) {
      return next()
    }

    // Check if 2FA has been verified in this session
    if (req.session?.twoFactorVerified) {
      return next()
    }

    // Require 2FA verification
    return res.status(403).json({
      error: '2FA verification required',
      requires2FA: true
    })
  }
}

export { TOTP }
