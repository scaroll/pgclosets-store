"use client";

import * as React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Filter types and interfaces
export interface FilterValues {
  priceRange: [number, number];
  finishes: string[];
  widthRange: [number, number];
  heightRange: [number, number];
  features: string[];
}

export interface FilterProps {
  /** Current filter values */
  filters: FilterValues;
  /** Callback when filters change */
  onFilterChange: (filters: FilterValues) => void;
  /** Minimum price for the price range slider */
  minPrice?: number;
  /** Maximum price for the price range slider */
  maxPrice?: number;
  /** Minimum width */
  minWidth?: number;
  /** Maximum width */
  maxWidth?: number;
  /** Minimum height */
  minHeight?: number;
  /** Maximum height */
  maxHeight?: number;
  /** Available finish options from products */
  availableFinishes?: Array<{ id: string; name: string; color: string }>;
  /** Available features from products */
  availableFeatures?: string[];
  /** Custom className for the filter container */
  className?: string;
  /** Show filters in mobile sheet mode */
  isMobileSheet?: boolean;
  /** Mobile sheet open state */
  isOpen?: boolean;
  /** Mobile sheet close handler */
  onClose?: () => void;
}

/**
 * ProductFilters Component
 *
 * A comprehensive filtering component for product catalogs with:
 * - Accordion-based filter categories
 * - Multi-select checkboxes for categorical filters
 * - Price range slider
 * - Size range filters (width/height)
 * - Finish/color selection with color swatches
 * - Feature toggles
 * - Active filter count badge
 * - Clear all filters functionality
 * - Mobile responsive with Sheet drawer
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<FilterValues>({
 *   priceRange: [0, 100000],
 *   finishes: [],
 *   widthRange: [30, 48],
 *   heightRange: [80, 96],
 *   features: [],
 * });
 *
 * <ProductFilters
 *   filters={filters}
 *   onFilterChange={setFilters}
 *   minPrice={0}
 *   maxPrice={100000}
 *   availableFinishes={finishes}
 *   availableFeatures={features}
 * />
 * ```
 */
export function ProductFilters({
  filters,
  onFilterChange,
  minPrice = 0,
  maxPrice = 100000,
  minWidth = 24,
  maxWidth = 96,
  minHeight = 60,
  maxHeight = 120,
  availableFinishes = [],
  availableFeatures = [],
  className,
  isMobileSheet = false,
  isOpen = false,
  onClose,
}: FilterProps) {
  // Calculate active filter count
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    count += filters.finishes.length;
    count += filters.features.length;
    // Count price range as active if it's not the full range
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) {
      count += 1;
    }
    // Count width range as active if it's not the full range
    if (filters.widthRange[0] !== minWidth || filters.widthRange[1] !== maxWidth) {
      count += 1;
    }
    // Count height range as active if it's not the full range
    if (filters.heightRange[0] !== minHeight || filters.heightRange[1] !== maxHeight) {
      count += 1;
    }
    return count;
  }, [filters, minPrice, maxPrice, minWidth, maxWidth, minHeight, maxHeight]);

  // Handle checkbox toggle
  const handleCheckboxChange = (
    category: keyof Pick<FilterValues, "finishes" | "features">,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[category];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFilterChange({
      ...filters,
      [category]: newValues,
    });
  };

  // Handle price range change
  const handlePriceChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  // Handle width range change
  const handleWidthChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      widthRange: [value[0], value[1]],
    });
  };

  // Handle height range change
  const handleHeightChange = (value: number[]) => {
    onFilterChange({
      ...filters,
      heightRange: [value[0], value[1]],
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      finishes: [],
      widthRange: [minWidth, maxWidth],
      heightRange: [minHeight, maxHeight],
      features: [],
    });
  };

  // Check if filters are empty
  const hasActiveFilters = activeFilterCount > 0;

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(price / 100);
  };

  // Filter content component (reused for both desktop and mobile)
  const FilterContent = () => (
    <div className={cn("space-y-4", className)}>
      {/* Header with active count and clear button */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 text-xs font-medium text-white bg-black rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Accordion */}
      <Accordion type="multiple" defaultValue={["price", "finish", "size", "features"]}>
        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
              <span>Price Range</span>
              {(filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) && (
                <span className="text-xs text-muted-foreground">
                  {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1000}
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Finish/Color Filter */}
        {availableFinishes.length > 0 && (
          <AccordionItem value="finish">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <span>Finish/Color</span>
                {filters.finishes.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({filters.finishes.length})
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {availableFinishes.map((finish) => (
                  <div key={finish.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`finish-${finish.id}`}
                      checked={filters.finishes.includes(finish.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("finishes", finish.id, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`finish-${finish.id}`}
                      className="text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-slate-200 shadow-sm"
                        style={{ backgroundColor: finish.color }}
                      />
                      {finish.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Size Range Filter */}
        <AccordionItem value="size">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
              <span>Size Range</span>
              {(filters.widthRange[0] !== minWidth || filters.widthRange[1] !== maxWidth ||
                filters.heightRange[0] !== minHeight || filters.heightRange[1] !== maxHeight) && (
                <span className="text-xs text-muted-foreground">Custom</span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 px-1">
              {/* Width Range */}
              <div className="space-y-3">
                <Label className="text-xs font-medium">Width (inches)</Label>
                <Slider
                  min={minWidth}
                  max={maxWidth}
                  step={1}
                  value={filters.widthRange}
                  onValueChange={handleWidthChange}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{filters.widthRange[0]}"</span>
                  <span>{filters.widthRange[1]}"</span>
                </div>
              </div>

              {/* Height Range */}
              <div className="space-y-3">
                <Label className="text-xs font-medium">Height (inches)</Label>
                <Slider
                  min={minHeight}
                  max={maxHeight}
                  step={1}
                  value={filters.heightRange}
                  onValueChange={handleHeightChange}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{filters.heightRange[0]}"</span>
                  <span>{filters.heightRange[1]}"</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Features Filter */}
        {availableFeatures.length > 0 && (
          <AccordionItem value="features">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <span>Features</span>
                {filters.features.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({filters.features.length})
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {availableFeatures.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange("features", feature, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`feature-${feature}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );

  // Mobile Sheet View
  if (isMobileSheet) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop View
  return <FilterContent />;
}
