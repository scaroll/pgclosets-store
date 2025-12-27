import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90', // Alias for default/primary test
        premium:
          'premium bg-gradient-to-r from-amber-500 to-amber-700 text-white shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-800 transition-all duration-300',
      },
      size: {
        default: 'h-11 px-4 py-2',
        sm: 'sm h-10 rounded-md px-3',
        lg: 'lg h-12 rounded-md px-8',
        icon: 'h-11 w-11',
        pill: 'h-11 px-6 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface LuxuryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  href?: string
}

const LuxuryButton = React.forwardRef<HTMLButtonElement, LuxuryButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, icon, href, children, ...props },
    ref
  ) => {
    // If href is provided, render as Link
    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}
          // @ts-ignore - Link doesn't accept ref to HTMLButtonElement seamlessly without casting
          passHref
        >
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </Link>
      )
    }

    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!loading && icon && <span className="mr-2">{icon}</span>}
        {children}
      </Comp>
    )
  }
)
LuxuryButton.displayName = 'LuxuryButton'

export { buttonVariants, LuxuryButton }
