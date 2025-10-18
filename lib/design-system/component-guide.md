# PG Closets Component Style Guide

Kit and Ace-inspired components: minimal, elegant, approachable.

## Button Components

### Primary Button

```tsx
<button className="
  bg-pg-navy-800
  hover:bg-pg-navy-700
  active:bg-pg-navy-900
  text-white
  px-6 py-3
  rounded-lg
  font-medium
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
  disabled:opacity-40 disabled:cursor-not-allowed
  min-h-[44px]
">
  Primary Action
</button>
```

### Secondary Button

```tsx
<button className="
  bg-pg-sky-300
  hover:bg-pg-sky-400
  active:bg-pg-sky-500
  text-pg-navy-800
  px-6 py-3
  rounded-lg
  font-medium
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
  disabled:opacity-40 disabled:cursor-not-allowed
  min-h-[44px]
">
  Secondary Action
</button>
```

### Outline Button

```tsx
<button className="
  bg-transparent
  border-2 border-pg-neutral-300
  hover:bg-pg-neutral-50
  active:bg-pg-neutral-100
  text-pg-text-primary
  px-6 py-3
  rounded-lg
  font-medium
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
  disabled:opacity-40 disabled:cursor-not-allowed
  min-h-[44px]
">
  Outline Action
</button>
```

### Ghost Button

```tsx
<button className="
  bg-transparent
  hover:bg-pg-neutral-50
  active:bg-pg-neutral-100
  text-pg-text-primary
  px-6 py-3
  rounded-lg
  font-medium
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
  disabled:opacity-40 disabled:cursor-not-allowed
  min-h-[44px]
">
  Ghost Action
</button>
```

### Button Sizes

```tsx
// Small
<button className="px-4 py-2 text-sm h-8">Small</button>

// Medium (Default)
<button className="px-6 py-3 text-base min-h-[44px]">Medium</button>

// Large
<button className="px-8 py-4 text-lg h-12">Large</button>
```

---

## Input Components

### Text Input

```tsx
<div className="space-y-2">
  <label
    htmlFor="input-id"
    className="block text-sm font-medium text-pg-text-primary"
  >
    Label
  </label>
  <input
    id="input-id"
    type="text"
    placeholder="Enter text..."
    className="
      w-full
      px-4 py-3
      border border-pg-border-DEFAULT
      rounded-lg
      text-base
      text-pg-text-primary
      placeholder:text-pg-text-disabled
      focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:border-transparent
      disabled:bg-pg-neutral-100 disabled:cursor-not-allowed
      transition-all duration-200
      min-h-[44px]
    "
  />
  <p className="text-sm text-pg-text-secondary">Helper text</p>
</div>
```

### Input with Error

```tsx
<div className="space-y-2">
  <label
    htmlFor="error-input"
    className="block text-sm font-medium text-pg-text-primary"
  >
    Label
  </label>
  <input
    id="error-input"
    type="text"
    aria-invalid="true"
    aria-describedby="error-message"
    className="
      w-full
      px-4 py-3
      border-2 border-pg-semantic-error-DEFAULT
      rounded-lg
      text-base
      text-pg-text-primary
      focus:outline-none focus:ring-2 focus:ring-pg-semantic-error-DEFAULT focus:border-transparent
      min-h-[44px]
    "
  />
  <p id="error-message" className="text-sm text-pg-semantic-error-DEFAULT">
    Error message here
  </p>
</div>
```

### Textarea

```tsx
<div className="space-y-2">
  <label
    htmlFor="textarea-id"
    className="block text-sm font-medium text-pg-text-primary"
  >
    Label
  </label>
  <textarea
    id="textarea-id"
    rows={4}
    placeholder="Enter text..."
    className="
      w-full
      px-4 py-3
      border border-pg-border-DEFAULT
      rounded-lg
      text-base
      text-pg-text-primary
      placeholder:text-pg-text-disabled
      focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:border-transparent
      disabled:bg-pg-neutral-100 disabled:cursor-not-allowed
      transition-all duration-200
      resize-y
    "
  />
</div>
```

---

## Card Components

### Basic Card

```tsx
<div className="
  bg-white
  border border-pg-border-light
  rounded-lg
  shadow-md
  p-6
  hover:shadow-lg
  transition-shadow duration-200
">
  <h3 className="text-xl font-semibold text-pg-text-primary mb-2">
    Card Title
  </h3>
  <p className="text-base text-pg-text-secondary">
    Card description goes here. Keep it concise and clear.
  </p>
</div>
```

### Card with Image

