"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  AlertTriangle,
  TrendingUp,
  MousePointer,
  Shield,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useAnalytics, useAnalyticsTracking } from './analytics-provider'
import { getFunnelTracker } from './conversion-funnel'
import { getCartAbandonmentTracker } from './cart-abandonment'
import { getErrorTracker } from './error-tracking'
import { getInteractionTracker } from './interaction-tracking'

interface AnalyticsDashboardProps {
  isAdmin?: boolean
}

interface DashboardDataState {
  consent: { status: string; data: any }
  funnel: { status: string; data: any }
  errors: { status: string; data: any }
  interactions: { status: string; data: any }
  cart: { status: string; data: any }
}

export function AnalyticsDashboard({ isAdmin = false }: AnalyticsDashboardProps) {
  const { isInitialized, hasConsent, preferences, analytics } = useAnalytics()
  const { trackEvent } = useAnalyticsTracking()

  const [dashboardData, setDashboardData] = useState<DashboardDataState>({
    consent: { status: 'loading', data: null },
    funnel: { status: 'loading', data: null },
    errors: { status: 'loading', data: null },
    interactions: { status: 'loading', data: null },
    cart: { status: 'loading', data: null }
  })

  // Test functions for analytics validation
  const testAnalytics = {
    trackPageView: () => {
      trackEvent('test_page_view', {
        event_category: 'Testing',
        event_label: 'Dashboard Test',
        test_mode: true
      })
    },

    trackTestPurchase: () => {
      const testItems = [{
        item_id: 'test_product_001',
        item_name: 'Test Custom Closet',
        item_category: 'Custom Closets',
        price: 2500,
        quantity: 1,
        item_brand: 'PG Closets'
      }]

      analytics?.trackPurchase({
        transaction_id: `test_${Date.now()}`,
        value: 2500,
        currency: 'CAD',
        items: testItems,
        user_id: 'test_user'
      })
    },

    trackTestAddToCart: () => {
      const testItem = {
        item_id: 'test_product_002',
        item_name: 'Test Walk-in Closet',
        item_category: 'Walk-in Closets',
        price: 3500,
        quantity: 1,
        item_brand: 'PG Closets'
      }

      analytics?.trackAddToCart({
        currency: 'CAD',
        value: 3500,
        items: [testItem]
      })
    },

    trackTestQuoteRequest: () => {
      trackEvent('test_quote_request', {
        event_category: 'Testing',
        event_label: 'Quote Request Test',
        value: 5000,
        test_mode: true
      })
    },

    trackTestError: () => {
      try {
        throw new Error('Test error for analytics validation')
      } catch (error) {
        const errorTracker = getErrorTracker()
        errorTracker.trackError({
          errorType: 'javascript',
          errorMessage: 'This is a test error for validation',
          fatal: false,
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          sessionId: analytics?.getSessionId() || 'test_session'
        })
      }
    },

    trackTestInteraction: () => {
      const interactionTracker = getInteractionTracker()
      interactionTracker.trackCustomEvent('test_button_click', 'testing', 1, {
        test_mode: true,
        dashboard_location: 'analytics_dashboard'
      })
    }
  }

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Consent data
        setDashboardData(prev => ({
          ...prev,
          consent: {
            status: 'loaded',
            data: {
              hasConsent,
              preferences,
              isInitialized,
              analytics: !!analytics
            }
          }
        }))

        // Funnel data
        const funnelTracker = getFunnelTracker()
        if (funnelTracker) {
          setDashboardData(prev => ({
            ...prev,
            funnel: {
              status: 'loaded',
              data: {
                currentStep: funnelTracker.getCurrentStep(),
                completion: funnelTracker.getFunnelCompletion(),
                sessionDuration: funnelTracker.getSessionDuration(),
                journey: funnelTracker.getFunnelData()
              }
            }
          }))
        }

        // Error data
        const errorTracker = getErrorTracker()
        if (errorTracker) {
          setDashboardData(prev => ({
            ...prev,
            errors: {
              status: 'loaded',
              data: errorTracker.getErrorSummary()
            }
          }))
        }

        // Interaction data
        const interactionTracker = getInteractionTracker()
        if (interactionTracker) {
          setDashboardData(prev => ({
            ...prev,
            interactions: {
              status: 'loaded',
              data: {
                metrics: interactionTracker.getEngagementMetrics(),
                history: interactionTracker.getInteractionHistory().slice(-10)
              }
            }
          }))
        }

        // Cart abandonment data
        const cartTracker = getCartAbandonmentTracker()
        if (cartTracker) {
          setDashboardData(prev => ({
            ...prev,
            cart: {
              status: 'loaded',
              data: {
                analytics: cartTracker.getAbandonmentAnalytics(),
                currentSession: cartTracker.getCurrentSession(),
                isActive: cartTracker.isSessionActive()
              }
            }
          }))
        }

      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      }
    }

    loadDashboardData()
    const interval = setInterval(loadDashboardData, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [hasConsent, preferences, isInitialized, analytics])

  const ConsentStatusCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          GDPR Consent Status
        </CardTitle>
        <CardDescription>Current cookie consent and privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Analytics Initialized</span>
          <Badge variant={isInitialized ? "default" : "secondary"}>
            {isInitialized ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span>Has Consent</span>
          <Badge variant={hasConsent ? "default" : "destructive"}>
            {hasConsent ? 'Granted' : 'Pending'}
          </Badge>
        </div>

        {preferences && (
          <div className="space-y-2">
            <h4 className="font-medium">Cookie Preferences:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span>Necessary:</span>
                <Badge variant="outline">{preferences.necessary ? 'On' : 'Off'}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Analytics:</span>
                <Badge variant="outline">{preferences.analytics ? 'On' : 'Off'}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Marketing:</span>
                <Badge variant="outline">{preferences.marketing ? 'On' : 'Off'}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Functional:</span>
                <Badge variant="outline">{preferences.functional ? 'On' : 'Off'}</Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const FunnelAnalyticsCard = () => {
    const funnelData = dashboardData.funnel.data

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Conversion Funnel
          </CardTitle>
          <CardDescription>User journey and conversion tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {funnelData && (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current Step:</span>
                  <div className="font-medium">{funnelData.currentStep}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Completion:</span>
                  <div className="font-medium">{funnelData.completion}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Session Duration:</span>
                  <div className="font-medium">{Math.round(funnelData.sessionDuration / 1000)}s</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Journey Steps:</span>
                  <div className="font-medium">{funnelData.journey?.length || 0}</div>
                </div>
              </div>

              {funnelData.journey?.slice(-3).map((step: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{step.action}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  const ErrorTrackingCard = () => {
    const errorData = dashboardData.errors.data

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Tracking
          </CardTitle>
          <CardDescription>JavaScript and system error monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorData && (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Errors:</span>
                  <div className="font-medium">{errorData.totalErrors}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Categories:</span>
                  <div className="font-medium">{Object.keys(errorData.errorsByCategory).length}</div>
                </div>
              </div>

              {Object.entries(errorData.errorsByCategory).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{category}:</span>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}

              {errorData.recentErrors?.slice(0, 3).map((error: any, index: number) => (
                <div key={index} className="p-2 bg-muted rounded text-xs">
                  <div className="font-medium">{error.errorType}</div>
                  <div className="text-muted-foreground truncate">{error.errorMessage}</div>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  const InteractionTrackingCard = () => {
    const interactionData = dashboardData.interactions.data

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="h-5 w-5" />
            User Interactions
          </CardTitle>
          <CardDescription>Click tracking and user engagement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {interactionData?.metrics && (
            <>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Time on Page:</span>
                  <div className="font-medium">{Math.round(interactionData.metrics.timeOnPage / 1000)}s</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Scroll Depth:</span>
                  <div className="font-medium">{interactionData.metrics.scrollDepth}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Click Count:</span>
                  <div className="font-medium">{interactionData.metrics.clickCount}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Interaction Rate:</span>
                  <div className="font-medium">{interactionData.metrics.interactionRate}/min</div>
                </div>
              </div>

              {interactionData.history?.slice(-3).map((interaction: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span className="text-sm">{interaction.type}: {interaction.element}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(interaction.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </>
          )}
        </CardContent>
      </Card>
    )
  }

  const TestingCard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Analytics Testing
        </CardTitle>
        <CardDescription>Test analytics tracking functionality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={testAnalytics.trackPageView}
            disabled={!hasConsent}
          >
            Test Page View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={testAnalytics.trackTestPurchase}
            disabled={!hasConsent}
          >
            Test Purchase
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={testAnalytics.trackTestAddToCart}
            disabled={!hasConsent}
          >
            Test Add to Cart
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={testAnalytics.trackTestQuoteRequest}
            disabled={!hasConsent}
          >
            Test Quote Request
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={testAnalytics.trackTestError}
          >
            Test Error
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={testAnalytics.trackTestInteraction}
          >
            Test Interaction
          </Button>
        </div>

        {!hasConsent && (
          <div className="text-sm text-muted-foreground p-2 bg-yellow-50 rounded">
            ⚠️ Analytics consent required for testing e-commerce events
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor analytics implementation and GDPR compliance
          </p>
        </div>
        <Badge variant={isInitialized && hasConsent ? "default" : "secondary"}>
          {isInitialized && hasConsent ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="consent">GDPR Consent</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          {isAdmin && <TabsTrigger value="advanced">Advanced</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ConsentStatusCard />
            <FunnelAnalyticsCard />
            <ErrorTrackingCard />
            <InteractionTrackingCard />
          </div>
        </TabsContent>

        <TabsContent value="consent" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ConsentStatusCard />
            <Card>
              <CardHeader>
                <CardTitle>Privacy Compliance</CardTitle>
                <CardDescription>GDPR and privacy features status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Cookie Consent Modal</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>IP Anonymization</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Consent Mode</span>
                    <Badge variant="default">v2</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Retention</span>
                    <Badge variant="outline">26 months</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TestingCard />
            <Card>
              <CardHeader>
                <CardTitle>Validation Checklist</CardTitle>
                <CardDescription>Analytics implementation validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {isInitialized ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Analytics Initialized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasConsent ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-yellow-500" />}
                    <span className="text-sm">User Consent Obtained</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {preferences?.analytics ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm">Analytics Tracking Enabled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Error Tracking Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Performance Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">GDPR Compliant</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Analytics Configuration</CardTitle>
                  <CardDescription>System-level analytics settings and debugging</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded text-xs overflow-auto">
                    {JSON.stringify({
                      isInitialized,
                      hasConsent,
                      preferences,
                      measurementId: analytics?.config?.measurementId,
                      debug: analytics?.config?.debug,
                      enableConsentMode: analytics?.config?.enableConsentMode
                    }, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}