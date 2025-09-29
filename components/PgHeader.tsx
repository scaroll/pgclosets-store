"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { PGLogo } from "../ui/pg-logo"
import { ChevronDown, Search, Heart, ShoppingCart } from "lucide-react"
import MegaMenu from "./navigation/MegaMenu"
import { InteractiveLogo } from "./brand/InteractiveLogo"
import { AnimatedLogo } from "./brand/AnimatedLogo"
import { trackLogoInteraction, trackLogoConversion, getUserJourneyStage, trackMobileLogoInteraction } from "@/lib/analytics/logo-tracking"

export default function PgHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    // Check if mobile device
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    const mobile = checkMobile();
    window.addEventListener('resize', checkMobile);

    // Track header logo view with mobile detection
    trackLogoInteraction({
      event: 'logo_view',
      logo_type: 'header',
      interaction_type: 'view',
      page_location: window.location.pathname,
      user_journey_stage: getUserJourneyStage(window.location.pathname),
      logo_size: mobile ? 'small' : 'medium'
    });

    if (mobile) {
      trackMobileLogoInteraction('header_view', `${window.innerWidth}x${window.innerHeight}`);
    }

    return () => window.removeEventListener('resize', checkMobile);
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleMenuHover = (menuKey: string) => {
    setActiveMenu(menuKey)
    setMegaMenuOpen(true)
  }

  const handleMenuLeave = () => {
    setMegaMenuOpen(false)
    setActiveMenu(null)
  }

  const handleLogoClick = () => {
    // Track logo click for conversion analytics
    trackLogoInteraction({
      event: 'logo_click',
      logo_type: 'header',
      interaction_type: 'click',
      page_location: window.location.pathname,
      user_journey_stage: getUserJourneyStage(window.location.pathname),
      conversion_context: 'navigation_to_home'
    });

    trackLogoConversion({
      event: 'logo_navigation',
      logo_placement: 'header_primary',
      conversion_type: 'cta_click'
    });

    // Track mobile-specific interactions
    if (isMobile) {
      trackMobileLogoInteraction('header_click', `${window.innerWidth}x${window.innerHeight}`);
    }

    window.location.href = '/';
  }

  const handleLogoHover = () => {
    trackLogoInteraction({
      event: 'logo_hover',
      logo_type: 'header',
      interaction_type: 'hover',
      page_location: window.location.pathname,
      user_journey_stage: getUserJourneyStage(window.location.pathname)
    });
  }

  return (
    <>
      <header className="nav-apple sticky top-0 z-40 backdrop-blur-xl bg-white/90 shadow-lg border-b border-slate-200/30 transition-all duration-500 hover:shadow-xl" role="banner">
        <div className="container-apple h-full flex items-center justify-between">
          {/* Enhanced Header Logo with Animation */}
          <div className="flex items-center gap-3">
            {isLoaded ? (
              <InteractiveLogo
                interaction={isMobile ? "hover" : "magnetic"}
                width={isMobile ? 36 : 40}
                height={isMobile ? 36 : 40}
                onClick={handleLogoClick}
                onHover={handleLogoHover}
                className="cursor-pointer"
                tooltip={isMobile ? undefined : {
                  text: "Return to PG Closets home",
                  position: "bottom"
                }}
                hapticFeedback={isMobile}
              />
            ) : (
              <AnimatedLogo
                animation="luxury"
                width={isMobile ? 36 : 40}
                height={isMobile ? 36 : 40}
                delay={0.2}
                onAnimationComplete={() => setIsLoaded(true)}
              />
            )}
            <Link
              href="/"
              className="flex flex-col hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-lg py-1 px-2"
              aria-label="PG Closets - Go to homepage"
            >
              <span className="text-base md:text-lg font-semibold tracking-tight text-slate-900 leading-none">
                PG CLOSETS
              </span>
              <span className="text-[8px] text-amber-600/60 font-medium uppercase tracking-widest">Elevated Taste Without Pretense</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <Link
              href="/"
              className="relative text-slate-600 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMenuHover('products')}
              onMouseLeave={handleMenuLeave}
            >
              <button className="flex items-center space-x-1 relative text-slate-600 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group">
                <span className="relative z-10">Products</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen && activeMenu === 'products' ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </button>
            </div>

            <Link
              href="/about"
              className="relative text-slate-600 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group"
            >
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </Link>

            <div
              className="relative"
              onMouseEnter={() => handleMenuHover('services')}
              onMouseLeave={handleMenuLeave}
            >
              <button className="flex items-center space-x-1 relative text-slate-600 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group">
                <span className="relative z-10">Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${megaMenuOpen && activeMenu === 'services' ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </button>
            </div>

            <Link
              href="/contact"
              className="relative text-slate-600 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group"
            >
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </Link>

            {/* Action Icons */}
            <div className="flex items-center space-x-3 ml-4 border-l border-gray-200 pl-4">
              <button
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all duration-200 relative group"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              </button>

              <button
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all duration-200 relative group"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              </button>

              <button
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-gray-100 rounded-lg transition-all duration-200 relative group"
                aria-label="View cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  0
                </span>
              </button>
            </div>

            <Link
              href="/request-work"
              className="relative ml-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-light px-8 py-2.5 text-sm tracking-wide transition-all duration-500 uppercase overflow-hidden group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                Request Work
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent" />
              </div>
            </Link>
          </nav>

          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-pg-navy focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded-lg hover:bg-pg-offwhite transition-colors duration-200"
              aria-label="Open main menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Mega Menu */}
        <div
          onMouseEnter={() => {
            if (activeMenu) setMegaMenuOpen(true)
          }}
          onMouseLeave={handleMenuLeave}
        >
          <MegaMenu
            isOpen={megaMenuOpen}
            activeMenu={activeMenu}
            onClose={() => setMegaMenuOpen(false)}
          />
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMobileMenu}
          />

          {/* Slide-out menu */}
          <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMobileMenu}
                className="p-2 text-pg-navy hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2"
                aria-label="Close menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Mobile Logo Section */}
            <div className="px-6 py-6 border-b border-gray-200">
              <div className="flex items-center justify-center gap-3">
                <InteractiveLogo
                  interaction="glow"
                  width={48}
                  height={48}
                  onClick={() => {
                    handleLogoClick();
                    closeMobileMenu();
                  }}
                  className="cursor-pointer"
                  hapticFeedback={true}
                />
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-slate-900">PG CLOSETS</h2>
                  <p className="text-xs text-amber-600/60 font-medium uppercase tracking-widest">Elevated Taste</p>
                </div>
              </div>
            </div>

            {/* Navigation items */}
            <nav className="px-6 py-4" role="navigation" aria-label="Mobile navigation">
              <div className="space-y-6">
                <Link
                  href="/"
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-pg-navy hover:text-pg-sky transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded px-2 py-2"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-pg-navy hover:text-pg-sky transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded px-2 py-2"
                >
                  Products
                </Link>
                <Link
                  href="/blog"
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-pg-navy hover:text-pg-sky transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded px-2 py-2"
                >
                  Blog
                </Link>
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="block text-lg font-medium text-pg-navy hover:text-pg-sky transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded px-2 py-2"
                >
                  Contact
                </Link>

                {/* CTA Button */}
                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href="/request-work"
                    onClick={closeMobileMenu}
                    className="block w-full text-center bg-pg-navy text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2"
                  >
                    Request a Quote
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
