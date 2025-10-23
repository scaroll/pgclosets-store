/**
 * Mobile-Optimized Navigation Component
 *
 * Advanced mobile navigation with touch gestures, bottom tabs,
 * swipe interactions, and adaptive layouts for all mobile devices
 */

"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  ShoppingBag,
  Phone,
  Menu,
  X,
  Search,
  User,
  ChevronRight,
  ArrowLeft,
  Heart,
  ShoppingCart,
  MapPin,
  Star
} from 'lucide-react'
import { useTouchInteraction, TapArea, PullToRefresh } from '@/hooks/use-mobile-interactions'
import { useResponsiveBreakpoints, useViewport } from '@/hooks/use-responsive-breakpoints'
import { cn } from '@/lib/utils'

// Mobile navigation configuration
const MOBILE_NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    icon: Home,
    badge: null,
  },
  {
    label: 'Products',
    href: '/products',
    icon: ShoppingBag,
    badge: 'New',
  },
  {
    label: 'Services',
    href: '/services',
    icon: Star,
    badge: null,
  },
  {
    label: 'Contact',
    href: '/contact',
    icon: Phone,
    badge: null,
  },
  {
    label: 'Account',
    href: '/account',
    icon: User,
    badge: null,
  },
]

const QUICK_ACTIONS = [
  {
    label: 'Free Quote',
    href: '/quote',
    icon: Star,
    color: 'bg-black text-white',
    size: 'large' as const,
  },
  {
    label: 'Call Us',
    href: 'tel:+16137016393',
    icon: Phone,
    color: 'bg-green-500 text-white',
    size: 'default' as const,
  },
  {
    label: 'Find Us',
    href: '/locations',
    icon: MapPin,
    color: 'bg-blue-500 text-white',
    size: 'default' as const,
  },
]

export function MobileOptimizedNavigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerStack, setDrawerStack] = useState<string[]>([])
  const drawerRef = useRef<HTMLDivElement>(null)

  const { isMobile, isTablet, hasNotch, safeAreaInsets } = useResponsiveBreakpoints()
  const { safeAreaInsets: viewportInsets } = useViewport()

  // Handle swipe gestures for navigation
  const handleGesture = useCallback((gesture: any) => {
    if (gesture.type === 'swipe-right' && gesture.direction === 'right' && !isDrawerOpen) {
      setIsDrawerOpen(true)
    } else if (gesture.type === 'swipe-left' && gesture.direction === 'left' && isDrawerOpen) {
      setIsDrawerOpen(false)
    } else if (gesture.type === 'swipe-down' && searchOpen) {
      setSearchOpen(false)
    }
  }, [isDrawerOpen, searchOpen])

  useTouchInteraction(handleGesture, {
    swipeThreshold: 30,
    hapticFeedback: true,
  })

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  // Handle back navigation in drawer
  const navigateToSubDrawer = (title: string) => {
    setDrawerStack(prev => [...prev, title])
  }

  const navigateBack = () => {
    setDrawerStack(prev => prev.slice(0, -1))
  }

  const currentDrawerLevel = drawerStack.length

  return (
    <>
      {/* Top App Bar */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-gray-200",
          "transition-all duration-300"
        )}
        style={{
          paddingTop: `${safeAreaInsets.top + viewportInsets.top}px`,
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PG</span>
            </div>
            <span className="font-bold text-sm">PG CLOSETS</span>
          </Link>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <TapArea
              onTap={() => setSearchOpen(true)}
              haptic={true}
              className="p-2"
            >
              <Search className="w-5 h-5" />
            </TapArea>

            <TapArea
              onTap={() => setIsDrawerOpen(!isDrawerOpen)}
              haptic={true}
              className="p-2"
            >
              <Menu className="w-5 h-5" />
            </TapArea>
          </div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div style={{ height: `${hasNotch ? 100 : 70}px` }} />

      {/* Navigation Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer Content */}
            <motion.div
              ref={drawerRef}
              className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-2xl z-50 overflow-hidden"
              style={{
                paddingTop: `${safeAreaInsets.top}px`,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {currentDrawerLevel > 0 ? (
                  <TapArea onTap={navigateBack} haptic={true} className="flex items-center gap-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                  </TapArea>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">PG</span>
                    </div>
                    <span className="font-bold">PG CLOSETS</span>
                  </div>
                )}

                <TapArea onTap={() => setIsDrawerOpen(false)} haptic={true} className="p-2">
                  <X className="w-5 h-5" />
                </TapArea>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">
                <NavigationContent
                  level={currentDrawerLevel}
                  onNavigate={navigateToSubDrawer}
                  onClose={() => setIsDrawerOpen(false)}
                />
              </div>

              {/* Quick Actions */}
              <div className="p-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon
                    return (
                      <Link
                        key={action.label}
                        href={action.href}
                        onClick={() => setIsDrawerOpen(false)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-lg transition-colors",
                          action.color,
                          action.size === 'large' ? 'col-span-3' : ''
                        )}
                      >
                        <Icon className={cn(
                          "w-5 h-5",
                          action.size === 'large' ? 'w-6 h-6' : ''
                        )} />
                        <span className={cn(
                          "text-xs font-medium",
                          action.size === 'large' ? 'text-sm' : ''
                        )}>
                          {action.label}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {isMobile && (
        <motion.nav
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-30"
          style={{
            paddingBottom: `${safeAreaInsets.bottom + viewportInsets.bottom}px`,
          }}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="flex items-center justify-around py-2">
            {MOBILE_NAV_ITEMS.map((item, index) => {
              const Icon = item.icon
              const isActive = activeTab === index

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors relative",
                    isActive ? "text-black" : "text-gray-500"
                  )}
                >
                  <div className="relative">
                    <Icon className={cn(
                      "w-5 h-5 transition-all duration-200",
                      isActive ? "scale-110" : "scale-100"
                    )} />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 w-1 h-1 bg-black rounded-full"
                      layoutId="activeTab"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>
        </motion.nav>
      )}

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Spacer for bottom navigation */}
      {isMobile && (
        <div style={{ height: `${hasNotch ? 90 : 70}px` }} />
      )}
    </>
  )
}

// Navigation Content Component
function NavigationContent({
  level,
  onNavigate,
  onClose
}: {
  level: number
  onNavigate: (title: string) => void
  onClose: () => void
}) {
  if (level === 0) {
    return (
      <div className="p-4">
        <ul className="space-y-1">
          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Categories */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Categories
          </h3>
          <ul className="space-y-1">
            {[
              'Barn Doors',
              'Bifold Doors',
              'Hardware',
              'Custom Solutions',
              'Installation'
            ].map((category) => (
              <li key={category}>
                <button
                  onClick={() => onNavigate(category)}
                  className="flex items-center justify-between w-full p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">{category}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // Sub-level content
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Products</h2>
        <p className="text-sm text-gray-500 mt-1">Browse our collection</p>
      </div>

      <ul className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <li key={i}>
            <Link
              href="/products/category"
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-medium">Product {i + 1}</h3>
                  <p className="text-sm text-gray-500">Description</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Search Overlay Component
function SearchOverlay({ isOpen, onClose }: {
  isOpen: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white z-50 overflow-hidden"
          initial={{ opacity: 0, y: '-100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="h-full flex flex-col">
            {/* Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <TapArea onTap={onClose} haptic={true} className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </TapArea>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  autoFocus
                />
              </div>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {query ? (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Results for "{query}"
                  </h3>
                  {/* Search results would go here */}
                  <div className="text-center py-8 text-gray-500">
                    No results found
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Barn Doors',
                      'Hardware',
                      'Installation',
                      'Custom Closets'
                    ].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}