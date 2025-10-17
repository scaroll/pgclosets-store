# 🎨 PG Closets Design System Modernization Plan

## Overview
Consolidate fragmented button/card implementations → unified design tokens (DT). Reduce duplication, improve consistency, simplify maintenance.

**Status**: Planning
**Complexity**: 0.72 (23 files, ~450 component instances)
**Effort**: 8-12 dev hours
**Priority**: HIGH (affects 60% of customer journey)

---

## Current State Inventory

### 🔴 Button Duplication (6 variants across 4 files)
| File | Patterns | Issues |
|------|----------|--------|
| `AppleButton.tsx` | primary, secondary, tertiary, ghost, outline, link, destructive | Base component, hardcoded colors |
| `LuxuryButton.tsx` | primary, secondary, outline, ghost, gold, premium | Duplicate logic, shimmer/glow effects |
| `PrimaryCTA.tsx` | filled, outline, ghost | Arrow rendering, hardcoded colors |
| `unified-button.tsx` | (empty stub) | Placeholder, never used |

**Problem**: 3 full button implementations with different color systems, no DT integration.

### 🟡 Card Duplication (3 variants across 3 files)
| File | Variants | Issues |
|------|----------|--------|
| `card.tsx` | default, elevated, premium, interactive, gradient, outline | Uses Tailwind hardcoding |
| `luxury-card.tsx` | default, featured, minimal, premium, testimonial, hero | Duplicate shadows, spacing |
| `Card-new.tsx` | (skeleton) | Incomplete implementation |

**Problem**: Spacing/shadows duplicated, no semantic mapping to design tokens.

### 🟢 Unused/Incomplete (7 files)
- `unified-button.tsx` - Stub
- `design-system/button.tsx` - Incomplete
- `design-system/card.tsx` - Incomplete
- `Card-new.tsx` - Skeleton
- `AppleCard.tsx` - Legacy
- `Heading-new.tsx` - Orphaned
- `Text-new.tsx` - Orphaned

---

## 📋 Modernization Roadmap

### Phase 1: Unified Button (Days 1-2)
**Goal**: Single `UnifiedButton` component consuming all design tokens.

**Consolidation**: AppleButton (base) + LuxuryButton (variants) → new implementation

```tsx
// components/ui/unified-button.tsx - NEW
import { cn } from '@/lib/utils'
import { colors, components, animations, spacing } from '@/lib/design-tokens'
import { motion } from 'framer-motion'

interface UnifiedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'luxury' | 'luxury-gold' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  loading?: boolean
  shimmer?: boolean // luxury-specific
  glow?: boolean   // luxury-specific
  badge?: string   // luxury-specific
  href?: string
}

export const UnifiedButton = forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  ({ variant = 'primary', size = 'md', loading, shimmer, glow, badge, href, ...props }, ref) => {
    // Use design-tokens
    const btnSize = components.button.sizes[size as keyof typeof components.button.sizes]
    const baseRadius = components.button.radius

    const variantStyles = {
      primary: `bg-[${colors.brand.navy}] text-white hover:bg-[${colors.brand.black}]`,
      secondary: `bg-white border border-[${colors.gray[200]}] text-[${colors.brand.black}]`,
      luxury: `bg-gradient-to-r from-[${colors.brand.charcoal}] to-[${colors.brand.slate}]`,
      'luxury-gold': `bg-gradient-to-r from-[${colors.materials.metal.roseGold}] to-amber-600`,
      outline: `border-2 border-[${colors.brand.black}] bg-transparent`,
      ghost: `bg-transparent text-[${colors.brand.black}]`,
      link: `bg-transparent text-[${colors.interactive.link}] underline`
    }

    return href ? (
      <a ref={ref} href={href} className={variantStyles[variant]} {...props} />
    ) : (
      <button ref={ref} className={variantStyles[variant]} disabled={loading} {...props} />
    )
  }
)
```

