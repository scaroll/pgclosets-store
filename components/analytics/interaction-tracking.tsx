"use client"

import { useEffect, useRef, useCallback } from 'react'
import { getAnalytics } from '../../lib/analytics'
import { getFunnelTracker, FunnelStep } from './conversion-funnel'

// User Interaction Types
interface UserInteraction {
  type: string
  element: string
  value?: number
  metadata?: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
}

// Engagement Metrics
interface EngagementMetrics {
  timeOnPage: number
  scrollDepth: number
  clickCount: number
  interactionRate: number
  bounceRate: number
  sessionDuration: number
}

// Form Interaction Data
interface FormInteractionData {
  formId: string
  formName: string
  fieldName: string
  action: 'focus' | 'blur' | 'change' | 'submit' | 'error'
  value?: string
  timeToComplete?: number
  errorType?: string
}

class InteractionTracker {
  private analytics: any
  private funnelTracker: any
  private interactions: UserInteraction[] = []
  private sessionStartTime: number
  private pageStartTime: number
  private isTracking: boolean = false
  private observers: Map<string, IntersectionObserver> = new Map()
  private timers: Map<string, NodeJS.Timeout> = new Map()

  // Tracking state
  private scrollDepth: number = 0
  private clickCount: number = 0
  private timeOnPage: number = 0
  private lastActivity: number = Date.now()
  private isUserActive: boolean = true

  constructor() {
    this.analytics = getAnalytics()
    this.funnelTracker = getFunnelTracker()
    this.sessionStartTime = Date.now()
    this.pageStartTime = Date.now()
    this.initializeTracking()
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined' || this.isTracking) return

    this.isTracking = true
    this.setupScrollTracking()
    this.setupClickTracking()
    this.setupFormTracking()
    this.setupElementVisibilityTracking()
    this.setupUserActivityTracking()
    this.setupVideoTracking()
    this.setupDownloadTracking()
    this.setupSearchTracking()
    this.setupNavigationTracking()
  }

  // Scroll Tracking
  private setupScrollTracking(): void {
    let ticking = false
    const trackScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          const scrollPercent = Math.round((scrollTop / docHeight) * 100)

          if (scrollPercent > this.scrollDepth) {
            this.scrollDepth = scrollPercent
            this.trackScrollMilestone(scrollPercent)
          }

          this.updateActivity()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', trackScroll, { passive: true })
  }

  private trackScrollMilestone(percent: number): void {
    const milestones = [25, 50, 75, 90, 100]
    const milestone = milestones.find(m => percent >= m && percent < m + 5)

    if (milestone) {
      this.trackInteraction('scroll_depth', `scroll_${milestone}`, milestone, {
        scroll_percent: percent,
        page_height: document.documentElement.scrollHeight,
        viewport_height: window.innerHeight
      })

      // Track as micro-conversion for funnel
      this.funnelTracker?.trackMicroConversion(`scroll_${milestone}`, FunnelStep.INTEREST, milestone / 10)
    }
  }

  // Click Tracking
  private setupClickTracking(): void {
    const trackClick = (event: MouseEvent) => {
      this.clickCount++
      this.updateActivity()

      const target = event.target as HTMLElement
      const tagName = target.tagName.toLowerCase()
      const className = target.className || ''
      const id = target.id || ''
      const href = target.getAttribute('href')
      const text = target.textContent?.trim().substring(0, 100) || ''

      // Track different types of clicks
      if (tagName === 'a') {
        this.trackLinkClick(target as HTMLAnchorElement, text)
      } else if (tagName === 'button') {
        this.trackButtonClick(target as HTMLButtonElement, text)
      } else if (target.closest('[data-track]')) {
        this.trackCustomElement(target.closest('[data-track]') as HTMLElement)
      }

      // General click tracking
      this.trackInteraction('click', tagName, 1, {
        element_id: id,
        element_class: className,
        element_text: text,
        element_href: href,
        click_coordinates: { x: event.clientX, y: event.clientY },
        page_coordinates: { x: event.pageX, y: event.pageY }
      })
    }

    document.addEventListener('click', trackClick, true)
  }

