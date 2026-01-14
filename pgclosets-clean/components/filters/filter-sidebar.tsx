"use client";

import { useState, useEffect } from 'react';
import { X, Filter, SlidersHorizontal, Menu } from 'lucide-react';
import { SearchFilters } from '@/lib/search-utils';
import { ReninProduct } from '@/lib/renin-product-loader';
import { ProductFilters } from './product-filters';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  products: ReninProduct[];
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  resultCount?: number;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
}

export function FilterSidebar({
  products,
  filters,
  onFiltersChange,
  resultCount = 0,
  isOpen = false,
  onToggle,
  className,
}: FilterSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && isMobile && onToggle) {
        onToggle(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, isMobile, onToggle]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  // Check if any filters are active
  const hasActiveFilters = filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.inStock;

  const activeFilterCount = filters.categories.length +
    filters.tags.length +
    (filters.inStock ? 1 : 0);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  // Mobile Filter Toggle Button
  const FilterToggleButton = () => (
    <button
      onClick={() => onToggle?.(!isOpen)}
      className={cn(
        "lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors",
        hasActiveFilters && "border-slate-900"
      )}
      aria-label="Toggle filters"
    >
      <SlidersHorizontal className="w-4 h-4" />
      <span className="font-medium">Filters</span>
      {activeFilterCount > 0 && (
        <div className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
          {activeFilterCount}
        </div>
      )}
    </button>
  );

  // Mobile Results Summary
  const ResultsSummary = () => (
    <div className="lg:hidden flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
      <div className="text-sm text-slate-600">
        {resultCount} {resultCount === 1 ? 'result' : 'results'} found
      </div>
      <FilterToggleButton />
    </div>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className={cn("hidden lg:block", className)}>
      <div className="sticky top-6">
        <ProductFilters
          products={products}
          filters={filters}
          onFiltersChange={onFiltersChange}
          resultCount={resultCount}
          showResultCount={true}
        />
      </div>
    </div>
  );

  // Mobile Sidebar Overlay
  const MobileSidebar = () => (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => onToggle?.(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-xl",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-medium text-slate-900">Filters</h2>
            {activeFilterCount > 0 && (
              <div className="bg-slate-900 text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                {activeFilterCount}
              </div>
            )}
          </div>
          <button
            onClick={() => onToggle?.(false)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Count */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
          <div className="text-sm text-slate-600">
            {resultCount} {resultCount === 1 ? 'result' : 'results'} found
          </div>
        </div>

        {/* Scrollable Filter Content */}
        <div className="flex-1 overflow-y-auto">
          <ProductFilters
            products={products}
            filters={filters}
            onFiltersChange={onFiltersChange}
            resultCount={resultCount}
            showResultCount={false}
            className="border-0 rounded-none"
          />
        </div>

        {/* Footer with Apply Button */}
        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="flex gap-3">
            <button
              onClick={() => onToggle?.(false)}
              className="flex-1 px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              Show Results ({resultCount})
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Quick Filters Bar (Mobile)
  const QuickFiltersBar = () => (
    <div className="lg:hidden px-4 py-3 border-b border-slate-200 bg-white">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
        <FilterToggleButton />

        {/* Quick filter chips */}
        <div className="flex gap-2 min-w-0">
          {hasActiveFilters && (
            <>
              {filters.categories.slice(0, 2).map(category => (
                <div
                  key={category}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-900 text-white text-xs rounded-full whitespace-nowrap"
                >
                  <span>{category}</span>
                  <button
                    onClick={() => {
                      const newCategories = filters.categories.filter(c => c !== category);
                      onFiltersChange({ ...filters, categories: newCategories });
                    }}
                    className="hover:text-slate-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {filters.inStock && (
                <div className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-full whitespace-nowrap">
                  <span>In Stock</span>
                  <button
                    onClick={() => onFiltersChange({ ...filters, inStock: false })}
                    className="hover:text-green-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {(filters.categories.length > 2 || filters.tags.length > 0) && (
                <div className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded-full whitespace-nowrap">
                  +{(filters.categories.length > 2 ? filters.categories.length - 2 : 0) + filters.tags.length} more
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Components */}
      <ResultsSummary />
      <QuickFiltersBar />
      <MobileSidebar />

      {/* Desktop Sidebar */}
      <DesktopSidebar />
    </>
  );
}

// Hook for managing filter sidebar state
export function useFilterSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (open?: boolean) => {
    setIsOpen(open !== undefined ? open : !isOpen);
  };

  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  return {
    isOpen,
    toggle,
    close,
    open,
  };
}