import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductCard } from '@/components/products/product-card'
import {
  mockProduct,
  mockProductWithoutImages,
  mockProductOnSale,
  mockProductContactForPrice
} from '../fixtures/mockProducts'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
})

describe('ProductCard', () => {
  describe('Basic Rendering', () => {
    it('renders product information correctly', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText('Test Barn Door')).toBeInTheDocument()
      expect(screen.getByText('Barn Door')).toBeInTheDocument()
      expect(screen.getByText(/A beautiful test barn door/)).toBeInTheDocument()
      expect(screen.getByText('2 options available')).toBeInTheDocument()
    })

    it('renders product image with correct attributes', () => {
      render(<ProductCard product={mockProduct} />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'Test Barn Door main image')
      expect(image).toHaveAttribute('src', expect.stringContaining('barn-door-main.jpg'))
    })

    it('renders product link with correct href', () => {
      render(<ProductCard product={mockProduct} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/products/test-barn-door')
    })
  })

  describe('Price Display', () => {
    it('displays price range for multiple variants', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText('$599.99 - $649.99')).toBeInTheDocument()
    })

    it('displays single price when all variants have same price', () => {
      const singlePriceProduct = {
        ...mockProduct,
        variants: [mockProduct.variants[0]]
      }
      render(<ProductCard product={singlePriceProduct} />)

      expect(screen.getByText('$599.99')).toBeInTheDocument()
    })

    it('displays "Contact for Price" when price is 0', () => {
      render(<ProductCard product={mockProductContactForPrice} />)

      expect(screen.getByText('Contact for Price')).toBeInTheDocument()
    })

    it('formats prices in Canadian dollars', () => {
      render(<ProductCard product={mockProduct} />)

      const priceText = screen.getByText('$599.99 - $649.99')
      expect(priceText).toBeInTheDocument()
    })
  })

  describe('Sale Badge', () => {
    it('displays sale badge when product is on sale', () => {
      render(<ProductCard product={mockProductOnSale} />)

      expect(screen.getByText('Sale')).toBeInTheDocument()
    })

    it('does not display sale badge when product is not on sale', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.queryByText('Sale')).not.toBeInTheDocument()
    })
  })

  describe('Image Handling', () => {
    it('displays fallback image when no images are available', () => {
      render(<ProductCard product={mockProductWithoutImages} />)

      const fallbackDiv = screen.getByTestId('image-fallback') ||
                          document.querySelector('[data-testid="image-fallback"]') ||
                          document.querySelector('.bg-slate-100')

      expect(fallbackDiv).toBeInTheDocument()
    })

    it('handles image load error gracefully', async () => {
      render(<ProductCard product={mockProduct} />)

      const image = screen.getByRole('img')

      // Simulate image error
      fireEvent.error(image)

      await waitFor(() => {
        const fallbackIcon = document.querySelector('svg')
        expect(fallbackIcon).toBeInTheDocument()
      })
    })

    it('shows loading state initially', () => {
      render(<ProductCard product={mockProduct} />)

      const shimmer = document.querySelector('.animate-shimmer')
      expect(shimmer).toBeInTheDocument()
    })

    it('removes loading state when image loads', async () => {
      render(<ProductCard product={mockProduct} />)

      const image = screen.getByRole('img')

      // Simulate image load
      fireEvent.load(image)

      await waitFor(() => {
        const shimmer = document.querySelector('.animate-shimmer')
        expect(shimmer).not.toBeInTheDocument()
      })
    })
  })

  describe('Tags Display', () => {
    it('displays up to 3 tags', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText('barn door')).toBeInTheDocument()
      expect(screen.getByText('modern')).toBeInTheDocument()
      expect(screen.getByText('premium')).toBeInTheDocument()
    })

    it('shows "+X more" when there are more than 3 tags', () => {
      const productWithManyTags = {
        ...mockProduct,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
      }
      render(<ProductCard product={productWithManyTags} />)

      expect(screen.getByText('+2 more')).toBeInTheDocument()
    })

    it('does not show tags section when no tags exist', () => {
      const productWithoutTags = {
        ...mockProduct,
        tags: []
      }
      render(<ProductCard product={productWithoutTags} />)

      const tagsContainer = document.querySelector('.flex.flex-wrap.gap-1.mt-4')
      expect(tagsContainer).not.toBeInTheDocument()
    })
  })

  describe('Options Display', () => {
    it('displays correct options count', () => {
      render(<ProductCard product={mockProduct} />)

      expect(screen.getByText('2 options available')).toBeInTheDocument()
    })

    it('displays singular "option" for single option', () => {
      const singleOptionProduct = {
        ...mockProduct,
        options: [mockProduct.options[0]]
      }
      render(<ProductCard product={singleOptionProduct} />)

      expect(screen.getByText('1 option available')).toBeInTheDocument()
    })

    it('does not show options text when no options exist', () => {
      const productWithoutOptions = {
        ...mockProduct,
        options: []
      }
      render(<ProductCard product={productWithoutOptions} />)

      expect(screen.queryByText(/option/)).not.toBeInTheDocument()
    })
  })

  describe('Hover Effects', () => {
    it('shows "View Details" button on hover', async () => {
      const user = userEvent.setup()
      render(<ProductCard product={mockProduct} />)

      const card = screen.getByRole('link')

      await user.hover(card)

      await waitFor(() => {
        expect(screen.getByText('View Details')).toBeInTheDocument()
      })
    })

    it('applies hover styles to image', async () => {
      const user = userEvent.setup()
      render(<ProductCard product={mockProduct} />)

      const card = screen.getByRole('link')

      await user.hover(card)

      const image = screen.getByRole('img')
      expect(image).toHaveClass('group-hover:scale-105')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<ProductCard product={mockProduct} />)

      const link = screen.getByRole('link')
      expect(link).toBeInTheDocument()

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt')
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      render(<ProductCard product={mockProduct} />)

      const link = screen.getByRole('link')

      await user.tab()
      expect(link).toHaveFocus()
    })

    it('has meaningful alt text for images', () => {
      render(<ProductCard product={mockProduct} />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', 'Test Barn Door main image')
    })
  })

  describe('Responsive Design', () => {
    it('has responsive classes for mobile', () => {
      render(<ProductCard product={mockProduct} />)

      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('sizes', expect.stringContaining('(max-width: 640px)'))
    })

    it('applies responsive padding classes', () => {
      render(<ProductCard product={mockProduct} />)

      const infoContainer = document.querySelector('.p-6')
      expect(infoContainer).toBeInTheDocument()
    })
  })

  describe('Error States', () => {
    it('handles missing product data gracefully', () => {
      const incompleteProduct = {
        ...mockProduct,
        title: '',
        description: ''
      }

      expect(() => {
        render(<ProductCard product={incompleteProduct} />)
      }).not.toThrow()
    })

    it('handles missing variant data', () => {
      const productWithoutVariants = {
        ...mockProduct,
        variants: []
      }

      render(<ProductCard product={productWithoutVariants} />)
      expect(screen.getByText('Contact for Price')).toBeInTheDocument()
    })
  })
})