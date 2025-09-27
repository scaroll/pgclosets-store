"use client"

import React, { useEffect, useRef, useCallback } from 'react'
import { getAnalytics } from '../../lib/analytics'
import { AnalyticsProductItem } from '../../types/analytics'

// Conversion Funnel Steps
enum FunnelStep {
  AWARENESS = 'awareness',
  INTEREST = 'interest',
  CONSIDERATION = 'consideration',
  INTENT = 'intent',
  EVALUATION = 'evaluation',
  PURCHASE = 'purchase',
  RETENTION = 'retention',
  ADVOCACY = 'advocacy'
}

// Funnel Event Types
interface FunnelEvent {
  step: FunnelStep
  action: string
  value?: number
  metadata?: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
}

// Conversion Goals
enum ConversionGoal {
  QUOTE_REQUEST = 'quote_request',
  CONTACT_FORM = 'contact_form',
  PHONE_CALL = 'phone_call',
  EMAIL_CONTACT = 'email_contact',
  CONSULTATION_BOOKING = 'consultation_booking',
  PRODUCT_INQUIRY = 'product_inquiry',
  NEWSLETTER_SIGNUP = 'newsletter_signup',
  BROCHURE_DOWNLOAD = 'brochure_download',
  VIRTUAL_CONSULTATION = 'virtual_consultation',
  SHOWROOM_VISIT = 'showroom_visit'
}

class ConversionFunnelTracker {
  private analytics: any
  private funnelEvents: FunnelEvent[] = []
  private sessionStartTime: number
  private currentStep: FunnelStep = FunnelStep.AWARENESS
  private goalValues: Record<ConversionGoal, number> = {
    [ConversionGoal.QUOTE_REQUEST]: 50,
    [ConversionGoal.CONTACT_FORM]: 25,
    [ConversionGoal.PHONE_CALL]: 75,
    [ConversionGoal.EMAIL_CONTACT]: 30,
    [ConversionGoal.CONSULTATION_BOOKING]: 100,
    [ConversionGoal.PRODUCT_INQUIRY]: 40,
    [ConversionGoal.NEWSLETTER_SIGNUP]: 10,
    [ConversionGoal.BROCHURE_DOWNLOAD]: 15,
    [ConversionGoal.VIRTUAL_CONSULTATION]: 80,
    [ConversionGoal.SHOWROOM_VISIT]: 120
  }

  constructor() {
    this.analytics = getAnalytics()
    this.sessionStartTime = Date.now()
    this.initializeFunnelTracking()
  }

  private initializeFunnelTracking(): void {
    // Track initial funnel entry
    this.trackFunnelStep(FunnelStep.AWARENESS, 'session_start', 0, {
      entry_point: window.location.pathname,
      referrer: document.referrer,
      utm_source: this.getUrlParameter('utm_source'),
      utm_medium: this.getUrlParameter('utm_medium'),
      utm_campaign: this.getUrlParameter('utm_campaign')
    })

    // Set up automatic funnel progression tracking
    this.setupAutomaticTracking()
  }

