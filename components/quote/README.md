# Quote Request Form Component

## Overview

A comprehensive, production-ready quote request form component with Apple-style design, built with React Hook Form and Zod validation.

## File Location

`/home/user/pgclosets-store/components/quote/quote-request-form.tsx`

## Features

### Form Fields
- **Customer Information**
  - Full Name (required)
  - Email Address (required, validated)
  - Phone Number (required, validated with regex)

- **Product Details**
  - Product Selection (dropdown populated from `/data/products.json`)
  - Room Width (optional, in inches)
  - Room Height (optional, in inches)

- **Preferences**
  - Installation Type (DIY or Professional)
  - Contact Method (Email, Phone, or Either)

- **Additional Information**
  - Message/Notes (optional, max 2000 characters)

### Technical Features
- ✅ Form validation with **react-hook-form** and **zod**
- ✅ Submits to `/api/quotes/request` endpoint
- ✅ Success/error states with inline notifications
- ✅ Toast notifications using `useToast` hook
- ✅ Apple-style design matching site design system
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Loading states with animated spinner
- ✅ Form reset after successful submission

## Usage

### Basic Usage

```tsx
import { QuoteRequestForm } from '@/components/quote';

export default function QuotePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Request a Quote</h1>
      <QuoteRequestForm />
    </div>
  );
}
```

### With Pre-selected Product

```tsx
import { QuoteRequestForm } from '@/components/quote';

export default function ProductPage() {
  return (
    <QuoteRequestForm
      defaultProductSlug="renin-barn-door-176732"
    />
  );
}
```

### With Success Callback

```tsx
import { QuoteRequestForm } from '@/components/quote';
import { useRouter } from 'next/navigation';

export default function QuotePage() {
  const router = useRouter();

  const handleSuccess = (data) => {
    console.log('Quote submitted:', data);
    // Redirect to thank you page
    router.push('/thank-you');
  };

  return (
    <QuoteRequestForm
      onSuccess={handleSuccess}
      className="max-w-4xl mx-auto"
    />
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `className` | `string` | No | `''` | Additional CSS classes |
| `onSuccess` | `(data: QuoteRequestFormValues) => void` | No | `undefined` | Callback function called after successful submission |
| `defaultProductSlug` | `string` | No | `''` | Pre-select a product by slug |

## Form Data Schema

```typescript
{
  name: string;              // 2-100 characters
  email: string;             // Valid email format
  phone: string;             // Min 10 digits, allows formatting
  productSlug: string;       // Product slug from catalog
  roomWidth?: number | '';   // Optional, 1-500 inches
  roomHeight?: number | '';  // Optional, 1-500 inches
  installationType: 'diy' | 'professional';
  contactMethod: 'email' | 'phone' | 'either';
  message?: string;          // Optional, max 2000 characters
}
```

## API Endpoint

The form submits to `/api/quotes/request` with a POST request:

```typescript
// Expected request body
{
  name: "John Smith",
  email: "john@example.com",
  phone: "(613) 555-1234",
  productSlug: "renin-barn-door-176732",
  roomWidth: 84,
  roomHeight: 96,
  installationType: "professional",
  contactMethod: "either",
  message: "Looking to install in my bedroom closet..."
}
```

## Design System

The component uses Apple-style design tokens:

### Colors
- `apple-gray-*` - Gray scale colors
- `apple-dark-*` - Dark mode colors
- `blue-*` - Accent colors for CTAs and focus states

### Rounded Corners
- Form fields: `rounded-xl` (12px)
- Success/Error alerts: `rounded-2xl` (16px)

### Spacing
- Section spacing: `space-y-6` and `space-y-8`
- Form fields: `gap-6` on grid layouts

### Typography
- Section headers: `text-xl font-semibold`
- Field labels: `text-sm font-medium`
- Descriptions: `text-xs` with muted colors

## Accessibility

- All form fields have proper labels
- Error messages are announced to screen readers
- Keyboard navigation support
- Focus indicators on all interactive elements
- ARIA attributes for form validation

## Dependencies

Required packages (already in project):
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Zod resolver for react-hook-form
- `lucide-react` - Icons
- Shadcn UI components (Button, Input, Select, etc.)

## Customization

### Styling

```tsx
<QuoteRequestForm
  className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl"
/>
```

### Validation Schema

To modify validation rules, edit the `quoteRequestSchema` in the component:

```typescript
const quoteRequestSchema = z.object({
  // Modify validation rules here
  name: z.string().min(2).max(100),
  // ... other fields
});
```

## Notes

- Ensure `/api/quotes/request` endpoint is implemented and returns proper responses
- Products are loaded from `/data/products.json` - ensure this file exists and has `items` array
- The `useToast` hook is required from `/hooks/use-toast`
- Apple design tokens should be defined in `tailwind.config.ts`

## Example Implementation

See the component in action at: `/app/quote/page.tsx` (if implemented)
