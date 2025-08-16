'use client'

import { useEffect } from 'react'
import { useAnalytics, useComponentAnalytics } from '@/hooks/use-analytics'
import { 
  trackProductView, 
  trackQuoteRequest, 
  trackConsultationBooking,
  trackContactForm,
  trackProductCustomization,
  trackSiteSearch,
  createProductItem 
} from '@/lib/analytics'

// Example 1: Product Page Component
export function ProductPageAnalytics({ 
  product 
}: { 
  product: {
    id: string
    name: string
    category: string
    price: number
    brand?: string
  }
}) {
  const analytics = useAnalytics()

  useEffect(() => {
    // Track product view when component mounts
    if (analytics.isTrackingEnabled) {
      trackProductView(product)
    }
  }, [product.id, analytics.isTrackingEnabled])

  return null // This is a tracking-only component
}

// Example 2: Add to Cart Button with Analytics
export function AddToCartButton({ 
  product, 
  quantity = 1,
  onAddToCart
}: {
  product: any
  quantity?: number
  onAddToCart: () => void
}) {
  const analytics = useAnalytics()

  const handleAddToCart = () => {
    // Execute the actual add to cart logic
    onAddToCart()

    // Track the event
    if (analytics.isTrackingEnabled) {
      const productItem = createProductItem({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        quantity
      })

      analytics.trackAddToCart([productItem], product.price * quantity)
    }
  }

  return (
    <button 
      onClick={handleAddToCart}
      className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
    >
      Add to Cart
    </button>
  )
}

// Example 3: Search Component with Analytics
export function SearchWithAnalytics({ 
  onSearch 
}: { 
  onSearch: (query: string) => Promise<any[]>
}) {
  const analytics = useAnalytics()

  const handleSearch = async (query: string) => {
    const results = await onSearch(query)
    
    // Track search event
    if (analytics.isTrackingEnabled) {
      trackSiteSearch(query, results.length)
    }

    return results
  }

  return (
    <div className="relative">
      <input
        type="search"
        placeholder="Search products..."
        onChange={(e) => {
          const query = e.target.value
          if (query.length > 2) {
            handleSearch(query)
          }
        }}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  )
}

// Example 4: Quote Request Form with Analytics
export function QuoteRequestForm({ 
  products,
  onSubmit
}: {
  products: Array<{
    id: string
    name: string
    category: string
    price: number
    quantity: number
  }>
  onSubmit: (data: any) => void
}) {
  const analytics = useAnalytics()

  const handleSubmit = (formData: any) => {
    // Submit the form
    onSubmit(formData)

    // Track quote request
    if (analytics.isTrackingEnabled) {
      trackQuoteRequest(products)
    }
  }

  return (
    <form onSubmit={handleSubmit} data-analytics-name="quote_request_form">
      {/* Form fields would go here */}
      <button type="submit">Request Quote</button>
    </form>
  )
}

// Example 5: Component-specific Analytics Hook
export function ProductComparison({ 
  products 
}: { 
  products: any[] 
}) {
  const analytics = useComponentAnalytics('product_comparison')

  useEffect(() => {
    // Track when comparison view is loaded
    analytics.trackComponentView({
      product_count: products.length,
      product_ids: products.map(p => p.id)
    })
  }, [products])

  const handleCompare = () => {
    const productItems = products.map(product => createProductItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      quantity: 1
    }))

    // Track comparison action
    analytics.trackComponentInteraction('compare_products', {
      product_count: products.length
    })

    // Track using GA4 compare event
    analytics.ga4.compareProducts(productItems)
  }

  return (
    <div>
      {/* Comparison UI */}
      <button onClick={handleCompare}>
        Compare Products
      </button>
    </div>
  )
}

