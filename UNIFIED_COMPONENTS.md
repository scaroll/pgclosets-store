# 🔧 Unified Components - Critical Implementation

## Symbol Reference
- 📌 Core implementation
- 🔄 Migration pattern
- ✅ Test checkpoint
- 🎨 Design token mapping
- ⚡ Performance note

---

## 1️⃣ UnifiedButton - Critical Implementation

📌 **File**: `components/ui/unified-button.tsx`
**Size**: ~250 LOC
**Replace**: `AppleButton` + `LuxuryButton` + `PrimaryCTA`

```tsx
'use client'

import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { colors, components, animations, spacing, shadows } from '@/lib/design-tokens'
import { motion } from 'framer-motion'
import AppleSpinner from './AppleSpinner'

interface UnifiedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'type'> {
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive' | 'luxury' | 'luxury-gold' | 'luxury-premium'
  /** Size */
  size?: 'sm' | 'md' | 'lg'
  /** Icon node */
  icon?: ReactNode
  /** Icon placement */
  iconPosition?: 'left' | 'right'
  /** Loading state */
  loading?: boolean
  /** Success state */
  success?: boolean
  /** Error state */
  error?: boolean
  /** Link href (renders as <a> or Link) */
  href?: string
  /** Luxury: shimmer effect */
  shimmer?: boolean
  /** Luxury: glow effect */
  glow?: boolean
  /** Luxury: badge text */
  badge?: string
  /** A/B test variant */
  abVariant?: 'A' | 'B' | 'C'
}

export const UnifiedButton = forwardRef<HTMLButtonElement, UnifiedButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    success = false,
    error = false,
    shimmer = false,
    glow = false,
    badge,
    href,
    abVariant = 'A',
    className,
    disabled,
    children,
    ...props
  }, ref) => {
    const isDisabled = disabled || loading

    // 🎨 Design token mapping
    const btnConfig = components.button.sizes[size]
    const baseRadius = components.button.radius

    // A/B test shadow variants
    const shadowVariants = {
      A: `shadow-xs hover:shadow-sm`,
      B: `shadow-lg hover:shadow-xl`,
      C: ``
    }

    // 🎨 Color-mapped variants
    const variantClasses = {
      primary: cn(
        `bg-[${colors.brand.navy}]`,
        'text-white',
        `hover:bg-[${colors.brand.black}]`,
        'dark:text-white'
      ),
      secondary: cn(
        'bg-white dark:bg-black/30',
        `border border-[${colors.gray[300]}]`,
        `text-[${colors.brand.black}]`,
        'dark:text-white'
      ),
      outline: cn(
        `border-2 border-[${colors.brand.black}]`,
        'bg-transparent',
        `text-[${colors.brand.black}]`
      ),
      ghost: cn(
        'bg-transparent',
        `text-[${colors.brand.black}]`,
        'hover:bg-gray-100 dark:hover:bg-gray-900'
      ),
      link: cn(
        'bg-transparent',
        `text-[${colors.interactive.link}]`,
        'underline'
      ),
      destructive: cn(
        'bg-red-500',
        'text-white',
        'hover:bg-red-600'
      ),
      // 🎨 Luxury variants (from LuxuryButton)
      luxury: cn(
        'bg-gradient-to-r from-slate-900 to-slate-800',
        'text-white',
        'hover:shadow-2xl hover:scale-105 hover:-translate-y-1',
        `shadow-[${shadows.lg}]`
      ),
      'luxury-gold': cn(
        'bg-gradient-to-r from-amber-500 to-amber-600',
        'text-white',
        'hover:from-amber-600 hover:to-amber-700 hover:shadow-2xl',
        'hover:scale-105 hover:-translate-y-1'
      ),
      'luxury-premium': cn(
        'bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900',
        'text-white',
        `border border-[${colors.materials.metal.champagne}]/30`,
        'hover:shadow-2xl hover:scale-105'
      )
    }

    const baseClasses = cn(
      // Base Apple-style
      'rounded-full',
      'font-medium',
      'inline-flex items-center justify-center gap-2',
      'transition-all duration-200',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'relative overflow-hidden',
      'select-none whitespace-nowrap',
      // Size from tokens
      `h-[${btnConfig.height}]`,
      `px-[${btnConfig.padding.split(' ')[1]}]`,
      `text-[${btnConfig.fontSize}]`,
      // Variant
      variantClasses[variant],
      // Shadow from A/B variant
      shadowVariants[abVariant],
      className
    )

    // Content wrapper
    const content = (
      <>
        <span className={cn(
          'inline-flex items-center gap-2',
          loading && 'opacity-0'
        )}>
          {icon && iconPosition === 'left' && <span>{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span>{icon}</span>}
        </span>

        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <AppleSpinner size={size === 'lg' ? 'md' : 'sm'} />
          </div>
        )}

        {/* Luxury: shimmer */}
        {shimmer && !loading && (
          <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        )}

        {/* Luxury: glow */}
        {glow && !loading && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent" />
          </div>
        )}

        {/* Luxury: badge */}
        {badge && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            {badge}
          </span>
        )}
      </>
    )

    // Render as link
    if (href && !isDisabled) {
      return (
        <Link href={href} className={cn(baseClasses, 'group')} ref={ref as any}>
          {content}
        </Link>
      )
    }

    // Render as button
    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, 'group')}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: abVariant === 'C' ? 1 : 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {content}
      </motion.button>
    )
  }
)

UnifiedButton.displayName = 'UnifiedButton'
export type { UnifiedButtonProps }
```

