/**
 * Stock Notification Component Usage Examples
 *
 * This file demonstrates various ways to use the StockNotification component
 * throughout your application.
 */

import { StockNotification } from './stock-notification'
import { StockNotificationAdmin, StockNotificationCount } from './stock-notification-admin'
import { hasSubscribed, getSubscription } from '@/lib/stock-notifications'

/**
 * Example 1: Basic usage in a product detail page
 * This is already implemented in /app/(shop)/products/[slug]/page.tsx
 */
export function Example1_ProductDetailPage() {
  const product = {
    id: 'prod_123',
    name: 'Premium Closet System',
    inStock: false,
  }

  return (
    <div>
      {!product.inStock && (
        <StockNotification
          productId={product.id}
          productName={product.name}
        />
      )}
    </div>
  )
}

/**
 * Example 2: Using in a product card on the products listing page
 */
export function Example2_ProductCard() {
  const product = {
    id: 'prod_123',
    name: 'Premium Closet System',
    inStock: false,
  }

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-bold">{product.name}</h3>

      {!product.inStock && (
        <div className="mt-4">
          <StockNotification
            productId={product.id}
            productName={product.name}
            className="max-w-md"
          />
        </div>
      )}
    </div>
  )
}

/**
 * Example 3: Checking subscription status before rendering
 */
export function Example3_ConditionalRender() {
  const product = {
    id: 'prod_123',
    name: 'Premium Closet System',
    inStock: false,
  }

  // Check if user has already subscribed
  const isSubscribed = hasSubscribed(product.id)

  return (
    <div>
      {!product.inStock && !isSubscribed ? (
        <StockNotification
          productId={product.id}
          productName={product.name}
        />
      ) : (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            You&apos;re already subscribed to notifications for this product!
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Example 4: Admin dashboard - View all notifications
 * Use this in your admin panel to manage stock notifications
 */
export function Example4_AdminDashboard() {
  return (
    <div className="container mx-auto p-8">
      <StockNotificationAdmin />
    </div>
  )
}

/**
 * Example 5: Admin dashboard - View notifications for specific product
 */
export function Example5_AdminProductNotifications() {
  const productId = 'prod_123'

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Product Stock Notifications
      </h1>
      <StockNotificationAdmin productId={productId} />
    </div>
  )
}

/**
 * Example 6: Dashboard widget showing notification count
 */
export function Example6_DashboardWidget() {
  return (
    <div className="p-6 border rounded-lg bg-card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Stock Notifications
          </h3>
          <p className="text-2xl font-bold mt-2">
            <StockNotificationCount />
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Example 7: Using utility functions to display subscription info
 */
export function Example7_SubscriptionInfo() {
  const productId = 'prod_123'
  const subscription = getSubscription(productId)

  if (!subscription) {
    return <p>No active subscription for this product</p>
  }

  return (
    <div className="p-4 border rounded-lg">
      <h4 className="font-semibold mb-2">Subscription Details</h4>
      <dl className="space-y-1 text-sm">
        <div>
          <dt className="font-medium">Email:</dt>
          <dd className="text-muted-foreground">{subscription.email}</dd>
        </div>
        <div>
          <dt className="font-medium">Product:</dt>
          <dd className="text-muted-foreground">{subscription.productName}</dd>
        </div>
        <div>
          <dt className="font-medium">Subscribed:</dt>
          <dd className="text-muted-foreground">
            {new Date(subscription.subscribedAt).toLocaleDateString()}
          </dd>
        </div>
      </dl>
    </div>
  )
}

/**
 * Example 8: Modal/Dialog with stock notification
 */
export function Example8_ModalNotification() {
  const product = {
    id: 'prod_123',
    name: 'Premium Closet System',
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          This item is currently out of stock
        </h2>
        <StockNotification
          productId={product.id}
          productName={product.name}
        />
      </div>
    </div>
  )
}

/**
 * Example 9: Inline notification in shopping cart
 */
export function Example9_CartNotification() {
  const cartItem = {
    id: 'cart_item_1',
    product: {
      id: 'prod_123',
      name: 'Premium Closet System',
      inStock: false,
    },
    quantity: 2,
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold">{cartItem.product.name}</h3>
          <p className="text-sm text-muted-foreground">
            Quantity: {cartItem.quantity}
          </p>

          {!cartItem.product.inStock && (
            <div className="mt-3">
              <div className="mb-2 text-sm text-red-600 dark:text-red-400">
                This item is currently out of stock and cannot be purchased.
              </div>
              <StockNotification
                productId={cartItem.product.id}
                productName={cartItem.product.name}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Example 10: Quick notification signup in product grid
 */
export function Example10_GridQuickSignup() {
  const products = [
    { id: 'prod_1', name: 'Product A', inStock: true },
    { id: 'prod_2', name: 'Product B', inStock: false },
    { id: 'prod_3', name: 'Product C', inStock: true },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">{product.name}</h3>

          {product.inStock ? (
            <button className="w-full bg-primary text-primary-foreground rounded-md py-2 px-4">
              Add to Cart
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                Out of Stock
              </div>
              <StockNotification
                productId={product.id}
                productName={product.name}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
