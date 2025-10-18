# PG Closets Production Deployment Guide

**Quick Start:** Run `./deploy-pgclosets.sh` for automated deployment

---

## 📋 Pre-Deployment Checklist

### 1. Environment Setup

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Authenticate with Vercel
```bash
vercel login
```

#### Verify Authentication
```bash
vercel whoami
# Should show: spencer.carroll@example.com (or your Vercel account)
```

### 2. Verify Build

```bash
# Clean previous builds
rm -rf .next

# Install dependencies
npm ci --legacy-peer-deps

# Build for production
npm run build
```

Expected output: ✅ Build completes with 156 static routes

### 3. Run Integration Verification

```bash
./verify-integration.sh
```

All checks should pass before deploying.

---

## 🚀 Deployment Methods

### Method 1: Automated Script (Recommended)

```bash
# Make script executable (first time only)
chmod +x deploy-pgclosets.sh

# Deploy to production
./deploy-pgclosets.sh
```

**What it does:**
1. Validates prerequisites
2. Checks template files
3. Restores production configs
4. Runs production build
5. Deploys to Vercel
6. Opens deployed site

### Method 2: Manual Vercel CLI

```bash
# Link to project (first time only)
vercel link
# Select: team_Xzht85INUsoW05STx9DMMyLX
# Select: prj_ySW3kS1J66EbmuWRC6q6QN3gww6w

# Deploy to production
vercel --prod
```

### Method 3: Git-based Auto-Deploy

```bash
# Commit all changes
git add .
git commit -m "feat: Production deployment"

# Push to main branch
git push origin main
```

Vercel will automatically deploy when main branch is updated.

---

## 🔧 Environment Variables

### Required Variables

Configure these in Vercel Dashboard → Settings → Environment Variables:

#### Database (if using)
```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
```

#### Stripe Integration
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### Email Configuration
```bash
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@pgclosets.com"
```

#### Analytics (Optional)
```bash
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"
```

#### Site Configuration
```bash
NEXT_PUBLIC_SITE_URL="https://www.pgclosets.com"
NEXT_PUBLIC_API_URL="https://www.pgclosets.com/api"
```

### Setting Environment Variables

#### Via Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select PG Closets project
3. Go to Settings → Environment Variables
4. Add each variable
5. Select environment: Production, Preview, Development
6. Click "Save"

#### Via Vercel CLI
```bash
vercel env add VARIABLE_NAME
# Enter value when prompted
# Select environment: production
```

---

## 🌐 Domain Configuration

### Primary Domain
- **Production:** https://www.pgclosets.com
- **Project ID:** prj_ySW3kS1J66EbmuWRC6q6QN3gww6w
- **Team:** team_Xzht85INUsoW05STx9DMMyLX

### DNS Configuration

Ensure these DNS records are set:

```
Type    Name    Value                           TTL
A       @       76.76.21.21                     Auto
CNAME   www     cname.vercel-dns.com            Auto
```

### SSL Certificate
- ✅ Auto-provisioned by Vercel
- ✅ Auto-renewed
- ✅ Supports HTTPS redirect

---

## 📦 Build Configuration

### Next.js Configuration

The project uses `next.config.mjs` with these optimizations:

```javascript
{
  // Performance
  compiler: {
    removeConsole: true  // Production only
  },

  // Images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000
  },

  // Security headers
  headers: [
    // CSP, HSTS, X-Frame-Options, etc.
  ]
}
```

### Build Scripts

```json
{
  "build": "next build",
  "start": "next start",
  "analyze": "ANALYZE=true npm run build"
}
```

---

## 🧪 Testing Deployment

### Pre-Deployment Tests

```bash
# 1. Build test
npm run build && npm start

# 2. Visit localhost
open http://localhost:3000

# 3. Check key pages
# - Homepage: /
# - Products: /products
# - Product detail: /products/euro-1-lite-bypass
# - Cart: /cart
# - Contact: /contact
```

### Post-Deployment Tests

#### Automated Checks
```bash
# Run verification
./verify-integration.sh

# Check sitemap
curl https://www.pgclosets.com/sitemap.xml

# Check robots.txt
curl https://www.pgclosets.com/robots.txt
```

#### Manual Checks
- [ ] Homepage loads
- [ ] Navigation works
- [ ] Product pages display
- [ ] Images load correctly
- [ ] Forms submit
- [ ] Mobile responsive
- [ ] SSL certificate valid
- [ ] Analytics tracking

#### Performance Checks
```bash
# Lighthouse CLI
npx lighthouse https://www.pgclosets.com --view

# Check Core Web Vitals in Vercel dashboard
# Performance → Web Vitals
```

---

## 🐛 Troubleshooting

### Build Fails

#### Error: "Module not found"
```bash
# Solution: Clean install dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

#### Error: "Type error"
```bash
# Solution: Check TypeScript configuration
npm run type-check

