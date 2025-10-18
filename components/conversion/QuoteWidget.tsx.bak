'use client'

import { useState } from "react"
import { Calculator, Phone, MessageCircle, ArrowRight, CheckCircle, Mail, Loader2 } from "lucide-react"
import { OptimizedCTA } from "./OptimizedCTA"
import { trackQuoteStart, trackQuoteSubmit } from "@/lib/analytics/events"
import { formatShortLabel, formatMailtoBody, formatSubject, type DoorSelection } from "@/lib/quote/format"

interface QuoteWidgetProps {
  variant?: "full" | "compact" | "floating" | "inline"
  showPricing?: boolean
  className?: string
  defaultSeries?: string
  defaultProductUrl?: string
}

interface QuoteFormData {
  // Door selection
  series: string
  doorType: 'sliding' | 'bypass' | 'bifold' | 'pivot' | 'barn' | 'mirror' | ''
  openingWidthIn: string
  openingHeightIn: string
  panelCount: string
  finish: string
  hardware: string
  softClose: boolean
  handles: string
  quantity: string
  notes: string
  // Contact info
  name: string
  email: string
  phone: string
  location: string
}

export default function QuoteWidget({
  variant = "full",
  showPricing = true,
  className = "",
  defaultSeries = "Continental",
  defaultProductUrl
}: QuoteWidgetProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<QuoteFormData>({
    series: defaultSeries,
    doorType: '',
    openingWidthIn: '',
    openingHeightIn: '',
    panelCount: '2',
    finish: '',
    hardware: 'Standard Track',
    softClose: false,
    handles: 'Standard',
    quantity: '1',
    notes: '',
    name: '',
    email: '',
    phone: '',
    location: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const doorTypes: Array<{ id: QuoteFormData['doorType']; name: string; icon: string }> = [
    { id: "sliding", name: "Sliding Doors", icon: "🚪" },
    { id: "bypass", name: "Bypass Doors", icon: "↔️" },
    { id: "bifold", name: "Bifold Doors", icon: "📐" },
    { id: "pivot", name: "Pivot Doors", icon: "🔄" },
    { id: "barn", name: "Barn Doors", icon: "🚪" },
    { id: "mirror", name: "Mirror Doors", icon: "🪞" }
  ]

  const finishOptions = [
    "Matte Black",
    "Brushed Nickel",
    "Champagne Bronze",
    "Polished Chrome",
    "Oil-Rubbed Bronze",
    "Satin Brass"
  ]

  const handleOptions = [
    "Standard",
    "Recessed",
    "Bar Pull",
    "Custom"
  ]

  // Track quote start when form is opened
  const handleQuoteStart = () => {
    trackQuoteStart({
      source: 'quote_page',
      door_type: formData.doorType || undefined,
      opening_width: parseFloat(formData.openingWidthIn) || undefined,
      opening_height: parseFloat(formData.openingHeightIn) || undefined,
      panel_count: parseInt(formData.panelCount) || undefined,
      finish: formData.finish || undefined,
      soft_close: formData.softClose,
      quantity: parseInt(formData.quantity) || undefined,
    })
  }

  const handleNext = () => {
    if (step === 1) {
      handleQuoteStart()
    }
    setStep(step + 1)
  }

  const buildDoorSelection = (): DoorSelection | null => {
    if (!formData.doorType || !formData.openingWidthIn || !formData.openingHeightIn || !formData.finish) {
      return null
    }

    return {
      series: formData.series,
      doorType: formData.doorType,
      openingWidthIn: parseFloat(formData.openingWidthIn),
      openingHeightIn: parseFloat(formData.openingHeightIn),
      panelCount: parseInt(formData.panelCount) || 2,
      finish: formData.finish,
      hardware: formData.hardware,
      softClose: formData.softClose,
      handles: formData.handles,
      quantity: parseInt(formData.quantity) || 1,
      notes: formData.notes || undefined,
      productUrl: defaultProductUrl || undefined,
    }
  }

  const handleSubmit = async () => {
    const doorSelection = buildDoorSelection()
    if (!doorSelection) {
      setSubmitError('Please complete all required door configuration fields')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          serviceType: 'quote',
          productInterest: formatShortLabel(doorSelection),
          preferredContact: 'email',
          consent: true,
          doorSelection
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitSuccess(true)
        trackQuoteSubmit({
          form_id: data.leadId || 'unknown',
          success: true,
          door_type: doorSelection.doorType,
          opening_width: doorSelection.openingWidthIn,
          opening_height: doorSelection.openingHeightIn,
          panel_count: doorSelection.panelCount,
          finish: doorSelection.finish,
          soft_close: doorSelection.softClose,
          quantity: doorSelection.quantity,
        })
      } else {
        throw new Error(data.message || 'Failed to submit quote request')
      }
    } catch (error) {
      console.error('Quote submission error:', error)
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.')
      trackQuoteSubmit({
        form_id: 'error',
        success: false,
        door_type: doorSelection.doorType,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailConfiguration = () => {
    const doorSelection = buildDoorSelection()
    if (!doorSelection) {
      alert('Please complete the door configuration first')
      return
    }

    const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@pgclosets.com'
    const subject = formatSubject(doorSelection)
    const body = formatMailtoBody(doorSelection, {
      name: formData.name || '[Your Name]',
      phone: formData.phone || '[Your Phone]'
    })

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${body}`
  }

  if (variant === "compact") {
    return (
      <div className={`bg-white border border-slate-200 rounded-lg p-6 shadow-lg ${className}`}>
        <div className="text-center mb-4">
          <Calculator className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-slate-900">Quick Quote</h3>
          <p className="text-sm text-slate-600">Get instant pricing estimate</p>
        </div>

        <div className="space-y-3">
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
            value={formData.doorType}
            onChange={(e) => setFormData({...formData, doorType: e.target.value as QuoteFormData['doorType']})}
          >
            <option value="">Select Door Type</option>
            {doorTypes.map(type => type.id && (
              <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Width (inches)"
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={formData.openingWidthIn}
              onChange={(e) => setFormData({...formData, openingWidthIn: e.target.value})}
            />
            <input
              type="number"
              placeholder="Height (inches)"
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={formData.openingHeightIn}
              onChange={(e) => setFormData({...formData, openingHeightIn: e.target.value})}
            />
          </div>

          <OptimizedCTA
            variant="primary"
            size="md"
            text="Get Instant Quote"
            className="w-full"
            onClick={handleEmailConfiguration}
          />
        </div>
      </div>
    )
  }

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="bg-blue-600 text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-110">
          <Calculator className="w-6 h-6" />
        </div>
        <div className="absolute bottom-full right-0 mb-2 bg-slate-900 text-white px-3 py-1 rounded-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Get Free Quote
        </div>
      </div>
    )
  }

  // Success state
  if (submitSuccess) {
    return (
      <div className={`bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Quote Request Received!</h2>
          <p className="text-slate-600 mb-6">
            We've emailed your configuration to our team. We'll reply with a detailed quote within 1 business hour.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>What happens next:</strong><br/>
              ✓ Our team reviews your configuration<br/>
              ✓ We prepare a detailed quote<br/>
              ✓ You receive a personalized email within 1 hour
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitSuccess(false)
              setStep(1)
              setFormData({
                series: defaultSeries,
                doorType: '',
                openingWidthIn: '',
                openingHeightIn: '',
                panelCount: '2',
                finish: '',
                hardware: 'Standard Track',
                softClose: false,
                handles: 'Standard',
                quantity: '1',
                notes: '',
                name: '',
                email: '',
                phone: '',
                location: ''
              })
            }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Submit Another Quote Request
          </button>
        </div>
      </div>
    )
  }

  // Full widget
  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Free Quote Request</h2>
        </div>
        <p className="text-blue-100">Configure your door and get a personalized quote in under 2 minutes</p>

        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-200 mb-1">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-blue-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {submitError}
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Door Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Door Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {doorTypes.map(type => type.id && (
                    <button
                      key={type.id}
                      onClick={() => setFormData({...formData, doorType: type.id})}
                      className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                        formData.doorType === type.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="text-xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium text-slate-900">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Opening Dimensions (inches) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Width"
                    step="0.1"
                    className="px-3 py-2 border border-slate-300 rounded-md"
                    value={formData.openingWidthIn}
                    onChange={(e) => setFormData({...formData, openingWidthIn: e.target.value})}
                  />
                  <input
                    type="number"
                    placeholder="Height"
                    step="0.1"
                    className="px-3 py-2 border border-slate-300 rounded-md"
                    value={formData.openingHeightIn}
                    onChange={(e) => setFormData({...formData, openingHeightIn: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Panel Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    value={formData.panelCount}
                    onChange={(e) => setFormData({...formData, panelCount: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Finish *
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={formData.finish}
                  onChange={(e) => setFormData({...formData, finish: e.target.value})}
                >
                  <option value="">Select Finish</option>
                  {finishOptions.map(finish => (
                    <option key={finish} value={finish}>{finish}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Handles *
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={formData.handles}
                  onChange={(e) => setFormData({...formData, handles: e.target.value})}
                >
                  {handleOptions.map(handle => (
                    <option key={handle} value={handle}>{handle}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="softClose"
                  checked={formData.softClose}
                  onChange={(e) => setFormData({...formData, softClose: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="softClose" className="text-sm text-slate-700">
                  Add soft-close mechanism
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  placeholder="Any special requirements or questions..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Contact Information</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name *"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email Address *"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <input
                type="text"
                placeholder="Location (City, Province) *"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Your privacy is important:</strong> We'll only use this information to send you a quote. No spam, no sharing with third parties.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Review Your Configuration</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-slate-600">Series:</span>
                <span className="font-medium text-slate-900">{formData.series}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Door Type:</span>
                <span className="font-medium text-slate-900">{doorTypes.find(t => t.id === formData.doorType)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Opening Size:</span>
                <span className="font-medium text-slate-900">{formData.openingWidthIn}″ × {formData.openingHeightIn}″</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Panels:</span>
                <span className="font-medium text-slate-900">{formData.panelCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Finish:</span>
                <span className="font-medium text-slate-900">{formData.finish}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Handles:</span>
                <span className="font-medium text-slate-900">{formData.handles}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Soft-Close:</span>
                <span className="font-medium text-slate-900">{formData.softClose ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Quantity:</span>
                <span className="font-medium text-slate-900">{formData.quantity}</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                ✓ Free quote - no obligation<br/>
                ✓ Response within 1 business hour<br/>
                ✓ Professional installation available
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              disabled={isSubmitting}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Back
            </button>
          )}

          {step < 3 ? (
            <OptimizedCTA
              variant="primary"
              onClick={handleNext}
              disabled={
                (step === 1 && (!formData.doorType || !formData.openingWidthIn || !formData.openingHeightIn || !formData.finish)) ||
                (step === 2 && (!formData.name || !formData.email || !formData.phone || !formData.location))
              }
              className="flex-1"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </OptimizedCTA>
          ) : (
            <OptimizedCTA
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Get My Quote
                </>
              )}
            </OptimizedCTA>
          )}
        </div>

        {/* Email Configuration Fallback */}
        {step === 3 && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <button
              onClick={handleEmailConfiguration}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              Or Email This Configuration
            </button>
          </div>
        )}

        {/* Contact alternatives */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600 mb-3">
            Prefer to speak with someone directly?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleEmailConfiguration}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Email Us
            </button>
            <a
              href="tel:+16137016393"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Phone className="w-4 h-4" />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export { QuoteWidget }
