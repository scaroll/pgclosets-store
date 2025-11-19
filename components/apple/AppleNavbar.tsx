'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface NavItem {
  label: string
  href: string
}

interface AppleNavbarProps {
  logo?: React.ReactNode
  items?: NavItem[]
}

const defaultItems: NavItem[] = [
  { label: 'Store', href: '/store' },
  { label: 'Products', href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'Services', href: '/services' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function AppleNavbar({ logo, items = defaultItems }: AppleNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed w-full hidden md:block opacity-90 backdrop-blur-sm z-50">
        <ul className="bg-[#333] flex justify-center gap-7 h-[44px] items-center px-12">
          {logo && (
            <li className="text-[#AEAEAE] hover:text-[#ccc9c9] cursor-pointer">
              {logo}
            </li>
          )}
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="text-[#AEAEAE] text-[12px] hover:text-[#ccc9c9] cursor-pointer transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden backdrop-blur-sm bg-[#333] h-[48px] pl-5 pr-5 fixed w-full opacity-90 z-50">
        <div className="flex items-center justify-between h-full">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-[#AEAEAE] text-3xl"
            aria-label="Open menu"
          >
            ☰
          </button>
          {logo && (
            <div className="text-[#AEAEAE]">
              {logo}
            </div>
          )}
          <div className="text-[#AEAEAE]">
            🛍️
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            className="bg-black md:hidden w-full h-screen overflow-y-auto z-50 top-0 fixed"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex items-center h-12 px-5">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-xl"
                aria-label="Close menu"
              >
                ✕
              </button>
              {logo && (
                <div className="text-[#AEAEAE] mx-auto">
                  {logo}
                </div>
              )}
            </div>

            <div className="px-4 mt-5">
              <input
                type="text"
                className="bg-[#1D1D1F] w-full h-[40px] rounded-lg px-4 text-white placeholder-[#AEAEAE]"
                placeholder="Search..."
              />
            </div>

            <hr className="bg-[#AEAEAE] mt-5" />

            <ul className="px-8 mt-5">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="text-[#AEAEAE] border-b border-[#424245] py-4"
                >
                  <Link
                    href={item.href}
                    className="text-[17px] block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
