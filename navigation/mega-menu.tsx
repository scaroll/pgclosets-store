"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  ArrowRight,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Home,
  Palette,
  Wrench,
  Award,
  Clock,
  Users,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const menuItems = {
  solutions: {
    title: "Solutions",
    sections: [
      {
        title: "Closet Types",
        icon: Home,
        items: [
          {
            name: "Walk-in Closets",
            href: "/products?category=walk-in-closets",
            description: "Luxury walk-in systems with custom organization",
            badge: "Popular",
          },
          {
            name: "Reach-in Closets",
            href: "/products?category=reach-in-closets",
            description: "Space-saving sliding and bifold solutions",
          },
          {
            name: "Pantries",
            href: "/products?category=pantries",
            description: "Kitchen and butler pantry organization",
          },
          {
            name: "Home Offices",
            href: "/products?category=home-offices",
            description: "Built-in storage for productivity",
          },
          {
            name: "Garage Systems",
            href: "/products?category=garage-systems",
            description: "Wall-mounted and overhead storage",
          },
        ],
      },
      {
        title: "Door Styles",
        icon: Palette,
        items: [
          {
            name: "Georgian 6-Panel",
            href: "/products?style=georgian",
            description: "Classic raised panel design",
            badge: "Bestseller",
          },
          {
            name: "Euro Glass-Lite",
            href: "/products?style=euro-glass",
            description: "Modern frosted glass panels",
          },
          {
            name: "Twilight Series",
            href: "/products?style=twilight",
            description: "Clean contemporary styling",
          },
          {
            name: "Harmony Mirrors",
            href: "/products?category=mirror-doors",
            description: "Full-length mirrored doors",
          },
        ],
      },
      {
        title: "Services",
        icon: Wrench,
        items: [
          {
            name: "Free Design Consultation",
            href: "/consultation",
            description: "Expert guidance and planning",
            badge: "Free",
          },
          {
            name: "3D Visualization",
            href: "/design-studio",
            description: "See your closet before installation",
          },
          {
            name: "Professional Installation",
            href: "/about#installation",
            description: "Certified installer network",
          },
          {
            name: "Warranty & Support",
            href: "/about#warranty",
            description: "Comprehensive coverage",
          },
        ],
      },
    ],
    featured: {
      title: "Featured Solution",
      name: "Ottawa's Premier Custom Closets",
      description: "Transform your space with locally designed, fabricated & installed closet solutions",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/georgian-6-panel-sliding-high-res-zyb8lchgerfPz67hNnZq3MMCgPTbJv.webp",
      href: "/products",
      badge: "Local Favorite",
      stats: [
        { icon: Users, label: "5,000+ Homes", value: "Organized" },
        { icon: Award, label: "15+ Years", value: "Excellence" },
        { icon: Clock, label: "Free", value: "Consultation" },
      ],
    },
  },
}

interface MegaMenuProps {
  activeMenu: string | null
  onClose: () => void
}

