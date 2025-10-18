# PG Closets - Quick Design Fix Guide

**For Developers:** Fast reference for fixing design consistency issues

---

## Color Replacement Cheat Sheet

### Text Colors

```tsx
// ❌ WRONG → ✅ CORRECT

// Primary text (headings, body)
text-gray-900   → text-pg-text-primary
text-slate-900  → text-pg-text-primary
text-black      → text-pg-text-primary

// Secondary text (subheadings, labels)
text-gray-600   → text-pg-text-secondary
text-slate-600  → text-pg-text-secondary
text-gray-700   → text-pg-text-secondary

// Tertiary text (captions, metadata)
text-gray-500   → text-pg-text-tertiary
text-slate-500  → text-pg-text-tertiary

// Disabled text
text-gray-400   → text-pg-text-disabled

// Link text
text-blue-600   → text-pg-text-link
hover:text-blue-700 → hover:text-pg-text-link-hover

// White text
text-white      → text-pg-text-inverse
```

### Background Colors

```tsx
// ❌ WRONG → ✅ CORRECT

// Surfaces
bg-white        → bg-pg-surface-primary
bg-gray-50      → bg-pg-surface-secondary
bg-gray-100     → bg-pg-surface-tertiary
bg-slate-50     → bg-pg-surface-secondary

// Brand colors
bg-black        → bg-pg-neutral-black
bg-navy-900     → bg-pg-navy-900
bg-sky-500      → bg-pg-sky-500

// Semantic (alerts, badges, status)
bg-green-100    → bg-pg-semantic-success-light
bg-green-800    → bg-pg-semantic-success-dark
bg-red-100      → bg-pg-semantic-error-light
bg-red-800      → bg-pg-semantic-error-dark
bg-yellow-100   → bg-pg-semantic-warning-light
bg-amber-100    → bg-pg-semantic-warning-light
bg-blue-100     → bg-pg-semantic-info-light
```

### Border Colors

```tsx
// ❌ WRONG → ✅ CORRECT

border-gray-100   → border-pg-border-light
border-gray-200   → border-pg-border
border-slate-200  → border-pg-border
border-gray-400   → border-pg-border-dark
border-blue-500   → border-pg-border-focus (for focus states)
```

---

## Font Weight Standardization

```tsx
// ❌ AVOID (not in design tokens)
font-extralight

// ✅ USE (from design tokens)
font-light      // 300
font-normal     // 400 (default)
font-medium     // 500
font-semibold   // 600
font-bold       // 700
```

**Decision Needed:** Add `font-extralight: 200` to design tokens OR replace all with `font-light`

---

## Letter Spacing

```tsx
// ❌ WRONG (custom values)
tracking-[0.2em]
tracking-[0.3em]
tracking-[0.15em]

// ✅ CORRECT (design tokens)
tracking-tight    // -0.025em
tracking-normal   // 0
tracking-wide     // 0.025em
tracking-wider    // 0.05em
tracking-widest   // 0.1em
```

---

## Component-Specific Fixes

### Button Component

**File:** `components/ui/button.tsx`

```tsx
// ❌ Current
variant: {
  default: "bg-black text-white border-black",
  secondary: "bg-gray-100 text-black",
  ghost: "text-black hover:bg-gray-50",
}

// ✅ Fixed
variant: {
  default: "bg-pg-neutral-black text-pg-text-inverse border-pg-neutral-black",
  secondary: "bg-pg-neutral-100 text-pg-text-primary",
  ghost: "text-pg-text-primary hover:bg-pg-surface-secondary",
}
```

### Badge Component

**File:** `components/ui/badge.tsx`

```tsx
// ❌ Current
"brand-primary": "bg-navy-900/10 text-navy-900 border-navy-900/20",
"brand-accent": "bg-sky-500/20 text-navy-900 border-sky-500/30",
success: "bg-green-100 text-green-800 border-green-200",

// ✅ Fixed
"brand-primary": "bg-pg-navy-900/10 text-pg-navy-900 border-pg-navy-900/20",
"brand-accent": "bg-pg-sky-500/20 text-pg-text-primary border-pg-sky-500/30",
success: "bg-pg-semantic-success-light text-pg-semantic-success-dark border-pg-semantic-success",
```

### Card Component

**File:** `components/ui/card.tsx`

```tsx
// ❌ Current
spacing: {
  default: "py-6",  // Only vertical padding
}

// ✅ Fixed
spacing: {
  default: "p-6",   // All sides padding for consistency
}
```

---

## Search & Replace Commands

### Safe Automated Replacements

```bash
# STEP 1: Text colors (safest)
find app components -name "*.tsx" -type f -exec sed -i '' \
  -e 's/text-gray-900\b/text-pg-text-primary/g' \
  -e 's/text-gray-600\b/text-pg-text-secondary/g' \
  -e 's/text-gray-500\b/text-pg-text-tertiary/g' \
  -e 's/text-slate-900\b/text-pg-text-primary/g' \
  -e 's/text-slate-600\b/text-pg-text-secondary/g' \
  {} +

# STEP 2: Background colors (test first!)
find app components -name "*.tsx" -type f -exec sed -i '' \
  -e 's/bg-gray-50\b/bg-pg-surface-secondary/g' \
  -e 's/bg-gray-100\b/bg-pg-surface-tertiary/g' \
  {} +

# STEP 3: Border colors
find app components -name "*.tsx" -type f -exec sed -i '' \
  -e 's/border-gray-200\b/border-pg-border/g' \
  {} +
```

