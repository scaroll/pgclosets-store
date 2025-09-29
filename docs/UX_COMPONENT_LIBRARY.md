# UX Component Library Documentation

## Overview

This comprehensive UX component library provides production-ready React/TypeScript components with animations, accessibility features, and mobile optimization for modern web applications.

## Features

- **🎨 5 Complete Component Suites**: Navigation, Product, Forms, Mobile, and Accessibility
- **📱 Mobile-First Design**: Touch-optimized components with haptic feedback
- **♿ WCAG 2.1 AA Compliant**: Full accessibility support with screen readers
- **🎬 Smooth Animations**: Framer Motion integration with reduced motion support
- **🎯 TypeScript Support**: Full type safety and IntelliSense
- **🚀 Production Ready**: Tested and optimized for real-world usage

## Installation

```bash
npm install framer-motion lucide-react
```

## Usage

### Basic Import

```typescript
import { UXLibrary } from '@/components/ui/UXLibrary';

// Use specific components
const { MegaMenu } = UXLibrary.Navigation;
const { TouchButton } = UXLibrary.Mobile;
const { InteractiveForm } = UXLibrary.Forms;
```

### With Accessibility Provider

```typescript
import { UXLibrary } from '@/components/ui/UXLibrary';

function App() {
  return (
    <UXLibrary.Accessibility.Provider>
      <YourApp />
    </UXLibrary.Accessibility.Provider>
  );
}
```

## Component Suites

### 1. Navigation Components

#### MegaMenu
Advanced navigation menu with animations and rich content areas.

```typescript
import { UXLibrary } from '@/components/ui/UXLibrary';

const menuSections = [
  {
    title: "Products",
    href: "/products",
    description: "Our product catalog",
    icon: <ShoppingCart className="h-5 w-5" />,
    featured: true,
    items: [
      {
        title: "Closet Systems",
        href: "/products/closets",
        description: "Custom closet solutions",
        badge: "Popular"
      }
    ]
  }
];

<UXLibrary.Navigation.MegaMenu
  sections={menuSections}
  trigger="Products"
  delay={150}
/>
```

**Features:**
- Smooth animations with staggered reveals
- Rich content areas with icons and badges
- Keyboard navigation support
- Hover and focus states
- Auto-positioning and responsive design
- Call-to-action footer sections

### 2. Product Components

#### ProductQuickView
Modal component for quick product preview with rich interactions.

```typescript
<UXLibrary.Product.QuickView
  product={productData}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onAddToCart={(id, variants) => handleAddToCart(id, variants)}
  onAddToWishlist={(id) => handleWishlist(id)}
/>
```

**Features:**
- Image gallery with zoom and navigation
- Variant selection with real-time updates
- Quantity selector and stock status
- Rating display and review count
- Add to cart and wishlist functionality
- Focus trap and keyboard navigation
- Mobile-optimized layout

### 3. Form Components

#### InteractiveForm
Advanced form system with validation, progress tracking, and accessibility.

```typescript
const formFields = [
  {
    id: 'email',
    type: 'email',
    label: 'Email Address',
    required: true,
    validation: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Valid email required' }
    ]
  }
];

<UXLibrary.Forms.InteractiveForm
  id="contact-form"
  title="Contact Us"
  fields={formFields}
  showProgress={true}
  autoSave={true}
  onSubmit={async (data) => {
    // Handle submission
  }}
/>
```

**Field Types Supported:**
- `text`, `email`, `password`, `tel`, `url`, `number`
- `textarea` with character counting
- `select` with custom styling
- `checkbox` with enhanced visuals
- `radio` with proper grouping
- `file` with drag & drop support
- `date`, `datetime-local`, `time`

**Validation Rules:**
- `required` - Field is mandatory
- `email` - Valid email format
- `phone` - Valid phone number
- `min`/`max` - Length or value constraints
- `pattern` - Custom regex validation
- `custom` - Custom validation function

### 4. Mobile Components

#### TouchButton
Enhanced button with haptic feedback and touch optimizations.

```typescript
<UXLibrary.Mobile.TouchButton
  variant="primary"
  size="lg"
  onClick={() => console.log('Tapped!')}
  onLongPress={() => console.log('Long pressed!')}
  haptic={true}
>
  Touch Me!
</UXLibrary.Mobile.TouchButton>
```

#### SwipeableCard
Card component with swipe gestures and visual feedback.

```typescript
<UXLibrary.Mobile.SwipeableCard
  onSwipeLeft={() => console.log('Delete')}
  onSwipeRight={() => console.log('Archive')}
  onSwipeUp={() => console.log('Share')}
  onSwipeDown={() => console.log('More')}
  showIndicators={true}
>
  <CardContent />
</UXLibrary.Mobile.SwipeableCard>
```

#### TouchSlider
Mobile-optimized slider with enhanced touch interactions.

```typescript
<UXLibrary.Mobile.TouchSlider
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  step={1}
  showValue={true}
  formatValue={(v) => `${v}%`}
/>
```

#### PullToRefresh
Pull-to-refresh functionality for content areas.

```typescript
<UXLibrary.Mobile.PullToRefresh
  onRefresh={async () => {
    await fetchNewData();
  }}
  threshold={100}
>
  <ContentArea />
</UXLibrary.Mobile.PullToRefresh>
```