---

## 2️⃣ UnifiedCard - Critical Implementation

📌 **File**: `components/ui/unified-card.tsx`
**Size**: ~200 LOC
**Replace**: `card.tsx` + `luxury-card.tsx`

```tsx
'use client'

import type { ReactNode, HTMLAttributes } from 'react'
import { forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { card as cardTokens, spacing, shadows, radius } from '@/lib/design-tokens'

interface UnifiedCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: 'default' | 'elevated' | 'premium' | 'interactive' | 'luxury' | 'hero'
  /** Padding size */
  paddingSize?: 'sm' | 'md' | 'lg'
  /** Link href */
  href?: string
  /** Click handler */
  onClick?: () => void
  /** Image URL (for luxury card) */
  image?: string
  /** Image alt text */
  imageAlt?: string
  /** Card badge */
  badge?: string
  /** Luxury: shimmer effect */
  shimmer?: boolean
  /** Luxury: glow effect */
  glow?: boolean
}

export const UnifiedCard = forwardRef<HTMLDivElement, UnifiedCardProps>(
  ({
    variant = 'default',
    paddingSize = 'md',
    href,
    onClick,
    image,
    imageAlt,
    badge,
    shimmer = false,
    glow = false,
    className,
    children,
    ...props
  }, ref) => {
    // 🎨 Design token mapping
    const padding = cardTokens.padding[paddingSize]
    const shadow = cardTokens.shadow
    const borderRadius = cardTokens.radius

    const variantClasses = {
      default: cn(
        'bg-white border border-gray-200',
        `shadow-[${shadow}]`,
        'hover:shadow-md transition-shadow'
      ),
      elevated: cn(
        'bg-white border border-gray-200',
        `shadow-[${shadows.lg}]`,
        'hover:shadow-xl hover:-translate-y-1 transition-all'
      ),
      premium: cn(
        'bg-gradient-to-br from-white to-gray-50',
        'border-2 border-amber-200',
        `shadow-[${shadows.lg}]`,
        glow && 'shadow-amber-500/20'
      ),
      interactive: cn(
        'bg-white border border-gray-200',
        'cursor-pointer',
        'hover:shadow-md hover:scale-[1.02] transition-all'
      ),
      luxury: cn(
        'bg-gradient-to-br from-white/95 to-slate-50/95',
        'border border-white/60',
        `shadow-[${shadows.xl}]`,
        'backdrop-blur-md'
      ),
      hero: cn(
        'bg-gradient-to-br from-white/95 to-slate-50/95',
        'border border-white/60',
        `shadow-[${shadows['2xl']}]`,
        'backdrop-blur-md hover:shadow-elevated'
      )
    }

    const baseClasses = cn(
      `rounded-[${borderRadius}]`,
      'overflow-hidden',
      'transition-all duration-500',
      'relative group',
      variantClasses[variant],
      className
    )

    const cardContent = (
      <>
        {/* Image section (for luxury/hero variants) */}
        {image && (
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={image}
              alt={imageAlt || 'Card image'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={85}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Badge */}
            {badge && (
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-slate-900 text-white px-3 py-1 text-xs font-light tracking-widest uppercase">
                  {badge}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content section */}
        <div className={`p-[${padding}]`}>
          {children}
        </div>

        {/* Shimmer effect (luxury variant) */}
        {shimmer && (
          <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500" />
        )}

        {/* Glow effect (luxury variant) */}
        {glow && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
          </div>
        )}
      </>
    )

    // Render as link
    if (href) {
      return (
        <Link href={href} className={baseClasses} ref={ref}>
          {cardContent}
        </Link>
      )
    }

    // Render as button
    if (onClick) {
      return (
        <button onClick={onClick} className={cn(baseClasses, 'w-full text-left')} ref={ref} {...props}>
          {cardContent}
        </button>
      )
    }

    // Render as div
    return (
      <div className={baseClasses} ref={ref} {...props}>
        {cardContent}
      </div>
    )
  }
)

UnifiedCard.displayName = 'UnifiedCard'

// Composite subcomponents (same as original card.tsx)
export function UnifiedCardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('@container/card-header grid gap-1.5', className)} {...props} />
}

export function UnifiedCardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
}

export function UnifiedCardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-gray-600', className)} {...props} />
}

export function UnifiedCardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('[&:has(>*:first-child)]:pt-0', className)} {...props} />
}

export function UnifiedCardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center pt-0', className)} {...props} />
}
```

---

## 3️⃣ Migration Pattern - ProductCard

🔄 **Before**:
```tsx
import { LuxuryCard } from '@/components/ui/luxury-card'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card variant="elevated" spacing="none">
      {/* ... */}
    </Card>
  )
}
```

