"use client"

import { useState } from "react"

// Stub hook - Medusa removed
export function useMedusaProducts(_params?: any) {
  const [products, _setProducts] = useState<any[]>([])
  const [loading, _setLoading] = useState(false)
  const [error, _setError] = useState<string | null>(null)

  return {
    products,
    loading,
    error,
    refetch: () => {},
  }
}

// Hook for fetching single product
export function useMedusaProduct(_handle: string) {
  const [product, _setProduct] = useState<any | null>(null)
  const [loading, _setLoading] = useState(false)
  const [error, _setError] = useState<string | null>(null)

  return { product, loading, error }
}

// Hook for fetching collections
export function useMedusaCollections() {
  const [collections, _setCollections] = useState<any[]>([])
  const [loading, _setLoading] = useState(false)
  const [error, _setError] = useState<string | null>(null)

  return { collections, loading, error }
}

// Hook for featured products
export function useFeaturedProducts() {
  const [products, _setProducts] = useState<any[]>([])
  const [loading, _setLoading] = useState(false)
  const [error, _setError] = useState<string | null>(null)

  return { products, loading, error }
}
