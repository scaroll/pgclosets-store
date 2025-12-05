/**
 * Utility functions for managing stock notifications in localStorage
 * These functions can be used across the application to manage stock notification data
 */

export interface StoredStockNotification {
  email: string
  productId: string
  productName: string
  subscribedAt: string
}

const STORAGE_KEY_PREFIX = 'stock-notify-'
const ALL_NOTIFICATIONS_KEY = 'stock-notifications-all'

/**
 * Check if user has subscribed to notifications for a specific product
 */
export function hasSubscribed(productId: string): boolean {
  if (typeof window === 'undefined') return false

  const key = `${STORAGE_KEY_PREFIX}${productId}`
  return localStorage.getItem(key) !== null
}

/**
 * Get subscription data for a specific product
 */
export function getSubscription(productId: string): StoredStockNotification | null {
  if (typeof window === 'undefined') return null

  const key = `${STORAGE_KEY_PREFIX}${productId}`
  const data = localStorage.getItem(key)

  if (!data) return null

  try {
    return JSON.parse(data) as StoredStockNotification
  } catch {
    return null
  }
}

/**
 * Get all stock notification subscriptions
 */
export function getAllSubscriptions(): StoredStockNotification[] {
  if (typeof window === 'undefined') return []

  const data = localStorage.getItem(ALL_NOTIFICATIONS_KEY)

  if (!data) return []

  try {
    return JSON.parse(data) as StoredStockNotification[]
  } catch {
    return []
  }
}

/**
 * Remove a specific subscription (e.g., when product is back in stock)
 */
export function removeSubscription(productId: string): void {
  if (typeof window === 'undefined') return

  const key = `${STORAGE_KEY_PREFIX}${productId}`
  localStorage.removeItem(key)

  // Also remove from the master list
  const allSubscriptions = getAllSubscriptions()
  const filtered = allSubscriptions.filter((sub) => sub.productId !== productId)
  localStorage.setItem(ALL_NOTIFICATIONS_KEY, JSON.stringify(filtered))
}

/**
 * Clear all stock notification subscriptions
 */
export function clearAllSubscriptions(): void {
  if (typeof window === 'undefined') return

  const allSubscriptions = getAllSubscriptions()

  // Remove individual keys
  allSubscriptions.forEach((sub) => {
    const key = `${STORAGE_KEY_PREFIX}${sub.productId}`
    localStorage.removeItem(key)
  })

  // Clear master list
  localStorage.removeItem(ALL_NOTIFICATIONS_KEY)
}

/**
 * Export subscriptions as CSV for downloading
 */
export function exportSubscriptionsAsCSV(): string {
  const subscriptions = getAllSubscriptions()

  if (subscriptions.length === 0) {
    return 'No subscriptions to export'
  }

  const headers = ['Email', 'Product ID', 'Product Name', 'Subscribed At']
  const rows = subscriptions.map((sub) => [
    sub.email,
    sub.productId,
    sub.productName,
    sub.subscribedAt,
  ])

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csv
}

/**
 * Download subscriptions as CSV file
 */
export function downloadSubscriptionsCSV(): void {
  const csv = exportSubscriptionsAsCSV()
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `stock-notifications-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Get count of active subscriptions
 */
export function getSubscriptionCount(): number {
  return getAllSubscriptions().length
}

/**
 * Get subscriptions for a specific email
 */
export function getSubscriptionsByEmail(email: string): StoredStockNotification[] {
  const allSubscriptions = getAllSubscriptions()
  return allSubscriptions.filter(
    (sub) => sub.email.toLowerCase() === email.toLowerCase()
  )
}
