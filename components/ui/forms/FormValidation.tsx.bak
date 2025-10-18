"use client"

import * as React from "react"
import type { SubmitHandler, UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { FloatingInput } from "./FloatingInput"
import { FloatingTextArea } from "./FloatingTextArea"
import { AppleSelect } from "./AppleSelect"
import { AppleCheckbox, AppleRadioGroup, AppleToggle } from "./AppleCheckbox"

// ============================================================================
// Validation Schemas Examples
// ============================================================================

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^[\d\s\-\(\)\+]+$/,
      "Please enter a valid phone number"
    )
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms and conditions"),
})

export const quoteFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  projectType: z.string().min(1, "Please select a project type"),
  roomDimensions: z.string().optional(),
  timeline: z.string().min(1, "Please select a timeline"),
  budget: z.string().optional(),
  preferredContact: z.enum(["email", "phone", "either"], {
    required_error: "Please select a contact preference",
  }),
  newsletter: z.boolean().optional(),
  message: z.string().min(20, "Please provide more details (min 20 characters)"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type QuoteFormData = z.infer<typeof quoteFormSchema>

// ============================================================================
// Form Field Components
// ============================================================================

interface FormFieldProps {
  name: string
  form: UseFormReturn<any>
  children: (props: {
    value: any
    onChange: (value: any) => void
    error?: string
  }) => React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  form,
  children,
}) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form

  const value = watch(name)
  const error = errors[name]?.message as string | undefined

  return <>{children({ value, onChange: (val) => setValue(name, val), error })}</>
}

// ============================================================================
// Complete Form Examples
// ============================================================================

interface ContactFormProps {
  onSubmit: SubmitHandler<ContactFormData>
  isLoading?: boolean
  className?: string
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isLoading = false,
  className,
}) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      agreeToTerms: false,
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      {/* Name Field */}
      <FloatingInput
        {...register("name")}
        label="Your Name"
        error={errors.name?.message}
        disabled={isLoading}
        placeholder="John Smith"
      />

      {/* Email Field */}
      <FloatingInput
        {...register("email")}
        type="email"
        label="Email Address"
        error={errors.email?.message}
        disabled={isLoading}
        placeholder="john@example.com"
      />

      {/* Phone Field */}
      <FloatingInput
        {...register("phone")}
        type="tel"
        label="Phone Number (Optional)"
        error={errors.phone?.message}
        disabled={isLoading}
        placeholder="+1 (555) 123-4567"
      />

      {/* Message Field */}
      <FloatingTextArea
        {...register("message")}
        label="Your Message"
        error={errors.message?.message}
        disabled={isLoading}
        maxLength={1000}
        minRows={4}
        placeholder="Tell us about your project..."
      />

      {/* Terms Checkbox */}
      <FormField name="agreeToTerms" form={form}>
        {({ value, onChange, error }) => (
          <AppleCheckbox
            checked={value}
            onCheckedChange={onChange}
            error={error}
            disabled={isLoading}
            label="I agree to the terms and conditions"
            description="We'll never share your information with third parties"
            required
          />
        )}
      </FormField>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isValid}
        className={cn(
          "w-full bg-slate-900 text-white px-8 py-3 font-light tracking-wide uppercase text-sm",
          "hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02]",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  )
}

interface QuoteFormProps {
  onSubmit: SubmitHandler<QuoteFormData>
  isLoading?: boolean
  className?: string
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  onSubmit,
  isLoading = false,
  className,
}) => {
  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      projectType: "",
      roomDimensions: "",
      timeline: "",
      budget: "",
      preferredContact: "email",
      newsletter: false,
      message: "",
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("space-y-6", className)}
    >
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          {...register("name")}
          label="Your Name"
          error={errors.name?.message}
          disabled={isLoading}
          placeholder="John Smith"
        />

        <FloatingInput
          {...register("email")}
          type="email"
          label="Email Address"
          error={errors.email?.message}
          disabled={isLoading}
          placeholder="john@example.com"
        />
      </div>

      {/* Project Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField name="projectType" form={form}>
          {({ value, onChange, error }) => (
            <AppleSelect
              label="Project Type"
              value={value}
              onChange={onChange}
              error={error}
              disabled={isLoading}
              required
              options={[
                { value: "new-installation", label: "New Installation" },
                { value: "replacement", label: "Replacement" },
                { value: "renovation", label: "Full Renovation" },
                { value: "consultation", label: "Consultation Only" },
              ]}
            />
          )}
        </FormField>

        <FormField name="timeline" form={form}>
          {({ value, onChange, error }) => (
            <AppleSelect
              label="Preferred Timeline"
              value={value}
              onChange={onChange}
              error={error}
              disabled={isLoading}
              required
              options={[
                { value: "asap", label: "As soon as possible" },
                { value: "1-month", label: "Within 1 month" },
                { value: "2-3-months", label: "2-3 months" },
                { value: "planning", label: "Just planning" },
              ]}
            />
          )}
        </FormField>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          {...register("roomDimensions")}
          label="Room Dimensions (Optional)"
          error={errors.roomDimensions?.message}
          disabled={isLoading}
          placeholder="8ft x 10ft"
        />

        <FormField name="budget" form={form}>
          {({ value, onChange, error }) => (
            <AppleSelect
              label="Budget Range (Optional)"
              value={value}
              onChange={onChange}
              error={error}
              disabled={isLoading}
              searchable
              options={[
                { value: "under-5k", label: "Under $5,000" },
                { value: "5k-10k", label: "$5,000 - $10,000" },
                { value: "10k-20k", label: "$10,000 - $20,000" },
                { value: "20k-plus", label: "$20,000+" },
              ]}
            />
          )}
        </FormField>
      </div>

      {/* Contact Preferences */}
      <FormField name="preferredContact" form={form}>
        {({ value, onChange, error }) => (
          <AppleRadioGroup
            label="Preferred Contact Method"
            value={value}
            onValueChange={onChange}
            error={error}
            disabled={isLoading}
            required
            orientation="horizontal"
            options={[
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
              { value: "either", label: "Either" },
            ]}
          />
        )}
      </FormField>

      {/* Newsletter Toggle */}
      <FormField name="newsletter" form={form}>
        {({ value, onChange }) => (
          <AppleToggle
            checked={value}
            onCheckedChange={onChange}
            disabled={isLoading}
            label="Subscribe to newsletter"
            description="Get updates on new products and special offers"
          />
        )}
      </FormField>

      {/* Message */}
      <FloatingTextArea
        {...register("message")}
        label="Tell us about your project"
        error={errors.message?.message}
        disabled={isLoading}
        maxLength={1000}
        minRows={4}
        placeholder="Describe your vision, specific requirements, style preferences..."
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isValid}
        className={cn(
          "w-full bg-slate-900 text-white px-8 py-4 font-light tracking-wide uppercase text-sm",
          "hover:bg-slate-800 hover:shadow-xl hover:scale-[1.02]",
          "transition-all duration-300",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        )}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting Request...
          </span>
        ) : (
          "Get Your Free Quote"
        )}
      </button>
    </form>
  )
}
