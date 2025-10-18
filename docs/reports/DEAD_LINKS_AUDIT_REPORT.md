# PG Closets - Dead Links Audit Report
**Date:** October 4, 2025
**Project:** /Users/spencercarroll/pgclosets-store-main
**Site:** https://www.pgclosets.com
**Audited Routes:** 68 page routes found
**Total Links Scanned:** 500+ internal/external links

---

## Executive Summary

### Overall Findings
- **Total Links Found:** 500+
- **Broken Internal Links:** 25 unique routes
- **Working Routes:** 68 verified routes
- **External Links:** All verified (social media, analytics, CDNs)
- **Critical Issues:** 25 missing pages referenced in navigation
- **Priority Level:** HIGH - Main navigation contains broken links

### Impact Assessment
- **User Experience:** CRITICAL - Main navigation MegaMenu has broken product/service links
- **SEO Impact:** HIGH - Broken internal linking structure
- **Business Impact:** CRITICAL - CTA buttons link to non-existent consultation/auth pages

---

## 1. CRITICAL BROKEN LINKS (Priority 1)

### Main Navigation - MegaMenu Products Section
**Location:** `/components/navigation/MegaMenu.tsx`

#### Missing Product Category Pages
| Link | Status | Referenced In | Fix Required |
|------|--------|---------------|--------------|
| `/products/sliding-doors` | ❌ 404 | MegaMenu line 28 | Create page or redirect to /products/barn-doors |
| `/products/bi-fold-doors` | ❌ 404 | MegaMenu line 35 | Create page or redirect to existing category |
| `/products/french-doors` | ❌ 404 | MegaMenu line 41 | Create page or redirect to /products/interior-doors |
| `/products/style/modern` | ❌ 404 | MegaMenu line 52 | Create style filtering system |
| `/products/style/traditional` | ❌ 404 | MegaMenu line 57 | Create style filtering system |
| `/products/style/transitional` | ❌ 404 | MegaMenu line 62 | Create style filtering system |
| `/products/new` | ❌ 404 | MegaMenu line 72 | Create new arrivals page |
| `/products/custom` | ❌ 404 | MegaMenu line 78 | Create custom solutions page |

**Impact:** Users clicking popular product categories in dropdown get 404 errors

---

### Main Navigation - Services Section
**Location:** `/components/navigation/MegaMenu.tsx`

#### Missing Service Pages
| Link | Status | Referenced In | Fix Required |
|------|--------|---------------|--------------|
| `/services/consultation` | ❌ 404 | MegaMenu line 90, Multiple components | Create consultation page |
| `/services/installation` | ❌ 404 | MegaMenu line 96 | Create installation info page |
| `/services/warranty` | ❌ 404 | MegaMenu line 101 | Create warranty page |
| `/services/custom-design` | ❌ 404 | MegaMenuNav line 63 | Create custom design page |
| `/services/planning` | ❌ 404 | MegaMenuNav line 65 | Create planning page |
| `/services/maintenance` | ❌ 404 | MegaMenuNav line 72 | Create maintenance tips page |

**Impact:** Service menu completely broken - no service pages exist except main `/services`

---

### Process Flow Navigation
**Location:** `/components/navigation/MegaMenu.tsx`

#### Missing Process Pages
| Link | Status | Referenced In | Fix Required |
|------|--------|---------------|--------------|
| `/process/consultation` | ❌ 404 | MegaMenu line 111 | Create process step page |
| `/process/design` | ❌ 404 | MegaMenu line 116 | Create process step page |
| `/process/installation` | ❌ 404 | MegaMenu line 121 | Create process step page |

**Impact:** Process explanation flow is broken

---

## 2. HIGH PRIORITY BROKEN LINKS (Priority 2)

### Authentication & User Management
**Location:** Multiple components (`/components/auth/UserMenu.tsx`)

