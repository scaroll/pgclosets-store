import { render, screen } from '@testing-library/react'
import { ProductGrid } from '@/components/products/product-grid'
import { mockProducts } from '../fixtures/mockProducts'

// Mock the ProductCard component
jest.mock('@/components/products/product-card', () => ({
  ProductCard: ({ product }: { product: any }) => (
    <div data-testid={`product-card-${product.id}`}>
      <h3>{product.title}</h3>
    </div>
  )
}))

describe('ProductGrid', () => {
  describe('Basic Rendering', () => {
    it('renders all products in the grid', () => {
      render(<ProductGrid products={mockProducts} />)

      mockProducts.forEach(product => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument()
        expect(screen.getByText(product.title)).toBeInTheDocument()
      })
    })

    it('applies correct grid classes', () => {
      const { container } = render(<ProductGrid products={mockProducts} />)

      const grid = container.firstChild
      expect(grid).toHaveClass('grid')
      expect(grid).toHaveClass('grid-cols-1')
      expect(grid).toHaveClass('md:grid-cols-2')
      expect(grid).toHaveClass('lg:grid-cols-3')
      expect(grid).toHaveClass('xl:grid-cols-4')
    })

    it('has proper spacing between items', () => {
      const { container } = render(<ProductGrid products={mockProducts} />)

      const grid = container.firstChild
      expect(grid).toHaveClass('gap-6')
    })
  })

  describe('Empty State', () => {
    it('renders nothing when products array is empty', () => {
      const { container } = render(<ProductGrid products={[]} />)

      const grid = container.firstChild
      expect(grid).toBeEmptyDOMElement()
    })

    it('handles undefined products gracefully', () => {
      expect(() => {
        render(<ProductGrid products={undefined as any} />)
      }).not.toThrow()
    })
  })

  describe('Performance', () => {
    it('renders large number of products efficiently', () => {
      const largeProductList = Array.from({ length: 100 }, (_, index) => ({
        ...mockProducts[0],
        id: `product-${index}`,
        title: `Product ${index}`
      }))

      const startTime = performance.now()
      render(<ProductGrid products={largeProductList} />)
      const endTime = performance.now()

      // Should render within reasonable time (less than 100ms)
      expect(endTime - startTime).toBeLessThan(100)

      // Verify all products are rendered
      expect(screen.getAllByTestId(/product-card-/)).toHaveLength(100)
    })
  })

  describe('Responsive Design', () => {
    it('has mobile-first responsive classes', () => {
      const { container } = render(<ProductGrid products={mockProducts} />)

      const grid = container.firstChild

      // Mobile: 1 column
      expect(grid).toHaveClass('grid-cols-1')

      // Tablet: 2 columns
      expect(grid).toHaveClass('md:grid-cols-2')

      // Desktop: 3 columns
      expect(grid).toHaveClass('lg:grid-cols-3')

      // Large desktop: 4 columns
      expect(grid).toHaveClass('xl:grid-cols-4')
    })
  })

  describe('Accessibility', () => {
    it('maintains proper document structure', () => {
      render(<ProductGrid products={mockProducts} />)

      const grid = document.querySelector('.grid')
      expect(grid).toBeInTheDocument()

      // Each product card should be properly structured
      mockProducts.forEach(product => {
        const card = screen.getByTestId(`product-card-${product.id}`)
        expect(card).toBeInTheDocument()
      })
    })

    it('supports keyboard navigation through grid', () => {
      render(<ProductGrid products={mockProducts} />)

      // The grid itself should not interfere with keyboard navigation
      // Individual product cards should handle their own focus states
      const grid = document.querySelector('.grid')
      expect(grid).not.toHaveAttribute('tabindex')
    })
  })

  describe('Product Ordering', () => {
    it('maintains product order as provided', () => {
      render(<ProductGrid products={mockProducts} />)

      const productCards = screen.getAllByTestId(/product-card-/)

      // Should render in the same order as the input array
      mockProducts.forEach((product, index) => {
        expect(productCards[index]).toHaveAttribute('data-testid', `product-card-${product.id}`)
      })
    })
  })

  describe('Loading States', () => {
    it('can handle products being undefined during loading', () => {
      const { rerender } = render(<ProductGrid products={undefined as any} />)

      // Should not crash
      expect(document.querySelector('.grid')).toBeInTheDocument()

      // Should update when products are loaded
      rerender(<ProductGrid products={mockProducts} />)
      expect(screen.getAllByTestId(/product-card-/)).toHaveLength(mockProducts.length)
    })

    it('can handle empty array during initial load', () => {
      const { rerender } = render(<ProductGrid products={[]} />)

      const grid = document.querySelector('.grid')
      expect(grid).toBeEmptyDOMElement()

      // Should populate when products arrive
      rerender(<ProductGrid products={mockProducts} />)
      expect(screen.getAllByTestId(/product-card-/)).toHaveLength(mockProducts.length)
    })
  })

  describe('Grid Layout Behavior', () => {
    it('applies auto-fit behavior for responsive columns', () => {
      const { container } = render(<ProductGrid products={mockProducts} />)

      const grid = container.firstChild

      // Should use CSS Grid with proper responsive breakpoints
      expect(grid).toHaveClass('grid')

      // Verify it's using responsive grid classes rather than auto-fit
      // (since we're using Tailwind responsive classes)
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4')
    })

    it('maintains consistent gaps between items', () => {
      const { container } = render(<ProductGrid products={mockProducts} />)

      const grid = container.firstChild
      expect(grid).toHaveClass('gap-6')
    })
  })
})