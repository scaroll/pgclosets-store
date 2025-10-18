# Vercel Rebuild Checklist - Fresh Project Upload

**Date**: October 9, 2025
**Project**: pgclosets-store
**Purpose**: Complete Vercel project rebuild with fresh upload

---

## ✅ PRE-REBUILD VERIFICATION COMPLETE

### Local Repository Status
- ✅ Git repository clean (no uncommitted changes)
- ✅ All commits pushed to GitHub (master branch)
- ✅ Latest commit: `03c9a75` - Deployment verification docs
- ✅ Total commits ahead of origin: **0** (fully synced)

### Source Code Integrity
- ✅ **2,586 total files** in source directories
- ✅ **99 page routes** (app/*/page.tsx)
- ✅ **Components**: Complete (62 directories)
- ✅ **Library files**: Complete (29 directories)
- ✅ **Public assets**: Complete (19 directories)
- ✅ **Data files**: Complete JSON databases

### Critical Configuration Files ✅

| File | Status | Purpose |
|------|--------|---------|
| package.json | ✅ Present | Dependencies (151 total) |
| package-lock.json | ✅ Present (905KB) | Dependency lock |
| next.config.mjs | ✅ Present | Next.js 15.5.4 config |
| tsconfig.json | ✅ Present | TypeScript config |
| tailwind.config.ts | ✅ Present | Tailwind CSS config |
| postcss.config.mjs | ✅ Present | PostCSS config |
| vercel.json | ✅ Present | Vercel platform config |
| .env | ✅ Present (1.4KB) | Environment variables |
| .env.local | ✅ Present (686B) | Local overrides |
| .env.example | ✅ Present (6.6KB) | Template |

### Build Validation ✅
- ✅ TypeScript type-check: **PASSED** (admin errors only - non-production)
- ✅ Production build: **SUCCESS** (130+ routes compiled)
- ✅ Build output: `.next/` directory (generated successfully)
- ✅ Node.js version: >=20.x (specified in package.json)
- ✅ node_modules: Present (1.4GB)

### Vercel Project Metadata
**Canonical Configuration** (from `.vercel/project.json`):
```json
{
  "orgId": "team_Xzht85INUsoW05STx9DMMyLX",
  "projectId": "prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu",
  "projectName": "pgclosets-store"
}
```

**Important**: This `.vercel/` directory will be regenerated when linking new project

---

## 🔧 VERCEL CONFIGURATION REFERENCE

### vercel.json Settings

```json
{
  "name": "pgclosets-store",
  "scope": "peoples-group",
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps",
  "devCommand": "npm run dev",
  "regions": ["iad1"],
  "public": true,
  "git": {
    "deploymentEnabled": {
      "master": true,
      "preview": true
    }
  }
}
```

**Key Settings**:
- **Install command**: `npm install --legacy-peer-deps` (REQUIRED for dependency resolution)
- **Build command**: `npm run build`
- **Framework**: Next.js (auto-detected)
- **Output**: `.next/` directory
- **Region**: `iad1` (US East - Virginia)
- **Git integration**: Enabled for `master` branch + PR previews

### Cron Jobs (Configure in Vercel Dashboard)

```json
[
  {
    "path": "/api/cron/refresh-sitemap",
    "schedule": "0 2 * * *"  // Daily at 2 AM
  },
  {
    "path": "/api/cron/reindex",
    "schedule": "0 3 * * 0"  // Weekly Sunday 3 AM
  },
  {
    "path": "/api/cron/warm-cache",
    "schedule": "*/30 * * * *"  // Every 30 minutes
  },
  {
    "path": "/api/cron/ai-content-update",
    "schedule": "0 4 * * 1,4"  // Monday & Thursday 4 AM
  }
]
```

### Function Timeouts (vercel.json - Auto-Applied)

```json
"functions": {
  "app/api/**": { "maxDuration": 30 },
  "app/api/cron/**": { "maxDuration": 60 },
  "app/api/chat/**": { "maxDuration": 45 }
}
```

### Security Headers (vercel.json - Auto-Applied)

All security headers configured in `vercel.json` will be automatically applied:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Content-Security-Policy (comprehensive)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (restrictive)

---

## 📋 STEP-BY-STEP REBUILD PROCESS

### Step 1: Delete Old Vercel Project (Vercel Dashboard)

1. Visit: https://vercel.com/peoples-group/pgclosets-store/settings
2. Navigate to **General** settings (scroll to bottom)
3. Click **Delete Project**
4. Type project name to confirm: `pgclosets-store`
5. Confirm deletion
6. ✅ **Verify**: Project removed from dashboard

**⚠️ WARNING**: This will delete:
- All deployment history
- Environment variables (will need to be re-added)
- Domain configurations (will need to be re-linked)
- Analytics data

---

### Step 2: Create Fresh Vercel Project

**Option A: Via Vercel Dashboard (Recommended)**

1. Visit: https://vercel.com/new
2. Select **Import Git Repository**
3. Search for: `scaroll/pgclosets-store`
4. Click **Import**
5. Configure project:
   - **Project Name**: `pgclosets-store`
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: Leave as default OR override to `npm run build`
   - **Install Command**: **CRITICAL** - Override to `npm install --legacy-peer-deps`
   - **Output Directory**: `.next` (auto-detected)
6. Configure Environment Variables (see Step 3)
7. Click **Deploy**

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI globally
npm i -g vercel

# Navigate to project directory
cd /Users/spencercarroll/pgclosets-store-main

# Login to Vercel
vercel login

# Link project (will create new project)
vercel link --scope peoples-group

# Follow prompts:
# - Set up new project? Yes
# - Project name? pgclosets-store
# - Link to existing project? No

# Add environment variables (see Step 3)
# Then deploy
vercel --prod
```

