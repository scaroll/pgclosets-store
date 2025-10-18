/**
 * CONVERSION OPTIMIZATION AGENTS #31-35
 * Agent #31: A/B Testing Framework with Vercel Edge Config
 *
 * Production-ready A/B testing infrastructure with:
 * - Vercel Edge Config integration for zero-latency variant assignment
 * - Statistical significance calculations
 * - Multi-variate testing support
 * - Automatic winner determination
 * - Experiment tracking and analytics
 */

import { get } from '@vercel/edge-config';

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1, percentage of traffic
  config: Record<string, any>;
  metrics: {
    impressions: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    bounceRate: number;
    avgTimeOnPage: number;
    clickThroughRate: number;
  };
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'winner';
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  hypothesis: string;
  variants: ABTestVariant[];
  targetMetric: 'conversion_rate' | 'revenue' | 'engagement' | 'bounce_rate' | 'ctr';
  minimumSampleSize: number;
  confidenceLevel: number; // 0.95 = 95%
  startDate: Date;
  endDate?: Date;
  status: 'draft' | 'active' | 'paused' | 'completed';
  winner?: string; // variant id
  pages: string[]; // URLs where test runs
  audience?: {
    segments?: string[];
    devices?: ('mobile' | 'tablet' | 'desktop')[];
    traffic?: number; // percentage
    geoLocations?: string[];
    newVsReturning?: 'new' | 'returning' | 'all';
  };
  tags?: string[];
}

export interface ABTestResults {
  test: ABTest;
  variants: VariantResults[];
  recommendation: string;
  confidence: number;
  estimatedTimeToSignificance?: number;
  expectedLift?: number;
}

export interface VariantResults {
  variant: ABTestVariant;
  uplift: number;
  significance: number;
  confidenceInterval: [number, number];
  pValue: number;
  expectedValue: number;
}

/**
 * A/B Testing Framework with Vercel Edge Config
 */
export class ABTestingFramework {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map();
  private storageKey = 'ab_test_assignments';
  private useEdgeConfig: boolean;

  constructor(useEdgeConfig: boolean = true) {
    this.useEdgeConfig = useEdgeConfig;
    if (typeof window !== 'undefined') {
      this.loadAssignments();
    }
  }

  /**
   * Get variant from Edge Config (zero-latency)
   */
  async getVariantFromEdge(testId: string, userId: string): Promise<ABTestVariant | null> {
    try {
      const test = await get<ABTest>(`ab_test_${testId}`);
      if (!test || test.status !== 'active') return null;

      return this.assignVariantToUser(test, userId);
    } catch (error) {
      console.error('Edge Config error:', error);
      return this.getVariantLocal(testId, userId);
    }
  }

  /**
   * Get variant locally (fallback)
   */
  getVariantLocal(testId: string, userId: string): ABTestVariant | null {
    const test = this.tests.get(testId);
    if (!test || test.status !== 'active') return null;

    return this.assignVariantToUser(test, userId);
  }

  /**
   * Assign variant to user with sticky assignment
   */
  private assignVariantToUser(test: ABTest, userId: string): ABTestVariant | null {
    // Check existing assignment
    const userTests = this.userAssignments.get(userId);
    if (userTests?.has(test.id)) {
      const variantId = userTests.get(test.id)!;
      return test.variants.find(v => v.id === variantId) || null;
    }

    // Check audience targeting
    if (!this.isUserInAudience(test, userId)) {
      return null;
    }

    // Assign new variant based on weights
    const variant = this.assignVariantByWeight(test.variants, userId);

    // Store assignment
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }
    this.userAssignments.get(userId)!.set(test.id, variant.id);
    this.saveAssignments();

