"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Search, Menu, X, Phone, Mail } from "lucide-react"
import { PGLogo } from "../ui/pg-logo"
import { EnhancedMegaMenu } from "./EnhancedMegaMenu"
import { EnhancedMobileDrawer } from "./EnhancedMobileDrawer"
import { EnhancedSearchOverlay } from "./EnhancedSearchOverlay"
import { QuickActions } from "./QuickActions"
import { cn } from "@/lib/utils"
import SkipNavigation from "./SkipNavigation"

export function EnhancedHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingUp, setIsScrollingUp] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Enhanced scroll behavior with direction detection
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY

          // Determine if scrolled
          setIsScrolled(currentScrollY > 20)

          // Determine scroll direction
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

  // Prevent body scroll when mobile menu is open
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
      // Escape to close
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearchOpen = useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false)
  }, [])

  const handleMobileToggle = useCallback(() => {
    setIsMobileOpen(!isMobileOpen)
  }, [isMobileOpen])

  const handleMobileClose = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  return (
    <>
      {/* Skip Navigation for Accessibility */}
      <SkipNavigation />

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/98 backdrop-blur-md shadow-md"
            : "bg-white",
          // Hide header when scrolling down (except on mobile)
          !isScrollingUp && isScrolled && "lg:-translate-y-full"
        )}
        role="banner"
      >
        {/* Top utility bar - hidden when scrolled */}
        <div
          className={cn(
            "bg-gradient-to-r from-gray-900 to-gray-800 text-white transition-all duration-300 overflow-hidden",
            isScrolled ? "h-0 opacity-0" : "h-auto opacity-100"
          )}
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
        </div>

        {/* Main header */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2 sm:gap-3 group"
                aria-label="PG Closets - Home"
              >
                <PGLogo
                  width={36}
                  height={36}
                  withWordmark={false}
                  className="text-black transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-bold tracking-[0.2em] text-black font-inter">
                    PG CLOSETS
                  </span>
                  <span className="hidden sm:block text-[10px] text-gray-500 font-medium tracking-[0.15em]">
                    OTTAWA
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                <EnhancedMegaMenu />
              </nav>

              {/* Right actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Search - with keyboard shortcut hint */}
                <button
                  onClick={handleSearchOpen}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors relative group"
                  aria-label="Search products (Ctrl+K)"
                  title="Search (Ctrl+K)"
                >
                  <Search className="w-5 h-5 text-gray-700" />
                  <span className="absolute -bottom-8 right-0 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden lg:block">
                    ⌘K
                  </span>
                </button>

                {/* Quick Actions - Desktop only */}
                <div className="hidden lg:flex">
                  <QuickActions />
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={handleMobileToggle}
                  className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
                  aria-label={isMobileOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMobileOpen}
                  aria-controls="mobile-menu"
                >
                  {isMobileOpen ? (
                    <X className="w-6 h-6 text-gray-700" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator on scroll */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-150"
              style={{
                width: `${Math.min((lastScrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%`
              }}
            />
          </div>
        )}
      </header>

      {/* Spacer to prevent content jump */}
      <div className={cn(
        "transition-all duration-300",
        isScrolled ? "h-20" : "h-28"
      )} />

      {/* Mobile Drawer */}
      <EnhancedMobileDrawer isOpen={isMobileOpen} onClose={handleMobileClose} />

      {/* Search Overlay */}
      <EnhancedSearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  )
}
