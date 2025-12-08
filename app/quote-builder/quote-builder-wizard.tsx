'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Palette,
  User,
  MapPin,
  FileText,
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  AlertCircle
} from 'lucide-react'
import { useQuoteBuilder } from '@/stores/quote-builder-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { DoorType, OpeningType } from '@/types/quote'

// Step configuration
const STEPS = [
  { id: 1, title: 'Rooms', icon: Home, description: 'Configure your openings' },
  { id: 2, title: 'Finishes', icon: Palette, description: 'Select materials & hardware' },
  { id: 3, title: 'Contact', icon: User, description: 'Your information' },
  { id: 4, title: 'Property', icon: MapPin, description: 'Installation address' },
  { id: 5, title: 'Review', icon: FileText, description: 'Review & submit' },
]

const DOOR_TYPES: { value: DoorType; label: string }[] = [
  { value: 'bypass', label: 'Bypass Sliding' },
  { value: 'sliding', label: 'Single Sliding' },
  { value: 'bifold', label: 'Bifold' },
  { value: 'barn', label: 'Barn Door' },
  { value: 'pivot', label: 'Pivot' },
  { value: 'mirror', label: 'Mirrored' },
]

const OPENING_TYPES: { value: OpeningType; label: string }[] = [
  { value: 'closet', label: 'Closet' },
  { value: 'room-divider', label: 'Room Divider' },
  { value: 'pantry', label: 'Pantry' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'other', label: 'Other' },
]

const SERIES_OPTIONS = [
  { value: 'essence', label: 'Essence Series' },
  { value: 'urban', label: 'Urban Series' },
  { value: 'modern', label: 'Modern Series' },
  { value: 'classic', label: 'Classic Series' },
  { value: 'premium', label: 'Premium Series' },
]

const FINISH_OPTIONS = [
  { value: 'white', label: 'White' },
  { value: 'black', label: 'Black' },
  { value: 'grey', label: 'Grey' },
  { value: 'oak', label: 'Natural Oak' },
  { value: 'walnut', label: 'Walnut' },
  { value: 'espresso', label: 'Espresso' },
]

const HARDWARE_OPTIONS = [
  { value: 'standard', label: 'Standard Track' },
  { value: 'soft-close', label: 'Soft Close Track' },
  { value: 'barn-hardware', label: 'Barn Door Hardware' },
  { value: 'concealed', label: 'Concealed Track' },
]

const HANDLE_OPTIONS = [
  { value: 'none', label: 'No Handles' },
  { value: 'recessed', label: 'Recessed Pull' },
  { value: 'bar', label: 'Bar Handle' },
  { value: 'knob', label: 'Round Knob' },
]

