import { z } from "zod"

/**
 * Form Validation System
 *
 * Comprehensive validation utilities with:
 * - Custom validation rules for Canadian formats
 * - Async validation support
 * - Helpful error messages with recovery suggestions
 * - Multi-field validation
 */

// ============================================================================
// CUSTOM ERROR MESSAGES
// ============================================================================

export const errorMessages = {
  required: (field: string) => `${field} is required`,
  email: {
    invalid: "Please enter a valid email address (e.g., you@example.com)",
    required: "Email address is required",
  },
  phone: {
    invalid: "Please enter a valid phone number (e.g., 613-555-0123 or (613) 555-0123)",
    required: "Phone number is required",
  },
  postalCode: {
    invalid: "Please enter a valid Canadian postal code (e.g., K1A 0B1)",
    required: "Postal code is required",
  },
  password: {
    tooShort: "Password must be at least 8 characters",
    noUppercase: "Password must include at least one uppercase letter",
    noLowercase: "Password must include at least one lowercase letter",
    noNumber: "Password must include at least one number",
    noSpecial: "Password must include at least one special character (!@#$%^&*)",
    required: "Password is required",
  },
  passwordConfirm: {
    mismatch: "Passwords don't match. Please make sure both passwords are identical.",
    required: "Please confirm your password",
  },
  name: {
    tooShort: "Name must be at least 2 characters",
    required: "Name is required",
  },
  url: {
    invalid: "Please enter a valid URL (e.g., https://example.com)",
  },
  date: {
    invalid: "Please enter a valid date",
    future: "Date must be in the future",
    past: "Date must be in the past",
  },
  creditCard: {
    invalid: "Please enter a valid credit card number",
    expiredMonth: "Expiry month must be between 01 and 12",
    expiredYear: "Card has expired",
    cvvInvalid: "CVV must be 3 or 4 digits",
  },
}

// ============================================================================
// VALIDATION PATTERNS
// ============================================================================

// Canadian postal code: K1A 0B1 or K1A0B1
export const CANADIAN_POSTAL_CODE_REGEX = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i

// Phone number patterns (North American)
export const PHONE_PATTERNS = {
  basic: /^\d{10}$/,
  withDashes: /^\d{3}-\d{3}-\d{4}$/,
  withParens: /^\(\d{3}\)\s?\d{3}-\d{4}$/,
  withCountryCode: /^\+1\s?\d{3}[-\s]?\d{3}[-\s]?\d{4}$/,
}

// Credit card patterns
export const CREDIT_CARD_PATTERNS = {
  visa: /^4\d{12}(?:\d{3})?$/,
  mastercard: /^5[1-5]\d{14}$/,
  amex: /^3[47]\d{13}$/,
  discover: /^6(?:011|5\d{2})\d{12}$/,
}

// ============================================================================
// ZOD VALIDATORS
// ============================================================================

/**
 * Email validation with helpful error messages
 */
export const emailValidator = z
  .string()
  .min(1, errorMessages.email.required)
  .email(errorMessages.email.invalid)
  .toLowerCase()
  .trim()

/**
 * Canadian phone number validation
 * Accepts: (613) 555-0123, 613-555-0123, 6135550123, +1 613-555-0123
 */
export const phoneValidator = z
  .string()
  .min(1, errorMessages.phone.required)
  .refine(
    (value) => {
      const cleaned = value.replace(/[\s\-\(\)\+]/g, "")
      return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith("1"))
    },
    errorMessages.phone.invalid
  )
  .transform((value) => {
    // Normalize to (XXX) XXX-XXXX format
    const cleaned = value.replace(/[\s\-\(\)\+]/g, "")
    const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return value
  })

/**
 * Optional phone validator (allows empty string)
 */
export const optionalPhoneValidator = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value || value.trim() === "") return true
      const cleaned = value.replace(/[\s\-\(\)\+]/g, "")
      return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith("1"))
    },
    errorMessages.phone.invalid
  )

/**
 * Canadian postal code validation
 * Accepts: K1A 0B1, K1A0B1 (case insensitive)
 */
export const postalCodeValidator = z
  .string()
  .min(1, errorMessages.postalCode.required)
  .regex(CANADIAN_POSTAL_CODE_REGEX, errorMessages.postalCode.invalid)
  .transform((value) => {
    // Normalize to "K1A 0B1" format
    const cleaned = value.replace(/\s/g, "").toUpperCase()
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
  })

/**
 * Strong password validation
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const passwordValidator = z
  .string()
  .min(1, errorMessages.password.required)
  .min(8, errorMessages.password.tooShort)
  .refine((value) => /[A-Z]/.test(value), errorMessages.password.noUppercase)
  .refine((value) => /[a-z]/.test(value), errorMessages.password.noLowercase)
  .refine((value) => /[0-9]/.test(value), errorMessages.password.noNumber)
  .refine((value) => /[!@#$%^&*]/.test(value), errorMessages.password.noSpecial)

/**
 * Name validation (2+ characters, letters and spaces)
 */
export const nameValidator = z
  .string()
  .min(1, errorMessages.name.required)
  .min(2, errorMessages.name.tooShort)
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes")
  .trim()

/**
 * URL validation
 */
export const urlValidator = z
  .string()
  .url(errorMessages.url.invalid)
  .refine(
    (value) => value.startsWith("http://") || value.startsWith("https://"),
    "URL must start with http:// or https://"
  )