```tsx
<div className="
  bg-white
  border border-pg-border-light
  rounded-lg
  shadow-md
  overflow-hidden
  hover:shadow-lg
  transition-shadow duration-200
">
  <img
    src="/image.jpg"
    alt="Description"
    className="w-full h-48 object-cover"
  />
  <div className="p-6 space-y-4">
    <h3 className="text-xl font-semibold text-pg-text-primary">
      Card Title
    </h3>
    <p className="text-base text-pg-text-secondary">
      Card description with image above.
    </p>
    <button className="
      bg-pg-navy-800
      hover:bg-pg-navy-700
      text-white
      px-6 py-3
      rounded-lg
      font-medium
      transition-colors duration-200
      w-full
    ">
      Action
    </button>
  </div>
</div>
```

### Interactive Card (Clickable)

```tsx
<a href="/link" className="
  block
  bg-white
  border border-pg-border-light
  rounded-lg
  shadow-md
  p-6
  hover:shadow-lg
  hover:border-pg-navy-800
  focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2
  transition-all duration-200
  group
">
  <h3 className="text-xl font-semibold text-pg-text-primary group-hover:text-pg-navy-800 mb-2">
    Clickable Card
  </h3>
  <p className="text-base text-pg-text-secondary">
    Entire card is clickable with hover effects.
  </p>
</a>
```

---

## Typography Components

### Headings

```tsx
<h1 className="text-5xl font-bold text-pg-text-primary tracking-tight mb-4">
  Hero Heading
</h1>

<h2 className="text-4xl font-bold text-pg-text-primary tracking-tight mb-3">
  Section Heading
</h2>

<h3 className="text-2xl font-semibold text-pg-text-primary mb-2">
  Subsection Heading
</h3>

<h4 className="text-xl font-semibold text-pg-text-primary mb-2">
  Component Heading
</h4>

<h5 className="text-lg font-medium text-pg-text-primary mb-1">
  Small Heading
</h5>
```

### Body Text

```tsx
<p className="text-base text-pg-text-primary leading-relaxed mb-4">
  Primary body text with comfortable line height for optimal readability.
</p>

<p className="text-base text-pg-text-secondary leading-relaxed mb-4">
  Secondary body text with slightly reduced emphasis.
</p>

<p className="text-sm text-pg-text-tertiary leading-normal">
  Tertiary text for less important content.
</p>
```

### Special Text

```tsx
// Overline / Label
<span className="text-sm text-pg-text-secondary uppercase tracking-wide font-medium">
  Overline Text
</span>

// Lead Paragraph
<p className="text-lg text-pg-text-primary leading-relaxed mb-6">
  Lead paragraph with larger text size for introductions.
</p>

// Caption
<p className="text-xs text-pg-text-tertiary">
  Caption or helper text
</p>
```

### Links

```tsx
<a
  href="/link"
  className="
    text-pg-text-link
    hover:text-pg-text-linkHover
    underline underline-offset-4
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-1 focus:rounded-sm
  "
>
  Link Text
</a>
```

---

## Badge Components

### Status Badges

```tsx
// Success
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-sm font-medium
  bg-pg-semantic-success-light
  text-pg-semantic-success-dark
">
  Success
</span>

// Warning
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-sm font-medium
  bg-pg-semantic-warning-light
  text-pg-semantic-warning-dark
">
  Warning
</span>

// Error
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-sm font-medium
  bg-pg-semantic-error-light
  text-pg-semantic-error-dark
">
  Error
</span>

// Info
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-sm font-medium
  bg-pg-semantic-info-light
  text-pg-semantic-info-dark
">
  Info
</span>
```

### Simple Badges

```tsx
<span className="
  inline-flex items-center
  px-3 py-1
  rounded-full
  text-xs font-medium
  bg-pg-neutral-100
  text-pg-text-primary
">
  Badge
</span>
```

---

## Navigation Components

### Primary Navigation

```tsx
<nav className="bg-white border-b border-pg-border-light">
  <div className="max-w-7xl mx-auto px-6 py-4">
    <ul className="flex space-x-8">
      <li>
        <a
          href="/"
          className="
            text-base font-medium
            text-pg-text-primary
            hover:text-pg-navy-800
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:ring-offset-2 focus:rounded-sm
          "
        >
          Home
        </a>
      </li>
      <li>
        <a
          href="/products"
          className="
            text-base font-medium
            text-pg-navy-800
            border-b-2 border-pg-navy-800
            pb-0.5
          "
          aria-current="page"
        >
          Products
        </a>
      </li>
      {/* More items... */}
    </ul>
  </div>
</nav>
```

### Breadcrumbs

```tsx
<nav aria-label="Breadcrumb" className="mb-8">
  <ol className="flex items-center space-x-2 text-sm">
    <li>
      <a
        href="/"
        className="text-pg-text-secondary hover:text-pg-text-primary transition-colors"
      >
        Home
      </a>
    </li>
    <li className="text-pg-text-disabled">/</li>
    <li>
      <a
        href="/products"
        className="text-pg-text-secondary hover:text-pg-text-primary transition-colors"
      >
        Products
      </a>
    </li>
    <li className="text-pg-text-disabled">/</li>
    <li>
      <span className="text-pg-text-primary font-medium" aria-current="page">
        Current Page
      </span>
    </li>
  </ol>
</nav>
```

