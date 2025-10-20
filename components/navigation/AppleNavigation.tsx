/**
 * Apple-Style Navigation Component
 *
 * Premium navigation with glass morphism, scroll effects, mega menu,
 * mobile drawer, and search integration.
 *
 * Features:
 * - Glass morphism with backdrop blur on scroll
 * - Smooth scroll hiding/showing behavior
 * - Mega menu for products
 * - Mobile hamburger menu
 * - Search integration
 * - Keyboard shortcuts
 * - Accessibility compliant
 */

"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Menu, X, Phone, Mail, ChevronDown } from "lucide-react"
import { PGLogo } from "../ui/pg-logo"
import { cn } from "@/lib/utils"

// Navigation items configuration
const NAVIGATION_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
    href: "/products",
    hasMegaMenu: true,
    megaMenuItems: [
      {
        category: "Door Types",
        items: [
          { label: "Barn Doors", href: "/products?category=barn-doors" },
          { label: "Bifold Doors", href: "/products?category=bifold-doors" },
          { label: "Bypass Doors", href: "/products?category=bypass-doors" },
          { label: "Pivot Doors", href: "/products?category=pivot-doors" },
        ],
      },
      {
        category: "Hardware & Accessories",
        items: [
          { label: "Hardware", href: "/products?category=hardware" },
          { label: "Handles & Pulls", href: "/products?category=handles" },
          { label: "Track Systems", href: "/products?category=tracks" },
        ],
      },
      {
        category: "Browse All",
        items: [
          { label: "View All Products", href: "/products" },
          { label: "Custom Solutions", href: "/products?category=custom" },
          { label: "Popular Picks", href: "/products?filter=popular" },
        ],
      },
    ],
  },
  {
    label: "Services",
    href: "/services",
    hasMegaMenu: true,
    megaMenuItems: [
      {
        category: "Our Services",
        items: [
          { label: "Free Consultation", href: "/services/consultation" },
          { label: "Custom Design", href: "/services/custom-design" },
          { label: "Professional Installation", href: "/services/installation" },
        ],
      },
      {
        category: "Support & Warranty",
        items: [
          { label: "Warranty & Support", href: "/services/warranty" },
          { label: "Maintenance", href: "/services/maintenance" },
          { label: "FAQ", href: "/services/faq" },
        ],
      },
    ],
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
]

