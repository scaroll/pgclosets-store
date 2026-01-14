'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchParams, ProductStats } from '@/lib/types/api';
import { ReninProduct } from '@/lib/renin-product-loader';
import { formatCADPrice } from '@/lib/utils/price';

interface ProductFiltersProps {
  searchParams: SearchParams;
  onFilterChange: (filters: Partial<SearchParams>) => void;
  onClearFilters: () => void;
  products: ReninProduct[];
  stats?: ProductStats;
}

export default function ProductFilters({
  searchParams,
  onFilterChange,
  onClearFilters,
  products,
  stats
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    tags: true,
    availability: true,
  });

  // Extract filter options from products and stats
  const filterOptions = useMemo(() => {
    const categories = new Map<string, number>();
    const tags = new Map<string, number>();

    products.forEach(product => {
      // Count categories
      if (product.product_type) {
        categories.set(
          product.product_type,
          (categories.get(product.product_type) || 0) + 1
        );
      }

      // Count tags
      product.tags.forEach(tag => {
        const normalizedTag = tag.toLowerCase();
        if (!normalizedTag.includes('featured') && !normalizedTag.includes('sale')) {
          tags.set(tag, (tags.get(tag) || 0) + 1);
        }
      });
    });

    return {
      categories: Array.from(categories.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      tags: Array.from(tags.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15), // Limit to top 15 tags
    };
  }, [products]);

  // Price range for slider
  const priceRange = useMemo(() => {
    if (stats) {
      return {
        min: Math.floor(stats.priceRange.min / 50) * 50, // Round down to nearest 50
        max: Math.ceil(stats.priceRange.max / 50) * 50,  // Round up to nearest 50
      };
    }

    // Fallback if no stats
    const prices = products.flatMap(p =>
      p.variants.map(v => v.price).filter(p => p > 0)
    );

    if (prices.length === 0) {
      return { min: 0, max: 2000 };
    }

    return {
      min: Math.floor(Math.min(...prices) / 50) * 50,
      max: Math.ceil(Math.max(...prices) / 50) * 50,
    };
  }, [products, stats]);

  // Toggle section expansion
  const toggleSection = useCallback((section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // Handle category filter
  const handleCategoryChange = useCallback((category: string) => {
    const isSelected = searchParams.category === category;
    onFilterChange({
      category: isSelected ? undefined : category
    });
  }, [searchParams.category, onFilterChange]);

  // Handle tag filter
  const handleTagChange = useCallback((tag: string) => {
    const currentTags = searchParams.tags || [];
    const isSelected = currentTags.includes(tag);

    const newTags = isSelected
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];

    onFilterChange({
      tags: newTags.length > 0 ? newTags : undefined
    });
  }, [searchParams.tags, onFilterChange]);

  // Handle price range filter
  const handlePriceChange = useCallback((min?: number, max?: number) => {
    onFilterChange({
      priceMin: min && min > priceRange.min ? min : undefined,
      priceMax: max && max < priceRange.max ? max : undefined,
    });
  }, [onFilterChange, priceRange]);

  // Handle availability filters
  const handleAvailabilityChange = useCallback((key: 'inStock' | 'featured', value: boolean) => {
    onFilterChange({
      [key]: value || undefined
    });
  }, [onFilterChange]);

  const FilterSection = ({
    title,
    sectionKey,
    children
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="border-b border-pg-border last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-4 text-left hover:bg-pg-offwhite px-2 -mx-2 rounded transition-colors"
          aria-expanded={isExpanded}
        >
          <h3 className="text-body-m font-semibold text-pg-dark">{title}</h3>
          <motion.svg
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 text-pg-gray"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pb-4">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const FilterCheckbox = ({
    label,
    count,
    checked,
    onChange
  }: {
    label: string;
    count?: number;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) => (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:bg-pg-offwhite px-2 -mx-2 rounded transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 text-pg-navy border-pg-border rounded focus:ring-pg-sky focus:ring-2"
      />
      <span className="flex-1 text-body-s text-pg-dark">{label}</span>
      {count !== undefined && (
        <span className="text-micro text-pg-gray">({count})</span>
      )}
    </label>
  );

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h3">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-body-s text-pg-navy hover:text-pg-dark transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Category Filter */}
      <FilterSection title="Category" sectionKey="category">
        <div className="space-y-1">
          {filterOptions.categories.map(category => (
            <FilterCheckbox
              key={category.name}
              label={category.name}
              count={category.count}
              checked={searchParams.category === category.name}
              onChange={() => handleCategoryChange(category.name)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Price Range" sectionKey="price">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-micro text-pg-gray mb-1">MIN</label>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                value={searchParams.priceMin || priceRange.min}
                onChange={(e) => handlePriceChange(
                  e.target.value ? parseInt(e.target.value) : undefined,
                  searchParams.priceMax
                )}
                className="w-full px-3 py-2 border border-pg-border rounded text-body-s"
                placeholder={priceRange.min.toString()}
              />
            </div>
            <div className="text-pg-gray">—</div>
            <div className="flex-1">
              <label className="block text-micro text-pg-gray mb-1">MAX</label>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                value={searchParams.priceMax || priceRange.max}
                onChange={(e) => handlePriceChange(
                  searchParams.priceMin,
                  e.target.value ? parseInt(e.target.value) : undefined
                )}
                className="w-full px-3 py-2 border border-pg-border rounded text-body-s"
                placeholder={priceRange.max.toString()}
              />
            </div>
          </div>

          <div className="text-micro text-pg-gray">
            Range: {formatCADPrice(priceRange.min)} - {formatCADPrice(priceRange.max)}
          </div>

          {/* Quick Price Filters */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { label: 'Under $500', max: 500 },
              { label: '$500-$1000', min: 500, max: 1000 },
              { label: '$1000+', min: 1000 },
            ].map(filter => (
              <button
                key={filter.label}
                onClick={() => handlePriceChange(filter.min, filter.max)}
                className={`filter-button text-xs px-3 py-1 ${
                  (searchParams.priceMin === filter.min && searchParams.priceMax === filter.max)
                    ? 'filter-button--active'
                    : ''
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Style Tags Filter */}
      <FilterSection title="Style & Features" sectionKey="tags">
        <div className="space-y-1">
          {filterOptions.tags.map(tag => (
            <FilterCheckbox
              key={tag.name}
              label={tag.name}
              count={tag.count}
              checked={searchParams.tags?.includes(tag.name) || false}
              onChange={() => handleTagChange(tag.name)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Availability Filter */}
      <FilterSection title="Availability" sectionKey="availability">
        <div className="space-y-1">
          <FilterCheckbox
            label="In Stock Only"
            checked={searchParams.inStock || false}
            onChange={(checked) => handleAvailabilityChange('inStock', checked)}
          />
          <FilterCheckbox
            label="Featured Products"
            checked={searchParams.featured || false}
            onChange={(checked) => handleAvailabilityChange('featured', checked)}
          />
        </div>
      </FilterSection>

      {/* Active Filters Summary */}
      {(searchParams.category || searchParams.tags?.length || searchParams.priceMin || searchParams.priceMax || searchParams.inStock || searchParams.featured) && (
        <div className="mt-6 p-4 bg-pg-offwhite rounded-lg">
          <h4 className="text-body-s font-semibold text-pg-dark mb-2">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {searchParams.category && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-pg-navy text-white text-xs rounded">
                {searchParams.category}
                <button
                  onClick={() => handleCategoryChange(searchParams.category!)}
                  className="ml-1 hover:bg-white hover:bg-opacity-20 rounded"
                >
                  ×
                </button>
              </span>
            )}

            {searchParams.tags?.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-pg-sky text-white text-xs rounded">
                {tag}
                <button
                  onClick={() => handleTagChange(tag)}
                  className="ml-1 hover:bg-white hover:bg-opacity-20 rounded"
                >
                  ×
                </button>
              </span>
            ))}

            {(searchParams.priceMin || searchParams.priceMax) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded">
                {searchParams.priceMin && searchParams.priceMax
                  ? `${formatCADPrice(searchParams.priceMin)} - ${formatCADPrice(searchParams.priceMax)}`
                  : searchParams.priceMin
                  ? `Over ${formatCADPrice(searchParams.priceMin)}`
                  : `Under ${formatCADPrice(searchParams.priceMax!)}`
                }
                <button
                  onClick={() => handlePriceChange(undefined, undefined)}
                  className="ml-1 hover:bg-white hover:bg-opacity-20 rounded"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}