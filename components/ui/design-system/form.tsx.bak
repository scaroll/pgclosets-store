/**
 * DESIGN SYSTEM FORM COMPONENTS
 * Luxury form inputs with perfect accessibility
 */

import * as React from 'react';
import { cn } from '@/lib/utils';

// Input Component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorMessage, ...props }, ref) => {
    return (
      <div className="ds-space-y-2">
        <input
          type={type}
          className={cn(
            'flex h-12 w-full rounded-none border-2 border-stone bg-white px-4 py-2',
            'text-base text-charcoal placeholder:text-stone',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:border-charcoal',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:ring-error',
            className
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={errorMessage ? `${props.id}-error` : undefined}
          {...props}
        />
        {errorMessage && (
          <p
            id={`${props.id}-error`}
            className="ds-body-sm text-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea Component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, errorMessage, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <textarea
          className={cn(
            'flex min-h-32 w-full rounded-none border-2 border-stone bg-white px-4 py-3',
            'text-base text-charcoal placeholder:text-stone',
            'transition-all duration-200 resize-vertical',
            'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:border-charcoal',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:ring-error',
            className
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={errorMessage ? `${props.id}-error` : undefined}
          {...props}
        />
        {errorMessage && (
          <p
            id={`${props.id}-error`}
            className="ds-body-sm text-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Select Component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  errorMessage?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, errorMessage, options, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <select
          className={cn(
            'flex h-12 w-full rounded-none border-2 border-stone bg-white px-4 py-2',
            'text-base text-charcoal',
            'transition-all duration-200 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:border-charcoal',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error focus:ring-error',
            className
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={errorMessage ? `${props.id}-error` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errorMessage && (
          <p
            id={`${props.id}-error`}
            className="ds-body-sm text-error"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Form Field Wrapper
export interface FormFieldProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
  helpText?: string;
}

export const FormField = ({ label, htmlFor, required, children, helpText }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="ds-label block">
        {label}
        {required && <span className="text-error ml-1" aria-label="required">*</span>}
      </label>
      {children}
      {helpText && (
        <p className="ds-body-sm text-stone">{helpText}</p>
      )}
    </div>
  );
};

FormField.displayName = 'FormField';
