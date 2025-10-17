'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AppleButton } from '@/components/ui/AppleButton'
import { EASING } from '@/lib/animations'

/**
 * ProductFilter - Advanced Filtering System
 * Features:
 * - Multi-select filters with checkboxes
 * - Price range slider
 * - Collapsible filter groups
 * - Active filter chips
 * - Clear all functionality
 * - Mobile-responsive drawer
 * - Filter count badges
 * - Animation on open/close
 *
 * @example
 * ```tsx
 * <ProductFilter
 *   filters={{
 *     categories: ['Doors', 'Hardware', 'Accessories'],
 *     colors: ['White', 'Black', 'Natural'],
 *     materials: ['Wood', 'Metal', 'Glass'],
 *     priceRange: { min: 0, max: 10000 }
 *   }}
 *   activeFilters={{
 *     categories: ['Doors'],
 *     priceRange: [1000, 5000]
 *   }}
 *   onChange={(filters) => setFilters(filters)}
 *   onClear={() => clearFilters()}
 * />
 * ```
 */

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  options: FilterOption[]
  type: 'checkbox' | 'radio' | 'range'
}

export interface PriceRange {
  min: number
  max: number
  step?: number
}

export interface ActiveFilters {
  [key: string]: string[] | number[]
}

interface ProductFilterProps {
  filterGroups: FilterGroup[]
  priceRange?: PriceRange
  activeFilters: ActiveFilters
  onChange: (filters: ActiveFilters) => void
  onClear: () => void
  className?: string
  isMobile?: boolean
}

