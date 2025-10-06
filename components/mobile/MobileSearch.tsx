'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mic,
  MicOff,
  X,
  Clock,
  TrendingUp,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileInput } from './MobileInput';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  image?: string;
  price?: number;
}

interface MobileSearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  onClose?: () => void;
  recentSearches?: string[];
  trendingSearches?: string[];
  className?: string;
}

/**
 * Mobile Search Component
 * Advanced mobile search with voice input and instant results
 * Features:
 * - Voice search with Web Speech API
 * - Instant search results
 * - Recent & trending searches
 * - Touch-optimized interface
 * - Keyboard optimization for mobile
 * - Search suggestions
 * - Fast, responsive autocomplete
 */
export function MobileSearch({
  onSearch,
  onClose,
  recentSearches = [],
  trendingSearches = [],
  className
}: MobileSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearchList, setRecentSearchList] = useState<string[]>(recentSearches);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        if (navigator.vibrate) navigator.vibrate(50);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');

        setQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (navigator.vibrate) navigator.vibrate(30);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      const searchResults = await onSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [onSearch]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch]);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert('Voice search is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleSearchSubmit = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updatedRecent = [searchQuery, ...recentSearchList.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearchList(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

      performSearch(searchQuery);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearchSubmit(suggestion);
  };

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const hasVoiceSupport = typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  return (
    <div className={cn('fixed inset-0 z-50 bg-white safe-area-inset', className)}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2 p-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-5 h-5" />
            </div>

            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(query);
                }
              }}
              placeholder="Search products..."
              className={cn(
                'w-full h-12 pl-12 pr-24 bg-gray-100 rounded-full',
                'text-base text-gray-900 placeholder-gray-500',
                'focus:outline-none focus:ring-2 focus:ring-pg-navy focus:bg-white',
                'transition-all duration-200'
              )}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {/* Input Actions */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              {/* Clear Button */}
              {query && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={handleClear}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors touch-manipulation"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              )}

              {/* Voice Search Button */}
              {hasVoiceSupport && (
                <button
                  onClick={handleVoiceSearch}
                  className={cn(
                    'p-2 rounded-full transition-all touch-manipulation',
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'hover:bg-gray-200 text-gray-600'
                  )}
                  aria-label={isListening ? 'Stop voice search' : 'Start voice search'}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Voice Listening Indicator */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 border-t border-red-200 px-4 py-3"
            >
              <div className="flex items-center justify-center space-x-2 text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Listening...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-72px)]">
        {/* Search Results */}
        {showResults && (
          <div className="p-4">
            {isSearching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-pg-navy animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600 mb-3">
                  {results.length} Results
                </h3>
                {results.map((result) => (
                  <motion.a
                    key={result.id}
                    href={`/products/${result.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex items-center space-x-3 p-3 rounded-lg',
                      'bg-white hover:bg-gray-50 border border-gray-200',
                      'transition-colors touch-manipulation',
                      'active:bg-gray-100'
                    )}
                  >
                    {result.image && (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </h4>
                      <p className="text-xs text-gray-600 truncate">
                        {result.category}
                      </p>
                    </div>
                    {result.price && (
                      <div className="text-sm font-semibold text-pg-navy">
                        ${result.price}
                      </div>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </motion.a>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No results found for "{query}"</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </div>
        )}

        {/* Suggestions */}
        {!showResults && (
          <div className="p-4 space-y-6">
            {/* Recent Searches */}
            {recentSearchList.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-900">
                    Recent Searches
                  </h3>
                </div>
                <div className="space-y-2">
                  {recentSearchList.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className={cn(
                        'flex items-center justify-between w-full p-3 rounded-lg',
                        'bg-gray-50 hover:bg-gray-100 text-left',
                        'transition-colors touch-manipulation',
                        'active:bg-gray-200'
                      )}
                    >
                      <span className="text-sm text-gray-900">{search}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {trendingSearches.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-900">
                    Trending Searches
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className={cn(
                        'px-4 py-2 rounded-full bg-pg-sky/10 text-pg-navy',
                        'text-sm font-medium',
                        'hover:bg-pg-sky/20 transition-colors touch-manipulation',
                        'active:bg-pg-sky/30'
                      )}
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileSearch;
