'use client'

import React from 'react'

interface AppleSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'blue' | 'gray' | 'white'
}

const sizeClasses = {
  sm: 'w-4 h-4 border-[1.5px]',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-[2.5px]',
  xl: 'w-16 h-16 border-[3px]'
}

const colorClasses = {
  blue: 'border-[#007aff]',
  gray: 'border-[#86868b]',
  white: 'border-white'
}

/**
 * AppleSpinner - Premium circular loading spinner
 *
 * Apple Design DNA:
 * - Simple circle, no logo
 * - Smooth continuous rotation (1s duration)
 * - Subtle and elegant
 * - System blue color by default
 * - Perfect easing curve
 */
export default function AppleSpinner({
  size = 'md',
  className = '',
  color = 'blue'
}: AppleSpinnerProps) {
  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${className}
        relative inline-block
      `}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`
          w-full h-full
          ${colorClasses[color]}
          border-t-transparent
          rounded-full
        `}
        style={{
          animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite'
        }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}
