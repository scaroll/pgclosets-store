'use client'

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MobileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helpText?: string;
  mobileKeyboard?: "text" | "email" | "tel" | "numeric" | "decimal" | "search" | "url";
  variant?: "default" | "search" | "floating";
}

export const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({
    className,
    label,
    error,
    helpText,
    mobileKeyboard = "text",
    variant = "default",
    type = "text",
    id,
    placeholder,
    ...props
  }, ref) => {
    const inputId = id || `mobile-input-${Math.random().toString(36).substr(2, 9)}`;

    // Map mobile keyboard types to input types and inputMode
    const getInputProps = () => {
      switch (mobileKeyboard) {
        case "email":
          return { type: "email", inputMode: "email" as const };
        case "tel":
          return { type: "tel", inputMode: "tel" as const };
        case "numeric":
          return { type: "text", inputMode: "numeric" as const };
        case "decimal":
          return { type: "text", inputMode: "decimal" as const };
        case "search":
          return { type: "search", inputMode: "search" as const };
        case "url":
          return { type: "url", inputMode: "url" as const };
        default:
          return { type, inputMode: "text" as const };
      }
    };

    const inputProps = getInputProps();

    const baseInputClasses = cn(
      // Base styles
      "w-full rounded-lg border border-gray-300 bg-white px-4 transition-all duration-200",
      "text-gray-900 placeholder-gray-500",
      "focus:outline-none focus:ring-2 focus:ring-pg-sky focus:border-pg-sky",

      // Mobile-optimized sizing
      "h-12 text-base", // 48px height, 16px font prevents zoom on iOS

      // Touch-friendly interactions
      "active:border-pg-navy",

      // Error state
      error && "border-red-500 focus:ring-red-500 focus:border-red-500",

      // Variant styles
      variant === "search" && "rounded-full pl-12 pr-4",
      variant === "floating" && "pt-6 pb-2 h-14",

      className
    );

    const containerClasses = cn(
      "relative w-full",
      variant === "floating" && "group"
    );

    const labelClasses = cn(
      "block text-sm font-medium text-gray-700 mb-2",
      variant === "floating" && cn(
        "absolute left-4 transition-all duration-200 pointer-events-none",
        "group-focus-within:top-2 group-focus-within:text-xs group-focus-within:text-pg-sky",
        "top-4 text-base text-gray-500"
      )
    );

    return (
      <div className={containerClasses}>
        {/* Search icon for search variant */}
        {variant === "search" && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}

        {/* Label */}
        {label && variant !== "floating" && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          className={baseInputClasses}
          placeholder={variant === "floating" ? " " : placeholder}
          {...inputProps}
          {...props}
        />

        {/* Floating label */}
        {label && variant === "floating" && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-2 flex items-center text-sm text-red-600">
            <svg
              className="w-4 h-4 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Help text */}
        {helpText && !error && (
          <div className="mt-2 text-sm text-gray-600">
            {helpText}
          </div>
        )}
      </div>
    );
  }
);

MobileInput.displayName = "MobileInput";

export default MobileInput;