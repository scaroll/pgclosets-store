"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Star, Search, X, Grid, List, Heart, ShoppingCart, ArrowRight, Home, Filter } from "lucide-react"
import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

// Mock search results
const searchResults = [
  {
    id: 1,
    name: "Premium Barn Door System",
    category: "Barn Doors",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviews: 127,
    image: "/elegant-barn-door-closet.png",
    badge: "Bestseller",
    description: "Rustic elegance meets modern engineering with whisper-quiet hardware",
    features: ["Soft-close mechanism", "Premium wood finish", "Easy installation"],
    inStock: true,
    tags: ["barn door", "sliding", "rustic", "modern"],
  },
  {
    id: 2,
    name: "Luxury Walk-In System",
    category: "Walk-In Closets",
    price: 2499,
    originalPrice: null,
    rating: 5.0,
    reviews: 89,
    image: "/luxury-walk-in-closet.png",
    badge: "Premium",
    description: "Complete luxury organization solution with custom lighting",
    features: ["LED lighting system", "Custom shelving", "Premium materials"],
    inStock: true,
    tags: ["walk-in", "luxury", "lighting", "custom"],
  },
  {
    id: 3,
    name: "Smart Reach-In Solution",
    category: "Reach-In Closets",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 203,
    image: "/modern-reach-in-closet.png",
    badge: "Smart Choice",
    description: "Maximize every inch with intelligent storage solutions",
    features: ["Double storage capacity", "Adjustable shelving", "Quick install"],
    inStock: true,
    tags: ["reach-in", "smart", "storage", "compact"],
  },
]

const categories = ["All Categories", "Barn Doors", "Walk-In Closets", "Reach-In Closets", "Hardware", "Accessories"]
const priceRanges = [
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 - $1,000", min: 500, max: 1000 },
  { label: "$1,000 - $2,000", min: 1000, max: 2000 },
  { label: "$2,000+", min: 2000, max: 10000 },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("relevance")
  const [viewMode, setViewMode] = useState("grid")
  const [showFilters, setShowFilters] = useState(false)

  const features = ["LED Lighting", "Soft-Close", "Custom Sizing", "Premium Materials", "Quick Install", "Adjustable"]

  const filteredResults = searchResults.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesFeatures =
      selectedFeatures.length === 0 ||
      (product.features &&
        selectedFeatures.some((feature) =>
          product.features.some((productFeature) => productFeature.toLowerCase().includes(feature.toLowerCase())),
        ))

    return matchesSearch && matchesCategory && matchesPrice && matchesFeatures
  })

  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center relative">
                <Home className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground font-serif">PG Closets</span>
                <p className="text-xs text-muted-foreground">Premium Home Organization</p>
              </div>
            </Link>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products, categories, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="relative hover:bg-accent/20">
                <ShoppingCart className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">
              Search {searchQuery && `"${searchQuery}"`} ({sortedResults.length} results)
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif flex items-center justify-between">
                  Filters
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)} className="lg:hidden">
                    <X className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Category</h4>
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
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={5000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <div key={range.label} className="flex items-center space-x-2">
                        <Checkbox
                          id={range.label}
                          checked={priceRange[0] === range.min && priceRange[1] === range.max}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setPriceRange([range.min, range.max])
                            }
                          }}
                        />
                        <label htmlFor={range.label} className="text-sm text-muted-foreground cursor-pointer">
                          {range.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Features Filter */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Features</h4>
                  <div className="space-y-2">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFeatures([...selectedFeatures, feature])
                            } else {
                              setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))
                            }
                          }}
                        />
                        <label htmlFor={feature} className="text-sm text-muted-foreground cursor-pointer">
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Clear Filters */}
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSelectedCategory("All Categories")
                    setPriceRange([0, 5000])
                    setSelectedFeatures([])
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1 space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground font-serif">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "All Products"}
                </h1>
                <p className="text-muted-foreground">
                  {sortedResults.length} {sortedResults.length === 1 ? "product" : "products"} found
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "All Categories" ||
              selectedFeatures.length > 0 ||
              priceRange[0] > 0 ||
              priceRange[1] < 5000) && (
              <div className="flex flex-wrap gap-2">
                {selectedCategory !== "All Categories" && (
                  <Badge variant="secondary" className="flex items-center gap-2">
                    {selectedCategory}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory("All Categories")} />
                  </Badge>
                )}
                {selectedFeatures.map((feature) => (
                  <Badge key={feature} variant="secondary" className="flex items-center gap-2">
                    {feature}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))}
                    />
                  </Badge>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                  <Badge variant="secondary" className="flex items-center gap-2">
                    ${priceRange[0]} - ${priceRange[1]}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange([0, 5000])} />
                  </Badge>
                )}
              </div>
            )}

            {/* Results Grid/List */}
            {sortedResults.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or browse our categories
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90">
                    Browse All Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {sortedResults.map((product) => (
                  <Card
                    key={product.id}
                    className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    <div className={`${viewMode === "list" ? "w-48" : "aspect-[4/3]"} overflow-hidden relative`}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={`
                          ${product.badge === "Bestseller" ? "bg-accent/20 text-accent-foreground" : ""}
                          ${product.badge === "Premium" ? "bg-primary/20 text-primary" : ""}
                          ${product.badge === "Smart Choice" ? "bg-accent/20 text-accent-foreground" : ""}
                        `}
                        >
                          {product.badge}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="secondary" className="rounded-full w-10 h-10 p-0">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">{product.category}</span>
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm text-muted-foreground ml-1">{product.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl font-bold text-foreground font-serif group-hover:text-primary transition-colors">
                          {product.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">{product.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          {viewMode === "grid" && (
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {product.features.slice(0, 2).map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2"></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-foreground">${product.price}</span>
                              {product.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Link href={`/products/${product.id}`} className="flex-1">
                              <Button className="w-full bg-primary hover:bg-primary/90">
                                View Details
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm" className="px-3 bg-transparent">
                              <ShoppingCart className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {sortedResults.length > 0 && (
              <div className="text-center pt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 px-8 py-4 bg-transparent"
                >
                  Load More Results
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
