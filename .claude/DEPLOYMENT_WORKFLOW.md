# Optimal Deployment Workflow for Claude Code

**Last Updated:** 2025-10-13
**Based on:** 2025 Best Practices from Anthropic, Vercel, and Next.js

---

## 🎯 Overview

This deployment workflow implements industry best practices for automated CI/CD with Claude Code, Next.js, and Vercel.

### **Key Features:**
✅ Automated testing & validation
✅ Security scanning
✅ Bundle size optimization
✅ Preview deployments for PRs
✅ Production deployments for master
✅ Post-deployment validation

---

## 📋 Workflow Phases

### **Phase 1: Code Quality & Security** (~ 2-3 min)
- **Linting** - ESLint with auto-fix suggestions
- **Type Checking** - TypeScript validation
- **Secret Scanning** - TruffleHog security check
- **Dependency Audit** - npm audit for vulnerabilities

### **Phase 2: Automated Testing** (~ 3-5 min)
- **Unit Tests** - Jest/Vitest test suite
- **E2E Tests** - Playwright (if configured)
- **Component Tests** - React Testing Library
- **Integration Tests** - API route testing

### **Phase 3: Build & Validate** (~ 5-8 min)
- **Production Build** - Next.js optimized build
- **Bundle Analysis** - Size tracking & optimization
- **Static Generation** - Pre-render all static pages
- **Artifact Upload** - Build caching for faster deploys

### **Phase 4: Deploy to Vercel** (~ 2-4 min)
- **Preview Deployment** - For PRs and non-production branches
- **Production Deployment** - For master/main branch
- **Vercel CLI** - Prebuilt deployment strategy
- **PR Comments** - Automatic deployment URL posting

### **Phase 5: Post-Deployment Validation** (~ 1 min)
- **Health Checks** - Verify deployment status
- **Notifications** - Success/failure alerts
- **Summary Report** - Full pipeline status

---

## 🚀 Usage

### **Automatic Triggers:**

```yaml
# Push to master → Production deployment
git push origin master

# Push to development → Preview deployment
git push origin development

# Create PR → Preview deployment + comment
gh pr create --base master --head feature-branch
```

### **Manual Deployment:**

```bash
# Via Vercel CLI (local)
vercel --prod

# Via GitHub Actions (force re-run)
# Go to Actions tab → Re-run failed jobs
```

---

## 🔧 Required GitHub Secrets

Configure these in: **Settings → Secrets and variables → Actions**

| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `VERCEL_TOKEN` | Vercel API token | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | Organization ID | `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Project ID | `.vercel/project.json` |

### **Getting Your Vercel IDs:**

```bash
# 1. Link your project
vercel link

# 2. View the generated config
cat .vercel/project.json

# Output:
# {
#   "orgId": "team_xxxxx",
#   "projectId": "prj_xxxxx"
# }
```

---

## 📊 Performance Metrics

### **Target SLAs:**
- **Total Pipeline Time:** < 15 minutes
- **Quality Checks:** < 3 minutes
- **Testing:** < 5 minutes
- **Build:** < 8 minutes
- **Deploy:** < 4 minutes

### **Success Rates (2025 Industry Standards):**
- **Build Success:** > 95%
- **Test Pass Rate:** > 98%
- **Deploy Success:** > 99%
- **Rollback Time:** < 2 minutes

---

## 🛡️ Security Best Practices

### **Implemented Protections:**

1. **Secret Scanning** (TruffleHog)
   - Detects leaked credentials
   - Scans commit history
   - Prevents secret commits

2. **Dependency Auditing**
   - npm audit integration
   - Automated vulnerability alerts
   - Dependabot updates

3. **Least Privilege Access**
   - Scoped GitHub tokens
   - Read-only Vercel access where possible
   - Environment-specific secrets

4. **Secure Deployment Strategy**
   - Prebuilt deployments (faster, more secure)
   - Immutable deployments
   - Automatic rollback on failure

---

## 🔄 Deployment Strategies

### **1. Preview Deployments (PRs)**
- Automatic deployment for every PR
- Unique URL per deployment
- Comment posted on PR with link
- Isolated environment
- No production data access

### **2. Production Deployments (master/main)**
- Only triggered by master branch
- All tests must pass
- Manual approval optional (can be configured)
- Automatic custom domain assignment
- Zero-downtime deployment

### **3. Rollback Strategy**
- Instant rollback via Vercel dashboard
- Previous deployments remain accessible
- Automatic health checks
- Can promote any previous deployment

---

## 📈 Monitoring & Observability

### **Built-in Monitoring:**

**Vercel Dashboard:**
- Real-time deployment status
- Build logs and errors
- Performance metrics
- Custom domain status

**GitHub Actions:**
- Workflow run history
- Artifact storage
- Test reports
- Bundle size tracking

**Vercel Toolbar (Development):**
- Real-time Core Web Vitals
- Bundle analysis
- Environment inspection
- Performance insights

---

## 🐛 Troubleshooting

### **Common Issues:**

#### **1. Build Failures**
```bash
# Check build locally first
npm run build

