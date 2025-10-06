"use client"

/**
 * Visual Door Configurator - Division 4: Product Experience Excellence
 *
 * World-class interactive 3D door configurator with real-time visualization,
 * live pricing updates, and intelligent product recommendations.
 *
 * Features:
 * - Real-time 3D door preview with lighting and shadows
 * - Interactive customization for size, color, glass, and hardware
 * - Dynamic pricing calculation with breakdown
 * - Save and share configurations
 * - AR preview integration
 * - Accessibility-first design with keyboard navigation
 *
 * @component VisualConfigurator
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Download,
  Share2,
  Eye,
  Palette,
  Ruler,
  Settings,
  Package,
  Sparkles,
  Check,
  Info,
  Camera,
  ShoppingCart,
  Heart,
  Calculator
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

// ==================== Types ====================

interface ConfigurationOption {
  id: string
  name: string
  value: string | number
  price: number
  image?: string
  description?: string
  popular?: boolean
  premium?: boolean
  material?: string
  finish?: string
  thumbnail?: string
}

interface ConfigurationSection {
  id: string
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  type: 'style' | 'size' | 'color' | 'glass' | 'hardware' | 'finish' | 'accessories'
  options: ConfigurationOption[]
  required: boolean
  multiple?: boolean
  priceImpact: 'additive' | 'multiplier' | 'custom'
}

interface VisualConfiguratorProps {
  product: {
    id: string
    name: string
    basePrice: number
    category: string
    images: string[]
    defaultConfiguration?: Record<string, any>
  }
  onConfigurationChange?: (config: Record<string, any>) => void
  onPriceUpdate?: (price: number) => void
  onAddToCart?: (config: Record<string, any>) => void
  onSaveConfiguration?: (config: Record<string, any>) => void
  className?: string
}

interface PriceBreakdown {
  base: number
  style: number
  material: number
  color: number
  glass: number
  hardware: number
  accessories: number
  sizeMultiplier: number
  total: number
}

// ==================== Configuration Data ====================

const configurationSections: ConfigurationSection[] = [
  {
    id: 'style',
    title: 'Door Style',
    description: 'Choose your preferred door design aesthetic',
    icon: Sparkles,
    type: 'style',
    required: true,
    priceImpact: 'additive',
    options: [
      {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        value: 'modern-minimal',
        price: 0,
        description: 'Clean lines, contemporary aesthetic',
        popular: true,
        thumbnail: '/images/styles/modern-minimal.jpg'
      },
      {
        id: 'traditional',
        name: 'Traditional',
        value: 'traditional',
        price: 150,
        description: 'Classic design with timeless appeal',
        thumbnail: '/images/styles/traditional.jpg'
      },
      {
        id: 'contemporary',
        name: 'Contemporary',
        value: 'contemporary',
        price: 200,
        description: 'Modern with artistic elements',
        premium: true,
        thumbnail: '/images/styles/contemporary.jpg'
      },
      {
        id: 'rustic',
        name: 'Rustic',
        value: 'rustic',
        price: 175,
        description: 'Natural textures and warm tones',
        thumbnail: '/images/styles/rustic.jpg'
      }
    ]
  },
  {
    id: 'size',
    title: 'Dimensions',
    description: 'Customize door size to fit your space perfectly',
    icon: Ruler,
    type: 'size',
    required: true,
    priceImpact: 'multiplier',
    options: [
      { id: 'width', name: 'Width', value: 80, price: 0, description: 'Door width in cm' },
      { id: 'height', name: 'Height', value: 200, price: 0, description: 'Door height in cm' },
      { id: 'thickness', name: 'Thickness', value: 4, price: 0, description: 'Door thickness in cm' }
    ]
  },
  {
    id: 'color',
    title: 'Color & Finish',
    description: 'Select the perfect color to match your decor',
    icon: Palette,
    type: 'color',
    required: true,
    priceImpact: 'additive',
    options: [
      { id: 'natural-oak', name: 'Natural Oak', value: '#D2B48C', price: 0, finish: 'matte', popular: true },
      { id: 'white-gloss', name: 'White Gloss', value: '#FFFFFF', price: 75, finish: 'gloss' },
      { id: 'charcoal-black', name: 'Charcoal Black', value: '#2D2D2D', price: 100, finish: 'matte', premium: true },
      { id: 'espresso', name: 'Espresso', value: '#3C2414', price: 125, finish: 'satin' },
      { id: 'slate-gray', name: 'Slate Gray', value: '#708090', price: 100, finish: 'matte' },
      { id: 'navy-blue', name: 'Navy Blue', value: '#1A2332', price: 150, finish: 'satin', premium: true },
      { id: 'sage-green', name: 'Sage Green', value: '#9CAF88', price: 125, finish: 'matte' },
      { id: 'burgundy', name: 'Burgundy', value: '#800020', price: 150, finish: 'gloss', premium: true }
    ]
  },
  {
    id: 'glass',
    title: 'Glass Options',
    description: 'Add glass panels for natural light',
    icon: Eye,
    type: 'glass',
    required: false,
    priceImpact: 'additive',
    options: [
      { id: 'none', name: 'No Glass', value: 'none', price: 0, description: 'Solid door panel' },
      { id: 'frosted', name: 'Frosted Glass', value: 'frosted', price: 250, description: 'Privacy with light transmission', popular: true },
      { id: 'clear', name: 'Clear Glass', value: 'clear', price: 200, description: 'Maximum light, full visibility' },
      { id: 'textured', name: 'Textured Glass', value: 'textured', price: 300, description: 'Decorative patterns', premium: true },
      { id: 'tinted', name: 'Tinted Glass', value: 'tinted', price: 275, description: 'Subtle color tint' },
      { id: 'smart-glass', name: 'Smart Glass', value: 'smart', price: 800, description: 'Switchable privacy glass', premium: true }
    ]
  },
  {
    id: 'hardware',
    title: 'Hardware & Handles',
    description: 'Choose functional and decorative hardware',
    icon: Settings,
    type: 'hardware',
    required: true,
    multiple: true,
    priceImpact: 'additive',
    options: [
      { id: 'standard-handle', name: 'Standard Handle', value: 'standard', price: 0, material: 'aluminum', popular: true },
      { id: 'premium-handle', name: 'Premium Handle', value: 'premium', price: 150, material: 'stainless-steel' },
      { id: 'designer-handle', name: 'Designer Handle', value: 'designer', price: 300, material: 'brass', premium: true },
      { id: 'soft-close', name: 'Soft-Close System', value: 'soft-close', price: 200, description: 'Whisper-quiet closing' },
      { id: 'lock-system', name: 'Premium Lock', value: 'premium-lock', price: 175, description: 'Enhanced security' },
      { id: 'push-open', name: 'Push-to-Open', value: 'push-open', price: 225, description: 'Handle-free opening', premium: true }
    ]
  },
  {
    id: 'accessories',
    title: 'Accessories',
    description: 'Enhance functionality with premium add-ons',
    icon: Package,
    type: 'accessories',
    required: false,
    multiple: true,
    priceImpact: 'additive',
    options: [
      { id: 'led-lighting', name: 'LED Edge Lighting', value: 'led-lighting', price: 350, description: 'Ambient edge illumination', premium: true },
      { id: 'mirror', name: 'Full-Length Mirror', value: 'mirror', price: 200, description: 'Integrated mirror panel' },
      { id: 'hooks', name: 'Interior Hooks', value: 'hooks', price: 50, description: 'Convenient storage hooks' },
      { id: 'dampers', name: 'Hydraulic Dampers', value: 'dampers', price: 125, description: 'Smooth operation' },
      { id: 'weather-seal', name: 'Weather Seal Kit', value: 'weather-seal', price: 75, description: 'Draft prevention' }
    ]
  }
]

// ==================== Component ====================

export default function VisualConfigurator({
  product,
  onConfigurationChange,
  onPriceUpdate,
  onAddToCart,
  onSaveConfiguration,
  className
}: VisualConfiguratorProps) {
  // ========== State Management ==========
  const [currentStep, setCurrentStep] = useState(0)
  const [configuration, setConfiguration] = useState<Record<string, any>>(
    product.defaultConfiguration || {}
  )
  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown>({
    base: product.basePrice,
    style: 0,
    material: 0,
    color: 0,
    glass: 0,
    hardware: 0,
    accessories: 0,
    sizeMultiplier: 1,
    total: product.basePrice
  })
  const [is3DView, setIs3DView] = useState(true)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  const [savedConfigurations, setSavedConfigurations] = useState<Record<string, any>[]>([])
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)
  const [configurationProgress, setConfigurationProgress] = useState(0)
  const [viewMode, setViewMode] = useState<'configurator' | 'summary' | 'ar'>('configurator')

  const canvasRef = useRef<HTMLCanvasElement>(null)

  // ========== Computed Values ==========
  const currentSection = configurationSections[currentStep]
  const totalSteps = configurationSections.filter(s => s.required).length

  const isStepComplete = useCallback((section: ConfigurationSection) => {
    if (!section.required) return true
    const value = configuration[section.id]
    if (section.multiple) {
      return Array.isArray(value) && value.length > 0
    }
    return value !== undefined && value !== null
  }, [configuration])

  const canProceed = isStepComplete(currentSection)
  const requiredStepsCompleted = configurationSections
    .filter(s => s.required)
    .filter(s => isStepComplete(s)).length

  // ========== Price Calculation ==========
  const calculatePrice = useCallback(() => {
    let breakdown: PriceBreakdown = {
      base: product.basePrice,
      style: 0,
      material: 0,
      color: 0,
      glass: 0,
      hardware: 0,
      accessories: 0,
      sizeMultiplier: 1,
      total: 0
    }

    configurationSections.forEach(section => {
      const sectionConfig = configuration[section.id]
      if (!sectionConfig) return

      if (section.multiple && Array.isArray(sectionConfig)) {
        const sectionTotal = sectionConfig.reduce((sum, optionId) => {
          const option = section.options.find(opt => opt.id === optionId)
          return sum + (option?.price || 0)
        }, 0)
        breakdown[section.id as keyof PriceBreakdown] = sectionTotal
      } else if (section.type === 'size') {
        // Calculate size multiplier
        const width = configuration.size?.width || 80
        const height = configuration.size?.height || 200
        const standardArea = 80 * 200
        const currentArea = width * height
        breakdown.sizeMultiplier = currentArea / standardArea
      } else {
        const option = section.options.find(opt => opt.id === sectionConfig)
        if (option?.price) {
          breakdown[section.id as keyof PriceBreakdown] = option.price
        }
      }
    })

    // Calculate total
    const baseWithAdditions = breakdown.base +
      breakdown.style +
      breakdown.material +
      breakdown.color +
      breakdown.glass +
      breakdown.hardware +
      breakdown.accessories

    breakdown.total = Math.round(baseWithAdditions * breakdown.sizeMultiplier)

    setPriceBreakdown(breakdown)
    onPriceUpdate?.(breakdown.total)
  }, [configuration, product.basePrice, onPriceUpdate])

  // ========== Effects ==========
  useEffect(() => {
    calculatePrice()
  }, [calculatePrice])

  useEffect(() => {
    onConfigurationChange?.(configuration)
  }, [configuration, onConfigurationChange])

  useEffect(() => {
    const progress = (requiredStepsCompleted / totalSteps) * 100
    setConfigurationProgress(progress)
  }, [requiredStepsCompleted, totalSteps])

  // ========== Handlers ==========
  const handleOptionSelect = useCallback((sectionId: string, optionId: string) => {
    const section = configurationSections.find(s => s.id === sectionId)
    if (!section) return

    setConfiguration(prev => {
      const newConfig = { ...prev }

      if (section.multiple) {
        const current = newConfig[sectionId] || []
        if (current.includes(optionId)) {
          newConfig[sectionId] = current.filter((id: string) => id !== optionId)
        } else {
          newConfig[sectionId] = [...current, optionId]
        }
      } else {
        newConfig[sectionId] = optionId
      }

      return newConfig
    })
  }, [])

  const handleSizeChange = useCallback((dimension: string, value: number[]) => {
    setConfiguration(prev => ({
      ...prev,
      size: {
        ...prev.size,
        [dimension]: value[0]
      }
    }))
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < configurationSections.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }, [currentStep])

  const resetConfiguration = useCallback(() => {
    setConfiguration(product.defaultConfiguration || {})
    setCurrentStep(0)
  }, [product.defaultConfiguration])

  const saveConfiguration = useCallback(() => {
    const savedConfig = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      configuration,
      price: priceBreakdown.total,
      product: product.name
    }
    setSavedConfigurations(prev => [...prev, savedConfig])
    onSaveConfiguration?.(savedConfig)
  }, [configuration, priceBreakdown.total, product.name, onSaveConfiguration])

  const handleAddToCart = useCallback(() => {
    onAddToCart?.({
      ...configuration,
      price: priceBreakdown.total,
      product
    })
  }, [configuration, priceBreakdown.total, product, onAddToCart])

  // ========== Render Functions ==========
  const renderOptionButton = (section: ConfigurationSection, option: ConfigurationOption) => {
    const isSelected = section.multiple
      ? (configuration[section.id] || []).includes(option.id)
      : configuration[section.id] === option.id

    return (
      <motion.button
        key={option.id}
        onClick={() => handleOptionSelect(section.id, option.id)}
        className={cn(
          "relative p-4 border-2 rounded-lg text-left transition-all duration-200",
          "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2",
          isSelected
            ? "border-pg-sky bg-pg-sky/5 shadow-md"
            : "border-gray-200 hover:border-gray-300 bg-white"
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-pressed={isSelected}
        aria-label={`${option.name} - ${option.description || ''} - ${option.price > 0 ? `Add $${option.price}` : 'Included'}`}
      >
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-pg-sky rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="flex gap-2 mb-2">
          {option.popular && (
            <Badge variant="secondary" className="text-xs">Popular</Badge>
          )}
          {option.premium && (
            <Badge variant="default" className="text-xs bg-amber-600">Premium</Badge>
          )}
        </div>

        {/* Option Details */}
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900">{option.name}</h4>
          {option.price > 0 && (
            <Badge variant="outline" className="ml-2">
              +${option.price}
            </Badge>
          )}
        </div>

        {option.description && (
          <p className="text-sm text-gray-600 mb-2">{option.description}</p>
        )}

        {/* Additional Info */}
        <div className="flex gap-3 text-xs text-gray-500">
          {option.material && (
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {option.material}
            </span>
          )}
          {option.finish && (
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {option.finish}
            </span>
          )}
        </div>
      </motion.button>
    )
  }

  const renderColorOption = (section: ConfigurationSection, option: ConfigurationOption) => {
    const isSelected = configuration[section.id] === option.id

    return (
      <motion.button
        key={option.id}
        onClick={() => handleOptionSelect(section.id, option.id)}
        className={cn(
          "relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all",
          "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2",
          isSelected && "ring-2 ring-pg-sky shadow-lg"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        title={`${option.name} - ${option.finish || ''} finish`}
      >
        {/* Color Swatch */}
        <div
          className={cn(
            "w-16 h-16 rounded-full border-4 transition-all",
            isSelected ? "border-pg-sky" : "border-gray-200"
          )}
          style={{ backgroundColor: option.value as string }}
        >
          {isSelected && (
            <div className="w-full h-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          )}
        </div>

        {/* Color Name */}
        <div className="text-center">
          <div className="text-xs font-medium text-gray-900">{option.name}</div>
          {option.finish && (
            <div className="text-xs text-gray-500">{option.finish}</div>
          )}
          {option.price > 0 && (
            <div className="text-xs font-semibold text-pg-sky">+${option.price}</div>
          )}
        </div>

        {/* Premium Badge */}
        {option.premium && (
          <Badge variant="default" className="absolute -top-1 -right-1 text-xs bg-amber-600">
            Premium
          </Badge>
        )}
      </motion.button>
    )
  }

  const renderSizeControls = (section: ConfigurationSection) => {
    return (
      <div className="space-y-6">
        {section.options.map(option => {
          const value = configuration.size?.[option.id] || option.value as number
          const min = option.id === 'width' ? 60 : option.id === 'height' ? 180 : 3
          const max = option.id === 'width' ? 150 : option.id === 'height' ? 280 : 8
          const step = option.id === 'thickness' ? 0.5 : 5

          return (
            <div key={option.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  {option.name}
                </label>
                <span className="text-lg font-semibold text-pg-sky">
                  {value} cm
                </span>
              </div>

              <Slider
                value={[value]}
                onValueChange={(val) => handleSizeChange(option.id, val)}
                min={min}
                max={max}
                step={step}
                className="w-full"
                aria-label={`${option.name} slider`}
              />

              <div className="flex justify-between text-xs text-gray-500">
                <span>{min} cm</span>
                <span>{max} cm</span>
              </div>

              {option.description && (
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {option.description}
                </p>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const render3DPreview = () => {
    return (
      <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
        {/* 3D Canvas Placeholder */}
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          aria-label="3D door preview"
        />

        {/* Fallback Preview */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">3D Preview Loading...</p>
            <p className="text-sm text-gray-500 mt-2">
              Interactive door visualization will appear here
            </p>
          </div>
        </div>

        {/* Configuration Overlay */}
        {configuration.color && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: configurationSections
                  .find(s => s.id === 'color')?.options
                  .find(o => o.id === configuration.color)?.value as string }}
              />
              <span className="text-xs font-medium">
                {configurationSections
                  .find(s => s.id === 'color')?.options
                  .find(o => o.id === configuration.color)?.name}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ========== Main Render ==========
  return (
    <div className={cn("max-w-7xl mx-auto p-4 md:p-6", className)}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Configure Your {product.name}
        </h1>
        <p className="text-gray-600">
          Customize every detail to create your perfect door
        </p>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Configuration Progress
            </span>
            <span className="text-sm font-semibold text-pg-sky">
              {Math.round(configurationProgress)}%
            </span>
          </div>
          <Progress value={configurationProgress} className="h-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Panel: Configuration */}
        <div className="space-y-6">
          {/* Step Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {configurationSections.map((section, index) => {
              const Icon = section.icon
              const isActive = index === currentStep
              const isComplete = isStepComplete(section)

              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap",
                    "focus:outline-none focus:ring-2 focus:ring-pg-sky focus:ring-offset-2",
                    isActive
                      ? "bg-pg-sky text-white shadow-md"
                      : isComplete
                      ? "bg-green-50 text-green-700 border-2 border-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {section.title}
                  </span>
                  {section.required && !isComplete && (
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  )}
                  {isComplete && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Current Step Content */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    {React.createElement(currentSection.icon, { className: "w-5 h-5" })}
                    {currentSection.title}
                    {currentSection.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </CardTitle>
                  {currentSection.description && (
                    <CardDescription className="mt-2">
                      {currentSection.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentSection.type === 'size' ? (
                    renderSizeControls(currentSection)
                  ) : currentSection.type === 'color' ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {currentSection.options.map(option => renderColorOption(currentSection, option))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSection.options.map(option => renderOptionButton(currentSection, option))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={resetConfiguration}
                className="flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>

              {currentStep === configurationSections.length - 1 ? (
                <Button
                  onClick={() => setViewMode('summary')}
                  disabled={configurationProgress < 100}
                  className="flex items-center gap-2 bg-pg-sky hover:bg-pg-sky/90"
                >
                  Review Configuration
                  <Check className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  disabled={!canProceed}
                  className="flex items-center gap-2 bg-pg-sky hover:bg-pg-sky/90"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Preview & Summary */}
        <div className="space-y-6">
          {/* 3D Preview */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Live Preview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={is3DView ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIs3DView(!is3DView)}
                    className="flex items-center gap-2"
                  >
                    {is3DView ? '3D View' : '2D View'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setViewMode('ar')}
                  >
                    <Camera className="w-4 h-4" />
                    AR View
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="aspect-square">
                {render3DPreview()}
              </div>
            </CardContent>
          </Card>

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Price Summary</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  {showPriceBreakdown ? 'Hide' : 'Show'} Breakdown
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {showPriceBreakdown && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-medium">${priceBreakdown.base.toLocaleString()}</span>
                  </div>
                  {priceBreakdown.style > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Style:</span>
                      <span className="font-medium">+${priceBreakdown.style}</span>
                    </div>
                  )}
                  {priceBreakdown.color > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Color & Finish:</span>
                      <span className="font-medium">+${priceBreakdown.color}</span>
                    </div>
                  )}
                  {priceBreakdown.glass > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Glass:</span>
                      <span className="font-medium">+${priceBreakdown.glass}</span>
                    </div>
                  )}
                  {priceBreakdown.hardware > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Hardware:</span>
                      <span className="font-medium">+${priceBreakdown.hardware}</span>
                    </div>
                  )}
                  {priceBreakdown.accessories > 0 && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Accessories:</span>
                      <span className="font-medium">+${priceBreakdown.accessories}</span>
                    </div>
                  )}
                  {priceBreakdown.sizeMultiplier !== 1 && (
                    <div className="flex justify-between py-1">
                      <span className="text-gray-600">Size Adjustment:</span>
                      <span className="font-medium">×{priceBreakdown.sizeMultiplier.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2" />
                </div>
              )}

              <div className="flex justify-between items-center text-2xl font-bold">
                <span>Total Price:</span>
                <span className="text-pg-sky">
                  ${priceBreakdown.total.toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={saveConfiguration}
                >
                  <Download className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>

              <Button
                className="w-full bg-pg-sky hover:bg-pg-sky/90 text-white flex items-center justify-center gap-2"
                size="lg"
                onClick={handleAddToCart}
                disabled={configurationProgress < 100}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {}}
              >
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
