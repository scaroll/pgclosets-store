'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ReninProduct } from '@/lib/renin-product-loader';
import {
  SearchResponse,
  SearchParams,
  SearchFacet,
  SortField,
  SortOrder,
  PaginationMeta,
  AppliedFilters
} from '@/lib/types/api';

// Search state interface
interface SearchState {
  products: ReninProduct[];
  loading: boolean;
  error: Error | null;
  facets: SearchFacet[];
  suggestions: string[];
  correctedQuery?: string;
  pagination: PaginationMeta | null;
  filters: AppliedFilters | null;
  searchTime: number;
  lastQuery: string;
  lastUpdated: Date | null;
}

// Search configuration
interface UseProductSearchConfig {
  debounceMs?: number;
  minQueryLength?: number;
  enableFacets?: boolean;
  enableSuggestions?: boolean;
  enableCorrection?: boolean;
  autoSearch?: boolean; // Automatically search when query changes
  cache?: boolean;
  cacheTTL?: number;
  onSearchStart?: () => void;
  onSearchComplete?: (results: SearchResponse) => void;
  onSearchError?: (error: Error) => void;
}

// Default configuration
const defaultConfig: UseProductSearchConfig = {
  debounceMs: 300,
  minQueryLength: 2,
  enableFacets: true,
  enableSuggestions: true,
  enableCorrection: true,
  autoSearch: true,
  cache: true,
  cacheTTL: 5 * 60 * 1000 // 5 minutes
};

// Search cache
const searchCache = new Map<string, { data: SearchResponse; timestamp: number; ttl: number }>();

/**
 * Advanced product search hook with debouncing, faceting, and caching
 */
export function useProductSearch(initialParams?: Partial<SearchParams>, config?: UseProductSearchConfig) {
  const finalConfig = { ...defaultConfig, ...config };

  // Search state
  const [state, setState] = useState<SearchState>({
    products: [],
    loading: false,
    error: null,
    facets: [],
    suggestions: [],
    correctedQuery: undefined,
    pagination: null,
    filters: null,
    searchTime: 0,
    lastQuery: '',
    lastUpdated: null
  });

  // Search parameters
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
    limit: 20,
    offset: 0,
    ...initialParams
  });

  // Refs for debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchAbortControllerRef = useRef<AbortController | null>(null);

  // Generate cache key
  const cacheKey = useMemo(() => {
    return `search_${JSON.stringify(searchParams)}`;
  }, [searchParams]);

  // Debounced search function
  const debouncedSearch = useCallback(() => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      if (searchParams.query && searchParams.query.length >= finalConfig.minQueryLength!) {
        performSearch();
      } else if (!searchParams.query) {
        // Clear results when query is empty
        setState(prev => ({
          ...prev,
          products: [],
          facets: [],
          suggestions: [],
          correctedQuery: undefined,
          pagination: null,
          filters: null,
          searchTime: 0,
          lastQuery: '',
          error: null
        }));
      }
    }, finalConfig.debounceMs);
  }, [searchParams, finalConfig.debounceMs, finalConfig.minQueryLength]);

  // Perform search function
  const performSearch = useCallback(async (): Promise<void> => {
    // Abort previous request
    if (searchAbortControllerRef.current) {
      searchAbortControllerRef.current.abort();
    }

    // Create new abort controller
    const abortController = new AbortController();
    searchAbortControllerRef.current = abortController;

    setState(prev => ({ ...prev, loading: true, error: null }));
    finalConfig.onSearchStart?.();

    try {
      // Check cache first
      if (finalConfig.cache) {
        const cached = searchCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
          setState(prev => ({
            ...prev,
            products: cached.data.data,
            facets: cached.data.facets || [],
            suggestions: cached.data.suggestions || [],
            correctedQuery: cached.data.correctedQuery,
            pagination: cached.data.pagination,
            filters: cached.data.filters || null,
            searchTime: cached.data.searchTime,
            lastQuery: searchParams.query || '',
            loading: false,
            lastUpdated: new Date(cached.timestamp)
          }));
          finalConfig.onSearchComplete?.(cached.data);
          return;
        }
      }

      // Build search URL
      const url = new URL('/api/products/search', window.location.origin);
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            url.searchParams.set(key, value.join(','));
          } else {
            url.searchParams.set(key, String(value));
          }
        }
      });

      const response = await fetch(url.toString(), {
        signal: abortController.signal
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      // Update state
      setState(prev => ({
        ...prev,
        products: data.data,
        facets: finalConfig.enableFacets ? (data.facets || []) : [],
        suggestions: finalConfig.enableSuggestions ? (data.suggestions || []) : [],
        correctedQuery: finalConfig.enableCorrection ? data.correctedQuery : undefined,
        pagination: data.pagination,
        filters: data.filters || null,
        searchTime: data.searchTime,
        lastQuery: searchParams.query || '',
        loading: false,
        error: null,
        lastUpdated: new Date()
      }));

      // Cache the response
      if (finalConfig.cache) {
        searchCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: finalConfig.cacheTTL!
        });
        cleanSearchCache();
      }

      finalConfig.onSearchComplete?.(data);

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Request was aborted, ignore
        return;
      }

      const errorObj = error instanceof Error ? error : new Error(String(error));

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));

      finalConfig.onSearchError?.(errorObj);
    }
  }, [searchParams, cacheKey, finalConfig]);

  // Search execution based on auto-search setting
  useEffect(() => {
    if (finalConfig.autoSearch) {
      debouncedSearch();
    }

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (searchAbortControllerRef.current) {
        searchAbortControllerRef.current.abort();
      }
    };
  }, [debouncedSearch, finalConfig.autoSearch]);

  // Update search query
  const setQuery = useCallback((query: string) => {
    setSearchParams(prev => ({
      ...prev,
      query,
      offset: 0 // Reset pagination when query changes
    }));
  }, []);

  // Update filters
  const setFilters = useCallback((filters: Partial<SearchParams>) => {
    setSearchParams(prev => ({
      ...prev,
      ...filters,
      offset: 0 // Reset pagination when filters change
    }));
  }, []);

  // Update sorting
  const setSorting = useCallback((sortBy: SortField, sortOrder: SortOrder = 'desc') => {
    setSearchParams(prev => ({
      ...prev,
      sortBy,
      sortOrder,
      offset: 0 // Reset pagination when sorting changes
    }));
  }, []);

  // Load more results (pagination)
  const loadMore = useCallback(() => {
    if (!state.pagination?.hasMore || state.loading) return;

    setSearchParams(prev => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 20)
    }));
  }, [state.pagination, state.loading]);

  // Go to specific page
  const goToPage = useCallback((page: number) => {
    const limit = searchParams.limit || 20;
    const offset = (page - 1) * limit;

    setSearchParams(prev => ({
      ...prev,
      offset
    }));
  }, [searchParams.limit]);

  // Manual search trigger
  const search = useCallback(() => {
    performSearch();
  }, [performSearch]);

  // Clear search
  const clear = useCallback(() => {
    setSearchParams({
      query: '',
      sortBy: 'relevance',
      sortOrder: 'desc',
      limit: 20,
      offset: 0
    });
    setState(prev => ({
      ...prev,
      products: [],
      facets: [],
      suggestions: [],
      correctedQuery: undefined,
      pagination: null,
      filters: null,
      searchTime: 0,
      lastQuery: '',
      error: null
    }));
  }, []);

  // Refresh search (clear cache and re-search)
  const refresh = useCallback(() => {
    if (finalConfig.cache) {
      searchCache.delete(cacheKey);
    }
    performSearch();
  }, [performSearch, cacheKey, finalConfig.cache]);

  // Apply suggestion
  const applySuggestion = useCallback((suggestion: string) => {
    setQuery(suggestion);
  }, [setQuery]);

  // Apply facet filter
  const applyFacetFilter = useCallback((facet: SearchFacet, value: string, selected: boolean) => {
    setSearchParams(prev => {
      const newParams = { ...prev };

      switch (facet.field) {
        case 'product_type':
          newParams.type = selected ? value : undefined;
          break;
        case 'tags':
          const currentTags = newParams.tags || [];
          if (selected) {
            newParams.tags = [...currentTags, value];
          } else {
            newParams.tags = currentTags.filter(tag => tag !== value);
          }
          break;
        default:
          // Handle custom facet fields
          break;
      }

      newParams.offset = 0; // Reset pagination
      return newParams;
    });
  }, []);

  // Remove filter
  const removeFilter = useCallback((filterType: keyof SearchParams) => {
    setSearchParams(prev => {
      const newParams = { ...prev };
      delete newParams[filterType];
      newParams.offset = 0; // Reset pagination
      return newParams;
    });
  }, []);

  return {
    // State
    ...state,

    // Search parameters
    searchParams,

    // Actions
    setQuery,
    setFilters,
    setSorting,
    loadMore,
    goToPage,
    search,
    clear,
    refresh,
    applySuggestion,
    applyFacetFilter,
    removeFilter,

    // Computed values
    hasResults: state.products.length > 0,
    hasMore: state.pagination?.hasMore || false,
    isLoadingMore: state.loading && state.products.length > 0,
    isEmpty: !state.loading && state.products.length === 0 && state.lastQuery.length > 0,
    currentPage: state.pagination ? Math.floor((state.pagination.offset / state.pagination.limit) + 1) : 1,
    totalPages: state.pagination?.totalPages || 0
  };
}

