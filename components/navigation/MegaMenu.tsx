"use client"

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Star, ArrowRight, Sparkles, Home, Briefcase, Phone, Info } from 'lucide-react'

interface MegaMenuItem {
  title: string
  href: string
  description: string
  badge?: string
  icon?: React.ReactNode
}

interface MegaMenuSection {
  title: string
  items: MegaMenuItem[]
}

const megaMenuData: Record<string, MegaMenuSection[]> = {
  products: [
    {
      title: "Popular Collections",
      items: [
        {
          title: "Sliding Doors",
          href: "/products/sliding-doors",
          description: "Premium sliding door systems for modern homes",
          badge: "Bestseller",
          icon: <Star className="w-4 h-4" />
        },
        {
          title: "Bi-Fold Doors",
          href: "/products/bi-fold-doors",
          description: "Space-saving bi-fold solutions",
          icon: <Sparkles className="w-4 h-4" />
        },
        {
          title: "French Doors",
          href: "/products/french-doors",
          description: "Elegant French door options",
          icon: <Home className="w-4 h-4" />
        }
      ]
    },
    {
      title: "By Style",
      items: [
        {
          title: "Modern",
          href: "/products/style/modern",
          description: "Clean lines and contemporary design"
        },
        {
          title: "Traditional",
          href: "/products/style/traditional",
          description: "Classic and timeless styling"
        },
        {
          title: "Transitional",
          href: "/products/style/transitional",
          description: "Perfect blend of modern and traditional"
        }
      ]
    },
    {
      title: "Featured",
      items: [
        {
          title: "New Arrivals",
          href: "/products/new",
          description: "Latest additions to our collection",
          badge: "New"
        },
        {
          title: "Custom Solutions",
          href: "/products/custom",
          description: "Tailored to your specific needs"
        }
      ]
    }
  ],
  services: [
    {
      title: "Our Services",
      items: [
        {
          title: "Design Consultation",
          href: "/services/consultation",
          description: "Expert design advice for your space",
          icon: <Briefcase className="w-4 h-4" />
        },
        {
          title: "Professional Installation",
          href: "/services/installation",
          description: "Certified installation technicians"
        },
        {
          title: "Warranty & Support",
          href: "/services/warranty",
          description: "Comprehensive warranty coverage"
        }
      ]
    },
    {
      title: "Process",
      items: [
        {
          title: "1. Consultation",
          href: "/process/consultation",
          description: "Initial design meeting and measurements"
        },
        {
          title: "2. Design",
          href: "/process/design",
          description: "Custom design and material selection"
        },
        {
          title: "3. Installation",
          href: "/process/installation",
          description: "Professional installation and finishing"
        }
      ]
    }
  ]
}

interface MegaMenuProps {
  isOpen: boolean
  activeMenu: string | null
  onClose: () => void
}

const MegaMenu: React.FC<MegaMenuProps> = ({ isOpen, activeMenu, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen || !activeMenu || !megaMenuData[activeMenu]) {
    return null
  }

  const sections = megaMenuData[activeMenu]

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 z-50"
      >
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sections.map((section, sectionIndex) => (
              <div key={section.title} className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
                  {section.title}
                </h3>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: (sectionIndex * section.items.length + itemIndex) * 0.05,
                        duration: 0.2
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group block p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                      >
                        <div className="flex items-start space-x-3">
                          {item.icon && (
                            <div className="flex-shrink-0 mt-1 text-black group-hover:text-gray-700 transition-colors">
                              {item.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
                                {item.title}
                              </h4>
                              {item.badge && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-black">
                                  {item.badge}
                                </span>
                              )}
                              <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all duration-200" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-700 transition-colors">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Call-to-action section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <h4 className="text-lg font-semibold text-gray-900">Ready to get started?</h4>
                <p className="text-sm text-gray-600">Schedule your free consultation today</p>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 text-sm font-medium"
                >
                  <Phone className="w-4 h-4" />
                  <span>Contact Us</span>
                </Link>
                <Link
                  href="/request-work"
                  onClick={onClose}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                >
                  <Info className="w-4 h-4" />
                  <span>Get Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MegaMenu