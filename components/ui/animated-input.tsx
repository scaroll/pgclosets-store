'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input, InputProps } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface AnimatedInputProps extends InputProps {
  label?: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
  floatingLabel?: boolean
  animatedPlaceholder?: boolean
}

export default function AnimatedInput({
  label,
  error,
  success,
  icon,
  floatingLabel = false,
  animatedPlaceholder = false,
  className,
  value,
  onFocus,
  onBlur,
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setHasValue(!!value)
  }, [value])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const inputVariants = {
    focused: {
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      borderColor: 'rgb(59, 130, 246)',
    },
    error: {
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
      borderColor: 'rgb(239, 68, 68)',
      x: [0, -4, 4, -4, 4, 0],
      transition: {
        x: { duration: 0.5 },
        boxShadow: { duration: 0.2 },
        borderColor: { duration: 0.2 },
      }
    },
    success: {
      boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.1)',
      borderColor: 'rgb(34, 197, 94)',
    }
  }

  const labelVariants = {
    floating: {
      top: '-0.5rem',
      fontSize: '0.75rem',
      color: 'rgb(59, 130, 246)',
      backgroundColor: 'white',
      padding: '0 0.25rem',
    },
    resting: {
      top: '0.75rem',
      fontSize: '0.875rem',
      color: 'rgb(107, 114, 128)',
      padding: '0',
    }
  }

  const shouldFloat = (isFocused || hasValue) && floatingLabel

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <motion.label
          variants={floatingLabel ? labelVariants : undefined}
          animate={shouldFloat ? 'floating' : 'resting'}
          className={cn(
            'absolute left-3 transition-all duration-200 pointer-events-none z-10',
            !floatingLabel && 'top-3 text-sm font-medium text-gray-700'
          )}
        >
          {label}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input */}
        <motion.div
          variants={inputVariants}
          animate={
            error ? 'error' :
            success ? 'success' :
            isFocused ? 'focused' : 'resting'
          }
        >
          <Input
            ref={inputRef}
            value={value}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
              'transition-all duration-200',
              icon && 'pl-10',
              floatingLabel && 'pt-6',
              error && 'border-red-500',
              success && 'border-green-500',
              className
            )}
            {...props}
          />
        </motion.div>

        {/* Animated Placeholder */}
        {animatedPlaceholder && !hasValue && !isFocused && (
          <motion.div
            className="absolute inset-0 flex items-center px-3 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex space-x-1">
              {props.placeholder?.split('').map((char, i) => (
                <motion.span
                  key={i}
                  animate={{
                    opacity: [0, 1],
                    y: [10, 0],
                  }}
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: 'easeOut'
                  }}
                  className="text-gray-400"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Success Icon */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Icon */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      <AnimatePresence>
        {success && !error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-green-600"
          >
            Looks good!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Animated search input
export function AnimatedSearchInput({
  isOpen,
  onClose,
  onSearch,
  className
}: {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
  className?: string
}) {
  const [query, setQuery] = useState('')

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={cn('relative overflow-hidden', className)}
        >
          <Input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose()
              if (e.key === 'Enter') {
                onSearch(query)
                onClose()
              }
            }}
            className="border-0 shadow-none focus:ring-0"
            autoFocus
          />
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Animated textarea
export function AnimatedTextarea({
  label,
  error,
  success,
  className,
  value,
  onFocus,
  onBlur,
  ...props
}: {
  label?: string
  error?: string
  success?: boolean
  className?: string
  value?: string
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  [key: string]: any
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  useEffect(() => {
    setHasValue(!!value)
  }, [value])

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  return (
    <div className="relative">
      {/* Label */}
      {label && (
        <motion.label
          animate={{
            top: isFocused || hasValue ? '-0.5rem' : '0.75rem',
            fontSize: isFocused || hasValue ? '0.75rem' : '0.875rem',
            color: isFocused ? 'rgb(59, 130, 246)' : 'rgb(107, 114, 128)',
            backgroundColor: 'white',
            padding: isFocused || hasValue ? '0 0.25rem' : '0',
          }}
          className="absolute left-3 transition-all duration-200 pointer-events-none z-10"
        >
          {label}
        </motion.label>
      )}

      {/* Textarea */}
      <motion.textarea
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn(
          'min-h-[100px] resize-none border rounded-md px-3 py-6 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error && 'border-red-500 focus:ring-red-500',
          success && 'border-green-500 focus:ring-green-500',
          className
        )}
        animate={{
          boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' :
                   success ? '0 0 0 3px rgba(34, 197, 94, 0.1)' :
                   isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
        }}
        {...props}
      />

      {/* Character count */}
      {props.maxLength && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-2 right-2 text-xs text-gray-400"
        >
          {value?.length || 0}/{props.maxLength}
        </motion.div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-1 text-sm text-red-600"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}