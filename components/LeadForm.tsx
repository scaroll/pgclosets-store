"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Validation schema per spec (CASL compliant)
const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(2, "Please enter your location"),
  serviceType: z.enum(["measure", "quote", "general"], {
    required_error: "Please select a service type",
  }),
  productInterest: z.string().optional(),
  message: z.string().max(500, "Message must be less than 500 characters").optional(),
  preferredContact: z.enum(["email", "phone"]),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to be contacted",
  }),
})

type LeadFormData = z.infer<typeof leadFormSchema>

interface LeadFormProps {
  onSubmit?: (data: LeadFormData) => Promise<void> | void
  productInterest?: string
  className?: string
  variant?: "default" | "inline" | "modal"
}

export function LeadForm({
  onSubmit,
  productInterest,
  className,
  variant = "default"
}: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState<"idle" | "success" | "error">("idle")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
      serviceType: "quote",
      productInterest: productInterest || "",
      message: "",
      preferredContact: "email",
      consent: false,
    },
  })

  const serviceType = watch("serviceType")
  const preferredContact = watch("preferredContact")

  const handleFormSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Default submission to API endpoint
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to submit form")
        }
      }

      setSubmitStatus("success")
      reset()

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitStatus("error")

      // Auto-hide error message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn(
        "space-y-6",
        variant === "inline" && "space-y-4",
        variant === "modal" && "space-y-5",
        className
      )}
      noValidate
    >
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="John Smith"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p id="name-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          placeholder="john@example.com"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
          disabled={isSubmitting}
          autoComplete="email"
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-medium">
          Location (Ottawa Area) <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Input
          id="location"
          {...register("location")}
          placeholder="e.g., Kanata, Barrhaven, Orleans"
          aria-required="true"
          aria-invalid={!!errors.location}
          aria-describedby={errors.location ? "location-error" : undefined}
          className={cn(errors.location && "border-destructive focus-visible:ring-destructive")}
          disabled={isSubmitting}
          list="ottawa-locations"
        />
        <datalist id="ottawa-locations">
          <option value="Ottawa" />
          <option value="Kanata" />
          <option value="Barrhaven" />
          <option value="Nepean" />
          <option value="Orleans" />
          <option value="Stittsville" />
          <option value="Gloucester" />
        </datalist>
        {errors.location && (
          <p id="location-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errors.location.message}
          </p>
        )}
      </div>

      {/* Service Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="serviceType" className="text-sm font-medium">
          Service Needed <span className="text-destructive" aria-label="required">*</span>
        </Label>
        <Select
          value={serviceType}
          onValueChange={(value) => setValue("serviceType", value as "measure" | "quote" | "general")}
          disabled={isSubmitting}
        >
          <SelectTrigger
            id="serviceType"
            aria-required="true"
            aria-invalid={!!errors.serviceType}
            aria-describedby={errors.serviceType ? "serviceType-error" : undefined}
            className={cn(errors.serviceType && "border-destructive")}
          >
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quote">Free Quote</SelectItem>
            <SelectItem value="measure">Free Online Quote Measurement</SelectItem>
            <SelectItem value="general">General Inquiry</SelectItem>
          </SelectContent>
        </Select>
        {errors.serviceType && (
          <p id="serviceType-error" className="text-sm text-destructive flex items-center gap-1" role="alert">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errors.serviceType.message}
          </p>
        )}
      </div>

      {/* Product Interest (Optional) */}
      {productInterest && (
        <div className="rounded-md bg-muted p-3 text-sm">
          <strong>Product Interest:</strong> {productInterest}
        </div>
      )}

      {/* Message Field (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm font-medium">
          Additional Information <span className="text-muted-foreground text-xs">(Optional)</span>
        </Label>
        <textarea
          id="message"
          {...register("message")}
          placeholder="Tell us about your project..."
          rows={4}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base shadow-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          maxLength={500}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-destructive flex items-center gap-1" role="alert">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Preferred Contact Method */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Preferred Contact Method</Label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="email"
              {...register("preferredContact")}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isSubmitting}
            />
            <span className="text-sm">Email</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="phone"
              {...register("preferredContact")}
              className="h-4 w-4 border-gray-300 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              disabled={isSubmitting}
            />
            <span className="text-sm">Phone</span>
          </label>
        </div>
      </div>

      {/* CASL Consent Checkbox */}
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="consent"
            {...register("consent")}
            className={cn(
              "mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2",
              errors.consent && "border-destructive"
            )}
            aria-required="true"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
            disabled={isSubmitting}
          />
          <Label htmlFor="consent" className="text-sm font-normal leading-tight cursor-pointer">
            I consent to PG Closets contacting me by email regarding my inquiry.
            I understand I can opt out at any time. <span className="text-destructive" aria-label="required">*</span>
          </Label>
        </div>
        {errors.consent && (
          <p id="consent-error" className="text-sm text-destructive flex items-center gap-1 ml-6" role="alert">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            {errors.consent.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Submitting...</span>
          </>
        ) : (
          "Submit Request"
        )}
      </Button>

      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <div className="rounded-md bg-green-50 border border-green-200 p-4 flex items-start gap-3" role="alert">
          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h4 className="text-sm font-medium text-green-900">Request submitted successfully!</h4>
            <p className="text-sm text-green-700 mt-1">
              Thank you for your interest. We'll contact you within 24 hours.
            </p>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 flex items-start gap-3" role="alert">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h4 className="text-sm font-medium text-red-900">Submission failed</h4>
            <p className="text-sm text-red-700 mt-1">
              We're sorry, something went wrong. Please try again or email us at info@pgclosets.ca.
            </p>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <p className="text-xs text-muted-foreground">
        Your information will be used in accordance with our{" "}
        <a href="/legal/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        . We respect your privacy and will never share your information with third parties.
      </p>
    </form>
  )
}
