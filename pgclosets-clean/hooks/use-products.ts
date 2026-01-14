'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ReninProduct } from '@/lib/renin-product-loader';
import {
  ProductsResponse,
  ProductResponse,
  SearchParams,
  PaginationMeta,
  ProductStats,
  AppliedFilters
} from '@/lib/types/api';

// Cache for API responses
const responseCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Hook configuration
interface UseProductsConfig {
  cache?: boolean;
  cacheTTL?: number; // milliseconds
  retryAttempts?: number;
  retryDelay?: number; // milliseconds
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

// Hook state
interface UseProductsState {
  products: ReninProduct[];
  loading: boolean;
  error: Error | null;
  pagination: PaginationMeta | null;
  stats: ProductStats | null;
  filters: AppliedFilters | null;
  lastUpdated: Date | null;
}

// Default configuration
const defaultConfig: UseProductsConfig = {
  cache: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 1000
};

/**
 * Hook for fetching products with caching and error handling
 */
export function useProducts(params?: SearchParams, config?: UseProductsConfig) {
  const finalConfig = { ...defaultConfig, ...config };

  const [state, setState] = useState<UseProductsState>({
    products: [],
    loading: false,
    error: null,
    pagination: null,
    stats: null,
    filters: null,
    lastUpdated: null
  });

  // Generate cache key from parameters
  const cacheKey = useMemo(() => {
    return params ? `products_${JSON.stringify(params)}` : 'products_all';
  }, [params]);

  // Fetch products function
  const fetchProducts = useCallback(async (retryCount = 0): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check cache first
      if (finalConfig.cache) {
        const cached = responseCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
          setState(prev => ({
            ...prev,
            products: cached.data.products,
            pagination: cached.data.pagination,
            stats: cached.data.stats,
            filters: cached.data.filters,
            loading: false,
            lastUpdated: new Date(cached.timestamp)
          }));
          finalConfig.onSuccess?.(cached.data);
          return;
        }
      }

      // Build API URL
      const url = new URL('/api/products', window.location.origin);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              url.searchParams.set(key, value.join(','));
            } else {
              url.searchParams.set(key, String(value));
            }
          }
        });
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch products');
      }

      // Update state
      setState(prev => ({
        ...prev,
        products: data.data,
        pagination: data.pagination,
        stats: data.stats || null,
        filters: data.filters || null,
        loading: false,
        error: null,
        lastUpdated: new Date()
      }));

      // Cache the response
      if (finalConfig.cache) {
        responseCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: finalConfig.cacheTTL!
        });
        cleanCache();
      }

      finalConfig.onSuccess?.(data);

    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      // Retry logic
      if (retryCount < finalConfig.retryAttempts!) {
        setTimeout(() => {
          fetchProducts(retryCount + 1);
        }, finalConfig.retryDelay! * Math.pow(2, retryCount)); // Exponential backoff
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));

      finalConfig.onError?.(errorObj);
    }
  }, [params, cacheKey, finalConfig]);

  // Refresh function
  const refresh = useCallback(() => {
    if (finalConfig.cache) {
      responseCache.delete(cacheKey);
    }
    fetchProducts();
  }, [fetchProducts, cacheKey, finalConfig.cache]);

  // Load more products (for pagination)
  const loadMore = useCallback(() => {
    if (!state.pagination?.hasMore || state.loading) return;

    const newParams = {
      ...params,
      offset: (params?.offset || 0) + (params?.limit || 20)
    };

    // Create a new hook instance for loading more
    // This is a simplified approach - in practice, you might want to manage this differently
    fetchProducts();
  }, [params, state.pagination, state.loading, fetchProducts]);

  // Effect to fetch products when parameters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    refresh,
    loadMore,
    isLoadingMore: state.loading && state.products.length > 0
  };
}

/**
 * Hook for fetching a single product
 */
