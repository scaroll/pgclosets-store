"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Package,
  Tag
} from 'lucide-react';
import {
  colors,
  spacing,
  shadows,
  radius,
  typography
} from '@/lib/design-tokens';

interface FilterSidebarProps {
  filters: {
    categories: string[];
    priceRange: { min: number; max: number };
    styles: string[];
    inStock: boolean;
    onSale: boolean;
  };
  onChange: (filters: any) => void;
  productCount: number;
}

interface FilterSection {
  id: string;
  title: string;
  icon?: React.ReactNode;
}

const CATEGORIES = [
  { value: 'barn-doors', label: 'Barn Doors', count: 45 },
  { value: 'bifold-doors', label: 'Bifold Doors', count: 32 },
  { value: 'bypass-doors', label: 'Bypass Doors', count: 28 },
  { value: 'pivot-doors', label: 'Pivot Doors', count: 19 },
  { value: 'room-dividers', label: 'Room Dividers', count: 24 },
  { value: 'hardware', label: 'Hardware', count: 67 },
  { value: 'mirrors', label: 'Mirror Doors', count: 15 },
];

const STYLES = [
  { value: 'modern', label: 'Modern', count: 78 },
  { value: 'traditional', label: 'Traditional', count: 45 },
  { value: 'contemporary', label: 'Contemporary', count: 62 },
  { value: 'rustic', label: 'Rustic', count: 23 },
  { value: 'industrial', label: 'Industrial', count: 19 },
  { value: 'minimalist', label: 'Minimalist', count: 34 },
];

const PRICE_RANGES = [
  { min: 0, max: 300, label: 'Under $300' },
  { min: 300, max: 500, label: '$300 - $500' },
  { min: 500, max: 700, label: '$500 - $700' },
  { min: 700, max: 1000, label: '$700 - $1,000' },
  { min: 1000, max: 5000, label: 'Over $1,000' },
];

