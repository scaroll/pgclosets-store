// Form System Type Definitions

export interface BaseFormFieldProps {
  label?: string
  error?: string
  success?: string
  helperText?: string
  disabled?: boolean
  required?: boolean
  className?: string
  name?: string
  id?: string
}

export interface ValidationState {
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
  error?: string
  success?: string
}

export interface FormSubmitState {
  isSubmitting: boolean
  isSubmitted: boolean
  submitCount: number
  error?: string
}

export type InputSize = "sm" | "md" | "lg"
export type InputVariant = "default" | "outline" | "ghost"
export type ValidationMode = "onChange" | "onBlur" | "onSubmit" | "all"

// Re-export common types
export type {
  FloatingInputProps,
  FloatingTextAreaProps,
  AppleSelectProps,
  SelectOption,
  AppleCheckboxProps,
  AppleRadioGroupProps,
  AppleToggleProps,
  RadioOption,
  ContactFormData,
  QuoteFormData,
} from './index'
