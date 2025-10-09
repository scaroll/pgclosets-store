"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { ConfiguratorState, ProductConfiguratorData } from "@/types/configurator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WizardStep2DimensionsProps {
  configuratorData: ProductConfiguratorData
  state: ConfiguratorState
  onChange: (state: ConfiguratorState) => void
}

export function WizardStep2Dimensions({
  configuratorData,
  state,
  onChange
}: WizardStep2DimensionsProps) {
  const handleWidthChange = (value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num) && num > 0) {
      onChange({ ...state, width: num })
    } else {
      onChange({ ...state, width: null })
    }
  }

  const handleHeightChange = (value: string) => {
    const num = parseFloat(value)
    if (!isNaN(num) && num > 0) {
      onChange({ ...state, height: num })
    } else {
      onChange({ ...state, height: null })
    }
  }

  const handlePanelChange = (value: number) => {
    onChange({ ...state, panels: value })
  }

  // Common Ottawa closet sizes
  const commonSizes = [
    { width: 48, height: 80, label: 'Small Closet (4ft × 80")' },
    { width: 72, height: 80, label: 'Standard Closet (6ft × 80")' },
    { width: 96, height: 80, label: 'Large Closet (8ft × 80")' },
    { width: 120, height: 96, label: 'Room Divider (10ft × 96")' },
  ]

  const applyCommonSize = (width: number, height: number) => {
    onChange({ ...state, width, height })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Opening Dimensions</h3>
        <p className="text-sm text-muted-foreground">
          Measure your closet opening (rough opening size)
        </p>
      </div>

      {/* Quick Size Presets */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Common Ottawa Closet Sizes
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {commonSizes.map((size) => (
            <Button
              key={size.label}
              variant="outline"
              size="sm"
              onClick={() => applyCommonSize(size.width, size.height)}
              className="text-xs h-auto py-2"
            >
              {size.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Dimensions */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width" className="flex items-center gap-2 mb-2">
            Opening Width
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Measure from inside frame to inside frame at the widest point.
                    Range: {configuratorData.opening_min_width}" - {configuratorData.opening_max_width}"
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <div className="flex gap-2">
            <Input
              id="width"
              type="number"
              placeholder={`${configuratorData.opening_min_width} - ${configuratorData.opening_max_width}`}
              value={state.width || ''}
              onChange={(e) => handleWidthChange(e.target.value)}
              min={configuratorData.opening_min_width}
              max={configuratorData.opening_max_width}
            />
            <span className="flex items-center text-sm text-muted-foreground">
              inches
            </span>
          </div>
          {state.width && (state.width < configuratorData.opening_min_width || state.width > configuratorData.opening_max_width) && (
            <p className="text-xs text-red-500 mt-1">
              Width must be between {configuratorData.opening_min_width}" and {configuratorData.opening_max_width}"
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="height" className="flex items-center gap-2 mb-2">
            Opening Height
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Measure from floor to top of opening.
                    Range: {configuratorData.opening_min_height}" - {configuratorData.opening_max_height}"
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Label>
          <div className="flex gap-2">
            <Input
              id="height"
              type="number"
              placeholder={`${configuratorData.opening_min_height} - ${configuratorData.opening_max_height}`}
              value={state.height || ''}
              onChange={(e) => handleHeightChange(e.target.value)}
              min={configuratorData.opening_min_height}
              max={configuratorData.opening_max_height}
            />
            <span className="flex items-center text-sm text-muted-foreground">
              inches
            </span>
          </div>
          {state.height && (state.height < configuratorData.opening_min_height || state.height > configuratorData.opening_max_height) && (
            <p className="text-xs text-red-500 mt-1">
              Height must be between {configuratorData.opening_min_height}" and {configuratorData.opening_max_height}"
            </p>
          )}
        </div>
      </div>

      {/* Panel Configuration */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Number of Panels
        </Label>
        <RadioGroup
          value={state.panels?.toString() || ''}
          onValueChange={(value) => handlePanelChange(parseInt(value))}
        >
          <div className="grid grid-cols-3 gap-3">
            {configuratorData.panel_options.map((panelCount) => (
              <label
                key={panelCount}
                className={`flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  state.panels === panelCount
                    ? 'border-black bg-muted'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <RadioGroupItem value={panelCount.toString()} className="sr-only" />
                <div className="text-center">
                  <div className="text-2xl font-bold">{panelCount}</div>
                  <div className="text-xs text-muted-foreground">
                    {panelCount === 2 ? 'Most Popular' : 'Panels'}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </RadioGroup>
        <p className="text-xs text-muted-foreground mt-2">
          More panels = better access to closet contents
        </p>
      </div>

      {/* Live Estimate Preview */}
      {state.width && state.height && state.panels && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-green-900">
            Your Configuration
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Width</p>
              <p className="font-semibold">{state.width}"</p>
            </div>
            <div>
              <p className="text-muted-foreground">Height</p>
              <p className="font-semibold">{state.height}"</p>
            </div>
            <div>
              <p className="text-muted-foreground">Panels</p>
              <p className="font-semibold">{state.panels}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
