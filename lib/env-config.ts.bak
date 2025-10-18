// Environment configuration and validation
export const ENV_CONFIG = {
  // Environment detection
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_STAGING: process.env.NEXT_PUBLIC_APP_ENV === 'staging',
  IS_PRODUCTION: process.env.NEXT_PUBLIC_APP_ENV === 'production',

  // URLs
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',

  // Database
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

  // Payment Processing
  PADDLE_VENDOR_ID: process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID || 
                   process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID_SANDBOX || '',
  PADDLE_CLIENT_TOKEN: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || 
                      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX || '',

  // Analytics
  GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
  GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || '',
  FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '',

  // Feature Flags
  FEATURES: {
    REVIEWS_ENABLED: process.env.FEATURE_REVIEWS_ENABLED === 'true',
    CHAT_SUPPORT: process.env.FEATURE_CHAT_SUPPORT === 'true',
    AR_PREVIEW: process.env.FEATURE_AR_PREVIEW === 'true',
    VIRTUAL_CONSULTATION: process.env.FEATURE_VIRTUAL_CONSULTATION === 'true',
  },

  // Rate Limiting
  RATE_LIMIT: {
    MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  },

  // Debug & Development
  DEBUG: process.env.DEBUG === 'true',
  VERBOSE_LOGGING: process.env.VERBOSE_LOGGING === 'true',
  ANALYZE: process.env.ANALYZE === 'true',

  // Business Configuration
  BUSINESS: {
    EMAIL: process.env.BUSINESS_EMAIL || 'info@pgclosets.com',
    ADDRESS: process.env.BUSINESS_ADDRESS || '123 Main St, Ottawa, ON',
    HOURS: {
      START: process.env.BUSINESS_HOURS_START || '09:00',
      END: process.env.BUSINESS_HOURS_END || '17:00',
      TIMEZONE: process.env.BUSINESS_TIMEZONE || 'America/Toronto',
    },
    SERVICE_AREAS: process.env.SERVICE_AREAS?.split(',') || ['Ottawa', 'Gatineau'],
  },
}

// Environment validation
export function validateEnvironment() {
  const required = {
    development: [
      'NEXT_PUBLIC_SUPABASE_URL',
    ],
    staging: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_PADDLE_VENDOR_ID',
    ],
    production: [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'NEXT_PUBLIC_PADDLE_VENDOR_ID',
      'NEXT_PUBLIC_PADDLE_CLIENT_TOKEN',
      'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    ],
  }

  const currentEnv = ENV_CONFIG.APP_ENV as keyof typeof required
  const requiredVars = required[currentEnv] || []
  
  const missing = requiredVars.filter(varName => {
    const value = process.env[varName]
    return !value || value.startsWith('your_')
  })

  if (missing.length > 0) {
    const message = `Missing required environment variables for ${currentEnv}: ${missing.join(', ')}`
    
    if (ENV_CONFIG.IS_PRODUCTION) {
      throw new Error(message)
    } else {
      console.warn(`⚠️  ${message}`)
    }
  }

  return {
    environment: currentEnv,
    isValid: missing.length === 0,
    missing,
  }
}

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const config = {
    security: {
      strictCSP: ENV_CONFIG.IS_PRODUCTION,
      enableHSTS: ENV_CONFIG.IS_PRODUCTION,
      requireHTTPS: ENV_CONFIG.IS_PRODUCTION,
    },
    performance: {
      enableCaching: ENV_CONFIG.IS_PRODUCTION,
      enableCompression: ENV_CONFIG.IS_PRODUCTION,
      optimizeImages: true,
    },
    logging: {
      level: ENV_CONFIG.IS_PRODUCTION ? 'error' : ENV_CONFIG.VERBOSE_LOGGING ? 'debug' : 'info',
      enableConsoleLogging: !ENV_CONFIG.IS_PRODUCTION,
      enableRemoteLogging: ENV_CONFIG.IS_PRODUCTION,
    },
    monitoring: {
      enableErrorTracking: ENV_CONFIG.IS_PRODUCTION,
      enablePerformanceMonitoring: ENV_CONFIG.IS_PRODUCTION,
      enableUptimeChecks: ENV_CONFIG.IS_PRODUCTION,
    },
  }

  return config
}

// Database configuration
export const getDatabaseConfig = () => {
  return {
    url: ENV_CONFIG.SUPABASE_URL,
    anonKey: ENV_CONFIG.SUPABASE_ANON_KEY,
    serviceRoleKey: ENV_CONFIG.SUPABASE_SERVICE_ROLE_KEY,
    options: {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-client-info': `pgclosets-store-${ENV_CONFIG.APP_ENV}`,
        },
      },
    },
  }
}

// Payment configuration
export const getPaymentConfig = () => {
  const isSandbox = !ENV_CONFIG.IS_PRODUCTION
  
  return {
    paddle: {
      vendorId: ENV_CONFIG.PADDLE_VENDOR_ID,
      clientToken: ENV_CONFIG.PADDLE_CLIENT_TOKEN,
      sandbox: isSandbox,
      environment: isSandbox ? 'sandbox' : 'production',
    },
    currency: 'CAD',
    taxRates: {
      'ON': 0.13, // HST
      'QC': 0.14975, // GST + QST
    },
  }
}

// Analytics configuration
export const getAnalyticsConfig = () => {
  return {
    googleAnalytics: {
      measurementId: ENV_CONFIG.GA_MEASUREMENT_ID,
      enabled: !!ENV_CONFIG.GA_MEASUREMENT_ID && ENV_CONFIG.IS_PRODUCTION,
    },
    googleTagManager: {
      id: ENV_CONFIG.GTM_ID,
      enabled: !!ENV_CONFIG.GTM_ID,
    },
    facebookPixel: {
      id: ENV_CONFIG.FACEBOOK_PIXEL_ID,
      enabled: !!ENV_CONFIG.FACEBOOK_PIXEL_ID && ENV_CONFIG.IS_PRODUCTION,
    },
  }
}

// Feature flags helper
export const isFeatureEnabled = (feature: keyof typeof ENV_CONFIG.FEATURES): boolean => {
  return ENV_CONFIG.FEATURES[feature] || false
}

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    environment: ENV_CONFIG.APP_ENV,
    nodeEnv: ENV_CONFIG.NODE_ENV,
    isDevelopment: ENV_CONFIG.IS_DEVELOPMENT,
    isStaging: ENV_CONFIG.IS_STAGING,
    isProduction: ENV_CONFIG.IS_PRODUCTION,
    features: ENV_CONFIG.FEATURES,
    validation: validateEnvironment(),
    timestamp: new Date().toISOString(),
  }
}

// Initialize environment validation on import
if (typeof window === 'undefined') {
  // Only validate on server side to avoid exposing sensitive info
  validateEnvironment()
}