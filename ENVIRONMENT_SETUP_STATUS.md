# Environment Variables Configuration Status

**Date:** January 17, 2025
**Status:** PARTIALLY CONFIGURED - Action Required

---

## ✅ CONFIGURED (Automatically by Me)

These have been added to Vercel Production:

1. **NEXTAUTH_SECRET** ✅
   - Value: `yZ4cAsR/Vb+KxHmKsbfISEWMfMTvdGlGeJBT4pVeU0k=`
   - Purpose: NextAuth.js session encryption

2. **NEXTAUTH_URL** ✅
   - Value: `https://pgclosets.com`
   - Purpose: NextAuth.js base URL

3. **ADMIN_EMAIL** ✅
   - Value: `admin@pgclosets.com`
   - Purpose: Admin notifications recipient

4. **EMAIL_FROM** ✅
   - Value: `PG Closets <noreply@pgclosets.com>`
   - Purpose: Email sender address

## ✅ ALREADY CONFIGURED (From Previous Setup)

These were found in your Vercel project:

1. **DATABASE_URL** ✅
   - Purpose: Vercel Postgres connection
   - Status: Encrypted (already set)

2. **RESEND_API_KEY** ✅
   - Purpose: Email service API key
   - Status: Encrypted (already set)

3. **RESEND_FROM_EMAIL** ✅
   - Purpose: Email sender (legacy name)
   - Status: Encrypted (already set)

4. **CSRF_SECRET** ✅
   - Purpose: CSRF protection
   - Status: Encrypted (already set)

5. **JWT_SECRET** ✅
   - Purpose: JWT token signing
   - Status: Encrypted (already set)

---

## ⚠️ REQUIRED: YOUR ACTION NEEDED

These environment variables require external service setup and cannot be auto-configured:

### 1. Upstash Redis (Rate Limiting) - CRITICAL

**Why Needed:** Rate limiting to prevent API abuse and cost overruns

**How to Get:**

