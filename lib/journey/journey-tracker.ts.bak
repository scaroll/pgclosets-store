// Customer Journey Tracking System - Division 3
// Comprehensive journey mapping with multi-touch attribution and LTV calculation

import type {
  TrafficSource,
  DeviceInfo
} from '../../types/analytics'

// Journey Stage Definitions
export enum JourneyStage {
  // Pre-Awareness
  UNAWARE = 'unaware',

  // Awareness Stage
  PROBLEM_AWARE = 'problem_aware',
  SOLUTION_AWARE = 'solution_aware',

  // Consideration Stage
  BRAND_AWARE = 'brand_aware',
  COMPARING = 'comparing',
  EVALUATING = 'evaluating',

  // Decision Stage
  INTENT = 'intent',
  DECIDING = 'deciding',

  // Purchase Stage
  PURCHASING = 'purchasing',
  ONBOARDING = 'onboarding',

  // Post-Purchase
  USAGE = 'usage',
  RETENTION = 'retention',
  ADVOCACY = 'advocacy'
}

// Customer Personas
export enum CustomerPersona {
  HOMEOWNER_RENOVATOR = 'homeowner_renovator',
  NEW_HOME_BUILDER = 'new_home_builder',
  PROPERTY_FLIPPER = 'property_flipper',
  PROFESSIONAL_ORGANIZER = 'professional_organizer',
  COMMERCIAL_CLIENT = 'commercial_client'
}

// Touchpoint Types
export enum TouchpointType {
  // Digital Touchpoints
  WEBSITE_HOMEPAGE = 'website_homepage',
  WEBSITE_PRODUCT = 'website_product',
  WEBSITE_BLOG = 'website_blog',
  WEBSITE_PRICING = 'website_pricing',
  WEBSITE_GALLERY = 'website_gallery',
  WEBSITE_QUOTE = 'website_quote',

  // Social Media
  SOCIAL_FACEBOOK = 'social_facebook',
  SOCIAL_INSTAGRAM = 'social_instagram',
  SOCIAL_PINTEREST = 'social_pinterest',

  // Paid Advertising
  GOOGLE_ADS = 'google_ads',
  FACEBOOK_ADS = 'facebook_ads',
  DISPLAY_ADS = 'display_ads',

  // Organic Search
  ORGANIC_GOOGLE = 'organic_google',
  ORGANIC_BING = 'organic_bing',

  // Direct Touchpoints
  PHONE_CALL = 'phone_call',
  EMAIL = 'email',
  IN_PERSON = 'in_person',
  REFERRAL = 'referral',

  // Content
  BLOG_POST = 'blog_post',
  VIDEO = 'video',
  GUIDE_DOWNLOAD = 'guide_download',
  CATALOG = 'catalog'
}

// Journey Event Interface
export interface JourneyEvent {
  eventId: string
  userId?: string
  sessionId: string
  timestamp: number
  stage: JourneyStage
  touchpoint: TouchpointType
  action: string
  value?: number
  metadata?: Record<string, any>
  deviceInfo: DeviceInfo
  trafficSource: TrafficSource
  previousTouchpoints: TouchpointType[]
}

// Customer Journey Interface
export interface CustomerJourney {
  journeyId: string
  userId?: string
  persona?: CustomerPersona
  startDate: number
  lastUpdated: number
  currentStage: JourneyStage
  events: JourneyEvent[]
  touchpoints: TouchpointInteraction[]
  conversionGoals: ConversionGoal[]
  totalValue: number
  lifetimeValue: number
  attributionWeights: Map<TouchpointType, number>
  painPoints: PainPoint[]
  satisfactionScore?: number
  npsScore?: number
}

// Touchpoint Interaction
export interface TouchpointInteraction {
  touchpoint: TouchpointType
  firstContact: number
  lastContact: number
  contactCount: number
  totalDuration: number
  averageDuration: number
  conversionContribution: number
  influenceScore: number
}

