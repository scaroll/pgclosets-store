# PG Closets MDX Documentation System

A modern, MDX-based documentation system built with Next.js 15, designed specifically for PG Closets. Features unified design system integration, automatic navigation generation, and Apple-inspired aesthetics.

## Overview

This documentation system provides comprehensive guides accessible at `/docs`:

- **Products**: Renin closet systems, doors, and hardware
- **Design System**: Design tokens, components, and patterns
- **Installation Guides**: Professional and DIY installation instructions
- **API Documentation**: Developer resources and integration guides

## Architecture

Built on proven patterns from Once UI Magic Docs, adapted for PG Closets:

```
docs/
├── components/              # React components
│   ├── mdx-components.tsx   # Styled MDX components
│   ├── Sidebar.tsx          # Navigation sidebar
│   └── DocsLayout.tsx       # Layout wrapper
├── content/                # MDX documentation files
│   ├── products/           # Product guides
│   ├── design-system/      # Design system docs
│   ├── guides/             # Installation & maintenance
│   └── api/                # API documentation
└── utils/                  # Utility functions
    ├── getNavigation.ts    # Auto-generate navigation
    └── getPages.ts         # Page management utilities

app/docs/
├── page.tsx                # Docs homepage
└── [...slug]/
    └── page.tsx            # Dynamic doc pages
```

## Key Features

### 1. MDX-Based Content

Write documentation in Markdown with React components:

```mdx
---
title: "Product Guide"
summary: "Complete guide for our products"
updatedAt: "2025-01-16"
---

# Product Guide

Regular markdown content...

<Callout type="info">
Custom React components work seamlessly!
</Callout>
```

### 2. Automatic Navigation

Navigation is automatically generated from file structure - no manual configuration needed!

### 3. Design Token Integration

All components use PG Closets unified design tokens for visual consistency.

### 4. Apple-Inspired Aesthetics

- Clean, minimal design
- Premium typography (Cormorant + Inter)
- Subtle shadows and transitions
- Responsive layout optimized for all devices

## Writing Documentation

### Creating a New Page

1. **Create MDX file** in appropriate content folder:

```bash
docs/content/products/new-product.mdx
```

2. **Add frontmatter** metadata:

```mdx
---
title: "New Product Guide"
summary: "Brief description of the product"
updatedAt: "2025-01-16"
keywords: "product, guide, installation"
order: 3
---

# Your Content Here

Write your documentation in Markdown...
```

3. **Page automatically appears** in navigation!

### Using Custom Components

#### Callout

```mdx
<Callout type="info">
Important information for readers
</Callout>

<Callout type="warning">
Warning or caution message
</Callout>

<Callout type="success">
Success message or confirmation
</Callout>

<Callout type="error">
Error or critical information
</Callout>
```

#### Card

```mdx
<Card>
Content inside a styled card container
</Card>
```

### Frontmatter Options

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Page title (required) |
| `summary` | string | Brief description for metadata |
| `updatedAt` | string | Last update date (YYYY-MM-DD) |
| `image` | string | Cover image URL |
| `keywords` | string | SEO keywords |
| `order` | number | Custom sort order |
| `icon` | string | Icon name (optional) |

## Navigation System

### Custom Ordering

Control page order with `meta.json`:

```json
{
  "title": "Section Name",
  "order": 2,
  "pages": {
    "overview": 1,
    "getting-started": 2,
    "advanced": 3
  }
}
```

### Directory Structure

```
content/
├── meta.json                 # Root ordering
├── getting-started.mdx       # Top-level page
├── products/
│   ├── meta.json            # Products section config
│   ├── overview.mdx         # Section pages
│   └── specifications.mdx
└── guides/
    ├── meta.json
    └── installation.mdx
```

## Design System Integration

All MDX components automatically use design tokens from `/lib/design-tokens.ts`:

- **Colors**: `colors.brand`, `colors.gray`, `colors.semantic`
- **Typography**: `typography.fonts`, `typography.sizes`, `typography.weights`
- **Spacing**: `spacing.xs` through `spacing['6xl']`
- **Shadows**: `shadows.sm` through `shadows.modal`
- **Radius**: `radius.sm` through `radius.full`

See `/docs/design-system/tokens` for complete reference.

## Development

### Running Locally

```bash
# Start development server
npm run dev

# Visit documentation
http://localhost:3000/docs
```

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm start
```

## File Organization

### Recommended Structure

```
content/
├── meta.json
├── getting-started.mdx
├── products/
│   ├── meta.json
│   ├── overview.mdx
│   └── [product-name].mdx
├── design-system/
│   ├── meta.json
│   ├── overview.mdx
│   ├── tokens.mdx
│   └── components.mdx
├── guides/
│   ├── meta.json
│   ├── installation.mdx
│   ├── maintenance.mdx
│   └── troubleshooting.mdx
└── api/
    ├── meta.json
    └── [endpoint-name].mdx
```

### Naming Conventions

- **Files**: `kebab-case.mdx`
- **Titles**: Title Case in frontmatter
- **Directories**: `kebab-case`
- **URLs**: `/docs/category/page-name`

## Accessibility

The documentation system follows WCAG AA standards:

- Semantic HTML structure
- Proper heading hierarchy
- Focus states for interactive elements
- Color contrast ratios meet AA standards
- Keyboard navigation support
- Screen reader friendly

## SEO

Built-in SEO features:

- Automatic metadata generation from frontmatter
- OpenGraph tags for social sharing
- Structured data for search engines
- Semantic HTML for better indexing

## Troubleshooting

### Navigation Not Updating

1. **Restart dev server** after adding new files
2. **Check meta.json syntax** for JSON errors
3. **Verify file structure** matches expectations

### Styles Not Applied

1. **Confirm imports** from design tokens
2. **Check component registration** in mdx-components.tsx
3. **Verify TypeScript types** match design tokens

## Migration from Magic Docs

Key differences from the original Magic Docs:

| Feature | Magic Docs | PG Closets Docs |
|---------|-----------|-----------------|
| Design System | Once UI | PG Closets Design Tokens |
| Location | `/src/content` | `/docs/content` |
| Components | Once UI Components | Custom MDX Components |
| Styling | SCSS Modules | Inline Styles with Tokens |

## Contributing

When adding documentation:

1. Follow the naming conventions
2. Use design tokens for styling
3. Include comprehensive frontmatter
4. Test locally before committing
5. Run type-check and lint

---

**Built with**:
- Next.js 15.5.5
- React 18
- TypeScript
- MDX
- PG Closets Design System

**Inspired by**:
- Once UI Magic Docs
- Apple Human Interface Guidelines
- Modern documentation best practices