# Fix any type errors, then rebuild
npm run build
```

### Deployment Fails

#### Error: "Not authenticated"
```bash
# Solution: Re-authenticate
vercel login
vercel whoami
```

#### Error: "Missing environment variables"
```bash
# Solution: Add required variables in Vercel dashboard
# Settings → Environment Variables
```

### Runtime Errors

#### 500 Internal Server Error
1. Check Vercel logs: Dashboard → Deployments → [Latest] → Logs
2. Check error tracking
3. Verify environment variables
4. Check database connection (if applicable)

#### Images Not Loading
1. Verify image domains in `next.config.mjs`
2. Check image URLs are correct
3. Verify CDN/blob storage access

---

## 📊 Monitoring & Analytics

### Vercel Dashboard
- **URL:** https://vercel.com/dashboard
- **Metrics:**
  - Deployment status
  - Build logs
  - Runtime logs
  - Web Vitals
  - Function metrics

### Google Analytics
```javascript
// Already configured in app/layout.tsx
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Error Tracking

Monitor errors in:
1. Vercel Runtime Logs
2. Browser console (for client errors)
3. Custom error boundary (if implemented)

---

## 🔄 Rollback Procedure

### Immediate Rollback

#### Via Vercel Dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

#### Via CLI
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

### Revert Git Changes
```bash
# Find commit to revert to
git log --oneline

# Revert to specific commit
git revert [commit-hash]
git push origin main
```

---

## 🔒 Security Checklist

### Pre-Deployment
- [ ] No secrets in code
- [ ] Environment variables in Vercel only
- [ ] No API keys in frontend
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] Security headers set

### Post-Deployment
- [ ] SSL certificate valid
- [ ] Security headers present (check with securityheaders.com)
- [ ] No console logs in production
- [ ] No debug endpoints exposed
- [ ] Rate limiting configured (if applicable)

---

## 📈 Performance Optimization

### Current Performance Targets

#### Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

#### Build Stats
- **Total Routes:** 156
- **First Load JS:** 102 kB (shared)
- **Largest Page:** ~191 kB (including shared)

### Monitoring Performance

```bash
# Local performance check
npm run analyze

# Bundle analysis
npm run analyze-bundle
```

### Optimization Checklist
- [x] Image optimization (AVIF/WebP)
- [x] Code splitting
- [x] Tree shaking
- [x] Static generation (156 routes)
- [x] Font optimization
- [x] Package import optimization
- [x] Console removal in production

---

## 🚦 Deployment Status Indicators

### Build Status
```bash
✅ Successful: Build completed, ready to deploy
⚠️  Warning: Build succeeded with warnings (review logs)
❌ Failed: Build errors, deployment blocked
```

### Deployment Status
```bash
✅ Ready: Deployment live and accessible
🔄 Building: Currently building
⏸️  Queued: Waiting to build
❌ Error: Deployment failed
```

---

## 📞 Support & Resources

### Documentation
- **Integration Status:** `INTEGRATION_STATUS.md`
- **Performance Report:** `PERFORMANCE_OPTIMIZATION_REPORT.md`
- **Mobile Guide:** `MOBILE_IMPLEMENTATION_GUIDE.md`
- **SEO Guide:** `SEO_IMPLEMENTATION.md`

### External Resources
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs
- **React Docs:** https://react.dev

### Getting Help
1. Check Vercel logs first
2. Review error messages
3. Check documentation
4. Contact Vercel support (if needed)

---

## 🎯 Post-Deployment Tasks

### Immediate (Day 1)
- [ ] Verify deployment successful
- [ ] Test all critical paths
- [ ] Monitor error logs
- [ ] Check Core Web Vitals
- [ ] Verify analytics tracking

### Short-term (Week 1)
- [ ] Monitor performance metrics
- [ ] Review user feedback
- [ ] Check conversion rates
- [ ] Optimize based on data
- [ ] Document any issues

### Long-term (Month 1)
- [ ] Performance review
- [ ] SEO ranking check
- [ ] User behavior analysis
- [ ] Plan optimizations
- [ ] Schedule updates

---

## ✅ Final Deployment Steps

### Quick Deployment (5 minutes)

```bash
# 1. Verify build
npm run build

# 2. Run verification
./verify-integration.sh

# 3. Deploy
./deploy-pgclosets.sh

# 4. Verify deployment
curl -I https://www.pgclosets.com
```

### Expected Result

```
✅ Build completed successfully
✅ All tests passed
✅ Deployment successful
✅ Site accessible at https://www.pgclosets.com

Next steps:
1. Monitor Vercel dashboard
2. Check analytics
3. Review error logs
4. Test critical functionality
```

---

**Last Updated:** 2025-10-04
**Project:** PG Closets E-commerce
**Framework:** Next.js 15.5.4
**Platform:** Vercel

🚀 **Ready to Deploy!**
