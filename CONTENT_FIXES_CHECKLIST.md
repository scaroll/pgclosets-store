# Content Quality Fixes Checklist
**PG Closets Store - Pre-Launch Content Updates**

---

## 🔴 CRITICAL FIXES (Required Before Launch)

### 1. Phone Number Replacements
**Status:** ❌ Not Started
**Priority:** CRITICAL
**Impact:** Customer experience, professionalism

**Current Placeholders to Replace:**
- [ ] `(613) 555-1234` → Real business number
- [ ] `(613) 555-0123` → Real business number
- [ ] `(416) 555-CLOSET` → Real business number
- [ ] `(613) 555-DOOR` → Real business number
- [ ] `1-800-PG-CLOSET` → Real business number or remove
- [ ] `+1 613 555 1234` → Real business number

**Files to Update:**
```bash
# Navigation/Header
- /layout/page-header.tsx (line 222)
- /navigation/mobile-menu.tsx (line 130)
- /components/navigation/mobile-menu.tsx (line 130)

# Footer
- /components/layout/Footer.tsx (lines 142-145)

# Contact Pages
- /components/contact/ContactForm.tsx (line 134)
- /components/conversion/OptimizedContactForm.tsx (line 339)

# Forms
- /components/cta/QuoteRequestCTA.tsx (line 178)
- /components/quote/QuoteContactForm.tsx (line 172)
- /components/quote/QuoteRequestWizard.tsx (line 441)
- /components/quote/renin-quote-form.tsx (line 444)
- /components/booking/measurement-scheduler.tsx (line 401)

# API/Email Templates
- /app/api/bookings/measurement/route.ts (line 77)
- /app/api/quotes/renin/route.ts (line 392)

# Checkout
- /checkout/confirmation/page.tsx (line 169)
- /app/checkout/confirmation/page.tsx (line 174)

# Mobile Components
- /components/mobile/MobileNavigation.tsx (line 257)

# Other
- /app/book-measurement/page.tsx (lines 339, 390)
- /components/trust/TrustBadges.tsx (line 245)
```

**Search Command:**
```bash
grep -r "(613) 555\|(416) 555\|555-" --include="*.tsx" --include="*.ts" /Users/spencercarroll/pgclosets-store-main
```

---

### 2. Pricing Fallback Fix
**Status:** ❌ Not Started
**Priority:** CRITICAL
**Impact:** Revenue, professionalism

**File:** `/pricing.ts`
**Lines:** 20, 27

**Current Code:**
```typescript
return `Price TBD`
```

**Action Required:**
- [ ] Ensure all products in database have `priceMin` value
- [ ] Remove "Price TBD" fallback OR change to more professional message
- [ ] Audit products database for missing prices
- [ ] Test pricing display on all product pages

**Suggested Fix:**
```typescript
// Option 1: Contact for quote
return `Contact for Quote`

// Option 2: More professional
return `Pricing Available on Request`

// Option 3: Remove fallback entirely (fail loudly if price missing)
throw new Error(`Product ${productId} missing price`)
```

---

## 🟡 HIGH PRIORITY FIXES

### 3. SEO Metadata Completion
**Status:** ⏳ In Progress (23/69 pages)
**Priority:** HIGH
**Impact:** SEO, discoverability

**Missing Metadata Pages:** 46 pages

**Action Required:**
- [ ] Identify which pages lack metadata exports
- [ ] Determine if they inherit from layout (acceptable)
- [ ] Add custom metadata to key pages:
  - [ ] All product category pages
  - [ ] All location pages
  - [ ] About page
  - [ ] Services pages
  - [ ] Blog pages
  - [ ] FAQ page

**Command to Find Pages:**
```bash
find /Users/spencercarroll/pgclosets-store-main/app -name "page.tsx" -type f
```