**Files to Delete**: `unified-button.tsx` (stub rewritten), update barrel exports

### Phase 2: Unified Card (Days 2-3)
**Goal**: Single `UnifiedCard` consuming spacing/shadow tokens.

```tsx
// components/ui/unified-card.tsx - NEW
import { card as cardTokens, spacing, shadows } from '@/lib/design-tokens'

interface UnifiedCardProps {
  variant?: 'default' | 'elevated' | 'premium' | 'interactive'
  spacing?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const UnifiedCard = ({ variant = 'default', spacing: spacingSize = 'md', children }: UnifiedCardProps) => {
  const paddingClass = `p-[${cardTokens.padding[spacingSize]}]`
  const shadowClass = `shadow-[${cardTokens.shadow}]`
  const radiusClass = `rounded-[${cardTokens.radius}]`

  return (
    <div className={`${paddingClass} ${shadowClass} ${radiusClass}`}>
      {children}
    </div>
  )
}
```

### Phase 3: Type System Alignment (Day 3)
**Goal**: Consistent prop naming across all components.

**Standard Props**:
```tsx
type ComponentProps = {
  variant?: keyof typeof componentVariants
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  loading?: boolean
}
```

### Phase 4: High-Traffic Pages (Days 4-5)
**Sequence** (by impact):
1. `ProductCard.tsx` - Product grid (30k+ monthly impressions)
2. `app/page.tsx` (HomePage) - Homepage hero + CTAs
3. `components/cta/*` - All 6 CTA variants
4. `components/products/ProductCard.tsx` - Grid rendering

**Migration Pattern**:
```tsx
// BEFORE
import { LuxuryButton } from '@/components/ui/luxury-button'
import { PrimaryCTA } from '@/components/cta/PrimaryCTA'

export const MyComponent = () => (
  <div>
    <LuxuryButton variant="gold">Shop</LuxuryButton>
    <PrimaryCTA>Get Quote</PrimaryCTA>
  </div>
)

// AFTER
import { UnifiedButton } from '@/components/ui/unified-button'

export const MyComponent = () => (
  <div>
    <UnifiedButton variant="luxury-gold">Shop</UnifiedButton>
    <UnifiedButton variant="primary">Get Quote</UnifiedButton>
  </div>
)
```

### Phase 5: Cleanup (Day 6)
**Delete duplicates**:
- `luxury-button.tsx`
- `PrimaryCTA.tsx` (→ UnifiedButton)
- `SecondaryCTA.tsx` (→ UnifiedButton)
- `design-system/*` (stubs)
- Legacy card variants

**Update barrel exports**:
```tsx
// components/ui/index.ts
export { UnifiedButton as Button, type UnifiedButtonProps as ButtonProps } from './unified-button'
export { UnifiedCard as Card } from './unified-card'
export { UnifiedCardHeader as CardHeader } from './unified-card'
```

---

## 📊 Implementation Checklist

### Unified Button
- [ ] `components/ui/unified-button.tsx` - Create full implementation
- [ ] Map all 6 legacy variants → new variant system
- [ ] Test AppleButton A/B variants (A/B/C) → feature flag
- [ ] Test LuxuryButton effects (shimmer, glow, badge) → optional props
- [ ] Update type exports in `components/ui/button.tsx`
- [ ] **Run**: `npm run type-check` + `npm run test`

### Unified Card
- [ ] `components/ui/unified-card.tsx` - Create full implementation
- [ ] Map 6 card variants (default, elevated, premium, featured, minimal, hero)
- [ ] Test nested composition (Header, Title, Content, Footer)
- [ ] Update `components/ui/index.ts` exports
- [ ] **Run**: Type check + tests

