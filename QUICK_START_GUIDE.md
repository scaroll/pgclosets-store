# Quick Start Guide - Product Enhancement System

Fast integration guide for developers. Get the product enhancement features running in minutes.

---

## 🚀 5-Minute Quick Start

### Step 1: Add "From $X" Pricing to Product Cards

```tsx
// app/products/page.tsx or components/ProductCard.tsx
import { PricingEngine } from '@/lib/pricing/pricing-engine';

export function ProductCard({ seriesId, name }: { seriesId: string; name: string }) {
  const { fromPrice, displayText } = PricingEngine.getFromPrice(seriesId);

  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p className="text-2xl font-bold">{displayText}</p>
      <p className="text-sm text-gray-600">most common sizes</p>
    </div>
  );
}
```

### Step 2: Add Sample Kit CTA to Product Pages

```tsx
// app/products/[slug]/page.tsx
import SampleKitCTA from '@/components/product/SampleKitCTA';

export default function ProductPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      {/* Existing product content */}

      {/* Add sample kit CTA */}
      <SampleKitCTA
        seriesId={params.slug}
        variant="banner"
        showAllKits
      />
    </div>
  );
}
```

### Step 3: Add Delivery Estimate

```tsx
// In your ProductPage component
import { useDeliveryEstimate } from '@/hooks/use-shipping-estimate';

export default function ProductPage() {
  const [postalCode, setPostalCode] = useState('K2P 0A4'); // Default Ottawa
  const { estimate } = useDeliveryEstimate(postalCode, true);

  return (
    <div>
      {estimate && (
        <div className="flex items-center gap-2 text-green-700">
          <span>{estimate.icon}</span>
          <span>{estimate.text}</span>
        </div>
      )}
    </div>
  );
}
```

### Step 4: Add Freight Estimator Widget

```tsx
// In your ProductPage component
import FreightEstimatorWidget from '@/components/product/FreightEstimatorWidget';

export default function ProductPage({ product }: { product: Product }) {
  return (
    <div>
      {/* Product details */}

      <FreightEstimatorWidget
        productWeight={product.weight}
        productDimensions={product.dimensions}
        productValue={product.price}
        quantity={1}
      />
    </div>
  );
}
```

---

## 💡 Common Use Cases

### Use Case 1: Calculate Price for Custom Configuration

```tsx
import { useProductPricing } from '@/hooks/use-product-pricing';

function CustomDoorConfigurator() {
  const { pricing, updateDimensions, updateFinish } = useProductPricing({
    seriesId: 'continental',
    initialDimensions: { width: 72, height: 80, unit: 'inches' }
  });

  // User changes dimensions
  const handleSizeChange = (width: number, height: number) => {
    updateDimensions({ width, height, unit: 'inches' });
  };

  return (
    <div>
      <h3>Total: {pricing?.displayPrice}</h3>
      {/* Show price breakdown */}
      <div>
        <p>Base: ${pricing?.breakdown.base}</p>
        <p>Finish: ${pricing?.breakdown.finish}</p>
        <p>Total: ${pricing?.totalPrice}</p>
      </div>
    </div>
  );
}
```

### Use Case 2: Display Shipping Options

```tsx
import { useShippingEstimate } from '@/hooks/use-shipping-estimate';

function ShippingOptions({ product }: { product: Product }) {
  const {
    postalCode,
    setPostalCode,
    estimates,
    calculateEstimates,
    isLoading
  } = useShippingEstimate({
    productWeight: product.weight,
    productDimensions: product.dimensions,
    productValue: product.price
  });

  return (
    <div>
      <input
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        placeholder="Postal Code"
      />
      <button onClick={calculateEstimates} disabled={isLoading}>
        Get Shipping Estimate
      </button>

      {estimates?.map((estimate, i) => (
        <div key={i}>
          <h4>{estimate.method}</h4>
          <p>${estimate.price}</p>
          <p>{estimate.estimatedDays.min}-{estimate.estimatedDays.max} days</p>
        </div>
      ))}
    </div>
  );
}
```

