# PG Closets Accessibility Guide

## Overview

This guide documents the comprehensive accessibility system implemented for PG Closets, designed to exceed WCAG 2.1 Level AAA standards and provide exceptional experiences for all users, regardless of ability.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Component Library](#component-library)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Screen Reader Support](#screen-reader-support)
5. [Color & Contrast](#color-contrast)
6. [Motion & Animation](#motion-animation)
7. [Testing Tools](#testing-tools)
8. [Best Practices](#best-practices)

---

## Core Principles

### Our Accessibility Commitment

**Luxury and inclusivity are inseparable.** At PG Closets, we believe that exceptional user experiences should be available to everyone. Our accessibility system is built on these principles:

1. **Beyond Compliance**: We exceed WCAG 2.1 AAA standards, not just meet them
2. **User-Centered Design**: Real users with diverse abilities inform our decisions
3. **Progressive Enhancement**: Core functionality works for everyone, enhanced experiences build on top
4. **Continuous Improvement**: Accessibility is never "done" - we continuously test and refine

### WCAG 2.1 AAA Compliance

Our implementation achieves Level AAA compliance across all four principles:

- **Perceivable**: Information and UI components are presentable to all users
- **Operable**: UI components and navigation are usable by everyone
- **Understandable**: Information and operation of UI are comprehensible
- **Robust**: Content works with current and future assistive technologies

---

## Component Library

### Location: `/components/a11y/`

Our accessibility component library provides battle-tested, WCAG AAA-compliant components:

### Core Components (`/components/a11y/core/`)

#### SkipLinks

Provides keyboard users with quick navigation to main content areas.

```tsx
import { SkipLinks } from '@/components/a11y/core/SkipLinks'

<SkipLinks
  links={[
    { href: '#main', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#footer', label: 'Skip to footer' }
  ]}
/>
```

**WCAG**: 2.4.1 Bypass Blocks (Level A)

#### ScreenReaderOnly

Visually hides content while keeping it accessible to screen readers.

```tsx
import { ScreenReaderOnly, VisuallyHiddenHeading } from '@/components/a11y/core/ScreenReaderOnly'

<ScreenReaderOnly>This text is only for screen readers</ScreenReaderOnly>

<VisuallyHiddenHeading level={2}>
  Products Section
</VisuallyHiddenHeading>
```

**WCAG**: 1.3.1 Info and Relationships (Level A)

#### FocusTrap

Manages keyboard focus within modals and dialogs.

```tsx
import { FocusTrap, AutoFocus } from '@/components/a11y/core/FocusTrap'

<FocusTrap
  active={isModalOpen}
  returnFocus={true}
  allowEscape={true}
  onEscape={() => closeModal()}
>
  {/* Modal content */}
</FocusTrap>
```

**WCAG**: 2.4.3 Focus Order (Level A)

#### LiveRegion

Announces dynamic content changes to screen readers.

```tsx
import { LiveRegion, useStatusAnnouncer, LoadingAnnouncer } from '@/components/a11y/core/LiveRegion'

// Basic usage
<LiveRegion politeness="polite" clearAfter={3000}>
  Item added to cart
</LiveRegion>

// With hook
const { announce, LiveRegion: StatusRegion } = useStatusAnnouncer()

announce('Form submitted successfully', { politeness: 'polite' })
<StatusRegion />

// Loading states
<LoadingAnnouncer
  loading={isLoading}
  loadingMessage="Loading products..."
  completeMessage="Products loaded"
/>
```

**WCAG**: 4.1.3 Status Messages (Level AA)

#### KeyboardShortcuts

Provides customizable keyboard shortcuts with help menu.

```tsx
import { KeyboardShortcuts, useKeyboardShortcut } from '@/components/a11y/core/KeyboardShortcuts'

const shortcuts = [
  {
    key: 'k',
    modifiers: { ctrl: true },
    description: 'Open search',
    action: () => openSearch(),
    category: 'Navigation'
  },
  {
    key: '/',
    description: 'Focus search',
    action: () => focusSearch(),
    category: 'Navigation'
  }
]

<KeyboardShortcuts shortcuts={shortcuts} enabled={true} showHelp={true} />
```

**WCAG**: 2.1.1 Keyboard (Level A)

---

## Keyboard Navigation

### Location: `/lib/a11y/keyboard-nav.ts`

Advanced keyboard navigation system with three specialized managers:

### Roving Tabindex Manager

For single-selection lists (navigation menus, radio groups, tabs).

```typescript
import { RovingTabindexManager } from '@/lib/a11y/keyboard-nav'

const container = document.querySelector('[role="menu"]')
const items = Array.from(container.querySelectorAll('[role="menuitem"]'))

const manager = new RovingTabindexManager(container, items, {
  orientation: 'vertical',
  loop: true,
  homeEndKeys: true,
  typeAhead: true,
  activateOnFocus: false
})

// Later cleanup
manager.cleanup()
```

**Features**:
- Arrow key navigation (↑↓ for vertical, ←→ for horizontal)
- Home/End keys jump to first/last item
- Type-ahead search
- Configurable looping behavior
- Auto-activation on focus (optional)

### Grid Navigation Manager

For 2D grids (product grids, image galleries, calendars).

```typescript
import { GridNavigationManager } from '@/lib/a11y/keyboard-nav'

const container = document.querySelector('[role="grid"]')
const cells = Array.from(container.querySelectorAll('[role="gridcell"]'))

const manager = new GridNavigationManager(container, cells, {
  columns: 4,
  loop: true,
  homeEndKeys: true
})
```

**Features**:
- Arrow key navigation in 2D space
- Home/End for row navigation
- Ctrl+Home/End for grid navigation
- PageUp/PageDown for faster scrolling

### Menu Navigation Manager

For dropdown menus and menu bars.

```typescript
import { MenuNavigationManager } from '@/lib/a11y/keyboard-nav'

const menu = document.querySelector('[role="menu"]')
const items = Array.from(menu.querySelectorAll('[role="menuitem"]'))

const manager = new MenuNavigationManager(menu, items, {
  orientation: 'vertical',
  loop: true,
  typeAhead: true
})

// Open menu
manager.open()

// Close menu (e.g., on Escape)
manager.close()
```

**Features**:
- Automatic focus on first item when opened
- Escape key to close
- Enter/Space to activate
- Type-ahead search

---

## Screen Reader Support

### Tested With

- **NVDA** (Windows) - Latest version
- **JAWS** (Windows) - Latest version
- **VoiceOver** (macOS/iOS) - Latest version
- **TalkBack** (Android) - Latest version

### Screen Reader Utilities (`/components/a11y/sr-utils/`)

#### Status Announcements

```tsx
import { SRStatus } from '@/components/a11y/sr-utils/SRStatus'

<SRStatus
  message="Item added to cart"
  politeness="polite"
  clearAfter={3000}
  role="status"
/>
```

#### Progress Updates

For multi-step processes like checkout:

```tsx
<LiveRegion politeness="polite" role="status">
  Step 2 of 4: Shipping Information
</LiveRegion>
```

#### Error Summaries

For form validation:

```tsx
<div role="alert" aria-live="assertive">
  <h2>Form contains {errors.length} errors</h2>
  <ul>
    {errors.map(error => (
      <li key={error.field}>
        <a href={`#${error.field}`}>{error.message}</a>
      </li>
    ))}
  </ul>
</div>
```

### Best Practices

1. **Use semantic HTML first** - `<button>` over `<div role="button">`
2. **Provide text alternatives** - All images, icons, and media need alt text
3. **Label everything** - Forms, buttons, links need accessible names
4. **Announce dynamic changes** - Use ARIA live regions for updates
5. **Test with real screen readers** - Don't rely solely on automated tools

---

## Color & Contrast

### Location: `/lib/accessibility/a11y-utils.ts`

### AAA Contrast Requirements

- **Normal text**: 7:1 contrast ratio minimum
- **Large text** (18pt+ or 14pt+ bold): 4.5:1 minimum
- **UI components**: 3:1 minimum

### Contrast Checking

```typescript
import { checkColorContrast, getContrastRatio } from '@/lib/accessibility/a11y-utils'

const result = checkColorContrast('#000000', '#FFFFFF', false)
console.log(result)
// {
//   ratio: 21,
//   passesAA: true,
//   passesAAA: true,
//   level: 'AAA'
// }
```

### Color Blindness Support

Our system supports simulation and adjustment for:

- **Protanopia** (red-blind)
- **Deuteranopia** (green-blind)
- **Tritanopia** (blue-blind)

Users can enable color blindness modes in the accessibility menu.

### High Contrast Mode

Activated via:
- System preference (`prefers-contrast: high`)
- User preference in accessibility menu

```css
.high-contrast {
  filter: contrast(150%);
}

.high-contrast button {
  border: 3px solid var(--color-primary) !important;
  background: var(--color-secondary) !important;
}
```

---

## Motion & Animation

### Respecting User Preferences

We respect the `prefers-reduced-motion` media query:

```typescript
import { prefersReducedMotion, getSafeAnimationClasses } from '@/lib/accessibility/a11y-utils'

// Check preference
if (prefersReducedMotion()) {
  // Show static content
} else {
  // Show animated content
}

// Apply safe animation classes
const classes = getSafeAnimationClasses('animate-fade-in')
// Returns '' if reduced motion preferred, 'animate-fade-in' otherwise
```

### Motion Controls

Users can control animations via the accessibility menu:

1. **Reduce Motion** - Disables all animations
2. **Pause Auto-Play** - Stops auto-playing carousels and videos
3. **Remove Parallax** - Disables parallax scrolling effects

### Implementation

```tsx
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider'

function MyComponent() {
  const { settings } = useAccessibility()

  return (
    <div
      className={cn({
        'animate-fade-in': !settings.reducedMotion,
        'static': settings.reducedMotion
      })}
    >
      Content
    </div>
  )
}
```

---

## Testing Tools

### Location: `/components/a11y/testing/`

### Automated Testing

We use multiple layers of automated accessibility testing:

1. **axe-core** - Comprehensive WCAG validation
2. **Playwright** - End-to-end accessibility testing
3. **React Axe** - Development-time checking

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and predictable
- [ ] Focus is always visible
- [ ] No keyboard traps
- [ ] Skip links work correctly

#### Screen Reader Testing
- [ ] All images have appropriate alt text
- [ ] All form fields have labels
- [ ] Headings create logical structure
- [ ] ARIA landmarks are present and correct
- [ ] Dynamic content announces properly

#### Visual Testing
- [ ] Text meets 7:1 contrast ratio (AAA)
- [ ] UI components meet 3:1 contrast ratio
- [ ] Content works at 200% zoom
- [ ] No information conveyed by color alone
- [ ] Focus indicators are visible

#### Mobile/Touch Testing
- [ ] Touch targets are minimum 44×44px
- [ ] Adequate spacing between interactive elements
- [ ] Works in portrait and landscape
- [ ] Gestures have keyboard alternatives

---

## Best Practices

### HTML Semantics

Use semantic HTML elements:

```tsx
// ✅ Good
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/products">Products</a></li>
  </ul>
</nav>

// ❌ Bad
<div className="nav">
  <div className="nav-link" onClick={handleClick}>Products</div>
</div>
```

### ARIA Usage

Follow the **First Rule of ARIA**:

> "If you can use a native HTML element or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so."

```tsx
// ✅ Good - Native button
<button onClick={handleClick}>Submit</button>

// ❌ Bad - Div with role
<div role="button" tabIndex={0} onClick={handleClick}>Submit</div>
```

### Form Accessibility

```tsx
<form>
  <label htmlFor="email">
    Email Address
    <span aria-label="required">*</span>
  </label>
  <input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby={hasError ? 'email-error' : undefined}
    autoComplete="email"
  />
  {hasError && (
    <div id="email-error" role="alert" aria-live="assertive">
      Please enter a valid email address
    </div>
  )}
</form>
```

### Image Accessibility

```tsx
// Informative image
<img
  src="/products/closet.jpg"
  alt="White walk-in closet with custom shelving and LED lighting"
/>

// Decorative image
<img
  src="/decorative-pattern.svg"
  alt=""
  role="presentation"
/>

// Complex image with detailed description
<figure>
  <img
    src="/floorplan.png"
    alt="Closet floor plan"
    aria-describedby="floorplan-description"
  />
  <figcaption id="floorplan-description">
    Detailed floor plan showing 12x10 foot closet with...
  </figcaption>
</figure>
```

### Link Accessibility

```tsx
// ✅ Good - Descriptive link text
<a href="/products/wardrobes">
  View our wardrobe collection
</a>

// ❌ Bad - Non-descriptive
<a href="/products/wardrobes">
  Click here
</a>

// ✅ Good - Link with context
<a href="/products/wardrobes">
  Wardrobes
  <ScreenReaderOnly> - View full collection</ScreenReaderOnly>
</a>
```

---

## Resources

### Internal Documentation

- [WCAG Compliance Checklist](./WCAG_COMPLIANCE_CHECKLIST.md)
- [Assistive Technology Testing Guide](./ASSISTIVE_TECH_TESTING.md)
- [Accessibility Statement](./ACCESSIBILITY_STATEMENT.md)

### External Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)
- [Inclusive Components](https://inclusive-components.design/)

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation tool
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) - Desktop app

---

## Support

For accessibility questions or issues:

- **Email**: accessibility@pgclosets.com
- **Phone**: 1-800-PG-CLOSET
- **Live Chat**: Available 9 AM - 5 PM EST

We welcome feedback on how we can improve our accessibility. All accessibility issues are treated as high priority.

---

**Last Updated**: October 2025
**Version**: 2.0
**Maintained By**: PG Closets Accessibility Team