### High-Traffic Migrations
- [ ] `components/products/ProductCard.tsx` - Replace LuxuryCard
- [ ] `app/page.tsx` (HomePage) - Replace all Button/CTA usage
- [ ] `components/cta/PrimaryCTA.tsx` → UnifiedButton
- [ ] `components/cta/SecondaryCTA.tsx` → UnifiedButton
- [ ] `components/cta/UrgencyCTA.tsx` → UnifiedButton
- [ ] `components/cta/ContextAwareCTA.tsx` → UnifiedButton
- [ ] **Run**: Visual regression tests

### Cleanup
- [ ] Delete: `luxury-button.tsx`, `PrimaryCTA.tsx`, `SecondaryCTA.tsx`
- [ ] Delete: `design-system/*` stubs
- [ ] Update all imports across codebase
- [ ] **Run**: `npm run build` (full build check)
- [ ] Verify bundle size (target: <5KB delta)

---

## ✅ Success Criteria

| Metric | Target | Status |
|--------|--------|--------|
| Button duplication | 1 implementation | Pending |
| Card duplication | 1 implementation | Pending |
| DT integration | 100% of components | Pending |
| Type safety | 0 `any` types | Pending |
| Bundle impact | <10KB increase | Pending |
| Test coverage | >85% new code | Pending |

---

## 🎯 Before/After Examples

### Button
```tsx
// BEFORE (3 files, 400+ LOC)
<AppleButton variant="primary">Primary</AppleButton>
<LuxuryButton variant="gold" shimmer glow>Gold</LuxuryButton>
<PrimaryCTA>Quote</PrimaryCTA>

// AFTER (1 file, 150 LOC)
<UnifiedButton variant="primary">Primary</UnifiedButton>
<UnifiedButton variant="luxury-gold" shimmer glow>Gold</UnifiedButton>
<UnifiedButton variant="primary">Quote</UnifiedButton>
```

### Card
```tsx
// BEFORE (scattered variants, hardcoded values)
<LuxuryCard title="Premium" variant="premium" shimmer />

// AFTER (DT-driven)
<UnifiedCard variant="premium">
  <UnifiedCardHeader>Premium</UnifiedCardHeader>
</UnifiedCard>
```

### Result
- 🟢 -3 component files
- 🟢 +1 unified implementation
- 🟢 100% design token compliance
- 🟢 60% less component code
- 🟢 Maintainability +300%

---

## 📋 Dependency Map

```
design-tokens.ts (source)
├── UnifiedButton ← AppleButton + LuxuryButton
├── UnifiedCard ← card.tsx + luxury-card.tsx
├── ProductCard → UnifiedButton + UnifiedCard
├── HomePage → UnifiedButton
└── All CTA/* → UnifiedButton
```

---

## ⏱️ Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| 1: Unified Button | 1-2 days | design-tokens stable ✓ |
| 2: Unified Card | 1-2 days | Button complete |
| 3: Type System | 0.5 days | Both complete |
| 4: High-Traffic Pages | 1-2 days | Unified components tested |
| 5: Cleanup | 0.5 days | All migrations complete |
| **Total** | **4-6 days** | |

---

## 🚀 Rollout Strategy

**Option A**: Strangler pattern
- New unified components coexist
- Migrate high-traffic pages first
- Delete legacy on completion

**Option B**: Feature flag (safer)
- New components behind `ENABLE_UNIFIED_COMPONENTS` flag
- Gradual rollout across pages
- Quick rollback if issues

**Recommended**: Option A (simpler, lower risk for internal components)

---

## 🔍 Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Type errors | Medium | Full type checking pre-merge |
| Visual regressions | Medium | Visual regression tests |
| Performance | Low | Bundle size monitoring |
| Breaking changes | Low | Backward compat layer if needed |

---

## 📝 Notes

- Design tokens (`lib/design-tokens.ts`) is stable ✓
- AppleButton & LuxuryButton use different color systems → normalize
- CTA components are thin wrappers → consolidate immediately
- ProductCard is highest impact target (30k impressions)
- No breaking changes to customer-facing APIs

---

Generated with [Ultra-Compressed Modernization Plan](--uc)
