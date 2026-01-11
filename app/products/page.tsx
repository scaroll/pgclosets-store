'use client'

import { ProductFilters } from '@/components/products/product-filters'
import { ProductSearch } from '@/components/products/product-search'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products';
import { getAllProducts } from '@/lib/products'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import * as React from 'react'

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [products, setProducts] = React.useState<Product[]>([])

  // Simulate filter/search logic client-side for now
  // Real implementation would pass params to API or filter server-side
  React.useEffect(() => {
    let result = getAllProducts()

    if (query) {
      const lowerQ = query.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(lowerQ) ||
          p.category.includes(lowerQ) ||
          p.description.toLowerCase().includes(lowerQ)
      )
    }

    setProducts(result)
  }, [query])

  const handleFilterChange = (filters: any) => {
    // In a real app, this would update URL params or refetch
    // For this mock, we can just apply simple client-side filtering if we wanted
    // But let's just log implementation debt
    console.log('Filters changed', filters)

    let result = getAllProducts()
    if (query) {
      // Re-apply query
      const lowerQ = query.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(lowerQ))
    }

    // Apply categories
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter(p =>
        filters.categories.some(
          (c: string) => p.category.toLowerCase().includes(c.toLowerCase().split(' ')[0]) // simplistic match
        )
      )
    }

    // Apply price
    if (filters.priceRange) {
      const [min, max] = filters.priceRange
      result = result.filter(p => p.price >= min && p.price <= max)
    }

    setProducts(result)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Product Catalog</h1>
        <ProductSearch className="w-full md:w-auto" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64">
          <div className="sticky top-20">
            <h2 className="mb-4 text-xl font-semibold">Filters</h2>
            <ProductFilters onFilterChange={handleFilterChange} />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No products found for "{query}". Try another search.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(product => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      {product.images && product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-1 text-lg font-medium group-hover:text-primary">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm capitalize text-gray-500">
                        {product.category.replace('-', ' ')}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-bold text-gray-900">${product.price}</span>
                        <Button size="sm" variant="secondary">
                          View
                        </Button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
