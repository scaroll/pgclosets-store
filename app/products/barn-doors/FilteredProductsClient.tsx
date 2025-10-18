'use client';

import { useState, useMemo } from 'react';
import { ProductFilters, type FilterValues } from '@/components/products/ProductFilters';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import {
  applyFilters,
  extractAvailableFinishes,
  extractAvailableFeatures,
  getPriceRange,
  getWidthRange,
  getHeightRange,
  initializeFilters,
  type SimpleProduct,
} from '@/lib/products/filters';

interface FilteredProductsClientProps {
  products: SimpleProduct[];
}

// Format price helper
function formatPrice(price: number, currency: string = 'CAD'): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(price / 100); // Convert cents to dollars
}

const ProductCard = ({ product }: { product: SimpleProduct }) => (
  <div className="bg-white shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 border border-gray-100">
    <Link href={`/products/${product.slug}`} className="block">
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute top-2 left-2 bg-slate-900 text-white px-3 py-1 text-xs font-light tracking-widest uppercase">
          Renin
        </div>
      </div>
    </Link>
    <div className="p-6">
      <h3 className="text-xl font-light text-slate-900 mb-2 tracking-wide">{product.title}</h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2 font-light">{product.description}</p>
      <div className="text-3xl font-extralight text-slate-900 mb-6 tracking-tight">
        {formatPrice(product.price)}
      </div>
      <div className="flex gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 bg-slate-900 text-white py-3 font-light hover:bg-slate-800 transition-all duration-500 hover:shadow-xl text-sm uppercase tracking-widest text-center"
        >
          View Details
        </Link>
        <Link
          href="/request-work"
          className="px-4 py-3 border border-slate-300 text-slate-700 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300 text-sm uppercase tracking-widest font-light"
        >
          Get Quote
        </Link>
      </div>
    </div>
  </div>
);

export default function FilteredProductsClient({ products }: FilteredProductsClientProps) {
  // Initialize filter ranges and options
  const defaultFilters = useMemo(() => initializeFilters(products), [products]);
  const [filters, setFilters] = useState<FilterValues>(defaultFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract available options
  const availableFinishes = useMemo(() => extractAvailableFinishes(products), [products]);
  const availableFeatures = useMemo(() => extractAvailableFeatures(products), [products]);
  const priceRange = useMemo(() => getPriceRange(products), [products]);
  const widthRange = useMemo(() => getWidthRange(products), [products]);
  const heightRange = useMemo(() => getHeightRange(products), [products]);

  // Apply filters to products
  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters]);

  // Calculate active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1]) count++;
    if (filters.widthRange[0] !== widthRange[0] || filters.widthRange[1] !== widthRange[1]) count++;
    if (filters.heightRange[0] !== heightRange[0] || filters.heightRange[1] !== heightRange[1]) count++;
    count += filters.finishes.length;
    count += filters.features.length;
    return count;
  }, [filters, priceRange, widthRange, heightRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-slate-900 mb-2">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} Found
          </h2>
          {activeFilterCount > 0 && (
            <p className="text-sm text-slate-600 font-light">
              {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied
            </p>
          )}
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden">
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-4">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              minPrice={priceRange[0]}
              maxPrice={priceRange[1]}
              minWidth={widthRange[0]}
              maxWidth={widthRange[1]}
              minHeight={heightRange[0]}
              maxHeight={heightRange[1]}
              availableFinishes={availableFinishes}
              availableFeatures={availableFeatures}
            />
          </div>
        </aside>

        {/* Mobile Filters Sheet */}
        <div className="lg:hidden">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
            minPrice={priceRange[0]}
            maxPrice={priceRange[1]}
            minWidth={widthRange[0]}
            maxWidth={widthRange[1]}
            minHeight={heightRange[0]}
            maxHeight={heightRange[1]}
            availableFinishes={availableFinishes}
            availableFeatures={availableFeatures}
            isMobileSheet
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <div className="max-w-md mx-auto">
                <SlidersHorizontal className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-light text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-600 mb-6 font-light">
                  Try adjusting your filters to see more results
                </p>
                <Button
                  onClick={() => setFilters(defaultFilters)}
                  variant="outline"
                  className="uppercase tracking-widest"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
