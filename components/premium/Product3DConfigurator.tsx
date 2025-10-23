"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import {
  RotateCw,
  Maximize2,
  Camera,
  Share2,
  Heart,
  Eye,
  Layers,
  Palette,
  Move3d,
  Smartphone,
  Download
} from 'lucide-react'

interface ProductOption {
  id: string
  name: string
  price: number
  category: string
  thumbnail: string
  model3D?: string
  arAvailable?: boolean
}

interface Configuration3D {
  color: string
  material: string
  size: string
  style: string
  accessories: string[]
}

interface Product3DConfiguratorProps {
  productId: string
  productName: string
  basePrice: number
  options: ProductOption[]
  initialConfig?: Partial<Configuration3D>
  onConfigurationChange?: (config: Configuration3D, price: number) => void
  onARView?: () => void
  className?: string
}

export const Product3DConfigurator: React.FC<Product3DConfiguratorProps> = ({
  productId,
  productName,
  basePrice,
  options,
  initialConfig,
  onConfigurationChange,
  onARView,
  className
}) => {
  const [configuration, setConfiguration] = useState<Configuration3D>({
    color: initialConfig?.color || 'white',
    material: initialConfig?.material || 'wood',
    size: initialConfig?.size || 'medium',
    style: initialConfig?.style || 'modern',
    accessories: initialConfig?.accessories || []
  })

  const [currentPrice, setCurrentPrice] = useState(basePrice)
  const [isARMode, setIsARMode] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedView, setSelectedView] = useState<'front' | 'side' | 'back' | 'top'>('front')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate price based on configuration
  useEffect(() => {
    let totalPrice = basePrice

    // Add costs for selected options
    const colorOption = options.find(opt => opt.id === configuration.color && opt.category === 'color')
    if (colorOption) totalPrice += colorOption.price

    const materialOption = options.find(opt => opt.id === configuration.material && opt.category === 'material')
    if (materialOption) totalPrice += materialOption.price

    const sizeOption = options.find(opt => opt.id === configuration.size && opt.category === 'size')
    if (sizeOption) totalPrice += sizeOption.price

    // Add accessories costs
    configuration.accessories.forEach(accessoryId => {
      const accessory = options.find(opt => opt.id === accessoryId && opt.category === 'accessory')
      if (accessory) totalPrice += accessory.price
    })

    setCurrentPrice(totalPrice)
    onConfigurationChange?.(configuration, totalPrice)
  }, [configuration, basePrice, options, onConfigurationChange])

  // Handle 3D rotation with mouse drag
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX
    const startY = e.clientY
    const startRotationX = rotation.x
    const startRotationY = rotation.y

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      setRotation({
        x: startRotationX + deltaY * 0.5,
        y: startRotationY + deltaX * 0.5
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Reset view
  const resetView = () => {
    setRotation({ x: 0, y: 0 })
    setZoom(1)
    setSelectedView('front')
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Capture screenshot
  const captureScreenshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a')
      link.download = `${productName}-configuration.png`
      link.href = canvasRef.current.toDataURL()
      link.click()
    }
  }

  // Share configuration
  const shareConfiguration = async () => {
    const shareData = {
      title: `${productName} Configuration`,
      text: `Check out my custom ${productName} configuration!`,
      url: window.location.href + '?config=' + btoa(JSON.stringify(configuration))
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        // Show toast notification
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  // Get options by category
  const getOptionsByCategory = (category: string) => {
    return options.filter(opt => opt.category === category)
  }

  // Update configuration
  const updateConfiguration = (key: keyof Configuration3D, value: any) => {
    setConfiguration(prev => ({ ...prev, [key]: value }))
  }

  // Toggle accessory
  const toggleAccessory = (accessoryId: string) => {
    setConfiguration(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryId)
        ? prev.accessories.filter(id => id !== accessoryId)
        : [...prev.accessories, accessoryId]
    }))
  }

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 3D Viewer */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">3D Preview</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsARMode(!isARMode)}
                  className={isARMode ? "bg-primary text-primary-foreground" : ""}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  AR
                </Button>
                <Button variant="outline" size="sm" onClick={resetView}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div
              ref={containerRef}
              className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden"
              onMouseDown={handleMouseDown}
            >
              {/* 3D Canvas Placeholder */}
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-move"
                style={{
                  transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${zoom})`,
                  transformStyle: 'preserve-3d'
                }}
              />

              {/* AR Mode Overlay */}
              <AnimatePresence>
                {isARMode && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 flex items-center justify-center"
                  >
                    <div className="text-center text-white">
                      <Smartphone className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">AR Mode</h3>
                      <p className="text-sm opacity-80 mb-4">
                        Point your camera at a flat surface
                      </p>
                      <Button onClick={() => setIsARMode(false)}>
                        Exit AR
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* View Controls */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {(['front', 'side', 'back', 'top'] as const).map(view => (
                  <Button
                    key={view}
                    variant={selectedView === view ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedView(view)}
                    className="capitalize"
                  >
                    {view}
                  </Button>
                ))}
              </div>

              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4">
                <div className="bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg">
                  <Slider
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                    min={0.5}
                    max={2}
                    step={0.1}
                    orientation="vertical"
                    className="h-24"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={captureScreenshot}>
                <Camera className="h-4 w-4 mr-2" />
                Screenshot
              </Button>
              <Button variant="outline" size="sm" onClick={shareConfiguration}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
                className={isFavorite ? "text-red-500" : ""}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Price Display */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Price</p>
                  <p className="text-3xl font-bold">${currentPrice.toLocaleString()}</p>
                </div>
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {configuration.size.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Options */}
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Product</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="color" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="color" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Color
                  </TabsTrigger>
                  <TabsTrigger value="material" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Material
                  </TabsTrigger>
                  <TabsTrigger value="size" className="flex items-center gap-2">
                    <Move3d className="h-4 w-4" />
                    Size
                  </TabsTrigger>
                  <TabsTrigger value="accessories" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Extras
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="color" className="mt-6">
                  <div className="grid grid-cols-3 gap-4">
                    {getOptionsByCategory('color').map(option => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                            configuration.color === option.id
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => updateConfiguration('color', option.id)}
                        >
                          <div
                            className="aspect-square rounded-md mb-2"
                            style={{ backgroundColor: option.id }}
                          />
                          <div className="p-2">
                            <p className="text-sm font-medium">{option.name}</p>
                            {option.price > 0 && (
                              <p className="text-xs text-muted-foreground">
                                +${option.price}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="material" className="mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    {getOptionsByCategory('material').map(option => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            configuration.material === option.id
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => updateConfiguration('material', option.id)}
                        >
                          <div className="aspect-square rounded-md mb-2 bg-gradient-to-br from-gray-200 to-gray-300" />
                          <p className="text-sm font-medium">{option.name}</p>
                          {option.price > 0 && (
                            <p className="text-xs text-muted-foreground">
                              +${option.price}
                            </p>
                          )}
                          {option.arAvailable && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              AR Available
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="size" className="mt-6">
                  <div className="grid grid-cols-3 gap-4">
                    {getOptionsByCategory('size').map(option => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div
                          className={`relative cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                            configuration.size === option.id
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => updateConfiguration('size', option.id)}
                        >
                          <div className="w-16 h-16 mx-auto mb-2 rounded bg-gradient-to-br from-primary/20 to-primary/10" />
                          <p className="text-sm font-medium">{option.name}</p>
                          {option.price > 0 && (
                            <p className="text-xs text-muted-foreground">
                              +${option.price}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="accessories" className="mt-6">
                  <div className="space-y-3">
                    {getOptionsByCategory('accessory').map(option => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                            configuration.accessories.includes(option.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => toggleAccessory(option.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">{option.name}</p>
                              <p className="text-xs text-muted-foreground">
                                +${option.price}
                              </p>
                            </div>
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                configuration.accessories.includes(option.id)
                                  ? 'bg-primary border-primary'
                                  : 'border-muted-foreground'
                              }`}
                            >
                              {configuration.accessories.includes(option.id) && (
                                <div className="w-3 h-3 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1" size="lg" onClick={onARView}>
              <Smartphone className="h-5 w-5 mr-2" />
              View in AR
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download Spec
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product3DConfigurator