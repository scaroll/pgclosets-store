/**
 * DIVISION 5: CONVERSION RATE OPTIMIZATION
 * Checkout Optimization (Agents 9-11)
 *
 * Comprehensive checkout optimization system to reduce cart abandonment
 * Target: <3 steps, >70% completion rate
 */

'use client'

import { useState, useEffect } from 'react'
import { Shield, Truck, CreditCard, ArrowRight, CheckCircle, Lock, Timer } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface CheckoutStep {
  id: string
  name: string
  status: 'incomplete' | 'active' | 'complete'
  optional?: boolean
}

export interface CheckoutMetrics {
  sessionId: string
  startTime: number
  currentStep: number
  completedSteps: string[]
  abandonmentReasons: string[]
  timePerStep: Record<string, number>
  formErrors: string[]
}

interface CheckoutOptimizationProps {
  steps: CheckoutStep[]
  currentStep: number
  totalPrice: number
  itemCount: number
  onStepChange?: (step: number) => void
  onAbandon?: (metrics: CheckoutMetrics) => void
  children: React.ReactNode
}

export function CheckoutOptimization({
  steps,
  currentStep,
  totalPrice,
  itemCount,
  onStepChange,
  onAbandon,
  children
}: CheckoutOptimizationProps) {
  const [metrics, setMetrics] = useState<CheckoutMetrics>({
    sessionId: `checkout_${Date.now()}`,
    startTime: Date.now(),
    currentStep: 0,
    completedSteps: [],
    abandonmentReasons: [],
    timePerStep: {},
    formErrors: []
  })

  const [stepStartTime, setStepStartTime] = useState(Date.now())
  const [showExitWarning, setShowExitWarning] = useState(false)

  /**
   * Track step timing
   */
  useEffect(() => {
    const stepName = steps[currentStep]?.id
    if (stepName) {
      const timeSpent = Date.now() - stepStartTime
      setMetrics(prev => ({
        ...prev,
        timePerStep: {
          ...prev.timePerStep,
          [stepName]: timeSpent
        }
      }))
      setStepStartTime(Date.now())
    }
  }, [currentStep, steps, stepStartTime])

  /**
   * Track abandonment on page leave
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const finalMetrics = {
        ...metrics,
        abandonmentReasons: ['page_exit'],
        timePerStep: {
          ...metrics.timePerStep,
          [steps[currentStep]?.id]: Date.now() - stepStartTime
        }
      }

      // Track abandonment
      onAbandon?.(finalMetrics)

      // Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'checkout_abandonment', {
          step: currentStep + 1,
          step_name: steps[currentStep]?.id,
          cart_value: totalPrice,
          time_spent: Date.now() - metrics.startTime
        })
      }

      // Show warning if cart has value
      if (totalPrice > 0) {
        setShowExitWarning(true)
        e.preventDefault()
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [metrics, currentStep, steps, totalPrice, stepStartTime, onAbandon])

  /**
   * Calculate progress percentage
   */
  const progressPercentage = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="checkout-optimization">
      {/* Progress Indicator */}
      <CheckoutProgressBar
        steps={steps}
        currentStep={currentStep}
        progressPercentage={progressPercentage}
      />

      {/* Trust Badges Above Fold */}
      <CheckoutTrustBadges />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {children}
          </div>

          {/* Sticky Order Summary */}
          <div className="lg:col-span-1">
            <StickyOrderSummary
              totalPrice={totalPrice}
              itemCount={itemCount}
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </div>
        </div>
      </div>

      {/* Exit Warning */}
      <AnimatePresence>
        {showExitWarning && (
          <ExitWarningModal
            onClose={() => setShowExitWarning(false)}
            totalPrice={totalPrice}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Progress Bar Component
 */
function CheckoutProgressBar({
  steps,
  currentStep,
  progressPercentage
}: {
  steps: CheckoutStep[]
  currentStep: number
  progressPercentage: number
}) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Progress bar */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
          <motion.div
            className="absolute h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-center gap-2"
            >
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${index < currentStep ? 'bg-blue-600 text-white' :
                    index === currentStep ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                    'bg-gray-200 text-gray-500'}
                `}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <span className={`hidden md:block text-sm ${
                index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block w-4 h-4 text-gray-300 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Trust Badges
 */
function CheckoutTrustBadges() {
  const badges = [
    { icon: Shield, text: 'Secure Checkout', color: 'text-green-600' },
    { icon: Lock, text: 'SSL Encrypted', color: 'text-blue-600' },
    { icon: Truck, text: 'Free Shipping', color: 'text-purple-600' },
    { icon: Timer, text: 'Quick Process', color: 'text-orange-600' }
  ]

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {badges.map((badge, index) => {
            const Icon = badge.icon
            return (
              <div key={index} className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${badge.color}`} />
                <span className="text-gray-700 font-medium">{badge.text}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * Sticky Order Summary
 */
function StickyOrderSummary({
  totalPrice,
  itemCount,
  currentStep,
  totalSteps
}: {
  totalPrice: number
  itemCount: number
  currentStep: number
  totalSteps: number
}) {
  const shipping = 0 // Free shipping
  const tax = totalPrice * 0.13 // 13% HST
  const total = totalPrice + shipping + tax

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price)

  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

        {/* Items count */}
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Items ({itemCount})</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <span>Tax (HST 13%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        {/* Total */}
        <div className="border-t pt-4 mb-4">
          <div className="flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-700 font-medium">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-blue-600">
              {Math.round(((currentStep + 1) / totalSteps) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Security badges */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-600" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-blue-600" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-3 h-3 text-purple-600" />
            <span>Free Delivery</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            <span>Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Money-back guarantee */}
      <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-green-900 mb-1">100% Satisfaction Guarantee</p>
            <p className="text-green-700 text-xs">
              Not satisfied? We'll make it right or your money back. No questions asked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Exit Warning Modal
 */
function ExitWarningModal({
  onClose,
  totalPrice
}: {
  onClose: () => void
  totalPrice: number
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
      >
        <div className="bg-white rounded-xl shadow-2xl p-6 mx-4">
          <h3 className="text-xl font-bold mb-2">Wait! Don't Leave Yet</h3>
          <p className="text-gray-600 mb-4">
            You're almost done! Complete your order now and get:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Free shipping in Ottawa area</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Professional installation available</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Lifetime warranty on all products</span>
            </li>
          </ul>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Complete Order
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Leave
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

/**
 * Smart Form Field with Validation Feedback
 */
export function SmartFormField({
  label,
  error,
  required,
  children
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-600 text-sm mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * Auto-save indicator
 */
export function AutoSaveIndicator({ saved }: { saved: boolean }) {
  return (
    <AnimatePresence>
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 text-green-600 text-sm"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Progress saved</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