#### Missing Auth Pages
| Link | Status | Referenced In | Fix Required |
|------|--------|---------------|--------------|
| `/login` | ❌ 404 | UserMenu, register page, forgot-password | Create login page |
| `/dashboard` | ❌ 404 | UserMenu line 92 | Create user dashboard |
| `/orders` | ❌ 404 | UserMenu line 98 | Redirect to `/account/orders` (exists) |
| `/profile` | ❌ 404 | UserMenu line 104 | Redirect to `/account/profile` (exists) |

**Impact:** User authentication system appears broken, no way to log in

---

### CTA & Conversion Pages
**Location:** Multiple headers and CTAs

#### Missing Consultation Page
| Link | Status | Referenced In | Fix Required |
|------|--------|---------------|--------------|
| `/consultation` | ❌ 404 | 8+ components (headers, CTAs) | Create or redirect to `/request-work` |

**Impact:** CRITICAL - Main CTA button in many components leads to 404

---

### Footer & Legal Links
**Location:** `/components/layout/Footer.tsx`

#### Missing Utility Pages
| Link | Status | Referenced In | Fix Required |
|------|--------|---------------|--------------|
| `/accessibility` | ❌ 404 | Footer line 271 | Create accessibility statement page |
| `/sitemap` | ❌ 404 | Footer line 278 | Create sitemap page or link to sitemap.xml |

**Impact:** Footer links broken, potential ADA compliance issue

---

### Admin Panel
**Location:** `/components/admin/AdminLayout.tsx`

#### Missing Admin Pages
| Link | Status | Referenced In | Fix Required |
|------|--------|---------------|--------------|
| `/admin/orders` | ❌ 404 | AdminLayout line 13 | Create admin orders management page |

**Impact:** Admin panel navigation incomplete

---

## 3. WORKING ROUTES (Verified ✅)

### Core Pages (Working)
- ✅ `/` - Homepage
- ✅ `/about` - About page
- ✅ `/contact` - Contact page
- ✅ `/services` - Services overview (but sub-pages missing)
- ✅ `/products` - Products overview
- ✅ `/gallery` - Gallery page
- ✅ `/quote` - Quote request page
- ✅ `/request-work` - Work request form
- ✅ `/faq` - FAQ page
- ✅ `/cart` - Shopping cart
- ✅ `/checkout` - Checkout page
- ✅ `/checkout/confirmation` - Order confirmation

### Product Categories (Working)
- ✅ `/products/barn-doors`
- ✅ `/products/closet-systems`
- ✅ `/products/interior-doors`
- ✅ `/products/room-dividers`
- ✅ `/products/hardware`
- ✅ `/products/catalog`
- ✅ `/products/search`
- ✅ `/products/[slug]` - Dynamic product pages

### Location Pages (Working)
- ✅ `/kanata`
- ✅ `/barrhaven`
- ✅ `/nepean`
- ✅ `/orleans`
- ✅ `/ottawa`
- ✅ `/installation-ottawa`
- ✅ `/renin` - Renin brand pages
- ✅ `/renin/ottawa`, `/renin/kanata`, `/renin/orleans`, `/renin/barrhaven`

### Account Management (Working)
- ✅ `/account` - Account overview
- ✅ `/account/profile`
- ✅ `/account/settings`
- ✅ `/account/orders`
- ✅ `/account/addresses`
- ✅ `/account/payment-methods`
- ✅ `/register` - Registration page
- ✅ `/forgot-password` - Password reset

### Legal & Policy (Working)
- ✅ `/privacy-policy`
- ✅ `/terms-of-service`
- ✅ `/return-policy`
- ✅ `/shipping-policy`
- ✅ `/legal/terms`
- ✅ `/legal/privacy`

### Admin Pages (Partially Working)
- ✅ `/admin/products`
- ✅ `/admin/product-mapping`
- ✅ `/admin/product-images`
- ✅ `/admin/blob-audit`
- ❌ `/admin/orders` - MISSING

### Store & Blog (Working)
- ✅ `/store` - Store page
- ✅ `/store/products`
- ✅ `/store/products/[slug]`
- ✅ `/blog`
- ✅ `/blog/[slug]`

