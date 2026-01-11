import { ProductSearch } from '@/components/products/product-search'
import { fireEvent, render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'

// Mock the navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

describe('ProductSearch Component', () => {
  const mockPush = vi.fn()

  beforeEach(() => {
    ;(useRouter as any).mockReturnValue({
      push: mockPush,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders search input', () => {
    render(<ProductSearch />)
    const input = screen.getByPlaceholderText(/search for products/i)
    expect(input).toBeInTheDocument()
  })

  test('handles input change', () => {
    render(<ProductSearch />)
    const input = screen.getByPlaceholderText(/search for products/i)
    fireEvent.change(input, { target: { value: 'barn door' } })
    expect(input).toHaveValue('barn door')
  })

  test('navigates on submit', () => {
    render(<ProductSearch />)
    const form = screen.getByRole('form')
    const input = screen.getByPlaceholderText(/search for products/i)
    fireEvent.change(input, { target: { value: 'search term' } })
    fireEvent.submit(form)

    expect(mockPush).toHaveBeenCalledWith('/products?q=search+term')
  })
})
