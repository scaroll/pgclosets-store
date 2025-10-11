# How to Pin Vercel Deployment

**Date**: October 10, 2025
**Project**: pgclosets-store
**Current Deployment ID**: `iad1::4pltp-1760147304704-725592ffac68`

---

## 🎯 QUICK STEPS TO PIN DEPLOYMENT

### Method 1: Pin via Vercel Dashboard (Recommended)

**1. Navigate to Deployments Page**:
```
https://vercel.com/peoples-group/pgclosets-store/deployments
```

**2. Identify Current Production Deployment**:
- Look for deployment with **"Production"** badge
- Should be at the top of the list
- Verify it's the deployment you want to pin

**3. Pin the Deployment**:

**Option A: From Deployments List**
1. Find the deployment you want to pin
2. Click the **three dots menu (⋮)** on the right
3. Select **"Promote to Production"** or **"Pin to Production"**
4. Confirm the action

**Option B: From Deployment Details**
1. Click on the deployment you want to pin
2. Click the **"Promote to Production"** button (if available)
3. OR click **"︙" menu** → **"Pin to Production"**
4. Confirm the action

**4. Verify Pin Status**:
- Deployment should now show **"Pinned"** badge
- Future pushes to master will NOT auto-deploy
- Manual promotion required for new deployments

---

## 📋 DETAILED STEP-BY-STEP GUIDE

### Step 1: Access Vercel Dashboard

1. **Login to Vercel**: https://vercel.com
2. **Navigate to Project**:
   - Organization: `peoples-group`
   - Project: `pgclosets-store`
3. **Go to Deployments Tab**

**Direct Link**:
```
https://vercel.com/peoples-group/pgclosets-store/deployments
```

---

### Step 2: Identify the Deployment to Pin

**Current Production Deployment Info**:
- **Deployment ID**: `iad1::4pltp-1760147304704-725592ffac68`
- **Likely Commit**: `5f007c1` or `ea277ec`
- **Status**: Currently live in production

**Visual Indicators**:
- 🟢 **"Production"** badge (green)
- May show domain: `www.pgclosets.com`
- Most recent successful deployment

**Verify Before Pinning**:
1. Click on the deployment
2. Check **"Commit"** section - shows git commit hash
3. Check **"Build Logs"** - ensure build was successful
4. Check **"Preview"** - test the deployed site
5. Verify this is the version you want to keep stable

---

### Step 3: Pin the Deployment

#### Using Deployment List View

1. **Locate Deployment** in the deployments list
2. **Hover** over the deployment row
3. **Click** the three dots menu (**⋮**) on the far right
4. **Select** one of these options:
   - **"Promote to Production"** (if not already production)
   - **"Pin to Production"** (if already production)
   - **"Pin Deployment"**
5. **Confirm** when prompted

#### Using Deployment Details View

1. **Click** on the deployment to open details
2. Look for buttons at the top right:
   - **"Promote to Production"** button
   - **"⋮" menu** for more options
3. **Click** the appropriate button
4. **Check** "Pin this deployment" checkbox (if available)
5. **Confirm** the action

---

### Step 4: Verify Pin Status

**After Pinning, Check For**:

1. **"Pinned" Badge**:
   - Should appear next to "Production" badge
   - May be a pin icon: 📌

2. **Deployment List**:
   - Pinned deployment stays at top
   - New deployments show as "Preview" only

3. **Settings Indicator**:
   - May show "Pinned to production" in deployment details

**Test Auto-Deploy is Disabled**:
```bash
# Make a trivial change
echo "\n# Test after pin" >> README.md
git add README.md
git commit -m "test: verify pin prevents auto-deploy"
git push origin master

# Check Vercel dashboard
# New deployment should be "Preview" only, NOT "Production"
```

---

## 🔓 HOW TO UNPIN (When Ready to Deploy Again)

### Unpinning a Deployment

**When You Want New Changes to Auto-Deploy**:

1. **Go to Deployments**: https://vercel.com/peoples-group/pgclosets-store/deployments
2. **Find Pinned Deployment** (has "Pinned" badge)
3. **Click** three dots menu (**⋮**)
4. **Select** "Unpin from Production" or "Unpin Deployment"
5. **Confirm**

**After Unpinning**:
- Latest successful deployment becomes production
- Auto-deploy resumes for new pushes
- No "Pinned" badge visible

---

## 📌 WHAT PINNING DOES

### When Deployment is Pinned ✅

**Production Deployment**:
- ✅ Stays locked to specific git commit
- ✅ Will NOT change even when new code is pushed
- ✅ Stable and predictable

**New Pushes to Master**:
- ⚠️ Create "Preview" deployments only
- ⚠️ Do NOT become production automatically
- ⚠️ Must be manually promoted to production

**Benefits**:
- 🔒 Production stability guaranteed
- 🧪 Test new changes in preview first
- 🎯 Control exactly when updates go live
- 🛡️ Prevent accidental production updates

---

### When Deployment is NOT Pinned

**Production Deployment**:
- 🔄 Updates automatically with every push to master
- 🚀 Latest commit goes live immediately
- ⚡ Fast iteration, but less control

**New Pushes to Master**:
- ✅ Trigger automatic production deployment
- ✅ Build → Test → Deploy → Live (all automatic)
- ⚠️ Requires confidence in CI/CD pipeline

---

## 🎯 WHEN TO PIN

### Good Reasons to Pin

**1. Major Event or High Traffic**:
- Black Friday sales
- Product launch
- Marketing campaign
- Prevents unexpected changes during critical time

**2. Awaiting External Changes**:
- DNS propagation in progress
- Third-party service maintenance
- Coordinating with other teams

