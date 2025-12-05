'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { useEstimatorStore, type DoorType, type SizeType, type Material, type Hardware } from './store'
import { ChevronLeft, ChevronRight, DollarSign, Check, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function InstantEstimateCalculator() {
  const {
    step,
    doorType,
    sizeType,
    customWidth,
    customHeight,
    material,
    hardware,
    installation,
    name,
    email,
    phone,
    message,
    setDoorType,
    setSizeType,
    setCustomWidth,
    setCustomHeight,
    setMaterial,
    setHardware,
    setInstallation,
    setName,
    setEmail,
    setPhone,
    setMessage,
    nextStep,
    prevStep,
    calculateEstimate,
    getPriceBreakdown,
    reset,
  } = useEstimatorStore()

  const [submitted, setSubmitted] = useState(false)

  const estimate = calculateEstimate()
  const breakdown = getPriceBreakdown()
  const progress = (step / 6) * 100

  // Dimension validation
  const getDimensionWarning = () => {
    if (sizeType === 'custom' && customWidth && customHeight) {
      const width = parseFloat(customWidth)
      const height = parseFloat(customHeight)

      if (!isNaN(width) && !isNaN(height)) {
        if (width < 18 || height < 60) {
          return 'Door dimensions seem unusually small. Please verify your measurements.'
        }
        if (width > 120 || height > 120) {
          return 'Large doors may require special handling and additional costs. Our team will contact you about this.'
        }
        const sqFt = (width * height) / 144
        if (sqFt > 40) {
          return 'This is a large door that may require reinforced hardware and installation.'
        }
      }
    }
    return null
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return doorType !== null
      case 2:
        if (sizeType === 'custom') {
          return customWidth !== '' && customHeight !== ''
        }
        return sizeType !== null
      case 3:
        return material !== null
      case 4:
        return hardware !== null
      case 5:
        return installation !== null
      case 6:
        return name !== '' && email !== ''
      default:
        return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log('Estimate submitted:', {
      doorType,
      sizeType,
      customWidth,
      customHeight,
      material,
      hardware,
      installation,
      estimate,
      name,
      email,
      phone,
      message,
    })
    setSubmitted(true)
  }

  const handleReset = () => {
    reset()
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>
            We have received your request for a detailed quote.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Your estimated price range:
            </p>
            <p className="text-3xl font-bold text-primary">
              ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
            </p>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Our team will contact you within 24 hours with a detailed quote.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleReset} className="w-full">
            Start New Estimate
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Step {step} of 6</CardTitle>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>

      <CardContent className="min-h-[400px]">
        {/* Step 1: Door Type */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Select Door Type</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose the style that best fits your space
              </p>
            </div>

            <RadioGroup
              value={doorType || ''}
              onValueChange={(value) => setDoorType(value as DoorType)}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { value: 'barn', label: 'Barn Door', price: '$399 - $899', desc: 'Classic sliding barn door style' },
                { value: 'bifold', label: 'Bifold Door', price: '$299 - $599', desc: 'Space-saving folding design' },
                { value: 'bypass', label: 'Bypass Door', price: '$349 - $699', desc: 'Smooth sliding door system' },
                { value: 'glass', label: 'Glass Door', price: '$499 - $999', desc: 'Modern glass panels' },
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                    doorType === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{option.label}</span>
                      <span className="text-sm text-primary font-medium">{option.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{option.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 2: Size */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Choose Size</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select standard size or enter custom dimensions
              </p>
            </div>

            <RadioGroup
              value={sizeType || ''}
              onValueChange={(value) => setSizeType(value as SizeType)}
              className="grid grid-cols-1 gap-4"
            >
              <Label
                htmlFor="standard"
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                  sizeType === 'standard' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="standard" id="standard" />
                <div className="flex-1">
                  <span className="font-semibold">Standard Sizes</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Common sizes: 30&quot;, 36&quot;, 42&quot; width
                  </p>
                </div>
              </Label>

              <Label
                htmlFor="custom"
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                  sizeType === 'custom' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="custom" id="custom" />
                <div className="flex-1">
                  <span className="font-semibold">Custom Size</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your specific dimensions (+$100-$200)
                  </p>
                </div>
              </Label>
            </RadioGroup>

            {sizeType === 'custom' && (
              <>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width (inches)</Label>
                    <Input
                      id="width"
                      type="number"
                      placeholder="e.g., 48"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (inches)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="e.g., 84"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(e.target.value)}
                    />
                  </div>
                </div>
                {getDimensionWarning() && (
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{getDimensionWarning()}</AlertDescription>
                  </Alert>
                )}
              </>
            )}

            {doorType && sizeType && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Current Estimate:</p>
                <p className="text-2xl font-bold text-primary">
                  ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Material/Finish */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Select Material & Finish</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose your preferred material
              </p>
            </div>

            <RadioGroup
              value={material || ''}
              onValueChange={(value) => setMaterial(value as Material)}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { value: 'pine', label: 'Pine', price: 'Base Price', desc: 'Natural wood finish' },
                { value: 'oak', label: 'Oak', price: '+$100 - $150', desc: 'Premium hardwood' },
                { value: 'walnut', label: 'Walnut', price: '+$200 - $300', desc: 'Luxury dark wood' },
                { value: 'frosted-glass', label: 'Frosted Glass', price: '+$150 - $250', desc: 'Privacy glass panels' },
                { value: 'clear-glass', label: 'Clear Glass', price: '+$100 - $200', desc: 'Transparent glass panels' },
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                    material === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{option.label}</span>
                      <span className="text-sm text-primary font-medium">{option.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{option.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>

            {doorType && sizeType && material && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Current Estimate:</p>
                <p className="text-2xl font-bold text-primary">
                  ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Hardware */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Choose Hardware</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select the hardware quality level
              </p>
            </div>

            <RadioGroup
              value={hardware || ''}
              onValueChange={(value) => setHardware(value as Hardware)}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { value: 'basic', label: 'Basic Hardware', price: '$99 - $149', desc: 'Standard quality hardware' },
                { value: 'premium', label: 'Premium Hardware', price: '$150 - $229', desc: 'Enhanced durability and finish' },
                { value: 'luxury', label: 'Luxury Hardware', price: '$230 - $299', desc: 'Top-tier designer hardware' },
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                    hardware === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{option.label}</span>
                      <span className="text-sm text-primary font-medium">{option.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{option.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>

            {doorType && sizeType && material && hardware && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Current Estimate:</p>
                <p className="text-2xl font-bold text-primary">
                  ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Installation */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Installation Service</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Would you like professional installation?
              </p>
            </div>

            <RadioGroup
              value={installation === null ? '' : installation ? 'yes' : 'no'}
              onValueChange={(value) => setInstallation(value === 'yes')}
              className="grid grid-cols-1 gap-4"
            >
              <Label
                htmlFor="install-yes"
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                  installation === true ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="yes" id="install-yes" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Yes, Include Installation</span>
                    <span className="text-sm text-primary font-medium">+$150 - $300</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Professional installation by certified technicians
                  </p>
                </div>
              </Label>

              <Label
                htmlFor="install-no"
                className={`flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                  installation === false ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="no" id="install-no" />
                <div className="flex-1">
                  <span className="font-semibold">No, I&apos;ll Install Myself</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    We&apos;ll provide installation instructions
                  </p>
                </div>
              </Label>
            </RadioGroup>

            <div className="mt-8 p-4 bg-primary/10 rounded-lg border-2 border-primary">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-lg">Price Breakdown</h4>
              </div>

              <div className="space-y-3 mb-4">
                {breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-primary ml-4">
                      ${item.min.toLocaleString()} - ${item.max.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-primary/20">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Total Estimate:</p>
                  <p className="text-2xl font-bold text-primary">
                    ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                This is an estimated range. Final price may vary based on specific requirements and site conditions.
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Contact Form */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Get Your Detailed Quote</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your contact information to receive a detailed quote
              </p>
            </div>

            <div className="p-4 bg-muted rounded-lg mb-6">
              <p className="text-sm font-semibold mb-3">Your Configuration:</p>
              <div className="space-y-2 mb-4">
                {breakdown.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">
                      ${item.min.toLocaleString()} - ${item.max.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t flex justify-between items-center">
                <p className="text-sm font-semibold">Estimated Total:</p>
                <p className="text-2xl font-bold text-primary">
                  ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Notes</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more about your project..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </form>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {step < 6 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            className="gap-2"
          >
            Get Detailed Quote
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
