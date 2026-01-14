import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/products/route'
import { reninProductLoader } from '@/lib/renin-product-loader'
import { mockProducts, mockApiResponse } from '../fixtures/mockProducts'

// Mock the product loader
jest.mock('@/lib/renin-product-loader', () => ({
  reninProductLoader: {
    loadProducts: jest.fn(),
    getFeaturedProducts: jest.fn(),
    getProductsByType: jest.fn(),
    getProductsByTag: jest.fn(),
    searchProducts: jest.fn(),
    getProductStats: jest.fn(),
    clearCache: jest.fn(),
    getProductCategories: jest.fn(),
    getProductTags: jest.fn(),
  }
}))

const mockProductLoader = reninProductLoader as jest.Mocked<typeof reninProductLoader>

describe('/api/products', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockProductLoader.getProductStats.mockResolvedValue(mockApiResponse.stats)
  })

  describe('GET /api/products', () => {
    describe('Basic functionality', () => {
      it('returns all products by default', async () => {
        mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

        const request = new NextRequest('http://localhost:3000/api/products')
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.products).toEqual(mockProducts)
        expect(data.pagination.total).toBe(mockProducts.length)
        expect(mockProductLoader.loadProducts).toHaveBeenCalledTimes(1)
      })

      it('applies pagination correctly', async () => {
        mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

        const request = new NextRequest('http://localhost:3000/api/products?limit=2&offset=1')
        const response = await GET(request)
        const data = await response.json()

        expect(data.products).toHaveLength(2)
        expect(data.products[0]).toEqual(mockProducts[1])
        expect(data.pagination).toEqual({
          total: mockProducts.length,
          limit: 2,
          offset: 1,
          hasMore: true
        })
      })

      it('includes stats in response', async () => {
        mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

        const request = new NextRequest('http://localhost:3000/api/products')
        const response = await GET(request)
        const data = await response.json()

        expect(data.stats).toEqual(mockApiResponse.stats)
        expect(mockProductLoader.getProductStats).toHaveBeenCalledTimes(1)
      })
    })

    describe('Query parameters', () => {
      it('filters by product type', async () => {
        const barnDoors = mockProducts.filter(p => p.product_type === 'Barn Door')
        mockProductLoader.getProductsByType.mockResolvedValue(barnDoors)

        const request = new NextRequest('http://localhost:3000/api/products?type=Barn%20Door')
        const response = await GET(request)
        const data = await response.json()

        expect(mockProductLoader.getProductsByType).toHaveBeenCalledWith('Barn Door')
        expect(data.products).toEqual(barnDoors)
      })

      it('filters by tag', async () => {
        const modernProducts = mockProducts.filter(p => p.tags.includes('modern'))
        mockProductLoader.getProductsByTag.mockResolvedValue(modernProducts)

        const request = new NextRequest('http://localhost:3000/api/products?tag=modern')
        const response = await GET(request)
        const data = await response.json()

        expect(mockProductLoader.getProductsByTag).toHaveBeenCalledWith('modern')
        expect(data.products).toEqual(modernProducts)
      })

      it('performs search', async () => {
        const searchResults = [mockProducts[0]]
        mockProductLoader.searchProducts.mockResolvedValue(searchResults)

        const request = new NextRequest('http://localhost:3000/api/products?search=barn')
        const response = await GET(request)
        const data = await response.json()

        expect(mockProductLoader.searchProducts).toHaveBeenCalledWith('barn')
        expect(data.products).toEqual(searchResults)
      })

      it('returns featured products', async () => {
        const featuredProducts = [mockProducts[0], mockProducts[1]]
        mockProductLoader.getFeaturedProducts.mockResolvedValue(featuredProducts)

        const request = new NextRequest('http://localhost:3000/api/products?featured=true&limit=5')
        const response = await GET(request)
        const data = await response.json()

        expect(mockProductLoader.getFeaturedProducts).toHaveBeenCalledWith(5)
        expect(data.products).toEqual(featuredProducts)
      })

      it('handles multiple query parameters correctly', async () => {
        mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

        const request = new NextRequest('http://localhost:3000/api/products?limit=10&offset=0')
        const response = await GET(request)
        const data = await response.json()

        expect(data.pagination.limit).toBe(10)
        expect(data.pagination.offset).toBe(0)
      })
    })

    describe('Pagination edge cases', () => {
      it('handles pagination beyond available products', async () => {
        mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

        const request = new NextRequest('http://localhost:3000/api/products?limit=5&offset=10')
        const response = await GET(request)
        const data = await response.json()

        expect(data.products).toHaveLength(0)
        expect(data.pagination.hasMore).toBe(false)
      })

      it('uses default pagination values', async () => {
        mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

        const request = new NextRequest('http://localhost:3000/api/products')
        const response = await GET(request)
        const data = await response.json()

        expect(data.pagination.limit).toBe(20)
        expect(data.pagination.offset).toBe(0)
      })

      it('parses pagination parameters correctly', async () => {
        mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

        const request = new NextRequest('http://localhost:3000/api/products?limit=invalid&offset=abc')
        const response = await GET(request)
        const data = await response.json()

        // Should fall back to defaults when parsing fails
        expect(data.pagination.limit).toBe(20)
        expect(data.pagination.offset).toBe(0)
      })
    })

    describe('Error handling', () => {
      it('handles product loader errors', async () => {
        mockProductLoader.loadProducts.mockRejectedValue(new Error('Database error'))

        const request = new NextRequest('http://localhost:3000/api/products')
        const response = await GET(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('Failed to fetch products')
      })

      it('handles stats loader errors gracefully', async () => {
        mockProductLoader.loadProducts.mockResolvedValue(mockProducts)
        mockProductLoader.getProductStats.mockRejectedValue(new Error('Stats error'))

        const request = new NextRequest('http://localhost:3000/api/products')
        const response = await GET(request)

        expect(response.status).toBe(500)
      })
    })
  })

  describe('POST /api/products', () => {
    describe('Action handling', () => {
      it('clears cache successfully', async () => {
        const request = new NextRequest('http://localhost:3000/api/products', {
          method: 'POST',
          body: JSON.stringify({ action: 'clearCache' })
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(data.message).toBe('Cache cleared')
        expect(mockProductLoader.clearCache).toHaveBeenCalledTimes(1)
      })

      it('returns stats', async () => {
        const request = new NextRequest('http://localhost:3000/api/products', {
          method: 'POST',
          body: JSON.stringify({ action: 'getStats' })
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.stats).toEqual(mockApiResponse.stats)
        expect(mockProductLoader.getProductStats).toHaveBeenCalledTimes(1)
      })

      it('returns categories', async () => {
        const mockCategories = ['Barn Door', 'Bifold Door', 'Bypass Door']
        mockProductLoader.getProductCategories.mockResolvedValue(mockCategories)

        const request = new NextRequest('http://localhost:3000/api/products', {
          method: 'POST',
          body: JSON.stringify({ action: 'getCategories' })
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.categories).toEqual(mockCategories)
        expect(mockProductLoader.getProductCategories).toHaveBeenCalledTimes(1)
      })

      it('returns tags', async () => {
        const mockTags = ['modern', 'traditional', 'premium']
        mockProductLoader.getProductTags.mockResolvedValue(mockTags)

        const request = new NextRequest('http://localhost:3000/api/products', {
          method: 'POST',
          body: JSON.stringify({ action: 'getTags' })
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.tags).toEqual(mockTags)
        expect(mockProductLoader.getProductTags).toHaveBeenCalledTimes(1)
      })

      it('handles invalid action', async () => {
        const request = new NextRequest('http://localhost:3000/api/products', {
          method: 'POST',
          body: JSON.stringify({ action: 'invalidAction' })
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Invalid action')
      })
    })

    describe('Error handling', () => {
      it('handles malformed JSON', async () => {
        const request = new NextRequest('http://localhost:3000/api/products', {
          method: 'POST',
          body: 'invalid json'
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('Failed to process request')
      })

      it('handles action execution errors', async () => {
        mockProductLoader.getProductStats.mockRejectedValue(new Error('Database error'))

        const request = new NextRequest('http://localhost:3000/api/products', {
          method: 'POST',
          body: JSON.stringify({ action: 'getStats' })
        })

        const response = await POST(request)
        const data = await response.json()

        expect(response.status).toBe(500)
        expect(data.error).toBe('Failed to process request')
      })
    })
  })

  describe('Response format validation', () => {
    it('returns consistent response structure for GET', async () => {
      mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)
      const data = await response.json()

      expect(data).toHaveProperty('products')
      expect(data).toHaveProperty('pagination')
      expect(data).toHaveProperty('stats')

      expect(data.pagination).toHaveProperty('total')
      expect(data.pagination).toHaveProperty('limit')
      expect(data.pagination).toHaveProperty('offset')
      expect(data.pagination).toHaveProperty('hasMore')
    })

    it('sets correct content-type header', async () => {
      mockProductLoader.loadProducts.mockResolvedValue(mockProducts)

      const request = new NextRequest('http://localhost:3000/api/products')
      const response = await GET(request)

      expect(response.headers.get('content-type')).toContain('application/json')
    })
  })
})