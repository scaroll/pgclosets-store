"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Search,
  X,
} from "lucide-react"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  description?: string
}

export interface AppleSelectProps {
  label: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  error?: string
  success?: string
  helperText?: string
  placeholder?: string
  disabled?: boolean
  searchable?: boolean
  className?: string
  name?: string
  required?: boolean
}

export const AppleSelect = React.forwardRef<HTMLDivElement, AppleSelectProps>(
  (
    {
      label,
      options,
      value,
      onChange,
      error,
      success,
      helperText,
      placeholder = "Select an option",
      disabled = false,
      searchable = false,
      className,
      name,
      required = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [highlightedIndex, setHighlightedIndex] = React.useState(0)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const searchInputRef = React.useRef<HTMLInputElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    const isFloating = isFocused || isOpen || !!value

    // Filter options based on search
    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options
      const query = searchQuery.toLowerCase()
      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(query) ||
          option.description?.toLowerCase().includes(query)
      )
    }, [options, searchQuery])

    // Get selected option
    const selectedOption = options.find((opt) => opt.value === value)

    // Close dropdown on outside click
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
          setSearchQuery("")
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Focus search input when dropdown opens
    React.useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, [isOpen, searchable])

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
          e.preventDefault()
          setIsOpen(true)
        }
        return
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
          break
        case "Enter":
          e.preventDefault()
          if (filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value)
          }
          break
        case "Escape":
          e.preventDefault()
          setIsOpen(false)
          setSearchQuery("")
          break
      }
    }

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue)
      setIsOpen(false)
      setSearchQuery("")
      setHighlightedIndex(0)
    }

    return (
      <div ref={containerRef} className={cn("relative w-full", className)}>
        {/* Hidden input for form submission */}
        <input type="hidden" name={name} value={value || ""} />

        {/* Select Trigger */}
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-required={required}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            "relative flex items-center cursor-pointer",
            "bg-white border-b-2 transition-all duration-300",
            error
              ? "border-red-500"
              : success
                ? "border-green-500"
                : isFocused || isOpen
                  ? "border-slate-900"
                  : "border-slate-200",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
        >
          {/* Selected Value */}
          <div className="w-full px-0 pt-6 pb-2">
            <span
              className={cn(
                "text-base font-light",
                selectedOption ? "text-slate-900" : "text-slate-400"
              )}
            >
              {selectedOption?.label || placeholder}
            </span>
          </div>

          {/* Floating Label */}
          <motion.label
            className="absolute left-0 pointer-events-none text-slate-600 font-light transition-all duration-300 origin-left"
            animate={{
              y: isFloating ? -24 : -12,
              scale: isFloating ? 0.85 : 1,
              color: error
                ? "#ef4444"
                : success
                  ? "#22c55e"
                  : isFocused || isOpen
                    ? "#0f172a"
                    : "#64748b",
            }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>

          {/* Right Icons */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-red-500"
              >
                <AlertCircle className="w-5 h-5" />
              </motion.div>
            )}

            {success && !error && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            )}

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-slate-400"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white border border-slate-200 shadow-xl max-h-[300px] overflow-hidden"
              role="listbox"
            >
              {/* Search Input */}
              {searchable && (
                <div className="sticky top-0 bg-white border-b border-slate-200 p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setHighlightedIndex(0)
                      }}
                      placeholder="Search..."
                      className="w-full pl-10 pr-8 py-2 text-sm font-light border border-slate-200 focus:border-slate-900 outline-none transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="max-h-[240px] overflow-y-auto">
                {filteredOptions.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm font-light text-slate-400">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={value === option.value}
                      className={cn(
                        "px-4 py-3 cursor-pointer transition-colors",
                        "hover:bg-slate-50",
                        index === highlightedIndex && "bg-slate-50",
                        value === option.value && "bg-slate-100 font-medium",
                        option.disabled &&
                          "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                      onClick={() =>
                        !option.disabled && handleSelect(option.value)
                      }
                      onMouseEnter={() => setHighlightedIndex(index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div
                            className={cn(
                              "text-base font-light text-slate-900",
                              value === option.value && "font-medium"
                            )}
                          >
                            {option.label}
                          </div>
                          {option.description && (
                            <div className="text-sm text-slate-500 mt-0.5">
                              {option.description}
                            </div>
                          )}
                        </div>
                        {value === option.value && (
                          <CheckCircle2 className="w-5 h-5 text-slate-900 ml-2" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper/Error/Success Text */}
        <AnimatePresence mode="wait">
          {(error || success || helperText) && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mt-1.5 text-sm font-light",
                error
                  ? "text-red-500"
                  : success
                    ? "text-green-500"
                    : "text-slate-500"
              )}
            >
              {error || success || helperText}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Focus Indicator Line */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-slate-900"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused || isOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>
    )
  }
)

AppleSelect.displayName = "AppleSelect"
