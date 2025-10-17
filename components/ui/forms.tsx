/**
 * Form Components
 * Token-based form system with validation and accessibility
 * Accessibility: WCAG AA, proper labels, error states, keyboard navigation
 */

import React, { useState, useId } from 'react';
import { colors, spacing, radius, components, typography, shadows } from '@/lib/design-tokens';

/* ========================================
   FORM CONTAINER
======================================== */

interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  ariaLabel?: string;
}

export const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  className = '',
  ariaLabel,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`form ${className}`}
      aria-label={ariaLabel}
      noValidate
    >
      {children}
    </form>
  );
};

/* ========================================
   FORM FIELD (Container for input + label + error)
======================================== */

interface FormFieldProps {
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  error,
  className = '',
}) => (
  <div
    className={`form-field ${className}`}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: spacing.xs,
      marginBottom: spacing.md,
    }}
  >
    {children}
    {error && (
      <span
        role="alert"
        style={{
          fontSize: typography.sizes.sm[0],
          color: colors.semantic.error.DEFAULT,
          marginTop: spacing.xs,
        }}
      >
        {error}
      </span>
    )}
  </div>
);

/* ========================================
   LABEL
======================================== */

interface LabelProps {
  children: React.ReactNode;
  htmlFor: string;
  required?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  required = false,
  className = '',
}) => (
  <label
    htmlFor={htmlFor}
    className={`label ${className}`}
    style={{
      fontSize: typography.sizes.sm[0],
      fontWeight: typography.weights.medium,
      color: colors.gray[900],
      lineHeight: typography.lineHeights.normal,
    }}
  >
    {children}
    {required && (
      <span
        aria-label="required"
        style={{
          color: colors.semantic.error.DEFAULT,
          marginLeft: spacing[1],
        }}
      >
        *
      </span>
    )}
  </label>
);

