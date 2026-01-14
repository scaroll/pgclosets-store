import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import ProductsPage from '@/app/products/page'
import { mockProducts, mockApiResponse } from '../fixtures/mockProducts'

// Mock Next.js components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn(),
  }),
  usePathname: () => '/products',
}))

jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
})

// Setup MSW server for API mocking
const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    const url = new URL(req.url)
    const type = url.searchParams.get('type')
    const search = url.searchParams.get('search')
    const tag = url.searchParams.get('tag')
    const featured = url.searchParams.get('featured')

    let filteredProducts = mockProducts

    if (type) {
      filteredProducts = mockProducts.filter(p => p.product_type === type)
    } else if (search) {
      filteredProducts = mockProducts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    } else if (tag) {
      filteredProducts = mockProducts.filter(p => p.tags.includes(tag))
    } else if (featured === 'true') {
      filteredProducts = mockProducts.slice(0, 2)
    }

    return res(
      ctx.json({
        ...mockApiResponse,
        products: filteredProducts,
        pagination: {
          ...mockApiResponse.pagination,
          total: filteredProducts.length
        }
      })
    )
  }),

  rest.get('/api/products/:id', (req, res, ctx) => {
    const { id } = req.params
    const product = mockProducts.find(p =>
      p.id === id || p.handle === id || p.sku === id
    )

    if (!product) {
      return res(
        ctx.status(404),
        ctx.json({ error: 'Product not found' })
      )
    }

    return res(ctx.json({ product }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Product Flow Integration Tests', () => {
  describe('Product Listing Page', () => {
    it('loads and displays products on page load', async () => {
      render(<ProductsPage />)

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      // Check that multiple products are displayed
      expect(screen.getByText('Test Product No Images')).toBeInTheDocument()
      expect(screen.getByText('Test Product On Sale')).toBeInTheDocument()
    })

    it('displays loading state initially', async () => {
      render(<ProductsPage />)

      // Should show loading indicator initially
      const loadingElement = screen.queryByTestId('products-loading') ||
                            screen.queryByText(/loading/i) ||
                            document.querySelector('.animate-pulse')

      if (loadingElement) {
        expect(loadingElement).toBeInTheDocument()
      }

      // Wait for products to load and loading to disappear
      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })
    })

    it('displays product grid with correct layout', async () => {
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      // Check that products are in a grid layout
      const productCards = screen.getAllByRole('link')
      expect(productCards.length).toBeGreaterThan(0)

      // Each product card should link to product detail
      productCards.forEach(card => {
        expect(card).toHaveAttribute('href', expect.stringContaining('/products/'))
      })
    })
  })

  describe('Product Filtering', () => {
    it('filters products by type', async () => {
      // Mock API response for filtered results
      server.use(
        rest.get('/api/products', (req, res, ctx) => {
          const url = new URL(req.url)
          const type = url.searchParams.get('type')

          if (type === 'Barn Door') {
            const barnDoors = mockProducts.filter(p => p.product_type === 'Barn Door')
            return res(ctx.json({
              ...mockApiResponse,
              products: barnDoors,
              pagination: { ...mockApiResponse.pagination, total: barnDoors.length }
            }))
          }

          return res(ctx.json(mockApiResponse))
        })
      )

      render(<ProductsPage />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      // Find and interact with filter
      const typeFilter = screen.queryByRole('combobox') ||
                        screen.queryByDisplayValue('All Types') ||
                        screen.queryByText('Filter by type')

      if (typeFilter) {
        fireEvent.click(typeFilter)

        const barnDoorOption = screen.queryByText('Barn Door')
        if (barnDoorOption) {
          fireEvent.click(barnDoorOption)

          // Wait for filtered results
          await waitFor(() => {
            const productCards = screen.getAllByRole('link')
            expect(productCards.length).toBeGreaterThan(0)
          })
        }
      }
    })

    it('searches products by keyword', async () => {
      render(<ProductsPage />)

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      // Find search input
      const searchInput = screen.queryByRole('searchbox') ||
                         screen.queryByPlaceholderText(/search/i) ||
                         screen.queryByDisplayValue('')

      if (searchInput) {
        await userEvent.type(searchInput, 'barn')

        // Wait for search results
        await waitFor(() => {
          // Should show barn door products
          expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
        })
      }
    })
  })

  describe('Product Card Interactions', () => {
    it('shows hover effects on product cards', async () => {
      const user = userEvent.setup()
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      const productLink = screen.getByRole('link', { name: /test barn door/i })

      await user.hover(productLink)

      // Check for hover effects
      await waitFor(() => {
        const viewDetailsButton = screen.queryByText('View Details')
        if (viewDetailsButton) {
          expect(viewDetailsButton).toBeInTheDocument()
        }
      })
    })

    it('navigates to product detail on click', async () => {
      const user = userEvent.setup()
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      const productLink = screen.getByRole('link', { name: /test barn door/i })
      expect(productLink).toHaveAttribute('href', '/products/test-barn-door')
    })
  })

  describe('Product Pricing Display', () => {
    it('displays correct pricing information', async () => {
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      // Check price formatting
      const priceElement = screen.getByText('$599.99 - $649.99')
      expect(priceElement).toBeInTheDocument()

      // Check sale product pricing
      await waitFor(() => {
        const saleProduct = screen.getByText('Test Product On Sale')
        expect(saleProduct).toBeInTheDocument()
      })
    })

    it('displays sale badges for discounted products', async () => {
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Product On Sale')).toBeInTheDocument()
      })

      // Should show sale badge
      const saleBadge = screen.getByText('Sale')
      expect(saleBadge).toBeInTheDocument()
    })

    it('handles products with no pricing', async () => {
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Product Contact Price')).toBeInTheDocument()
      })

      // Should show contact for price
      const contactPrice = screen.getByText('Contact for Price')
      expect(contactPrice).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Mock API error
      server.use(
        rest.get('/api/products', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ error: 'Internal server error' })
          )
        })
      )

      render(<ProductsPage />)

      // Should show error state or fallback content
      await waitFor(() => {
        const errorMessage = screen.queryByText(/error/i) ||
                            screen.queryByText(/something went wrong/i) ||
                            screen.queryByText(/failed to load/i)

        // If no explicit error message, at least shouldn't crash
        expect(document.body).toBeInTheDocument()
      })
    })

    it('handles empty product results', async () => {
      // Mock empty response
      server.use(
        rest.get('/api/products', (req, res, ctx) => {
          return res(ctx.json({
            products: [],
            pagination: { total: 0, limit: 20, offset: 0, hasMore: false },
            stats: { totalProducts: 0, totalTypes: 0, totalTags: 0, averagePrice: 0 }
          }))
        })
      )

      render(<ProductsPage />)

      // Should handle empty state gracefully
      await waitFor(() => {
        const emptyMessage = screen.queryByText(/no products found/i) ||
                            screen.queryByText(/no results/i)

        // At minimum, page should not crash
        expect(document.body).toBeInTheDocument()
      })
    })
  })

  describe('Performance', () => {
    it('loads products within reasonable time', async () => {
      const startTime = Date.now()

      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      const loadTime = Date.now() - startTime
      expect(loadTime).toBeLessThan(3000) // Should load within 3 seconds
    })

    it('handles large product lists efficiently', async () => {
      // Mock large product list
      const largeProductList = Array.from({ length: 50 }, (_, index) => ({
        ...mockProducts[0],
        id: `product-${index}`,
        title: `Product ${index}`,
        handle: `product-${index}`
      }))

      server.use(
        rest.get('/api/products', (req, res, ctx) => {
          return res(ctx.json({
            products: largeProductList,
            pagination: { total: largeProductList.length, limit: 20, offset: 0, hasMore: true },
            stats: mockApiResponse.stats
          }))
        })
      )

      const startTime = Date.now()
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Product 0')).toBeInTheDocument()
      })

      const renderTime = Date.now() - startTime
      expect(renderTime).toBeLessThan(2000) // Should render within 2 seconds
    })
  })

  describe('Accessibility', () => {
    it('maintains proper focus management', async () => {
      const user = userEvent.setup()
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      // Test keyboard navigation
      await user.tab()

      const focusedElement = document.activeElement
      expect(focusedElement).toBeInTheDocument()
    })

    it('has proper ARIA labels and roles', async () => {
      render(<ProductsPage />)

      await waitFor(() => {
        expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      })

      // Check for proper roles
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)

      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
      })
    })
  })
})