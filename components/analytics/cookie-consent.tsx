'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Shield, Cookie, BarChart3, Target, MapPin } from 'lucide-react'

export interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  functional: boolean
  location: boolean
}

interface CookieConsentProps {
  onPreferencesChange?: (preferences: CookiePreferences) => void
  companyName?: string
  privacyPolicyUrl?: string
  debug?: boolean
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  functional: false,
  location: false,
}

const COOKIE_CONSENT_KEY = 'pgclosets_cookie_consent'
const COOKIE_PREFERENCES_KEY = 'pgclosets_cookie_preferences'
const CONSENT_VERSION = '1.0'

export function CookieConsent({ 
  onPreferencesChange,
  companyName = 'PG Closets',
  privacyPolicyUrl = '/privacy',
  debug = false 
}: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetailedSettings, setShowDetailedSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)
  const [hasConsented, setHasConsented] = useState(false)

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      
      if (savedConsent && savedPreferences) {
        try {
          const consentData = JSON.parse(savedConsent)
          const prefsData = JSON.parse(savedPreferences)
          
          // Check if consent is still valid (not expired, same version)
          const isValidConsent = consentData.version === CONSENT_VERSION && 
                                consentData.timestamp > Date.now() - (365 * 24 * 60 * 60 * 1000) // 1 year
          
          if (isValidConsent) {
            setPreferences(prefsData)
            setHasConsented(true)
            onPreferencesChange?.(prefsData)
            
            if (debug) {
              console.log('[Cookie Consent] Loaded saved preferences:', prefsData)
            }
          } else {
            // Clear expired consent
            localStorage.removeItem(COOKIE_CONSENT_KEY)
            localStorage.removeItem(COOKIE_PREFERENCES_KEY)
            setShowBanner(true)
          }
        } catch (error) {
          console.error('[Cookie Consent] Error loading saved preferences:', error)
          setShowBanner(true)
        }
      } else {
        setShowBanner(true)
      }
    }
  }, [onPreferencesChange, debug])

  // Save preferences to localStorage
  const savePreferences = useCallback((newPreferences: CookiePreferences) => {
    if (typeof window !== 'undefined') {
      const consentData = {
        version: CONSENT_VERSION,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      }
      
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData))
      localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences))
      
      if (debug) {
        console.log('[Cookie Consent] Saved preferences:', newPreferences)
      }
    }
  }, [debug])

  // Handle accepting all cookies
  const handleAcceptAll = useCallback(() => {
    const allAcceptedPrefs: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      location: true,
    }
    
    setPreferences(allAcceptedPrefs)
    setHasConsented(true)
    setShowBanner(false)
    savePreferences(allAcceptedPrefs)
    onPreferencesChange?.(allAcceptedPrefs)
  }, [savePreferences, onPreferencesChange])

  // Handle rejecting optional cookies
  const handleRejectOptional = useCallback(() => {
    const necessaryOnlyPrefs: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      location: false,
    }
    
    setPreferences(necessaryOnlyPrefs)
    setHasConsented(true)
    setShowBanner(false)
    savePreferences(necessaryOnlyPrefs)
    onPreferencesChange?.(necessaryOnlyPrefs)
  }, [savePreferences, onPreferencesChange])

  // Handle saving custom preferences
  const handleSavePreferences = useCallback(() => {
    setHasConsented(true)
    setShowBanner(false)
    setShowDetailedSettings(false)
    savePreferences(preferences)
    onPreferencesChange?.(preferences)
  }, [preferences, savePreferences, onPreferencesChange])

  // Handle individual preference changes
  const handlePreferenceChange = useCallback((key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // Cookie category descriptions
  const cookieCategories = [
    {
      key: 'necessary' as const,
      title: 'Necessary Cookies',
      description: 'Essential for the website to function properly. These cannot be disabled.',
      icon: Shield,
      required: true,
      examples: ['Session management', 'Security', 'Load balancing']
    },
    {
      key: 'analytics' as const,
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website.',
      icon: BarChart3,
      required: false,
      examples: ['Google Analytics', 'Performance monitoring', 'User behavior tracking']
    },
    {
      key: 'marketing' as const,
      title: 'Marketing Cookies',
      description: 'Used to deliver personalized advertisements and measure campaign effectiveness.',
      icon: Target,
      required: false,
      examples: ['Ad targeting', 'Conversion tracking', 'Social media integration']
    },
    {
      key: 'functional' as const,
      title: 'Functional Cookies',
      description: 'Enable enhanced functionality and personalization.',
      icon: Cookie,
      required: false,
      examples: ['Language preferences', 'Theme settings', 'Form auto-fill']
    },
    {
      key: 'location' as const,
      title: 'Location Cookies',
      description: 'Used to provide location-based services and content.',
      icon: MapPin,
      required: false,
      examples: ['Store locator', 'Local pricing', 'Shipping calculations']
    },
  ]

  if (!showBanner && hasConsented) {
    return null
  }

  return (
    <>
      {/* Cookie Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Cookie className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Cookie Preferences</h3>
                </div>
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your experience, analyze site usage, and assist in marketing efforts. 
                  {privacyPolicyUrl && (
                    <>
                      {' '}Learn more in our{' '}
                      <a 
                        href={privacyPolicyUrl} 
                        className="text-orange-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy Policy
                      </a>.
                    </>
                  )}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 min-w-fit">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetailedSettings(true)}
                  className="whitespace-nowrap"
                >
                  Customize
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRejectOptional}
                  className="whitespace-nowrap"
                >
                  Necessary Only
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptAll}
                  className="whitespace-nowrap bg-orange-600 hover:bg-orange-700"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Settings Dialog */}
      <Dialog open={showDetailedSettings} onOpenChange={setShowDetailedSettings}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              Cookie Preferences - {companyName}
            </DialogTitle>
            <DialogDescription>
              Manage your cookie preferences. You can enable or disable different types of cookies below. 
              Note that disabling some cookies may impact your experience on our website.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {cookieCategories.map((category) => {
              const IconComponent = category.icon
              const isEnabled = preferences[category.key]
              
              return (
                <Card key={category.key} className="border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-orange-600" />
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {category.title}
                            {category.required && (
                              <Badge variant="secondary" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </CardTitle>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`cookie-${category.key}`}
                          checked={isEnabled}
                          onCheckedChange={(checked) => handlePreferenceChange(category.key, checked)}
                          disabled={category.required}
                        />
                        <Label 
                          htmlFor={`cookie-${category.key}`}
                          className="text-sm font-medium"
                        >
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </Label>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3">
                      {category.description}
                    </p>
                    
                    <div className="text-xs text-gray-500">
                      <strong>Examples:</strong> {category.examples.join(', ')}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 text-xs text-gray-500">
              Your preferences will be saved for one year. You can change them at any time 
              through our cookie settings.
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDetailedSettings(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePreferences}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Save Preferences
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Hook to access current cookie preferences
export function useCookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
      
      if (savedPreferences) {
        try {
          const prefs = JSON.parse(savedPreferences)
          setPreferences(prefs)
        } catch (error) {
          console.error('Error loading cookie preferences:', error)
        }
      }
      
      setIsLoaded(true)
    }
  }, [])

  const updatePreferences = useCallback((newPreferences: CookiePreferences) => {
    setPreferences(newPreferences)
  }, [])

  return {
    preferences,
    isLoaded,
    updatePreferences,
    hasAnalyticsConsent: preferences.analytics,
    hasMarketingConsent: preferences.marketing,
    hasFunctionalConsent: preferences.functional,
    hasLocationConsent: preferences.location,
  }
}

// Utility function to check if analytics should be loaded
export function shouldLoadAnalytics(): boolean {
  if (typeof window === 'undefined') return false
  
  const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY)
  
  if (!savedPreferences) return false
  
  try {
    const preferences = JSON.parse(savedPreferences)
    return preferences.analytics === true
  } catch {
    return false
  }
}