    return variant;
  }

  /**
   * Check if user matches audience targeting
   */
  private isUserInAudience(test: ABTest, userId: string): boolean {
    if (!test.audience) return true;

    // Device targeting
    if (test.audience.devices && typeof window !== 'undefined') {
      const device = this.detectDevice();
      if (!test.audience.devices.includes(device)) return false;
    }

    // Traffic percentage
    if (test.audience.traffic !== undefined) {
      const hash = this.hashString(userId + test.id);
      const userPercentage = (hash % 100) / 100;
      if (userPercentage > test.audience.traffic) return false;
    }

    return true;
  }

  /**
   * Detect device type
   */
  private detectDevice(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';

    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  /**
   * Assign variant based on weights (consistent hashing)
   */
  private assignVariantByWeight(variants: ABTestVariant[], userId: string): ABTestVariant {
    const hash = this.hashString(userId);
    const random = (hash % 10000) / 10000;

    let cumulative = 0;
    for (const variant of variants) {
      cumulative += variant.weight;
      if (random <= cumulative) {
        return variant;
      }
    }

    return variants[0]; // Fallback
  }

  /**
   * Track impression
   */
  async trackImpression(testId: string, variantId: string, metadata?: Record<string, any>): Promise<void> {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.metrics.impressions++;
      this.calculateMetrics(test);

      // Send to analytics
      await this.sendAnalyticsEvent('ab_test_impression', {
        testId,
        testName: test.name,
        variantId,
        variantName: variant.name,
        ...metadata
      });
    }
  }

  /**
   * Track conversion
   */
  async trackConversion(
    testId: string,
    variantId: string,
    revenue: number = 0,
    metadata?: Record<string, any>
  ): Promise<void> {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (variant) {
      variant.metrics.conversions++;
      variant.metrics.revenue += revenue;
      this.calculateMetrics(test);

      // Check for statistical significance
      await this.checkForWinner(test);

      // Send to analytics
      await this.sendAnalyticsEvent('ab_test_conversion', {
        testId,
        testName: test.name,
        variantId,
        variantName: variant.name,
        revenue,
        ...metadata
      });
    }
  }

  /**
   * Track engagement metrics
   */
  async trackEngagement(
    testId: string,
    variantId: string,
    metrics: {
      timeOnPage?: number;
      bounced?: boolean;
      clicked?: boolean;
    }
  ): Promise<void> {
    const test = this.tests.get(testId);
    if (!test) return;

    const variant = test.variants.find(v => v.id === variantId);
    if (!variant) return;

    // Update time on page
    if (metrics.timeOnPage !== undefined) {
      const totalTime = variant.metrics.avgTimeOnPage * variant.metrics.impressions;
      variant.metrics.avgTimeOnPage = (totalTime + metrics.timeOnPage) / (variant.metrics.impressions);
    }

    // Update bounce rate
    if (metrics.bounced !== undefined && metrics.bounced) {
      const totalBounces = variant.metrics.bounceRate * variant.metrics.impressions;
      variant.metrics.bounceRate = (totalBounces + 1) / variant.metrics.impressions;
    }

    // Update CTR
    if (metrics.clicked !== undefined && metrics.clicked) {
      const totalClicks = variant.metrics.clickThroughRate * variant.metrics.impressions;
      variant.metrics.clickThroughRate = (totalClicks + 1) / variant.metrics.impressions;
    }
  }

  /**
   * Calculate conversion rates
   */
  private calculateMetrics(test: ABTest): void {
    test.variants.forEach(variant => {
      if (variant.metrics.impressions > 0) {
        variant.metrics.conversionRate = variant.metrics.conversions / variant.metrics.impressions;
      }
    });
  }

  /**
   * Check for statistical winner using Bayesian approach
   */
  private async checkForWinner(test: ABTest): Promise<void> {
    if (test.variants.length < 2) return;

    const control = test.variants[0];
    const treatment = test.variants[1];

    // Check minimum sample size
    if (control.metrics.impressions < test.minimumSampleSize ||
        treatment.metrics.impressions < test.minimumSampleSize) {
      return;
    }

    // Calculate statistical significance
    const results = this.calculateSignificance(control, treatment);

    // Check if we have a winner (95% confidence by default)
    if (results.significance >= test.confidenceLevel && results.pValue < 0.05) {
      const winner = treatment.metrics.conversionRate > control.metrics.conversionRate
        ? treatment
        : control;

      winner.status = 'winner';
      test.winner = winner.id;
      test.status = 'completed';
      test.endDate = new Date();

      // Notify about winner
      await this.notifyWinner(test, winner, results);
    }
  }

  /**
   * Calculate statistical significance using Z-test
   */
  private calculateSignificance(
    control: ABTestVariant,
    treatment: ABTestVariant
  ): { significance: number; pValue: number; zScore: number } {
    const p1 = control.metrics.conversionRate;
    const p2 = treatment.metrics.conversionRate;
    const n1 = control.metrics.impressions;
    const n2 = treatment.metrics.impressions;

    if (n1 === 0 || n2 === 0) {
      return { significance: 0, pValue: 1, zScore: 0 };
    }

    // Pooled proportion
    const pPooled = (control.metrics.conversions + treatment.metrics.conversions) / (n1 + n2);

    // Standard error
    const se = Math.sqrt(pPooled * (1 - pPooled) * (1/n1 + 1/n2));

    if (se === 0) {
      return { significance: 0, pValue: 1, zScore: 0 };
    }

    // Z-score
    const zScore = (p2 - p1) / se;

    // P-value (two-tailed)
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));

    // Significance level (confidence)
    const significance = 1 - pValue;

    return { significance, pValue, zScore };
  }

  /**
   * Normal CDF (cumulative distribution function)
   */
  private normalCDF(x: number): number {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const probability = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - probability : probability;
  }

  /**
   * Calculate expected time to significance
   */
  calculateTimeToSignificance(test: ABTest): number | null {
    if (test.variants.length !== 2) return null;

    const [control, treatment] = test.variants;

    if (control.metrics.impressions === 0 || treatment.metrics.impressions === 0) {
      return null;
    }

    const currentRate = control.metrics.impressions /
      ((new Date().getTime() - test.startDate.getTime()) / (1000 * 60 * 60)); // per hour

    const remainingSamples = Math.max(
      test.minimumSampleSize - control.metrics.impressions,
      test.minimumSampleSize - treatment.metrics.impressions
    );

    return remainingSamples / currentRate; // hours
  }

  /**
   * Get comprehensive test results
   */
  getTestResults(testId: string): ABTestResults | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    const variantResults = test.variants.map(variant => {
      const control = test.variants[0];
      const stats = variant.id === control.id
        ? { significance: 0, pValue: 1, zScore: 0 }
        : this.calculateSignificance(control, variant);

      return {
        variant,
        uplift: this.calculateUplift(test, variant),
        significance: stats.significance,
        pValue: stats.pValue,
        confidenceInterval: this.calculateConfidenceInterval(variant),
        expectedValue: this.calculateExpectedValue(variant)
      };
    });

    const timeToSignificance = this.calculateTimeToSignificance(test);

    return {
      test,
      variants: variantResults,
      recommendation: this.getRecommendation(test, variantResults),
      confidence: Math.max(...variantResults.map(v => v.significance)),
      estimatedTimeToSignificance: timeToSignificance || undefined,
      expectedLift: this.calculateExpectedLift(variantResults)
    };
  }

  /**
   * Calculate uplift relative to control
   */
  private calculateUplift(test: ABTest, variant: ABTestVariant): number {
    const control = test.variants[0];
    if (variant.id === control.id) return 0;

    const controlMetric = this.getMetricValue(control, test.targetMetric);
    if (controlMetric === 0) return 0;

    const variantMetric = this.getMetricValue(variant, test.targetMetric);
    return ((variantMetric - controlMetric) / controlMetric) * 100;
  }

  /**
   * Get metric value based on target metric
   */
  private getMetricValue(variant: ABTestVariant, metric: ABTest['targetMetric']): number {
    switch (metric) {
      case 'conversion_rate':
        return variant.metrics.conversionRate;
      case 'revenue':
        return variant.metrics.revenue;
      case 'engagement':
        return variant.metrics.avgTimeOnPage;
      case 'bounce_rate':
        return 1 - variant.metrics.bounceRate;
      case 'ctr':
        return variant.metrics.clickThroughRate;
      default:
        return variant.metrics.conversionRate;
    }
  }

  /**
   * Calculate confidence interval
   */
  private calculateConfidenceInterval(variant: ABTestVariant): [number, number] {
    const p = variant.metrics.conversionRate;
    const n = variant.metrics.impressions;

    if (n === 0) return [0, 0];

    const z = 1.96; // 95% confidence
    const se = Math.sqrt((p * (1 - p)) / n);

    return [
      Math.max(0, p - z * se),
      Math.min(1, p + z * se)
    ];
  }

  /**
   * Calculate expected value
   */
  private calculateExpectedValue(variant: ABTestVariant): number {
    return variant.metrics.conversionRate *
      (variant.metrics.revenue / Math.max(variant.metrics.conversions, 1));
  }

  /**
   * Calculate expected lift
   */
  private calculateExpectedLift(results: VariantResults[]): number | undefined {
    if (results.length < 2) return undefined;

    const winner = results.reduce((best, current) =>
      current.expectedValue > best.expectedValue ? current : best
    );

    return winner.uplift;
  }

  /**
   * Get recommendation
   */
  private getRecommendation(test: ABTest, results: VariantResults[]): string {
    const winner = results.find(r => r.variant.status === 'winner');

    if (winner) {
      return `🎉 ${winner.variant.name} is the winner with ${winner.uplift.toFixed(1)}% uplift at ${(winner.significance * 100).toFixed(1)}% confidence (p=${winner.pValue.toFixed(4)})`;
    }

    const needMoreData = results.every(r =>
      r.variant.metrics.impressions < test.minimumSampleSize
    );

    if (needMoreData) {
      const avgImpressions = results.reduce((sum, r) => sum + r.variant.metrics.impressions, 0) / results.length;
      const progress = (avgImpressions / test.minimumSampleSize) * 100;
      return `⏳ Need more data to reach statistical significance (${progress.toFixed(0)}% complete)`;
    }

    const bestVariant = results.reduce((best, current) =>
      current.expectedValue > best.expectedValue ? current : best
    );

    return `📊 ${bestVariant.variant.name} is leading with ${bestVariant.uplift.toFixed(1)}% uplift, but not yet statistically significant (${(bestVariant.significance * 100).toFixed(1)}% confidence)`;
  }

  /**
   * Notify about winner
   */
  private async notifyWinner(test: ABTest, winner: ABTestVariant, results: any): Promise<void> {
    console.log(`🎉 A/B Test Winner: ${test.name} - ${winner.name}`);

    // Dispatch browser event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ab-test-winner', {
        detail: { test, winner, results }
      }));
    }

    // Send to analytics
    await this.sendAnalyticsEvent('ab_test_winner', {
      testId: test.id,
      testName: test.name,
      winnerId: winner.id,
      winnerName: winner.name,
      uplift: this.calculateUplift(test, winner),
      significance: results.significance
    });

    // Could integrate with:
    // - Email notifications
    // - Slack webhook
    // - Database logging
    // - Admin dashboard
  }

  /**
   * Send analytics event
   */
  private async sendAnalyticsEvent(eventName: string, data: Record<string, any>): Promise<void> {
    try {
      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, data);
      }

      // Custom analytics endpoint
      if (typeof window !== 'undefined') {
        await fetch('/api/analytics/ab-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event: eventName, ...data })
        }).catch(err => console.error('Analytics failed:', err));
      }
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  /**
   * Utility: Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Save assignments to localStorage
   */
  private saveAssignments(): void {
    if (typeof window === 'undefined') return;

    try {
      const data: Record<string, Record<string, string>> = {};
      this.userAssignments.forEach((tests, userId) => {
        data[userId] = {};
        tests.forEach((variantId, testId) => {
          data[userId][testId] = variantId;
        });
      });

      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save assignments:', error);
    }
  }

  /**
   * Load assignments from localStorage
   */
  private loadAssignments(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        Object.entries(parsed).forEach(([userId, tests]) => {
          const testMap = new Map(Object.entries(tests as Record<string, string>));
          this.userAssignments.set(userId, testMap);
        });
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  }

  /**
   * Create new test
   */
  createTest(test: Omit<ABTest, 'id' | 'status'>): ABTest {
    const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
          avgTimeOnPage: 0,
          clickThroughRate: 0
        },
        status: 'draft'
      }))
    };

    this.tests.set(id, newTest);
    return newTest;
  }

  /**
   * Update test
   */
  updateTest(testId: string, updates: Partial<ABTest>): ABTest | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    const updated = { ...test, ...updates };
    this.tests.set(testId, updated);
    return updated;
  }

  /**
   * Delete test
   */
  deleteTest(testId: string): boolean {
    return this.tests.delete(testId);
  }

  /**
   * Get all tests
   */
  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }

  /**
   * Get active tests
   */
  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(test => test.status === 'active');
  }

  /**
   * Start test
   */
  startTest(testId: string): ABTest | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    test.status = 'active';
    test.startDate = new Date();
    test.variants.forEach(v => v.status = 'active');

    return test;
  }

  /**
   * Pause test
   */
  pauseTest(testId: string): ABTest | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    test.status = 'paused';
    return test;
  }

  /**
   * End test
   */
  endTest(testId: string, winnerId?: string): ABTest | null {
    const test = this.tests.get(testId);
    if (!test) return null;

    test.status = 'completed';
    test.endDate = new Date();

    if (winnerId) {
      const winner = test.variants.find(v => v.id === winnerId);
      if (winner) {
        winner.status = 'winner';
        test.winner = winnerId;
      }
    }

    return test;
  }

  /**
   * Export test data
   */
  exportTestData(testId: string): string {
    const results = this.getTestResults(testId);
    return JSON.stringify(results, null, 2);
  }
}

// Singleton instance
let framework: ABTestingFramework | null = null;

export function getABTestingFramework(useEdgeConfig: boolean = true): ABTestingFramework {
  if (!framework) {
    framework = new ABTestingFramework(useEdgeConfig);
  }
  return framework;
}

/**
 * React Hook for A/B Testing
 */
export function useABTest(testId: string, userId: string) {
  const framework = getABTestingFramework();

  return {
    getVariant: async () => await framework.getVariantFromEdge(testId, userId),
    trackImpression: async (variantId: string, metadata?: Record<string, any>) =>
      await framework.trackImpression(testId, variantId, metadata),
    trackConversion: async (variantId: string, revenue?: number, metadata?: Record<string, any>) =>
      await framework.trackConversion(testId, variantId, revenue, metadata),
    trackEngagement: async (variantId: string, metrics: any) =>
      await framework.trackEngagement(testId, variantId, metrics),
    getResults: () => framework.getTestResults(testId)
  };
}
