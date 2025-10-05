'use client';

import * as React from 'react';
import { InstantSearch } from './InstantSearch';
import { AdvancedFilters, FilterValues } from './AdvancedFilters';
import { SortOptions, DEFAULT_SORT_OPTIONS } from './SortOptions';
import { SearchResults } from './SearchResults';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/types/commerce';
import { useDebounce } from '@/lib/hooks/use-debounce';

/**
 * SearchPage Component
 *
 * Complete search/filter/sort page with:
 * - Instant search with autocomplete
 * - Advanced filters (type, style, color, size, price, material, features)
 * - Sort options
 * - Grid/List view toggle
 * - Pagination
 * - Mobile responsive
 * - URL state management (optional)
 */

interface SearchPageProps {
  /** Initial products to display */
  products: Product[];
  /** Custom className */
  className?: string;
  /** Items per page for pagination */
  itemsPerPage?: number;
}

export function SearchPage({
  products,
  className,
  itemsPerPage = 12,
}: SearchPageProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<FilterValues>({
    types: [],
    styles: [],
    colors: [],
    sizes: [],
    priceRange: [0, 3000],
    materials: [],
    features: [],
  });
  const [sortValue, setSortValue] = React.useState('relevance');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);

  // Extract filter options from products
  const filterOptions = React.useMemo(() => {
    const types = new Set<string>();
    const styles = new Set<string>();
    const colors = new Set<string>();
    const sizes = new Set<string>();
    const materials = new Set<string>();
    const features = new Set<string>();

    products.forEach((product) => {
      // Extract from collection/category
      if (product.collection?.title) {
        types.add(product.collection.title);
      }

      // Extract styles from title/description
      const styleKeywords = ['Modern', 'Traditional', 'Contemporary', 'Rustic', 'Transitional'];
      styleKeywords.forEach((style) => {
        if (
          product.title.toLowerCase().includes(style.toLowerCase()) ||
          product.description.toLowerCase().includes(style.toLowerCase())
        ) {
          styles.add(style);
        }
      });

      // Extract colors from description
      const colorKeywords = ['White', 'Black', 'Gray', 'Brown', 'Natural', 'Espresso', 'Oak', 'Walnut'];
      colorKeywords.forEach((color) => {
        if (product.description.toLowerCase().includes(color.toLowerCase())) {
          colors.add(color);
        }
      });

      // Extract sizes (example - adjust based on your data)
      const sizeKeywords = ['24"', '30"', '36"', '48"', '60"', '72"'];
      sizeKeywords.forEach((size) => {
        if (product.description.includes(size) || product.title.includes(size)) {
          sizes.add(size);
        }
      });

      // Extract materials
      const materialKeywords = ['Wood', 'Glass', 'Mirror', 'Steel', 'MDF', 'Engineered Wood'];
      materialKeywords.forEach((material) => {
        if (product.description.toLowerCase().includes(material.toLowerCase())) {
          materials.add(material);
        }
      });

      // Extract features
      const featureKeywords = ['Soft Close', 'Adjustable', 'Easy Install', 'Pre-Assembled'];
      featureKeywords.forEach((feature) => {
        if (product.description.toLowerCase().includes(feature.toLowerCase())) {
          features.add(feature);
        }
      });
    });

    return {
      types: Array.from(types).sort(),
      styles: Array.from(styles).sort(),
      colors: Array.from(colors).sort(),
      sizes: Array.from(sizes).sort(),
      materials: Array.from(materials).sort(),
      features: Array.from(features).sort(),
    };
  }, [products]);

  // Calculate price range from products
  const priceRange = React.useMemo(() => {
    const prices = products
      .map((p) => p.variants[0]?.price || 0)
      .filter((p) => p > 0);

    if (prices.length === 0) {
      return { min: 0, max: 3000 };
    }

    return {
      min: Math.floor(Math.min(...prices) / 100),
      max: Math.ceil(Math.max(...prices) / 100),
    };
  }, [products]);

  // Initialize filter price range
  React.useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [priceRange.min, priceRange.max],
    }));
  }, [priceRange]);

  // Filter and sort products
  const { filteredProducts, totalCount } = React.useMemo(() => {
    let results = products;

    // Apply search
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.collection?.title?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.types.length > 0) {
      results = results.filter((p) =>
        filters.types.includes(p.collection?.title || '')
      );
    }

    if (filters.styles.length > 0) {
      results = results.filter((p) =>
        filters.styles.some(
          (style) =>
            p.title.toLowerCase().includes(style.toLowerCase()) ||
            p.description.toLowerCase().includes(style.toLowerCase())
        )
      );
    }

    if (filters.colors.length > 0) {
      results = results.filter((p) =>
        filters.colors.some((color) =>
          p.description.toLowerCase().includes(color.toLowerCase())
        )
      );
    }

    if (filters.sizes.length > 0) {
      results = results.filter((p) =>
        filters.sizes.some(
          (size) => p.description.includes(size) || p.title.includes(size)
        )
      );
    }

    if (filters.materials.length > 0) {
      results = results.filter((p) =>
        filters.materials.some((material) =>
          p.description.toLowerCase().includes(material.toLowerCase())
        )
      );
    }

    if (filters.features.length > 0) {
      results = results.filter((p) =>
        filters.features.some((feature) =>
          p.description.toLowerCase().includes(feature.toLowerCase())
        )
      );
    }

    // Price range filter
    results = results.filter((p) => {
      const price = (p.variants[0]?.price || 0) / 100;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // In stock filter
    if (filters.inStock) {
      results = results.filter((p) => p.availableForSale);
    }

    // Apply sorting
    const sorted = [...results];
    switch (sortValue) {
      case 'price-asc':
        sorted.sort(
          (a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
        );
        break;
      case 'price-desc':
        sorted.sort(
          (a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
        );
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      // 'relevance', 'bestselling', 'featured' would require additional data
      default:
        break;
    }

    return {
      filteredProducts: sorted,
      totalCount: sorted.length,
    };
  }, [products, debouncedSearch, filters, sortValue]);

  // Paginate results
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filters, sortValue]);

  return (
    <div className={className}>
      {/* Search Bar */}
      <div className="mb-8">
        <InstantSearch
          products={products}
          onSearchChange={setSearchQuery}
          placeholder="Search products by name, SKU, or category..."
          showRecent
          maxResults={6}
        />
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-24">
            <AdvancedFilters
              filters={filters}
              options={filterOptions}
              priceRange={priceRange}
              sortOptions={DEFAULT_SORT_OPTIONS}
              currentSort={sortValue}
              onFilterChange={setFilters}
              onSortChange={setSortValue}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Filter Button & Sort */}
          <div className="flex items-center justify-between gap-4 mb-6 lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            <SortOptions
              options={DEFAULT_SORT_OPTIONS}
              value={sortValue}
              onChange={setSortValue}
            />
          </div>

          {/* Desktop Sort */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div className="text-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? 'product' : 'products'} found
            </div>
            <SortOptions
              options={DEFAULT_SORT_OPTIONS}
              value={sortValue}
              onChange={setSortValue}
            />
          </div>

          {/* Results */}
          <SearchResults
            products={paginatedProducts}
            totalCount={totalCount}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Mobile Filters Sheet */}
      {showFilters && (
        <div className="lg:hidden">
          <AdvancedFilters
            filters={filters}
            options={filterOptions}
            priceRange={priceRange}
            sortOptions={DEFAULT_SORT_OPTIONS}
            currentSort={sortValue}
            onFilterChange={setFilters}
            onSortChange={setSortValue}
            isMobile
          />
        </div>
      )}
    </div>
  );
}
