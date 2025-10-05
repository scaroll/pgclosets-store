'use client';

import * as React from 'react';
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/**
 * AdvancedFilters Component
 *
 * Comprehensive filtering system with:
 * - Multi-select filters (type, style, color, size)
 * - Price range slider
 * - Sort options
 * - Active filter badges
 * - Clear all functionality
 * - Mobile responsive with Sheet drawer
 * - Keyboard accessible
 */

export interface FilterValues {
  types: string[];
  styles: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
  materials: string[];
  features: string[];
  inStock?: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

interface AdvancedFiltersProps {
  /** Current filter values */
  filters: FilterValues;
  /** Available filter options */
  options: {
    types: string[];
    styles: string[];
    colors: string[];
    sizes: string[];
    materials: string[];
    features: string[];
  };
  /** Price range bounds */
  priceRange: { min: number; max: number };
  /** Sort options */
  sortOptions: SortOption[];
  /** Current sort value */
  currentSort: string;
  /** Callback when filters change */
  onFilterChange: (filters: FilterValues) => void;
  /** Callback when sort changes */
  onSortChange: (sort: string) => void;
  /** Show as mobile sheet */
  isMobile?: boolean;
  /** Custom className */
  className?: string;
}

export function AdvancedFilters({
  filters,
  options,
  priceRange,
  sortOptions,
  currentSort,
  onFilterChange,
  onSortChange,
  isMobile = false,
  className,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Calculate active filter count
  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    count += filters.types.length;
    count += filters.styles.length;
    count += filters.colors.length;
    count += filters.sizes.length;
    count += filters.materials.length;
    count += filters.features.length;
    if (
      filters.priceRange[0] !== priceRange.min ||
      filters.priceRange[1] !== priceRange.max
    ) {
      count += 1;
    }
    if (filters.inStock) {
      count += 1;
    }
    return count;
  }, [filters, priceRange]);

  // Handle multi-select toggle
  const handleMultiSelectToggle = (
    category: keyof Pick<
      FilterValues,
      'types' | 'styles' | 'colors' | 'sizes' | 'materials' | 'features'
    >,
    value: string
  ) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

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

