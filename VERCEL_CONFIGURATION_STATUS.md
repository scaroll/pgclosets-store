# Vercel Configuration Status

**Date**: October 9, 2025
**Project**: pgclosets-store
**Status**: ✅ FULLY CONFIGURED LOCALLY - MANUAL VERCEL DASHBOARD SETUP REQUIRED

---

## ✅ LOCAL CONFIGURATION (COMPLETE)

### 1. vercel.json - Platform Configuration ✅

**File**: [vercel.json](vercel.json)

```json
{
  "name": "pgclosets-store",
  "scope": "peoples-group",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps",
  "devCommand": "npm run dev",
  "regions": ["iad1"]
}
```

**Key Settings**:
- ✅ **Name**: pgclosets-store
- ✅ **Scope**: peoples-group (organization)
- ✅ **Framework**: Next.js (auto-detected)
- ✅ **Install Command**: `npm install --legacy-peer-deps` ⚠️ **CRITICAL FOR BUILD SUCCESS**
- ✅ **Build Command**: `npm run build`
- ✅ **Output**: `.next` directory
- ✅ **Region**: iad1 (US East - Virginia)
- ✅ **Git Integration**: Enabled for master branch + preview deployments

---

### 2. Project ID Alignment ✅

**Canonical Configuration** (from `.vercel/project.json`):
```json
{
  "orgId": "team_Xzht85INUsoW05STx9DMMyLX",
  "projectId": "prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu",
  "projectName": "pgclosets-store"
}
```

**Verification Across All Files**:

| File | Project ID | Status |
|------|------------|--------|
| `.vercel/project.json` | `prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu` | ✅ CANONICAL |
| `.vercel-lock` | `prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu` | ✅ ALIGNED |
| `deploy-to-pgclosets.sh` | `prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu` | ✅ ALIGNED |
| `.claude-cli-config.json` | `prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu` | ✅ ALIGNED |
| `verify-deployment-target.sh` | `prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu` | ✅ ALIGNED |

**Organization ID**: `team_Xzht85INUsoW05STx9DMMyLX` (consistent across all files)

---

### 3. Security Headers ✅

**Configured in vercel.json** (auto-applied to all routes):

```json
{
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.paddle.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://www.google-analytics.com https://api.paddle.com; frame-src https://cdn.paddle.com; object-src 'none'; base-uri 'self'; form-action 'self'"
}
```

**Additional Security for Webhooks**:
```json
{
  "source": "/api/webhooks/(.*)",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Jobber-Signature, X-Paddle-Signature"
}
```

---

### 4. Cron Jobs ✅

**Configured in vercel.json** (requires Pro or Enterprise plan):

| Path | Schedule | Description |
|------|----------|-------------|
| `/api/cron/refresh-sitemap` | `0 2 * * *` | Daily at 2 AM UTC |
| `/api/cron/reindex` | `0 3 * * 0` | Weekly Sunday 3 AM UTC |
| `/api/cron/warm-cache` | `*/30 * * * *` | Every 30 minutes |
| `/api/cron/ai-content-update` | `0 4 * * 1,4` | Monday & Thursday 4 AM UTC |

⚠️ **Note**: Cron jobs only work on Vercel Pro or Enterprise plans. On Hobby tier, they are silently ignored.

---

### 5. Function Timeouts ✅

**Configured in vercel.json**:

```json
{
  "app/api/**": { "maxDuration": 30 },
  "app/api/cron/**": { "maxDuration": 60 },
  "app/api/chat/**": { "maxDuration": 45 }
}
```

- Standard API routes: 30 seconds
- Cron jobs: 60 seconds
- Chat/AI routes: 45 seconds

---

### 6. URL Rewrites ✅

**Configured in vercel.json**:

| Source | Destination | Purpose |
|--------|-------------|---------|
| `/sitemap.xml` | `/api/sitemap` | Dynamic sitemap generation |
| `/robots.txt` | `/api/robots` | Dynamic robots.txt |

