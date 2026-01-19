"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, ChevronRight, Home, Search, ShoppingCart, Phone, Mail } from "@/components/ui/icons"
import Link from "next/link"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Products", href: "/products", hasSubmenu: true },
  { name: "Solutions", href: "/solutions", hasSubmenu: true },
  { name: "Inspiration", href: "/inspiration" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const productCategories = [
  { name: "Walk-In Closets", href: "/products?category=walk-in" },
  { name: "Reach-In Closets", href: "/products?category=reach-in" },
  { name: "Barn Doors", href: "/products?category=barn-doors", badge: "Popular" },
  { name: "Hardware", href: "/products?category=hardware" },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Menu Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground font-serif">PG Closets</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-border">
            <Link href="/search" onClick={onClose}>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Search className="w-4 h-4 mr-3" />
                Search products...
              </Button>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon && <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />}
                      <span className="font-medium text-foreground group-hover:text-primary">{item.name}</span>
                    </div>
                    {item.hasSubmenu && (
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    )}
                  </Link>

                  {/* Product Submenu */}
                  {item.name === "Products" && (
                    <div className="ml-8 mt-2 space-y-1">
                      {productCategories.map((category) => (
                        <Link
                          key={category.name}
                          href={category.href}
                          onClick={onClose}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground group-hover:text-primary">
                              {category.name}
                            </span>
                            {category.badge && (
                              <Badge className="bg-accent/20 text-accent-foreground text-xs">{category.badge}</Badge>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <Separator className="mx-4" />

            {/* Quick Actions */}
            <div className="p-4 space-y-3">
              <Link href="/cart" onClick={onClose}>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ShoppingCart className="w-4 h-4 mr-3" />
                  Shopping Cart (0)
                </Button>
              </Link>

              <Link href="/consultation" onClick={onClose}>
                <Button className="w-full bg-primary hover:bg-primary/90">Free Consultation</Button>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-3">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>(416) 555-CLOSET</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>hello@pgclosets.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
