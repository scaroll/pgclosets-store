# AppleButton Quick Reference

## Import
```tsx
import { AppleButton } from '@/components/ui/AppleButton'
```

## Basic Usage
```tsx
<AppleButton>Click me</AppleButton>
```

## Variants (7)
```tsx
<AppleButton variant="primary">Primary</AppleButton>
<AppleButton variant="secondary">Secondary</AppleButton>
<AppleButton variant="tertiary">Tertiary</AppleButton>
<AppleButton variant="ghost">Ghost</AppleButton>
<AppleButton variant="outline">Outline</AppleButton>
<AppleButton variant="link">Link</AppleButton>
<AppleButton variant="destructive">Destructive</AppleButton>
```

## Sizes (3)
```tsx
<AppleButton size="sm">Small (32px)</AppleButton>
<AppleButton size="md">Medium (44px)</AppleButton>
<AppleButton size="lg">Large (56px)</AppleButton>
```

## Icons
```tsx
import { Download, ArrowRight } from 'lucide-react'

<AppleButton icon={<Download />} iconPosition="left">
  Download
</AppleButton>

<AppleButton icon={<ArrowRight />} iconPosition="right">
  Continue
</AppleButton>
```

## States
```tsx
<AppleButton loading={true}>Loading...</AppleButton>
<AppleButton success={true}>Saved!</AppleButton>
<AppleButton error={true}>Error</AppleButton>
<AppleButton disabled={true}>Disabled</AppleButton>
```

## A/B Variants
```tsx
<AppleButton abVariant="A">Subtle shadows</AppleButton>
<AppleButton abVariant="B">3D + shimmer</AppleButton>
<AppleButton abVariant="C">Flat minimal</AppleButton>
```

## Common Patterns

### CTA Button
```tsx
<AppleButton size="lg" variant="primary">
  Get Started
</AppleButton>
```

### Form Submit
```tsx
<AppleButton
  type="submit"
  loading={isSubmitting}
  disabled={!isValid}
>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</AppleButton>
```

### Download Action
```tsx
import { Download } from 'lucide-react'

<AppleButton
  icon={<Download />}
  iconPosition="left"
  loading={isDownloading}
>
  {isDownloading ? 'Downloading...' : 'Download PDF'}
</AppleButton>
```

### Success Feedback
```tsx
<AppleButton success={isSaved}>
  {isSaved ? 'Saved!' : 'Save'}
</AppleButton>
```

### Destructive Action
```tsx
<AppleButton
  variant="destructive"
  onClick={handleDelete}
>
  Delete Account
</AppleButton>
```

## Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'ghost' \| 'outline' \| 'link' \| 'destructive'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size (32px, 44px, 56px) |
| `icon` | `ReactNode` | `undefined` | Icon element (from lucide-react) |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `loading` | `boolean` | `false` | Show loading spinner |
| `success` | `boolean` | `false` | Show success state |
| `error` | `boolean` | `false` | Show error state |
| `abVariant` | `'A' \| 'B' \| 'C'` | `'A'` | A/B test variant |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | `''` | Additional CSS classes |
| `onClick` | `function` | `undefined` | Click handler |

Plus all standard HTML button attributes.

## AppleSpinner

```tsx
import AppleSpinner from '@/components/ui/AppleSpinner'

<AppleSpinner size="md" color="blue" />
```

### Spinner Props
| Prop | Type | Default | Values |
|------|------|---------|--------|
| `size` | `string` | `'md'` | `'sm' \| 'md' \| 'lg' \| 'xl'` |
| `color` | `string` | `'blue'` | `'blue' \| 'gray' \| 'white'` |
| `className` | `string` | `''` | Additional CSS classes |

## Animation Details

- **Hover Scale**: 1.02x (2% larger)
- **Tap Scale**: 0.98x (2% smaller)
- **Spring Physics**: damping: 15, stiffness: 200, mass: 1
- **Duration**: 200ms base transition
- **Easing**: Apple physics-based spring

## Accessibility

- Tab key navigation
- Enter/Space to activate
- Focus ring (2px with offset)
- 44px minimum touch target
- ARIA labels on loading states
- Screen reader support

## Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- iOS Safari: 14+

## File Locations

```
/components/ui/AppleButton.tsx       # Component
/components/ui/AppleSpinner.tsx      # Spinner
/components/ui/README.md             # Full docs
/components/ui/AppleButton.example.tsx  # Examples
/components/ui/AppleButton.test.tsx  # Tests
```

## Related

- See `/components/ui/README.md` for full documentation
- See `/components/ui/AppleButton.example.tsx` for usage examples
- See `/AGENT4_APPLEBUTTON_SUMMARY.md` for deployment details
