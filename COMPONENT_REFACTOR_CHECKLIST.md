# Component Refactor Checklist

**Quick reference for refactoring each component to use design tokens**

---

## Priority 1: Critical Components (Week 1)

### ✅ Button Component
**File:** `components/ui/button.tsx`
**Status:** 🔴 NEEDS IMMEDIATE FIX

**Current Issues:**
- Uses `bg-black`, `text-white`, `bg-gray-100` hardcoded
- Border colors hardcoded

**Refactor Checklist:**
- [ ] Line 11: `bg-black` → `bg-pg-neutral-black`
- [ ] Line 11: `text-white` → `text-pg-text-inverse`
- [ ] Line 11: `border-black` → `border-pg-neutral-black`
- [ ] Line 12: `bg-red-600` → `bg-pg-semantic-error`
- [ ] Line 13: `border-black` → `border-pg-neutral-black`
- [ ] Line 15: `bg-gray-100` → `bg-pg-neutral-100`
- [ ] Line 16: `text-black` → `text-pg-text-primary`
- [ ] Line 16: `hover:bg-gray-50` → `hover:bg-pg-surface-secondary`
- [ ] Test all button variants visually
- [ ] Verify brand-primary, brand-secondary, brand-outline variants

**Estimated Time:** 30 minutes
**Impact:** High (used on every page)

---

### ✅ Badge Component
**File:** `components/ui/badge.tsx`
**Status:** 🔴 NEEDS IMMEDIATE FIX

**Current Issues:**
- Uses `navy-900` instead of `pg-navy-900`
- Semantic colors hardcoded

**Refactor Checklist:**
- [ ] Line 9: `navy-900` → `pg-navy-900` (3 instances)
- [ ] Line 10: `sky-500` → `pg-sky-500` (3 instances)
- [ ] Line 13: `bg-green-100` → `bg-pg-semantic-success-light`
- [ ] Line 13: `text-green-800` → `text-pg-semantic-success-dark`
- [ ] Line 13: `border-green-200` → `border-pg-semantic-success`
- [ ] Line 14: `bg-yellow-100` → `bg-pg-semantic-warning-light`
- [ ] Line 14: `text-yellow-800` → `text-pg-semantic-warning-dark`
- [ ] Line 15: `bg-blue-100` → `bg-pg-semantic-info-light`
- [ ] Test on product pages
- [ ] Verify gradient variant renders correctly

**Estimated Time:** 20 minutes
**Impact:** High (used on all product cards)

---

### ✅ Header Component
**File:** `components/PgHeader.tsx`
**Status:** 🟡 NEEDS STANDARDIZATION

**Current Issues:**
- 15 instances of `text-gray-*`
- 8 instances of `border-gray-*`
- Inconsistent hover states

**Refactor Checklist:**
- [ ] Line 71: `bg-white/98` → `bg-pg-surface-primary/98`
- [ ] Line 71: `border-gray-100` → `border-pg-border-light`
- [ ] Line 73: `bg-black text-white` → `bg-pg-neutral-black text-pg-text-inverse`
- [ ] Line 76: `hover:text-gray-200` → `hover:text-pg-text-inverse/80`
- [ ] Line 98: `text-black` → `text-pg-text-primary`
- [ ] Line 101: `text-gray-500` → `text-pg-text-tertiary`
- [ ] Line 108: `text-gray-900` → `text-pg-text-primary`
- [ ] Replace all remaining gray colors (scan entire file)
- [ ] Test mobile menu
- [ ] Test mega menu dropdowns
- [ ] Verify accessibility (focus states)

**Estimated Time:** 45 minutes
**Impact:** Critical (appears on every page)

---

### ✅ Footer Component
**File:** `components/PgFooter.tsx`
**Status:** 🟡 NEEDS STANDARDIZATION

**Current Issues:**
- 18 instances of `text-slate-*`
- Complex gradient backgrounds
- Trust badge colors hardcoded

**Refactor Checklist:**
- [ ] Line 6: `bg-gradient-to-b from-slate-900 to-black` → Use design tokens
- [ ] Line 10: `bg-amber-400` → `bg-pg-semantic-warning`
- [ ] Line 11: `bg-slate-400` → `bg-pg-neutral-400`
- [ ] Line 29: `text-amber-400/60` → `text-pg-semantic-warning/60`
- [ ] Line 32: `text-slate-400` → `text-pg-text-tertiary`
- [ ] Line 40: `bg-slate-800/50` → `bg-pg-neutral-800/50`
- [ ] Line 40: `border-slate-700` → `border-pg-neutral-700`
- [ ] Line 42: `text-slate-300` → `text-pg-text-secondary`
- [ ] Replace all trust badge colors (lines 41-63)
- [ ] Line 68: `text-slate-400` → `text-pg-text-tertiary`
- [ ] Line 116: `text-slate-500` → `text-pg-text-tertiary`
- [ ] Test social links hover states
- [ ] Verify gradient appearance

