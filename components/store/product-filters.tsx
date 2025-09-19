"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import type { ProductCategory } from "@/lib/enhanced-renin-products"
import { Button } from "../ui/button"

interface ProductFiltersProps {
  categories: ProductCategory[]
  selectedCategory?: string
  currentSearch?: string
  currentSort?: string
}

function ProductFiltersContent({ categories, selectedCategory, currentSearch, currentSort }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilters = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/store/products?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-h3 mb-4">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilters("category", null)}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              !selectedCategory ? "bg-pg-sky text-white" : "hover:bg-pg-sky/10 text-pg-gray"
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => updateFilters("category", category.id)}
              className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id ? "bg-pg-sky text-white" : "hover:bg-pg-sky/10 text-pg-gray"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-h3 mb-4">Sort By</h3>
        <select
          value={currentSort || "featured"}
          onChange={(e) => updateFilters("sort", e.target.value)}
          className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
        >
          <option value="featured">Featured First</option>
          <option value="name">Name A-Z</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {(selectedCategory || currentSearch || currentSort) && (
        <div>
          <Button variant="secondary" size="sm" onClick={() => router.push("/store/products")} className="w-full">
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}

export function ProductFilters({ categories, selectedCategory, currentSearch, currentSort }: ProductFiltersProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <ProductFiltersContent 
        categories={categories}
        selectedCategory={selectedCategory}
        currentSearch={currentSearch}
        currentSort={currentSort}
      />
    </Suspense>
  )
}