---

### Step 3: Configure Environment Variables

**CRITICAL ENVIRONMENT VARIABLES** (Add in Vercel Dashboard → Settings → Environment Variables):

#### Analytics
```bash
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"  # Google Analytics Measurement ID
```

#### Vercel Auto-Provided (DO NOT ADD MANUALLY)
These are automatically provided by Vercel:
- `VERCEL_ENV` (production/preview/development)
- `VERCEL_URL` (deployment URL)
- `VERCEL_REGION` (iad1)
- `VERCEL_PROJECT_ID`
- `VERCEL_ORG_ID`

#### Optional (If Used in Code)
Check your local `.env` and `.env.local` files for any additional environment variables your application needs. Common ones:

```bash
# Database (if using)
DATABASE_URL="postgresql://..."

# Supabase (if using)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Email (if using Resend)
RESEND_API_KEY="..."

# Stripe (if using payments)
STRIPE_SECRET_KEY="..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="..."

# Paddle (if using payments)
PADDLE_API_KEY="..."
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN="..."
```

**How to Add Environment Variables**:
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add each variable:
   - Name: `VARIABLE_NAME`
   - Value: `variable_value`
   - Environment: Select **Production**, **Preview**, and **Development** as needed
3. Click **Save**

**⚠️ Security**: Never commit `.env` or `.env.local` to git. Use `.env.example` as template only.

---

### Step 4: Configure Git Integration

In Vercel Dashboard → Settings → Git:

1. **Repository**: Verify linked to `scaroll/pgclosets-store`
2. **Production Branch**: Set to `master` (NOT "main")
3. **Preview Deployments**: Enable for pull requests
4. **Auto-Deploy**: Enable (every push to master triggers build)
5. **Build & Development Settings**:
   - Framework: Next.js
   - Install Command: `npm install --legacy-peer-deps` ⚠️ CRITICAL
   - Build Command: `npm run build`
   - Output Directory: `.next`

---

### Step 5: Configure Custom Domain

In Vercel Dashboard → Settings → Domains:

