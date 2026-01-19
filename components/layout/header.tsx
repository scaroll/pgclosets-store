'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { siteConfig } from '@/lib/config'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container-content">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-medium tracking-tight text-[var(--color-primary)]"
          >
            {siteConfig.name}
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-12 md:flex">
            {siteConfig.navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-sm font-medium tracking-wide transition-colors',
                    'duration-200 hover:text-[var(--color-accent)]',
                    isScrolled
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-primary)]/80'
                  )}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="Toggle menu"
          >
            <div className="relative h-4 w-6">
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-[var(--color-primary)]',
                  'transition-all duration-300',
                  isMobileMenuOpen
                    ? 'top-1/2 -translate-y-1/2 rotate-45'
                    : 'top-0'
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-1/2 h-px w-full -translate-y-1/2',
                  'bg-[var(--color-primary)] transition-opacity duration-300',
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                )}
              />
              <span
                className={cn(
                  'absolute left-0 h-px w-full bg-[var(--color-primary)]',
                  'transition-all duration-300',
                  isMobileMenuOpen
                    ? 'top-1/2 -translate-y-1/2 -rotate-45'
                    : 'bottom-0'
                )}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden bg-white md:hidden"
      >
        <nav className="container-content py-8">
          <ul className="flex flex-col gap-6">
            {siteConfig.navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-2xl font-light text-[var(--color-primary)]"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </motion.div>
    </header>
  )
}
