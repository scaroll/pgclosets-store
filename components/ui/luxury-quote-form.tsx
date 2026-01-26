'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import React from 'react'

export interface LuxuryQuoteFormProps {
  open: boolean
  onClose: () => void
  product?: { name: string; price?: number }
  selectedOptions?: Record<string, string>
}

export function LuxuryQuoteForm({ open, onClose, product, selectedOptions }: LuxuryQuoteFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    roomDimensions: '',
    preferredTimeline: '',
    productInterest: product?.name || '',
    additionalDetails: '',
  })

  // Update product interest when product changes
  React.useEffect(() => {
    if (product?.name) {
      setFormData((prev: typeof formData) => ({ ...prev, productInterest: product.name }))
    }
  }, [product?.name])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev: typeof formData) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsSubmitting(true)
    setIsSuccess(false)

    try {
      const response = await fetch('/api/quotes/quick', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          product: product?.name || formData.productInterest,
          selectedOptions: selectedOptions || {},
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          projectType: '',
          roomDimensions: '',
          preferredTimeline: '',
          productInterest: product?.name || '',
          additionalDetails: '',
        })
      }
    } catch (error) {
      console.error('Quote submission failed:', error)
      // const errorMessage = error instanceof Error ? error.message : 'Failed to submit quote request'
      // Could show error to user here if needed
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid max-h-[90vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
              Request a Quote
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-sm text-muted-foreground">
              Fill out the form below to receive a custom quote for your project.
            </DialogPrimitive.Description>
            {product && (
              <div className="text-sm text-muted-foreground">
                <div className="font-medium text-foreground">{product.name}</div>
                {product.price && <div className="text-xs">Starting at ${product.price}</div>}
              </div>
            )}
          </div>

          {isSuccess ? (
            <div className="py-8 text-center">
              <p className="text-lg font-medium text-green-600">Quote request received!</p>
              <p className="mt-2 text-sm text-muted-foreground">We&apos;ll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={e => void handleSubmit(e)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a project type</option>
                  <option value="new-installation">New Installation</option>
                  <option value="renovation">Renovation</option>
                  <option value="replacement">Replacement</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomDimensions">Room Dimensions</Label>
                <Input
                  id="roomDimensions"
                  name="roomDimensions"
                  type="text"
                  value={formData.roomDimensions}
                  onChange={handleInputChange}
                  placeholder="e.g., 10ft x 12ft"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTimeline">Preferred Timeline</Label>
                <select
                  id="preferredTimeline"
                  name="preferredTimeline"
                  value={formData.preferredTimeline}
                  onChange={handleInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a timeline</option>
                  <option value="asap">As Soon As Possible</option>
                  <option value="1-month">Within 1 Month</option>
                  <option value="3-months">Within 3 Months</option>
                  <option value="6-months">Within 6 Months</option>
                  <option value="no-rush">No Rush</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productInterest">Product Interest</Label>
                <Input
                  id="productInterest"
                  name="productInterest"
                  type="text"
                  value={formData.productInterest}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalDetails">Additional Details</Label>
                <Textarea
                  id="additionalDetails"
                  name="additionalDetails"
                  value={formData.additionalDetails}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us more about your project..."
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? 'Submitting...' : 'Get Quote'}
                </Button>
              </div>
            </form>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
