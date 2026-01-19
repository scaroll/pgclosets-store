'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage?: number
  onItemsPerPageChange?: (value: number) => void
  className?: string
}

const itemsPerPageOptions = [12, 24, 48, 96]

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage = 24,
  onItemsPerPageChange,
  className,
}: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleItemsPerPageChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('limit', value.toString())
    params.delete('page') // Reset to first page

    router.push(`${pathname}?${params.toString()}`)
    onItemsPerPageChange?.(value)
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage <= 3) {
        // Near start
        for (let i = 2; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Middle
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {/* Items per page */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-apple-gray-600 dark:text-apple-dark-text-secondary">
          Show:
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="px-3 py-1.5 border border-gray-300 dark:border-apple-dark-border rounded-apple bg-white dark:bg-apple-dark-bg-secondary text-apple-gray-900 dark:text-apple-dark-text cursor-pointer hover:border-gray-400 dark:hover:border-apple-dark-border-heavy focus:outline-none focus:ring-2 focus:ring-apple-blue-500"
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option} items
            </option>
          ))}
        </select>
      </div>

      {/* Page numbers */}
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center gap-1 px-3 py-2 rounded-apple font-medium transition-colors',
            currentPage === 1
              ? 'text-gray-400 dark:text-apple-dark-text-tertiary cursor-not-allowed'
              : 'text-apple-gray-700 dark:text-apple-dark-text-secondary hover:bg-gray-100 dark:hover:bg-apple-dark-bg-tertiary'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-apple-gray-500 dark:text-apple-dark-text-tertiary"
                >
                  ...
                </span>
              )
            }

            const page = pageNum as number
            const isActive = page === currentPage

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  'min-w-[40px] px-3 py-2 rounded-apple font-medium transition-colors',
                  isActive
                    ? 'bg-apple-blue-500 text-white'
                    : 'text-apple-gray-700 dark:text-apple-dark-text-secondary hover:bg-gray-100 dark:hover:bg-apple-dark-bg-tertiary'
                )}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center gap-1 px-3 py-2 rounded-apple font-medium transition-colors',
            currentPage === totalPages
              ? 'text-gray-400 dark:text-apple-dark-text-tertiary cursor-not-allowed'
              : 'text-apple-gray-700 dark:text-apple-dark-text-secondary hover:bg-gray-100 dark:hover:bg-apple-dark-bg-tertiary'
          )}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Page info */}
      <div className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  )
}
