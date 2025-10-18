"use client"

/**
 * Premium Contact Form - Complete Example
 *
 * Demonstrates all premium form features:
 * - Floating labels with animations
 * - Inline validation with visual feedback
 * - Auto-save to localStorage
 * - Loading states for async validation
 * - Success/error states
 * - WCAG 2.1 AAA accessibility
 *
 * @example
 * ```tsx
 * import { PremiumContactForm } from "@/components/forms/premium/PremiumContactForm.example"
 *
 * <PremiumContactForm />
 * ```
 */

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Mail, User, Loader2 } from "lucide-react"
import {
  PremiumInput,
  PremiumTextarea,
  PremiumPhoneInput,
  usePremiumForm,
  contactFormSchema,
  checkEmailAvailability,
  debounce,
} from "./index"
import { cn } from "@/lib/utils"
import type { z } from "zod"

type ContactFormData = z.infer<typeof contactFormSchema>

interface PremiumContactFormProps {
  /** Called on successful submission */
  onSuccess?: (data: ContactFormData) => void
  /** Initial form values */
  defaultValues?: Partial<ContactFormData>
  /** Enable auto-save to localStorage */
  enableAutoSave?: boolean
  /** Form ID for localStorage key */
  formId?: string
}

export function PremiumContactForm({
  onSuccess,
  defaultValues,
  enableAutoSave = true,
  formId = "premium-contact-form",
}: PremiumContactFormProps) {
  const [isCheckingEmail, setIsCheckingEmail] = React.useState(false)
  const [isEmailAvailable, setIsEmailAvailable] = React.useState<boolean | null>(null)

  const form = usePremiumForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      ...defaultValues,
    },
    mode: "onBlur", // Validate when user leaves field
    formId,
    autoSave: enableAutoSave,
    autoSaveInterval: 2000, // Save every 2 seconds
    trackAbandonment: true,
    onAbandon: (data) => {
      console.log("Form abandoned with data:", data)
      // You could send analytics event here
    },
  })

  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
    isSubmitting,
    isSubmitSuccessful,
    submitError,
  } = form

  // Watch all fields for validation states
  const watchName = watch("name")
  const watchEmail = watch("email")
  const watchPhone = watch("phone")
  const watchMessage = watch("message")

  // Debounced email availability check
  const checkEmail = React.useCallback(
    debounce(async (email: string) => {
      if (!email || errors.email) {
        setIsEmailAvailable(null)
        return
      }

      setIsCheckingEmail(true)
      try {
        const available = await checkEmailAvailability(email)
        setIsEmailAvailable(available)

        if (!available) {
          // This is just for demo - in real app, this might be okay
          // setError("email", {
          //   type: "manual",
          //   message: "This email is already registered. Try logging in instead."
          // })
        }
      } catch (error) {
        console.error("Failed to check email:", error)
      } finally {
        setIsCheckingEmail(false)
      }
    }, 500),
    [errors.email]
  )

  // Form submission handler
  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real app, make API call
      // const response = await fetch("/api/contact", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })
      //
      // if (!response.ok) {
      //   throw new Error("Failed to submit form")
      // }

      console.log("Form submitted:", data)

      // Call success callback
      onSuccess?.(data)

      // Clear form data from localStorage
      form.clearSavedData()
    } catch (error) {
      console.error("Submission error:", error)
      throw new Error("Failed to send message. Please try again.")
    }
  }

  // Success state
  if (isSubmitSuccessful) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center py-12 px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-success-100 dark:bg-success-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-10 h-10 text-success-600 dark:text-success-400" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-display font-semibold mb-3 text-charcoal-900 dark:text-cream-50"
        >
          Message Sent Successfully!
        </motion.h3>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-stone-600 dark:text-stone-400 mb-8"
        >
          Thank you for reaching out. Our team will get back to you within 24 hours.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-copper-500 hover:bg-copper-600 text-white rounded-lg font-medium transition-colors"
        >
          Send Another Message
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Form Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-display font-semibold mb-3 text-charcoal-900 dark:text-cream-50">
          Get in Touch
        </h2>
        <p className="text-lg text-stone-600 dark:text-stone-400">
          Have a question? We&apos;re here to help. Fill out the form below and we&apos;ll respond within 24 hours.
        </p>
      </div>

      {/* Auto-save indicator */}
      <AnimatePresence>
        {enableAutoSave && form.formState.isDirty && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-3 bg-copper-50 dark:bg-copper-900/20 border border-copper-200 dark:border-copper-800 rounded-lg text-sm text-copper-800 dark:text-copper-300"
          >
            💾 Your progress is being saved automatically
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <PremiumInput
          {...register("name")}
          label="Full Name"
          placeholder="John Smith"
          error={errors.name?.message}
          isValid={!!watchName && !errors.name}
          showValidation
          leftIcon={<User className="w-4 h-4" />}
          size="md"
          required
          onBlur={() => trigger("name")}
        />

        {/* Email Field with Async Validation */}
        <PremiumInput
          {...register("email")}
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          error={errors.email?.message}
          isValid={
            !!watchEmail &&
            !errors.email &&
            (isEmailAvailable === true || isEmailAvailable === null)
          }
          isLoading={isCheckingEmail}
          showValidation
          leftIcon={<Mail className="w-4 h-4" />}
          helperText="We'll never share your email with anyone"
          size="md"
          required
          onBlur={(e) => {
            trigger("email")
            checkEmail(e.target.value)
          }}
        />

        {/* Phone Field (Optional) */}
        <PremiumPhoneInput
          label="Phone Number"
          value={watchPhone}
          onChange={(value) => {
            setValue("phone", value, { shouldValidate: true, shouldDirty: true })
          }}
          error={errors.phone?.message}
          isValid={!!watchPhone && !errors.phone}
          formatAsYouType
          size="md"
          helperText="Optional - for faster response"
        />

        {/* Message Field */}
        <PremiumTextarea
          {...register("message")}
          label="Your Message"
          placeholder="Tell us about your project, question, or how we can help..."
          maxLength={1000}
          showCharCount
          autoExpand
          minRows={5}
          maxRows={12}
          error={errors.message?.message}
          isValid={!!watchMessage && !errors.message}
          showValidation
          size="md"
          required
          onBlur={() => trigger("message")}
        />

        {/* Submit Error */}
        <AnimatePresence>
          {submitError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg"
            >
              <p className="text-error-700 dark:text-error-300 font-medium">
                {submitError}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "w-full h-14 rounded-lg font-medium text-white text-lg",
            "transition-all duration-200 ease-out",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-copper-100 dark:focus-visible:ring-copper-900/30",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            isSubmitting
              ? "bg-copper-400 dark:bg-copper-700"
              : "bg-copper-500 hover:bg-copper-600 dark:bg-copper-600 dark:hover:bg-copper-700 shadow-sm hover:shadow"
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending Message...
            </span>
          ) : (
            "Send Message"
          )}
        </button>

        {/* Trust Indicators */}
        <div className="pt-4 space-y-2 text-center text-sm text-stone-600 dark:text-stone-400">
          <p className="font-medium">✓ No obligation • 24-hour response time</p>
          <p>
            By submitting this form, you agree to be contacted by PG Closets regarding your inquiry.
          </p>
        </div>
      </form>
    </div>
  )
}

/**
 * Form skeleton for loading state
 */
export function PremiumContactFormSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-1/3 mx-auto" />
      <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-2/3 mx-auto mb-8" />

      <div className="space-y-6">
        <div className="h-14 bg-stone-200 dark:bg-stone-700 rounded-lg" />
        <div className="h-14 bg-stone-200 dark:bg-stone-700 rounded-lg" />
        <div className="h-14 bg-stone-200 dark:bg-stone-700 rounded-lg" />
        <div className="h-32 bg-stone-200 dark:bg-stone-700 rounded-lg" />
        <div className="h-14 bg-stone-200 dark:bg-stone-700 rounded-lg" />
      </div>
    </div>
  )
}
