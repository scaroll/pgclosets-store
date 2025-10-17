"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Download, Edit, Phone, Calendar } from "lucide-react"
import type { EstimateResult, ConfiguratorState, ProductConfiguratorData } from "@/types/configurator"
import { formatPrice } from "@/lib/door-types"
import { getPhoneHref, getPhoneDisplay } from "@/lib/business-info"

interface EstimateResultProps {
  estimate: EstimateResult
  product: {
    id: string
    title: string
    configuratorData: ProductConfiguratorData
  }
  state: ConfiguratorState
  onClose: () => void
  onEdit: () => void
}

export function EstimateResult({
  estimate,
  product,
  state,
  onClose,
  onEdit
}: EstimateResultProps) {
  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert('PDF download functionality coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Instant Estimate</h2>
        <p className="text-muted-foreground">
          Professional installation in Ottawa | 2-{estimate.lead_time_weeks} weeks
        </p>
      </div>

      {/* Price Range */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Estimated Total</p>
          <p className="text-4xl font-bold mb-1">
            {formatPrice(estimate.price_low * 100)} - {formatPrice(estimate.price_high * 100)}
          </p>
          <p className="text-xs text-muted-foreground">
            Price varies based on final measurements and installation complexity
          </p>
        </div>
      </Card>

      {/* Configuration Summary */}
      <div>
        <h3 className="font-semibold mb-3">Your Configuration</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-muted-foreground text-xs">Product</p>
            <p className="font-semibold">{product.title}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-muted-foreground text-xs">Dimensions</p>
            <p className="font-semibold">{state.width}" × {state.height}"</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-muted-foreground text-xs">Panels</p>
            <p className="font-semibold">{state.panels}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-muted-foreground text-xs">Finish</p>
            <p className="font-semibold">
              {product.configuratorData.finish_options.find(f => f.id === state.finish)?.name || 'Selected'}
            </p>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div>
        <h3 className="font-semibold mb-3">Included in Your Order</h3>
        <div className="space-y-2">
          {estimate.includes.map((item, index) => (
            <div key={index} className="flex items-start gap-2 text-sm">
              <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Add-ons */}
      {estimate.addons.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Selected Add-Ons</h3>
          <div className="space-y-2">
            {estimate.addons.map((addon) => (
              <div key={addon.id} className="flex justify-between items-center text-sm p-2 bg-muted rounded">
                <span>{addon.name}</span>
                <span className="font-semibold">{formatPrice(addon.price * 100)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center font-bold mt-3 pt-3 border-t">
            <span>Total with Add-ons</span>
            <span className="text-lg">{formatPrice(estimate.total_with_addons * 100)}</span>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="space-y-3 pt-4">
        <Link href="/book-measure" onClick={onClose} className="block">
          <Button className="w-full" size="lg">
            <Calendar className="w-5 h-5 mr-2" />
            Book Free Measure & Consultation
          </Button>
        </Link>

        <a href={getPhoneHref()} className="block">
          <Button variant="outline" className="w-full" size="lg">
            <Phone className="w-5 h-5 mr-2" />
            Call {getPhoneDisplay()}
          </Button>
        </a>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>

          <Button
            variant="outline"
            onClick={onEdit}
            className="w-full"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Estimate
          </Button>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="pt-4 border-t">
        <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-600" />
            <span>Lifetime Warranty</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-600" />
            <span>BBB A+ Rated</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-600" />
            <span>500+ Ottawa Projects</span>
          </div>
          <div className="flex items-center gap-1">
            <Check className="w-4 h-4 text-green-600" />
            <span>Free Measure</span>
          </div>
        </div>
      </div>
    </div>
  )
}
