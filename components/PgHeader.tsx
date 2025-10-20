"use client"

import Link from "next/link"
import { useState, useRef, useCallback, useEffect } from "react"
import { PGLogo } from "../ui/pg-logo"
import { ChevronDown } from "lucide-react"
import MegaMenu from "./navigation/MegaMenu"
import { Button } from "../ui/button"

export default function PgHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }, [])

  const handleMenuHover = useCallback((menuKey: string) => {
    clearCloseTimeout()
    setActiveMenu(menuKey)
    setMegaMenuOpen(true)
  }, [clearCloseTimeout])

  const handleMenuLeave = useCallback(() => {
    clearCloseTimeout()
    // Increased timeout from 150ms to 300ms for better UX and accessibility
    closeTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false)
      setActiveMenu(null)
    }, 300)
  }, [clearCloseTimeout])

  // Keyboard navigation support
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsMobileMenuOpen(false)
      setMegaMenuOpen(false)
      setActiveMenu(null)
      clearCloseTimeout()
    }
  }, [clearCloseTimeout])

  // Add keyboard event listener
  useEffect(() => {
    if (isMobileMenuOpen || megaMenuOpen) {
      document.addEventListener('keydown', handleKeyDown)
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden'

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isMobileMenuOpen, megaMenuOpen, handleKeyDown])

  const handleMenuClick = useCallback((menuKey: string) => {
    // Toggle menu on click - if clicking same menu, close it; if different menu, switch
    if (activeMenu === menuKey && megaMenuOpen) {
      setMegaMenuOpen(false)
      setActiveMenu(null)
    } else {
      clearCloseTimeout()
      setActiveMenu(menuKey)
      setMegaMenuOpen(true)
    }
  }, [activeMenu, megaMenuOpen, clearCloseTimeout])

  const handleMegaMenuMouseEnter = useCallback(() => {
    clearCloseTimeout()
    setMegaMenuOpen(true)
  }, [clearCloseTimeout])

  const handleMegaMenuMouseLeave = useCallback(() => {
    clearCloseTimeout()
    setMegaMenuOpen(false)
    setActiveMenu(null)
  }, [clearCloseTimeout])

  return (
    <>
      <header className="nav-modern sticky top-0 z-40 bg-white/98 backdrop-blur-2xl border-b border-gray-100 transition-all duration-300" role="banner">
        {/* Top bar with email and quick links */}
        <div className="bg-black text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Quick Links */}
            <div className="hidden md:flex items-center gap-4 text-xs tracking-wider">
              <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
              <span className="text-gray-600">|</span>
              <Link href="/services" className="hover:text-gray-300 transition-colors">Services</Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/contact"
                className="hover:text-gray-300 transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Email */}
            <a
              href="mailto:info@pgclosets.com"
              className="text-sm md:text-base font-medium tracking-wider hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1 mx-auto md:mx-0"
              aria-label="Email us for a free quote at info@pgclosets.com"
            >
              📧 Email a Designer: info@pgclosets.com
            </a>

            {/* Empty div for flex spacing on desktop */}
            <div className="hidden md:block w-32" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label="PG Closets - Go to homepage"
          >
            <div className="relative w-12 h-12">
              <PGLogo
                width={48}
                height={48}
                withWordmark={false}
                aria-hidden="true"
                className="text-black"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-[0.2em] text-black leading-none">
                PG CLOSETS
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-[0.15em] mt-0.5">OTTAWA</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <Link
              href="/"
              className="relative text-gray-900 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-pg-navy px-4 py-3 group touch-target"
            >
              <span className="relative">Home</span>
              <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-pg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>

            <div className="relative group/menu">
              <Button
                variant="ghost"
                size="default"
                onClick={() => handleMenuClick('products')}
                onMouseEnter={() => handleMenuHover('products')}
                onMouseLeave={handleMenuLeave}
                className="flex items-center space-x-1 relative text-gray-900 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-pg-navy px-4 py-3 group touch-target h-auto"
                aria-expanded={megaMenuOpen && activeMenu === 'products'}
                aria-haspopup="true"
                aria-controls="products-mega-menu"
              >
                <span className="relative">Products</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen && activeMenu === 'products' ? 'rotate-180' : ''}`} aria-hidden="true" />
                <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-pg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Button>
              {megaMenuOpen && activeMenu === 'products' && (
                <div
                  id="products-mega-menu"
                  className="absolute left-0 top-full pt-2"
                  onMouseEnter={handleMegaMenuMouseEnter}
                  onMouseLeave={handleMegaMenuMouseLeave}
                  role="menu"
                  aria-label="Products menu"
                >
                  <div className="pointer-events-auto">
                    <MegaMenu
                      isOpen={megaMenuOpen}
                      activeMenu={activeMenu}
                      onClose={() => {
                        clearCloseTimeout()
                        setMegaMenuOpen(false)
                        setActiveMenu(null)
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="relative text-gray-900 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-pg-navy px-4 py-3 group touch-target"
            >
              <span className="relative">About</span>
              <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-pg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>

            <div className="relative group/menu">
              <Button
                variant="ghost"
                size="default"
                onClick={() => handleMenuClick('services')}
                onMouseEnter={() => handleMenuHover('services')}
                onMouseLeave={handleMenuLeave}
                className="flex items-center space-x-1 relative text-gray-900 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-pg-navy px-4 py-3 group touch-target h-auto"
                aria-expanded={megaMenuOpen && activeMenu === 'services'}
                aria-haspopup="true"
                aria-controls="services-mega-menu"
              >
                <span className="relative">Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen && activeMenu === 'services' ? 'rotate-180' : ''}`} aria-hidden="true" />
                <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-pg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Button>
              {megaMenuOpen && activeMenu === 'services' && (
                <div
                  id="services-mega-menu"
                  className="absolute left-0 top-full pt-2"
                  onMouseEnter={handleMegaMenuMouseEnter}
                  onMouseLeave={handleMegaMenuMouseLeave}
                  role="menu"
                  aria-label="Services menu"
                >
                  <div className="pointer-events-auto">
                    <MegaMenu
                      isOpen={megaMenuOpen}
                      activeMenu={activeMenu}
                      onClose={() => {
                        clearCloseTimeout()
                        setMegaMenuOpen(false)
                        setActiveMenu(null)
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="relative text-gray-900 font-medium text-sm tracking-[0.05em] transition-colors duration-200 hover:text-pg-navy px-4 py-3 group touch-target"
            >
              <span className="relative">Contact</span>
              <span className="absolute bottom-0 left-4 right-4 h-[1px] bg-pg-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>


            <Button
              href="/request-work"
              variant="brand-primary"
              size="default"
              className="relative ml-6 text-xs tracking-[0.1em] touch-target"
              aria-label="Get your free design consultation - No obligation"
            >
              Get FREE Design Consultation
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={toggleMobileMenu}
              variant="ghost"
              size="icon"
              className="mobile-menu-toggle touch-target rounded-lg"
              aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
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
                className={`transition-transform duration-300 ${isMobileMenuOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                className={`absolute transition-transform duration-300 ${isMobileMenuOpen ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-90 -rotate-90'}`}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </Button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Slide-out menu from left for better thumb accessibility */}
          <div
            className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-start p-4">
              <Button
                onClick={closeMobileMenu}
                variant="ghost"
                size="icon"
                className="touch-target rounded-lg"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            </div>

            {/* Mobile Logo Section */}
            <div className="px-6 py-6 border-b border-gray-200">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center justify-center gap-3">
                <PGLogo
                  width={48}
                  height={48}
                  withWordmark={false}
                  className="text-black"
                />
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-black">PG CLOSETS</h2>
                  <p className="text-xs text-gray-600 font-medium uppercase tracking-widest">Quality Closets</p>
                </div>
              </Link>
            </div>

            {/* Navigation items */}
            <nav className="px-6 py-4" role="navigation" aria-label="Mobile navigation">
              <div className="space-y-2">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="nav-item block text-lg font-medium text-black hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-4 py-3 group"
                >
                  <span className="flex items-center justify-between">
                    <span>Home</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/products"
                  onClick={closeMobileMenu}
                  className="nav-item block text-lg font-medium text-black hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-4 py-3 group"
                >
                  <span className="flex items-center justify-between">
                    <span>Products</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="nav-item block text-lg font-medium text-black hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-4 py-3 group"
                >
                  <span className="flex items-center justify-between">
                    <span>About</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/services"
                  onClick={closeMobileMenu}
                  className="nav-item block text-lg font-medium text-black hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-4 py-3 group"
                >
                  <span className="flex items-center justify-between">
                    <span>Services</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="nav-item block text-lg font-medium text-black hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-4 py-3 group"
                >
                  <span className="flex items-center justify-between">
                    <span>Contact</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>

                {/* Quick contact info */}
                <div className="py-4 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Need help?</p>
                    <a
                      href="tel:+1-613-123-4567"
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +1 (613) 123-4567
                    </a>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    href="/request-work"
                    onClick={closeMobileMenu}
                    variant="brand-primary"
                    size="lg"
                    className="w-full rounded-lg"
                    aria-label="Get your free quote - No obligation"
                  >
                    Get Your FREE Quote
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
