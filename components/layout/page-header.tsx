"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PGLogo } from "@/components/ui/pg-logo"
import { ArrowLeft, Menu, Phone, ChevronDown, MoreHorizontal } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface PageHeaderProps {
  variant?: "default" | "simple" | "minimal"
  showNavigation?: boolean
  showActions?: boolean
  onMobileMenuToggle?: () => void
  title?: string
  subtitle?: string
  showMegaMenu?: boolean
  onMenuHover?: (menu: string | null) => void
  activeMenu?: string | null
  className?: string
}

export function PageHeader({
  variant = "default",
  showNavigation = true,
  showActions = true,
  onMobileMenuToggle,
  title,
  subtitle,
  showMegaMenu = false,
  onMenuHover,
  activeMenu,
  className = "",
}: PageHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showOverflowMenu, setShowOverflowMenu] = useState(false)
  const [visibleItems, setVisibleItems] = useState<string[]>([])
  const [overflowItems, setOverflowItems] = useState<string[]>([])
  const navRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const navigationItems = [
    { key: "solutions", label: "Solutions", href: "/solutions" },
    { key: "design-studio", label: "Design Studio", href: "/design-studio" },
    { key: "portfolio", label: "Portfolio", href: "/portfolio" },
    { key: "process", label: "Process", href: "/process" },
    { key: "about", label: "About", href: "/about" },
    { key: "contact", label: "Contact", href: "/contact" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (!navRef.current || !containerRef.current) return

      const containerWidth = containerRef.current.offsetWidth
      const availableWidth = containerWidth - 400 // Reserve space for logo and actions

      const itemWidth = 120 // Approximate width per nav item
      const maxVisibleItems = Math.floor(availableWidth / itemWidth)

      if (maxVisibleItems >= navigationItems.length) {
        setVisibleItems(navigationItems.map((item) => item.key))
        setOverflowItems([])
      } else {
        const visible = navigationItems.slice(0, Math.max(1, maxVisibleItems - 1))
        const overflow = navigationItems.slice(Math.max(1, maxVisibleItems - 1))
        setVisibleItems(visible.map((item) => item.key))
        setOverflowItems(overflow.map((item) => item.key))
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const renderNavigationItem = (item: (typeof navigationItems)[0], isOverflow = false) => {
    const baseClasses = `text-luxury-charcoal hover:text-luxury-accent-gold font-semibold transition-all duration-300 relative group py-2 ${
      isOverflow ? "block px-4 py-2 hover:bg-luxury-soft-gray/50 rounded-lg" : ""
    }`

    if (item.key === "solutions" && showMegaMenu) {
      return (
        <button
          key={item.key}
          className={`${baseClasses} flex items-center`}
          onMouseEnter={() => onMenuHover?.("solutions")}
          aria-expanded={activeMenu === "solutions"}
          aria-haspopup="true"
        >
          {item.label}
          <ChevronDown
            className={`w-4 h-4 ml-1 transition-all duration-300 ${
              activeMenu === "solutions" ? "rotate-180 text-luxury-accent-gold" : "group-hover:text-luxury-accent-gold"
            }`}
          />
        </button>
      )
    }

    return (
      <Link
        key={item.key}
        href={item.href}
        className={baseClasses}
        onClick={() => isOverflow && setShowOverflowMenu(false)}
      >
        {item.label}
        {!isOverflow && (
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-accent-gold transition-all duration-300 group-hover:w-full" />
        )}
      </Link>
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ease-out will-change-transform ${
        scrolled
          ? "bg-luxury-white/95 backdrop-blur-xl shadow-luxury-medium border-b border-luxury-soft-gray"
          : "bg-transparent backdrop-blur-sm"
      } ${className}`}
      role="banner"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <div className="flex items-center justify-between h-20 min-w-0">
          <Link
            href="/"
            className="flex items-center space-x-3 group flex-shrink-0 logo-container min-w-0 max-w-[280px]"
            aria-label="PG Closets Home"
          >
            <div className="relative overflow-hidden transition-transform duration-300 group-hover:scale-105 flex-shrink-0 transform-gpu">
              <div className="relative w-12 h-12 flex-shrink-0 min-w-[3rem]">
                <PGLogo width={48} height={48} priority className="transition-transform duration-300 transform-gpu" />
                <div className="absolute inset-0 bg-luxury-gradient-gold opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg" />
              </div>
            </div>
            <div className="transition-transform duration-300 group-hover:translate-x-1 min-w-0 flex-shrink-0 hidden sm:block">
              <span className="text-luxury-h3 text-luxury-charcoal font-inter font-bold whitespace-nowrap truncate">
                PG Closets
              </span>
              <p className="text-xs text-luxury-warm-wood whitespace-nowrap font-medium truncate">
                Premium Custom Closets
              </p>
            </div>
          </Link>

          {variant === "default" && showNavigation && (
            <nav
              ref={navRef}
              className="hidden lg:flex items-center space-x-2 xl:space-x-8 flex-1 justify-center min-w-0 mx-4"
              role="navigation"
              aria-label="Primary navigation"
            >
              {navigationItems
                .filter((item) => visibleItems.includes(item.key))
                .map((item) => renderNavigationItem(item))}

              {overflowItems.length > 0 && (
                <div className="relative">
                  <button
                    className="text-luxury-charcoal hover:text-luxury-accent-gold font-semibold transition-all duration-300 flex items-center group py-2 px-2"
                    onClick={() => setShowOverflowMenu(!showOverflowMenu)}
                    aria-expanded={showOverflowMenu}
                    aria-haspopup="true"
                    aria-label="More navigation options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {showOverflowMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-luxury-white/98 backdrop-blur-xl border border-luxury-soft-gray rounded-xl shadow-luxury-strong z-50 py-2">
                      {navigationItems
                        .filter((item) => overflowItems.includes(item.key))
                        .map((item) => renderNavigationItem(item, true))}
                    </div>
                  )}
                </div>
              )}
            </nav>
          )}

          {variant === "simple" && title && (
            <div className="text-center flex-1 mx-8 min-w-0">
              <h1 className="text-luxury-h3 text-luxury-charcoal truncate">{title}</h1>
              {subtitle && <p className="text-luxury-body text-luxury-warm-wood truncate">{subtitle}</p>}
            </div>
          )}

          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            {(variant === "simple" || variant === "minimal") && (
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center hover:bg-luxury-soft-gray transition-all duration-300 whitespace-nowrap"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
            )}

            {variant === "default" && showActions && (
              <>
                <div className="hidden xl:flex items-center space-x-2 text-luxury-charcoal">
                  <Phone className="w-4 h-4 text-luxury-warm-wood flex-shrink-0" />
                  <a
                    href="tel:+18007425673"
                    className="font-semibold hover:text-luxury-accent-gold transition-colors duration-300 whitespace-nowrap"
                  >
                    1-800-PG-CLOSET
                  </a>
                </div>

                <Link href="/consultation">
                  <Button
                    size="sm"
                    className="btn-luxury-gold shadow-luxury-gold hover:shadow-luxury-strong transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Book Consultation</span>
                    <span className="sm:hidden">Book</span>
                  </Button>
                </Link>
              </>
            )}

            {variant === "default" && onMobileMenuToggle && (
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden transition-all duration-300 hover:scale-110 hover:bg-luxury-soft-gray flex-shrink-0"
                onClick={onMobileMenuToggle}
                aria-label="Open mobile menu"
                aria-expanded={false}
              >
                <Menu className="w-5 h-5 text-luxury-charcoal" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showOverflowMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowOverflowMenu(false)} aria-hidden="true" />
      )}
    </header>
  )
}
