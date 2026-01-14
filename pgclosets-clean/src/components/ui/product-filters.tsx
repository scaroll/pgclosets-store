"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { FilterOption, PriceRange } from "@/types/product";

interface ProductFilterOption {
  id: string;
  value: string;
  label: string;
  count?: number;
  color?: string;
}

interface ProductPriceRange {
  min: number;
  max: number;
  label: string;
  step?: number;
}

export interface ProductFiltersProps {
  // Categories
  categories?: ProductFilterOption[];
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;

  // Search
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  searchPlaceholder?: string;

  // Price ranges
  priceRanges?: ProductPriceRange[];
  activePriceRange?: string;
  onPriceRangeChange?: (rangeId: string) => void;

  // Materials/Types
  materials?: ProductFilterOption[];
  activeMaterials?: string[];
  onMaterialsChange?: (materialIds: string[]) => void;

  // Sorting
  sortOptions?: ProductFilterOption[];
  activeSort?: string;
  onSortChange?: (sortId: string) => void;

  // Results
  totalResults?: number;
  isLoading?: boolean;

  // Layout
  variant?: "horizontal" | "vertical" | "compact";
  showResultsCount?: boolean;
  showClearAll?: boolean;

  // Callbacks
  onClearAll?: () => void;

  className?: string;
}

// Predefined price ranges for closet doors
const defaultPriceRanges: ProductPriceRange[] = [
  { min: 0, max: 500, label: "Under $500" },
  { min: 500, max: 1000, label: "$500 - $1,000" },
  { min: 1000, max: 1500, label: "$1,000 - $1,500" },
  { min: 1500, max: 99999, label: "Over $1,500" }
];

// Default sort options
const defaultSortOptions: ProductFilterOption[] = [
  { id: "featured", value: "featured", label: "Featured" },
  { id: "price-low", value: "price-low", label: "Price: Low to High" },
  { id: "price-high", value: "price-high", label: "Price: High to Low" },
  { id: "name-asc", value: "name-asc", label: "Name: A to Z" },
  { id: "name-desc", value: "name-desc", label: "Name: Z to A" },
  { id: "newest", value: "newest", label: "Newest First" }
];

