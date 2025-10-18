"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import PgHeader from "@/components/PgHeader"
import PgFooter from "@/components/PgFooter"
import { ProductCard } from "@/components/ui/product-card"
import { ProductFilters } from "@/components/ui/product-filters"
import { Button } from "@/components/ui/button"

const products = [
  // Bypass Doors
  {
    id: "euro-1-lite-bypass-offwhite",
    slug: "euro-1-lite-bypass-offwhite",
    name: "Euro 1‑Lite Bypass (Off‑White)",
    category: "Bypass",
    price: 459,
    priceMax: 589,
    priceRange: "$459 - $589 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Euro+1-Lite+Bypass+Off-White",
    description: "Clean, contemporary bypass door with single lite glass panel in off-white finish",
    features: [
      "Single lite glass panel",
      "Smooth bypass operation",
      "Off-white finish",
      "Professional installation included",
    ],
  },
  {
    id: "euro-1-lite-bypass-ironage",
    slug: "euro-1-lite-bypass-ironage",
    name: "Euro 1‑Lite Bypass (Iron Age)",
    category: "Bypass",
    price: 459,
    priceMax: 589,
    priceRange: "$459 - $589 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Euro+1-Lite+Bypass+Iron+Age",
    description: "Modern bypass door with single lite glass panel in sophisticated iron age finish",
    features: ["Single lite glass panel", "Iron age finish", "Bypass sliding system", "Premium hardware included"],
  },
  {
    id: "euro-3-lite-bypass",
    slug: "euro-3-lite-bypass",
    name: "Euro 3‑Lite Bypass",
    category: "Bypass",
    price: 459,
    priceMax: 589,
    priceRange: "$459 - $589 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Euro+3-Lite+Bypass",
    description: "Elegant three-panel glass bypass door system for maximum light flow",
    features: ["Three lite glass panels", "Maximum light transmission", "Smooth operation", "Contemporary styling"],
  },
  {
    id: "euro-5-lite-bypass",
    slug: "euro-5-lite-bypass",
    name: "Euro 5‑Lite Bypass",
    category: "Bypass",
    price: 459,
    priceMax: 589,
    priceRange: "$459 - $589 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Euro+5-Lite+Bypass",
    description: "Premium five-panel glass bypass door for sophisticated spaces",
    features: ["Five lite glass panels", "Premium design", "Bypass operation", "Architectural styling"],
  },
  {
    id: "harmony-1-lite-bypass",
    slug: "harmony-1-lite-bypass",
    name: "Harmony 1‑Lite Bypass",
    category: "Bypass",
    price: 409,
    priceMax: 539,
    priceRange: "$409 - $539 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Harmony+1-Lite+Bypass",
    description: "Harmonious single lite bypass door with clean lines and smooth operation",
    features: ["Single lite panel", "Harmony design", "Smooth bypass", "Value pricing"],
  },
  {
    id: "twilight-1-lite-bypass",
    slug: "twilight-1-lite-bypass",
    name: "Twilight 1‑Lite Bypass",
    category: "Bypass",
    price: 409,
    priceMax: 539,
    priceRange: "$409 - $539 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Twilight+1-Lite+Bypass",
    description: "Twilight series single lite bypass door with contemporary appeal",
    features: ["Twilight series design", "Single lite glass", "Bypass system", "Modern finish"],
  },
  {
    id: "savona-2panel-steel-bypass",
    slug: "savona-2panel-steel-bypass",
    name: "Savona 2‑Panel Steel Bypass",
    category: "Bypass",
    price: 259,
    priceMax: 289,
    priceRange: "$259 - $289 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Savona+Steel+Bypass",
    description: "Durable steel bypass door with classic two-panel design",
    features: ["Steel construction", "Two-panel design", "Durable finish", "Budget-friendly"],
  },
  {
    id: "parsons-flush-steel-bypass",
    slug: "parsons-flush-steel-bypass",
    name: "Parsons Flush Steel Bypass",
    category: "Bypass",
    price: 259,
    priceMax: 289,
    priceRange: "$259 - $289 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Parsons+Flush+Steel",
    description: "Clean flush steel bypass door for minimalist spaces",
    features: ["Flush steel design", "Minimalist styling", "Bypass operation", "Easy maintenance"],
  },

  // Bifold Doors
  {
    id: "euro-1-lite-bifold",
    slug: "euro-1-lite-bifold",
    name: "Euro 1‑Lite Bifold",
    category: "Bifold",
    price: 365,
    priceMax: 449,
    priceRange: "$365 - $449 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Euro+1-Lite+Bifold",
    description: "Space-saving bifold door with single lite glass panel",
    features: ["Single lite glass", "Space-saving bifold", "Euro styling", "Compact operation"],
  },
  {
    id: "euro-3-lite-bifold",
    slug: "euro-3-lite-bifold",
    name: "Euro 3‑Lite Bifold",
    category: "Bifold",
    price: 365,
    priceMax: 449,
    priceRange: "$365 - $449 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Euro+3-Lite+Bifold",
    description: "Three-panel glass bifold door for enhanced light and style",
    features: ["Three lite panels", "Bifold mechanism", "Light enhancement", "Contemporary design"],
  },
  {
    id: "parsons-insert-steel-bifold",
    slug: "parsons-insert-steel-bifold",
    name: "Parsons Insert Steel Bifold",
    category: "Bifold",
    price: 249,
    priceMax: 449,
    priceRange: "$249 - $449 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Parsons+Steel+Bifold",
    description: "Versatile steel bifold door with insert panel design",
    features: ["Steel construction", "Insert panel design", "Bifold operation", "Versatile styling"],
  },

  // Pivot Doors
  {
    id: "crochet-multix-pivot",
    slug: "crochet-multix-pivot",
    name: "Crochet Multi‑X Pivot",
    category: "Pivot",
    price: 389,
    priceMax: 499,
    priceRange: "$389 - $499 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Crochet+Multi-X+Pivot",
    description: "Decorative pivot door with intricate multi-X crochet pattern",
    features: ["Multi-X crochet pattern", "Pivot mechanism", "Decorative design", "Unique styling"],
  },
  {
    id: "provincial-8lite-pivot",
    slug: "provincial-8lite-pivot",
    name: "Provincial 8‑Lite Pivot",
    category: "Pivot",
    price: 389,
    priceMax: 499,
    priceRange: "$389 - $499 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Provincial+8-Lite+Pivot",
    description: "Traditional provincial style pivot door with eight lite glass panels",
    features: ["Eight lite panels", "Provincial styling", "Pivot operation", "Traditional appeal"],
  },
  {
    id: "euro-1-lite-pivot",
    slug: "euro-1-lite-pivot",
    name: "Euro 1‑Lite Pivot",
    category: "Pivot",
    price: 359,
    priceMax: 449,
    priceRange: "$359 - $449 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Euro+1-Lite+Pivot",
    description: "Contemporary single lite pivot door with Euro styling",
    features: ["Single lite glass", "Euro design", "Pivot mechanism", "Modern appeal"],
  },

  // Barn Doors
  {
    id: "gatsby-chevron-barn",
    slug: "gatsby-chevron-barn",
    name: "Gatsby Chevron Barn Door",
    category: "Barn",
    price: 679,
    priceRange: "From $679 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Gatsby+Chevron+Barn",
    description: "Stylish barn door with distinctive chevron pattern inspired by the Gatsby era",
    features: ["Chevron pattern design", "Barn door hardware", "Gatsby-inspired styling", "Premium finish"],
  },
  {
    id: "sherwood-invisiglide-barn",
    slug: "sherwood-invisiglide-barn",
    name: "Sherwood InvisiGlide Barn Door",
    category: "Barn",
    price: 1049,
    priceRange: "From $1,049 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Sherwood+InvisiGlide",
    description: "Premium barn door with innovative InvisiGlide hidden track system",
    features: ["InvisiGlide hidden track", "Sherwood design", "Premium construction", "Smooth operation"],
  },
  {
    id: "metal-works-barn",
    slug: "metal-works-barn",
    name: "Metal Works Barn Door",
    category: "Barn",
    price: 679,
    priceRange: "From $679 CAD",
    image: "/placeholder.svg?height=300&width=400&text=Metal+Works+Barn",
    description: "Industrial-style barn door with metal works design elements",
    features: ["Metal works styling", "Industrial design", "Barn door system", "Contemporary finish"],
  },
]

