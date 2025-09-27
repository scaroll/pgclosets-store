"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { X, Check, ArrowRight } from "lucide-react"
import Image from "next/image"
import { Product } from "@/types/commerce"

interface ProductLike {
  name?: string;
  title?: string;
  price?: number;
  [key: string]: unknown;
}

interface LuxuryQuoteFormProps {
  open: boolean
  onClose: () => void
  product?: Product | ProductLike
  selectedOptions?: Record<string, string>
}

export function LuxuryQuoteForm({
  open,
  onClose,
  product,
  selectedOptions
}: LuxuryQuoteFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    roomDimensions: "",
    timeline: "",
    message: "",
    productInterest: product?.name || ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send quote request via API
      const response = await fetch("/api/quotes/quick", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          product: product?.name,
          selectedOptions,
          source: "luxury-quote-form"
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          onClose()
          setSubmitted(false)
          setStep(1)
          setFormData({
            name: "",
            email: "",
            projectType: "",
            roomDimensions: "",
            timeline: "",
            message: "",
            productInterest: ""
          })
        }, 3000)
      }
    } catch (error) {
      console.error("Quote submission failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-slate-400 hover:text-slate-900 transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            // Success state
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-3xl font-extralight text-slate-900 mb-4">
                Quote Request Received
              </h3>
              <p className="text-lg font-light text-slate-600 max-w-md mx-auto">
                Thank you for your interest. We'll craft a personalized quote and email it within 24 hours.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <p className="text-xs font-light uppercase tracking-[0.3em] mb-2">
                      Elevated Taste Without Pretense
                    </p>
                    <h2 className="text-3xl font-extralight tracking-wide">
                      Request Your Quote
                    </h2>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {product && (
                  <div className="bg-slate-50 p-4 rounded-sm">
                    <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                      Selected Product
                    </p>
                    <p className="text-lg font-light text-slate-900">
                      {product.name}
                    </p>
                    {product.price && (
                      <p className="text-2xl font-extralight text-slate-700 mt-1">
                        Starting at ${product.price}
                      </p>
                    )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all duration-300 font-light"
                      placeholder="John Smith"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all duration-300 font-light"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2">
                      Project Type
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all duration-300 font-light"
                    >
                      <option value="">Select type</option>
                      <option value="new-installation">New Installation</option>
                      <option value="replacement">Replacement</option>
                      <option value="renovation">Full Renovation</option>
                      <option value="consultation">Consultation Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2">
                      Room Dimensions
                    </label>
                    <input
                      type="text"
                      value={formData.roomDimensions}
                      onChange={(e) => setFormData({ ...formData, roomDimensions: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all duration-300 font-light"
                      placeholder="8ft x 10ft (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2">
                      Preferred Timeline
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all duration-300 font-light"
                    >
                      <option value="">Select timeline</option>
                      <option value="asap">As soon as possible</option>
                      <option value="1-month">Within 1 month</option>
                      <option value="2-3-months">2-3 months</option>
                      <option value="planning">Just planning</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2">
                      Product Interest
                    </label>
                    <input
                      type="text"
                      value={formData.productInterest}
                      onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all duration-300 font-light"
                      placeholder="Specific product or style"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-600 mb-2">
                    Additional Details
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all duration-300 font-light resize-none"
                    placeholder="Tell us about your vision..."
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <p className="text-xs text-slate-500 font-light">
                    We'll email your personalized quote within 24 hours
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "bg-slate-900 text-white px-8 py-3 font-light tracking-wide uppercase text-sm",
                      "hover:bg-slate-800 hover:shadow-xl hover:scale-105",
                      "transition-all duration-300",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "flex items-center gap-2"
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get Quote
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}