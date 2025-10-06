/**
 * DIVISION 5: CONVERSION RATE OPTIMIZATION
 * A/B Testing Framework (Agents 1-5)
 *
 * Comprehensive A/B testing system with variant management,
 * statistical analysis, and automatic winner selection
 */

export interface ABTestVariant {
  id: string
  name: string
  description: string
  weight: number // 0-1, percentage of traffic
  config: Record<string, any>
  metrics: {
    impressions: number
    conversions: number
    conversionRate: number
    revenue: number
    bounceRate: number
    avgTimeOnPage: number
  }
  startDate: Date
  endDate?: Date
  status: 'draft' | 'active' | 'paused' | 'completed' | 'winner'
}

export interface ABTest {
  id: string
  name: string
  description: string
  hypothesis: string
  variants: ABTestVariant[]
  targetMetric: 'conversion_rate' | 'revenue' | 'engagement' | 'bounce_rate'
  minimumSampleSize: number
  confidenceLevel: number // 0.95 = 95%
  startDate: Date
  endDate?: Date
  status: 'draft' | 'active' | 'paused' | 'completed'
  winner?: string // variant id
  pages: string[] // URLs where test runs
  audience?: {
    segments?: string[]
    devices?: ('mobile' | 'tablet' | 'desktop')[]
    traffic?: number // percentage
  }
}

