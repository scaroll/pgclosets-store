"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, ShoppingBag, Menu, X } from "lucide-react"
import { PGLogo } from "../ui/pg-logo"
import { MegaMenuNav } from "./MegaMenuNav"
import { MobileDrawer } from "./MobileDrawer"
import { SearchOverlay } from "./SearchOverlay"
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
        {/* Top announcement bar */}
        <div className="bg-black text-white text-center py-2 px-4">
          <Link
            href="/request-work"
            className="text-xs sm:text-sm font-medium tracking-wide hover:text-gray-200 transition-colors"
          >
            Get Free Quote — 2-Week Install • Lifetime Warranty
          </Link>
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

                {/* Cart */}
                <Link
                  href="/cart"
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag className="w-5 h-5 text-gray-700" />
                  {/* Cart count badge - add your cart count logic here */}
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    0
                  </span>
                </Link>

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

                {/* CTA Button - Desktop only */}
                <Link
                  href="/request-work"
                  className="hidden lg:inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors"
                >
                  GET FREE QUOTE
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

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

      {/* Spacer to prevent content jump */}
      <div className="h-[104px] sm:h-[112px]" />
    </>
  )
}