/**
 * Hook for search suggestions only (lightweight)
 */
export function useSearchSuggestions(query: string, config?: { debounceMs?: number; minLength?: number }) {
  const finalConfig = { debounceMs: 200, minLength: 2, ...config };

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = useCallback(async () => {
    if (!query || query.length < finalConfig.minLength) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const url = new URL('/api/products/search', window.location.origin);
      url.searchParams.set('query', query);
      url.searchParams.set('limit', '0'); // We only want suggestions, not products

      const response = await fetch(url.toString());
      const data: SearchResponse = await response.json();

      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [query, finalConfig.minLength]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(fetchSuggestions, finalConfig.debounceMs);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [fetchSuggestions, finalConfig.debounceMs]);

  return {
    suggestions,
    loading
  };
}

/**
 * Hook for search analytics (track user behavior)
 */
export function useSearchAnalytics() {
  const trackSearch = useCallback((query: string, resultsCount: number, filters?: AppliedFilters) => {
    // In a real application, this would send analytics data to your tracking service
    const analyticsData = {
      event: 'product_search',
      query,
      resultsCount,
      filters,
      timestamp: new Date().toISOString(),
      sessionId: sessionStorage.getItem('sessionId') || 'anonymous'
    };

    // Example: Send to analytics service
    console.log('Search Analytics:', analyticsData);

    // You could send this to Google Analytics, Mixpanel, etc.
    // gtag('event', 'search', { search_term: query, results_count: resultsCount });
  }, []);

  const trackClick = useCallback((productId: string, query: string, position: number) => {
    const analyticsData = {
      event: 'search_result_click',
      productId,
      query,
      position,
      timestamp: new Date().toISOString()
    };

    console.log('Click Analytics:', analyticsData);
  }, []);

  return {
    trackSearch,
    trackClick
  };
}

// Utility function to clean expired cache entries
function cleanSearchCache() {
  const now = Date.now();
  for (const [key, { timestamp, ttl }] of searchCache.entries()) {
    if (now - timestamp > ttl) {
      searchCache.delete(key);
    }
  }
}