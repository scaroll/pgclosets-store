"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useQuote } from "@/hooks/useQuote"
import { QuoteItemCard } from "@/components/quote/QuoteItemCard"
import { QuoteContactForm } from "@/components/quote/QuoteContactForm"
import type { QuoteFormData } from "@/lib/types/quote"
import { trackCTAClick, trackQuoteStart, trackMeasurementHelperClick } from "@/lib/analytics/events"
import { ArrowLeft, FileText } from "lucide-react"

export default function QuotePage() {
  const { items, itemCount, subtotal, tax, total, updateQuantity, removeItem, clearQuote } = useQuote()
  const [showContactForm, setShowContactForm] = useState(false)

  const handleSubmitQuote = async (formData: QuoteFormData) => {
    // Here you would typically send the quote to your backend
    // For now, we'll just simulate a successful submission
    console.log("Quote request:", {
      items,
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      projectDetails: {
        projectType: formData.projectType,
        timeline: formData.timeline,
        budget: formData.budget,
        notes: formData.notes,
      },
      subtotal,
      tax,
      total,
    })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Clear quote after successful submission
    clearQuote()
  }

  if (items.length === 0 && !showContactForm) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-4xl font-extralight tracking-tight text-gray-900 mb-4">
              Your Quote Request is Empty
            </h1>
            <p className="text-gray-600 font-light tracking-wide mb-8 text-lg">
              Add products to your quote to get a customized estimate from our team
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" variant="primary">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/cart">View Cart</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 -ml-2">
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extralight tracking-tight text-gray-900 mb-2">
                Quote Request
              </h1>
              <p className="text-gray-600 font-light tracking-wide">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your quote
              </p>
            </div>

            {items.length > 0 && !showContactForm && (
              <Button
                variant="outline"
                onClick={clearQuote}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                Clear All Items
              </Button>
            )}
          </div>
        </div>

        {showContactForm ? (
          /* Contact Form View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <QuoteContactForm onSubmit={handleSubmitQuote} />
            </div>

            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Quote Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3 py-2">
                        <div className="w-12 h-12 relative flex-shrink-0 bg-gray-50 rounded overflow-hidden border border-gray-200">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold whitespace-nowrap">
                          ${(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${subtotal.toLocaleString()} CAD</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">HST (13%):</span>
                      <span className="font-medium">${tax.toLocaleString()} CAD</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-semibold pt-2">
                      <span>Estimated Total:</span>
                      <span>${total.toLocaleString()} CAD</span>
                    </div>
                  </div>

                  <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-4 text-sm text-[var(--color-text-body)]">
                    <p className="font-medium mb-1">Note:</p>
                    <p>This is an estimated total. Final pricing will be confirmed in your quote.</p>
                  </div>

                  <Button variant="outline" onClick={() => setShowContactForm(false)} className="w-full">
                    Back to Quote Items
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Quote Items View */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quote Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <QuoteItemCard
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}

              {/* Mobile Summary (visible only on mobile) */}
              <Card className="lg:hidden">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${subtotal.toLocaleString()} CAD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">HST (13%):</span>
                      <span className="font-medium">${tax.toLocaleString()} CAD</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Estimated Total:</span>
                      <span>${total.toLocaleString()} CAD</span>
                    </div>
                    <Button
                      size="lg"
                      variant="primary"
                      className="w-full mt-4"
                      onClick={() => {
                        trackQuoteStart({ items: itemCount, total });
                        setShowContactForm(true);
                      }}
                    >
                      Get Free Quote
                    </Button>
                    {/* Reassurance Copy - Mobile */}
                    <p className="text-sm text-gray-600 text-center mt-2">
                      No obligation • Reply within 24h
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desktop Summary (visible only on desktop) */}
            <div className="hidden lg:block">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Quote Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${subtotal.toLocaleString()} CAD</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">HST (13%):</span>
                      <span className="font-medium">${tax.toLocaleString()} CAD</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-semibold pt-2">
                      <span>Estimated Total:</span>
                      <span>${total.toLocaleString()} CAD</span>
                    </div>
                  </div>

                  <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-4 text-sm text-[var(--color-text-body)]">
                    <p className="font-medium mb-1">What happens next?</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Submit your information</li>
                      <li>Receive a detailed quote within 24 hours</li>
                      <li>Schedule a consultation if needed</li>
                      <li>Approve and proceed with your order</li>
                    </ul>
                  </div>

                  <Button
                    size="lg"
                    variant="primary"
                    className="w-full"
                    onClick={() => {
                      trackQuoteStart({ items: itemCount, total });
                      setShowContactForm(true);
                    }}
                  >
                    Get Free Quote
                  </Button>

                  {/* Reassurance Copy */}
                  <p className="text-sm text-gray-600 text-center mt-2">
                    No obligation • Reply within 24h
                  </p>

                  {/* Measurement Helper */}
                  <p className="text-sm text-center mt-2">
                    <Link
                      href="/book-measure"
                      className="text-blue-600 hover:underline"
                      onClick={() => trackMeasurementHelperClick({ location: 'quote-page' })}
                    >
                      Need help measuring? View our guide →
                    </Link>
                  </p>

                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/products">Add More Items</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
