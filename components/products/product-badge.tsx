import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Flame, Package, Sparkles, Tag, Truck } from "lucide-react"

export type BadgeType = "sale" | "new" | "bestseller" | "limited" | "free-shipping"

export interface ProductBadgeProps {
  type: BadgeType
  /** Sale percentage (only used when type is "sale") */
  salePercentage?: number
  /** Custom text to display instead of default */
  customText?: string
  /** Additional CSS classes */
  className?: string
  /** Show icon alongside text */
  showIcon?: boolean
  /** Size variant */
  size?: "sm" | "md" | "lg"
}

const badgeConfig: Record<
  BadgeType,
  {
    icon: React.ElementType
    text: string
    className: string
  }
> = {
  sale: {
    icon: Tag,
    text: "Sale",
    className: "bg-red-600 text-white border-transparent hover:bg-red-700",
  },
  new: {
    icon: Sparkles,
    text: "New",
    className: "bg-blue-600 text-white border-transparent hover:bg-blue-700",
  },
  bestseller: {
    icon: Flame,
    text: "Bestseller",
    className: "bg-amber-600 text-white border-transparent hover:bg-amber-700",
  },
  limited: {
    icon: Package,
    text: "Limited Stock",
    className:
      "bg-orange-600 text-white border-transparent hover:bg-orange-700",
  },
  "free-shipping": {
    icon: Truck,
    text: "Free Shipping",
    className: "bg-green-600 text-white border-transparent hover:bg-green-700",
  },
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
}

const iconSizeClasses = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
}

export function ProductBadge({
  type,
  salePercentage,
  customText,
  className,
  showIcon = true,
  size = "md",
}: ProductBadgeProps) {
  const config = badgeConfig[type]
  const Icon = config.icon

  // Generate badge text
  let badgeText = customText || config.text
  if (type === "sale" && salePercentage) {
    badgeText = customText || `-${salePercentage}%`
  }

  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1 font-semibold shadow-sm",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon className={iconSizeClasses[size]} />}
      <span>{badgeText}</span>
    </Badge>
  )
}

/**
 * ProductBadgeGroup - Display multiple badges in a consistent layout
 */
export interface ProductBadgeGroupProps {
  badges: Array<{
    type: BadgeType
    salePercentage?: number
    customText?: string
  }>
  className?: string
  showIcons?: boolean
  size?: "sm" | "md" | "lg"
  /** Maximum number of badges to show */
  maxBadges?: number
}

export function ProductBadgeGroup({
  badges,
  className,
  showIcons = true,
  size = "md",
  maxBadges,
}: ProductBadgeGroupProps) {
  const displayBadges = maxBadges ? badges.slice(0, maxBadges) : badges

  if (displayBadges.length === 0) {
    return null
  }

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {displayBadges.map((badge, index) => (
        <ProductBadge
          key={`${badge.type}-${index}`}
          type={badge.type}
          salePercentage={badge.salePercentage}
          customText={badge.customText}
          showIcon={showIcons}
          size={size}
        />
      ))}
      {maxBadges && badges.length > maxBadges && (
        <Badge
          className={cn(
            "bg-gray-600 text-white border-transparent",
            sizeClasses[size]
          )}
        >
          +{badges.length - maxBadges}
        </Badge>
      )}
    </div>
  )
}

/**
 * Helper function to determine which badges should be shown for a product
 */
export interface ProductBadgeData {
  isNew?: boolean
  isBestseller?: boolean
  isLimitedStock?: boolean
  hasFreeShipping?: boolean
  salePercentage?: number
}

export function getProductBadges(data: ProductBadgeData): Array<{
  type: BadgeType
  salePercentage?: number
}> {
  const badges: Array<{ type: BadgeType; salePercentage?: number }> = []

  // Sale badge has highest priority
  if (data.salePercentage && data.salePercentage > 0) {
    badges.push({ type: "sale", salePercentage: data.salePercentage })
  }

  // New products are important to highlight
  if (data.isNew) {
    badges.push({ type: "new" })
  }

  // Bestseller badge
  if (data.isBestseller) {
    badges.push({ type: "bestseller" })
  }

  // Limited stock creates urgency
  if (data.isLimitedStock) {
    badges.push({ type: "limited" })
  }

  // Free shipping is a selling point
  if (data.hasFreeShipping) {
    badges.push({ type: "free-shipping" })
  }

  return badges
}