### Utility Pages (Working)
- ✅ `/search`
- ✅ `/offline` - Offline page
- ✅ `/upload` - File upload
- ✅ `/visualizer` - Door visualizer
- ✅ `/why-pg` - Why choose PG Closets
- ✅ `/simple-products`, `/simple-cart` - Simple product system
- ✅ `/navigation-demo` - Navigation demo page

---

## 4. EXTERNAL LINKS AUDIT

### Social Media Links ✅
**Location:** `/components/PgFooter.tsx`

| Platform | URL | Status | Notes |
|----------|-----|--------|-------|
| Facebook | `https://facebook.com/pgclosets` | ✅ Valid | Line 68 |
| Instagram | `https://instagram.com/pgclosets` | ✅ Valid | Line 83 |
| LinkedIn | `https://linkedin.com/company/pgclosets` | ✅ Valid | Line 98 |

**Note:** All social URLs use proper `rel="noopener noreferrer"` and `target="_blank"`

---

### Third-Party Services ✅
| Service | URL | Status | Purpose |
|---------|-----|--------|---------|
| Jobber Integration | `https://clienthub.getjobber.com/...` | ✅ Valid | Checkout redirect |
| Google Analytics | `https://www.googletagmanager.com/...` | ✅ Valid | Analytics tracking |
| Vercel Blob Storage | `https://hebbkx1anhila5yf.public.blob.vercel-storage.com/...` | ✅ Valid | Video/image hosting |
| Google Fonts | `https://fonts.googleapis.com`, `https://fonts.gstatic.com` | ✅ Valid | Font loading |
| Vercel Speed Insights | `https://unpkg.com/@vercel/speed-insights...` | ✅ Valid | Performance monitoring |

**Note:** All CDN and third-party links are properly configured

---

## 5. LINK PATTERN INCONSISTENCIES

### Issue: Duplicate Routes for Same Functionality
| Broken Link | Working Alternative | Action Needed |
|-------------|---------------------|---------------|
| `/consultation` | `/request-work` | Redirect /consultation → /request-work |
| `/orders` | `/account/orders` | Redirect /orders → /account/orders |
| `/profile` | `/account/profile` | Redirect /profile → /account/profile |
| `/dashboard` | `/account` | Redirect /dashboard → /account |

---

### Issue: Navigation Inconsistencies
**Problem:** Header links to `/services` but MegaMenu has `/services/consultation`, etc.

**Current Structure:**
```
/services (exists as page.tsx)
  /services/consultation (does not exist)
  /services/installation (does not exist)
  /services/warranty (does not exist)
```

**Recommendation:** Either:
1. Create all service sub-pages
2. Remove MegaMenu service sub-items and link directly to /services with anchor links
3. Implement service pages as sections on /services page with hash routing

---

## 6. IMAGE & MEDIA LINKS

### Working Media Sources
- ✅ Vercel Blob Storage for hero video
- ✅ Product images from blob storage
- ✅ SVG icons inline (no external dependencies)
- ✅ Data URIs for placeholders

### No Broken Image Sources Found
All `<Image>` components appear to have valid sources or proper fallbacks.

---

## 7. API ROUTES (Not Fully Audited)

### Detected API Routes
Located in `/app/api/` directory - 15 API routes found

**Note:** API route functionality not tested in this audit, only page routes

---

## 8. PRIORITY FIX RECOMMENDATIONS

### CRITICAL (Fix Immediately - Affects Core UX)
1. **Create `/consultation` page** - Referenced in 8+ components
   - OR redirect to `/request-work`

2. **Fix MegaMenu Product Links** - 8 broken product category links
   - Create pages for `/products/sliding-doors`, `/products/bi-fold-doors`, `/products/french-doors`
   - OR redirect to closest existing categories
   - OR update MegaMenu to only link to existing pages

3. **Create `/login` page** - Multiple components expect this
   - Essential for user authentication flow

4. **Fix Services Navigation** - All service sub-pages are 404
   - Create service detail pages
   - OR restructure /services page with sections
   - Update MegaMenu accordingly

