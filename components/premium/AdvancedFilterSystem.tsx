"use client"

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Filter,
  X,
  Sparkles,
  TrendingUp,
  Heart,
  Star,
  Zap,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Save,
  Download,
  Upload,
  Brain,
  Lightbulb,
  Target,
  Clock,
  DollarSign,
  Package,
  Tag,
  Calendar,
  BarChart3
} from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  value: any
  type: 'range' | 'select' | 'multiselect' | 'boolean' | 'date' | 'rating'
  options?: { value: string; label: string }[]
  min?: number
  max?: number
  step?: number
  icon?: React.ReactNode
}

interface AIRecommendation {
  id: string
  title: string
  description: string
  confidence: number
  type: 'filter' | 'product' | 'trend'
  action: () => void
  impact: 'high' | 'medium' | 'low'
  category: 'personalization' | 'trending' | 'value' | 'quality'
}

interface SavedFilter {
  id: string
  name: string
  filters: Record<string, any>
  createdAt: Date
  usageCount: number
  isDefault: boolean
}

interface AdvancedFilterSystemProps {
  categories: string[]
  brands: string[]
  priceRange: { min: number; max: number }
  ratings: number[]
  tags: string[]
  onFiltersChange: (filters: Record<string, any>) => void
  onAIRecommendation?: (recommendation: AIRecommendation) => void
  className?: string
}

