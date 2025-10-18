# Search System Implementation Guide

## Quick Start

### 1. Install Dependencies

The search system uses existing shadcn/ui components. Ensure these are installed:

```bash
# Components should already be installed, but if needed:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add sheet
npx shadcn-ui@latest add accordion
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toggle-group
```

### 2. Import Components

```tsx
// Import individual components
import { InstantSearch, AdvancedFilters, SortOptions, SearchResults } from '@/components/search';

// Or import the complete SearchPage
import { SearchPage } from '@/components/search';
```

### 3. Basic Usage

**Option A: Complete Search Page (Recommended)**

```tsx
// app/products/search/page.tsx
import { SearchPage } from '@/components/search';
import { getProducts } from '@/lib/actions/commerce';

export default async function ProductSearchPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchPage products={products} itemsPerPage={12} />
    </div>
  );
}
```

**Option B: Custom Implementation**

```tsx
'use client';

import { useState } from 'react';
import { InstantSearch, AdvancedFilters, SearchResults } from '@/components/search';
import type { Product } from '@/types/commerce';

export default function CustomSearch({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    types: [],
    styles: [],
    colors: [],
    sizes: [],
    priceRange: [0, 3000],
    materials: [],
    features: [],
  });

  return (
    <div className="space-y-6">
      <InstantSearch
        products={products}
        onSearchChange={setSearchQuery}
      />

      <div className="flex gap-6">
        <aside className="w-80">
          <AdvancedFilters
            filters={filters}
            onFilterChange={setFilters}
            // ... other props
          />
        </aside>

        <main className="flex-1">
          <SearchResults products={filteredProducts} />
        </main>
      </div>
    </div>
  );
}
```

## Component APIs

### InstantSearch

```tsx
<InstantSearch
  products={products}              // Product[] - Products to search
  onSearchChange={setSearchQuery}  // (query: string) => void
  placeholder="Search..."          // string (optional)
  showRecent={true}                // boolean (optional)
  maxResults={6}                   // number (optional)
  className="custom-class"         // string (optional)
/>
```

### AdvancedFilters

```tsx
<AdvancedFilters
  filters={filters}                // FilterValues - Current filter state
  options={filterOptions}          // Filter options object
  priceRange={{ min: 0, max: 3000 }} // { min: number, max: number }
  sortOptions={sortOptions}        // SortOption[]
  currentSort={sortValue}          // string
  onFilterChange={setFilters}      // (filters: FilterValues) => void
  onSortChange={setSortValue}      // (sort: string) => void
  isMobile={false}                 // boolean (optional)
  className="custom-class"         // string (optional)
/>
```

### SortOptions

```tsx
<SortOptions
  options={DEFAULT_SORT_OPTIONS}   // SortOption[]
  value={sortValue}                // string
  onChange={setSortValue}          // (value: string) => void
  className="custom-class"         // string (optional)
  variant="outline"                // 'default' | 'outline' | 'ghost'
/>
```

### SearchResults

```tsx
<SearchResults
  products={paginatedProducts}     // Product[]
  totalCount={totalCount}          // number
  currentPage={currentPage}        // number
  itemsPerPage={12}                // number
  onPageChange={setCurrentPage}    // (page: number) => void
  isLoading={false}                // boolean (optional)
  defaultView="grid"               // 'grid' | 'list'
  className="custom-class"         // string (optional)
/>
```

### SearchPage

```tsx
<SearchPage
  products={products}              // Product[]
  className="custom-class"         // string (optional)
  itemsPerPage={12}                // number (optional)
/>
```

## Advanced Customization

### Custom Filter Extraction

By default, filters are extracted from product data. You can customize this:

```tsx
const customFilterOptions = React.useMemo(() => {
  return {
    types: extractCustomTypes(products),
    styles: extractCustomStyles(products),
    colors: extractCustomColors(products),
    sizes: extractCustomSizes(products),
    materials: extractCustomMaterials(products),
    features: extractCustomFeatures(products),
  };
}, [products]);

<AdvancedFilters
  options={customFilterOptions}
  // ... other props
/>
```

### Custom Sort Logic

Implement custom sorting:

```tsx
const sortedProducts = React.useMemo(() => {
  const sorted = [...filteredProducts];

  switch (sortValue) {
    case 'custom-metric':
      sorted.sort((a, b) => customMetric(b) - customMetric(a));
      break;
    // ... other cases
  }

  return sorted;
}, [filteredProducts, sortValue]);
```

