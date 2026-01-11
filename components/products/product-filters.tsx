'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import * as React from 'react'

interface ProductFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  onFilterChange: (filters: any) => void
}

export function ProductFilters({ className, onFilterChange, ...props }: ProductFiltersProps) {
  const [priceRange, setPriceRange] = React.useState([0, 2000])
  const [categories, setCategories] = React.useState<string[]>([])

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...categories, category]
      : categories.filter(c => c !== category)

    setCategories(newCategories)
    onFilterChange({ categories: newCategories, priceRange })
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <div>
        <h3 className="mb-4 text-lg font-semibold">Categories</h3>
        <div className="space-y-3">
          {['Barn Doors', 'Bifold Doors', 'Bypass Doors', 'Hardware'].map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                onCheckedChange={checked => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category}>{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
        <Slider
          defaultValue={[0, 2000]}
          max={2000}
          step={50}
          value={priceRange}
          onValueChange={setPriceRange}
          onValueCommit={value => onFilterChange({ categories, priceRange: value })}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>
    </div>
  )
}
