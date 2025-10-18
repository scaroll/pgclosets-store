"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/types/commerce"
import { ArrowRight, Grid, Heart, Home, List, ShoppingCart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
// Simple price formatter
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(price / 100) // Convert from cents to dollars
}

interface SearchResultsProps {
  viewMode: string
  setViewMode: (mode: string) => void
  filteredResults: Product[]
  resultsCount: number
}

export function SearchResults({ 
  viewMode, 
  setViewMode, 
  filteredResults, 
  resultsCount 
}: SearchResultsProps) {
  return (
    <div>
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Search Results</h1>
          <p className="text-muted-foreground mt-1">
            {resultsCount} {resultsCount === 1 ? 'product' : 'products'} found
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results Grid/List */}
      {filteredResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Home className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria or browse our categories
          </p>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {filteredResults.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ProductCardProps {
  product: Product
  viewMode: string
}

function ProductCard({ product, viewMode }: ProductCardProps) {
  const price = product.variants?.[0]?.price || 0
  
  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="relative w-full sm:w-48 h-48 sm:h-32">
              <Image
                src={product.thumbnail || '/placeholder-product.jpg'}
                alt={product.title}
                fill
                className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
              />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">(4.8)</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl font-bold">
                      {formatPrice(price)}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" asChild>
                    <Link href={`/products/${product.handle}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
          <div className="relative w-full h-48">
            <Image
              src={product.thumbnail || '/placeholder-product.jpg'}
              alt={product.title}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">(4.8)</span>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold">
              {formatPrice(price)}
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" asChild>
              <Link href={`/products/${product.handle}`}>
                View Details
              </Link>
            </Button>
            <Button size="sm" variant="outline">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}