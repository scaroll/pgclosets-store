# PG Closets - Triple-Tested CI/CD Pipeline Setup

## 🎯 Overview

This project now has a comprehensive CI/CD pipeline with triple-testing stages:
- **Stage 1**: Lint & Unit Tests (every PR)
- **Stage 2**: Preview Deploy + Smoke Tests + Lighthouse + Visual Diff (PRs only)
- **Stage 3**: Production Deploy + Post-Deploy Checks (main branch only)

## 🔧 Required GitHub Secrets

Add these secrets to your GitHub repository settings (`Settings` > `Secrets and variables` > `Actions`):

### Required Secrets
```bash
VERCEL_TOKEN=<your-vercel-api-token>
VERCEL_ORG_ID=team_Xzht85INUsoW05STx9DMMyLX
VERCEL_PROJECT_ID=prj_SmzgeYTYp4LHGzkYTLKJAZJg9718
```

### Optional Secrets
```bash
LHCI_GITHUB_APP_TOKEN=<lighthouse-ci-token>  # For enhanced Lighthouse reporting
```

## 🚀 How to Get Vercel Token

1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it "GitHub Actions CI/CD"
4. Copy the token and add it as `VERCEL_TOKEN` in GitHub secrets

## 📋 Pipeline Behavior

### Triggers
✅ **Runs on these file changes:**
- `app/**`, `src/**`, `public/**`, `components/**`, `lib/**`
- `next.config.*`, `package.json`, `package-lock.json`
- `tailwind.config.*`, `tsconfig.json`, `vercel.json`

❌ **Skips deployment for:**
- `README.md`, `docs/**`, `.github/**` (except workflow files)
- Any files not in the critical paths above

### Stage Breakdown

#### Stage 1: Lint & Unit Tests
- Runs on every PR and main branch push
- ESLint validation
- Vitest unit tests
- Next.js build verification
- **Blocks further stages if failing**

#### Stage 2: Preview Deploy & Testing (PRs Only)
- Deploys to Vercel preview URL
- Playwright smoke tests on 3 critical pages
- Lighthouse performance audit
- Visual regression comparison vs production
- **Comments PR with results and preview URL**

#### Stage 3: Production Deploy (Main Branch Only)
- Deploys to production
- Post-deploy smoke tests
- **Auto-rollback guidance if tests fail**

## 🧪 Testing Framework

### Unit Tests (Vitest)
```bash
npm run test          # Run all unit tests
npm run test:watch    # Watch mode for development
```

### E2E Tests (Playwright)
```bash
npm run test:e2e      # All Playwright tests
npm run test:smoke    # Smoke tests only
npm run test:visual   # Visual regression only
npm run test:e2e:ui   # Interactive UI mode
```

### Visual Regression Testing
- Compares preview vs production screenshots
- 0.5% pixel difference threshold
- Tests: `/`, `/store`, `/store/products`
- Both desktop (1280x720) and mobile (375x667) viewports

## 🎯 Critical Pages Monitored

1. **Homepage** (`/`) - Brand presence and image gallery
2. **Store** (`/store`) - Main store interface
3. **Products** (`/store/products`) - Product catalog

## 📊 Quality Gates

### Lighthouse Thresholds
- **Performance**: ≥75% (fails <75%)
- **Accessibility**: ≥90% (fails <90%)
- **Best Practices**: ≥85% (fails <85%)

### Visual Regression
- **Desktop**: Max 0.5% pixel difference per page
- **Mobile**: Max 0.5% pixel difference per page
- **Fails**: If any page exceeds threshold

### Build Requirements
- All TypeScript errors must be resolved
- ESLint must pass with zero errors
- Unit tests must have 100% pass rate

## 🔄 Workflow Examples

### Example 1: Documentation Update
```bash
# Edit README.md only
git add README.md
git commit -m "Update documentation"
git push origin feature-branch
```
**Result**: Only Stage 1 runs, no deployment

### Example 2: UI Component Change
```bash
# Edit components/ui/button.tsx
git add components/ui/button.tsx  
git commit -m "Update button styling"
git push origin feature-branch
```
**Result**: Full pipeline runs with visual diff validation

### Example 3: Production Deploy
```bash
# Merge PR to main
git checkout main
git merge feature-branch
git push origin main
```
**Result**: Stage 1 + Stage 3 (production deploy + smoke tests)

## 🚨 Troubleshooting

### Failed Visual Regression
- Review PR comment for specific page differences
- Check preview URL manually to verify changes are intentional
- Update visual test baselines if changes are expected

### Failed Lighthouse Audit
- Check performance recommendations in PR comment
- Optimize images, reduce bundle size, or improve Core Web Vitals
- Performance threshold can be adjusted in workflow file

### Failed Smoke Tests
- Indicates critical functionality is broken
- Check browser console for JavaScript errors
- Verify all critical pages load with 200 status

### Deployment Rollback
If production smoke tests fail:
1. Check the Vercel dashboard for deployment logs
2. Use `vercel rollback <previous-url>` if needed
3. Fix issues in a new PR before next deployment

## 📝 Manual Overrides

### Force Deploy Documentation Changes
```yaml
# Add to commit message to override path filtering
[deploy-force]
```

### Skip CI Entirely
```yaml  
# Add to commit message to skip all CI
[skip ci]
```

## 🔒 Security Notes

- Repository remains private
- Vercel access via GitHub App integration
- Secrets are encrypted and only accessible during workflow runs
- No sensitive data exposed in logs or PR comments

---

**Pipeline Status**: ✅ Active and Ready
**Last Updated**: $(date)
**Next Steps**: Add GitHub secrets and test with a PR!