// @ts-nocheck - Test file with dynamic types
/**
 * Unit Test: Luxury Quote Form Component
 *
 * Tests form validation, submission, and user interactions.
 *
 * @agent #22 - Unit Testing Specialist
 */

import { LuxuryQuoteForm } from '@/components/ui/luxury-quote-form'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the fetch API
global.fetch = vi.fn()

describe('LuxuryQuoteForm', () => {
  const mockOnClose = vi.fn()
  const mockProduct = {
    name: 'Premium Closet System',
    price: 5000,
  }

  beforeEach(() => {
    mockOnClose.mockClear()
    vi.mocked(global.fetch).mockClear()
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)
  })

  describe('Rendering', () => {
    it('should render when open is true', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('should not render when open is false', () => {
      render(<LuxuryQuoteForm open={false} onClose={mockOnClose} />)

      expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument()
    })

    it('should display product information when provided', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} product={mockProduct} />)

      expect(screen.getByText('Premium Closet System')).toBeInTheDocument()
      expect(screen.getByText(/Starting at \$5000/i)).toBeInTheDocument()
    })

    it('should have proper form structure', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const submitButton = screen.getByRole('button', { name: /get quote/i })
      expect(submitButton).toBeInTheDocument()
    })
  })

  describe('Form Fields', () => {
    it('should render all required fields', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      expect(screen.getByLabelText(/your name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/project type/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/room dimensions/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/preferred timeline/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/product interest/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/additional details/i)).toBeInTheDocument()
    })

    it('should have name and email as required', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const nameInput = screen.getByLabelText(/your name/i)
      const emailInput = screen.getByLabelText(/email address/i)

      expect(nameInput).toBeRequired()
      expect(emailInput).toBeRequired()
    })
  })

  describe('Form Validation', () => {
    it('should prevent submission with empty required fields', async () => {
      const user = userEvent.setup()

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const submitButton = screen.getByRole('button', { name: /get quote/i })
      await user.click(submitButton)

      // HTML5 validation should prevent submission
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should validate email format', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement
      expect(emailInput.type).toBe('email')
    })
  })

  describe('Form Submission', () => {
    it('should submit with valid data', async () => {
      const user = userEvent.setup()

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      // Fill form
      await user.type(screen.getByLabelText(/your name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.type(screen.getByLabelText(/additional details/i), 'I need a custom closet')

      // Submit
      const submitButton = screen.getByRole('button', { name: /get quote/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/quotes/quick',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('John Doe'),
          })
        )
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()

      // Mock a slow response
      vi.mocked(global.fetch).mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                } as Response),
              100
            )
          )
      )

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      // Fill form
      await user.type(screen.getByLabelText(/your name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')

      // Submit
      const submitButton = screen.getByRole('button', { name: /get quote/i })
      await user.click(submitButton)

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/submitting/i)).toBeInTheDocument()
      })

      // Should be disabled during submission
      expect(submitButton).toBeDisabled()
    })

    it('should show success message after submission', async () => {
      const user = userEvent.setup()

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      // Fill and submit form
      await user.type(screen.getByLabelText(/your name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.click(screen.getByRole('button', { name: /get quote/i }))

      await waitFor(() => {
        expect(screen.getByText(/quote request received/i)).toBeInTheDocument()
      })
    })

    it('should include product information in submission', async () => {
      const user = userEvent.setup()

      render(
        <LuxuryQuoteForm
          open={true}
          onClose={mockOnClose}
          product={mockProduct}
          selectedOptions={{ finish: 'walnut', hardware: 'chrome' }}
        />
      )

      await user.type(screen.getByLabelText(/your name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.click(screen.getByRole('button', { name: /get quote/i }))

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/quotes/quick',
          expect.objectContaining({
            body: expect.stringContaining('Premium Closet System'),
          })
        )
      })

      const fetchCall = vi.mocked(global.fetch).mock.calls[0]
      if (fetchCall && fetchCall[1]?.body) {
        const callBody = JSON.parse(fetchCall[1].body as string)
        expect(callBody.selectedOptions).toEqual({ finish: 'walnut', hardware: 'chrome' })
      }
    })

    it('should handle submission errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock a failed response
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      await user.type(screen.getByLabelText(/your name/i), 'John Doe')
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
      await user.click(screen.getByRole('button', { name: /get quote/i }))

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Quote submission failed:', expect.any(Error))
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('User Interactions', () => {
    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup()

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const closeButton = screen.getAllByRole('button')[0] // X button
      await user.click(closeButton)

      expect(mockOnClose).toHaveBeenCalledOnce()
    })

    it('should close modal when backdrop is clicked', async () => {
      const user = userEvent.setup()

      const { container } = render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      // Find backdrop by class - Radix portals outside container
      const backdrop = document.querySelector('.backdrop-blur-sm')
      expect(backdrop).toBeInTheDocument()

      if (backdrop) {
        await user.click(backdrop)
        expect(mockOnClose).toHaveBeenCalledOnce()
      }
    })

    it('should update form fields on user input', async () => {
      const user = userEvent.setup()

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const nameInput = screen.getByLabelText(/your name/i) as HTMLInputElement
      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement

      await user.type(nameInput, 'Jane Smith')
      await user.type(emailInput, 'jane@example.com')

      expect(nameInput.value).toBe('Jane Smith')
      expect(emailInput.value).toBe('jane@example.com')
    })

    it('should handle select field changes', async () => {
      const user = userEvent.setup()

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const projectTypeSelect = screen.getByLabelText(/project type/i) as HTMLSelectElement
      await user.selectOptions(projectTypeSelect, 'new-installation')

      expect(projectTypeSelect.value).toBe('new-installation')
    })
  })

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const nameInput = screen.getByLabelText(/your name/i)
      const emailInput = screen.getByLabelText(/email address/i)

      expect(nameInput).toHaveAccessibleName()
      expect(emailInput).toHaveAccessibleName()
    })

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup()

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      // Tab through form fields
      await user.tab()
      expect(screen.getByLabelText(/your name/i)).toHaveFocus()

      await user.tab()
      expect(screen.getByLabelText(/email address/i)).toHaveFocus()
    })

    it('should have accessible close button', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} />)

      const closeButtons = screen.getAllByRole('button')
      expect(closeButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Product Integration', () => {
    it('should pre-fill product interest when product is provided', () => {
      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} product={mockProduct} />)

      const productInterestInput = screen.getByLabelText(/product interest/i) as HTMLInputElement
      expect(productInterestInput.value).toBe('Premium Closet System')
    })

    it('should handle product without price', () => {
      const productWithoutPrice = { name: 'Custom Closet' }

      render(<LuxuryQuoteForm open={true} onClose={mockOnClose} product={productWithoutPrice} />)

      expect(screen.getByText('Custom Closet')).toBeInTheDocument()
      expect(screen.queryByText(/Starting at/i)).not.toBeInTheDocument()
    })
  })
})