  // Handle in-stock toggle
  const handleInStockToggle = () => {
    onFilterChange({
      ...filters,
      inStock: !filters.inStock,
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    onFilterChange({
      types: [],
      styles: [],
      colors: [],
      sizes: [],
      priceRange: [priceRange.min, priceRange.max],
      materials: [],
      features: [],
      inStock: undefined,
    });
  };

  // Remove individual filter
  const handleRemoveFilter = (
    category: keyof FilterValues,
    value?: string
  ) => {
    if (category === 'priceRange') {
      onFilterChange({
        ...filters,
        priceRange: [priceRange.min, priceRange.max],
      });
    } else if (category === 'inStock') {
      onFilterChange({
        ...filters,
        inStock: undefined,
      });
    } else if (value) {
      const currentValues = filters[category] as string[];
      onFilterChange({
        ...filters,
        [category]: currentValues.filter((v) => v !== value),
      });
    }
  };

  // Filter content component
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Active Filters</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-7 text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {/* Type badges */}
            {filters.types.map((type) => (
              <Badge key={type} variant="secondary" className="gap-1">
                {type}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter('types', type)}
                />
              </Badge>
            ))}
            {/* Style badges */}
            {filters.styles.map((style) => (
              <Badge key={style} variant="secondary" className="gap-1">
                {style}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter('styles', style)}
                />
              </Badge>
            ))}
            {/* Color badges */}
            {filters.colors.map((color) => (
              <Badge key={color} variant="secondary" className="gap-1">
                {color}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter('colors', color)}
                />
              </Badge>
            ))}
            {/* Size badges */}
            {filters.sizes.map((size) => (
              <Badge key={size} variant="secondary" className="gap-1">
                {size}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter('sizes', size)}
                />
              </Badge>
            ))}
            {/* Material badges */}
            {filters.materials.map((material) => (
              <Badge key={material} variant="secondary" className="gap-1">
                {material}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter('materials', material)}
                />
              </Badge>
            ))}
            {/* Feature badges */}
            {filters.features.map((feature) => (
              <Badge key={feature} variant="secondary" className="gap-1">
                {feature}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter('features', feature)}
                />
              </Badge>
            ))}
            {/* Price range badge */}
            {(filters.priceRange[0] !== priceRange.min ||
              filters.priceRange[1] !== priceRange.max) && (
              <Badge variant="secondary" className="gap-1">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter('priceRange')}
                />
              </Badge>
            )}
            {/* In stock badge */}
            {filters.inStock && (
              <Badge variant="secondary" className="gap-1">
                In Stock
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveFilter('inStock')}
                />
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Filter Accordion */}
      <Accordion
        type="multiple"
        defaultValue={['type', 'style', 'price', 'color', 'availability']}
      >
        {/* Door Type Filter */}
        {options.types.length > 0 && (
          <AccordionItem value="type">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <span>Door Type</span>
                {filters.types.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.types.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {options.types.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={filters.types.includes(type)}
                      onCheckedChange={() =>
                        handleMultiSelectToggle('types', type)
                      }
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Style Filter */}
        {options.styles.length > 0 && (
          <AccordionItem value="style">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <span>Style</span>
                {filters.styles.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.styles.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {options.styles.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${style}`}
                      checked={filters.styles.includes(style)}
                      onCheckedChange={() =>
                        handleMultiSelectToggle('styles', style)
                      }
                    />
                    <Label
                      htmlFor={`style-${style}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4">
              <span>Price Range</span>
              {(filters.priceRange[0] !== priceRange.min ||
                filters.priceRange[1] !== priceRange.max) && (
                <span className="text-xs text-muted-foreground">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                min={priceRange.min}
                max={priceRange.max}
                step={50}
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        {options.colors.length > 0 && (
          <AccordionItem value="color">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <span>Color/Finish</span>
                {filters.colors.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.colors.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {options.colors.map((color) => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={`color-${color}`}
                      checked={filters.colors.includes(color)}
                      onCheckedChange={() =>
                        handleMultiSelectToggle('colors', color)
                      }
                    />
                    <Label
                      htmlFor={`color-${color}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Size Filter */}
        {options.sizes.length > 0 && (
          <AccordionItem value="size">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <span>Size</span>
                {filters.sizes.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.sizes.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {options.sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={filters.sizes.includes(size)}
                      onCheckedChange={() =>
                        handleMultiSelectToggle('sizes', size)
                      }
                    />
                    <Label
                      htmlFor={`size-${size}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Material Filter */}
        {options.materials.length > 0 && (
          <AccordionItem value="material">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <span>Material</span>
                {filters.materials.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.materials.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {options.materials.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={`material-${material}`}
                      checked={filters.materials.includes(material)}
                      onCheckedChange={() =>
                        handleMultiSelectToggle('materials', material)
                      }
                    />
                    <Label
                      htmlFor={`material-${material}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {material}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Features Filter */}
        {options.features.length > 0 && (
          <AccordionItem value="features">
            <AccordionTrigger>
              <div className="flex items-center justify-between w-full pr-4">
                <span>Features</span>
                {filters.features.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.features.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {options.features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature}`}
                      checked={filters.features.includes(feature)}
                      onCheckedChange={() =>
                        handleMultiSelectToggle('features', feature)
                      }
                    />
                    <Label
                      htmlFor={`feature-${feature}`}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {feature}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Availability Filter */}
        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={filters.inStock || false}
                onCheckedChange={handleInStockToggle}
              />
              <Label
                htmlFor="in-stock"
                className="text-sm font-normal cursor-pointer"
              >
                In Stock Only
              </Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // Mobile Sheet View
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
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

  // Desktop Sidebar View
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <Badge variant="secondary">{activeFilterCount} active</Badge>
        )}
      </div>
      <FilterContent />
    </div>
  );
}