/**
 * Credit card number validation
 */
export const creditCardValidator = z
  .string()
  .min(1, "Credit card number is required")
  .refine(
    (value) => {
      const cleaned = value.replace(/\s/g, "")
      return Object.values(CREDIT_CARD_PATTERNS).some((pattern) =>
        pattern.test(cleaned)
      )
    },
    errorMessages.creditCard.invalid
  )
  .refine(
    (value) => {
      // Luhn algorithm check
      const cleaned = value.replace(/\s/g, "")
      let sum = 0
      let isEven = false

      for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10)

        if (isEven) {
          digit *= 2
          if (digit > 9) {
            digit -= 9
          }
        }

        sum += digit
        isEven = !isEven
      }

      return sum % 10 === 0
    },
    errorMessages.creditCard.invalid
  )

/**
 * Credit card expiry validation (MM/YY format)
 */
export const creditCardExpiryValidator = z
  .string()
  .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be in MM/YY format")
  .refine(
    (value) => {
      const [month, year] = value.split("/")
      const monthNum = parseInt(month, 10)
      return monthNum >= 1 && monthNum <= 12
    },
    errorMessages.creditCard.expiredMonth
  )
  .refine(
    (value) => {
      const [month, year] = value.split("/")
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100
      const currentMonth = currentDate.getMonth() + 1
      const yearNum = parseInt(year, 10)
      const monthNum = parseInt(month, 10)

      if (yearNum < currentYear) return false
      if (yearNum === currentYear && monthNum < currentMonth) return false

      return true
    },
    errorMessages.creditCard.expiredYear
  )

/**
 * CVV validation (3 or 4 digits)
 */
export const cvvValidator = z
  .string()
  .regex(/^\d{3,4}$/, errorMessages.creditCard.cvvInvalid)

// ============================================================================
// COMMON FORM SCHEMAS
// ============================================================================

/**
 * Contact form schema
 */
export const contactFormSchema = z.object({
  name: nameValidator,
  email: emailValidator,
  phone: optionalPhoneValidator,
  message: z.string().min(10, "Message must be at least 10 characters").max(1000),
})

/**
 * Quote request form schema
 */
export const quoteRequestSchema = z.object({
  name: nameValidator,
  email: emailValidator,
  phone: optionalPhoneValidator,
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  projectType: z.string().optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().max(1000).optional(),
})

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailValidator,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

/**
 * Registration form schema with password confirmation
 */
export const registrationSchema = z
  .object({
    name: nameValidator,
    email: emailValidator,
    password: passwordValidator,
    passwordConfirm: z.string().min(1, errorMessages.passwordConfirm.required),
    acceptTerms: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: errorMessages.passwordConfirm.mismatch,
    path: ["passwordConfirm"],
  })

/**
 * Address form schema
 */
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: postalCodeValidator,
  country: z.string().default("Canada"),
})

/**
 * Credit card payment schema
 */
export const paymentSchema = z.object({
  cardNumber: creditCardValidator,
  cardName: nameValidator,
  expiry: creditCardExpiryValidator,
  cvv: cvvValidator,
  billingAddress: addressSchema,
})

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (value: string): string => {
  const cleaned = value.replace(/\D/g, "")
  const match = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return value
}

/**
 * Format postal code for display
 */
export const formatPostalCode = (value: string): string => {
  const cleaned = value.replace(/\s/g, "").toUpperCase()
  if (cleaned.length >= 3) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`
  }
  return cleaned
}

/**
 * Format credit card number for display (with spaces every 4 digits)
 */
export const formatCreditCard = (value: string): string => {
  const cleaned = value.replace(/\s/g, "")
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(" ") : value
}

/**
 * Detect credit card type
 */
export const detectCardType = (value: string): string | null => {
  const cleaned = value.replace(/\s/g, "")

  if (CREDIT_CARD_PATTERNS.visa.test(cleaned)) return "visa"
  if (CREDIT_CARD_PATTERNS.mastercard.test(cleaned)) return "mastercard"
  if (CREDIT_CARD_PATTERNS.amex.test(cleaned)) return "amex"
  if (CREDIT_CARD_PATTERNS.discover.test(cleaned)) return "discover"

  return null
}

/**
 * Debounce function for async validation
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Async email availability check (example)
 */
export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  // This would typically be an API call
  // For demo purposes, we'll simulate it
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Example: these emails are "taken"
  const takenEmails = ["test@example.com", "admin@pgclosets.com"]
  return !takenEmails.includes(email.toLowerCase())
}

/**
 * Get validation strength (for passwords)
 */
export const getPasswordStrength = (
  password: string
): { strength: number; label: string; color: string } => {
  let strength = 0

  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++
  if (/[!@#$%^&*]/.test(password)) strength++

  const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
  const colors = ["#dc2626", "#ea580c", "#eab308", "#22c55e", "#16a34a"]

  return {
    strength,
    label: labels[strength] || "Very Weak",
    color: colors[strength] || "#dc2626",
  }
}

export type {
  contactFormSchema as ContactFormData,
  quoteRequestSchema as QuoteRequestData,
  loginSchema as LoginData,
  registrationSchema as RegistrationData,
  addressSchema as AddressData,
  paymentSchema as PaymentData,
}
