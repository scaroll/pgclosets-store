import { cn } from '@/lib/utils'
import React, { useEffect, useRef } from 'react'

export interface FloatingTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  success?: string
  maxLength?: number
  autoResize?: boolean
  minRows?: number
}

export const FloatingTextArea = React.forwardRef<HTMLTextAreaElement, FloatingTextAreaProps>(
  (
    { className, label, error, success, maxLength, autoResize, minRows = 3, onChange, ...props },
    ref
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const activeRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef
    const [charCount, setCharCount] = React.useState(0)

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      const target = e.target as HTMLTextAreaElement
      setCharCount(target.value.length)

      if (autoResize) {
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) onChange(e)
      handleInput(e)
    }

    // Initial value count
    useEffect(() => {
      if (props.defaultValue) {
        setCharCount(String(props.defaultValue).length)
      }
    }, [props.defaultValue])

    return (
      <div className="relative">
        <div className="relative">
          <textarea
            className={cn(
              'peer block min-h-[100px] w-full resize-none rounded-md border border-gray-200 px-3 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
              success && 'border-green-500 focus:border-green-500 focus:ring-green-500',
              className
            )}
            placeholder=" "
            ref={activeRef}
            rows={minRows}
            maxLength={maxLength}
            onInput={handleInput}
            onChange={handleChange}
            {...props}
          />
          <label className="absolute left-3 top-3 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75">
            {label}
          </label>
          {maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {charCount}/{maxLength}
            </div>
          )}
        </div>
      </div>
    )
  }
)
FloatingTextArea.displayName = 'FloatingTextArea'
