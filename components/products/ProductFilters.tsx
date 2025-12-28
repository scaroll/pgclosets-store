'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES = [
  { value: 'barn-doors', label: 'Barn Doors' },
  { value: 'bifold-doors', label: 'Bifold Doors' },
  { value: 'hardware', label: 'Hardware' },
  { value: 'closet-systems', label: 'Closet Systems' },
]

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get('category')
  const currentSort = searchParams.get('sort') || 'featured'

  // Helper to update URL params
  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="space-y-2">
          <Button
            variant={!currentCategory ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => updateParams('category', null)}
          >
            All Products
          </Button>
          {CATEGORIES.map(cat => (
            <Button
              key={cat.value}
              variant={currentCategory === cat.value ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => updateParams('category', cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Sort By</h3>
        <Select value={currentSort} onValueChange={val => updateParams('sort', val)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest Arrivals</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