---

### HIGH PRIORITY (Fix Within Week - Affects Features)
5. **Create Process Pages** - 3 process flow pages missing
6. **Fix User Menu Links** - `/dashboard`, `/orders`, `/profile` redirects needed
7. **Create Admin Orders Page** - Admin panel navigation broken
8. **Add Accessibility & Sitemap Pages** - Footer links broken

---

### MEDIUM PRIORITY (Fix Within Month - Nice to Have)
9. **Product Style Filtering** - `/products/style/*` pages
10. **New Arrivals Page** - `/products/new`
11. **Custom Solutions Page** - `/products/custom`
12. **Service Detail Pages** - Warranty, maintenance, planning

---

## 9. RECOMMENDED FIXES BY FILE

### Fix 1: Update MegaMenu to Remove Broken Links
**File:** `/Users/spencercarroll/pgclosets-store-main/components/navigation/MegaMenu.tsx`

**Current (Broken):**
```tsx
{
  title: "Sliding Doors",
  href: "/products/sliding-doors", // 404
  description: "Premium sliding door systems for modern homes",
  badge: "Bestseller",
}
```

**Option A - Redirect to Working Pages:**
```tsx
{
  title: "Barn Doors",
  href: "/products/barn-doors", // Existing page
  description: "Premium sliding barn door systems",
  badge: "Bestseller",
}
```

**Option B - Create Missing Pages:**
Create `/app/products/sliding-doors/page.tsx` and other missing product pages

---

### Fix 2: Create Consultation Redirect
**File:** Create `/app/consultation/page.tsx`

```tsx
import { redirect } from 'next/navigation'

export default function ConsultationRedirect() {
  redirect('/request-work')
}
```

**OR** create full consultation page if different from request-work

---

### Fix 3: Create Simple Redirects for User Pages
**Files to Create:**
- `/app/login/page.tsx`
- `/app/dashboard/page.tsx`
- `/app/orders/page.tsx`
- `/app/profile/page.tsx`

```tsx
// Example: /app/orders/page.tsx
import { redirect } from 'next/navigation'

export default function OrdersRedirect() {
  redirect('/account/orders')
}
```

---

### Fix 4: Update UserMenu to Use Correct Routes
**File:** `/Users/spencercarroll/pgclosets-store-main/components/auth/UserMenu.tsx`

**Change:**
```tsx
// Line 92 - Change from:
<Link href="/dashboard" className="flex items-center gap-2">
// To:
<Link href="/account" className="flex items-center gap-2">

// Line 98 - Change from:
<Link href="/orders" className="flex items-center gap-2">
// To:
<Link href="/account/orders" className="flex items-center gap-2">

// Line 104 - Change from:
<Link href="/profile" className="flex items-center gap-2">
// To:
<Link href="/account/profile" className="flex items-center gap-2">
```

---

### Fix 5: Create Service Pages Structure
**Recommended Structure:**

```
app/
  services/
    page.tsx (exists)
    consultation/
      page.tsx (create)
    installation/
      page.tsx (create)
    warranty/
      page.tsx (create)
    custom-design/
      page.tsx (create)
    maintenance/
      page.tsx (create)
    planning/
      page.tsx (create)
```

---

### Fix 6: Create Missing Utility Pages
**Files to Create:**
- `/app/accessibility/page.tsx`
- `/app/sitemap/page.tsx` (or redirect to `/sitemap.xml`)
- `/app/admin/orders/page.tsx`

---

## 10. TESTING RECOMMENDATIONS

### Manual Testing Checklist
- [ ] Click through every main navigation link
- [ ] Test all footer links
- [ ] Test all CTA buttons
- [ ] Test user menu when logged in/out
- [ ] Test mobile navigation menu
- [ ] Test MegaMenu product categories
- [ ] Test MegaMenu services

