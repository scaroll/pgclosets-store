"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface PriceDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  price?: number;
  compareAtPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  currency?: "CAD" | "USD";
  locale?: "en-CA" | "en-US";
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "compact" | "detailed" | "card";
  showCurrency?: boolean;
  showSavings?: boolean;
  isOnSale?: boolean;
}

// Price formatting utility
const formatPrice = (
  price: number,
  currency: "CAD" | "USD" = "CAD",
  locale: "en-CA" | "en-US" = "en-CA",
  showCurrency: boolean = true
) => {
  if (showCurrency) {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  } else {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }
};

function PriceDisplay({
  className,
  price,
  compareAtPrice,
  minPrice,
  maxPrice,
  currency = "CAD",
  locale = "en-CA",
  size = "default",
  variant = "default",
  showCurrency = true,
  showSavings = true,
  isOnSale,
  ...props
}: PriceDisplayProps) {
  // Determine if showing a range or single price
  const isRange = minPrice !== undefined && maxPrice !== undefined && minPrice !== maxPrice;
  const hasComparePrice = compareAtPrice && compareAtPrice > 0;
  const effectivePrice = price || minPrice || 0;
  const effectiveComparePrice = compareAtPrice || 0;
  const calculatedIsOnSale = isOnSale || (hasComparePrice && effectivePrice < effectiveComparePrice);

  // Calculate savings
  const savings = hasComparePrice ? effectiveComparePrice - effectivePrice : 0;
  const savingsPercentage = hasComparePrice ? Math.round(((savings) / effectiveComparePrice) * 100) : 0;

  // Size variants
  const sizeClasses = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg",
    xl: "text-xl lg:text-2xl"
  };

  // Variant layouts
  const variantLayouts = {
    default: "flex flex-col",
    compact: "flex items-center gap-2",
    detailed: "flex flex-col space-y-1",
    card: "flex flex-col space-y-2"
  };

  // No price available
  if (!effectivePrice && !isRange) {
    return (
      <div className={cn("text-slate-600 font-light", sizeClasses[size], className)} {...props}>
        <span className="tracking-wide">Contact for Price</span>
      </div>
    );
  }

  return (
    <div className={cn(variantLayouts[variant], className)} {...props}>
      {/* Main price display */}
      <div className="flex items-center gap-2">
        {/* Current/Sale Price */}
        <div className={cn(
          "font-medium text-slate-900",
          sizeClasses[size],
          calculatedIsOnSale && "text-red-600"
        )}>
          {isRange
            ? `${formatPrice(minPrice!, currency, locale, showCurrency)} - ${formatPrice(maxPrice!, currency, locale, showCurrency)}`
            : formatPrice(effectivePrice, currency, locale, showCurrency)
          }
        </div>

        {/* Compare at price (crossed out) */}
        {hasComparePrice && !isRange && (
          <div className={cn(
            "text-slate-500 line-through font-light",
            size === "sm" && "text-xs",
            size === "default" && "text-sm",
            size === "lg" && "text-base",
            size === "xl" && "text-lg"
          )}>
            {formatPrice(effectiveComparePrice, currency, locale, showCurrency)}
          </div>
        )}

        {/* Sale badge */}
        {calculatedIsOnSale && variant === "card" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Sale
          </span>
        )}
      </div>

      {/* Savings information */}
      {showSavings && hasComparePrice && savings > 0 && !isRange && (
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-medium text-emerald-600",
            size === "sm" && "text-xs",
            size === "default" && "text-sm",
            size === "lg" && "text-base",
            size === "xl" && "text-lg"
          )}>
            Save {formatPrice(savings, currency, locale, showCurrency)}
          </span>

          {variant === "detailed" && savingsPercentage > 0 && (
            <span className={cn(
              "px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium",
              size === "sm" && "text-xs",
              size === "default" && "text-xs",
              size === "lg" && "text-sm",
              size === "xl" && "text-sm"
            )}>
              {savingsPercentage}% off
            </span>
          )}
        </div>
      )}

      {/* Additional pricing info for variants */}
      {variant === "detailed" && isRange && (
        <div className={cn(
          "text-slate-500 font-light",
          size === "sm" && "text-xs",
          size === "default" && "text-sm",
          size === "lg" && "text-base",
          size === "xl" && "text-lg"
        )}>
          Multiple sizes available
        </div>
      )}

      {/* HST notice for Canadian pricing */}
      {currency === "CAD" && locale === "en-CA" && variant === "detailed" && (
        <div className={cn(
          "text-slate-400 font-light",
          size === "sm" && "text-xs",
          size === "default" && "text-xs",
          size === "lg" && "text-sm",
          size === "xl" && "text-sm"
        )}>
          Prices include HST
        </div>
      )}
    </div>
  );
}

export { PriceDisplay, formatPrice };