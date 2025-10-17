# Apple Navigation - Usage Guide

Complete guide for implementing and customizing the Apple-style navigation component.

## Quick Start

### 1. Basic Setup

Replace your existing navigation in the layout file:

```tsx
// app/layout.tsx
import { AppleNavigation } from "@/components/navigation"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppleNavigation />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

### 2. Required CSS

Ensure the Apple Design System CSS is loaded in your layout:

```tsx
// app/layout.tsx
import "../styles/apple-glass.css"
import "../styles/apple-typography.css"
import "../styles/apple-colors.css"
```

### 3. Font Configuration

The component uses the Cormorant font for headings. Add to your layout:

```tsx
import { Cormorant_Garamond } from "next/font/google"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

// In HTML element
<html className={cormorant.variable}>
```

## Customization Examples

### Example 1: Custom Navigation Items

```tsx
// components/navigation/AppleNavigation.tsx

const NAVIGATION_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
    hasMegaMenu: true,
    megaMenuItems: [
      {
        category: "By Room",
        items: [
          { label: "Bedroom", href: "/shop/bedroom" },
          { label: "Kitchen", href: "/shop/kitchen" },
          { label: "Bathroom", href: "/shop/bathroom" },
        ],
      },
      {
        category: "By Style",
        items: [
          { label: "Modern", href: "/shop/modern" },
          { label: "Traditional", href: "/shop/traditional" },
          { label: "Contemporary", href: "/shop/contemporary" },
        ],
      },
    ],
  },
  {
    label: "Gallery",
    href: "/gallery",
  },
  {
    label: "Contact",
    href: "/contact",
  },
]
```

### Example 2: Custom Colors

Create a theme variant by modifying the component classes:

```tsx
// Light theme (default)
<header className="glass-nav">

// Dark theme
<header className="glass-nav-dark">

// Custom gradient background
<header className="bg-gradient-to-r from-blue-900 to-indigo-900">
```

### Example 3: Custom CTA Button

```tsx
// In AppleNavigation.tsx, find the CTA button section:
<Link
  href="/custom-link"
  className="px-6 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700"
>
  Your Custom Text
</Link>
```

### Example 4: Custom Search Behavior

Add search logic to the SearchOverlay component:

```tsx
function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState([])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    // Add your search API call
    const response = await fetch(`/api/search?q=${query}`)
    const data = await response.json()
    setResults(data)
  }

  return (
    // ... existing code
    <input
      onChange={(e) => handleSearch(e.target.value)}
      // ... other props
    />
    // Display results
    {results.map(result => (
      <SearchResult key={result.id} {...result} />
    ))}
  )
}
```

### Example 5: Custom Scroll Threshold

Adjust when the header hides/shows:

```tsx
// In the scroll effect useEffect:

// More aggressive hiding (hides at 50px)
if (currentScrollY > lastScrollY && currentScrollY > 50) {
  setIsScrollingUp(false)
}

// Less aggressive hiding (hides at 200px)
if (currentScrollY > lastScrollY && currentScrollY > 200) {
  setIsScrollingUp(false)
}
```

## Advanced Customization

### Adding User Account Menu

```tsx
// Add to the right actions section:
<div className="flex items-center gap-3">
  {/* Existing search button */}

  {/* User menu */}
  {user ? (
    <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full">
      <Avatar src={user.avatar} />
      <ChevronDown className="w-4 h-4" />
    </button>
  ) : (
    <Link href="/login" className="text-sm font-medium">
      Sign In
    </Link>
  )}

  {/* Existing CTA button */}
</div>
```

### Adding Shopping Cart

```tsx
import { ShoppingBag } from "lucide-react"

// Add to right actions:
<Link
  href="/cart"
  className="relative p-2 hover:bg-gray-100 rounded-full"
  aria-label="Shopping cart"
>
  <ShoppingBag className="w-5 h-5" />
  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
      {cartCount}
    </span>
  )}
</Link>
```

### Adding Language Selector

```tsx
// Add to utility bar:
<div className="flex items-center gap-2">
  <button
    onClick={() => setLocale('en')}
    className={cn(
      "text-xs hover:text-amber-400 transition-colors",
      locale === 'en' && "text-amber-400 font-semibold"
    )}
  >
    EN
  </button>
  <span className="text-gray-600">|</span>
  <button
    onClick={() => setLocale('fr')}
    className={cn(
      "text-xs hover:text-amber-400 transition-colors",
      locale === 'fr' && "text-amber-400 font-semibold"
    )}
  >
    FR
  </button>
</div>
```

## Integration Examples

### With Next.js App Router

```tsx
// app/layout.tsx
import { AppleNavigation } from "@/components/navigation"
import { Suspense } from "react"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<NavigationSkeleton />}>
          <AppleNavigation />
        </Suspense>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

### With Authentication

```tsx
// components/navigation/AppleNavigation.tsx
import { useAuth } from "@/hooks/useAuth"

export function AppleNavigation() {
  const { user, signOut } = useAuth()

  return (
    <header>
      {/* ... existing code */}

      {user && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Hello, {user.name}</span>
          <button onClick={signOut}>Sign Out</button>
        </div>
      )}
    </header>
  )
}
```

### With Analytics Tracking

