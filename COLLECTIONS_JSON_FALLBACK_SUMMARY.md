# Collections Category Page - JSON Data Fallback Implementation

## Summary

Updated `/home/user/pgclosets-store/app/(shop)/collections/[category]/page.tsx` to support JSON data fallback when the database is unavailable.

## Changes Made

### 1. Added JSON Data Import
```typescript
import { simpleProducts } from '@/data/simple-products'
```

### 2. Created Helper Functions

#### `getCategoryNameFromSlug(slug: string)`
Maps category slugs to display names:
- `'barn-doors'` → `'Barn Doors'`
- `'bifold-doors'` → `'Bifold Doors'`
- `'bypass-doors'` → `'Bypass Doors'`
- `'glass-doors'` → `'Glass Doors'`
- `'hardware'` → `'Hardware'`

#### `getCategoryProductsFromJSON(categorySlug, searchParams)`
Provides JSON data fallback with full feature support:

**Features:**
- ✅ Category filtering by category field
- ✅ Price range filtering (min/max)
- ✅ Sorting (price-asc, price-desc, name-asc, name-desc, newest)
- ✅ Pagination support
- ✅ Data transformation to match database format
- ✅ Product count and total pages calculation

**Data Transformations:**
- Converts product.price to cents (multiply by 100)
- Maps product.image to images array
- Uses product.id as slug
- Sets default values for inStock (true), featured (false), bestseller (false)

### 3. Updated `getCategoryProducts()` Function

Added try-catch wrapper around existing database logic:

```typescript
async function getCategoryProducts(categorySlug, searchParams) {
  try {
    // Existing database query logic
    // ... (unchanged)
  } catch (error) {
    // Database unavailable, use JSON data fallback
    console.warn('Database unavailable, using JSON data fallback:', error)
    return getCategoryProductsFromJSON(categorySlug, searchParams)
  }
}
```

## JSON Data Structure

The fallback uses data from `/home/user/pgclosets-store/data/simple-products.ts`:

### Available Products (4 total):
1. **Continental** - Bifold Doors ($459)
2. **Provincial** - Bypass Doors ($559)
3. **Modern Barn** - Barn Doors ($799)
4. **Premium Hardware Kit** - Hardware ($159)

### Product Schema:
```typescript
interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string          // Matches category name
  specs: string[]
  image: string
  features?: string[]
  dimensions?: { width, height, depth }
  finishOptions?: string[]
  installation?: string
  warranty?: string
}
```

## How It Works

### Normal Operation (Database Available):
1. Page attempts to fetch products from Prisma database
2. Applies filters, sorting, and pagination via SQL
3. Returns formatted results

### Fallback Mode (Database Unavailable):
1. Database query throws an error
2. Catch block triggers `getCategoryProductsFromJSON()`
3. Filters products from JSON data by category name
4. Applies client-side filtering and sorting
5. Returns formatted results matching database structure
6. Logs warning to console for debugging

### Category Matching:
```
URL Slug          → Category Name
-----------------------------------------
/barn-doors       → "Barn Doors"
/bifold-doors     → "Bifold Doors"
/bypass-doors     → "Bypass Doors"
/glass-doors      → "Glass Doors"
/hardware         → "Hardware"
```

## Testing

### To Test Database Mode:
- Ensure DATABASE_URL is configured
- Navigate to any category page (e.g., `/collections/barn-doors`)
- Products should load from database

### To Test JSON Fallback Mode:
- Remove or invalidate DATABASE_URL environment variable
- Navigate to any category page (e.g., `/collections/bifold-doors`)
- Should see JSON products without errors
- Check browser console for fallback warning message

### Expected Results:
- All filtering, sorting, and pagination features work in both modes
- Seamless user experience regardless of database availability
- Console warning appears only when fallback is used

## Benefits

1. **Resilience**: Site remains functional without database
2. **Development**: Can develop UI without database setup
3. **Graceful Degradation**: Automatic fallback with logging
4. **Feature Parity**: Full support for filters, sorting, pagination
5. **Type Safety**: Uses existing TypeScript interfaces
6. **Zero UI Changes**: Users don't notice the difference

## File Locations

- **Main File**: `/home/user/pgclosets-store/app/(shop)/collections/[category]/page.tsx`
- **JSON Data**: `/home/user/pgclosets-store/data/simple-products.ts`
- **Categories**: `/home/user/pgclosets-store/lib/data/categories.ts`

## Notes

- The `glass-doors` category has no products in the JSON data (only in database)
- Price values in JSON are in dollars; converted to cents for consistency
- JSON products always show as "in stock"
- Sorting by "newest" keeps original order for JSON data (no createdAt field)
