"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ShoppingBag, Clock, Tag, Truck } from "lucide-react"
import { useCart } from "@/lib/useCart"
import Link from "next/link"

interface AbandonedCartOffer {
  id: string
  title: string
  discount: number
  type: 'percentage' | 'fixed'
  description: string
  expiry: Date
  minOrder?: number
}

const ABANDONED_OFFERS: AbandonedCartOffer[] = [
  {
    id: ' comeback10',
    title: 'Come Back and Save!',
    discount: 10,
    type: 'percentage',
    description: 'Complete your order now and save 10%',
    expiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    minOrder: 50
  },
  {
    id: 'freeship',
    title: 'Free Shipping on Us!',
    discount: 25,
    type: 'fixed',
    description: 'We\'ll cover your shipping costs',
    expiry: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
    minOrder: 75
  },
  {
    id: 'urgent15',
    title: 'Last Chance - 15% Off',
    discount: 15,
    type: 'percentage',
    description: 'Your cart is waiting! Complete your order',
    expiry: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    minOrder: 100
  }
]

export default function AbandonedCartRecovery() {
  const { items } = useCart()
  const [showPopup, setShowPopup] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<AbandonedCartOffer | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [dismissedOffers, setDismissedOffers] = useState<Set<string>>(new Set())

  const subtotal = items.reduce((total, item) => total + (item.price * item.qty), 0)

  useEffect(() => {
    // Check if user has items in cart and has been inactive
    if (items.length === 0) return

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem('cart-last-activity')
      const cartAddedTime = localStorage.getItem('cart-added-time')

      if (lastActivity && cartAddedTime) {
        const inactiveTime = Date.now() - parseInt(lastActivity)
        const cartAge = Date.now() - parseInt(cartAddedTime)

        // Show popup after 30 minutes of inactivity or 2 hours after adding to cart
        if ((inactiveTime > 30 * 60 * 1000 || cartAge > 2 * 60 * 60 * 1000) && !showPopup) {
          triggerAbandonedCartRecovery()
        }
      }
    }

    // Update activity tracker
    const updateActivity = () => {
      localStorage.setItem('cart-last-activity', Date.now().toString())
    }

    // Initialize cart timestamp if not exists
    if (!localStorage.getItem('cart-added-time')) {
      localStorage.setItem('cart-added-time', Date.now().toString())
    }

    updateActivity()
    const interval = setInterval(checkInactivity, 60000) // Check every minute

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, updateActivity)
    })

    return () => {
      clearInterval(interval)
      events.forEach(event => {
        document.removeEventListener(event, updateActivity)
      })
    }
  }, [items.length, showPopup])

  useEffect(() => {
    if (!currentOffer) return

    const timer = setInterval(() => {
      const now = new Date()
      const diff = currentOffer.expiry.getTime() - now.getTime()

      if (diff <= 0) {
        setShowPopup(false)
        setCurrentOffer(null)
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
  }, [currentOffer])

  const triggerAbandonedCartRecovery = () => {
    // Select appropriate offer based on cart value
    let selectedOffer = ABANDONED_OFFERS[0]

    if (subtotal >= 100) {
      selectedOffer = ABANDONED_OFFERS[2] // 15% off for higher value carts
    } else if (subtotal >= 50) {
      selectedOffer = ABANDONED_OFFERS[1] // Free shipping for mid-range
    }

    if (!dismissedOffers.has(selectedOffer.id)) {
      setCurrentOffer(selectedOffer)
      setShowPopup(true)
    }
  }

  const handleApplyOffer = () => {
    if (currentOffer) {
      // Store the offer in localStorage for checkout page
      localStorage.setItem('applied-offer', JSON.stringify(currentOffer))
      setShowPopup(false)
      window.location.href = '/cart'
    }
  }

  const handleDismiss = () => {
    if (currentOffer) {
      setDismissedOffers(new Set([...dismissedOffers, currentOffer.id]))
      setShowPopup(false)
      setCurrentOffer(null)
    }
  }

  const handleSnooze = () => {
    setShowPopup(false)
    // Show again in 30 minutes
    setTimeout(() => {
      if (items.length > 0 && currentOffer) {
        setShowPopup(true)
      }
    }, 30 * 60 * 1000)
  }

  if (!showPopup || !currentOffer) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full relative">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{currentOffer.title}</h3>
            <Badge variant="destructive" className="mb-2">
              Expires in {timeLeft}
            </Badge>
            <p className="text-gray-600 text-sm">{currentOffer.description}</p>
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Your Cart</span>
              <span className="text-sm text-gray-600">{items.length} items</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              {items.slice(0, 2).map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span className="truncate">{item.title}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              {items.length > 2 && (
                <div className="text-center text-xs text-gray-500">
                  +{items.length - 2} more items
                </div>
              )}
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Offer Details */}
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Your Special Offer</span>
            </div>
            <p className="text-green-800">
              {currentOffer.type === 'percentage'
                ? `Save ${currentOffer.discount}% on your order`
                : `Save $${currentOffer.discount} on your order`
              }
              {currentOffer.minOrder && subtotal < currentOffer.minOrder && (
                <span className="block text-xs mt-1">
                  Add ${(currentOffer.minOrder - subtotal).toFixed(2)} more to unlock
                </span>
              )}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="w-4 h-4" />
              <span>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingBag className="w-4 h-4" />
              <span>Secure checkout process</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleApplyOffer}
              className="w-full"
              disabled={currentOffer.minOrder ? subtotal < currentOffer.minOrder : false}
            >
              {currentOffer.minOrder && subtotal < currentOffer.minOrder
                ? `Add $${(currentOffer.minOrder - subtotal).toFixed(2)} more to unlock offer`
                : `Apply ${currentOffer.type === 'percentage' ? currentOffer.discount + '%' : '$' + currentOffer.discount} discount`
              }
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSnooze} className="flex-1">
                Remind Me Later
              </Button>
              <Button variant="ghost" onClick={handleDismiss} className="flex-1">
                No Thanks
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Limited time offer. Cannot be combined with other promotions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}