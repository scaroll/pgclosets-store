"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Menu, Search, ShoppingCart, User } from "lucide-react"
import { CartSidebar } from "@/components/checkout/cart-sidebar"
import { useCart } from "@/components/commerce/cart-context"
import Link from "next/link"
import { useState } from "react"

export function StoreHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cart } = useCart()
  const itemCount = cart?.totalQuantity || 0

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/store" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PG</span>
            </div>
            <span className="font-bold text-xl text-foreground">PG Closets</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/store/products" className="text-foreground hover:text-primary transition-colors">
              All Products
            </Link>
            <Link
              href="/store/products?category=barn-doors"
              className="text-foreground hover:text-primary transition-colors"
            >
              Barn Doors
            </Link>
            <Link
              href="/store/products?category=closet-systems"
              className="text-foreground hover:text-primary transition-colors"
            >
              Closet Systems
            </Link>
            <Link href="/store/inspiration" className="text-foreground hover:text-primary transition-colors">
              Inspiration
            </Link>
            <Link href="/store/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search products..." className="pl-10 bg-card border-border" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
            <CartSidebar>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </CartSidebar>
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/store/products" className="text-foreground hover:text-primary transition-colors">
                All Products
              </Link>
              <Link
                href="/store/products?category=barn-doors"
                className="text-foreground hover:text-primary transition-colors"
              >
                Barn Doors
              </Link>
              <Link
                href="/store/products?category=closet-systems"
                className="text-foreground hover:text-primary transition-colors"
              >
                Closet Systems
              </Link>
              <Link href="/store/inspiration" className="text-foreground hover:text-primary transition-colors">
                Inspiration
              </Link>
              <Link href="/store/about" className="text-foreground hover:text-primary transition-colors">
                About
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