function ProductFilters({
  categories = [],
  activeCategory,
  onCategoryChange,
  searchTerm = "",
  onSearchChange,
  searchPlaceholder = "Search doors...",
  priceRanges = defaultPriceRanges,
  activePriceRange,
  onPriceRangeChange,
  materials = [],
  activeMaterials = [],
  onMaterialsChange,
  sortOptions = defaultSortOptions,
  activeSort = "featured",
  onSortChange,
  totalResults = 0,
  isLoading = false,
  variant = "horizontal",
  showResultsCount = true,
  showClearAll = true,
  onClearAll,
  className,
}: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate if any filters are active
  const hasActiveFilters = Boolean(
    activeCategory && activeCategory !== "all" ||
    searchTerm ||
    activePriceRange ||
    activeMaterials.length > 0
  );

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    onCategoryChange?.("all");
    onSearchChange?.("");
    onPriceRangeChange?.("");
    onMaterialsChange?.([]);
    onClearAll?.();
  }, [onCategoryChange, onSearchChange, onPriceRangeChange, onMaterialsChange, onClearAll]);

  // Handle material toggle
  const handleMaterialToggle = useCallback((materialId: string) => {
    const newMaterials = activeMaterials.includes(materialId)
      ? activeMaterials.filter(id => id !== materialId)
      : [...activeMaterials, materialId];
    onMaterialsChange?.(newMaterials);
  }, [activeMaterials, onMaterialsChange]);

  // Format results count
  const resultsText = isLoading
    ? "Loading..."
    : totalResults === 1
    ? "1 door found"
    : `${totalResults} doors found`;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Results Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Search Bar */}
        <div className="relative max-w-md flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-full focus:ring-2 focus:ring-pg-sky focus:border-pg-sky font-light transition-all duration-200 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange?.("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Results Count and Sort */}
        <div className="flex items-center gap-4">
          {showResultsCount && (
            <div className="text-slate-600 font-light text-sm">
              {resultsText}
            </div>
          )}

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => onSortChange?.(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-full px-4 py-2 pr-8 text-sm font-light focus:ring-2 focus:ring-pg-sky focus:border-pg-sky transition-all duration-200"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Filters */}
      <div className={cn(
        "space-y-6",
        variant === "horizontal" && "lg:space-y-0 lg:space-x-8 lg:flex lg:items-start"
      )}>
        {/* Category Filters */}
        {categories.length > 0 && (
          <div className={cn(variant === "horizontal" && "lg:flex-1")}>
            <h3 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wide">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onCategoryChange?.("all")}
                className={cn(
                  "px-4 py-2 rounded-full font-light transition-all duration-200 text-sm",
                  (!activeCategory || activeCategory === "all")
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                All Doors
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange?.(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full font-light transition-all duration-200 text-sm flex items-center gap-2",
                    activeCategory === category.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  <span>{category.label}</span>
                  {category.count !== undefined && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-xs",
                      activeCategory === category.id
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    )}>
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Filters */}
        {priceRanges.length > 0 && (
          <div className={cn(variant === "horizontal" && "lg:flex-1")}>
            <h3 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wide">
              Price Range
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onPriceRangeChange?.("")}
                className={cn(
                  "px-4 py-2 rounded-full font-light transition-all duration-200 text-sm",
                  !activePriceRange
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                Any Price
              </button>
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => onPriceRangeChange?.(index.toString())}
                  className={cn(
                    "px-4 py-2 rounded-full font-light transition-all duration-200 text-sm",
                    activePriceRange === index.toString()
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Material Filters */}
        {materials.length > 0 && (
          <div className={cn(variant === "horizontal" && "lg:flex-1")}>
            <h3 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wide">
              Materials
            </h3>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => handleMaterialToggle(material.id)}
                  className={cn(
                    "px-4 py-2 rounded-full font-light transition-all duration-200 text-sm flex items-center gap-2",
                    activeMaterials.includes(material.id)
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  )}
                >
                  {/* Color indicator if provided */}
                  {material.color && (
                    <div
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: material.color }}
                    />
                  )}
                  <span>{material.label}</span>
                  {material.count !== undefined && (
                    <span className={cn(
                      "px-1.5 py-0.5 rounded-full text-xs",
                      activeMaterials.includes(material.id)
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 text-slate-600"
                    )}>
                      {material.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t border-slate-200 pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-600 font-medium">Active filters:</span>

            {/* Active category */}
            {activeCategory && activeCategory !== "all" && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-sm">
                <span>{categories.find(c => c.id === activeCategory)?.label || activeCategory}</span>
                <button
                  onClick={() => onCategoryChange?.("all")}
                  className="ml-2 hover:text-slate-300 transition-colors"
                  aria-label="Remove category filter"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Active search */}
            {searchTerm && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-sm">
                <span>"{searchTerm}"</span>
                <button
                  onClick={() => onSearchChange?.("")}
                  className="ml-2 hover:text-slate-300 transition-colors"
                  aria-label="Remove search filter"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Active price range */}
            {activePriceRange && (
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-sm">
                <span>{priceRanges[parseInt(activePriceRange)]?.label}</span>
                <button
                  onClick={() => onPriceRangeChange?.("")}
                  className="ml-2 hover:text-slate-300 transition-colors"
                  aria-label="Remove price range filter"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Active materials */}
            {activeMaterials.map((materialId) => {
              const material = materials.find(m => m.id === materialId);
              if (!material) return null;

              return (
                <div key={materialId} className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-sm">
                  <span>{material.label}</span>
                  <button
                    onClick={() => handleMaterialToggle(materialId)}
                    className="ml-2 hover:text-slate-300 transition-colors"
                    aria-label={`Remove ${material.label} filter`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}

            {/* Clear all button */}
            {showClearAll && (
              <button
                onClick={handleClearAll}
                className="text-sm text-slate-500 hover:text-slate-700 font-light underline transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { ProductFilters };