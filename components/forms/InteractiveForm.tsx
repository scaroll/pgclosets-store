"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Info,
  X,
  Plus,
  Minus,
  Upload,
  Image as ImageIcon,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../ui/button';

// Validation rules
export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

// Field configuration
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'datetime-local' | 'time';
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  validation?: ValidationRule[];
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  multiple?: boolean;
  accept?: string; // for file inputs
  rows?: number; // for textarea
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
  dependsOn?: string; // field dependency
  showWhen?: (formData: Record<string, any>) => boolean;
  className?: string;
  icon?: React.ReactNode;
  helpText?: string;
  prefix?: string;
  suffix?: string;
}

// Form configuration
export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FormField[];
  submitText?: string;
  resetText?: string;
  showProgress?: boolean;
  showReset?: boolean;
  autoSave?: boolean;
  autoSaveDelay?: number;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onReset?: () => void;
  onFieldChange?: (fieldId: string, value: any, formData: Record<string, any>) => void;
  className?: string;
}

interface FormState {
  data: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
  submitting: boolean;
  submitted: boolean;
  dirty: boolean;
}

// Validation utilities
const validateField = (field: FormField, value: any, formData: Record<string, any>): string | null => {
  if (!field.validation) return null;

  for (const rule of field.validation) {
    switch (rule.type) {
      case 'required':
        if (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === '') {
          return rule.message;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return rule.message;
        }
        break;

      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return rule.message;
        }
        break;

      case 'min':
        if (value !== undefined && value !== null) {
          if (typeof value === 'string' && value.length < rule.value) {
            return rule.message;
          }
          if (typeof value === 'number' && value < rule.value) {
            return rule.message;
          }
        }
        break;

      case 'max':
        if (value !== undefined && value !== null) {
          if (typeof value === 'string' && value.length > rule.value) {
            return rule.message;
          }
          if (typeof value === 'number' && value > rule.value) {
            return rule.message;
          }
        }
        break;

      case 'pattern':
        if (value && !new RegExp(rule.value).test(value)) {
          return rule.message;
        }
        break;

      case 'custom':
        if (rule.validator && value !== undefined && !rule.validator(value)) {
          return rule.message;
        }
        break;
    }
  }

  return null;
};

// Field components
const TextInput: React.FC<{
  field: FormField;
  value: any;
  error: string | null;
  touched: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}> = ({ field, value, error, touched, onChange, onBlur }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = field.type === 'password' && showPassword ? 'text' : field.type;

  return (
    <div className="space-y-2">
      <div className={cn(
        "relative rounded-lg border transition-all duration-200",
        error && touched ? "border-red-300 bg-red-50" :
        focused ? "border-blue-500 bg-blue-50/30" : "border-gray-300 bg-white",
        field.disabled && "opacity-50 cursor-not-allowed"
      )}>
        {field.prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {field.prefix}
          </div>
        )}

        {field.icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {field.icon}
          </div>
        )}

        <input
          type={inputType}
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          onFocus={() => setFocused(true)}
          placeholder={field.placeholder}
          disabled={field.disabled}
          min={field.min}
          max={field.max}
          step={field.step}
          className={cn(
            "w-full px-3 py-3 bg-transparent border-0 outline-none placeholder-gray-400",
            field.icon || field.prefix ? "pl-10" : "",
            field.type === 'password' || field.suffix ? "pr-10" : "",
            field.className
          )}
        />

        {field.type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}

        {field.suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            {field.suffix}
          </div>
        )}
      </div>

      {field.helpText && !error && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Info className="h-3 w-3" />
          {field.helpText}
        </p>
      )}
    </div>
  );
};

