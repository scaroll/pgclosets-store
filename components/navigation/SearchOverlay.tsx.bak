"use client"

import { useEffect, useState, useRef } from "react"
import { Search, X, TrendingUp } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

// Popular searches data
const popularSearches = [
  "Walk-in closets",
  "Garage storage",
  "Custom wardrobes",
  "Pantry systems",
  "Closet accessories",
]

// Quick links
const quickLinks = [
  { label: "All Products", href: "/products" },
  { label: "Design Ideas", href: "/gallery" },
  { label: "Free Online Quote", href: "/request-work" },
]

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      setIsSearching(true)
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  const handlePopularSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    inputRef.current?.focus()
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
      />

      {/* Search Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 bg-white shadow-2xl transition-all duration-300 ease-out z-50",
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        )}
      >
        <div className="max-w-4xl mx-auto p-6 sm:p-8">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, ideas, inspiration..."
                className="w-full pl-14 pr-14 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                disabled={isSearching}
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
          </form>

          {/* Search suggestions */}
          {!query && (
            <div className="grid sm:grid-cols-2 gap-8">
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
                        className="text-sm text-gray-700 hover:text-black transition-colors group flex items-center gap-2"
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
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-black transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Search results preview would go here when query exists */}
          {query && (
            <div className="py-8 text-center text-sm text-gray-500">
              Press Enter to search for "{query}"
            </div>
          )}
        </div>
      </div>
    </>
  )
}