### URL State Integration

Sync search state with URL params:

```tsx
import { useSearchParams, useRouter } from 'next/navigation';

function SearchWithURLState() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => ({
    types: searchParams.get('types')?.split(',') || [],
    // ... parse other params
  }));

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);

    // Update URL
    const params = new URLSearchParams();
    if (newFilters.types.length) params.set('types', newFilters.types.join(','));
    // ... set other params

    router.push(`/search?${params.toString()}`);
  };

  return (
    <AdvancedFilters
      filters={filters}
      onFilterChange={handleFilterChange}
      // ... other props
    />
  );
}
```

## Styling

### Theme Customization

All components use Tailwind CSS and shadcn/ui theming. Customize via `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your primary color palette
        },
      },
    },
  },
};
```

### Component-Specific Styling

Add custom classes:

```tsx
<SearchPage
  className="max-w-7xl mx-auto custom-search-page"
  products={products}
/>
```

Or override with CSS modules/Tailwind:

```css
/* Custom styles */
.custom-search-page {
  /* Your custom styles */
}
```

## Performance Tips

1. **Memoize Filter Options**: Use `React.useMemo` for filter options
2. **Debounce Search**: Already implemented (300ms)
3. **Pagination**: Keep itemsPerPage reasonable (12-24)
4. **Lazy Load Images**: Already implemented with Next.js Image
5. **Virtual Scrolling**: For very large result sets (1000+ products)

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { InstantSearch } from '@/components/search';

test('renders search input', () => {
  render(<InstantSearch products={[]} />);
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
});

test('displays search results', async () => {
  const products = [{ id: '1', title: 'Test Product', ... }];
  render(<InstantSearch products={products} />);

  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'test' },
  });

  await waitFor(() => {
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
```

### E2E Tests

```tsx
// tests/e2e/search.spec.ts
import { test, expect } from '@playwright/test';

test('search functionality works', async ({ page }) => {
  await page.goto('/products/search');

  await page.fill('[placeholder*="Search"]', 'barn door');
  await page.waitForSelector('text=Barn Door');

  expect(await page.textContent('text=Barn Door')).toBeTruthy();
});

test('filters work correctly', async ({ page }) => {
  await page.goto('/products/search');

  await page.click('text=Filters');
  await page.check('text=Modern');

  const results = await page.locator('[data-testid="product-card"]').count();
  expect(results).toBeGreaterThan(0);
});
```

## Troubleshooting

### Issue: Search not updating

**Solution**: Ensure `onSearchChange` prop is provided and updates state:

```tsx
const [query, setQuery] = useState('');

<InstantSearch
  products={products}
  onSearchChange={setQuery} // Must update state
/>
```

### Issue: Filters not appearing

**Solution**: Check that filter options are not empty:

```tsx
// Debug filter options
console.log('Filter options:', filterOptions);

// Ensure extraction logic works
const options = React.useMemo(() => {
  return extractFilterOptions(products);
}, [products]);
```

### Issue: Pagination not working

**Solution**: Ensure `onPageChange` updates state:

```tsx
const [page, setPage] = useState(1);

<SearchResults
  currentPage={page}
  onPageChange={setPage} // Must update state
  // ... other props
/>
```

## Migration Guide

### From Existing Search

If you have an existing search implementation:

1. **Backup current implementation**
2. **Install new components**: Import from `@/components/search`
3. **Update data structure**: Map existing products to `Product` type
4. **Replace components**: Swap old search with new `SearchPage`
5. **Test thoroughly**: Ensure all features work
6. **Deploy incrementally**: Use feature flags if needed

### Example Migration

```tsx
// Before
import OldSearch from './old-search';

// After
import { SearchPage } from '@/components/search';

// Replace
- <OldSearch products={products} />
+ <SearchPage products={products} />
```

## Support

For issues or questions:

1. Check the README.md for documentation
2. Review component source code
3. Check TypeScript types for prop definitions
4. Test with demo data first
5. File an issue with reproduction steps

## Changelog

### v1.0.0 (Current)
- Initial release
- InstantSearch with autocomplete
- AdvancedFilters with multi-select
- SortOptions dropdown
- SearchResults with grid/list view
- Complete SearchPage component
- Mobile responsive
- Keyboard accessible
- Performance optimized
