/**
 * Environment Variable Validation
 *
 * Type-safe environment variable validation using Zod.
 * Validates all required environment variables at startup and provides
 * strongly-typed access throughout the application.
 *
 * Usage:
 *   import { env } from '@/lib/env-validation'
 *   const secret = env.JWT_SECRET
 */

import { z } from 'zod'

// Helper schemas for common patterns
const urlSchema = z.string().url('Must be a valid URL')
const emailSchema = z.string().email('Must be a valid email address')
const nonEmptyString = z.string().min(1, 'Cannot be empty')
const secretSchema = z.string().min(32, 'Secrets must be at least 32 characters for security')
const apiKeySchema = z.string().regex(/^[a-zA-Z0-9_-]+$/, 'Invalid API key format')

// Node environment enum
const nodeEnvSchema = z.enum(['development', 'production', 'test']).default('development')

// Complete environment schema
const envSchema = z.object({
  // ============================================
  // Node Environment (Required)
  // ============================================
  NODE_ENV: nodeEnvSchema,

  // ============================================
  // Security & Authentication (Required)
  // ============================================
  JWT_SECRET: secretSchema,
  CSRF_SECRET: z.string().min(16, 'CSRF secret must be at least 16 characters'),

  // NextAuth (optional - only if using NextAuth)
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: urlSchema.optional(),

  // ============================================
  // Database (Required for production)
  // ============================================
  DATABASE_URL: z.string()
    .regex(
      /^postgres(ql)?:\/\/.+/,
      'Must be a valid PostgreSQL connection string'
    )
    .optional()
    .refine(
      (val) => process.env.NODE_ENV !== 'production' || val,
      'DATABASE_URL is required in production'
    ),

  // Supabase (optional - alternative to direct DB connection)
  NEXT_PUBLIC_SUPABASE_URL: urlSchema.optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: apiKeySchema.optional(),
  SUPABASE_SERVICE_ROLE_KEY: apiKeySchema.optional(),

  // ============================================
  // Application URLs (Required)
  // ============================================
  NEXT_PUBLIC_APP_URL: urlSchema.default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: urlSchema.default('http://localhost:3000/api'),

  // ============================================
  // Analytics & Tracking (Optional)
  // ============================================
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string()
    .regex(/^G-[A-Z0-9]+$/, 'Must be a valid GA4 measurement ID (G-XXXXXXXXXX)')
    .optional(),
  NEXT_PUBLIC_GA_ID: z.string()
    .regex(/^G-[A-Z0-9]+$/, 'Must be a valid GA4 ID')
    .optional(),
  NEXT_PUBLIC_GTM_ID: z.string()
    .regex(/^GTM-[A-Z0-9]+$/, 'Must be a valid GTM ID')
    .optional(),
  NEXT_PUBLIC_FB_PIXEL_ID: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_VERIFICATION: z.string().optional(),
  NEXT_PUBLIC_BING_VERIFICATION: z.string().optional(),

  // PostHog Analytics
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: urlSchema.optional(),

  // ============================================
  // Payment Processing (Stripe) - Optional
  // ============================================
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string()
    .regex(/^pk_(test|live)_[a-zA-Z0-9]+$/, 'Must be a valid Stripe publishable key')
    .optional(),
  STRIPE_SECRET_KEY: z.string()
    .regex(/^sk_(test|live)_[a-zA-Z0-9]+$/, 'Must be a valid Stripe secret key')
    .optional(),
  STRIPE_WEBHOOK_SECRET: z.string()
    .regex(/^whsec_[a-zA-Z0-9]+$/, 'Must be a valid Stripe webhook secret')
    .optional(),

  // Paddle (alternative payment processor)
  NEXT_PUBLIC_PADDLE_VENDOR_ID: z.string().optional(),
  NEXT_PUBLIC_PADDLE_ENVIRONMENT: z.enum(['sandbox', 'production']).optional(),

  // ============================================
  // Email Service (Resend) - Optional
  // ============================================
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: emailSchema.optional(),
  EMAIL_FROM: emailSchema.optional(),
  EMAIL_REPLY_TO: emailSchema.optional(),
  CONTACT_EMAIL: emailSchema.optional(),

  // ============================================
  // External Services (Optional)
  // ============================================
  // OpenAI
  OPENAI_API_KEY: z.string()
    .regex(/^sk-[a-zA-Z0-9]+$/, 'Must be a valid OpenAI API key')
    .optional(),

  // Google Maps
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: apiKeySchema.optional(),

  // Sentry (Error Tracking)
  SENTRY_DSN: urlSchema.optional(),
  NEXT_PUBLIC_SENTRY_DSN: urlSchema.optional(),

  // Cloudinary (Image Hosting)
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Redis (Caching)
  REDIS_URL: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  // ============================================
  // Business Configuration (Public, Optional)
  // ============================================
  NEXT_PUBLIC_BUSINESS_NAME: nonEmptyString.optional(),
  NEXT_PUBLIC_BUSINESS_PHONE: z.string().optional(),
  NEXT_PUBLIC_BUSINESS_EMAIL: emailSchema.optional(),
  NEXT_PUBLIC_BUSINESS_ADDRESS: z.string().optional(),
  BUSINESS_HOURS_START: z.string().optional(),
  BUSINESS_HOURS_END: z.string().optional(),
  BUSINESS_TIMEZONE: z.string().optional(),
  SERVICE_AREAS: z.string().optional(),

  // ============================================
  // Social Media URLs (Optional)
  // ============================================
  NEXT_PUBLIC_FACEBOOK_URL: urlSchema.optional(),
  NEXT_PUBLIC_INSTAGRAM_URL: urlSchema.optional(),
  NEXT_PUBLIC_LINKEDIN_URL: urlSchema.optional(),
  NEXT_PUBLIC_YOUTUBE_URL: urlSchema.optional(),

  // ============================================
  // Feature Flags (Optional with defaults)
  // ============================================
  FEATURE_PREMIUM_QUOTES: z.coerce.boolean().default(true),
  FEATURE_INSTANT_PRICING: z.coerce.boolean().default(false),
  FEATURE_3D_VISUALIZER: z.coerce.boolean().default(false),
  FEATURE_CHAT_SUPPORT: z.coerce.boolean().default(false),
  FEATURE_REVIEWS_ENABLED: z.coerce.boolean().default(true),
  FEATURE_AR_PREVIEW: z.coerce.boolean().default(false),

  // ============================================
  // Rate Limiting (Optional with defaults)
  // ============================================
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  LEAD_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(3),
  LEAD_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(3600000),

  // ============================================
  // Monitoring & Logging (Optional)
  // ============================================
  DEBUG: z.coerce.boolean().default(false),
  VERBOSE_LOGGING: z.coerce.boolean().default(false),

  // ============================================
  // Vercel Environment Variables (Auto-set)
  // ============================================
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  VERCEL_REGION: z.string().optional(),
  VERCEL_GIT_PROVIDER: z.string().optional(),
  VERCEL_GIT_REPO_SLUG: z.string().optional(),
  VERCEL_GIT_REPO_OWNER: z.string().optional(),
  VERCEL_GIT_COMMIT_REF: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),
  EDGE_CONFIG: z.string().optional(),

  // ============================================
  // Development Only (Optional)
  // ============================================
  ANALYZE: z.coerce.boolean().default(false),
  VERCEL_TOOLBAR_ENABLED: z.coerce.boolean().default(false),
})

