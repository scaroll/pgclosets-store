import { z } from 'zod';

// Environment variable schemas
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().optional(),

  // NextAuth
  NEXTAUTH_URL: z.string().optional(),
  NEXTAUTH_SECRET: z.string().optional(),

  // JWT
  JWT_SECRET: z.string().optional(),

  // Site
  NEXT_PUBLIC_SITE_URL: z.string().optional(),

  // Email
  EMAIL_FROM: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),

  // Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // OpenAI (for AI features)
  OPENAI_API_KEY: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

// Parsed environment object
export const env: Partial<Env> = envSchema.safeParse(process.env).success
  ? envSchema.parse(process.env)
  : {};

/**
 * Validate environment variables
 */
export function validateEnv(): { valid: boolean; env: Partial<Env>; errors: string[] } {
  const errors: string[] = [];

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    result.error.errors.forEach((error) => {
      errors.push(`${error.path.join('.')}: ${error.message}`);
    });
  }

  return {
    valid: result.success,
    env: result.success ? result.data : {},
    errors,
  };
}

/**
 * Get a required environment variable
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Get an optional environment variable with a default
 */
export function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * Check if a feature is enabled via environment variable
 */
export function isFeatureEnabled(featureKey: string): boolean {
  const value = process.env[featureKey];
  return value === 'true' || value === '1';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}