export function FilterSidebar({
  filters,
  onChange,
  productCount
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'categories',
    'price',
    'style',
    'availability'
  ]);
  const [priceSliderValue, setPriceSliderValue] = useState([
    filters.priceRange.min,
    filters.priceRange.max
  ]);

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onChange({ ...filters, categories: newCategories });
  };

  // Handle style change
  const handleStyleChange = (style: string) => {
    const newStyles = filters.styles.includes(style)
      ? filters.styles.filter(s => s !== style)
      : [...filters.styles, style];
    onChange({ ...filters, styles: newStyles });
  };

  // Handle price range change
  const handlePriceRangeSelect = (min: number, max: number) => {
    setPriceSliderValue([min, max]);
    onChange({ ...filters, priceRange: { min, max } });
  };

  // Handle price slider change
  const handlePriceSliderChange = (values: number[]) => {
    setPriceSliderValue(values);
    onChange({ ...filters, priceRange: { min: values[0], max: values[1] } });
  };

  // Clear all filters
  const clearAllFilters = () => {
    onChange({
      categories: [],
      priceRange: { min: 0, max: 5000 },
      styles: [],
      inStock: false,
      onSale: false,
    });
    setPriceSliderValue([0, 5000]);
  };

  // Count active filters
  const activeFilterCount =
    filters.categories.length +
    filters.styles.length +
    (filters.inStock ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.priceRange.min > 0 || filters.priceRange.max < 5000 ? 1 : 0);

  return (
    <div
      className="bg-white rounded-xl p-6"
      style={{
        boxShadow: shadows.sm,
        borderRadius: radius.xl,
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={20} style={{ color: colors.gray[700] }} />
            <h2 className="text-lg font-semibold" style={{ color: colors.gray[900] }}>
              Filters
            </h2>
            {activeFilterCount > 0 && (
              <span
                className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full"
              >
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm font-medium hover:underline"
              style={{ color: colors.brand.navy }}
            >
              Clear all
            </button>
          )}
        </div>
        <div className="text-sm" style={{ color: colors.gray[600] }}>
          Showing {productCount} products
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="mb-6 pb-6 border-b" style={{ borderColor: colors.gray[200] }}>
          <div className="flex flex-wrap gap-2">
            {filters.categories.map(category => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handleCategoryChange(category)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-100"
              >
                {CATEGORIES.find(c => c.value === category)?.label}
                <X size={14} />
              </motion.button>
            ))}
            {filters.styles.map(style => (
              <motion.button
                key={style}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handleStyleChange(style)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-100"
              >
                {STYLES.find(s => s.value === style)?.label}
                <X size={14} />
              </motion.button>
            ))}
            {(filters.priceRange.min > 0 || filters.priceRange.max < 5000) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => handlePriceRangeSelect(0, 5000)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium hover:bg-green-100"
              >
                ${filters.priceRange.min} - ${filters.priceRange.max}
                <X size={14} />
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <h3 className="font-medium" style={{ color: colors.gray[900] }}>
              Categories
            </h3>
            {expandedSections.includes('categories') ? (
              <ChevronUp size={20} style={{ color: colors.gray[500] }} />
            ) : (
              <ChevronDown size={20} style={{ color: colors.gray[500] }} />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.includes('categories') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {CATEGORIES.map(category => (
                  <label
                    key={category.value}
                    className="flex items-center justify-between py-1 cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category.value)}
                        onChange={() => handleCategoryChange(category.value)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm" style={{ color: colors.gray[700] }}>
                        {category.label}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: colors.gray[500] }}>
                      ({category.count})
                    </span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <h3 className="font-medium" style={{ color: colors.gray[900] }}>
              Price Range
            </h3>
            {expandedSections.includes('price') ? (
              <ChevronUp size={20} style={{ color: colors.gray[500] }} />
            ) : (
              <ChevronDown size={20} style={{ color: colors.gray[500] }} />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.includes('price') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 space-y-3 overflow-hidden"
              >
                {/* Price range buttons */}
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <button
                      key={`${range.min}-${range.max}`}
                      onClick={() => handlePriceRangeSelect(range.min, range.max)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        filters.priceRange.min === range.min && filters.priceRange.max === range.max
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                      style={{
                        color: filters.priceRange.min === range.min && filters.priceRange.max === range.max
                          ? undefined
                          : colors.gray[700]
                      }}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>

                {/* Custom range inputs */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="number"
                    min="0"
                    max={priceSliderValue[1]}
                    value={priceSliderValue[0]}
                    onChange={(e) => handlePriceSliderChange([parseInt(e.target.value), priceSliderValue[1]])}
                    className="w-full px-2 py-1 text-sm border rounded-lg"
                    style={{ borderColor: colors.gray[300] }}
                    placeholder="Min"
                  />
                  <span style={{ color: colors.gray[500] }}>-</span>
                  <input
                    type="number"
                    min={priceSliderValue[0]}
                    max="5000"
                    value={priceSliderValue[1]}
                    onChange={(e) => handlePriceSliderChange([priceSliderValue[0], parseInt(e.target.value)])}
                    className="w-full px-2 py-1 text-sm border rounded-lg"
                    style={{ borderColor: colors.gray[300] }}
                    placeholder="Max"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Style */}
        <div>
          <button
            onClick={() => toggleSection('style')}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <h3 className="font-medium" style={{ color: colors.gray[900] }}>
              Style
            </h3>
            {expandedSections.includes('style') ? (
              <ChevronUp size={20} style={{ color: colors.gray[500] }} />
            ) : (
              <ChevronDown size={20} style={{ color: colors.gray[500] }} />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.includes('style') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 space-y-2 overflow-hidden"
              >
                {STYLES.map(style => (
                  <label
                    key={style.value}
                    className="flex items-center justify-between py-1 cursor-pointer hover:text-purple-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={filters.styles.includes(style.value)}
                        onChange={() => handleStyleChange(style.value)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm" style={{ color: colors.gray[700] }}>
                        {style.label}
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: colors.gray[500] }}>
                      ({style.count})
                    </span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Availability */}
        <div>
          <button
            onClick={() => toggleSection('availability')}
            className="w-full flex items-center justify-between py-2 text-left"
          >
            <h3 className="font-medium" style={{ color: colors.gray[900] }}>
              Availability
            </h3>
            {expandedSections.includes('availability') ? (
              <ChevronUp size={20} style={{ color: colors.gray[500] }} />
            ) : (
              <ChevronDown size={20} style={{ color: colors.gray[500] }} />
            )}
          </button>
          <AnimatePresence>
            {expandedSections.includes('availability') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 space-y-3 overflow-hidden"
              >
                <label className="flex items-center gap-3 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => onChange({ ...filters, inStock: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center gap-2">
                    <Package size={16} style={{ color: colors.semantic.success.DEFAULT }} />
                    <span className="text-sm" style={{ color: colors.gray[700] }}>
                      In Stock Only
                    </span>
                  </div>
                </label>
                <label className="flex items-center gap-3 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => onChange({ ...filters, onSale: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center gap-2">
                    <Tag size={16} style={{ color: colors.semantic.error.DEFAULT }} />
                    <span className="text-sm" style={{ color: colors.gray[700] }}>
                      On Sale
                    </span>
                  </div>
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}