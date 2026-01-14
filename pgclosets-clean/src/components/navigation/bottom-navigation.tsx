"use client"

import { useState, useEffect, useCallback, memo } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Home,
  Search,
  ShoppingCart,
  Phone,
  Menu,
  ShoppingBag,
  Heart
} from "@/components/ui/icons"

interface BottomNavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
  action?: () => void
}

interface BottomNavigationProps {
  cartItemCount?: number
  onMenuToggle?: () => void
  className?: string
}

export const BottomNavigation = memo(function BottomNavigation({
  cartItemCount = 0,
  onMenuToggle,
  className
}: BottomNavigationProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Auto-hide on scroll down, show on scroll up
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      setIsVisible(false) // Scrolling down
    } else {
      setIsVisible(true) // Scrolling up
    }

    setLastScrollY(currentScrollY)
  }, [lastScrollY])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const navItems: BottomNavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: Home
    },
    {
      label: "Products",
      href: "/products",
      icon: ShoppingBag
    },
    {
      label: "Search",
      href: "/search",
      icon: Search
    },
    {
      label: "Cart",
      href: "/simple-cart",
      icon: ShoppingCart,
      badge: cartItemCount
    },
    {
      label: "Menu",
      href: "#",
      icon: Menu,
      action: onMenuToggle
    }
  ]

  return (
    <>
      {/* Spacer to prevent content from being hidden behind fixed bottom nav */}
      <div className="h-20 lg:hidden" />

      {/* Bottom Navigation Bar */}
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 lg:hidden",
          "bg-white border-t border-gray-200 shadow-2xl",
          "transform transition-transform duration-300 ease-in-out",
          isVisible ? "translate-y-0" : "translate-y-full",
          className
        )}
        aria-label="Mobile bottom navigation"
      >
        <div className="px-2 py-1">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = item.href !== "#" && pathname === item.href

              return (
                <div key={item.label} className="relative">
                  {item.action ? (
                    <button
                      onClick={item.action}
                      className={cn(
                        "flex flex-col items-center justify-center",
                        "min-h-[60px] min-w-[60px] px-2 py-2",
                        "rounded-xl transition-all duration-200",
                        "touch-manipulation active:scale-95",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                        "group"
                      )}
                      aria-label={item.label}
                    >
                      <div className="relative">
                        <item.icon
                          className={cn(
                            "w-6 h-6 transition-transform duration-200",
                            "group-active:scale-110"
                          )}
                        />
                        {item.badge && item.badge > 0 && (
                          <span
                            className={cn(
                              "absolute -top-2 -right-2",
                              "min-w-[18px] h-[18px] px-1",
                              "bg-red-500 text-white text-xs font-bold",
                              "rounded-full flex items-center justify-center",
                              "animate-pulse"
                            )}
                            aria-label={`${item.badge} items in cart`}
                          >
                            {item.badge > 99 ? "99+" : item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium mt-1 transition-colors",
                          isActive ? "text-blue-600" : "text-gray-600"
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "flex flex-col items-center justify-center",
                        "min-h-[60px] min-w-[60px] px-2 py-2",
                        "rounded-xl transition-all duration-200",
                        "touch-manipulation active:scale-95",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                        "group"
                      )}
                      aria-label={`Navigate to ${item.label}`}
                    >
                      <div className="relative">
                        <item.icon
                          className={cn(
                            "w-6 h-6 transition-transform duration-200",
                            "group-active:scale-110"
                          )}
                        />
                        {item.badge && item.badge > 0 && (
                          <span
                            className={cn(
                              "absolute -top-2 -right-2",
                              "min-w-[18px] h-[18px] px-1",
                              "bg-red-500 text-white text-xs font-bold",
                              "rounded-full flex items-center justify-center",
                              "animate-pulse"
                            )}
                            aria-label={`${item.badge} items in cart`}
                          >
                            {item.badge > 99 ? "99+" : item.badge}
                          </span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium mt-1 transition-colors",
                          isActive ? "text-blue-600" : "text-gray-600"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-white" />
      </nav>
    </>
  )
})

// Floating Action Button for primary actions
interface FloatingActionButtonProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
  variant?: "primary" | "secondary"
  className?: string
}

export function FloatingActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "primary",
  className
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-4 z-50 lg:hidden",
        "w-14 h-14 rounded-full shadow-lg",
        "flex items-center justify-center",
        "touch-manipulation active:scale-95",
        "focus:outline-none focus:ring-4 focus:ring-offset-2",
        "transition-all duration-200",
        "group hover:shadow-xl",
        variant === "primary"
          ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
          : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-500",
        className
      )}
      aria-label={label}
    >
      <Icon className="w-6 h-6 transition-transform group-active:scale-110" />
    </button>
  )
}

// Quick contact floating button
export function QuickContactFAB() {
  const handleContact = () => {
    // Navigate to contact or open contact modal
    window.location.href = "/contact"
  }

  return (
    <FloatingActionButton
      icon={Phone}
      label="Quick contact for quote"
      onClick={handleContact}
      variant="primary"
    />
  )
}

// Quick save/bookmark floating button
export function QuickSaveFAB() {
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    // Add to saved items logic here
  }

  return (
    <FloatingActionButton
      icon={Heart}
      label={isSaved ? "Remove from saved" : "Save for later"}
      onClick={handleSave}
      variant="secondary"
      className={cn(
        "bottom-40",
        isSaved && "bg-yellow-100 border-yellow-300 text-yellow-700"
      )}
    />
  )
}