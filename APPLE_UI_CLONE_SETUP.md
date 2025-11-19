# Apple UI Clone - Setup Complete! 🎉

## Overview

I've successfully integrated a comprehensive Apple UI clone into your PG Closets website! The components are inspired by https://github.com/sentayhu19/Apple-UI-Clone-Design but completely rewritten for React/Next.js with TypeScript.

## What's Been Created

### 🎨 Components (/components/apple/)

1. **AppleHero** - Large hero sections with smooth animations
2. **AppleProductCard** - Individual product showcase cards
3. **AppleProductGrid** - Responsive grid layout for products
4. **AppleScrollCarousel** - Horizontal scrolling carousel
5. **AppleNavbar** - Fixed navigation with mobile menu
6. **AppleFooter** - Comprehensive footer with accordion

### 📄 Pages

- **/app/apple-demo/page.tsx** - Complete demo showcasing all components

### 📚 Documentation

- **/components/apple/README.md** - Comprehensive component documentation

## Quick Start

### 1. View the Demo

Visit the demo page to see all components in action:

```bash
npm run dev
# Navigate to http://localhost:3000/apple-demo
```

### 2. Use Components in Your Pages

```tsx
import {
  AppleHero,
  AppleProductCard,
  AppleProductGrid,
  AppleScrollCarousel,
  AppleNavbar,
  AppleFooter
} from '@/components/apple'

export default function MyPage() {
  return (
    <div>
      <AppleHero
        title="Welcome to PG Closets"
        subtitle="Elevated taste without pretense"
        background="#FBFBFD"
        textColor="dark"
        links={[
          { text: 'Explore', href: '/products' },
          { text: 'Book', href: '/book' }
        ]}
      />

      {/* More components... */}
    </div>
  )
}
```

### 3. Customize Your Design

All components use your existing Tailwind design system:

- **Colors**: `apple-gray-*`, `apple-blue-*`, `apple-dark-*`
- **Typography**: `text-apple-11` to `text-apple-80`
- **Shadows**: `shadow-apple-sm`, `shadow-apple-md`, `shadow-apple-lg`
- **Animations**: Built-in Framer Motion animations

## Design Philosophy

### Apple DNA Applied to PG Closets

1. **Minimalist** - Clean, uncluttered interfaces
2. **Typography-First** - Bold headlines, clear hierarchy
3. **Smooth Animations** - Framer Motion for fluid transitions
4. **Responsive** - Mobile-first, scales beautifully
5. **Accessible** - WCAG compliant, keyboard navigation

### Color Palette

```tsx
// Light backgrounds
background="#FBFBFD"  // Soft off-white
background="#F5F5F7"  // Apple gray

// Dark backgrounds
background="#000000"  // Pure black
background="#333"     // Dark gray (navbar)

// Text colors
textColor="dark"  // For light backgrounds
textColor="light" // For dark backgrounds
```

## Component Examples

### Hero Section

```tsx
<AppleHero
  title="Custom Closets Reimagined"
  subtitle="Elevate your space. Organize your life."
  background="#FBFBFD"
  textColor="dark"
  imageMobile="/images/hero-mobile.jpg"
  imageDesktop="/images/hero-desktop.jpg"
  links={[
    { text: 'Explore collection', href: '/products' },
    { text: 'Book consultation', href: '/book' }
  ]}
/>
```

### Product Grid

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
        { text: 'Shop', href: '/store/doors' }
      ]
    },
    // More products...
  ]}
  columns={2}
/>
```

### Scrolling Carousel

```tsx
<AppleScrollCarousel
  title="Featured Projects"
  items={[
    {
      id: '1',
      thumbnail: '/project-1.jpg',
      genre: 'WALK-IN CLOSET',
      description: 'Luxury transformation',
      buttonText: 'View project',
      buttonLink: '/gallery/project-1'
    }
  ]}
/>
```

## Features

### ✨ Animations

- Fade-in on scroll
- Smooth transitions
- Staggered grid animations
- Mobile menu slide-in
- Respects `prefers-reduced-motion`

### 📱 Responsive Design

- **Mobile**: < 768px - Optimized touch targets
- **Tablet**: 768px - 1024px - Adaptive layouts
- **Desktop**: > 1024px - Full experience

### ♿ Accessibility

- Semantic HTML5
- ARIA labels
- Keyboard navigation
- Focus states
- Screen reader friendly
- Skip links

## File Structure

```
components/apple/
├── AppleHero.tsx              # Hero sections
├── AppleProductCard.tsx       # Product cards
├── AppleProductGrid.tsx       # Product grid
├── AppleScrollCarousel.tsx    # Horizontal carousel
├── AppleNavbar.tsx            # Navigation
├── AppleFooter.tsx            # Footer
├── index.ts                   # Exports
└── README.md                  # Documentation

app/apple-demo/
└── page.tsx                   # Demo page
```

## Next Steps

### 1. Replace Placeholder Images

Update image paths in your components:

```tsx
imageMobile="/images/your-actual-image-mobile.jpg"
imageDesktop="/images/your-actual-image-desktop.jpg"
```

### 2. Integrate into Homepage

Replace or enhance your existing `app/page.tsx`:

```tsx
import { AppleHero, AppleProductGrid } from '@/components/apple'

export default function Home() {
  return <HomePage />
  // Or build custom page with Apple components
}
```

### 3. Customize Content

Edit the demo data in `/app/apple-demo/page.tsx` to match your actual products and services.

### 4. Add Real Images

Place optimized images in `/public/images/`:
- Use WebP format for best performance
- Provide mobile and desktop versions
- Optimize for web (use Next.js Image Optimization)

## Performance

### Optimizations Included

- ✅ Lazy loading images
- ✅ Optimized animations (GPU accelerated)
- ✅ Mobile-first CSS
- ✅ Tree-shakeable components
- ✅ TypeScript for type safety
- ✅ Code splitting ready

### Lighthouse Scores Target

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Images Not Showing

1. Check image paths are correct
2. Ensure images exist in `/public/images/`
3. Use absolute paths starting with `/`

### Animations Not Smooth

1. Check Framer Motion is installed: `npm install framer-motion`
2. Verify hardware acceleration is enabled
3. Test on actual devices, not just browser DevTools

### Mobile Menu Not Working

1. Ensure `framer-motion` is installed
2. Check state management in component
3. Test on actual mobile device

## Dependencies

All required dependencies are already in your `package.json`:

```json
{
  "framer-motion": "^11.11.1",
  "next": "^15.5.5",
  "react": "^18",
  "tailwindcss": "^3.4.18"
}
```

## Design Tokens

Components use your existing Tailwind config:

```ts
// From tailwind.config.ts
colors: {
  'apple-gray': { 50-950 },
  'apple-blue': { 400-600, dark },
  'apple-dark': { bg, text, border }
}

fontSize: {
  'apple-11' to 'apple-80'
}

boxShadow: {
  'apple-sm', 'apple-md', 'apple-lg', 'apple-xl'
}
```

## Credits

- **Inspired by**: https://github.com/sentayhu19/Apple-UI-Clone-Design
- **Built with**: Next.js 15, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Design language**: Apple Inc. (educational/inspirational use)
- **Adapted for**: PG Closets - Custom Storage Solutions

## Support

For questions or issues:
1. Check `/components/apple/README.md` for detailed docs
2. View `/app/apple-demo/page.tsx` for examples
3. Review component prop types in source files

---

**Built with pride for PG Closets 🏡**

*Transform your space with Apple-inspired design*
