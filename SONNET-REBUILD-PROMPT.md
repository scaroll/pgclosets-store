# Complete Website Rebuild Prompt for Claude Sonnet 3.5

## PROJECT: PG Closets Ottawa - Premium Closet Doors Website

### YOUR MISSION
Create a completely new, modern website for PG Closets from scratch using Once UI design system. Extract ONLY the content (text, product info, services) from the existing site and rebuild everything else with a clean, professional foundation.

### TECH STACK REQUIREMENTS
```
- Next.js 14.2.5 (NOT 15 - critical for stability)
- Once UI (@once-ui-system/core latest stable version)
- TypeScript
- Tailwind CSS (for additional utility classes)
- App Router architecture
- Vercel deployment ready
```

### BUSINESS CONTEXT
- **Company**: PG Closets Ottawa
- **Industry**: Premium closet doors and storage solutions
- **Official Dealer**: Renin products
- **Service Area**: Ottawa and surrounding regions
- **Key Differentiators**:
  - Professional installation
  - Lifetime warranty
  - 2-week delivery
  - 500+ installations
  - Price match guarantee

### CONTENT TO PRESERVE (Extract from existing site)
1. **Company Information**
   - About us content
   - Service areas (Ottawa, Kanata, Barrhaven, Orleans, Nepean, etc.)
   - Contact information
   - Trust signals (500+ installations, lifetime warranty, etc.)

2. **Product Categories**
   - Renin Barn Doors
   - Renin Bifold Doors
   - Renin Bypass Doors
   - Renin Pivot Doors
   - Renin Room Dividers
   - Hardware & Accessories
   - Mirrors

3. **Services**
   - Free consultation
   - Professional measurement
   - Expert installation
   - Warranty service
   - Custom design solutions

4. **SEO Content**
   - Meta descriptions
   - Product descriptions
   - Service descriptions
   - Local SEO content

### DESIGN REQUIREMENTS
```yaml
Style: Modern, Premium, Professional
Color Scheme:
  primary: Sophisticated teal/navy
  secondary: Warm grays
  accent: Gold/brass touches
  background: Clean whites and light grays

Typography:
  headings: Modern sans-serif (Inter or similar)
  body: Clean, readable sans-serif

Layout:
  - Mobile-first responsive design
  - Clean spacing and padding
  - Professional photography emphasis
  - Trust signals prominent
  - Easy navigation
  - Accessible forms
```

### ONCE UI IMPLEMENTATION
```typescript
// Use Once UI components throughout
import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  Select,
  Toast,
  Modal,
  Tabs,
  Badge,
  Avatar,
  Icon
} from '@once-ui-system/core'

// Configure Once UI theme
const onceConfig = {
  theme: 'light',
  accent: 'teal',
  neutral: 'gray',
  brand: 'PG Closets',
  radius: 'medium',
  scaling: '100'
}
```

### PAGE STRUCTURE
```
/
├── app/
│   ├── layout.tsx (Once UI providers, global styles)
│   ├── page.tsx (Homepage)
│   ├── products/
│   │   ├── page.tsx (Product catalog)
│   │   ├── [category]/
│   │   │   └── page.tsx (Category pages)
│   │   └── [category]/[product]/
│   │       └── page.tsx (Product details)
│   ├── services/
│   │   ├── page.tsx (Services overview)
│   │   ├── consultation/page.tsx
│   │   ├── installation/page.tsx
│   │   └── warranty/page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── quote/
│   │   └── page.tsx (Quote calculator)
│   └── api/
│       ├── quote/route.ts
│       └── contact/route.ts
```

### KEY FEATURES TO BUILD

1. **Homepage Hero**
   - Full-width hero with premium closet imagery
   - Clear value proposition
   - CTA buttons for quote and consultation
   - Trust badges

2. **Product Showcase**
   - Grid layout with Once UI Cards
   - Filter by category
   - Quick view modals
   - Image galleries
   - Product specifications

3. **Quote Calculator**
   - Interactive form with Once UI components
   - Step-by-step wizard
   - Instant estimation
   - Email quote functionality

4. **Service Pages**
   - Clear service descriptions
   - Process timelines
   - Pricing information
   - Booking forms

