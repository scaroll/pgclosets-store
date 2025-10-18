'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EASING } from '@/lib/animations'

/**
 * ProductSort - Premium Sorting Dropdown
 * Features:
 * - Smooth dropdown animations
 * - Keyboard navigation
 * - Active sort indicator
 * - Click outside to close
 * - Customizable sort options
 * - Apple-inspired design
 *
 * @example
 * ```tsx
 * <ProductSort
 *   options={[
 *     { value: 'featured', label: 'Featured' },
 *     { value: 'price-asc', label: 'Price: Low to High' },
 *     { value: 'price-desc', label: 'Price: High to Low' },
 *     { value: 'newest', label: 'Newest' },
 *     { value: 'rating', label: 'Top Rated' }
 *   ]}
 *   value="featured"
 *   onChange={(value) => setSortBy(value)}
 * />
 * ```
 */

export interface SortOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface ProductSortProps {
  options: SortOption[]
  value: string
  onChange: (value: string) => void
  className?: string
  label?: string
}

export function ProductSort({
  options,
  value,
  onChange,
  className,
  label = 'Sort by'
}: ProductSortProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Get current sort option
  const currentOption = options.find((opt) => opt.value === value) || options[0]

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setFocusedIndex((prev) => (prev + 1) % options.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setFocusedIndex((prev) => (prev - 1 + options.length) % options.length)
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value)
          }
          break
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          buttonRef.current?.focus()
          break
        case 'Tab':
          setIsOpen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, focusedIndex, options])

  // Handle option select
  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setFocusedIndex(-1)
    buttonRef.current?.focus()
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between gap-3',
          'px-4 py-2.5 min-w-[200px]',
          'bg-white dark:bg-apple-dark-bg-secondary',
          'border border-apple-gray-300 dark:border-apple-dark-border',
          'rounded-full',
          'text-apple-15 font-medium',
          'text-apple-gray-900 dark:text-apple-dark-text',
          'hover:bg-apple-gray-50 dark:hover:bg-apple-dark-bg-tertiary',
          'active:bg-apple-gray-100 dark:active:bg-apple-gray-700',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-apple-blue-600 dark:focus-visible:ring-apple-blue-dark',
          'focus-visible:ring-offset-2',
          isOpen && 'bg-apple-gray-50 dark:bg-apple-dark-bg-tertiary'
        )}
        whileTap={{ scale: 0.98 }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${currentOption.label}`}
      >
        <span className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-apple-gray-500" />
          <span className="hidden sm:inline text-apple-gray-600 dark:text-apple-gray-400">
            {label}:
          </span>
          <span>{currentOption.label}</span>
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={EASING.applePhysics}
        >
          <ChevronDown className="w-5 h-5 text-apple-gray-500" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={cn(
              'absolute right-0 top-full mt-2 z-50',
              'min-w-[240px]',
              'bg-white dark:bg-apple-dark-bg-elevated',
              'border border-apple-gray-200 dark:border-apple-dark-border',
              'rounded-2xl',
              'shadow-apple-lg dark:shadow-none',
              'overflow-hidden'
            )}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={EASING.applePhysics}
            role="listbox"
            aria-label="Sort options"
          >
            <div className="py-2">
              {options.map((option, index) => {
                const isActive = option.value === value
                const isFocused = index === focusedIndex

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={cn(
                      'w-full flex items-center justify-between gap-3',
                      'px-4 py-3',
                      'text-left text-apple-15',
                      'transition-colors duration-150',
                      isActive
                        ? 'bg-apple-blue-50 dark:bg-apple-blue-900/20 text-apple-blue-600 dark:text-apple-blue-dark font-medium'
                        : isFocused
                          ? 'bg-apple-gray-100 dark:bg-apple-gray-700 text-apple-gray-900 dark:text-apple-dark-text'
                          : 'text-apple-gray-700 dark:text-apple-gray-300 hover:bg-apple-gray-50 dark:hover:bg-apple-gray-700'
                    )}
                    whileHover={{ backgroundColor: 'var(--hover-bg)' }}
                    whileTap={{ scale: 0.98 }}
                    role="option"
                    aria-selected={isActive}
                  >
                    <span className="flex items-center gap-2">
                      {option.icon}
                      {option.label}
                    </span>

                    {/* Checkmark for active option */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={EASING.applePhysics}
                      >
                        <Check className="w-5 h-5 text-apple-blue-600 dark:text-apple-blue-dark" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductSort
