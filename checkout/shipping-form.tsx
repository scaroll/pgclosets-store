"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  province: string
  postalCode: string
  installationRequested: boolean
  specialInstructions: string
}

interface ShippingFormProps {
  initialData: ShippingInfo
  onSubmit: (data: ShippingInfo) => void
}

const CANADIAN_PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "SK", name: "Saskatchewan" },
  { code: "MB", name: "Manitoba" },
  { code: "NB", name: "New Brunswick" },
  { code: "NS", name: "Nova Scotia" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
  { code: "YT", name: "Yukon" },
]

export function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState<ShippingInfo>(initialData)
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required"
    else if (!/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(formData.postalCode))
      newErrors.postalCode = "Invalid Canadian postal code"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: keyof ShippingInfo, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="card-apple p-8">
      <h2 className="text-h2 mb-6">Shipping Information</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-pg-dark mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky ${
                errors.firstName ? "border-red-500" : "border-pg-border"
              }`}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-pg-dark mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky ${
                errors.lastName ? "border-red-500" : "border-pg-border"
              }`}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-pg-dark mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky ${
                errors.email ? "border-red-500" : "border-pg-border"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-pg-dark mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky ${
                errors.phone ? "border-red-500" : "border-pg-border"
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-pg-dark mb-2">
            Street Address *
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky ${
              errors.address ? "border-red-500" : "border-pg-border"
            }`}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-pg-dark mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky ${
                errors.city ? "border-red-500" : "border-pg-border"
              }`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium text-pg-dark mb-2">
              Province *
            </label>
            <select
              id="province"
              value={formData.province}
              onChange={(e) => handleChange("province", e.target.value)}
              className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
            >
              {CANADIAN_PROVINCES.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-pg-dark mb-2">
              Postal Code *
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleChange("postalCode", e.target.value.toUpperCase())}
              placeholder="K1A 0A6"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky ${
                errors.postalCode ? "border-red-500" : "border-pg-border"
              }`}
            />
            {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="installation"
              checked={formData.installationRequested}
              onChange={(e) => handleChange("installationRequested", e.target.checked)}
              className="mt-1"
            />
            <div>
              <label htmlFor="installation" className="block text-sm font-medium text-pg-dark">
                Professional Installation (+$150 CAD)
              </label>
              <p className="text-sm text-pg-gray mt-1">
                Our certified technicians will install your closet doors with a lifetime warranty
              </p>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="specialInstructions" className="block text-sm font-medium text-pg-dark mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            id="specialInstructions"
            value={formData.specialInstructions}
            onChange={(e) => handleChange("specialInstructions", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-pg-border rounded-lg focus:outline-none focus:ring-2 focus:ring-pg-sky"
            placeholder="Any special delivery or installation instructions..."
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  )
}