### Use Case 3: Apply Sample Kit Credit at Checkout

```tsx
import { SampleCreditInput } from '@/components/product/SampleKitCTA';

function CheckoutPage() {
  const [cartTotal, setCartTotal] = useState(924);

  const handleCreditApplied = (creditAmount: number) => {
    setCartTotal(prev => prev - creditAmount);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <p>Subtotal: ${cartTotal}</p>

      <SampleCreditInput onCreditApplied={handleCreditApplied} />

      <button>Complete Purchase</button>
    </div>
  );
}
```

### Use Case 4: Volume Pricing for Trade Customers

```tsx
import { useVolumePricing } from '@/hooks/use-product-pricing';

function TradeOrderForm({ unitPrice }: { unitPrice: number }) {
  const {
    quantity,
    setQuantity,
    totalPrice,
    savings,
    discountPercentage
  } = useVolumePricing(unitPrice, 1);

  return (
    <div>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min={1}
      />

      <p>Unit Price: ${unitPrice}</p>
      <p>Quantity: {quantity}</p>

      {savings > 0 && (
        <p className="text-green-600">
          Save ${savings} ({Math.round(discountPercentage * 100)}% off)
        </p>
      )}

      <p className="text-2xl font-bold">Total: ${totalPrice}</p>
    </div>
  );
}
```

---

## 🔧 API Reference

### PricingEngine Methods

```typescript
// Get "From $X" pricing
const fromPrice = PricingEngine.getFromPrice('continental');
// Returns: { fromPrice: 449, displayText: "From $449", includes: [...] }

// Calculate price by dimensions
const basePrice = PricingEngine.calculateByDimensions(
  'continental',
  { width: 72, height: 80, unit: 'inches' }
);
// Returns: { basePrice: 549, pricePerSqFt: 1.37, tier: "73-96" × 78-82"" }

// Calculate full configuration price
const pricing = PricingEngine.calculateTotalPrice(config);
// Returns: { totalPrice: 924, breakdown: {...}, displayPrice: "$924", ... }

// Calculate volume discount
const discount = PricingEngine.calculateVolumeDiscount(5, 549);
// Returns: { discountPercentage: 0.10, discountAmount: 275, finalPrice: 2470 }

// Calculate financing
const financing = PricingEngine.calculateFinancing(924, 12);
// Returns: { monthlyPayment: 77, totalInterest: 46, totalPaid: 970, ... }
```

### FreightEstimator Methods

```typescript
// Validate postal code
const validation = FreightEstimator.validatePostalCode('K2P 0A4');
// Returns: { isValid: true, formatted: "K2P 0A4" }

// Get shipping estimates
const estimates = await FreightEstimator.getEstimate({
  postalCode: 'K2P 0A4',
  items: [{ weight: 45, dimensions: {...}, value: 924, ... }],
  deliveryType: 'residential',
  accessType: 'ground-level',
  requiresLiftgate: true
});
// Returns: ShippingEstimate[]

// Get delivery promise
const promise = FreightEstimator.getDeliveryPromise('K2P 0A4', true);
// Returns: { text: "Available for pickup as early as tomorrow", icon: "🚗", ... }

// Get pickup locations
const locations = FreightEstimator.getPickupLocations('K2P 0A4');
// Returns: [{ name: "PG Closets Main Warehouse", address: "...", ... }]
```

### SampleKitCreditManager Methods

```typescript
// Validate credit code
const validation = await SampleKitCreditManager.validateCreditCode('SAMPLE-X7K9Q2M5');
// Returns: { isValid: true, order: {...} }

// Apply credit to cart
const result = await SampleKitCreditManager.applyCreditToCart(
  'SAMPLE-X7K9Q2M5',
  924,
  cartItems
);
// Returns: { success: true, discountAmount: 50, message: "...", updatedTotal: 874 }

// Get credit details
const details = await SampleKitCreditManager.getCreditDetails('SAMPLE-X7K9Q2M5');
// Returns: { isValid: true, creditAmount: 50, expirationDate: Date, ... }
```

