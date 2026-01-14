"use client"

import Link from "next/link"
import { useState } from "react"

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+1 (416) 555-0123",
    birthday: "1985-06-15",
    address: "123 Main Street",
    city: "Toronto",
    province: "ON",
    postal: "M5V 3A8",
    bio: "Home organization enthusiast with a passion for luxury closet systems."
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PG</span>
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">PG Closets</span>
                <p className="text-xs text-gray-500">Premium Home Organization</p>
              </div>
            </Link>

            <Link
              href="/account"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              ← Back to Account
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your personal information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile Picture
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-2">Click to upload a photo</p>
              <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Personal Information</h2>
              <p className="text-sm text-gray-500 mb-6">Update your personal details</p>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      defaultValue={formData.firstName}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      defaultValue={formData.lastName}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    defaultValue={formData.email}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    id="phone"
                    type="tel"
                    defaultValue={formData.phone}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    id="birthday"
                    type="date"
                    defaultValue={formData.birthday}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Address Information</h2>
              <p className="text-sm text-gray-500 mb-6">Your primary address</p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                  <input
                    id="address"
                    type="text"
                    defaultValue={formData.address}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      id="city"
                      type="text"
                      defaultValue={formData.city}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <input
                      id="province"
                      type="text"
                      defaultValue={formData.province}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="postal" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    <input
                      id="postal"
                      type="text"
                      defaultValue={formData.postal}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Preferences</h2>
              <p className="text-sm text-gray-500 mb-6">Communication and notification preferences</p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    id="bio"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    defaultValue={formData.bio}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500" />
                    <span className="text-sm text-gray-700">Receive email notifications about orders and promotions</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500" />
                    <span className="text-sm text-gray-700">Receive SMS notifications for order updates</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-slate-600 focus:ring-slate-500" />
                    <span className="text-sm text-gray-700">Subscribe to our newsletter for design tips and new products</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                Cancel
              </button>
              <button className="px-6 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
