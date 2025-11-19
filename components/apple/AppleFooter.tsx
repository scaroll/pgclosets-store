'use client'

import Link from 'next/link'
import { useState } from 'react'

interface FooterSection {
  title: string
  links: { label: string; href: string }[]
}

const defaultSections: FooterSection[] = [
  {
    title: 'Shop and Learn',
    links: [
      { label: 'Store', href: '/store' },
      { label: 'Products', href: '/products' },
      { label: 'Collections', href: '/collections' },
      { label: 'Accessories', href: '/accessories' },
      { label: 'Gift Cards', href: '/gift-cards' },
    ]
  },
  {
    title: 'Services',
    links: [
      { label: 'Design Consultation', href: '/services/design' },
      { label: 'Installation', href: '/services/installation' },
      { label: 'Custom Solutions', href: '/services/custom' },
      { label: 'Warranty', href: '/warranty' },
    ]
  },
  {
    title: 'Account',
    links: [
      { label: 'My Account', href: '/account' },
      { label: 'Order Status', href: '/orders' },
      { label: 'Wishlist', href: '/wishlist' },
    ]
  },
  {
    title: 'About',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Careers', href: '/careers' },
    ]
  },
]

interface AppleFooterProps {
  sections?: FooterSection[]
  companyName?: string
  location?: string
}

export default function AppleFooter({
  sections = defaultSections,
  companyName = 'PG Closets',
  location = 'Ottawa, Canada'
}: AppleFooterProps) {
  const [openSections, setOpenSections] = useState<number[]>([])

  const toggleSection = (index: number) => {
    setOpenSections(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  return (
    <footer className="bg-[#F5F5F7] w-full">
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-12">
        {/* Disclaimer Text */}
        <div className="text-[#7A7A7F] text-[12px] md:text-[11px] mb-6 space-y-3">
          <p>
            Professional installation services available for all products.
            Contact us for a free consultation and quote.
          </p>
          <p>
            All products come with manufacturer warranty. Installation warranties
            available upon request.
          </p>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden border-t border-[#d2d2d7]">
          {sections.map((section, index) => (
            <div key={index} className="border-b border-[#d2d2d7]">
              <button
                onClick={() => toggleSection(index)}
                className="flex justify-between items-center w-full py-4 text-left"
              >
                <span className="text-[#1d1d1f] text-[14px] font-medium">
                  {section.title}
                </span>
                <span className="text-[#1d1d1f] text-xl">
                  {openSections.includes(index) ? '−' : '+'}
                </span>
              </button>
              {openSections.includes(index) && (
                <div className="pb-4 pl-4">
                  {section.links.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="block py-2 text-[#6e6e73] text-[12px] hover:text-[#06c] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-8 border-t border-[#d2d2d7] pt-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-[12px] font-semibold text-[#1d1d1f] mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-[#6e6e73] hover:text-[#06c] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#d2d2d7] mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Copyright */}
            <div className="text-[#6e6e73] text-[12px]">
              Copyright © {new Date().getFullYear()} {companyName}. All rights reserved.
            </div>

            {/* Links */}
            <ul className="flex flex-wrap gap-4 text-[12px] text-[#6e6e73]">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#06c] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>|</li>
              <li>
                <Link href="/terms-of-service" className="hover:text-[#06c] transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>|</li>
              <li>
                <Link href="/return-policy" className="hover:text-[#06c] transition-colors">
                  Returns
                </Link>
              </li>
              <li>|</li>
              <li>
                <Link href="/contact" className="hover:text-[#06c] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>

            {/* Location */}
            <div className="text-[#6e6e73] text-[12px]">
              {location}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