// Conversion Goal
export interface ConversionGoal {
  goalId: string
  goalType: string
  timestamp: number
  value: number
  touchpointsInvolved: TouchpointType[]
  stage: JourneyStage
}

// Pain Point
export interface PainPoint {
  touchpoint: TouchpointType
  stage: JourneyStage
  issue: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  frequency: number
  impact: number
  timestamp: number
}

// Attribution Model Types
export enum AttributionModel {
  FIRST_TOUCH = 'first_touch',
  LAST_TOUCH = 'last_touch',
  LINEAR = 'linear',
  TIME_DECAY = 'time_decay',
  POSITION_BASED = 'position_based',
  ALGORITHMIC = 'algorithmic'
}

class JourneyTracker {
  private journeys: Map<string, CustomerJourney> = new Map()
  private sessionJourneyMap: Map<string, string> = new Map()
  private personaDetectionRules: Map<CustomerPersona, (events: JourneyEvent[]) => number> = new Map()

  constructor() {
    this.initializePersonaDetection()
    this.restoreJourneys()
  }

  // Initialize persona detection rules
  private initializePersonaDetection(): void {
    // Homeowner Renovator: Single project, detailed research
    this.personaDetectionRules.set(CustomerPersona.HOMEOWNER_RENOVATOR, (events) => {
      let score = 0
      const hasGalleryViews = events.some(e => e.touchpoint === TouchpointType.WEBSITE_GALLERY)
      const hasBlogReads = events.filter(e => e.touchpoint === TouchpointType.BLOG_POST).length
      const hasLongSessions = events.filter(e => (e.metadata?.duration || 0) > 300000).length // 5+ min

      if (hasGalleryViews) score += 30
      if (hasBlogReads > 3) score += 25
      if (hasLongSessions > 1) score += 25
      if (events.filter(e => e.stage === JourneyStage.COMPARING).length > 5) score += 20

      return score
    })

    // New Home Builder: Multiple products, timeline focus
    this.personaDetectionRules.set(CustomerPersona.NEW_HOME_BUILDER, (events) => {
      let score = 0
      const uniqueProducts = new Set(events.map(e => e.metadata?.productId)).size
      const hasTimelineQuestions = events.some(e =>
        e.metadata?.question?.toLowerCase().includes('timeline') ||
        e.metadata?.question?.toLowerCase().includes('schedule')
      )

      if (uniqueProducts > 5) score += 40
      if (hasTimelineQuestions) score += 30
      if (events.some(e => e.touchpoint === TouchpointType.PHONE_CALL)) score += 30

      return score
    })

    // Property Flipper: Speed focus, volume pricing
    this.personaDetectionRules.set(CustomerPersona.PROPERTY_FLIPPER, (events) => {
      let score = 0
      const hasBulkQuote = events.some(e => e.metadata?.quantity && e.metadata.quantity > 10)
      const fastDecision = events[events.length - 1]?.timestamp - events[0]?.timestamp < 86400000 // < 24 hours
      const hasPricingFocus = events.filter(e => e.touchpoint === TouchpointType.WEBSITE_PRICING).length

      if (hasBulkQuote) score += 50
      if (fastDecision) score += 30
      if (hasPricingFocus > 2) score += 20

      return score
    })

    // Professional Organizer: Recurring business, referral source
    this.personaDetectionRules.set(CustomerPersona.PROFESSIONAL_ORGANIZER, (events) => {
      let score = 0
      const isReferral = events.some(e => e.touchpoint === TouchpointType.REFERRAL)
      const hasMultipleQuotes = events.filter(e => e.action === 'quote_request').length > 1

      if (isReferral) score += 40
      if (hasMultipleQuotes) score += 30
      if (events.some(e => e.metadata?.businessName)) score += 30

      return score
    })

    // Commercial Client: Large scale, formal process
    this.personaDetectionRules.set(CustomerPersona.COMMERCIAL_CLIENT, (events) => {
      let score = 0
      const largeValue = events.some(e => (e.value || 0) > 10000)
      const hasCompanyEmail = events.some(e =>
        e.metadata?.email && !e.metadata.email.includes('@gmail') && !e.metadata.email.includes('@yahoo')
      )

      if (largeValue) score += 50
      if (hasCompanyEmail) score += 30
      if (events.some(e => e.touchpoint === TouchpointType.IN_PERSON)) score += 20

      return score
    })
  }

