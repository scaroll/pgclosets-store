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
  styles?: FilterOption[]
  materials?: FilterOption[]
  finishes?: FilterOption[]
  className?: string
}

// Default filter options if not provided
const DEFAULT_STYLES: FilterOption[] = [
  { label: 'Barn Door', value: 'barn-door' },
  { label: 'Bifold', value: 'bifold' },
  { label: 'Bypass', value: 'bypass' },
  { label: 'Pivot', value: 'pivot' },
  { label: 'Mirror', value: 'mirror' },
]

const DEFAULT_MATERIALS: FilterOption[] = [
  { label: 'Solid Wood', value: 'solid-wood' },
  { label: 'Engineered Wood', value: 'engineered-wood' },
  { label: 'Glass', value: 'glass' },
  { label: 'Aluminum', value: 'aluminum' },
  { label: 'MDF', value: 'mdf' },
]

const DEFAULT_FINISHES: FilterOption[] = [
  { label: 'White', value: 'white' },
  { label: 'Black', value: 'black' },
  { label: 'Natural Wood', value: 'natural' },
  { label: 'Walnut', value: 'walnut' },
  { label: 'Oak', value: 'oak' },
  { label: 'Gray', value: 'gray' },
  { label: 'Espresso', value: 'espresso' },
  { label: 'Frosted', value: 'frosted' },
  { label: 'Mirror', value: 'mirror' },
]

