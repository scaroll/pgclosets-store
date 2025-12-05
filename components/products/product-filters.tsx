'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface ProductFiltersProps {
  categories?: FilterOption[]
  className?: string
}

export function ProductFilters({ categories = [], className }: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    stock: true,
  })

  // Load filters from URL
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategories(category.split(','))
    }

    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      setPriceRange([
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 2000,
      ])
    }

    const inStock = searchParams.get('inStock')
    setInStockOnly(inStock === 'true')
  }, [searchParams])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    // Reset to page 1 when filters change
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCategoryChange = (categoryValue: string) => {
    const newCategories = selectedCategories.includes(categoryValue)
      ? selectedCategories.filter((c) => c !== categoryValue)
      : [...selectedCategories, categoryValue]

    setSelectedCategories(newCategories)
    updateFilters({
      category: newCategories.length > 0 ? newCategories.join(',') : null,
    })
  }

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max])
    updateFilters({
      minPrice: min > 0 ? min.toString() : null,
      maxPrice: max < 2000 ? max.toString() : null,
    })
  }

  const handleStockChange = () => {
    const newValue = !inStockOnly
    setInStockOnly(newValue)
    updateFilters({
      inStock: newValue ? 'true' : null,
    })
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, 2000])
    setInStockOnly(false)
    router.push(pathname)
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 2000 ||
    inStockOnly

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header (Mobile) */}
      <div className="lg:hidden flex items-center justify-between pb-4 border-b border-gray-200 dark:border-apple-dark-border">
        <h2 className="text-xl font-bold text-apple-gray-900 dark:text-apple-dark-text">
          Filters
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-apple-dark-bg-tertiary rounded-apple"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
            {selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 2000 ? 1 : 0) + (inStockOnly ? 1 : 0)} filters active
          </span>
          <button
            onClick={clearFilters}
            className="text-sm text-apple-blue-500 hover:text-apple-blue-600 font-medium"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
              Categories
            </h3>
            <ChevronDown
              className={cn(
                'w-5 h-5 transition-transform',
                expandedSections.categories && 'rotate-180'
              )}
            />
          </button>

          {expandedSections.categories && (
            <div className="space-y-2 pl-1">
              {categories.map((category) => (
                <label
                  key={category.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                    className="w-4 h-4 rounded border-gray-300 text-apple-blue-500 focus:ring-apple-blue-500"
                  />
                  <span className="text-sm text-apple-gray-700 dark:text-apple-dark-text-secondary group-hover:text-apple-gray-900 dark:group-hover:text-apple-dark-text">
                    {category.label}
                    {category.count !== undefined && (
                      <span className="ml-1 text-apple-gray-500">({category.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
            Price Range
          </h3>
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform',
              expandedSections.price && 'rotate-180'
            )}
          />
        </button>

        {expandedSections.price && (
          <div className="space-y-4 pl-1">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-apple-gray-600 dark:text-apple-dark-text-secondary mb-1 block">
                  Min ($)
                </label>
                <input
                  type="number"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(parseInt(e.target.value) || 0, priceRange[1])}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-apple-dark-border rounded-apple bg-white dark:bg-apple-dark-bg-tertiary text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-apple-gray-600 dark:text-apple-dark-text-secondary mb-1 block">
                  Max ($)
                </label>
                <input
                  type="number"
                  min={priceRange[0]}
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value) || 2000)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-apple-dark-border rounded-apple bg-white dark:bg-apple-dark-bg-tertiary text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-apple-gray-600 dark:text-apple-dark-text-secondary">
                Min Price: ${priceRange[0]}
              </label>
              <input
                type="range"
                min="0"
                max={priceRange[1]}
                step="50"
                value={priceRange[0]}
                onChange={(e) => handlePriceChange(parseInt(e.target.value), priceRange[1])}
                className="w-full accent-apple-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-apple-gray-600 dark:text-apple-dark-text-secondary">
                Max Price: ${priceRange[1]}
              </label>
              <input
                type="range"
                min={priceRange[0]}
                max="2000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => handlePriceChange(priceRange[0], parseInt(e.target.value))}
                className="w-full accent-apple-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* In Stock Only */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('stock')}
          className="flex items-center justify-between w-full text-left"
        >
          <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
            Availability
          </h3>
          <ChevronDown
            className={cn(
              'w-5 h-5 transition-transform',
              expandedSections.stock && 'rotate-180'
            )}
          />
        </button>

        {expandedSections.stock && (
          <label className="flex items-center gap-3 cursor-pointer group pl-1">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={handleStockChange}
              className="w-4 h-4 rounded border-gray-300 text-apple-blue-500 focus:ring-apple-blue-500"
            />
            <span className="text-sm text-apple-gray-700 dark:text-apple-dark-text-secondary group-hover:text-apple-gray-900 dark:group-hover:text-apple-dark-text">
              In Stock Only
            </span>
          </label>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-6 py-3 bg-apple-blue-500 text-white rounded-full shadow-floating hover:bg-apple-blue-600 transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 px-2 py-0.5 bg-white text-apple-blue-500 rounded-full text-xs font-bold">
            {selectedCategories.length + (priceRange[0] > 0 || priceRange[1] < 2000 ? 1 : 0) + (inStockOnly ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-apple-dark-bg-secondary z-50 p-6 overflow-y-auto">
            <FilterContent />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <div className={cn('hidden lg:block', className)}>
        <div className="sticky top-6">
          <FilterContent />
        </div>
      </div>
    </>
  )
}