**Estimated Time:** 60 minutes
**Impact:** Critical (appears on every page)

---

## Priority 2: UI Components (Week 2)

### ✅ Card Component
**File:** `components/ui/card.tsx`
**Status:** 🟢 MOSTLY GOOD

**Current Issues:**
- Inconsistent padding pattern (`py-6` vs `p-6`)

**Refactor Checklist:**
- [ ] Line 20: Change `py-6` → `p-6` in default spacing
- [ ] Verify CardHeader padding doesn't conflict
- [ ] Test all card variants (elevated, premium, interactive)
- [ ] Check responsive behavior

**Estimated Time:** 15 minutes
**Impact:** Medium (used across site)

---

### ✅ Dropdown Menu
**File:** `components/ui/dropdown-menu.tsx`
**Status:** 🔴 NEEDS COMPLETE REFACTOR

**Current Issues:**
- Hardcoded `text-gray-700`, `bg-gray-100`
- No CVA variant support
- Inline styles instead of design tokens

**Refactor Checklist:**
- [ ] Line 16: `bg-white` → `bg-pg-surface-primary`
- [ ] Line 16: `ring-black ring-opacity-5` → Use design token shadow
- [ ] Line 18: `text-gray-700 hover:text-gray-900` → `text-pg-text-secondary hover:text-pg-text-primary`
- [ ] Line 18: `hover:bg-gray-100` → `hover:bg-pg-surface-secondary`
- [ ] Line 23: Same as line 18
- [ ] Line 27: `border-gray-100` → `border-pg-border-light`
- [ ] Convert to CVA pattern (like Button component)
- [ ] Add proper variants (default, primary, destructive)
- [ ] Test in navigation menu

**Estimated Time:** 90 minutes (complete rewrite)
**Impact:** Medium (navigation only)

---

### ✅ Cart Icon
**File:** `components/ui/cart-icon.tsx`
**Status:** 🟡 NEEDS STANDARDIZATION

**Current Issues:**
- Uses undefined colors: `text-charcoal`, `text-navy`, `bg-forest`
- Hover states hardcoded

**Refactor Checklist:**
- [ ] Line 9: `hover:bg-gray-100` → `hover:bg-pg-surface-secondary`
- [ ] Line 11: `text-charcoal` → `text-pg-text-primary` (define charcoal if needed)
- [ ] Line 11: `hover:text-navy` → `hover:text-pg-navy-800`
- [ ] Line 13: `bg-forest` → `bg-pg-semantic-success` (define forest if needed)
- [ ] Line 13: `text-white` → `text-pg-text-inverse`
- [ ] Verify cart badge visibility

**Estimated Time:** 20 minutes
**Impact:** Medium (header only)

---

### ✅ Error Boundary
**File:** `components/ui/error-boundary.tsx`
**Status:** 🟡 NEEDS STANDARDIZATION

**Current Issues:**
- Many hardcoded colors for error states
- Inconsistent semantic color usage

**Refactor Checklist:**
- [ ] Line 21: `bg-red-100` → `bg-pg-semantic-error-light`
- [ ] Line 22: `text-red-600` → `bg-pg-semantic-error`
- [ ] Line 25: `text-gray-900` → `text-pg-text-primary`
- [ ] Line 27: `text-gray-600` → `text-pg-text-secondary`
- [ ] Line 30: `bg-blue-600` → `bg-pg-semantic-info`
- [ ] Line 30: `hover:bg-blue-700` → `hover:bg-pg-semantic-info-dark`
- [ ] Line 35: `text-gray-500` → `text-pg-text-tertiary`
- [ ] Line 37: `text-red-600 bg-red-50` → Use error tokens
- [ ] Line 42: `bg-gray-100 text-gray-500` → Use surface tokens
- [ ] Test error display

**Estimated Time:** 30 minutes
**Impact:** Low (only shown on errors)

---

## Priority 3: Page Components (Week 3)

### ✅ About Page
**File:** `app/about/page.tsx`
**Status:** 🔴 HIGH PRIORITY

**Current Issues:**
- 20 instances of `text-slate-*`
- Inconsistent font weights

**Refactor Checklist:**
- [ ] Find all `text-slate-900` → `text-pg-text-primary`
- [ ] Find all `text-slate-600` → `text-pg-text-secondary`
- [ ] Find all `text-slate-500` → `text-pg-text-tertiary`
- [ ] Replace `font-extralight` → `font-light`
- [ ] Standardize button colors
- [ ] Test hero section
- [ ] Test stats section
- [ ] Test values section

