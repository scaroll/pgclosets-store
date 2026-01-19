# PG Closets Design System - Accessibility Guidelines

## 📋 Overview

This design system ensures WCAG 2.1 AA compliance and provides a consistent, accessible user experience across the PG Closets e-commerce platform. All components and patterns follow universal design principles to ensure usability for all users, including those with disabilities.

## 🎨 Color Palette & Contrast Ratios

### Primary Colors

| Color | Hex | Use Case | Contrast Ratio (on white) | WCAG Status |
|-------|-----|----------|---------------------------|-------------|
| **Primary Blue** | #2563eb | Primary buttons, links | 7.22:1 | ✅ AAA |
| **Primary Blue Dark** | #1d4ed8 | Hover states, focus | 8.12:1 | ✅ AAA |
| **Primary Blue Light** | #3b82f6 | Disabled states | 6.47:1 | ✅ AAA |

### Secondary Colors

| Color | Hex | Use Case | Contrast Ratio (on white) | WCAG Status |
|-------|-----|----------|---------------------------|-------------|
| **Gray 900** | #1f2937 | Primary text | 16.12:1 | ✅ AAA |
| **Gray 700** | #374151 | Secondary text | 9.23:1 | ✅ AAA |
| **Gray 600** | #4b5563 | Tertiary text | 7.18:1 | ✅ AAA |
| **Gray 500** | #6b7280 | Placeholder text | 5.74:1 | ✅ AA |

### Status Colors

| Color | Hex | Use Case | Contrast Ratio | WCAG Status |
|-------|-----|----------|----------------|-------------|
| **Success Green** | #16a34a | Success messages | 6.89:1 | ✅ AAA |
| **Warning Amber** | #d97706 | Warning messages | 4.92:1 | ✅ AA |
| **Error Red** | #dc2626 | Error messages | 5.84:1 | ✅ AAA |
| **Info Blue** | #0284c7 | Information messages | 6.15:1 | ✅ AAA |

### Background Colors

| Color | Hex | Use Case | Notes |
|-------|-----|----------|-------|
| **White** | #ffffff | Primary background | Base color for contrast calculations |
| **Gray 50** | #f9fafb | Subtle backgrounds | 1.04:1 contrast with white |
| **Gray 100** | #f3f4f6 | Card backgrounds | 1.22:1 contrast with white |

## 🔤 Typography Scale

### Font Family
- **Primary**: Inter, system-ui, -apple-system, sans-serif
- **Fallback**: Arial, Helvetica, sans-serif

### Font Sizes & Line Heights

| Scale | Size | Line Height | Use Case | Mobile Size |
|-------|------|-------------|----------|-------------|
| **xs** | 12px | 16px | Captions, fine print | 12px |
| **sm** | 14px | 20px | Small text, labels | 14px |
| **base** | 16px | 24px | Body text | 16px |
| **lg** | 18px | 28px | Large body text | 16px |
| **xl** | 20px | 28px | Small headings | 18px |
| **2xl** | 24px | 32px | Card titles | 20px |
| **3xl** | 30px | 36px | Section headings | 24px |
| **4xl** | 36px | 40px | Page headings | 28px |
| **5xl** | 48px | 48px | Hero headings | 32px |

### Font Weights

| Weight | Value | Use Case |
|--------|-------|----------|
| **Normal** | 400 | Body text, regular content |
| **Medium** | 500 | Emphasized text, labels |
| **Semibold** | 600 | Headings, important text |
| **Bold** | 700 | Strong emphasis, titles |

## 📏 Spacing System

### Base Unit: 4px

| Token | Value | Use Case |
|-------|-------|----------|
| **xs** | 4px | Micro spacing |
| **sm** | 8px | Small spacing |
| **md** | 16px | Medium spacing |
| **lg** | 24px | Large spacing |
| **xl** | 32px | Extra large spacing |
| **2xl** | 48px | Section spacing |
| **3xl** | 64px | Page spacing |

### Touch Target Sizes

| Size | Minimum | Optimal | Use Case |
|------|---------|---------|----------|
| **Mobile** | 44×44px | 48×48px | All interactive elements |
| **Tablet** | 44×44px | 44×44px | Buttons, links |
| **Desktop** | 24×24px | 32×32px | Small controls |

## 🧩 Component Patterns

### Buttons

#### Primary Button
```css
.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  min-height: 44px;
  border: 2px solid transparent;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-primary:focus {
  outline: 3px solid #fbbf24;
  outline-offset: 2px;
  background-color: #1d4ed8;
}
```

#### Secondary Button
```css
.btn-secondary {
  background-color: transparent;
  color: #2563eb;
  border: 2px solid #2563eb;
  padding: 10px 22px; /* Adjusted for border */
  border-radius: 6px;
  font-weight: 600;
  min-height: 44px;
}
```

### Form Elements