---

## Alert Components

### Information Alert

```tsx
<div className="
  bg-pg-semantic-info-light
  border-l-4 border-pg-semantic-info-DEFAULT
  rounded-lg
  p-4
  space-y-2
" role="alert">
  <h4 className="text-sm font-semibold text-pg-semantic-info-dark">
    Information
  </h4>
  <p className="text-sm text-pg-semantic-info-dark">
    This is an informational message.
  </p>
</div>
```

### Success Alert

```tsx
<div className="
  bg-pg-semantic-success-light
  border-l-4 border-pg-semantic-success-DEFAULT
  rounded-lg
  p-4
  space-y-2
" role="alert">
  <h4 className="text-sm font-semibold text-pg-semantic-success-dark">
    Success
  </h4>
  <p className="text-sm text-pg-semantic-success-dark">
    Action completed successfully.
  </p>
</div>
```

### Warning Alert

```tsx
<div className="
  bg-pg-semantic-warning-light
  border-l-4 border-pg-semantic-warning-DEFAULT
  rounded-lg
  p-4
  space-y-2
" role="alert">
  <h4 className="text-sm font-semibold text-pg-semantic-warning-dark">
    Warning
  </h4>
  <p className="text-sm text-pg-semantic-warning-dark">
    Please review this warning message.
  </p>
</div>
```

### Error Alert

```tsx
<div className="
  bg-pg-semantic-error-light
  border-l-4 border-pg-semantic-error-DEFAULT
  rounded-lg
  p-4
  space-y-2
" role="alert" aria-live="assertive">
  <h4 className="text-sm font-semibold text-pg-semantic-error-dark">
    Error
  </h4>
  <p className="text-sm text-pg-semantic-error-dark">
    An error occurred. Please try again.
  </p>
</div>
```

---

## Loading States

### Spinner

```tsx
<div className="
  w-8 h-8
  border-4 border-pg-neutral-200
  border-t-pg-navy-800
  rounded-full
  animate-spin
" role="status" aria-label="Loading">
  <span className="sr-only">Loading...</span>
</div>
```

### Skeleton

```tsx
<div className="space-y-4 animate-pulse">
  <div className="h-4 bg-pg-neutral-200 rounded w-3/4"></div>
  <div className="h-4 bg-pg-neutral-200 rounded w-full"></div>
  <div className="h-4 bg-pg-neutral-200 rounded w-5/6"></div>
</div>
```

### Shimmer Effect

```tsx
<div className="
  relative
  overflow-hidden
  bg-pg-neutral-100
  rounded-lg
  h-32
  before:absolute
  before:inset-0
  before:-translate-x-full
  before:animate-shimmer
  before:bg-gradient-to-r
  before:from-transparent
  before:via-white/50
  before:to-transparent
">
  {/* Content */}
</div>
```

---

## Form Layout Examples

### Stacked Form

```tsx
<form className="space-y-6 max-w-md">
  <div className="space-y-2">
    <label htmlFor="name" className="block text-sm font-medium text-pg-text-primary">
      Name
    </label>
    <input
      id="name"
      type="text"
      className="w-full px-4 py-3 border border-pg-border-DEFAULT rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:border-transparent"
    />
  </div>

  <div className="space-y-2">
    <label htmlFor="email" className="block text-sm font-medium text-pg-text-primary">
      Email
    </label>
    <input
      id="email"
      type="email"
      className="w-full px-4 py-3 border border-pg-border-DEFAULT rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky-300 focus:border-transparent"
    />
  </div>

  <button type="submit" className="w-full bg-pg-navy-800 hover:bg-pg-navy-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
    Submit
  </button>
</form>
```

---

## Spacing Examples

```tsx
// Tight spacing (form elements)
<div className="space-y-1">

// Default component spacing
<div className="space-y-4">

// Section spacing
<div className="space-y-8">

// Large section breaks
<div className="space-y-16">

// Page sections
<div className="space-y-24">
```

---

## Accessibility Checklist

When building components:

- [ ] Minimum 44px touch targets for interactive elements
- [ ] 2px focus ring with 2px offset in sky blue
- [ ] ARIA labels for icon-only buttons
- [ ] Semantic HTML elements (nav, main, section, article)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Form labels associated with inputs
- [ ] Error messages announced to screen readers
- [ ] Keyboard navigation support
- [ ] Color contrast ratios meet WCAG AA
- [ ] Loading states announced to screen readers

---

**Version**: 1.0.0
**Last Updated**: 2025-10-04