export class ABTestingFramework {
  private tests: Map<string, ABTest> = new Map()
  private userAssignments: Map<string, Map<string, string>> = new Map() // userId -> testId -> variantId
  private storageKey = 'ab_test_assignments'

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadAssignments()
    }
  }

  /**
   * Create a new A/B test
   */
  createTest(test: Omit<ABTest, 'id' | 'status'>): ABTest {
    const id = this.generateId()
    const newTest: ABTest = {
      ...test,
      id,
      status: 'draft',
      variants: test.variants.map(v => ({
        ...v,
        metrics: {
          impressions: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0,
          bounceRate: 0,
          avgTimeOnPage: 0
        }
      }))
    }

    this.tests.set(id, newTest)
    return newTest
  }

  /**
   * Get variant for user (with sticky assignment)
   */
  getVariant(testId: string, userId: string): ABTestVariant | null {
    const test = this.tests.get(testId)
    if (!test || test.status !== 'active') return null

    // Check existing assignment
    const userTests = this.userAssignments.get(userId)
    if (userTests?.has(testId)) {
      const variantId = userTests.get(testId)!
      return test.variants.find(v => v.id === variantId) || null
    }

    // Assign new variant based on weights
    const variant = this.assignVariant(test.variants, userId)

    // Store assignment
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map())
    }
    this.userAssignments.get(userId)!.set(testId, variant.id)
    this.saveAssignments()

    return variant
  }

  /**
   * Assign variant based on weights
   */
  private assignVariant(variants: ABTestVariant[], userId: string): ABTestVariant {
    // Generate consistent random number for user
    const hash = this.hashString(userId)
    const random = (hash % 10000) / 10000

    let cumulative = 0
    for (const variant of variants) {
      cumulative += variant.weight
      if (random <= cumulative) {
        return variant
      }
    }

    return variants[0] // Fallback
  }

  /**
   * Track impression
   */
  trackImpression(testId: string, variantId: string): void {
    const test = this.tests.get(testId)
    if (!test) return

    const variant = test.variants.find(v => v.id === variantId)
    if (variant) {
      variant.metrics.impressions++
      this.calculateMetrics(test)
    }
  }

  /**
   * Track conversion
   */
  trackConversion(testId: string, variantId: string, revenue: number = 0): void {
    const test = this.tests.get(testId)
    if (!test) return

    const variant = test.variants.find(v => v.id === variantId)
    if (variant) {
      variant.metrics.conversions++
      variant.metrics.revenue += revenue
      this.calculateMetrics(test)
      this.checkForWinner(test)
    }
  }

  /**
   * Track engagement metrics
   */
  trackEngagement(testId: string, variantId: string, timeOnPage: number, bounced: boolean): void {
    const test = this.tests.get(testId)
    if (!test) return

    const variant = test.variants.find(v => v.id === variantId)
    if (variant) {
      // Update average time on page
      const totalTime = variant.metrics.avgTimeOnPage * variant.metrics.impressions
      variant.metrics.avgTimeOnPage = (totalTime + timeOnPage) / (variant.metrics.impressions + 1)

      // Update bounce rate
      if (bounced) {
        const totalBounces = variant.metrics.bounceRate * variant.metrics.impressions
        variant.metrics.bounceRate = (totalBounces + 1) / (variant.metrics.impressions + 1)
      }
    }
  }

  /**
   * Calculate conversion rates
   */
  private calculateMetrics(test: ABTest): void {
    test.variants.forEach(variant => {
      if (variant.metrics.impressions > 0) {
        variant.metrics.conversionRate = variant.metrics.conversions / variant.metrics.impressions
      }
    })
  }

  /**
   * Check if test has a statistical winner
   */
  private checkForWinner(test: ABTest): void {
    if (test.variants.length !== 2) return // Currently only support 2-variant tests

    const [control, treatment] = test.variants

    // Check minimum sample size
    if (control.metrics.impressions < test.minimumSampleSize ||
        treatment.metrics.impressions < test.minimumSampleSize) {
      return
    }

    // Calculate Z-score for conversion rate difference
    const p1 = control.metrics.conversionRate
    const p2 = treatment.metrics.conversionRate
    const n1 = control.metrics.impressions
    const n2 = treatment.metrics.impressions

    const pPooled = (control.metrics.conversions + treatment.metrics.conversions) / (n1 + n2)
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1/n1 + 1/n2))

    if (se === 0) return

    const zScore = Math.abs((p1 - p2) / se)

    // Z-score for 95% confidence is 1.96
    const criticalValue = test.confidenceLevel === 0.95 ? 1.96 :
                          test.confidenceLevel === 0.99 ? 2.576 : 1.96

    if (zScore >= criticalValue) {
      // We have a winner!
      const winner = p2 > p1 ? treatment : control
      winner.status = 'winner'
      test.winner = winner.id
      test.status = 'completed'

      // Notify about winner
      this.notifyWinner(test, winner)
    }
  }

  /**
   * Get test results with statistical analysis
   */
  getTestResults(testId: string): ABTestResults | null {
    const test = this.tests.get(testId)
    if (!test) return null

    const variantResults = test.variants.map(variant => ({
      variant,
      uplift: this.calculateUplift(test, variant),
      significance: this.calculateSignificance(test, variant),
      confidenceInterval: this.calculateConfidenceInterval(variant)
    }))

    return {
      test,
      variants: variantResults,
      recommendation: this.getRecommendation(test, variantResults)
    }
  }

  /**
   * Calculate uplift relative to control
   */
  private calculateUplift(test: ABTest, variant: ABTestVariant): number {
    const control = test.variants[0]
    if (variant.id === control.id) return 0

    const controlRate = control.metrics.conversionRate
    if (controlRate === 0) return 0

    return ((variant.metrics.conversionRate - controlRate) / controlRate) * 100
  }

  /**
   * Calculate statistical significance
   */
  private calculateSignificance(test: ABTest, variant: ABTestVariant): number {
    const control = test.variants[0]
    if (variant.id === control.id) return 0

    const p1 = control.metrics.conversionRate
    const p2 = variant.metrics.conversionRate
    const n1 = control.metrics.impressions
    const n2 = variant.metrics.impressions

    if (n1 === 0 || n2 === 0) return 0

    const pPooled = (control.metrics.conversions + variant.metrics.conversions) / (n1 + n2)
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1/n1 + 1/n2))

    if (se === 0) return 0

    const zScore = (p2 - p1) / se

    // Convert Z-score to p-value (approximation)
    const pValue = 1 - this.normalCDF(Math.abs(zScore))

    return 1 - pValue // Confidence level
  }

  /**
   * Calculate confidence interval
   */
  private calculateConfidenceInterval(variant: ABTestVariant): [number, number] {
    const p = variant.metrics.conversionRate
    const n = variant.metrics.impressions

    if (n === 0) return [0, 0]

    const z = 1.96 // 95% confidence
    const se = Math.sqrt((p * (1 - p)) / n)

    return [
      Math.max(0, p - z * se),
      Math.min(1, p + z * se)
    ]
  }

  /**
   * Normal CDF approximation
   */
  private normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x))
    const d = 0.3989423 * Math.exp(-x * x / 2)
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    return x > 0 ? 1 - p : p
  }

  /**
   * Get recommendation
   */
  private getRecommendation(test: ABTest, results: VariantResults[]): string {
    const winner = results.find(r => r.variant.status === 'winner')

    if (winner) {
      return `${winner.variant.name} is the winner with ${winner.uplift.toFixed(2)}% uplift and ${(winner.significance * 100).toFixed(1)}% confidence`
    }

    const needMoreData = results.every(r =>
      r.variant.metrics.impressions < test.minimumSampleSize
    )

    if (needMoreData) {
      return 'Need more data to reach statistical significance'
    }

    const bestVariant = results.reduce((best, current) =>
      current.variant.metrics.conversionRate > best.variant.metrics.conversionRate ? current : best
    )

    return `${bestVariant.variant.name} is leading with ${bestVariant.uplift.toFixed(2)}% uplift, but not yet statistically significant`
  }

  /**
   * Notify about winner
   */
  private notifyWinner(test: ABTest, winner: ABTestVariant): void {
    if (typeof window !== 'undefined') {
      console.log(`🎉 A/B Test Winner: ${test.name} - ${winner.name}`)

      // Could integrate with analytics, email, Slack, etc.
      window.dispatchEvent(new CustomEvent('ab-test-winner', {
        detail: { test, winner }
      }))
    }
  }

  /**
   * Utility: Generate ID
   */
  private generateId(): string {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Utility: Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  /**
   * Save assignments to localStorage
   */
  private saveAssignments(): void {
    if (typeof window === 'undefined') return

    const data: Record<string, Record<string, string>> = {}
    this.userAssignments.forEach((tests, userId) => {
      data[userId] = {}
      tests.forEach((variantId, testId) => {
        data[userId][testId] = variantId
      })
    })

    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  /**
   * Load assignments from localStorage
   */
  private loadAssignments(): void {
    if (typeof window === 'undefined') return

    try {
      const data = localStorage.getItem(this.storageKey)
      if (data) {
        const parsed = JSON.parse(data)
        Object.entries(parsed).forEach(([userId, tests]) => {
          const testMap = new Map(Object.entries(tests as Record<string, string>))
          this.userAssignments.set(userId, testMap)
        })
      }
    } catch (error) {
      console.error('Failed to load A/B test assignments:', error)
    }
  }

  /**
   * Export test data
   */
  exportTestData(testId: string): string {
    const results = this.getTestResults(testId)
    return JSON.stringify(results, null, 2)
  }

  /**
   * Get all active tests
   */
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(test => test.status === 'active')
  }

  /**
   * Pause test
   */
  pauseTest(testId: string): void {
    const test = this.tests.get(testId)
    if (test) {
      test.status = 'paused'
    }
  }

  /**
   * Resume test
   */
  resumeTest(testId: string): void {
    const test = this.tests.get(testId)
    if (test && test.status === 'paused') {
      test.status = 'active'
    }
  }

  /**
   * End test and select winner manually
   */
  endTest(testId: string, winnerId?: string): void {
    const test = this.tests.get(testId)
    if (test) {
      test.status = 'completed'
      test.endDate = new Date()

      if (winnerId) {
        const winner = test.variants.find(v => v.id === winnerId)
        if (winner) {
          winner.status = 'winner'
          test.winner = winnerId
        }
      }
    }
  }
}

// Types
export interface ABTestResults {
  test: ABTest
  variants: VariantResults[]
  recommendation: string
}

export interface VariantResults {
  variant: ABTestVariant
  uplift: number
  significance: number
  confidenceInterval: [number, number]
}

// Singleton instance
let framework: ABTestingFramework | null = null

export function getABTestingFramework(): ABTestingFramework {
  if (!framework) {
    framework = new ABTestingFramework()
  }
  return framework
}

/**
 * React Hook for A/B Testing
 */
export function useABTest(testId: string, userId: string) {
  const framework = getABTestingFramework()
  const variant = framework.getVariant(testId, userId)

  return {
    variant,
    trackImpression: () => variant && framework.trackImpression(testId, variant.id),
    trackConversion: (revenue?: number) => variant && framework.trackConversion(testId, variant.id, revenue),
    trackEngagement: (timeOnPage: number, bounced: boolean) =>
      variant && framework.trackEngagement(testId, variant.id, timeOnPage, bounced)
  }
}
