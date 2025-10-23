"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range';
}

interface ProductFiltersProps {
  filters: FilterGroup[];
  activeFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, value: string) => void;
  onClearFilters: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  className?: string;
}

export default function ProductFilter({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  className
}: ProductFiltersProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['style', 'finish']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const hasActiveFilters = Object.values(activeFilters).some(values => values.length > 0);
  const totalActiveFilters = Object.values(activeFilters).reduce((sum, values) => sum + values.length, 0);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  return (
    <div className={cn("bg-white rounded-xl border border-gray-200", className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                {totalActiveFilters} active
              </Badge>
            )}
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-red-600"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden p-4 border-b border-gray-200">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {totalActiveFilters}
              </Badge>
            )}
          </div>
          {isFilterOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filters */}
      <div className={cn("md:block", isFilterOpen ? "block" : "hidden")}>
        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {filters.map((group) => (
            <div key={group.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center justify-between w-full text-left mb-4 hover:text-teal-600 transition-colors"
              >
                <h4 className="font-medium text-gray-900">{group.label}</h4>
                {expandedGroups.includes(group.id) ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedGroups.includes(group.id) && (
                <div className="space-y-3">
                  {group.options.map((option) => {
                    const isActive = activeFilters[group.id]?.includes(option.id);

                    if (group.type === 'radio') {
                      return (
                        <label
                          key={option.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                            isActive
                              ? "border-teal-600 bg-teal-50"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <span className="text-sm font-medium text-gray-900">
                            {option.label}
                          </span>
                          <div className="w-4 h-4 rounded-full border-2 border-current" />
                        </label>
                      );
                    }

                    return (
                      <label
                        key={option.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
                      >
                        <span className="text-sm text-gray-900">{option.label}</span>
                        <div className="flex items-center gap-2">
                          {option.count && (
                            <span className="text-xs text-gray-500">({option.count})</span>
                          )}
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => onFilterChange(group.id, option.id)}
                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort by
        </label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}