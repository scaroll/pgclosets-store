"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Palette, Ruler, Settings, Eye, Download, Share2, RotateCcw } from 'lucide-react'
import { Button } from '@/ui/button'
import { Badge } from '@/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Slider } from '@/ui/slider'

interface ConfigurationOption {
  id: string
  name: string
  value: string | number
  price?: number
  image?: string
  description?: string
}

interface ConfigurationSection {
  id: string
  title: string
  type: 'color' | 'size' | 'material' | 'hardware' | 'style'
  options: ConfigurationOption[]
  required?: boolean
  multiple?: boolean
}

interface ProductConfiguratorProps {
  product: {
    id: string
    name: string
    basePrice: number
    images: string[]
  }
  onConfigurationChange: (config: Record<string, any>) => void
  onPriceUpdate: (price: number) => void
}

const mockConfigurationSections: ConfigurationSection[] = [
  {
    id: 'style',
    title: 'Door Style',
    type: 'style',
    required: true,
    options: [
      { id: 'modern', name: 'Modern', value: 'modern', price: 0, image: '/images/styles/modern.jpg' },
      { id: 'traditional', name: 'Traditional', value: 'traditional', price: 150, image: '/images/styles/traditional.jpg' },
      { id: 'contemporary', name: 'Contemporary', value: 'contemporary', price: 200, image: '/images/styles/contemporary.jpg' }
    ]
  },
  {
    id: 'material',
    title: 'Material',
    type: 'material',
    required: true,
    options: [
      { id: 'oak', name: 'Oak Wood', value: 'oak', price: 0, description: 'Premium oak finish' },
      { id: 'maple', name: 'Maple Wood', value: 'maple', price: 100, description: 'Light colored maple' },
      { id: 'walnut', name: 'Walnut Wood', value: 'walnut', price: 250, description: 'Rich walnut finish' },
      { id: 'glass', name: 'Frosted Glass', value: 'glass', price: 300, description: 'Modern frosted glass panels' }
    ]
  },
  {
    id: 'color',
    title: 'Color Finish',
    type: 'color',
    required: true,
    options: [
      { id: 'natural', name: 'Natural', value: '#D2B48C', price: 0 },
      { id: 'white', name: 'White', value: 'var(--color-secondary)', price: 50 },
      { id: 'black', name: 'Black', value: '#2D2D2D', price: 75 },
      { id: 'espresso', name: 'Espresso', value: '#3C2414', price: 100 },
      { id: 'gray', name: 'Gray', value: '#808080', price: 75 }
    ]
  },
  {
    id: 'size',
    title: 'Dimensions',
    type: 'size',
    required: true,
    options: [
      { id: 'width', name: 'Width', value: 80, price: 0 },
      { id: 'height', name: 'Height', value: 200, price: 0 }
    ]
  },
  {
    id: 'hardware',
    title: 'Hardware',
    type: 'hardware',
    options: [
      { id: 'standard', name: 'Standard Handle', value: 'standard', price: 0 },
      { id: 'premium', name: 'Premium Handle', value: 'premium', price: 150 },
      { id: 'soft-close', name: 'Soft-Close System', value: 'soft-close', price: 200 }
    ],
    multiple: true
  }
]