/* ========================================
   INPUT
======================================== */

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      required = false,
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const [isFocused, setIsFocused] = useState(false);

    const baseStyles: React.CSSProperties = {
      height: components.input.height,
      padding: components.input.padding,
      paddingLeft: leftIcon ? spacing[10] : components.input.padding,
      paddingRight: rightIcon ? spacing[10] : components.input.padding,
      fontSize: components.input.fontSize,
      fontFamily: typography.fonts.body,
      border: `${components.input.borderWidth} solid ${
        error ? colors.semantic.error.DEFAULT : colors.gray[300]
      }`,
      borderRadius: components.input.radius,
      background: disabled ? colors.gray[100] : colors.brand.white,
      color: disabled ? colors.interactive.disabled : colors.gray[900],
      outline: 'none',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      width: '100%',
    };

    const focusStyles: React.CSSProperties = isFocused
      ? {
          borderColor: error ? colors.semantic.error.DEFAULT : colors.interactive.focus,
          boxShadow: `0 0 0 3px ${
            error
              ? `${colors.semantic.error.DEFAULT}20`
              : `${colors.interactive.focus}20`
          }`,
        }
      : {};

    return (
      <FormField error={error}>
        {label && (
          <Label htmlFor={inputId} required={required}>
            {label}
          </Label>
        )}
        <div style={{ position: 'relative' }}>
          {leftIcon && (
            <div
              style={{
                position: 'absolute',
                left: spacing.md,
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.gray[500],
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            className={`input ${className}`}
            style={{ ...baseStyles, ...focusStyles }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {rightIcon && (
            <div
              style={{
                position: 'absolute',
                right: spacing.md,
                top: '50%',
                transform: 'translateY(-50%)',
                color: colors.gray[500],
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {helperText && !error && (
          <span
            id={helperId}
            style={{
              fontSize: typography.sizes.sm[0],
              color: colors.gray[600],
              marginTop: spacing.xs,
            }}
          >
            {helperText}
          </span>
        )}
      </FormField>
    );
  }
);

Input.displayName = 'Input';

/* ========================================
   TEXTAREA
======================================== */

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      resize = 'vertical',
      required = false,
      disabled = false,
      className = '',
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const [isFocused, setIsFocused] = useState(false);

    const baseStyles: React.CSSProperties = {
      padding: spacing.md,
      fontSize: components.input.fontSize,
      fontFamily: typography.fonts.body,
      border: `${components.input.borderWidth} solid ${
        error ? colors.semantic.error.DEFAULT : colors.gray[300]
      }`,
      borderRadius: components.input.radius,
      background: disabled ? colors.gray[100] : colors.brand.white,
      color: disabled ? colors.interactive.disabled : colors.gray[900],
      outline: 'none',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      width: '100%',
      resize,
      lineHeight: typography.lineHeights.relaxed,
    };

    const focusStyles: React.CSSProperties = isFocused
      ? {
          borderColor: error ? colors.semantic.error.DEFAULT : colors.interactive.focus,
          boxShadow: `0 0 0 3px ${
            error
              ? `${colors.semantic.error.DEFAULT}20`
              : `${colors.interactive.focus}20`
          }`,
        }
      : {};

    return (
      <FormField error={error}>
        {label && (
          <Label htmlFor={textareaId} required={required}>
            {label}
          </Label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`textarea ${className}`}
          style={{ ...baseStyles, ...focusStyles }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {helperText && !error && (
          <span
            id={helperId}
            style={{
              fontSize: typography.sizes.sm[0],
              color: colors.gray[600],
              marginTop: spacing.xs,
            }}
          >
            {helperText}
          </span>
        )}
      </FormField>
    );
  }
);

Textarea.displayName = 'Textarea';

/* ========================================
   SELECT
======================================== */

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      placeholder,
      required = false,
      disabled = false,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    const [isFocused, setIsFocused] = useState(false);

    const baseStyles: React.CSSProperties = {
      height: components.input.height,
      padding: components.input.padding,
      paddingRight: spacing[10],
      fontSize: components.input.fontSize,
      fontFamily: typography.fonts.body,
      border: `${components.input.borderWidth} solid ${
        error ? colors.semantic.error.DEFAULT : colors.gray[300]
      }`,
      borderRadius: components.input.radius,
      background: disabled ? colors.gray[100] : colors.brand.white,
      color: disabled ? colors.interactive.disabled : colors.gray[900],
      outline: 'none',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      width: '100%',
      cursor: disabled ? 'not-allowed' : 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236e6e73' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: `right ${spacing.md} center`,
    };

    const focusStyles: React.CSSProperties = isFocused
      ? {
          borderColor: error ? colors.semantic.error.DEFAULT : colors.interactive.focus,
          boxShadow: `0 0 0 3px ${
            error
              ? `${colors.semantic.error.DEFAULT}20`
              : `${colors.interactive.focus}20`
          }`,
        }
      : {};

    return (
      <FormField error={error}>
        {label && (
          <Label htmlFor={selectId} required={required}>
            {label}
          </Label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? errorId : helperText ? helperId : undefined
          }
          className={`select ${className}`}
          style={{ ...baseStyles, ...focusStyles }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {helperText && !error && (
          <span
            id={helperId}
            style={{
              fontSize: typography.sizes.sm[0],
              color: colors.gray[600],
              marginTop: spacing.xs,
            }}
          >
            {helperText}
          </span>
        )}
      </FormField>
    );
  }
);

Select.displayName = 'Select';

/* ========================================
   CHECKBOX
======================================== */

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, disabled = false, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <FormField error={error}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
          }}
        >
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            className={`checkbox ${className}`}
            style={{
              width: '20px',
              height: '20px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              accentColor: colors.brand.navy,
            }}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            style={{
              fontSize: typography.sizes.base[0],
              color: disabled ? colors.interactive.disabled : colors.gray[900],
              cursor: disabled ? 'not-allowed' : 'pointer',
              userSelect: 'none',
            }}
          >
            {label}
          </label>
        </div>
      </FormField>
    );
  }
);

Checkbox.displayName = 'Checkbox';

/* ========================================
   BUTTON
======================================== */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const buttonVariants = {
  primary: {
    bg: colors.brand.navy,
    color: colors.brand.white,
    border: 'none',
    hover: { bg: colors.brand.charcoal },
  },
  secondary: {
    bg: colors.gray[200],
    color: colors.gray[900],
    border: 'none',
    hover: { bg: colors.gray[300] },
  },
  outline: {
    bg: 'transparent',
    color: colors.brand.navy,
    border: `2px solid ${colors.brand.navy}`,
    hover: { bg: `${colors.brand.navy}10` },
  },
  ghost: {
    bg: 'transparent',
    color: colors.gray[700],
    border: 'none',
    hover: { bg: colors.gray[100] },
  },
  danger: {
    bg: colors.semantic.error.DEFAULT,
    color: colors.brand.white,
    border: 'none',
    hover: { bg: colors.semantic.error.dark },
  },
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      leftIcon,
      rightIcon,
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const variantStyles = buttonVariants[variant];
    const sizeStyles = components.button.sizes[size];

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      height: sizeStyles.height,
      padding: sizeStyles.padding,
      fontSize: sizeStyles.fontSize,
      fontWeight: typography.weights.medium,
      fontFamily: typography.fonts.body,
      background: variantStyles.bg,
      color: variantStyles.color,
      border: variantStyles.border,
      borderRadius: components.button.radius,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      outline: 'none',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      width: fullWidth ? '100%' : 'auto',
      minHeight: components.button.minTouchTarget,
      WebkitTapHighlightColor: 'transparent',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`button ${className}`}
        style={baseStyles}
        onMouseEnter={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.background = variantStyles.hover.bg;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = shadows.sm;
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled && !loading) {
            e.currentTarget.style.background = variantStyles.bg;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = `2px solid ${colors.interactive.focus}`;
          e.currentTarget.style.outlineOffset = '2px';
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = 'none';
        }}
        {...props}
      >
        {loading && <span>⏳</span>}
        {!loading && leftIcon && leftIcon}
        {children}
        {!loading && rightIcon && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

/* ========================================
   USAGE EXAMPLES
======================================== */

/*
// Contact form example
<Form onSubmit={(e) => console.log('submitted')} ariaLabel="Contact form">
  <Input
    label="Email"
    type="email"
    placeholder="you@example.com"
    required
    leftIcon={<EmailIcon />}
  />

  <Input
    label="Phone"
    type="tel"
    placeholder="(613) 555-0100"
    helperText="We'll call to confirm your appointment"
  />

  <Select
    label="Service"
    placeholder="Select a service"
    required
    options={[
      { value: 'closets', label: 'Custom Closets' },
      { value: 'doors', label: 'Barn Doors' },
      { value: 'consultation', label: 'Free Consultation' },
    ]}
  />

  <Textarea
    label="Message"
    placeholder="Tell us about your project..."
    rows={6}
    helperText="Max 500 characters"
  />

  <Checkbox
    label="I agree to receive marketing emails"
  />

  <Button type="submit" variant="primary" fullWidth>
    Request Quote
  </Button>
</Form>

// Error state example
<Input
  label="Email"
  type="email"
  error="Please enter a valid email address"
  value="invalid"
/>

// With icons
<Input
  label="Search products"
  placeholder="Search..."
  leftIcon={<SearchIcon />}
  rightIcon={<FilterIcon />}
/>

// Button variations
<HStack gap="sm">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Delete</Button>
</HStack>

// Loading state
<Button loading>Processing...</Button>
*/