**Estimated Time:** 45 minutes
**Impact:** High (key marketing page)

---

### ✅ Home Page
**File:** `app/page.tsx` or `app/ClientHomePage.tsx`
**Status:** 🔴 HIGH PRIORITY

**Current Issues:**
- Hero section with hardcoded colors
- CTA buttons with mixed styles

**Refactor Checklist:**
- [ ] Audit entire file for color usage
- [ ] Replace all `text-gray-*` and `text-slate-*`
- [ ] Standardize CTA button variants
- [ ] Fix hero gradient if present
- [ ] Test all sections
- [ ] Verify mobile responsiveness

**Estimated Time:** 60 minutes
**Impact:** Critical (first impression)

---

### ✅ Product Pages
**Files:** `app/products/**/page.tsx` (multiple)
**Status:** 🟡 BULK REFACTOR NEEDED

**Current Issues:**
- Inconsistent product card styling
- Badge colors vary by page
- Price displays use different styles

**Refactor Checklist:**
- [ ] Identify common patterns
- [ ] Create reusable ProductCard component (if not exists)
- [ ] Standardize price display
- [ ] Standardize badge usage (in-stock, sale, etc.)
- [ ] Fix gradient backgrounds
- [ ] Test product grid layout
- [ ] Verify filters work

**Estimated Time:** 2-3 hours (bulk work)
**Impact:** High (revenue pages)

---

## CSS Files to Update

### ✅ Global Styles
**File:** `styles/globals.css`
**Status:** 🟢 MOSTLY GOOD (uses CSS variables)

**Refactor Checklist:**
- [ ] Verify all CSS custom properties reference design tokens
- [ ] Remove any hardcoded hex values
- [ ] Test dark mode variables (if applicable)

**Estimated Time:** 15 minutes
**Impact:** Site-wide

---

### ✅ Critical CSS
**File:** `styles/critical.css`
**Status:** 🟡 HAS HEX CODES

**Refactor Checklist:**
- [ ] Find all hex codes
- [ ] Replace with CSS variables
- [ ] Test above-the-fold rendering
- [ ] Verify performance

**Estimated Time:** 30 minutes
**Impact:** Performance-critical

---

### ✅ Luxury Design
**File:** `styles/luxury-design.css`
**Status:** 🟡 HAS HEX CODES

**Refactor Checklist:**
- [ ] Replace gradient hex codes with variables
- [ ] Standardize luxury effects
- [ ] Test premium sections

**Estimated Time:** 30 minutes
**Impact:** Medium (specialty pages)

---

## Testing Checklist (After Each Refactor)

### Visual Testing
- [ ] Component renders correctly
- [ ] Hover states work
- [ ] Focus states visible
- [ ] Mobile responsive
- [ ] Dark mode (if applicable)

### Functional Testing
- [ ] Click handlers work
- [ ] Forms submit
- [ ] Navigation functions
- [ ] No console errors

### Accessibility Testing
- [ ] Color contrast meets WCAG AA
- [ ] Focus visible for keyboard
- [ ] Screen reader labels present
- [ ] Touch targets ≥44px

### Build Testing
- [ ] `npm run build` succeeds
- [ ] `npm run type-check` passes
- [ ] No TypeScript errors
- [ ] No Tailwind warnings

---

## Automated Testing Scripts

### Run Before Committing

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build

# Visual regression (if configured)
npm run test:visual
```

---

## Completion Tracking

### Week 1 (P1 Critical)
- [ ] Button Component
- [ ] Badge Component
- [ ] Header Component
- [ ] Footer Component

### Week 2 (P2 High)
- [ ] Card Component
- [ ] Dropdown Menu
- [ ] Cart Icon
- [ ] Error Boundary

### Week 3 (P3 Pages)
- [ ] Home Page
- [ ] About Page
- [ ] Product Pages (bulk)

### Week 4 (Polish)
- [ ] Global CSS
- [ ] Critical CSS
- [ ] Luxury Design CSS
- [ ] Visual regression testing

---

## Notes & Questions

### Decisions Made
- [ ] Font extralight: ADD to tokens / REMOVE usage (circle one)
- [ ] Gray standardization: Use `neutral-*` everywhere (Y/N)
- [ ] Semantic colors: Keep all 8 variants (Y/N)

### Issues Encountered
- Document any breaking changes here
- Note any components that need redesign
- Flag accessibility issues

---

**Progress:** 0/20 components refactored
**Last Updated:** 2025-10-04
**Owner:** Design Cohesion Team
