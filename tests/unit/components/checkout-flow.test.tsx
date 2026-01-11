import { CheckoutFlow } from '@/components/checkout/checkout-flow'
import { useCartStore } from '@/lib/stores/cart-store'
import { fireEvent, render, screen } from '@testing-library/react'

// Mock the cart store
vi.mock('@/lib/stores/cart-store', () => ({
  useCartStore: vi.fn(),
}))

describe('CheckoutFlow Component', () => {
  const mockClearCart = vi.fn()

  beforeEach(() => {
    ;(useCartStore as any).mockReturnValue({
      items: [{ id: '1', name: 'Product 1', price: 100, quantity: 1 }],
      totalPrice: () => 100,
      clearCart: mockClearCart,
    })
  })

  test('renders shipping step initially', () => {
    render(<CheckoutFlow />)
    expect(screen.getByText('Shipping Information')).toBeInTheDocument()
  })

  test('navigates to payment after shipping submitted', () => {
    render(<CheckoutFlow />)

    // Fill shipping form
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } })
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Toronto' } })

    // Submit
    fireEvent.click(screen.getByText('Continue to Payment'))

    // Expect Payment Step
    expect(screen.getByText('Payment Details')).toBeInTheDocument()
  })
})