  private setupAutomaticTracking(): void {
    if (typeof window === 'undefined') return

    // Track scroll depth for interest measurement
    let maxScroll = 0
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent

        if (scrollPercent >= 25 && this.currentStep === FunnelStep.AWARENESS) {
          this.progressToStep(FunnelStep.INTEREST, 'scroll_engagement', 0, { scroll_depth: scrollPercent })
        }

        if (scrollPercent >= 50 && this.currentStep === FunnelStep.INTEREST) {
          this.progressToStep(FunnelStep.CONSIDERATION, 'deep_engagement', 0, { scroll_depth: scrollPercent })
        }
      }
    }

    window.addEventListener('scroll', trackScroll, { passive: true })

    // Track time on page for engagement
    const trackTimeEngagement = () => {
      const timeOnPage = Date.now() - this.sessionStartTime

      if (timeOnPage > 30000 && this.currentStep === FunnelStep.AWARENESS) { // 30 seconds
        this.progressToStep(FunnelStep.INTEREST, 'time_engagement', 0, { time_on_page: timeOnPage })
      }

      if (timeOnPage > 120000 && this.currentStep === FunnelStep.INTEREST) { // 2 minutes
        this.progressToStep(FunnelStep.CONSIDERATION, 'extended_engagement', 0, { time_on_page: timeOnPage })
      }
    }

    setInterval(trackTimeEngagement, 10000) // Check every 10 seconds

    // Track click interactions for intent
    const trackClicks = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      const button = target.closest('button')

      if (link || button) {
        const element = link || button
        const text = element?.textContent?.toLowerCase() || ''

        // Intent indicators
        if (this.isIntentAction(text)) {
          this.progressToStep(FunnelStep.INTENT, 'intent_action', 0, {
            action_type: link ? 'link_click' : 'button_click',
            action_text: text,
            element_id: element?.id,
            element_class: element?.className
          })
        }

        // Evaluation indicators
        if (this.isEvaluationAction(text)) {
          this.progressToStep(FunnelStep.EVALUATION, 'evaluation_action', 0, {
            action_type: link ? 'link_click' : 'button_click',
            action_text: text
          })
        }
      }
    }

    document.addEventListener('click', trackClicks)
  }

  // Core Funnel Tracking Methods
  public trackFunnelStep(step: FunnelStep, action: string, value: number = 0, metadata?: Record<string, any>): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const event: FunnelEvent = {
      step,
      action,
      value,
      metadata,
      timestamp: Date.now(),
      sessionId: this.analytics.getSessionId(),
      userId: this.analytics.userId
    }

    this.funnelEvents.push(event)

    // Send to GA4
    this.analytics.gtag('event', 'funnel_step', {
      funnel_step: step,
      funnel_action: action,
      funnel_value: value,
      event_category: 'Conversion Funnel',
      event_label: `${step}:${action}`,
      custom_map: metadata
    })

    // Update current step if progressing forward
    const stepOrder = Object.values(FunnelStep)
    const currentIndex = stepOrder.indexOf(this.currentStep)
    const newIndex = stepOrder.indexOf(step)

    if (newIndex > currentIndex) {
      this.currentStep = step
    }
  }

  private progressToStep(step: FunnelStep, action: string, value: number = 0, metadata?: Record<string, any>): void {
    // Only progress forward, never backward
    const stepOrder = Object.values(FunnelStep)
    const currentIndex = stepOrder.indexOf(this.currentStep)
    const newIndex = stepOrder.indexOf(step)

    if (newIndex > currentIndex) {
      this.trackFunnelStep(step, action, value, metadata)
    }
  }

  // Conversion Goal Tracking
  public trackConversionGoal(goal: ConversionGoal, metadata?: Record<string, any>): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const value = this.goalValues[goal] || 0

    // Track in funnel
    this.trackFunnelStep(FunnelStep.PURCHASE, `conversion_${goal}`, value, {
      conversion_goal: goal,
      conversion_value: value,
      ...metadata
    })

    // Track as GA4 conversion
    this.analytics.gtag('event', 'conversion', {
      send_to: `${this.analytics.config.measurementId}/${goal}`,
      value: value,
      currency: 'CAD',
      conversion_goal: goal,
      conversion_type: this.getConversionType(goal),
      ...metadata
    })

    // Track custom goal event
    this.analytics.gtag('event', goal, {
      event_category: 'Conversions',
      event_label: goal,
      value: value,
      conversion_value: value,
      funnel_completion: this.calculateFunnelCompletion(),
      time_to_conversion: Date.now() - this.sessionStartTime,
      ...metadata
    })
  }

  // Specific Conversion Tracking Methods
  public trackQuoteRequest(products: AnalyticsProductItem[], totalValue: number, contactInfo: any): void {
    this.progressToStep(FunnelStep.INTENT, 'quote_form_start')

    this.trackConversionGoal(ConversionGoal.QUOTE_REQUEST, {
      product_count: products.length,
      quote_value: totalValue,
      contact_method: contactInfo.preferredContact,
      product_categories: [...new Set(products.map(p => p.item_category))],
      urgency: contactInfo.timeline || 'not_specified'
    })

    // Track individual products in quote
    products.forEach(product => {
      this.analytics?.trackViewItem({
        item_id: product.item_id,
        item_name: product.item_name,
        item_category: product.item_category,
        price: product.price,
        currency: 'CAD'
      })
    })
  }

  public trackContactFormSubmission(formType: string, success: boolean, metadata?: Record<string, any>): void {
    if (success) {
      this.trackConversionGoal(ConversionGoal.CONTACT_FORM, {
        form_type: formType,
        submission_success: success,
        ...metadata
      })
    } else {
      this.trackFunnelStep(FunnelStep.EVALUATION, 'form_error', 0, {
        form_type: formType,
        error_type: metadata?.error || 'unknown'
      })
    }
  }

  public trackPhoneCall(phoneNumber: string): void {
    this.trackConversionGoal(ConversionGoal.PHONE_CALL, {
      phone_number: phoneNumber,
      call_source: 'website'
    })
  }

  public trackEmailContact(emailAddress: string): void {
    this.trackConversionGoal(ConversionGoal.EMAIL_CONTACT, {
      email_address: emailAddress,
      contact_source: 'website'
    })
  }

  public trackConsultationBooking(consultationType: string, appointmentValue?: number): void {
    this.trackConversionGoal(ConversionGoal.CONSULTATION_BOOKING, {
      consultation_type: consultationType,
      appointment_value: appointmentValue,
      booking_source: 'website'
    })
  }

  public trackNewsletterSignup(source: string): void {
    this.trackConversionGoal(ConversionGoal.NEWSLETTER_SIGNUP, {
      signup_source: source,
      signup_location: window.location.pathname
    })
  }

  public trackBrochureDownload(brochureType: string): void {
    this.trackConversionGoal(ConversionGoal.BROCHURE_DOWNLOAD, {
      brochure_type: brochureType,
      download_source: window.location.pathname
    })
  }

  // Advanced Funnel Analytics
  public trackAbandonmentPoint(step: FunnelStep, reason?: string): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    this.analytics.gtag('event', 'funnel_abandonment', {
      abandonment_step: step,
      abandonment_reason: reason || 'unknown',
      time_before_abandonment: Date.now() - this.sessionStartTime,
      event_category: 'Funnel Analysis',
      event_label: `Abandoned at ${step}`
    })
  }

  public trackMicroConversion(action: string, step: FunnelStep, value: number = 0): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    this.analytics.gtag('event', 'micro_conversion', {
      micro_action: action,
      funnel_step: step,
      micro_value: value,
      event_category: 'Micro Conversions',
      event_label: action
    })
  }

  // Utility Methods
  private isIntentAction(text: string): boolean {
    const intentKeywords = [
      'quote', 'contact', 'call', 'book', 'schedule', 'consultation',
      'estimate', 'price', 'cost', 'buy', 'purchase', 'order'
    ]
    return intentKeywords.some(keyword => text.includes(keyword))
  }

  private isEvaluationAction(text: string): boolean {
    const evaluationKeywords = [
      'compare', 'vs', 'review', 'testimonial', 'gallery', 'portfolio',
      'before', 'after', 'case study', 'example', 'sample'
    ]
    return evaluationKeywords.some(keyword => text.includes(keyword))
  }

  private getConversionType(goal: ConversionGoal): string {
    const leadGoals = [
      ConversionGoal.QUOTE_REQUEST,
      ConversionGoal.CONTACT_FORM,
      ConversionGoal.PHONE_CALL,
      ConversionGoal.EMAIL_CONTACT,
      ConversionGoal.CONSULTATION_BOOKING,
      ConversionGoal.PRODUCT_INQUIRY
    ]

    const engagementGoals = [
      ConversionGoal.NEWSLETTER_SIGNUP,
      ConversionGoal.BROCHURE_DOWNLOAD
    ]

    if (leadGoals.includes(goal)) return 'lead'
    if (engagementGoals.includes(goal)) return 'engagement'
    return 'other'
  }

  private calculateFunnelCompletion(): number {
    const stepOrder = Object.values(FunnelStep)
    const currentIndex = stepOrder.indexOf(this.currentStep)
    return Math.round((currentIndex / (stepOrder.length - 1)) * 100)
  }

  private getUrlParameter(name: string): string | null {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  }

  // Reporting Methods
  public getFunnelData(): FunnelEvent[] {
    return [...this.funnelEvents]
  }

  public getCurrentStep(): FunnelStep {
    return this.currentStep
  }

  public getSessionDuration(): number {
    return Date.now() - this.sessionStartTime
  }

  public getFunnelCompletion(): number {
    return this.calculateFunnelCompletion()
  }
}

