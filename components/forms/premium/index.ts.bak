/**
 * Premium Form Components - PG Closets
 *
 * Comprehensive form component library with exceptional UX and accessibility.
 *
 * Features:
 * - Floating labels with smooth animations
 * - Inline validation with visual feedback
 * - Auto-save to localStorage
 * - Multi-step form support
 * - WCAG 2.1 AAA compliant
 * - Touch-friendly (44x44px minimum)
 *
 * @example
 * ```tsx
 * import { PremiumInput, PremiumTextarea, usePremiumForm } from "@/components/forms/premium"
 *
 * const form = usePremiumForm({
 *   resolver: zodResolver(schema),
 *   autoSave: true,
 * })
 * ```
 */

export { PremiumInput } from "./PremiumInput"
export type { PremiumInputProps } from "./PremiumInput"

export { PremiumTextarea } from "./PremiumTextarea"
export type { PremiumTextareaProps } from "./PremiumTextarea"

export { PremiumCheckbox } from "./PremiumCheckbox"
export type { PremiumCheckboxProps } from "./PremiumCheckbox"

export { PremiumPhoneInput } from "./PremiumPhoneInput"
export type { PremiumPhoneInputProps } from "./PremiumPhoneInput"

// Re-export validation utilities
export {
  emailValidator,
  phoneValidator,
  optionalPhoneValidator,
  postalCodeValidator,
  passwordValidator,
  nameValidator,
  urlValidator,
  creditCardValidator,
  cvvValidator,
  creditCardExpiryValidator,
  contactFormSchema,
  quoteRequestSchema,
  loginSchema,
  registrationSchema,
  addressSchema,
  paymentSchema,
  formatPhoneNumber,
  formatPostalCode,
  formatCreditCard,
  detectCardType,
  debounce,
  checkEmailAvailability,
  getPasswordStrength,
} from "@/lib/forms/validation"

// Re-export form hooks
export { usePremiumForm, useMultiStepValidation } from "@/lib/forms/usePremiumForm"
export type {
  UsePremiumFormOptions,
  UsePremiumFormReturn,
} from "@/lib/forms/usePremiumForm"
