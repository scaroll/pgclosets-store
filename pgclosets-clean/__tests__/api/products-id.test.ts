import { NextRequest } from 'next/server'
import { GET } from '@/app/api/products/[id]/route'
import { reninProductLoader } from '@/lib/renin-product-loader'
import { mockProduct } from '../fixtures/mockProducts'

// Mock the product loader
jest.mock('@/lib/renin-product-loader', () => ({
  reninProductLoader: {
    getProductById: jest.fn(),
    getProductByHandle: jest.fn(),
    getProductsBySku: jest.fn(),
  }
}))

const mockProductLoader = reninProductLoader as jest.Mocked<typeof reninProductLoader>

describe('/api/products/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Product retrieval', () => {
    it('returns product when found by ID', async () => {
      mockProductLoader.getProductById.mockResolvedValue(mockProduct)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/products/test-product-1')
      const response = await GET(request, { params: { id: 'test-product-1' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.product).toEqual(mockProduct)
      expect(mockProductLoader.getProductById).toHaveBeenCalledWith('test-product-1')
    })

    it('returns product when found by handle', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(mockProduct)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/products/test-barn-door')
      const response = await GET(request, { params: { id: 'test-barn-door' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.product).toEqual(mockProduct)
      expect(mockProductLoader.getProductById).toHaveBeenCalledWith('test-barn-door')
      expect(mockProductLoader.getProductByHandle).toHaveBeenCalledWith('test-barn-door')
    })

    it('returns product when found by SKU', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/products/TEST-001')
      const response = await GET(request, { params: { id: 'TEST-001' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.product).toEqual(mockProduct)
      expect(mockProductLoader.getProductById).toHaveBeenCalledWith('TEST-001')
      expect(mockProductLoader.getProductByHandle).toHaveBeenCalledWith('TEST-001')
      expect(mockProductLoader.getProductsBySku).toHaveBeenCalledWith('TEST-001')
    })
  })

  describe('Fallback behavior', () => {
    it('tries all lookup methods in correct order', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/products/some-identifier')
      await GET(request, { params: { id: 'some-identifier' } })

      expect(mockProductLoader.getProductById).toHaveBeenCalledWith('some-identifier')
      expect(mockProductLoader.getProductByHandle).toHaveBeenCalledWith('some-identifier')
      expect(mockProductLoader.getProductsBySku).toHaveBeenCalledWith('some-identifier')
    })

    it('stops lookup chain when product is found by ID', async () => {
      mockProductLoader.getProductById.mockResolvedValue(mockProduct)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/products/test-product-1')
      await GET(request, { params: { id: 'test-product-1' } })

      expect(mockProductLoader.getProductById).toHaveBeenCalledWith('test-product-1')
      expect(mockProductLoader.getProductByHandle).not.toHaveBeenCalled()
      expect(mockProductLoader.getProductsBySku).not.toHaveBeenCalled()
    })

    it('stops lookup chain when product is found by handle', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(mockProduct)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/products/test-barn-door')
      await GET(request, { params: { id: 'test-barn-door' } })

      expect(mockProductLoader.getProductById).toHaveBeenCalledWith('test-barn-door')
      expect(mockProductLoader.getProductByHandle).toHaveBeenCalledWith('test-barn-door')
      expect(mockProductLoader.getProductsBySku).not.toHaveBeenCalled()
    })
  })

  describe('Not found scenarios', () => {
    it('returns 404 when product is not found by any method', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/products/non-existent')
      const response = await GET(request, { params: { id: 'non-existent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Product not found')
    })

    it('provides helpful error message for not found', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/products/invalid-id')
      const response = await GET(request, { params: { id: 'invalid-id' } })
      const data = await response.json()

      expect(data).toHaveProperty('error')
      expect(data.error).toBe('Product not found')
      expect(data).not.toHaveProperty('product')
    })
  })

  describe('Error handling', () => {
    it('handles database errors during ID lookup', async () => {
      mockProductLoader.getProductById.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/products/test-product-1')
      const response = await GET(request, { params: { id: 'test-product-1' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch product')
    })

    it('handles errors during handle lookup', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/products/test-handle')
      const response = await GET(request, { params: { id: 'test-handle' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch product')
    })

    it('handles errors during SKU lookup', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockRejectedValue(new Error('SKU lookup failed'))

      const request = new NextRequest('http://localhost:3000/api/products/TEST-SKU')
      const response = await GET(request, { params: { id: 'TEST-SKU' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch product')
    })

    it('handles unexpected errors gracefully', async () => {
      mockProductLoader.getProductById.mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      const request = new NextRequest('http://localhost:3000/api/products/test-id')
      const response = await GET(request, { params: { id: 'test-id' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Failed to fetch product')
    })
  })

  describe('Parameter handling', () => {
    it('handles empty ID parameter', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/products/')
      const response = await GET(request, { params: { id: '' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Product not found')
    })

    it('handles special characters in ID', async () => {
      const specialId = 'product-with-special-chars!@#'
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest(`http://localhost:3000/api/products/${encodeURIComponent(specialId)}`)
      const response = await GET(request, { params: { id: specialId } })

      expect(mockProductLoader.getProductById).toHaveBeenCalledWith(specialId)
    })

    it('handles URL-encoded parameters', async () => {
      const encodedId = 'product%20with%20spaces'
      const decodedId = 'product with spaces'
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest(`http://localhost:3000/api/products/${encodedId}`)
      const response = await GET(request, { params: { id: decodedId } })

      expect(mockProductLoader.getProductById).toHaveBeenCalledWith(decodedId)
    })
  })

  describe('Response format', () => {
    it('returns product in correct format', async () => {
      mockProductLoader.getProductById.mockResolvedValue(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/products/test-product-1')
      const response = await GET(request, { params: { id: 'test-product-1' } })
      const data = await response.json()

      expect(data).toHaveProperty('product')
      expect(data.product).toEqual(mockProduct)
      expect(data.product).toHaveProperty('id')
      expect(data.product).toHaveProperty('title')
      expect(data.product).toHaveProperty('description')
      expect(data.product).toHaveProperty('variants')
      expect(data.product).toHaveProperty('images')
    })

    it('sets correct content-type header', async () => {
      mockProductLoader.getProductById.mockResolvedValue(mockProduct)

      const request = new NextRequest('http://localhost:3000/api/products/test-product-1')
      const response = await GET(request, { params: { id: 'test-product-1' } })

      expect(response.headers.get('content-type')).toContain('application/json')
    })

    it('returns clean error format for 404', async () => {
      mockProductLoader.getProductById.mockResolvedValue(null)
      mockProductLoader.getProductByHandle.mockResolvedValue(null)
      mockProductLoader.getProductsBySku.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/products/not-found')
      const response = await GET(request, { params: { id: 'not-found' } })
      const data = await response.json()

      expect(data).toEqual({ error: 'Product not found' })
      expect(data).not.toHaveProperty('product')
    })
  })
})