**⚠️ IMPORTANT:**
1. Commit your code first
2. Test on ONE file manually
3. Run `git diff` after each step
4. Run `npm run build` to check for errors
5. Visual regression test before committing

---

## Testing After Changes

### Quick Visual Check

```bash
# Start dev server
npm run dev

# Check these pages:
# 1. Home page (/)
# 2. Products page (/products)
# 3. About page (/about)
# 4. Contact page (/contact)
```

### Build Check

```bash
npm run build
npm run type-check
npm run lint
```

### Visual Regression (if set up)

```bash
npm run test:visual
```

---

## File Priority List

Fix in this order for maximum impact:

### Week 1 - Critical Components
1. ✅ `components/ui/button.tsx` (highest visibility)
2. ✅ `components/ui/badge.tsx` (product pages)
3. ✅ `components/PgHeader.tsx` (every page)
4. ✅ `components/PgFooter.tsx` (every page)

### Week 2 - High-Traffic Pages
5. ✅ `app/page.tsx` (homepage)
6. ✅ `app/products/page.tsx`
7. ✅ `app/about/page.tsx`
8. ✅ `app/contact/page.tsx`

### Week 3 - Remaining Pages
9. All product category pages (`app/products/*/page.tsx`)
10. Service pages
11. Specialty pages

---

## Common Patterns to Look For

### Pattern 1: Hero Sections

```tsx
// ❌ BEFORE
<h1 className="text-5xl font-extralight text-slate-900">
  Welcome to PG Closets
</h1>
<p className="text-xl text-slate-600">
  Quality closet solutions
</p>

// ✅ AFTER
<h1 className="text-5xl font-light text-pg-text-primary">
  Welcome to PG Closets
</h1>
<p className="text-xl text-pg-text-secondary">
  Quality closet solutions
</p>
```

### Pattern 2: Status Badges

```tsx
// ❌ BEFORE
<span className="bg-green-100 text-green-800 px-2 py-1 rounded">
  In Stock
</span>

// ✅ AFTER
<Badge variant="success">
  In Stock
</Badge>
```

### Pattern 3: Dividers

```tsx
// ❌ BEFORE
<div className="border-t border-gray-200" />

// ✅ AFTER
<div className="border-t border-pg-border" />
```

---

## Design Token Reference

### Complete Token Map

```typescript
// Text Colors
text-pg-text-primary      // #1c1917 (black-ish)
text-pg-text-secondary    // #57534e (dark gray)
text-pg-text-tertiary     // #78716c (medium gray)
text-pg-text-inverse      // #ffffff (white)
text-pg-text-disabled     // #a8a29e (light gray)
text-pg-text-link         // #1e3a5f (navy)
text-pg-text-link-hover   // #334e68 (lighter navy)

// Background Colors
bg-pg-surface-primary     // #ffffff
bg-pg-surface-secondary   // #fafaf9
bg-pg-surface-tertiary    // #f5f5f4
bg-pg-surface-elevated    // #ffffff (with shadow)

// Brand Colors
bg-pg-navy-{50-900}       // Navy scale
bg-pg-sky-{50-900}        // Sky blue scale
bg-pg-neutral-{50-900}    // Neutral gray scale

// Semantic Colors
bg-pg-semantic-success[-light/-dark]
bg-pg-semantic-warning[-light/-dark]
bg-pg-semantic-error[-light/-dark]
bg-pg-semantic-info[-light/-dark]

// Border Colors
border-pg-border-light    // #e7e5e4
border-pg-border          // #d6d3d1
border-pg-border-dark     // #a8a29e
border-pg-border-focus    // #87CEEB
```

---

## VSCode Snippets (Optional)

Add to `.vscode/settings.json`:

```json
{
  "tailwindCSS.experimental.classRegex": [
    ["className\\s*[=:]\\s*['\"`]([^'\"`)]*)['\"`]", "['\"`]([^'\"`)]*)['\"`]"]
  ],
  "tailwindCSS.lint.invalidApply": "error",
  "tailwindCSS.lint.cssConflict": "warning"
}
```

Add to `.vscode/pg-closets.code-snippets`:

```json
{
  "PG Text Primary": {
    "prefix": "pg-text",
    "body": "text-pg-text-primary",
    "description": "Primary text color"
  },
  "PG Background": {
    "prefix": "pg-bg",
    "body": "bg-pg-surface-primary",
    "description": "Primary surface background"
  }
}
```

---

## Rollback Plan

If something breaks:

```bash
# Rollback specific file
git checkout HEAD -- path/to/file.tsx

# Rollback all changes
git reset --hard HEAD

# Rollback to specific commit
git reset --hard <commit-hash>
```

---

## Getting Help

- 📖 Full audit report: `DESIGN_COHESION_AUDIT_REPORT.md`
- 🎨 Design tokens: `lib/design-system/tokens.ts`
- 🔧 Tailwind config: `tailwind.config.ts`
- 💬 Questions: Ask in #design-system Slack channel

---

**Last Updated:** 2025-10-04
**Version:** 1.0
**Owner:** Design Cohesion Team
