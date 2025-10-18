"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react"

export interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const isFloating = isFocused || hasValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    const inputType = showPasswordToggle
      ? showPassword
        ? "text"
        : "password"
      : type

    return (
      <div className="relative w-full">
        {/* Input Container */}
        <div
          className={cn(
            "relative flex items-center",
            "bg-white border-b-2 transition-all duration-300",
            error
              ? "border-red-500"
              : success
                ? "border-green-500"
                : isFocused
                  ? "border-slate-900"
                  : "border-slate-200",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50"
          )}
        >
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={inputRef}
            type={inputType}
            disabled={disabled}
            className={cn(
              "w-full bg-transparent px-0 pt-6 pb-2 text-base font-light text-slate-900",
              "outline-none transition-all duration-300",
              "placeholder:text-transparent",
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle || error || success) && "pr-10",
              disabled && "cursor-not-allowed",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            {...props}
          />

          {/* Floating Label */}
          <motion.label
            htmlFor={props.id}
            className={cn(
              "absolute left-0 pointer-events-none",
              "text-slate-600 font-light transition-all duration-300 origin-left",
              leftIcon && "left-10",
              disabled && "cursor-not-allowed"
            )}
            animate={{
              y: isFloating ? -24 : -12,
              scale: isFloating ? 0.85 : 1,
              color: error
                ? "#ef4444"
                : success
                  ? "#22c55e"
                  : isFocused
                    ? "#0f172a"
                    : "#64748b",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {label}
          </motion.label>

          {/* Right Icons */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {/* Password Toggle */}
            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
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
            {rightIcon && !error && !success && (
              <div className="text-slate-400">{rightIcon}</div>
            )}

            {/* Error Icon */}
            {error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
            )}

            {/* Success Icon */}
            {success && !error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Helper/Error/Success Text */}
        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mt-1.5 text-sm font-light",
                error
                  ? "text-red-500"
                  : success
                    ? "text-green-500"
                    : "text-slate-500"
              )}
            >
              {error || success || helperText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Focus Indicator Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-slate-900"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    )
  }
)

FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
