'use client';

import { motion } from 'framer-motion';
import { ProductStats, SearchParams } from '@/lib/types/api';
import { formatCompactPrice } from '@/lib/utils/price';

interface ProductStatsBarProps {
  stats: ProductStats;
  searchParams: SearchParams;
  onClearFilters: () => void;
}

export default function ProductStatsBar({
  stats,
  searchParams,
  onClearFilters
}: ProductStatsBarProps) {
  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchParams.query ||
    searchParams.category ||
    searchParams.tags?.length ||
    searchParams.priceMin ||
    searchParams.priceMax ||
    searchParams.inStock ||
    searchParams.featured
  );

  // Format active filters for display
  const getActiveFiltersText = () => {
    const filters: string[] = [];

    if (searchParams.query) {
      filters.push(`"${searchParams.query}"`);
    }

    if (searchParams.category) {
      filters.push(searchParams.category);
    }

    if (searchParams.tags?.length) {
      filters.push(...searchParams.tags);
    }

    if (searchParams.priceMin || searchParams.priceMax) {
      if (searchParams.priceMin && searchParams.priceMax) {
        filters.push(`${formatCompactPrice(searchParams.priceMin)} - ${formatCompactPrice(searchParams.priceMax)}`);
      } else if (searchParams.priceMin) {
        filters.push(`Over ${formatCompactPrice(searchParams.priceMin)}`);
      } else if (searchParams.priceMax) {
        filters.push(`Under ${formatCompactPrice(searchParams.priceMax)}`);
      }
    }

    if (searchParams.inStock) {
      filters.push('In Stock');
    }

    if (searchParams.featured) {
      filters.push('Featured');
    }

    return filters;
  };

  const activeFilters = getActiveFiltersText();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-pg-offwhite border border-pg-border rounded-lg p-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Stats */}
        <div className="flex flex-wrap items-center gap-6 text-body-s">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pg-navy rounded-full"></div>
            <span className="text-pg-gray">
              <span className="font-semibold text-pg-dark">{stats.totalProducts}</span> products
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pg-sky rounded-full"></div>
            <span className="text-pg-gray">
              <span className="font-semibold text-pg-dark">{stats.categories}</span> categories
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-pg-gray">
              <span className="font-semibold text-pg-dark">{stats.inStockCount}</span> in stock
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-pg-gray">
              {formatCompactPrice(stats.priceRange.min)} - {formatCompactPrice(stats.priceRange.max)}
            </span>
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-micro text-pg-gray">FILTERED BY:</span>

            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-pg-navy text-white text-xs rounded-full"
                >
                  {filter}
                </span>
              ))}
            </div>

            <button
              onClick={onClearFilters}
              className="text-body-s text-pg-navy hover:text-pg-dark transition-colors font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Sort indicator */}
        {searchParams.sortBy && searchParams.sortBy !== 'relevance' && (
          <div className="flex items-center gap-2 text-body-s text-pg-gray">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>
              Sorted by {searchParams.sortBy} ({searchParams.sortOrder})
            </span>
          </div>
        )}
      </div>

      {/* Quick Stats Summary */}
      {!hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-pg-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-pg-navy">
                {stats.totalVariants}
              </div>
              <div className="text-micro text-pg-gray">Total Options</div>
            </div>

            <div>
              <div className="text-lg font-semibold text-pg-navy">
                {formatCompactPrice(stats.averagePrice)}
              </div>
              <div className="text-micro text-pg-gray">Avg Price</div>
            </div>

            <div>
              <div className="text-lg font-semibold text-green-600">
                {Math.round((stats.inStockCount / stats.totalProducts) * 100)}%
              </div>
              <div className="text-micro text-pg-gray">In Stock</div>
            </div>

            <div>
              <div className="text-lg font-semibold text-pg-navy">
                {stats.tags}
              </div>
              <div className="text-micro text-pg-gray">Style Tags</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}