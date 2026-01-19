/**
 * Mock Data Generators
 * Provides realistic test data using faker.js patterns
 */

// Product Mock Data
export const mockProduct = (overrides = {}) => ({
  id: '1',
  slug: 'modern-sliding-door',
  name: 'Modern Sliding Door',
  description: 'A beautiful modern sliding door system perfect for closets',
  price: 599.99,
  compareAtPrice: 799.99,
  category: 'sliding-doors',
  subcategory: 'modern',
  inStock: true,
  quantity: 15,
  sku: 'MSD-001',
  images: [
    {
      url: '/images/products/sliding-door-1.jpg',
      alt: 'Modern Sliding Door - Front View',
      width: 800,
      height: 600,
    },
    {
      url: '/images/products/sliding-door-2.jpg',
      alt: 'Modern Sliding Door - Side View',
      width: 800,
      height: 600,
    },
  ],
  specifications: {
    material: 'Premium Wood',
    finish: 'Matte Black',
    dimensions: '80" x 36" x 1.5"',
    weight: '45 lbs',
    warranty: '5 years',
  },
  features: [
    'Soft-close mechanism',
    'Easy installation',
    'Durable construction',
    'Modern design',
  ],
  tags: ['modern', 'sliding', 'popular', 'sale'],
  rating: 4.8,
  reviewCount: 127,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-12-01T00:00:00Z',
  ...overrides,
})

export const mockProducts = (count = 10) =>
  Array.from({ length: count }, (_, i) =>
    mockProduct({
      id: String(i + 1),
      slug: `product-${i + 1}`,
      name: `Product ${i + 1}`,
      price: 299.99 + i * 50,
    })
  )

// User Mock Data
export const mockUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '613-555-0123',
  address: {
    street: '123 Main St',
    city: 'Ottawa',
    province: 'ON',
    postalCode: 'K1A 0B1',
    country: 'Canada',
  },
  createdAt: '2024-01-01T00:00:00Z',
  ...overrides,
})

// Quote Mock Data
export const mockQuote = (overrides = {}) => ({
  id: 'quote-1',
  customerId: 'user-1',
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  customerPhone: '613-555-0123',
  projectType: 'closet-renovation',
  projectDescription: 'Need custom closet doors for master bedroom',
  preferredContactMethod: 'email',
  budgetRange: '$1000-$2500',
  timeline: 'Within 3 months',
  status: 'pending',
  attachments: [],
  createdAt: '2025-01-15T10:30:00Z',
  updatedAt: '2025-01-15T10:30:00Z',
  ...overrides,
})

