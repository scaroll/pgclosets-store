# Agent #42: Wishlist & Favorites Implementation Guide

## Overview

Complete enhancement of the existing wishlist system to include sharing, price tracking, email notifications, and seamless user synchronization.

---

## Current State Analysis

### ✅ What Exists
- `/lib/wishlist-store.ts` - Basic Zustand store with localStorage persistence
- `/app/wishlist/page.tsx` - Basic wishlist display page
- Basic add/remove functionality

### ⚠️ What's Missing
- Sharing functionality (email, social media, shareable links)
- Price drop tracking and notifications
- Email reminders for abandoned wishlist items
- User account synchronization
- Guest-to-registered user migration
- Wishlist analytics
- Product recommendations

---

## Implementation Plan

### Phase 1: Enhanced Store (Week 1)

**File**: `/lib/customer-experience/wishlist/enhanced-wishlist-store.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice: number
  image: string
  url: string
  sku?: string
  variant?: string
  addedAt: Date
  lastPriceCheck?: Date
  priceHistory: Array<{ price: number; date: Date }>
  notifyOnPriceDrop: boolean
  notes?: string
}

export interface WishlistShare {
  id: string
  wishlistId: string
  shareLink: string
  expiresAt?: Date
  views: number
  createdAt: Date
}

interface EnhancedWishlistStore {
  // Items
  items: WishlistItem[]

  // Actions
  addItem: (item: Omit<WishlistItem, 'addedAt' | 'priceHistory'>) => void
  removeItem: (id: string) => void
  updateItemPrice: (id: string, newPrice: number) => void
  togglePriceNotification: (id: string) => void
  addNote: (id: string, note: string) => void

  // Sharing
  shares: WishlistShare[]
  createShareLink: () => Promise<string>
  getShareLink: (shareId: string) => WishlistShare | null

  // Analytics
  getItemCount: () => number
  getTotalValue: () => number
  getPriceDropItems: () => WishlistItem[]
  getMostWishlisted: () => WishlistItem[]

  // Sync
  syncWithUser: (userId: string) => Promise<void>
  migrateGuestToUser: (userId: string) => Promise<void>

  // Cleanup
  clearWishlist: () => void
  removeExpiredItems: () => void
}
```

### Phase 2: Sharing Functionality (Week 1)

