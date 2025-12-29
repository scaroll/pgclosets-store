# URGENT: Fix Vercel Deployment Error

## Error

Application error: a server-side exception has occurred (Digest: 2067304443)

## Root Cause

NextAuth v5 requires `AUTH_SECRET` environment variable to be set on Vercel.

## Fix Instructions

### 1. Go to Vercel Project Settings

Visit: https://vercel.com/peoples-group/pgclosets-store/settings/environment-variables

### 2. Add the AUTH_SECRET environment variable

**Key:** `AUTH_SECRET`
**Value:** Generate a 32+ character random string:

- Run: `openssl rand -base64 32`
- Or visit: https://generate-secret.vercel.app/32

**Environments:** Select `Production`, `Preview`, `Development`

### 3. Add other required variables (if not already set)

| Key            | Value                                | Environments |
| -------------- | ------------------------------------ | ------------ |
| `DATABASE_URL` | Your PostgreSQL connection string    | All          |
| `DIRECT_URL`   | Same as DATABASE_URL (for Prisma)    | All          |
| `NEXTAUTH_URL` | `https://pgclosets-store.vercel.app` | Production   |

### 4. Redeploy

After adding environment variables, trigger a new deployment:

- Go to Deployments tab
- Click "Redeploy" on the latest deployment

## Quick Fix (One Command)

If you have Vercel CLI installed:

```bash
npx vercel env add AUTH_SECRET production
# Paste the generated secret when prompted
npx vercel env add AUTH_SECRET preview
# Paste the same secret
npx vercel env add AUTH_SECRET development
# Paste the same secret
```
