'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import {
  useEstimatorStore,
  type DoorType,
  type SizeType,
  type Material,
  type Hardware,
} from './store'
import { ChevronLeft, ChevronRight, DollarSign, Check, Loader2 } from 'lucide-react'

// Map material to display name
const materialLabels: Record<string, string> = {
  pine: 'Pine',
  oak: 'Oak',
  walnut: 'Walnut',
  'frosted-glass': 'Frosted Glass',
  'clear-glass': 'Clear Glass',
}

// Map door type to display name
const doorTypeLabels: Record<string, string> = {
  barn: 'Barn Door',
  bifold: 'Bifold Door',
  bypass: 'Bypass Door',
  glass: 'Glass Door',
}

// Map hardware to display name
const hardwareLabels: Record<string, string> = {
  basic: 'Basic Hardware',
  premium: 'Premium Hardware',
  luxury: 'Luxury Hardware',
}

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
    reset,
  } = useEstimatorStore()

  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [consent, setConsent] = useState(false)
  const [quoteNumber, setQuoteNumber] = useState('')

  const estimate = calculateEstimate()
  const progress = (step / 6) * 100

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
        return name !== '' && email !== '' && consent
      default:
        return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // Build a descriptive product name
      const productName = `${doorTypeLabels[doorType || 'barn']} - ${materialLabels[material || 'pine']}`

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          location: 'Ottawa',
          serviceType: 'quote',
          productInterest: productName,
          message: `
Door Type: ${doorTypeLabels[doorType || 'barn']}
Size: ${sizeType === 'custom' ? `Custom (${customWidth}" x ${customHeight}")` : 'Standard'}
Material: ${materialLabels[material || 'pine']}
Hardware: ${hardwareLabels[hardware || 'basic']}
Installation: ${installation ? 'Yes' : 'No'}
Estimated Price Range: $${estimate.min.toLocaleString()} - $${estimate.max.toLocaleString()}

Additional Notes: ${message || 'None'}
          `.trim(),
          preferredContact: 'email',
          consent: true,
          doorSelection: {
            series: doorTypeLabels[doorType || 'barn'],
            doorType: doorType === 'glass' ? 'pivot' : doorType || 'barn',
            openingWidthIn: sizeType === 'custom' ? parseInt(customWidth) || 36 : 36,
            openingHeightIn: sizeType === 'custom' ? parseInt(customHeight) || 84 : 84,
            panelCount: 1,
            finish: materialLabels[material || 'pine'],
            hardware: hardwareLabels[hardware || 'basic'],
            softClose: hardware === 'premium' || hardware === 'luxury',
            handles: 'Standard',
            quantity: 1,
            notes: message,
          },
        }),
      })

      const data = (await response.json()) as { message?: string; leadId?: string }

      if (!response.ok) {
        throw new Error(data.message ?? 'Something went wrong')
      }

      setQuoteNumber(data.leadId ?? `EST-${Date.now()}`)
      setSubmitted(true)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    reset()
    setSubmitted(false)
    setConsent(false)
    setQuoteNumber('')
    setErrorMessage('')
  }

  if (submitted) {
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Thank You, {name}!</CardTitle>
          <CardDescription className="text-base">
            We have received your request for a detailed quote.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quoteNumber && (
            <div className="text-center text-sm text-muted-foreground">
              Reference Number:{' '}
              <span className="font-mono font-semibold">
                {quoteNumber.slice(0, 8).toUpperCase()}
              </span>
            </div>
          )}
          <div className="rounded-lg bg-muted p-6">
            <p className="mb-2 text-sm text-muted-foreground">Your estimated price range:</p>
            <p className="text-4xl font-bold text-primary">
              ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()} CAD
            </p>
          </div>
          <div className="space-y-2 rounded-lg bg-primary/5 p-4">
            <h4 className="font-semibold">What Happens Next?</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </span>
                <span>You&apos;ll receive a confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  2
                </span>
                <span>Our team will review your requirements within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  3
                </span>
                <span>We&apos;ll contact you with a detailed, customized quote</span>
              </li>
            </ul>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Have questions? Call us at{' '}
            <a href="tel:+16137016393" className="font-semibold text-primary hover:underline">
              (613) 701-6393
            </a>
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
            Start New Estimate
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <a href="/book-measure">Book Free Consultation</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
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
              <h3 className="mb-2 text-xl font-semibold">Select Door Type</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Choose the style that best fits your space
              </p>
            </div>

            <RadioGroup
              value={doorType || ''}
              onValueChange={value => setDoorType(value as DoorType)}
              className="grid grid-cols-1 gap-4"
            >
              {[
                {
                  value: 'barn',
                  label: 'Barn Door',
                  price: '$399 - $899',
                  desc: 'Classic sliding barn door style',
                },
                {
                  value: 'bifold',
                  label: 'Bifold Door',
                  price: '$299 - $599',
                  desc: 'Space-saving folding design',
                },
                {
                  value: 'bypass',
                  label: 'Bypass Door',
                  price: '$349 - $699',
                  desc: 'Smooth sliding door system',
                },
                {
                  value: 'glass',
                  label: 'Glass Door',
                  price: '$499 - $999',
                  desc: 'Modern glass panels',
                },
              ].map(option => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                    doorType === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{option.label}</span>
                      <span className="text-sm font-medium text-primary">{option.price}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{option.desc}</p>
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
              <h3 className="mb-2 text-xl font-semibold">Choose Size</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Select standard size or enter custom dimensions
              </p>
            </div>

            <RadioGroup
              value={sizeType || ''}
              onValueChange={value => setSizeType(value as SizeType)}
              className="grid grid-cols-1 gap-4"
            >
              <Label
                htmlFor="standard"
                className={`flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                  sizeType === 'standard' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="standard" id="standard" />
                <div className="flex-1">
                  <span className="font-semibold">Standard Sizes</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Common sizes: 30&quot;, 36&quot;, 42&quot; width
                  </p>
                </div>
              </Label>

              <Label
                htmlFor="custom"
                className={`flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                  sizeType === 'custom' ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="custom" id="custom" />
                <div className="flex-1">
                  <span className="font-semibold">Custom Size</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Enter your specific dimensions (+$100-$200)
                  </p>
                </div>
              </Label>
            </RadioGroup>

            {sizeType === 'custom' && (
              <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (inches)</Label>
                  <Input
                    id="width"
                    type="number"
                    placeholder="e.g., 48"
                    value={customWidth}
                    onChange={e => setCustomWidth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (inches)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="e.g., 84"
                    value={customHeight}
                    onChange={e => setCustomHeight(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Material/Finish */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-semibold">Select Material & Finish</h3>
              <p className="mb-6 text-sm text-muted-foreground">Choose your preferred material</p>
            </div>

            <RadioGroup
              value={material || ''}
              onValueChange={value => setMaterial(value as Material)}
              className="grid grid-cols-1 gap-4"
            >
              {[
                { value: 'pine', label: 'Pine', price: 'Base Price', desc: 'Natural wood finish' },
                { value: 'oak', label: 'Oak', price: '+$100 - $150', desc: 'Premium hardwood' },
                {
                  value: 'walnut',
                  label: 'Walnut',
                  price: '+$200 - $300',
                  desc: 'Luxury dark wood',
                },
                {
                  value: 'frosted-glass',
                  label: 'Frosted Glass',
                  price: '+$150 - $250',
                  desc: 'Privacy glass panels',
                },
                {
                  value: 'clear-glass',
                  label: 'Clear Glass',
                  price: '+$100 - $200',
                  desc: 'Transparent glass panels',
                },
              ].map(option => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                    material === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{option.label}</span>
                      <span className="text-sm font-medium text-primary">{option.price}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{option.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 4: Hardware */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-semibold">Choose Hardware</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Select the hardware quality level
              </p>
            </div>

            <RadioGroup
              value={hardware || ''}
              onValueChange={value => setHardware(value as Hardware)}
              className="grid grid-cols-1 gap-4"
            >
              {[
                {
                  value: 'basic',
                  label: 'Basic Hardware',
                  price: '$99 - $149',
                  desc: 'Standard quality hardware',
                },
                {
                  value: 'premium',
                  label: 'Premium Hardware',
                  price: '$150 - $229',
                  desc: 'Enhanced durability and finish',
                },
                {
                  value: 'luxury',
                  label: 'Luxury Hardware',
                  price: '$230 - $299',
                  desc: 'Top-tier designer hardware',
                },
              ].map(option => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={`flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                    hardware === option.value ? 'border-primary bg-primary/5' : 'border-muted'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{option.label}</span>
                      <span className="text-sm font-medium text-primary">{option.price}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{option.desc}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 5: Installation */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-semibold">Installation Service</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Would you like professional installation?
              </p>
            </div>

            <RadioGroup
              value={installation === null ? '' : installation ? 'yes' : 'no'}
              onValueChange={value => setInstallation(value === 'yes')}
              className="grid grid-cols-1 gap-4"
            >
              <Label
                htmlFor="install-yes"
                className={`flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                  installation === true ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="yes" id="install-yes" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Yes, Include Installation</span>
                    <span className="text-sm font-medium text-primary">+$150 - $300</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Professional installation by certified technicians
                  </p>
                </div>
              </Label>

              <Label
                htmlFor="install-no"
                className={`flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-4 transition-all hover:border-primary ${
                  installation === false ? 'border-primary bg-primary/5' : 'border-muted'
                }`}
              >
                <RadioGroupItem value="no" id="install-no" />
                <div className="flex-1">
                  <span className="font-semibold">No, I&apos;ll Install Myself</span>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We&apos;ll provide installation instructions
                  </p>
                </div>
              </Label>
            </RadioGroup>

            <div className="mt-8 rounded-lg border-2 border-primary bg-primary/10 p-4">
              <div className="mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold">Your Estimated Price</h4>
              </div>
              <p className="text-3xl font-bold text-primary">
                ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                This is an estimated range. Final price may vary based on specific requirements.
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Contact Form */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-xl font-semibold">Get Your Detailed Quote</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Enter your contact information to receive a detailed quote
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-muted p-4">
              <p className="mb-1 text-sm text-muted-foreground">Your Estimated Price:</p>
              <p className="text-2xl font-bold text-primary">
                ${estimate.min.toLocaleString()} - ${estimate.max.toLocaleString()} CAD
              </p>
            </div>

            <form onSubmit={e => void handleSubmit(e)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  onChange={e => setEmail(e.target.value)}
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
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(613) 555-1234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Notes</Label>
                <textarea
                  id="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell us more about your project..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={checked => setConsent(checked === true)}
                  required
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed text-muted-foreground">
                  I agree to be contacted by PG Closets regarding my quote request. I understand my
                  information will be kept confidential.
                </Label>
              </div>

              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                </div>
              )}
            </form>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={prevStep} disabled={step === 1} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {step < 6 ? (
          <Button onClick={nextStep} disabled={!canProceed()} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={e => void handleSubmit(e as unknown as React.FormEvent)}
            disabled={!canProceed() || isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Get Detailed Quote
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