// Environment-specific validation rules
const productionRequirements = envSchema.refine(
  (data) => {
    if (data.NODE_ENV === 'production') {
      const missing: string[] = []

      // Check required production variables
      if (!data.JWT_SECRET || data.JWT_SECRET.length < 32) {
        missing.push('JWT_SECRET (must be 32+ characters)')
      }
      if (!data.CSRF_SECRET || data.CSRF_SECRET.length < 16) {
        missing.push('CSRF_SECRET (must be 16+ characters)')
      }
      if (!data.DATABASE_URL) {
        missing.push('DATABASE_URL')
      }

      if (missing.length > 0) {
        console.error('❌ Missing required production environment variables:', missing.join(', '))
        return false
      }
    }
    return true
  },
  {
    message: 'Missing required production environment variables. Check console for details.',
  }
)

// Development-specific warnings
function checkDevelopmentWarnings(data: z.infer<typeof envSchema>) {
  if (data.NODE_ENV === 'development') {
    const warnings: string[] = []

    // Warn about missing optional but recommended variables
    if (!data.RESEND_API_KEY) {
      warnings.push('RESEND_API_KEY not set - email features will not work')
    }
    if (!data.DATABASE_URL && !data.NEXT_PUBLIC_SUPABASE_URL) {
      warnings.push('No database connection configured - database features will not work')
    }
    if (!data.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      warnings.push('Google Analytics not configured - analytics will not be tracked')
    }

    if (warnings.length > 0) {
      console.warn('⚠️  Development environment warnings:')
      warnings.forEach((warning) => console.warn(`   - ${warning}`))
    }
  }
}

