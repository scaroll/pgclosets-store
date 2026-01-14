"use client"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Search, X, Clock, TrendingUp } from "@/components/ui/icons"

interface SearchResult {
  id: string
  title: string
  category: string
  price: string
  image: string
  href: string
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'product' | 'category' | 'popular'
  href: string
}

interface HeaderSearchProps {
  isOpen: boolean
  onClose: () => void
  onOpen: () => void
}

// Mock search results - in real app, this would come from API
const mockResults: SearchResult[] = [
  {
    id: "1",
    title: "Gatsby Chevron Barn Door",
    category: "Barn Doors",
    price: "$849",
    image: "/images/doors/barn/gatsby-chevron.jpg",
    href: "/products/gatsby-chevron-barn-door"
  },
  {
    id: "2",
    title: "Sherwood InvisiGlide Door",
    category: "Barn Doors",
    price: "$1,049",
    image: "/images/doors/barn/sherwood-invisiglide.jpg",
    href: "/products/sherwood-invisiglide-door"
  },
  {
    id: "3",
    title: "Metal Works Industrial Door",
    category: "Barn Doors",
    price: "$679",
    image: "/images/doors/barn/metal-works.jpg",
    href: "/products/metal-works-industrial-door"
  }
]

const popularSearches: SearchSuggestion[] = [
  { id: "1", text: "barn doors", type: "popular", href: "/products?category=barn-doors" },
  { id: "2", text: "bypass doors", type: "popular", href: "/products?category=bypass-doors" },
  { id: "3", text: "hardware", type: "popular", href: "/products?category=hardware" },
  { id: "4", text: "installation", type: "popular", href: "/services" },
]

const categories: SearchSuggestion[] = [
  { id: "1", text: "Barn Doors", type: "category", href: "/products?category=barn-doors" },
  { id: "2", text: "Bypass Doors", type: "category", href: "/products?category=bypass-doors" },
  { id: "3", text: "Bifold Doors", type: "category", href: "/products?category=bifold-doors" },
  { id: "4", text: "Hardware", type: "category", href: "/products?category=hardware" },
]

export const HeaderSearch = memo(function HeaderSearch({ isOpen, onClose, onOpen }: HeaderSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      setShowSuggestions(true)
      return
    }

    setIsLoading(true)
    setShowSuggestions(false)

    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filteredResults)
      setIsLoading(false)
    }, 300)
  }, [])

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setQuery(value)
    performSearch(value)
  }, [performSearch])

  // Handle search submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }, [query, router, onClose])

  // Handle suggestion click
  const handleSuggestionClick = useCallback((href: string) => {
    router.push(href)
    onClose()
  }, [router, onClose])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="text-slate-700 hover:text-slate-900 p-2 transition-colors hidden lg:block"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Modal */}
      <div className="fixed inset-x-0 top-0 z-50 bg-white shadow-xl">
        <div className="max-w-4xl mx-auto p-6">
          {/* Search Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Search for doors, hardware, or services..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-slate-400 focus:outline-none transition-colors"
                />
              </form>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close search"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Content */}
          <div className="max-h-96 overflow-y-auto">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                <p className="text-slate-600 mt-2">Searching...</p>
              </div>
            )}

            {/* Search Results */}
            {!isLoading && results.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-4">
                  Products ({results.length})
                </h3>
                <div className="space-y-2">
                  {results.map((result) => (
                    <Link
                      key={result.id}
                      href={result.href}
                      onClick={() => onClose()}
                      className="flex items-center p-3 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <Image
                        src={result.image}
                        alt={result.title}
                        width={48}
                        height={48}
                        className="w-12 h-12 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{result.title}</p>
                        <p className="text-sm text-slate-600">{result.category}</p>
                      </div>
                      <div className="text-sm font-medium text-slate-900">{result.price}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && query && results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-600">No products found for "{query}"</p>
                <p className="text-sm text-slate-500 mt-2">Try searching for barn doors, hardware, or installation</p>
              </div>
            )}

            {/* Suggestions (when no query or empty results) */}
            {(showSuggestions || (!query && !isLoading)) && (
              <div className="space-y-6">
                {/* Popular Searches */}
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Popular Searches
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {popularSearches.map((search) => (
                      <button
                        key={search.id}
                        onClick={() => handleSuggestionClick(search.href)}
                        className="text-left p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900"
                      >
                        {search.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Browse Categories</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={category.href}
                        onClick={() => onClose()}
                        className="p-3 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900 border border-slate-200"
                      >
                        {category.text}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-3">Quick Links</h3>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href="/services"
                      onClick={() => onClose()}
                      className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Installation Services
                    </Link>
                    <Link
                      href="/contact"
                      onClick={() => onClose()}
                      className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      Get Quote
                    </Link>
                    <Link
                      href="/about"
                      onClick={() => onClose()}
                      className="px-4 py-2 bg-slate-100 rounded-full text-sm text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      About Us
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
})