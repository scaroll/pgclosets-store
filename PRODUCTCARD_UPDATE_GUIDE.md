# ProductCard Component Update Guide

## Quick Reference: Updating to CAD Pricing

### File to Update
`/components/products/product-card.tsx`

### Step 1: Update Import Statement

**Find:**
```typescript
import { cn, formatPrice } from "@/lib/utils"
```

**Replace with:**
```typescript
import { cn, formatPriceCAD } from "@/lib/utils"
```

### Step 2: Replace All formatPrice Calls

**Search for:** `formatPrice`
**Replace with:** `formatPriceCAD`

This appears approximately 12 times in the file across all product card variants.

### Locations to Update

#### 1. ProductCard (Standard) - Lines ~140-145
```typescript
// OLD:
<span className="font-bold text-lg text-primary">{formatPrice(product.salePrice)}</span>
<span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>

// NEW:
<span className="font-bold text-lg text-primary">{formatPriceCAD(product.salePrice)}</span>
<span className="text-sm text-muted-foreground line-through">{formatPriceCAD(product.price)}</span>
```

#### 2. ProductCardCompact - Lines ~271-276
```typescript
// OLD:
<span className="font-bold text-sm text-primary">{formatPrice(product.salePrice)}</span>
<span className="text-xs text-muted-foreground line-through">{formatPrice(product.price)}</span>

// NEW:
<span className="font-bold text-sm text-primary">{formatPriceCAD(product.salePrice)}</span>
<span className="text-xs text-muted-foreground line-through">{formatPriceCAD(product.price)}</span>
```

#### 3. ProductCardFeatured - Lines ~405-410
```typescript
// OLD:
<span className="text-4xl font-bold text-primary">{formatPrice(product.salePrice)}</span>
<span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>

// NEW:
<span className="text-4xl font-bold text-primary">{formatPriceCAD(product.salePrice)}</span>
<span className="text-xl text-muted-foreground line-through">{formatPriceCAD(product.price)}</span>
```

#### 4. ProductCardHorizontal - Lines ~577-582
```typescript
// OLD:
<span className="text-2xl font-bold text-primary">{formatPrice(product.salePrice)}</span>
<span className="text-base text-muted-foreground line-through">{formatPrice(product.price)}</span>

// NEW:
<span className="text-2xl font-bold text-primary">{formatPriceCAD(product.salePrice)}</span>
<span className="text-base text-muted-foreground line-through">{formatPriceCAD(product.price)}</span>
```

## Using VS Code Find & Replace

1. Open `/components/products/product-card.tsx`
2. Press `Cmd+F` (Mac) or `Ctrl+F` (Windows/Linux)
3. Click the `.*` button to enable regex (optional but recommended)
4. In "Find" field: `formatPrice`
5. In "Replace" field: `formatPriceCAD`
6. Click "Replace All" button

## Verification

After making changes, verify:

1. **No compilation errors:**
   ```bash
   npm run build
   ```

2. **All price displays show CAD:**
   - Products page: `/products`
   - Category pages: `/collections/barn-doors`
   - Product cards should show: `CA$489.00` instead of `$4.89`

3. **Check all card variants:**
   - Standard grid cards
   - Compact cards
   - Featured cards
   - Horizontal list cards

## Expected Result

**Before:**
```
$4.89  (incorrect - showing dollars instead of cents)
$565.00
```

**After:**
```
CA$489.00  (correct - cents converted to dollars with CAD symbol)
CA$565.00
```

## Troubleshooting

### Issue: Prices still showing in USD
**Solution:** Clear Next.js cache and rebuild
```bash
rm -rf .next
npm run dev
```

### Issue: Import error for formatPriceCAD
**Solution:** Verify `/lib/utils.ts` has the function:
```bash
grep -n "formatPriceCAD" lib/utils.ts
```

### Issue: TypeScript errors
**Solution:** The function signature matches `formatPrice`, so no type changes needed

## Related Files

- Price formatting function: `/lib/utils.ts`
- Product data loader: `/lib/data/products.ts`
- Products page: `/app/(shop)/products/page.tsx`
- Category pages: `/app/(shop)/collections/[category]/page.tsx`

## Testing Checklist

After updating:
- [ ] Products page loads without errors
- [ ] All prices show CA$ symbol
- [ ] Prices are in correct dollar amounts (not cents)
- [ ] Sale prices display correctly
- [ ] Regular prices display correctly
- [ ] All card variants render properly
- [ ] No console errors
- [ ] Build completes successfully

---

**Time to complete:** ~2 minutes
**Lines to change:** ~12 replacements
**Risk level:** Low (simple find & replace)
