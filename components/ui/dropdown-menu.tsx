"use client"

import * as React from "react"

interface DropdownMenuProps {
  children: React.ReactNode
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  asChild?: boolean
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  align?: "start" | "center" | "end"
  sideOffset?: number
  className?: string
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  onClick?: () => void
  asChild?: boolean
  className?: string
}

type DropdownMenuSeparatorProps = Record<string, never>

// Stub implementations for dropdown menu components
export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block text-left">{children}</div>
}

export function DropdownMenuTrigger({ children, asChild: _asChild }: DropdownMenuTriggerProps) {
  return <div className="cursor-pointer">{children}</div>
}

export function DropdownMenuContent({ children, align: _align, sideOffset: _sideOffset, className }: DropdownMenuContentProps) {
  return (
    <div className={`absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 ${className || ''}`}>
      <div className="py-1">{children}</div>
    </div>
  )
}

export function DropdownMenuItem({ children, onClick, asChild, className }: DropdownMenuItemProps) {
  if (asChild) {
    return <div className={`px-4 py-2 text-sm hover:bg-gray-100 ${className || 'text-gray-700 hover:text-gray-900'}`}>{children}</div>
  }
  
  return (
    <button
      onClick={onClick}
      className={`block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left ${className || 'text-gray-700 hover:text-gray-900'}`}
    >
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({}: DropdownMenuSeparatorProps) {
  return <div className="border-t border-gray-100 my-1" />
}