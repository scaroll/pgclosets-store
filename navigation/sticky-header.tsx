"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CartIcon } from "@/components/ui/cart-icon"
import { Phone, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface StickyHeaderProps {
  className?: string
}

export function StickyHeader({ className = "" }: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigationItems = [
    { label: "Gallery", href: "/gallery" },
    { label: "Pricing", href: "/pricing" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200" : "bg-white/80 backdrop-blur-sm"
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-navy rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-lg lg:text-xl">PG</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-bold text-navy">PG Closets</span>
                <p className="text-xs text-charcoal">Ottawa Made</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-charcoal hover:text-navy font-semibold transition-colors duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-navy transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-charcoal">
                <Phone className="w-4 h-4 text-forest" />
                <a href="tel:613-422-5800" className="font-semibold hover:text-navy transition-colors duration-300">
                  (613) 422-5800
                </a>
              </div>
              <CartIcon />
              <Link href="/consultation">
                <Button className="bg-forest hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Free Consultation
                </Button>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center space-x-2">
              <CartIcon />
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-charcoal" /> : <Menu className="w-6 h-6 text-charcoal" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-3 text-lg font-semibold text-charcoal hover:text-navy transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-200 space-y-4">
                <a
                  href="tel:613-422-5800"
                  className="flex items-center space-x-3 py-3 text-lg font-semibold text-forest hover:text-green-700 transition-colors duration-300"
                >
                  <Phone className="w-5 h-5" />
                  <span>(613) 422-5800</span>
                </a>

                <Link href="/consultation" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-forest hover:bg-green-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg">
                    Free Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  )
}
