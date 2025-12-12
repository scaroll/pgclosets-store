'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, ShoppingBag, User, ChevronDown, Award } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'

// Renin product categories - matching the catalog
const productCategories = [
  {
    name: 'Barn Doors',
    href: '/collections/barn-doors',
    description: 'Modern sliding barn door solutions',
  },
  {
    name: 'Bypass Doors',
    href: '/collections/bypass-doors',
    description: 'Space-saving sliding bypass systems',
  },
  {
    name: 'Bifold Doors',
    href: '/collections/bifold-doors',
    description: 'Classic folding closet doors',
  },
  {
    name: 'Sliding Doors',
    href: '/collections/sliding-doors',
    description: 'Smooth sliding door systems',
  },
  {
    name: 'Mirrors',
    href: '/collections/mirrors',
    description: 'Mirrored door options',
  },
  {
    name: 'Hardware',
    href: '/collections/hardware',
    description: 'Premium door hardware and tracks',
  },
]

const navigation = [
  { name: 'Products', href: '/products', hasDropdown: true },
  { name: 'Collections', href: '/collections' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
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

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 transition-all duration-300 ease-out',
          isScrolled
            ? 'border-b border-warm-300 bg-warm-white/95 py-3 shadow-xs backdrop-blur-lg'
            : 'bg-transparent py-4'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-80"
            >
              <div className="text-xl font-medium tracking-tight text-slate-900">PG Closets</div>
              <span className="hidden items-center gap-1 rounded border border-bronze-200 bg-bronze-50 px-2 py-0.5 text-xs font-medium text-bronze-600 sm:inline-flex">
                <Award className="h-3 w-3" />
                Renin Dealer
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-1 lg:flex">
              {navigation.map(item => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <DropdownMenu open={isProductsMenuOpen} onOpenChange={setIsProductsMenuOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={cn(
                            'px-4 py-2 text-sm font-normal transition-all duration-200 hover:text-bronze-600',
                            pathname.startsWith(item.href) && 'text-bronze-600'
                          )}
                        >
                          {item.name}
                          <ChevronDown
                            className={cn(
                              'ml-1 h-4 w-4 transition-transform duration-200',
                              isProductsMenuOpen && 'rotate-180'
                            )}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="w-[550px] rounded-md p-4"
                        sideOffset={8}
                      >
                        <div className="grid grid-cols-2 gap-3">
                          {productCategories.map(category => (
                            <Link
                              key={category.name}
                              href={category.href}
                              className="group block rounded p-3 transition-all duration-200 hover:bg-warm-100"
                            >
                              <div className="mb-1 text-sm font-medium text-slate-900 transition-colors duration-200 group-hover:text-bronze-600">
                                {category.name}
                              </div>
                              <div className="text-xs text-slate-500">{category.description}</div>
                            </Link>
                          ))}
                        </div>
                        <DropdownMenuSeparator className="my-3" />
                        <Link
                          href="/products"
                          className="block text-center text-sm font-medium text-bronze-600 hover:text-bronze-700"
                        >
                          View All Products
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'px-4 py-2 text-sm font-normal transition-all duration-200 hover:text-bronze-600',
                          pathname === item.href && 'text-bronze-600'
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
            <div className="flex items-center space-x-1">
              {/* Book Consultation CTA - Desktop */}
              <Link href="/book-consultation" className="hidden lg:block">
                <Button
                  variant="default"
                  size="sm"
                  className="rounded bg-bronze-500 font-normal text-white hover:bg-bronze-600"
                >
                  Book Consultation
                </Button>
              </Link>

              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="transition-all duration-200 hover:text-bronze-600"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart Button */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative transition-all duration-200 hover:text-bronze-600"
                  aria-label={`Shopping cart with ${cartItemCount} items`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-bronze-500 text-xs font-medium text-white"
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
                    className="transition-all duration-200 hover:text-bronze-600"
                    aria-label="User menu"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-md">
                  <DropdownMenuLabel className="font-normal">My Account</DropdownMenuLabel>
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
                    className="transition-all duration-200 hover:text-bronze-600 lg:hidden"
                    aria-label="Menu"
                  >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full overflow-y-auto sm:w-[400px]">
                  <div className="flex h-full flex-col">
                    {/* Mobile Renin Badge */}
                    <div className="mb-4 flex items-center justify-center gap-2 border-b border-warm-200 py-3">
                      <Award className="h-4 w-4 text-bronze-500" />
                      <span className="text-sm font-medium text-bronze-600">
                        Official Renin Dealer
                      </span>
                    </div>

                    {/* Mobile Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="search"
                          placeholder="Search products..."
                          className="w-full rounded border border-warm-300 bg-warm-50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-bronze-400"
                        />
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex-1">
                      <Accordion type="single" collapsible className="w-full">
                        {navigation.map(item => (
                          <div key={item.name}>
                            {item.hasDropdown ? (
                              <AccordionItem value={item.name} className="border-warm-200">
                                <AccordionTrigger className="text-base font-normal hover:text-bronze-600 hover:no-underline">
                                  {item.name}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex flex-col space-y-2 pl-4">
                                    {productCategories.map(category => (
                                      <Link
                                        key={category.name}
                                        href={category.href}
                                        className="group py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                      >
                                        <div className="mb-0.5 text-sm font-normal text-slate-700 transition-colors duration-200 group-hover:text-bronze-600">
                                          {category.name}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                          {category.description}
                                        </div>
                                      </Link>
                                    ))}
                                    <Link
                                      href="/products"
                                      className="border-t border-warm-200 pt-2 text-sm font-medium text-bronze-600 hover:text-bronze-700"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      View All Products
                                    </Link>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            ) : (
                              <Link
                                href={item.href}
                                className={cn(
                                  'block border-b border-warm-200 py-4 text-base font-normal transition-colors duration-200 hover:text-bronze-600',
                                  pathname === item.href && 'text-bronze-600'
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
                      <div className="mt-8 space-y-4 border-t border-warm-200 pt-8">
                        <Link
                          href="/account/profile"
                          className="block text-sm font-normal text-slate-600 transition-colors duration-200 hover:text-bronze-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block text-sm font-normal text-slate-600 transition-colors duration-200 hover:text-bronze-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          href="/account/wishlist"
                          className="block text-sm font-normal text-slate-600 transition-colors duration-200 hover:text-bronze-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                      </div>
                    </nav>

                    {/* Mobile Footer */}
                    <div className="mt-auto space-y-3 border-t border-warm-200 pt-6">
                      <Link href="/book-consultation" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full rounded bg-bronze-500 text-white hover:bg-bronze-600">
                          Book Consultation
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full rounded border-warm-300"
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
            className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="border-b border-warm-300 bg-warm-white shadow-sm"
              onClick={e => e.stopPropagation()}
            >
              <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      placeholder="Search for products, collections..."
                      className="w-full rounded border border-warm-300 bg-white py-3 pl-12 pr-12 text-base focus:outline-none focus:ring-1 focus:ring-bronze-400"
                    />
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 hover:text-slate-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-3 text-center text-xs text-slate-400">Press ESC to close</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className={cn('transition-all duration-300', isScrolled ? 'h-14' : 'h-16')} />
    </>
  )
}