---

### 7. Build Verification ✅

**Latest Local Build**:
```
✅ Build Command: npm run build
✅ Routes Compiled: 218 pages
✅ Errors: 0
✅ Warnings: 0
✅ Build Time: ~18 seconds
✅ Output: .next/ directory generated successfully
```

**Git Status**:
```
✅ Branch: master
✅ Uncommitted Changes: 0
✅ Commits Ahead: 0 (fully synced with GitHub)
✅ Latest Commit: 5f007c1 (build warning fix)
```

---

## ⚠️ MANUAL VERCEL DASHBOARD CONFIGURATION REQUIRED

The following settings **MUST** be configured manually in the Vercel Dashboard (they cannot be set via `vercel.json`):

### 1. Git Integration Settings

**Location**: https://vercel.com/peoples-group/pgclosets-store/settings/git

**Required Configuration**:

| Setting | Value | Status |
|---------|-------|--------|
| Repository | `scaroll/pgclosets-store` | ⚠️ VERIFY |
| Production Branch | `master` | ⚠️ VERIFY (NOT "main") |
| Auto-Deploy | Enabled | ⚠️ VERIFY |
| Preview Deployments | Enabled for PRs | ⚠️ VERIFY |

**How to Verify**:
1. Navigate to Project → Settings → Git
2. Confirm "Repository" shows: `scaroll/pgclosets-store`
3. Confirm "Production Branch" is set to: `master` (NOT "main")
4. Ensure "Auto Deploy" toggle is **ON** for production branch
5. Ensure "Preview Deployments" toggle is **ON**

**If Git Integration is Missing**:
1. Click "Connect Git Repository"
2. Select GitHub
3. Search for `scaroll/pgclosets-store`
4. Click "Connect"
5. Set production branch to `master`

---

### 2. Environment Variables

**Location**: https://vercel.com/peoples-group/pgclosets-store/settings/environment-variables

**Required Environment Variables** (check your `.env.local` file):

#### Analytics
```bash
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"  # Google Analytics Measurement ID
```

#### Optional (Based on Your Application Needs)

Check `.env.local` (686 bytes) and `.env` (1,416 bytes) for any variables your app requires:

**Common Variables**:
- Database URLs (if using Supabase, PostgreSQL, etc.)
- API Keys (Stripe, Paddle, Resend, etc.)
- Third-party service tokens
- Feature flags

**Vercel Auto-Provided** (DO NOT ADD MANUALLY):
- `VERCEL_ENV` (production/preview/development)
- `VERCEL_URL` (deployment URL)
- `VERCEL_REGION` (iad1)
- `VERCEL_PROJECT_ID` (auto-set)
- `VERCEL_ORG_ID` (auto-set)

**How to Add Environment Variables**:
1. Navigate to Project → Settings → Environment Variables
2. Click "Add Variable"
3. Enter Name: `VARIABLE_NAME`
4. Enter Value: `variable_value`
5. Select Environments: ☑️ Production ☑️ Preview ☑️ Development
6. Click "Save"

⚠️ **Security**: Never commit `.env` or `.env.local` to git. Reference `.env.example` only.

---

### 3. Custom Domain Configuration

**Location**: https://vercel.com/peoples-group/pgclosets-store/settings/domains

**Required Domains**:

| Domain | Type | Status |
|--------|------|--------|
| `pgclosets.com` | Primary | ⚠️ VERIFY |
| `www.pgclosets.com` | Redirect or Alias | ⚠️ VERIFY |

**How to Configure**:
1. Navigate to Project → Settings → Domains
2. Click "Add Domain"
3. Enter: `pgclosets.com`
4. Click "Add"
5. Vercel will provide DNS records (A record or CNAME)
6. Add DNS records to your domain provider
7. Repeat for `www.pgclosets.com`
8. Set redirect: `www.pgclosets.com` → `pgclosets.com` (or vice versa)