1. Go to: https://console.upstash.com
2. Create a free account (if you don't have one)
3. Click "Create Database"
4. Choose "Global" or your preferred region
5. Copy the following values:
   - **REDIS_URL**: `https://your-db-name.upstash.io`
   - **REDIS_TOKEN**: `Your-token-here`

**Add to Vercel:**

```bash
# After getting values from Upstash:
vercel env add REDIS_URL production
# Paste the URL when prompted

vercel env add REDIS_TOKEN production
# Paste the token when prompted
```

**Or via Vercel Dashboard:**

- Go to: https://vercel.com/peoples-group/pgclosets-store-main/settings/environment-variables
- Click "Add New"
- Name: `REDIS_URL`, Value: `https://...`, Environment: Production
- Click "Add New"
- Name: `REDIS_TOKEN`, Value: `...`, Environment: Production

---

### 2. Stripe (Payment Processing) - CRITICAL

**Why Needed:** E-commerce checkout and payment processing

**How to Get:**

1. Go to: https://dashboard.stripe.com
2. Get your API keys from the "Developers" → "API keys" section
3. For testing, use **Test mode** keys
4. For production, use **Live mode** keys

**Required Variables:**

- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: `pk_test_...` or `pk_live_...`
- **STRIPE_SECRET_KEY**: `sk_test_...` or `sk_live_...`
- **STRIPE_WEBHOOK_SECRET**: `whsec_...` (from Webhooks section)

**Add to Vercel:**

```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Paste your publishable key

vercel env add STRIPE_SECRET_KEY production
# Paste your secret key

vercel env add STRIPE_WEBHOOK_SECRET production
# Paste your webhook secret
```

**Or via Vercel Dashboard:**

- Go to environment variables page
- Add each of the 3 Stripe variables

---

### 3. DIRECT_URL (Database) - OPTIONAL BUT RECOMMENDED

**Why Needed:** Direct database connection for migrations (bypasses connection pooling)

**How to Get:**

1. Go to Vercel Postgres dashboard
2. Click on your database
3. Look for "Direct URL" or "Non-pooled connection"
4. Copy the URL (usually starts with `postgresql://` and includes port `:5432`)

**Add to Vercel:**

```bash
vercel env add DIRECT_URL production
# Paste the direct database URL
```

**Note:** If you don't have this, migrations might be slower but will still work.

---

### 4. Google OAuth (OPTIONAL)

**Why Needed:** "Sign in with Google" functionality

**How to Get:**

1. Go to: https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `https://pgclosets.com/api/auth/callback/google`

**Required Variables:**

- **GOOGLE_CLIENT_ID**: Your client ID
- **GOOGLE_CLIENT_SECRET**: Your client secret

**Add to Vercel:**

```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
```

**Note:** This is optional. Users can still sign in with email/password.

---

## 📊 CONFIGURATION SUMMARY

| Variable            | Status         | Critical | Action           |
| ------------------- | -------------- | -------- | ---------------- |
| NEXTAUTH_SECRET     | ✅ Configured  | Yes      | None             |
| NEXTAUTH_URL        | ✅ Configured  | Yes      | None             |
| ADMIN_EMAIL         | ✅ Configured  | Yes      | None             |
| EMAIL_FROM          | ✅ Configured  | Yes      | None             |
| DATABASE_URL        | ✅ Already Set | Yes      | None             |
| RESEND_API_KEY      | ✅ Already Set | Yes      | None             |
| **REDIS_URL**       | ❌ Missing     | **Yes**  | **You must add** |
| **REDIS_TOKEN**     | ❌ Missing     | **Yes**  | **You must add** |
| **STRIPE keys (3)** | ❌ Missing     | **Yes**  | **You must add** |
| DIRECT_URL          | ❌ Missing     | No       | Optional         |
| GOOGLE OAuth (2)    | ❌ Missing     | No       | Optional         |

---

## 🚀 AFTER YOU ADD THE CRITICAL VARIABLES

Once you add **REDIS_URL**, **REDIS_TOKEN**, and the **3 Stripe variables**:

1. **Redeploy:**

   ```bash
   vercel --prod --yes
   ```

2. **Or from Vercel Dashboard:**
   - Go to latest deployment
   - Click "Redeploy"
   - Build will succeed this time

3. **Run Database Migrations:**

   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Test the Site:**
   - Visit https://pgclosets.com
   - Test all features

---

## 📝 QUICK CHECKLIST

- [x] NEXTAUTH_SECRET configured
- [x] NEXTAUTH_URL configured
- [x] ADMIN_EMAIL configured
- [x] EMAIL_FROM configured
- [x] DATABASE_URL (already had)
- [x] RESEND_API_KEY (already had)
- [ ] **REDIS_URL** - YOU NEED TO ADD
- [ ] **REDIS_TOKEN** - YOU NEED TO ADD
- [ ] **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** - YOU NEED TO ADD
- [ ] **STRIPE_SECRET_KEY** - YOU NEED TO ADD
- [ ] **STRIPE_WEBHOOK_SECRET** - YOU NEED TO ADD
- [ ] DIRECT_URL (optional)
- [ ] Google OAuth (optional)

---

## 🎯 MINIMUM REQUIRED TO DEPLOY

**Must have:**

1. ✅ NEXTAUTH_SECRET (done)
2. ✅ NEXTAUTH_URL (done)
3. ✅ DATABASE_URL (done)
4. ✅ RESEND_API_KEY (done)
5. ❌ REDIS_URL (you need to add)
6. ❌ REDIS_TOKEN (you need to add)
7. ❌ STRIPE keys x3 (you need to add)

**Status:** 4 out of 7 critical variables configured (57%)

---

## 💡 NEXT STEPS

1. **Create Upstash Redis database** (5 minutes)
   - Sign up at https://console.upstash.com
   - Create database
   - Copy URL and token
   - Add to Vercel

2. **Get Stripe API keys** (5 minutes)
   - Log into Stripe dashboard
   - Copy test mode keys
   - Add to Vercel

3. **Redeploy** (automatic)
   - Run `vercel --prod --yes`
   - Or click "Redeploy" in Vercel dashboard

4. **Celebrate** 🎉
   - Website will be live and functional!

---

**I've configured everything I can automatically. The remaining variables require your accounts with Upstash and Stripe.**

**Estimated time to complete:** 10 minutes
