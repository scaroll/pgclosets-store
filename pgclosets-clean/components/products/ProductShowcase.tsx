'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductsResponse, SearchParams, ProductStats } from '@/lib/types/api';
import { ReninProduct } from '@/lib/renin-product-loader';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import ProductSearch from './ProductSearch';
import ProductSortSelect from './ProductSortSelect';
import ProductPagination from './ProductPagination';
import ProductStatsBar from './ProductStatsBar';

// Native fetch function with caching
const fetchProducts = async (url: string): Promise<ProductsResponse> => {
  const response = await fetch(url, {
    cache: 'default',
    next: { revalidate: 300 } // 5 minutes
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.json();
};

// Default search parameters
const DEFAULT_PARAMS: SearchParams = {
  limit: 20,
  page: 1,
  sortBy: 'relevance',
  sortOrder: 'desc',
};

export default function ProductShowcase() {
  // State management
  const [searchParams, setSearchParams] = useState<SearchParams>(DEFAULT_PARAMS);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [productsResponse, setProductsResponse] = useState<ProductsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Build API URL with search parameters
  const apiUrl = useMemo(() => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.append(key, value.join(','));
          }
        } else {
          params.append(key, value.toString());
        }
      }
    });

    return `/api/products?${params.toString()}`;
  }, [searchParams]);

  // Fetch products data
  useEffect(() => {
    let isCancelled = false;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchProducts(apiUrl);

        if (!isCancelled) {
          setProductsResponse(response);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isCancelled = true;
    };
  }, [apiUrl]);

  // Retry function
  const mutate = useCallback(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetchProducts(apiUrl);
        setProductsResponse(response);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [apiUrl]);

  // Extract data from response
  const products = productsResponse?.data || [];
  const pagination = productsResponse?.pagination;
  const stats = productsResponse?.stats;

  // Update search parameters with debouncing
  const updateSearchParams = useCallback((newParams: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...newParams,
      page: newParams.page !== undefined ? newParams.page : 1, // Reset to page 1 unless explicitly set
    }));
  }, []);

  // Handle search query changes
  const handleSearch = useCallback((query: string) => {
    updateSearchParams({
      query: query || undefined,
      page: 1
    });
  }, [updateSearchParams]);

  // Handle filter changes
  const handleFilterChange = useCallback((filters: Partial<SearchParams>) => {
    updateSearchParams(filters);
  }, [updateSearchParams]);

  // Handle sort changes
  const handleSortChange = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    updateSearchParams({
      sortBy: sortBy as any,
      sortOrder,
      page: 1
    });
  }, [updateSearchParams]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    updateSearchParams({ page });

    // Scroll to top smoothly when page changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [updateSearchParams]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSearchParams(DEFAULT_PARAMS);
  }, []);

  // Toggle filters panel on mobile
  const toggleFilters = useCallback(() => {
    setIsFiltersOpen(prev => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Escape to close filters on mobile
      if (event.key === 'Escape' && isFiltersOpen) {
        setIsFiltersOpen(false);
      }

      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFiltersOpen]);

  // Loading state
  if (isLoading && !productsResponse) {
    return (
      <div className="container-apple section-apple">
        <ProductShowcaseSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container-apple section-apple">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-h3 mb-3">Unable to Load Products</h3>
          <p className="text-body-m text-pg-gray mb-6">
            We're experiencing technical difficulties. Please try again in a moment.
          </p>
          <button
            onClick={() => mutate()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-apple section-apple">
      {/* Stats Bar */}
      {stats && (
        <ProductStatsBar
          stats={stats}
          searchParams={searchParams}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Search and View Controls */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1">
          <ProductSearch
            onSearch={handleSearch}
            initialQuery={searchParams.query || ''}
            placeholder="Search doors by name, style, or category..."
          />
        </div>

        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="hidden sm:flex items-center border border-pg-border rounded-full p-1">
            <button
              onClick={() => setCurrentView('grid')}
              className={`p-2 rounded-full transition-colors ${
                currentView === 'grid'
                  ? 'bg-pg-navy text-white'
                  : 'text-pg-gray hover:text-pg-dark'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3zm0 11h7v7H3zm11-11h7v7h-7zm0 11h7v7h-7z"/>
              </svg>
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`p-2 rounded-full transition-colors ${
                currentView === 'list'
                  ? 'bg-pg-navy text-white'
                  : 'text-pg-gray hover:text-pg-dark'
              }`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
            </button>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={toggleFilters}
            className="lg:hidden btn-secondary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Filters
            {isFiltersOpen && (
              <span className="sr-only">(open)</span>
            )}
          </button>

          {/* Sort Select */}
          <ProductSortSelect
            sortBy={searchParams.sortBy || 'relevance'}
            sortOrder={searchParams.sortOrder || 'desc'}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <div className={`lg:block ${isFiltersOpen ? 'block' : 'hidden'}`}>
            <ProductFilters
              searchParams={searchParams}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              products={products}
              stats={stats}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:w-3/4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchParams.page}-${searchParams.query}-${searchParams.category}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {products.length > 0 ? (
                <>
                  <ProductGrid
                    products={products}
                    viewMode={currentView}
                    isLoading={isLoading}
                  />

                  {pagination && pagination.totalPages > 1 && (
                    <div className="mt-12">
                      <ProductPagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </>
              ) : (
                <NoProductsFound
                  searchParams={searchParams}
                  onClearFilters={handleClearFilters}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
            onClick={() => setIsFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-h3">Filters</h3>
                <button
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ProductFilters
                searchParams={searchParams}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                products={products}
                stats={stats}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// No products found component
function NoProductsFound({
  searchParams,
  onClearFilters
}: {
  searchParams: SearchParams;
  onClearFilters: () => void;
}) {
  const hasActiveFilters = searchParams.query ||
                          searchParams.category ||
                          searchParams.tags?.length ||
                          searchParams.priceMin ||
                          searchParams.priceMax;

  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <h3 className="text-h3 mb-3">
        {hasActiveFilters ? 'No doors match your criteria' : 'No doors found'}
      </h3>

      <p className="text-body-m text-pg-gray max-w-md mx-auto mb-6">
        {hasActiveFilters
          ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
          : 'We couldn\'t find any doors to display. Please try again later or contact support.'
        }
      </p>

      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="btn-secondary"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}

// Loading skeleton component
function ProductShowcaseSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search and controls skeleton */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="h-12 bg-gray-200 shimmer rounded-full"></div>
        </div>
        <div className="flex gap-4">
          <div className="w-32 h-12 bg-gray-200 shimmer rounded"></div>
          <div className="w-24 h-12 bg-gray-200 shimmer rounded"></div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 space-y-4">
          <div className="h-8 bg-gray-200 shimmer rounded"></div>
          <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 shimmer rounded w-3/4"></div>
            ))}
          </div>
        </div>
        <div className="lg:w-3/4">
          <div className="product-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card-apple p-4">
                <div className="aspect-square bg-gray-200 shimmer rounded mb-4"></div>
                <div className="h-4 bg-gray-200 shimmer rounded mb-2"></div>
                <div className="h-3 bg-gray-200 shimmer rounded w-2/3 mb-4"></div>
                <div className="h-6 bg-gray-200 shimmer rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}