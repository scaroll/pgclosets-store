"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingBag, Menu, X } from "lucide-react"
import { PGLogo } from "../ui/pg-logo"
import { MegaMenuNav } from "./MegaMenuNav"
import { MobileDrawer } from "./MobileDrawer"
import { SearchOverlay } from "./SearchOverlay"
import { UtilityBar, EnhancedHeaderActions } from "./UtilityBar"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMobileOpen])

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white"
        )}
      >
        {/* Utility Bar - Trust signals */}
        <UtilityBar />

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
                  width={32}
                  height={32}
                  withWordmark={false}
                  className="text-black transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col">
                  <span className="text-sm sm:text-base font-bold tracking-[0.2em] text-black">
                    PG CLOSETS
                  </span>
                  <span className="hidden sm:block text-[10px] text-gray-500 font-medium tracking-[0.15em]">
                    OTTAWA
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                <MegaMenuNav />
              </nav>

              {/* Right actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Search */}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-700" />
                </button>

                {/* Enhanced CTA Actions - Desktop */}
                <EnhancedHeaderActions />

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
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

                {/* Legacy Cart - Keep for backward compatibility */}
                <Link
                  href="/cart"
                  className="hidden p-2 hover:bg-gray-50 rounded-full transition-colors relative"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
