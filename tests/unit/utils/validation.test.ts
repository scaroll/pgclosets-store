/**
 * Validation Utilities Unit Tests
 * Tests for input validation functions
 */

import { describe, it, expect } from 'vitest'

// Validation utility functions
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10
}

const isValidPostalCode = (postalCode: string): boolean => {
  // US ZIP or Canadian postal code
  const usZipRegex = /^\d{5}(-\d{4})?$/
  const canadianRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i
  return usZipRegex.test(postalCode) || canadianRegex.test(postalCode)
}

const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    // Ensure there's a proper protocol (not just //)
    return (
      parsed.protocol.startsWith('http') ||
      parsed.protocol.startsWith('ftp') ||
      parsed.protocol.startsWith('mailto')
    )
  } catch {
    return false
  }
}

const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && price >= 0 && !isNaN(price) && isFinite(price)
}

const isValidQuantity = (quantity: number): boolean => {
  return Number.isInteger(quantity) && quantity > 0
}

const isValidSlug = (slug: string): boolean => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
  return slugRegex.test(slug)
}

const isStrongPassword = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  )
}

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('john.doe@company.co.uk')).toBe(true)
      expect(isValidEmail('test+tag@email.com')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('missing@domain')).toBe(false)
      expect(isValidEmail('@nodomain.com')).toBe(false)
      expect(isValidEmail('spaces @test.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })

    it('should reject emails with multiple @ symbols', () => {
      expect(isValidEmail('user@@example.com')).toBe(false)
      expect(isValidEmail('user@test@example.com')).toBe(false)
    })
  })

  describe('isValidPhone', () => {
    it('should validate phone numbers with 10+ digits', () => {
      expect(isValidPhone('6135550123')).toBe(true)
      expect(isValidPhone('613-555-0123')).toBe(true)
      expect(isValidPhone('(613) 555-0123')).toBe(true)
      expect(isValidPhone('+1 613 555 0123')).toBe(true)
    })

    it('should reject phone numbers with less than 10 digits', () => {
      expect(isValidPhone('123456789')).toBe(false)
      expect(isValidPhone('555-0123')).toBe(false)
      expect(isValidPhone('')).toBe(false)
    })

    it('should handle international formats', () => {
      expect(isValidPhone('+1 613 555 0123')).toBe(true) // 11 digits
      expect(isValidPhone('+44 20 1234 5678')).toBe(true) // 11 digits
    })
  })

  describe('isValidPostalCode', () => {
    it('should validate US ZIP codes', () => {
      expect(isValidPostalCode('12345')).toBe(true)
      expect(isValidPostalCode('12345-6789')).toBe(true)
    })

    it('should validate Canadian postal codes', () => {
      expect(isValidPostalCode('K1A 0B1')).toBe(true)
      expect(isValidPostalCode('K1A0B1')).toBe(true)
      expect(isValidPostalCode('M5H 2N2')).toBe(true)
    })

    it('should reject invalid postal codes', () => {
      expect(isValidPostalCode('1234')).toBe(false)
      expect(isValidPostalCode('ABCDEF')).toBe(false)
      expect(isValidPostalCode('K1A-0B1')).toBe(false)
      expect(isValidPostalCode('')).toBe(false)
    })
  })

  describe('isValidUrl', () => {
    it('should validate complete URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://test.com/path')).toBe(true)
      expect(isValidUrl('https://sub.domain.com/path?query=1')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
      expect(isValidUrl('htp://invalid.com')).toBe(false)
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('//missing-protocol.com')).toBe(false)
    })

    it('should validate URLs with different protocols', () => {
      expect(isValidUrl('ftp://files.example.com')).toBe(true)
      expect(isValidUrl('mailto:test@example.com')).toBe(true)
    })
  })

  describe('isValidPrice', () => {
    it('should validate positive numbers', () => {
      expect(isValidPrice(0)).toBe(true)
      expect(isValidPrice(99.99)).toBe(true)
      expect(isValidPrice(1000)).toBe(true)
    })

    it('should reject negative numbers', () => {
      expect(isValidPrice(-10)).toBe(false)
      expect(isValidPrice(-0.01)).toBe(false)
    })

    it('should reject non-numbers', () => {
      expect(isValidPrice(NaN)).toBe(false)
      expect(isValidPrice(Infinity)).toBe(false)
    })
  })

  describe('isValidQuantity', () => {
    it('should validate positive integers', () => {
      expect(isValidQuantity(1)).toBe(true)
      expect(isValidQuantity(100)).toBe(true)
    })

    it('should reject zero and negative numbers', () => {
      expect(isValidQuantity(0)).toBe(false)
      expect(isValidQuantity(-1)).toBe(false)
    })

    it('should reject decimals', () => {
      expect(isValidQuantity(1.5)).toBe(false)
      expect(isValidQuantity(0.99)).toBe(false)
    })
  })

  describe('isValidSlug', () => {
    it('should validate URL slugs', () => {
      expect(isValidSlug('modern-sliding-door')).toBe(true)
      expect(isValidSlug('product-123')).toBe(true)
      expect(isValidSlug('simple')).toBe(true)
    })

    it('should reject invalid slugs', () => {
      expect(isValidSlug('With Spaces')).toBe(false)
      expect(isValidSlug('With_Underscore')).toBe(false)
      expect(isValidSlug('UPPERCASE')).toBe(false)
      expect(isValidSlug('special!char')).toBe(false)
      expect(isValidSlug('')).toBe(false)
    })

    it('should reject slugs with leading/trailing hyphens', () => {
      expect(isValidSlug('-leading')).toBe(false)
      expect(isValidSlug('trailing-')).toBe(false)
      expect(isValidSlug('--double')).toBe(false)
    })
  })

  describe('isStrongPassword', () => {
    it('should validate strong passwords', () => {
      expect(isStrongPassword('Password123')).toBe(true)
      expect(isStrongPassword('MySecure1Pass')).toBe(true)
      expect(isStrongPassword('Test1234')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(isStrongPassword('short1')).toBe(false) // Too short
      expect(isStrongPassword('alllowercase123')).toBe(false) // No uppercase
      expect(isStrongPassword('ALLUPPERCASE123')).toBe(false) // No lowercase
      expect(isStrongPassword('NoNumbers')).toBe(false) // No numbers
      expect(isStrongPassword('password')).toBe(false) // Missing all requirements
    })

    it('should handle edge cases', () => {
      expect(isStrongPassword('')).toBe(false)
      expect(isStrongPassword('1234567')).toBe(false)
      expect(isStrongPassword('Aa1')).toBe(false) // Too short
    })
  })
})
