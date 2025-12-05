"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Search, ShoppingBag, User, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"

// Product categories for mega menu
const productCategories = [
  {
    name: "Walk-In Closets",
    href: "/products/walk-in-closets",
    description: "Custom luxury walk-in closet systems",
  },
  {
    name: "Reach-In Closets",
    href: "/products/reach-in-closets",
    description: "Space-efficient closet solutions",
  },
  {
    name: "Wardrobe Systems",
    href: "/products/wardrobes",
    description: "Freestanding wardrobe collections",
  },
  {
    name: "Storage Solutions",
    href: "/products/storage",
    description: "Organizational accessories and add-ons",
  },
  {
    name: "Hardware & Finishes",
    href: "/products/hardware",
    description: "Premium handles, pulls, and finishes",
  },
  {
    name: "Custom Projects",
    href: "/products/custom",
    description: "Bespoke closet design services",
  },
]

const navigation = [
  { name: "Products", href: "/products", hasDropdown: true },
  { name: "Collections", href: "/collections" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const cartItemCount = getTotalItems()

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 10
      setIsScrolled(scrolled)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b shadow-sm py-3"
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 transition-opacity duration-300 hover:opacity-70"
            >
              <div className="text-2xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-apple-blue-600 to-woodgrain-600 bg-clip-text text-transparent">
                  PG Closets
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <DropdownMenu
                      open={isProductsMenuOpen}
                      onOpenChange={setIsProductsMenuOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            "text-sm font-medium transition-all duration-300 hover:opacity-70 px-4 py-2",
                            pathname.startsWith(item.href) && "text-apple-blue-600 dark:text-apple-blue-dark"
                          )}
                        >
                          {item.name}
                          <ChevronDown
                            className={cn(
                              "ml-1 h-4 w-4 transition-transform duration-300",
                              isProductsMenuOpen && "rotate-180"
                            )}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[600px] p-4"
                        sideOffset={8}
                      >
                        <div className="grid grid-cols-2 gap-4">
                          {productCategories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="group block p-3 rounded-lg transition-all duration-300 hover:bg-accent"
                            >
                              <div className="font-medium text-sm mb-1 group-hover:text-apple-blue-600 dark:group-hover:text-apple-blue-dark transition-colors duration-300">
                                {category.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {category.description}
                              </div>
                            </Link>
                          ))}
                        </div>
                        <DropdownMenuSeparator className="my-3" />
                        <Link
                          href="/products"
                          className="block text-center text-sm font-medium text-apple-blue-600 dark:text-apple-blue-dark hover:underline"
                        >
                          View All Products →
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "text-sm font-medium transition-all duration-300 hover:opacity-70 px-4 py-2",
                          pathname === item.href && "text-apple-blue-600 dark:text-apple-blue-dark"
                        )}
                      >
                        {item.name}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              {/* Get Quote Button - Desktop */}
              <Link href="/request-quote" className="hidden lg:block">
                <Button
                  className="bg-apple-blue-600 dark:bg-apple-blue-dark text-white hover:opacity-90 transition-all duration-300 px-6 py-2 font-medium"
                >
                  Get Quote
                </Button>
              </Link>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="transition-all duration-300 hover:opacity-70"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart Button */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative transition-all duration-300 hover:opacity-70"
                  aria-label={`Shopping cart with ${cartItemCount} items`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-apple-blue-600 dark:bg-apple-blue-dark text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="transition-all duration-300 hover:opacity-70"
                    aria-label="User menu"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden transition-all duration-300 hover:opacity-70"
                    aria-label="Menu"
                  >
                    {isMobileMenuOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:w-[400px] overflow-y-auto"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile Search */}
                    <div className="mb-6 mt-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type="search"
                          placeholder="Search products..."
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue-600 dark:focus:ring-apple-blue-dark"
                        />
                      </div>
                    </div>

                    {/* Get Quote Button - Mobile */}
                    <div className="mb-6">
                      <Link href="/request-quote" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button
                          className="w-full bg-apple-blue-600 dark:bg-apple-blue-dark text-white hover:opacity-90 transition-all duration-300 py-3 font-medium text-base"
                        >
                          Get Quote
                        </Button>
                      </Link>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1">
                      <Accordion type="single" collapsible className="w-full">
                        {navigation.map((item) => (
                          <div key={item.name}>
                            {item.hasDropdown ? (
                              <AccordionItem value={item.name}>
                                <AccordionTrigger className="text-base font-medium hover:no-underline">
                                  {item.name}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex flex-col space-y-3 pl-4">
                                    {productCategories.map((category) => (
                                      <Link
                                        key={category.name}
                                        href={category.href}
                                        className="group py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                      >
                                        <div className="font-medium text-sm mb-1 group-hover:text-apple-blue-600 dark:group-hover:text-apple-blue-dark transition-colors duration-300">
                                          {category.name}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          {category.description}
                                        </div>
                                      </Link>
                                    ))}
                                    <Link
                                      href="/products"
                                      className="text-sm font-medium text-apple-blue-600 dark:text-apple-blue-dark hover:underline pt-2 border-t"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      View All Products →
                                    </Link>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ) : (
                              <Link
                                href={item.href}
                                className={cn(
                                  "block py-4 border-b text-base font-medium transition-colors duration-300 hover:text-apple-blue-600 dark:hover:text-apple-blue-dark",
                                  pathname === item.href && "text-apple-blue-600 dark:text-apple-blue-dark"
                                )}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item.name}
                              </Link>
                            )}
                          </div>
                        ))}
                      </Accordion>

                      {/* Mobile Account Links */}
                      <div className="mt-8 pt-8 border-t space-y-4">
                        <Link
                          href="/account/profile"
                          className="block text-sm font-medium hover:text-apple-blue-600 dark:hover:text-apple-blue-dark transition-colors duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block text-sm font-medium hover:text-apple-blue-600 dark:hover:text-apple-blue-dark transition-colors duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          href="/account/wishlist"
                          className="block text-sm font-medium hover:text-apple-blue-600 dark:hover:text-apple-blue-dark transition-colors duration-300"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                      </div>
                    </nav>

                    {/* Mobile Footer */}
                    <div className="pt-6 border-t mt-auto">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background border-b shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                    <input
                      type="search"
                      placeholder="Search for products, collections, or inspiration..."
                      className="w-full pl-14 pr-12 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-apple-blue-600 dark:focus:ring-apple-blue-dark focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Press ESC to close
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className={cn("h-16 transition-all duration-300", isScrolled ? "h-14" : "h-16")} />
    </>
  )
}
