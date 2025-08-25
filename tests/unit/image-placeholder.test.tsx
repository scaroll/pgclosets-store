import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'

describe('ImagePlaceholder', () => {
  it('renders placeholder when no src provided', () => {
    render(<ImagePlaceholder alt="Test placeholder" />)
    
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Test placeholder')
  })

  it('renders with custom dimensions', () => {
    render(
      <ImagePlaceholder 
        alt="Test placeholder" 
        width={500} 
        height={300} 
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(
      <ImagePlaceholder 
        alt="Test placeholder" 
        className="custom-class" 
      />
    )
    
    const container = screen.getByRole('img').parentElement
    expect(container).toHaveClass('custom-class')
  })
})