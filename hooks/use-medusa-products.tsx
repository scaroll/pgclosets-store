"use client"

import { useState } from "react"

// Stub types for removed Medusa integration
interface MedusaProduct {
  id: string
  title: string
}

// Stub hook - Medusa removed
export function useMedusaProducts(_params?: Record<string, unknown>) {
  const [products] = useState<MedusaProduct[]>([])
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return {
    products,
    loading,
    error,
    refetch: () => {},
  }
}

// Hook for fetching single product
export function useMedusaProduct(_handle: string) {
  const [product] = useState<MedusaProduct | null>(null)
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { product, loading, error }
}

// Hook for fetching collections
export function useMedusaCollections() {
  const [collections] = useState<unknown[]>([])
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { collections, loading, error }
}

// Hook for featured products
export function useFeaturedProducts() {
  const [products] = useState<MedusaProduct[]>([])
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)

  return { products, loading, error }
}