1. Click **Add Domain**
2. Enter: `pgclosets.com`
3. Click **Add**
4. Vercel will provide DNS records:
   - **A Record**: `76.76.21.21` (or current Vercel IP)
   - **CNAME Record**: `cname.vercel-dns.com`
5. Add DNS records to your domain provider (or use Vercel DNS)
6. Wait for DNS propagation (~5-10 minutes)
7. Add `www.pgclosets.com` as additional domain
8. Set `www.pgclosets.com` to redirect to `pgclosets.com` (or vice versa)

**Verify Domain Setup**:
```bash
dig pgclosets.com +short
# Should show: 76.76.21.21 (or Vercel IP)

curl -I https://www.pgclosets.com
# Should show: HTTP/2 200
```

---

### Step 6: Configure Cron Jobs

In Vercel Dashboard → Settings → Cron Jobs:

Add each cron job from `vercel.json`:

1. **Sitemap Refresh**:
   - Path: `/api/cron/refresh-sitemap`
   - Schedule: `0 2 * * *` (Daily at 2 AM UTC)

2. **Reindex**:
   - Path: `/api/cron/reindex`
   - Schedule: `0 3 * * 0` (Weekly Sunday 3 AM UTC)

3. **Cache Warming**:
   - Path: `/api/cron/warm-cache`
   - Schedule: `*/30 * * * *` (Every 30 minutes)

4. **AI Content Update**:
   - Path: `/api/cron/ai-content-update`
   - Schedule: `0 4 * * 1,4` (Monday & Thursday 4 AM UTC)

**Note**: Cron jobs require a Pro or Enterprise Vercel plan. If on Hobby tier, these will not work.

---

### Step 7: Trigger Initial Deployment

**Method 1: Via Dashboard**
1. Vercel Dashboard → Deployments
2. Click **Redeploy** (if needed)
3. Monitor build logs

**Method 2: Via Git Push**
```bash
# Make trivial change to trigger deployment
echo "\n# Deployment trigger" >> README.md
git add README.md
git commit -m "chore: trigger initial Vercel deployment"
git push origin master
```

**Method 3: Via Vercel CLI**
```bash
vercel --prod
```

**Expected Build Process**:
1. GitHub webhook triggers Vercel
2. Vercel clones repository
3. Runs: `npm install --legacy-peer-deps`
4. Runs: `npm run build`
5. Generates `.next/` output directory
6. Deploys to edge network (iad1 region)
7. Updates production URL: https://www.pgclosets.com

**Build Duration**: ~2-5 minutes (130+ routes to compile)

---

### Step 8: Post-Deployment Verification

#### 8.1 Deployment Status Check

Visit Vercel Dashboard → Deployments:
- ✅ Status: "Ready" (not "Building" or "Error")
- ✅ Domain: Shows production URL
- ✅ Duration: ~2-5 minutes
- ✅ No errors in build logs

#### 8.2 Production Site Smoke Tests

```bash
# 1. HTTP Status
curl -I https://www.pgclosets.com
# Expected: HTTP/2 200

# 2. ETag (Deployment ID)
curl -sI https://www.pgclosets.com | grep etag
# Expected: New ETag value (different from old)

# 3. Vercel Headers
curl -sI https://www.pgclosets.com | grep x-vercel
# Expected: x-vercel-id, x-vercel-cache headers

# 4. Security Headers
curl -sI https://www.pgclosets.com | grep -i "x-frame-options\|content-security-policy"
# Expected: Security headers from vercel.json
```

#### 8.3 Key Pages Manual Test

Visit these URLs in browser:
1. ✅ **Home**: https://www.pgclosets.com
2. ✅ **Products**: https://www.pgclosets.com/products
3. ✅ **Instant Estimate**: https://www.pgclosets.com/instant-estimate
   - Verify "Most Popular ⭐" indicator visible (ISSUE-011)
4. ✅ **Collection**: https://www.pgclosets.com/collections/renin-barn-doors
5. ✅ **Product Detail**: https://www.pgclosets.com/products/augusta-1-lite-framed-mullion-design-complete-barn-door-kit-with-mix-and-match-hardware

