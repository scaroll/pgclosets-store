"use client";

import { useState, useEffect, useMemo } from 'react';
import { ProductSearchEngine, SearchFilters, SearchResult, SortOption } from '@/lib/search-utils';
import { ReninProduct } from '@/lib/renin-product-loader';
import { ProductSearch } from './product-search';
import { SearchResults } from './search-results';
import { FilterSidebar, useFilterSidebar } from '../filters/filter-sidebar';

interface ProductDiscoveryPageProps {
  products: ReninProduct[];
  initialQuery?: string;
  className?: string;
}

export function ProductDiscoveryPage({
  products,
  initialQuery = '',
  className,
}: ProductDiscoveryPageProps) {
  // Search and filter state
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    tags: [],
    priceRange: { min: 0, max: 1000 },
    inStock: false,
    sortBy: 'relevance',
    sortOrder: 'desc',
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const filterSidebar = useFilterSidebar();

  // Initialize price range from products
  useEffect(() => {
    if (products.length > 0) {
      const allPrices = products.flatMap(p =>
        p.variants.map(v => v.price).filter(price => price > 0)
      );

      if (allPrices.length > 0) {
        const minPrice = Math.floor(Math.min(...allPrices) / 10) * 10;
        const maxPrice = Math.ceil(Math.max(...allPrices) / 10) * 10;

        setFilters(prev => ({
          ...prev,
          priceRange: { min: minPrice, max: maxPrice },
        }));
      }
    }
  }, [products]);

  // Memoized search results
  const searchResults = useMemo<SearchResult[]>(() => {
    if (products.length === 0) return [];

    setIsLoading(true);

    try {
      const results = ProductSearchEngine.search(products, query, filters);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    } finally {
      // Simulate slight delay for smooth UX
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [products, query, filters]);

  // Handle search
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    // Reset sort to relevance when searching
    if (searchQuery && filters.sortBy !== 'relevance') {
      setFilters(prev => ({ ...prev, sortBy: 'relevance', sortOrder: 'desc' }));
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  // Handle sort changes
  const handleSortChange = (sortBy: SortOption, sortOrder: 'asc' | 'desc') => {
    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: any) => {
    switch (suggestion.type) {
      case 'category':
        setFilters(prev => ({
          ...prev,
          categories: [...prev.categories, suggestion.text],
        }));
        break;
      case 'tag':
        setFilters(prev => ({
          ...prev,
          tags: [...prev.tags, suggestion.text],
        }));
        break;
      default:
        // For product suggestions, just search
        setQuery(suggestion.text);
        break;
    }
  };

  return (
    <div className={className}>
      {/* Search Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extralight text-slate-900 mb-2">
              Find Your Perfect Closet Door
            </h1>
            <p className="text-slate-600 font-light max-w-2xl mx-auto">
              Search through our complete collection of premium closet doors with advanced filtering and instant results.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center">
            <ProductSearch
              products={products}
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              placeholder="Search for barn doors, bypass doors, hardware..."
              className="w-full max-w-3xl"
              showRecentSearches={true}
              maxSuggestions={8}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar (Desktop) and Filter Controls */}
          <div className="lg:col-span-3">
            <FilterSidebar
              products={products}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              resultCount={searchResults.length}
              isOpen={filterSidebar.isOpen}
              onToggle={filterSidebar.toggle}
            />
          </div>

          {/* Results */}
          <div className="lg:col-span-9">
            <SearchResults
              results={searchResults}
              query={query}
              isLoading={isLoading}
              showViewToggle={true}
              showSortControls={true}
              onSortChange={handleSortChange}
              currentSort={{
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      {!isLoading && searchResults.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-extralight text-slate-900 mb-1">
                  {searchResults.length}
                </div>
                <div className="text-sm text-slate-600">
                  Products Found
                </div>
              </div>
              <div>
                <div className="text-2xl font-extralight text-slate-900 mb-1">
                  {searchResults.filter(r => r.score >= 5).length}
                </div>
                <div className="text-sm text-slate-600">
                  Great Matches
                </div>
              </div>
              <div>
                <div className="text-2xl font-extralight text-slate-900 mb-1">
                  {searchResults.filter(r =>
                    r.product.variants.some(v => v.inventory_quantity > 0)
                  ).length}
                </div>
                <div className="text-sm text-slate-600">
                  In Stock
                </div>
              </div>
              <div>
                <div className="text-2xl font-extralight text-slate-900 mb-1">
                  {Array.from(new Set(
                    searchResults.map(r => r.product.product_type)
                  )).length}
                </div>
                <div className="text-sm text-slate-600">
                  Categories
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Example usage in a Next.js page component
export default function SearchPage() {
  const [products, setProducts] = useState<ReninProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 font-light">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <ProductDiscoveryPage
      products={products}
      className="min-h-screen bg-slate-50"
    />
  );
}