  // Start or retrieve journey
  public trackJourneyEvent(
    sessionId: string,
    stage: JourneyStage,
    touchpoint: TouchpointType,
    action: string,
    value?: number,
    metadata?: Record<string, any>,
    deviceInfo?: DeviceInfo,
    trafficSource?: TrafficSource,
    userId?: string
  ): void {
    let journeyId = this.sessionJourneyMap.get(sessionId)

    if (!journeyId) {
      journeyId = this.createNewJourney(sessionId, userId)
    }

    const journey = this.journeys.get(journeyId)
    if (!journey) return

    // Create journey event
    const event: JourneyEvent = {
      eventId: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      sessionId,
      timestamp: Date.now(),
      stage,
      touchpoint,
      action,
      value,
      metadata,
      deviceInfo: deviceInfo || this.getDeviceInfo(),
      trafficSource: trafficSource || this.getTrafficSource(),
      previousTouchpoints: journey.touchpoints.map(t => t.touchpoint)
    }

    // Add event to journey
    journey.events.push(event)
    journey.lastUpdated = Date.now()
    journey.currentStage = stage

    // Update touchpoint interaction
    this.updateTouchpointInteraction(journey, touchpoint)

    // Update persona if not set
    if (!journey.persona) {
      journey.persona = this.detectPersona(journey.events)
    }

    // Calculate attribution
    if (value) {
      journey.totalValue += value
      this.calculateAttribution(journey, event)
    }

    // Save journey
    this.saveJourney(journey)
  }

