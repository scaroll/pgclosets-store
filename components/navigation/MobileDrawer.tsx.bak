"use client"

import { useEffect } from "react"
import Link from "next/link"
import { X, ChevronRight } from "lucide-react"
import { PGLogo } from "../ui/pg-logo"
import { cn } from "@/lib/utils"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

const mobileNavItems = [
  {
    label: "Products",
    items: [
      { label: "Barn Doors", href: "/collections/renin-barn-doors" },
      { label: "Bypass Doors", href: "/collections/renin-bypass-doors" },
      { label: "Bifold Doors", href: "/collections/renin-bifold-doors" },
      { label: "All Products", href: "/products" },
    ],
  },
  {
    label: "Services",
    items: [
      { label: "Design Consultation", href: "/services/consultation" },
      { label: "Custom Design", href: "/services/custom-design" },
      { label: "Installation", href: "/services/installation" },
      { label: "Warranty", href: "/services/warranty" },
    ],
  },
]

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out z-50 lg:hidden overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
          <div className="flex items-center justify-between p-4">
            <Link href="/" onClick={onClose} className="flex items-center gap-2">
              <PGLogo width={32} height={32} withWordmark={false} className="text-black" />
              <span className="text-lg font-bold tracking-[0.2em]">PG CLOSETS</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6">
          <div className="space-y-6">
            {/* Simple links first */}
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between py-3 text-base font-medium text-gray-900 hover:text-black transition-colors group"
            >
              Home
              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Expandable sections */}
            {mobileNavItems.map((section) => (
              <div key={section.label} className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {section.label}
                </h3>
                <ul className="space-y-2 pl-2">
                  {section.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex items-center justify-between py-2.5 text-sm text-gray-700 hover:text-black transition-colors group"
                      >
                        {item.label}
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Simple links */}
            <div className="space-y-2 pt-4 border-t border-gray-100">
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-base font-medium text-gray-900 hover:text-black transition-colors group"
              >
                About
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </Link>
              <Link
                href="/gallery"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-base font-medium text-gray-900 hover:text-black transition-colors group"
              >
                Gallery
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </Link>
              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-base font-medium text-gray-900 hover:text-black transition-colors group"
              >
                Contact
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </Link>
            </div>

            {/* CTA Button */}
            <div className="pt-6 border-t border-gray-100">
              <Link
                href="/request-work"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full bg-black text-white px-6 py-4 text-sm font-bold tracking-wide hover:bg-gray-800 transition-colors"
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

            {/* Contact info */}
            <div className="pt-6 pb-8 border-t border-gray-100">
              <Link
                href="/contact"
                onClick={onClose}
                className="block text-center text-sm text-gray-600 hover:text-black transition-colors"
              >
                Questions? <span className="font-semibold">Email Us</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
}
