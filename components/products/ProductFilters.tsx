'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
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
    <div className="space-y-10">
      <div>
        <h3 className="mb-6 font-sf-display text-lg font-semibold tracking-tight text-foreground">
          Categories
        </h3>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              'apple-ease w-full justify-start rounded-xl px-4 py-2.5 text-[15px] font-medium transition-all hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-secondary',
              !currentCategory
                ? 'bg-apple-gray-100 text-foreground dark:bg-apple-dark-bg-secondary'
                : 'text-muted-foreground'
            )}
            onClick={() => updateParams('category', null)}
          >
            All Products
          </Button>
          {CATEGORIES.map(cat => (
            <Button
              key={cat.value}
              variant="ghost"
              className={cn(
                'apple-ease w-full justify-start rounded-xl px-4 py-2.5 text-[15px] font-medium transition-all hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-secondary',
                currentCategory === cat.value
                  ? 'bg-apple-gray-100 text-foreground dark:bg-apple-dark-bg-secondary'
                  : 'text-muted-foreground'
              )}
              onClick={() => updateParams('category', cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-6 font-sf-display text-lg font-semibold tracking-tight text-foreground">
          Sort By
        </h3>
        <Select value={currentSort} onValueChange={val => updateParams('sort', val)}>
          <SelectTrigger className="h-11 rounded-xl border-apple-gray-200 bg-background pl-4 text-[15px] transition-all focus:ring-apple-blue-500/20 hover:border-apple-gray-300">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-apple-gray-200 shadow-apple-lg">
            <SelectItem value="featured" className="rounded-lg">
              Featured
            </SelectItem>
            <SelectItem value="newest" className="rounded-lg">
              Newest Arrivals
            </SelectItem>
            <SelectItem value="price-asc" className="rounded-lg">
              Price: Low to High
            </SelectItem>
            <SelectItem value="price-desc" className="rounded-lg">
              Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
