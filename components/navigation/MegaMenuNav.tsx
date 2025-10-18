"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { trackNavigationClick, trackMegaMenuInteraction } from "@/lib/analytics/enhanced-tracking"

interface MenuItem {
  label: string
  href: string
}

interface MegaMenuSection {
  title: string
  items: MenuItem[]
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
          { label: "Barn Doors", href: "/collections/renin-barn-doors" },
          { label: "Bypass Doors", href: "/collections/renin-bypass-doors" },
          { label: "Bifold Doors", href: "/collections/renin-bifold-doors" },
          { label: "Closet Doors", href: "/collections/renin-closet-doors" },
          { label: "Pivot Doors", href: "/collections/renin-pivot-doors" },
          { label: "Room Dividers", href: "/collections/renin-room-dividers" },
        ],
      },
      {
        title: "Accessories",
        items: [
          { label: "Hardware", href: "/collections/hardware" },
          { label: "Mirrors", href: "/collections/mirrors" },
        ],
      },
      {
        title: "Browse",
        items: [
          { label: "All Products", href: "/products" },
          { label: "Get Estimate", href: "/instant-estimate" },
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
          { label: "Design Consultation", href: "/services/consultation" },
          { label: "Custom Design", href: "/services/custom-design" },
          { label: "Installation", href: "/services/installation" },
          { label: "Project Planning", href: "/services/planning" },
        ],
      },
      {
        title: "Support",
        items: [
          { label: "Warranty Info", href: "/services/warranty" },
          { label: "Maintenance Tips", href: "/services/maintenance" },
          { label: "FAQ", href: "/faq" },
        ],
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
]

export function MegaMenuNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
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
    }, 200)
  }, [])

  const closeMenu = useCallback(() => {
    setActiveMenu(null)
  }, [])

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

            {/* Mega Menu Dropdown */}
            {isActive && item.megaMenu && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-screen max-w-4xl">
                <div className="bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden">
                  <div className="grid grid-cols-3 gap-8 p-8">
                    {item.megaMenu.map((section) => (
                      <div key={section.title}>
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                          {section.title}
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
                                className="block text-sm text-gray-700 hover:text-black transition-colors group"
                              >
                                <span className="relative">
                                  {menuItem.label}
                                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-200" />
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
