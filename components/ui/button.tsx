import * as React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text'
  size?: 'default' | 'lg' | 'sm'
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          // Base styles
          'inline-flex items-center justify-center font-medium tracking-wide',
          'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
          'disabled:pointer-events-none disabled:opacity-50',
          'focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2',
          // Variants
          variant === 'primary' && [
            'bg-[var(--color-primary)] text-white rounded-full',
            'hover:bg-black hover:scale-[1.02]',
            'active:scale-[0.98]',
          ],
          variant === 'secondary' && [
            'bg-transparent text-[var(--color-primary)] rounded-full',
            'border border-[var(--color-primary)]',
            'hover:bg-[var(--color-primary)] hover:text-white',
          ],
          variant === 'text' && [
            'text-[var(--color-primary)] bg-transparent',
            'hover:text-[var(--color-accent)]',
            'relative after:absolute after:bottom-0 after:left-0',
            'after:h-px after:w-0 after:bg-[var(--color-accent)]',
            'after:transition-all after:duration-300',
            'hover:after:w-full',
          ],
          // Sizes
          size === 'default' && 'h-12 px-8 text-sm uppercase',
          size === 'lg' && 'h-14 px-10 text-base',
          size === 'sm' && 'h-10 px-6 text-xs uppercase',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
