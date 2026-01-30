'use client'

import { FileText, Search, ShoppingBag, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const navLinks = [
    { name: 'Store', href: '/products' },
    { name: 'Closets', href: '/closets' },
    { name: 'Doors', href: '/doors' },
    { name: 'Hardware', href: '/hardware' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500 border-b",
        isScrolled 
          ? "bg-white/80 backdrop-blur-xl border-black/5 py-3 shadow-apple-sm" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-all hover:opacity-80 active:scale-95">
          <span className="font-sf-display text-xl font-bold tracking-tight text-foreground">
            PG <span className="text-accent">CLOSETS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-8 lg:flex">
          {navLinks.map(link => (
            <Link
              key={link.name}
              href={link.href}
              className="text-[13px] font-medium text-foreground/70 transition-colors hover:text-primary relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/search"
            className="text-foreground/70 transition-all hover:text-foreground active:scale-90"
          >
            <span className="sr-only">Search</span>
            <Search className="size-4 sm:size-5" />
          </Link>
          
          <Link
            href="/quote-basket"
            className="relative text-foreground/70 transition-all hover:text-foreground active:scale-90"
          >
            <span className="sr-only">Quote Basket</span>
            <FileText className="size-4 sm:size-5" />
          </Link>

          <Link
            href="/cart"
            className="text-foreground/70 transition-all hover:text-foreground active:scale-90"
          >
            <span className="sr-only">Cart</span>
            <ShoppingBag className="size-4 sm:size-5" />
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 -mr-2 text-foreground/70 transition-colors hover:text-foreground active:scale-90"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 bg-black/20 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-apple-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-black/5">
                <span className="font-bold tracking-tight text-foreground">PG CLOSETS</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 -mr-2 text-foreground/70 transition-colors hover:text-foreground"
                >
                  <X className="size-6" />
                </button>
              </div>

              <nav className="flex-1 px-8 py-12 overflow-y-auto">
                <div className="flex flex-col gap-6">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-3xl font-semibold tracking-tight text-foreground hover:text-accent transition-colors"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mt-16 pt-8 border-t border-black/5"
                >
                  <Link
                    href="/request-work"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-apple-lg hover:bg-primary/90 active:scale-[0.98] transition-all"
                  >
                    Request a Quote
                  </Link>
                </motion.div>
              </nav>

              <div className="p-8 bg-slate-50 border-t border-black/5 space-y-4">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Contact</p>
                  <p className="text-lg font-bold text-foreground">(613) 422-5800</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Email</p>
                  <p className="text-base font-medium text-foreground">info@pgclosets.com</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  )
}

