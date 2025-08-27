# PG Closets Production Deployment Guide

## 🎯 **What It Does**

- **Purpose:** Always deploys the PG Closets site to Vercel production.
- **Validation:** Runs pre-deploy checks and stops on any error (`set -euo pipefail`).
- **Config restore:** Reinstates production files before deploy:
  - `.vercel/project.json` with the PG Closets project binding
  - `public/robots.txt` targeting `pgclosets.com`
  - `public/sitemap.xml` with production URLs
- **Build:** Runs the Next.js production build and verifies success.
- **Deploy:** Pushes directly to Vercel production using hardcoded identifiers.
- **Post-deploy:** Opens the live site in a browser on success.

## 🔑 **Identifiers**

- **Project ID:** `prj_ySW3kS1J66EbmuWRC6q6QN3gww6w`
- **Team:** `team_Xzht85INUsoW05STx9DMMyLX`
- **Domain:** `https://www.pgclosets.com`

## 🚀 **How To Run**

### Option 1: Direct Script Execution
```bash
./deploy-pgclosets.sh
```

### Option 2: NPM Commands
```bash
npm run deploy
# or
npm run deploy-pgclosets
```

### Option 3: Node.js Helper
```bash
node deploy.js
```
*(Wraps the same deployment flow)*

## 🛡️ **Safety & Guarantees**

- **Production-only:** Hardcoded to target the live PG Closets project.
- **Fail-fast:** Aborts on failed validation or build (`set -euo pipefail`).
- **Self-healing:** Ensures production configs are correct before deploying.
- **Comprehensive validation:** Multi-stage safety checks before any deployment action.
- **Atomic operations:** Each step validates before proceeding to the next.

## 📋 **Prerequisites**

### Required Tools
- **Vercel CLI:** Installed and authenticated (`vercel login`).
- **Node.js:** Version 18+ for Next.js build process.
- **NPM:** For dependency management and build execution.

### Authentication Setup
```bash
# Install Vercel CLI globally
npm install -g vercel

# Authenticate with Vercel
vercel login

# Verify authentication
vercel whoami
```

### Repository Context
- **Location:** Run from the PG Closets project directory.
- **Required files:** Must have `package.json`, `public/` directory, and template files present.

## 🔧 **Deployment Process Details**

### Phase 1: Prerequisite Validation
- ✅ Verify correct project directory
- ✅ Check Vercel CLI installation and authentication
- ✅ Validate package.json build script exists
- ✅ Confirm project identity (pgclosets references)

### Phase 2: Pre-deployment Validation Checks
- ✅ Ensure production template files exist:
  - `templates/prod/.vercel/project.json`
  - `templates/prod/public/robots.txt`
  - `templates/prod/public/sitemap.xml`
- ✅ Validate template content contains production URLs
- ✅ Verify pgclosets.com references in SEO files

### Phase 3: Restore Essential Production Configuration Files
- 🔧 Create `.vercel/` directory if needed
- 🔧 Copy production project binding to `.vercel/project.json`
- 🔧 Restore `public/robots.txt` with pgclosets.com targeting
- 🔧 Restore `public/sitemap.xml` with production URLs
- ✅ Verify all restoration operations succeeded

### Phase 4: Build Next.js Project
- 📦 Install dependencies with `npm ci --legacy-peer-deps`
- 🏗️ Execute `npm run build` for production build
- ✅ Verify `.next/` build artifacts exist
- ✅ Ensure build completed without errors

### Phase 5: Deploy to Vercel Production
- 🔄 Pull latest production environment settings
- 🚀 Deploy with explicit production flags:
  - `vercel deploy --prod --confirm`
  - `--scope="team_Xzht85INUsoW05STx9DMMyLX"`
- ✅ Verify deployment URL returned successfully

### Phase 6: Post-deployment Actions
- 🌐 Verify deployment accessibility
- 🖥️ Auto-open site in default browser (if available)
- ✅ Complete deployment verification

## 📁 **Required File Structure**

```
pgclosets-store/
├── package.json                           # Must contain build script
├── public/                                # Public assets directory
├── deploy-pgclosets.sh                   # Main deployment script
├── deploy.js                             # Node.js wrapper
├── templates/
│   └── prod/
│       ├── .vercel/
│       │   └── project.json              # Production Vercel binding
│       └── public/
│           ├── robots.txt                # Production robots.txt
│           └── sitemap.xml               # Production sitemap
└── .vercel/                              # Created during deployment
    └── project.json                      # Restored from template
```

## ⚠️ **Error Handling**

The deployment script implements comprehensive error handling:

- **Fail-fast execution:** `set -euo pipefail` stops on any error
- **Prerequisite validation:** Checks all requirements before starting
- **Template validation:** Ensures production configs are valid
- **Build verification:** Confirms Next.js build succeeded
- **Deployment confirmation:** Verifies Vercel deployment completed

## 🔍 **Troubleshooting**

### Common Issues

#### Vercel CLI Not Found
```bash
npm install -g vercel
```

#### Not Authenticated
```bash
vercel login
```

#### Missing Template Files
Ensure `templates/prod/` directory contains all required files with production URLs.

#### Build Failures
Check Next.js build output for specific error details:
```bash
npm run build
```

#### Permission Denied
Make scripts executable:
```bash
chmod +x deploy-pgclosets.sh
chmod +x deploy.js
```

### Debug Mode
For detailed deployment logging, run with verbose output:
```bash
# Set environment variable for debug output
DEBUG=1 ./deploy-pgclosets.sh
```

## 📊 **Deployment Verification**

After successful deployment:

1. **Live Site Check:** Visit `https://www.pgclosets.com`
2. **Vercel Dashboard:** Check deployment status and logs
3. **Performance Test:** Verify page load speeds and functionality
4. **SEO Validation:** Confirm robots.txt and sitemap.xml are accessible

## 🔐 **Security Considerations**

- **Hardcoded Production IDs:** Prevents accidental deployment to wrong projects
- **Template Validation:** Ensures only production-ready configs are deployed
- **Authentication Required:** Vercel CLI must be authenticated before deployment
- **Fail-fast Safety:** Any validation failure aborts the entire process

## 📝 **Maintenance**

### Regular Updates
- Keep Vercel CLI updated: `npm update -g vercel`
- Review and update production templates as needed
- Monitor deployment logs for performance optimization opportunities

### Template Updates
When updating production configurations:
1. Modify files in `templates/prod/`
2. Test deployment to ensure proper restoration
3. Verify production URLs are correctly referenced

---

**🎉 Ready for Production Deployment!**

This deployment system ensures safe, reliable, and consistent deployments to the PG Closets production environment with comprehensive validation and error handling.