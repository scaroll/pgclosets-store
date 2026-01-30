import { render, screen } from '@/app/utils/test-utils'
import { describe, expect, it, vi } from 'vitest'
import HomePage from './page'

// Mock the components to avoid deep rendering issues and speed up tests
vi.mock('@/components/home/hero', () => ({
  VideoHero: () => <div data-testid="video-hero">Video Hero</div>,
}))

vi.mock('@/components/products/product-card', () => ({
  ProductCard: () => <div data-testid="product-card">Product Card</div>,
}))

vi.mock('@/components/ui/bento-grid', () => ({
  BentoGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bento-grid">{children}</div>
  ),
  BentoGridItem: () => <div data-testid="bento-grid-item">Bento Grid Item</div>,
}))

vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: () => <img alt="mock" />,
}))

// Mock IntersectionObserver
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

describe('HomePage', () => {
  it('renders the hero section', async () => {
    const ResolvedHomePage = await HomePage()
    render(ResolvedHomePage)
    expect(screen.getByTestId('video-hero')).toBeInTheDocument()
  })

  it('renders section headers', async () => {
    const ResolvedHomePage = await HomePage()
    render(ResolvedHomePage)
    expect(screen.getByText('The Collection.')).toBeInTheDocument()
    expect(screen.getByText('Lifetime Warranty')).toBeInTheDocument()
  })
})