const ProductConfigurator: React.FC<ProductConfiguratorProps> = ({
  product,
  onConfigurationChange,
  onPriceUpdate
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [configuration, setConfiguration] = useState<Record<string, any>>({})
  const [totalPrice, setTotalPrice] = useState(product.basePrice)
  const [is3DView, setIs3DView] = useState(false)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)

  const steps = mockConfigurationSections

  // Calculate total price whenever configuration changes
  useEffect(() => {
    let price = product.basePrice

    steps.forEach(section => {
      const sectionConfig = configuration[section.id]
      if (sectionConfig) {
        if (section.multiple && Array.isArray(sectionConfig)) {
          sectionConfig.forEach((optionId: string) => {
            const option = section.options.find(opt => opt.id === optionId)
            if (option?.price) price += option.price
          })
        } else {
          const option = section.options.find(opt => opt.id === sectionConfig)
          if (option?.price) price += option.price
        }
      }
    })

    // Size-based pricing
    if (configuration.size) {
      const width = configuration.size.width || 80
      const height = configuration.size.height || 200
      const sizeMultiplier = ((width * height) / (80 * 200))
      price = Math.round(price * sizeMultiplier)
    }

    setTotalPrice(price)
    onPriceUpdate(price)
  }, [configuration, product.basePrice, onPriceUpdate])

  // Notify parent of configuration changes
  useEffect(() => {
    onConfigurationChange(configuration)
  }, [configuration, onConfigurationChange])

  const handleOptionSelect = (sectionId: string, optionId: string) => {
    const section = steps.find(s => s.id === sectionId)
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
  }

  const handleSizeChange = (dimension: string, value: number[]) => {
    setConfiguration(prev => ({
      ...prev,
      size: {
        ...prev.size,
        [dimension]: value[0]
      }
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetConfiguration = () => {
    setConfiguration({})
    setCurrentStep(0)
  }

  const generatePreview = async () => {
    setIsGeneratingPreview(true)
    // Simulate preview generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGeneratingPreview(false)
  }

  const currentSection = steps[currentStep]
  const isStepComplete = (step: ConfigurationSection) => {
    if (!step.required) return true
    return configuration[step.id] !== undefined
  }

  const canProceed = isStepComplete(currentSection)

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Your {product.name}</h2>
            <p className="text-gray-600">Customize every detail to match your vision</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    index <= currentStep
                      ? 'bg-amber-600 text-white'
                      : isStepComplete(step)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {index + 1}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 mx-2 ${index < currentStep ? 'bg-amber-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Current Step */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentSection.type === 'color' && <Palette className="w-5 h-5" />}
                {currentSection.type === 'size' && <Ruler className="w-5 h-5" />}
                {(currentSection.type === 'material' || currentSection.type === 'style' || currentSection.type === 'hardware') && <Settings className="w-5 h-5" />}
                {currentSection.title}
                {currentSection.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentSection.type === 'size' ? (
                    <div className="space-y-4">
                      {currentSection.options.map(option => (
                        <div key={option.id} className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium">{option.name}</label>
                            <span className="text-sm text-gray-500">
                              {configuration.size?.[option.id] || option.value} cm
                            </span>
                          </div>
                          <Slider
                            value={[configuration.size?.[option.id] || option.value as number]}
                            onValueChange={(value) => handleSizeChange(option.id, value)}
                            min={option.id === 'width' ? 60 : 180}
                            max={option.id === 'width' ? 120 : 250}
                            step={5}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  ) : currentSection.type === 'color' ? (
                    <div className="grid grid-cols-5 gap-3">
                      {currentSection.options.map(option => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleOptionSelect(currentSection.id, option.id)}
                          className={`relative w-12 h-12 rounded-lg border-2 transition-all ${
                            configuration[currentSection.id] === option.id
                              ? 'border-amber-600 ring-2 ring-amber-600 ring-offset-2'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{ backgroundColor: option.value as string }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={option.name}
                        >
                          {configuration[currentSection.id] === option.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <div className="w-3 h-3 bg-white rounded-full shadow-md" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentSection.options.map(option => {
                        const isSelected = currentSection.multiple
                          ? (configuration[currentSection.id] || []).includes(option.id)
                          : configuration[currentSection.id] === option.id

                        return (
                          <motion.button
                            key={option.id}
                            onClick={() => handleOptionSelect(currentSection.id, option.id)}
                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                              isSelected
                                ? 'border-amber-600 bg-amber-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{option.name}</h4>
                              {option.price !== undefined && option.price > 0 && (
                                <Badge variant="outline">+${option.price}</Badge>
                              )}
                            </div>
                            {option.description && (
                              <p className="text-sm text-gray-600">{option.description}</p>
                            )}
                          </motion.button>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={resetConfiguration}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button onClick={generatePreview} disabled={isGeneratingPreview}>
                  {isGeneratingPreview ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Eye className="w-4 h-4 mr-2" />
                  )}
                  Generate Preview
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={!canProceed}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Preview Panel */}
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
                  >
                    {is3DView ? '3D View' : '2D View'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                {isGeneratingPreview ? (
                  <div className="text-center">
                    <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Generating preview...</p>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <p className="text-gray-500">Preview will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {steps.map(section => {
                  const sectionConfig = configuration[section.id]
                  if (!sectionConfig) return null

                  return (
                    <div key={section.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium">{section.title}:</span>
                      <div className="text-right">
                        {section.type === 'size' ? (
                          <span className="text-sm text-gray-600">
                            {sectionConfig.width || 80}cm × {sectionConfig.height || 200}cm
                          </span>
                        ) : section.multiple ? (
                          <span className="text-sm text-gray-600">
                            {sectionConfig.length} selected
                          </span>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {section.options.find(opt => opt.id === sectionConfig)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total Price:</span>
                  <span className="text-amber-600">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Save Config
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ProductConfigurator