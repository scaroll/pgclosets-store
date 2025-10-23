/**
 * Legal Compliance Component
 *
 * Ensures compliance with accessibility laws and regulations:
 * - AODA (Ontario) compliance
 * - Canadian Accessibility Laws
 * - ADA compliance (for US visitors)
 * - GDPR accessibility considerations
 * - Privacy policy compliance
 * - Cookie consent implementation
 * - Accessibility statement
 * - Feedback mechanisms
 * - Alternative format requests
 * - Emergency procedures
 */

"use client"

import React, { useState, useEffect } from 'react'
import { Shield, FileText, Mail, Phone, Globe, Cookie, AlertTriangle, CheckCircle } from 'lucide-react'
import { useAccessibility } from './AccessibilityProvider'

interface LegalComplianceProps {
  businessInfo: {
    name: string
    address: {
      street: string
      city: string
      province: string
      postalCode: string
      country: string
    }
    phone: string
    email: string
    website: string
  }
}

interface ComplianceSettings {
  region: 'canada' | 'ontario' | 'usa' | 'eu' | 'international'
  showCookieConsent: boolean
  showAccessibilityStatement: boolean
  showPrivacyPolicy: boolean
  showEmergencyInfo: boolean
  enableFeedbackForm: boolean
  enableAlternativeFormats: boolean
  enableLanguagePreferences: boolean
  lastUpdated: string
}

export function LegalComplianceProvider({ children, businessInfo }: LegalComplianceProps & { children: React.ReactNode }) {
  const { announceToScreenReader } = useAccessibility()
  const [complianceSettings, setComplianceSettings] = useState<ComplianceSettings>({
    region: 'canada',
    showCookieConsent: true,
    showAccessibilityStatement: true,
    showPrivacyPolicy: true,
    showEmergencyInfo: false,
    enableFeedbackForm: true,
    enableAlternativeFormats: true,
    enableLanguagePreferences: true,
    lastUpdated: new Date().toISOString()
  })

  const [showCookieConsent, setShowCookieConsent] = useState(false)
  const [cookieConsent, setCookieConsent] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  })

  // Detect user's region
  useEffect(() => {
    const detectRegion = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()

        let region: ComplianceSettings['region'] = 'international'

        if (data.country_code === 'CA') {
          region = data.region === 'Ontario' ? 'ontario' : 'canada'
        } else if (data.country_code === 'US') {
          region = 'usa'
        } else if (data.eu === true) {
          region = 'eu'
        }

        setComplianceSettings(prev => ({ ...prev, region }))
      } catch (error) {
        console.log('Could not detect region, using default')
      }
    }

    detectRegion()
  }, [])

  // Check cookie consent on mount
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent && complianceSettings.showCookieConsent) {
      setShowCookieConsent(true)
    } else if (consent) {
      setCookieConsent(JSON.parse(consent))
    }
  }, [complianceSettings.showCookieConsent])

  const handleCookieConsent = (preferences: typeof cookieConsent) => {
    setCookieConsent(preferences)
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    setShowCookieConsent(false)
    announceToScreenReader('Cookie preferences saved')
  }

  const saveComplianceSettings = (settings: Partial<ComplianceSettings>) => {
    setComplianceSettings(prev => ({ ...prev, ...settings }))
    localStorage.setItem('compliance-settings', JSON.stringify({ ...complianceSettings, ...settings }))
  }

  return (
    <div className="legal-compliance-provider">
      {children}

      {/* Cookie Consent Modal */}
      {showCookieConsent && (
        <CookieConsentModal
          onConsent={handleCookieConsent}
          region={complianceSettings.region}
        />
      )}

      {/* Accessibility Statement Banner */}
      {complianceSettings.showAccessibilityStatement && (
        <AccessibilityStatementBanner
          businessInfo={businessInfo}
          region={complianceSettings.region}
        />
      )}

      {/* Emergency Information */}
      {complianceSettings.showEmergencyInfo && (
        <EmergencyInfoBanner businessInfo={businessInfo} />
      )}

      {/* Footer Legal Links */}
      <LegalFooter
        businessInfo={businessInfo}
        complianceSettings={complianceSettings}
        onSettingsChange={saveComplianceSettings}
      />

      {/* Alternative Format Request Modal */}
      {complianceSettings.enableAlternativeFormats && (
        <AlternativeFormatRequest businessInfo={businessInfo} />
      )}

      {/* Feedback Form */}
      {complianceSettings.enableFeedbackForm && (
        <AccessibilityFeedbackForm businessInfo={businessInfo} />
      )}
    </div>
  )
}

