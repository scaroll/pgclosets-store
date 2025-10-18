"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export interface AppleCheckboxProps {
  label?: string
  description?: string
  error?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  required?: boolean
  className?: string
  name?: string
  id?: string
}

export const AppleCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  AppleCheckboxProps
>(
  (
    {
      label,
      description,
      error,
      checked,
      onCheckedChange,
      disabled,
      required,
      className,
      name,
      id,
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(checked || false)

    const handleCheckedChange = (value: boolean) => {
      setIsChecked(value)
      onCheckedChange?.(value)
    }

    return (
      <div className={cn("flex items-start gap-3", className)}>
        {/* Checkbox */}
        <CheckboxPrimitive.Root
          ref={ref}
          id={id}
          name={name}
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
          disabled={disabled}
          required={required}
          className={cn(
            "peer relative flex h-6 w-6 shrink-0 items-center justify-center",
            "border-2 transition-all duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-red-500"
              : isChecked
                ? "border-slate-900 bg-slate-900"
                : "border-slate-300 bg-white hover:border-slate-900",
            "rounded-md"
          )}
        >
          <CheckboxPrimitive.Indicator asChild>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="h-4 w-4 text-white" strokeWidth={3} />
            </motion.div>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        {/* Label & Description */}
        {(label || description) && (
          <div className="flex-1 space-y-1">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "text-base font-light leading-none text-slate-900",
                  "cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                )}
              >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {description && (
              <p className="text-sm font-light text-slate-500">{description}</p>
            )}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-light text-red-500"
              >
                {error}
              </motion.p>
            )}
          </div>
        )}
      </div>
    )
  }
)

AppleCheckbox.displayName = "AppleCheckbox"

// Radio Group Component
export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface AppleRadioGroupProps {
  label?: string
  description?: string
  options: RadioOption[]
  value?: string
  onValueChange?: (value: string) => void
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  name?: string
  orientation?: "horizontal" | "vertical"
}

export const AppleRadioGroup: React.FC<AppleRadioGroupProps> = ({
  label,
  description,
  options,
  value,
  onValueChange,
  error,
  required,
  disabled,
  className,
  name,
  orientation = "vertical",
}) => {
  const [selectedValue, setSelectedValue] = React.useState(value || "")

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label & Description */}
      {(label || description) && (
        <div className="space-y-1">
          {label && (
            <label className="text-base font-light text-slate-900">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          {description && (
            <p className="text-sm font-light text-slate-500">{description}</p>
          )}
        </div>
      )}

      {/* Radio Options */}
      <div
        className={cn(
          "flex gap-4",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
        )}
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value
          const isDisabled = disabled || option.disabled

          return (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 cursor-pointer",
                isDisabled && "cursor-not-allowed opacity-50"
              )}
              onClick={() =>
                !isDisabled && handleValueChange(option.value)
              }
            >
              {/* Hidden Radio Input */}
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => handleValueChange(option.value)}
                disabled={isDisabled}
                className="sr-only"
              />

              {/* Custom Radio Button */}
              <div
                className={cn(
                  "relative flex h-6 w-6 shrink-0 items-center justify-center",
                  "border-2 rounded-full transition-all duration-200",
                  error
                    ? "border-red-500"
                    : isSelected
                      ? "border-slate-900"
                      : "border-slate-300 hover:border-slate-900"
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15 }}
                    className="h-3 w-3 rounded-full bg-slate-900"
                  />
                )}
              </div>

              {/* Label & Description */}
              <div className="flex-1 space-y-1">
                <label
                  className={cn(
                    "text-base font-light leading-none text-slate-900",
                    !isDisabled && "cursor-pointer"
                  )}
                >
                  {option.label}
                </label>
                {option.description && (
                  <p className="text-sm font-light text-slate-500">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-light text-red-500"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

AppleRadioGroup.displayName = "AppleRadioGroup"

// Toggle/Switch Component
export interface AppleToggleProps {
  label?: string
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
  name?: string
  id?: string
  size?: "sm" | "md" | "lg"
}

export const AppleToggle = React.forwardRef<HTMLButtonElement, AppleToggleProps>(
  (
    {
      label,
      description,
      checked,
      onCheckedChange,
      disabled,
      className,
      name,
      id,
      size = "md",
    },
    ref
  ) => {
    const [isChecked, setIsChecked] = React.useState(checked || false)

    const handleToggle = () => {
      if (disabled) return
      const newValue = !isChecked
      setIsChecked(newValue)
      onCheckedChange?.(newValue)
    }

    const sizes = {
      sm: { width: "w-9", height: "h-5", thumb: "h-4 w-4", translate: "translate-x-4" },
      md: { width: "w-11", height: "h-6", thumb: "h-5 w-5", translate: "translate-x-5" },
      lg: { width: "w-14", height: "h-7", thumb: "h-6 w-6", translate: "translate-x-7" },
    }

    const sizeClasses = sizes[size]

    return (
      <div className={cn("flex items-start gap-3", className)}>
        {/* Hidden Input */}
        <input
          type="checkbox"
          name={name}
          id={id}
          checked={isChecked}
          onChange={handleToggle}
          disabled={disabled}
          className="sr-only"
        />

        {/* Toggle Switch */}
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={isChecked}
          onClick={handleToggle}
          disabled={disabled}
          className={cn(
            "relative inline-flex shrink-0 rounded-full transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            sizeClasses.width,
            sizeClasses.height,
            isChecked ? "bg-slate-900" : "bg-slate-300"
          )}
        >
          <motion.span
            className={cn(
              "pointer-events-none inline-block rounded-full bg-white shadow-lg",
              sizeClasses.thumb
            )}
            animate={{
              x: isChecked ? sizeClasses.translate.replace(/[^\d]/g, '') : 0,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>

        {/* Label & Description */}
        {(label || description) && (
          <div className="flex-1 space-y-1">
            {label && (
              <label
                htmlFor={id}
                className={cn(
                  "text-base font-light leading-none text-slate-900",
                  !disabled && "cursor-pointer"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm font-light text-slate-500">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

AppleToggle.displayName = "AppleToggle"
