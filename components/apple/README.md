# Apple UI Clone Components

A comprehensive collection of React components inspired by Apple's design language, built for the PG Closets website.

## 🎨 Design Philosophy

These components follow Apple's design DNA:
- **Minimalist**: Clean, uncluttered interfaces
- **Typography-focused**: Large, bold headlines with careful hierarchy
- **Smooth animations**: Framer Motion for fluid transitions
- **Responsive**: Mobile-first design that scales beautifully
- **Accessible**: Built with WCAG compliance in mind

## 📦 Components

### AppleHero
Large hero section with title, subtitle, and image.

```tsx
<AppleHero
  title="Custom Closets"
  subtitle="Transform your space"
  background="#FBFBFD"
  textColor="dark"
  imageMobile="/images/hero-mobile.jpg"
  imageDesktop="/images/hero-desktop.jpg"
  links={[
    { text: 'Learn more', href: '/products' },
    { text: 'Shop', href: '/store' }
  ]}
/>
```

**Props:**
- `title` (string): Main headline
- `subtitle` (string): Supporting text
- `background` (string): Background color
- `textColor` ('light' | 'dark'): Text color theme
- `imageMobile` (string): Mobile image path
- `imageDesktop` (string): Desktop image path
- `links` (array): CTA links with text and href

---

### AppleProductCard
Individual product showcase card with image and text.

```tsx
<AppleProductCard
  title="iPhone 14"
  subtitle="PRO"
  description="Big and bigger"
  imageMobile="/images/product-mobile.jpg"
  imageDesktop="/images/product-desktop.jpg"
  background="#000000"
  textColor="light"
  links={[
    { text: 'Learn more', href: '/products/iphone-14' },
    { text: 'Buy', href: '/store/iphone-14' }
  ]}
  height="440px"
/>
```

**Props:**
- `title` (string): Product name
- `subtitle` (string, optional): Badge/category
- `description` (string): Product tagline
- `imageMobile` (string): Mobile product image
- `imageDesktop` (string, optional): Desktop product image
- `background` (string): Card background color
- `textColor` ('light' | 'dark'): Text color theme
- `links` (array): CTA links
- `height` (string): Card minimum height

---

### AppleProductGrid
Grid layout for displaying multiple products.

```tsx
<AppleProductGrid
  products={[
    {
      title: "Product 1",
      description: "Description",
      imageMobile: "/image1.jpg",
      background: "#FBFBFD",
      links: [...]
    },
    // ... more products
  ]}
  columns={2}
/>
```

**Props:**
- `products` (array): Array of product objects
- `columns` (2 | 3): Number of columns (responsive)

---

### AppleScrollCarousel
Horizontal scrolling carousel for showcasing content.

```tsx
<AppleScrollCarousel
  title="Featured Projects"
  items={[
    {
      id: '1',
      thumbnail: '/images/project1.jpg',
      genre: 'WALK-IN CLOSET',
      description: 'Luxury transformation',
      buttonText: 'View project',
      buttonLink: '/gallery/project-1'
    }
  ]}
/>
```

**Props:**
- `title` (string, optional): Section title
- `items` (array): Carousel items with thumbnail, genre, description, button

---

### AppleNavbar
Fixed top navigation with desktop and mobile modes.

```tsx
<AppleNavbar
  logo={<YourLogoComponent />}
  items={[
    { label: 'Store', href: '/store' },
    { label: 'Products', href: '/products' },
    // ... more items
  ]}
/>
```

**Props:**
- `logo` (ReactNode, optional): Logo component
- `items` (array): Navigation items with label and href

**Features:**
- Desktop: Horizontal bar with all items
- Mobile: Hamburger menu with slide-in panel
- Backdrop blur effect
- Search bar in mobile menu

---

### AppleFooter
Comprehensive footer with accordion on mobile.

```tsx
<AppleFooter
  sections={[
    {
      title: 'Shop and Learn',
      links: [
        { label: 'Store', href: '/store' },
        { label: 'Products', href: '/products' }
      ]
    }
  ]}
  companyName="PG Closets"
  location="Ottawa, Canada"
/>
```

**Props:**
- `sections` (array, optional): Footer link sections
- `companyName` (string): Company name for copyright
- `location` (string): Location display