// Singleton instance
let funnelTracker: ConversionFunnelTracker | null = null

export function getFunnelTracker(): ConversionFunnelTracker {
  if (!funnelTracker) {
    funnelTracker = new ConversionFunnelTracker()
  }
  return funnelTracker
}

// React Hook for Funnel Tracking
export function useConversionFunnel() {
  const tracker = useRef<ConversionFunnelTracker | null>(null)

  useEffect(() => {
    tracker.current = getFunnelTracker()
  }, [])

  const trackQuoteRequest = useCallback((products: AnalyticsProductItem[], totalValue: number, contactInfo: any) => {
    tracker.current?.trackQuoteRequest(products, totalValue, contactInfo)
  }, [])

  const trackContactForm = useCallback((formType: string, success: boolean, metadata?: Record<string, any>) => {
    tracker.current?.trackContactFormSubmission(formType, success, metadata)
  }, [])

  const trackPhoneCall = useCallback((phoneNumber: string) => {
    tracker.current?.trackPhoneCall(phoneNumber)
  }, [])

  const trackEmailContact = useCallback((emailAddress: string) => {
    tracker.current?.trackEmailContact(emailAddress)
  }, [])

  const trackConsultationBooking = useCallback((type: string, value?: number) => {
    tracker.current?.trackConsultationBooking(type, value)
  }, [])

  const trackNewsletterSignup = useCallback((source: string) => {
    tracker.current?.trackNewsletterSignup(source)
  }, [])

  const trackBrochureDownload = useCallback((type: string) => {
    tracker.current?.trackBrochureDownload(type)
  }, [])

  const trackMicroConversion = useCallback((action: string, step: FunnelStep, value?: number) => {
    tracker.current?.trackMicroConversion(action, step, value)
  }, [])

  return {
    trackQuoteRequest,
    trackContactForm,
    trackPhoneCall,
    trackEmailContact,
    trackConsultationBooking,
    trackNewsletterSignup,
    trackBrochureDownload,
    trackMicroConversion,
    getCurrentStep: () => tracker.current?.getCurrentStep(),
    getFunnelCompletion: () => tracker.current?.getFunnelCompletion(),
    getSessionDuration: () => tracker.current?.getSessionDuration()
  }
}

export { ConversionFunnelTracker, FunnelStep, ConversionGoal }
export type { FunnelEvent }