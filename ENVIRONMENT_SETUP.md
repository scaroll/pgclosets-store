# Environment Variables Setup Guide

This guide provides step-by-step instructions for configuring all environment variables required for PG Closets.

## Overview

The application uses environment variables to configure:
- Authentication & security
- Database connections
- Payment processing
- Email services
- Rate limiting & caching
- Analytics & monitoring
- External API integrations

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your actual credentials

3. Generate required secrets:
   ```bash
   # Generate JWT secret (32+ chars)
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

   # Generate CSRF secret (16+ chars)
   node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
   ```

## Required Variables for Production

### Security & Authentication

**Must be configured before deploying to production:**

```bash
JWT_SECRET=your-32-character-secret
CSRF_SECRET=your-16-character-secret
NEXTAUTH_SECRET=your-nextauth-secret-here
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Service Setup Guide

### 1. Authentication (NextAuth + Google OAuth)

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs:
     - Development: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://pgclosets.com/api/auth/callback/google`
5. Copy Client ID and Client Secret

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Database Configuration

#### Option A: PostgreSQL (Recommended)
```bash
DATABASE_URL=postgresql://username:password@host:5432/pgclosets
```

#### Option B: Supabase
1. Create account at [Supabase](https://supabase.com/)
2. Create new project
3. Get URL and keys from Project Settings > API

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Payment Processing (Stripe)

1. Create account at [Stripe](https://dashboard.stripe.com/)
2. Get API keys from Developers > API keys
3. Set up webhook endpoint: `https://pgclosets.com/api/stripe/webhook`

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Email Service (Resend)

1. Create account at [Resend](https://resend.com/)
2. Verify your domain
3. Create API key

```bash
RESEND_API_KEY=re_...
EMAIL_FROM=PG Closets <noreply@pgclosets.com>
EMAIL_REPLY_TO=info@pgclosets.com
ADMIN_EMAIL=admin@pgclosets.com
```

### 5. Rate Limiting (Upstash Redis)

1. Create account at [Upstash](https://console.upstash.com/)
2. Create Redis database
3. Get REST URL and token

```bash
REDIS_URL=https://your-redis-url.upstash.io
REDIS_TOKEN=your-redis-token
```

#### Alternative: Vercel KV
- Automatically configured when using Vercel
- Variables are set automatically:
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`

### 6. AI Features (OpenAI)

1. Create account at [OpenAI](https://platform.openai.com/)
2. Create API key

```bash
OPENAI_API_KEY=sk-...
```

### 7. Analytics (Google Analytics 4)

1. Create GA4 property at [Google Analytics](https://analytics.google.com/)
2. Create measurement ID

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 8. Error Tracking (Sentry - Optional)

1. Create account at [Sentry](https://sentry.io/)
2. Create new project
3. Get DSN

```bash
SENTRY_DSN=https://your-dsn-here
NEXT_PUBLIC_SENTRY_DSN=https://your-public-dsn-here
```

### 9. Image Hosting (Cloudinary - Optional)

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get credentials from Dashboard

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
```

### Production (Vercel)
Set these in Vercel Dashboard > Settings > Environment Variables:
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://pgclosets.com
NEXTAUTH_URL=https://pgclosets.com
```

## Validation

The application includes environment variable validation that:
- Validates variable formats
- Checks for required production variables
- Shows warnings for missing optional services
- Prevents deployment with invalid configurations

## Troubleshooting

### Common Issues

1. **"STRIPE_SECRET_KEY not configured"**
   - Ensure `STRIPE_SECRET_KEY` is set in your environment
   - Check that the key starts with `sk_test_` or `sk_live_`

2. **"JWT secret not configured"**
   - Generate a secret using: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - Add it to your `.env.local`

3. **Redis connection errors**
   - Verify `REDIS_URL` and `REDIS_TOKEN` are correct
   - If using local Redis, ensure it's running: `redis-server`

4. **Google OAuth redirect error**
   - Check that redirect URIs in Google Console match your app URL
   - Include both http://localhost:3000 and https://pgclosets.com

### Testing Configuration

Start the development server to test your configuration:

```bash
npm run dev
```

The application will:
- Validate all environment variables
- Show warnings for missing optional services
- Prevent startup if required variables are missing

## Security Best Practices

1. **Never commit `.env.local` to version control**
2. **Use different keys for development and production**
3. **Rotate secrets regularly**
4. **Use test keys in development, live keys in production**
5. **Keep secrets out of client-side code** (only use `NEXT_PUBLIC_` variables client-side)

## Deployment Checklist

Before deploying to production:

- [ ] Generate strong secrets for JWT, CSRF, and NextAuth
- [ ] Configure production database connection
- [ ] Set up production Stripe keys
- [ ] Configure email service
- [ ] Set up rate limiting (Redis/Upstash)
- [ ] Configure error tracking
- [ ] Test all integrations
- [ ] Verify webhook endpoints are accessible

## Support

For issues with:
- **Service-specific setup**: Check the service's documentation
- **Environment validation**: Check the console output on startup
- **Deployment issues**: Check Vercel function logs

## Environment Variable Reference

See `.env.example` for a complete list of all available environment variables and their purposes.