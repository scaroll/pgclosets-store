"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Search, Filter } from "lucide-react"

interface SearchFiltersProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  priceRange: number[]
  setPriceRange: (range: number[]) => void
  selectedFeatures: string[]
  setSelectedFeatures: React.Dispatch<React.SetStateAction<string[]>>
  sortBy: string
  setSortBy: (sort: string) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  onSearch: () => void
}

const categories = ["All Categories", "Barn Doors", "Walk-In Closets", "Reach-In Closets", "Hardware", "Accessories"]
const features = ["LED Lighting", "Soft-Close", "Custom Sizing", "Premium Materials", "Quick Install", "Adjustable"]

export function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  selectedFeatures,
  setSelectedFeatures,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  onSearch
}: SearchFiltersProps) {
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev: string[]) => 
      prev.includes(feature) 
        ? prev.filter((f: string) => f !== feature)
        : [...prev, feature]
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("All Categories")
    setPriceRange([0, 500000])
    setSelectedFeatures([])
    setSortBy("relevance")
  }

  return (
    <>
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for closet doors, hardware, accessories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="pl-10 pr-4 py-3 text-base"
        />
        <Button
          onClick={onSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          size="sm"
        >
          Search
        </Button>
      </div>

      {/* Filter Toggle Button - Mobile */}
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters {selectedFeatures.length > 0 && `(${selectedFeatures.length})`}
        </Button>
      </div>

      {/* Filters Sidebar */}
      <div className={`lg:block ${showFilters ? 'block' : 'hidden'} mb-6 lg:mb-0`}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
              <label className="text-sm font-medium mb-3 block">
                Price Range: ${priceRange[0]/100} - ${priceRange[1]/100}
              </label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={500000}
                min={0}
                step={5000}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Features */}
            <div>
              <label className="text-sm font-medium mb-3 block">Features</label>
              <div className="space-y-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={selectedFeatures.includes(feature)}
                      onCheckedChange={() => handleFeatureToggle(feature)}
                    />
                    <label htmlFor={feature} className="text-sm">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-2 block">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}