"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface LuxuryButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "premium"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  disabled?: boolean
  loading?: boolean
  icon?: ReactNode
  iconPosition?: "left" | "right"
  shimmer?: boolean
  glow?: boolean
  badge?: string
}

export function LuxuryButton({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  disabled = false,
  loading = false,
  icon,
  iconPosition = "right",
  shimmer = false,
  glow = false,
  badge
}: LuxuryButtonProps) {
  const baseStyles = "relative font-light tracking-wide uppercase transition-all duration-500 overflow-hidden group inline-flex items-center justify-center"

  const sizeStyles = {
    sm: "px-6 py-2 text-xs",
    md: "px-8 py-3 text-sm",
    lg: "px-12 py-4 text-base",
    xl: "px-16 py-5 text-lg"
  }

  const variantStyles = {
    primary: cn(
      "bg-gradient-to-r from-slate-900 to-slate-800 text-white",
      "hover:shadow-2xl hover:scale-105 hover:-translate-y-1",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0",
      glow && "shadow-lg"
    ),
    secondary: cn(
      "border-2 border-slate-300 text-slate-700 bg-white",
      "hover:border-slate-900 hover:bg-slate-900 hover:text-white",
      "hover:shadow-xl hover:scale-105 hover:-translate-y-1"
    ),
    outline: cn(
      "border-2 border-slate-900 text-slate-900 bg-transparent",
      "hover:bg-slate-900 hover:text-white hover:shadow-xl",
      "hover:scale-105 hover:-translate-y-1"
    ),
    ghost: cn(
      "text-slate-700 hover:text-slate-900",
      "hover:bg-slate-100 hover:shadow-md"
    ),
    gold: cn(
      "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
      "hover:from-amber-600 hover:to-amber-700 hover:shadow-2xl",
      "hover:scale-105 hover:-translate-y-1",
      "shadow-lg shadow-amber-500/25"
    ),
    premium: cn(
      "bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white",
      "hover:shadow-2xl hover:scale-105 hover:-translate-y-1",
      "border border-amber-500/30",
      "shadow-lg shadow-amber-500/20"
    )
  }

  const buttonContent = (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Enhanced gradient overlay animations */}
      {variant === "primary" && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 to-slate-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
      )}

      {variant === "gold" && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
      )}

      {variant === "premium" && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
      )}

      {/* Shimmer effect */}
      {shimmer && (
        <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
      )}

      {/* Enhanced glow effect */}
      {glow && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-transparent" />
        </div>
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="font-light">Processing...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
                {icon}
              </span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                {icon}
              </span>
            )}
          </>
        )}
      </span>

      {/* Enhanced ripple effect */}
      <span className="absolute inset-0 -z-10">
        <span className="absolute inset-0 bg-white opacity-0 group-active:opacity-30 transition-all duration-300 scale-0 group-active:scale-100 rounded-full" />
      </span>

      {/* Badge */}
      {badge && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center shadow-lg">
          {badge}
        </span>
      )}
    </div>
  )

  const buttonStyles = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  )

  if (href && !disabled) {
    return (
      <Link href={href} className={buttonStyles}>
        {buttonContent}
      </Link>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonStyles}
    >
      {buttonContent}
    </button>
  )
}

// Arrow icon for CTAs
export const ArrowIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

// Plus icon for add actions
export const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

// Check icon for success states
export const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)