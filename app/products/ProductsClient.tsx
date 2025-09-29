'use client';

import React, { useState, useMemo, useCallback, memo, useRef } from 'react';
import { Product } from '@/types/commerce';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { useIntersectionObserver } from '@/lib/hooks/use-intersection-observer';
import { usePerformanceMonitoring } from '@/lib/performance-metrics';

// Enhanced filter types for Renin products
interface FilterOptions {
  categories: string[];
  doorStyles: string[];
  priceRanges: { label: string; min: number; max: number }[];
  doorTypes: string[];
  materials: string[];
  finishes: string[];
}

interface ActiveFilters {
  category?: string;
  doorStyle?: string;
  priceRange?: { min: number; max: number };
  doorType?: string;
  material?: string;
  finish?: string;
  search?: string;
}

// Enhanced product filtering utilities
const extractProductAttributes = (products: Product[]) => {
  const categories = Array.from(new Set(products.map(p => p.collection?.title || 'Uncategorized')));

  // Extract door styles from product names and descriptions
  const styleKeywords = ['Modern', 'Traditional', 'Contemporary', 'Rustic', 'Euro', 'Pavilion', 'Ashbury', 'Crochet'];
  const doorStyles = Array.from(new Set(
    products.flatMap(p =>
      styleKeywords.filter(style =>
        p.title.toLowerCase().includes(style.toLowerCase()) ||
        p.description.toLowerCase().includes(style.toLowerCase())
      )
    )
  ));

  // Extract door types from categories and descriptions
  const typeKeywords = ['Bypass', 'Bifold', 'Pivot', 'Barn', 'Sliding', 'Folding'];
  const doorTypes = Array.from(new Set(
    products.flatMap(p =>
      typeKeywords.filter(type =>
        p.title.toLowerCase().includes(type.toLowerCase()) ||
        (p.collection?.title || '').toLowerCase().includes(type.toLowerCase())
      )
    )
  ));

  // Extract materials from descriptions
  const materialKeywords = ['Wood', 'Glass', 'Mirror', 'Steel', 'Engineered', 'Frosted Glass', 'Tempered Glass'];
  const materials = Array.from(new Set(
    products.flatMap(p =>
      materialKeywords.filter(material =>
        p.description.toLowerCase().includes(material.toLowerCase())
      )
    )
  ));

  // Extract finishes from descriptions and specs
  const finishKeywords = ['White', 'Black', 'Gray', 'Graphite', 'Off-White', 'Bright White', 'Satin', 'Matte', 'Nickel'];
  const finishes = Array.from(new Set(
    products.flatMap(p =>
      finishKeywords.filter(finish =>
        p.description.toLowerCase().includes(finish.toLowerCase()) ||
        p.title.toLowerCase().includes(finish.toLowerCase())
      )
    )
  ));

  const priceRanges = [
    { label: '$200 - $500', min: 200, max: 500 },
    { label: '$500 - $1,000', min: 500, max: 1000 },
    { label: '$1,000 - $2,000', min: 1000, max: 2000 },
    { label: '$2,000+', min: 2000, max: Infinity },
  ];

  return {
    categories: categories.sort(),
    doorStyles: doorStyles.sort(),
    priceRanges,
    doorTypes: doorTypes.sort(),
    materials: materials.sort(),
    finishes: finishes.sort(),
  };
};

const filterProducts = (products: Product[], filters: ActiveFilters): Product[] => {
  return products.filter(product => {
    // Category filter
    if (filters.category && filters.category !== 'All Categories') {
      if ((product.collection?.title || 'Uncategorized') !== filters.category) {
        return false;
      }
    }

    // Door style filter
    if (filters.doorStyle) {
      const hasStyle = product.title.toLowerCase().includes(filters.doorStyle.toLowerCase()) ||
                     product.description.toLowerCase().includes(filters.doorStyle.toLowerCase());
      if (!hasStyle) return false;
    }

    // Price range filter
    if (filters.priceRange) {
      const price = product.variants[0]?.price || 0;
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }
    }

    // Door type filter
    if (filters.doorType) {
      const hasType = product.title.toLowerCase().includes(filters.doorType.toLowerCase()) ||
                     (product.collection?.title || '').toLowerCase().includes(filters.doorType.toLowerCase());
      if (!hasType) return false;
    }

    // Material filter
    if (filters.material) {
      const hasMaterial = product.description.toLowerCase().includes(filters.material.toLowerCase());
      if (!hasMaterial) return false;
    }

    // Finish filter
    if (filters.finish) {
      const hasFinish = product.description.toLowerCase().includes(filters.finish.toLowerCase()) ||
                       product.title.toLowerCase().includes(filters.finish.toLowerCase());
      if (!hasFinish) return false;
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const hasMatch = product.title.toLowerCase().includes(searchTerm) ||
                      product.description.toLowerCase().includes(searchTerm) ||
                      (product.collection?.title || '').toLowerCase().includes(searchTerm);
      if (!hasMatch) return false;
    }

    return true;
  });
};