export function MegaMenu({ activeMenu, onClose }: MegaMenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [gridCols, setGridCols] = useState(3)

  useEffect(() => {
    if (activeMenu) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [activeMenu])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setGridCols(1) // Mobile: single column
      } else if (width < 1024) {
        setGridCols(2) // Tablet: two columns
      } else {
        setGridCols(3) // Desktop: three columns
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (!activeMenu || !menuItems[activeMenu as keyof typeof menuItems]) return null

  const menu = menuItems[activeMenu as keyof typeof menuItems]

  return (
    <div
      className={`absolute top-full left-0 w-full bg-luxury-white/98 backdrop-blur-xl border-b border-luxury-soft-gray shadow-luxury-strong z-40 transition-all duration-700 ease-out overflow-hidden ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      }`}
      onMouseLeave={onClose}
    >
      <div className="absolute inset-0 bg-luxury-gradient-hero opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative">
        <div
          className={`grid gap-6 lg:gap-10 ${gridCols === 1 ? "grid-cols-1" : gridCols === 2 ? "lg:grid-cols-3 md:grid-cols-2" : "lg:grid-cols-4"}`}
        >
          <div
            className={`${gridCols === 1 ? "col-span-1" : "lg:col-span-3"} grid gap-6 lg:gap-10 ${gridCols === 1 ? "grid-cols-1" : gridCols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}
          >
            {menu.sections.map((section, index) => (
              <div
                key={index}
                className={`space-y-4 lg:space-y-6 transition-all duration-800 ease-out ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150 + 200}ms` }}
              >
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-3 lg:mb-4">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-luxury-accent-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-3 h-3 lg:w-4 lg:h-4 text-luxury-accent-gold" />
                    </div>
                    <h3 className="text-base lg:text-luxury-h4 text-luxury-charcoal font-inter font-bold truncate">
                      {section.title}
                    </h3>
                  </div>
                  <div className="w-8 lg:w-12 h-0.5 bg-luxury-gradient-gold rounded-full" />
                </div>

                <ul className="space-y-2 lg:space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-luxury-accent-gold/20 scrollbar-track-transparent">
                  {section.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className={`transition-all duration-600 ease-out ${
                        isVisible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                      }`}
                      style={{ transitionDelay: `${index * 150 + itemIndex * 75 + 400}ms` }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        onMouseEnter={() => setHoveredItem(`${index}-${itemIndex}`)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className="group flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl hover:bg-luxury-soft-gray/50 transition-all duration-300 hover:shadow-luxury-soft hover:scale-[1.02] transform-gpu min-w-0"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 lg:space-x-3 mb-1 lg:mb-2">
                            <span className="text-sm lg:text-luxury-body font-semibold text-luxury-charcoal group-hover:text-luxury-accent-gold transition-all duration-300 truncate">
                              {item.name}
                            </span>
                            {item.badge && (
                              <Badge
                                className={`text-xs font-medium transition-all duration-300 hover:scale-110 flex-shrink-0 ${
                                  item.badge === "Popular" || item.badge === "Bestseller"
                                    ? "bg-luxury-accent-gold/20 text-luxury-accent-gold border-luxury-accent-gold/30"
                                    : item.badge === "Free"
                                      ? "bg-green-100 text-green-700 border-green-200"
                                      : item.badge === "Local Favorite"
                                        ? "bg-luxury-warm-wood/20 text-luxury-warm-wood border-luxury-warm-wood/30"
                                        : "bg-luxury-soft-gray text-luxury-charcoal"
                                }`}
                              >
                                {item.badge === "Popular" && <TrendingUp className="w-3 h-3 mr-1" />}
                                {item.badge === "Bestseller" && <Star className="w-3 h-3 mr-1" />}
                                {item.badge === "Free" && <Sparkles className="w-3 h-3 mr-1" />}
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs lg:text-sm text-luxury-warm-wood group-hover:text-luxury-charcoal transition-colors duration-300 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="relative flex-shrink-0">
                          <ChevronRight
                            className={`w-4 h-4 lg:w-5 lg:h-5 text-luxury-warm-wood group-hover:text-luxury-accent-gold transition-all duration-300 group-hover:translate-x-1 ${
                              hoveredItem === `${index}-${itemIndex}` ? "scale-110" : ""
                            }`}
                          />
                          {hoveredItem === `${index}-${itemIndex}` && (
                            <div className="absolute inset-0 bg-luxury-accent-gold/20 rounded-full animate-ping" />
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className={`${gridCols === 1 ? "col-span-1 mt-6" : "lg:col-span-1"} transition-all duration-800 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
          >
            <Card className="card-luxury-premium overflow-hidden group hover:shadow-luxury-strong transition-all duration-500 hover:scale-[1.02] transform-gpu">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={menu.featured.image || "/placeholder.svg"}
                  alt={`${menu.featured.name} - Premium custom closet solutions showcase featuring professional installation and design`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-luxury-gradient-charcoal opacity-40 group-hover:opacity-60 transition-all duration-500" />

                <div className="absolute top-3 lg:top-4 left-3 lg:left-4">
                  <Badge className="bg-luxury-accent-gold/90 text-luxury-charcoal border-luxury-accent-gold font-semibold text-xs">
                    <Star className="w-3 h-3 mr-1 animate-pulse" />
                    {menu.featured.badge}
                  </Badge>
                </div>

                <div className="absolute bottom-3 lg:bottom-4 right-3 lg:right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-luxury-accent-gold/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-luxury-accent-gold transition-colors duration-300 shadow-luxury-gold">
                    <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-luxury-charcoal" />
                  </div>
                </div>
              </div>

              <CardHeader className="pb-3 lg:pb-4 p-4 lg:p-6">
                <CardDescription className="text-xs text-luxury-warm-wood uppercase tracking-wider font-semibold">
                  {menu.featured.title}
                </CardDescription>
                <CardTitle className="text-base lg:text-luxury-h4 text-luxury-charcoal group-hover:text-luxury-accent-gold transition-colors duration-300 line-clamp-2">
                  {menu.featured.name}
                </CardTitle>
                <p className="text-sm lg:text-luxury-body text-luxury-warm-wood group-hover:text-luxury-charcoal transition-colors duration-300 line-clamp-3">
                  {menu.featured.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 lg:space-y-4 p-4 lg:p-6 pt-0">
                <div className="grid grid-cols-3 gap-1 lg:gap-2">
                  {menu.featured.stats.map((stat, index) => (
                    <div key={index} className="text-center p-2 bg-luxury-soft-gray/50 rounded-lg">
                      <stat.icon className="w-3 h-3 lg:w-4 lg:h-4 mx-auto mb-1 text-luxury-accent-gold" />
                      <div className="text-xs font-bold text-luxury-charcoal truncate">{stat.value}</div>
                      <div className="text-xs text-luxury-warm-wood truncate">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <Link href={menu.featured.href} onClick={onClose}>
                  <Button
                    size="sm"
                    className="btn-luxury-gold w-full shadow-luxury-gold hover:shadow-luxury-strong transform hover:scale-105 transition-all duration-300 group/btn"
                  >
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-1 text-sm">
                      Explore Solutions
                    </span>
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        <div
          className={`mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-luxury-soft-gray transition-all duration-800 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
          style={{ transitionDelay: "900ms" }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2 min-w-0">
              <h4 className="text-base lg:text-luxury-h4 text-luxury-charcoal flex items-center">
                <Star className="w-4 h-4 lg:w-5 lg:h-5 mr-2 lg:mr-3 text-luxury-accent-gold animate-pulse flex-shrink-0" />
                <span className="truncate">Ready to Transform Your Space?</span>
              </h4>
              <p className="text-sm lg:text-luxury-body text-luxury-warm-wood line-clamp-2">
                Ottawa's premier custom closet solutions - designed, fabricated & installed locally
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 flex-shrink-0">
              <Link href="/consultation" onClick={onClose}>
                <Button
                  size="sm"
                  className="btn-luxury-secondary hover:shadow-luxury-medium transform hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
                >
                  <Zap className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  <span className="whitespace-nowrap">Free Consultation</span>
                </Button>
              </Link>
              <Link href="/contact" onClick={onClose}>
                <Button
                  size="sm"
                  className="btn-luxury-gold shadow-luxury-gold hover:shadow-luxury-strong transform hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1 whitespace-nowrap">
                    Get Started
                  </span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
