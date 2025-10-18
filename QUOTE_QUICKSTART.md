# Quote System Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Add Quote Button to Product Page

```tsx
import { AddToQuoteButton } from "@/components/quote/AddToQuoteButton"

// In your product page component
<AddToQuoteButton
  product={{
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price
  }}
  quantity={1}
  variant="outline"
/>
```

### Step 2: Test the Flow

1. Click "Request Quote" on a product
2. Navigate to `/quote` (automatic)
3. Review items and pricing
4. Click "Continue to Contact Form"
5. Fill in contact information
6. Submit quote request

### Step 3: Access Quote Data Anywhere

```tsx
import { useQuote } from "@/hooks/useQuote"

function MyComponent() {
  const { items, itemCount, total } = useQuote()

  return (
    <div>
      You have {itemCount} items in your quote
      Total: ${total.toLocaleString()} CAD
    </div>
  )
}
```

## 📍 Key URLs

- **Quote Page:** `/quote`
- **Cart Page:** `/cart` (includes "Convert to Quote" button)
- **Products:** Add `<AddToQuoteButton />` to any product page

## 🎯 Common Use Cases

### Use Case 1: Product Page Integration

See `/components/quote/QuoteButtonExample.tsx` for complete example with customization options.

### Use Case 2: Cart Conversion

Already implemented in:
- `/app/cart/page.tsx`
- `/components/cart/CartDrawer.tsx`

Just use:
```tsx
<AddToQuoteButton convertFromCart variant="outline" />
```

### Use Case 3: Check Quote State

```tsx
const { items } = useQuote()

if (items.length > 0) {
  // Show quote badge/count in header
}
```

## 📦 What's Included

✅ Full quote management system
✅ Cart-to-quote conversion
✅ Contact form with validation
✅ Mobile-optimized UI
✅ LocalStorage persistence
✅ Tax calculation (13% HST)
✅ Empty states and loading states
✅ Success confirmations

## 🔧 Next: Backend Integration

Create API endpoint to receive quote submissions:

```typescript
// /app/api/quotes/route.ts
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const data = await request.json()

  // 1. Save to database
  // 2. Send email to customer
  // 3. Send email to sales team
  // 4. Return confirmation

  return NextResponse.json({ success: true })
}
```

Then update quote submission in `/app/quote/page.tsx`:

```typescript
const handleSubmitQuote = async (formData: QuoteFormData) => {
  const response = await fetch('/api/quotes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        // ... other fields
      },
      subtotal,
      tax,
      total,
    }),
  })

  if (!response.ok) throw new Error('Failed to submit quote')

  clearQuote()
}
```

## 📚 Full Documentation

See `/QUOTE_SYSTEM.md` for complete documentation including:
- Architecture details
- All component props
- Type definitions
- User flows
- Mobile optimization
- Testing checklist
- Future enhancements

## 💡 Tips

1. **Quote vs Cart:** Quotes are for customers who want pricing/consultation first. Cart is for ready-to-buy customers.

2. **Customizations:** Pass product customizations (size, hardware, etc.) when adding to quote for accurate pricing.

3. **Persistence:** Quotes persist in localStorage. They survive page refreshes but not browser data clearing.

4. **Mobile:** All components are mobile-optimized with touch-friendly controls.

5. **Validation:** Contact form validates required fields (name, email, phone) before submission.

## ❓ Troubleshooting

**Quote items not showing?**
- Check browser localStorage: key `pg-closets-quote-v1`
- Check browser console for errors
- Verify `useQuote()` hook is being called

**Form not submitting?**
- Check required fields are filled
- Check browser console for validation errors
- Verify onSubmit prop is passed to QuoteContactForm

**Cart conversion not working?**
- Verify cart has items
- Check cart state in localStorage: key `pg-closets-cart`
- Verify AddToQuoteButton has `convertFromCart` prop

## 🎉 You're Ready!

The quote system is fully functional and ready to use. Just add the button to your product pages and test the flow!