// Example 6: Form Analytics Hook
export function ContactForm() {
  const analytics = useAnalytics({
    enableFormTracking: true,
    debug: process.env.NODE_ENV === 'development'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Submit form logic here
      const success = true // Replace with actual submission result
      
      // Track form submission
      trackContactForm('contact_form', success)
      
    } catch (error) {
      // Track form submission failure
      trackContactForm('contact_form', false)
      
      // Track the error
      analytics.trackException(error as Error, false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      data-analytics-name="contact_form"
    >
      <input name="name" placeholder="Your name" required />
      <input name="email" type="email" placeholder="Your email" required />
      <textarea name="message" placeholder="Your message" required />
      <button type="submit">Send Message</button>
    </form>
  )
}

// Example 7: E-commerce Cart Analytics
export function CartAnalytics({ 
  cart 
}: { 
  cart: {
    items: Array<{
      id: string
      name: string
      category: string
      price: number
      quantity: number
    }>
    total: number
  }
}) {
  const analytics = useAnalytics()

  // Track when user begins checkout
  const handleBeginCheckout = () => {
    if (analytics.isTrackingEnabled) {
      const items = cart.items.map(item => createProductItem(item))
      
      analytics.ga4.beginCheckout({
        currency: 'CAD',
        value: cart.total,
        items
      })
    }
  }

  // Track item removal
  const handleRemoveItem = (item: any) => {
    if (analytics.isTrackingEnabled) {
      const productItem = createProductItem(item)
      analytics.trackRemoveFromCart([productItem], item.price * item.quantity)
    }
  }

  return {
    handleBeginCheckout,
    handleRemoveItem
  }
}

// Example 8: Performance Monitoring Component
export function PerformanceAnalytics() {
  const analytics = useAnalytics({
    enablePerformanceTracking: true,
    enableScrollTracking: true
  })

  useEffect(() => {
    // Track custom timing for component-specific operations
    const startTime = performance.now()

    // Simulate some heavy operation
    setTimeout(() => {
      const endTime = performance.now()
      const duration = endTime - startTime

      analytics.trackTiming('component_load_time', duration, 'Performance')
    }, 100)
  }, [analytics])

  return null
}

// Example 9: Outbound Link Tracking
export function ExternalLink({ 
  href, 
  children,
  trackingLabel
}: {
  href: string
  children: React.ReactNode
  trackingLabel?: string
}) {
  const analytics = useAnalytics()

  const handleClick = () => {
    if (analytics.isTrackingEnabled) {
      analytics.trackOutboundClick(href, trackingLabel || children?.toString())
    }
  }

  return (
    <a 
      href={href} 
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

// Example 10: File Download Tracking
export function DownloadLink({ 
  href, 
  fileName,
  children
}: {
  href: string
  fileName: string
  children: React.ReactNode
}) {
  const analytics = useAnalytics()

  const handleDownload = () => {
    if (analytics.isTrackingEnabled) {
      const extension = fileName.split('.').pop() || ''
      analytics.trackFileDownload(fileName, extension)
    }
  }

  return (
    <a 
      href={href} 
      onClick={handleDownload}
      download={fileName}
    >
      {children}
    </a>
  )
}

// Example Usage Instructions (as TypeScript comments):
/*

// 1. Basic Product Page
<ProductPageAnalytics product={currentProduct} />

// 2. Add to Cart with Tracking
<AddToCartButton 
  product={product} 
  quantity={selectedQuantity}
  onAddToCart={() => addToCart(product)}
/>

// 3. Search with Results Tracking
<SearchWithAnalytics onSearch={performSearch} />

// 4. Quote Request with Lead Tracking
<QuoteRequestForm 
  products={selectedProducts}
  onSubmit={submitQuote}
/>

// 5. Component Analytics
const analytics = useComponentAnalytics('product_configurator')
analytics.trackComponentInteraction('option_selected', { option: 'color' })

// 6. Performance Monitoring
<PerformanceAnalytics />

// 7. Manual Event Tracking
const analytics = useAnalytics()
analytics.trackEvent('custom_event', { 
  category: 'User Interaction',
  action: 'Button Click',
  label: 'Header CTA'
})

// 8. Paddle Integration (automatic with PaddleButton component)
<PaddleButton 
  checkout={checkoutData}
  onSuccess={(data) => {
    // Paddle analytics will automatically track this purchase
    console.log('Purchase completed:', data)
  }}
/>

*/