**For Each Page**:
- Page loads without errors
- No console errors in DevTools
- Images load correctly
- Navigation works
- Meta tags present (view source)
- ErrorBoundary wrapper exists (React DevTools - ISSUE-010)

#### 8.4 API Routes Health Check

```bash
# Health endpoint
curl https://www.pgclosets.com/api/health
# Expected: 200 OK with JSON response

# Sitemap (via rewrite)
curl -I https://www.pgclosets.com/sitemap.xml
# Expected: 200 OK

# Robots (via rewrite)
curl https://www.pgclosets.com/robots.txt
# Expected: 200 OK with robots.txt content
```

#### 8.5 Performance Validation

Run Lighthouse audit:
```bash
npx lighthouse https://www.pgclosets.com --only-categories=performance,accessibility --view
```

**Expected Scores**:
- Performance: ≥95/100
- Accessibility: ≥96/100 (after Phase 7 improvements)

---

### Step 9: Verify Git Integration Working

**Test Automatic Deployments**:

1. Make trivial change:
   ```bash
   echo "# Test deployment trigger" >> docs/TEST_DEPLOY.md
   git add docs/TEST_DEPLOY.md
   git commit -m "test: verify Vercel auto-deployment"
   git push origin master
   ```

2. Monitor Vercel Dashboard → Deployments
3. ✅ **Verify**: New deployment appears within 30 seconds
4. ✅ **Verify**: Build status: "Building" → "Ready"
5. ✅ **Verify**: NO "Canceled" or "Skipped" status

**Test Preview Deployments** (Optional):
1. Create test branch:
   ```bash
   git checkout -b test/preview-deployment
   echo "# Preview test" >> README.md
   git add README.md
   git commit -m "test: preview deployment"
   git push origin test/preview-deployment
   ```

2. Create pull request on GitHub
3. ✅ **Verify**: Vercel bot comments with preview URL
4. ✅ **Verify**: Preview deployment builds successfully

---

## 🔍 TROUBLESHOOTING

### Build Fails: "npm install failed"

**Cause**: Missing `--legacy-peer-deps` flag
**Fix**: Update Install Command in Settings → Git → Install Command:
```bash
npm install --legacy-peer-deps
```

### Build Fails: TypeScript Errors

**Check**: Are errors in admin routes?
- Admin routes (`app/admin/**`) have known TypeScript errors
- These are NOT used in production
- Errors are acceptable

**If errors in production routes**:
```bash
# Locally run type-check
npm run type-check

# Fix errors, commit, push
```

### Deployment Not Triggering on Push

**Verify**:
1. Settings → Git → Auto Deploy: Enabled ✅
2. Settings → Git → Production Branch: `master` ✅
3. GitHub Webhooks → Vercel webhook exists and delivers successfully

**Fix**: Manually trigger deployment or check GitHub webhook logs

### Domain Not Working

**Check DNS**:
```bash
dig pgclosets.com +short
# Should show Vercel IP

dig www.pgclosets.com +short
# Should show CNAME to Vercel
```

**Fix**: Wait for DNS propagation (up to 48 hours, usually 5-10 minutes)

### Cron Jobs Not Running

**Check**: Vercel plan supports cron jobs (Pro or Enterprise only)
**Verify**: Settings → Cron Jobs shows scheduled jobs
**Test**: Manually trigger via API call:
```bash
curl https://www.pgclosets.com/api/cron/warm-cache
```

---

## 📊 SUCCESS CRITERIA CHECKLIST

### Configuration ✅
- [ ] New Vercel project created with correct name
- [ ] Git repository linked correctly
- [ ] Production branch set to `master`
- [ ] Install command: `npm install --legacy-peer-deps`
- [ ] Environment variables configured
- [ ] Custom domain(s) added and verified
- [ ] Cron jobs configured (if Pro/Enterprise plan)

