'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuoteBasketStore } from '@/lib/stores/quote-basket-store'
// Direct format function using Intl to avoid module resolution issues
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(value)
import { ChevronRight, FileText, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function QuoteBasketClient() {
  const { items, removeItem, updateQuantity, updateNotes, clearBasket, totalPrice } =
    useQuoteBasketStore()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [quoteNumber, setQuoteNumber] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    roomDimensions: '',
    preferredTimeline: '',
    additionalDetails: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/quotes/basket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(item => ({
            productId: item.productId,
            slug: item.slug,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: item.quantity,
            variantId: item.variantId,
            variantName: item.variantName,
            notes: item.notes,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsSuccess(true)
        setQuoteNumber(data.quoteNumber || '')
        clearBasket()
      }
    } catch (error) {
      console.error('Quote submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <FileText className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mb-4 text-3xl font-bold">Quote Request Received!</h1>
            <p className="mb-2 text-lg text-muted-foreground">
              Thank you for your interest, {formData.name}!
            </p>
            <p className="mb-6 text-muted-foreground">
              {quoteNumber && (
                <span>
                  Quote Reference:{' '}
                  <span className="font-mono font-semibold">{quoteNumber}</span>
                </span>
              )}
            </p>
            <p className="mb-8 text-muted-foreground">
              Our team will review your request and get back to you within 24 hours with a detailed quote.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/products">
                <Button size="lg">Continue Shopping</Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline">
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="mb-4 text-2xl font-bold">Your Quote Basket is Empty</h1>
            <p className="mb-8 text-muted-foreground">
              Browse our collection of premium doors and add products to request a custom quote.
            </p>
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold md:text-3xl">Quote Basket</h1>
          <p className="mt-1 text-muted-foreground">
            Review your selections and submit for a custom quote
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmitQuote}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Basket Items */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Products ({items.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearBasket}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                {items.map(item => (
                  <BasketItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                    onUpdateNotes={updateNotes}
                  />
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(totalPrice())}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Final pricing may vary based on customization, installation requirements, and current promotions.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={value => setFormData(prev => ({ ...prev, projectType: value }))}
                    >
                      <SelectTrigger id="projectType">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new-installation">New Installation</SelectItem>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="replacement">Replacement</SelectItem>
                        <SelectItem value="commercial">Commercial Project</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="roomDimensions">Room Dimensions</Label>
                    <Input
                      id="roomDimensions"
                      name="roomDimensions"
                      value={formData.roomDimensions}
                      onChange={handleInputChange}
                      placeholder="e.g., 10ft x 12ft"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredTimeline">Timeline</Label>
                    <Select
                      value={formData.preferredTimeline}
                      onValueChange={value => setFormData(prev => ({ ...prev, preferredTimeline: value }))}
                    >
                      <SelectTrigger id="preferredTimeline">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As Soon As Possible</SelectItem>
                        <SelectItem value="1-month">Within 1 Month</SelectItem>
                        <SelectItem value="3-months">Within 3 Months</SelectItem>
                        <SelectItem value="6-months">Within 6 Months</SelectItem>
                        <SelectItem value="no-rush">No Rush</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="additionalDetails">Additional Details</Label>
                    <Textarea
                      id="additionalDetails"
                      name="additionalDetails"
                      value={formData.additionalDetails}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your project..."
                      rows={4}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Quote'}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By submitting, you agree to our terms of service and privacy policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

interface BasketItemCardProps {
  item: {
    id: string
    slug: string
    name: string
    category: string
    price: number
    image?: string
    quantity: number
    variantName?: string
    notes?: string
  }
  onRemove: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onUpdateNotes: (itemId: string, notes: string) => void
}

function BasketItemCard({ item, onRemove, onUpdateQuantity, onUpdateNotes }: BasketItemCardProps) {
  const [notes, setNotes] = useState(item.notes || '')

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex gap-4">
        {/* Product Image */}
        {item.image ? (
          <Link href={`/products/${item.slug}`} className="flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              className="h-24 w-24 rounded-md object-cover"
            />
          </Link>
        ) : (
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-md bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        {/* Product Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/products/${item.slug}`}
                className="inline-flex items-center gap-1 text-lg font-semibold hover:text-apple-blue-600"
              >
                {item.name}
                <ChevronRight className="h-4 w-4" />
              </Link>
              <p className="text-sm text-muted-foreground">{item.category}</p>
              {item.variantName && (
                <p className="text-sm text-muted-foreground">{item.variantName}</p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.id)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3 rounded-md border bg-background px-2 py-1">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="rounded p-1 hover:bg-muted"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="rounded p-1 hover:bg-muted"
                aria-label="Increase quantity"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <span className="text-xl font-bold">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>

          {/* Notes */}
          <div className="mt-3">
            <Input
              placeholder="Add notes for this item..."
              value={notes}
              onChange={e => {
                setNotes(e.target.value)
                onUpdateNotes(item.id, e.target.value)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
