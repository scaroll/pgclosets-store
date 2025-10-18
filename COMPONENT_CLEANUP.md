# Component Cleanup Recommendations

## Duplicate Component Files

### ClientPage Variants
**Current Active**: `app/ClientPage.tsx` (used by `app/page.tsx`)
**Duplicates to Remove**:
- `app/ClientPage.optimized.tsx` - Optimized version, can be deleted if not needed
- `app/ClientHomePage.tsx` - Legacy version, can be deleted

**Action**: Review and delete unused variants after confirming current version works

### Contact Form Variants
**Duplicates Found**:
- `app/contact/ContactClientPage.tsx`
- `app/contact/FallbackContactForm.tsx`

**Action**: Consolidate into single contact form component

### Product Components
Multiple product-related components across directories:
- `components/products/`
- `components/store/`
- Individual product page components

**Action**: Standardize in `components/products/` directory

## Directory Structure Recommendations

### Recommended Structure
```
components/
├── products/          # All product-related components
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductDetail.tsx
│   └── RelatedProducts.tsx
├── quotes/            # All quote/form components
│   ├── QuoteForm.tsx
│   ├── QuoteModal.tsx
│   └── QuickQuote.tsx
├── navigation/        # Navigation components
│   ├── Header.tsx
│   ├── MegaMenu.tsx
│   └── MobileMenu.tsx
└── ui/               # Base UI components (shadcn)
```

### Testing Libraries Consolidation

**Current State**: Multiple testing setups
- Jest (package.json)
- Vitest (package.json)
- Playwright (package.json)

**Recommendation**:
- Use **Playwright** for E2E testing
- Use **Vitest** for unit/component testing (faster than Jest)
- Remove Jest to reduce confusion

**Package Changes Needed**:
```bash
npm uninstall jest @types/jest
npm install -D vitest @vitejs/plugin-react
```

## Dependency Cleanup

### Duplicate Dependencies
- `@vercel/analytics` in both dependencies and devDependencies
  - **Fix**: Move to devDependencies only

### Version Pinning
Several packages using `latest`:
- `@mikro-orm/*` packages
- `@opentelemetry/*` packages
- `@radix-ui/react-dropdown-menu`

**Recommendation**: Pin to specific versions for stability

### Example package.json Changes
```json
{
  "dependencies": {
    "@mikro-orm/core": "^6.0.0",
    "@radix-ui/react-dropdown-menu": "^2.1.1"
  },
  "devDependencies": {
    "@vercel/analytics": "^1.5.0"
  }
}
```

## Priority Actions

### High Priority (Delete After Verification)
1. ✅ Verify `app/ClientPage.tsx` works properly
2. 🗑️ Delete `app/ClientPage.optimized.tsx`
3. 🗑️ Delete `app/ClientHomePage.tsx`
4. 🗑️ Consolidate contact forms

### Medium Priority (Next Sprint)
5. Consolidate testing libraries (remove Jest)
6. Pin dependency versions
7. Move @vercel/analytics to devDependencies
8. Reorganize component directories

### Low Priority (Technical Debt)
9. Create shared product component library
10. Standardize form components
11. Add component documentation