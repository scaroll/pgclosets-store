"use client"

import React, { useState, useEffect } from 'react'
import { Settings, Shield, Cookie, Eye, Megaphone } from 'lucide-react'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import type { CookieConsentPreferences } from '../../types/analytics'

interface ConsentBannerProps {
  onConsentChange: (preferences: CookieConsentPreferences) => void
  companyName?: string
  privacyPolicyUrl?: string
  cookiePolicyUrl?: string
}

export function ConsentBanner({
  onConsentChange,
  companyName: _companyName = "PG Closets",
  privacyPolicyUrl = "/privacy-policy",
  cookiePolicyUrl = "/cookie-policy"
}: ConsentBannerProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookieConsentPreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false,
    location: false
  })

  useEffect(() => {
    // Check if user has already given consent
    const existingConsent = localStorage.getItem('analytics_consent')
    if (!existingConsent) {
      setShowBanner(true)
    } else {
      try {
        const { preferences } = JSON.parse(existingConsent)
        setPreferences(preferences)
        onConsentChange(preferences)
      } catch (error) {
        console.warn('Invalid consent data, showing banner')
        setShowBanner(true)
      }
    }
  }, [onConsentChange])

  const savePreferences = (prefs: CookieConsentPreferences) => {
    const consentData = {
      preferences: prefs,
      timestamp: Date.now(),
      version: '1.0',
      userAgent: navigator.userAgent
    }

    localStorage.setItem('analytics_consent', JSON.stringify(consentData))
    setPreferences(prefs)
    onConsentChange(prefs)
    setShowBanner(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    const allAccepted: CookieConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      location: true
    }
    savePreferences(allAccepted)
  }

  const acceptNecessary = () => {
    const necessaryOnly: CookieConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      location: false
    }
    savePreferences(necessaryOnly)
  }

  const updatePreference = (category: keyof CookieConsentPreferences, value: boolean) => {
    if (category === 'necessary') return // Can't disable necessary cookies

    setPreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const cookieCategories = [
    {
      key: 'necessary' as const,
      name: 'Necessary Cookies',
      description: 'Essential for website functionality, security, and core features. These cannot be disabled.',
      icon: Shield,
      required: true,
      examples: 'Authentication, security, basic site functionality'
    },
    {
      key: 'analytics' as const,
      name: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
      icon: Eye,
      required: false,
      examples: 'Google Analytics, page views, user behavior, performance metrics'
    },
    {
      key: 'functional' as const,
      name: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization, such as remembering your preferences.',
      icon: Settings,
      required: false,
      examples: 'Language preferences, theme selection, form data'
    },
    {
      key: 'marketing' as const,
      name: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant and engaging advertisements.',
      icon: Megaphone,
      required: false,
      examples: 'Social media integration, advertising, remarketing'
    },
    {
      key: 'location' as const,
      name: 'Location Cookies',
      description: 'Allow us to provide location-based services and content relevant to your area.',
      icon: Cookie,
      required: false,
      examples: 'Store locator, shipping options, regional content'
    }
  ]

  if (!showBanner) return null

  return (
    <>
      {/* Main Consent Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <Cookie className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cookie Preferences
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We use cookies to enhance your browsing experience, provide personalized content,
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                    You can customize your preferences or learn more in our{' '}
                    <a
                      href={privacyPolicyUrl}
                      className="text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                    {cookiePolicyUrl && (
                      <>
                        {' '}and{' '}
                        <a
                          href={cookiePolicyUrl}
                          className="text-blue-600 hover:text-blue-800 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Cookie Policy
                        </a>
                      </>
                    )}.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Cookie className="h-5 w-5" />
                      Cookie Preferences
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    <div className="text-sm text-gray-600">
                      <p className="mb-4">
                        Manage your cookie preferences below. You can enable or disable different
                        types of cookies. Note that disabling some types of cookies may impact
                        your experience on our website.
                      </p>
                    </div>

                    {cookieCategories.map((category) => {
                      const IconComponent = category.icon
                      return (
                        <div
                          key={category.key}
                          className="border border-gray-200 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <IconComponent className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                              <div className="space-y-1">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  {category.name}
                                  {category.required && (
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                      Required
                                    </span>
                                  )}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {category.description}
                                </p>
                                <p className="text-xs text-gray-500">
                                  <strong>Examples:</strong> {category.examples}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={preferences[category.key]}
                              onCheckedChange={(checked) => updatePreference(category.key, checked)}
                              disabled={category.required}
                              className="ml-4"
                            />
                          </div>
                        </div>
                      )
                    })}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                      <Button
                        onClick={() => savePreferences(preferences)}
                        className="flex-1"
                      >
                        Save Preferences
                      </Button>
                      <Button
                        onClick={acceptAll}
                        variant="outline"
                        className="flex-1"
                      >
                        Accept All
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={acceptNecessary}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
              >
                Necessary Only
              </Button>

              <Button
                onClick={acceptAll}
                size="sm"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      <div className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden" />
    </>
  )
}

// Hook for managing consent preferences
export function useConsentPreferences() {
  const [preferences, setPreferences] = useState<CookieConsentPreferences | null>(null)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('analytics_consent')
    if (stored) {
      try {
        const { preferences } = JSON.parse(stored)
        setPreferences(preferences)
        setHasConsent(true)
      } catch (error) {
        console.warn('Invalid consent data')
      }
    }
  }, [])

  const updatePreferences = (newPreferences: CookieConsentPreferences) => {
    const consentData = {
      preferences: newPreferences,
      timestamp: Date.now(),
      version: '1.0',
      userAgent: navigator.userAgent
    }

    localStorage.setItem('analytics_consent', JSON.stringify(consentData))
    setPreferences(newPreferences)
    setHasConsent(true)
  }

  const clearConsent = () => {
    localStorage.removeItem('analytics_consent')
    setPreferences(null)
    setHasConsent(false)
  }

  return {
    preferences,
    hasConsent,
    hasAnalyticsConsent: preferences?.analytics === true,
    hasMarketingConsent: preferences?.marketing === true,
    hasFunctionalConsent: preferences?.functional === true,
    hasLocationConsent: preferences?.location === true,
    updatePreferences,
    clearConsent
  }
}