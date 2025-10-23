'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  ChevronDown,
  ShoppingBag,
  Phone,
  Search,
  User,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { menuContainer, menuItem, searchInput } from '@/lib/animations/variants'

interface NavItem {
  title: string
  href: string
  submenu?: NavItem[]
  badge?: string
}

const navItems: NavItem[] = [
  {
    title: 'Products',
    href: '/products',
    submenu: [
      { title: 'Closet Systems', href: '/products/closet-systems' },
      { title: 'Barn Doors', href: '/products/barn-doors' },
      { title: 'Room Dividers', href: '/products/room-dividers' },
      { title: 'Hardware', href: '/products/hardware' }
    ]
  },
  {
    title: 'Collections',
    href: '/collections',
    submenu: [
      { title: 'Renin Barn Doors', href: '/collections/renin-barn-doors' },
      { title: 'Renin Closet Doors', href: '/collections/renin-closet-doors' },
      { title: 'Mirrors', href: '/collections/mirrors' }
    ]
  },
  {
    title: 'Services',
    href: '/services',
    submenu: [
      { title: 'Consultation', href: '/process/consultation' },
      { title: 'Design', href: '/process/design' },
      { title: 'Installation', href: '/process/installation' }
    ]
  },
  { title: 'Gallery', href: '/gallery' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' }
]

export default function AnimatedNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(3)
  const pathname = usePathname()

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
    setActiveSubmenu(null)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (!isMobileMenuOpen) {
      setActiveSubmenu(null)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="text-2xl font-bold text-primary">
              PG Closets
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.title}
                className="relative"
                onHoverStart={() => setActiveSubmenu(item.title)}
                onHoverEnd={() => setActiveSubmenu(null)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-medium ${
                    pathname === item.href ? 'text-primary' : ''
                  }`}
                >
                  {item.title}
                  {item.submenu && (
                    <motion.div
                      animate={{ rotate: activeSubmenu === item.title ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  )}
                  {item.badge && (
                    <Badge variant="destructive" className="ml-2 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {activeSubmenu === item.title && item.submenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border overflow-hidden"
                    >
                      {item.submenu.map((subItem) => (
                        <motion.div
                          key={subItem.title}
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            href={subItem.href}
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="hidden md:flex"
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Phone */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden lg:inline">(613) 123-4567</span>
            </motion.div>

            {/* User */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </motion.div>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="hidden md:flex relative">
                <Heart className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  2
                </Badge>
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold"
                    >
                      {cartCount}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileMenu}
                className="lg:hidden"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              variants={searchInput}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="py-4 border-t"
            >
              <div className="max-w-2xl mx-auto">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full"
                  autoFocus
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={menuContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden border-t bg-white"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <motion.div key={item.title} variants={menuItem}>
                  <div>
                    {item.submenu ? (
                      <button
                        onClick={() =>
                          setActiveSubmenu(
                            activeSubmenu === item.title ? null : item.title
                          )
                        }
                        className="flex items-center justify-between w-full py-3 text-left font-medium text-gray-700 hover:text-primary transition-colors"
                      >
                        {item.title}
                        <motion.div
                          animate={{
                            rotate: activeSubmenu === item.title ? 180 : 0
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-3 font-medium text-gray-700 hover:text-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                    )}

                    {/* Mobile Submenu */}
                    <AnimatePresence>
                      {activeSubmenu === item.title && item.submenu && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden pl-4"
                        >
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className="block py-2 text-sm text-gray-600 hover:text-primary transition-colors"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              {/* Mobile Actions */}
              <motion.div variants={menuItem} className="pt-4 border-t space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  (613) 123-4567
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}