export function QuoteBuilderWizard() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    step,
    rooms,
    customer,
    property,
    notes,
    preferredDate,
    preferredTime,
    subtotal,
    tax,
    total,
    setStep,
    nextStep,
    prevStep,
    addRoom,
    removeRoom,
    updateRoom,
    duplicateRoom,
    addDoor,
    removeDoor,
    updateDoor,
    setCustomer,
    setProperty,
    setNotes,
    setPreferredDate,
    setPreferredTime,
    isStepValid,
    getValidationErrors,
    resetQuote
  } = useQuoteBuilder()

  const errors = getValidationErrors(step)

  const handleSubmit = async () => {
    if (!isStepValid(5)) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer,
          property,
          configurations: rooms,
          notes,
          preferredMeasurementDate: preferredDate,
          preferredMeasurementTime: preferredTime
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote')
      }

      // Success - redirect to confirmation
      resetQuote()
      router.push(`/quote-builder/success?quoteNumber=${data.quoteNumber}`)

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Build Your Quote</h1>
        <p className="text-muted-foreground">
          Configure your custom closet doors in a few easy steps
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {STEPS.map((s, index) => {
            const Icon = s.icon
            const isActive = step === s.id
            const isComplete = step > s.id

            return (
              <div key={s.id} className="flex-1 relative">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => isComplete && setStep(s.id)}
                    disabled={!isComplete && !isActive}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center transition-all
                      ${isActive ? 'bg-primary text-primary-foreground' : ''}
                      ${isComplete ? 'bg-green-500 text-white cursor-pointer' : ''}
                      ${!isActive && !isComplete ? 'bg-muted text-muted-foreground' : ''}
                    `}
                  >
                    {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </button>
                  <span className={`
                    mt-2 text-xs font-medium hidden sm:block
                    ${isActive ? 'text-primary' : 'text-muted-foreground'}
                  `}>
                    {s.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`
                    absolute top-5 left-1/2 w-full h-0.5
                    ${step > s.id ? 'bg-green-500' : 'bg-muted'}
                  `} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{STEPS[step - 1].title}</CardTitle>
          <CardDescription>{STEPS[step - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && (
                <Step1Rooms
                  rooms={rooms}
                  addRoom={addRoom}
                  removeRoom={removeRoom}
                  updateRoom={updateRoom}
                  duplicateRoom={duplicateRoom}
                  addDoor={addDoor}
                  removeDoor={removeDoor}
                  updateDoor={updateDoor}
                />
              )}
              {step === 2 && (
                <Step2Finishes
                  rooms={rooms}
                  updateDoor={updateDoor}
                />
              )}
              {step === 3 && (
                <Step3Contact
                  customer={customer}
                  setCustomer={setCustomer}
                />
              )}
              {step === 4 && (
                <Step4Property
                  property={property}
                  setProperty={setProperty}
                  preferredDate={preferredDate}
                  preferredTime={preferredTime}
                  setPreferredDate={setPreferredDate}
                  setPreferredTime={setPreferredTime}
                />
              )}
              {step === 5 && (
                <Step5Review
                  rooms={rooms}
                  customer={customer}
                  property={property}
                  notes={notes}
                  setNotes={setNotes}
                  subtotal={subtotal}
                  tax={tax}
                  total={total}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.slice(0, 3).map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                  {errors.length > 3 && (
                    <li>...and {errors.length - 3} more</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {submitError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Estimated Total: <span className="font-semibold text-foreground">${total.toLocaleString()}</span>
          </p>
        </div>

        {step < 5 ? (
          <Button onClick={nextStep} disabled={!isStepValid(step)}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isStepValid(5) || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
          </Button>
        )}
      </div>
    </div>
  )
}

// Step 1: Room Configuration
function Step1Rooms({ rooms, addRoom, removeRoom, updateRoom, duplicateRoom, addDoor, removeDoor, updateDoor }: any) {
  return (
    <div className="space-y-6">
      {rooms.map((room: any, roomIndex: number) => (
        <Card key={room.id} className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{roomIndex + 1}</Badge>
                <Input
                  value={room.roomName}
                  onChange={(e) => updateRoom(room.id, { roomName: e.target.value })}
                  className="w-48 font-medium"
                  placeholder="Room name"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => duplicateRoom(room.id)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                {rooms.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRoom(room.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Opening Type</Label>
                <Select
                  value={room.openingType}
                  onValueChange={(value) => updateRoom(room.id, { openingType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPENING_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Doors */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Door Configurations</h4>
                <Button variant="outline" size="sm" onClick={() => addDoor(room.id)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Door
                </Button>
              </div>

              {room.doors.map((door: any, doorIndex: number) => (
                <div key={door.id} className="p-4 bg-muted/50 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Door {doorIndex + 1}</span>
                    {room.doors.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDoor(room.id, door.id)}
                        className="text-destructive h-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Series</Label>
                      <Select
                        value={door.series}
                        onValueChange={(value) => updateDoor(room.id, door.id, { series: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERIES_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Door Type</Label>
                      <Select
                        value={door.doorType}
                        onValueChange={(value) => updateDoor(room.id, door.id, { doorType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DOOR_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Width (inches)</Label>
                      <Input
                        type="number"
                        value={door.widthInches}
                        onChange={(e) => updateDoor(room.id, door.id, { widthInches: parseFloat(e.target.value) || 0 })}
                        min={24}
                        max={192}
                      />
                    </div>

                    <div>
                      <Label>Height (inches)</Label>
                      <Input
                        type="number"
                        value={door.heightInches}
                        onChange={(e) => updateDoor(room.id, door.id, { heightInches: parseFloat(e.target.value) || 0 })}
                        min={60}
                        max={120}
                      />
                    </div>

                    <div>
                      <Label>Panel Count</Label>
                      <Select
                        value={door.panelCount.toString()}
                        onValueChange={(value) => updateDoor(room.id, door.id, { panelCount: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[2, 3, 4, 5, 6].map((n) => (
                            <SelectItem key={n} value={n.toString()}>
                              {n} Panels
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={door.quantity}
                        onChange={(e) => updateDoor(room.id, door.id, { quantity: parseInt(e.target.value) || 1 })}
                        min={1}
                        max={10}
                      />
                    </div>
                  </div>

                  {door.unitPrice > 0 && (
                    <div className="text-right text-sm">
                      <span className="text-muted-foreground">Estimated: </span>
                      <span className="font-semibold">${door.lineTotal.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={() => addRoom()} className="w-full">
        <Plus className="w-4 h-4 mr-2" /> Add Another Room
      </Button>
    </div>
  )
}

// Step 2: Finishes & Hardware
function Step2Finishes({ rooms, updateDoor }: any) {
  return (
    <div className="space-y-6">
      {rooms.map((room: any, roomIndex: number) => (
        <Card key={room.id}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{room.roomName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {room.doors.map((door: any, doorIndex: number) => (
              <div key={door.id} className="p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Door {doorIndex + 1}</span>
                  <Badge variant="secondary">
                    {door.widthInches}" x {door.heightInches}" - {DOOR_TYPES.find(t => t.value === door.doorType)?.label}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Finish</Label>
                    <Select
                      value={door.finish}
                      onValueChange={(value) => updateDoor(room.id, door.id, { finish: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select finish" />
                      </SelectTrigger>
                      <SelectContent>
                        {FINISH_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Hardware</Label>
                    <Select
                      value={door.hardware}
                      onValueChange={(value) => updateDoor(room.id, door.id, { hardware: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select hardware" />
                      </SelectTrigger>
                      <SelectContent>
                        {HARDWARE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Handles</Label>
                    <Select
                      value={door.handles}
                      onValueChange={(value) => updateDoor(room.id, door.id, { handles: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select handles" />
                      </SelectTrigger>
                      <SelectContent>
                        {HANDLE_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={door.softClose}
                      onCheckedChange={(checked) => updateDoor(room.id, door.id, { softClose: checked })}
                    />
                    <Label>Soft Close (+$75/panel)</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={door.mirror}
                      onCheckedChange={(checked) => updateDoor(room.id, door.id, { mirror: checked })}
                    />
                    <Label>Mirror Insert</Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Step 3: Contact Information
function Step3Contact({ customer, setCustomer }: any) {
  const handleChange = (field: string, value: string) => {
    setCustomer({ ...customer, [field]: value })
  }

  return (
    <div className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={customer?.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="John Smith"
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={customer?.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={customer?.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="(613) 555-0123"
        />
      </div>

      <div>
        <Label>Preferred Contact Method</Label>
        <Select
          value={customer?.preferredContact || 'email'}
          onValueChange={(value) => handleChange('preferredContact', value)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

// Step 4: Property Information
function Step4Property({ property, setProperty, preferredDate, preferredTime, setPreferredDate, setPreferredTime }: any) {
  const handleAddressChange = (field: string, value: string) => {
    setProperty({
      ...property,
      address: { ...property?.address, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Installation Address</h3>

        <div>
          <Label htmlFor="line1">Street Address *</Label>
          <Input
            id="line1"
            value={property?.address?.line1 || ''}
            onChange={(e) => handleAddressChange('line1', e.target.value)}
            placeholder="123 Main Street"
          />
        </div>

        <div>
          <Label htmlFor="line2">Unit/Apt (optional)</Label>
          <Input
            id="line2"
            value={property?.address?.line2 || ''}
            onChange={(e) => handleAddressChange('line2', e.target.value)}
            placeholder="Unit 4B"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={property?.address?.city || ''}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="Ottawa"
            />
          </div>

          <div>
            <Label htmlFor="province">Province *</Label>
            <Select
              value={property?.address?.province || ''}
              onValueChange={(value) => handleAddressChange('province', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ON">Ontario</SelectItem>
                <SelectItem value="QC">Quebec</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode">Postal Code *</Label>
            <Input
              id="postalCode"
              value={property?.address?.postalCode || ''}
              onChange={(e) => handleAddressChange('postalCode', e.target.value.toUpperCase())}
              placeholder="K1A 0A1"
            />
          </div>

          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Select
              value={property?.propertyType || ''}
              onValueChange={(value) => setProperty({ ...property, propertyType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="condo">Condo</SelectItem>
                <SelectItem value="townhouse">Townhouse</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Preferred Measurement Time (Optional)</h3>
        <p className="text-sm text-muted-foreground">
          Let us know when you&apos;re available and we&apos;ll try to accommodate
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input
              id="preferredDate"
              type="date"
              value={preferredDate || ''}
              onChange={(e) => setPreferredDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <Select
              value={preferredTime || ''}
              onValueChange={setPreferredTime}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (9am - 12pm)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 5: Review
function Step5Review({ rooms, customer, property, notes, setNotes, subtotal, tax, total }: any) {
  return (
    <div className="space-y-6">
      {/* Configuration Summary */}
      <div>
        <h3 className="font-medium mb-3">Configuration Summary</h3>
        {rooms.map((room: any, i: number) => (
          <Card key={room.id} className="mb-3">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">{room.roomName}</span>
                  <span className="text-muted-foreground ml-2">
                    ({OPENING_TYPES.find(t => t.value === room.openingType)?.label})
                  </span>
                </div>
              </div>
              {room.doors.map((door: any, j: number) => (
                <div key={door.id} className="text-sm pl-4 py-1 border-l-2 border-muted ml-2">
                  <div className="flex justify-between">
                    <span>
                      {door.widthInches}&quot; x {door.heightInches}&quot; {DOOR_TYPES.find(t => t.value === door.doorType)?.label}
                      {door.quantity > 1 && ` (x${door.quantity})`}
                    </span>
                    <span className="font-medium">${door.lineTotal.toLocaleString()}</span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {FINISH_OPTIONS.find(f => f.value === door.finish)?.label} •
                    {HARDWARE_OPTIONS.find(h => h.value === door.hardware)?.label}
                    {door.softClose && ' • Soft Close'}
                    {door.mirror && ' • Mirror'}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact & Property */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{customer?.name}</p>
            <p>{customer?.email}</p>
            <p>{customer?.phone}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Installation Address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{property?.address?.line1}</p>
            {property?.address?.line2 && <p>{property?.address?.line2}</p>}
            <p>{property?.address?.city}, {property?.address?.province} {property?.address?.postalCode}</p>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <div>
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requirements or questions..."
          rows={3}
        />
      </div>

      {/* Pricing Summary */}
      <Card className="bg-primary/5">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>HST (13%)</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Estimated Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * This is an estimate only. Final pricing will be confirmed after measurement.
            Installation fees may apply based on your location.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