```tsx
// Add click tracking to navigation items:
const handleNavClick = (label: string, href: string) => {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'navigation_click', {
      event_category: 'Navigation',
      event_label: label,
      value: href,
    })
  }

  // Or custom analytics
  analytics.track('Navigation Click', {
    label,
    href,
    timestamp: new Date().toISOString(),
  })
}

// In navigation items:
<Link
  href={item.href}
  onClick={() => handleNavClick(item.label, item.href)}
>
  {item.label}
</Link>
```

## Performance Tips

### 1. Lazy Load Search Overlay

```tsx
import dynamic from 'next/dynamic'

const SearchOverlay = dynamic(() =>
  import('./SearchOverlay').then(mod => mod.SearchOverlay),
  { ssr: false }
)
```

### 2. Memoize Navigation Items

```tsx
import { useMemo } from 'react'

const navigationItems = useMemo(() => NAVIGATION_ITEMS, [])
```

### 3. Debounce Scroll Handler

```tsx
import { useCallback, useRef } from 'react'

const scrollTimeout = useRef<NodeJS.Timeout>()

const handleScroll = useCallback(() => {
  if (scrollTimeout.current) {
    clearTimeout(scrollTimeout.current)
  }

  scrollTimeout.current = setTimeout(() => {
    // Scroll logic here
  }, 16) // ~60fps
}, [])
```

## Accessibility Best Practices

### Keyboard Navigation

```tsx
// Add keyboard handler to mega menu:
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'Escape':
      setActiveMegaMenu(null)
      break
    case 'ArrowDown':
      // Focus next item
      break
    case 'ArrowUp':
      // Focus previous item
      break
  }
}
```

### Screen Reader Support

```tsx
// Add descriptive ARIA labels:
<nav aria-label="Main navigation">
  <button
    aria-expanded={megaMenuOpen}
    aria-haspopup="true"
    aria-controls="mega-menu-products"
  >
    Products
  </button>

  <div
    id="mega-menu-products"
    role="menu"
    aria-label="Products menu"
  >
    {/* Menu items */}
  </div>
</nav>
```

### Focus Management

```tsx
// Trap focus in mobile drawer:
import { FocusTrap } from '@/components/accessibility'

<FocusTrap active={isMobileOpen}>
  <div className="mobile-drawer">
    {/* Content */}
  </div>
</FocusTrap>
```

## Testing Examples

### Unit Tests

```tsx
// __tests__/AppleNavigation.test.tsx
import { render, screen } from '@testing-library/react'
import { AppleNavigation } from '../AppleNavigation'

describe('AppleNavigation', () => {
  it('renders navigation items', () => {
    render(<AppleNavigation />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Products')).toBeInTheDocument()
  })

  it('opens mega menu on hover', async () => {
    render(<AppleNavigation />)
    const productsButton = screen.getByText('Products')
    fireEvent.mouseEnter(productsButton)
    expect(await screen.findByRole('menu')).toBeVisible()
  })
})
```

### E2E Tests

```tsx
// tests/e2e/navigation.spec.ts
import { test, expect } from '@playwright/test'

test('navigation scroll behavior', async ({ page }) => {
  await page.goto('/')

  // Header should be visible initially
  const header = page.locator('header')
  await expect(header).toBeVisible()

  // Scroll down
  await page.evaluate(() => window.scrollTo(0, 500))
  await page.waitForTimeout(500)

  // Header should hide
  await expect(header).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -100)')

  // Scroll up
  await page.evaluate(() => window.scrollTo(0, 100))
  await page.waitForTimeout(500)

  // Header should show
  await expect(header).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)')
})
```

## Troubleshooting

### Issue: Glass effect not showing
**Solution**: Ensure Apple glass CSS is loaded and browser supports backdrop-filter

```tsx
// Check browser support
if (CSS.supports('backdrop-filter', 'blur(20px)')) {
  // Use glass effect
} else {
  // Fallback to solid background
}
```

### Issue: Mobile drawer not closing
**Solution**: Check z-index and backdrop click handler

```tsx
<div
  className="backdrop"
  onClick={onClose}
  onTouchEnd={onClose} // Add for mobile
/>
```

### Issue: Mega menu flickers
**Solution**: Adjust timeout and add pointer events

```tsx
<div
  className="mega-menu"
  style={{ pointerEvents: 'auto' }}
  onMouseEnter={() => clearTimeout(timeoutRef.current)}
/>
```

## Migration Guide

### From EnhancedHeader

```tsx
// Before
import { EnhancedHeader } from "@/components/navigation"
<EnhancedHeader />

// After
import { AppleNavigation } from "@/components/navigation"
<AppleNavigation />
```

Key differences:
- AppleNavigation has Framer Motion animations
- More pronounced glass morphism effect
- Progress indicator included by default
- Simpler configuration

### From AnimatedHeader

```tsx
// AnimatedHeader and AppleNavigation are similar
// Main difference is component structure and mega menu implementation
```

## Support Resources

- Demo Page: `/navigation-apple-demo`
- Component Code: `components/navigation/AppleNavigation.tsx`
- Documentation: `components/navigation/APPLE_NAVIGATION.md`
- Issue Tracker: GitHub Issues

---

**Questions?** Check the demo page or review the component source code for implementation details.
