"use client"

import { useState } from "react"
import { CheckCircle, Phone, Calendar, ArrowRight, Clock, Shield } from "lucide-react"
import { OptimizedCTA } from "./OptimizedCTA"
import { useConversionTracking } from "./ConversionTracking"

interface FormData {
  name: string
  email: string
  phone: string
  projectType: string
  timeline: string
  budget: string
  message: string
  address: string
  preferredContact: string
}

interface OptimizedContactFormProps {
  variant?: "full" | "compact" | "quote" | "consultation"
  showTrustSignals?: boolean
  showUrgency?: boolean
  prefilledData?: Partial<FormData>
  onSubmit?: (data: FormData) => void
  className?: string
}

export default function OptimizedContactForm({
  variant = "full",
  showTrustSignals = true,
  showUrgency = true,
  prefilledData = {},
  onSubmit,
  className = ""
}: OptimizedContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    timeline: "",
    budget: "",
    message: "",
    address: "",
    preferredContact: "email",
    ...prefilledData
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})

  const { trackConversions } = useConversionTracking()

  const projectTypes = [
    { id: "closet-doors", name: "Closet Doors", icon: "🚪", popular: true },
    { id: "room-dividers", name: "Room Dividers", icon: "🏠", popular: false },
    { id: "barn-doors", name: "Barn Doors", icon: "🚪", popular: true },
    { id: "custom", name: "Custom Project", icon: "⚡", popular: false }
  ]

  const timelines = [
    { id: "asap", name: "ASAP (This week)", discount: "10% discount", urgent: true },
    { id: "2weeks", name: "Within 2 weeks", discount: "5% discount", urgent: false },
    { id: "month", name: "Within a month", discount: "", urgent: false },
    { id: "flexible", name: "I'm flexible", discount: "", urgent: false }
  ]

  const budgets = [
    { id: "under-1000", name: "Under $1,000", range: "Budget-friendly options" },
    { id: "1000-2500", name: "$1,000 - $2,500", range: "Popular range" },
    { id: "2500-5000", name: "$2,500 - $5,000", range: "Premium options" },
    { id: "over-5000", name: "$5,000+", range: "Luxury collection" }
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FormData> = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required"
      if (!formData.email.trim()) newErrors.email = "Email is required"
      if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    }

    if (step === 2) {
      if (!formData.projectType) newErrors.projectType = "Please select a project type"
      if (!formData.timeline) newErrors.timeline = "Please select a timeline"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      trackConversions.ctaClick("Form Next", `Step_${currentStep}`)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) return

    setIsSubmitting(true)

    try {
      // Track conversion
      trackConversions.quoteRequest(
        formData.budget === "over-5000" ? 1000 :
        formData.budget === "2500-5000" ? 750 :
        formData.budget === "1000-2500" ? 500 : 300
      )

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      if (onSubmit) {
        onSubmit(formData)
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSubmitted) {
    return (
      <div className={`bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-4">
          🎉 Request Received!
        </h3>
        <p className="text-green-700 mb-6">
          Thank you {formData.name}! We'll send your personalized quote within 24 hours.
        </p>
        <div className="bg-white border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-700">
          <div className="font-semibold mb-2">What happens next:</div>
          <div className="space-y-1 text-left">
            <div>✓ Custom quote prepared (within 24 hours)</div>
            <div>✓ FREE consultation scheduled</div>
            <div>✓ Professional site assessment</div>
            <div>✓ Detailed project timeline provided</div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="tel:+16134225800"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            📞 Questions? Call (613) 422-5800
          </a>
          <button
            onClick={() => window.open("mailto:spencer@peoplesgrp.com", "_blank")}
            className="border border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            📧 Email Us Directly
          </button>
        </div>
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className={`bg-white border border-slate-200 rounded-lg p-6 shadow-lg ${className}`}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">Get FREE Quote</h3>
          <p className="text-sm text-slate-600">24-hour response guaranteed</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name *"
            value={formData.name}
            onChange={(e) => updateFormData("name", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email Address *"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="tel"
            placeholder="Phone Number *"
            value={formData.phone}
            onChange={(e) => updateFormData("phone", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <select
            value={formData.projectType}
            onChange={(e) => updateFormData("projectType", e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Project Type</option>
            {projectTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name} {type.popular && "(Popular)"}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <OptimizedCTA
            variant="primary"
            size="lg"
            text="Get My FREE Quote"
            subtext="24-hour response"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          />
        </div>

        {showTrustSignals && (
          <div className="mt-4 text-center text-xs text-slate-600">
            🛡️ Licensed & Insured • ⭐ 5-Star Rated • 🎯 Lifetime Warranty
          </div>
        )}
      </form>
    )
  }

  // Full multi-step form
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden ${className}`}>
      {/* Header with progress */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Get Your FREE Quote</h2>
          {showUrgency && (
            <div className="bg-amber-500 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold">
              🔥 Save $500 This Week
            </div>
          )}
        </div>

        <div className="text-blue-100 mb-4">
          Professional consultation • Lifetime warranty • 24-hour response
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-blue-200 mb-1">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-blue-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Let's start with your contact information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="(613) 555-0123"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ottawa, ON"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="email"
                      checked={formData.preferredContact === "email"}
                      onChange={(e) => updateFormData("preferredContact", e.target.value)}
                      className="mr-2"
                    />
                    📧 Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="phone"
                      checked={formData.preferredContact === "phone"}
                      onChange={(e) => updateFormData("preferredContact", e.target.value)}
                      className="mr-2"
                    />
                    📞 Phone
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Tell us about your project
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                What type of project do you have? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projectTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => updateFormData("projectType", type.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                      formData.projectType === type.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="font-semibold text-slate-900">{type.name}</div>
                    {type.popular && (
                      <div className="text-xs text-blue-600 font-medium">Popular Choice</div>
                    )}
                  </button>
                ))}
              </div>
              {errors.projectType && <p className="mt-2 text-sm text-red-600">{errors.projectType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                When would you like to start? *
              </label>
              <div className="space-y-2">
                {timelines.map(timeline => (
                  <button
                    key={timeline.id}
                    type="button"
                    onClick={() => updateFormData("timeline", timeline.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                      formData.timeline === timeline.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{timeline.name}</span>
                      {timeline.discount && (
                        <span className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
                          {timeline.discount}
                        </span>
                      )}
                      {timeline.urgent && (
                        <span className="text-sm text-red-600 font-semibold">🔥 URGENT</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {errors.timeline && <p className="mt-2 text-sm text-red-600">{errors.timeline}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                What's your budget range?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {budgets.map(budget => (
                  <button
                    key={budget.id}
                    type="button"
                    onClick={() => updateFormData("budget", budget.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                      formData.budget === budget.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{budget.name}</div>
                    <div className="text-sm text-slate-600">{budget.range}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Additional Details */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              Any additional details?
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Description (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => updateFormData("message", e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Tell us more about your vision, specific requirements, or any questions you have..."
              />
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-800 mb-3">
                🎉 What You'll Receive:
              </h4>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Personalized quote within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>FREE in-home consultation and measurements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Lifetime warranty on all installations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Professional project timeline and planning</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex gap-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              ← Previous
            </button>
          )}

          {currentStep < 3 ? (
            <OptimizedCTA
              variant="primary"
              size="lg"
              onClick={handleNext}
              className="flex-1"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </OptimizedCTA>
          ) : (
            <OptimizedCTA
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Request...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Get My FREE Quote
                </>
              )}
            </OptimizedCTA>
          )}
        </div>

        {/* Trust signals and contact alternatives */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600 mb-4">
            Prefer to speak with someone directly?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:+16134225800"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              <Phone className="w-4 h-4" />
              Call (613) 422-5800
            </a>
            <a
              href="mailto:spencer@peoplesgrp.com?subject=Quote Request"
              className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
            >
              📧 Email Directly
            </a>
          </div>

          {showTrustSignals && (
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>24-Hour Response</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Lifetime Warranty</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

export { OptimizedContactForm }