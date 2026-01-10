// @ts-nocheck - Test mock with implicit any types
/**
 * Mock Service Worker (MSW) Server Setup
 * Intercepts API requests for testing
 */

import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Define API handlers
export const handlers = [
  // Products API
  http.get('/api/products', () => {
    return HttpResponse.json({
      products: [
        {
          id: '1',
          slug: 'modern-sliding-door',
          name: 'Modern Sliding Door',
          price: 599.99,
          category: 'sliding-doors',
          inStock: true,
          image: '/images/products/sliding-door-1.jpg',
          description: 'Contemporary sliding door system',
        },
        {
          id: '2',
          slug: 'classic-barn-door',
          name: 'Classic Barn Door',
          price: 449.99,
          category: 'barn-doors',
          inStock: true,
          image: '/images/products/barn-door-1.jpg',
          description: 'Rustic barn door with modern hardware',
        },
      ],
      total: 2,
      page: 1,
      pageSize: 20,
    })
  }),

  http.get('/api/products/:slug', ({ params }) => {
    const { slug } = params
    return HttpResponse.json({
      id: '1',
      slug,
      name: 'Test Product',
      price: 599.99,
      category: 'test-category',
      inStock: true,
      image: '/images/products/test-product.jpg',
      description: 'Test product description',
      specifications: {
        material: 'Premium Wood',
        dimensions: '80" x 36" x 1.5"',
        weight: '45 lbs',
      },
    })
  }),

  // Quote API
  http.post('/api/quotes', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(
      {
        id: 'quote-123',
        status: 'pending',
        ...body,
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    )
  }),

  http.get('/api/quotes/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      status: 'pending',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      projectDetails: 'Custom closet design',
      createdAt: '2025-01-01T00:00:00Z',
    })
  }),

  // Email API
  http.post('/api/email/send', async ({ request }) => {
    const _body = await request.json()
    return HttpResponse.json({
      success: true,
      messageId: 'email-123',
    })
  }),

  // Contact Form API
  http.post('/api/contact', async ({ request }) => {
    const _body = await request.json()
    return HttpResponse.json({
      success: true,
      message: 'Message received successfully',
    })
  }),

  // Newsletter API
  http.post('/api/newsletter/subscribe', async ({ request }) => {
    const _body = await request.json() // Prefix with _ to indicate intentionally unused
    return HttpResponse.json({
      success: true,
      message: 'Subscription successful',
    })
  }),

  // Analytics API
  http.post('/api/analytics/track', () => {
    return HttpResponse.json({ success: true })
  }),

  // Image Upload API
  http.post('/api/upload', () => {
    return HttpResponse.json({
      url: 'https://example.com/uploads/test-image.jpg',
      filename: 'test-image.jpg',
      size: 102400,
    })
  }),

  // Search API
  http.get('/api/search', ({ request }: { request: Request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')

    return HttpResponse.json({
      results: [
        {
          id: '1',
          title: `Result for ${query}`,
          url: `/products/test-product`,
          category: 'products',
        },
      ],
      total: 1,
      query,
    })
  }),

  // Error handlers for testing error states
  http.get('/api/error/500', () => {
    return HttpResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }),

  http.get('/api/error/404', () => {
    return HttpResponse.json(
      { error: 'Not Found' },
      { status: 404 }
    )
  }),

  http.get('/api/error/401', () => {
    return HttpResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }),
]

// Create and export MSW server
export const server = setupServer(...handlers)

// Export handler creators for test-specific overrides
export const createSuccessHandler = <T extends any>(
  path: string,
  data: T
) => {
  return http.get(path, () => HttpResponse.json(data))
}

export const createErrorHandler = (
  path: string,
  status: number,
  message: string
) => {
  return http.get(path, () =>
    HttpResponse.json({ error: message }, { status })
  )
}
