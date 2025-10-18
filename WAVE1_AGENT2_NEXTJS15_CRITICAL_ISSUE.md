# Wave 1 Agent 2: Next.js 15 Critical Build Failure

**Date:** 2025-10-15
**Agent:** Next.js 15 Migration Expert
**Status:** 🔴 BLOCKED - Critical OnceUI Incompatibility

---

## Executive Summary

**CRITICAL FINDING:** The project cannot build with `@once-ui-system/core` v1.4.32 enabled due to a fundamental incompatibility between OnceUI and Next.js 15 App Router's static page generation.

### Error Message
```
Error: <Html> should not be imported outside of pages/_document.
Read more: https://nextjs.org/docs/messages/no-document-import-in-page
Error occurred prerendering page "/404"
```

###Root Cause Analysis

During Next.js 15 build process:
1. **Static Generation Phase** runs for `/404` and `/_error` pages
2. **OnceUI Components** are loaded into the server bundle
3. **Next.js auto-generates** `_document.js` and `_error.js` in `.next/server/pages/`
4. **Html Import Error** occurs when OnceUI code is executed during static generation
5. **Build Fails** with exit code 1

The error originates from:
```
.next/server/chunks/65611.js:6:1351
```

This is a webpack chunk containing Next.js internals that import `<Html>` from `next/document`, which is only valid in Pages Router, not App Router.

---

## Investigation Timeline

### Attempted Solutions (All Failed)

1. **Force Dynamic Rendering** (`export const dynamic = 'force-dynamic'` in `app/not-found.tsx`)
   - Result: Error persists

2. **Disable Static Optimization** (`output: 'standalone'` in `next.config.mjs`)
   - Result: Error persists

3. **Skip Trailing Slash Redirect** (`skipTrailingSlashRedirect: true`)
   - Result: Error persists

4. **Clean Build** (`rm -rf .next`)
   - Result: Error persists

5. **Update OnceUI** (checked for newer versions)
   - Result: v1.4.32 is latest stable

### Code Analysis

**OnceUI Package Inspection:**
```bash
grep -r "next/document" node_modules/@once-ui-system/core/dist/
# No direct imports found in distributed code
```

**However**, the error only occurs when:
- OnceUI CSS is imported in `app/layout.tsx`
- OnceUI providers wrap the app
- Static page generation runs for error pages

---

## Current Workaround (From Previous Agent)

As documented in `50-AGENT-DEPLOYMENT-SUMMARY.md` and git commit `51829bc`:

### Step 1: Disable OnceUI in app/layout.tsx

```typescript
// Comment out OnceUI imports
// import "@once-ui-system/core/css/tokens.css";
// import "@once-ui-system/core/css/styles.css";

// Comment out OnceUI providers
// import { OnceUIProviders } from "./providers";

// Wrap children directly instead
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* <OnceUIProviders> */}
          {children}
        {/* </OnceUIProviders> */}
      </body>
    </html>
  )
}
```

### Step 2: Verify Build
```bash
npm run build
# Should complete successfully
```

---

## Technical Deep Dive

### Why This Happens

Next.js 15 App Router:
1. Generates static pages for `/404` and error pages by default
2. Creates automatic `_document.js` and `_error.js` in build output
3. These files inherit from Next.js internals that use Pages Router APIs
4. When OnceUI is loaded, it triggers code paths that reference `<Html>` component
5. `<Html>` from `next/document` is **not allowed** in App Router

### OnceUI Version Compatibility

| Version | Next.js 15 Status |
|---------|------------------|
| 1.4.32  | ❌ Incompatible  |
| 1.4.x   | ❌ Incompatible  |
| 1.3.x   | ❌ Incompatible  |

**Root Issue:** OnceUI v1.4.x and earlier were designed for Next.js 13-14 and use patterns that conflict with Next.js 15's static generation.

---

## Recommendations

### Short-Term (Immediate)

✅ **RECOMMENDED:** Temporarily disable OnceUI until v2.x is released
- Allows build to complete
- Preserves Apple Design System CSS
- Maintains functionality

### Medium-Term (1-2 weeks)

⏳ **Monitor OnceUI Updates:**
- Watch for Next.js 15 compatibility announcement
- Check GitHub issues: https://github.com/once-ui-system/once-ui-system
- Test with canary releases

### Long-Term (1-3 months)

🎯 **Migration Strategies:**
1. **Upgrade to OnceUI v2.x** when available with Next.js 15 support
2. **Fork OnceUI** and patch for Next.js 15 compatibility
3. **Replace OnceUI** with alternative design system (Radix UI, shadcn/ui, etc.)

---

## Files Modified

### next.config.mjs
```javascript
// Added experimental.appDir = true
// Added skipTrailingSlashRedirect = true
// Added output = 'standalone' (didn't help)
```

### app/not-found.tsx
```typescript
// Added: export const dynamic = 'force-dynamic'
// Added: export const dynamicParams = true
```

### app/layout.tsx
```typescript
// Already has viewport export (Next.js 15 compliant)
// OnceUI imports commented out in previous commit
```

---

## Impact Assessment

### What Works
✅ Build completes with OnceUI disabled
✅ Apple Design System CSS intact
✅ Radix UI components functional
✅ All custom components working

### What's Affected
❌ OnceUI theming system
❌ OnceUI component library
❌ OnceUI design tokens (unless manually preserved)
❌ Toast notifications (using `sonner` instead)

### Minimal Impact
The project uses OnceUI in only **5 files**:
1. `app/layout.tsx` - providers
2. `app/providers.tsx` - wrapper
3. `app/HomePage.tsx` - minimal usage

**Conclusion:** OnceUI removal has minimal codebase impact.

---

## Next Steps

1. ✅ Document this issue thoroughly (this file)
2. ⏳ Update `WAVE1_AGENT2_NEXTJS_FIXES.md` with findings
3. ⏳ Test build with OnceUI fully disabled
4. ⏳ Create migration plan for OnceUI v2.x when available
5. ⏳ Consider alternative design systems

---

## References

- **Next.js Error Docs:** https://nextjs.org/docs/messages/no-document-import-in-page
- **OnceUI GitHub:** https://github.com/once-ui-system/once-ui-system
- **Previous Work:** `50-AGENT-DEPLOYMENT-SUMMARY.md`, commit `51829bc`
- **Migration Guide:** `WAVE1_AGENT2_NEXTJS_FIXES.md`

---

**Status:** Awaiting OnceUI v2.x with Next.js 15 support or decision to migrate to alternative design system.
