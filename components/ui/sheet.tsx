"use client"

import * as React from "react"

interface SheetProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface SheetContentProps {
  children: React.ReactNode
  className?: string
  side?: "left" | "right" | "top" | "bottom"
}

interface SheetHeaderProps {
  children: React.ReactNode
  className?: string
}

interface SheetTitleProps {
  children: React.ReactNode
  className?: string
}

// Stub implementations for sheet components
export function Sheet({ children, open, onOpenChange }: SheetProps) {
  return (
    <div className="relative">
      {children}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => onOpenChange?.(false)}
        />
      )}
    </div>
  )
}

export function SheetContent({ children, className, side = "right" }: SheetContentProps) {
  const sideStyles = {
    right: "fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform translate-x-0",
    left: "fixed top-0 left-0 h-full w-80 bg-white shadow-lg z-50 transform translate-x-0",
    top: "fixed top-0 left-0 w-full h-80 bg-white shadow-lg z-50 transform translate-y-0",
    bottom: "fixed bottom-0 left-0 w-full h-80 bg-white shadow-lg z-50 transform translate-y-0"
  }

  return (
    <div className={`${sideStyles[side]} ${className || ''}`}>
      <div className="p-6 h-full overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export function SheetHeader({ children, className }: SheetHeaderProps) {
  return (
    <div className={`mb-6 ${className || ''}`}>
      {children}
    </div>
  )
}

export function SheetTitle({ children, className }: SheetTitleProps) {
  return (
    <h2 className={`text-lg font-semibold ${className || ''}`}>
      {children}
    </h2>
  )
}