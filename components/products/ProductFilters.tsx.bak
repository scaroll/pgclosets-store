"use client";

import * as React from "react";
import { X } from "lucide-react";
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
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Filter types and interfaces
export interface FilterValues {
  styles: string[];
  priceRange: [number, number];
  doorTypes: string[];
  colors: string[];
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
  /** Custom className for the filter container */
  className?: string;
  /** Show filters in mobile sheet mode */
  isMobileSheet?: boolean;
  /** Mobile sheet open state */
  isOpen?: boolean;
  /** Mobile sheet close handler */
  onClose?: () => void;
}

// Filter options configuration
const FILTER_OPTIONS = {
  styles: [
    { id: "modern", label: "Modern" },
    { id: "traditional", label: "Traditional" },
    { id: "transitional", label: "Transitional" },
    { id: "contemporary", label: "Contemporary" },
    { id: "rustic", label: "Rustic" },
  ],
  doorTypes: [
    { id: "sliding", label: "Sliding" },
    { id: "bi-fold", label: "Bi-fold" },
    { id: "french", label: "French" },
    { id: "pocket", label: "Pocket" },
    { id: "hinged", label: "Hinged" },
  ],
  colors: [
    { id: "white", label: "White" },
    { id: "black", label: "Black" },
    { id: "natural-wood", label: "Natural Wood" },
    { id: "espresso", label: "Espresso" },
    { id: "gray", label: "Gray" },
    { id: "walnut", label: "Walnut" },
    { id: "oak", label: "Oak" },
    { id: "mahogany", label: "Mahogany" },
  ],
} as const;

/**
 * ProductFilters Component
 *
 * A comprehensive filtering component for product catalogs with:
 * - Accordion-based filter categories
 * - Multi-select checkboxes for categorical filters
 * - Price range slider
 * - Active filter count badge
 * - Clear all filters functionality
 * - Mobile responsive with Sheet drawer
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = useState<FilterValues>({
 *   styles: [],
 *   priceRange: [0, 10000],
 *   doorTypes: [],
 *   colors: [],
 * });
 *
 * <ProductFilters
 *   filters={filters}
 *   onFilterChange={setFilters}
 *   minPrice={0}
 *   maxPrice={10000}
 * />
 * ```
 */
export function ProductFilters({
  filters,
  onFilterChange,
  minPrice = 0,
  maxPrice = 10000,
  className,
  isMobileSheet = false,
  isOpen = false,
  onClose,
}: FilterProps) {
  // Calculate active filter count
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    count += filters.styles.length;
    count += filters.doorTypes.length;
    count += filters.colors.length;
    // Count price range as active if it's not the full range
    if (filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) {
      count += 1;
    }
    return count;
  }, [filters, minPrice, maxPrice]);

  // Handle checkbox toggle
  const handleCheckboxChange = (
    category: keyof Pick<FilterValues, "styles" | "doorTypes" | "colors">,
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

  // Clear all filters
  const handleClearAll = () => {
    onFilterChange({
      styles: [],
      priceRange: [minPrice, maxPrice],
      doorTypes: [],
      colors: [],
    });
  };

  // Check if filters are empty
  const hasActiveFilters = activeFilterCount > 0;

  // Filter content component (reused for both desktop and mobile)
  const FilterContent = () => (
    <div className={cn("space-y-4", className)}>
      {/* Header with active count and clear button */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
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
      <Accordion type="multiple" defaultValue={["style", "price", "door-type", "color"]}>
        {/* Style Filter */}
        <AccordionItem value="style">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
              <span>Style</span>
              {filters.styles.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({filters.styles.length})
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {FILTER_OPTIONS.styles.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`style-${option.id}`}
                    checked={filters.styles.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("styles", option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`style-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
              <span>Price Range</span>
              {(filters.priceRange[0] !== minPrice || filters.priceRange[1] !== maxPrice) && (
                <span className="text-xs text-muted-foreground">
                  ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                min={minPrice}
                max={maxPrice}
                step={100}
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0].toLocaleString()}</span>
                <span>${filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Door Type Filter */}
        <AccordionItem value="door-type">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
              <span>Door Type</span>
              {filters.doorTypes.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({filters.doorTypes.length})
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {FILTER_OPTIONS.doorTypes.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`door-${option.id}`}
                    checked={filters.doorTypes.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("doorTypes", option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`door-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color/Finish Filter */}
        <AccordionItem value="color">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
              <span>Color/Finish</span>
              {filters.colors.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({filters.colors.length})
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {FILTER_OPTIONS.colors.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${option.id}`}
                    checked={filters.colors.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange("colors", option.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`color-${option.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
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

// Export filter options for external use
export { FILTER_OPTIONS };
