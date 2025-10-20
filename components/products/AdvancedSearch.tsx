'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { searchReninProducts, getAllReninProducts } from '@/lib/renin-catalog'
import { ReninProduct } from '@/types/product-enhanced'

interface AdvancedSearchProps {
  placeholder?: string
  className?: string
  showSuggestions?: boolean
  onSearch?: (query: string) => void
}

interface SearchSuggestion {
  id: string
  name: string
  category: string
  type: string
  price: number
}

export function AdvancedSearch({
  placeholder = 'Search products, categories, styles...',
  className = '',
  showSuggestions = true,
  onSearch
}: AdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState(searchParams.get('search') || '')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const allProducts = getAllReninProducts()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.length >= 2 && showSuggestions) {
      const timer = setTimeout(() => {
        generateSuggestions(query)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [query, showSuggestions])

  const generateSuggestions = (searchQuery: string) => {
    const lowerQuery = searchQuery.toLowerCase()
    const matchedProducts: SearchSuggestion[] = []

    // Search in product names
    allProducts.forEach(product => {
      if (product.name.toLowerCase().includes(lowerQuery)) {
        matchedProducts.push({
          id: product.id,
          name: product.name,
          category: product.category || 'doors',
          type: product.attributes.type,
          price: Math.min(...product.variants.map(v => v.priceCAD))
        })
      }
    })

    // Search in categories
    const categories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)))
    categories.forEach(category => {
      if (category && category.toLowerCase().includes(lowerQuery)) {
        const categoryProducts = allProducts.filter(p => p.category === category)
        if (categoryProducts.length > 0) {
          const avgPrice = categoryProducts.reduce((sum, p) =>
            sum + Math.min(...p.variants.map(v => v.priceCAD)), 0
          ) / categoryProducts.length

          matchedProducts.push({
            id: `category-${category}`,
            name: `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Collection`,
            category: category,
            type: 'category',
            price: Math.round(avgPrice)
          })
        }
      }
    })

    // Search in styles
    const styles = Array.from(new Set(allProducts.map(p => p.attributes.style)))
    styles.forEach(style => {
      if (style.toLowerCase().includes(lowerQuery)) {
        const styleProducts = allProducts.filter(p => p.attributes.style === style)
        if (styleProducts.length > 0) {
          const avgPrice = styleProducts.reduce((sum, p) =>
            sum + Math.min(...p.variants.map(v => v.priceCAD)), 0
          ) / styleProducts.length

          matchedProducts.push({
            id: `style-${style}`,
            name: `${style.charAt(0).toUpperCase() + style.slice(1)} Style`,
            category: 'style',
            type: 'style',
            price: Math.round(avgPrice)
          })
        }
      }
    })

    // Search in finishes
    const finishes = Array.from(new Set(allProducts.map(p => p.attributes.finish)))
    finishes.forEach(finish => {
      if (finish.toLowerCase().includes(lowerQuery)) {
        const finishProducts = allProducts.filter(p => p.attributes.finish === finish)
        if (finishProducts.length > 0) {
          const avgPrice = finishProducts.reduce((sum, p) =>
            sum + Math.min(...p.variants.map(v => v.priceCAD)), 0
          ) / finishProducts.length

          matchedProducts.push({
            id: `finish-${finish}`,
            name: `${finish.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Finish`,
            category: 'finish',
            type: 'finish',
            price: Math.round(avgPrice)
          })
        }
      }
    })

    // Limit suggestions and remove duplicates
    const uniqueSuggestions = matchedProducts.filter((suggestion, index, self) =>
      index === self.findIndex((s) => s.name === suggestion.name)
    ).slice(0, 8)

    setSuggestions(uniqueSuggestions)
    setIsOpen(uniqueSuggestions.length > 0)
  }

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (finalQuery.trim()) {
      setIsSearching(true)

      // Update URL
      const params = new URLSearchParams(searchParams.toString())
      params.set('search', finalQuery.trim())
      router.push(`/products?${params.toString()}`, { scroll: false })

      onSearch?.(finalQuery.trim())

      setTimeout(() => {
        setIsSearching(false)
        setIsOpen(false)
      }, 300)
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      // Navigate to category
      const params = new URLSearchParams()
      params.set('category', suggestion.category)
      router.push(`/products?${params.toString()}`)
    } else if (suggestion.type === 'style') {
      // Navigate to style filter
      const params = new URLSearchParams()
      params.set('style', suggestion.category)
      router.push(`/products?${params.toString()}`)
    } else if (suggestion.type === 'finish') {
      // Navigate to finish filter
      const params = new URLSearchParams()
      params.set('finish', suggestion.category)
      router.push(`/products?${params.toString()}`)
    } else {
      // Navigate to product
      router.push(`/products/${suggestion.id}`)
    }

    setIsOpen(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)

    // Clear URL
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString('en-CA')} CAD`
  }

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'category':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      case 'style':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        )
      case 'finish':
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder={placeholder}
            className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="py-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-150"
              >
                <div className="flex-shrink-0">
                  {getSuggestionIcon(suggestion.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {suggestion.type === 'category' ? 'Category' :
                     suggestion.type === 'style' ? 'Style' :
                     suggestion.type === 'finish' ? 'Finish' : 'Product'}
                    {' • '}
                    {formatPrice(suggestion.price)}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-2">
            <button
              onClick={() => handleSearch()}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all results for "{query}"
            </button>
          </div>
        </div>
      )}
    </div>
  )
}