# View detailed logs
vercel logs <deployment-url>

# Common causes:
# - TypeScript errors (use npm run type-check)
# - Missing environment variables
# - Dependency issues (npm ci)
```

#### **2. Test Failures**
```bash
# Run tests locally
npm test

# Run specific test file
npm test -- path/to/test.spec.ts

# Update snapshots if needed
npm test -- -u
```

#### **3. Deployment Timeout**
```bash
# Optimize build
# - Enable caching in workflow
# - Use prebuilt deployment
# - Reduce bundle size

# Check deployment status
vercel inspect <deployment-url>
```

#### **4. Secret Issues**
```bash
# Verify secrets are set
gh secret list

# Update a secret
gh secret set VERCEL_TOKEN

# Test secret access in workflow
# Add debug step to print masked value
```

---

## 🎯 Claude Code Integration

### **CLI Workflow Automation:**

```bash
# Use Claude Code in headless mode for automation
claude -p "Review and fix all TypeScript errors" \
  --output-format json \
  --max-iterations 3

# Pre-commit hook integration
# .git/hooks/pre-commit
#!/bin/bash
claude -p "Check for any obvious issues in staged files" \
  --files $(git diff --cached --name-only)
```

### **Custom Claude Commands:**

Create `.claude/commands/deploy-check.md`:

```markdown
# Deploy Check Command

Review the following before deployment:
1. All tests passing?
2. No console.logs in production code?
3. Environment variables configured?
4. Bundle size acceptable (<200kB)?
5. TypeScript errors resolved?
6. Security vulnerabilities fixed?

Provide a summary and approval status.
```

Usage: `/deploy-check`

---

## 📚 Best Practices Summary

### **✅ DO:**
- Run `npm run build` locally before pushing
- Write tests for new features
- Keep bundle sizes small (< 200kB per page)
- Use semantic versioning for releases
- Document breaking changes
- Review deployment logs
- Monitor Core Web Vitals
- Use environment variables for secrets
- Enable caching for faster builds
- Test in preview before merging to production

### **❌ DON'T:**
- Commit secrets or API keys
- Skip tests to deploy faster
- Merge without code review
- Deploy directly to production without testing
- Ignore build warnings
- Use `--force` push
- Bypass CI/CD checks
- Hardcode environment-specific values
- Deploy on Fridays (unless necessary! 😄)
- Ignore bundle size increases

---

## 🔗 Additional Resources

- [Vercel Deployment Documentation](https://vercel.com/docs)
- [Next.js CI/CD Guide](https://nextjs.org/docs/deployment)
- [GitHub Actions Best Practices](https://docs.github.com/en/actions/learn-github-actions/best-practices-for-workflows)
- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)

---

## 📝 Workflow Maintenance

**Review and update this workflow:**
- ✅ Quarterly - Check for new best practices
- ✅ After major framework updates (Next.js, Vercel)
- ✅ When adding new tools or dependencies
- ✅ After any security incidents
- ✅ Based on team feedback and pain points

**Version History:**
- v1.0 - 2025-10-13 - Initial optimal workflow based on 2025 best practices

---

*Generated with Claude Code - Optimized for production deployments*
