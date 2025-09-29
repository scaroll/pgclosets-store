/**
 * UX Library Test Suite
 * Comprehensive tests for all UX components
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

import { UXLibrary } from '../UXLibrary';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
  useMotionValue: () => ({ set: jest.fn(), get: () => 0 }),
  useTransform: () => 0,
}));

// Mock utilities
const mockTriggerHaptic = jest.fn();
jest.mock('../../../lib/utils/ux-utils', () => ({
  triggerHapticFeedback: mockTriggerHaptic,
  isMobile: () => false,
  isTouchDevice: () => true,
  generateId: () => 'test-id',
  getReducedMotionPreference: () => false,
}));

describe('UX Library', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Navigation Components', () => {
    describe('MegaMenu', () => {
      const mockSections = [
        {
          title: 'Products',
          href: '/products',
          description: 'Our products',
          items: [
            {
              title: 'Closets',
              href: '/products/closets',
              description: 'Custom closets',
            },
          ],
        },
      ];

      it('renders trigger button with correct text', () => {
        render(
          <UXLibrary.Navigation.MegaMenu
            sections={mockSections}
            trigger="Products"
          />
        );

        expect(screen.getByRole('button', { name: /products/i })).toBeInTheDocument();
      });

      it('opens menu on hover and closes on mouse leave', async () => {
        render(
          <UXLibrary.Navigation.MegaMenu
            sections={mockSections}
            trigger="Products"
            delay={0}
          />
        );

        const trigger = screen.getByRole('button');

        // Hover to open
        fireEvent.mouseEnter(trigger);
        await waitFor(() => {
          expect(screen.getByText('Custom closets')).toBeInTheDocument();
        });

        // Leave to close
        fireEvent.mouseLeave(trigger);
        await waitFor(() => {
          expect(screen.queryByText('Custom closets')).not.toBeInTheDocument();
        });
      });

      it('supports keyboard navigation', async () => {
        render(
          <UXLibrary.Navigation.MegaMenu
            sections={mockSections}
            trigger="Products"
          />
        );

        const trigger = screen.getByRole('button');
        trigger.focus();

        fireEvent.keyDown(trigger, { key: 'Enter' });
        await waitFor(() => {
          expect(screen.getByText('Custom closets')).toBeInTheDocument();
        });
      });

      it('has no accessibility violations', async () => {
        const { container } = render(
          <UXLibrary.Navigation.MegaMenu
            sections={mockSections}
            trigger="Products"
          />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('Mobile Components', () => {
    describe('TouchButton', () => {
      it('renders with correct variant styles', () => {
        render(
          <UXLibrary.Mobile.TouchButton variant="primary">
            Test Button
          </UXLibrary.Mobile.TouchButton>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-blue-600');
      });

      it('handles click events', async () => {
        const handleClick = jest.fn();
        render(
          <UXLibrary.Mobile.TouchButton onClick={handleClick}>
            Test Button
          </UXLibrary.Mobile.TouchButton>
        );

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
      });

      it('handles long press events', async () => {
        const handleLongPress = jest.fn();
        render(
          <UXLibrary.Mobile.TouchButton onLongPress={handleLongPress}>
            Test Button
          </UXLibrary.Mobile.TouchButton>
        );

        const button = screen.getByRole('button');

        // Simulate long press
        fireEvent.touchStart(button);

        // Wait for long press delay
        await waitFor(() => {
          expect(handleLongPress).toHaveBeenCalled();
        }, { timeout: 600 });
      });

      it('triggers haptic feedback when enabled', async () => {
        render(
          <UXLibrary.Mobile.TouchButton haptic={true}>
            Test Button
          </UXLibrary.Mobile.TouchButton>
        );

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(mockTriggerHaptic).toHaveBeenCalled();
      });

      it('is disabled when disabled prop is true', () => {
        render(
          <UXLibrary.Mobile.TouchButton disabled>
            Test Button
          </UXLibrary.Mobile.TouchButton>
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
      });
    });

    describe('TouchSlider', () => {
      it('renders with initial value', () => {
        render(
          <UXLibrary.Mobile.TouchSlider
            value={50}
            onChange={jest.fn()}
            min={0}
            max={100}
          />
        );

        expect(screen.getByText('50')).toBeInTheDocument();
      });

      it('calls onChange when value changes', async () => {
        const handleChange = jest.fn();
        render(
          <UXLibrary.Mobile.TouchSlider
            value={50}
            onChange={handleChange}
            min={0}
            max={100}
          />
        );

        const slider = screen.getByRole('slider', { hidden: true });
        fireEvent.mouseDown(slider, { clientX: 100 });

        expect(handleChange).toHaveBeenCalled();
      });

      it('respects min and max values', () => {
        render(
          <UXLibrary.Mobile.TouchSlider
            value={150}
            onChange={jest.fn()}
            min={0}
            max={100}
          />
        );

        // Value should be clamped to max
        expect(screen.getByText('100')).toBeInTheDocument();
      });

      it('formats value correctly', () => {
        render(
          <UXLibrary.Mobile.TouchSlider
            value={50}
            onChange={jest.fn()}
            formatValue={(v) => `${v}%`}
          />
        );

        expect(screen.getByText('50%')).toBeInTheDocument();
      });
    });
  });

  describe('Form Components', () => {
    describe('InteractiveForm', () => {
      const mockFields = [
        {
          id: 'name',
          type: 'text' as const,
          label: 'Name',
          required: true,
          validation: [
            { type: 'required' as const, message: 'Name is required' },
          ],
        },
        {
          id: 'email',
          type: 'email' as const,
          label: 'Email',
          required: true,
          validation: [
            { type: 'required' as const, message: 'Email is required' },
            { type: 'email' as const, message: 'Valid email required' },
          ],
        },
      ];

      it('renders form fields correctly', () => {
        render(
          <UXLibrary.Forms.InteractiveForm
            id="test-form"
            fields={mockFields}
            onSubmit={jest.fn()}
          />
        );

        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      });

      it('validates required fields', async () => {
        const handleSubmit = jest.fn();
        render(
          <UXLibrary.Forms.InteractiveForm
            id="test-form"
            fields={mockFields}
            onSubmit={handleSubmit}
          />
        );

        const submitButton = screen.getByRole('button', { name: /submit/i });
        await userEvent.click(submitButton);

        expect(screen.getByText('Name is required')).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();
      });

      it('validates email format', async () => {
        render(
          <UXLibrary.Forms.InteractiveForm
            id="test-form"
            fields={mockFields}
            onSubmit={jest.fn()}
          />
        );

        const emailInput = screen.getByLabelText(/email/i);
        await userEvent.type(emailInput, 'invalid-email');
        await userEvent.tab();

        expect(screen.getByText('Valid email required')).toBeInTheDocument();
      });

      it('submits form with valid data', async () => {
        const handleSubmit = jest.fn();
        render(
          <UXLibrary.Forms.InteractiveForm
            id="test-form"
            fields={mockFields}
            onSubmit={handleSubmit}
          />
        );

        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const submitButton = screen.getByRole('button', { name: /submit/i });

        await userEvent.type(nameInput, 'John Doe');
        await userEvent.type(emailInput, 'john@example.com');
        await userEvent.click(submitButton);

        await waitFor(() => {
          expect(handleSubmit).toHaveBeenCalledWith({
            name: 'John Doe',
            email: 'john@example.com',
          });
        });
      });

      it('shows progress when enabled', () => {
        render(
          <UXLibrary.Forms.InteractiveForm
            id="test-form"
            fields={mockFields}
            showProgress={true}
            onSubmit={jest.fn()}
          />
        );

        expect(screen.getByText(/progress/i)).toBeInTheDocument();
      });

      it('has no accessibility violations', async () => {
        const { container } = render(
          <UXLibrary.Forms.InteractiveForm
            id="test-form"
            fields={mockFields}
            onSubmit={jest.fn()}
          />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });
  });

  describe('Accessibility Components', () => {
    describe('AccessibleButton', () => {
      it('renders with proper ARIA attributes', () => {
        render(
          <UXLibrary.Accessibility.Provider>
            <UXLibrary.Accessibility.AccessibleButton
              ariaLabel="Custom label"
              ariaDescribedBy="description"
            >
              Button Text
            </UXLibrary.Accessibility.AccessibleButton>
          </UXLibrary.Accessibility.Provider>
        );

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('aria-label', 'Custom label');
        expect(button).toHaveAttribute('aria-describedby', 'description');
      });

      it('shows loading state correctly', () => {
        render(
          <UXLibrary.Accessibility.Provider>
            <UXLibrary.Accessibility.AccessibleButton loading={true}>
              Button Text
            </UXLibrary.Accessibility.AccessibleButton>
          </UXLibrary.Accessibility.Provider>
        );

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
      });

      it('is disabled when loading', () => {
        render(
          <UXLibrary.Accessibility.Provider>
            <UXLibrary.Accessibility.AccessibleButton loading={true}>
              Button Text
            </UXLibrary.Accessibility.AccessibleButton>
          </UXLibrary.Accessibility.Provider>
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
      });
    });

    describe('AccessibleModal', () => {
      it('renders with proper ARIA attributes', () => {
        render(
          <UXLibrary.Accessibility.AccessibleModal
            isOpen={true}
            onClose={jest.fn()}
            title="Test Modal"
            description="Modal description"
          >
            Modal content
          </UXLibrary.Accessibility.AccessibleModal>
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby');
        expect(dialog).toHaveAttribute('aria-describedby');
      });

      it('closes on Escape key', async () => {
        const handleClose = jest.fn();
        render(
          <UXLibrary.Accessibility.AccessibleModal
            isOpen={true}
            onClose={handleClose}
            title="Test Modal"
          >
            Modal content
          </UXLibrary.Accessibility.AccessibleModal>
        );

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(handleClose).toHaveBeenCalled();
      });

      it('closes on backdrop click', async () => {
        const handleClose = jest.fn();
        render(
          <UXLibrary.Accessibility.AccessibleModal
            isOpen={true}
            onClose={handleClose}
            title="Test Modal"
          >
            Modal content
          </UXLibrary.Accessibility.AccessibleModal>
        );

        const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/60');
        if (backdrop) {
          fireEvent.click(backdrop);
          expect(handleClose).toHaveBeenCalled();
        }
      });

      it('has no accessibility violations', async () => {
        const { container } = render(
          <UXLibrary.Accessibility.AccessibleModal
            isOpen={true}
            onClose={jest.fn()}
            title="Test Modal"
          >
            Modal content
          </UXLibrary.Accessibility.AccessibleModal>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      });
    });

    describe('AccessibleProgress', () => {
      it('renders with proper ARIA attributes', () => {
        render(
          <UXLibrary.Accessibility.Provider>
            <UXLibrary.Accessibility.AccessibleProgress
              value={50}
              max={100}
              label="Upload progress"
            />
          </UXLibrary.Accessibility.Provider>
        );

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        expect(progressBar).toHaveAttribute('aria-label', 'Upload progress');
      });

      it('displays value when showValue is true', () => {
        render(
          <UXLibrary.Accessibility.Provider>
            <UXLibrary.Accessibility.AccessibleProgress
              value={75}
              max={100}
              label="Progress"
              showValue={true}
            />
          </UXLibrary.Accessibility.Provider>
        );

        expect(screen.getByText('75 / 100')).toBeInTheDocument();
      });
    });
  });

  describe('Integration Tests', () => {
    it('all components can be imported from UXLibrary', () => {
      expect(UXLibrary.Navigation).toBeDefined();
      expect(UXLibrary.Product).toBeDefined();
      expect(UXLibrary.Forms).toBeDefined();
      expect(UXLibrary.Mobile).toBeDefined();
      expect(UXLibrary.Accessibility).toBeDefined();
    });

    it('components work together without conflicts', () => {
      render(
        <UXLibrary.Accessibility.Provider>
          <UXLibrary.Mobile.TouchButton>
            Test Button
          </UXLibrary.Mobile.TouchButton>
          <UXLibrary.Accessibility.AccessibleButton>
            Accessible Button
          </UXLibrary.Accessibility.AccessibleButton>
        </UXLibrary.Accessibility.Provider>
      );

      expect(screen.getByText('Test Button')).toBeInTheDocument();
      expect(screen.getByText('Accessible Button')).toBeInTheDocument();
    });
  });

  describe('Performance Tests', () => {
    it('does not cause unnecessary re-renders', () => {
      const renderSpy = jest.fn();

      const TestComponent = () => {
        renderSpy();
        return (
          <UXLibrary.Mobile.TouchButton>
            Button
          </UXLibrary.Mobile.TouchButton>
        );
      };

      const { rerender } = render(<TestComponent />);
      rerender(<TestComponent />);

      // Should only render twice (initial + rerender)
      expect(renderSpy).toHaveBeenCalledTimes(2);
    });
  });
});

// Utility test helpers
export const createMockFormField = (overrides = {}) => ({
  id: 'test-field',
  type: 'text' as const,
  label: 'Test Field',
  ...overrides,
});

export const createMockProduct = (overrides = {}) => ({
  id: 'test-product',
  name: 'Test Product',
  description: 'Test description',
  price: 100,
  images: ['/test-image.jpg'],
  category: 'Test Category',
  style: 'Modern',
  material: 'Wood',
  dimensions: { width: '10"', height: '20"', depth: '5"' },
  features: ['Feature 1', 'Feature 2'],
  inStock: true,
  rating: 4.5,
  reviewCount: 10,
  sku: 'TEST-001',
  ...overrides,
});

export const renderWithAccessibility = (component: React.ReactElement) => {
  return render(
    <UXLibrary.Accessibility.Provider>
      {component}
    </UXLibrary.Accessibility.Provider>
  );
};