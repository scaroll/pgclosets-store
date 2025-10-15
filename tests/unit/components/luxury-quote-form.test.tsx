/**
 * Unit Test: Luxury Quote Form Component
 *
 * Tests form validation, submission, and user interactions.
 *
 * @agent #22 - Unit Testing Specialist
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LuxuryQuoteForm } from '@/components/ui/luxury-quote-form';

describe('LuxuryQuoteForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  describe('Rendering', () => {
    it('should render all required fields', () => {
      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit|send/i })).toBeInTheDocument();
    });

    it('should have proper form structure', () => {
      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const form = screen.getByRole('form') || screen.getByTestId('quote-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error for empty required fields', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/name.*required/i)).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/valid email/i)).toBeInTheDocument();
      });
    });

    it('should validate phone number format', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const phoneInput = screen.getByLabelText(/phone/i);
      await user.type(phoneInput, '123');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText(/valid phone/i)).toBeInTheDocument();
      });
    });

    it('should accept valid phone formats', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const phoneInput = screen.getByLabelText(/phone/i);

      // Test various valid formats
      const validFormats = [
        '6135551234',
        '(613) 555-1234',
        '613-555-1234',
        '613.555.1234'
      ];

      for (const phone of validFormats) {
        await user.clear(phoneInput);
        await user.type(phoneInput, phone);
        await user.tab();

        // Should not show error
        expect(screen.queryByText(/valid phone/i)).not.toBeInTheDocument();
      }
    });
  });

  describe('Form Submission', () => {
    it('should submit with valid data', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '6135551234');

      const detailsField = screen.queryByLabelText(/details|message/i);
      if (detailsField) {
        await user.type(detailsField, 'I need a custom closet');
      }

      // Submit
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledOnce();
      });

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '6135551234',
        })
      );
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const slowSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<LuxuryQuoteForm onSubmit={slowSubmit} />);

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '6135551234');

      // Submit
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await user.click(submitButton);

      // Should be disabled during submission
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(slowSubmit).toHaveBeenCalled();
      });
    });

    it('should handle submission errors', async () => {
      const user = userEvent.setup();
      const errorSubmit = vi.fn(() => Promise.reject(new Error('Submission failed')));

      render(<LuxuryQuoteForm onSubmit={errorSubmit} />);

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '6135551234');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('File Upload', () => {
    it('should allow file selection', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const fileInput = screen.queryByLabelText(/upload|attach|file/i);

      if (fileInput) {
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        await user.upload(fileInput, file);

        await waitFor(() => {
          expect(screen.getByText(/test\.jpg/i)).toBeInTheDocument();
        });
      }
    });

    it('should validate file type', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const fileInput = screen.queryByLabelText(/upload|attach|file/i);

      if (fileInput) {
        const invalidFile = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
        await user.upload(fileInput, invalidFile);

        await waitFor(() => {
          expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
        });
      }
    });

    it('should validate file size', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const fileInput = screen.queryByLabelText(/upload|attach|file/i);

      if (fileInput) {
        // Create large file (>10MB)
        const largeFile = new File([new ArrayBuffer(11 * 1024 * 1024)], 'large.jpg', {
          type: 'image/jpeg'
        });
        await user.upload(fileInput, largeFile);

        await waitFor(() => {
          expect(screen.getByText(/file too large|size limit/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Auto-save', () => {
    it('should save form data to localStorage', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} enableAutoSave />);

      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // Wait for auto-save
      await waitFor(() => {
        const saved = localStorage.getItem('quote-form-draft');
        expect(saved).toBeTruthy();
      }, { timeout: 2000 });
    });

    it('should restore form data from localStorage', () => {
      localStorage.setItem('quote-form-draft', JSON.stringify({
        name: 'Saved Name',
        email: 'saved@example.com'
      }));

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} enableAutoSave />);

      expect(screen.getByLabelText(/name/i)).toHaveValue('Saved Name');
      expect(screen.getByLabelText(/email/i)).toHaveValue('saved@example.com');
    });

    it('should clear saved data after successful submission', async () => {
      const user = userEvent.setup();

      localStorage.setItem('quote-form-draft', JSON.stringify({
        name: 'Saved Name',
        email: 'saved@example.com'
      }));

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} enableAutoSave />);

      await user.type(screen.getByLabelText(/phone/i), '6135551234');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(localStorage.getItem('quote-form-draft')).toBeNull();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const phoneInput = screen.getByLabelText(/phone/i);

      expect(nameInput).toHaveAccessibleName();
      expect(emailInput).toHaveAccessibleName();
      expect(phoneInput).toHaveAccessibleName();
    });

    it('should indicate required fields', () => {
      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeRequired();
    });

    it('should associate error messages with inputs', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        const errorId = nameInput.getAttribute('aria-describedby');
        expect(errorId).toBeTruthy();

        if (errorId) {
          const errorMessage = document.getElementById(errorId);
          expect(errorMessage).toHaveTextContent(/required/i);
        }
      });
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();

      render(<LuxuryQuoteForm onSubmit={mockOnSubmit} />);

      // Tab through form fields
      await user.tab();
      expect(screen.getByLabelText(/name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/phone/i)).toHaveFocus();
    });
  });
});