const TextareaInput: React.FC<{
  field: FormField;
  value: any;
  error: string | null;
  touched: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}> = ({ field, value, error, touched, onChange, onBlur }) => {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (newValue: string) => {
    setCharCount(newValue.length);
    onChange(newValue);
  };

  const maxLength = field.validation?.find(rule => rule.type === 'max')?.value;

  return (
    <div className="space-y-2">
      <div className={cn(
        "relative rounded-lg border transition-all duration-200",
        error && touched ? "border-red-300 bg-red-50" :
        focused ? "border-blue-500 bg-blue-50/30" : "border-gray-300 bg-white",
        field.disabled && "opacity-50 cursor-not-allowed"
      )}>
        <textarea
          id={field.id}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          onFocus={() => setFocused(true)}
          placeholder={field.placeholder}
          disabled={field.disabled}
          rows={field.rows || 4}
          className={cn(
            "w-full px-3 py-3 bg-transparent border-0 outline-none placeholder-gray-400 resize-none",
            field.className
          )}
        />
      </div>

      <div className="flex justify-between items-center">
        {field.helpText && !error && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Info className="h-3 w-3" />
            {field.helpText}
          </p>
        )}
        {maxLength && (
          <p className={cn(
            "text-xs ml-auto",
            charCount > maxLength ? "text-red-500" : "text-gray-500"
          )}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};

const SelectInput: React.FC<{
  field: FormField;
  value: any;
  error: string | null;
  touched: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}> = ({ field, value, error, touched, onChange, onBlur }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-2">
      <div className={cn(
        "relative rounded-lg border transition-all duration-200",
        error && touched ? "border-red-300 bg-red-50" :
        focused ? "border-blue-500 bg-blue-50/30" : "border-gray-300 bg-white",
        field.disabled && "opacity-50 cursor-not-allowed"
      )}>
        <select
          id={field.id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          onFocus={() => setFocused(true)}
          disabled={field.disabled}
          className={cn(
            "w-full px-3 py-3 bg-transparent border-0 outline-none appearance-none cursor-pointer",
            field.className
          )}
        >
          {field.placeholder && (
            <option value="" disabled>
              {field.placeholder}
            </option>
          )}
          {field.options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const CheckboxInput: React.FC<{
  field: FormField;
  value: any;
  error: string | null;
  touched: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}> = ({ field, value, error, touched, onChange, onBlur }) => {
  const isChecked = Boolean(value);

  return (
    <div className="flex items-start space-x-3">
      <div className="relative">
        <input
          type="checkbox"
          id={field.id}
          checked={isChecked}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          disabled={field.disabled}
          className="sr-only"
        />
        <div
          className={cn(
            "w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer flex items-center justify-center",
            isChecked ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300",
            field.disabled && "opacity-50 cursor-not-allowed",
            error && touched && "border-red-300"
          )}
          onClick={() => !field.disabled && onChange(!isChecked)}
        >
          <AnimatePresence>
            {isChecked && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex-1">
        <label
          htmlFor={field.id}
          className={cn(
            "text-sm cursor-pointer",
            field.disabled ? "text-gray-400" : "text-gray-700"
          )}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {field.description && (
          <p className="text-xs text-gray-500 mt-1">{field.description}</p>
        )}
      </div>
    </div>
  );
};

const FileInput: React.FC<{
  field: FormField;
  value: any;
  error: string | null;
  touched: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}> = ({ field, value, error, touched, onChange, onBlur }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onChange(field.multiple ? files : files[0]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChange(field.multiple ? files : files[0]);
    onBlur();
  };

  const files = field.multiple ? (value || []) : (value ? [value] : []);

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200",
          dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50",
          error && touched && "border-red-300 bg-red-50",
          "hover:border-gray-400 cursor-pointer"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={field.id}
          multiple={field.multiple}
          accept={field.accept}
          onChange={handleFileChange}
          disabled={field.disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <div className="space-y-2">
          <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              Drop files here or click to browse
            </p>
            <p className="text-xs text-gray-500">
              {field.accept ? `Accepted formats: ${field.accept}` : 'All file types accepted'}
            </p>
          </div>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file: File, index: number) => (
            <motion.div
              key={`${file.name}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4 text-blue-600" />
                  ) : (
                    <FileText className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (field.multiple) {
                    const newFiles = files.filter((_, i) => i !== index);
                    onChange(newFiles.length > 0 ? newFiles : null);
                  } else {
                    onChange(null);
                  }
                }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Interactive Form Component
export const InteractiveForm: React.FC<FormConfig> = ({
  id,
  title,
  description,
  fields,
  submitText = 'Submit',
  resetText = 'Reset',
  showProgress = true,
  showReset = true,
  autoSave = false,
  autoSaveDelay = 1000,
  onSubmit,
  onReset,
  onFieldChange,
  className,
}) => {
  const [state, setState] = useState<FormState>({
    data: fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: field.defaultValue || (field.type === 'checkbox' ? false : ''),
    }), {}),
    errors: {},
    touched: {},
    loading: false,
    submitting: false,
    submitted: false,
    dirty: false,
  });

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && state.dirty) {
      const timeoutId = setTimeout(() => {
        // Implement auto-save logic here
        console.log('Auto-saving form data:', state.data);
      }, autoSaveDelay);

      return () => clearTimeout(timeoutId);
    }
  }, [state.data, autoSave, autoSaveDelay, state.dirty]);

  const updateField = useCallback((fieldId: string, value: any) => {
    setState(prev => {
      const newData = { ...prev.data, [fieldId]: value };
      const field = fields.find(f => f.id === fieldId);
      const error = field ? validateField(field, value, newData) : null;

      const newState = {
        ...prev,
        data: newData,
        errors: {
          ...prev.errors,
          [fieldId]: error || '',
        },
        dirty: true,
      };

      if (onFieldChange) {
        onFieldChange(fieldId, value, newData);
      }

      return newState;
    });
  }, [fields, onFieldChange]);

  const touchField = useCallback((fieldId: string) => {
    setState(prev => ({
      ...prev,
      touched: { ...prev.touched, [fieldId]: true },
    }));
  }, []);

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};

    for (const field of fields) {
      // Skip validation for hidden fields
      if (field.showWhen && !field.showWhen(state.data)) {
        continue;
      }

      const error = validateField(field, state.data[field.id], state.data);
      if (error) {
        errors[field.id] = error;
      }
    }

    setState(prev => ({
      ...prev,
      errors,
      touched: fields.reduce((acc, field) => ({
        ...acc,
        [field.id]: true,
      }), {}),
    }));

    return Object.keys(errors).length === 0;
  }, [fields, state.data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setState(prev => ({ ...prev, submitting: true }));

    try {
      await onSubmit(state.data);
      setState(prev => ({
        ...prev,
        submitting: false,
        submitted: true,
        dirty: false,
      }));
    } catch (error) {
      setState(prev => ({ ...prev, submitting: false }));
      console.error('Form submission error:', error);
    }
  };

  const handleReset = () => {
    const resetData = fields.reduce((acc, field) => ({
      ...acc,
      [field.id]: field.defaultValue || (field.type === 'checkbox' ? false : ''),
    }), {});

    setState({
      data: resetData,
      errors: {},
      touched: {},
      loading: false,
      submitting: false,
      submitted: false,
      dirty: false,
    });

    if (onReset) {
      onReset();
    }
  };

  const completedFields = fields.filter(field => {
    const value = state.data[field.id];
    return value !== '' && value !== null && value !== undefined &&
           (!Array.isArray(value) || value.length > 0);
  }).length;

  const progress = fields.length > 0 ? (completedFields / fields.length) * 100 : 0;

  const renderField = (field: FormField) => {
    // Check field dependencies
    if (field.showWhen && !field.showWhen(state.data)) {
      return null;
    }

    const value = state.data[field.id];
    const error = state.errors[field.id];
    const touched = state.touched[field.id];

    const commonProps = {
      field,
      value,
      error: error || null,
      touched: Boolean(touched),
      onChange: (newValue: any) => updateField(field.id, newValue),
      onBlur: () => touchField(field.id),
    };

    return (
      <motion.div
        key={field.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-2"
      >
        {/* Field Label */}
        {field.type !== 'checkbox' && (
          <label
            htmlFor={field.id}
            className={cn(
              "block text-sm font-medium",
              error && touched ? "text-red-700" : "text-gray-700"
            )}
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Field Description */}
        {field.description && field.type !== 'checkbox' && (
          <p className="text-xs text-gray-500">{field.description}</p>
        )}

        {/* Field Input */}
        <div>
          {field.type === 'textarea' && <TextareaInput {...commonProps} />}
          {field.type === 'select' && <SelectInput {...commonProps} />}
          {field.type === 'checkbox' && <CheckboxInput {...commonProps} />}
          {field.type === 'file' && <FileInput {...commonProps} />}
          {!['textarea', 'select', 'checkbox', 'file'].includes(field.type) && (
            <TextInput {...commonProps} />
          )}
        </div>

        {/* Field Error */}
        <AnimatePresence>
          {error && touched && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center space-x-1 text-red-600"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (state.submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 bg-green-50 rounded-lg border border-green-200"
      >
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Form Submitted Successfully!
        </h3>
        <p className="text-green-700 mb-4">
          Thank you for your submission. We'll get back to you soon.
        </p>
        <Button
          onClick={() => setState(prev => ({ ...prev, submitted: false }))}
          variant="outline"
        >
          Submit Another Form
        </Button>
      </motion.div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Form Header */}
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Fields */}
        <div className="space-y-6">
          <AnimatePresence>
            {fields.map(renderField)}
          </AnimatePresence>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={state.submitting || Object.keys(state.errors).some(key => state.errors[key])}
            className="flex-1 sm:flex-none"
          >
            {state.submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              submitText
            )}
          </Button>

          {showReset && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={state.submitting}
              className="flex-1 sm:flex-none"
            >
              {resetText}
            </Button>
          )}
        </div>
      </form>

      {/* Auto-save indicator */}
      {autoSave && state.dirty && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center text-xs text-gray-500 space-x-1"
        >
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Auto-saving...</span>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveForm;