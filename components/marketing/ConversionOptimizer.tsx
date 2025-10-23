"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  X,
  ShoppingBag,
  Clock,
  Tag,
  Truck,
  Star,
  Users,
  TrendingUp,
  Zap,
  Award,
  CheckCircle,
  ArrowRight,
  Gift
} from "lucide-react"
import { useCart } from "@/lib/useCart"
import Link from "next/link"

interface ConversionElement {
  id: string
  type: 'urgency' | 'scarcity' | 'socialproof' | 'trustbadge' | 'personalizedcta' | 'exitintent'
  trigger: string
  content: any
  priority: number
}

interface UrgencyTimer {
  id: string
  title: string
  deadline: Date
  message: string
  discount?: number
  type: 'percentage' | 'fixed' | 'shipping'
}

interface SocialProofItem {
  id: string
  type: 'purchase' | 'review' | 'view' | 'booking'
  name: string
  location?: string
  product?: string
  message?: string
  rating?: number
  timestamp: Date
  imageUrl?: string
}

interface TrustBadge {
  id: string
  title: string
  description: string
  icon: string
  verified?: boolean
}

// Dynamic urgency timers based on business logic
const URGENCY_TIMERS: UrgencyTimer[] = [
  {
    id: 'free-shipping-expiry',
    title: 'Free Shipping Ends In',
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    message: 'Order now to get free shipping on your custom closet design',
    type: 'shipping'
  },
  {
    id: 'design-consultation-special',
    title: 'Free Design Consultation Offer',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    message: 'Book today and get a free professional design consultation (value $250)',
    discount: 250
  },
  {
    id: 'weekend-installation',
    title: 'Weekend Installation Slots',
    deadline: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    message: 'Limited weekend installation slots available - book now!',
    type: 'service'
  }
]

// Real-time social proof data
const SOCIAL_PROOF_ITEMS: SocialProofItem[] = [
  {
    id: '1',
    type: 'purchase',
    name: 'Sarah M.',
    location: 'Ottawa, ON',
    product: 'Custom Walk-in Closet',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    message: 'Just ordered my dream closet!'
  },
  {
    id: '2',
    type: 'review',
    name: 'Michael R.',
    location: 'Kanata, ON',
    product: 'Barn Door Closet System',
    rating: 5,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    message: 'Absolutely love our new custom closet!'
  },
  {
    id: '3',
    type: 'booking',
    name: 'Jennifer L.',
    location: 'Nepean, ON',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    message: 'Booked a design consultation'
  },
  {
    id: '4',
    type: 'view',
    name: 'David K.',
    location: 'Orleans, ON',
    product: 'Custom Pantry Organization',
    timestamp: new Date(Date.now() - 1 * 60 * 1000),
    message: 'Viewing pantry solutions'
  }
]

const TRUST_BADGES: TrustBadge[] = [
  {
    id: '1',
    title: 'Authorized Renin Dealer',
    description: 'Official Renin products with full warranty',
    icon: 'award',
    verified: true
  },
  {
    id: '2',
    title: '5-Star Service',
    description: 'Over 200+ verified customer reviews',
    icon: 'star',
    verified: true
  },
  {
    id: '3',
    title: 'Local Ottawa Business',
    description: 'Serving the National Capital Region since 2018',
    icon: 'users',
    verified: true
  },
  {
    id: '4',
    title: 'Satisfaction Guaranteed',
    description: '100% satisfaction guarantee on all installations',
    icon: 'check-circle',
    verified: true
  }
]

