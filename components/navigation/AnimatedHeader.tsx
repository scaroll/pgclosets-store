/**
 * Animated Header
 *
 * Enhanced header with scroll-based animations and blur effects
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { PGLogo } from '../ui/pg-logo';
import { MegaMenuNav } from './MegaMenuNav';
import { AnimatedMobileDrawer } from './AnimatedMobileDrawer';
import { SearchOverlay } from './SearchOverlay';
import { UtilityBar, EnhancedHeaderActions } from './UtilityBar';
import { cn } from '@/lib/utils';
import { useScrollDirection } from '@/lib/animations/hooks';

export function AnimatedHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.98]);
  const headerBlur = useTransform(scrollY, [0, 100], [0, 10]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  // Hide header on scroll down, show on scroll up
  const isHeaderVisible = scrollDirection !== 'down' || !isScrolled;

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-white/95 shadow-sm' : 'bg-white'
        )}
        style={{
          opacity: headerOpacity,
          backdropFilter: `blur(${headerBlur}px)`,
        }}
        initial={{ y: 0 }}
        animate={{ y: isHeaderVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      >
        {/* Utility Bar - Trust signals */}
        <UtilityBar />

        {/* Main header */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo with hover animation */}
              <Link href="/" className="flex items-center gap-2 sm:gap-3 group" aria-label="PG Closets - Home">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <PGLogo
                    width={32}
                    height={32}
                    withWordmark={false}
                    className="text-black"
                  />
                </motion.div>
                <div className="flex flex-col">
                  <motion.span
                    className="text-sm sm:text-base font-bold tracking-[0.2em] text-black"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    PG CLOSETS
                  </motion.span>
                  <motion.span
                    className="hidden sm:block text-[10px] text-gray-500 font-medium tracking-[0.15em]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    OTTAWA
                  </motion.span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                <MegaMenuNav />
              </nav>

              {/* Right actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Search with hover effect */}
                <motion.button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                  aria-label="Search"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Search className="w-5 h-5 text-gray-700" />
                </motion.button>

                {/* Enhanced CTA Actions - Desktop */}
                <EnhancedHeaderActions />

                {/* Mobile menu button with icon animation */}
                <motion.button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  className="lg:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
                  aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileOpen}
                  aria-controls="mobile-menu"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
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

                {/* Legacy Cart - Keep for backward compatibility */}
                <motion.div
                  className="hidden"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    href="/cart"
                    className="p-2 hover:bg-gray-50 rounded-full transition-colors relative"
                    aria-label="Shopping cart"
                  >
                    <ShoppingBag className="w-5 h-5 text-gray-700" />
                    <motion.span
                      className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      0
                    </motion.span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer with animations */}
      <AnimatedMobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