**Features:**
- Desktop: Multi-column grid layout
- Mobile: Accordion-style sections
- Legal links
- Copyright notice

---

## 🚀 Usage

### Installation

Components are ready to use. Make sure you have the required dependencies:

```json
{
  "dependencies": {
    "react": "^18",
    "next": "^15",
    "framer-motion": "^11",
    "tailwindcss": "^3"
  }
}
```

### Import Components

```tsx
import {
  AppleHero,
  AppleProductCard,
  AppleProductGrid,
  AppleScrollCarousel,
  AppleNavbar,
  AppleFooter
} from '@/components/apple'
```

### Example Page

See `/app/apple-demo/page.tsx` for a complete example implementation.

---

## 🎨 Design Tokens

Components use Tailwind CSS classes that reference your existing design system:

### Colors
- `apple-gray-*`: Grayscale palette (50-950)
- `apple-blue-*`: Apple blue shades
- `apple-dark-*`: Dark mode colors

### Typography
- Font sizes: `apple-11` to `apple-80`
- Font families: `font-sf-display`, `font-sf-text`

### Shadows
- `shadow-apple-sm`, `shadow-apple-md`, `shadow-apple-lg`, `shadow-apple-xl`

### Animations
- `animate-fade-in`, `animate-fade-up`, `animate-slide-up`

---

## 🌐 Responsive Breakpoints

Components are responsive by default:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## ♿ Accessibility

All components include:
- Semantic HTML
- ARIA labels where appropriate
- Keyboard navigation support
- Focus states
- Screen reader friendly

---

## 🎬 Animations

Powered by Framer Motion:

- Smooth fade-ins on scroll
- Staggered animations for grids
- Slide transitions for mobile menu
- Scale effects on cards

---

## 📱 Mobile Optimizations

- Touch-friendly tap targets
- Swipe-enabled carousel
- Responsive images
- Mobile-first CSS
- Optimized for small screens

---

## 🔧 Customization

### Changing Colors

```tsx
<AppleHero
  background="#YOUR_COLOR"
  textColor="light" // or "dark"
/>
```

### Adjusting Animations

Modify Framer Motion props in component files:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }} // Adjust timing
>
```

### Grid Columns

```tsx
<AppleProductGrid
  products={products}
  columns={3} // 2 or 3
/>
```

---

## 📖 Examples

### Homepage Hero

```tsx
<AppleHero
  title="Welcome to PG Closets"
  subtitle="Elevated taste without pretense"
  background="#FBFBFD"
  textColor="dark"
  imageMobile="/images/hero-mobile.jpg"
  imageDesktop="/images/hero-desktop.jpg"
  links={[
    { text: 'Explore Collection', href: '/products' },
    { text: 'Book Consultation', href: '/book' }
  ]}
/>
```

### Product Showcase

```tsx
<AppleProductGrid
  products={[
    {
      title: 'Sliding Doors',
      subtitle: 'PREMIUM',
      description: 'Elegance meets function',
      imageMobile: '/doors-m.jpg',
      imageDesktop: '/doors-d.jpg',
      background: '#000',
      textColor: 'light',
      links: [
        { text: 'Learn more', href: '/products/doors' },
        { text: 'Shop now', href: '/store/doors' }
      ]
    }
  ]}
  columns={2}
/>
```

---

## 🎯 Best Practices

1. **Images**: Use high-quality images optimized for web
2. **Text**: Keep headlines short and impactful
3. **Links**: Provide clear call-to-actions
4. **Colors**: Stick to brand palette
5. **Performance**: Lazy load images when possible

---

## 🐛 Troubleshooting

### Images not showing
- Check image paths are correct
- Ensure images exist in `/public/images/`
- Verify Next.js Image Optimization is configured

### Animations not smooth
- Check `prefers-reduced-motion` is respected
- Ensure Framer Motion is installed
- Verify hardware acceleration

### Mobile menu not closing
- Check click handlers
- Verify state management
- Test on actual mobile devices

---

## 📄 License

Part of the PG Closets project.

---

## 🙏 Credits

Inspired by Apple's design language and adapted for the custom closet industry.

---

**Built with ❤️ using Next.js, React, TypeScript, Tailwind CSS, and Framer Motion**
