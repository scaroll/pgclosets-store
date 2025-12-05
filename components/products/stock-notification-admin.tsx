'use client'

import { useState, useEffect } from 'react'
import { Bell, Mail, Calendar, Package, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StockNotificationData {
  id: string
  email: string
  productId: string
  productName: string
  status: 'PENDING' | 'NOTIFIED' | 'CANCELLED'
  notifiedAt?: string
  createdAt: string
}

interface StockNotificationAdminProps {
  productId?: string
  limit?: number
}

/**
 * Admin component to view and manage stock notifications
 * This component is intended for use in the admin dashboard
 */
export function StockNotificationAdmin({
  productId,
  limit = 50,
}: StockNotificationAdminProps) {
  const [notifications, setNotifications] = useState<StockNotificationData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [productId])

  const fetchNotifications = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (productId) {
        params.append('productId', productId)
      }

      const response = await fetch(`/api/products/stock-notify?${params.toString()}`)

      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const data = await response.json()
      setNotifications(data.notifications || [])
    } catch (err) {
      console.error('Error fetching stock notifications:', err)
      setError(err instanceof Error ? err.message : 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: StockNotificationData['status']) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      NOTIFIED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}
      >
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <Button onClick={fetchNotifications} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
        <p className="text-muted-foreground">
          Stock notifications will appear here when customers subscribe.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Stock Notifications</h2>
          <p className="text-muted-foreground">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={fetchNotifications} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Requested
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {notifications.map((notification) => (
              <tr key={notification.id} className="hover:bg-muted/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{notification.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">
                        {notification.productName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {notification.productId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(notification.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(notification.createdAt)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Export a simple count component for dashboard widgets
 */
export function StockNotificationCount({ productId }: { productId?: string }) {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const params = new URLSearchParams()
        if (productId) {
          params.append('productId', productId)
        }

        const response = await fetch(`/api/products/stock-notify?${params.toString()}`)
        const data = await response.json()
        setCount(data.count || 0)
      } catch (err) {
        console.error('Error fetching notification count:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCount()
  }, [productId])

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin" />
  }

  return (
    <div className="flex items-center gap-2">
      <Bell className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm font-medium">{count}</span>
    </div>
  )
}
