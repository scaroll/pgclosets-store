"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ConfiguratorState, ProductConfiguratorData, EstimateResult } from "@/types/configurator"
import { ConfiguratorCalculator } from "@/lib/configurator-calculator"
import { trackEvent } from "@/lib/analytics/events"
import { getInitialEstimatorState } from "@/lib/estimator-defaults"
import { getPhoneHref, getPhoneDisplay } from "@/lib/business-info"
import { WizardStep1DoorType } from "./WizardStep1DoorType"
import { WizardStep2Dimensions } from "./WizardStep2Dimensions"
import { WizardStep3Finishes } from "./WizardStep3Finishes"
import { EstimateResult as EstimateResultComponent } from "./EstimateResult"

interface InstantEstimatorWizardProps {
  isOpen: boolean
  onClose: () => void
  initialProduct?: {
    id: string
    title: string
    configuratorData: ProductConfiguratorData
  }
  entryPoint?: 'hero' | 'category_tile' | 'scroll_trigger' | 'mobile_sticky'
}

export function InstantEstimatorWizard({
  isOpen,
  onClose,
  initialProduct,
  entryPoint = 'hero'
}: InstantEstimatorWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [state, setState] = useState<ConfiguratorState>(getInitialEstimatorState())
  const [selectedProduct, setSelectedProduct] = useState(initialProduct)
  const [estimate, setEstimate] = useState<EstimateResult | null>(null)
  const [stepStartTime, setStepStartTime] = useState(Date.now())

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  // Reset wizard when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      setState(getInitialEstimatorState())
      setEstimate(null)
      setStepStartTime(Date.now())

      // Track wizard open
      trackEvent({
        category: 'estimator_wizard',
        action: 'opened',
        label: entryPoint,
        nonInteraction: false
      })
    }
  }, [isOpen, entryPoint])

  // Update selected product if initial product changes
  useEffect(() => {
    if (initialProduct) {
      setSelectedProduct(initialProduct)
    }
  }, [initialProduct])

  const handleNext = () => {
    // Track step completion
    const timeSpent = Math.round((Date.now() - stepStartTime) / 1000)
    trackEvent({
      category: 'estimator_wizard',
      action: 'step_completed',
      label: `Step ${currentStep}`,
      value: timeSpent
    })

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      setStepStartTime(Date.now())
    } else {
      // Calculate final estimate
      if (selectedProduct?.configuratorData) {
        const result = ConfiguratorCalculator.calculate(
          selectedProduct.configuratorData,
          state
        )
        setEstimate(result)

        trackEvent({
          category: 'estimator_wizard',
          action: 'completed',
          label: selectedProduct.title,
          value: result.total_with_addons
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setStepStartTime(Date.now())
    }
  }

  const handleClose = () => {
    // Track abandonment if not complete
    if (!estimate && currentStep > 1) {
      trackEvent({
        category: 'estimator_wizard',
        action: 'abandoned',
        label: `Step ${currentStep}`,
        value: Math.round((currentStep / totalSteps) * 100)
      })
    }
    onClose()
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        // Require both product selection AND valid configurator data
        return !!selectedProduct && !!selectedProduct.configuratorData
      case 2:
        return state.width !== null && state.height !== null && state.panels !== null
      case 3:
        return state.finish !== null
      default:
        return false
    }
  }

  // Show estimate result
  if (estimate && selectedProduct) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <EstimateResultComponent
            estimate={estimate}
            product={selectedProduct}
            state={state}
            onClose={handleClose}
            onEdit={() => {
              setEstimate(null)
              setCurrentStep(1)
            }}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Get Your Instant Estimate
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Step {currentStep} of {totalSteps}
          </p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="py-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className={currentStep >= 1 ? "font-semibold text-foreground" : ""}>
              Door Type
            </span>
            <span className={currentStep >= 2 ? "font-semibold text-foreground" : ""}>
              Dimensions
            </span>
            <span className={currentStep >= 3 ? "font-semibold text-foreground" : ""}>
              Finishes
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="py-6">
          {currentStep === 1 && (
            <WizardStep1DoorType
              selectedProduct={selectedProduct}
              onSelectProduct={setSelectedProduct}
            />
          )}

          {currentStep === 2 && selectedProduct && (
            <WizardStep2Dimensions
              configuratorData={selectedProduct.configuratorData}
              state={state}
              onChange={setState}
            />
          )}

          {currentStep === 3 && selectedProduct && (
            <WizardStep3Finishes
              configuratorData={selectedProduct.configuratorData}
              state={state}
              onChange={setState}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="min-w-[120px]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="min-w-[120px]"
          >
            {currentStep === totalSteps ? 'Get Estimate' : 'Next'}
            {currentStep < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-center text-muted-foreground pt-4">
          Need help? Call us at <a href={getPhoneHref()} className="underline hover:text-foreground">{getPhoneDisplay()}</a>
        </p>
      </DialogContent>
    </Dialog>
  )
}
