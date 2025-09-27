"use client"

import { cn } from "@/lib/utils"

interface LuxuryLoadingProps {
  size?: "sm" | "md" | "lg"
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
  className?: string
  text?: string
}

export function LuxuryLoading({
  size = "md",
  variant = "spinner",
  className,
  text
}: LuxuryLoadingProps) {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div className={cn("relative", sizeStyles[size])}>
          <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
        </div>
        {text && (
          <p className="mt-4 text-sm font-light text-slate-600 tracking-wide animate-pulse">
            {text}
          </p>
        )}
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-1", className)}>
        <div className={cn("rounded-full bg-slate-900 animate-bounce", sizeStyles[size])}
             style={{ animationDelay: "0ms" }} />
        <div className={cn("rounded-full bg-slate-700 animate-bounce", sizeStyles[size])}
             style={{ animationDelay: "150ms" }} />
        <div className={cn("rounded-full bg-slate-500 animate-bounce", sizeStyles[size])}
             style={{ animationDelay: "300ms" }} />
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <div className="relative">
          <div className={cn(
            "rounded-full bg-gradient-to-r from-slate-900 to-slate-700",
            sizeStyles[size],
            "animate-pulse"
          )} />
          <div className={cn(
            "absolute inset-0 rounded-full bg-gradient-to-r from-slate-900 to-slate-700",
            "animate-ping opacity-75"
          )} />
        </div>
        {text && (
          <p className="mt-4 text-sm font-light text-slate-600 tracking-wide">
            {text}
          </p>
        )}
      </div>
    )
  }

  // Skeleton variant for content placeholders
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="space-y-4">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
      </div>
    </div>
  )
}

// Page loading overlay
export function LuxuryPageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Animated logo placeholder */}
          <div className="w-16 h-16 mx-auto relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-slate-900 to-slate-700 animate-pulse" />
            <div className="absolute inset-2 rounded-md bg-white" />
            <div className="absolute inset-3 rounded-sm bg-gradient-to-br from-slate-900 to-slate-700 animate-pulse" />
          </div>
        </div>

        <LuxuryLoading variant="dots" size="sm" />

        <p className="mt-4 text-sm font-light text-slate-600 tracking-widest uppercase">
          Loading Experience
        </p>
      </div>
    </div>
  )
}

// Skeleton loaders for different content types
export function ProductSkeleton() {
  return (
    <div className="bg-white border border-gray-100 shadow-lg overflow-hidden">
      <div className="aspect-[4/3] bg-slate-200 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-slate-200 rounded animate-pulse" />
        <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse" />
        <div className="h-12 bg-slate-200 rounded animate-pulse" />
      </div>
    </div>
  )
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 rounded animate-pulse"
          style={{ width: `${Math.random() * 30 + 70}%` }}
        />
      ))}
    </div>
  )
}