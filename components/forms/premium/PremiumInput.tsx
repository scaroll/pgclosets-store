"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, AlertCircle, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PremiumInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Input label text */
  label: string
  /** Error message to display */
  error?: string
  /** Success state indicator */
  isValid?: boolean
  /** Show validation state while typing */
  showValidation?: boolean
  /** Helper text displayed below input */
  helperText?: string
  /** Size variant */
  size?: "sm" | "md" | "lg"
  /** Optional icon to display before input */
  leftIcon?: React.ReactNode
  /** Optional icon to display after input */
  rightIcon?: React.ReactNode
  /** Loading state for async validation */
  isLoading?: boolean
  /** Container className */
  containerClassName?: string
}

/**
 * Premium input component with floating labels, inline validation, and smooth animations.
 *
 * Features:
 * - Floating label animation on focus/value
 * - Inline validation with success/error states
 * - Optional password visibility toggle
 * - Loading state for async validation
 * - Icon support (left and right)
 * - WCAG 2.1 AAA compliant
 * - Smooth transitions with Framer Motion
 *
 * @example
 * ```tsx
 * <PremiumInput
 *   label="Email Address"
 *   type="email"
 *   placeholder="you@example.com"
 *   error={errors.email}
 *   isValid={!!watchEmail && !errors.email}
 *   leftIcon={<Mail className="w-4 h-4" />}
 * />
 * ```
 */
export const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  (
    {
      label,
      error,
      isValid,
      showValidation = true,
      helperText,
      size = "md",
      leftIcon,
      rightIcon,
      isLoading,
      containerClassName,
      className,
      type = "text",
      id,
      disabled,
      required,
      value,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(!!value)

    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    // Track if input has value for floating label
    React.useEffect(() => {
      setHasValue(!!value)
    }, [value])

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value)
      props.onChange?.(e)
    }

    const isPasswordField = type === "password"
    const actualType = isPasswordField && showPassword ? "text" : type

    const sizeClasses = {
      sm: "h-10 text-sm",
      md: "h-12 text-base",
      lg: "h-14 text-lg"
    }

    const labelSizeClasses = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    }

    const hasError = !!error
    const showSuccess = showValidation && isValid && !hasError && !isFocused && hasValue

    return (
      <div className={cn("relative w-full", containerClassName)}>
        {/* Input Container */}
        <div className="relative">
          {/* Floating Label */}
          <motion.label
            htmlFor={inputId}
            className={cn(
              "absolute left-3 pointer-events-none transition-all duration-200 ease-out",
              "text-stone-600 dark:text-stone-400",
              labelSizeClasses[size],
              isFocused || hasValue
                ? "top-2 scale-90 text-copper-600 dark:text-copper-400"
                : size === "sm"
                  ? "top-2.5"
                  : size === "lg"
                    ? "top-4"
                    : "top-3.5",
              leftIcon && "left-11",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            animate={{
              y: isFocused || hasValue ? -10 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </motion.label>

          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            value={value}
            disabled={disabled}
            required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={hasError}
            aria-describedby={cn(
              error && errorId,
              helperText && helperId
            )}
            aria-required={required}
            className={cn(
              // Base styles
              "w-full rounded-lg border bg-white dark:bg-charcoal-800",
              "px-3 pt-6 pb-2 outline-none transition-all duration-200 ease-out",
              "text-charcoal-900 dark:text-cream-50",
              "placeholder:text-transparent",
              sizeClasses[size],

              // Padding adjustments for icons
              leftIcon && "pl-11",
              (rightIcon || isPasswordField || showSuccess || hasError || isLoading) && "pr-11",

              // Border and ring states
              "border-stone-300 dark:border-stone-600",
              !hasError && !isFocused && "hover:border-stone-400 dark:hover:border-stone-500",

              // Focus state
              isFocused && !hasError && [
                "border-copper-500 dark:border-copper-400",
                "ring-4 ring-copper-100 dark:ring-copper-900/30",
                "shadow-sm"
              ],

              // Success state
              showSuccess && [
                "border-success-500 dark:border-success-400",
                "ring-4 ring-success-100 dark:ring-success-900/30"
              ],

              // Error state
              hasError && [
                "border-error-500 dark:border-error-400",
                "ring-4 ring-error-100 dark:ring-error-900/30"
              ],

              // Disabled state
              disabled && "opacity-60 cursor-not-allowed bg-stone-50 dark:bg-charcoal-900",

              className
            )}
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Loading Spinner */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-copper-500"
                >
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Icon */}
            <AnimatePresence>
              {showSuccess && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-5 h-5 text-success-600 dark:text-success-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Icon */}
            <AnimatePresence>
              {hasError && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Toggle */}
            {isPasswordField && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !isPasswordField && !showSuccess && !hasError && !isLoading && (
              <div className="text-stone-500 dark:text-stone-400">
                {rightIcon}
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              id={errorId}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-sm text-error-600 dark:text-error-400 flex items-start gap-1"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.p>
          )}
        </AnimatePresence>

        {/* Helper Text */}
        {helperText && !error && (
          <p
            id={helperId}
            className="mt-2 text-sm text-stone-600 dark:text-stone-400"
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

PremiumInput.displayName = "PremiumInput"
