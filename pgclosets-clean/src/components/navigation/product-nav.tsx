"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams, usePathname } from "next/navigation"
import { ChevronDown, Filter, Grid, List, Search } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"

interface ProductCategory {
  id: string
  name: string
  href: string
  count?: number
}

interface ProductNavProps {
  categories?: ProductCategory[]
  currentCategory?: string
  showFilters?: boolean
  showViewToggle?: boolean
  onViewChange?: (view: 'grid' | 'list') => void
  currentView?: 'grid' | 'list'
  totalCount?: number
}

const defaultCategories: ProductCategory[] = [
  { id: "all", name: "All Products", href: "/products", count: 75 },
  { id: "barn-doors", name: "Barn Doors", href: "/products?category=barn-doors", count: 32 },
  { id: "bypass-doors", name: "Bypass Doors", href: "/products?category=bypass-doors", count: 18 },
  { id: "bifold-doors", name: "Bifold Doors", href: "/products?category=bifold-doors", count: 15 },
  { id: "hardware", name: "Hardware", href: "/products?category=hardware", count: 10 },
]

const sortOptions = [
  { value: "name", label: "Name A-Z" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "popular", label: "Most Popular" },
]

const priceRanges = [
  { value: "under-500", label: "Under $500", href: "?price=under-500" },
  { value: "500-800", label: "$500 - $800", href: "?price=500-800" },
  { value: "800-1200", label: "$800 - $1,200", href: "?price=800-1200" },
  { value: "over-1200", label: "Over $1,200", href: "?price=over-1200" },
]

export function ProductNav({
  categories = defaultCategories,
  currentCategory = "all",
  showFilters = true,
  showViewToggle = true,
  onViewChange,
  currentView = "grid",
  totalCount = 0
}: ProductNavProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [selectedSort, setSelectedSort] = useState("name")
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const currentSortLabel = sortOptions.find(option => option.value === selectedSort)?.label || "Name A-Z"

  return (
    <div className="bg-white border-b border-slate-200 sticky top-20 z-40">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Category Navigation */}
          <div className="flex items-center space-x-1 overflow-x-auto">
            {categories.map((category) => {
              const isActive = currentCategory === category.id
              return (
                <Link
                  key={category.id}
                  href={category.href}
                  className={`
                    flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                    ${isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  {category.name}
                  {category.count && (
                    <span className={`ml-2 text-xs ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      ({category.count})
                    </span>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Results Count */}
            {totalCount > 0 && (
              <span className="text-sm text-slate-600 hidden md:block">
                {totalCount} products
              </span>
            )}

            {/* View Toggle */}
            {showViewToggle && onViewChange && (
              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => onViewChange('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    currentView === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewChange('list')}
                  className={`p-2 rounded-md transition-colors ${
                    currentView === 'list'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-400 transition-colors"
                aria-expanded={isSortOpen}
                aria-haspopup="true"
              >
                Sort: {currentSortLabel}
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-300 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSort(option.value)
                          setIsSortOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${
                          selectedSort === option.value ? 'text-slate-900 font-medium' : 'text-slate-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Filters Toggle */}
            {showFilters && (
              <Button
                variant="outline"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Filters Section */}
        {showFilters && isFiltersOpen && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range Filter */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <Link
                      key={range.value}
                      href={range.href}
                      className="block text-sm text-slate-700 hover:text-slate-900 transition-colors"
                    >
                      {range.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Material</h3>
                <div className="space-y-2">
                  <Link href="?material=wood" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    Wood
                  </Link>
                  <Link href="?material=engineered" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    Engineered Wood
                  </Link>
                  <Link href="?material=composite" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    Composite
                  </Link>
                </div>
              </div>

              {/* Style Filter */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Style</h3>
                <div className="space-y-2">
                  <Link href="?style=modern" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    Modern
                  </Link>
                  <Link href="?style=rustic" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    Rustic
                  </Link>
                  <Link href="?style=traditional" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    Traditional
                  </Link>
                  <Link href="?style=industrial" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    Industrial
                  </Link>
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-3">Brand</h3>
                <div className="space-y-2">
                  <Link href="?brand=renin" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    Renin
                  </Link>
                  <Link href="?brand=pg-closets" className="block text-sm text-slate-700 hover:text-slate-900 transition-colors">
                    PG Closets
                  </Link>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => {
                  // Clear all filters logic
                  window.location.href = pathname
                }}
                className="text-sm"
              >
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Bar (visible on smaller screens) */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  )
}