import Page from '@/app/services/[slug]/page'
import { getServiceBySlug } from '@/lib/services'
import { render, screen } from '@testing-library/react'
import { notFound } from 'next/navigation'

// Mock lib/services
vi.mock('@/lib/services', () => ({
  getServiceBySlug: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}))

// Mock BookingCalendar (since it's a client component with state)
vi.mock('@/components/booking/booking-calendar', () => ({
  BookingCalendar: () => <div data-testid="booking-calendar">Booking Calendar</div>,
}))

// Mock Button
vi.mock('@/components/ui/button', () => ({
  Button: ({ children }: any) => <button>{children}</button>,
}))

// Mock Image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}))

const mockService = {
  id: 'test-service',
  title: 'Test Service',
  description: 'Test Description',
  features: ['Feature 1'],
  image: '/test.jpg',
}

describe('Service Detail Page', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders service details', async () => {
    ;(getServiceBySlug as any).mockReturnValue(mockService)

    const ui = await Page({ params: Promise.resolve({ slug: 'test-service' }) })
    render(ui)

    expect(screen.getByText('Test Service')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByTestId('booking-calendar')).toBeInTheDocument()
  })

  test('calls notFound if service missing', async () => {
    ;(getServiceBySlug as any).mockReturnValue(undefined)
    try {
      await Page({ params: Promise.resolve({ slug: 'missing' }) })
    } catch {}
    expect(notFound).toHaveBeenCalled()
  })
})
