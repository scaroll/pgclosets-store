"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X, ChevronRight, ChevronDown, Home, Package, Wrench, Info, Image as ImageIcon, Mail, Phone, MapPin } from "lucide-react"
import { PGLogo } from "../ui/pg-logo"
import { cn } from "@/lib/utils"

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface NavSection {
  label: string
  icon: React.ReactNode
  items: {
    label: string
    href: string
    description?: string
  }[]
}

const navigationSections: NavSection[] = [
  {
    label: "Products",
    icon: <Package className="w-5 h-5" />,
    items: [
      { label: "Barn Doors", href: "/collections/renin-barn-doors", description: "Elegant sliding doors" },
      { label: "Bypass Doors", href: "/collections/renin-bypass-doors", description: "Space-saving closets" },
      { label: "Bifold Doors", href: "/collections/renin-bifold-doors", description: "Classic folding doors" },
      { label: "Closet Doors", href: "/collections/renin-closet-doors", description: "Complete systems" },
      { label: "Hardware", href: "/collections/hardware", description: "Premium accessories" },
      { label: "All Products", href: "/products", description: "Browse catalog" },
    ],
  },
  {
    label: "Services",
    icon: <Wrench className="w-5 h-5" />,
    items: [
      { label: "Design Consultation", href: "/services/consultation", description: "Expert advice" },
      { label: "Custom Design", href: "/services/custom-design", description: "Tailored solutions" },
      { label: "Installation", href: "/services/installation", description: "Professional install" },
      { label: "Warranty", href: "/services/warranty", description: "Coverage details" },
    ],
  },
]

const simpleLinks = [
  { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
  { label: "About", href: "/about", icon: <Info className="w-5 h-5" /> },
  { label: "Gallery", href: "/gallery", icon: <ImageIcon className="w-5 h-5" /> },
  { label: "Contact", href: "/contact", icon: <Mail className="w-5 h-5" /> },
]

export function EnhancedMobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setIsAnimating(true)
    } else {
      document.body.style.overflow = ""
      // Reset expanded section after animation
      setTimeout(() => {
        setExpandedSection(null)
        setIsAnimating(false)
      }, 300)
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40 lg:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out z-50 lg:hidden flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <Link href="/" onClick={onClose} className="flex items-center gap-2 group">
              <PGLogo width={32} height={32} withWordmark={false} className="text-black group-hover:scale-105 transition-transform" />
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

        {/* Navigation Content - Scrollable */}
        <nav className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-1">
            {/* Simple Links First */}
            {simpleLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between py-3 px-4 text-base font-medium text-gray-900 hover:text-black hover:bg-gray-50 rounded-lg transition-all group",
                  isOpen && isAnimating && "animate-in slide-in-from-left duration-300"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 group-hover:text-black transition-colors">
                    {link.icon}
                  </span>
                  {link.label}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </Link>
            ))}

            {/* Expandable Sections */}
            <div className="pt-4 space-y-2">
              {navigationSections.map((section, sectionIndex) => {
                const isExpanded = expandedSection === section.label
                return (
                  <div
                    key={section.label}
                    className={cn(
                      "border border-gray-200 rounded-lg overflow-hidden transition-all",
                      isExpanded && "shadow-md border-gray-300",
                      isOpen && isAnimating && "animate-in slide-in-from-left duration-300"
                    )}
                    style={{ animationDelay: `${(simpleLinks.length + sectionIndex) * 50}ms` }}
                  >
                    <button
                      onClick={() => toggleSection(section.label)}
                      className="flex items-center justify-between w-full py-3 px-4 text-base font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">{section.icon}</span>
                        {section.label}
                      </div>
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-gray-400 transition-transform duration-200",
                          isExpanded && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Submenu with animation */}
                    <div
                      className={cn(
                        "bg-gray-50 transition-all duration-200 overflow-hidden",
                        isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      <ul className="py-2 px-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={cn(
                                "block py-2.5 px-4 text-sm text-gray-700 hover:text-black hover:bg-white rounded-md transition-all group",
                                isExpanded && "animate-in fade-in slide-in-from-top-1 duration-200"
                              )}
                              style={{ animationDelay: `${itemIndex * 30}ms` }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium">{item.label}</div>
                                  {item.description && (
                                    <div className="text-xs text-gray-500 mt-0.5">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all flex-shrink-0" />
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Footer - Sticky */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 space-y-4 shadow-lg">
          {/* CTA Button */}
          <Link
            href="/request-work"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-black text-white px-6 py-4 text-sm font-bold tracking-wide hover:bg-gray-800 rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            GET FREE QUOTE
            <ChevronRight className="w-4 h-4" />
          </Link>

          {/* Contact Info */}
          <div className="space-y-2 text-xs text-gray-600">
            <a
              href="tel:+16137016393"
              className="flex items-center gap-2 hover:text-black transition-colors"
            >
              <Phone className="w-4 h-4" />
              (613) 701-6393
            </a>
            <a
              href="mailto:info@pgclosets.com"
              className="flex items-center gap-2 hover:text-black transition-colors"
            >
              <Mail className="w-4 h-4" />
              info@pgclosets.com
            </a>
            <div className="flex items-start gap-2 text-gray-500">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Ottawa & Surrounding Areas</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
