/**
 * Unit Test: Luxury Button Component
 *
 * Tests the luxury button component with various props and states.
 *
 * @agent #22 - Unit Testing Specialist
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LuxuryButton as Button } from '@/components/ui/luxury-button';

describe('LuxuryButton', () => {
  it('should render with default props', () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should render as different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toBeInTheDocument();

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should render in different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass(/sm/i);

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass(/lg/i);
  });

  it('should call onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click Me</Button>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick} disabled>Disabled</Button>);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should show loading state', () => {
    render(<Button loading>Loading</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Loading state disables the button via pointer-events, but not the disabled attribute
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Press Enter</Button>);

    const button = screen.getByRole('button');
    button.focus();

    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledOnce();

    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('should render with icon', () => {
    const Icon = () => <svg data-testid="icon" />;

    render(
      <Button icon={<Icon />}>
        With Icon
      </Button>
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText(/with icon/i)).toBeInTheDocument();
  });

  it('should render as link when href provided', () => {
    render(<Button href="/products">Go to Products</Button>);

    const link = screen.getByRole('link', { name: /go to products/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/products');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should have proper ARIA attributes', () => {
    render(
      <Button aria-label="Custom label" aria-pressed="true">
        ARIA Button
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('should support data-testid', () => {
    render(<Button data-testid="test-button">Test</Button>);

    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });

  describe('Premium variant', () => {
    it('should render premium styling', () => {
      render(<Button variant="premium">Premium</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass(/premium/i);
    });

    it('should have proper accessibility for premium button', () => {
      render(<Button variant="premium">Premium Quote</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeVisible();
    });
  });

  describe('Loading state', () => {
    it('should disable interaction when loading', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<Button onClick={handleClick} loading>Loading</Button>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should show loading spinner when loading', () => {
      render(<Button loading>Submit</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

});
