'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ArrowUpDown, Grid3x3, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductSortProps {
  className?: string
  showViewToggle?: boolean
  view?: 'grid' | 'list'
  onViewChange?: (view: 'grid' | 'list') => void
}

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name-asc' },
  { label: 'Name: Z to A', value: 'name-desc' },
]

export function ProductSort({
  className,
  showViewToggle = true,
  view = 'grid',
  onViewChange
}: ProductSortProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') || 'featured'

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (sortValue === 'featured') {
      params.delete('sort')
    } else {
      params.set('sort', sortValue)
    }

    // Reset to page 1 when sort changes
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Sort Dropdown */}
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-apple-gray-600 dark:text-apple-dark-text-secondary" />
        <select
          value={currentSort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-apple-dark-border rounded-apple bg-white dark:bg-apple-dark-bg-secondary text-apple-gray-900 dark:text-apple-dark-text text-sm font-medium cursor-pointer hover:border-gray-400 dark:hover:border-apple-dark-border-heavy focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* View Toggle */}
      {showViewToggle && (
        <div className="hidden md:flex items-center gap-1 border border-gray-300 dark:border-apple-dark-border rounded-apple p-1">
          <button
            onClick={() => onViewChange?.('grid')}
            className={cn(
              'p-2 rounded transition-colors',
              view === 'grid'
                ? 'bg-apple-blue-500 text-white'
                : 'text-apple-gray-600 dark:text-apple-dark-text-secondary hover:bg-gray-100 dark:hover:bg-apple-dark-bg-tertiary'
            )}
            aria-label="Grid view"
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewChange?.('list')}
            className={cn(
              'p-2 rounded transition-colors',
              view === 'list'
                ? 'bg-apple-blue-500 text-white'
                : 'text-apple-gray-600 dark:text-apple-dark-text-secondary hover:bg-gray-100 dark:hover:bg-apple-dark-bg-tertiary'
            )}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
