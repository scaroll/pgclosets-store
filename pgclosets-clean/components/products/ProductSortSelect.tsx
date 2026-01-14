'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductSortSelectProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

interface SortOption {
  value: string;
  label: string;
  order: 'asc' | 'desc';
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'relevance', label: 'Relevance', order: 'desc' },
  { value: 'title', label: 'Name (A-Z)', order: 'asc' },
  { value: 'title', label: 'Name (Z-A)', order: 'desc' },
  { value: 'price', label: 'Price (Low to High)', order: 'asc' },
  { value: 'price', label: 'Price (High to Low)', order: 'desc' },
  { value: 'created_at', label: 'Newest First', order: 'desc' },
  { value: 'created_at', label: 'Oldest First', order: 'asc' },
  { value: 'popularity', label: 'Most Popular', order: 'desc' },
];

export default function ProductSortSelect({
  sortBy,
  sortOrder,
  onSortChange
}: ProductSortSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Find current sort option
  const currentOption = SORT_OPTIONS.find(
    option => option.value === sortBy && option.order === sortOrder
  ) || SORT_OPTIONS[0];

  // Handle option selection
  const handleOptionSelect = useCallback((option: SortOption) => {
    onSortChange(option.value, option.order);
    setIsOpen(false);
  }, [onSortChange]);

  // Toggle dropdown
  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Close dropdown when clicking outside
  const handleBlur = useCallback(() => {
    setTimeout(() => setIsOpen(false), 150);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        onBlur={handleBlur}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-pg-border rounded-lg hover:border-pg-sky transition-colors text-body-m min-w-48"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Sort by ${currentOption.label}`}
      >
        <span className="flex-1 text-left text-pg-dark">
          {currentOption.label}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-pg-gray"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-pg-border rounded-lg shadow-strong overflow-hidden"
          >
            <div
              role="listbox"
              aria-label="Sort options"
              className="max-h-80 overflow-y-auto"
            >
              {SORT_OPTIONS.map((option, index) => {
                const isSelected = option.value === sortBy && option.order === sortOrder;

                return (
                  <button
                    key={`${option.value}-${option.order}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleOptionSelect(option)}
                    className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-pg-navy text-white'
                        : 'hover:bg-pg-offwhite text-pg-dark'
                    }`}
                  >
                    <span className="text-body-m">{option.label}</span>
                    {isSelected && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sort Help */}
            <div className="px-4 py-2 bg-pg-offwhite border-t border-pg-border">
              <span className="text-micro text-pg-gray">
                Default: Relevance • {SORT_OPTIONS.length} sort options available
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}