export const mockQuotes = (count = 5) =>
  Array.from({ length: count }, (_, i) =>
    mockQuote({
      id: `quote-${i + 1}`,
      customerName: `Customer ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
    })
  )

// Order Mock Data
export const mockOrder = (overrides = {}) => ({
  id: 'order-1',
  orderNumber: 'PGC-2025-001',
  customerId: 'user-1',
  status: 'processing',
  items: [
    {
      productId: '1',
      productName: 'Modern Sliding Door',
      quantity: 2,
      price: 599.99,
      subtotal: 1199.98,
    },
  ],
  subtotal: 1199.98,
  tax: 155.99,
  shipping: 50.0,
  total: 1405.97,
  shippingAddress: {
    street: '123 Main St',
    city: 'Ottawa',
    province: 'ON',
    postalCode: 'K1A 0B1',
    country: 'Canada',
  },
  billingAddress: {
    street: '123 Main St',
    city: 'Ottawa',
    province: 'ON',
    postalCode: 'K1A 0B1',
    country: 'Canada',
  },
  paymentMethod: 'credit_card',
  paymentStatus: 'paid',
  createdAt: '2025-01-15T14:30:00Z',
  updatedAt: '2025-01-15T14:30:00Z',
  ...overrides,
})

// Review Mock Data
export const mockReview = (overrides = {}) => ({
  id: 'review-1',
  productId: '1',
  userId: 'user-1',
  userName: 'John Doe',
  rating: 5,
  title: 'Excellent product!',
  comment: 'The quality exceeded my expectations. Installation was easy.',
  helpful: 15,
  verified: true,
  createdAt: '2024-12-01T00:00:00Z',
  ...overrides,
})

export const mockReviews = (count = 10) =>
  Array.from({ length: count }, (_, i) =>
    mockReview({
      id: `review-${i + 1}`,
      rating: 3 + Math.floor(Math.random() * 3), // 3-5 stars
      userName: `User ${i + 1}`,
    })
  )

// Cart Mock Data
export const mockCartItem = (overrides = {}) => ({
  id: '1',
  productId: '1',
  productName: 'Modern Sliding Door',
  productSlug: 'modern-sliding-door',
  price: 599.99,
  quantity: 1,
  image: '/images/products/sliding-door-1.jpg',
  ...overrides,
})

export const mockCart = (items = [mockCartItem()]) => ({
  items,
  subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  get itemCount() {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  },
})

// API Response Mock Data
export const mockApiSuccess = <T extends any>(data: T) => ({
  success: true,
  data,
  error: null,
  timestamp: new Date().toISOString(),
})

export const mockApiError = (message = 'An error occurred') => ({
  success: false,
  data: null,
  error: {
    message,
    code: 'ERROR',
  },
  timestamp: new Date().toISOString(),
})

// Pagination Mock Data
export const mockPaginatedResponse = <T extends any>(
  items: T[],
  page = 1,
  pageSize = 20
) => ({
  items,
  total: items.length,
  page,
  pageSize,
  totalPages: Math.ceil(items.length / pageSize),
  hasNextPage: page * pageSize < items.length,
  hasPreviousPage: page > 1,
})

// Search Results Mock Data
export const mockSearchResults = (query = 'test') => ({
  query,
  results: [
    {
      id: '1',
      type: 'product',
      title: 'Modern Sliding Door',
      url: '/products/modern-sliding-door',
      image: '/images/products/sliding-door-1.jpg',
      description: 'A beautiful modern sliding door',
      relevance: 0.95,
    },
    {
      id: '2',
      type: 'article',
      title: 'How to Choose Closet Doors',
      url: '/blog/how-to-choose-closet-doors',
      image: '/images/blog/closet-doors.jpg',
      description: 'A comprehensive guide to selecting closet doors',
      relevance: 0.87,
    },
  ],
  total: 2,
  filters: {
    category: [],
    priceRange: null,
  },
})

// Form Data Generators
export const mockContactFormData = (overrides = {}) => ({
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '613-555-0123',
  message: 'I would like to get a quote for custom closet doors.',
  ...overrides,
})

export const mockQuoteFormData = (overrides = {}) => ({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '613-555-0123',
  projectType: 'closet-renovation',
  projectDescription: 'Need custom closet system for master bedroom',
  budgetRange: '$1000-$2500',
  timeline: 'Within 3 months',
  preferredContact: 'email',
  address: {
    street: '123 Main St',
    city: 'Ottawa',
    province: 'ON',
    postalCode: 'K1A 0B1',
  },
  ...overrides,
})

// File Upload Mock Data
export const mockUploadedFile = (overrides = {}) => ({
  filename: 'test-image.jpg',
  url: 'https://example.com/uploads/test-image.jpg',
  size: 102400,
  mimeType: 'image/jpeg',
  uploadedAt: new Date().toISOString(),
  ...overrides,
})

// Analytics Event Mock Data
export const mockAnalyticsEvent = (overrides = {}) => ({
  event: 'page_view',
  properties: {
    page: '/',
    title: 'Home',
    referrer: '',
  },
  timestamp: new Date().toISOString(),
  ...overrides,
})

// Newsletter Subscription Mock Data
export const mockNewsletterSubscription = (overrides = {}) => ({
  email: 'subscriber@example.com',
  subscribedAt: new Date().toISOString(),
  status: 'active',
  ...overrides,
})

// Error Mock Data
export const mockValidationError = (field: string, message: string) => ({
  field,
  message,
  code: 'VALIDATION_ERROR',
})

export const mockNetworkError = () => ({
  message: 'Network request failed',
  code: 'NETWORK_ERROR',
  status: 0,
})

export const mockServerError = () => ({
  message: 'Internal server error',
  code: 'SERVER_ERROR',
  status: 500,
})
