"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { X, Tag, Clock, Zap, Gift, Star } from "lucide-react"

interface LimitedOffer {
  id: string
  title: string
  description: string
  discount: number
  type: 'percentage' | 'fixed' | 'bogo'
  code: string
  startTime: Date
  endTime: Date
  minOrder?: number
  maxUses?: number
  currentUses?: number
  category?: string
  urgency: 'low' | 'medium' | 'high'
}

const LIMITED_OFFERS: LimitedOffer[] = [
  {
    id: 'flash25',
    title: 'Flash Sale!',
    description: '25% off all closet organizers',
    discount: 25,
    type: 'percentage',
    code: 'FLASH25',
    startTime: new Date(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    minOrder: 100,
    urgency: 'high'
  },
  {
    id: 'weekend',
    title: 'Weekend Special',
    description: 'Free shipping + $10 off your order',
    discount: 10,
    type: 'fixed',
    code: 'WEEKEND10',
    startTime: new Date(),
    endTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    maxUses: 100,
    currentUses: 67,
    urgency: 'medium'
  },
  {
    id: 'bogo',
    title: 'Buy One Get One 50% Off',
    description: 'On selected accessories',
    discount: 50,
    type: 'bogo',
    code: 'BOGO50',
    startTime: new Date(),
    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    category: 'accessories',
    urgency: 'medium'
  }
]

export default function LimitedTimeOffer() {
  const [activeOffers, setActiveOffers] = useState<LimitedOffer[]>([])
  const [dismissedOffers, setDismissedOffers] = useState<Set<string>>(new Set())
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    // Filter active offers
    const now = new Date()
    const active = LIMITED_OFFERS.filter(offer =>
      now >= offer.startTime &&
      now <= offer.endTime &&
      !dismissedOffers.has(offer.id)
    )
    setActiveOffers(active)

    // Rotate through offers
    if (active.length > 0) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % active.length)
      }, 8000) // Change offer every 8 seconds

      return () => clearInterval(interval)
    }
  }, [dismissedOffers])

  useEffect(() => {
    if (activeOffers.length === 0) return

    const updateTimer = () => {
      const offer = activeOffers[currentOfferIndex]
      const now = new Date()
      const diff = offer.endTime.getTime() - now.getTime()

      if (diff <= 0) {
        // Remove expired offer
        setDismissedOffers(new Set([...dismissedOffers, offer.id]))
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
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [activeOffers, currentOfferIndex, dismissedOffers])

  if (activeOffers.length === 0) return null

  const currentOffer = activeOffers[currentOfferIndex]

  const handleDismiss = () => {
    setDismissedOffers(new Set([...dismissedOffers, currentOffer.id]))
  }

  const handleApplyOffer = () => {
    // Copy code to clipboard and redirect to cart
    navigator.clipboard.writeText(currentOffer.code)
    window.location.href = '/cart'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-amber-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="fixed top-20 left-0 right-0 z-40 p-4">
      <Card className={`max-w-4xl mx-auto ${getUrgencyColor(currentOffer.urgency)} border-0 text-white`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Offer Icon */}
              <div className="flex items-center gap-2">
                {currentOffer.urgency === 'high' ? (
                  <Zap className="w-6 h-6 animate-pulse" />
                ) : currentOffer.type === 'bogo' ? (
                  <Gift className="w-6 h-6" />
                ) : (
                  <Tag className="w-6 h-6" />
                )}
              </div>

              {/* Offer Content */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{currentOffer.title}</h3>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {timeLeft} left
                  </Badge>
                </div>
                <p className="text-sm opacity-90">{currentOffer.description}</p>
                <div className="flex items-center gap-4 mt-1">
                  <code className="bg-white/20 px-2 py-1 rounded text-sm">
                    {currentOffer.code}
                  </code>
                  {currentOffer.maxUses && (
                    <span className="text-xs opacity-75">
                      {currentOffer.currentUses}/{currentOffer.maxUses} claimed
                    </span>
                  )}
                  {currentOffer.minOrder && (
                    <span className="text-xs opacity-75">
                      Min $${currentOffer.minOrder}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleApplyOffer}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                Shop Now
              </Button>
              <button
                onClick={handleDismiss}
                className="text-white/70 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Bar for High Urgency */}
          {currentOffer.urgency === 'high' && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-xs mb-1">
                <Clock className="w-3 h-3" />
                <span>Limited time offer - expires soon!</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${((currentOffer.endTime.getTime() - Date.now()) / (currentOffer.endTime.getTime() - currentOffer.startTime.getTime())) * 100}%`
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Offer Dots Indicator */}
      {activeOffers.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {activeOffers.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentOfferIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}