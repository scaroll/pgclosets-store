// @ts-nocheck - Products page with dynamic types
import Link from 'next/link'
"use client"

import products from "@/data/simple-products.json"
import Image from "next/image"
import { useState } from "react"

export default function ProductsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  console.log("[v0] Products loaded:", products.length)
  console.log("[v0] Search term:", searchTerm)
  console.log("[v0] Category filter:", categoryFilter)

  const filteredProducts = products
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

  console.log("[v0] Filtered products:", filteredProducts.length)

  const categories = [...new Set(products.map((p) => p.category))]

  const getProductSpecs = (product: any) => {
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
  }

  const getDetailedSpecs = (product: any) => {
    const baseSpecs = {
      material: "Premium engineered wood core with laminate surface",
      finish: "Durable scratch-resistant finish",
      hardware: "Professional-grade stainless steel components",
      warranty: "5-year manufacturer warranty",
      installation: "Professional installation available",
      maintenance: "Easy-clean surface, minimal maintenance required",
      certification: "GREENGUARD Gold certified for low emissions",
      origin: "Manufactured in North America",
    }

    if (product.category === "Bifold Doors") {
      return {
        ...baseSpecs,
        mechanism: "Heavy-duty pivot hinges with soft-close technology",
        sizes: 'Available in 24", 30", 32", 36" widths with custom heights',
        thickness: '1-3/8" standard thickness for optimal stability',
        weight: "Lightweight construction (25-35 lbs per door)",
        capacity: "Designed for daily use, 50,000+ cycle rating",
        features: "Magnetic catches, adjustable hinges, pre-drilled holes",
      }
    } else if (product.category === "Bypass Doors") {
      return {
        ...baseSpecs,
        mechanism: "Smooth-glide ball bearing track system",
        sizes: 'Available in 48", 60", 72", 80", 96" widths',
        thickness: '1-1/8" or 1-3/8" thickness options',
        weight: "Engineered for effortless operation (30-50 lbs per door)",
        capacity: "Heavy-duty track supports up to 150 lbs",
        features: "Anti-jump guides, floor guides, soft-close dampers",
      }
    } else if (product.category === "Barn Doors") {
      return {
        ...baseSpecs,
        mechanism: "Premium sliding track hardware with ball bearings",
        sizes: 'Available in 30", 32", 36", 42" widths, custom heights up to 96"',
        thickness: '1-3/4" solid construction for authentic barn door feel',
        weight: "Substantial feel while maintaining smooth operation (40-80 lbs)",
        capacity: "Track system supports up to 200 lbs",
        features: "Soft-close mechanism, floor guide, decorative hardware options",
      }
    }
    return baseSpecs
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
                alt="PG Closets Logo"
                width={60}
                height={60}
                className="object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-[#1e3a8a]">PG Closets</h1>
                <p className="text-sm text-[#9BC4E2]">Ottawa&apos;s Premier Door Experts</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-[#1e3a8a] font-bold border-b-2 border-[#9BC4E2]">
                Products
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#1e3a8a] font-medium transition-colors">
                Contact
              </Link>
              <a
                href="tel:613-422-5800"
                className="bg-[#1e3a8a] text-[#9BC4E2] px-6 py-3 font-bold hover:bg-[#9BC4E2] hover:text-[#1e3a8a] transition-all duration-300 border-2 border-[#1e3a8a]"
              >
                (613) 422-5800
              </a>
            </nav>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-[#1e3a8a]">
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div
                  className={`h-0.5 bg-current transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
                ></div>
                <div className={`h-0.5 bg-current transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`}></div>
                <div
                  className={`h-0.5 bg-current transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
                ></div>
              </div>
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <Link href="/" className="text-gray-700 hover:text-[#1e3a8a] font-medium">
                  Home
                </Link>
                <Link href="/products" className="text-[#1e3a8a] font-bold">
                  Products
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-[#1e3a8a] font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-[#1e3a8a] font-medium">
                  Contact
                </Link>
                <a
                  href="tel:613-422-5800"
                  className="bg-[#1e3a8a] text-[#9BC4E2] px-6 py-3 font-bold text-center border-2 border-[#1e3a8a]"
                >
                  (613) 422-5800
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="pt-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-6 text-[#1e3a8a]">Premium Door Collection</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our complete range of premium closet doors, hardware, and accessories
            </p>
          </div>

          <div className="mb-12 bg-white shadow-2xl p-8 border-l-4 border-[#87ceeb]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#1e3a8a] mb-3">Search Products</label>
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-300 focus:ring-2 focus:ring-[#87ceeb] focus:border-[#1e3a8a] transition-all duration-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1e3a8a] mb-3">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-300 focus:ring-2 focus:ring-[#87ceeb] focus:border-[#1e3a8a] transition-all duration-300 font-medium"
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
                  className="w-full px-4 py-4 border-2 border-gray-300 focus:ring-2 focus:ring-[#87ceeb] focus:border-[#1e3a8a] transition-all duration-300 font-medium"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              console.log("[v0] Rendering product:", product.title, "Image:", product.image)
              const specs = getProductSpecs(product)

              return (
                <div
                  key={product.id}
                  className="group bg-white shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-3 transition-all duration-500 border-l-4 border-[#87ceeb]"
                >
                  <div
                    className="aspect-square relative bg-gray-100 overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(product.image)}
                  >
                    <Image
                      src={product.image || "/placeholder.svg?height=400&width=400&text=No+Image"}
                      alt={`${product.title} - PG Closets Ottawa`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 6}
                      onError={(e) => {
                        console.log("[v0] Image load error for:", product.title, product.image)
                        e.currentTarget.src = "/placeholder.svg?height=400&width=400&text=Image+Error"
                      }}
                      onLoad={() => {
                        console.log("[v0] Image loaded successfully:", product.title)
                      }}
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#1e3a8a] transition-colors duration-300">
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                    <div className="mb-4 p-4 bg-gray-50 border-l-4 border-[#87ceeb]">
                      <h4 className="font-bold text-[#1e3a8a] mb-3 text-sm">Key Specifications:</h4>
                      <div className="space-y-2 text-xs text-gray-700">
                        <div>
                          <span className="font-semibold">Material:</span> {specs.material}
                        </div>
                        <div>
                          <span className="font-semibold">Finish:</span> {specs.finish}
                        </div>
                        {(specs as any).mechanism && (
                          <div>
                            <span className="font-semibold">Mechanism:</span> {(specs as any).mechanism}
                          </div>
                        )}
                        {(specs as any).sizes && (
                          <div>
                            <span className="font-semibold">Sizes:</span> {(specs as any).sizes}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold">Warranty:</span> {specs.warranty}
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
                      <button className="flex-1 bg-[#1e3a8a] text-[#87ceeb] py-4 font-bold hover:bg-[#87ceeb] hover:text-[#1e3a8a] hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-[#1e3a8a]">
                        Add to Cart
                      </button>
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="px-6 py-4 border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold hover:bg-[#1e3a8a] hover:text-[#87ceeb] transition-all duration-300"
                      >
                        Full Details
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No products found</h3>
              <p className="text-gray-600 text-lg">Try adjusting your search criteria or browse all categories.</p>
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-2xl font-bold hover:text-gray-300"
            >
              ✕ Close
            </button>
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt="Product Detail"
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white max-w-4xl max-h-full overflow-y-auto p-8 border-4 border-[#1e3a8a]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold text-[#1e3a8a]">{selectedProduct.title}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.title}
                  width={400}
                  height={400}
                  className="w-full object-cover border-2 border-[#87ceeb]"
                />
              </div>

              <div>
                <p className="text-gray-700 mb-6 leading-relaxed">{selectedProduct.description}</p>

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-[#1e3a8a] mb-4">Complete Specifications</h3>
                  <div className="space-y-3 text-sm">
                    {Object.entries(getDetailedSpecs(selectedProduct)).map(([key, value]) => (
                      <div key={key} className="border-b border-[#87ceeb]/30 pb-2">
                        <span className="font-semibold capitalize text-[#1e3a8a]">
                          {key.replace(/([A-Z])/g, " $1")}:
                        </span>
                        <span className="ml-2 text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl font-bold text-[#1e3a8a]">${(selectedProduct.price / 100).toFixed(2)}</span>
                  <span className="px-4 py-2 bg-[#87ceeb]/20 text-[#1e3a8a] font-bold border border-[#87ceeb]">
                    {selectedProduct.category}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-[#1e3a8a] text-[#87ceeb] py-4 font-bold hover:bg-[#87ceeb] hover:text-[#1e3a8a] transition-all duration-300">
                    Add to Cart
                  </button>
                  <button className="px-8 py-4 border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold hover:bg-[#1e3a8a] hover:text-[#87ceeb] transition-all duration-300">
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#1e3a8a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PG%20Logo.jpg-PA2Pv0eQKuJGkzYoQf9wsC86lYSKGa.jpeg"
                  alt="PG Closets Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#9BC4E2]">PG Closets</h3>
                  <p className="text-sm text-gray-300">Ottawa&apos;s Premier Door Experts</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Transforming Ottawa homes with premium closet doors and expert installation services since 2008.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#9BC4E2] mb-4">Products</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/products" className="hover:text-[#9BC4E2] transition-colors">
                    Bifold Doors
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#9BC4E2] transition-colors">
                    Bypass Doors
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#9BC4E2] transition-colors">
                    Barn Doors
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-[#9BC4E2] transition-colors">
                    Hardware
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#9BC4E2] mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/contact" className="hover:text-[#9BC4E2] transition-colors">
                    Free Consultation
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#9BC4E2] transition-colors">
                    Professional Installation
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#9BC4E2] transition-colors">
                    Custom Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#9BC4E2] transition-colors">
                    Warranty Service
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-[#9BC4E2] mb-4">Contact</h4>
              <div className="space-y-3 text-gray-300">
                <p className="flex items-center space-x-2">
                  <span>📞</span>
                  <a href="tel:613-422-5800" className="hover:text-[#9BC4E2] transition-colors">
                    (613) 422-5800
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <span>✉️</span>
                  <a href="mailto:info@pgclosets.com" className="hover:text-[#9BC4E2] transition-colors">
                    info@pgclosets.com
                  </a>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>Ottawa, Ontario</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#9BC4E2]/20 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 PG Closets. All rights reserved. | Licensed & Insured</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
