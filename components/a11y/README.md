# PG Closets Accessibility Component Library

**WCAG 2.1 Level AAA Compliant Components**

## Quick Start

```tsx
import {
  SkipLinks,
  ScreenReaderOnly,
  FocusTrap,
  LiveRegion,
  KeyboardShortcuts,
  A11yDashboard
} from '@/components/a11y'
```

## Installation

All accessibility components are built-in. No additional installation required beyond the existing dependencies:

```bash
npm install axe-core @axe-core/react react-aria
```

## Components

### Core Components

#### SkipLinks

Bypass blocks navigation for keyboard users.

```tsx
import { SkipLinks } from '@/components/a11y'

export function Layout({ children }) {
  return (
    <>
      <SkipLinks />
      <header id="navigation">...</header>
      <main id="main">{children}</main>
      <footer id="footer">...</footer>
    </>
  )
}
```

**WCAG**: 2.4.1 Bypass Blocks (Level A)

#### ScreenReaderOnly

Hide content visually while keeping it accessible.

```tsx
import { ScreenReaderOnly } from '@/components/a11y'

<button>
  <Icon />
  <ScreenReaderOnly>Add to cart</ScreenReaderOnly>
</button>
```

#### FocusTrap

Trap focus within modals and dialogs.

```tsx
import { FocusTrap } from '@/components/a11y'

<Dialog open={isOpen}>
  <FocusTrap active={isOpen} onEscape={() => setIsOpen(false)}>
    <DialogContent />
  </FocusTrap>
</Dialog>
```

#### LiveRegion

Announce dynamic content to screen readers.

```tsx
import { LiveRegion, LoadingAnnouncer } from '@/components/a11y'

// Basic usage
<LiveRegion politeness="polite">
  Item added to cart
</LiveRegion>

// Loading states
<LoadingAnnouncer
  loading={isLoading}
  loadingMessage="Loading products..."
  completeMessage="Products loaded"
/>
```

#### KeyboardShortcuts

Global keyboard shortcuts with help menu.

```tsx
import { KeyboardShortcuts } from '@/components/a11y'

const shortcuts = [
  {
    key: 'k',
    modifiers: { ctrl: true },
    description: 'Open search',
    action: () => openSearch(),
    category: 'Navigation'
  }
]

<KeyboardShortcuts shortcuts={shortcuts} enabled={true} showHelp={true} />
```

### Testing Tools

#### A11yDashboard

Real-time accessibility monitoring dashboard.

```tsx
import { A11yDashboard } from '@/components/a11y'

// Add to your app (development only recommended)
export function App() {
  return (
    <>
      {process.env.NODE_ENV === 'development' && <A11yDashboard />}
      <YourApp />
    </>
  )
}
```

## Utilities

```tsx
import {
  RovingTabindexManager,
  GridNavigationManager,
  checkColorContrast,
  prefersReducedMotion
} from '@/lib/a11y'

// Keyboard navigation
const container = document.querySelector('[role="menu"]')
const items = Array.from(container.querySelectorAll('[role="menuitem"]'))
const manager = new RovingTabindexManager(container, items, {
  orientation: 'vertical',
  loop: true
})

// Color contrast
const result = checkColorContrast('#000000', '#FFFFFF')
console.log(result.ratio) // 21
console.log(result.passesAAA) // true

// Motion preferences
if (prefersReducedMotion()) {
  // Disable animations
}
```

## Integration Guide

### 1. Wrap your app with AccessibilityProvider

```tsx
// app/layout.tsx
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  )
}
```

### 2. Add Skip Links

```tsx
// app/layout.tsx
import { SkipLinks } from '@/components/a11y'

<AccessibilityProvider>
  <SkipLinks />
  {children}
</AccessibilityProvider>
```

### 3. Add Keyboard Shortcuts

```tsx
// components/KeyboardShortcutsSetup.tsx
'use client'

import { KeyboardShortcuts } from '@/components/a11y'
import { useRouter } from 'next/navigation'

export function KeyboardShortcutsSetup() {
  const router = useRouter()

  const shortcuts = [
    {
      key: '/',
      description: 'Focus search',
      action: () => document.getElementById('search')?.focus(),
      category: 'Navigation'
    },
    {
      key: 'h',
      description: 'Go to homepage',
      action: () => router.push('/'),
      category: 'Navigation'
    }
  ]

  return <KeyboardShortcuts shortcuts={shortcuts} />
}
```

### 4. Add Accessibility Dashboard (Development)

```tsx
// app/layout.tsx
import { A11yDashboard } from '@/components/a11y'

<AccessibilityProvider>
  {process.env.NODE_ENV === 'development' && <A11yDashboard />}
  {children}
</AccessibilityProvider>
```

## Testing

### Run Automated Tests

```bash
# Run Playwright accessibility tests
npm run test:a11y

# Or with Playwright directly
npx playwright test tests/accessibility
```

### Manual Testing Checklist

- [ ] Keyboard navigation works on all pages
- [ ] Screen reader announces all content correctly
- [ ] Color contrast meets AAA standards (7:1)
- [ ] Touch targets are minimum 44×44px
- [ ] Content works at 200% zoom
- [ ] Animations respect `prefers-reduced-motion`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## WCAG 2.1 Level AAA Compliance

All components meet or exceed WCAG 2.1 Level AAA standards:

✅ **Perceivable** - 7:1 contrast, alt text, captions
✅ **Operable** - Full keyboard access, no time limits
✅ **Understandable** - Clear labels, consistent navigation
✅ **Robust** - Valid HTML, ARIA support

## Documentation

- [Accessibility Guide](../../../docs/ACCESSIBILITY_GUIDE.md)
- [WCAG Compliance Checklist](../../../docs/WCAG_COMPLIANCE_CHECKLIST.md)
- [Assistive Technology Testing](../../../docs/ASSISTIVE_TECH_TESTING.md)
- [Accessibility Statement](../../../docs/ACCESSIBILITY_STATEMENT.md)

## Support

For accessibility questions or issues:

- **Email**: accessibility@pgclosets.com
- **Phone**: 1-800-PG-CLOSET

---

**Built with**: React, TypeScript, ARIA, WCAG 2.1 AAA
**Tested with**: NVDA, JAWS, VoiceOver, TalkBack, axe-core, Playwright
**Maintained by**: PG Closets Accessibility Team
