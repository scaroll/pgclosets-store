"use client";

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, DollarSign, Package, Tag, Filter, RotateCcw } from 'lucide-react';
import { SearchFilters, FilterStats, SortOption, searchUtils } from '@/lib/search-utils';
import { ReninProduct } from '@/lib/renin-product-loader';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  products: ReninProduct[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
  showResultCount?: boolean;
  resultCount?: number;
}

interface FilterSection {
  id: string;
  title: string;
  isExpanded: boolean;
}

export function ProductFilters({
  products,
  filters,
  onFiltersChange,
  className,
  showResultCount = true,
  resultCount = 0,
}: ProductFiltersProps) {
  const [filterStats, setFilterStats] = useState<FilterStats | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    priceRange: true,
    tags: false,
    availability: true,
    sorting: true,
  });

  // Calculate filter statistics
  useEffect(() => {
    const stats = {
      categories: [] as Array<{ name: string; count: number; }>,
      tags: [] as Array<{ name: string; count: number; }>,
      priceRange: { min: 0, max: 1000 },
      totalProducts: products.length,
      inStockCount: 0,
    };

    // Calculate category counts
    const categoryMap = new Map<string, number>();
    const tagMap = new Map<string, number>();
    const prices: number[] = [];
    let inStockCount = 0;

    products.forEach(product => {
      // Categories
      categoryMap.set(product.product_type, (categoryMap.get(product.product_type) || 0) + 1);

      // Tags
      product.tags.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });

      // Prices
      const productPrices = product.variants.map(v => v.price).filter(p => p > 0);
      prices.push(...productPrices);

      // Stock status
      if (product.variants.some(v => v.inventory_quantity > 0)) {
        inStockCount++;
      }
    });

    stats.categories = Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    stats.tags = Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Show top 20 tags

    stats.priceRange = {
      min: prices.length > 0 ? Math.floor(Math.min(...prices) / 10) * 10 : 0,
      max: prices.length > 0 ? Math.ceil(Math.max(...prices) / 10) * 10 : 1000,
    };

    stats.inStockCount = inStockCount;

    setFilterStats(stats);
  }, [products]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Handle category filter change
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);

    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  // Handle tag filter change
  const handleTagChange = (tag: string, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tag]
      : filters.tags.filter(t => t !== tag);

    onFiltersChange({
      ...filters,
      tags: newTags,
    });
  };

  // Handle price range change
  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  // Handle sort change
  const handleSortChange = (sortBy: SortOption, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    onFiltersChange({
      categories: [],
      tags: [],
      priceRange: {
        min: filterStats?.priceRange.min || 0,
        max: filterStats?.priceRange.max || 1000,
      },
      inStock: false,
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.inStock ||
    (filterStats && (
      filters.priceRange.min !== filterStats.priceRange.min ||
      filters.priceRange.max !== filterStats.priceRange.max
    ));

  const FilterSection = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={() => toggleSection(id)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        aria-expanded={expandedSections[id]}
      >
        <span className="font-medium text-slate-900">{title}</span>
        {expandedSections[id] ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      {expandedSections[id] && (
        <div className="px-6 pb-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className={cn("bg-white border border-slate-200 rounded-lg", className)}>
      {/* Filter Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-medium text-slate-900">Filters</h2>
          {showResultCount && (
            <span className="text-sm text-slate-500">
              ({resultCount} {resultCount === 1 ? 'result' : 'results'})
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200">
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(category => (
              <div
                key={category}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 text-white text-xs rounded-full"
              >
                <span>{category}</span>
                <button
                  onClick={() => handleCategoryChange(category, false)}
                  className="hover:text-slate-300"
                  aria-label={`Remove ${category} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {filters.tags.map(tag => (
              <div
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 text-white text-xs rounded-full"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleTagChange(tag, false)}
                  className="hover:text-slate-300"
                  aria-label={`Remove ${tag} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {filters.inStock && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                <span>In Stock</span>
                <button
                  onClick={() => onFiltersChange({ ...filters, inStock: false })}
                  className="hover:text-green-200"
                  aria-label="Remove in stock filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="divide-y divide-slate-200">
        {/* Categories */}
        <FilterSection id="categories" title="Categories">
          <div className="space-y-2">
            {filterStats?.categories.map(({ name, count }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(name)}
                  onChange={(e) => handleCategoryChange(name, e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div className="flex items-center gap-2 flex-1">
                  <Package className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700">{name}</span>
                  <span className="text-xs text-slate-500 ml-auto">({count})</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection id="priceRange" title="Price Range">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <DollarSign className="w-4 h-4" />
              <span>
                {searchUtils.formatPrice(filters.priceRange.min)} - {searchUtils.formatPrice(filters.priceRange.max)}
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Min Price</label>
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange.max)}
                    min={filterStats?.priceRange.min || 0}
                    max={filters.priceRange.max}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Max Price</label>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceRangeChange(filters.priceRange.min, Number(e.target.value))}
                    min={filters.priceRange.min}
                    max={filterStats?.priceRange.max || 1000}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min={filterStats?.priceRange.min || 0}
                  max={filterStats?.priceRange.max || 1000}
                  value={filters.priceRange.max}
                  onChange={(e) => handlePriceRangeChange(filters.priceRange.min, Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </FilterSection>

        {/* Availability */}
        <FilterSection id="availability" title="Availability">
          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked })}
                className="rounded border-slate-300 text-green-600 focus:ring-green-600"
              />
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-700">In Stock Only</span>
                <span className="text-xs text-slate-500 ml-auto">
                  ({filterStats?.inStockCount || 0})
                </span>
              </div>
            </label>
          </div>
        </FilterSection>

        {/* Tags */}
        <FilterSection id="tags" title="Tags">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filterStats?.tags.slice(0, 15).map(({ name, count }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={filters.tags.includes(name)}
                  onChange={(e) => handleTagChange(name, e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <div className="flex items-center gap-2 flex-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span className="text-sm text-slate-700">{name}</span>
                  <span className="text-xs text-slate-500 ml-auto">({count})</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Sorting */}
        <FilterSection id="sorting" title="Sort By">
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'relevance', label: 'Relevance', desc: 'Best matches first' },
                { value: 'price', label: 'Price', desc: 'Low to high' },
                { value: 'name', label: 'Name', desc: 'A to Z' },
                { value: 'newest', label: 'Newest', desc: 'Latest products' },
                { value: 'popularity', label: 'Popularity', desc: 'Most popular' },
              ].map(({ value, label, desc }) => (
                <label key={value} className="flex items-start gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors">
                  <input
                    type="radio"
                    name="sortBy"
                    value={value}
                    checked={filters.sortBy === value}
                    onChange={() => handleSortChange(value as SortOption, filters.sortOrder)}
                    className="mt-1 border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-700">{label}</div>
                    <div className="text-xs text-slate-500">{desc}</div>
                  </div>
                </label>
              ))}
            </div>

            {filters.sortBy !== 'relevance' && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Order:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleSortChange(filters.sortBy, 'asc')}
                      className={cn(
                        "px-2 py-1 text-xs rounded transition-colors",
                        filters.sortOrder === 'asc'
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      Ascending
                    </button>
                    <button
                      onClick={() => handleSortChange(filters.sortBy, 'desc')}
                      className={cn(
                        "px-2 py-1 text-xs rounded transition-colors",
                        filters.sortOrder === 'desc'
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      )}
                    >
                      Descending
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </FilterSection>
      </div>
    </div>
  );
}