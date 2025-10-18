"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, ArrowRight, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackNavigationClick, trackMegaMenuInteraction } from "@/lib/analytics/enhanced-tracking"

interface MenuItem {
  label: string
  href: string
  description?: string
  image?: string
  badge?: string
  isPopular?: boolean
}

interface MegaMenuSection {
  title: string
  items: MenuItem[]
  featured?: MenuItem
}

interface NavItem {
  label: string
  href?: string
  megaMenu?: MegaMenuSection[]
}

const navigationItems: NavItem[] = [
  {
    label: "Products",
    megaMenu: [
      {
        title: "Door Types",
        items: [
          {
            label: "Barn Doors",
            href: "/collections/renin-barn-doors",
            description: "Elegant sliding doors for any space",
            image: "https://www.renin.com/wp-content/uploads/2021/06/BD041-Augusta-Bright-White-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
            isPopular: true,
          },
          {
            label: "Bypass Doors",
            href: "/collections/renin-bypass-doors",
            description: "Space-saving sliding closet doors",
            image: "https://www.renin.com/wp-content/uploads/2021/06/BD041-Augusta-Bright-White-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
          },
          {
            label: "Bifold Doors",
            href: "/collections/renin-bifold-doors",
            description: "Classic folding closet doors",
            image: "https://www.renin.com/wp-content/uploads/2021/06/BD041-Augusta-Bright-White-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
          },
          {
            label: "Closet Doors",
            href: "/collections/renin-closet-doors",
            description: "Complete closet door systems",
          },
          {
            label: "Pivot Doors",
            href: "/collections/renin-pivot-doors",
            description: "Modern pivot entry doors",
          },
          {
            label: "Room Dividers",
            href: "/collections/renin-room-dividers",
            description: "Stylish space dividers",
          },
        ],
        featured: {
          label: "Best Sellers",
          href: "/products?sort=popular",
          description: "Our most popular door styles",
          badge: "Trending",
        },
      },
      {
        title: "Accessories",
        items: [
          {
            label: "Hardware",
            href: "/collections/hardware",
            description: "Premium door hardware & tracks",
          },
          {
            label: "Mirrors",
            href: "/collections/mirrors",
            description: "Custom mirror options",
          },
        ],
      },
      {
        title: "Browse",
        items: [
          {
            label: "All Products",
            href: "/products",
            description: "View our complete catalog",
          },
          {
            label: "Get Estimate",
            href: "/instant-estimate",
            description: "Free instant quote",
            badge: "Free",
          },
        ],
      },
    ],
  },
  {
    label: "Services",
    megaMenu: [
      {
        title: "Our Services",
        items: [
          {
            label: "Design Consultation",
            href: "/services/consultation",
            description: "Expert design advice",
            badge: "Free",
          },
          {
            label: "Custom Design",
            href: "/services/custom-design",
            description: "Tailored solutions",
          },
          {
            label: "Installation",
            href: "/services/installation",
            description: "Professional installation",
          },
          {
            label: "Project Planning",
            href: "/services/planning",
            description: "Complete project management",
          },
        ],
      },
      {
        title: "Support",
        items: [
          {
            label: "Warranty Info",
            href: "/services/warranty",
            description: "Coverage details",
          },
          {
            label: "Maintenance Tips",
            href: "/services/maintenance",
            description: "Care instructions",
          },
          {
            label: "FAQ",
            href: "/faq",
            description: "Common questions",
          },
        ],
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
]

export function EnhancedMegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveMenu(label)

    // Track mega menu interaction
    trackMegaMenuInteraction({
      action: 'open',
      menu_item: label,
      section: 'main_nav',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null)
      setHoveredItem(null)
    }, 200)
  }, [])

  const closeMenu = useCallback(() => {
    setActiveMenu(null)
    setHoveredItem(null)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeMenu) {
        closeMenu()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [activeMenu, closeMenu])

  return (
    <>
      {navigationItems.map((item) => {
        const isActive = activeMenu === item.label
        const hasMegaMenu = !!item.megaMenu

        if (!hasMegaMenu && item.href) {
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => trackNavigationClick({
                link_text: item.label,
                link_url: item.href || '',
                menu_section: 'main_nav',
                destination_type: 'internal',
              })}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
            </Link>
          )
        }

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.label)}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors relative group flex items-center gap-1",
                isActive ? "text-black" : "text-gray-700 hover:text-black"
              )}
              aria-expanded={isActive}
              aria-haspopup="true"
            >
              {item.label}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  isActive && "rotate-180"
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-4 right-4 h-[2px] bg-black transition-transform duration-200",
                  isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </button>

            {/* Enhanced Mega Menu Dropdown */}
            {isActive && item.megaMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-screen max-w-5xl z-50">
                <div className="bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 gap-0">
                    {/* Main Menu Sections */}
                    <div className="col-span-9 p-8">
                      <div className="grid grid-cols-3 gap-8">
                        {item.megaMenu.map((section) => (
                          <div key={section.title}>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                              {section.title}
                              {section.featured && (
                                <Sparkles className="w-3 h-3 text-amber-400" />
                              )}
                            </h3>
                            <ul className="space-y-3">
                              {section.items.map((menuItem) => (
                                <li key={menuItem.href}>
                                  <Link
                                    href={menuItem.href}
                                    onClick={() => {
                                      trackNavigationClick({
                                        link_text: menuItem.label,
                                        link_url: menuItem.href,
                                        menu_section: 'mega_menu',
                                        destination_type: 'internal',
                                      })
                                      closeMenu()
                                    }}
                                    onMouseEnter={() => setHoveredItem(menuItem.href)}
                                    className="block group"
                                  >
                                    <div className="flex items-start gap-2">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                                            {menuItem.label}
                                          </span>
                                          {menuItem.badge && (
                                            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full uppercase tracking-wide">
                                              {menuItem.badge}
                                            </span>
                                          )}
                                          {menuItem.isPopular && (
                                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                          )}
                                        </div>
                                        {menuItem.description && (
                                          <p className="text-xs text-gray-500 mt-0.5 group-hover:text-gray-700 transition-colors">
                                            {menuItem.description}
                                          </p>
                                        )}
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Featured Section with Image */}
                    <div className="col-span-3 bg-gradient-to-br from-amber-50 to-gray-50 p-6 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">
                          Featured
                        </h4>
                        {item.megaMenu[0]?.items[0]?.image && (
                          <div className="relative aspect-square rounded-lg overflow-hidden mb-4 shadow-md">
                            <Image
                              src={item.megaMenu[0].items[0].image}
                              alt={item.megaMenu[0].items[0].label}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h5 className="text-sm font-bold text-gray-900 mb-1">
                          Popular This Month
                        </h5>
                        <p className="text-xs text-gray-600 mb-4">
                          Discover our most loved products
                        </p>
                      </div>
                      <Link
                        href="/products?sort=popular"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 bg-black text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors group"
                      >
                        View All
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
