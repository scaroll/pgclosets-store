# Environment Variable Setup Guide

Complete guide for configuring environment variables in the PG Closets application.

## 🚀 Quick Start

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Generate secrets**:
   ```bash
   # Generate JWT_SECRET (32+ characters)
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

   # Generate CSRF_SECRET (16+ characters)
   node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
   ```

3. **Update required variables** in `.env.local`:
   - `JWT_SECRET` - For session tokens
   - `CSRF_SECRET` - For CSRF protection
   - `DATABASE_URL` - PostgreSQL connection string (production only)

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## ✅ Validation System

The application uses **Zod-based validation** to ensure all environment variables are:
- **Type-safe**: TypeScript autocomplete for all variables
- **Validated at startup**: Catch misconfigurations before deployment
- **Well-documented**: Clear error messages for missing/invalid values

### Import and Use

```typescript
import { env, services, features, isProduction } from '@/lib/env-validation'

// Type-safe access to environment variables
const jwtSecret = env.JWT_SECRET
const appUrl = env.NEXT_PUBLIC_APP_URL

// Check service availability
if (services.hasEmail()) {
  // Send email
}

// Check feature flags
if (features.premiumQuotes) {
  // Show premium quotes feature
}

// Environment checks
if (isProduction()) {
  // Production-specific logic
}
```

## 📋 Required Variables

### Production Requirements

These variables **MUST** be set in production:

| Variable | Format | Description |
|----------|--------|-------------|
| `JWT_SECRET` | 32+ characters | Secret for signing JWT tokens |
| `CSRF_SECRET` | 16+ characters | Secret for CSRF token generation |
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection string |
| `NODE_ENV` | `production` | Node environment |

### Development Defaults

In development, the system provides sensible defaults and warnings for missing optional variables.

## 🔐 Security Variables

### Authentication

```bash
# JWT Secret (REQUIRED in production)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
JWT_SECRET=your-secure-32-character-secret-here

# CSRF Secret (REQUIRED in production)
# Generate with: node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
CSRF_SECRET=your-secure-16-character-secret

# NextAuth (optional, only if using NextAuth)
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

**Security Notes**:
- Never commit secrets to version control
- Use different secrets for dev/staging/production
- Rotate secrets regularly (every 90 days recommended)
- Minimum lengths are enforced (32 chars for JWT, 16 for CSRF)

## 🗄️ Database Configuration

### PostgreSQL (Primary)

```bash
# Production
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Local Development
DATABASE_URL=postgresql://localhost:5432/pgclosets_dev
```

**Format Validation**:
- Must start with `postgresql://` or `postgres://`
- Automatically validated at startup
- Required in production environments

### Supabase (Alternative)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 📧 Email Configuration (Resend)

```bash
# API Key (format validated: must start with "re_")
RESEND_API_KEY=re_your_api_key_here

# Email addresses
EMAIL_FROM=noreply@pgclosets.com
EMAIL_REPLY_TO=info@pgclosets.com
CONTACT_EMAIL=info@pgclosets.com
```

**Setup Steps**:
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use `onboarding@resend.dev` for testing
3. Get API key from dashboard
4. Add to `.env.local`

**Validation**:
- API key format: `re_[alphanumeric]`
- Email addresses validated as proper email format
- Service availability checked via `services.hasEmail()`

## 💳 Payment Processing (Stripe)

```bash
# Publishable Key (format validated)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Secret Key (format validated)
STRIPE_SECRET_KEY=sk_test_...

# Webhook Secret (format validated)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Important**:
- ⚠️ System warns if using test keys in production
- ⚠️ System warns if using live keys in development
- Format validation: `pk_test_` or `pk_live_` for publishable keys
- Format validation: `sk_test_` or `sk_live_` for secret keys

## 📊 Analytics & Tracking

### Google Analytics 4

```bash
# Measurement ID (format validated: G-XXXXXXXXXX)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Google Tag Manager

```bash
# GTM ID (format validated: GTM-XXXXXXX)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Other Analytics

```bash
# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=your-pixel-id

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Site Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
NEXT_PUBLIC_BING_VERIFICATION=your-verification-code
```

## 🌐 Application URLs

```bash
# Production URLs (validated as proper URLs)
NEXT_PUBLIC_APP_URL=https://www.pgclosets.com
NEXT_PUBLIC_API_URL=https://www.pgclosets.com/api

# Development URLs (defaults provided)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🎛️ Feature Flags

Feature flags are **boolean** values that enable/disable features:

```bash
# Premium features
FEATURE_PREMIUM_QUOTES=true           # Default: true
FEATURE_INSTANT_PRICING=false         # Default: false
FEATURE_3D_VISUALIZER=false           # Default: false
FEATURE_AR_PREVIEW=false              # Default: false

# Customer features
FEATURE_CHAT_SUPPORT=false            # Default: false
FEATURE_REVIEWS_ENABLED=true          # Default: true
```

**Usage**:
```typescript
import { features } from '@/lib/env-validation'

if (features.premiumQuotes) {
  // Show premium quotes widget
}
```

**Accepted Values**: `true`, `false`, `1`, `0`, `yes`, `no`

## ⚙️ Rate Limiting

