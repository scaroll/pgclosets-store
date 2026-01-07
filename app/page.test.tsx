import { render, screen } from '@/app/utils/test-utils'
import { describe, expect, it, vi } from 'vitest'

// Mock the database client
vi.mock('@/lib/db/client', () => ({
  prisma: {
    product: {
      findMany: vi.fn().mockResolvedValue([]),
    },
  },
}))

// Mock the ProductCard component
vi.mock('@/components/products/ProductCard', () => ({
  ProductCard: () => <div data-testid="product-card">Product Card</div>,
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <div role="img" aria-label={alt} />,
}))

// Create a wrapper component to handle the async HomePage
async function getHomePageContent() {
  const HomePage = (await import('./page')).default
  return HomePage()
}

describe('HomePage', () => {
  it('renders the hero section', async () => {
    const content = await getHomePageContent()
    render(content)
    expect(screen.getByText(/Premium Custom Closets/)).toBeInTheDocument()
  })

  it('renders section headers', async () => {
    const content = await getHomePageContent()
    render(content)
    expect(screen.getByText('Featured Collection')).toBeInTheDocument()
    expect(screen.getByText('Serving the Greater Ottawa Area')).toBeInTheDocument()
  })
})
