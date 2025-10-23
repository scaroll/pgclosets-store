/**
 * Tablet-Optimized Layout Component
 *
 * Advanced layout system specifically designed for tablets
 * Split-view, adaptive grids, and touch-optimized interactions
 */

"use client"

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useResponsiveBreakpoints, useResponsiveStyles } from '@/hooks/use-responsive-breakpoints'
import { useTouchInteraction, TapArea } from '@/hooks/use-mobile-interactions'

interface TabletLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  rightPanel?: React.ReactNode
  className?: string
  variant?: 'split' | 'adaptive' | 'grid' | 'carousel'
  sidebarWidth?: string
  rightPanelWidth?: string
  enableSwipe?: boolean
}

export function TabletLayout({
  children,
  sidebar,
  rightPanel,
  className,
  variant = 'adaptive',
  sidebarWidth = '320px',
  rightPanelWidth = '400px',
  enableSwipe = true
}: TabletLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [activeGridItem, setActiveGridItem] = useState<number | null>(null)

  const { isTablet, isLandscape, orientation } = useResponsiveBreakpoints()
  const { getContainerWidth, getSpacing } = useResponsiveStyles()

  const containerRef = useRef<HTMLDivElement>(null)

  // Handle swipe gestures for panel toggles
  const handleGesture = useCallback((gesture: any) => {
    if (!enableSwipe) return

    if (gesture.type === 'swipe-right' && gesture.direction === 'right' && !sidebarOpen) {
      setSidebarOpen(true)
    } else if (gesture.type === 'swipe-left' && gesture.direction === 'left' && sidebarOpen) {
      setSidebarOpen(false)
    } else if (gesture.type === 'swipe-left' && gesture.direction === 'left' && !rightPanelOpen) {
      setRightPanelOpen(true)
    } else if (gesture.type === 'swipe-right' && gesture.direction === 'right' && rightPanelOpen) {
      setRightPanelOpen(false)
    }
  }, [sidebarOpen, rightPanelOpen, enableSwipe])

  useTouchInteraction(handleGesture, {
    swipeThreshold: 40,
    hapticFeedback: true,
  })

  // Determine layout based on variant and orientation
  const getLayoutClasses = useCallback(() => {
    if (!isTablet) {
      return 'flex-col' // Mobile fallback
    }

    switch (variant) {
      case 'split':
        return isLandscape
          ? 'flex-row'
          : 'flex-col'
      case 'adaptive':
        return isLandscape && sidebarOpen && rightPanelOpen
          ? 'flex-row'
          : isLandscape && sidebarOpen
          ? 'flex-row'
          : 'flex-col'
      case 'grid':
        return 'grid grid-cols-2 lg:grid-cols-3'
      case 'carousel':
        return 'flex-row overflow-x-auto'
      default:
        return 'flex-row'
    }
  }, [isTablet, isLandscape, variant, sidebarOpen, rightPanelOpen])

  const getDynamicStyles = useCallback(() => {
    if (!isTablet) return {}

    const baseStyles: React.CSSProperties = {}

    switch (variant) {
      case 'split':
        if (isLandscape) {
          baseStyles.display = 'grid'
          baseStyles.gridTemplateColumns = sidebarOpen
            ? `${sidebarWidth} 1fr ${rightPanelOpen ? rightPanelWidth : '0px'}`
            : `1fr ${rightPanelOpen ? rightPanelWidth : '0px'}`
        }
        break
      case 'adaptive':
        if (isLandscape) {
          baseStyles.display = 'grid'
          if (sidebarOpen && rightPanelOpen) {
            baseStyles.gridTemplateColumns = `${sidebarWidth} 1fr ${rightPanelWidth}`
          } else if (sidebarOpen) {
            baseStyles.gridTemplateColumns = `${sidebarWidth} 1fr`
          } else if (rightPanelOpen) {
            baseStyles.gridTemplateColumns = `1fr ${rightPanelWidth}`
          }
        }
        break
      case 'grid':
        baseStyles.gap = getSpacing(4)
        baseStyles.padding = getSpacing(3)
        break
      case 'carousel':
        baseStyles.scrollSnapType = 'x mandatory'
        baseStyles.scrollBehavior = 'smooth'
        baseStyles.gap = getSpacing(3)
        break
    }

    return baseStyles
  }, [isTablet, isLandscape, variant, sidebarOpen, rightPanelOpen, sidebarWidth, rightPanelWidth, getSpacing])

  return (
    <div
      ref={containerRef}
      className={cn(
        "h-full w-full overflow-hidden bg-gray-50",
        getLayoutClasses(),
        className
      )}
      style={getDynamicStyles()}
    >
      {/* Sidebar */}
      <AnimatePresence>
        {sidebar && (sidebarOpen || !isTablet) && (
          <motion.div
            className={cn(
              "bg-white border-r border-gray-200 overflow-hidden",
              isTablet ? "relative" : "w-full"
            )}
            initial={isTablet ? { x: -sidebarWidth } : { height: 0 }}
            animate={{ x: 0, height: 'auto' }}
            exit={isTablet ? { x: -sidebarWidth } : { height: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={isTablet ? { width: sidebarWidth } : {}}
          >
            {sidebar}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* Sidebar Toggle (Tablet) */}
        {isTablet && sidebar && variant !== 'grid' && (
          <TapArea
            onTap={() => setSidebarOpen(!sidebarOpen)}
            haptic={true}
            className={cn(
              "absolute top-4 left-4 z-10 p-3 bg-white rounded-lg shadow-md",
              sidebarOpen && "bg-gray-100"
            )}
          >
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              animate={{ rotate: sidebarOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </motion.svg>
          </TapArea>
        )}

        {/* Content with variant-specific rendering */}
        {variant === 'carousel' ? (
          <div className="flex gap-4 p-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {children}
          </div>
        ) : (
          <div className="h-full overflow-auto">
            {children}
          </div>
        )}
      </div>

      {/* Right Panel */}
      <AnimatePresence>
        {rightPanel && rightPanelOpen && (
          <motion.div
            className="bg-white border-l border-gray-200 overflow-hidden"
            initial={{ x: rightPanelWidth }}
            animate={{ x: 0 }}
            exit={{ x: rightPanelWidth }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ width: rightPanelWidth }}
          >
            {rightPanel}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Panel Toggle */}
      {isTablet && rightPanel && (
        <TapArea
          onTap={() => setRightPanelOpen(!rightPanelOpen)}
          haptic={true}
          className={cn(
            "absolute top-4 right-4 z-10 p-3 bg-white rounded-lg shadow-md",
            rightPanelOpen && "bg-gray-100"
          )}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={{ rotate: rightPanelOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M9 18l6-6-6-6" />
          </motion.svg>
        </TapArea>
      )}
    </div>
  )
}

// Tablet Grid Component for product displays
export function TabletGrid({
  items,
  columns = 2,
  gap = 'medium',
  aspectRatio = 'square',
  className
}: {
  items: Array<{
    id: string | number
    content: React.ReactNode
    onClick?: () => void
  }>
  columns?: 1 | 2 | 3 | 4
  gap?: 'small' | 'medium' | 'large'
  aspectRatio?: 'square' | 'video' | 'portrait'
  className?: string
}) {
  const { isTablet, isLandscape } = useResponsiveBreakpoints()
  const { getSpacing } = useResponsiveStyles()

  const getGridClasses = useCallback(() => {
    const gapClass = {
      small: 'gap-2',
      medium: 'gap-4',
      large: 'gap-6'
    }[gap]

    const columnClass = {
      1: 'grid-cols-1',
      2: isLandscape ? 'grid-cols-2' : 'grid-cols-2',
      3: isLandscape ? 'grid-cols-3' : 'grid-cols-2',
      4: isLandscape ? 'grid-cols-4' : 'grid-cols-3'
    }[columns]

    return `grid ${columnClass} ${gapClass} ${isTablet ? 'p-4' : 'p-2'}`
  }, [gap, columns, isLandscape, isTablet])

  const getAspectRatioClasses = useCallback(() => {
    return {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]'
    }[aspectRatio]
  }, [aspectRatio])

  return (
    <div className={cn(getGridClasses(), className)}>
      {items.map((item) => (
        <motion.div
          key={item.id}
          className={cn(
            "relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer",
            getAspectRatioClasses()
          )}
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: isTablet ? 1.02 : 1 }}
          onClick={item.onClick}
        >
          {item.content}
        </motion.div>
      ))}
    </div>
  )
}

// Split View Component for comparison and detail views
export function TabletSplitView({
  leftContent,
  rightContent,
  ratio = '50:50',
  resizable = false,
  className
}: {
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  ratio?: '30:70' | '40:60' | '50:50' | '60:40' | '70:30'
  resizable?: boolean
  className?: string
}) {
  const [splitRatio, setSplitRatio] = useState(
    ratio === '30:70' ? 30 :
    ratio === '40:60' ? 40 :
    ratio === '50:50' ? 50 :
    ratio === '60:40' ? 60 : 70
  )

  const [isDragging, setIsDragging] = useState(false)

  const { isTablet, isLandscape } = useResponsiveBreakpoints()

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!resizable) return
    setIsDragging(true)
    e.preventDefault()
  }, [resizable])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !resizable) return

    const container = e.currentTarget as HTMLElement
    const rect = container.getBoundingClientRect()
    const newRatio = ((e.clientX - rect.left) / rect.width) * 100
    setSplitRatio(Math.max(20, Math.min(80, newRatio)))
  }, [isDragging, resizable])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Only use split view on landscape tablets
  if (!isTablet || !isLandscape) {
    return (
      <div className="flex flex-col">
        <div className="flex-1">
          {leftContent}
        </div>
        <div className="flex-1 border-t border-gray-200">
          {rightContent}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn("flex h-full relative", className)}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Left Panel */}
      <div
        className="flex-1 overflow-hidden bg-white border-r border-gray-200"
        style={{ flexBasis: `${splitRatio}%` }}
      >
        {leftContent}
      </div>

      {/* Resizer */}
      {resizable && (
        <div
          className={cn(
            "absolute top-0 bottom-0 w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors z-10",
            isDragging && "bg-blue-500"
          )}
          style={{ left: `${splitRatio}%` }}
          onMouseDown={handleMouseDown}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 5v2h6V5H9zm0 4v2h6V9H9zm0 4v2h6v-2H9z" />
            </svg>
          </div>
        </div>
      )}

      {/* Right Panel */}
      <div
        className="flex-1 overflow-hidden bg-white"
        style={{ flexBasis: `${100 - splitRatio}%` }}
      >
        {rightContent}
      </div>
    </div>
  )
}

// Touch-optimized form component for tablets
export function TabletForm({
  children,
  onSubmit,
  className
}: {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}) {
  const { isTablet } = useResponsiveBreakpoints()

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "space-y-6 p-6 bg-white rounded-lg shadow-sm",
        isTablet && "max-w-2xl mx-auto",
        className
      )}
    >
      {/* Touch-optimized field styling */}
      <style jsx>{`
        input, textarea, select {
          min-height: 44px;
          font-size: 16px; /* Prevents zoom on iOS */
        }

        button {
          min-height: 44px;
          min-width: 44px;
        }

        label {
          font-weight: 500;
          margin-bottom: 8px;
          display: block;
        }
      `}</style>

      {children}
    </form>
  )
}