export function useProduct(id: string, config?: UseProductsConfig) {
  const finalConfig = { ...defaultConfig, ...config };

  const [state, setState] = useState<{
    product: ReninProduct | null;
    loading: boolean;
    error: Error | null;
    relatedProducts: ReninProduct[];
    lastUpdated: Date | null;
  }>({
    product: null,
    loading: false,
    error: null,
    relatedProducts: [],
    lastUpdated: null
  });

  const cacheKey = `product_${id}`;

  const fetchProduct = useCallback(async (retryCount = 0): Promise<void> => {
    if (!id) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check cache first
      if (finalConfig.cache) {
        const cached = responseCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
          setState(prev => ({
            ...prev,
            product: cached.data.product,
            relatedProducts: cached.data.relatedProducts || [],
            loading: false,
            lastUpdated: new Date(cached.timestamp)
          }));
          finalConfig.onSuccess?.(cached.data);
          return;
        }
      }

      const response = await fetch(`/api/products/${encodeURIComponent(id)}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch product');
      }

      setState(prev => ({
        ...prev,
        product: data.data,
        relatedProducts: data.relatedProducts || [],
        loading: false,
        error: null,
        lastUpdated: new Date()
      }));

      // Cache the response
      if (finalConfig.cache) {
        responseCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: finalConfig.cacheTTL!
        });
        cleanCache();
      }

      finalConfig.onSuccess?.(data);

    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      // Retry logic (except for 404s)
      if (retryCount < finalConfig.retryAttempts! && !errorObj.message.includes('not found')) {
        setTimeout(() => {
          fetchProduct(retryCount + 1);
        }, finalConfig.retryDelay! * Math.pow(2, retryCount));
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));

      finalConfig.onError?.(errorObj);
    }
  }, [id, cacheKey, finalConfig]);

  const refresh = useCallback(() => {
    if (finalConfig.cache) {
      responseCache.delete(cacheKey);
    }
    fetchProduct();
  }, [fetchProduct, cacheKey, finalConfig.cache]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    ...state,
    refresh
  };
}

/**
 * Hook for fetching featured products
 */
export function useFeaturedProducts(
  algorithm?: string,
  limit?: number,
  category?: string,
  config?: UseProductsConfig
) {
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (algorithm) searchParams.set('algorithm', algorithm);
    if (limit) searchParams.set('limit', String(limit));
    if (category) searchParams.set('category', category);
    return searchParams.toString();
  }, [algorithm, limit, category]);

  const finalConfig = { ...defaultConfig, ...config };

  const [state, setState] = useState<{
    products: ReninProduct[];
    loading: boolean;
    error: Error | null;
    algorithm: string;
    criteria: string;
    lastUpdated: Date | null;
  }>({
    products: [],
    loading: false,
    error: null,
    algorithm: algorithm || 'popular',
    criteria: '',
    lastUpdated: null
  });

  const cacheKey = `featured_${params}`;

  const fetchFeatured = useCallback(async (retryCount = 0): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check cache first
      if (finalConfig.cache) {
        const cached = responseCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp) < cached.ttl) {
          setState(prev => ({
            ...prev,
            products: cached.data.products,
            algorithm: cached.data.algorithm,
            criteria: cached.data.criteria,
            loading: false,
            lastUpdated: new Date(cached.timestamp)
          }));
          finalConfig.onSuccess?.(cached.data);
          return;
        }
      }

      const url = `/api/products/featured${params ? `?${params}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch featured products');
      }

      setState(prev => ({
        ...prev,
        products: data.data,
        algorithm: data.algorithm,
        criteria: data.criteria || '',
        loading: false,
        error: null,
        lastUpdated: new Date()
      }));

      // Cache the response
      if (finalConfig.cache) {
        responseCache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: finalConfig.cacheTTL!
        });
        cleanCache();
      }

      finalConfig.onSuccess?.(data);

    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));

      // Retry logic
      if (retryCount < finalConfig.retryAttempts!) {
        setTimeout(() => {
          fetchFeatured(retryCount + 1);
        }, finalConfig.retryDelay! * Math.pow(2, retryCount));
        return;
      }

      setState(prev => ({
        ...prev,
        loading: false,
        error: errorObj
      }));

      finalConfig.onError?.(errorObj);
    }
  }, [params, cacheKey, finalConfig]);

  const refresh = useCallback(() => {
    if (finalConfig.cache) {
      responseCache.delete(cacheKey);
    }
    fetchFeatured();
  }, [fetchFeatured, cacheKey, finalConfig.cache]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return {
    ...state,
    refresh
  };
}

/**
 * Hook for managing product cache
 */
export function useProductCache() {
  const clearCache = useCallback(() => {
    responseCache.clear();
  }, []);

  const clearCacheByKey = useCallback((key: string) => {
    responseCache.delete(key);
  }, []);

  const getCacheInfo = useCallback(() => {
    return {
      size: responseCache.size,
      keys: Array.from(responseCache.keys()),
      stats: Array.from(responseCache.entries()).map(([key, value]) => ({
        key,
        timestamp: new Date(value.timestamp),
        ttl: value.ttl,
        age: Date.now() - value.timestamp
      }))
    };
  }, []);

  return {
    clearCache,
    clearCacheByKey,
    getCacheInfo
  };
}

// Utility function to clean expired cache entries
function cleanCache() {
  const now = Date.now();
  for (const [key, { timestamp, ttl }] of responseCache.entries()) {
    if (now - timestamp > ttl) {
      responseCache.delete(key);
    }
  }
}