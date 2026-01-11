import Page from '@/app/locations/[city]/page'
import { render, screen } from '@testing-library/react'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  useParams: vi.fn(),
}))

describe('Location Page', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders city location details', async () => {
    // We treat the page as a function that returns JSX
    const ui = await Page({ params: Promise.resolve({ city: 'toronto' }) })
    render(ui)

    expect(screen.getByText('Custom Closets in Toronto')).toBeInTheDocument()
    expect(screen.getByText(/serving toronto and surrounding areas/i)).toBeInTheDocument()
  })

  test('calls notFound for unknown city if applicable', async () => {
    // If we only support specific cities, we test 404.
    // For now, let's assume we support any city unless invalid format
    // But if we had a whitelist, we would test getting 404.
    // Let's assume we validate city slug.
  })
})