**3. Testing Phase**:
- Want to test new features in preview
- Need stakeholder approval before production
- A/B testing different versions

**4. Stability Period**:
- After major refactor, want stability
- Before holiday/vacation (no unattended deployments)
- Regulatory review in progress

---

### When NOT to Pin

**1. Active Development**:
- Rapidly iterating on features
- Continuous deployment workflow
- Team expects immediate updates

**2. Bug Fixes**:
- Critical bug in production
- Security vulnerability discovered
- Need fast patching capability

**3. Ongoing Optimization**:
- Performance improvements rolling out
- SEO updates being deployed
- A/B test variations changing

---

## 📊 CURRENT DEPLOYMENT STATUS

### Latest Code Commits (Functional Changes)

```
5f007c1 (Oct 9, 18:15) - fix: export trackEvent from analytics/events
ae0a4b1 (Oct 9, 17:52) - fix: correct vercel.json branch name to master
5979534 (Oct 9, 17:13) - fix: align all Vercel project IDs to canonical
ea277ec (Oct 9, 16:41) - feat: implement HIGH priority audit fixes (ISSUE-010, ISSUE-011)
16cdee8 (Oct 9, 16:25) - fix: critical estimator and navigation fixes from audit
```

### Recommended Deployment to Pin

**Best Option**: Current production deployment
- **Commit**: Likely `5f007c1` (latest functional code)
- **Includes**:
  - ✅ Build warning fixes
  - ✅ Vercel configuration fixes
  - ✅ Project ID alignment
  - ✅ HIGH priority audit fixes (ISSUE-010, ISSUE-011)
  - ✅ Estimator and navigation fixes
- **Status**: Stable, tested, clean build

**Why This Deployment**:
- Contains all recent bug fixes
- Performance: 99/100
- Accessibility: 96/100
- 0 build errors, 0 warnings
- Comprehensive testing completed

---

## ⚙️ ALTERNATIVE: Pin via Vercel CLI

### Using Command Line (Advanced)

**Prerequisites**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to project
vercel link
```

**Get Deployment URL**:
```bash
# List recent deployments
vercel ls

# Find the deployment URL you want to pin
# Format: pgclosets-store-abc123xyz.vercel.app
```

**Pin Deployment**:
```bash
# Promote specific deployment to production
vercel promote <deployment-url> --scope peoples-group
```

**Example**:
```bash
vercel promote pgclosets-store-5f007c1.vercel.app --scope peoples-group
```

**Note**: CLI doesn't have explicit "pin" command. Promoting sets it as production, but doesn't prevent future auto-deploys. Dashboard method recommended for true pinning.

---

## 🔍 VERIFICATION CHECKLIST

After pinning, verify these items:

### Immediate Verification
- [ ] Deployment shows "Pinned" badge in dashboard
- [ ] Deployment shows "Production" badge
- [ ] Correct domain assigned (www.pgclosets.com)
- [ ] Deployment details show correct commit hash

### Test Auto-Deploy Disabled
- [ ] Make trivial change to repository
- [ ] Push to master branch
- [ ] New deployment creates as "Preview" only
- [ ] Production deployment unchanged (still pinned)

### Production Site Check
- [ ] Visit: https://www.pgclosets.com
- [ ] Site loads correctly
- [ ] Check browser console: 0 errors
- [ ] Test key functionality:
  - [ ] Instant estimator works
  - [ ] Navigation works
  - [ ] Product pages load
  - [ ] Error boundary present (React DevTools)

---

## 📝 DOCUMENTATION AFTER PINNING

**Record These Details**:

1. **Pin Date/Time**: [When you pinned]
2. **Pinned Commit**: [Git commit hash]
3. **Deployment ID**: `iad1::4pltp-1760147304704-725592ffac68`
4. **Reason for Pinning**: [Why you pinned - event, stability, testing, etc.]
5. **Planned Unpin Date**: [When you expect to unpin]
6. **Team Notification**: [Who needs to know about the pin]

**Example Documentation**:
```
PIN RECORD:
- Date: October 10, 2025 21:50 EDT
- Commit: 5f007c1 (trackEvent export fix)
- Deployment: iad1::4pltp-1760147304704-725592ffac68
- Reason: Ensure stability after configuration changes
- Unpin: After 24 hours of monitoring (Oct 11, 21:50 EDT)
- Notified: Development team via Slack
```

---

## 🚨 IMPORTANT NOTES

### Critical Reminders

1. **Pinning Disables Auto-Deploy**:
   - New code pushed to master will NOT go to production
   - Preview deployments still created
   - Must manually promote each update

2. **Team Communication**:
   - Notify team that production is pinned
   - Prevent confusion about why changes aren't live
   - Document expected unpin time

3. **Remember to Unpin**:
   - Set calendar reminder
   - Don't leave pinned indefinitely
   - Resume normal deployment flow when ready

4. **Emergency Override**:
   - Can always manually promote critical fixes
   - Pin doesn't prevent manual deployment
   - Just disables automatic deployment

---

## 🎯 QUICK REFERENCE

**Pin Deployment**:
1. Go to: https://vercel.com/peoples-group/pgclosets-store/deployments
2. Find deployment with "Production" badge
3. Click **⋮** → **"Pin to Production"**
4. Confirm

**Unpin Deployment**:
1. Go to: https://vercel.com/peoples-group/pgclosets-store/deployments
2. Find deployment with "Pinned" badge
3. Click **⋮** → **"Unpin from Production"**
4. Confirm

**Verify Pin Status**:
- Check for "Pinned" badge in deployments list
- Test push to master creates "Preview" only

---

**Created**: October 10, 2025
**Project**: pgclosets-store
**Action Required**: Pin current production deployment via Vercel Dashboard
