# Quick Start Guide - Advanced Search System

## 5-Minute Setup

### Step 1: Use the Complete SearchPage (Easiest)

```tsx
// app/products/search/page.tsx
import { SearchPage } from '@/components/search';
import { getProducts } from '@/lib/actions/commerce';

export default async function Page() {
  const products = await getProducts();
  return <SearchPage products={products} />;
}
```

**Done!** You now have a complete search page with all features.

### Step 2: Add to Navigation (Optional)

```tsx
// components/layout/pg-header.tsx
<Link href="/products/search">
  Advanced Search
</Link>
```

## Component Cheat Sheet

### InstantSearch
```tsx
import { InstantSearch } from '@/components/search';

<InstantSearch
  products={products}
  onSearchChange={setQuery}
  maxResults={6}
/>
```

**Key Props:**
- `products` - Product array (required)
- `onSearchChange` - Query callback (optional)
- `maxResults` - Max dropdown results (default: 6)

### AdvancedFilters
```tsx
import { AdvancedFilters } from '@/components/search';

<AdvancedFilters
  filters={filters}
  options={filterOptions}
  priceRange={{ min: 0, max: 3000 }}
  onFilterChange={setFilters}
/>
```

**Key Props:**
- `filters` - Current filter state (required)
- `options` - Available filter options (required)
- `onFilterChange` - Filter callback (required)

### SortOptions
```tsx
import { SortOptions } from '@/components/search';

<SortOptions
  value={sortValue}
  onChange={setSortValue}
/>
```

**Key Props:**
- `value` - Current sort (required)
- `onChange` - Sort callback (required)

### SearchResults
```tsx
import { SearchResults } from '@/components/search';

<SearchResults
  products={products}
  totalCount={100}
  currentPage={1}
  itemsPerPage={12}
  onPageChange={setPage}
/>
```

**Key Props:**
- `products` - Products to display (required)
- `totalCount` - Total products (required)
- `currentPage` - Current page number (required)
- `onPageChange` - Page change callback (required)

## Common Patterns

### Pattern 1: Basic Search + Results

```tsx
'use client';

import { useState } from 'react';
import { InstantSearch, SearchResults } from '@/components/search';

export default function Search({ products }) {
  const [query, setQuery] = useState('');

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <InstantSearch
        products={products}
        onSearchChange={setQuery}
      />
      <SearchResults
        products={filtered.slice(0, 12)}
        totalCount={filtered.length}
        currentPage={1}
        itemsPerPage={12}
        onPageChange={() => {}}
      />
    </>
  );
}
```

### Pattern 2: Search + Filters + Sort

```tsx
'use client';

import { useState } from 'react';
import { InstantSearch, AdvancedFilters, SortOptions, SearchResults } from '@/components/search';

export default function FullSearch({ products }) {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [], styles: [], colors: [], sizes: [],
    priceRange: [0, 3000], materials: [], features: []
  });
  const [sort, setSort] = useState('relevance');

  // Apply filters and sort
  const results = applyFiltersAndSort(products, query, filters, sort);

  return (
    <div className="flex gap-6">
      <aside className="w-80">
        <AdvancedFilters
          filters={filters}
          options={extractOptions(products)}
          priceRange={{ min: 0, max: 3000 }}
          onFilterChange={setFilters}
        />
      </aside>

      <main className="flex-1">
        <InstantSearch products={products} onSearchChange={setQuery} />
        <SortOptions value={sort} onChange={setSort} />
        <SearchResults products={results} {...paginationProps} />
      </main>
    </div>
  );
}
```

### Pattern 3: Just Use SearchPage

```tsx
import { SearchPage } from '@/components/search';

export default function Page({ products }) {
  return <SearchPage products={products} />;
}
```

## Filter Options Format

```typescript
const filterOptions = {
  types: ['Bypass Doors', 'Barn Doors'],
  styles: ['Modern', 'Traditional'],
  colors: ['White', 'Black', 'Gray'],
  sizes: ['36"', '48"', '60"'],
  materials: ['Wood', 'Glass', 'Mirror'],
  features: ['Soft Close', 'Adjustable']
};
```

## Sort Options

```typescript
const DEFAULT_SORT_OPTIONS = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'featured', label: 'Featured' }
];
```

## Mobile Responsive

All components are mobile-responsive out of the box:

- **InstantSearch**: Full-width on mobile
- **AdvancedFilters**: Mobile Sheet drawer with `isMobile={true}`
- **SortOptions**: Compact button on mobile
- **SearchResults**: 1 column on mobile, up to 4 on desktop

## Keyboard Shortcuts

### InstantSearch
- **↑↓** - Navigate results
- **Enter** - Select result
- **Escape** - Close dropdown

### General
- **Tab** - Navigate between elements
- **Space** - Toggle checkboxes/buttons
- **Enter** - Activate buttons

## Common Issues

### Issue: "Module not found"
**Solution**: Ensure `use-debounce` hook exists:
```bash
# File should exist at: lib/hooks/use-debounce.ts
```

### Issue: No filter options showing
**Solution**: Check product data has required fields:
```typescript
// Products need: title, description, collection, variants
```

### Issue: TypeScript errors
**Solution**: Import types:
```typescript
import type { Product } from '@/types/commerce';
import type { FilterValues } from '@/components/search';
```

## Performance Tips

1. **Memoize filter extraction**:
```tsx
const options = useMemo(() => extractOptions(products), [products]);
```

2. **Limit results per page**:
```tsx
<SearchPage itemsPerPage={12} /> // Don't go above 24
```

3. **Use server components when possible**:
```tsx
// app/search/page.tsx
export default async function Page() { // Server component
  const products = await getProducts(); // Fetch on server
  return <SearchPage products={products} />;
}
```

## Next Steps

1. ✅ **Implement**: Add SearchPage to your app
2. ✅ **Style**: Customize with Tailwind classes
3. ✅ **Test**: Try on mobile and desktop
4. 📚 **Read**: Check README.md for full docs
5. 🚀 **Deploy**: Push to production

## File Locations

```
components/search/
├── InstantSearch.tsx          # Instant search
├── AdvancedFilters.tsx        # Filter sidebar
├── SortOptions.tsx            # Sort dropdown
├── SearchResults.tsx          # Results display
├── SearchPage.tsx             # Complete page
└── index.ts                   # Exports

lib/hooks/
└── use-debounce.ts           # Debounce hook

app/products/search/
└── page.tsx                  # Demo page
```

## Need Help?

1. Check **README.md** for full documentation
2. Check **IMPLEMENTATION.md** for detailed setup
3. Check **SUMMARY.md** for feature overview
4. Review component source code (well documented)
5. Check TypeScript types for prop definitions

---

**That's it!** You're ready to use the advanced search system. Start with `<SearchPage />` and customize from there.
