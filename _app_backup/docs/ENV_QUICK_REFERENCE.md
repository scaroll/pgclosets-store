# Environment Variables - Quick Reference

Quick reference card for environment variable usage in PG Closets.

## 🚀 Quick Setup

```bash
# 1. Copy example file
cp .env.example .env.local

# 2. Generate secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('CSRF_SECRET=' + require('crypto').randomBytes(16).toString('base64'))"

# 3. Add secrets to .env.local
# 4. Start dev server
npm run dev
```

## 📝 Usage Patterns

### ✅ Do This
```typescript
import { env } from '@/lib/env-validation'

const secret = env.JWT_SECRET
const appUrl = env.NEXT_PUBLIC_APP_URL
```

### ❌ Don't Do This
```typescript
const secret = process.env.JWT_SECRET || 'default'
const appUrl = process.env.NEXT_PUBLIC_APP_URL
```

## 🔧 Helper Functions

### Service Availability
```typescript
import { services } from '@/lib/env-validation'

services.hasEmail()      // Check if RESEND_API_KEY is set
services.hasDatabase()   // Check if DATABASE_URL is set
services.hasStripe()     // Check if Stripe keys are set
services.hasAnalytics()  // Check if GA is configured
services.hasOpenAI()     // Check if OpenAI key is set
```

### Feature Flags
```typescript
import { features } from '@/lib/env-validation'

features.premiumQuotes    // FEATURE_PREMIUM_QUOTES
features.instantPricing   // FEATURE_INSTANT_PRICING
features.visualizer3D     // FEATURE_3D_VISUALIZER
features.chatSupport      // FEATURE_CHAT_SUPPORT
features.reviews          // FEATURE_REVIEWS_ENABLED
features.arPreview        // FEATURE_AR_PREVIEW
```

### Environment Checks
```typescript
import { isProduction, isDevelopment, isTest } from '@/lib/env-validation'

if (isProduction()) { /* ... */ }
if (isDevelopment()) { /* ... */ }
if (isTest()) { /* ... */ }
```

## 🔐 Required in Production

| Variable | Min Length | Format |
|----------|-----------|--------|
| JWT_SECRET | 32 chars | Any string |
| CSRF_SECRET | 16 chars | Any string |
| DATABASE_URL | N/A | `postgresql://...` |
| NODE_ENV | N/A | `production` |

## 🔑 API Key Formats

| Service | Variable | Format | Example |
|---------|----------|--------|---------|
| Resend | RESEND_API_KEY | `re_*` | `re_abc123` |
| Stripe | STRIPE_SECRET_KEY | `sk_test_*` or `sk_live_*` | `sk_test_123` |
| OpenAI | OPENAI_API_KEY | `sk-*` | `sk-abc123` |
| GA4 | NEXT_PUBLIC_GA_ID | `G-*` | `G-ABC123` |
| GTM | NEXT_PUBLIC_GTM_ID | `GTM-*` | `GTM-ABC123` |

## 🎯 Common Operations

### Check if Email is Configured
```typescript
import { services } from '@/lib/env-validation'

if (!services.hasEmail()) {
  return { error: 'Email service not configured' }
}

await sendEmail({ ... })
```

### Use Feature Flags
```typescript
import { features } from '@/lib/env-validation'

<div>
  <StandardFeature />
  {features.premiumQuotes && <PremiumFeature />}
</div>
```

### Set Cookie Security
```typescript
import { isProduction, env } from '@/lib/env-validation'

response.cookies.set('session', token, {
  secure: isProduction(),
  domain: new URL(env.NEXT_PUBLIC_APP_URL).hostname,
  sameSite: 'strict'
})
```

## ⚠️ Validation Messages

### Production Errors (App Exits)
```
❌ JWT_SECRET: Secrets must be at least 32 characters for security
❌ DATABASE_URL: DATABASE_URL is required in production
❌ STRIPE_SECRET_KEY: Must be a valid Stripe secret key
```

### Development Warnings (App Continues)
```
⚠️ RESEND_API_KEY not set - email features will not work
⚠️ No database connection configured
⚠️ Google Analytics not configured
```

### Security Warnings
```
🔒 JWT_SECRET appears to be a default value
🔒 ⚠️ CRITICAL: Using Stripe TEST key in PRODUCTION environment
```

## 🧪 Testing

```bash
# Run env validation tests
npm test lib/__tests__/env-validation.test.ts

# Type-check env validation
npx tsc --noEmit lib/env-validation.ts
```

## 📚 Full Documentation

- **Setup Guide**: `docs/ENVIRONMENT_SETUP.md`
- **Implementation Summary**: `ENV_VALIDATION_SUMMARY.md`
- **Example File**: `.env.example`
- **Source Code**: `lib/env-validation.ts`

## 🔧 Troubleshooting

### Generate Secrets
```bash
# JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# CSRF Secret (16+ characters)
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"

# API Key (for custom services)
node -e "console.log('pgc_' + require('crypto').randomBytes(32).toString('hex'))"
```

### Check Current Config
```bash
# See which env vars are set (safe - doesn't show values)
node -e "console.log(Object.keys(process.env).filter(k => k.includes('JWT') || k.includes('DATABASE')))"
```

### Debug Mode
```bash
DEBUG=true VERBOSE_LOGGING=true npm run dev
```

## 💡 Tips

1. **Never commit** `.env.local` to git
2. **Use different secrets** for each environment
3. **Rotate secrets** every 90 days
4. **Test locally** before deploying
5. **Check validation logs** on startup
6. **Use type-safe access** everywhere
7. **Leverage helper functions** for cleaner code

## 🎯 Quick Commands

```bash
# Setup
cp .env.example .env.local

# Generate secrets
npm run generate-secrets  # (if script exists)
# Or manually:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Validate
npm run dev  # Validates on startup

# Test
npm test lib/__tests__/env-validation.test.ts

# Type-check
npm run type-check
```

---

**Last Updated**: 2025-01-16
**Quick Reference Version**: 1.0.0
