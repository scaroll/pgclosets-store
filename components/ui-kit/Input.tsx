import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Input Component - PG Closets Design System
 *
 * Unified input component with consistent styling and accessibility.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    const id = props.id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium tracking-wide text-black mb-2"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={id}
          className={cn(
            `
              w-full h-10 px-4 py-2
              text-base text-black
              bg-white border-2 border-black/20
              transition-all duration-300
              focus:outline-none focus:ring-3 focus:ring-black focus:border-black
              disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60
            `,
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <p
            id={`${id}-error`}
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p
            id={`${id}-helper`}
            className="mt-2 text-sm text-neutral-600"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label?: string;
    error?: string;
    helperText?: string;
  }
>(({ label, error, helperText, className, ...props }, ref) => {
  const id = props.id || props.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium tracking-wide text-black mb-2"
        >
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={id}
        className={cn(
          `
            w-full min-h-[120px] px-4 py-3
            text-base text-black
            bg-white border-2 border-black/20
            transition-all duration-300
            focus:outline-none focus:ring-3 focus:ring-black focus:border-black
            disabled:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60
            resize-vertical
          `,
          error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        {...props}
      />

      {error && (
        <p
          id={`${id}-error`}
          className="mt-2 text-sm text-red-600"
          role="alert"
        >
          {error}
        </p>
      )}

      {helperText && !error && (
        <p
          id={`${id}-helper`}
          className="mt-2 text-sm text-neutral-600"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
