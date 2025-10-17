'use client';

import * as React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/lib/hooks/use-debounce';
import type { Product } from '@/types/commerce';
import Link from 'next/link';
import Image from 'next/image';

/**
 * InstantSearch Component
 *
 * Real-time search with instant results, autocomplete, and keyboard navigation
 *
 * Features:
 * - Debounced search input (300ms)
 * - Instant results display
 * - Recent searches tracking
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Click outside to close
 * - Loading states
 * - Empty state handling
 * - Mobile responsive
 */

interface InstantSearchProps {
  /** Products to search through */
  products: Product[];
  /** Callback when search query changes */
  onSearchChange?: (query: string) => void;
  /** Custom placeholder text */
  placeholder?: string;
  /** Show recent searches */
  showRecent?: boolean;
  /** Maximum results to show */
  maxResults?: number;
  /** Custom className */
  className?: string;
}

interface SearchResult {
  product: Product;
  relevanceScore: number;
  matchType: 'title' | 'description' | 'sku' | 'category';
}

export function InstantSearch({
  products,
  onSearchChange,
  placeholder = 'Search products...',
  showRecent = true,
  maxResults = 6,
  className,
}: InstantSearchProps) {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const searchRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Debounce search query
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined' && showRecent) {
      const stored = localStorage.getItem('pgc-recent-searches');
      if (stored) {
        try {
          setRecentSearches(JSON.parse(stored));
        } catch (e) {
          // Invalid JSON, ignore
        }
      }
    }
  }, [showRecent]);

  // Search products
  const searchResults = React.useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      return [];
    }

    setIsSearching(true);
    const queryLower = debouncedQuery.toLowerCase();
    const results: SearchResult[] = [];

    products.forEach((product) => {
      let score = 0;
      let matchType: SearchResult['matchType'] = 'description';

      // Title match (highest priority)
      if (product.title.toLowerCase().includes(queryLower)) {
        score += 10;
        if (product.title.toLowerCase().startsWith(queryLower)) {
          score += 5; // Bonus for starts-with match
        }
        matchType = 'title';
      }

      // SKU exact match
      if (product.handle.toLowerCase() === queryLower) {
        score += 15;
        matchType = 'sku';
      }

      // Category match
      if (product.collection?.title?.toLowerCase().includes(queryLower)) {
        score += 5;
        matchType = 'category';
      }

      // Description match (lowest priority)
      if (product.description.toLowerCase().includes(queryLower)) {
        score += 2;
        if (matchType === 'description') {
          matchType = 'description';
        }
      }

      if (score > 0) {
        results.push({ product, relevanceScore: score, matchType });
      }
    });

    // Sort by relevance score
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    setIsSearching(false);
    return results.slice(0, maxResults);
  }, [debouncedQuery, products, maxResults]);

  // Notify parent of search change
  React.useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedQuery);
    }
  }, [debouncedQuery, onSearchChange]);

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleResultClick(searchResults[selectedIndex].product);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Handle result click
  const handleResultClick = (product: Product) => {
    // Save to recent searches
    if (showRecent && query) {
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('pgc-recent-searches', JSON.stringify(updated));
    }

    setIsOpen(false);
    setQuery('');
  };

  // Handle recent search click
  const handleRecentClick = (search: string) => {
    setQuery(search);
    setIsOpen(true);
    inputRef.current?.focus();
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={
            selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined
          }
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          id="search-results"
          className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto"
        >
          {/* Loading State */}
          {isSearching && query.length >= 2 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Search Results */}
          {!isSearching && searchResults.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Products ({searchResults.length})
              </div>
              {searchResults.map((result, index) => (
                <Link
                  key={result.product.id}
                  href={`/products/${result.product.handle}`}
                  onClick={() => handleResultClick(result.product)}
                  id={`search-result-${index}`}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors',
                    selectedIndex === index && 'bg-gray-50'
                  )}
                >
                  {/* Product Image */}
                  <div className="relative h-12 w-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                    {result.product.thumbnail ? (
                      <Image
                        src={result.product.thumbnail}
                        alt={result.product.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {result.product.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{result.matchType}</span>
                      {result.product.collection?.title && (
                        <>
                          <span>•</span>
                          <span>{result.product.collection.title}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  {result.product.variants?.[0]?.price && (
                    <div className="text-sm font-semibold text-gray-900">
                      ${(result.product.variants[0].price / 100).toFixed(0)}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isSearching && query.length >= 2 && searchResults.length === 0 && (
            <div className="py-8 text-center">
              <div className="text-sm text-muted-foreground mb-1">
                No products found for "{query}"
              </div>
              <div className="text-xs text-muted-foreground">
                Try a different search term
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!query && showRecent && recentSearches.length > 0 && (
            <div className="py-2 border-t border-gray-200">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(search)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                >
                  <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Quick Tip */}
          {!query && (
            <div className="px-3 py-2 text-xs text-muted-foreground border-t border-gray-200">
              <span className="font-medium">Tip:</span> Search by product name, SKU, or category
            </div>
          )}
        </div>
      )}
    </div>
  );
}
