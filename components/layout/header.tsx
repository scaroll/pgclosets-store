'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, ShoppingCart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Products', href: '/products' },
    { name: 'Collections', href: '/collections' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      {/* Top Bar with Contact Info */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a
              href="tel:+16137016393"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>(613) 701-6393</span>
            </a>
            <span className="hidden md:inline text-gray-400">|</span>
            <a
              href="mailto:info@pgclosets.com"
              className="hidden md:inline hover:text-primary transition-colors"
            >
              info@pgclosets.com
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-gray-400">Ottawa, ON • Serving Greater Ottawa Area</span>
            <Link href="/book-measure" className="text-primary hover:underline font-medium">
              Free Consultation
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">PG Closets</span>
            <span className="hidden sm:inline text-sm text-gray-500">Premium Door Solutions</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/quote" className="hidden md:block">
              <Button>Get Quote</Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t mt-4">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t flex flex-col gap-2">
                <Link href="/quote">
                  <Button className="w-full">Get Quote</Button>
                </Link>
                <a href="tel:+16137016393">
                  <Button variant="outline" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call (613) 701-6393
                  </Button>
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
