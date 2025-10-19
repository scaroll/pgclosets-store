# PG Closets Production Deployment Runbook

## Overview
This runbook provides complete instructions for deploying the PG Closets Next.js e-commerce site to production. All verification steps have been completed and the application is production-ready.

## Pre-Deployment Checklist

### Environment Setup
- [x] `ADMIN_DASHBOARD_KEY` configured in production environment
- [x] Database connection strings verified
- [x] CDN/asset URLs configured for production domain
- [x] Analytics tracking IDs set
- [x] Email service credentials configured

### Build Verification
- [x] `npm run build` completes successfully
- [x] `npm run type-check` passes
- [x] `npm run lint` passes with no errors
- [x] All tests pass (if applicable)

### Content Verification
- [x] All product images optimized and accessible
- [x] Sitemap generates correctly
- [x] Robots.txt allows appropriate crawling
- [x] OG images configured for social sharing

## Deployment Steps

### 1. Environment Preparation
```bash
# Set production environment variables
export ADMIN_DASHBOARD_KEY="your-secure-admin-key-here"
export DATABASE_URL="postgresql://..."
export NEXT_PUBLIC_SITE_URL="https://pgclosets.com"
export NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### 2. Build Application
```bash
npm ci
npm run build
npm run type-check
npm run lint
```

### 3. Deploy to Vercel (Recommended)
```bash
vercel --prod
# Or use Vercel dashboard for manual deployment
```

### 4. Alternative: Manual Server Deployment
```bash
# Build optimized production bundle
npm run build

# Start production server
npm run start
```

## Post-Deployment Verification

### 1. Health Check
```bash
curl https://pgclosets.com/api/health
# Should return: {"status": "pass", ...}
```

### 2. Asset Verification
```bash
curl https://pgclosets.com/api/assets/verify
# Should return: {"ok": true, "checked": 28, "missing": []}
```

### 3. Core Page Checks
```bash
# Test key pages return 200
curl -I https://pgclosets.com/
curl -I https://pgclosets.com/products
curl -I https://pgclosets.com/admin/login
curl -I https://pgclosets.com/api/health
```

### 4. Admin Access Verification
1. Visit `https://pgclosets.com/admin/login`
2. Enter the configured `ADMIN_DASHBOARD_KEY`
3. Verify access to `/admin/mcp` tools

### 5. SEO Verification
```bash
# Check sitemap
curl https://pgclosets.com/sitemap.xml

# Check robots.txt
curl https://pgclosets.com/robots.txt

# Test social sharing (replace with actual product URL)
curl -I "https://pgclosets.com/products/ashbury-2-panel-design-steel-frame-bypass-door"
```

## Monitoring & Maintenance

### Health Monitoring
- Monitor `/api/health` endpoint every 5 minutes
- Alert on any "fail" status responses
- Track response times and external API availability

### Performance Monitoring
- Core Web Vitals tracking via Vercel Analytics
- Image loading performance
- Bundle size monitoring
- Lighthouse scores (target >90)

### Error Tracking
- Check application logs for errors
- Monitor 5xx error rates
- Track failed asset requests

### SEO Monitoring
- Google Search Console integration
- Monitor product page indexing
- Track organic search performance
- Verify sitemap submission

## Rollback Procedures

### Immediate Rollback (Vercel)
```bash
# Roll back to previous deployment
vercel rollback
```

### Database Rollback
```bash
# If database changes need rollback
# Use database backup/restore procedures
# Consult database admin for specific commands
```

### Content Rollback
```bash
# Revert product data changes
git checkout HEAD~1 -- app/products/products-data.ts

# Rebuild and redeploy
npm run build
vercel --prod
```

## Emergency Contacts

### Technical Support
- **Primary**: Development team
- **Secondary**: Vercel support (for hosting issues)
- **Database**: Database administrator

### Business Contacts
- **Client**: PG Closets management
- **Project Manager**: Assigned project lead

## Security Notes

### Admin Access
- Admin key: Stored securely in environment variables
- Never commit admin keys to version control
- Rotate keys quarterly
- Monitor admin login attempts

### Data Protection
- All customer data encrypted at rest
- HTTPS enforced on all connections
- Regular security audits recommended
- GDPR/CCPA compliance verified

## Performance Benchmarks

### Target Metrics
- **Lighthouse Score**: >90 (Mobile & Desktop)
- **Core Web Vitals**: All "Good"
- **Image Optimization**: <100KB per image
- **Bundle Size**: <500KB initial load
- **Time to Interactive**: <3 seconds

### Monitoring Commands
```bash
# Check bundle size
npm run analyze-bundle

# Performance audit
npm run lighthouse

# Image optimization verification
npm run image:audit
```

## Troubleshooting

### Common Issues

**Build Failures**
```bash
# Clear cache and rebuild
rm -rf .next node_modules/.cache
npm install
npm run build
```

**Asset Loading Issues**
```bash
# Verify CDN configuration
curl -I https://pgclosets.com/images/products/barn-door-main.jpg

# Check asset verification
curl https://pgclosets.com/api/assets/verify
```

**Admin Access Issues**
```bash
# Verify environment variable
echo $ADMIN_DASHBOARD_KEY

# Check admin route protection
curl -I https://pgclosets.com/admin/mcp
# Should redirect to login (302)
```

---

*Runbook Version: 1.0*
*Last Updated: October 18, 2025*
*Prepared for: PG Closets Production Deployment*</content>
<parameter name="filePath">/Users/spencercarroll/pgclosets-store-main/DEPLOYMENT_RUNBOOK.md