**Template for Adding Metadata:**
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title - PG Closets',
  description: 'Compelling 155-character description...',
  openGraph: {
    title: 'Page Title',
    description: 'Description...',
    url: 'https://www.pgclosets.com/page-path',
  },
}
```

---

### 4. Contact Information Verification
**Status:** ❌ Not Started
**Priority:** HIGH
**Impact:** Trust, customer contact

**Items to Verify:**
- [ ] Business physical address (appears in footer?)
- [ ] Primary email: `info@pgclosets.ca` (verified as real)
- [ ] Secondary email (if needed)
- [ ] Business hours
- [ ] Service area boundaries
- [ ] Emergency contact (if applicable)

**Files to Check:**
- [ ] `/components/layout/Footer.tsx`
- [ ] `/components/contact/ContactForm.tsx`
- [ ] `/app/contact/page.tsx`
- [ ] `/app/about/page.tsx`

---

### 5. Placeholder Image Creation
**Status:** ❌ Not Started
**Priority:** HIGH
**Impact:** Visual polish, error handling

**Required File:** `/public/placeholder.svg`

**Specifications:**
- Dimensions: 800x600px (or appropriate aspect ratio)
- Brand colors from PG Closets palette
- Professional design (not gray box)
- Include subtle "PG Closets" branding
- Optimized file size

**Design Options:**
1. Minimal geometric pattern in brand blue
2. Subtle logo watermark on neutral background
3. "Image Coming Soon" with elegant typography
4. Abstract closet door silhouette

**Usage:** Currently used as fallback in 50+ image components:
```typescript
src={product.image || "/placeholder.svg"}
```

---

## 🟢 MEDIUM PRIORITY ENHANCEMENTS

### 6. Product Description Audit
**Status:** ❌ Not Started
**Priority:** MEDIUM
**Impact:** SEO, conversions

**Actions:**
- [ ] Export all products from database
- [ ] Check which products lack descriptions
- [ ] Use content library templates to generate missing descriptions
- [ ] Verify all products have:
  - [ ] `description` (full)
  - [ ] `shortDescription` (listing)
  - [ ] `features[]` array
  - [ ] `specs` object

**Content Library Available:**
`/lib/content/product-descriptions.ts`

---

### 7. Unique Meta Descriptions
**Status:** ❌ Not Started
**Priority:** MEDIUM
**Impact:** SEO click-through rates

**Target:** All 69 pages

**Requirements:**
- 150-155 characters optimal length
- Include primary keyword
- Compelling call-to-action
- Unique per page (no duplicates)
- Local optimization where relevant

**Format:**
```
[Benefit/Hook]. [Key Feature]. [Location]. [CTA].
```

**Example:**
```
Transform your Ottawa home with premium Renin closet doors.
Professional installation, lifetime warranty. Free quote today.
(154 characters)
```

---

### 8. Alt Text Enhancement Review
**Status:** ✅ Generally Excellent
**Priority:** LOW
**Impact:** SEO, accessibility (already good)

**Spot Check Required:**
- [ ] Review product images for overly generic alt text
- [ ] Enhance category page hero images
- [ ] Verify decorative images have empty alt=""
- [ ] Check gallery images have descriptive alt

**Current Quality:** Already excellent, just verify edge cases.

---

## 📋 Testing Checklist

### Before Launch:
- [ ] Search entire codebase for "555-" to catch any missed placeholders
- [ ] Test all contact forms submit successfully
- [ ] Verify phone number click-to-call functionality
- [ ] Test email links open correctly
- [ ] Check all product pages display prices
- [ ] Verify placeholder image displays correctly
- [ ] Review site in Google Search Console preview
- [ ] Test structured data with Google Rich Results Test

### Commands:
```bash
# Find all placeholder phone numbers
grep -r "555-\|555)" --include="*.tsx" --include="*.ts" .

# Find example emails
grep -r "@example\.com" --include="*.tsx" --include="*.ts" .

# Find TBD or placeholder text
grep -ri "tbd\|todo\|fixme\|placeholder" --include="*.tsx" .

# Check for missing metadata
find ./app -name "page.tsx" -type f -exec grep -L "metadata" {} \;
```

---

## Quick Reference

### Real Business Info to Use:
**Phone:** [YOUR ACTUAL BUSINESS PHONE]
**Email:** info@pgclosets.ca (appears legitimate)
**Address:** [YOUR ACTUAL BUSINESS ADDRESS]
**Service Area:** Greater Ottawa (Kanata, Nepean, Orleans, Barrhaven, etc.)

### Brand Standards:
**Name:** PG Closets (consistent)
**Tagline:** Elevated Taste Without Pretense
**Positioning:** Premium, sophisticated, approachable
**Tone:** Professional without pretense

---

## Progress Tracking

| Fix Item | Status | Assigned | Completed |
|----------|--------|----------|-----------|
| Phone Numbers | ❌ | - | - |
| Pricing Fallback | ❌ | - | - |
| SEO Metadata | ⏳ 33% | - | - |
| Contact Info | ❌ | - | - |
| Placeholder Image | ❌ | - | - |
| Product Descriptions | ❌ | - | - |
| Meta Descriptions | ❌ | - | - |
| Alt Text Review | ✅ 95% | - | - |

**Legend:**
- ❌ Not Started
- ⏳ In Progress
- ✅ Completed
- ⚠️ Blocked

---

## Completion Estimate

**Critical Fixes:** 2-4 hours
**High Priority:** 4-8 hours
**Medium Priority:** 8-12 hours

**Total Pre-Launch:** ~6-12 hours
**Total for Full Quality:** ~14-24 hours

---

**Last Updated:** 2025-10-04
**Owner:** Content Quality Team
**Review Date:** Pre-Launch
