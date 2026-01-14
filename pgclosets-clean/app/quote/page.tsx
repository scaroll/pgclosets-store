'use client'

import { useState } from 'react'

export default function QuotePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    projectType: '',
    roomType: '',
    doorSize: '',
    doorFinish: '',
    hardware: '',
    installation: '',
    timeline: '',
    budget: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    alert('Thank you! Your quote request has been submitted. We\'ll contact you within 24 hours with a detailed estimate.')

    // Reset form
    setFormData({
      projectType: '',
      roomType: '',
      doorSize: '',
      doorFinish: '',
      hardware: '',
      installation: '',
      timeline: '',
      budget: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      message: ''
    })
    setStep(1)
  }

  return (
    <div className="container-apple section-apple">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 mb-6">Get Your Free Quote</h1>
          <p className="text-body-l text-pg-gray max-w-2xl mx-auto">
            Tell us about your project and we'll provide you with a detailed, customized quote within 24 hours.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-body-s text-pg-gray">Step {step} of 3</span>
            <span className="text-body-s text-pg-gray">{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-pg-navy h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="card-apple p-8">
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div>
              <h2 className="text-h2 mb-6">Project Details</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-body-m font-semibold text-pg-dark mb-3">
                    What type of door are you interested in? *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { value: 'barn-doors', label: 'Barn Doors', description: 'Sliding doors that hang from a track' },
                      { value: 'bypass-doors', label: 'Bypass Doors', description: 'Sliding doors that pass by each other' },
                      { value: 'bifold-doors', label: 'Bifold Doors', description: 'Folding doors with hinged panels' },
                      { value: 'pivot-doors', label: 'Pivot Doors', description: 'Doors that pivot on a central axis' }
                    ].map((type) => (
                      <label key={type.value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="projectType"
                          value={type.value}
                          checked={formData.projectType === type.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border rounded-lg transition-all ${
                          formData.projectType === type.value
                            ? 'border-pg-navy bg-blue-50'
                            : 'border-pg-border hover:border-pg-sky'
                        }`}>
                          <h3 className="font-semibold text-pg-dark">{type.label}</h3>
                          <p className="text-body-s text-pg-gray">{type.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="roomType" className="block text-body-m font-semibold text-pg-dark mb-2">
                    What room is this for? *
                  </label>
                  <select
                    id="roomType"
                    name="roomType"
                    required
                    value={formData.roomType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                  >
                    <option value="">Select room type</option>
                    <option value="bedroom">Bedroom Closet</option>
                    <option value="walk-in">Walk-in Closet</option>
                    <option value="pantry">Pantry</option>
                    <option value="laundry">Laundry Room</option>
                    <option value="office">Home Office</option>
                    <option value="basement">Basement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="doorSize" className="block text-body-m font-semibold text-pg-dark mb-2">
                    Approximate door size needed
                  </label>
                  <input
                    type="text"
                    id="doorSize"
                    name="doorSize"
                    value={formData.doorSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                    placeholder="e.g., 36 x 84, 72 x 80, or describe opening"
                  />
                  <p className="text-body-s text-pg-gray mt-1">
                    Don't worry if you're not sure - we'll measure during our consultation
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={nextStep}
                  disabled={!formData.projectType || !formData.roomType}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Style & Features */}
          {step === 2 && (
            <div>
              <h2 className="text-h2 mb-6">Style & Features</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="doorFinish" className="block text-body-m font-semibold text-pg-dark mb-2">
                    Preferred finish/style
                  </label>
                  <select
                    id="doorFinish"
                    name="doorFinish"
                    value={formData.doorFinish}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                  >
                    <option value="">Select finish preference</option>
                    <option value="natural-wood">Natural Wood</option>
                    <option value="stained-walnut">Stained Walnut</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                    <option value="glass-panels">Glass Panels</option>
                    <option value="metal-accents">Metal Accents</option>
                    <option value="custom">Custom Finish</option>
                    <option value="unsure">Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="hardware" className="block text-body-m font-semibold text-pg-dark mb-2">
                    Hardware preference
                  </label>
                  <select
                    id="hardware"
                    name="hardware"
                    value={formData.hardware}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                  >
                    <option value="">Select hardware type</option>
                    <option value="standard">Standard Track System</option>
                    <option value="soft-close">Soft-Close System</option>
                    <option value="premium">Premium InvisiGlide</option>
                    <option value="custom">Custom Hardware</option>
                    <option value="unsure">Show me options</option>
                  </select>
                </div>

                <div>
                  <label className="block text-body-m font-semibold text-pg-dark mb-3">
                    Do you need installation? *
                  </label>
                  <div className="space-y-3">
                    {[
                      { value: 'yes', label: 'Yes, please install', description: 'Professional installation included' },
                      { value: 'no', label: 'No, door only', description: 'I\'ll install myself or use my own contractor' },
                      { value: 'unsure', label: 'Not sure', description: 'Tell me about installation options' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="installation"
                          value={option.value}
                          checked={formData.installation === option.value}
                          onChange={handleChange}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium text-pg-dark">{option.label}</div>
                          <div className="text-body-s text-pg-gray">{option.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-body-m font-semibold text-pg-dark mb-2">
                    Project timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">As soon as possible</option>
                    <option value="1-2-weeks">1-2 weeks</option>
                    <option value="1-month">Within 1 month</option>
                    <option value="2-3-months">2-3 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-body-m font-semibold text-pg-dark mb-2">
                    Budget range (optional)
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                  >
                    <option value="">Select budget range</option>
                    <option value="under-500">Under $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-2000">$1,000 - $2,000</option>
                    <option value="2000-3000">$2,000 - $3,000</option>
                    <option value="over-3000">Over $3,000</option>
                    <option value="unsure">Not sure</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={prevStep} className="btn-secondary">
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.installation}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Contact Information */}
          {step === 3 && (
            <div>
              <h2 className="text-h2 mb-6">Contact Information</h2>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-body-m font-semibold text-pg-dark mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-body-m font-semibold text-pg-dark mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-body-m font-semibold text-pg-dark mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                        placeholder="(613) 555-0123"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-body-m font-semibold text-pg-dark mb-2">
                        Project Address/City
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent"
                        placeholder="Ottawa, Kanata, Orleans, etc."
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-body-m font-semibold text-pg-dark mb-2">
                      Additional Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-pg-border rounded-lg focus:ring-2 focus:ring-pg-sky focus:border-transparent resize-vertical"
                      placeholder="Any additional details about your project, special requirements, or questions..."
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <button type="button" onClick={prevStep} className="btn-secondary">
                    Previous
                  </button>
                  <button type="submit" className="btn-primary">
                    Submit Quote Request
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* What Happens Next */}
        <div className="mt-16">
          <div className="card-apple p-8">
            <h2 className="text-h2 text-center mb-8">What Happens Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-pg-sky rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-body-l font-semibold mb-2">We Review</h3>
                <p className="text-body-s text-pg-gray">
                  Our team reviews your project details and requirements
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pg-sky rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-body-l font-semibold mb-2">We Call</h3>
                <p className="text-body-s text-pg-gray">
                  We contact you within 24 hours to discuss details
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pg-sky rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-body-l font-semibold mb-2">We Quote</h3>
                <p className="text-body-s text-pg-gray">
                  Receive a detailed, customized quote for your project
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-pg-sky rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="text-body-l font-semibold mb-2">We Build</h3>
                <p className="text-body-s text-pg-gray">
                  Schedule consultation and begin your custom project
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Metadata is exported in the layout.tsx for this page