const ProductCard = memo(({ product }: { product: Product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    triggerOnce: true
  });

  return (
    <div ref={targetRef} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {isIntersecting && !imageError ? (
            <Image
              src={product.thumbnail || '/placeholder.svg'}
              alt={product.title}
              fill
              className={`object-cover hover:scale-105 transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              priority={false}
              quality={75}
            />
          ) : imageError ? (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Image not available</span>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
          {isIntersecting && !imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          {product.variants[0]?.price && product.variants[0]?.price > 500 && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs font-medium uppercase">
              Premium
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{product.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="text-xl font-bold text-gray-900 mb-4">
          {formatPrice(product.variants[0]?.price || 0)}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/products/${product.handle}`}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center text-sm font-medium"
          >
            View Details
          </Link>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
            Quote
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Filter Sidebar Component
const FilterSidebar = memo(({
  filterOptions,
  activeFilters,
  onFilterChange,
  onClearFilters,
  filteredProductCount,
  totalProductCount,
  isOpen,
  onToggle
}: {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
  filteredProductCount: number;
  totalProductCount: number;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const hasActiveFilters = Object.values(activeFilters).some(filter =>
    filter !== undefined && filter !== ''
  );

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-80' : 'w-0 overflow-hidden lg:w-80'}`}>
      <div className="p-6 space-y-6">
        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-slate-900">Filters</h3>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-slate-600">
          Showing {filteredProductCount} of {totalProductCount} products
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        )}

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <input
            type="text"
            value={activeFilters.search || ''}
            onChange={(e) => onFilterChange({ ...activeFilters, search: e.target.value || undefined })}
            placeholder="Search products..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Categories</label>
          <select
            value={activeFilters.category || ''}
            onChange={(e) => onFilterChange({ ...activeFilters, category: e.target.value || undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {filterOptions.categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Door Styles */}
        {filterOptions.doorStyles.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Door Styles</label>
            <select
              value={activeFilters.doorStyle || ''}
              onChange={(e) => onFilterChange({ ...activeFilters, doorStyle: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Styles</option>
              {filterOptions.doorStyles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        )}

        {/* Price Ranges */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Price Range</label>
          <select
            value={activeFilters.priceRange ? `${activeFilters.priceRange.min}-${activeFilters.priceRange.max}` : ''}
            onChange={(e) => {
              if (!e.target.value) {
                onFilterChange({ ...activeFilters, priceRange: undefined });
              } else {
                const range = filterOptions.priceRanges.find(r =>
                  `${r.min}-${r.max}` === e.target.value
                );
                if (range) {
                  onFilterChange({ ...activeFilters, priceRange: { min: range.min, max: range.max } });
                }
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Prices</option>
            {filterOptions.priceRanges.map(range => (
              <option key={`${range.min}-${range.max}`} value={`${range.min}-${range.max}`}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Door Types */}
        {filterOptions.doorTypes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Door Types</label>
            <select
              value={activeFilters.doorType || ''}
              onChange={(e) => onFilterChange({ ...activeFilters, doorType: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              {filterOptions.doorTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {/* Materials */}
        {filterOptions.materials.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Materials</label>
            <select
              value={activeFilters.material || ''}
              onChange={(e) => onFilterChange({ ...activeFilters, material: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Materials</option>
              {filterOptions.materials.map(material => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>
        )}

        {/* Finishes */}
        {filterOptions.finishes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Colors/Finishes</label>
            <select
              value={activeFilters.finish || ''}
              onChange={(e) => onFilterChange({ ...activeFilters, finish: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Finishes</option>
              {filterOptions.finishes.map(finish => (
                <option key={finish} value={finish}>{finish}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
});

FilterSidebar.displayName = 'FilterSidebar';

// Pagination component
const Pagination = memo(({
  currentPage,
  totalPages,
  onPageChange
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-md ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

// Main client component
const ProductsClient = ({ initialProducts }: { initialProducts: Product[] }) => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Optimized for performance
  const { measureAndReport, measureDOMNodes } = usePerformanceMonitoring();

  // Performance monitoring
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (process.env.NODE_ENV === 'development') {
        measureAndReport();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [measureAndReport, paginatedProducts.length]);

  const filterOptions = useMemo(() => extractProductAttributes(initialProducts), [initialProducts]);

  const filteredProducts = useMemo(() =>
    filterProducts(initialProducts, activeFilters),
    [initialProducts, activeFilters]
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handleFilterChange = useCallback((newFilters: ActiveFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const handleClearFilters = useCallback(() => {
    setActiveFilters({});
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of products grid
    document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Mobile filter overlay */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Filter Sidebar */}
      <div className={`fixed left-0 top-0 h-full z-50 lg:relative lg:z-auto ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300`}>
        <FilterSidebar
          filterOptions={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          filteredProductCount={filteredProducts.length}
          totalProductCount={initialProducts.length}
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Mobile filter button */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
            </svg>
            Filters ({Object.values(activeFilters).filter(v => v !== undefined && v !== '').length})
          </button>
        </div>

        <div className="p-6">
          {/* Results info */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>
          </div>

          <div id="products-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-slate-500 text-lg mb-2">No products found</div>
                <div className="text-slate-400 text-sm">Try adjusting your filters to see more results</div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsClient;