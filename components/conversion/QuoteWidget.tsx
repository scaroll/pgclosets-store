'use client'

"use client"

import { useState } from "react"
import { Calculator, Phone, MessageCircle, Calendar, ArrowRight, CheckCircle } from "lucide-react"
import { OptimizedCTA } from "./OptimizedCTA"

interface QuoteWidgetProps {
  variant?: "full" | "compact" | "floating" | "inline"
  showPricing?: boolean
  className?: string
}

interface QuoteFormData {
  projectType: string
  dimensions: {
    width: string
    height: string
  }
  material: string
  installation: boolean
  urgency: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
}

export default function QuoteWidget({
  variant = "full",
  showPricing = true,
  className = ""
}: QuoteWidgetProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<QuoteFormData>({
    projectType: "",
    dimensions: { width: "", height: "" },
    material: "",
    installation: true,
    urgency: "",
    contactInfo: { name: "", email: "", phone: "" }
  })
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)

  const projectTypes = [
    { id: "closet-doors", name: "Closet Doors", basePrice: 800, icon: "🚪" },
    { id: "room-dividers", name: "Room Dividers", basePrice: 1200, icon: "🏠" },
    { id: "barn-doors", name: "Barn Doors", basePrice: 900, icon: "🚪" },
    { id: "custom", name: "Custom Project", basePrice: 1500, icon: "⚡" }
  ]

  const materials = [
    { id: "glass", name: "Frosted Glass", multiplier: 1.0 },
    { id: "mirror", name: "Mirror", multiplier: 1.2 },
    { id: "wood", name: "Wood Frame", multiplier: 0.8 },
    { id: "premium", name: "Premium Glass", multiplier: 1.5 }
  ]

  const urgencyOptions = [
    { id: "flexible", name: "I'm flexible with timing", discount: 0 },
    { id: "month", name: "Within a month", discount: 0 },
    { id: "weeks", name: "Within 2 weeks", discount: 0.05 },
    { id: "urgent", name: "ASAP - This week", discount: 0.1 }
  ]

  const calculateEstimate = () => {
    const project = projectTypes.find(p => p.id === formData.projectType)
    const material = materials.find(m => m.id === formData.material)
    const urgency = urgencyOptions.find(u => u.id === formData.urgency)

    if (project && material && urgency) {
      const width = parseFloat(formData.dimensions.width) || 4
      const height = parseFloat(formData.dimensions.height) || 8
      const area = width * height

      let price = project.basePrice * material.multiplier * (area / 32) // 4x8 base

      if (formData.installation) {
        price += 300 // Installation fee
      }

      // Apply urgency discount
      price = price * (1 - urgency.discount)

      setEstimatedPrice(Math.round(price))
    }
  }

  const handleNext = () => {
    if (step === 2) {
      calculateEstimate()
    }
    setStep(step + 1)
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Quote request submitted:", formData)
    // In production: send to API, track conversion, etc.
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
            value={formData.projectType}
            onChange={(e) => setFormData({...formData, projectType: e.target.value})}
          >
            <option value="">Select Project Type</option>
            {projectTypes.map(type => (
              <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Width (ft)"
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={formData.dimensions.width}
              onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, width: e.target.value}})}
            />
            <input
              type="text"
              placeholder="Height (ft)"
              className="px-3 py-2 border border-slate-300 rounded-md text-sm"
              value={formData.dimensions.height}
              onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, height: e.target.value}})}
            />
          </div>

          <OptimizedCTA
            variant="primary"
            size="md"
            text="Get Instant Quote"
            className="w-full"
            onClick={() => window.open("mailto:spencer@peoplesgrp.com?subject=Quick Quote Request")}
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

  // Full widget
  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Free Quote Calculator</h2>
        </div>
        <p className="text-blue-100">Get your personalized estimate in under 2 minutes</p>

        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-200 mb-1">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="h-2 bg-blue-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {step === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">What type of project do you have?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projectTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setFormData({...formData, projectType: type.id})}
                  className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                    formData.projectType === type.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-semibold text-slate-900">{type.name}</div>
                  <div className="text-sm text-slate-600">Starting at ${type.basePrice}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Approximate Dimensions
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Width (feet)"
                    className="px-3 py-2 border border-slate-300 rounded-md"
                    value={formData.dimensions.width}
                    onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, width: e.target.value}})}
                  />
                  <input
                    type="number"
                    placeholder="Height (feet)"
                    className="px-3 py-2 border border-slate-300 rounded-md"
                    value={formData.dimensions.height}
                    onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, height: e.target.value}})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Material Preference
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={formData.material}
                  onChange={(e) => setFormData({...formData, material: e.target.value})}
                >
                  <option value="">Select Material</option>
                  {materials.map(material => (
                    <option key={material.id} value={material.id}>{material.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timeline
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={formData.urgency}
                  onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                >
                  <option value="">Select Timeline</option>
                  {urgencyOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name} {option.discount > 0 && `(${option.discount * 100}% discount!)`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="installation"
                  checked={formData.installation}
                  onChange={(e) => setFormData({...formData, installation: e.target.checked})}
                  className="rounded"
                />
                <label htmlFor="installation" className="text-sm text-slate-700">
                  Include professional installation (+$300)
                </label>
              </div>
            </div>
          </div>
        )}

        {step === 3 && estimatedPrice && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Estimate</h3>
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 text-center mb-6">
              <div className="text-3xl font-bold text-green-700 mb-2">
                ${estimatedPrice.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 mb-4">
                Estimated total cost including materials and installation
              </div>
              <div className="text-xs text-green-600">
                ✓ Professional installation included<br/>
                ✓ Lifetime warranty<br/>
                ✓ Free consultation
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-slate-600 text-sm">
                This is a preliminary estimate. Get an exact quote with our free in-home consultation.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Get Your Official Quote</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.contactInfo.name}
                onChange={(e) => setFormData({...formData, contactInfo: {...formData.contactInfo, name: e.target.value}})}
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.contactInfo.email}
                onChange={(e) => setFormData({...formData, contactInfo: {...formData.contactInfo, email: e.target.value}})}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-slate-300 rounded-md"
                value={formData.contactInfo.phone}
                onChange={(e) => setFormData({...formData, contactInfo: {...formData.contactInfo, phone: e.target.value}})}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
          )}

          {step < 4 ? (
            <OptimizedCTA
              variant="primary"
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.projectType) ||
                (step === 2 && (!formData.material || !formData.urgency))
              }
              className="flex-1"
            >
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </OptimizedCTA>
          ) : (
            <OptimizedCTA
              variant="primary"
              onClick={handleSubmit}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Get My Official Quote
            </OptimizedCTA>
          )}
        </div>

        {/* Contact alternatives */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-center text-sm text-slate-600 mb-3">
            Prefer to speak with someone directly?
          </p>
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
              <Phone className="w-4 h-4" />
              Call (613) 422-5800
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              <MessageCircle className="w-4 h-4" />
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { QuoteWidget }