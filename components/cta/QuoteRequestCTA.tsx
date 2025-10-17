'use client'

import React, { useState } from 'react'
import { Calendar, CheckCircle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuoteRequestCTAProps {
  variant?: 'inline' | 'card' | 'modal'
  showBenefits?: boolean
  size?: 'sm' | 'md' | 'lg'
  onSubmit?: (data: QuoteFormData) => void | Promise<void>
  className?: string
}

interface QuoteFormData {
  name: string
  email: string
  phone: string
  projectType?: string
  message?: string
}

/**
 * Quote Request CTA - Streamlined quote request with conversion optimization
 * Use for: Homepage, product pages, landing pages
 */
export const QuoteRequestCTA: React.FC<QuoteRequestCTAProps> = ({
  variant = 'card',
  showBenefits = true,
  size = 'md',
  onSubmit,
  className
}) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      }
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          message: ''
        })
      }, 3000)
    } catch (error) {
      console.error('Quote request failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const benefits = [
    { icon: CheckCircle, text: 'Free online quote & measurement' },
    { icon: CheckCircle, text: 'Response within 24 hours' },
    { icon: CheckCircle, text: 'No obligation quote' }
  ]

  if (variant === 'inline') {
    return (
      <div className={cn('flex flex-col sm:flex-row gap-3', className)}>
        <input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-black"
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.email}
          className={cn(
            'inline-flex items-center justify-center gap-2 px-6 py-3',
            'bg-black text-white font-semibold rounded-lg',
            'hover:bg-gray-900 transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Sending...' : 'Get Free Quote'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className={cn('p-8 bg-green-50 border-2 border-green-200 rounded-xl text-center', className)}>
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-700">
          We've received your quote request. We'll get back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-white border-2 border-gray-200 rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6">
        <h3 className="text-2xl font-bold mb-2">Get Your Free Quote</h3>
        <p className="text-gray-200">Professional consultation at no cost</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="John Smith"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email *
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2">
              Phone (Optional)
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Optional contact number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="projectType" className="block text-sm font-semibold text-gray-900 mb-2">
            Project Type
          </label>
          <select
            id="projectType"
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select a project type</option>
            <option value="closet">Custom Closet</option>
            <option value="bypass">Bypass Doors</option>
            <option value="pantry">Pantry Organization</option>
            <option value="garage">Garage Storage</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
            Project Details (Optional)
          </label>
          <textarea
            id="message"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
            placeholder="Tell us about your project..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full inline-flex items-center justify-center gap-2 px-6 py-4',
            'bg-black text-white font-bold text-lg rounded-lg',
            'hover:bg-gray-900 transition-all duration-200',
            'shadow-lg hover:shadow-xl',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting ? 'Submitting...' : 'Request Free Quote'}
          <ArrowRight className="h-5 w-5" />
        </button>

        {showBenefits && (
          <div className="pt-4 border-t border-gray-200 space-y-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <Icon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>{benefit.text}</span>
                </div>
              )
            })}
          </div>
        )}
      </form>
    </div>
  )
}

/**
 * Quick Quote Button - Minimal quote request trigger
 */
export const QuickQuoteButton: React.FC<{
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ onClick, size = 'md', className }) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg',
        'hover:from-blue-700 hover:to-blue-800',
        'shadow-lg hover:shadow-xl',
        'transition-all duration-300',
        'hover:scale-105',
        sizeClasses[size],
        className
      )}
    >
      <Calendar className="h-5 w-5" />
      <span>Get Free Quote</span>
    </button>
  )
}

export default QuoteRequestCTA
