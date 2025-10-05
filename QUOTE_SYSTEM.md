# Quote Request & Cart System Documentation

## Overview

The PG Closets quote request and cart system allows customers to:
- Add products to cart for immediate checkout
- Convert cart items to quote requests
- Request custom quotes for products
- Submit contact information for personalized quotes
- View quote summaries with estimated pricing

## Architecture

### State Management

**Cart System** (`/contexts/CartContext.tsx`)
- Uses React Context + useReducer for cart state
- Persists to localStorage under key: `pg-closets-cart`
- Handles cart items with customizations

**Quote System** (`/hooks/useQuote.ts`)
- Uses Zustand with persist middleware
- Persists to localStorage under key: `pg-closets-quote-v1`
- Handles quote items and conversion from cart

### Type Definitions

**Cart Types** (`/lib/types.ts`)
```typescript
interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  customizations?: {
    width?: number
    height?: number
    hardware?: string
    installation?: boolean
  }
}
```

**Quote Types** (`/lib/types/quote.ts`)
```typescript
interface QuoteItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  customizations?: {
    width?: number
    height?: number
    hardware?: string
    installation?: boolean
    notes?: string
  }
}

interface QuoteRequest {
  id: string
  items: QuoteItem[]
  customerInfo: {
    name: string
    email: string
    phone: string
    address?: string
    city?: string
    postalCode?: string
  }
  projectDetails?: {
    projectType?: string
    timeline?: string
    budget?: string
    notes?: string
  }
  subtotal: number
  tax: number
  total: number
  status: "draft" | "submitted" | "reviewed" | "quoted" | "accepted" | "declined"
  createdAt: Date
  updatedAt: Date
}
```

## Components

### Quote Components

**AddToQuoteButton** (`/components/quote/AddToQuoteButton.tsx`)
- Adds single products to quote
- Converts entire cart to quote
- Redirects to quote page after adding

**QuoteItemCard** (`/components/quote/QuoteItemCard.tsx`)
- Displays quote item with image, details, and customizations
- Quantity controls (increase/decrease)
- Remove item functionality
- Shows customization details (size, hardware, installation)

**QuoteContactForm** (`/components/quote/QuoteContactForm.tsx`)
- Collects customer contact information
- Validates required fields (name, email, phone)
- Optional project details section
- Success state with confirmation message
- Form validation with error display

## Pages

### Quote Page (`/app/quote/page.tsx`)

**Features:**
- Two-view system: Items view and Contact form view
- Empty state with call-to-action
- Mobile-optimized layout
- Sticky summary sidebar (desktop)
- Responsive grid layout

**Views:**
1. **Quote Items View**
   - List of all quote items
   - Quantity and price controls
   - Summary card (desktop: sticky sidebar, mobile: bottom card)
   - "Continue to Contact Form" button

2. **Contact Form View**
   - Customer information form
   - Quote summary sidebar
   - Form validation
   - Success confirmation

### Cart Page (`/app/cart/page.tsx`)

**Updated Features:**
- Standard checkout button
- "Convert Cart to Quote" button
- Maintains existing cart functionality
- Links to quote system

### Cart Drawer (`/components/cart/CartDrawer.tsx`)

**Updated Features:**
- "Proceed to Checkout" button
- "Convert Cart to Quote" button (outline style)
- "View Full Cart" link

## User Flows

### Flow 1: Single Product Quote
1. Browse product page
2. Click "Request Quote" button
3. Redirected to `/quote` with item added
4. Fill in contact information
5. Submit quote request

### Flow 2: Cart to Quote Conversion
1. Add multiple products to cart
2. Open cart or go to cart page
3. Click "Convert Cart to Quote"
4. Cart items transferred to quote
5. Cart cleared
6. Redirected to `/quote`
7. Fill in contact information
8. Submit quote request

### Flow 3: Build Quote from Scratch
1. Navigate to `/quote` directly
2. Add items from product pages
3. Review and adjust quantities
4. Fill in contact information
5. Submit quote request

## Mobile Optimization

### Responsive Design Features

**Quote Page:**
- Single column layout on mobile
- Full-width components
- Touch-friendly controls (minimum 44px touch targets)
- Summary card moved to bottom on mobile
- Collapsible sections for better space usage

**Quote Item Cards:**
- Stacked layout on mobile
- Large, easy-to-tap buttons
- Clear visual hierarchy
- Optimized image sizes (24px, 48px, 96px)

**Contact Form:**
- Full-width form fields
- Large input fields (minimum 44px height)
- Grouped fields for better organization
- Clear error messages
- Success confirmation screen

