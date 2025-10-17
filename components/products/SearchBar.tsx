"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import {
  colors,
  spacing,
  shadows,
  radius,
  typography
} from '@/lib/design-tokens';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

interface SearchSuggestion {
  text: string;
  type: 'recent' | 'popular' | 'ai' | 'category';
  metadata?: any;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search products...',
  onSearch
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debouncedValue = useDebounce(value, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Fetch AI suggestions when query changes
  useEffect(() => {
    if (debouncedValue && debouncedValue.length > 2) {
      fetchAISuggestions(debouncedValue);
    } else {
      setAiSuggestions([]);
      updateSuggestions();
    }
  }, [debouncedValue]);

  // Update suggestions based on current state
  const updateSuggestions = useCallback(() => {
    const newSuggestions: SearchSuggestion[] = [];

    // Add AI suggestions
    if (aiSuggestions.length > 0) {
      aiSuggestions.forEach(suggestion => {
        newSuggestions.push({
          text: suggestion,
          type: 'ai'
        });
      });
    }

    // Add recent searches if no query
    if (!value && recentSearches.length > 0) {
      recentSearches.slice(0, 3).forEach(search => {
        newSuggestions.push({
          text: search,
          type: 'recent'
        });
      });
    }

    // Add popular searches
    if (!value || value.length < 3) {
      const popularSearches = [
        'Barn doors',
        'Bifold doors',
        'Mirror doors',
        'Room dividers'
      ];
      popularSearches.forEach(search => {
        if (!value || search.toLowerCase().includes(value.toLowerCase())) {
          newSuggestions.push({
            text: search,
            type: 'popular'
          });
        }
      });
    }

    // Add category suggestions
    if (value) {
      const categories = [
        'Barn Doors',
        'Bifold Doors',
        'Bypass Doors',
        'Pivot Doors',
        'Room Dividers',
        'Hardware',
        'Mirrors'
      ];
      categories.forEach(category => {
        if (category.toLowerCase().includes(value.toLowerCase())) {
          newSuggestions.push({
            text: `in ${category}`,
            type: 'category'
          });
        }
      });
    }

    setSuggestions(newSuggestions.slice(0, 8));
  }, [value, recentSearches, aiSuggestions]);

  // Fetch AI suggestions from API
  const fetchAISuggestions = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/products/search/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        const data = await response.json();
        setAiSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error fetching AI suggestions:', error);
      // Fallback to local suggestions
      const fallbackSuggestions = generateLocalSuggestions(query);
      setAiSuggestions(fallbackSuggestions);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate local suggestions as fallback
  const generateLocalSuggestions = (query: string): string[] => {
    const suggestions = [];
    const q = query.toLowerCase();

    // Smart suggestions based on query
    if (q.includes('modern')) {
      suggestions.push('Modern glass barn doors');
      suggestions.push('Modern bypass doors with aluminum frame');
    }
    if (q.includes('white')) {
      suggestions.push('White shaker style doors');
      suggestions.push('White frosted glass doors');
    }
    if (q.includes('small')) {
      suggestions.push('Bifold doors for small spaces');
      suggestions.push('Space-saving pocket doors');
    }
    if (q.includes('bedroom')) {
      suggestions.push('Bedroom closet doors');
      suggestions.push('Master bedroom sliding doors');
    }

    return suggestions.slice(0, 3);
  };

  // Handle search submission
  const handleSearch = (searchText: string) => {
    if (searchText.trim()) {
      // Save to recent searches
      const updatedRecent = [searchText, ...recentSearches.filter(s => s !== searchText)].slice(0, 10);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

      // Trigger search
      onChange(searchText);
      onSearch?.(searchText);
      setIsFocused(false);
      setSuggestions([]);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSearch(suggestions[selectedIndex].text);
      } else {
        handleSearch(value);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // Clear search
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setAiSuggestions([]);
    inputRef.current?.focus();
  };

  // Update suggestions when they change
  useEffect(() => {
    updateSuggestions();
  }, [updateSuggestions]);

  // Get icon for suggestion type
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent':
        return <Clock size={16} style={{ color: colors.gray[500] }} />;
      case 'popular':
        return <TrendingUp size={16} style={{ color: colors.brand.sky }} />;
      case 'ai':
        return <Sparkles size={16} style={{ color: colors.brand.navy }} />;
      case 'category':
        return <ArrowRight size={16} style={{ color: colors.gray[500] }} />;
      default:
        return <Search size={16} style={{ color: colors.gray[500] }} />;
    }
  };

  const showSuggestions = isFocused && (suggestions.length > 0 || isLoading);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 size={20} className="animate-spin" style={{ color: colors.gray[500] }} />
          ) : (
            <Search size={20} style={{ color: colors.gray[500] }} />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-200 text-base"
          style={{
            borderColor: isFocused ? colors.brand.navy : colors.gray[300],
            backgroundColor: isFocused ? 'white' : colors.gray[50],
            color: colors.gray[900],
            fontFamily: typography.fonts.body,
            boxShadow: isFocused ? shadows.md : 'none',
          }}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={18} style={{ color: colors.gray[500] }} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl overflow-hidden z-50"
            style={{
              boxShadow: shadows.xl,
              borderRadius: radius.xl,
            }}
          >
            {isLoading && suggestions.length === 0 ? (
              <div className="p-4 text-center" style={{ color: colors.gray[500] }}>
                <Loader2 size={20} className="animate-spin mx-auto mb-2" />
                <p className="text-sm">Searching...</p>
              </div>
            ) : (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={`${suggestion.type}-${suggestion.text}`}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      selectedIndex === index ? 'bg-gray-50' : ''
                    }`}
                    onClick={() => handleSearch(suggestion.text)}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.1 }}
                  >
                    {getSuggestionIcon(suggestion.type)}
                    <div className="flex-1 text-left">
                      <span
                        className="text-sm font-medium"
                        style={{ color: colors.gray[700] }}
                      >
                        {suggestion.text}
                      </span>
                      {suggestion.type === 'ai' && (
                        <span
                          className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full"
                        >
                          AI Suggested
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}