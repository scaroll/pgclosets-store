'use client'

import React, { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DoorType, StyleType, FrameMaterial, FinishType, GlazingType } from '@/types/product-enhanced'
import { getReninFilterOptions, filterReninProducts } from '@/lib/renin-catalog'

interface EnhancedProductFilterProps {
  onFilterChange?: (filters: any) => void
  className?: string
  mobile?: boolean
  initialFilters?: {
    category?: string
    type?: string
    style?: string
    frame?: string
    finish?: string
    glazing?: string
    minPrice?: number
    maxPrice?: number
    inStockOnly?: boolean
    canadianMadeOnly?: boolean
  }
}

export function EnhancedProductFilter({
  onFilterChange,
  className = '',
  mobile = false,
  initialFilters = {}
}: EnhancedProductFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isExpanded, setIsExpanded] = useState(!mobile)
  const [filters, setFilters] = useState({
    category: initialFilters.category || searchParams.get('category') || '',
    type: initialFilters.type || searchParams.get('type') || '',
    style: initialFilters.style || searchParams.get('style') || '',
    frame: initialFilters.frame || searchParams.get('frame') || '',
    finish: initialFilters.finish || searchParams.get('finish') || '',
    glazing: initialFilters.glazing || searchParams.get('glazing') || '',
    minPrice: initialFilters.minPrice || Number(searchParams.get('minPrice')) || '',
    maxPrice: initialFilters.maxPrice || Number(searchParams.get('maxPrice')) || '',
    inStockOnly: initialFilters.inStockOnly || searchParams.get('inStockOnly') === 'true',
    canadianMadeOnly: initialFilters.canadianMadeOnly || searchParams.get('canadianMadeOnly') === 'true'
  })

  const filterOptions = getReninFilterOptions()

  const updateFilter = useCallback((key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)

    // Update URL
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== '') {
      params.set(key, value.toString())
    } else {
      params.delete(key)
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`
    router.push(newUrl, { scroll: false })
  }, [filters, searchParams, router, onFilterChange])

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      category: '',
      type: '',
      style: '',
      frame: '',
      finish: '',
      glazing: '',
      minPrice: '',
      maxPrice: '',
      inStockOnly: false,
      canadianMadeOnly: false
    }
    setFilters(clearedFilters)
    onFilterChange?.(clearedFilters)

    // Clear URL params
    router.push(window.location.pathname, { scroll: false })
  }, [router, onFilterChange])

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== '' && value !== false && value !== 0
  )

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <h3 className="font-semibold text-gray-900 mb-3 text-sm">{title}</h3>
      {children}
    </div>
  )

  const FilterOption = ({
    label,
    value,
    current,
    onChange
  }: {
    label: string;
    value: string;
    current: string;
    onChange: (value: string) => void
  }) => (
    <label className="flex items-center mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
      <input
        type="radio"
        name={`filter-${label}`}
        checked={current === value}
        onChange={() => onChange(value)}
        className="mr-2 text-black focus:ring-black"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )

  const CheckboxOption = ({
    label,
    checked,
    onChange
  }: {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void
  }) => (
    <label className="flex items-center mb-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mr-2 text-black focus:ring-black"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )

  return (
    <div className={`${className} ${mobile ? 'bg-white shadow-lg rounded-lg p-4' : ''}`}>
      {/* Mobile Toggle */}
      {mobile && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="mb-4">
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="space-y-4">
          {/* Categories */}
          <FilterSection title="Categories">
            <FilterOption
              label="All Products"
              value=""
              current={filters.category}
              onChange={(value) => updateFilter('category', value)}
            />
            {filterOptions.categories.map((category) => (
              <FilterOption
                key={category}
                label={category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={category}
                current={filters.category}
                onChange={(value) => updateFilter('category', value)}
              />
            ))}
          </FilterSection>

          {/* Door Types */}
          <FilterSection title="Door Types">
            <FilterOption
              label="All Types"
              value=""
              current={filters.type}
              onChange={(value) => updateFilter('type', value)}
            />
            {['barn', 'bifold', 'bypass', 'pivot', 'closet', 'hardware', 'mirror'].map((type) => (
              <FilterOption
                key={type}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
                value={type}
                current={filters.type}
                onChange={(value) => updateFilter('type', value)}
              />
            ))}
          </FilterSection>

          {/* Styles */}
          <FilterSection title="Styles">
            <FilterOption
              label="All Styles"
              value=""
              current={filters.style}
              onChange={(value) => updateFilter('style', value)}
            />
            {filterOptions.styles.map((style) => (
              <FilterOption
                key={style}
                label={style.charAt(0).toUpperCase() + style.slice(1)}
                value={style}
                current={filters.style}
                onChange={(value) => updateFilter('style', value)}
              />
            ))}
          </FilterSection>

          {/* Materials */}
          <FilterSection title="Materials">
            <FilterOption
              label="All Materials"
              value=""
              current={filters.frame}
              onChange={(value) => updateFilter('frame', value)}
            />
            {filterOptions.frames.map((frame) => (
              <FilterOption
                key={frame}
                label={frame.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={frame}
                current={filters.frame}
                onChange={(value) => updateFilter('frame', value)}
              />
            ))}
          </FilterSection>

          {/* Finishes */}
          <FilterSection title="Finishes">
            <FilterOption
              label="All Finishes"
              value=""
              current={filters.finish}
              onChange={(value) => updateFilter('finish', value)}
            />
            {filterOptions.finishes.map((finish) => (
              <FilterOption
                key={finish}
                label={finish.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                value={finish}
                current={filters.finish}
                onChange={(value) => updateFilter('finish', value)}
              />
            ))}
          </FilterSection>

          {/* Glazing */}
          <FilterSection title="Glass Options">
            <FilterOption
              label="All Glass Types"
              value=""
              current={filters.glazing}
              onChange={(value) => updateFilter('glazing', value)}
            />
            {filterOptions.glazings.map((glazing) => (
              <FilterOption
                key={glazing}
                label={glazing.charAt(0).toUpperCase() + glazing.slice(1)}
                value={glazing}
                current={filters.glazing}
                onChange={(value) => updateFilter('glazing', value)}
              />
            ))}
          </FilterSection>

          {/* Price Range */}
          <FilterSection title="Price Range">
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Min Price (CAD)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Max Price (CAD)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </FilterSection>

          {/* Special Filters */}
          <FilterSection title="Special Filters">
            <CheckboxOption
              label="In Stock Only"
              checked={filters.inStockOnly}
              onChange={(checked) => updateFilter('inStockOnly', checked)}
            />
            <CheckboxOption
              label="Made in Canada Only"
              checked={filters.canadianMadeOnly}
              onChange={(checked) => updateFilter('canadianMadeOnly', checked)}
            />
          </FilterSection>
        </div>
      )}
    </div>
  )
}