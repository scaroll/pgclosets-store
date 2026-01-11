import { ProductFilters } from '@/components/products/product-filters'
import { fireEvent, render, screen } from '@testing-library/react'

describe('ProductFilters Component', () => {
  const mockOnFilterChange = vi.fn()

  test('renders filter options', () => {
    render(<ProductFilters onFilterChange={mockOnFilterChange} />)
    expect(screen.getByText('Categories')).toBeInTheDocument()
    expect(screen.getByText('Price Range')).toBeInTheDocument()
  })

  test('calls handler when category selected', () => {
    render(<ProductFilters onFilterChange={mockOnFilterChange} />)
    // Assuming we have a checkbox or button for a category like 'Barn Doors'
    const categoryOption = screen.getByLabelText('Barn Doors')
    fireEvent.click(categoryOption)

    expect(mockOnFilterChange).toHaveBeenCalled()
  })
})
