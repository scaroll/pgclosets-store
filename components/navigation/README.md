# PG Closets Navigation System

Minimal, elegant navigation components inspired by Kit and Ace design philosophy.

## Components

### Header
Main navigation header with sticky behavior and scroll effects.

**Features:**
- Sticky positioning with scroll detection
- Announcement bar
- Logo with wordmark
- Desktop navigation
- Search and cart icons
- Mobile menu toggle
- CTA button

**Usage:**
```tsx
import { Header } from "@/components/navigation"

export default function Layout() {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
```

### MegaMenuNav
Desktop mega menu navigation with organized product categories.

**Features:**
- Hover-activated dropdowns
- Multi-column grid layout
- Smooth transitions
- Intelligent timeout handling
- Organized sections

**Customization:**
Edit `navigationItems` array in `MegaMenuNav.tsx` to add/modify menu items.

### MobileDrawer
Slide-out mobile navigation drawer.

**Features:**
- Slide animation from left
- Backdrop overlay
- Organized sections
- Expandable categories
- CTA button
- Contact information
- Body scroll lock

**Customization:**
Edit `mobileNavItems` array in `MobileDrawer.tsx` to add/modify menu items.

### SearchOverlay
Full-screen search overlay with suggestions.

**Features:**
- Full-screen experience
- Search input with autofocus
- Popular searches
- Quick links
- Keyboard shortcuts (Escape to close)
- Body scroll lock

**Integration:**
Connect to your search API by modifying the `handleSearch` function.

## Design Philosophy

### Minimalism
- Clean, uncluttered interface
- Generous white space
- Focus on content
- Reduced visual noise

### Typography
- Clear hierarchy
- Readable font sizes
- Appropriate tracking
- Consistent weights

### Interactions
- Smooth transitions
- Subtle hover effects
- Responsive feedback
- Natural animations

### Accessibility
- WCAG AA compliant
- Keyboard navigation
- Screen reader support
- Touch-friendly targets (44x44px minimum)
- Focus indicators
- Semantic HTML

## Styling

The navigation uses Tailwind CSS with custom PG Closets brand colors:
- `pg-navy` - Primary brand color
- `pg-sky` - Secondary brand color
- `pg-dark` - Dark text/backgrounds
- `pg-offwhite` - Light backgrounds
- `pg-gray` - Muted elements

## Performance

### Optimizations
- Lazy loading for mega menu content
- Debounced scroll events
- CSS transforms for animations (GPU accelerated)
- Minimal re-renders
- Efficient event handlers

### Bundle Size
- Header: ~3KB (gzipped)
- MegaMenuNav: ~2KB (gzipped)
- MobileDrawer: ~2KB (gzipped)
- SearchOverlay: ~2KB (gzipped)

Total: ~9KB (gzipped)

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization Guide

### Adding Menu Items

**Desktop Mega Menu:**
```tsx
// In MegaMenuNav.tsx
const navigationItems: NavItem[] = [
  {
    label: "New Category",
    megaMenu: [
      {
        title: "Section 1",
        items: [
          { label: "Item 1", href: "/path" },
          { label: "Item 2", href: "/path" },
        ],
      },
    ],
  },
]
```

**Mobile Menu:**
```tsx
// In MobileDrawer.tsx
const mobileNavItems = [
  {
    label: "New Category",
    items: [
      { label: "Item 1", href: "/path" },
      { label: "Item 2", href: "/path" },
    ],
  },
]
```

### Changing Colors

Update colors in `tailwind.config.ts`:
```ts
colors: {
  'pg-navy': 'var(--pg-navy)',
  // Add your custom colors
}
```

### Modifying Animations

Animations are defined in component classes using Tailwind utilities:
- Duration: `duration-300` (300ms)
- Easing: `ease-out`, `ease-in-out`
- Transform: `translate-x-0`, `rotate-180`

## Demo

View the navigation system in action:
```
/navigation-demo
```

## Integration with Existing Layout

Replace the existing `PgHeader` component in `app/layout.tsx`:

```tsx
// Before
import PgHeader from "@/components/PgHeader"

// After
import { Header } from "@/components/navigation"

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
```

## API Reference

### Header Props
No props required - fully self-contained component.

### MegaMenuNav Props
No props required - customize via `navigationItems` array.

### MobileDrawer Props
```tsx
interface MobileDrawerProps {
  isOpen: boolean      // Controls drawer visibility
  onClose: () => void  // Callback when drawer closes
}
```

### SearchOverlay Props
```tsx
interface SearchOverlayProps {
  isOpen: boolean      // Controls overlay visibility
  onClose: () => void  // Callback when overlay closes
}
```

## Future Enhancements

Potential improvements for future iterations:
- [ ] Real-time search results
- [ ] Search history
- [ ] Product recommendations in search
- [ ] Multi-level mobile menu
- [ ] Mega menu images/previews
- [ ] Shopping cart preview
- [ ] User account menu
- [ ] Language/currency selector
- [ ] Announcement bar carousel
- [ ] Voice search

## Support

For issues or questions, refer to the main project documentation or create an issue in the repository.