export default function ProductsPageClient() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleFilterChange = (filters: { category: string; search: string }) => {
    let filtered = products

    if (filters.category !== "all") {
      filtered = filtered.filter((product) => product.category?.toLowerCase() === filters.category.toLowerCase())
    }

    if (filters.search) {
      filtered = filtered.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(filters.search.toLowerCase())) ||
          (product.description && product.description.toLowerCase().includes(filters.search.toLowerCase())),
      )
    }

    setFilteredProducts(filtered)
  }

  return (
    <div className="min-h-screen bg-pg-offwhite">
      <PgHeader />

      {/* Hero Section */}
      <section className="section-padding-lg bg-gradient-to-br from-pg-offwhite to-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="headline-large text-4xl md:text-6xl text-pg-dark mb-6">Renin Door Systems</h1>
          <p className="text-xl text-pg-gray mb-8 max-w-3xl mx-auto">
            Official Renin dealer offering premium barn doors, closet systems, and hardware with professional
            installation across Ottawa. All prices in Canadian dollars.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact">
              <Button className="btn-primary px-8 py-4 text-lg rounded-full">Request Work</Button>
            </Link>
            <Link href="/contact">
              <Button className="btn-secondary px-8 py-4 text-lg rounded-full">Get Quote</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white border-b border-pg-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductFilters onFilterChange={handleFilterChange} />
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-pg-gray">
              Showing <span className="font-semibold text-pg-dark">{filteredProducts.length}</span> of{" "}
              <span className="font-semibold text-pg-dark">{products.length}</span> products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`transition-all duration-500 ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <ProductCard {...product} product={product} />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-pg-gray mb-4">No products found matching your criteria.</p>
              <Button className="btn-secondary" onClick={() => setFilteredProducts(products)}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <PgFooter />
    </div>
  )
}
