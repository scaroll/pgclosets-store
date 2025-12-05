import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, formatPrice } from "@/lib/utils"
import { Badge } from "@/ui/badge"

// ============================================================================
// Price Display Variants
// ============================================================================

const priceDisplayVariants = cva("flex items-center gap-2", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    layout: {
      horizontal: "flex-row flex-wrap",
      vertical: "flex-col items-start gap-1",
    },
  },
  defaultVariants: {
    size: "md",
    layout: "horizontal",
  },
})

const salePriceVariants = cva("font-bold", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
      "2xl": "text-3xl",
      "3xl": "text-4xl",
      "4xl": "text-5xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const regularPriceVariants = cva("font-bold", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
      "2xl": "text-3xl",
      "3xl": "text-4xl",
      "4xl": "text-5xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const originalPriceVariants = cva("line-through text-muted-foreground", {
  variants: {
    size: {
      xs: "text-[10px]",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
      "2xl": "text-xl",
      "3xl": "text-2xl",
      "4xl": "text-3xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const discountBadgeVariants = cva("", {
  variants: {
    size: {
      xs: "text-[10px] px-1.5 py-0.5",
      sm: "text-xs px-2 py-0.5",
      md: "text-xs px-2.5 py-0.5",
      lg: "text-sm px-3 py-1",
      xl: "text-sm px-3 py-1",
      "2xl": "text-base px-4 py-1.5",
      "3xl": "text-base px-4 py-1.5",
      "4xl": "text-lg px-5 py-2",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

const fromLabelVariants = cva("text-muted-foreground font-normal", {
  variants: {
    size: {
      xs: "text-[10px]",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
      "2xl": "text-xl",
      "3xl": "text-2xl",
      "4xl": "text-3xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

// ============================================================================
// Types
// ============================================================================

export interface PriceDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof priceDisplayVariants> {
  /** Regular price in cents */
  price: number
  /** Sale price in cents (optional) */
  salePrice?: number
  /** Show discount percentage badge */
  showDiscount?: boolean
  /** Show "From" prefix for products with variants */
  showFromPrefix?: boolean
  /** Custom discount label (e.g., "Save", "Off") */
  discountLabel?: string
  /** Discount badge variant */
  discountVariant?: "default" | "secondary" | "destructive" | "outline"
  /** Highlight sale price color */
  salePriceColor?: string
}

// ============================================================================
// Price Display Component
// ============================================================================

export function PriceDisplay({
  price,
  salePrice,
  showDiscount = true,
  showFromPrefix = false,
  discountLabel = "",
  discountVariant = "destructive",
  salePriceColor = "text-primary",
  size = "md",
  layout = "horizontal",
  className,
  ...props
}: PriceDisplayProps) {
  // Calculate discount percentage
  const discount = salePrice && salePrice < price
    ? Math.round((1 - salePrice / price) * 100)
    : 0

  const hasDiscount = discount > 0
  const displayPrice = hasDiscount ? salePrice! : price

  return (
    <div
      className={cn(priceDisplayVariants({ size, layout }), className)}
      {...props}
    >
      {/* From Prefix */}
      {showFromPrefix && (
        <span className={cn(fromLabelVariants({ size }))}>From</span>
      )}

      {/* Sale Price or Regular Price */}
      {hasDiscount ? (
        <span className={cn(salePriceVariants({ size }), salePriceColor)}>
          {formatPrice(displayPrice)}
        </span>
      ) : (
        <span className={cn(regularPriceVariants({ size }))}>
          {formatPrice(displayPrice)}
        </span>
      )}

      {/* Original Price (Strikethrough) */}
      {hasDiscount && (
        <span className={cn(originalPriceVariants({ size }))}>
          {formatPrice(price)}
        </span>
      )}

      {/* Discount Badge */}
      {hasDiscount && showDiscount && (
        <Badge
          variant={discountVariant}
          className={cn(discountBadgeVariants({ size }))}
        >
          {discountLabel ? `${discountLabel} ` : "-"}
          {discount}%
        </Badge>
      )}
    </div>
  )
}

// ============================================================================
// Compact Price Display (for small cards)
// ============================================================================

export interface CompactPriceDisplayProps {
  price: number
  salePrice?: number
  className?: string
}

export function CompactPriceDisplay({
  price,
  salePrice,
  className,
}: CompactPriceDisplayProps) {
  const hasDiscount = salePrice && salePrice < price

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {hasDiscount ? (
        <>
          <span className="font-bold text-sm text-primary">
            {formatPrice(salePrice)}
          </span>
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(price)}
          </span>
        </>
      ) : (
        <span className="font-bold text-sm">{formatPrice(price)}</span>
      )}
    </div>
  )
}

// ============================================================================
// Price Range Display (for products with multiple variants)
// ============================================================================

export interface PriceRangeDisplayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof priceDisplayVariants> {
  /** Minimum price in cents */
  minPrice: number
  /** Maximum price in cents */
  maxPrice: number
  /** Minimum sale price in cents (optional) */
  minSalePrice?: number
  /** Maximum sale price in cents (optional) */
  maxSalePrice?: number
  /** Show discount percentage badge */
  showDiscount?: boolean
  /** Discount badge variant */
  discountVariant?: "default" | "secondary" | "destructive" | "outline"
  /** Highlight sale price color */
  salePriceColor?: string
}

export function PriceRangeDisplay({
  minPrice,
  maxPrice,
  minSalePrice,
  maxSalePrice,
  showDiscount = true,
  discountVariant = "destructive",
  salePriceColor = "text-primary",
  size = "md",
  layout = "horizontal",
  className,
  ...props
}: PriceRangeDisplayProps) {
  const hasDiscount = minSalePrice && minSalePrice < minPrice
  const displayMinPrice = hasDiscount ? minSalePrice! : minPrice
  const displayMaxPrice = hasDiscount && maxSalePrice ? maxSalePrice : maxPrice

  // Calculate discount based on minimum price
  const discount = hasDiscount
    ? Math.round((1 - minSalePrice! / minPrice) * 100)
    : 0

  // Check if it's a price range or single price
  const isSinglePrice = minPrice === maxPrice

  return (
    <div
      className={cn(priceDisplayVariants({ size, layout }), className)}
      {...props}
    >
      {/* From Prefix */}
      {!isSinglePrice && (
        <span className={cn(fromLabelVariants({ size }))}>From</span>
      )}

      {/* Price Range */}
      {hasDiscount ? (
        <span className={cn(salePriceVariants({ size }), salePriceColor)}>
          {isSinglePrice
            ? formatPrice(displayMinPrice)
            : `${formatPrice(displayMinPrice)} - ${formatPrice(displayMaxPrice)}`}
        </span>
      ) : (
        <span className={cn(regularPriceVariants({ size }))}>
          {isSinglePrice
            ? formatPrice(displayMinPrice)
            : `${formatPrice(displayMinPrice)} - ${formatPrice(displayMaxPrice)}`}
        </span>
      )}

      {/* Original Price Range (Strikethrough) */}
      {hasDiscount && (
        <span className={cn(originalPriceVariants({ size }))}>
          {isSinglePrice
            ? formatPrice(minPrice)
            : `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`}
        </span>
      )}

      {/* Discount Badge */}
      {hasDiscount && showDiscount && (
        <Badge
          variant={discountVariant}
          className={cn(discountBadgeVariants({ size }))}
        >
          -{discount}%
        </Badge>
      )}
    </div>
  )
}

// ============================================================================
// Price with Label (for detailed displays)
// ============================================================================

export interface PriceWithLabelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof priceDisplayVariants> {
  price: number
  salePrice?: number
  label?: string
  showDiscount?: boolean
  discountVariant?: "default" | "secondary" | "destructive" | "outline"
}

export function PriceWithLabel({
  price,
  salePrice,
  label = "Price",
  showDiscount = true,
  discountVariant = "destructive",
  size = "md",
  className,
  ...props
}: PriceWithLabelProps) {
  const hasDiscount = salePrice && salePrice < price
  const discount = hasDiscount
    ? Math.round((1 - salePrice / price) * 100)
    : 0

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {/* Label */}
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      {/* Price Display */}
      <div className="flex items-center gap-2 flex-wrap">
        {hasDiscount ? (
          <>
            <span className={cn(salePriceVariants({ size }), "text-primary")}>
              {formatPrice(salePrice)}
            </span>
            <span className={cn(originalPriceVariants({ size }))}>
              {formatPrice(price)}
            </span>
            {showDiscount && (
              <Badge
                variant={discountVariant}
                className={cn(discountBadgeVariants({ size }))}
              >
                Save {discount}%
              </Badge>
            )}
          </>
        ) : (
          <span className={cn(regularPriceVariants({ size }))}>
            {formatPrice(price)}
          </span>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// Exports
// ============================================================================

export {
  priceDisplayVariants,
  salePriceVariants,
  regularPriceVariants,
  originalPriceVariants,
  discountBadgeVariants,
  fromLabelVariants,
}
