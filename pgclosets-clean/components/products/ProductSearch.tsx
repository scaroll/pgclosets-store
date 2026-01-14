'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  placeholder?: string;
  debounceMs?: number;
}

export default function ProductSearch({
  onSearch,
  initialQuery = '',
  placeholder = 'Search products...',
  debounceMs = 300
}: ProductSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Common search suggestions
  const commonSearches = [
    'barn doors',
    'bypass doors',
    'bifold doors',
    'glass doors',
    'sliding doors',
    'modern doors',
    'rustic doors',
    'white doors',
    'black doors',
    'hardware',
  ];

  // Debounced search
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, onSearch, debounceMs]);

  // Generate search suggestions
  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      return commonSearches.slice(0, 5);
    }

    const filtered = commonSearches.filter(suggestion =>
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.slice(0, 5);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    const newSuggestions = generateSuggestions(value);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0 && isFocused);
  }, [generateSuggestions, isFocused]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    const newSuggestions = generateSuggestions(query);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  }, [query, generateSuggestions]);

  // Handle blur
  const handleBlur = useCallback(() => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion);
    inputRef.current?.blur();
  }, [onSearch]);

  // Handle form submit
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onSearch(query);
    setShowSuggestions(false);
    inputRef.current?.blur();
  }, [query, onSearch]);

  // Clear search
  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, [onSearch]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  }, []);

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
            <svg
              className="w-5 h-5 text-pg-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`filter-search w-full transition-all duration-200 ${
              isFocused ? 'ring-2 ring-pg-sky ring-opacity-20' : ''
            }`}
            aria-label="Search products"
            autoComplete="off"
          />

          {/* Clear Button */}
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4 text-pg-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-pg-border rounded-lg shadow-strong overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-2 bg-pg-offwhite border-b border-pg-border">
                <span className="text-micro text-pg-gray">
                  {query ? 'Suggested searches' : 'Popular searches'}
                </span>
              </div>

              {/* Suggestions List */}
              <div className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-pg-offwhite transition-colors flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-pg-gray flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="text-body-m text-pg-dark">{suggestion}</span>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 bg-pg-offwhite border-t border-pg-border">
                <span className="text-micro text-pg-gray">
                  Press Enter to search or click a suggestion
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Search Tips - Hidden by default, shown on empty focus */}
      <AnimatePresence>
        {isFocused && !query && !showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute top-full left-0 right-0 z-40 mt-2 p-4 bg-white border border-pg-border rounded-lg shadow-medium"
          >
            <h4 className="text-body-s font-semibold text-pg-dark mb-2">
              Search Tips
            </h4>
            <ul className="text-body-s text-pg-gray space-y-1">
              <li>• Try "barn doors" or "sliding doors"</li>
              <li>• Search by style: "modern", "rustic", "traditional"</li>
              <li>• Filter by color: "white doors", "black hardware"</li>
              <li>• Use keyboard shortcut: Cmd/Ctrl + K</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}