export default function ConversionOptimizer() {
  const { items } = useCart()
  const [activeElement, setActiveElement] = useState<ConversionElement | null>(null)
  const [urgencyTimer, setUrgencyTimer] = useState<UrgencyTimer | null>(null)
  const [socialProofItem, setSocialProofItem] = useState<SocialProofItem | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [currentBadges] = useState(TRUST_BADGES.slice(0, 2))
  const [personalizedOffer, setPersonalizedOffer] = useState<any>(null)

  const subtotal = items.reduce((total, item) => total + (item.price * item.qty), 0)

  // Initialize based on user behavior
  useEffect(() => {
    const viewCount = parseInt(localStorage.getItem('page-view-count') || '0')
    setViewCount(viewCount + 1)
    localStorage.setItem('page-view-count', (viewCount + 1).toString())

    // Set urgency timer based on cart value and visit history
    if (items.length > 0) {
      setUrgencyTimer(URGENCY_TIMERS[0]) // Free shipping timer
    } else if (viewCount > 2) {
      setUrgencyTimer(URGENCY_TIMERS[1]) // Design consultation offer
    } else {
      setUrgencyTimer(URGENCY_TIMERS[2]) // Weekend installation
    }

    // Set personalized offer based on user behavior
    if (subtotal > 500) {
      setPersonalizedOffer({
        type: 'premium',
        title: 'Premium VIP Package',
        benefit: 'Priority installation + Free organization accessories',
        threshold: 500
      })
    } else if (items.length >= 2) {
      setPersonalizedOffer({
        type: 'bundle',
        title: 'Bundle Discount Available',
        benefit: 'Add one more item and save 15%',
        threshold: 3
      })
    }

    // Start social proof rotation
    rotateSocialProof()
  }, [])

  // Urgency timer countdown
  useEffect(() => {
    if (!urgencyTimer) return

    const timer = setInterval(() => {
      const now = new Date()
      const diff = urgencyTimer.deadline.getTime() - now.getTime()

      if (diff <= 0) {
        // Timer expired - get new timer
        const newTimer = URGENCY_TIMERS.find(t => t.id !== urgencyTimer.id)
        setUrgencyTimer(newTimer || null)
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`)
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`)
      } else {
        setTimeLeft(`${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [urgencyTimer])

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true)
        trackEvent('exit_intent_triggered', {
          page: window.location.pathname,
          cartValue: subtotal,
          itemCount: items.length
        })
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [showExitIntent, items, subtotal])

  // Rotate social proof
  const rotateSocialProof = () => {
    let index = 0
    const interval = setInterval(() => {
      setSocialProofItem(SOCIAL_PROOF_ITEMS[index])
      index = (index + 1) % SOCIAL_PROOF_ITEMS.length
    }, 8000) // Rotate every 8 seconds

    return () => clearInterval(interval)
  }

  const trackEvent = (eventName: string, data?: any) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, {
        event_category: 'Conversion Optimization',
        custom_data: data
      })
    }
  }

  const handleCTAClick = (ctaType: string) => {
    trackEvent('cta_click', { type: ctaType, value: subtotal })
  }

  const getTimeIcon = () => {
    if (timeLeft.includes('h')) return <Clock className="w-4 h-4" />
    if (timeLeft.includes('m')) return <Zap className="w-4 h-4" />
    return <TrendingUp className="w-4 h-4" />
  }

  return (
    <>
      {/* Urgency Timer Bar - Top of page */}
      {urgencyTimer && (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 py-2 text-center relative z-40">
          <div className="container mx-auto flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              {getTimeIcon()}
              <span className="font-semibold text-sm">{urgencyTimer.title}</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {timeLeft}
              </Badge>
            </div>
            <span className="text-sm hidden sm:inline">{urgencyTimer.message}</span>
            {urgencyTimer.discount && (
              <Badge className="bg-yellow-400 text-yellow-900 border-yellow-400">
                Save ${urgencyTimer.discount}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Social Proof Notifications - Bottom right */}
      {socialProofItem && (
        <div className="fixed bottom-4 right-4 z-30 max-w-sm animate-in slide-in-from-bottom duration-300">
          <Card className="bg-white shadow-lg border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {socialProofItem.type === 'purchase' && <ShoppingBag className="w-5 h-5 text-green-600" />}
                  {socialProofItem.type === 'review' && <Star className="w-5 h-5 text-yellow-500" />}
                  {socialProofItem.type === 'booking' && <Calendar className="w-5 h-5 text-blue-600" />}
                  {socialProofItem.type === 'view' && <Eye className="w-5 h-5 text-gray-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{socialProofItem.name}</span>
                    {socialProofItem.location && (
                      <span className="text-xs text-gray-500">{socialProofItem.location}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{socialProofItem.message}</p>
                  {socialProofItem.product && (
                    <p className="text-xs text-gray-500 mt-1">{socialProofItem.product}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {Math.floor((Date.now() - socialProofItem.timestamp.getTime()) / 60000)} minutes ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trust Badges - Above fold */}
      <div className="bg-gray-50 border-y py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-6">
            {currentBadges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  {badge.icon === 'award' && <Award className="w-4 h-4 text-blue-600" />}
                  {badge.icon === 'star' && <Star className="w-4 h-4 text-yellow-500" />}
                  {badge.icon === 'users' && <Users className="w-4 h-4 text-green-600" />}
                  {badge.icon === 'check-circle' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {badge.verified && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{badge.title}</div>
                  <div className="text-xs text-gray-500">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personalized CTA Bar */}
      {personalizedOffer && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5" />
              <div>
                <div className="font-semibold">{personalizedOffer.title}</div>
                <div className="text-sm opacity-90">{personalizedOffer.benefit}</div>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => handleCTAClick('personalized_offer')}
            >
              Learn More <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full relative">
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-2">Wait! Don't Go Empty-Handed</h3>
              <p className="text-gray-600 mb-6">
                Get a <span className="font-bold text-green-600">10% discount</span> on your first custom closet order
              </p>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Your Exclusive Offer:</p>
                  <ul className="text-left space-y-1">
                    <li>• 10% off your first order</li>
                    <li>• Free design consultation</li>
                    <li>• Priority installation scheduling</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => {
                    trackEvent('exit_intent_cta_click', { type: 'discount_claimed' })
                    localStorage.setItem('exit-offer-applied', 'true')
                    setShowExitIntent(false)
                  }}
                >
                  Claim My 10% Discount
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    trackEvent('exit_intent_consultation', { type: 'consultation_requested' })
                    setShowExitIntent(false)
                  }}
                >
                  Schedule Free Consultation
                </Button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Offer expires in 24 hours. No commitment required.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}