  private trackLinkClick(link: HTMLAnchorElement, text: string): void {
    const href = link.href
    const isExternal = href && !href.includes(window.location.hostname)
    const isDownload = link.download || href?.match(/\.(pdf|doc|docx|xls|xlsx|zip|jpg|png)$/i)
    const isEmail = href?.startsWith('mailto:')

    if (isExternal) {
      this.trackInteraction('outbound_click', 'external_link', 1, {
        destination_url: href,
        link_text: text,
        link_domain: new URL(href).hostname
      })
    } else if (isDownload) {
      this.trackInteraction('file_download', 'download_link', 1, {
        file_url: href,
        file_name: link.download || href.split('/').pop(),
        link_text: text
      })
    } else if (isEmail) {
      this.trackInteraction('email_click', 'email_link', 1, {
        email_address: href.replace('mailto:', ''),
        link_text: text
      })
      this.funnelTracker?.trackEmailContact(href.replace('mailto:', ''))
    } else {
      this.trackInteraction('internal_click', 'internal_link', 1, {
        destination_url: href,
        link_text: text
      })
    }
  }

  private trackButtonClick(button: HTMLButtonElement, text: string): void {
    const type = button.type || 'button'
    const form = button.closest('form')
    const isSubmit = type === 'submit' || button.getAttribute('type') === 'submit'

    this.trackInteraction('button_click', type, 1, {
      button_text: text,
      button_type: type,
      form_id: form?.id,
      form_name: form?.getAttribute('name'),
      is_submit: isSubmit
    })

    // Track conversion-oriented buttons
    if (this.isConversionButton(text)) {
      this.funnelTracker?.trackMicroConversion(`button_${text.toLowerCase().replace(/\s+/g, '_')}`, FunnelStep.INTENT, 5)
    }
  }

  private isConversionButton(text: string): boolean {
    const conversionKeywords = [
      'quote', 'contact', 'call', 'book', 'schedule', 'submit',
      'send', 'request', 'get started', 'learn more', 'download'
    ]
    return conversionKeywords.some(keyword =>
      text.toLowerCase().includes(keyword)
    )
  }

  // Form Tracking
  private setupFormTracking(): void {
    const formData = new Map<string, any>()

    const trackFormInteraction = (event: Event, action: FormInteractionData['action']) => {
      const target = event.target as HTMLElement
      const form = target.closest('form')
      const field = target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

      if (!form || !field) return

      const formId = form.id || `form_${Date.now()}`
      const formName = form.getAttribute('name') || form.className || 'unnamed_form'
      const fieldName = field.name || field.id || 'unnamed_field'

      const interactionData: FormInteractionData = {
        formId,
        formName,
        fieldName,
        action,
        value: action !== 'focus' && action !== 'blur' ? field.value : undefined
      }

      // Track form start
      if (action === 'focus' && !formData.has(formId)) {
        formData.set(formId, { startTime: Date.now(), fields: new Set() })
        this.trackInteraction('form_start', 'form_interaction', 1, {
          form_id: formId,
          form_name: formName
        })
        this.funnelTracker?.trackMicroConversion('form_start', FunnelStep.INTENT, 10)
      }

      // Track field interactions
      this.trackInteraction('form_field', action, 1, interactionData)

      // Track form completion
      if (action === 'submit') {
        const formStartData = formData.get(formId)
        const timeToComplete = formStartData ? Date.now() - formStartData.startTime : 0

        this.trackInteraction('form_submit', 'form_interaction', 1, {
          form_id: formId,
          form_name: formName,
          time_to_complete: timeToComplete,
          field_count: form.querySelectorAll('input, textarea, select').length
        })
      }
    }

    // Add event listeners for form interactions
    document.addEventListener('focusin', (e) => trackFormInteraction(e, 'focus'), true)
    document.addEventListener('blur', (e) => trackFormInteraction(e, 'blur'), true)
    document.addEventListener('change', (e) => trackFormInteraction(e, 'change'), true)
    document.addEventListener('submit', (e) => trackFormInteraction(e, 'submit'), true)
  }

