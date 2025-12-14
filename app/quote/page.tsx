'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
  Plus,
  Trash2,
  User,
  Home,
  Ruler,
  Wrench,
  MapPin,
} from 'lucide-react'

// Types
interface Opening {
  id: string
  location: string
  currentDoorType: string
  openingWidth: string
  openingHeight: string
  preferredStyle: string
  preferredFinish: string
  notes: string
}

interface FormData {
  // Contact
  firstName: string
  lastName: string
  email: string
  phone: string
  preferredContact: 'email' | 'phone' | 'either'
  bestTimeToCall: string
  // Project
  projectType: string
  timeline: string
  budget: string
  // Openings
  openings: Opening[]
  // Services
  needsMeasurement: boolean
  needsInstallation: boolean
  needsOldDoorRemoval: boolean
  needsPainting: boolean
  // Address
  street: string
  city: string
  province: string
  postalCode: string
  // Additional
  howHeard: string
  additionalNotes: string
  consent: boolean
}

const initialOpening: Opening = {
  id: crypto.randomUUID?.() || `${Date.now()}`,
  location: '',
  currentDoorType: '',
  openingWidth: '',
  openingHeight: '',
  preferredStyle: '',
  preferredFinish: '',
  notes: '',
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferredContact: 'email',
  bestTimeToCall: '',
  projectType: '',
  timeline: '',
  budget: '',
  openings: [{ ...initialOpening }],
  needsMeasurement: true,
  needsInstallation: true,
  needsOldDoorRemoval: false,
  needsPainting: false,
  street: '',
  city: 'Ottawa',
  province: 'ON',
  postalCode: '',
  howHeard: '',
  additionalNotes: '',
  consent: false,
}

const STEPS = [
  { id: 1, title: 'Contact', icon: User },
  { id: 2, title: 'Project', icon: Home },
  { id: 3, title: 'Openings', icon: Ruler },
  { id: 4, title: 'Services', icon: Wrench },
  { id: 5, title: 'Address', icon: MapPin },
  { id: 6, title: 'Review', icon: Check },
]

