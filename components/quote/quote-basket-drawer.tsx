'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useQuoteBasketStore, type QuoteBasketItem } from '@/lib/stores/quote-basket-store'
import { ChevronRight, FileText, ShoppingBag, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

// Direct format function using Intl to avoid module resolution issues
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(value)

export function QuoteBasketDrawer() {
  const {
    items,
    isOpen,
    closeBasket,
    removeItem,
    updateQuantity,
    updateNotes,
    clearBasket,
    totalPrice,
  } = useQuoteBasketStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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

  const handleSubmitQuote = async () => {
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
        setIsSuccess(true)
        clearBasket()
        setTimeout(() => {
          closeBasket()
          setIsSuccess(false)
        }, 3000)
      }
    } catch (error) {
      console.error('Quote submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateItemNotes = (itemId: string, notes: string) => {
    updateNotes(itemId, notes)
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeBasket}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="space-y-2 px-1">
          <SheetTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-apple-blue-600" />
            Quote Basket
            {items.length > 0 && (
              <span className="bg-apple-blue-100 text-apple-blue-700 dark:bg-apple-blue-900/30 dark:text-apple-blue-300 ml-2 rounded-full px-2.5 py-0.5 text-sm font-semibold">
                {items.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            )}
          </SheetTitle>
          <SheetDescription>Add products and submit for a custom quote</SheetDescription>
        </SheetHeader>

        {isSuccess ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold">Quote Request Sent!</h3>
              <p className="mt-2 text-muted-foreground">
                We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold">Your quote basket is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add products to request a custom quote
              </p>
            </div>
            <Link href="/products" onClick={closeBasket}>
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-1 py-4">
              <div className="space-y-4">
                {items.map(item => (
                  <QuoteBasketItemCard
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                    onUpdateNotes={updateItemNotes}
                  />
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="border-t px-1 pt-4">
              <h4 className="mb-3 font-semibold">Your Contact Details</h4>
              <div className="space-y-3">
                <Input
                  placeholder="Your Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email Address *"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <Input
                  placeholder="Project Type (New, Renovation, etc.)"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                />
                <Textarea
                  placeholder="Any additional details..."
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>
            </div>

            {/* Footer */}
            <SheetFooter className="border-t pt-4">
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(totalPrice())}</span>
                </div>
                <Button
                  onClick={handleSubmitQuote}
                  disabled={isSubmitting || !formData.name || !formData.email}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Request Quote'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={clearBasket}
                  className="w-full text-muted-foreground hover:text-destructive"
                  size="sm"
                >
                  Clear Basket
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

interface QuoteBasketItemCardProps {
  item: QuoteBasketItem
  onRemove: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onUpdateNotes: (itemId: string, notes: string) => void
}

function QuoteBasketItemCard({
  item,
  onRemove,
  onUpdateQuantity,
  onUpdateNotes,
}: QuoteBasketItemCardProps) {
  const [notes, setNotes] = useState(item.notes || '')

  return (
    <div className="hover:border-apple-blue-200 dark:hover:border-apple-blue-900 group relative rounded-lg border bg-card p-3 transition-colors">
      <button
        onClick={() => onRemove(item.id)}
        className="absolute right-2 top-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
        aria-label="Remove item"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-3">
        {/* Product Image */}
        {item.image ? (
          <Link
            href={`/products/${item.slug}`}
            className="flex-shrink-0"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={item.image}
              alt={item.name}
              width={80}
              height={80}
              className="h-20 w-20 rounded-md object-cover"
            />
          </Link>
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-muted">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        {/* Product Info */}
        <div className="min-w-0 flex-1">
          <Link
            href={`/products/${item.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium hover:text-apple-blue-600"
            onClick={e => e.stopPropagation()}
          >
            {item.name}
            <ChevronRight className="h-3 w-3" />
          </Link>

          {item.variantName && <p className="text-xs text-muted-foreground">{item.variantName}</p>}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 rounded-md border bg-background">
              <button
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                className="px-2 py-1 text-sm hover:bg-muted"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 text-sm hover:bg-muted"
              >
                +
              </button>
            </div>
            <span className="text-sm font-semibold">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>

          {/* Notes Input */}
          <div className="mt-2">
            <Input
              placeholder="Add notes for this item..."
              value={notes}
              onChange={e => {
                setNotes(e.target.value)
                onUpdateNotes(item.id, e.target.value)
              }}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Check({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