  // Create new journey
  private createNewJourney(sessionId: string, userId?: string): string {
    const journeyId = `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const journey: CustomerJourney = {
      journeyId,
      userId,
      persona: undefined,
      startDate: Date.now(),
      lastUpdated: Date.now(),
      currentStage: JourneyStage.UNAWARE,
      events: [],
      touchpoints: [],
      conversionGoals: [],
      totalValue: 0,
      lifetimeValue: 0,
      attributionWeights: new Map(),
      painPoints: [],
      satisfactionScore: undefined,
      npsScore: undefined
    }

    this.journeys.set(journeyId, journey)
    this.sessionJourneyMap.set(sessionId, journeyId)

    return journeyId
  }

  // Update touchpoint interaction
  private updateTouchpointInteraction(journey: CustomerJourney, touchpoint: TouchpointType): void {
    let interaction = journey.touchpoints.find(t => t.touchpoint === touchpoint)

    if (!interaction) {
      interaction = {
        touchpoint,
        firstContact: Date.now(),
        lastContact: Date.now(),
        contactCount: 0,
        totalDuration: 0,
        averageDuration: 0,
        conversionContribution: 0,
        influenceScore: 0
      }
      journey.touchpoints.push(interaction)
    }

    interaction.contactCount++
    interaction.lastContact = Date.now()

    // Calculate average duration
    const sessionDuration = interaction.lastContact - interaction.firstContact
    interaction.totalDuration += sessionDuration
    interaction.averageDuration = interaction.totalDuration / interaction.contactCount
  }

  // Detect customer persona
  private detectPersona(events: JourneyEvent[]): CustomerPersona {
    const scores = new Map<CustomerPersona, number>()

    this.personaDetectionRules.forEach((scoreFn, persona) => {
      scores.set(persona, scoreFn(events))
    })

    // Get highest scoring persona
    let highestScore = 0
    let detectedPersona: CustomerPersona = CustomerPersona.HOMEOWNER_RENOVATOR

    scores.forEach((score, persona) => {
      if (score > highestScore) {
        highestScore = score
        detectedPersona = persona
      }
    })

    return highestScore > 50 ? detectedPersona : CustomerPersona.HOMEOWNER_RENOVATOR
  }

  // Attribution Calculation
  private calculateAttribution(journey: CustomerJourney, event: JourneyEvent): void {
    // Use multiple attribution models
    const attributions = {
      [AttributionModel.FIRST_TOUCH]: this.firstTouchAttribution(journey, event.value || 0),
      [AttributionModel.LAST_TOUCH]: this.lastTouchAttribution(journey, event.value || 0),
      [AttributionModel.LINEAR]: this.linearAttribution(journey, event.value || 0),
      [AttributionModel.TIME_DECAY]: this.timeDecayAttribution(journey, event.value || 0),
      [AttributionModel.POSITION_BASED]: this.positionBasedAttribution(journey, event.value || 0),
      [AttributionModel.ALGORITHMIC]: this.algorithmicAttribution(journey, event.value || 0)
    }

    // Use algorithmic model as primary
    journey.attributionWeights = attributions[AttributionModel.ALGORITHMIC]
  }

  // First Touch Attribution
  private firstTouchAttribution(journey: CustomerJourney, value: number): Map<TouchpointType, number> {
    const weights = new Map<TouchpointType, number>()
    if (journey.touchpoints.length > 0) {
      weights.set(journey.touchpoints[0].touchpoint, value)
    }
    return weights
  }

  // Last Touch Attribution
  private lastTouchAttribution(journey: CustomerJourney, value: number): Map<TouchpointType, number> {
    const weights = new Map<TouchpointType, number>()
    if (journey.touchpoints.length > 0) {
      weights.set(journey.touchpoints[journey.touchpoints.length - 1].touchpoint, value)
    }
    return weights
  }

  // Linear Attribution
  private linearAttribution(journey: CustomerJourney, value: number): Map<TouchpointType, number> {
    const weights = new Map<TouchpointType, number>()
    const equalWeight = value / journey.touchpoints.length

    journey.touchpoints.forEach(touchpoint => {
      weights.set(touchpoint.touchpoint, (weights.get(touchpoint.touchpoint) || 0) + equalWeight)
    })

    return weights
  }

  // Time Decay Attribution
  private timeDecayAttribution(journey: CustomerJourney, value: number): Map<TouchpointType, number> {
    const weights = new Map<TouchpointType, number>()
    const halfLife = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    const now = Date.now()

    let totalWeight = 0
    const touchpointWeights: { touchpoint: TouchpointType; weight: number }[] = []

    journey.touchpoints.forEach(touchpoint => {
      const timeSinceContact = now - touchpoint.lastContact
      const weight = Math.exp(-Math.log(2) * timeSinceContact / halfLife)
      touchpointWeights.push({ touchpoint: touchpoint.touchpoint, weight })
      totalWeight += weight
    })

    // Normalize weights to sum to value
    touchpointWeights.forEach(({ touchpoint, weight }) => {
      weights.set(touchpoint, (value * weight) / totalWeight)
    })

    return weights
  }

  // Position-Based Attribution (40% first, 40% last, 20% middle)
  private positionBasedAttribution(journey: CustomerJourney, value: number): Map<TouchpointType, number> {
    const weights = new Map<TouchpointType, number>()

    if (journey.touchpoints.length === 0) return weights
    if (journey.touchpoints.length === 1) {
      weights.set(journey.touchpoints[0].touchpoint, value)
      return weights
    }

    // First touchpoint gets 40%
    weights.set(journey.touchpoints[0].touchpoint, value * 0.4)

    // Last touchpoint gets 40%
    const lastIndex = journey.touchpoints.length - 1
    weights.set(
      journey.touchpoints[lastIndex].touchpoint,
      (weights.get(journey.touchpoints[lastIndex].touchpoint) || 0) + value * 0.4
    )

    // Middle touchpoints split 20%
    if (journey.touchpoints.length > 2) {
      const middleWeight = (value * 0.2) / (journey.touchpoints.length - 2)
      for (let i = 1; i < lastIndex; i++) {
        weights.set(
          journey.touchpoints[i].touchpoint,
          (weights.get(journey.touchpoints[i].touchpoint) || 0) + middleWeight
        )
      }
    }

    return weights
  }

  // Algorithmic Attribution (custom weighted)
  private algorithmicAttribution(journey: CustomerJourney, value: number): Map<TouchpointType, number> {
    const weights = new Map<TouchpointType, number>()

    // Calculate influence scores based on multiple factors
    let totalInfluence = 0
    const influenceScores: { touchpoint: TouchpointType; score: number }[] = []

    journey.touchpoints.forEach((touchpoint, index) => {
      let influenceScore = 0

      // Recency (30%): More recent touchpoints have higher influence
      const recency = 1 - (Date.now() - touchpoint.lastContact) / (Date.now() - journey.startDate)
      influenceScore += recency * 0.3

      // Frequency (20%): More frequent touchpoints have higher influence
      const maxFrequency = Math.max(...journey.touchpoints.map(t => t.contactCount))
      const frequency = touchpoint.contactCount / maxFrequency
      influenceScore += frequency * 0.2

      // Position (20%): First and last touchpoints are more important
      const positionWeight = index === 0 || index === journey.touchpoints.length - 1 ? 0.2 : 0.1
      influenceScore += positionWeight

      // Duration (15%): Longer engagement shows higher interest
      const maxDuration = Math.max(...journey.touchpoints.map(t => t.averageDuration))
      const durationWeight = maxDuration > 0 ? touchpoint.averageDuration / maxDuration : 0
      influenceScore += durationWeight * 0.15

      // Conversion proximity (15%): Touchpoints closer to conversion get more credit
      const conversionProximity = 1 - index / journey.touchpoints.length
      influenceScore += conversionProximity * 0.15

      touchpoint.influenceScore = influenceScore
      influenceScores.push({ touchpoint: touchpoint.touchpoint, score: influenceScore })
      totalInfluence += influenceScore
    })

    // Distribute value based on influence scores
    influenceScores.forEach(({ touchpoint, score }) => {
      weights.set(touchpoint, (value * score) / totalInfluence)
    })

    return weights
  }

  // Calculate Customer Lifetime Value
  public calculateLifetimeValue(journeyId: string): number {
    const journey = this.journeys.get(journeyId)
    if (!journey) return 0

    // Base LTV calculation
    let ltv = journey.totalValue

    // Adjust based on persona
    const personaMultipliers: Record<CustomerPersona, number> = {
      [CustomerPersona.HOMEOWNER_RENOVATOR]: 1.0,
      [CustomerPersona.NEW_HOME_BUILDER]: 1.5,
      [CustomerPersona.PROPERTY_FLIPPER]: 2.0,
      [CustomerPersona.PROFESSIONAL_ORGANIZER]: 3.0,
      [CustomerPersona.COMMERCIAL_CLIENT]: 4.0
    }

    if (journey.persona) {
      ltv *= personaMultipliers[journey.persona]
    }

    // Adjust based on engagement metrics
    const engagementScore = this.calculateEngagementScore(journey)
    ltv *= (1 + engagementScore / 100)

    // Adjust based on satisfaction/NPS if available
    if (journey.npsScore !== undefined) {
      if (journey.npsScore >= 9) ltv *= 1.5 // Promoters
      else if (journey.npsScore <= 6) ltv *= 0.7 // Detractors
    }

    journey.lifetimeValue = Math.round(ltv)
    return journey.lifetimeValue
  }

  // Calculate engagement score
  private calculateEngagementScore(journey: CustomerJourney): number {
    let score = 0

    // Touchpoint diversity
    score += Math.min(journey.touchpoints.length * 5, 30)

    // Event count
    score += Math.min(journey.events.length * 2, 40)

    // Journey duration (optimal is 7-30 days)
    const durationDays = (Date.now() - journey.startDate) / (24 * 60 * 60 * 1000)
    if (durationDays >= 7 && durationDays <= 30) score += 20
    else if (durationDays > 30) score += 10

    // Conversion goals achieved
    score += Math.min(journey.conversionGoals.length * 10, 30)

    return Math.min(score, 100)
  }

  // Track pain point
  public trackPainPoint(
    journeyId: string,
    touchpoint: TouchpointType,
    stage: JourneyStage,
    issue: string,
    severity: PainPoint['severity']
  ): void {
    const journey = this.journeys.get(journeyId)
    if (!journey) return

    const painPoint: PainPoint = {
      touchpoint,
      stage,
      issue,
      severity,
      frequency: 1,
      impact: this.calculatePainPointImpact(severity),
      timestamp: Date.now()
    }

    // Check if similar pain point exists
    const existing = journey.painPoints.find(
      p => p.touchpoint === touchpoint && p.stage === stage && p.issue === issue
    )

    if (existing) {
      existing.frequency++
      existing.timestamp = Date.now()
    } else {
      journey.painPoints.push(painPoint)
    }

    this.saveJourney(journey)
  }

  // Calculate pain point impact
  private calculatePainPointImpact(severity: PainPoint['severity']): number {
    const impactMap = {
      low: 10,
      medium: 30,
      high: 60,
      critical: 100
    }
    return impactMap[severity]
  }

  // Track conversion goal
  public trackConversionGoal(
    journeyId: string,
    goalType: string,
    value: number,
    touchpointsInvolved: TouchpointType[],
    stage: JourneyStage
  ): void {
    const journey = this.journeys.get(journeyId)
    if (!journey) return

    const goal: ConversionGoal = {
      goalId: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      goalType,
      timestamp: Date.now(),
      value,
      touchpointsInvolved,
      stage
    }

    journey.conversionGoals.push(goal)
    journey.totalValue += value

    this.saveJourney(journey)
  }

  // Get journey insights
  public getJourneyInsights(journeyId: string): any {
    const journey = this.journeys.get(journeyId)
    if (!journey) return null

    return {
      journeyId: journey.journeyId,
      persona: journey.persona,
      currentStage: journey.currentStage,
      durationDays: Math.round((Date.now() - journey.startDate) / (24 * 60 * 60 * 1000)),
      totalEvents: journey.events.length,
      touchpointCount: journey.touchpoints.length,
      topTouchpoints: this.getTopTouchpoints(journey, 5),
      conversionGoals: journey.conversionGoals.length,
      totalValue: journey.totalValue,
      lifetimeValue: this.calculateLifetimeValue(journeyId),
      attributionBreakdown: this.getAttributionBreakdown(journey),
      painPoints: journey.painPoints,
      engagementScore: this.calculateEngagementScore(journey),
      predictedChurn: this.predictChurnRisk(journey)
    }
  }

  // Get top touchpoints
  private getTopTouchpoints(journey: CustomerJourney, limit: number): TouchpointInteraction[] {
    return journey.touchpoints
      .sort((a, b) => b.influenceScore - a.influenceScore)
      .slice(0, limit)
  }

  // Get attribution breakdown
  private getAttributionBreakdown(journey: CustomerJourney): any[] {
    const breakdown: any[] = []

    journey.attributionWeights.forEach((value, touchpoint) => {
      breakdown.push({
        touchpoint,
        value,
        percentage: (value / journey.totalValue) * 100
      })
    })

    return breakdown.sort((a, b) => b.value - a.value)
  }

  // Predict churn risk
  private predictChurnRisk(journey: CustomerJourney): number {
    let churnScore = 0

    // Days since last activity
    const daysSinceActivity = (Date.now() - journey.lastUpdated) / (24 * 60 * 60 * 1000)
    if (daysSinceActivity > 30) churnScore += 40
    else if (daysSinceActivity > 14) churnScore += 25
    else if (daysSinceActivity > 7) churnScore += 10

    // Pain points
    const criticalPainPoints = journey.painPoints.filter(p => p.severity === 'critical').length
    const highPainPoints = journey.painPoints.filter(p => p.severity === 'high').length
    churnScore += criticalPainPoints * 15
    churnScore += highPainPoints * 8

    // Low engagement
    const engagementScore = this.calculateEngagementScore(journey)
    if (engagementScore < 30) churnScore += 25

    // NPS score
    if (journey.npsScore !== undefined && journey.npsScore <= 6) churnScore += 30

    return Math.min(churnScore, 100)
  }

  // Utility methods
  private getDeviceInfo(): DeviceInfo {
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920

    return {
      userAgent,
      screenResolution: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
      viewportSize: `${width}x${typeof window !== 'undefined' ? window.innerHeight : 1080}`,
      deviceType: width <= 768 ? 'mobile' : width <= 1024 ? 'tablet' : 'desktop',
      operatingSystem: userAgent.includes('Mac') ? 'macOS' : userAgent.includes('Windows') ? 'Windows' : 'Other',
      browser: userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : 'Other',
      isBot: /bot|crawler|spider/i.test(userAgent)
    }
  }

  private getTrafficSource(): TrafficSource {
    const referrer = typeof document !== 'undefined' ? document.referrer : ''
    const url = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams()

    return {
      source: url.get('utm_source') || (referrer ? new URL(referrer).hostname : 'direct'),
      medium: url.get('utm_medium') || 'organic',
      campaign: url.get('utm_campaign') || undefined,
      referrer: referrer || undefined,
      utmSource: url.get('utm_source') || undefined,
      utmMedium: url.get('utm_medium') || undefined,
      utmCampaign: url.get('utm_campaign') || undefined,
      utmTerm: url.get('utm_term') || undefined,
      utmContent: url.get('utm_content') || undefined
    }
  }

  // Storage methods
  private saveJourney(journey: CustomerJourney): void {
    if (typeof localStorage === 'undefined') return

    try {
      const journeys = this.getAllJourneys()
      const serializedJourney = {
        ...journey,
        attributionWeights: Array.from(journey.attributionWeights.entries())
      }
      journeys[journey.journeyId] = serializedJourney
      localStorage.setItem('customer_journeys', JSON.stringify(journeys))
    } catch (error) {
      console.warn('Failed to save journey:', error)
    }
  }

  private restoreJourneys(): void {
    if (typeof localStorage === 'undefined') return

    try {
      const stored = localStorage.getItem('customer_journeys')
      if (stored) {
        const journeys = JSON.parse(stored)
        Object.values(journeys).forEach((journey: any) => {
          journey.attributionWeights = new Map(journey.attributionWeights || [])
          this.journeys.set(journey.journeyId, journey as CustomerJourney)
        })
      }
    } catch (error) {
      console.warn('Failed to restore journeys:', error)
    }
  }

  private getAllJourneys(): any {
    try {
      const stored = localStorage.getItem('customer_journeys')
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      return {}
    }
  }

  // Public API
  public getJourney(journeyId: string): CustomerJourney | undefined {
    return this.journeys.get(journeyId)
  }

  public getAllUserJourneys(userId: string): CustomerJourney[] {
    return Array.from(this.journeys.values()).filter(j => j.userId === userId)
  }

  public getSessionJourney(sessionId: string): CustomerJourney | undefined {
    const journeyId = this.sessionJourneyMap.get(sessionId)
    return journeyId ? this.journeys.get(journeyId) : undefined
  }
}

// Singleton instance
let journeyTracker: JourneyTracker | null = null

export function getJourneyTracker(): JourneyTracker {
  if (!journeyTracker) {
    journeyTracker = new JourneyTracker()
  }
  return journeyTracker
}

export { JourneyTracker }
