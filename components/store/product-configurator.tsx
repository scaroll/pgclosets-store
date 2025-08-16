'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuickBuyButton, AddToCartButton } from '@/components/ui/paddle-button'
import { PaddlePriceDisplay } from '@/components/checkout/paddle-price-display'
import { reninProducts, type ReninProduct, type ReninHardware } from '@/lib/renin-products'
import { toast } from 'sonner'
import { Ruler, Palette, Settings, Truck } from 'lucide-react'

interface ProductConfiguratorProps {
  onConfigurationChange?: (config: ConfigurationState) => void
  className?: string
}

interface ConfigurationState {
  doorType: string
  size: string
  material: string
  finish: string
  hardware: string
  installation: boolean
  totalPrice: number
  selectedProducts: {
    door?: ReninProduct
    hardware?: ReninHardware
    installation?: any
  }
}

export function ProductConfigurator({ onConfigurationChange, className }: ProductConfiguratorProps) {
  const [config, setConfig] = useState<ConfigurationState>({
    doorType: '',
    size: '',
    material: '',
    finish: '',
    hardware: '',
    installation: false,
    totalPrice: 0,
    selectedProducts: {}
  })

  // Get products from Renin database
  const barnDoors = reninProducts.getBarnDoors()
  const hardware = reninProducts.getHardware()
  const installationServices = reninProducts.getInstallationServices()

  // Filter available options based on current selections
  const availableDoors = barnDoors.filter(door => {
    if (config.doorType && door.style !== config.doorType) return false
    if (config.size && door.size !== config.size) return false
    if (config.material && door.material !== config.material) return false
    if (config.finish && !door.finish.toLowerCase().includes(config.finish.toLowerCase())) return false
    return true
  })

  const doorTypes = [...new Set(barnDoors.map(door => door.style))]
  const sizes = [...new Set(barnDoors.map(door => door.size))]
  const materials = [...new Set(barnDoors.map(door => door.material))]
  const finishes = [...new Set(barnDoors.map(door => door.finish))]

  const updateConfig = (field: keyof ConfigurationState, value: any) => {
    const newConfig = { ...config, [field]: value }
    
    // Recalculate total price and selected products
    let totalPrice = 0
    const selectedProducts: ConfigurationState['selectedProducts'] = {}

    // Find matching door
    if (newConfig.doorType || newConfig.size || newConfig.material || newConfig.finish) {
      const matchingDoor = availableDoors.find(door => {
        return (!newConfig.doorType || door.style === newConfig.doorType) &&
               (!newConfig.size || door.size === newConfig.size) &&
               (!newConfig.material || door.material === newConfig.material) &&
               (!newConfig.finish || door.finish.toLowerCase().includes(newConfig.finish.toLowerCase()))
      })
      
      if (matchingDoor) {
        selectedProducts.door = matchingDoor
        totalPrice += matchingDoor.sale_price || matchingDoor.price
      }
    }

    // Add hardware price
    if (newConfig.hardware) {
      const selectedHardware = hardware.find(h => h.id === newConfig.hardware)
      if (selectedHardware) {
        selectedProducts.hardware = selectedHardware
        totalPrice += selectedHardware.price
      }
    }

    // Add installation price
    if (newConfig.installation) {
      const installationService = installationServices.barn_door_installation
      if (installationService) {
        selectedProducts.installation = installationService
        totalPrice += installationService.price
      }
    }

    newConfig.totalPrice = totalPrice
    newConfig.selectedProducts = selectedProducts
    
    setConfig(newConfig)
    onConfigurationChange?.(newConfig)
  }

  const isConfigurationComplete = () => {
    return config.doorType && config.size && config.material && config.finish && config.hardware
  }

  const handleAddToCart = () => {
    if (!isConfigurationComplete()) {
      toast.error('Please complete your configuration first')
      return
    }

    const configName = `${config.doorType} ${config.size} in ${config.material} - ${config.finish}`
    toast.success(`Added ${configName} to cart!`, {
      description: `Total: ${reninProducts.formatPrice(config.totalPrice)}`
    })
  }

  const handleQuickBuy = () => {
    if (!isConfigurationComplete()) {
      toast.error('Please complete your configuration first')
      return
    }
    
    toast.success('Redirecting to checkout...', {
      description: 'Your custom configuration is being processed'
    })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configure Your Closet Door
          </CardTitle>
          <p className="text-muted-foreground">
            Customize your perfect closet door with our easy-to-use configurator
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Door Type */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">1</Badge>
              <h3 className="font-semibold">Choose Door Style</h3>
            </div>
            <Select value={config.doorType} onValueChange={(value) => updateConfig('doorType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select door style" />
              </SelectTrigger>
              <SelectContent>
                {doorTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 2: Size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">2</Badge>
              <h3 className="font-semibold flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                Select Size
              </h3>
            </div>
            <Select 
              value={config.size} 
              onValueChange={(value) => updateConfig('size', value)}
              disabled={!config.doorType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 3: Material */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">3</Badge>
              <h3 className="font-semibold">Choose Material</h3>
            </div>
            <Select 
              value={config.material} 
              onValueChange={(value) => updateConfig('material', value)}
              disabled={!config.doorType || !config.size}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 4: Finish */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">4</Badge>
              <h3 className="font-semibold flex items-center gap-1">
                <Palette className="h-4 w-4" />
                Select Finish
              </h3>
            </div>
            <Select 
              value={config.finish} 
              onValueChange={(value) => updateConfig('finish', value)}
              disabled={!config.material}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select finish" />
              </SelectTrigger>
              <SelectContent>
                {finishes.map((finish) => (
                  <SelectItem key={finish} value={finish}>
                    {finish}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 5: Hardware */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">5</Badge>
              <h3 className="font-semibold">Choose Hardware</h3>
            </div>
            <Select 
              value={config.hardware} 
              onValueChange={(value) => updateConfig('hardware', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select hardware" />
              </SelectTrigger>
              <SelectContent>
                {hardware.map((hw) => (
                  <SelectItem key={hw.id} value={hw.id}>
                    {hw.name} - {reninProducts.formatPrice(hw.price)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Step 6: Installation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline">6</Badge>
              <h3 className="font-semibold flex items-center gap-1">
                <Truck className="h-4 w-4" />
                Professional Installation
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="installation"
                checked={config.installation}
                onChange={(e) => updateConfig('installation', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="installation" className="text-sm">
                Include professional installation (+{reninProducts.formatPrice(installationServices.barn_door_installation?.price || 0)})
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Summary */}
      {config.selectedProducts.door && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Selected Products:</h4>
                <ul className="space-y-2 text-sm">
                  {config.selectedProducts.door && (
                    <li className="flex justify-between">
                      <span>{config.selectedProducts.door.name}</span>
                      <span>{reninProducts.formatPrice(config.selectedProducts.door.sale_price || config.selectedProducts.door.price)}</span>
                    </li>
                  )}
                  {config.selectedProducts.hardware && (
                    <li className="flex justify-between">
                      <span>{config.selectedProducts.hardware.name}</span>
                      <span>{reninProducts.formatPrice(config.selectedProducts.hardware.price)}</span>
                    </li>
                  )}
                  {config.selectedProducts.installation && (
                    <li className="flex justify-between">
                      <span>Professional Installation</span>
                      <span>{reninProducts.formatPrice(config.selectedProducts.installation.price)}</span>
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="space-y-4">
                <PaddlePriceDisplay
                  basePrice={config.totalPrice}
                  showBreakdown={true}
                  showShipping={true}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <AddToCartButton
                productId={`config-${Date.now()}`}
                productName={`Custom ${config.doorType || 'Closet'} Door Configuration`}
                price={config.totalPrice}
                onAddToCart={handleAddToCart}
                disabled={!isConfigurationComplete()}
                className="flex-1"
              />
              <QuickBuyButton
                productId={`config-${Date.now()}`}
                price={config.totalPrice}
                productName={`Custom ${config.doorType || 'Closet'} Door Configuration`}
                onSuccess={handleQuickBuy}
                disabled={!isConfigurationComplete()}
                className="flex-1"
              >
                Buy Now
              </QuickBuyButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}