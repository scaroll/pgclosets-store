"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { PGLogo } from "../ui/pg-logo"
import { SkipLink, FocusTrap } from "./accessibility-fixes"

export default function ImprovedPgHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <SkipLink />
      <header
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/90 shadow-lg border-b border-slate-200/30 transition-all duration-500 hover:shadow-xl"
        role="banner"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg py-1 px-2 group"
            aria-label="PG Closets - Go to homepage"
          >
            <div className="relative w-8 h-8">
              <PGLogo
                width={32}
                height={32}
                withWordmark={false}
                aria-hidden="true"
                className="text-slate-900 group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-lg font-semibold tracking-tight text-slate-900 leading-none">
                PG CLOSETS
              </span>
              <span className="text-[8px] text-amber-600/60 font-medium uppercase tracking-widest">
                Elevated Craftsmanship
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-6"
            role="navigation"
            aria-label="Main navigation"
          >
            <Link
              href="/"
              className="relative text-slate-700 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </Link>
            <Link
              href="/products"
              className="relative text-slate-700 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
            >
              <span className="relative z-10">Products</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </Link>
            <Link
              href="/about"
              className="relative text-slate-700 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
            >
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </Link>
            <Link
              href="/services"
              className="relative text-slate-700 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
            >
              <span className="relative z-10">Services</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </Link>
            <Link
              href="/contact"
              className="relative text-slate-700 font-medium tracking-wider transition-all duration-300 hover:text-slate-900 px-4 py-2.5 text-sm group focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
            >
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
            </Link>

            <Link
              href="/request-work"
              className="relative ml-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-light px-8 py-2.5 text-sm tracking-wide transition-all duration-500 uppercase overflow-hidden group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded"
            >
              <span className="relative z-10 flex items-center gap-2">
                Request Work
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-haspopup="true"
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
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Slide-out menu */}
          <FocusTrap active={isMobileMenuOpen}>
            <div
              ref={mobileMenuRef}
              id="mobile-menu"
              className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 id="mobile-menu-title" className="text-lg font-semibold text-slate-900">
                  Navigation Menu
                </h2>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-slate-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
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

              {/* Navigation items */}
              <nav className="px-6 py-4" role="navigation" aria-label="Mobile navigation">
                <div className="space-y-6">
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="block text-lg font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-2"
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    onClick={closeMobileMenu}
                    className="block text-lg font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-2"
                  >
                    Products
                  </Link>
                  <Link
                    href="/about"
                    onClick={closeMobileMenu}
                    className="block text-lg font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-2"
                  >
                    About
                  </Link>
                  <Link
                    href="/services"
                    onClick={closeMobileMenu}
                    className="block text-lg font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-2"
                  >
                    Services
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMobileMenu}
                    className="block text-lg font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded px-2 py-2"
                  >
                    Contact
                  </Link>

                  {/* CTA Button */}
                  <div className="pt-4 border-t border-gray-200">
                    <Link
                      href="/request-work"
                      onClick={closeMobileMenu}
                      className="block w-full text-center bg-slate-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-slate-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                    >
                      Request a Quote
                    </Link>
                  </div>
                </div>
              </nav>
            </div>
          </FocusTrap>
        </div>
      )}
    </>
  )
}