export function ProductFilter({
  filterGroups,
  priceRange,
  activeFilters,
  onChange,
  onClear,
  className,
  isMobile = false
}: ProductFilterProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(filterGroups.map((g) => g.id))
  )
  const [isOpen, setIsOpen] = useState(!isMobile)
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(
    (activeFilters.priceRange as [number, number]) || [
      priceRange?.min || 0,
      priceRange?.max || 10000
    ]
  )

  // Toggle filter group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  // Handle checkbox filter change
  const handleFilterChange = (groupId: string, value: string) => {
    const currentValues = (activeFilters[groupId] as string[]) || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]

    onChange({
      ...activeFilters,
      [groupId]: newValues
    })
  }

  // Handle radio filter change
  const handleRadioChange = (groupId: string, value: string) => {
    onChange({
      ...activeFilters,
      [groupId]: [value]
    })
  }

  // Handle price range change
  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...localPriceRange] as [number, number]
    newRange[index] = value
    setLocalPriceRange(newRange)
  }

  // Apply price range filter
  const applyPriceRange = () => {
    onChange({
      ...activeFilters,
      priceRange: localPriceRange
    })
  }

  // Count active filters
  const activeFilterCount = Object.values(activeFilters).reduce(
    (count, values) => count + (Array.isArray(values) ? values.length : 0),
    0
  )

  // Get active filter chips
  const getActiveFilterChips = () => {
    const chips: { groupId: string; label: string; value: string }[] = []

    filterGroups.forEach((group) => {
      const values = activeFilters[group.id] as string[]
      if (values && values.length > 0 && group.type !== 'range') {
        values.forEach((value) => {
          const option = group.options.find((o) => o.value === value)
          if (option) {
            chips.push({
              groupId: group.id,
              label: group.label,
              value: option.label
            })
          }
        })
      }
    })

    return chips
  }

  const activeChips = getActiveFilterChips()

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-apple-21 font-semibold text-apple-gray-900 dark:text-apple-dark-text flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-apple-blue-600 dark:bg-apple-blue-dark text-white text-xs font-semibold rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <AppleButton
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-apple-blue-600 dark:text-apple-blue-dark"
          >
            Clear All
          </AppleButton>
        )}
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip, index) => (
            <motion.div
              key={`${chip.groupId}-${chip.value}-${index}`}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5',
                'bg-apple-blue-50 dark:bg-apple-blue-900/20',
                'border border-apple-blue-200 dark:border-apple-blue-700',
                'rounded-full text-sm'
              )}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={EASING.applePhysics}
            >
              <span className="text-apple-blue-700 dark:text-apple-blue-300 font-medium">
                {chip.value}
              </span>
              <button
                onClick={() => {
                  const group = filterGroups.find((g) => g.id === chip.groupId)
                  const option = group?.options.find((o) => o.label === chip.value)
                  if (option) {
                    handleFilterChange(chip.groupId, option.value)
                  }
                }}
                className="text-apple-blue-600 dark:text-apple-blue-dark hover:text-apple-blue-800 dark:hover:text-apple-blue-200"
                aria-label={`Remove ${chip.value} filter`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Filter Groups */}
      <div className="space-y-4">
        {filterGroups.map((group) => (
          <div
            key={group.id}
            className={cn(
              'border-b border-apple-gray-200 dark:border-apple-dark-border',
              'pb-4 last:border-0'
            )}
          >
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between py-2 text-left group"
            >
              <span className="font-medium text-apple-15 text-apple-gray-900 dark:text-apple-dark-text">
                {group.label}
                {activeFilters[group.id] && (activeFilters[group.id] as any[]).length > 0 && (
                  <span className="ml-2 text-xs text-apple-blue-600 dark:text-apple-blue-dark">
                    ({(activeFilters[group.id] as any[]).length})
                  </span>
                )}
              </span>
              <motion.div
                animate={{ rotate: expandedGroups.has(group.id) ? 180 : 0 }}
                transition={EASING.applePhysics}
              >
                <ChevronDown className="w-5 h-5 text-apple-gray-500 group-hover:text-apple-gray-700 dark:group-hover:text-apple-gray-300 transition-colors" />
              </motion.div>
            </button>

            {/* Group Options */}
            <AnimatePresence>
              {expandedGroups.has(group.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={EASING.applePhysics}
                  className="overflow-hidden"
                >
                  <div className="pt-3 space-y-2">
                    {group.options.map((option) => {
                      const isChecked =
                        activeFilters[group.id] &&
                        (activeFilters[group.id] as string[]).includes(option.value)

                      return (
                        <label
                          key={option.value}
                          className="flex items-center gap-3 cursor-pointer group/option"
                        >
                          <div className="relative">
                            <input
                              type={group.type === 'radio' ? 'radio' : 'checkbox'}
                              name={group.type === 'radio' ? group.id : undefined}
                              checked={isChecked}
                              onChange={() =>
                                group.type === 'radio'
                                  ? handleRadioChange(group.id, option.value)
                                  : handleFilterChange(group.id, option.value)
                              }
                              className="sr-only"
                            />
                            <div
                              className={cn(
                                'w-5 h-5 rounded-md border-2 transition-all',
                                isChecked
                                  ? 'bg-apple-blue-600 dark:bg-apple-blue-dark border-apple-blue-600 dark:border-apple-blue-dark'
                                  : 'border-apple-gray-300 dark:border-apple-gray-600 group-hover/option:border-apple-gray-400 dark:group-hover/option:border-apple-gray-500'
                              )}
                            >
                              {isChecked && (
                                <svg
                                  className="w-full h-full text-white"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="flex-1 text-sm text-apple-gray-700 dark:text-apple-gray-300 group-hover/option:text-apple-gray-900 dark:group-hover/option:text-apple-gray-100 transition-colors">
                            {option.label}
                          </span>
                          {option.count !== undefined && (
                            <span className="text-xs text-apple-gray-500">
                              ({option.count})
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {/* Price Range Filter */}
        {priceRange && (
          <div className="border-b border-apple-gray-200 dark:border-apple-dark-border pb-4">
            <button
              onClick={() => toggleGroup('priceRange')}
              className="w-full flex items-center justify-between py-2 text-left group"
            >
              <span className="font-medium text-apple-15 text-apple-gray-900 dark:text-apple-dark-text">
                Price Range
              </span>
              <motion.div
                animate={{ rotate: expandedGroups.has('priceRange') ? 180 : 0 }}
                transition={EASING.applePhysics}
              >
                <ChevronDown className="w-5 h-5 text-apple-gray-500 group-hover:text-apple-gray-700 dark:group-hover:text-apple-gray-300 transition-colors" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedGroups.has('priceRange') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={EASING.applePhysics}
                  className="overflow-hidden"
                >
                  <div className="pt-4 space-y-4">
                    {/* Price Display */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-apple-gray-700 dark:text-apple-gray-300">
                        ${localPriceRange[0].toLocaleString()}
                      </span>
                      <span className="text-apple-gray-500">−</span>
                      <span className="text-apple-gray-700 dark:text-apple-gray-300">
                        ${localPriceRange[1].toLocaleString()}
                      </span>
                    </div>

                    {/* Dual Range Slider */}
                    <div className="relative h-2">
                      <div className="absolute inset-0 bg-apple-gray-200 dark:bg-apple-gray-700 rounded-full" />
                      <div
                        className="absolute h-full bg-apple-blue-600 dark:bg-apple-blue-dark rounded-full"
                        style={{
                          left: `${((localPriceRange[0] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                          right: `${100 - ((localPriceRange[1] - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`
                        }}
                      />
                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        step={priceRange.step || 100}
                        value={localPriceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-apple-blue-600 dark:[&::-webkit-slider-thumb]:border-apple-blue-dark [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                      />
                      <input
                        type="range"
                        min={priceRange.min}
                        max={priceRange.max}
                        step={priceRange.step || 100}
                        value={localPriceRange[1]}
                        onChange={(e) => handlePriceRangeChange(1, Number(e.target.value))}
                        className="absolute inset-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-apple-blue-600 dark:[&::-webkit-slider-thumb]:border-apple-blue-dark [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
                      />
                    </div>

                    {/* Apply Button */}
                    <AppleButton
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={applyPriceRange}
                    >
                      Apply Price Range
                    </AppleButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )

  // Mobile: Render as drawer
  if (isMobile) {
    return (
      <>
        {/* Trigger Button */}
        <AppleButton
          variant="secondary"
          size="md"
          onClick={() => setIsOpen(true)}
          icon={<SlidersHorizontal className="w-5 h-5" />}
          className={className}
        >
          Filters
          {activeFilterCount > 0 && ` (${activeFilterCount})`}
        </AppleButton>

        {/* Drawer */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />

              {/* Drawer Panel */}
              <motion.div
                className={cn(
                  'fixed right-0 top-0 bottom-0 w-full max-w-md z-50',
                  'bg-white dark:bg-apple-dark-bg-elevated',
                  'shadow-modal overflow-y-auto'
                )}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={EASING.applePhysics}
              >
                <div className="p-6">
                  {/* Close Button */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-apple-21 font-semibold">Filters</h2>
                    <motion.button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-apple-gray-100 dark:hover:bg-apple-gray-700 rounded-full transition-colors"
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>

                  {filterContent}

                  {/* Apply Button */}
                  <div className="mt-6 pt-6 border-t border-apple-gray-200 dark:border-apple-dark-border">
                    <AppleButton
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Show Results
                    </AppleButton>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Desktop: Render inline
  return <div className={cn('w-full', className)}>{filterContent}</div>
}

export default ProductFilter