export function AppleNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout>()

  // Enhanced scroll behavior with direction detection
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          // Determine if scrolled
          setIsScrolled(currentScrollY > 20)

          // Determine scroll direction (hide header when scrolling down past 100px)
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setIsScrollingUp(false) // Scrolling down
          } else {
            setIsScrollingUp(true) // Scrolling up
          }

          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Prevent body scroll when overlays are open
  useEffect(() => {
    if (isMobileOpen || isSearchOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen, isSearchOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      // Escape to close
      if (e.key === "Escape") {
        setIsSearchOpen(false)
        setIsMobileOpen(false)
        setActiveMegaMenu(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Mega menu handlers
  const handleMegaMenuEnter = useCallback((label: string) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current)
    }
    setActiveMegaMenu(label)
  }, [])

  const handleMegaMenuLeave = useCallback(() => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null)
    }, 200)
  }, [])

  return (
    <>
      {/* Main Navigation Header */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          // Glass morphism effect when scrolled
          isScrolled
            ? "glass-nav shadow-lg"
            : "bg-white border-b border-gray-100",
          // Hide header when scrolling down
          !isScrollingUp && isScrolled && "lg:-translate-y-full"
        )}
        initial={{ y: 0 }}
        animate={{ y: isScrollingUp || !isScrolled ? 0 : -100 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        role="banner"
      >
        {/* Top Utility Bar - Hidden when scrolled */}
        <motion.div
          className={cn(
            "bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden",
            "transition-all duration-300"
          )}
          initial={{ height: "auto", opacity: 1 }}
          animate={{
            height: isScrolled ? 0 : "auto",
            opacity: isScrolled ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-xs sm:text-sm">
              <div className="flex items-center gap-4">
                <a
                  href="tel:+16137016393"
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                  aria-label="Call us"
                >
                  <Phone className="w-3 h-3" />
                  <span className="hidden sm:inline">(613) 701-6393</span>
                </a>
                <a
                  href="mailto:info@pgclosets.com"
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                  aria-label="Email us"
                >
                  <Mail className="w-3 h-3" />
                  <span className="hidden sm:inline">info@pgclosets.com</span>
                </a>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="hidden md:inline text-amber-400 font-medium">
                  Free Consultation • Ottawa & Surrounding Areas
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Header Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 sm:gap-4 group z-10"
              aria-label="PG Closets - Home"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <PGLogo
                  width={56}
                  height={56}
                  withWordmark={false}
                  className="text-black sm:w-16 sm:h-16"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold tracking-[0.2em] text-black">
                  PG CLOSETS
                </span>
                <span className="hidden sm:block text-xs text-gray-500 font-medium tracking-[0.15em]">
                  OTTAWA
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1"
              role="navigation"
              aria-label="Main navigation"
            >
              {NAVIGATION_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() =>
                    item.hasMegaMenu && handleMegaMenuEnter(item.label)
                  }
                  onMouseLeave={handleMegaMenuLeave}
                >
                  {item.hasMegaMenu ? (
                    <button
                      className="flex items-center gap-1 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black transition-colors group relative"
                      aria-expanded={activeMegaMenu === item.label}
                      aria-haspopup="true"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          activeMegaMenu === item.label && "rotate-180"
                        )}
                      />
                      <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-black transition-colors group relative flex items-center"
                    >
                      <span>{item.label}</span>
                      <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </Link>
                  )}

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {item.hasMegaMenu && activeMegaMenu === item.label && (
                      <MegaMenuDropdown items={item.megaMenuItems} />
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Button */}
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors relative group mobile-touch-target"
                aria-label="Search products (⌘K)"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5 text-gray-700" />
                <span className="absolute -bottom-8 right-0 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden lg:block">
                  ⌘K
                </span>
              </motion.button>

              {/* CTA Button - Desktop */}
              <motion.div
                className="hidden lg:block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/request-work"
                  className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Free Consultation
                </Link>
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-3 hover:bg-gray-100 rounded-full transition-colors mobile-touch-target safe-area-right"
                aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isMobileOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        {isScrolled && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-black to-gray-700"
              style={{
                width: `${Math.min(
                  (lastScrollY /
                    (document.documentElement.scrollHeight -
                      window.innerHeight)) *
                    100,
                  100
                )}%`,
              }}
              initial={{ width: "0%" }}
              transition={{ duration: 0.1 }}
            />
          </motion.div>
        )}
      </motion.header>

      {/* Spacer to prevent content jump */}
      <div
        className={cn(
          "transition-all duration-300",
          isScrolled ? "h-16 sm:h-20" : "h-26 sm:h-30"
        )}
      />

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
}

// Mega Menu Dropdown Component
interface MegaMenuDropdownProps {
  items?: Array<{
    category: string
    items: Array<{ label: string; href: string }>
  }>
}

function MegaMenuDropdown({ items }: MegaMenuDropdownProps) {
  if (!items) return null

  return (
    <motion.div
      className="absolute top-full left-0 mt-2 w-screen max-w-4xl"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="glass-card rounded-2xl shadow-2xl border border-gray-200 p-8">
        <div className="grid grid-cols-3 gap-8">
          {items.map((category) => (
            <div key={category.category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {category.category}
              </h3>
              <ul className="space-y-3">
                {category.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-700 hover:text-black transition-colors block group"
                    >
                      <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// Mobile Drawer Component
interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto safe-area-all"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between safe-area-top">
              <div className="flex items-center gap-3">
                <PGLogo width={40} height={40} withWordmark={false} />
                <span className="text-xl font-bold tracking-wider">
                  PG CLOSETS
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors mobile-touch-target"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-6" role="navigation" aria-label="Mobile navigation">
              <ul className="space-y-2">
                {NAVIGATION_ITEMS.map((item) => (
                  <li key={item.label}>
                    {item.hasMegaMenu ? (
                      <div>
                        <button
                          onClick={() =>
                            setExpandedSection(
                              expandedSection === item.label
                                ? null
                                : item.label
                            )
                          }
                          className="w-full flex items-center justify-between px-4 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors mobile-touch-target"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              expandedSection === item.label && "rotate-180"
                            )}
                          />
                        </button>
                        <AnimatePresence>
                          {expandedSection === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pt-2 space-y-2">
                                {item.megaMenuItems?.map((category) => (
                                  <div key={category.category}>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2">
                                      {category.category}
                                    </p>
                                    <ul className="space-y-1">
                                      {category.items.map((subItem) => (
                                        <li key={subItem.label}>
                                          <Link
                                            href={subItem.href}
                                            onClick={onClose}
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mobile-touch-target"
                                          >
                                            {subItem.label}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="block px-4 py-4 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors mobile-touch-target"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-8">
                <Link
                  href="/request-work"
                  onClick={onClose}
                  className="block w-full px-6 py-3 bg-black text-white text-center font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  Free Consultation
                </Link>
              </div>

              {/* Contact Info */}
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
                <a
                  href="tel:+16137016393"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  <span>(613) 701-6393</span>
                </a>
                <a
                  href="mailto:info@pgclosets.com"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>info@pgclosets.com</span>
                </a>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Search Overlay Component
interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const popularSearches = [
    "Walk-in closets",
    "Pantry organization",
    "Garage storage",
    "Custom wardrobes",
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white/95 backdrop-blur-xl z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="min-h-screen px-4 py-20">
            <div className="max-w-3xl mx-auto">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close search"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, services..."
                  className="w-full pl-16 pr-6 py-6 text-2xl font-light border-b-2 border-gray-200 focus:border-black outline-none bg-transparent"
                  autoFocus
                />
              </div>

              {/* Popular Searches */}
              {!searchQuery && (
                <div className="mt-12">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => setSearchQuery(search)}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results would go here */}
              {searchQuery && (
                <div className="mt-8">
                  <p className="text-gray-500">
                    Search results for "{searchQuery}"...
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
