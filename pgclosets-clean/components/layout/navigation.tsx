'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Search, ShoppingBag, Phone } from 'lucide-react'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navigationItems = [
    {
      label: 'Home',
      href: '/',
      description: 'Back to homepage'
    },
    {
      label: 'Products',
      href: '/products',
      description: 'Browse our closet door collection'
    },
    {
      label: 'Store',
      href: '/store',
      description: 'Shop online catalog'
    },
    {
      label: 'About',
      href: '/about',
      description: 'Learn about PG Closets'
    },
    {
      label: 'Contact',
      href: '/contact',
      description: 'Get in touch with us'
    }
  ]

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href) || false
  }

  return (
    <nav
      className={`relative transition-all duration-300 ${
        isScrolled ? 'bg-white/98 backdrop-blur-md shadow-soft' : 'bg-white/95'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-apple">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="group flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded-lg p-1"
              aria-label="PG Closets - Home"
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-pg-navy to-pg-sky rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  <span className="text-white font-bold text-lg lg:text-xl">PG</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-pg-navy to-pg-sky rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-h3 text-pg-navy font-bold">PG Closets</h1>
                <p className="text-xs text-pg-gray -mt-1">Premium Doors</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative group px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 ${
                  isActiveLink(item.href)
                    ? 'text-pg-navy bg-pg-offwhite'
                    : 'text-pg-gray hover:text-pg-navy hover:bg-pg-offwhite/50'
                }`}
                aria-label={item.description}
              >
                {item.label}
                {isActiveLink(item.href) && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-pg-navy rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">

            {/* Search Button */}
            <button
              type="button"
              className="p-2 text-pg-gray hover:text-pg-navy transition-colors duration-200 rounded-lg hover:bg-pg-offwhite focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Call to Action */}
            <Link
              href="/contact"
              className="hidden sm:inline-flex items-center space-x-2 btn-primary text-sm"
              aria-label="Get a quote"
            >
              <Phone className="w-4 h-4" />
              <span>Get Quote</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-pg-gray hover:text-pg-navy transition-colors duration-200 rounded-lg hover:bg-pg-offwhite focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="py-4 space-y-2 border-t border-pg-border">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg ${
                  isActiveLink(item.href)
                    ? 'text-pg-navy bg-pg-offwhite border-l-4 border-pg-navy'
                    : 'text-pg-gray hover:text-pg-navy hover:bg-pg-offwhite/50'
                }`}
                aria-label={item.description}
              >
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-pg-gray mt-1">{item.description}</div>
                </div>
              </Link>
            ))}

            {/* Mobile CTA */}
            <div className="pt-4">
              <Link
                href="/contact"
                className="btn-primary w-full justify-center"
                aria-label="Get a quote - mobile"
              >
                <Phone className="w-4 h-4 mr-2" />
                Get Your Quote
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-[-1]"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  )
}

export default Navigation