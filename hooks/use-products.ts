"use client"

import { useMemo, useState, useEffect } from "react"
import useSWR from "swr"
import { usePerformanceTracking } from "@/components/performance/performance-monitor"

// Simple product data interface from JSON
interface SimpleProduct {
  id?: string
  title?: string
  description?: string
  price?: number
  category?: string
  image?: string
  featured?: boolean
  inStock?: boolean
  specifications?: Record<string, string>
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  image: string
  featured?: boolean
  inStock?: boolean
  specifications?: Record<string, string>
}

interface ProductFilters {
  search?: string
  category?: string
  sortBy?: 'name' | 'price-low' | 'price-high' | 'featured'
  inStockOnly?: boolean
  priceRange?: [number, number]
}

interface UseProductsOptions {
  filters?: ProductFilters
  enableCache?: boolean
  refreshInterval?: number
}

// Simple in-memory cache for product data
const productCache = new Map<string, { data: Product[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Simulate API fetcher - replace with actual API call
const productFetcher = async (url: string): Promise<Product[]> => {
  // Check cache first
  const cached = productCache.get(url)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100))

  // Import the JSON data (in real app, this would be an API call)
  const products = await import("@/data/simple-products.json").then(module => module.default)

  // Transform and validate data
  const transformedProducts: Product[] = (products as SimpleProduct[]).map(product => ({
    id: product.id || Math.random().toString(36),
    title: product.title || 'Untitled Product',
    description: product.description || '',
    price: product.price || 0,
    category: product.category || 'Uncategorized',
    image: product.image || '/placeholder.svg',
    featured: product.featured || false,
    inStock: product.inStock !== false, // Default to true if not specified
    specifications: product.specifications || {}
  }))

  // Cache the result
  productCache.set(url, {
    data: transformedProducts,
    timestamp: Date.now()
  })

  return transformedProducts
}

export function useProducts(options: UseProductsOptions = {}) {
  const { filters = {}, enableCache = true, refreshInterval = 0 } = options
  const { trackEvent } = usePerformanceTracking()

  // Create cache key based on filters
  const cacheKey = useMemo(() => {
    const key = `/api/products?${new URLSearchParams(
      Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    ).toString()}`
    return key
  }, [filters])

  // SWR configuration
  const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval,
    dedupingInterval: 30000, // 30 seconds
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    onSuccess: (data: Product[]) => {
      trackEvent('products_loaded', 0, {
        product_count: data.length,
        cache_key: cacheKey,
        from_cache: !!productCache.get(cacheKey)
      })
    },
    onError: (error: Error) => {
      trackEvent('products_load_error', 0, {
        error_message: error.message,
        cache_key: cacheKey
      })
    }
  }

  // Fetch data with SWR
  const { data: rawProducts, error, isLoading, mutate } = useSWR<Product[]>(
    enableCache ? cacheKey : null,
    productFetcher,
    swrConfig
  )

  // Filter and sort products
  const products = useMemo(() => {
    if (!rawProducts) return []

    const startTime = performance.now()

    let filtered = rawProducts

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      )
    }

    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock)
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      filtered = filtered.filter(product => product.price >= min && product.price <= max)
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return a.price - b.price
          case 'price-high':
            return b.price - a.price
          case 'featured':
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1
            return a.title.localeCompare(b.title)
          case 'name':
          default:
            return a.title.localeCompare(b.title)
        }
      })
    }

    const endTime = performance.now()
    trackEvent('products_filtered', endTime - startTime, {
      total_products: rawProducts.length,
      filtered_products: filtered.length,
      search_term: filters.search || '',
      category: filters.category || 'all',
      sort_by: filters.sortBy || 'name'
    })

    return filtered
  }, [rawProducts, filters, trackEvent])

  // Get unique categories
  const categories = useMemo(() => {
    if (!rawProducts) return []
    return [...new Set(rawProducts.map(product => product.category))].sort()
  }, [rawProducts])

  // Get price range
  const priceRange = useMemo(() => {
    if (!rawProducts || rawProducts.length === 0) return [0, 0]
    const prices = rawProducts.map(product => product.price)
    return [Math.min(...prices), Math.max(...prices)]
  }, [rawProducts])

  // Stats
  const stats = useMemo(() => {
    if (!rawProducts) return null
    return {
      total: rawProducts.length,
      filtered: products.length,
      inStock: rawProducts.filter(p => p.inStock).length,
      featured: rawProducts.filter(p => p.featured).length,
      categories: categories.length
    }
  }, [rawProducts, products, categories])

  return {
    products,
    categories,
    priceRange,
    stats,
    isLoading,
    error,
    mutate, // For manual revalidation
    // Helper methods
    refresh: () => mutate(),
    clearCache: () => {
      productCache.clear()
      mutate()
    }
  }
}

// Hook for single product
export function useProduct(id: string) {
  const { products, isLoading, error } = useProducts()
  const { trackEvent } = usePerformanceTracking()

  const product = useMemo(() => {
    const found = products.find(p => p.id === id)
    if (found) {
      trackEvent('product_loaded', 0, {
        product_id: id,
        product_title: found.title,
        product_category: found.category
      })
    }
    return found
  }, [products, id, trackEvent])

  return {
    product,
    isLoading,
    error,
    notFound: !isLoading && !error && !product
  }
}

// Hook for featured products
export function useFeaturedProducts(limit = 6) {
  const { products, isLoading, error } = useProducts()

  const featuredProducts = useMemo(() => {
    return products
      .filter(product => product.featured)
      .slice(0, limit)
  }, [products, limit])

  return {
    products: featuredProducts,
    isLoading,
    error
  }
}

// Hook for product search with debouncing
export function useProductSearch(searchTerm: string, debounceMs = 300) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchTerm, debounceMs])

  return useProducts({
    filters: { search: debouncedSearch }
  })
}