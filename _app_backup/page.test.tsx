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

vi.mock('@/components/shared/section-header', () => ({
  SectionHeader: ({ title }: { title: string }) => <div data-testid="section-header">{title}</div>,
}))

vi.mock('@/components/shared/feature-card', () => ({
  FeatureCard: ({ title }: { title: string }) => <div data-testid="feature-card">{title}</div>,
}))

vi.mock('@/components/shared/testimonial-card', () => ({
  TestimonialCard: () => <div data-testid="testimonial-card">Testimonial Card</div>,
}))

vi.mock('@/components/shared/cta-section', () => ({
  CTASection: () => <div data-testid="cta-section">CTA Section</div>,
}))

vi.mock('@/components/shared/bento-grid', () => ({
  BentoGrid: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bento-grid">{children}</div>
  ),
  BentoGridItem: () => <div data-testid="bento-grid-item">Bento Grid Item</div>,
}))

vi.mock('next/image', () => ({
  default: () => <img alt="mock" />,
}))

describe('HomePage', () => {
  it('renders the hero section', () => {
    render(<HomePage />)
    expect(screen.getByTestId('video-hero')).toBeInTheDocument()
  })

  it('renders section headers', () => {
    render(<HomePage />)
    expect(screen.getByText('Bestselling Products')).toBeInTheDocument()
    expect(screen.getByText('Why Choose PG Closets')).toBeInTheDocument()
  })
})