export const AdvancedFilterSystem: React.FC<AdvancedFilterSystemProps> = ({
  categories,
  brands,
  priceRange,
  ratings,
  tags,
  onFiltersChange,
  onAIRecommendation,
  className
}) => {
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [isAILoading, setIsAILoading] = useState(false)
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([])
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({})

  // Generate AI recommendations
  const generateAIRecommendations = useCallback(async () => {
    setIsAILoading(true)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    const recommendations: AIRecommendation[] = [
      {
        id: '1',
        title: 'Trending in Your Style',
        description: 'Based on your recent views, modern minimalist designs are trending in your area',
        confidence: 0.85,
        type: 'filter',
        impact: 'high',
        category: 'personalization',
        action: () => {
          setFilters(prev => ({ ...prev, style: 'modern', category: 'minimalist' }))
        }
      },
      {
        id: '2',
        title: 'Best Value Alert',
        description: '5 products match your criteria with 20%+ discount',
        confidence: 0.92,
        type: 'product',
        impact: 'high',
        category: 'value',
        action: () => {
          setFilters(prev => ({ ...prev, discount: '20', sortBy: 'value' }))
        }
      },
      {
        id: '3',
        title: 'Top Rated Items',
        description: 'Show only 4.5+ star rated products from verified buyers',
        confidence: 0.78,
        type: 'filter',
        impact: 'medium',
        category: 'quality',
        action: () => {
          setFilters(prev => ({ ...prev, rating: [4.5, 5], verified: true }))
        }
      },
      {
        id: '4',
        title: 'Seasonal Trends',
        description: 'Winter collection items are 40% more popular this week',
        confidence: 0.73,
        type: 'trend',
        impact: 'medium',
        category: 'trending',
        action: () => {
          setFilters(prev => ({ ...prev, season: 'winter', trending: true }))
        }
      },
      {
        id: '5',
        title: 'Quick Delivery',
        description: '18 items available for 2-day shipping in your location',
        confidence: 0.88,
        type: 'filter',
        impact: 'low',
        category: 'personalization',
        action: () => {
          setFilters(prev => ({ ...prev, shipping: '2day', inStock: true }))
        }
      }
    ]

    setAiRecommendations(recommendations)
    setIsAILoading(false)
  }, [])

  // Auto-generate recommendations on component mount
  useEffect(() => {
    generateAIRecommendations()
  }, [generateAIRecommendations])

  // Update filters and trigger change callback
  const updateFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }, [onFiltersChange])

  // Apply all filters
  const applyFilters = useCallback(() => {
    setAppliedFilters(filters)
    setIsExpanded(false)
  }, [filters])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setAppliedFilters({})
    setSearchQuery('')
  }, [])

  // Save current filter set
  const saveFilterSet = useCallback(() => {
    const name = prompt('Enter a name for this filter set:')
    if (name) {
      const newSavedFilter: SavedFilter = {
        id: `filter-${Date.now()}`,
        name,
        filters: { ...filters },
        createdAt: new Date(),
        usageCount: 0,
        isDefault: false
      }
      setSavedFilters(prev => [...prev, newSavedFilter])
    }
  }, [filters])

  // Load saved filter set
  const loadSavedFilter = useCallback((savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters)
    setSavedFilters(prev =>
      prev.map(filter =>
        filter.id === savedFilter.id
          ? { ...filter, usageCount: filter.usageCount + 1 }
          : filter
      )
    )
  }, [])

  // Filter configuration
  const filterOptions: FilterOption[] = [
    {
      id: 'price',
      label: 'Price Range',
      type: 'range',
      min: priceRange.min,
      max: priceRange.max,
      step: 10,
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      id: 'rating',
      label: 'Customer Rating',
      type: 'range',
      min: 0,
      max: 5,
      step: 0.5,
      icon: <Star className="h-4 w-4" />
    },
    {
      id: 'brand',
      label: 'Brand',
      type: 'multiselect',
      options: brands.map(brand => ({ value: brand, label: brand })),
      icon: <Tag className="h-4 w-4" />
    },
    {
      id: 'category',
      label: 'Category',
      type: 'multiselect',
      options: categories.map(cat => ({ value: cat, label: cat })),
      icon: <Package className="h-4 w-4" />
    },
    {
      id: 'inStock',
      label: 'In Stock Only',
      type: 'boolean',
      icon: <Package className="h-4 w-4" />
    },
    {
      id: 'freeShipping',
      label: 'Free Shipping',
      type: 'boolean',
      icon: <Zap className="h-4 w-4" />
    },
    {
      id: ' newArrival',
      label: 'New Arrivals',
      type: 'boolean',
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      id: 'discount',
      label: 'Minimum Discount',
      type: 'select',
      options: [
        { value: '0', label: 'Any' },
        { value: '10', label: '10% or more' },
        { value: '20', label: '20% or more' },
        { value: '30', label: '30% or more' },
        { value: '50', label: '50% or more' }
      ],
      icon: <Tag className="h-4 w-4" />
    }
  ]

  // Render filter input based on type
  const renderFilterInput = (option: FilterOption) => {
    const value = filters[option.id]

    switch (option.type) {
      case 'range':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {value?.[0] || option.min} - {value?.[1] || option.max}
              </span>
              {option.id === 'price' && (
                <span className="text-sm font-medium">
                  ${(value?.[0] || option.min)} - ${(value?.[1] || option.max)}
                </span>
              )}
            </div>
            <Slider
              value={value || [option.min, option.max]}
              onValueChange={(newValue) =>
                updateFilters({ ...filters, [option.id]: newValue })
              }
              min={option.min}
              max={option.max}
              step={option.step}
              className="w-full"
            />
          </div>
        )

      case 'select':
        return (
          <Select
            value={value || ''}
            onValueChange={(newValue) =>
              updateFilters({ ...filters, [option.id]: newValue })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {option.options?.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case 'multiselect':
        return (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {option.options?.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`${option.id}-${opt.value}`}
                  checked={Array.isArray(value) && value.includes(opt.value)}
                  onChange={(e) => {
                    const currentValue = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      updateFilters({
                        ...filters,
                        [option.id]: [...currentValue, opt.value]
                      })
                    } else {
                      updateFilters({
                        ...filters,
                        [option.id]: currentValue.filter(v => v !== opt.value)
                      })
                    }
                  }}
                  className="rounded"
                />
                <Label htmlFor={`${option.id}-${opt.value}`} className="text-sm">
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        )

      case 'boolean':
        return (
          <Switch
            checked={value || false}
            onCheckedChange={(checked) =>
              updateFilters({ ...filters, [option.id]: checked })
            }
          />
        )

      default:
        return null
    }
  }

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    return Object.keys(filters).filter(key => {
      const value = filters[key]
      if (Array.isArray(value)) return value.length > 0
      return value !== undefined && value !== '' && value !== false
    }).length
  }, [filters])

  // Get sorted saved filters
  const sortedSavedFilters = useMemo(() => {
    return [...savedFilters].sort((a, b) => b.usageCount - a.usageCount)
  }, [savedFilters])

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="px-2 py-1">
                  {activeFilterCount} active
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={showAIPanel ? "bg-primary text-primary-foreground" : ""}
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Suggestions
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Active Filters */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null
                const option = filterOptions.find(opt => opt.id === key)
                return (
                  <Badge key={key} variant="secondary" className="gap-1">
                    {option?.label || key}: {Array.isArray(value) ? value.join(', ') : value}
                    <button
                      onClick={() => {
                        const newFilters = { ...filters }
                        delete newFilters[key]
                        updateFilters(newFilters)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )
              })}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </CardHeader>

        <AnimatePresence>
          {(isExpanded || showAIPanel) && (
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Filters</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="saved">Saved Sets</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filterOptions.slice(0, 4).map(option => (
                      <div key={option.id} className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          {option.icon}
                          {option.label}
                        </Label>
                        {renderFilterInput(option)}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filterOptions.slice(4).map(option => (
                      <div key={option.id} className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm font-medium">
                          {option.icon}
                          {option.label}
                        </Label>
                        {renderFilterInput(option)}
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="saved" className="mt-6">
                  <div className="space-y-4">
                    {sortedSavedFilters.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No saved filter sets yet</p>
                        <p className="text-sm">Create and save your custom filter combinations</p>
                      </div>
                    ) : (
                      sortedSavedFilters.map(savedFilter => (
                        <div
                          key={savedFilter.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <h4 className="font-medium">{savedFilter.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Used {savedFilter.usageCount} times • {savedFilter.createdAt.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadSavedFilter(savedFilter)}
                            >
                              Load
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSavedFilters(prev => prev.filter(f => f.id !== savedFilter.id))
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* AI Recommendations Panel */}
              {showAIPanel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                      AI-Powered Recommendations
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateAIRecommendations}
                      disabled={isAILoading}
                    >
                      <RotateCcw className={`h-4 w-4 mr-2 ${isAILoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>

                  {isAILoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Brain className="h-5 w-5 animate-pulse" />
                        Analyzing your preferences...
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {aiRecommendations.map(recommendation => (
                        <motion.div
                          key={recommendation.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="p-4 bg-white dark:bg-background rounded-lg border shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-sm">{recommendation.title}</h4>
                              <div className="flex items-center gap-1">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-2 h-2 rounded-full ${
                                        i < Math.floor(recommendation.confidence * 5)
                                          ? 'bg-green-500'
                                          : 'bg-gray-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(recommendation.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              {recommendation.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-2">
                                <Badge
                                  variant={
                                    recommendation.impact === 'high'
                                      ? 'default'
                                      : recommendation.impact === 'medium'
                                      ? 'secondary'
                                      : 'outline'
                                  }
                                  className="text-xs"
                                >
                                  {recommendation.impact} impact
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {recommendation.category}
                                </Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  recommendation.action()
                                  onAIRecommendation?.(recommendation)
                                }}
                                className="text-xs"
                              >
                                Apply
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={saveFilterSet}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Filters
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button onClick={applyFilters}>
                    Apply Filters ({activeFilterCount})
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}

export default AdvancedFilterSystem