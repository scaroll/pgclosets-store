/**
 * DIVISION 5: CONVERSION RATE OPTIMIZATION
 * Exit Intent Popup (Agents 18-19)
 *
 * Detects exit intent and shows targeted offers to prevent abandonment
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, Gift, Clock, TrendingDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ExitIntentOffer {
  id: string
  title: string
  description: string
  type: 'discount' | 'free_shipping' | 'consultation' | 'content'
  value?: string // "10%", "$50 off", "Free", etc.
  cta: string
  ctaLink: string
  image?: string
  conditions?: string
  urgency?: {
    message: string
    countdown?: number // seconds
  }
}

export interface ExitIntentConfig {
  enabled: boolean
  sensitivity: number // 0-100, how aggressive to detect exit
  delay: number // ms before popup can show again
  maxShowsPerSession: number
  maxShowsPerUser: number
  targetPages?: string[] // specific pages, or all if empty
  excludePages?: string[]
  triggers: {
    mouseLeave: boolean
    rapidScrollUp: boolean
    backButton: boolean
    closeTab: boolean
  }
}

const defaultConfig: ExitIntentConfig = {
  enabled: true,
  sensitivity: 70,
  delay: 30000, // 30 seconds
  maxShowsPerSession: 2,
  maxShowsPerUser: 5,
  triggers: {
    mouseLeave: true,
    rapidScrollUp: true,
    backButton: false, // Can be intrusive
    closeTab: true
  }
}

const defaultOffers: ExitIntentOffer[] = [
  {
    id: 'first_time_discount',
    title: 'Wait! Get 10% Off Your First Order',
    description: 'Join hundreds of satisfied Ottawa homeowners. Complete your order now and save!',
    type: 'discount',
    value: '10%',
    cta: 'Claim Your Discount',
    ctaLink: '/store?discount=FIRST10',
    conditions: 'New customers only. Applied at checkout.',
    urgency: {
      message: 'Offer expires in',
      countdown: 300 // 5 minutes
    }
  },
  {
    id: 'free_consultation',
    title: 'Not Sure What You Need?',
    description: 'Book a free online quote with our design experts. No obligation!',
    type: 'consultation',
    cta: 'Schedule Free Online Quote',
    ctaLink: 'https://clienthub.getjobber.com/client_hubs/0193e7c8-2c4b-7a8b-b0c1-4c5e6f7a8b9c/public/request_forms/0193e7c8-2c4b-7a8b-b0c1-4c5e6f7a8b9d',
    urgency: {
      message: 'Limited slots available this week'
    }
  },
  {
    id: 'cart_abandonment',
    title: 'Don\'t Forget Your Cart!',
    description: 'Your selected items are waiting. Complete your order to get free delivery in Ottawa.',
    type: 'free_shipping',
    value: 'Free',
    cta: 'Complete My Order',
    ctaLink: '/cart',
    urgency: {
      message: 'Cart reserved for',
      countdown: 900 // 15 minutes
    }
  }
]

interface ExitIntentPopupProps {
  offers?: ExitIntentOffer[]
  config?: Partial<ExitIntentConfig>
  onShow?: (offer: ExitIntentOffer) => void
  onClose?: (offer: ExitIntentOffer, converted: boolean) => void
  onConversion?: (offer: ExitIntentOffer) => void
}

export function ExitIntentPopup({
  offers = defaultOffers,
  config: customConfig,
  onShow,
  onClose,
  onConversion
}: ExitIntentPopupProps) {
  const [showPopup, setShowPopup] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<ExitIntentOffer | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [showCount, setShowCount] = useState(0)

  const config = { ...defaultConfig, ...customConfig }

  /**
   * Check if popup should be shown
   */
  const canShowPopup = useCallback((): boolean => {
    if (!config.enabled) return false
    if (showCount >= config.maxShowsPerSession) return false

    // Check last shown time
    const lastShown = sessionStorage.getItem('exit_popup_last_shown')
    if (lastShown) {
      const timeSince = Date.now() - parseInt(lastShown)
      if (timeSince < config.delay) return false
    }

    // Check total shows per user
    const totalShows = parseInt(localStorage.getItem('exit_popup_total_shows') || '0')
    if (totalShows >= config.maxShowsPerUser) return false

    // Check page targeting
    if (config.targetPages && config.targetPages.length > 0) {
      const currentPath = window.location.pathname
      if (!config.targetPages.some(page => currentPath.includes(page))) {
        return false
      }
    }

    // Check excluded pages
    if (config.excludePages && config.excludePages.length > 0) {
      const currentPath = window.location.pathname
      if (config.excludePages.some(page => currentPath.includes(page))) {
        return false
      }
    }

    return true
  }, [config, showCount])

  /**
   * Select appropriate offer based on context
   */
  const selectOffer = useCallback((): ExitIntentOffer | null => {
    // Check if user has items in cart
    const hasCart = typeof window !== 'undefined' &&
      localStorage.getItem('cart') &&
      JSON.parse(localStorage.getItem('cart') || '{}').items?.length > 0

    if (hasCart) {
      return offers.find(o => o.id === 'cart_abandonment') || offers[0]
    }

    // Check if first-time visitor
    const isFirstVisit = !localStorage.getItem('returning_visitor')
    if (isFirstVisit) {
      return offers.find(o => o.id === 'first_time_discount') || offers[0]
    }

    // Default to consultation offer
    return offers.find(o => o.id === 'free_consultation') || offers[0]
  }, [offers])

  /**
   * Show popup
   */
  const triggerPopup = useCallback(() => {
    if (!canShowPopup()) return

    const offer = selectOffer()
    if (!offer) return

    setCurrentOffer(offer)
    setShowPopup(true)
    setShowCount(prev => prev + 1)

    // Track show
    sessionStorage.setItem('exit_popup_last_shown', Date.now().toString())
    const totalShows = parseInt(localStorage.getItem('exit_popup_total_shows') || '0')
    localStorage.setItem('exit_popup_total_shows', (totalShows + 1).toString())

    // Start countdown if offer has urgency
    if (offer.urgency?.countdown) {
      setCountdown(offer.urgency.countdown)
    }

    // Callback
    onShow?.(offer)

    // Track analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exit_intent_shown', {
        offer_id: offer.id,
        offer_type: offer.type
      })
    }
  }, [canShowPopup, selectOffer, onShow])

  /**
   * Handle popup close
   */
  const handleClose = useCallback((converted: boolean = false) => {
    if (currentOffer) {
      onClose?.(currentOffer, converted)

      // Track analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', converted ? 'exit_intent_converted' : 'exit_intent_dismissed', {
          offer_id: currentOffer.id,
          offer_type: currentOffer.type
        })
      }
    }

    setShowPopup(false)
    setCurrentOffer(null)
    setCountdown(null)
  }, [currentOffer, onClose])

  /**
   * Handle conversion (CTA click)
   */
  const handleConversion = useCallback(() => {
    if (currentOffer) {
      onConversion?.(currentOffer)
    }
    handleClose(true)
  }, [currentOffer, onConversion, handleClose])

  /**
   * Mouse leave detection
   */
  useEffect(() => {
    if (!config.triggers.mouseLeave) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if moving towards top of page
      if (e.clientY <= config.sensitivity) {
        triggerPopup()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [config.triggers.mouseLeave, config.sensitivity, triggerPopup])

  /**
   * Rapid scroll up detection
   */
  useEffect(() => {
    if (!config.triggers.rapidScrollUp) return

    let lastScrollY = window.scrollY
    let scrollVelocity = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      scrollVelocity = lastScrollY - currentScrollY
      lastScrollY = currentScrollY

      // Rapid upward scroll
      if (scrollVelocity > 100 && currentScrollY < 500) {
        triggerPopup()
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [config.triggers.rapidScrollUp, triggerPopup])

  /**
   * Close tab/window detection
   */
  useEffect(() => {
    if (!config.triggers.closeTab) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (canShowPopup()) {
        triggerPopup()
        // Note: Modern browsers ignore custom messages
        e.preventDefault()
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [config.triggers.closeTab, canShowPopup, triggerPopup])

  /**
   * Countdown timer
   */
  useEffect(() => {
    if (countdown === null || countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown(prev => prev !== null ? prev - 1 : null)
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  /**
   * Format countdown time
   */
  const formatCountdown = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Get offer icon
   */
  const getOfferIcon = (type: ExitIntentOffer['type']) => {
    switch (type) {
      case 'discount': return TrendingDown
      case 'free_shipping': return Gift
      case 'consultation': return Clock
      default: return Gift
    }
  }

  return (
    <AnimatePresence>
      {showPopup && currentOffer && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => handleClose(false)}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-4">
              {/* Close button */}
              <button
                onClick={() => handleClose(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors z-10"
                aria-label="Close popup"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Icon */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-center">
                {(() => {
                  const Icon = getOfferIcon(currentOffer.type)
                  return (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="inline-block p-4 bg-white rounded-full mb-4"
                    >
                      <Icon className="w-12 h-12 text-blue-600" />
                    </motion.div>
                  )
                })()}
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentOffer.title}
                </h2>
                {currentOffer.value && (
                  <div className="inline-block px-6 py-2 bg-white rounded-full text-blue-600 font-bold text-xl">
                    {currentOffer.value} {currentOffer.type === 'discount' ? 'OFF' : ''}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-700 text-lg mb-6 text-center">
                  {currentOffer.description}
                </p>

                {/* Urgency countdown */}
                {currentOffer.urgency && countdown !== null && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
                    <div className="flex items-center justify-center gap-2 text-red-600 font-medium">
                      <Clock className="w-5 h-5" />
                      <span>{currentOffer.urgency.message}</span>
                      <span className="font-mono font-bold text-xl">
                        {formatCountdown(countdown)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Urgency message without countdown */}
                {currentOffer.urgency && countdown === null && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6 text-center">
                    <span className="text-orange-700 font-medium text-sm">
                      ⏰ {currentOffer.urgency.message}
                    </span>
                  </div>
                )}

                {/* CTA */}
                <a
                  href={currentOffer.ctaLink}
                  onClick={handleConversion}
                  className="block w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center transition-colors shadow-lg hover:shadow-xl"
                >
                  {currentOffer.cta}
                </a>

                {/* Conditions */}
                {currentOffer.conditions && (
                  <p className="text-xs text-gray-500 text-center mt-4">
                    {currentOffer.conditions}
                  </p>
                )}

                {/* No thanks link */}
                <button
                  onClick={() => handleClose(false)}
                  className="block w-full mt-4 text-sm text-gray-500 hover:text-gray-700 text-center"
                >
                  No thanks, I'll pass on this offer
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * Simplified version for specific use cases
 */
export function CartAbandonmentPopup() {
  return (
    <ExitIntentPopup
      offers={[defaultOffers[2]]} // Cart abandonment offer
      config={{
        targetPages: ['/cart', '/store'],
        maxShowsPerSession: 1
      }}
    />
  )
}

export function FirstVisitorPopup() {
  return (
    <ExitIntentPopup
      offers={[defaultOffers[0]]} // First-time discount
      config={{
        maxShowsPerSession: 1,
        maxShowsPerUser: 1
      }}
    />
  )
}
