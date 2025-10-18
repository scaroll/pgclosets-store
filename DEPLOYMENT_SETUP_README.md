# Deployment Workflow Setup Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Configure GitHub Secrets

1. Go to your repo: **Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**
3. Add these three secrets:

| Name | Value | How to Get |
|------|-------|------------|
| `VERCEL_TOKEN` | your-vercel-token | [Create Token](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | team_xxxxx | From `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | prj_xxxxx | From `.vercel/project.json` |

### Step 2: Get Your Vercel IDs

```bash
# Run this in your project directory
vercel link

# Then view the IDs
cat .vercel/project.json
```

### Step 3: Enable the Workflow

The workflow is already created at `.github/workflows/optimal-deploy.yml` and will automatically run on:
- ✅ Push to `master` → Production deployment
- ✅ Push to other branches → Preview deployment
- ✅ Pull requests → Preview deployment + PR comment

### Step 4: Test It

```bash
# Create a test branch
git checkout -b test-deployment

# Make a small change
echo "# Test" >> test.md

# Commit and push
git add test.md
git commit -m "test: Verify deployment workflow"
git push origin test-deployment

# Go to GitHub Actions tab to watch it run!
```

---

## ✅ Verification

After setup, verify:

1. **GitHub Actions tab** shows the workflow running
2. **Vercel dashboard** shows the deployment
3. **PR comments** include deployment URLs (if applicable)

---

## 📚 Full Documentation

See `.claude/DEPLOYMENT_WORKFLOW.md` for complete details on:
- Workflow phases
- Troubleshooting
- Best practices
- Claude Code integration

---

## 🆘 Quick Troubleshooting

**Workflow fails?**
```bash
# Check the logs in GitHub Actions
# Common fixes:
1. Verify all 3 secrets are set correctly
2. Make sure VERCEL_TOKEN has deployment permissions
3. Check that branch names match (master vs main)
```

**Need help?**
```bash
# Use Claude Code's deploy-check command
/deploy-check
```

---

## 🎯 What's Included

✅ **Automated Quality Checks** - Linting, type checking, security scanning
✅ **Automated Testing** - Unit and E2E tests
✅ **Optimized Builds** - Caching, bundle analysis
✅ **Preview Deployments** - Every PR gets a unique URL
✅ **Production Deployments** - Automated deploys to pgclosets.com
✅ **Post-Deploy Validation** - Health checks and notifications
✅ **PR Comments** - Automatic deployment URL posting

---

**🎉 You're all set! Push to master to deploy to production.**
