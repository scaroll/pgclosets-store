"use client"

import Link from "next/link"
import { useState } from "react"
import { PGLogo } from "../ui/pg-logo"
import { ChevronDown, Search, Heart, ShoppingCart } from "lucide-react"
import MegaMenu from "./navigation/MegaMenu"

export default function PgHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleMenuHover = (menuKey: string) => {
    setActiveMenu(menuKey)
    setMegaMenuOpen(true)
  }

  const handleMenuLeave = () => {
    setMegaMenuOpen(false)
    setActiveMenu(null)
  }

  return (
    <>
      <header className="nav-modern sticky top-0 z-40 bg-white/98 backdrop-blur-2xl border-b border-gray-100 transition-all duration-300" role="banner">
        {/* Top bar with phone number */}
        <div className="bg-black text-white py-2 px-4 text-center text-sm font-medium tracking-wider">
          <a href="tel:613-555-0123" className="hover:text-gray-200 transition-colors">
            📞 Call for Free Quote: (613) 555-0123
          </a>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="PG Closets - Go to homepage"
          >
            <div className="relative w-8 h-8">
              <PGLogo
                width={32}
                height={32}
                withWordmark={false}
                aria-hidden="true"
                className="text-black"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-[0.2em] text-black leading-none">
                PG CLOSETS
              </span>
              <span className="text-[10px] text-gray-500 font-medium tracking-[0.15em] mt-0.5">OTTAWA</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <Link
              href="/"
              className="relative text-black/70 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-black px-4 py-2 group"
            >
              <span className="relative">Home</span>
              <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMenuHover('products')}
              onMouseLeave={handleMenuLeave}
            >
              <button className="flex items-center space-x-1 relative text-black/70 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-black px-4 py-2 group">
                <span className="relative">Products</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${megaMenuOpen && activeMenu === 'products' ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            </div>

            <Link
              href="/about"
              className="relative text-black/70 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-black px-4 py-2 group"
            >
              <span className="relative">About</span>
              <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMenuHover('services')}
              onMouseLeave={handleMenuLeave}
            >
              <button className="flex items-center space-x-1 relative text-black/70 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-black px-4 py-2 group">
                <span className="relative">Services</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${megaMenuOpen && activeMenu === 'services' ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </button>
            </div>

            <Link
              href="/contact"
              className="relative text-black/70 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-black px-4 py-2 group"
            >
              <span className="relative">Contact</span>
              <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 ml-6 border-l border-gray-200 pl-6">
              <button
                className="p-2 text-black/60 hover:text-black transition-colors duration-200"
                aria-label="Search products"
              >
                <Search className="w-4 h-4" strokeWidth={2} />
              </button>

              <button
                className="p-2 text-black/60 hover:text-black transition-colors duration-200"
                aria-label="View wishlist"
              >
                <Heart className="w-4 h-4" strokeWidth={2} />
              </button>

              <button
                className="p-2 text-black/60 hover:text-black transition-colors duration-200 relative"
                aria-label="View cart"
              >
                <ShoppingCart className="w-4 h-4" strokeWidth={2} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  0
                </span>
              </button>
            </div>

            <Link
              href="/request-work"
              className="relative ml-6 bg-black text-white font-medium px-6 py-2.5 text-xs tracking-[0.1em] uppercase overflow-hidden group border-2 border-black transition-all duration-300 hover:bg-white hover:text-black"
            >
              <span className="relative z-10 flex items-center gap-2">
                Free Quote
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-pg-navy focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded-lg hover:bg-pg-offwhite transition-colors duration-200"
              aria-label="Open main menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Mega Menu */}
        <div
          onMouseEnter={() => {
            if (activeMenu) setMegaMenuOpen(true)
          }}
          onMouseLeave={handleMenuLeave}
        >
          <MegaMenu
            isOpen={megaMenuOpen}
            activeMenu={activeMenu}
            onClose={() => setMegaMenuOpen(false)}
          />
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMobileMenu}
          />

          {/* Slide-out menu */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMobileMenu}
                className="p-2 text-pg-navy hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2"
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Mobile Logo Section */}
            <div className="px-6 py-6 border-b border-gray-200">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center justify-center gap-3">
                <PGLogo
                  width={48}
                  height={48}
                  withWordmark={false}
                  className="text-slate-900"
                />
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-slate-900">PG CLOSETS</h2>
                  <p className="text-xs text-amber-600/60 font-medium uppercase tracking-widest">Quality Closets</p>
                </div>
              </Link>
            </div>

            {/* Navigation items */}
            <nav className="px-6 py-4" role="navigation" aria-label="Mobile navigation">
              <div className="space-y-6">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-pg-navy hover:text-pg-sky transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded px-2 py-2"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-pg-navy hover:text-pg-sky transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded px-2 py-2"
                >
                  Products
                </Link>
                <Link
                  href="/blog"
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-pg-navy hover:text-pg-sky transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded px-2 py-2"
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-pg-navy hover:text-pg-sky transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded px-2 py-2"
                >
                  Contact
                </Link>

                {/* CTA Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/request-work"
                    onClick={closeMobileMenu}
                    className="block w-full text-center bg-pg-navy text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