  // Element Visibility Tracking
  private setupElementVisibilityTracking(): void {
    const trackableElements = document.querySelectorAll('[data-track-view]')

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement
          const trackingName = element.getAttribute('data-track-view') || 'unnamed_element'

          this.trackInteraction('element_view', 'visibility', 1, {
            element_name: trackingName,
            element_id: element.id,
            element_class: element.className,
            intersection_ratio: entry.intersectionRatio,
            viewport_position: entry.boundingClientRect
          })

          // Stop observing once viewed
          observer.unobserve(element)
        }
      })
    }, { threshold: 0.5 })

    trackableElements.forEach(element => observer.observe(element))
    this.observers.set('visibility', observer)
  }

  // User Activity Tracking
  private setupUserActivityTracking(): void {
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']

    const updateActivity = () => {
      this.lastActivity = Date.now()
      if (!this.isUserActive) {
        this.isUserActive = true
        this.trackInteraction('user_activity', 'return_active', 1)
      }
    }

    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true })
    })

    // Check for inactivity every 30 seconds
    setInterval(() => {
      const inactiveTime = Date.now() - this.lastActivity
      if (inactiveTime > 30000 && this.isUserActive) { // 30 seconds
        this.isUserActive = false
        this.trackInteraction('user_activity', 'inactive', 1, {
          inactive_duration: inactiveTime
        })
      }
    }, 30000)
  }

  // Video Tracking
  private setupVideoTracking(): void {
    const videos = document.querySelectorAll('video')

    videos.forEach(video => {
      const videoSrc = video.src || video.querySelector('source')?.src || 'unknown'
      const videoTitle = video.title || video.getAttribute('data-title') || 'unnamed_video'

      video.addEventListener('play', () => {
        this.trackInteraction('video_play', 'video_interaction', 1, {
          video_title: videoTitle,
          video_src: videoSrc,
          video_duration: video.duration
        })
      })

      video.addEventListener('pause', () => {
        this.trackInteraction('video_pause', 'video_interaction', 1, {
          video_title: videoTitle,
          video_current_time: video.currentTime,
          video_percent: (video.currentTime / video.duration) * 100
        })
      })

      video.addEventListener('ended', () => {
        this.trackInteraction('video_complete', 'video_interaction', 1, {
          video_title: videoTitle,
          video_duration: video.duration
        })
        this.funnelTracker?.trackMicroConversion('video_complete', FunnelStep.CONSIDERATION, 15)
      })
    })
  }

  // Download Tracking
  private setupDownloadTracking(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a') as HTMLAnchorElement

      if (link && (link.download || this.isDownloadLink(link.href))) {
        const fileName = link.download || link.href.split('/').pop() || 'unknown'
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'unknown'

        this.trackInteraction('file_download', 'download', 1, {
          file_name: fileName,
          file_extension: fileExtension,
          file_url: link.href,
          link_text: link.textContent?.trim()
        })

        this.analytics?.trackFileDownload(fileName, fileExtension)
        this.funnelTracker?.trackMicroConversion('file_download', FunnelStep.CONSIDERATION, 10)
      }
    })
  }

  private isDownloadLink(href: string): boolean {
    const downloadExtensions = [
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      'zip', 'rar', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'mp3'
    ]
    return downloadExtensions.some(ext => href.toLowerCase().includes(`.${ext}`))
  }

  // Search Tracking
  private setupSearchTracking(): void {
    const searchForms = document.querySelectorAll('form[role="search"], .search-form, [data-search-form]')

    searchForms.forEach(form => {
      form.addEventListener('submit', (event) => {
        const formData = new FormData(event.target as HTMLFormElement)
        const searchTerm = formData.get('q') || formData.get('search') || formData.get('query') || ''

        if (searchTerm) {
          this.trackInteraction('search', 'site_search', 1, {
            search_term: searchTerm.toString(),
            search_location: window.location.pathname
          })

          this.analytics?.trackSearch(searchTerm.toString())
          this.funnelTracker?.trackMicroConversion('site_search', FunnelStep.CONSIDERATION, 5)
        }
      })
    })
  }

  // Navigation Tracking
  private setupNavigationTracking(): void {
    // Track hash changes
    window.addEventListener('hashchange', () => {
      this.trackInteraction('navigation', 'hash_change', 1, {
        new_hash: window.location.hash,
        previous_hash: document.referrer
      })
    })

    // Track back/forward navigation
    window.addEventListener('popstate', () => {
      this.trackInteraction('navigation', 'popstate', 1, {
        current_url: window.location.href
      })
    })
  }

  // Core Tracking Method
  private trackInteraction(type: string, element: string, value: number = 1, metadata?: Record<string, any>): void {
    if (!this.analytics?.hasAnalyticsConsent()) return

    const interaction: UserInteraction = {
      type,
      element,
      value,
      metadata,
      timestamp: Date.now(),
      sessionId: this.analytics.getSessionId(),
      userId: this.analytics.userId
    }

    this.interactions.push(interaction)

    // Send to GA4
    this.analytics.gtag('event', 'user_interaction', {
      interaction_type: type,
      interaction_element: element,
      interaction_value: value,
      event_category: 'User Interactions',
      event_label: `${type}:${element}`,
      custom_map: metadata
    })

    // Limit stored interactions to prevent memory issues
    if (this.interactions.length > 1000) {
      this.interactions = this.interactions.slice(-500)
    }
  }

  private trackCustomElement(element: HTMLElement): void {
    const trackingData = element.getAttribute('data-track')
    const trackingValue = element.getAttribute('data-track-value')
    const trackingCategory = element.getAttribute('data-track-category') || 'custom'

    if (trackingData) {
      this.trackInteraction(trackingCategory, trackingData, parseInt(trackingValue || '1'), {
        element_id: element.id,
        element_class: element.className,
        element_text: element.textContent?.trim().substring(0, 100)
      })
    }
  }

  private updateActivity(): void {
    this.lastActivity = Date.now()
    this.timeOnPage = Date.now() - this.pageStartTime
  }

  // Public Methods
  public getEngagementMetrics(): EngagementMetrics {
    const sessionDuration = Date.now() - this.sessionStartTime
    const interactionRate = this.interactions.length / (sessionDuration / 60000) // interactions per minute

    return {
      timeOnPage: this.timeOnPage,
      scrollDepth: this.scrollDepth,
      clickCount: this.clickCount,
      interactionRate: Math.round(interactionRate * 100) / 100,
      bounceRate: this.interactions.length <= 1 ? 100 : 0,
      sessionDuration
    }
  }

  public getInteractionHistory(): UserInteraction[] {
    return [...this.interactions]
  }

  public trackCustomEvent(eventName: string, category: string = 'Custom', value: number = 1, metadata?: Record<string, any>): void {
    this.trackInteraction(category.toLowerCase(), eventName, value, metadata)
  }

  // Cleanup
  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect())
    this.timers.forEach(timer => clearTimeout(timer))
    this.isTracking = false
  }
}

// Singleton instance
let interactionTracker: InteractionTracker | null = null

export function getInteractionTracker(): InteractionTracker {
  if (!interactionTracker) {
    interactionTracker = new InteractionTracker()
  }
  return interactionTracker
}

// React Hook for Interaction Tracking
export function useInteractionTracking() {
  const tracker = useRef<InteractionTracker | null>(null)

  useEffect(() => {
    tracker.current = getInteractionTracker()

    return () => {
      // Cleanup on unmount
      tracker.current?.destroy()
    }
  }, [])

  const trackCustomEvent = useCallback((eventName: string, category?: string, value?: number, metadata?: Record<string, any>) => {
    tracker.current?.trackCustomEvent(eventName, category, value, metadata)
  }, [])

  const getEngagementMetrics = useCallback(() => {
    return tracker.current?.getEngagementMetrics()
  }, [])

  return {
    trackCustomEvent,
    getEngagementMetrics,
    getInteractionHistory: () => tracker.current?.getInteractionHistory() || []
  }
}

export { InteractionTracker }
export type { UserInteraction, EngagementMetrics, FormInteractionData }