'use client'

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { PGLogo } from "../ui/pg-logo";
import { cn } from "@/lib/utils";

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle swipe to close (basic implementation)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const currentX = touch.clientX;
      const diffX = currentX - startX;

      // Swipe right to close (if started from left edge of menu)
      if (startX < 50 && diffX > 100) {
        closeMobileMenu();
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };

    document.addEventListener('touchmove', handleTouchMove);

    setTimeout(() => {
      document.removeEventListener('touchmove', handleTouchMove);
    }, 300);
  };

  const navigationItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header
        className={cn(
          "sticky top-0 z-40 backdrop-blur-xl transition-all duration-300",
          isScrolled
            ? "bg-white/95 shadow-lg border-b border-slate-200/30"
            : "bg-white/90 shadow-md",
          "lg:hidden", // Only show on mobile/tablet
          className
        )}
        role="banner"
      >
        <div className="container-apple h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 rounded-lg py-1 px-2 group"
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
              <span className="text-base font-semibold tracking-tight text-slate-900 leading-none">
                PG CLOSETS
              </span>
              <span className="text-[8px] text-amber-600/60 font-medium uppercase tracking-widest">
                Elevated Craftsmanship
              </span>
            </div>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "p-3 text-pg-navy focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 rounded-lg transition-all duration-200",
              "min-w-[48px] min-h-[48px] active:bg-pg-offwhite",
              isMobileMenuOpen ? "bg-pg-offwhite" : "hover:bg-pg-offwhite/50"
            )}
            aria-label={isMobileMenuOpen ? "Close main menu" : "Open main menu"}
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
              className={cn(
                "transition-transform duration-300",
                isMobileMenuOpen && "rotate-90"
              )}
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop with animation */}
          <div
            className={cn(
              "fixed inset-0 bg-black transition-opacity duration-300",
              isMobileMenuOpen ? "bg-opacity-50" : "bg-opacity-0"
            )}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Slide-out menu with enhanced animations */}
          <div
            className={cn(
              "fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl",
              "transform transition-transform duration-300 ease-out",
              "border-l border-gray-200",
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
            onTouchStart={handleTouchStart}
            id="mobile-menu"
          >
            {/* Menu Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <span className="text-lg font-semibold text-pg-navy">Menu</span>
              <button
                onClick={closeMobileMenu}
                className="p-2 text-pg-navy hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2 min-w-[44px] min-h-[44px]"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="px-4 py-6" role="navigation" aria-label="Mobile navigation">
              <div className="space-y-2">
                {navigationItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "block w-full text-left px-4 py-4 text-lg font-medium text-pg-navy",
                      "hover:text-pg-sky hover:bg-pg-sky/10 active:bg-pg-sky/20",
                      "transition-all duration-200 rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2",
                      "border-b border-gray-100 last:border-b-0"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileMenuOpen ? "slideInFromRight 0.3s ease-out forwards" : "none"
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* CTA Section */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
              <Link
                href="/request-work"
                onClick={closeMobileMenu}
                className={cn(
                  "block w-full text-center bg-pg-navy text-white py-4 px-6 rounded-lg font-semibold",
                  "hover:bg-pg-navy/90 active:bg-pg-navy/80 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2",
                  "shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                Request a Quote
              </Link>

              {/* Contact info */}
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Call us: (613) 555-CLOSETS</p>
                <p className="text-xs">Mon-Fri: 8am-6pm | Sat: 9am-4pm</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyframe animations for menu items */}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}