5. **Contact System**
   - Contact form with validation
   - Service area checker
   - Business hours display
   - Direct email/phone links

### ONCE UI COMPONENTS USAGE

```tsx
// Example Homepage Hero Component
export function Hero() {
  return (
    <Container size="xl" className="hero-section">
      <Flex
        direction="column"
        alignItems="center"
        gap="l"
        className="text-center py-20"
      >
        <Badge variant="primary" size="l">
          Official Renin Dealer
        </Badge>

        <Heading
          variant="display"
          className="max-w-4xl"
        >
          Transform Your Space with Premium Closet Doors
        </Heading>

        <Text
          size="l"
          variant="secondary"
          className="max-w-2xl"
        >
          Professional installation, lifetime warranty, and 2-week delivery
          for Ottawa's finest homes
        </Text>

        <Flex gap="m" className="mt-8">
          <Button
            variant="primary"
            size="l"
            href="/quote"
          >
            Get Instant Quote
          </Button>

          <Button
            variant="secondary"
            size="l"
            href="/consultation"
          >
            Book Free Consultation
          </Button>
        </Flex>
      </Flex>
    </Container>
  )
}
```

### CRITICAL SETUP INSTRUCTIONS

1. **Initialize Project**
```bash
npx create-next-app@14.2.5 pg-closets-new --typescript --app --tailwind
cd pg-closets-new
npm install @once-ui-system/core
```

2. **Configure Next.js**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['pgclosets.com', 'renin.com', 'images.unsplash.com']
  },
  // NO experimental flags
  // NO dynamicIO
  // Keep it simple and stable
}
```

3. **Setup Once UI**
```typescript
// app/layout.tsx
import '@once-ui-system/core/css/index.css'
import { OnceUIProvider } from '@once-ui-system/core'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OnceUIProvider config={onceConfig}>
          {children}
        </OnceUIProvider>
      </body>
    </html>
  )
}
```

### DEPLOYMENT CHECKLIST

- [ ] All pages responsive and tested
- [ ] SEO meta tags implemented
- [ ] Images optimized
- [ ] Forms working with email integration
- [ ] Quote calculator functional
- [ ] Contact forms tested
- [ ] 404 and error pages created
- [ ] Performance optimized (Lighthouse score >90)
- [ ] Accessibility compliant (WCAG 2.1 AA)
- [ ] Browser compatibility tested
- [ ] Mobile navigation smooth
- [ ] Loading states implemented
- [ ] Error handling in place
- [ ] Analytics configured
- [ ] Sitemap generated
- [ ] Robots.txt configured

### DELIVERABLES

1. **Fully functional website** with all pages implemented
2. **Clean, maintainable code** with TypeScript
3. **Once UI design system** properly integrated
4. **Responsive design** working on all devices
5. **SEO optimized** with proper meta tags
6. **Performance optimized** with lazy loading
7. **Forms integrated** with email functionality
8. **Deployment ready** for Vercel

### IMPORTANT NOTES

- Start COMPLETELY fresh - no legacy code
- Use Next.js 14.2.5 (NOT 15) for stability
- Implement Once UI from the ground up
- Focus on clean, modern design
- Ensure fast loading times
- Make it conversion-focused
- Keep code simple and maintainable
- Test everything before marking complete

### EXAMPLE ONCE UI THEME CONFIG

```typescript
// once.config.ts
export default {
  theme: {
    colors: {
      primary: '#0D9488', // Teal
      secondary: '#6B7280', // Gray
      accent: '#F59E0B', // Gold
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: {
        primary: '#111827',
        secondary: '#6B7280',
        inverse: '#FFFFFF'
      }
    },
    typography: {
      fontFamily: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif'
      }
    },
    spacing: {
      unit: 8 // 8px grid system
    },
    radius: {
      small: '0.375rem',
      medium: '0.5rem',
      large: '0.75rem'
    }
  }
}
```

---

## START BUILDING

Begin by creating a new Next.js 14.2.5 project with Once UI and implement the homepage first. Focus on extracting only the content from the existing site while building everything else fresh with modern best practices.

Remember: Clean slate, modern foundation, Once UI throughout, professional results.