#### BottomSheet
Mobile-native bottom sheet with snap points.

```typescript
<UXLibrary.Mobile.BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Settings"
  snapPoints={[0.3, 0.6, 0.9]}
  defaultSnap={0.6}
>
  <SheetContent />
</UXLibrary.Mobile.BottomSheet>
```

### 5. Accessibility Components

#### AccessibilityProvider
Context provider for accessibility preferences.

```typescript
<UXLibrary.Accessibility.Provider>
  <App />
</UXLibrary.Accessibility.Provider>
```

#### AccessibleButton
Button with enhanced focus states and screen reader support.

```typescript
<UXLibrary.Accessibility.AccessibleButton
  variant="primary"
  ariaLabel="Download report"
  ariaDescribedBy="download-description"
  onClick={handleDownload}
>
  <Download className="h-4 w-4 mr-2" />
  Download
</UXLibrary.Accessibility.AccessibleButton>
```

#### AccessibleModal
Modal with proper focus management and ARIA attributes.

```typescript
<UXLibrary.Accessibility.AccessibleModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
  description="This action cannot be undone"
>
  <ModalContent />
</UXLibrary.Accessibility.AccessibleModal>
```

#### SkipNavigation
Skip links for keyboard navigation.

```typescript
<UXLibrary.Accessibility.SkipNavigation
  links={[
    { href: "#main", label: "Skip to main content" },
    { href: "#nav", label: "Skip to navigation" },
    { href: "#footer", label: "Skip to footer" }
  ]}
/>
```

#### AccessibleTable
Data table with sorting and proper ARIA support.

```typescript
<UXLibrary.Accessibility.AccessibleTable
  data={tableData}
  columns={columns}
  caption="Product inventory table"
  sortable={true}
/>
```

## Accessibility Features

### WCAG 2.1 AA Compliance
- Proper color contrast ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader compatibility
- Focus management and indicators
- ARIA labels and descriptions
- Alternative text for images

### Accessibility Preferences
The library supports user preferences for:
- Font size (small, medium, large, extra-large)
- Contrast mode (normal, high, dark)
- Reduced motion
- Screen reader optimizations
- Enhanced focus indicators

### Testing Tools
- `ColorContrastValidator` - Real-time contrast checking
- `AccessibilitySettingsPanel` - User preference management
- Built-in screen reader announcements

## Mobile Optimization

### Touch Targets
- Minimum 44px touch targets
- Enhanced touch feedback
- Optimized for one-handed use
- Gesture recognition

### Performance
- Optimized animations with `will-change`
- Reduced bundle size with tree shaking
- Lazy loading support
- Hardware acceleration

### Responsive Design
- Mobile-first approach
- Flexible layouts
- Touch-friendly interactions
- Adaptive component behavior

## Animation System

### Framer Motion Integration
- Smooth enter/exit animations
- Gesture recognition
- Spring physics
- Performance optimized

### Reduced Motion Support
- Respects `prefers-reduced-motion`
- Configurable animation durations
- Fallback to instant transitions

## TypeScript Support

### Type Safety
- Full TypeScript definitions
- Generic component support
- Strict type checking
- IntelliSense support

### Example Types
```typescript
interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: Array<{ value: string; label: string }>;
}

interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}
```

## Utilities

### UX Utilities (`ux-utils.ts`)
```typescript
import UXUtils from '@/lib/utils/ux-utils';

// Device detection
UXUtils.isMobile();
UXUtils.isTouchDevice();

// Accessibility
UXUtils.announceToScreenReader('Page loaded', 'polite');
UXUtils.trapFocus(modalElement);

// Animation
UXUtils.getReducedMotionPreference();
UXUtils.createAnimationConfig(300, 'ease-out');

// Touch gestures
UXUtils.getSwipeDirection(startX, startY, endX, endY);

// Form validation
UXUtils.validateEmail(email);
UXUtils.validatePassword(password);

// Color accessibility
UXUtils.getContrastRatio('#000000', '#ffffff');
UXUtils.meetsContrastRequirement('#000', '#fff', 'AA');
```

## Best Practices

### Performance
- Use `React.memo` for expensive components
- Implement lazy loading for large components
- Optimize images and assets
- Monitor bundle size

### Accessibility
- Always provide meaningful labels
- Test with screen readers
- Ensure keyboard navigation works
- Validate color contrast

### Mobile
- Design for touch-first
- Test on real devices
- Consider one-handed use
- Optimize for slow networks

### SEO
- Use semantic HTML
- Provide proper headings hierarchy
- Include meta descriptions
- Optimize Core Web Vitals

## Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **Features**: ES2020, CSS Grid, Flexbox, IntersectionObserver

## Contributing

### Development Setup
```bash
npm install
npm run dev
```

### Testing
```bash
npm run test
npm run test:a11y
npm run test:mobile
```

### Building
```bash
npm run build
npm run type-check
```

## Examples

See the `UXShowcase` component for interactive examples of all components.

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [Project Issues](https://github.com/your-repo/issues)
- Documentation: [Component Docs](https://your-docs-site.com)
- Email: support@your-domain.com