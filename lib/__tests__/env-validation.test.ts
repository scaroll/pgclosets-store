/**
 * Environment Validation Tests
 *
 * Tests for type-safe environment variable validation system.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('Environment Validation', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset module cache to force re-evaluation
    jest.resetModules()
    // Clone environment
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv
  })

  describe('Required Production Variables', () => {
    it('should require JWT_SECRET with minimum length', () => {
      process.env.NODE_ENV = 'production'
      process.env.JWT_SECRET = 'too-short'
      process.env.CSRF_SECRET = 'valid-csrf-secret-16chars'
      process.env.DATABASE_URL = 'postgresql://localhost:5432/test'

      expect(() => {
        jest.isolateModules(() => {
          require('../env-validation')
        })
      }).toThrow()
    })

    it('should require CSRF_SECRET in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.JWT_SECRET = 'valid-jwt-secret-32-characters-long-string'
      process.env.CSRF_SECRET = ''
      process.env.DATABASE_URL = 'postgresql://localhost:5432/test'

      expect(() => {
        jest.isolateModules(() => {
          require('../env-validation')
        })
      }).toThrow()
    })

    it('should require DATABASE_URL in production', () => {
      process.env.NODE_ENV = 'production'
      process.env.JWT_SECRET = 'valid-jwt-secret-32-characters-long-string'
      process.env.CSRF_SECRET = 'valid-csrf-secret-16chars'
      process.env.DATABASE_URL = ''

      expect(() => {
        jest.isolateModules(() => {
          require('../env-validation')
        })
      }).toThrow()
    })
  })

  describe('API Key Validation', () => {
    it('should validate Stripe keys format', () => {
      process.env.STRIPE_SECRET_KEY = 'invalid_key'

      expect(() => {
        jest.isolateModules(() => {
          require('../env-validation')
        })
      }).toThrow(/Must be a valid Stripe secret key/)
    })

    it('should validate Resend API key format', () => {
      process.env.RESEND_API_KEY = 'invalid_key'

      expect(() => {
        jest.isolateModules(() => {
          require('../env-validation')
        })
      }).toThrow(/Must be a valid Resend API key/)
    })

    it('should validate OpenAI API key format', () => {
      process.env.OPENAI_API_KEY = 'invalid_key'

      expect(() => {
        jest.isolateModules(() => {
          require('../env-validation')
        })
      }).toThrow(/Must be a valid OpenAI API key/)
    })
  })

  describe('URL Validation', () => {
    it('should validate URLs are properly formatted', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'not-a-url'

      expect(() => {
        jest.isolateModules(() => {
          require('../env-validation')
        })
      }).toThrow(/Must be a valid URL/)
    })

    it('should validate database URLs', () => {
      process.env.DATABASE_URL = 'mysql://invalid'

      expect(() => {
        jest.isolateModules(() => {
          require('../env-validation')
        })
      }).toThrow(/Must be a valid PostgreSQL connection string/)
    })
  })

  describe('Feature Flags', () => {
    it('should parse boolean feature flags', () => {
      process.env.FEATURE_PREMIUM_QUOTES = 'true'
      process.env.FEATURE_INSTANT_PRICING = 'false'

      const { env } = jest.isolateModules(() => {
        return require('../env-validation')
      })

      expect(env.FEATURE_PREMIUM_QUOTES).toBe(true)
      expect(env.FEATURE_INSTANT_PRICING).toBe(false)
    })

    it('should default feature flags when not set', () => {
      delete process.env.FEATURE_PREMIUM_QUOTES
      delete process.env.FEATURE_INSTANT_PRICING

      const { env } = jest.isolateModules(() => {
        return require('../env-validation')
      })

      expect(env.FEATURE_PREMIUM_QUOTES).toBe(true)
      expect(env.FEATURE_INSTANT_PRICING).toBe(false)
    })
  })

  describe('Security Warnings', () => {
    it('should warn about default secrets in development', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      process.env.NODE_ENV = 'development'
      process.env.JWT_SECRET = 'default-secret-key'

      jest.isolateModules(() => {
        require('../env-validation')
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('JWT_SECRET appears to be a default value')
      )

      consoleSpy.mockRestore()
    })

    it('should warn about test Stripe keys in production', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      process.env.NODE_ENV = 'production'
      process.env.JWT_SECRET = 'valid-jwt-secret-32-characters-long-string'
      process.env.CSRF_SECRET = 'valid-csrf-secret-16chars'
      process.env.DATABASE_URL = 'postgresql://localhost:5432/test'
      process.env.STRIPE_SECRET_KEY = 'sk_test_1234567890'

      jest.isolateModules(() => {
        require('../env-validation')
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Using Stripe TEST key in PRODUCTION')
      )

      consoleSpy.mockRestore()
    })
  })

  describe('Service Availability Helpers', () => {
    it('should detect when email service is available', () => {
      process.env.RESEND_API_KEY = 're_valid_key'

      const { services } = jest.isolateModules(() => {
        return require('../env-validation')
      })

      expect(services.hasEmail()).toBe(true)
    })

    it('should detect when Stripe is configured', () => {
      process.env.STRIPE_SECRET_KEY = 'sk_test_1234567890'
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_1234567890'

      const { services } = jest.isolateModules(() => {
        return require('../env-validation')
      })

      expect(services.hasStripe()).toBe(true)
    })

    it('should detect when database is configured', () => {
      process.env.DATABASE_URL = 'postgresql://localhost:5432/test'

      const { services } = jest.isolateModules(() => {
        return require('../env-validation')
      })

      expect(services.hasDatabase()).toBe(true)
    })
  })
})
