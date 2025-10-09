"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { ConfiguratorState, ProductConfiguratorData } from "@/types/configurator"
import { formatPrice } from "@/lib/door-types"

interface WizardStep3FinishesProps {
  configuratorData: ProductConfiguratorData
  state: ConfiguratorState
  onChange: (state: ConfiguratorState) => void
}

export function WizardStep3Finishes({
  configuratorData,
  state,
  onChange
}: WizardStep3FinishesProps) {
  const [showAllAddons, setShowAllAddons] = useState(false)

  const handleFinishChange = (finishId: string) => {
    onChange({ ...state, finish: finishId })
  }

  const handleAddonToggle = (addonId: string) => {
    const currentAddons = state.addons || []
    const newAddons = currentAddons.includes(addonId)
      ? currentAddons.filter(id => id !== addonId)
      : [...currentAddons, addonId]
    onChange({ ...state, addons: newAddons })
  }

  const isAddonSelected = (addonId: string) => {
    return (state.addons || []).includes(addonId)
  }

  // Categorize addons
  const hardwareAddons = configuratorData.addons.filter(a => a.category === 'hardware')
  const serviceAddons = configuratorData.addons.filter(a => a.category === 'service')
  const upgradeAddons = configuratorData.addons.filter(a => a.category === 'upgrade')

  const visibleAddons = showAllAddons
    ? configuratorData.addons
    : [...serviceAddons, ...hardwareAddons.slice(0, 2)]

  return (
    <div className="space-y-6">
      {/* Finish Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Finish</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select the color and material that matches your style
        </p>

        <RadioGroup
          value={state.finish || ''}
          onValueChange={handleFinishChange}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {configuratorData.finish_options.map((finish) => (
              <label
                key={finish.id}
                className={`relative cursor-pointer transition-all`}
              >
                <RadioGroupItem value={finish.id} className="sr-only" />
                <Card
                  className={`p-3 transition-all ${
                    state.finish === finish.id
                      ? 'border-black border-2 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {state.finish === finish.id && (
                    <div className="absolute top-2 right-2 bg-black text-white rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  <div
                    className="w-full aspect-square rounded-lg mb-2 border"
                    style={{ backgroundColor: finish.color }}
                  />

                  <p className="text-xs font-semibold text-center">
                    {finish.name}
                  </p>

                  {finish.price_modifier !== 0 && (
                    <p className="text-xs text-center text-muted-foreground">
                      {finish.price_modifier > 0 ? '+' : ''}
                      {formatPrice(Math.abs(finish.price_modifier))}
                    </p>
                  )}
                </Card>
              </label>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Add-Ons */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Customize Your Order</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Add optional upgrades and services
        </p>

        <div className="space-y-3">
          {visibleAddons.map((addon) => (
            <label
              key={addon.id}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isAddonSelected(addon.id)
                  ? 'border-black bg-muted'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <Checkbox
                checked={isAddonSelected(addon.id)}
                onCheckedChange={() => handleAddonToggle(addon.id)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{addon.name}</p>
                    {addon.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {addon.description}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-bold whitespace-nowrap">
                    {formatPrice(addon.price_cad)}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>

        {configuratorData.addons.length > visibleAddons.length && (
          <button
            onClick={() => setShowAllAddons(!showAllAddons)}
            className="text-sm text-blue-600 hover:underline mt-3"
          >
            {showAllAddons ? 'Show Less' : `Show ${configuratorData.addons.length - visibleAddons.length} More Options`}
          </button>
        )}
      </div>

      {/* What's Included */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-semibold text-sm mb-2">Included with Every Order</h4>
        <ul className="space-y-1">
          {configuratorData.includes.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-xs">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Summary */}
      {state.finish && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 text-blue-900">
            Your Selections
          </h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Finish:</span>
              <span className="font-semibold">
                {configuratorData.finish_options.find(f => f.id === state.finish)?.name}
              </span>
            </div>
            {(state.addons || []).length > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Add-ons:</span>
                <span className="font-semibold">
                  {(state.addons || []).length} selected
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
