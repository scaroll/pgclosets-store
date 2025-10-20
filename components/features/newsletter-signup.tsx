"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus("idle")
    setErrorMessage("")

    // Email validation
    if (!email.trim()) {
      setErrorMessage("Please enter an email address")
      setSubmitStatus("error")
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address")
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          source: 'website_newsletter'
        })
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus("success")
        setEmail("")
        // Auto-hide success message after 8 seconds
        setTimeout(() => setSubmitStatus("idle"), 8000)
      } else {
        setErrorMessage(result.error || 'Failed to subscribe. Please try again.')
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setErrorMessage('Network error. Please try again later.')
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (submitStatus === "error") {
      setSubmitStatus("idle")
      setErrorMessage("")
    }
  }

  if (submitStatus === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" aria-hidden="true" />
        </div>
        <h3 className="font-semibold text-green-900 mb-2">Thank you for subscribing!</h3>
        <p className="text-green-700 text-sm leading-relaxed">
          You&apos;ll receive our latest closet design tips and exclusive offers delivered to your inbox.
        </p>
        <p className="text-green-600 text-xs mt-2">
          Check your email for a confirmation message.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <div className="text-center mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">Stay Updated</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Get the latest closet design tips and exclusive offers delivered to your inbox
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              className={cn(
                "h-12 text-base transition-all duration-200",
                submitStatus === "error" && "border-red-300 focus:border-red-500 focus:ring-red-500/20",
                submitStatus === "success" && "border-green-300 focus:border-green-500 focus:ring-green-500/20"
              )}
              disabled={isSubmitting}
              aria-label="Email address for newsletter"
              aria-describedby={submitStatus === "error" ? "email-error" : undefined}
              autoComplete="email"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || submitStatus === "success"}
            className="h-12 px-6 font-medium transition-all duration-200 min-w-[100px]"
            aria-busy={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                Subscribing...
              </>
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>

        {/* Error Message */}
        {submitStatus === "error" && errorMessage && (
          <div
            id="email-error"
            className="flex items-center gap-2 text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center leading-relaxed">
          We respect your privacy. Unsubscribe at any time. View our{" "}
          <a
            href="/privacy-policy"
            className="underline hover:text-gray-700 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </form>
    </div>
  )
}
