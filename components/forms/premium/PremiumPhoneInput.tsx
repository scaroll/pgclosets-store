"use client"

import * as React from "react"
import type { PremiumInputProps } from "./PremiumInput";
import { PremiumInput } from "./PremiumInput"
import { formatPhoneNumber } from "@/lib/forms/validation"

export interface PremiumPhoneInputProps
  extends Omit<PremiumInputProps, "type" | "leftIcon" | "onChange" | "value"> {
  /** Controlled value */
  value?: string
  /** Change handler */
  onChange?: (value: string) => void
  /** Country code (default: +1 for Canada/US) */
  countryCode?: string
  /** Format as user types */
  formatAsYouType?: boolean
}

/**
 * Premium phone input with international formatting.
 *
 * Features:
 * - Auto-formatting as user types
 * - Country code support
 * - North American format: (613) 555-0123
 * - Validation with visual feedback
 * - All PremiumInput features
 *
 * @example
 * ```tsx
 * <PremiumPhoneInput
 *   label="Phone Number"
 *   value={phone}
 *   onChange={setPhone}
 *   countryCode="+1"
 *   formatAsYouType
 *   error={errors.phone}
 * />
 * ```
 */
export const PremiumPhoneInput = React.forwardRef<HTMLInputElement, PremiumPhoneInputProps>(
  (
    {
      value = "",
      onChange,
      countryCode = "+1",
      formatAsYouType = true,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState(value)

    // Update display value when controlled value changes
    React.useEffect(() => {
      if (formatAsYouType && value) {
        setDisplayValue(formatPhoneNumber(value))
      } else {
        setDisplayValue(value)
      }
    }, [value, formatAsYouType])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value

      // Remove all non-digit characters for validation
      const digitsOnly = newValue.replace(/\D/g, "")

      // Only allow up to 10 digits (North American format)
      if (digitsOnly.length <= 10) {
        if (formatAsYouType) {
          // Format the display value
          const formatted = formatPhoneNumber(digitsOnly)
          setDisplayValue(formatted)
          onChange?.(digitsOnly) // Pass raw digits to parent
        } else {
          setDisplayValue(newValue)
          onChange?.(newValue)
        }
      }
    }

    // Phone icon
    const phoneIcon = leftIcon || (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    )

    return (
      <PremiumInput
        ref={ref}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        leftIcon={phoneIcon}
        placeholder="(613) 555-0123"
        inputMode="tel"
        autoComplete="tel"
        {...props}
      />
    )
  }
)

PremiumPhoneInput.displayName = "PremiumPhoneInput"
