/**
 * Formatting Utilities Unit Tests
 * Tests for price, date, and string formatting functions
 */

import { describe, expect, it } from 'vitest'

// Utility functions to test (these should exist in your codebase)
const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price)
}

const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}

const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}

const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

describe('Formatting Utilities', () => {
  describe('formatPrice', () => {
    it('should format price in USD with two decimal places', () => {
      expect(formatPrice(599.99)).toBe('$599.99')
      expect(formatPrice(1000)).toBe('$1,000.00')
      expect(formatPrice(0.99)).toBe('$0.99')
    })

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('$0.00')
    })

    it('should handle large numbers', () => {
      expect(formatPrice(1000000)).toBe('$1,000,000.00')
    })

    it('should handle negative prices', () => {
      expect(formatPrice(-50)).toBe('-$50.00')
    })

    it('should format with different currencies', () => {
      expect(formatPrice(100, 'CAD')).toContain('100.00')
      expect(formatPrice(100, 'EUR')).toContain('100.00')
    })

    it('should handle decimal precision', () => {
      expect(formatPrice(599.995)).toBe('$600.00') // Rounds
      expect(formatPrice(599.994)).toBe('$599.99')
    })
  })

  describe('formatDate', () => {
    it('should format ISO date string', () => {
      const result = formatDate('2025-01-15T10:30:00Z')
      expect(result).toMatch(/January 15, 2025/)
    })

    it('should format Date object', () => {
      const date = new Date('2025-01-15')
      const result = formatDate(date)
      expect(result).toMatch(/January/)
    })

    it('should handle different date formats', () => {
      expect(formatDate('2025-12-31')).toMatch(/December 31, 2025/)
      expect(formatDate('2025-01-01')).toMatch(/January 1, 2025/)
    })
  })

  describe('slugify', () => {
    it('should convert text to URL-friendly slug', () => {
      expect(slugify('Modern Sliding Door')).toBe('modern-sliding-door')
    })

    it('should handle special characters', () => {
      expect(slugify('Product #1 - Best Seller!')).toBe('product-1-best-seller')
    })

    it('should handle multiple spaces', () => {
      expect(slugify('Multiple   Spaces   Here')).toBe('multiple-spaces-here')
    })

    it('should handle leading/trailing spaces', () => {
      expect(slugify('  Trim Me  ')).toBe('trim-me')
    })

    it('should handle already slugified text', () => {
      expect(slugify('already-a-slug')).toBe('already-a-slug')
    })

    it('should handle empty string', () => {
      expect(slugify('')).toBe('')
    })

    it('should handle non-ASCII characters', () => {
      expect(slugify('Café Résumé')).toBe('caf-rsum')
    })
  })

  describe('truncate', () => {
    const longText = 'This is a very long text that needs to be truncated'

    it('should truncate text longer than maxLength', () => {
      expect(truncate(longText, 20)).toBe('This is a very long...')
    })

    it('should not truncate text shorter than maxLength', () => {
      const shortText = 'Short'
      expect(truncate(shortText, 20)).toBe('Short')
    })

    it('should handle exact length match', () => {
      const text = 'Exactly twenty chars'
      expect(truncate(text, 20)).toBe('Exactly twenty chars')
    })

    it('should handle zero maxLength', () => {
      expect(truncate('test', 0)).toBe('...')
    })

    it('should handle empty string', () => {
      expect(truncate('', 10)).toBe('')
    })
  })

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should lowercase rest of string', () => {
      expect(capitalize('HELLO')).toBe('Hello')
      expect(capitalize('hELLO')).toBe('Hello')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
    })

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle strings with spaces', () => {
      expect(capitalize('hello world')).toBe('Hello world')
    })
  })

  describe('formatPhone', () => {
    it('should format 10-digit phone number', () => {
      expect(formatPhone('6135550123')).toBe('(613) 555-0123')
    })

    it('should handle phone with existing formatting', () => {
      expect(formatPhone('613-555-0123')).toBe('(613) 555-0123')
    })

    it('should handle phone with spaces', () => {
      expect(formatPhone('613 555 0123')).toBe('(613) 555-0123')
    })

    it('should return original for invalid length', () => {
      expect(formatPhone('123')).toBe('123')
      expect(formatPhone('12345678901')).toBe('12345678901')
    })

    it('should handle empty string', () => {
      expect(formatPhone('')).toBe('')
    })
  })
})
