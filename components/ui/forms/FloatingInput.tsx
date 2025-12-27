import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  success?: string
  showPasswordToggle?: boolean
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, type, label, error, success, showPasswordToggle, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type
    const inputId = id || `floating-input-${label.replace(/\s+/g, '-').toLowerCase()}`

    return (
      <div className="relative">
        <div className="relative">
          <input
            id={inputId}
            type={inputType}
            className={cn(
              'peer block w-full rounded-md border border-gray-200 px-3 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              success && 'border-green-500 focus:border-green-500 focus:ring-green-500',
              className
            )}
            placeholder=" "
            ref={ref}
            {...props}
          />
          <label
            htmlFor={inputId}
            className="absolute left-3 top-3 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75"
          >
            {label}
          </label>
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {success && <p className="mt-1 text-xs text-green-500">{success}</p>}
      </div>
    )
  }
)
FloatingInput.displayName = 'FloatingInput'
