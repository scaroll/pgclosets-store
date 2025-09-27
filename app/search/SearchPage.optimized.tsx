"use client"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { getProducts } from "@/lib/actions/commerce"
import { Product } from "@/types/commerce"
import { SearchFilters } from "@/components/search/SearchFilters"
import { SearchResults } from "@/components/search/SearchResults"
import { SearchHeader } from "@/components/search/SearchHeader"
import { SearchBreadcrumb } from "@/components/search/SearchBreadcrumb"

function SearchContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getProducts({ 
        query: searchQuery, 
        collection: selectedCategory === 'All Categories' ? undefined : selectedCategory 
      })
      setProducts(fetchedProducts)
    }
    fetchProducts()
  }, [searchQuery, selectedCategory])

  const handleSearch = () => {
    // Trigger search when filters change
  }

  const filteredResults = products.filter((product) => {
    const matchesPrice = (product.variants[0]?.price || 0) >= priceRange[0] && 
                        (product.variants[0]?.price || 0) <= priceRange[1]
    const matchesFeatures = selectedFeatures.length === 0 ||
      (product.tags &&
        selectedFeatures.some((feature) =>
          product.tags.some((productTag) => 
            productTag.toLowerCase().includes(feature.toLowerCase())
          )
        ))

    return matchesPrice && matchesFeatures
  })

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0)
      case "price-high":
        return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0)
      case "rating":
        return 0 // No rating data yet
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <SearchBreadcrumb 
        searchQuery={searchQuery}
        resultsCount={sortedResults.length}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              onSearch={handleSearch}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <SearchResults
              viewMode={viewMode}
              setViewMode={setViewMode}
              filteredResults={sortedResults}
              resultsCount={sortedResults.length}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  )
}