---

## 🎨 Component Props

### FreightEstimatorWidget

```typescript
interface FreightEstimatorWidgetProps {
  productWeight: number;           // in kg
  productDimensions: {
    length: number;                // in cm
    width: number;
    height: number;
  };
  productValue: number;            // product price
  quantity?: number;               // default: 1
  defaultPostalCode?: string;      // pre-fill postal code
}
```

### SampleKitCTA

```typescript
interface SampleKitCTAProps {
  seriesId: string;                // 'continental', 'heritage', etc.
  variant?: 'inline' | 'banner' | 'modal';  // default: 'inline'
  showAllKits?: boolean;           // show link to all kits
}
```

---

## 📝 Environment Variables

Add these to your `.env.local`:

```env
# Optional: If using real-time shipping API
SHIPPING_API_KEY=your_api_key

# Optional: For postal code validation API
POSTAL_CODE_API_KEY=your_api_key

# Sample kit settings
NEXT_PUBLIC_SAMPLE_KIT_CREDIT_DAYS=60
NEXT_PUBLIC_SAMPLE_KIT_MIN_PURCHASE=500

# Pricing
NEXT_PUBLIC_ENABLE_VOLUME_DISCOUNTS=true
NEXT_PUBLIC_FINANCING_APR=0.0999
```

---

## ✅ Testing Checklist

Before deploying:

- [ ] Test pricing calculations for all size ranges
- [ ] Verify postal code validation (Canadian format)
- [ ] Test shipping estimates for different zones
- [ ] Verify sample kit credit application
- [ ] Test mobile responsiveness
- [ ] Check pricing display in cart
- [ ] Verify delivery promise accuracy
- [ ] Test volume discounts
- [ ] Check financing calculations

---

## 🐛 Common Issues & Solutions

### Issue: Postal code validation failing

```typescript
// Solution: Ensure postal code is in correct format
const formatted = postalCode.toUpperCase().replace(/\s/g, '');
if (formatted.length > 3) {
  formatted = `${formatted.slice(0, 3)} ${formatted.slice(3, 6)}`;
}
```

### Issue: Pricing not updating when dimensions change

```typescript
// Solution: Ensure you're calling updateDimensions
const { updateDimensions } = useProductPricing({...});

// When dimensions change:
updateDimensions({ width, height, unit: 'inches' });
// This triggers automatic price recalculation
```

### Issue: Shipping estimates showing errors

```typescript
// Solution: Check that product dimensions are in correct units
// FreightEstimator expects: kg for weight, cm for dimensions

const weight = productWeightLbs * 0.453592; // Convert lbs to kg
const length = productLengthInches * 2.54;  // Convert inches to cm
```

---

## 🎯 Next Steps

1. **Add sample kit products to your store**
   - Create product pages for each sample kit
   - Add to navigation menu
   - Set up purchase flow

2. **Integrate with checkout**
   - Add sample credit input to checkout page
   - Validate and apply credits
   - Track redemptions in database

3. **Add analytics tracking**
   - Track configurator usage
   - Monitor freight estimator adoption
   - Measure sample kit conversions

4. **Set up email automation**
   - Send credit codes after sample kit delivery
   - Reminder emails before credit expiration
   - Abandoned cart recovery with sample kit offer

---

## 📚 Additional Resources

- **Full Documentation**: See `PRODUCT_ENHANCEMENTS_IMPLEMENTATION.md`
- **Type Definitions**: See `types/product-taxonomy.ts`
- **Example Page**: See `app/products/[slug]/enhanced-page-example.tsx`

---

**Need Help?** Check the implementation guide or reach out to the development team.