export default function QuoteRequestPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [quoteId, setQuoteId] = useState('')

  const progress = (step / 6) * 100

  const updateFormData = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const addOpening = () => {
    setFormData(prev => ({
      ...prev,
      openings: [
        ...prev.openings,
        { ...initialOpening, id: crypto.randomUUID?.() || `${Date.now()}` },
      ],
    }))
  }

  const removeOpening = (id: string) => {
    if (formData.openings.length > 1) {
      setFormData(prev => ({
        ...prev,
        openings: prev.openings.filter(o => o.id !== id),
      }))
    }
  }

  const updateOpening = (id: string, field: keyof Opening, value: string) => {
    setFormData(prev => ({
      ...prev,
      openings: prev.openings.map(o => (o.id === id ? { ...o, [field]: value } : o)),
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone
      case 2:
        return formData.projectType && formData.timeline
      case 3:
        return formData.openings.every(o => o.location && o.openingWidth && o.openingHeight)
      case 4:
        return true
      case 5:
        return formData.street && formData.city && formData.postalCode
      case 6:
        return formData.consent
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      // Format openings for the message
      const openingsText = formData.openings
        .map(
          (o, i) => `
Opening ${i + 1}:
  - Location: ${o.location}
  - Current Door Type: ${o.currentDoorType || 'Not specified'}
  - Opening Size: ${o.openingWidth}" W x ${o.openingHeight}" H
  - Preferred Style: ${o.preferredStyle || 'Not specified'}
  - Preferred Finish: ${o.preferredFinish || 'Not specified'}
  - Notes: ${o.notes || 'None'}`
        )
        .join('\n')

      const servicesText = [
        formData.needsMeasurement && 'Free Measurement',
        formData.needsInstallation && 'Professional Installation',
        formData.needsOldDoorRemoval && 'Old Door Removal',
        formData.needsPainting && 'Painting Service',
      ]
        .filter(Boolean)
        .join(', ')

      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          location: `${formData.street}, ${formData.city}, ${formData.province} ${formData.postalCode}`,
          serviceType: 'quote',
          productInterest: `${formData.projectType} - ${formData.openings.length} opening(s)`,
          preferredContact: formData.preferredContact,
          consent: formData.consent,
          message: `
PROJECT DETAILS:
- Type: ${formData.projectType}
- Timeline: ${formData.timeline}
- Budget: ${formData.budget || 'Flexible'}

OPENINGS:${openingsText}

SERVICES NEEDED:
${servicesText || 'None specified'}

ADDRESS:
${formData.street}
${formData.city}, ${formData.province} ${formData.postalCode}

ADDITIONAL INFO:
- Best Time to Call: ${formData.bestTimeToCall || 'Anytime'}
- How They Heard About Us: ${formData.howHeard || 'Not specified'}
- Additional Notes: ${formData.additionalNotes || 'None'}
          `.trim(),
        }),
      })

      const data = (await response.json()) as { message?: string; leadId?: string }

      if (!response.ok) {
        throw new Error(data.message ?? 'Failed to submit quote request')
      }

      setQuoteId(data.leadId ?? `QR-${Date.now()}`)
      setSubmitStatus('success')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong')
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <main className="min-h-screen bg-background py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-3xl">Quote Request Received!</CardTitle>
              <CardDescription className="text-lg">
                Thank you, {formData.firstName}. We&apos;ve received your detailed quote request.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {quoteId && (
                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm text-muted-foreground">Your Reference Number</p>
                  <p className="font-mono text-2xl font-bold">
                    {quoteId.slice(0, 8).toUpperCase()}
                  </p>
                </div>
              )}
              <div className="space-y-4 rounded-lg bg-primary/5 p-6">
                <h3 className="text-lg font-semibold">What Happens Next?</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                      1
                    </span>
                    <span>Our team will review your requirements within 24 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                      2
                    </span>
                    <span>We&apos;ll contact you to schedule a free in-home measurement</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                      3
                    </span>
                    <span>You&apos;ll receive a detailed, itemized quote with no hidden fees</span>
                  </li>
                </ul>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Questions? Call us at{' '}
                <a href="tel:+16137016393" className="font-semibold text-primary hover:underline">
                  (613) 701-6393
                </a>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild variant="outline">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold md:text-4xl">Request a Quote</h1>
            <p className="text-muted-foreground">
              Tell us about your project and we&apos;ll provide a detailed, no-obligation quote
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between">
              {STEPS.map(s => (
                <div
                  key={s.id}
                  className={`flex flex-col items-center ${
                    s.id <= step ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`mb-1 flex h-10 w-10 items-center justify-center rounded-full ${
                      s.id < step
                        ? 'bg-primary text-primary-foreground'
                        : s.id === step
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                    }`}
                  >
                    {s.id < step ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                  </div>
                  <span className="hidden text-xs sm:block">{s.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                Step {step}: {STEPS[step - 1].title}
              </CardTitle>
            </CardHeader>

            <CardContent className="min-h-[400px]">
              {/* Step 1: Contact Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={e => updateFormData('firstName', e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={e => updateFormData('lastName', e.target.value)}
                        placeholder="Smith"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={e => updateFormData('email', e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={e => updateFormData('phone', e.target.value)}
                      placeholder="(613) 555-1234"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Preferred Contact Method</Label>
                    <RadioGroup
                      value={formData.preferredContact}
                      onValueChange={v =>
                        updateFormData('preferredContact', v as 'email' | 'phone' | 'either')
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="contact-email" />
                        <Label htmlFor="contact-email" className="font-normal">
                          Email
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="phone" id="contact-phone" />
                        <Label htmlFor="contact-phone" className="font-normal">
                          Phone
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="either" id="contact-either" />
                        <Label htmlFor="contact-either" className="font-normal">
                          Either
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bestTime">Best Time to Call</Label>
                    <Select
                      value={formData.bestTimeToCall}
                      onValueChange={v => updateFormData('bestTimeToCall', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                        <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Project Type *</Label>
                    <RadioGroup
                      value={formData.projectType}
                      onValueChange={v => updateFormData('projectType', v)}
                      className="grid grid-cols-1 gap-3 md:grid-cols-2"
                    >
                      {[
                        { value: 'new-install', label: 'New Installation' },
                        { value: 'replacement', label: 'Replacement' },
                        { value: 'upgrade', label: 'Upgrade Existing' },
                        { value: 'consultation', label: 'Consultation Only' },
                      ].map(opt => (
                        <Label
                          key={opt.value}
                          htmlFor={`project-${opt.value}`}
                          className={`flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors ${
                            formData.projectType === opt.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <RadioGroupItem value={opt.value} id={`project-${opt.value}`} />
                          <span>{opt.label}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label>Timeline *</Label>
                    <Select
                      value={formData.timeline}
                      onValueChange={v => updateFormData('timeline', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="When do you need this completed?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">As soon as possible</SelectItem>
                        <SelectItem value="1-2-weeks">Within 1-2 weeks</SelectItem>
                        <SelectItem value="1-month">Within a month</SelectItem>
                        <SelectItem value="3-months">Within 3 months</SelectItem>
                        <SelectItem value="browsing">Just browsing / no rush</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Budget Range</Label>
                    <Select
                      value={formData.budget}
                      onValueChange={v => updateFormData('budget', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your budget range (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-500">Under $500</SelectItem>
                        <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                        <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                        <SelectItem value="2000-5000">$2,000 - $5,000</SelectItem>
                        <SelectItem value="over-5000">Over $5,000</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Opening Details */}
              {step === 3 && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Add details for each door opening you need. You can add multiple openings.
                  </p>
                  {formData.openings.map((opening, index) => (
                    <Card key={opening.id} className="border-dashed">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Opening {index + 1}</CardTitle>
                          {formData.openings.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOpening(opening.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Location *</Label>
                          <Input
                            value={opening.location}
                            onChange={e => updateOpening(opening.id, 'location', e.target.value)}
                            placeholder="e.g., Master bedroom closet, Hallway closet"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Opening Width (inches) *</Label>
                            <Input
                              type="number"
                              value={opening.openingWidth}
                              onChange={e =>
                                updateOpening(opening.id, 'openingWidth', e.target.value)
                              }
                              placeholder="e.g., 60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Opening Height (inches) *</Label>
                            <Input
                              type="number"
                              value={opening.openingHeight}
                              onChange={e =>
                                updateOpening(opening.id, 'openingHeight', e.target.value)
                              }
                              placeholder="e.g., 80"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Current Door Type</Label>
                            <Select
                              value={opening.currentDoorType}
                              onValueChange={v => updateOpening(opening.id, 'currentDoorType', v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None / New Opening</SelectItem>
                                <SelectItem value="bifold">Bifold</SelectItem>
                                <SelectItem value="bypass">Bypass / Sliding</SelectItem>
                                <SelectItem value="swing">Swing Door</SelectItem>
                                <SelectItem value="curtain">Curtain</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Preferred Style</Label>
                            <Select
                              value={opening.preferredStyle}
                              onValueChange={v => updateOpening(opening.id, 'preferredStyle', v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="barn-door">Barn Door</SelectItem>
                                <SelectItem value="bifold">Bifold</SelectItem>
                                <SelectItem value="bypass">Bypass / Sliding</SelectItem>
                                <SelectItem value="pivot">Pivot</SelectItem>
                                <SelectItem value="unsure">Not Sure - Need Advice</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Preferred Finish</Label>
                          <Input
                            value={opening.preferredFinish}
                            onChange={e =>
                              updateOpening(opening.id, 'preferredFinish', e.target.value)
                            }
                            placeholder="e.g., White, Natural Wood, Black, Mirror"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            value={opening.notes}
                            onChange={e => updateOpening(opening.id, 'notes', e.target.value)}
                            placeholder="Any specific requirements or preferences..."
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={addOpening} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Opening
                  </Button>
                </div>
              )}

              {/* Step 4: Services */}
              {step === 4 && (
                <div className="space-y-6">
                  <p className="mb-4 text-sm text-muted-foreground">
                    Select the services you need. All prices will be included in your detailed
                    quote.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 rounded-lg border p-4">
                      <Checkbox
                        id="needsMeasurement"
                        checked={formData.needsMeasurement}
                        onCheckedChange={checked =>
                          updateFormData('needsMeasurement', checked === true)
                        }
                      />
                      <div>
                        <Label htmlFor="needsMeasurement" className="font-semibold">
                          Free In-Home Measurement
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Our expert will visit to take precise measurements
                        </p>
                        <span className="text-sm font-semibold text-green-600">FREE</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 rounded-lg border p-4">
                      <Checkbox
                        id="needsInstallation"
                        checked={formData.needsInstallation}
                        onCheckedChange={checked =>
                          updateFormData('needsInstallation', checked === true)
                        }
                      />
                      <div>
                        <Label htmlFor="needsInstallation" className="font-semibold">
                          Professional Installation
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Expert installation by certified technicians
                        </p>
                        <span className="text-sm text-muted-foreground">
                          Starting from $150 per door
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 rounded-lg border p-4">
                      <Checkbox
                        id="needsOldDoorRemoval"
                        checked={formData.needsOldDoorRemoval}
                        onCheckedChange={checked =>
                          updateFormData('needsOldDoorRemoval', checked === true)
                        }
                      />
                      <div>
                        <Label htmlFor="needsOldDoorRemoval" className="font-semibold">
                          Old Door Removal
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          We&apos;ll remove and dispose of your existing doors
                        </p>
                        <span className="text-sm text-muted-foreground">
                          Starting from $50 per door
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 rounded-lg border p-4">
                      <Checkbox
                        id="needsPainting"
                        checked={formData.needsPainting}
                        onCheckedChange={checked =>
                          updateFormData('needsPainting', checked === true)
                        }
                      />
                      <div>
                        <Label htmlFor="needsPainting" className="font-semibold">
                          Painting Service
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Custom color matching and painting
                        </p>
                        <span className="text-sm text-muted-foreground">
                          Starting from $100 per door
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Address */}
              {step === 5 && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    We need your address to schedule the free measurement and provide accurate
                    quotes.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={e => updateFormData('street', e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Select value={formData.city} onValueChange={v => updateFormData('city', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ottawa">Ottawa</SelectItem>
                          <SelectItem value="Kanata">Kanata</SelectItem>
                          <SelectItem value="Barrhaven">Barrhaven</SelectItem>
                          <SelectItem value="Orleans">Orleans</SelectItem>
                          <SelectItem value="Nepean">Nepean</SelectItem>
                          <SelectItem value="Gloucester">Gloucester</SelectItem>
                          <SelectItem value="Stittsville">Stittsville</SelectItem>
                          <SelectItem value="Manotick">Manotick</SelectItem>
                          <SelectItem value="Gatineau">Gatineau</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={e => updateFormData('postalCode', e.target.value.toUpperCase())}
                        placeholder="K1A 0A0"
                        maxLength={7}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="howHeard">How did you hear about us?</Label>
                    <Select
                      value={formData.howHeard}
                      onValueChange={v => updateFormData('howHeard', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Search</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="referral">Friend/Family Referral</SelectItem>
                        <SelectItem value="home-show">Home Show</SelectItem>
                        <SelectItem value="repeat">Previous Customer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={e => updateFormData('additionalNotes', e.target.value)}
                      placeholder="Any other information you'd like us to know..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="space-y-4 rounded-lg bg-muted p-4">
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-muted-foreground">Contact</h4>
                      <p>
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm">
                        {formData.email} | {formData.phone}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-muted-foreground">Project</h4>
                      <p>
                        {formData.projectType
                          ?.replace('-', ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}{' '}
                        |{' '}
                        {formData.timeline
                          ?.replace(/-/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
                        Openings ({formData.openings.length})
                      </h4>
                      {formData.openings.map((o, i) => (
                        <p key={o.id} className="text-sm">
                          {i + 1}. {o.location} - {o.openingWidth}&quot; x {o.openingHeight}&quot;
                          {o.preferredStyle && ` (${o.preferredStyle})`}
                        </p>
                      ))}
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-muted-foreground">Services</h4>
                      <p className="text-sm">
                        {[
                          formData.needsMeasurement && 'Measurement',
                          formData.needsInstallation && 'Installation',
                          formData.needsOldDoorRemoval && 'Door Removal',
                          formData.needsPainting && 'Painting',
                        ]
                          .filter(Boolean)
                          .join(', ') || 'None selected'}
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-1 text-sm font-semibold text-muted-foreground">Address</h4>
                      <p className="text-sm">
                        {formData.street}, {formData.city}, {formData.province}{' '}
                        {formData.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={checked => updateFormData('consent', checked === true)}
                      required
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm leading-relaxed text-muted-foreground"
                    >
                      I agree to be contacted by PG Closets regarding my quote request. I understand
                      that my information will be used solely for providing the requested quote and
                      scheduling services.
                    </Label>
                  </div>

                  {errorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <p className="text-sm text-red-800">{errorMessage}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {step < 6 ? (
                <Button onClick={() => setStep(s => s + 1)} disabled={!canProceed()}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => void handleSubmit()}
                  disabled={!canProceed() || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Quote Request
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Trust indicators */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <div className="flex flex-wrap justify-center gap-6">
              <span>100% Free Estimate</span>
              <span>No Obligation</span>
              <span>Response within 24h</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
