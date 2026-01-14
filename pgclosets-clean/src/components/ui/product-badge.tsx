"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProductBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "category" | "sale" | "new" | "featured" | "out-of-stock" | "bestseller";
  size?: "sm" | "default" | "lg";
  children: React.ReactNode;
}

// Badge configuration for different product states
const badgeConfig = {
  category: {
    base: "bg-slate-100 text-slate-700 border-slate-200",
    hover: "hover:bg-slate-200 hover:border-slate-300"
  },
  sale: {
    base: "bg-red-50 text-red-700 border-red-200",
    hover: "hover:bg-red-100 hover:border-red-300"
  },
  new: {
    base: "bg-emerald-50 text-emerald-700 border-emerald-200",
    hover: "hover:bg-emerald-100 hover:border-emerald-300"
  },
  featured: {
    base: "bg-pg-navy text-white border-pg-navy",
    hover: "hover:bg-opacity-90"
  },
  "out-of-stock": {
    base: "bg-slate-100 text-slate-500 border-slate-200",
    hover: ""
  },
  bestseller: {
    base: "bg-amber-50 text-amber-700 border-amber-200",
    hover: "hover:bg-amber-100 hover:border-amber-300"
  }
} as const;

function ProductBadge({
  className,
  variant = "category",
  size = "default",
  children,
  ...props
}: ProductBadgeProps) {
  const config = badgeConfig[variant];

  return (
    <div
      className={cn(
        // Base styles matching design system
        "inline-flex items-center justify-center border font-light transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2",

        // Size variants
        size === "sm" && "px-2 py-0.5 text-xs rounded-full",
        size === "default" && "px-3 py-1 text-xs rounded-full tracking-wide",
        size === "lg" && "px-4 py-1.5 text-sm rounded-full tracking-wide",

        // Variant-specific colors
        config.base,
        config.hover,

        // Disabled state for out-of-stock
        variant === "out-of-stock" && "cursor-default",
        variant !== "out-of-stock" && "cursor-pointer",

        className
      )}
      {...props}
    >
      {/* Icon based on variant */}
      {variant === "sale" && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
        </svg>
      )}

      {variant === "new" && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      )}

      {variant === "featured" && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}

      {variant === "bestseller" && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}

      {variant === "out-of-stock" && (
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
        </svg>
      )}

      <span className="uppercase tracking-wider">
        {children}
      </span>
    </div>
  );
}

export { ProductBadge };