**DNS Records** (provided by Vercel):
- **A Record**: `76.76.21.21` (or current Vercel IP)
- **CNAME Record**: `cname.vercel-dns.com`

**Verification**:
```bash
# Check DNS propagation
dig pgclosets.com +short
# Should show: 76.76.21.21 (or Vercel IP)

# Check HTTPS
curl -I https://www.pgclosets.com
# Should show: HTTP/2 200
```

---

### 4. Build & Development Settings

**Location**: https://vercel.com/peoples-group/pgclosets-store/settings/general

**Required Configuration**:

| Setting | Value | Status |
|---------|-------|--------|
| Framework Preset | Next.js | ✅ Auto-detected |
| Build Command | `npm run build` | ✅ From vercel.json |
| Install Command | `npm install --legacy-peer-deps` | ⚠️ **CRITICAL - VERIFY** |
| Output Directory | `.next` | ✅ From vercel.json |
| Node.js Version | 20.x | ⚠️ VERIFY (from package.json) |

⚠️ **CRITICAL**: Ensure "Install Command" is set to `npm install --legacy-peer-deps`

**If Override is Needed**:
1. Navigate to Project → Settings → General
2. Scroll to "Build & Development Settings"
3. Click "Override" on Install Command
4. Enter: `npm install --legacy-peer-deps`
5. Click "Save"

---

### 5. Cron Jobs (Pro/Enterprise Plan Only)

**Location**: https://vercel.com/peoples-group/pgclosets-store/settings/crons

**Note**: Cron jobs configured in `vercel.json` require a **Pro or Enterprise** Vercel plan.

If you have a Pro/Enterprise plan, verify these cron jobs are listed:

| Path | Schedule | Frequency |
|------|----------|-----------|
| `/api/cron/refresh-sitemap` | `0 2 * * *` | Daily 2 AM UTC |
| `/api/cron/reindex` | `0 3 * * 0` | Weekly Sunday 3 AM UTC |
| `/api/cron/warm-cache` | `*/30 * * * *` | Every 30 minutes |
| `/api/cron/ai-content-update` | `0 4 * * 1,4` | Mon & Thu 4 AM UTC |

**If on Hobby Plan**:
- Cron jobs in `vercel.json` are silently ignored
- No error will be shown
- Consider upgrading to Pro if cron functionality is required

---

## 🔍 DEPLOYMENT VERIFICATION CHECKLIST

After configuring the Vercel Dashboard settings above:

### Step 1: Trigger Deployment

**Option A: Push to GitHub**
```bash
# Make a trivial change to trigger deployment
echo "\n# Deployment trigger $(date)" >> README.md
git add README.md
git commit -m "chore: trigger Vercel deployment"
git push origin master
```

**Option B: Manual Deploy via CLI**
```bash
./verify-deployment-target.sh
./deploy-to-pgclosets.sh
```

**Option C: Redeploy in Dashboard**
1. Navigate to: https://vercel.com/peoples-group/pgclosets-store/deployments
2. Click on latest deployment
3. Click "Redeploy"

---

### Step 2: Monitor Deployment

**Watch Build Status**:
1. Visit: https://vercel.com/peoples-group/pgclosets-store/deployments
2. Look for new deployment (triggered by your push)
3. Expected status progression:
   - **Building** → Shows build logs in real-time
   - **Ready** → Deployment successful ✅

**NOT Expected**:
   - ❌ **Canceled** - Indicates ignoreCommand or auto-deploy disabled
   - ❌ **Error** - Build failed, check logs

**Build Duration**: ~2-5 minutes (218 routes to compile)

---

### Step 3: Verify Production Site

**HTTP Status Check**:
```bash
curl -I https://www.pgclosets.com
# Expected: HTTP/2 200
```

