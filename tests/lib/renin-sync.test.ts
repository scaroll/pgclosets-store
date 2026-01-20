/**
 * Renin Product Sync Tests
 * TDD: RED-GREEN-REFACTOR
 *
 * Testing the sync of Renin products from JSON to database
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Import the module we're about to create (will fail initially - RED)
import {
  syncReninProducts,
  transformReninProduct,
  type ReninProduct,
  type TransformedProduct,
} from '@/lib/renin-sync'

// Mock Prisma client for unit tests
const mockPrisma = {
  product: {
    createMany: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    deleteMany: vi.fn(),
  },
  productImage: {
    createMany: vi.fn(),
  },
  productVariant: {
    createMany: vi.fn(),
  },
  $transaction: vi.fn((callback) => callback(mockPrisma)),
} as unknown as PrismaClient

describe('Renin Product Sync', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('transformReninProduct', () => {
    it('transforms a Renin product to database format', () => {
      const reninProduct: ReninProduct = {
        id: 'renin-bd041',
        title: 'Augusta 1-Lite Framed Mullion Design Complete Barn Door Kit',
        handle: 'augusta-1-lite-framed-mullion-design-barn-door-kit',
        description: 'Our Augusta 1-Lite sliding barn door presents a clean design.',
        thumbnail: 'https://www.renin.com/wp-content/uploads/2021/06/BD041.jpg',
        images: [
          { url: 'https://www.renin.com/wp-content/uploads/2021/06/BD041.jpg', altText: 'Product image 1' },
          { url: 'https://www.renin.com/wp-content/uploads/2020/10/Augusta-Lifestyle.jpg', altText: 'Product image 2' },
        ],
        variants: [
          {
            id: 'renin-bd041-variant-1',
            title: '36" x 84" x 1-3/8"',
            sku: 'BD041',
            price: 56500,
            inventory_quantity: 100,
          },
        ],
        tags: ['barn-doors', 'engineered solid wood', 'bright white'],
        collection: {
          id: 'renin-barn-doors',
          title: 'Renin Barn Doors',
          handle: 'renin-barn-doors',
        },
        metadata: {
          source: 'renin',
          sku: 'BD041',
          specifications: {
            sizes: ['36" x 84" x 1-3/8"'],
            color: 'Bright White',
            material: 'Engineered solid wood',
          },
        },
        created_at: '2025-10-08T01:41:32.383Z',
        updated_at: '2025-10-08T01:41:32.383Z',
      }

      const result = transformReninProduct(reninProduct)

      // Verify the transformation
      expect(result.name).toBe('Augusta 1-Lite Framed Mullion Design Complete Barn Door Kit')
      expect(result.slug).toBe('augusta-1-lite-framed-mullion-design-barn-door-kit')
      expect(result.description).toBe('Our Augusta 1-Lite sliding barn door presents a clean design.')
      expect(result.category).toBe('barn-doors')
      expect(result.price).toBe(56500) // Price in cents
      expect(result.sku).toBe('BD041')
      expect(result.inventory).toBe(100)
      expect(result.material).toBe('Engineered solid wood')
      expect(result.color).toBe('Bright White')
      expect(result.tags).toContain('barn-doors')
      expect(result.status).toBe('active')
    })

    it('extracts category from tags correctly', () => {
      const reninProduct: ReninProduct = {
        id: 'renin-bf001',
        title: 'Test Bifold Door',
        handle: 'test-bifold-door',
        description: 'A bifold door',
        thumbnail: 'https://example.com/img.jpg',
        images: [],
        variants: [{ id: 'v1', title: 'Default', sku: 'BF001', price: 30000, inventory_quantity: 50 }],
        tags: ['bifold-doors', 'white'],
        collection: { id: 'bifold', title: 'Bifold Doors', handle: 'bifold-doors' },
        metadata: { source: 'renin', sku: 'BF001', specifications: {} },
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      }

      const result = transformReninProduct(reninProduct)
      expect(result.category).toBe('bifold-doors')
    })

    it('handles products with multiple variants', () => {
      const reninProduct: ReninProduct = {
        id: 'renin-multi',
        title: 'Multi-variant Door',
        handle: 'multi-variant-door',
        description: 'A door with multiple variants',
        thumbnail: 'https://example.com/img.jpg',
        images: [],
        variants: [
          { id: 'v1', title: '36" x 80"', sku: 'MV-36', price: 40000, inventory_quantity: 25 },
          { id: 'v2', title: '48" x 80"', sku: 'MV-48', price: 50000, inventory_quantity: 15 },
        ],
        tags: ['bypass-doors'],
        collection: { id: 'bypass', title: 'Bypass Doors', handle: 'bypass-doors' },
        metadata: { source: 'renin', sku: 'MV', specifications: {} },
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      }

      const result = transformReninProduct(reninProduct)

      // Should use first variant's price as base price
      expect(result.price).toBe(40000)
      // Should use first variant's SKU
      expect(result.sku).toBe('MV-36')
      // Total inventory should be sum
      expect(result.inventory).toBe(40)
    })
  })

  describe('syncReninProducts', () => {
    it('syncs all products from JSON to database', async () => {
      mockPrisma.product.count.mockResolvedValue(0)
      mockPrisma.product.createMany.mockResolvedValue({ count: 69 })
      mockPrisma.productImage.createMany.mockResolvedValue({ count: 150 })
      mockPrisma.productVariant.createMany.mockResolvedValue({ count: 75 })

      const result = await syncReninProducts(mockPrisma)

      expect(result.success).toBe(true)
      expect(result.productsCreated).toBeGreaterThan(0)
      expect(mockPrisma.product.createMany).toHaveBeenCalled()
    })

    it('creates product images for each product', async () => {
      mockPrisma.product.count.mockResolvedValue(0)
      mockPrisma.product.createMany.mockResolvedValue({ count: 1 })
      mockPrisma.productImage.createMany.mockResolvedValue({ count: 3 })
      mockPrisma.productVariant.createMany.mockResolvedValue({ count: 1 })

      await syncReninProducts(mockPrisma)

      expect(mockPrisma.productImage.createMany).toHaveBeenCalled()
    })

    it('creates product variants for each product', async () => {
      mockPrisma.product.count.mockResolvedValue(0)
      mockPrisma.product.createMany.mockResolvedValue({ count: 1 })
      mockPrisma.productImage.createMany.mockResolvedValue({ count: 3 })
      mockPrisma.productVariant.createMany.mockResolvedValue({ count: 2 })

      await syncReninProducts(mockPrisma)

      expect(mockPrisma.productVariant.createMany).toHaveBeenCalled()
    })

    it('skips sync if products already exist', async () => {
      mockPrisma.product.count.mockResolvedValue(69) // Products already in DB

      const result = await syncReninProducts(mockPrisma)

      expect(result.success).toBe(true)
      expect(result.skipped).toBe(true)
      expect(result.message).toContain('already exist')
      expect(mockPrisma.product.createMany).not.toHaveBeenCalled()
    })

    it('can force sync even if products exist', async () => {
      mockPrisma.product.count.mockResolvedValue(69)
      mockPrisma.product.deleteMany.mockResolvedValue({ count: 69 })
      mockPrisma.product.createMany.mockResolvedValue({ count: 69 })
      mockPrisma.productImage.createMany.mockResolvedValue({ count: 150 })
      mockPrisma.productVariant.createMany.mockResolvedValue({ count: 75 })

      const result = await syncReninProducts(mockPrisma, { force: true })

      expect(result.success).toBe(true)
      expect(result.skipped).toBeFalsy()
      expect(mockPrisma.product.deleteMany).toHaveBeenCalled()
      expect(mockPrisma.product.createMany).toHaveBeenCalled()
    })

    it('returns error details on failure', async () => {
      mockPrisma.product.count.mockResolvedValue(0)
      mockPrisma.product.createMany.mockRejectedValue(new Error('Database connection failed'))

      const result = await syncReninProducts(mockPrisma)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Database connection failed')
    })
  })
})