export function ProductFilters({
  categories = [],
  styles = DEFAULT_STYLES,
  materials = DEFAULT_MATERIALS,
  finishes = DEFAULT_FINISHES,
  className,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    styles: true,
    materials: false,
    finishes: false,
    price: false,
    stock: false,
  })

  // Load filters from URL
  useEffect(() => {
    const category = searchParams.get('category')
    if (category) {
      setSelectedCategories(category.split(','))
    }

    const style = searchParams.get('style')
    if (style) {
      setSelectedStyles(style.split(','))
    }

    const material = searchParams.get('material')
    if (material) {
      setSelectedMaterials(material.split(','))
    }

    const finish = searchParams.get('finish')
    if (finish) {
      setSelectedFinishes(finish.split(','))
    }

    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    if (minPrice || maxPrice) {
      setPriceRange([minPrice ? parseInt(minPrice) : 0, maxPrice ? parseInt(maxPrice) : 5000])
    }

    const inStock = searchParams.get('inStock')
    setInStockOnly(inStock === 'true')
  }, [searchParams])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
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
      ? selectedCategories.filter(c => c !== categoryValue)
      : [...selectedCategories, categoryValue]

    setSelectedCategories(newCategories)
    updateFilters({
      category: newCategories.length > 0 ? newCategories.join(',') : null,
    })
  }

  const handleStyleChange = (styleValue: string) => {
    const newStyles = selectedStyles.includes(styleValue)
      ? selectedStyles.filter(s => s !== styleValue)
      : [...selectedStyles, styleValue]

    setSelectedStyles(newStyles)
    updateFilters({
      style: newStyles.length > 0 ? newStyles.join(',') : null,
    })
  }

  const handleMaterialChange = (materialValue: string) => {
    const newMaterials = selectedMaterials.includes(materialValue)
      ? selectedMaterials.filter(m => m !== materialValue)
      : [...selectedMaterials, materialValue]

    setSelectedMaterials(newMaterials)
    updateFilters({
      material: newMaterials.length > 0 ? newMaterials.join(',') : null,
    })
  }

  const handleFinishChange = (finishValue: string) => {
    const newFinishes = selectedFinishes.includes(finishValue)
      ? selectedFinishes.filter(f => f !== finishValue)
      : [...selectedFinishes, finishValue]

    setSelectedFinishes(newFinishes)
    updateFilters({
      finish: newFinishes.length > 0 ? newFinishes.join(',') : null,
    })
  }

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max])
    updateFilters({
      minPrice: min > 0 ? min.toString() : null,
      maxPrice: max < 5000 ? max.toString() : null,
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
    setSelectedStyles([])
    setSelectedMaterials([])
    setSelectedFinishes([])
    setPriceRange([0, 5000])
    setInStockOnly(false)
    router.push(pathname)
  }

  const activeFilterCount =
    selectedCategories.length +
    selectedStyles.length +
    selectedMaterials.length +
    selectedFinishes.length +
    (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  const hasActiveFilters = activeFilterCount > 0

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header (Mobile) */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-apple-dark-border lg:hidden">
        <h2 className="text-xl font-bold text-apple-gray-900 dark:text-apple-dark-text">Filters</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="rounded-apple p-2 hover:bg-gray-100 dark:hover:bg-apple-dark-bg-tertiary"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Active Filters Count */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
            {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
          </span>
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-apple-blue-500 hover:text-apple-blue-600"
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
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
              Categories
            </h3>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform',
                expandedSections.categories && 'rotate-180'
              )}
            />
          </button>

          {expandedSections.categories && (
            <div className="space-y-2 pl-1">
              {categories.map(category => (
                <label
                  key={category.value}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                    className="h-4 w-4 rounded border-gray-300 text-apple-blue-500 focus:ring-apple-blue-500"
                  />
                  <span className="text-sm text-apple-gray-700 group-hover:text-apple-gray-900 dark:text-apple-dark-text-secondary dark:group-hover:text-apple-dark-text">
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

      {/* Door Style */}
      {styles.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('styles')}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
              Door Style
            </h3>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform',
                expandedSections.styles && 'rotate-180'
              )}
            />
          </button>

          {expandedSections.styles && (
            <div className="space-y-2 pl-1">
              {styles.map(style => (
                <label key={style.value} className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedStyles.includes(style.value)}
                    onChange={() => handleStyleChange(style.value)}
                    className="h-4 w-4 rounded border-gray-300 text-apple-blue-500 focus:ring-apple-blue-500"
                  />
                  <span className="text-sm text-apple-gray-700 group-hover:text-apple-gray-900 dark:text-apple-dark-text-secondary dark:group-hover:text-apple-dark-text">
                    {style.label}
                    {style.count !== undefined && (
                      <span className="ml-1 text-apple-gray-500">({style.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Material */}
      {materials.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('materials')}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
              Material
            </h3>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform',
                expandedSections.materials && 'rotate-180'
              )}
            />
          </button>

          {expandedSections.materials && (
            <div className="space-y-2 pl-1">
              {materials.map(material => (
                <label
                  key={material.value}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material.value)}
                    onChange={() => handleMaterialChange(material.value)}
                    className="h-4 w-4 rounded border-gray-300 text-apple-blue-500 focus:ring-apple-blue-500"
                  />
                  <span className="text-sm text-apple-gray-700 group-hover:text-apple-gray-900 dark:text-apple-dark-text-secondary dark:group-hover:text-apple-dark-text">
                    {material.label}
                    {material.count !== undefined && (
                      <span className="ml-1 text-apple-gray-500">({material.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Finish */}
      {finishes.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('finishes')}
            className="flex w-full items-center justify-between text-left"
          >
            <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
              Finish / Color
            </h3>
            <ChevronDown
              className={cn(
                'h-5 w-5 transition-transform',
                expandedSections.finishes && 'rotate-180'
              )}
            />
          </button>

          {expandedSections.finishes && (
            <div className="space-y-2 pl-1">
              {finishes.map(finish => (
                <label key={finish.value} className="group flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedFinishes.includes(finish.value)}
                    onChange={() => handleFinishChange(finish.value)}
                    className="h-4 w-4 rounded border-gray-300 text-apple-blue-500 focus:ring-apple-blue-500"
                  />
                  <span className="text-sm text-apple-gray-700 group-hover:text-apple-gray-900 dark:text-apple-dark-text-secondary dark:group-hover:text-apple-dark-text">
                    {finish.label}
                    {finish.count !== undefined && (
                      <span className="ml-1 text-apple-gray-500">({finish.count})</span>
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
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
            Price Range
          </h3>
          <ChevronDown
            className={cn('h-5 w-5 transition-transform', expandedSections.price && 'rotate-180')}
          />
        </button>

        {expandedSections.price && (
          <div className="space-y-4 pl-1">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label
                  htmlFor="price-min"
                  className="mb-1 block text-xs text-apple-gray-600 dark:text-apple-dark-text-secondary"
                >
                  Min ($)
                </label>
                <input
                  id="price-min"
                  type="number"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={e => handlePriceChange(parseInt(e.target.value) || 0, priceRange[1])}
                  className="w-full rounded-apple border border-gray-300 bg-white px-3 py-2 text-sm dark:border-apple-dark-border dark:bg-apple-dark-bg-tertiary"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="price-max"
                  className="mb-1 block text-xs text-apple-gray-600 dark:text-apple-dark-text-secondary"
                >
                  Max ($)
                </label>
                <input
                  id="price-max"
                  type="number"
                  min={priceRange[0]}
                  max="5000"
                  value={priceRange[1]}
                  onChange={e => handlePriceChange(priceRange[0], parseInt(e.target.value) || 5000)}
                  className="w-full rounded-apple border border-gray-300 bg-white px-3 py-2 text-sm dark:border-apple-dark-border dark:bg-apple-dark-bg-tertiary"
                />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={priceRange[1]}
              onChange={e => handlePriceChange(priceRange[0], parseInt(e.target.value))}
              className="w-full accent-apple-blue-500"
            />
            <div className="flex justify-between text-xs text-apple-gray-500">
              <span>$0</span>
              <span>$5,000+</span>
            </div>
          </div>
        )}
      </div>

      {/* In Stock Only */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('stock')}
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="font-semibold text-apple-gray-900 dark:text-apple-dark-text">
            Availability
          </h3>
          <ChevronDown
            className={cn('h-5 w-5 transition-transform', expandedSections.stock && 'rotate-180')}
          />
        </button>

        {expandedSections.stock && (
          <label className="group flex cursor-pointer items-center gap-3 pl-1">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={handleStockChange}
              className="h-4 w-4 rounded border-gray-300 text-apple-blue-500 focus:ring-apple-blue-500"
            />
            <span className="text-sm text-apple-gray-700 group-hover:text-apple-gray-900 dark:text-apple-dark-text-secondary dark:group-hover:text-apple-dark-text">
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
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-apple-blue-500 px-6 py-3 text-white shadow-floating transition-colors lg:hidden hover:bg-apple-blue-600"
      >
        <SlidersHorizontal className="h-5 w-5" />
        Filters
        {hasActiveFilters && (
          <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-xs font-bold text-apple-blue-500">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            role="button"
            tabIndex={0}
            aria-label="Close filters"
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
            onClick={() => setIsOpen(false)}
            onKeyDown={e => e.key === 'Enter' && setIsOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-white p-6 dark:bg-apple-dark-bg-secondary lg:hidden">
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