// Security warnings for weak secrets
function checkSecurityWarnings(data: z.infer<typeof envSchema>) {
  const warnings: string[] = []

  // Check for default/weak secrets (only in non-production)
  if (data.NODE_ENV !== 'production') {
    if (data.JWT_SECRET?.includes('default') || data.JWT_SECRET?.includes('secret')) {
      warnings.push('JWT_SECRET appears to be a default value - use a strong random secret')
    }
    if (data.CSRF_SECRET?.includes('default') || data.CSRF_SECRET?.includes('secret')) {
      warnings.push('CSRF_SECRET appears to be a default value - use a strong random secret')
    }
  }

  // Check Stripe keys match environment
  if (data.NODE_ENV === 'production') {
    if (data.STRIPE_SECRET_KEY?.startsWith('sk_test_')) {
      warnings.push('⚠️  CRITICAL: Using Stripe TEST key in PRODUCTION environment')
    }
  } else {
    if (data.STRIPE_SECRET_KEY?.startsWith('sk_live_')) {
      warnings.push('Using Stripe LIVE key in non-production environment')
    }
  }

  if (warnings.length > 0) {
    console.warn('🔒 Security warnings:')
    warnings.forEach((warning) => console.warn(`   - ${warning}`))
  }
}

// Parse and validate environment variables
function validateEnv() {
  try {
    // Initial validation
    const parsed = envSchema.safeParse(process.env)

    if (!parsed.success) {
      console.error('❌ Environment variable validation failed:')
      parsed.error.errors.forEach((error) => {
        console.error(`   - ${error.path.join('.')}: ${error.message}`)
      })
      throw new Error('Invalid environment variables. Check the errors above.')
    }

    // Production-specific validation
    const validated = productionRequirements.safeParse(parsed.data)

    if (!validated.success) {
      throw new Error(validated.error.errors[0]?.message || 'Production validation failed')
    }

    // Run warning checks
    checkDevelopmentWarnings(validated.data)
    checkSecurityWarnings(validated.data)

    // Success message
    if (process.env.NODE_ENV !== 'test') {
      console.log(`✅ Environment variables validated successfully (${validated.data.NODE_ENV} mode)`)
    }

    return validated.data
  } catch (error) {
    console.error('💥 Environment validation failed:', error)

    // In production, fail hard
    if (process.env.NODE_ENV === 'production') {
      console.error('🚨 STOPPING APPLICATION - Fix environment variables before deployment')
      process.exit(1)
    }

    // In development, throw error to see in browser
    throw error
  }
}

// Validate and export typed environment variables
export const env = validateEnv()

// Type export for use in other files
export type Env = typeof env

// Helper functions for common checks
export const isProduction = () => env.NODE_ENV === 'production'
export const isDevelopment = () => env.NODE_ENV === 'development'
export const isTest = () => env.NODE_ENV === 'test'

// Feature flag helpers
export const features = {
  premiumQuotes: env.FEATURE_PREMIUM_QUOTES,
  instantPricing: env.FEATURE_INSTANT_PRICING,
  visualizer3D: env.FEATURE_3D_VISUALIZER,
  chatSupport: env.FEATURE_CHAT_SUPPORT,
  reviews: env.FEATURE_REVIEWS_ENABLED,
  arPreview: env.FEATURE_AR_PREVIEW,
} as const

// Service availability checks
export const services = {
  hasEmail: () => !!env.RESEND_API_KEY,
  hasDatabase: () => !!(env.DATABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL),
  hasStripe: () => !!(env.STRIPE_SECRET_KEY && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  hasAnalytics: () => !!env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  hasOpenAI: () => !!env.OPENAI_API_KEY,
} as const

/**
 * Generate a secure random secret for JWT/CSRF
 * Run this to generate secrets for your .env.local file:
 *
 * Node.js:
 *   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
 *
 * OpenSSL:
 *   openssl rand -base64 32
 */
export function generateSecret(bytes = 32): string {
  if (typeof window !== 'undefined') {
    throw new Error('generateSecret can only be called on the server')
  }
  const crypto = require('crypto')
  return crypto.randomBytes(bytes).toString('base64')
}
