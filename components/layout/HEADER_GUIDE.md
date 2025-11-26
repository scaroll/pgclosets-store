# Header Component - Complete Guide

Apple-inspired navigation header for PG Closets store.

## Features

### 1. Sticky Header with Scroll Effects
- **Transparent on Hero**: Header starts transparent at the top of the page
- **Solid on Scroll**: Transitions to solid background with blur effect when scrolled
- **Backdrop Blur**: Glass morphism effect using `backdrop-blur-xl`
- **Height Shrink**: Slightly reduces padding on scroll for a compact feel
- **Smooth Transitions**: 300ms cubic-bezier transitions matching Apple's animation timing

### 2. Desktop Navigation (≥1024px)
- **Logo**: Gradient text logo (Apple Blue to Woodgrain)
- **Center Navigation**: Products, Collections, About, Contact links
- **Active States**: Links highlight in Apple Blue when active
- **Mega Menu**: Products dropdown with 6 product categories in 2-column grid
  - Walk-In Closets
  - Reach-In Closets
  - Wardrobe Systems
  - Storage Solutions
  - Hardware & Finishes
  - Custom Projects
- **Hover Effects**: Subtle opacity changes (70%) on hover

### 3. Right Side Actions
- **Search Button**: Opens overlay search modal
- **Cart Button**:
  - Shows shopping bag icon
  - Animated cart count badge
  - Links to cart page
  - Uses Framer Motion for scale animation
- **User Menu**: Dropdown with account links
  - Profile
  - Orders
  - Wishlist
  - Settings
  - Sign Out

### 4. Mobile Navigation (<1024px)
- **Hamburger Menu**: Animated menu icon
- **Full-Screen Drawer**: Slides in from right using ShadCN Sheet
- **Mobile Search**: Search bar at top of drawer
- **Accordion Navigation**: Nested navigation with smooth accordion
- **Account Links**: My Account, Orders, Wishlist
- **Sign In Button**: Call-to-action at bottom

### 5. Search Overlay
- **Full-Screen Modal**: Dark backdrop with blur
- **Centered Input**: Large, prominent search field
- **Smooth Animation**: Slide down with spring physics
- **ESC to Close**: User-friendly dismissal

### 6. Styling & Design
- **Apple-Style Transitions**: 300ms cubic-bezier easing
- **Dark Mode Support**: Automatic theme switching
- **Apple Blue**: Primary brand color (#0066CC in light, #0A84FF in dark)
- **Woodgrain Accent**: Secondary brand color for luxury feel
- **Responsive Container**: Max-width with proper padding
- **Accessibility**: ARIA labels on icon buttons

## Usage

```tsx
import { Header } from "@/components/layout"

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
```

## Dependencies

Required packages (already installed):
- `framer-motion` - Smooth animations
- `lucide-react` - Icon library
- `@radix-ui/react-dialog` - For Sheet component
- `@radix-ui/react-dropdown-menu` - For dropdowns
- `@radix-ui/react-accordion` - For mobile menu

## Cart Integration

The header integrates with the cart context at `/hooks/use-cart.tsx`:

```tsx
const { getTotalItems } = useCart()
const cartItemCount = getTotalItems()
```

## Color System

Uses the Apple-inspired color system defined in `tailwind.config.ts`:

- `apple-blue-600`: Primary link color (light mode)
- `apple-blue-dark`: Primary link color (dark mode)
- `woodgrain-600`: Brand accent color
- `background/80`: Semi-transparent background
- Standard ShadCN colors: `accent`, `muted-foreground`, etc.

## Customization

### Update Navigation Links

Edit the `navigation` array in `header.tsx`:

```tsx
const navigation = [
  { name: "Products", href: "/products", hasDropdown: true },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]
```

### Update Product Categories

Edit the `productCategories` array:

```tsx
const productCategories = [
  {
    name: "Walk-In Closets",
    href: "/products/walk-in-closets",
    description: "Custom luxury walk-in closet systems",
  },
  // ... add more categories
]
```

### Customize Scroll Threshold

Change the scroll trigger point (currently 10px):

```tsx
const handleScroll = () => {
  const scrolled = window.scrollY > 10 // Change this value
  setIsScrolled(scrolled)
}
```

## Performance

- **Passive Event Listeners**: Scroll events use `{ passive: true }`
- **Route Change Cleanup**: Mobile menu closes on navigation
- **Smooth Animations**: Hardware-accelerated transforms
- **Optimized Renders**: State management prevents unnecessary re-renders

## Accessibility

- **Semantic HTML**: Proper `<header>`, `<nav>` elements
- **ARIA Labels**: All icon buttons have descriptive labels
- **Keyboard Navigation**: Full keyboard support via Radix UI
- **Focus Management**: Proper focus handling in modals
- **Screen Reader Support**: Hidden text for icon-only buttons

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Backdrop blur fallback for older browsers
- Responsive design for all screen sizes
- Touch-optimized for mobile devices
