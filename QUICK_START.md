# 🚀 PG Closets Quick Start

**Ready to deploy in 5 minutes!**

---

## Prerequisites

✅ Node.js 20.x installed
✅ npm installed
✅ Vercel CLI installed: `npm install -g vercel`
✅ Authenticated with Vercel: `vercel login`

---

## Deploy Now (3 Commands)

```bash
# 1. Build the project
npm run build

# 2. Verify integration
./verify-integration.sh

# 3. Deploy to production
./deploy-pgclosets.sh
```

**That's it!** Your site will be live at https://www.pgclosets.com

---

## What Happens

### Command 1: Build (`npm run build`)
- Compiles 156 static routes
- Optimizes images (AVIF/WebP)
- Bundles JavaScript (102KB shared)
- Generates sitemap and metadata
- Takes ~7-10 seconds

### Command 2: Verify (`./verify-integration.sh`)
- Checks project structure
- Verifies components
- Validates build artifacts
- Confirms configuration
- Checks deployment readiness

### Command 3: Deploy (`./deploy-pgclosets.sh`)
- Restores production configs
- Runs final build
- Deploys to Vercel
- Opens live site
- Takes ~2-3 minutes

---

## Environment Variables

Before deploying, set these in Vercel Dashboard:

### Required
```bash
NEXT_PUBLIC_SITE_URL="https://www.pgclosets.com"
```

### Optional (for full functionality)
```bash
DATABASE_URL="postgresql://..."              # If using database
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..." # For payments
STRIPE_SECRET_KEY="sk_..."                   # For payments
SMTP_HOST="smtp.gmail.com"                   # For contact forms
SMTP_USER="your-email@gmail.com"             # For contact forms
SMTP_PASS="your-app-password"                # For contact forms
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"             # For analytics
```

**Set via:** Vercel Dashboard → Settings → Environment Variables

---

## Post-Deployment

### Verify Deployment
```bash
# Check site is live
curl -I https://www.pgclosets.com

# Should return: HTTP/2 200
```

### Test Critical Paths
- [ ] Homepage: https://www.pgclosets.com
- [ ] Products: https://www.pgclosets.com/products
- [ ] Product Detail: https://www.pgclosets.com/products/euro-1-lite-bypass
- [ ] Cart: https://www.pgclosets.com/cart
- [ ] Contact: https://www.pgclosets.com/contact

### Monitor
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Check logs** for any errors
- **Monitor Web Vitals** in Performance tab
- **Verify analytics** are tracking

---

## Common Issues

### Build Fails
```bash
# Clean install
rm -rf node_modules .next
npm install --legacy-peer-deps
npm run build
```

### Deployment Fails
```bash
# Re-authenticate
vercel login
vercel whoami

# Try again
./deploy-pgclosets.sh
```

### Site Not Loading
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Check domain DNS settings
4. Wait 2-3 minutes for DNS propagation

---

## Need Help?

📖 **Detailed Guides:**
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `INTEGRATION_STATUS.md` - Integration details
- `INTEGRATION_COMPLETE.md` - Full summary

🔧 **Troubleshooting:**
- Check Vercel logs: Dashboard → Deployments → [Latest] → Logs
- Run verification: `./verify-integration.sh`
- Review build output: `npm run build`

📊 **Documentation:**
- Performance: `PERFORMANCE_OPTIMIZATION_REPORT.md`
- Mobile: `MOBILE_IMPLEMENTATION_GUIDE.md`
- SEO: `SEO_IMPLEMENTATION.md`

---

## Success Indicators

After deployment, you should see:

✅ Build completes in ~7-10 seconds
✅ Verification script passes all checks
✅ Deployment succeeds in ~2-3 minutes
✅ Site accessible at https://www.pgclosets.com
✅ SSL certificate valid (green padlock)
✅ 156 routes working correctly
✅ Images loading (AVIF/WebP formats)
✅ Mobile responsive
✅ Core Web Vitals in green

---

## Project Info

- **Framework:** Next.js 15.5.4
- **Node:** 20.x
- **Routes:** 156
- **Components:** 50+
- **Build Size:** 102KB shared JS
- **Performance:** Optimized for Core Web Vitals

---

🎉 **Ready to launch the PG Closets platform!**

Deploy now with: `./deploy-pgclosets.sh`
