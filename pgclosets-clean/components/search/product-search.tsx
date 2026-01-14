"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, TrendingUp, Hash, Tag, Package } from 'lucide-react';
import { SearchSuggestion, SearchSuggestions, searchUtils } from '@/lib/search-utils';
import { ReninProduct } from '@/lib/renin-product-loader';
import { cn } from '@/lib/utils';

interface ProductSearchProps {
  products: ReninProduct[];
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
  showRecentSearches?: boolean;
  maxSuggestions?: number;
}

interface RecentSearch {
  query: string;
  timestamp: number;
}

export function ProductSearch({
  products,
  onSearch,
  onSuggestionSelect,
  placeholder = "Search for closet doors, barn doors, hardware...",
  className,
  showRecentSearches = true,
  maxSuggestions = 8,
}: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && showRecentSearches) {
      const stored = localStorage.getItem('recent-searches');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRecentSearches(parsed.slice(0, 5)); // Keep only 5 recent searches
        } catch (error) {
          console.error('Error loading recent searches:', error);
        }
      }
    }
  }, [showRecentSearches]);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!showRecentSearches || !searchQuery.trim()) return;

    const newSearch: RecentSearch = {
      query: searchQuery.trim(),
      timestamp: Date.now(),
    };

    const updated = [
      newSearch,
      ...recentSearches.filter(search => search.query !== newSearch.query)
    ].slice(0, 5);

    setRecentSearches(updated);

    if (typeof window !== 'undefined') {
      localStorage.setItem('recent-searches', JSON.stringify(updated));
    }
  }, [recentSearches, showRecentSearches]);

  // Debounced suggestions generation
  const debouncedGenerateSuggestions = useCallback(
    searchUtils.debounce((searchQuery: string) => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true);
        const newSuggestions = SearchSuggestions.generateSuggestions(
          products,
          searchQuery,
          maxSuggestions
        );
        setSuggestions(newSuggestions);
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setIsLoading(false);
      }
    }, 300),
    [products, maxSuggestions]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);

    if (value.trim().length >= 2) {
      debouncedGenerateSuggestions(value);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(value.length === 0); // Show recent searches when empty
    }
  };

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      onSearch(finalQuery);
      saveRecentSearch(finalQuery);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    onSearch(suggestion.text);
    saveRecentSearch(suggestion.text);
    setIsOpen(false);
    setSelectedIndex(-1);

    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
  };

  // Handle recent search selection
  const handleRecentSearchSelect = (recentSearch: RecentSearch) => {
    setQuery(recentSearch.query);
    onSearch(recentSearch.query);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length + (showRecentSearches && query.length === 0 ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < totalItems) {
          if (query.length === 0 && recentSearches.length > 0 && selectedIndex < recentSearches.length) {
            handleRecentSearchSelect(recentSearches[selectedIndex]);
          } else {
            const suggestionIndex = query.length === 0 ? selectedIndex - recentSearches.length : selectedIndex;
            if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
              handleSuggestionSelect(suggestions[suggestionIndex]);
            }
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get suggestion icon
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'product':
        return <Package className="w-4 h-4" />;
      case 'category':
        return <Hash className="w-4 h-4" />;
      case 'tag':
        return <Tag className="w-4 h-4" />;
      case 'brand':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const shouldShowDropdown = isOpen && (
    suggestions.length > 0 ||
    isLoading ||
    (query.length === 0 && recentSearches.length > 0 && showRecentSearches)
  );

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-slate-900 font-light transition-all duration-200 bg-white shadow-sm"
          aria-label="Search products"
          aria-expanded={shouldShowDropdown}
          aria-haspopup="listbox"
          role="combobox"
          autoComplete="off"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
              onSearch('');
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {shouldShowDropdown && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
          role="listbox"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-3 text-slate-500 text-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-400 mx-auto mb-2"></div>
              Searching...
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && query.length === 0 && recentSearches.length > 0 && showRecentSearches && (
            <>
              <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 bg-slate-50 border-b">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={search.query}
                  onClick={() => handleRecentSearchSelect(search)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3",
                    selectedIndex === index && "bg-slate-100"
                  )}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="flex-1 text-slate-700">{search.query}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(search.timestamp).toLocaleDateString()}
                  </span>
                </button>
              ))}
            </>
          )}

          {/* Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <>
              {query.length === 0 && recentSearches.length > 0 && (
                <div className="border-t border-slate-100" />
              )}

              <div className="px-4 py-2 text-xs uppercase tracking-wider text-slate-400 bg-slate-50 border-b">
                Suggestions
              </div>

              {suggestions.map((suggestion, index) => {
                const adjustedIndex = query.length === 0 && showRecentSearches ? index + recentSearches.length : index;

                return (
                  <button
                    key={`${suggestion.type}-${suggestion.text}`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={cn(
                      "w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center gap-3",
                      selectedIndex === adjustedIndex && "bg-slate-100"
                    )}
                    role="option"
                    aria-selected={selectedIndex === adjustedIndex}
                  >
                    <div className="text-slate-400">
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div className="flex-1">
                      <div className="text-slate-900">
                        <span dangerouslySetInnerHTML={{
                          __html: searchUtils.highlightText(suggestion.text, query)
                        }} />
                      </div>
                      <div className="text-xs text-slate-500 capitalize">
                        {suggestion.type}
                        {suggestion.count && ` • ${suggestion.count} items`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </>
          )}

          {/* No Results */}
          {!isLoading && query.length >= 2 && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <div className="text-sm">No suggestions found for "{query}"</div>
              <div className="text-xs text-slate-400 mt-1">
                Try different keywords or check spelling
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}