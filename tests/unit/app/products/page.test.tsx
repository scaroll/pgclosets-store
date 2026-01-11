import Page from '@/app/products/[slug]/page'
import { getProductBySlug } from '@/lib/products'
import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'

// Mock the product data
vi.mock('@/lib/products', () => ({
  getProductBySlug: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

const mockProduct = {
  id: 'test-product',
  name: 'Test Product',
  description: 'A test product description',
  price: 100,
  images: ['/test.jpg'],
  features: ['Feature 1'],
}

describe('Product Detail Page', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders product details found', async () => {
    ;(getProductBySlug as any).mockReturnValue(mockProduct)

    // Page is async server component, but for unit test we can await it if we call it directly?
    // Actually, testing server components directly is hard.
    // We will treat it as a function for now or standard render if it was client.
    // For Server Components compatible testing, we might need to await the result before render?
    // Let's try calling it as a function first since it returns JSX (Promise<JSX>).

    const ui = await Page({ params: Promise.resolve({ slug: 'test-product' }) })
    render(ui)

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('A test product description')).toBeInTheDocument()
    expect(screen.getByText('$100')).toBeInTheDocument()
  })

  test('calls notFound if product missing', async () => {
    ;(getProductBySlug as any).mockReturnValue(undefined)

    try {
      await Page({ params: Promise.resolve({ slug: 'missing' }) })
    } catch (e) {
      // notFound throws usually, or in mock we can verify call
    }

    expect(notFound).toHaveBeenCalled()
  })
})