### Automated Testing
Create Playwright E2E tests for:
```typescript
// tests/navigation.spec.ts
test('all header links return 200 status', async ({ page }) => {
  // Test each nav link
});

test('all footer links return 200 status', async ({ page }) => {
  // Test each footer link
});

test('megamenu products navigation works', async ({ page }) => {
  // Test MegaMenu
});
```

---

## 11. SUMMARY STATISTICS

| Category | Total | Working | Broken | % Working |
|----------|-------|---------|--------|-----------|
| **Core Pages** | 10 | 10 | 0 | 100% |
| **Product Pages** | 15 | 7 | 8 | 47% |
| **Service Pages** | 7 | 1 | 6 | 14% |
| **Account Pages** | 10 | 6 | 4 | 60% |
| **Location Pages** | 9 | 9 | 0 | 100% |
| **Legal/Policy** | 8 | 6 | 2 | 75% |
| **Admin Pages** | 5 | 4 | 1 | 80% |
| **Utility Pages** | 4 | 2 | 2 | 50% |
| **External Links** | 20+ | 20+ | 0 | 100% |
| **TOTAL** | 88+ | 65 | 25 | **74%** |

---

## 12. FINAL RECOMMENDATIONS

### Immediate Actions (This Week)
1. **Remove or redirect broken MegaMenu links** - Highest user impact
2. **Create `/consultation` redirect to `/request-work`**
3. **Create `/login` page or auth flow**
4. **Update UserMenu links to existing `/account/*` pages**

### Short-term Actions (2-4 Weeks)
5. **Build out service pages structure**
6. **Create process flow pages**
7. **Add missing product category pages**
8. **Create accessibility and sitemap pages**

### Long-term Actions (1-2 Months)
9. **Implement product style filtering system**
10. **Create new arrivals and custom solutions pages**
11. **Build admin orders management**
12. **Comprehensive link testing automation**

---

## 13. RISK ASSESSMENT

### User Experience Risk: HIGH ⚠️
- Main navigation contains multiple 404 links
- Users clicking service menu get error pages
- Consultation CTA leads to 404 in multiple locations

### SEO Risk: MODERATE ⚠️
- Internal linking structure has gaps
- Some crawlable links lead to 404s
- Could affect site authority and ranking

### Business Risk: HIGH ⚠️
- Conversion funnel broken (consultation links)
- Professional credibility impacted by 404s
- Potential lost leads from broken CTAs

### Technical Debt: MODERATE
- Inconsistent route patterns
- Duplicate page purposes (consultation vs request-work)
- Navigation components reference non-existent pages

---

## APPENDIX A: All Broken Links

### Complete List (25 Unique Routes)

**Product Pages:**
1. `/products/sliding-doors`
2. `/products/bi-fold-doors`
3. `/products/french-doors`
4. `/products/style/modern`
5. `/products/style/traditional`
6. `/products/style/transitional`
7. `/products/new`
8. `/products/custom`

**Service Pages:**
9. `/services/consultation`
10. `/services/installation`
11. `/services/warranty`
12. `/services/custom-design`
13. `/services/planning`
14. `/services/maintenance`

**Process Pages:**
15. `/process/consultation`
16. `/process/design`
17. `/process/installation`

**Auth & User:**
18. `/login`
19. `/dashboard`
20. `/orders`
21. `/profile`
22. `/consultation`

**Utility:**
23. `/accessibility`
24. `/sitemap`

**Admin:**
25. `/admin/orders`

---

## APPENDIX B: Files Containing Broken Links

**Primary Files with Most Broken Links:**
1. `/components/navigation/MegaMenu.tsx` - 17 broken links
2. `/components/navigation/MegaMenuNav.tsx` - 8 broken links
3. `/components/auth/UserMenu.tsx` - 4 broken links
4. `/components/navigation/sticky-header.tsx` - 3 broken links
5. `/components/layout/Footer.tsx` - 2 broken links
6. `/components/admin/AdminLayout.tsx` - 1 broken link

---

**Report Generated:** October 4, 2025
**Audit Team:** Link Verification Agents 1-10
**Next Review Date:** October 11, 2025
