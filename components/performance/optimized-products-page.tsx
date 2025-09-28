'use client'

"use client"

import { useState, useMemo, useCallback, Suspense } from "react"
import { ProductImage } from "./advanced-image"
import { ProductGridSkeleton, ProductDetailSkeleton } from "../loading/product-skeletons"
import { usePerformanceTracking } from "./performance-monitor"
import products from "@/data/simple-products.json"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: any
  index: number
  onProductSelect: (product: any) => void
  onImageExpand: (image: string) => void
}

// Memoized product card for better performance
const ProductCard = ({ product, index, onProductSelect, onImageExpand }: ProductCardProps) => {
  const { trackEvent } = usePerformanceTracking()

  const handleCardClick = useCallback(() => {
    trackEvent('product_card_click', 0, {
      product_id: product.id,
      product_title: product.title,
      product_category: product.category,
      card_position: index
    })
    onProductSelect(product)
  }, [product, index, onProductSelect, trackEvent])

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    trackEvent('product_image_expand', 0, {
      product_id: product.id,
      product_title: product.title
    })
    onImageExpand(product.image)
  }, [product, onImageExpand, trackEvent])

  const getProductSpecs = useMemo(() => {
    const baseSpecs = {
      material: "Premium engineered wood core",
      finish: "Durable laminate surface",
      hardware: "Professional-grade components",
      warranty: "5-year manufacturer warranty",
      installation: "Professional installation available",
    }

    if (product.category === "Bifold Doors") {
      return {
        ...baseSpecs,
        mechanism: "Heavy-duty pivot hinges",
        sizes: '24", 30", 32", 36" widths available',
        thickness: '1-3/8" standard thickness',
        weight: "Lightweight yet durable construction",
      }
    } else if (product.category === "Bypass Doors") {
      return {
        ...baseSpecs,
        mechanism: "Smooth-glide track system",
        sizes: '48", 60", 72", 80", 96" widths available',
        thickness: '1-1/8" or 1-3/8" options',
        weight: "Engineered for easy operation",
      }
    } else if (product.category === "Barn Doors") {
      return {
        ...baseSpecs,
        mechanism: "Premium sliding track hardware",
        sizes: '30", 32", 36", 42" widths, custom heights',
        thickness: '1-3/4" solid construction',
        weight: "Supports up to 200 lbs capacity",
      }
    } else if (product.category === "Hardware") {
      return {
        material: "Stainless steel construction",
        finish: "Multiple finish options available",
        capacity: "Supports doors up to 200 lbs",
        warranty: "Lifetime mechanical warranty",
        installation: "Complete hardware kit included",
      }
    }
    return baseSpecs
  }, [product.category])

  return (
    <div
      className={cn(
        "group bg-white shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-3",
        "transition-all duration-500 border-l-4 border-[#87ceeb] animate-fade-in gpu-accelerated",
        "will-change-transform prevent-layout-shift"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div
        className="aspect-square relative bg-gray-100 overflow-hidden cursor-pointer"
        onClick={handleImageClick}
      >
        <ProductImage
          src={product.image || "/placeholder.svg?height=400&width=400&text=No+Image"}
          alt={`${product.title} - PG Closets Ottawa`}
          priority={index < 6} // Prioritize first 6 images
          className="object-cover group-hover:scale-110 transition-transform duration-700 will-change-transform"
          fallbackSrc="/placeholder.svg?height=400&width=400&text=Image+Error"
        />

        <div className="absolute top-4 left-4">
          <span className="bg-[#1e3a8a] text-[#87ceeb] px-4 py-2 text-sm font-bold border border-[#87ceeb]">
            NEW
          </span>
        </div>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/70 text-white p-2 text-xs font-bold">🔍 Click to Expand</div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors duration-300 text-render-quality">
          {product.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed text-render-optimize">
          {product.description}
        </p>

        <div className="mb-4 p-4 bg-gray-50 border-l-4 border-[#87ceeb]">
          <h4 className="font-bold text-[#1e3a8a] mb-3 text-sm">Key Specifications:</h4>
          <div className="space-y-2 text-xs text-gray-700">
            <div>
              <span className="font-semibold">Material:</span> {getProductSpecs.material}
            </div>
            <div>
              <span className="font-semibold">Finish:</span> {getProductSpecs.finish}
            </div>
            {'mechanism' in getProductSpecs && getProductSpecs.mechanism && (
              <div>
                <span className="font-semibold">Mechanism:</span> {getProductSpecs.mechanism}
              </div>
            )}
            {'sizes' in getProductSpecs && getProductSpecs.sizes && (
              <div>
                <span className="font-semibold">Sizes:</span> {getProductSpecs.sizes}
              </div>
            )}
            <div>
              <span className="font-semibold">Warranty:</span> {getProductSpecs.warranty}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="text-3xl font-bold text-[#1e3a8a]">${(product.price / 100).toFixed(2)}</span>
          <span className="px-4 py-2 bg-[#87ceeb]/20 text-[#1e3a8a] text-sm font-bold border border-[#87ceeb]">
            {product.category}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            className={cn(
              "flex-1 bg-[#1e3a8a] text-[#87ceeb] py-4 font-bold",
              "hover:bg-[#87ceeb] hover:text-[#1e3a8a] hover:shadow-xl hover:scale-105",
              "transition-all duration-300 border-2 border-[#1e3a8a] focus-optimized"
            )}
            onClick={(e) => {
              e.stopPropagation()
              trackEvent('add_to_cart_click', 0, { product_id: product.id })
            }}
          >
            Add to Cart
          </button>
          <button
            onClick={handleCardClick}
            className={cn(
              "px-6 py-4 border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold",
              "hover:bg-[#1e3a8a] hover:text-[#87ceeb] transition-all duration-300 focus-optimized"
            )}
          >
            Full Details
          </button>
        </div>
      </div>
    </div>
  )
}

// Memoized filter controls
const FilterControls = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy,
  categories
}: {
  searchTerm: string
  setSearchTerm: (term: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  sortBy: string
  setSortBy: (sort: string) => void
  categories: string[]
}) => {
  return (
    <div className="mb-12 bg-white shadow-2xl p-8 border-l-4 border-[#87ceeb] animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-bold text-[#1e3a8a] mb-3">Search Products</label>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              "w-full px-4 py-4 border-2 border-gray-300",
              "focus:ring-2 focus:ring-[#87ceeb] focus:border-[#1e3a8a]",
              "transition-all duration-300 font-medium focus-optimized"
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e3a8a] mb-3">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={cn(
              "w-full px-4 py-4 border-2 border-gray-300",
              "focus:ring-2 focus:ring-[#87ceeb] focus:border-[#1e3a8a]",
              "transition-all duration-300 font-medium focus-optimized"
            )}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-[#1e3a8a] mb-3">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={cn(
              "w-full px-4 py-4 border-2 border-gray-300",
              "focus:ring-2 focus:ring-[#87ceeb] focus:border-[#1e3a8a]",
              "transition-all duration-300 font-medium focus-optimized"
            )}
          >
            <option value="name">Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default function OptimizedProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const { trackEvent } = usePerformanceTracking()

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    const startTime = performance.now()

    const filtered = products
      .filter((product) => {
        const matchesSearch =
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "name":
          default:
            return (a.title || "").localeCompare(b.title || "")
        }
      })

    const endTime = performance.now()
    trackEvent('product_filter', endTime - startTime, {
      search_term: searchTerm,
      category: categoryFilter,
      sort_by: sortBy,
      result_count: filtered.length
    })

    return filtered
  }, [searchTerm, categoryFilter, sortBy, trackEvent])

  // Memoized categories
  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))]
  }, [])

  const handleProductSelect = useCallback((product: any) => {
    setSelectedProduct(product)
  }, [])

  const handleImageExpand = useCallback((image: string) => {
    setSelectedImage(image)
  }, [])

  const handleCloseModal = useCallback(() => {
    setSelectedProduct(null)
    setSelectedImage(null)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-6 text-[#1e3a8a] text-render-quality">Premium Door Collection</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-render-optimize">
              Discover our complete range of premium closet doors, hardware, and accessories
            </p>
          </div>

          <FilterControls
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
          />

          <Suspense fallback={<ProductGridSkeleton count={9} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onProductSelect={handleProductSelect}
                  onImageExpand={handleImageExpand}
                />
              ))}
            </div>
          </Suspense>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search criteria or browse all categories.</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white text-2xl font-bold hover:text-gray-300 focus-optimized"
            >
              ✕ Close
            </button>
            <ProductImage
              src={selectedImage}
              alt="Product Detail"
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
              priority={true}
            />
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white max-w-4xl max-h-full overflow-y-auto p-8 border-4 border-[#1e3a8a] animate-scale-in smooth-scroll"
            onClick={(e) => e.stopPropagation()}
          >
            <Suspense fallback={<ProductDetailSkeleton />}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-[#1e3a8a] text-render-quality">{selectedProduct.title}</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold focus-optimized"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <ProductImage
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.title}
                    width={400}
                    height={400}
                    className="w-full object-cover border-2 border-[#87ceeb]"
                    priority={true}
                  />
                </div>

                <div>
                  <p className="text-gray-700 mb-6 leading-relaxed text-render-optimize">{selectedProduct.description}</p>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">Complete Specifications</h3>
                    <div className="space-y-3 text-sm">
                      {/* Specifications content would be rendered here */}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-4xl font-bold text-[#1e3a8a]">${(selectedProduct.price / 100).toFixed(2)}</span>
                    <span className="px-4 py-2 bg-[#87ceeb]/20 text-[#1e3a8a] font-bold border border-[#87ceeb]">
                      {selectedProduct.category}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button className="flex-1 bg-[#1e3a8a] text-[#87ceeb] py-4 font-bold hover:bg-[#87ceeb] hover:text-[#1e3a8a] transition-all duration-300 focus-optimized">
                      Add to Cart
                    </button>
                    <button className="px-8 py-4 border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold hover:bg-[#1e3a8a] hover:text-[#87ceeb] transition-all duration-300 focus-optimized">
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>
            </Suspense>
          </div>
        </div>
      )}
    </div>
  )
}