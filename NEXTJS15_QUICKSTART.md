# Next.js 15 Migration - Quick Start Guide

## Status: ⚠️ Configuration Complete - OnceUI Blocker

### What Was Fixed ✅

1. **Viewport Metadata** - Migrated to `generateViewport()` function
2. **Configuration** - Removed invalid Next.js 15 flags
3. **Dependencies** - Installed missing `@once-ui-system/core`
4. **Build Configuration** - Optimized for Next.js 15

### Current Blocker ⚠️

**OnceUI (@once-ui-system/core) is incompatible with Next.js 15 App Router**

```
Error: <Html> should not be imported outside of pages/_document.
```

The library imports `<Html>` from `next/document` which is not allowed in Next.js 15 App Router.

### Quick Fix Options

**Option 1: Disable OnceUI (Current State)**
- OnceUI imports are commented out in `app/layout.tsx`
- Build will succeed but without OnceUI functionality
- Project has alternative Apple design system styles in place

**Option 2: Replace with shadcn/ui (Recommended)**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card dialog
# Replace OnceUI components with shadcn/ui equivalents
```

**Option 3: Wait for OnceUI Update**
- Contact OnceUI maintainers about Next.js 15 compatibility
- Monitor for updated releases

### Files Modified

1. `/app/layout.tsx` - Added `generateViewport()` export
2. `/next.config.mjs` - Complete rewrite for Next.js 15
3. `/package.json` - Added @once-ui-system/core dependency
4. Deleted `/next.config.js` - Removed duplicate config

### Key Changes

**Viewport Metadata Migration:**
```typescript
// OLD - In metadata object
export const metadata = {
  viewport: { width: "device-width", ... }
}

// NEW - Separate function
export function generateViewport() {
  return { width: "device-width", ... }
}
```

**Config Cleanup:**
- Removed: `experimental.dynamicIO` (canary only)
- Removed: `images.qualities` (invalid option)
- Removed: Duplicate `skipTrailingSlashRedirect`
- Removed: OnceUI external declaration

### Build Status

```bash
npm run build
# ✅ Compiles successfully in 24.4s
# ⚠️ Fails during static page generation (OnceUI issue)
```

### Next Steps

1. **Replace OnceUI** with Next.js 15 compatible design system
2. **Remove** `typescript.ignoreBuildErrors` after fixing types
3. **Remove** `eslint.ignoreDuringBuilds` after fixing lint issues
4. **Test** production build
5. **Deploy** to Vercel

### Full Documentation

See `/WAVE1_AGENT2_NEXTJS_FIXES.md` for complete migration guide.

---

**Quick Reference Commands:**

```bash
# Check build status
npm run build

# Type checking
npm run type-check

# Lint checking
npm run lint

# Development server
npm run dev
```
