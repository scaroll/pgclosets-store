'use client'

import { useState, FormEvent } from 'react'
import { Bell, Check, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StockNotificationProps {
  productId: string
  productName: string
  className?: string
}

type NotificationState = 'idle' | 'submitting' | 'success' | 'error'

export function StockNotification({
  productId,
  productName,
  className,
}: StockNotificationProps) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<NotificationState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Check if user has already subscribed for this product
  const storageKey = `stock-notify-${productId}`
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(storageKey) !== null
    }
    return false
  })

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.trim()) {
      setErrorMessage('Please enter your email address')
      setState('error')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address')
      setState('error')
      return
    }

    setState('submitting')
    setErrorMessage('')

    try {
      // Send to API endpoint
      const response = await fetch('/api/products/stock-notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          productId,
          productName,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to subscribe to stock notification')
      }

      // Store in localStorage
      const notificationData = {
        email: email.trim(),
        productId,
        productName,
        subscribedAt: new Date().toISOString(),
      }
      localStorage.setItem(storageKey, JSON.stringify(notificationData))

      // Also store in a master list for tracking all subscriptions
      const allSubscriptions = JSON.parse(
        localStorage.getItem('stock-notifications-all') || '[]'
      )
      allSubscriptions.push(notificationData)
      localStorage.setItem('stock-notifications-all', JSON.stringify(allSubscriptions))

      setState('success')
      setIsAlreadySubscribed(true)

      // Reset form after 5 seconds
      setTimeout(() => {
        setEmail('')
      }, 5000)
    } catch (error) {
      console.error('Error subscribing to stock notification:', error)
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to subscribe. Please try again.'
      )
      setState('error')

      // Reset error state after 5 seconds
      setTimeout(() => {
        setState('idle')
        setErrorMessage('')
      }, 5000)
    }
  }

  if (isAlreadySubscribed && state === 'success') {
    return (
      <div className={cn('w-full', className)}>
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex-shrink-0">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              You&apos;re all set!
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
              We&apos;ll email you when {productName} is back in stock.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="p-6 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 mt-0.5">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold mb-1">
              Notify me when available
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll let you know when this item is back in stock.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="stock-notify-email" className="sr-only">
              Email address
            </label>
            <input
              id="stock-notify-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={state === 'submitting' || state === 'success'}
              className={cn(
                'w-full px-4 py-2.5 text-sm rounded-md border bg-background',
                'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors',
                state === 'error' && 'border-red-500 focus:ring-red-500'
              )}
              aria-invalid={state === 'error'}
              aria-describedby={state === 'error' ? 'email-error' : undefined}
            />
          </div>

          {state === 'error' && errorMessage && (
            <div
              id="email-error"
              className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {state === 'success' && (
            <div
              className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
              role="status"
            >
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Successfully subscribed! We&apos;ll email you when it&apos;s back.</span>
            </div>
          )}

          <Button
            type="submit"
            disabled={state === 'submitting' || state === 'success'}
            className="w-full"
            size="lg"
          >
            {state === 'submitting' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </>
            ) : state === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                Subscribed
              </>
            ) : (
              <>
                <Bell className="w-4 h-4" />
                Notify Me
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-3 text-center">
          We respect your privacy. Your email will only be used for stock notifications.
        </p>
      </div>
    </div>
  )
}
