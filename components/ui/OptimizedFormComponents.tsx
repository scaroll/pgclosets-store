"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Check, X, AlertCircle, Upload, Phone, MapPin, Calendar } from 'lucide-react'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'
import { Button } from '@/ui/button'
import { Label } from '@/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  required?: boolean
  disabled?: boolean
  error?: string
  success?: string
  hint?: string
  className?: string
  autoComplete?: string
}

interface FormValidation {
  isValid: boolean
  message?: string
}

// Enhanced Input Field with built-in validation
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  success,
  hint,
  className,
  autoComplete
}) => {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [validation, setValidation] = useState<FormValidation>({ isValid: true })

  const validateField = (fieldValue: string): FormValidation => {
    if (required && !fieldValue.trim()) {
      return { isValid: false, message: `${label} is required` }
    }

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (fieldValue && !emailRegex.test(fieldValue)) {
          return { isValid: false, message: 'Please enter a valid email address' }
        }
        break

      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
        if (fieldValue && !phoneRegex.test(fieldValue.replace(/\D/g, ''))) {
          return { isValid: false, message: 'Please enter a valid phone number' }
        }
        break

      case 'password':
        if (fieldValue && fieldValue.length < 8) {
          return { isValid: false, message: 'Password must be at least 8 characters' }
        }
        if (fieldValue && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(fieldValue)) {
          return { isValid: false, message: 'Password must contain uppercase, lowercase, and number' }
        }
        break

      case 'url':
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
        if (fieldValue && !urlRegex.test(fieldValue)) {
          return { isValid: false, message: 'Please enter a valid URL' }
        }
        break
    }

    return { isValid: true }
  }

  useEffect(() => {
    if (value) {
      const result = validateField(value)
      setValidation(result)
    }
  }, [value, type, required, label])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // Format phone numbers
    if (type === 'phone') {
      const digits = newValue.replace(/\D/g, '')
      if (digits.length <= 10) {
        newValue = digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
      }
    }

    onChange(newValue)
  }

  const handleBlur = () => {
    setFocused(false)
    const result = validateField(value)
    setValidation(result)
    onBlur?.()
  }

  const hasError = error || (!validation.isValid && value)
  const hasSuccess = success || (validation.isValid && value && !error)
  const displayError = error || validation.message

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        htmlFor={name}
        className={cn(
          'text-sm font-medium transition-colors',
          hasError ? 'text-red-600' : hasSuccess ? 'text-green-600' : 'text-gray-700',
          required && 'after:content-["*"] after:text-red-500 after:ml-1'
        )}
      >
        {label}
      </Label>

      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={cn(
            'transition-all duration-200 pr-10',
            focused && 'ring-2 ring-amber-500 border-amber-500',
            hasError && 'border-red-500 ring-red-500 ring-1',
            hasSuccess && 'border-green-500 ring-green-500 ring-1',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />

        {/* Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {type === 'phone' && <Phone className="w-4 h-4 text-gray-400" />}

          {hasError && <AlertCircle className="w-4 h-4 text-red-500" />}
          {hasSuccess && <Check className="w-4 h-4 text-green-500" />}
        </div>

        {/* Animated border */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-amber-500"
          initial={{ width: 0 }}
          animate={{ width: focused ? '100%' : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Messages */}
      <AnimatePresence>
        {(hint || displayError || success) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {hasError && displayError && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {displayError}
              </p>
            )}
            {hasSuccess && success && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {success}
              </p>
            )}
            {!hasError && !hasSuccess && hint && (
              <p className="text-sm text-gray-500">{hint}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Enhanced Textarea Field
interface TextareaFieldProps extends Omit<FormFieldProps, 'type'> {
  rows?: number
  maxLength?: number
  showCharCount?: boolean
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  disabled = false,
  error,
  success,
  hint,
  className,
  rows = 4,
  maxLength,
  showCharCount = false
}) => {
  const [focused, setFocused] = useState(false)

  const handleBlur = () => {
    setFocused(false)
    onBlur?.()
  }

  const hasError = !!error
  const hasSuccess = !!success
  const charCount = value.length
  const isNearLimit = maxLength && charCount > maxLength * 0.8

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center">
        <Label
          htmlFor={name}
          className={cn(
            'text-sm font-medium transition-colors',
            hasError ? 'text-red-600' : hasSuccess ? 'text-green-600' : 'text-gray-700',
            required && 'after:content-["*"] after:text-red-500 after:ml-1'
          )}
        >
          {label}
        </Label>
        {showCharCount && maxLength && (
          <span className={cn(
            'text-xs',
            isNearLimit ? 'text-amber-600' : charCount >= maxLength ? 'text-red-600' : 'text-gray-500'
          )}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        <Textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => {
            if (!maxLength || e.target.value.length <= maxLength) {
              onChange(e.target.value)
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            'transition-all duration-200 resize-none',
            focused && 'ring-2 ring-amber-500 border-amber-500',
            hasError && 'border-red-500 ring-red-500 ring-1',
            hasSuccess && 'border-green-500 ring-green-500 ring-1',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />

        {/* Animated border */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-amber-500"
          initial={{ width: 0 }}
          animate={{ width: focused ? '100%' : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Messages */}
      <AnimatePresence>
        {(hint || error || success) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {hasError && error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            {hasSuccess && success && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="w-3 h-3" />
                {success}
              </p>
            )}
            {!hasError && !hasSuccess && hint && (
              <p className="text-sm text-gray-500">{hint}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// File Upload Field
interface FileUploadFieldProps {
  label: string
  name: string
  value: File[]
  onChange: (files: File[]) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  required?: boolean
  error?: string
  hint?: string
  className?: string
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  name,
  value,
  onChange,
  accept = "image/*",
  multiple = false,
  maxSize = 5,
  maxFiles = 5,
  required = false,
  error,
  hint,
  className
}) => {
  const [dragOver, setDragOver] = useState(false)

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }
    return null
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    for (const file of newFiles) {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    }

    if (multiple) {
      const totalFiles = value.length + validFiles.length
      if (totalFiles > maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`)
        onChange([...value, ...validFiles].slice(0, maxFiles))
      } else {
        onChange([...value, ...validFiles])
      }
    } else {
      onChange(validFiles.slice(0, 1))
    }

    if (errors.length > 0) {
      console.error('File upload errors:', errors)
    }
  }

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label
        className={cn(
          'text-sm font-medium',
          error ? 'text-red-600' : 'text-gray-700',
          required && 'after:content-["*"] after:text-red-500 after:ml-1'
        )}
      >
        {label}
      </Label>

      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200',
          dragOver ? 'border-amber-500 bg-amber-50' : 'border-gray-300',
          error && 'border-red-500'
        )}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Drop files here or{' '}
          <label className="text-amber-600 hover:text-amber-700 cursor-pointer font-medium">
            browse
            <input
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </label>
        </p>
        <p className="text-xs text-gray-500">
          {accept} up to {maxSize}MB{multiple && `, max ${maxFiles} files`}
        </p>
      </div>

      {/* File Preview */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
                  <Upload className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {(hint || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
            {!error && hint && (
              <p className="text-sm text-gray-500">{hint}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Form submission button with loading state
interface SubmitButtonProps {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  loading = false,
  disabled = false,
  className,
  onClick,
  type = 'submit'
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'relative overflow-hidden transition-all duration-200',
        loading && 'cursor-not-allowed',
        className
      )}
    >
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

export default {
  FormField,
  TextareaField,
  FileUploadField,
  SubmitButton
}