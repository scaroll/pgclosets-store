// Enhanced PgHeader matching Final-Website exactly with mobile optimization and product navigation
"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { MobileMenu } from "@/components/navigation/mobile-menu"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { ChevronDown } from "@/components/ui/icons"
import { HeaderSearch } from "@/components/navigation/header-search"

// Product categories for navigation
const productCategories = [
  { name: "Barn Doors", href: "/products?category=barn-doors", description: "Sliding barn doors with modern and rustic styles" },
  { name: "Bypass Doors", href: "/products?category=bypass-doors", description: "Space-saving sliding closet doors" },
  { name: "Bifold Doors", href: "/products?category=bifold-doors", description: "Folding doors perfect for smaller spaces" },
  { name: "Hardware", href: "/products?category=hardware", description: "Tracks, handles, and installation hardware" },
]

const featuredProducts = [
  { name: "Gatsby Chevron", href: "/products/gatsby-chevron-barn-door", price: "$849", image: "/images/doors/barn/gatsby-chevron.jpg" },
  { name: "Sherwood InvisiGlide", href: "/products/sherwood-invisiglide-door", price: "$1,049", image: "/images/doors/barn/sherwood-invisiglide.jpg" },
]

export default function PgHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsProductsDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false)
    }, 150)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-white shadow-lg" role="banner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-center py-3 text-sm tracking-wide">
            <div className="flex items-center justify-center space-x-8 text-xs uppercase font-light">
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                <span>Ottawa Closet Specialists</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                <span>500+ Closet Installations</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                <span>Local Trusted Team</span>
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-4" aria-label="PG Closets - Go to homepage">
              <Image src="/pg-logo.jpg" alt="PG Closets" width={48} height={48} sizes="48px" className="w-12 h-12 object-contain" />
              <div>
                <div className="text-2xl font-light tracking-wide text-slate-900" role="heading" aria-level={2}>PG CLOSETS</div>
                <p className="text-xs text-slate-500 font-light uppercase tracking-widest">Ottawa Custom Closets</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
              <Link href="/" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">Home</Link>

              {/* Products Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                  aria-expanded={isProductsDropdownOpen}
                  aria-haspopup="true"
                >
                  Products
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Products Mega Menu */}
                {isProductsDropdownOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-slate-200 z-50"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="p-6">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-slate-900 mb-3">Product Categories</h3>
                          <div className="space-y-2">
                            {productCategories.map((category) => (
                              <Link
                                key={category.name}
                                href={category.href}
                                className="block p-3 rounded-md hover:bg-slate-50 transition-colors"
                                onClick={() => setIsProductsDropdownOpen(false)}
                              >
                                <div className="font-medium text-slate-900 text-sm">{category.name}</div>
                                <div className="text-xs text-slate-600 mt-1">{category.description}</div>
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-slate-200 pt-4">
                          <h3 className="text-sm font-medium text-slate-900 mb-3">Featured Products</h3>
                          <div className="space-y-2">
                            {featuredProducts.map((product) => (
                              <Link
                                key={product.name}
                                href={product.href}
                                className="flex items-center p-2 rounded-md hover:bg-slate-50 transition-colors"
                                onClick={() => setIsProductsDropdownOpen(false)}
                              >
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 object-cover rounded-md mr-3"
                                />
                                <div>
                                  <div className="font-medium text-slate-900 text-sm">{product.name}</div>
                                  <div className="text-xs text-slate-600">{product.price}</div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200">
                            <Link
                              href="/products"
                              className="text-sm text-slate-900 font-medium hover:text-slate-700 transition-colors"
                              onClick={() => setIsProductsDropdownOpen(false)}
                            >
                              View All Products →
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/about" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">About</Link>
              <Link href="/services" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">Services</Link>
              <Link href="/contact" className="text-slate-700 hover:text-slate-900 px-3 py-2 text-sm font-light tracking-wide transition-colors">Contact</Link>

              {/* Search and CTA */}
              <div className="flex items-center space-x-4 ml-8 pl-8 border-l border-slate-200">
                <HeaderSearch
                  isOpen={isSearchOpen}
                  onOpen={() => setIsSearchOpen(true)}
                  onClose={() => setIsSearchOpen(false)}
                />
                <Link href="/contact" className="bg-slate-900 text-white px-8 py-2.5 text-sm font-light tracking-wide hover:bg-slate-800 transition-all duration-300">Get Quote</Link>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-slate-700 hover:text-slate-900 p-2 min-h-[44px] min-w-[44px] touch-manipulation active:bg-slate-100 rounded-lg transition-colors"
                aria-label="Open navigation menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

        {/* Bottom Navigation for Mobile */}
        <BottomNavigation onMenuToggle={toggleMobileMenu} cartItemCount={0} />
      </header>
    </>
  )
}