## Persistence

### Cart Persistence
- Key: `pg-closets-cart`
- Stored in localStorage
- Automatic save on cart changes
- Automatic load on app initialization

### Quote Persistence
- Key: `pg-closets-quote-v1`
- Stored in localStorage via Zustand persist
- Automatic save on quote changes
- Survives page refreshes and browser restarts

## Tax Calculation

- HST Rate: 13% (Ontario)
- Applied to subtotal
- Displayed separately in summary
- Included in total

## Form Validation

**Required Fields:**
- Name (non-empty)
- Email (valid email format)
- Phone (valid phone format)

**Optional Fields:**
- Address
- City
- Postal Code
- Project Type
- Timeline
- Budget
- Additional Notes

**Validation Rules:**
- Email: Standard email regex validation
- Phone: Accepts various formats with digits, spaces, dashes, parentheses
- Real-time error clearing on user input

## API Integration Points

### Quote Submission (To Be Implemented)

```typescript
// Expected endpoint: POST /api/quotes
interface QuoteSubmissionPayload {
  items: QuoteItem[]
  customerInfo: QuoteRequest["customerInfo"]
  projectDetails?: QuoteRequest["projectDetails"]
  subtotal: number
  tax: number
  total: number
}
```

**Current Implementation:**
- Console logs quote data
- Simulates 1.5s API call
- Shows success message
- Clears quote after submission

**Future Implementation:**
- Send to backend API
- Email notification to customer
- Email notification to sales team
- CRM integration
- Quote tracking dashboard

## Installation & Setup

### Prerequisites
```bash
# Already installed in package.json
- zustand (state management)
- @radix-ui/react-label
- @radix-ui/react-dialog
- lucide-react (icons)
```

### File Structure
```
/app
  /quote
    page.tsx          # Main quote page
    layout.tsx        # Metadata and layout
/components
  /quote
    AddToQuoteButton.tsx      # Quote action button
    QuoteItemCard.tsx         # Quote item display
    QuoteContactForm.tsx      # Contact form
/hooks
  useQuote.ts                 # Quote state management
/lib
  /types
    quote.ts                  # Quote type definitions
```

### Usage in Components

**Add to Quote Button:**
```tsx
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton"

// Single product
<AddToQuoteButton
  product={{
    id: "1",
    name: "Barn Door",
    image: "/image.jpg",
    price: 500
  }}
  customizations={{
    width: 36,
    height: 84,
    hardware: "Modern Black"
  }}
/>

// Convert cart
<AddToQuoteButton convertFromCart />
```

**Access Quote State:**
```tsx
import { useQuote } from "@/hooks/useQuote"

const { items, itemCount, subtotal, tax, total } = useQuote()
```

## Testing Checklist

- [ ] Add single product to quote
- [ ] Add multiple products to quote
- [ ] Update quantities in quote
- [ ] Remove items from quote
- [ ] Convert cart to quote (cart should clear)
- [ ] Form validation (required fields)
- [ ] Form submission
- [ ] Success message display
- [ ] Quote persistence (refresh page)
- [ ] Mobile responsive layout
- [ ] Desktop sidebar sticky behavior
- [ ] Empty state display
- [ ] Navigation between views

## Future Enhancements

### Planned Features
1. **Backend Integration**
   - API endpoints for quote submission
   - Database storage
   - Email notifications

2. **Quote Management**
   - View submitted quotes
   - Quote status tracking
   - Quote expiration dates

3. **Advanced Features**
   - Save multiple quotes
   - Share quotes via link
   - PDF quote generation
   - Quote comparison tool

4. **Admin Dashboard**
   - View all quote requests
   - Respond to quotes
   - Convert quotes to orders
   - Analytics and reporting

5. **Enhanced Customization**
   - Visual product configurator
   - Real-time price updates
   - Bulk discounts
   - Package deals

## Browser Compatibility

- Chrome/Edge: Fully supported
- Firefox: Fully supported
- Safari: Fully supported
- Mobile browsers: Optimized for touch

## Performance Considerations

- Zustand for efficient state management
- localStorage for offline capability
- Lazy loading for large quote lists
- Optimized image sizes with Next.js Image
- Minimal re-renders with React optimization

## Accessibility

- Semantic HTML elements
- ARIA labels on form fields
- Keyboard navigation support
- Focus management
- Error announcements
- High contrast support

## Support & Maintenance

For issues or questions:
- Check this documentation first
- Review component prop types
- Check browser console for errors
- Verify localStorage persistence
