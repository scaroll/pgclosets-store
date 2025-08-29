"use client"

import { useState, useEffect, useCallback } from "react"
import { medusaProducts } from "@/lib/medusa-products"
import type { Product, ProductCollection } from "@medusajs/medusa"

// Hook for fetching products
export function useMedusaProducts(params?: {
  category?: string
  collection_id?: string
  tags?: string[]
  limit?: number
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const fetchedProducts = await medusaProducts.getProducts(params)
      setProducts(fetchedProducts)
    } catch (err) {
      setError("Failed to fetch products")
      console.error("Products fetch error:", err)
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

// Hook for fetching single product
export function useMedusaProduct(handle: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProduct() {
      if (!handle) return

      try {
        setLoading(true)
        const fetchedProduct = await medusaProducts.getProductByHandle(handle)
        setProduct(fetchedProduct)
      } catch (err) {
        setError("Failed to fetch product")
        console.error("Product fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [handle])

  return { product, loading, error }
}

// Hook for fetching collections
export function useMedusaCollections() {
  const [collections, setCollections] = useState<ProductCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCollections() {
      try {
        setLoading(true)
        const fetchedCollections = await medusaProducts.getCollections()
        setCollections(fetchedCollections)
      } catch (err) {
        setError("Failed to fetch collections")
        console.error("Collections fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCollections()
  }, [])

  return { collections, loading, error }
}

// Hook for featured products
export function useFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true)
        const fetchedProducts = await medusaProducts.getFeaturedProducts()
        setProducts(fetchedProducts)
      } catch (err) {
        setError("Failed to fetch featured products")
        console.error("Featured products fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  return { products, loading, error }
}