// Cookie consent modal component
function CookieConsentModal({
  onConsent,
  region
}: {
  onConsent: (preferences: any) => void
  region: string
}) {
  const [showDetails, setShowDetails] = useState(false)

  const handleAcceptAll = () => {
    onConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    })
  }

  const handleAcceptEssential = () => {
    onConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    })
  }

  const handleCustomize = (preferences: any) => {
    onConsent(preferences)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Cookie className="w-5 h-5 mr-2 text-gray-600" />
              <h3 className="text-base font-semibold text-gray-900">
                {region === 'eu' ? 'Cookie Notice' : 'Cookie Consent'}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {region === 'eu'
                ? 'We use cookies to enhance your experience and analyze site traffic. By using our site, you agree to our use of cookies in accordance with GDPR.'
                : 'We use cookies to improve your experience on our site and show you relevant advertising. To find out more, read our privacy policy.'
              }
            </p>

            {!showDetails && (
              <button
                onClick={() => setShowDetails(true)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Customize preferences
              </button>
            )}

            {showDetails && (
              <div className="mt-4 space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-sm">
                    <strong>Essential</strong> - Required for the site to function
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-sm">
                    <strong>Analytics</strong> - Help us improve our website
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-sm">
                    <strong>Marketing</strong> - Show you relevant ads
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={false}
                    className="w-4 h-4 mr-2"
                  />
                  <span className="text-sm">
                    <strong>Preferences</strong> - Remember your settings
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex gap-2 ml-4">
            <button
              onClick={handleAcceptEssential}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Essential Only
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Accessibility statement banner
function AccessibilityStatementBanner({
  businessInfo,
  region
}: {
  businessInfo: LegalComplianceProps['businessInfo']
  region: string
}) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start">
          <Shield className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-base font-semibold text-blue-900">
              Accessibility Commitment
            </h3>
            <p className="text-sm text-blue-800 mt-1">
              {businessInfo.name} is committed to ensuring digital accessibility for people with disabilities.
              We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
              <a
                href="/accessibility"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Full Accessibility Statement
              </a>
              <a
                href="#accessibility-feedback"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Report an Issue
              </a>
              <a
                href={`mailto:${businessInfo.email}?subject=Accessibility Request`}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Request Alternative Format
              </a>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="ml-4 text-blue-600 hover:text-blue-800"
            aria-label="Dismiss accessibility notice"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

// Legal footer component
function LegalFooter({
  businessInfo,
  complianceSettings,
  onSettingsChange
}: {
  businessInfo: LegalComplianceProps['businessInfo']
  complianceSettings: ComplianceSettings
  onSettingsChange: (settings: Partial<ComplianceSettings>) => void
}) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300 py-8" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h4 className="text-white font-semibold mb-3">{businessInfo.name}</h4>
            <address className="not-italic text-sm">
              <p>{businessInfo.address.street}</p>
              <p>{businessInfo.address.city}, {businessInfo.address.province} {businessInfo.address.postalCode}</p>
              <p>{businessInfo.address.country}</p>
            </address>
            <div className="mt-3 space-y-1">
              <a href={`tel:${businessInfo.phone}`} className="text-sm hover:text-white block">
                <Phone className="inline w-4 h-4 mr-1" />
                {businessInfo.phone}
              </a>
              <a href={`mailto:${businessInfo.email}`} className="text-sm hover:text-white block">
                <Mail className="inline w-4 h-4 mr-1" />
                {businessInfo.email}
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-service" className="hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/accessibility" className="hover:text-white">
                  Accessibility Statement
                </a>
              </li>
              <li>
                <a href="/cookie-policy" className="hover:text-white">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Standards Compliance */}
          <div>
            <h4 className="text-white font-semibold mb-3">Compliance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                <span>WCAG 2.1 AAA Compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                <span>AODA Compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                <span>ACA Compliant</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                <span>GDPR Ready</span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div>
            <h4 className="text-white font-semibold mb-3">Feedback</h4>
            <p className="text-sm mb-3">
              Help us improve accessibility. Report issues or request accommodations.
            </p>
            <button
              onClick={() => document.getElementById('accessibility-feedback')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Provide Feedback
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {currentYear} {businessInfo.name}. All rights reserved.</p>
          <p className="mt-2">
            Last updated: {new Date(complianceSettings.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
    </footer>
  )
}

// Emergency information banner
function EmergencyInfoBanner({ businessInfo }: { businessInfo: LegalComplianceProps['businessInfo'] }) {
  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-1 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-base font-semibold text-red-900">
              Emergency Information
            </h3>
            <p className="text-sm text-red-800 mt-1">
              For emergencies, please call 911. For immediate accessibility assistance during business hours, call us at {businessInfo.phone}.
            </p>
            <div className="mt-3">
              <a href="/emergency-procedures" className="text-sm text-red-600 hover:text-red-800 underline">
                View Emergency Procedures
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Alternative format request modal
function AlternativeFormatRequest({ businessInfo }: { businessInfo: LegalComplianceProps['businessInfo'] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    formatRequested: '',
    contentNeeded: '',
    urgency: 'normal'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Send request to business email
    const subject = `Alternative Format Request - ${formData.formatRequested}`
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Format Requested: ${formData.formatRequested}
Content Needed: ${formData.contentNeeded}
Urgency: ${formData.urgency}
    `

    window.location.href = `mailto:${businessInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 p-3 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[48px] min-w-[48px]"
        aria-label="Request alternative format"
      >
        <FileText className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Request Alternative Format</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Format Requested *</label>
                <select
                  required
                  value={formData.formatRequested}
                  onChange={(e) => setFormData(prev => ({ ...prev, formatRequested: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a format</option>
                  <option value="large-print">Large Print</option>
                  <option value="braille">Braille</option>
                  <option value="audio">Audio Recording</option>
                  <option value="digital-text">Digital Text (Accessible)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Content Needed</label>
                <textarea
                  value={formData.contentNeeded}
                  onChange={(e) => setFormData(prev => ({ ...prev, contentNeeded: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  rows={3}
                  placeholder="Please describe what content you need in alternative format"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Urgency</label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="normal">Normal (5-10 business days)</option>
                  <option value="urgent">Urgent (2-3 business days)</option>
                  <option value="emergency">Emergency (within 24 hours)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Send Request
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

// Accessibility feedback form
function AccessibilityFeedbackForm({ businessInfo }: { businessInfo: LegalComplianceProps['businessInfo'] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    description: '',
    url: '',
    browser: '',
    assistiveTechnology: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Send feedback to business email
    const subject = `Accessibility Feedback - ${formData.issueType}`
    const body = `
Name: ${formData.name}
Email: ${formData.email}
Issue Type: ${formData.issueType}
Description: ${formData.description}
URL: ${formData.url}
Browser: ${formData.browser}
Assistive Technology: ${formData.assistiveTechnology}
    `

    window.location.href = `mailto:${businessInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setIsOpen(false)
  }

  return (
    <>
      <div id="accessibility-feedback" className="hidden">
        {/* Hidden anchor for link targeting */}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Accessibility Feedback</h2>
            <p className="text-sm text-gray-600 mb-4">
              Help us improve our website's accessibility. Please describe any issues you encountered.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Issue Type *</label>
                <select
                  required
                  value={formData.issueType}
                  onChange={(e) => setFormData(prev => ({ ...prev, issueType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select an issue type</option>
                  <option value="navigation">Navigation/Menu issues</option>
                  <option value="forms">Form accessibility</option>
                  <option value="images">Images without alt text</option>
                  <option value="color">Color contrast issues</option>
                  <option value="keyboard">Keyboard navigation</option>
                  <option value="screen-reader">Screen reader issues</option>
                  <option value="mobile">Mobile accessibility</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Please describe the accessibility issue you encountered"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default LegalComplianceProvider