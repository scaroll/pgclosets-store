"use client"

import { useEffect, useState, useRef, useMemo } from "react"
import { Search, X, TrendingUp, Clock, ArrowRight, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import simpleProducts from "@/data/simple-products.json"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

// Popular searches data
const popularSearches = [
  "Barn doors",
  "Bypass doors",
  "Bifold doors",
  "Custom closets",
  "Door hardware",
  "Installation services",
]

// Quick links
const quickLinks = [
  { label: "All Products", href: "/products", icon: "🏠" },
  { label: "Design Gallery", href: "/gallery", icon: "🎨" },
  { label: "Free Quote", href: "/request-work", icon: "💰" },
  { label: "Contact Us", href: "/contact", icon: "📧" },
]

// Product categories for filtering
const categories = [
  "All",
  "Barn Doors",
  "Bypass Doors",
  "Bifold Doors",
  "Closet Doors",
  "Hardware",
  "Mirrors",
]

export function EnhancedSearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)

      // Load recent searches from localStorage
      const saved = localStorage.getItem("recentSearches")
      if (saved) {
        setRecentSearches(JSON.parse(saved))
      }
    } else {
      setQuery("")
      setIsSearching(false)
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Smart product search with fuzzy matching
  const searchResults = useMemo(() => {
    if (!query || query.length < 2) return []

    const searchTerm = query.toLowerCase()
    const products = simpleProducts as any[]

    return products
      .filter((product) => {
        const matchesQuery =
          product.title.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)

        const matchesCategory =
          selectedCategory === "All" ||
          product.category === `Renin ${selectedCategory}`

        return matchesQuery && matchesCategory
      })
      .slice(0, 6) // Limit to 6 results
  }, [query, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsSearching(true)

      // Save to recent searches
      const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  const handlePopularSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    inputRef.current?.focus()
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300 z-50",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 bg-white shadow-2xl transition-all duration-300 ease-out z-50 max-h-[90vh] overflow-y-auto",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Search products"
      >
        <div className="max-w-5xl mx-auto p-6 sm:p-8">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, ideas, inspiration..."
                className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                disabled={isSearching}
                aria-label="Search input"
              />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Category Filters */}
            {query.length > 0 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                      selectedCategory === category
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Search Results */}
          {query.length > 0 && searchResults.length > 0 && (
            <div className="mb-8">
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                <Search className="w-4 h-4" />
                Search Results ({searchResults.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/simple-products/${product.slug}`}
                    onClick={onClose}
                    className="group bg-white border border-gray-200 rounded-lg p-4 hover:border-black hover:shadow-md transition-all"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-gray-50">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-black transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">
                        ${(product.price / 100).toFixed(2)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query.length > 0 && searchResults.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your search or browse our categories
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Suggestions when no query */}
          {!query && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {recentSearches.map((searchTerm, index) => (
                      <li key={index}>
                        <button
                          onClick={() => handlePopularSearch(searchTerm)}
                          className="text-sm text-gray-700 hover:text-black transition-colors group flex items-center gap-2 w-full text-left"
                        >
                          <Clock className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                          {searchTerm}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  <TrendingUp className="w-4 h-4" />
                  Popular Searches
                </h3>
                <ul className="space-y-2">
                  {popularSearches.map((searchTerm) => (
                    <li key={searchTerm}>
                      <button
                        onClick={() => handlePopularSearch(searchTerm)}
                        className="text-sm text-gray-700 hover:text-black transition-colors group flex items-center gap-2 w-full text-left"
                      >
                        <Search className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors" />
                        {searchTerm}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="text-sm text-gray-700 hover:text-black transition-colors group flex items-center gap-2"
                      >
                        <span className="text-lg">{link.icon}</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