```bash
# General API rate limiting
RATE_LIMIT_MAX_REQUESTS=100            # Default: 100
RATE_LIMIT_WINDOW_MS=900000            # Default: 15 minutes

# Lead form rate limiting
LEAD_RATE_LIMIT_MAX_REQUESTS=3         # Default: 3
LEAD_RATE_LIMIT_WINDOW_MS=3600000      # Default: 1 hour
```

## 🏢 Business Configuration

```bash
# Business Information (Public)
NEXT_PUBLIC_BUSINESS_NAME="PG Closets & Custom Cabinets"
NEXT_PUBLIC_BUSINESS_PHONE="613-555-0123"
NEXT_PUBLIC_BUSINESS_EMAIL="info@pgclosets.com"
NEXT_PUBLIC_BUSINESS_ADDRESS="Ottawa, ON, Canada"

# Operating Hours
BUSINESS_HOURS_START=09:00
BUSINESS_HOURS_END=17:00
BUSINESS_TIMEZONE=America/Toronto

# Service Areas (comma-separated)
SERVICE_AREAS="Ottawa,Gatineau,Kanata,Barrhaven,Gloucester,Orleans,Nepean"
```

## 🔧 External Services

### OpenAI (Optional)

```bash
# API Key (format validated: sk-...)
OPENAI_API_KEY=sk-your-api-key
```

### Google Maps (Optional)

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

### Sentry (Error Tracking)

```bash
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
```

### Cloudinary (Image Hosting)

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Redis (Caching)

```bash
# Local Development (optional)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-password

# Vercel KV (auto-configured in production)
# KV_REST_API_URL=auto-set-by-vercel
# KV_REST_API_TOKEN=auto-set-by-vercel
```

## 🚀 Vercel Deployment

### Auto-Configured Variables

These are automatically set by Vercel:

```bash
VERCEL_URL=your-app.vercel.app
VERCEL_ENV=production|preview|development
VERCEL_REGION=iad1
VERCEL_GIT_PROVIDER=github
VERCEL_GIT_REPO_SLUG=your-repo
VERCEL_GIT_REPO_OWNER=your-username
VERCEL_GIT_COMMIT_REF=main
VERCEL_GIT_COMMIT_SHA=abc123
```

### Vercel-Specific Configuration

```bash
# Edge Config
EDGE_CONFIG=your-edge-config-url

# Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=auto-set-by-vercel
```

## 🛠️ Development Tools

```bash
# Bundle Analyzer
ANALYZE=false                          # Set to true to analyze bundle

# Vercel Toolbar (dev only)
VERCEL_TOOLBAR_ENABLED=true

# Debug Logging
DEBUG=false
VERBOSE_LOGGING=false
```

## 📱 Social Media URLs

```bash
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/pgclosets
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/pgclosets
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/pgclosets
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@pgclosets
```

## ✅ Validation Features

### Startup Validation

The system validates all environment variables at startup:

```
✅ Environment variables validated successfully (development mode)
⚠️ Development environment warnings:
   - RESEND_API_KEY not set - email features will not work
   - No database connection configured - database features will not work
```

### Production Validation

In production, validation is **strict** and will **exit** if required variables are missing:

```
❌ Environment variable validation failed:
   - JWT_SECRET: Secrets must be at least 32 characters for security
   - DATABASE_URL: DATABASE_URL is required in production
🚨 STOPPING APPLICATION - Fix environment variables before deployment
```

### Security Warnings

The system warns about potential security issues:

```
🔒 Security warnings:
   - JWT_SECRET appears to be a default value - use a strong random secret
   - ⚠️ CRITICAL: Using Stripe TEST key in PRODUCTION environment
```

## 🧪 Testing

### Test Environment

```bash
NODE_ENV=test
```

In test mode, validation is relaxed and warnings are suppressed.

### Running Tests

```bash
# Run environment validation tests
npm test lib/__tests__/env-validation.test.ts
```

## 🔍 Troubleshooting

### Common Issues

**"JWT_SECRET: Secrets must be at least 32 characters"**
- Solution: Generate a proper secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

**"DATABASE_URL: Must be a valid PostgreSQL connection string"**
- Solution: Ensure URL starts with `postgresql://` or `postgres://`
- Check format: `postgresql://user:password@host:5432/database`

**"STRIPE_SECRET_KEY: Must be a valid Stripe secret key"**
- Solution: Check key format - should start with `sk_test_` or `sk_live_`
- Get keys from Stripe dashboard

**"Email service not configured"**
- Solution: Add `RESEND_API_KEY` to `.env.local`
- Format: `re_[alphanumeric]`

### Debug Mode

Enable debug logging to see detailed validation:

```bash
DEBUG=true
VERBOSE_LOGGING=true
```

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

## 🔒 Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use different secrets for each environment**
3. **Rotate secrets regularly** (every 90 days)
4. **Use strong, random secrets** (use crypto.randomBytes)
5. **Monitor for exposed secrets** (use GitHub secret scanning)
6. **Use environment-specific keys** (test keys in dev, live keys in prod)
7. **Enable 2FA** on all service accounts
8. **Audit access logs** regularly

## 📞 Support

For issues with environment configuration:
1. Check the validation error messages
2. Review this documentation
3. Check `.env.example` for correct format
4. Contact the development team

---

**Last Updated**: 2025-01-16
**Version**: 1.0.0
