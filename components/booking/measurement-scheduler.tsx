"use client"

import React, { useState } from 'react'
import { Calendar, Clock, MapPin, User, Phone, Mail, Home, FileText, CheckCircle, AlertCircle, Package } from 'lucide-react'
import { products } from '@/app/products/products-data'
import type { AvailabilityResponse, TimeSlot } from '@/types/api'

interface Room {
  roomType: string
  dimensions?: string
  notes?: string
}

interface FormData {
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  address: {
    street: string
    city: string
    province: string
    postalCode: string
  }
  booking: {
    preferredDate: string
    preferredTime: string
    projectDescription: string
    interestedProducts: string[]
    urgency: 'low' | 'medium' | 'high'
    rooms: Room[]
  }
  notes?: string
}

interface MeasurementSchedulerProps {
  onSuccess?: (confirmationNumber: string) => void
  className?: string
}

const ROOM_TYPES = [
  'Bedroom',
  'Closet',
  'Walk-in Closet',
  'Pantry',
  'Office',
  'Living Room',
  'Bathroom',
  'Hallway',
  'Other'
]

export default function MeasurementScheduler({ onSuccess, className = '' }: MeasurementSchedulerProps) {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loadingAvailability, setLoadingAvailability] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    customer: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    address: {
      street: '',
      city: '',
      province: 'ON',
      postalCode: ''
    },
    booking: {
      preferredDate: '',
      preferredTime: '',
      projectDescription: '',
      interestedProducts: [],
      urgency: 'medium',
      rooms: [{ roomType: '', dimensions: '', notes: '' }]
    },
    notes: ''
  })

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Get maximum date (90 days from now)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 90)
    return maxDate.toISOString().split('T')[0]
  }

  // Check if date is a weekday
  const isWeekday = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day >= 1 && day <= 5 // Monday to Friday
  }

  // Fetch available time slots for selected date
  const fetchAvailability = async (date: string) => {
    if (!date || !isWeekday(date)) {
      setAvailableSlots([])
      return
    }

    setLoadingAvailability(true)
    try {
      const response = await fetch(`/api/bookings/measurement?date=${date}`)
      const data: AvailabilityResponse = await response.json()

      if (data.success && data.data) {
        setAvailableSlots(data.data.slots)
      } else {
        setAvailableSlots([])
        setError('Failed to load available time slots')
      }
    } catch (err) {
      setAvailableSlots([])
      setError('Failed to check availability')
    }
    setLoadingAvailability(false)
  }

  // Handle date change
  const handleDateChange = (date: string) => {
    setFormData(prev => ({
      ...prev,
      booking: {
        ...prev.booking,
        preferredDate: date,
        preferredTime: '' // Reset time when date changes
      }
    }))

    if (date) {
      fetchAvailability(date)
    }
  }

  // Add room
  const addRoom = () => {
    setFormData(prev => ({
      ...prev,
      booking: {
        ...prev.booking,
        rooms: [...prev.booking.rooms, { roomType: '', dimensions: '', notes: '' }]
      }
    }))
  }

  // Remove room
  const removeRoom = (index: number) => {
    setFormData(prev => ({
      ...prev,
      booking: {
        ...prev.booking,
        rooms: prev.booking.rooms.filter((_, i) => i !== index)
      }
    }))
  }

  // Update room
  const updateRoom = (index: number, field: keyof Room, value: string) => {
    setFormData(prev => ({
      ...prev,
      booking: {
        ...prev.booking,
        rooms: prev.booking.rooms.map((room, i) =>
          i === index ? { ...room, [field]: value } : room
        )
      }
    }))
  }

  // Toggle product selection
  const toggleProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      booking: {
        ...prev.booking,
        interestedProducts: prev.booking.interestedProducts.includes(productId)
          ? prev.booking.interestedProducts.filter(id => id !== productId)
          : [...prev.booking.interestedProducts, productId]
      }
    }))
  }

  // Validate current step
  const validateStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return formData.customer.firstName &&
               formData.customer.lastName &&
               formData.customer.email &&
               formData.customer.phone &&
               formData.address.street &&
               formData.address.city &&
               formData.address.postalCode
      case 2:
        return formData.booking.preferredDate &&
               formData.booking.preferredTime &&
               formData.booking.projectDescription.length >= 10 &&
               formData.booking.interestedProducts.length > 0 &&
               formData.booking.rooms.every(room => room.roomType)
      case 3:
        return true // Confirmation step
      default:
        return false
    }
  }

  // Submit booking
  const submitBooking = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/bookings/measurement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success && data.data) {
        setSuccess(data.data.confirmationNumber)
        onSuccess?.(data.data.confirmationNumber)
      } else {
        setError(data.error || 'Failed to book appointment')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }

    setIsLoading(false)
  }

  // Format time for display
  const formatTime = (time: string) => {
    const [hour] = time.split(':')
    const hourNum = parseInt(hour)
    return hourNum <= 12 ? `${hourNum}:00 AM` : `${hourNum - 12}:00 PM`
  }

  if (success) {
    return (
      <div className={`max-w-2xl mx-auto p-8 ${className}`}>
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
          <h2 className="text-3xl font-bold text-gray-900">Booking Confirmed!</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <p className="text-lg font-medium text-green-800 mb-2">
              Confirmation Number: {success}
            </p>
            <p className="text-green-700">
              You'll receive a confirmation email shortly with all the details.
              Our team will contact you within 24 hours to confirm your appointment.
            </p>
          </div>
          <div className="space-y-4 text-left">
            <h3 className="font-semibold text-gray-900">What happens next?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                Email confirmation with appointment details
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                Our team will call to confirm within 24 hours
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                Professional measurement at your scheduled time
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                Detailed quote and recommendations
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {stepNumber}
              </div>
              <div className="ml-3 text-sm">
                {stepNumber === 1 && 'Contact Info'}
                {stepNumber === 2 && 'Booking Details'}
                {stepNumber === 3 && 'Confirmation'}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-4 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Step 1: Contact Information */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                First Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={formData.customer.firstName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, firstName: e.target.value }
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Last Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={formData.customer.lastName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, lastName: e.target.value }
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={formData.customer.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, email: e.target.value }
                }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="Optional contact number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={formData.customer.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  customer: { ...prev.customer, phone: e.target.value }
                }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              <MapPin className="w-5 h-5 inline mr-2" />
              Service Address
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={formData.address.street}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={formData.address.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value }
                  }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={formData.address.province}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, province: e.target.value }
                  }))}
                >
                  <option value="ON">Ontario</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="K1A 0A6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  value={formData.address.postalCode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, postalCode: e.target.value }
                  }))}
                />
              </div>
            </div>

            <p className="text-sm text-gray-600">
              We currently provide free measurement services in the Ottawa area (postal codes starting with K).
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!validateStep(1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Continue to Booking Details
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Booking Details */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>

          {/* Date and Time Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Date *
              </label>
              <input
                type="date"
                required
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                value={formData.booking.preferredDate}
                onChange={(e) => handleDateChange(e.target.value)}
              />
              <p className="text-sm text-gray-600 mt-1">
                Appointments available Monday to Friday only
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Preferred Time *
              </label>
              {loadingAvailability ? (
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  Loading available times...
                </div>
              ) : (
                <select
                  required
                  disabled={!formData.booking.preferredDate || !isWeekday(formData.booking.preferredDate)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-50"
                  value={formData.booking.preferredTime}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    booking: { ...prev.booking, preferredTime: e.target.value }
                  }))}
                >
                  <option value="">Select a time</option>
                  {availableSlots.map((slot) => (
                    <option
                      key={slot.time}
                      value={slot.time}
                      disabled={!slot.available}
                    >
                      {formatTime(slot.time)} {!slot.available && '(Unavailable)'}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Appointments available 9:00 AM to 4:00 PM
              </p>
            </div>
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-2" />
              Project Description *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Please describe your project, what you're looking to achieve, and any specific requirements..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={formData.booking.projectDescription}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                booking: { ...prev.booking, projectDescription: e.target.value }
              }))}
            />
            <p className="text-sm text-gray-600 mt-1">
              Minimum 10 characters. {formData.booking.projectDescription.length}/1000
            </p>
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Interested Products * (Select all that apply)
            </label>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {products.map((product) => (
                <label key={product.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.booking.interestedProducts.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-sm text-gray-700">{product.name}</span>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {formData.booking.interestedProducts.length} product(s) selected
            </p>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="w-4 h-4 inline mr-2" />
              Rooms to be Measured *
            </label>
            {formData.booking.rooms.map((room, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      value={room.roomType}
                      onChange={(e) => updateRoom(index, 'roomType', e.target.value)}
                    >
                      <option value="">Select room type</option>
                      {ROOM_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Approximate Dimensions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 10x12 feet"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      value={room.dimensions || ''}
                      onChange={(e) => updateRoom(index, 'dimensions', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <input
                      type="text"
                      placeholder="Any specific notes"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      value={room.notes || ''}
                      onChange={(e) => updateRoom(index, 'notes', e.target.value)}
                    />
                  </div>
                </div>

                {formData.booking.rooms.length > 1 && (
                  <button
                    onClick={() => removeRoom(index)}
                    className="mt-2 text-red-600 hover:text-red-700 text-sm"
                  >
                    Remove Room
                  </button>
                )}
              </div>
            ))}

            {formData.booking.rooms.length < 5 && (
              <button
                onClick={addRoom}
                className="mb-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Add Another Room
              </button>
            )}
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Urgency
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'low', label: 'Low - Flexible timing' },
                { value: 'medium', label: 'Medium - Within 2-3 weeks' },
                { value: 'high', label: 'High - ASAP' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="urgency"
                    value={value}
                    checked={formData.booking.urgency === value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      booking: { ...prev.booking, urgency: e.target.value as 'low' | 'medium' | 'high' }
                    }))}
                    className="text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Any additional information or special requests..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }))}
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!validateStep(2)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Review Booking
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Booking</h2>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <p>{formData.customer.firstName} {formData.customer.lastName}</p>
              <p>{formData.customer.email}</p>
              <p>{formData.customer.phone}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Address</h3>
              <p>{formData.address.street}</p>
              <p>{formData.address.city}, {formData.address.province} {formData.address.postalCode}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Appointment Details</h3>
              <p><strong>Date:</strong> {new Date(formData.booking.preferredDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {formatTime(formData.booking.preferredTime)}</p>
              <p><strong>Estimated Duration:</strong> 2 hours</p>
              <p><strong>Urgency:</strong> {formData.booking.urgency}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Project Description</h3>
              <p className="text-gray-700">{formData.booking.projectDescription}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Interested Products ({formData.booking.interestedProducts.length})</h3>
              <ul className="text-gray-700 list-disc list-inside">
                {formData.booking.interestedProducts.map(productId => {
                  const product = products.find(p => p.id === productId)
                  return product ? <li key={productId}>{product.name}</li> : null
                })}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Rooms to Measure ({formData.booking.rooms.length})</h3>
              <ul className="text-gray-700 space-y-1">
                {formData.booking.rooms.map((room, index) => (
                  <li key={index}>
                    <strong>{room.roomType}</strong>
                    {room.dimensions && ` - ${room.dimensions}`}
                    {room.notes && ` (${room.notes})`}
                  </li>
                ))}
              </ul>
            </div>

            {formData.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                <p className="text-gray-700">{formData.notes}</p>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">What to Expect</h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Our professional measurement specialist will arrive on time</li>
              <li>• Free consultation and precise measurements</li>
              <li>• Discussion of your project requirements and recommendations</li>
              <li>• Detailed quote provided within 24-48 hours</li>
              <li>• No obligation - completely free service</li>
            </ul>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setStep(2)}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Back to Edit
            </button>
            <button
              onClick={submitBooking}
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}