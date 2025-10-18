'use client';

import * as React from 'react';
import { ArrowUpDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/**
 * SortOptions Component
 *
 * Dropdown menu for sorting products with:
 * - Multiple sort options (price, name, date, relevance, bestselling)
 * - Active state indication
 * - Keyboard accessible
 * - Mobile responsive
 */

export interface SortOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SortOptionsProps {
  /** Available sort options */
  options: SortOption[];
  /** Current sort value */
  value: string;
  /** Callback when sort changes */
  onChange: (value: string) => void;
  /** Custom className */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost';
}

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { value: 'relevance', label: 'Most Relevant' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'newest', label: 'Newest First' },
  { value: 'bestselling', label: 'Best Selling' },
  { value: 'featured', label: 'Featured' },
];

export function SortOptions({
  options = DEFAULT_SORT_OPTIONS,
  value,
  onChange,
  className,
  variant = 'outline',
}: SortOptionsProps) {
  const currentOption = options.find((opt) => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          className={cn('gap-2', className)}
          aria-label="Sort products"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span className="hidden sm:inline">Sort:</span>
          <span>{currentOption?.label || 'Sort'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {option.icon}
                <span>{option.label}</span>
              </div>
              {value === option.value && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Export default options for reuse
export { DEFAULT_SORT_OPTIONS };