**Deployment ID Check**:
```bash
curl -sI https://www.pgclosets.com | grep x-vercel-id
# Should show new deployment ID with recent timestamp
```

**ETag Verification**:
```bash
curl -sI https://www.pgclosets.com | grep etag
# New deployment should have different ETag than previous
```

---

### Step 4: Smoke Test Key Pages

Visit these URLs and verify:

| Page | URL | Expected |
|------|-----|----------|
| Home | https://www.pgclosets.com | ✅ Loads, no errors |
| Products | https://www.pgclosets.com/products | ✅ Grid loads |
| Estimator | https://www.pgclosets.com/instant-estimate | ✅ Wizard works |
| Collection | https://www.pgclosets.com/collections/renin-barn-doors | ✅ Products load |
| PDP | https://www.pgclosets.com/products/[slug] | ✅ Details load |

**For Each Page**:
- ✅ Page loads without errors
- ✅ No console errors (open DevTools)
- ✅ Images load correctly
- ✅ Navigation works
- ✅ Meta tags present (view source)

---

### Step 5: Verify Latest Fixes

**ISSUE-011: Estimator UX Enhancements**
1. Visit: https://www.pgclosets.com/instant-estimate
2. Open wizard Step 2 (Dimensions)
3. Verify "Most Popular ⭐" indicator visible on 2-panel option
4. Verify "(Typical: 72"-96")" hint on width input
5. Verify "(Standard: 80")" hint on height input

**ISSUE-010: Error Boundary**
1. Open any page
2. Open React DevTools (browser extension)
3. Navigate component tree
4. Verify `<ErrorBoundary>` wrapper exists around app content

---

### Step 6: API Routes Health Check

```bash
# Health endpoint
curl https://www.pgclosets.com/api/health
# Expected: JSON response with status

# Sitemap (via rewrite)
curl -I https://www.pgclosets.com/sitemap.xml
# Expected: HTTP/2 200

# Robots (via rewrite)
curl https://www.pgclosets.com/robots.txt
# Expected: HTTP/2 200 with robots.txt content
```

---

## 📊 CONFIGURATION SUMMARY

### ✅ Completed (Local Files)

- ✅ vercel.json configured with all platform settings
- ✅ Project IDs aligned across 5 configuration files
- ✅ Security headers configured
- ✅ Cron jobs defined (if Pro/Enterprise plan)
- ✅ Function timeouts set
- ✅ URL rewrites configured
- ✅ Build tested locally (218 routes, 0 errors, 0 warnings)
- ✅ Git repository clean and synced
- ✅ Latest fixes committed and pushed

### ⚠️ Requires Manual Verification (Vercel Dashboard)

- ⚠️ Git integration connected to `scaroll/pgclosets-store`
- ⚠️ Production branch set to `master`
- ⚠️ Auto-deploy enabled
- ⚠️ Environment variables added
- ⚠️ Custom domains configured
- ⚠️ Install command override: `npm install --legacy-peer-deps`
- ⚠️ Cron jobs enabled (if Pro/Enterprise plan)

---

## 🚀 NEXT STEPS

1. **Verify Vercel Dashboard Settings** (15 minutes)
   - Git integration
   - Environment variables
   - Custom domains
   - Install command override

2. **Trigger Deployment** (2 minutes)
   - Push to master OR
   - Manual redeploy in dashboard

3. **Monitor Build** (2-5 minutes)
   - Watch deployment status
   - Check for "Ready" status

4. **Verify Production** (5 minutes)
   - Run smoke tests
   - Check API routes
   - Verify latest fixes deployed

5. **Confirm Auto-Deploy** (2 minutes)
   - Make trivial change
   - Push to master
   - Verify new deployment triggers automatically

---

**Configuration Verified**: October 9, 2025
**Status**: ✅ LOCAL COMPLETE - DASHBOARD VERIFICATION REQUIRED
**Next Action**: Verify Vercel Dashboard settings and trigger deployment