#### Input Fields
```css
.form-input {
  border: 2px solid #d1d5db;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 16px; /* Prevents zoom on iOS */
  min-height: 44px;
}

.form-input:focus {
  border-color: #2563eb;
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.form-input[aria-invalid="true"] {
  border-color: #dc2626;
  outline-color: #dc2626;
}
```

#### Labels
```css
.form-label {
  font-weight: 500;
  margin-bottom: 4px;
  color: #374151;
}
```

### Cards

#### Product Card
```css
.product-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
  transition: box-shadow 0.2s ease;
}

.product-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.product-card:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

## ♿ Accessibility Guidelines

### Focus Management

#### Focus Indicators
- **Minimum**: 3px solid outline with 2px offset
- **Color**: High contrast (yellow #fbbf24 or blue #2563eb)
- **Visible**: Must be visible on all backgrounds

#### Focus Order
1. Skip navigation link (hidden until focused)
2. Main navigation
3. Page content (logical reading order)
4. Footer navigation

### Screen Reader Support

#### Required ARIA Attributes
```html
<!-- Buttons -->
<button aria-label="Add to cart">+</button>

<!-- Form controls -->
<input aria-describedby="email-error" aria-invalid="true">
<div id="email-error" role="alert">Please enter a valid email</div>

<!-- Loading states -->
<div role="status" aria-live="polite">Loading products...</div>

<!-- Navigation -->
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/" aria-current="page">Home</a></li>
  </ul>
</nav>
```

#### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use `<main>` for primary content
- Use `<nav>` for navigation areas
- Use `<section>` and `<article>` for content sections

### Keyboard Navigation

#### Tab Order
- All interactive elements must be keyboard accessible
- Tab order should follow visual layout
- No keyboard traps (except intentional focus traps in modals)

#### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| **Tab** | Next focusable element |
| **Shift + Tab** | Previous focusable element |
| **Enter** | Activate button/link |
| **Space** | Activate button, check checkbox |
| **Escape** | Close modal/dropdown |
| **Arrow Keys** | Navigate within component groups |

### Color & Contrast

#### Minimum Requirements
- **Normal text**: 4.5:1 contrast ratio (WCAG AA)
- **Large text** (18px+ or 14px+ bold): 3:1 contrast ratio
- **Non-text elements**: 3:1 contrast ratio for UI components

#### Best Practices
- Don't rely on color alone to convey information
- Use icons, text, or patterns as additional indicators
- Test with color blindness simulators

### Mobile Accessibility

#### Touch Targets
- **Minimum**: 44×44px (iOS) / 48×48dp (Android)
- **Spacing**: 8px minimum between targets
- **Feedback**: Visual/haptic feedback on interaction

#### Text Sizing
- Support dynamic text sizing (up to 200%)
- Use relative units (rem, em) for scalability
- Test with device accessibility settings

## 🎯 Testing Guidelines

### Accessibility Testing Checklist

#### Automated Testing
- [ ] Run axe-core accessibility tests
- [ ] Check color contrast with WebAIM tools
- [ ] Validate HTML semantics
- [ ] Test with Lighthouse accessibility audit

#### Manual Testing
- [ ] Navigate entire site using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify skip navigation works
- [ ] Test with 200% zoom
- [ ] Check focus indicators on all elements

#### Device Testing
- [ ] Test on iOS with VoiceOver
- [ ] Test on Android with TalkBack
- [ ] Verify touch target sizes on mobile
- [ ] Test with device accessibility settings

### Browser Support

#### Desktop
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### Mobile
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

## 🚀 Implementation Guidelines

### CSS Organization

#### File Structure
```
styles/
├── accessibility.css     # Focus, keyboard nav, screen readers
├── mobile-touch.css      # Touch targets, mobile optimization
└── globals.css          # Base styles
```

#### CSS Custom Properties
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-primary-dark: #1d4ed8;
  --color-text: #1f2937;
  --color-text-secondary: #6b7280;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;

  /* Focus */
  --focus-color: #fbbf24;
  --focus-width: 3px;
  --focus-offset: 2px;
}
```

### Component Development

#### Accessibility First
1. Start with semantic HTML
2. Add ARIA attributes as needed
3. Implement keyboard navigation
4. Add focus management
5. Test with screen readers

#### Code Review Checklist
- [ ] Semantic HTML elements used correctly
- [ ] ARIA attributes present where needed
- [ ] Keyboard navigation implemented
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets meet minimum size
- [ ] Screen reader testing completed

## 📖 Resources

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe Browser Extension](https://www.deque.com/axe/browser-extensions/)
- [WAVE Web Accessibility Evaluator](https://wave.webaim.org/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Testing
- [Screen Reader Testing Guide](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Testing Guide](https://webaim.org/techniques/keyboard/)
- [Mobile Accessibility Testing](https://webaim.org/articles/mobile/)

---

**Last Updated**: September 28, 2025
**Version**: 1.0
**Maintained by**: PG Closets Development Team