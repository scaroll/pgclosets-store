import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'

describe('ImagePlaceholder', () => {
  it('renders placeholder when no src provided', () => {
    const { getByRole } = render(<ImagePlaceholder alt="Test placeholder" />)
    
    const img = getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('alt', 'Test placeholder')
  })

  it('renders with custom dimensions', () => {
    const { getByRole } = render(
      <ImagePlaceholder 
        alt="Test placeholder" 
        width={500} 
        height={300} 
      />
    )
    
    const img = getByRole('img')
    expect(img).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    const { getByRole } = render(
      <ImagePlaceholder 
        alt="Test placeholder" 
        className="custom-class" 
      />
    )
    
    const container = getByRole('img').parentElement
    expect(container).toHaveClass('custom-class')
  })
})