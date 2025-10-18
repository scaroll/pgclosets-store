"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { motion } from "framer-motion"
import { Check, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PremiumCheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "checked"> {
  /** Checkbox label */
  label?: string
  /** Description text below label */
  description?: string
  /** Error message */
  error?: string
  /** Controlled checked state */
  checked?: boolean | "indeterminate"
  /** Checkbox size */
  size?: "sm" | "md" | "lg"
  /** Container className */
  containerClassName?: string
}

const sizeClasses = {
  sm: {
    checkbox: "h-4 w-4",
    icon: "w-3 h-3",
    label: "text-sm",
    description: "text-xs",
  },
  md: {
    checkbox: "h-5 w-5",
    icon: "w-4 h-4",
    label: "text-base",
    description: "text-sm",
  },
  lg: {
    checkbox: "h-6 w-6",
    icon: "w-5 h-5",
    label: "text-lg",
    description: "text-base",
  },
}

/**
 * Premium checkbox component with smooth animations and partial states.
 *
 * Features:
 * - Smooth check/uncheck animation
 * - Indeterminate state support
 * - Label and description
 * - Error state with message
 * - Multiple sizes
 * - WCAG 2.1 AAA compliant
 * - Touch-friendly (44x44px minimum)
 *
 * @example
 * ```tsx
 * <PremiumCheckbox
 *   label="Accept Terms & Conditions"
 *   description="By checking this box, you agree to our terms"
 *   checked={acceptTerms}
 *   onCheckedChange={setAcceptTerms}
 *   error={errors.acceptTerms}
 * />
 * ```
 */
export const PremiumCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  PremiumCheckboxProps
>(
  (
    {
      label,
      description,
      error,
      checked,
      size = "md",
      disabled,
      containerClassName,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || React.useId()
    const descriptionId = `${checkboxId}-description`
    const errorId = `${checkboxId}-error`

    const hasError = !!error
    const isIndeterminate = checked === "indeterminate"

    return (
      <div className={cn("relative", containerClassName)}>
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <CheckboxPrimitive.Root
            ref={ref}
            id={checkboxId}
            checked={checked === "indeterminate" ? "indeterminate" : checked}
            disabled={disabled}
            aria-describedby={cn(
              description && descriptionId,
              error && errorId
            )}
            aria-invalid={hasError}
            className={cn(
              // Base styles
              "shrink-0 rounded border-2 transition-all duration-200 ease-out",
              "focus-visible:outline-none focus-visible:ring-4",
              "disabled:cursor-not-allowed disabled:opacity-50",
              sizeClasses[size].checkbox,

              // Ensure minimum touch target size (44x44px)
              "relative",
              "before:absolute before:inset-0 before:-m-2 before:min-w-[44px] before:min-h-[44px]",

              // Default state
              "border-stone-300 dark:border-stone-600 bg-white dark:bg-charcoal-800",

              // Hover state
              !disabled && "hover:border-stone-400 dark:hover:border-stone-500",

              // Focus state
              "focus-visible:ring-copper-100 dark:focus-visible:ring-copper-900/30",
              "focus-visible:border-copper-500 dark:focus-visible:border-copper-400",

              // Checked state
              "data-[state=checked]:bg-copper-500 dark:data-[state=checked]:bg-copper-600",
              "data-[state=checked]:border-copper-500 dark:data-[state=checked]:border-copper-600",
              "data-[state=checked]:text-white",

              // Indeterminate state
              "data-[state=indeterminate]:bg-copper-500 dark:data-[state=indeterminate]:bg-copper-600",
              "data-[state=indeterminate]:border-copper-500 dark:data-[state=indeterminate]:border-copper-600",
              "data-[state=indeterminate]:text-white",

              // Error state
              hasError && [
                "border-error-500 dark:border-error-400",
                "focus-visible:ring-error-100 dark:focus-visible:ring-error-900/30",
              ],

              className
            )}
            {...props}
          >
            <CheckboxPrimitive.Indicator className="flex items-center justify-center">
              {isIndeterminate ? (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <Minus className={sizeClasses[size].icon} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0, opacity: 0, rotate: -45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 45 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <Check className={sizeClasses[size].icon} strokeWidth={3} />
                </motion.div>
              )}
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>

          {/* Label and Description */}
          {(label || description) && (
            <div className="flex-1 space-y-1">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    "font-medium leading-none cursor-pointer select-none",
                    "text-charcoal-900 dark:text-cream-50",
                    disabled && "opacity-50 cursor-not-allowed",
                    sizeClasses[size].label
                  )}
                >
                  {label}
                </label>
              )}

              {description && (
                <p
                  id={descriptionId}
                  className={cn(
                    "leading-snug text-stone-600 dark:text-stone-400",
                    disabled && "opacity-50",
                    sizeClasses[size].description
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-2 text-sm text-error-600 dark:text-error-400"
            role="alert"
            aria-live="polite"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

PremiumCheckbox.displayName = "PremiumCheckbox"