🔄 **After**:
```tsx
import {
  UnifiedCard as Card,
  UnifiedCardHeader as CardHeader,
  UnifiedCardTitle as CardTitle,
  UnifiedCardContent as CardContent,
  UnifiedCardFooter as CardFooter
} from '@/components/ui/unified-card'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card variant="elevated" paddingSize="md">
      {/* ... same children structure */}
    </Card>
  )
}
```

---

## 4️⃣ Migration Pattern - CTA Components

🔄 **Before** (`components/cta/PrimaryCTA.tsx`):
```tsx
import { ArrowRight, Loader2 } from 'lucide-react'

export const PrimaryCTA = ({ href, children, showArrow, loading, ...props }) => (
  <Link href={href} className="bg-black text-white hover:bg-gray-900">
    {loading ? <Loader2 /> : <>
      {children}
      {showArrow && <ArrowRight />}
    </>}
  </Link>
)
```

🔄 **After** (unified):
```tsx
import { UnifiedButton } from '@/components/ui/unified-button'
import { ArrowRight } from 'lucide-react'

export const PrimaryCTA = ({ href, children, showArrow = true, loading, ...props }) => (
  <UnifiedButton
    variant="primary"
    href={href}
    loading={loading}
    icon={showArrow ? <ArrowRight /> : undefined}
    iconPosition="right"
    {...props}
  >
    {children}
  </UnifiedButton>
)
```

**Action**: Delete `PrimaryCTA.tsx`, `SecondaryCTA.tsx`, etc. → import UnifiedButton directly

---

## 5️⃣ Export Updates

✅ **File**: `components/ui/index.ts`

```tsx
// BEFORE
export { AppleButton as Button } from './AppleButton'
export { LuxuryButton } from './luxury-button'
export { LuxuryCard } from './luxury-card'
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card'

// AFTER
export { UnifiedButton as Button, type UnifiedButtonProps as ButtonProps } from './unified-button'
export {
  UnifiedCard as Card,
  UnifiedCardHeader as CardHeader,
  UnifiedCardTitle as CardTitle,
  UnifiedCardContent as CardContent,
  UnifiedCardFooter as CardFooter
} from './unified-card'

// Convenience exports
export { UnifiedButton, UnifiedCard } from './unified-button'
export { UnifiedCard, UnifiedCardHeader } from './unified-card'
```

---

## 6️⃣ Type Safety Verification

✅ **Checkpoint**: Run before committing

```bash
# Type check
npm run type-check

# Test compilation
npm run build

# Visual regression
npm run test:visual

# Bundle size
npm run build -- --analyze
```

---

## 7️⃣ Performance Notes

⚡ **Design Token Optimization**:
- Design tokens are static → bundled as constants
- Variant classes compiled at build time
- Zero runtime overhead vs. AppleButton
- Shadow/spacing values inlined by Tailwind
- Expected bundle impact: -8KB (3 files removed) + 5KB (unified) = **-3KB net**

⚡ **Motion Optimization**:
- Framer Motion already in use (AppleButton)
- UnifiedButton reuses same motion config
- No additional bundle overhead

---

## 8️⃣ Testing Strategy

✅ **Unit Tests** (`components/ui/__tests__/unified-button.test.tsx`):
```tsx
describe('UnifiedButton', () => {
  it('renders all variants from design tokens', () => {
    render(<UnifiedButton variant="luxury-gold">Test</UnifiedButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-gradient-to-r')
  })

  it('applies design token sizes', () => {
    const { rerender } = render(<UnifiedButton size="lg">Test</UnifiedButton>)
    expect(screen.getByRole('button')).toHaveClass('h-14')

    rerender(<UnifiedButton size="sm">Test</UnifiedButton>)
    expect(screen.getByRole('button')).toHaveClass('h-8')
  })

  it('supports luxury props (shimmer, glow, badge)', () => {
    render(
      <UnifiedButton variant="luxury-gold" shimmer glow badge="NEW">
        Test
      </UnifiedButton>
    )
    expect(screen.getByText('NEW')).toBeInTheDocument()
  })
})
```

---

## 9️⃣ Common Gotchas

❌ **Mistake**: Using `size` prop with object-based sizing
```tsx
// ❌ WRONG
<UnifiedButton size={{ sm: 'md', lg: 'lg' }}>Test</UnifiedButton>

// ✅ RIGHT
<UnifiedButton size="md">Test</UnifiedButton>
```

❌ **Mistake**: Forgetting to update CTA component imports
```tsx
// ❌ WRONG
import { PrimaryCTA } from '@/components/cta/PrimaryCTA'
// PrimaryCTA will be deleted!

// ✅ RIGHT
import { UnifiedButton } from '@/components/ui/unified-button'
```

❌ **Mistake**: Mixing design token keys
```tsx
// ❌ WRONG
<UnifiedCard paddingSize="xl"> {/* card.padding only has sm/md/lg */}

// ✅ RIGHT
<UnifiedCard paddingSize="lg">
```

---

Generated with [Ultra-Compressed Implementation](--uc flag)