**File**: `/components/customer-experience/wishlist/WishlistShareModal.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Share2, Mail, Facebook, Twitter, Link as LinkIcon, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface WishlistShareModalProps {
  isOpen: boolean
  onClose: () => void
  wishlistId: string
  itemCount: number
}

export function WishlistShareModal({ isOpen, onClose, wishlistId, itemCount }: WishlistShareModalProps) {
  const [shareLink, setShareLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  const generateShareLink = async () => {
    setGenerating(true)
    try {
      // Call API to generate shareable link
      const response = await fetch('/api/wishlist/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wishlistId })
      })

      const { shareLink } = await response.json()
      setShareLink(shareLink)

      toast.success('Share link created!')
    } catch (error) {
      toast.error('Failed to create share link')
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareLink)
    setCopied(true)
    toast.success('Link copied to clipboard!')

    setTimeout(() => setCopied(false), 2000)
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Check out my wishlist from PG Closets!')
    const body = encodeURIComponent(`I've been browsing closet solutions at PG Closets. Here's my wishlist with ${itemCount} items:\n\n${shareLink}`)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const shareViaFacebook = () => {
    const url = encodeURIComponent(shareLink)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
  }

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Check out my closet wishlist from PG Closets!`)
    const url = encodeURIComponent(shareLink)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Wishlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!shareLink ? (
            <Button
              onClick={generateShareLink}
              disabled={generating}
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : 'Generate Share Link'}
            </Button>
          ) : (
            <>
              {/* Copy Link */}
              <div className="flex gap-2">
                <Input
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="icon"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Social Sharing */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  onClick={shareViaEmail}
                  variant="outline"
                  className="flex-col h-auto py-3"
                >
                  <Mail className="w-5 h-5 mb-1" />
                  <span className="text-xs">Email</span>
                </Button>

                <Button
                  onClick={shareViaFacebook}
                  variant="outline"
                  className="flex-col h-auto py-3"
                >
                  <Facebook className="w-5 h-5 mb-1" />
                  <span className="text-xs">Facebook</span>
                </Button>

                <Button
                  onClick={shareViaTwitter}
                  variant="outline"
                  className="flex-col h-auto py-3"
                >
                  <Twitter className="w-5 h-5 mb-1" />
                  <span className="text-xs">Twitter</span>
                </Button>
              </div>

              {/* Stats */}
              <div className="text-sm text-muted-foreground text-center">
                Your wishlist contains {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Phase 3: Price Tracking (Week 2)

**File**: `/lib/customer-experience/wishlist/price-tracking.ts`

```typescript
import { WishlistItem } from './enhanced-wishlist-store'

export interface PriceAlert {
  id: string
  itemId: string
  userId?: string
  email: string
  originalPrice: number
  currentPrice: number
  dropPercentage: number
  notified: boolean
  createdAt: Date
  notifiedAt?: Date
}

export class PriceTracker {
  /**
   * Check for price drops on all wishlist items
   */
  static async checkPriceDrops(items: WishlistItem[]): Promise<PriceAlert[]> {
    const alerts: PriceAlert[] = []

    for (const item of items) {
      if (!item.notifyOnPriceDrop) continue

      // Fetch current price from product API
      const currentPrice = await this.fetchCurrentPrice(item.productId)

      if (currentPrice < item.price) {
        const dropPercentage = ((item.price - currentPrice) / item.price) * 100

        // Only alert if drop is significant (>5%)
        if (dropPercentage >= 5) {
          alerts.push({
            id: `${item.id}-${Date.now()}`,
            itemId: item.id,
            email: '', // Set from user profile
            originalPrice: item.price,
            currentPrice,
            dropPercentage,
            notified: false,
            createdAt: new Date()
          })
        }
      }
    }

    return alerts
  }

  /**
   * Send price drop notification emails
   */
  static async sendPriceDropNotifications(alerts: PriceAlert[]): Promise<void> {
    for (const alert of alerts) {
      if (alert.notified) continue

      try {
        await fetch('/api/email/price-drop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: alert.email,
            itemId: alert.itemId,
            originalPrice: alert.originalPrice,
            newPrice: alert.currentPrice,
            savings: alert.originalPrice - alert.currentPrice,
            percentage: alert.dropPercentage
          })
        })

        alert.notified = true
        alert.notifiedAt = new Date()
      } catch (error) {
        console.error('Failed to send price drop notification:', error)
      }
    }
  }

  /**
   * Fetch current price from product API
   */
  private static async fetchCurrentPrice(productId: string): Promise<number> {
    try {
      const response = await fetch(`/api/products/${productId}`)
      const product = await response.json()
      return parseFloat(product.price) || 0
    } catch (error) {
      console.error('Failed to fetch product price:', error)
      return 0
    }
  }

  /**
   * Get price history for an item
   */
  static getPriceHistory(item: WishlistItem): Array<{ price: number; date: Date }> {
    return item.priceHistory.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }

  /**
   * Calculate price trend (rising, falling, stable)
   */
  static getPriceTrend(item: WishlistItem): 'rising' | 'falling' | 'stable' {
    const history = this.getPriceHistory(item)
    if (history.length < 2) return 'stable'

    const recentPrice = history[0].price
    const olderPrice = history[history.length - 1].price

    if (recentPrice < olderPrice * 0.95) return 'falling'
    if (recentPrice > olderPrice * 1.05) return 'rising'
    return 'stable'
  }
}

// Cron job function (run daily)
export async function dailyPriceCheck() {
  // This would be called from a cron job or scheduled function
  console.log('Running daily price check...')

  // Get all wishlists with price notifications enabled
  // Check prices
  // Send notifications
  // Update price history
}
```

### Phase 4: Email Automation (Week 2)

**Email Templates**:

1. **Price Drop Alert**
```typescript
// /emails/price-drop-alert.tsx
export function PriceDropEmail({
  productName,
  originalPrice,
  newPrice,
  savings,
  percentage,
  productUrl,
  productImage
}) {
  return (
    <div>
      <h1>Price Drop Alert! 🎉</h1>
      <p>Great news! A product on your wishlist has dropped in price.</p>

      <div>
        <img src={productImage} alt={productName} />
        <h2>{productName}</h2>
        <p>
          <span style={{ textDecoration: 'line-through' }}>${originalPrice}</span>
          <span style={{ color: 'green', fontSize: '24px' }}> ${newPrice}</span>
        </p>
        <p>You save ${savings} ({percentage}% off)!</p>
      </div>

      <a href={productUrl}>View Product</a>
    </div>
  )
}
```

2. **Wishlist Reminder**
```typescript
// /emails/wishlist-reminder.tsx
export function WishlistReminderEmail({
  items,
  daysSinceAdded
}) {
  return (
    <div>
      <h1>Don't forget about your wishlist! 💝</h1>
      <p>You added {items.length} items {daysSinceAdded} days ago.</p>

      <div>
        {items.map(item => (
          <div key={item.id}>
            <img src={item.image} alt={item.name} />
            <h3>{item.name}</h3>
            <p>${item.price}</p>
          </div>
        ))}
      </div>

      <a href="/wishlist">View Your Wishlist</a>
    </div>
  )
}
```

---

## API Endpoints

### POST /api/wishlist/share
Create shareable wishlist link

```typescript
// /app/api/wishlist/share/route.ts
export async function POST(request: Request) {
  const { wishlistId } = await request.json()

  const shareId = generateUniqueId()
  const shareLink = `${process.env.NEXT_PUBLIC_URL}/wishlist/shared/${shareId}`

  // Save to database
  await db.wishlistShare.create({
    data: {
      id: shareId,
      wishlistId,
      shareLink,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      views: 0
    }
  })

  return Response.json({ shareLink })
}
```

### GET /api/wishlist/shared/[shareId]
View shared wishlist

```typescript
// /app/api/wishlist/shared/[shareId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { shareId: string } }
) {
  const share = await db.wishlistShare.findUnique({
    where: { id: params.shareId },
    include: { wishlist: { include: { items: true } } }
  })

  if (!share || (share.expiresAt && share.expiresAt < new Date())) {
    return Response.json({ error: 'Wishlist not found or expired' }, { status: 404 })
  }

  // Increment view count
  await db.wishlistShare.update({
    where: { id: params.shareId },
    data: { views: { increment: 1 } }
  })

  return Response.json(share)
}
```

---

## Analytics Events

```typescript
// Track wishlist interactions
export const wishlistEvents = {
  ADD: 'wishlist_item_added',
  REMOVE: 'wishlist_item_removed',
  SHARE: 'wishlist_shared',
  VIEW_SHARED: 'shared_wishlist_viewed',
  PRICE_DROP: 'wishlist_price_drop_detected',
  NOTIFICATION_SENT: 'wishlist_notification_sent',
  CONVERT: 'wishlist_item_purchased'
}

// Usage
trackEvent(wishlistEvents.ADD, {
  productId: product.id,
  productName: product.name,
  price: product.price,
  category: product.category
})
```

---

## Success Metrics

### KPIs to Track
- Wishlist creation rate
- Items per wishlist (avg)
- Wishlist-to-purchase conversion rate
- Share rate
- Price notification open rate
- Return visit rate from wishlist users

### Target Metrics
- **Wishlist Usage**: >15% of site visitors
- **Conversion Rate**: >25% wishlist to purchase
- **Share Rate**: >10% of wishlists shared
- **Email Open Rate**: >40% for price drops
- **Return Visits**: >50% return within 30 days

---

## Testing Checklist

- [ ] Add items to wishlist (guest)
- [ ] Add items to wishlist (logged in)
- [ ] Remove items from wishlist
- [ ] Share wishlist via link
- [ ] Share wishlist via email
- [ ] Share wishlist via social media
- [ ] View shared wishlist
- [ ] Receive price drop notification
- [ ] Enable/disable price notifications
- [ ] Wishlist syncs across devices (logged in)
- [ ] Guest wishlist migrates after signup
- [ ] Wishlist persists in localStorage
- [ ] Mobile experience is optimal
- [ ] Analytics events fire correctly

---

## Next Steps

1. Implement enhanced wishlist store
2. Build sharing modal component
3. Create price tracking system
4. Set up email automation
5. Implement analytics tracking
6. Test all functionality
7. Deploy and monitor

---

**Last Updated**: October 14, 2025
**Status**: Ready for Implementation
**Estimated Completion**: 2 weeks
