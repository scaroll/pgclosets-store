"use client"

import { Badge } from "./badge"
import { Shield, Clock, Award } from "lucide-react"

interface TrustChipsProps {
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "light" | "dark"
}

/**
 * TrustChips Component
 *
 * Displays trust signals near CTAs to increase conversion
 * Standard content: "Licensed & Insured • 2-Week Install • Lifetime Warranty"
 *
 * Usage:
 * <TrustChips /> - Default styling
 * <TrustChips size="sm" /> - Smaller size for cards
 * <TrustChips variant="light" /> - For dark backgrounds
 */
export function TrustChips({ className = "", size = "default", variant = "default" }: TrustChipsProps) {
  const chips = [
    { label: "Licensed & Insured", icon: Shield },
    { label: "2-Week Install", icon: Clock },
    { label: "Lifetime Warranty", icon: Award },
  ]

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {chips.map((chip) => {
        const Icon = chip.icon
        return (
          <Badge
            key={chip.label}
            variant={variant === "light" ? "outline" : variant === "dark" ? "default" : "secondary"}
            size={size}
            className="inline-flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Icon className="w-3 h-3" />
            {chip.label}
          </Badge>
        )
      })}
    </div>
  )
}

/**
 * Compact inline variant for space-constrained areas
 */
export function TrustChipsInline({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-gray-600 font-medium uppercase tracking-wide ${className}`}>
      <span className="inline-flex items-center gap-1">
        <Shield className="w-3 h-3" />
        Licensed & Insured
      </span>
      {" • "}
      <span className="inline-flex items-center gap-1">
        <Clock className="w-3 h-3" />
        2-Week Install
      </span>
      {" • "}
      <span className="inline-flex items-center gap-1">
        <Award className="w-3 h-3" />
        Lifetime Warranty
      </span>
    </p>
  )
}
