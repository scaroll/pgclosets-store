"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, ChevronRight, Home, Search, ShoppingCart, Mail } from "@/components/ui/icons"
import Link from "next/link"
import { memo } from "react"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Products", href: "/products", hasSubmenu: true },
  { name: "Store", href: "/store", hasSubmenu: true },
  { name: "Gallery", href: "/gallery" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const productCategories = [
  { name: "Barn Doors", href: "/products?category=barn-doors", badge: "Popular", count: 32 },
  { name: "Bypass Doors", href: "/products?category=bypass-doors", count: 18 },
  { name: "Bifold Doors", href: "/products?category=bifold-doors", count: 15 },
  { name: "Hardware", href: "/products?category=hardware", count: 10 },
  { name: "View All Products", href: "/products", count: 75 },
]

const ottawaLocations = [
  { name: "Ottawa", href: "/ottawa" },
  { name: "Kanata", href: "/kanata" },
  { name: "Nepean", href: "/nepean" },
  { name: "Orleans", href: "/orleans" },
  { name: "Barrhaven", href: "/barrhaven" },
]

export const MobileMenu = memo(function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel - Enhanced responsive behavior */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white border-l border-gray-200 shadow-2xl animate-slide-in-right safe-area-insets"
           style={{ maxWidth: 'min(85vw, 400px)' }}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-slate-50">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 font-serif">PG Closets</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="touch-target-fix min-h-[48px] min-w-[48px] hover:bg-gray-100 active:bg-gray-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Enhanced Search - Mobile optimized */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/search" onClick={onClose}>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent touch-manipulation min-h-[44px] text-base mb-3"
                aria-label="Search closet doors Ottawa"
              >
                <Search className="w-4 h-4 mr-3" />
                Search doors near me...
              </Button>
            </Link>

            {/* Quick Search Tags */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/products?category=barn-doors"
                onClick={onClose}
                className="px-3 py-1 bg-slate-100 text-xs text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                Barn Doors
              </Link>
              <Link
                href="/products?category=hardware"
                onClick={onClose}
                className="px-3 py-1 bg-slate-100 text-xs text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                Hardware
              </Link>
              <Link
                href="/services"
                onClick={onClose}
                className="px-3 py-1 bg-slate-100 text-xs text-slate-700 rounded-full hover:bg-slate-200 transition-colors"
              >
                Installation
              </Link>
            </div>
          </div>

          {/* Quick Local Actions for Ottawa */}
          <div className="p-4 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Link href="/contact" onClick={onClose}>
                <Button
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white touch-manipulation min-h-[44px] text-sm"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Contact
                </Button>
              </Link>
              <Link href="/request-work" onClick={onClose}>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full touch-manipulation min-h-[44px] text-sm"
                >
                  Get Quote
                </Button>
              </Link>
            </div>
            <div className="text-xs text-gray-500 text-center">
              📍 Serving Ottawa & surrounding areas
            </div>
          </div>

          {/* Navigation - Touch optimized */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => (
                <div key={item.name} className="mobile-menu-item">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors group touch-manipulation min-h-[44px]"
                    aria-label={`Navigate to ${item.name} ${item.name === 'Products' ? 'closet doors' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon && <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />}
                      <span className="font-medium text-gray-900 group-hover:text-blue-600 text-base">{item.name}</span>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                    )}
                  </Link>

                  {/* Product Submenu - Mobile optimized */}
                  {item.name === "Products" && (
                    <div className="ml-4 mt-1 space-y-1 pb-2 border-l-2 border-gray-100">
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={onClose}
                          className="flex items-center justify-between p-3 ml-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors group touch-manipulation min-h-[44px]"
                          aria-label={`Shop ${category.name} in Ottawa`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600 group-hover:text-blue-600">
                                {category.name}
                              </span>
                              {category.badge && (
                                <Badge className="bg-blue-50 text-blue-700 text-xs px-2 py-1">{category.badge}</Badge>
                              )}
                            </div>
                            {category.count && (
                              <span className="text-xs text-gray-400 group-hover:text-blue-500">
                                ({category.count})
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Store Submenu - Ottawa locations */}
                  {item.name === "Store" && (
                    <div className="ml-4 mt-1 space-y-1 pb-2 border-l-2 border-gray-100">
                      {ottawaLocations.map((location) => (
                        <Link
                          key={location.name}
                          href={location.href}
                          onClick={onClose}
                          className="flex items-center p-3 ml-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors group touch-manipulation min-h-[44px]"
                          aria-label={`Closet doors in ${location.name}, Ontario`}
                        >
                          <span className="text-sm text-gray-600 group-hover:text-blue-600">
                            📍 {location.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <Separator className="mx-4" />

            {/* Quick Actions - Touch optimized */}
            <div className="p-4 space-y-3">
              <Link href="/simple-cart" onClick={onClose}>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent touch-manipulation min-h-[44px] text-base"
                  aria-label="View shopping cart"
                >
                  <ShoppingCart className="w-4 h-4 mr-3" />
                  Shopping Cart
                </Button>
              </Link>

              <Link href="/installation-ottawa" onClick={onClose}>
                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-700 touch-manipulation min-h-[44px] text-base"
                  aria-label="Learn about professional installation in Ottawa"
                >
                  Installation Info
                </Button>
              </Link>
            </div>
          </div>

          {/* Footer - Ottawa contact info */}
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <a
                href="mailto:spencer@peoplesgrp.com"
                className="hover:text-blue-600 transition-colors touch-manipulation"
                aria-label="Email PG Closets"
              >
                spencer@peoplesgrp.com
              </a>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
              🍁 Proudly serving Ottawa & Eastern Ontario
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})