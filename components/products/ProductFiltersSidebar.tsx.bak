'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Search, X, ChevronDown, Check } from 'lucide-react'

export interface ProductFiltersSidebarProps {
  categories: string[]
  finishes: string[]
  selectedCategory: string
  selectedFinishes: string[]
  priceRange: [number, number]
  searchQuery: string
  onCategoryChange: (category: string) => void
  onFinishesChange: (finishes: string[]) => void
  onPriceRangeChange: (range: [number, number]) => void
  onSearchChange: (query: string) => void
}

export function ProductFiltersSidebar({
  categories,
  finishes,
  selectedCategory,
  selectedFinishes,
  priceRange,
  searchQuery,
  onCategoryChange,
  onFinishesChange,
  onPriceRangeChange,
  onSearchChange
}: ProductFiltersSidebarProps) {
  const [showAllFinishes, setShowAllFinishes] = useState(false)

  const displayedFinishes = showAllFinishes ? finishes : finishes.slice(0, 8)

  const handleFinishToggle = (finish: string) => {
    if (selectedFinishes.includes(finish)) {
      onFinishesChange(selectedFinishes.filter(f => f !== finish))
    } else {
      onFinishesChange([...selectedFinishes, finish])
    }
  }

  const handleClearFinishes = () => {
    onFinishesChange([])
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card variant="outline" spacing="sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card variant="outline" spacing="none">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <ScrollArea className="h-auto max-h-[300px]">
            <div className="space-y-0.5">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors',
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span>{category}</span>
                  {selectedCategory === category && (
                    <Check className="h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card variant="outline" spacing="none">
        <CardHeader className="border-b px-4 py-3">
          <CardTitle className="text-sm font-semibold uppercase tracking-wide">
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              min={0}
              max={2000}
              step={50}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Min:</span>
                <span className="font-semibold">${priceRange[0]}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Max:</span>
                <span className="font-semibold">${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Finishes */}
      <Card variant="outline" spacing="none">
        <CardHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">
              Finishes
            </CardTitle>
            {selectedFinishes.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFinishes}
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                Clear
              </Button>
            )}
          </div>
          {selectedFinishes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedFinishes.map((finish) => (
                <Badge
                  key={finish}
                  variant="secondary"
                  className="gap-1 pr-1"
                >
                  <span className="text-xs">{finish}</span>
                  <button
                    onClick={() => handleFinishToggle(finish)}
                    className="hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-2">
          <ScrollArea className="h-auto max-h-[300px]">
            <div className="space-y-0.5">
              {displayedFinishes.map((finish) => (
                <button
                  key={finish}
                  onClick={() => handleFinishToggle(finish)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                    selectedFinishes.includes(finish)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                      selectedFinishes.includes(finish)
                        ? 'bg-primary border-primary'
                        : 'border-muted-foreground/25'
                    )}
                  >
                    {selectedFinishes.includes(finish) && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="flex-1">{finish}</span>
                </button>
              ))}
            </div>
          </ScrollArea>

          {finishes.length > 8 && (
            <>
              <Separator className="my-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllFinishes(!showAllFinishes)}
                className="w-full gap-2 text-sm"
              >
                {showAllFinishes ? 'Show less' : `Show all (${finishes.length})`}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    showAllFinishes && 'rotate-180'
                  )}
                />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Filter summary */}
      {(selectedCategory !== 'All' || selectedFinishes.length > 0) && (
        <Card variant="outline" className="bg-muted/50">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              {selectedFinishes.length + (selectedCategory !== 'All' ? 1 : 0)}{' '}
              active filter{selectedFinishes.length + (selectedCategory !== 'All' ? 1 : 0) !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