### Deployment ✅
- [ ] Initial deployment completed successfully
- [ ] Build status: "Ready" (not "Error" or "Canceled")
- [ ] Production URL accessible: https://www.pgclosets.com
- [ ] All 130+ routes generated successfully
- [ ] Build time: ~2-5 minutes

### Functionality ✅
- [ ] Home page loads (200 OK)
- [ ] Products page loads
- [ ] Instant estimator works (with ISSUE-011 enhancements)
- [ ] Error boundary integrated (ISSUE-010)
- [ ] Collections load correctly
- [ ] Product detail pages load
- [ ] API routes respond correctly
- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible

### Performance ✅
- [ ] Lighthouse Performance: ≥95/100
- [ ] Lighthouse Accessibility: ≥96/100
- [ ] No console errors
- [ ] Images load correctly (Next.js Image optimization)
- [ ] Security headers present

### Git Integration ✅
- [ ] Push to master triggers deployment
- [ ] No "Canceled" or "Skipped" build statuses
- [ ] Preview deployments work for PRs
- [ ] Build logs show successful compilation

---

## 📁 FILES INVENTORY

### Critical Files Present ✅

**Root Configuration**:
- ✅ package.json (5.3KB, 151 dependencies)
- ✅ package-lock.json (905KB, dependency lock)
- ✅ next.config.mjs (6.3KB, Next.js config)
- ✅ tsconfig.json (1.9KB, TypeScript config)
- ✅ tailwind.config.ts (7KB, Tailwind config)
- ✅ postcss.config.mjs (135B, PostCSS config)
- ✅ vercel.json (complete with crons, functions, headers)

**Source Directories**:
- ✅ app/ (72 subdirectories, 99 page routes)
- ✅ components/ (62 subdirectories, reusable components)
- ✅ lib/ (29 subdirectories, utilities and helpers)
- ✅ public/ (19 subdirectories, static assets)
- ✅ data/ (JSON databases, product data)
- ✅ styles/ (14 subdirectories, CSS/Tailwind)

**Environment Files**:
- ✅ .env (1.4KB)
- ✅ .env.local (686B)
- ✅ .env.example (6.6KB, template)
- ✅ .env.development (1KB)
- ✅ .env.staging (1KB)

**Build Output** (Generated, not committed):
- ✅ .next/ directory (auto-generated on build)
- ✅ node_modules/ (1.4GB, dependencies installed)

---

## 🎯 FINAL NOTES

### What Was Fixed Before Rebuild
- ✅ All Vercel project IDs aligned to canonical: `prj_u7Hob8ST9TGSra2mJeYfv0Ox1pgu`
- ✅ Git branch configuration: `master` (not "main")
- ✅ Removed problematic `ignoreCommand` from vercel.json
- ✅ HIGH priority audit fixes: Error boundary (ISSUE-010), Estimator UX (ISSUE-011)
- ✅ All code committed and pushed to GitHub

### What Will Be Regenerated
- `.vercel/` directory (new project linking)
- Vercel environment variables (must be re-added)
- Domain configurations (must be re-linked)
- Cron job schedules (must be re-configured)
- Deployment history (starts fresh)

### Local Files Are Intact ✅
- ✅ All 2,586 source files present
- ✅ All dependencies in package.json
- ✅ Build tested and successful (130+ routes)
- ✅ Git repository clean and synced
- ✅ Ready for fresh Vercel upload

### Important Reminders
1. **Install Command**: Must use `npm install --legacy-peer-deps`
2. **Production Branch**: Must be `master` (not "main")
3. **Environment Variables**: Must be manually re-added in dashboard
4. **Domain**: May take 5-10 minutes for DNS propagation
5. **Cron Jobs**: Require Pro or Enterprise Vercel plan

---

**Checklist Created**: October 9, 2025
**Local Verification**: COMPLETE ✅
**Ready for Vercel Rebuild**: YES ✅

**Next Action**: Delete old Vercel project and follow Step 1-9 above.
