/**
 * Email Marketing Analytics & Tracking System
 *
 * Comprehensive email performance tracking with:
 * - Campaign metrics (open, click, conversion rates)
 * - List health monitoring
 * - Revenue attribution
 * - A/B test results
 * - Real-time dashboards
 */

export interface EmailEvent {
  id: string;
  email: string;
  campaignId?: string;
  workflowId?: string;
  templateId: string;
  eventType: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'unsubscribed';
  timestamp: Date;
  metadata?: {
    link?: string;
    userAgent?: string;
    ipAddress?: string;
    location?: string;
    device?: 'desktop' | 'mobile' | 'tablet';
  };
}

export interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  sentAt: Date;

  // Delivery metrics
  totalSent: number;
  totalDelivered: number;
  totalBounced: number;
  bounceRate: number; // %

  // Engagement metrics
  totalOpens: number;
  uniqueOpens: number;
  openRate: number; // %
  totalClicks: number;
  uniqueClicks: number;
  clickRate: number; // %
  clickToOpenRate: number; // %

  // Negative metrics
  totalComplaints: number;
  complaintRate: number; // %
  totalUnsubscribes: number;
  unsubscribeRate: number; // %

  // Revenue metrics
  totalRevenue: number;
  revenuePerEmail: number;
  conversions: number;
  conversionRate: number; // %

  // Timing metrics
  avgTimeToOpen?: number; // minutes
  avgTimeToClick?: number; // minutes
}

export interface ListHealthMetrics {
  totalSubscribers: number;
  activeSubscribers: number; // Opened in last 30 days
  engagedSubscribers: number; // Opened 50%+ of emails
  inactiveSubscribers: number; // No opens in 60+ days
  atRiskSubscribers: number; // Declining engagement

  // Growth metrics
  newSubscribers: number; // This period
  listGrowthRate: number; // %
  unsubscribes: number; // This period
  churnRate: number; // %

  // Quality metrics
  avgEngagementScore: number; // 0-100
  deliverabilityScore: number; // %
  listQualityScore: number; // 0-100
}

export interface RevenueAttribution {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: Date;
  endDate: Date;

  // Revenue metrics
  totalRevenue: number;
  emailAttributedRevenue: number;
  emailRevenuePercentage: number; // % of total revenue
  revenuePerSubscriber: number;
  revenuePerEmail: number;

  // Conversion metrics
  totalOrders: number;
  emailAttributedOrders: number;
  emailConversionRate: number; // %

  // Customer metrics
  newCustomers: number;
  returningCustomers: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
}

export interface ABTestResult {
  testId: string;
  testName: string;
  campaignId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'cancelled';

  // Test configuration
  variants: Array<{
    id: string;
    name: string;
    subject?: string;
    templateId?: string;
    weight: number;
  }>;

  // Results
  variantMetrics: Array<{
    variantId: string;
    sent: number;
    opens: number;
    openRate: number;
    clicks: number;
    clickRate: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  }>;

  // Statistical significance
  winner?: string;
  confidenceLevel?: number; // %
  statisticalSignificance: boolean;
}

/**
 * Analytics Engine
 */
export class AnalyticsEngine {
  private events: Map<string, EmailEvent[]> = new Map();
  private campaigns: Map<string, CampaignMetrics> = new Map();

  /**
   * Track email event
   */
  trackEvent(event: EmailEvent): void {
    const key = event.campaignId || event.workflowId || 'general';
    const events = this.events.get(key) || [];
    events.push(event);
    this.events.set(key, events);

    console.log(`📊 Tracked ${event.eventType} event for ${event.email}`);
  }

  /**
   * Get campaign metrics
   */
  getCampaignMetrics(campaignId: string): CampaignMetrics | null {
    const events = this.events.get(campaignId);
    if (!events || events.length === 0) return null;

    const sentEvents = events.filter(e => e.eventType === 'sent');
    const deliveredEvents = events.filter(e => e.eventType === 'delivered');
    const bouncedEvents = events.filter(e => e.eventType === 'bounced');
    const openEvents = events.filter(e => e.eventType === 'opened');
    const clickEvents = events.filter(e => e.eventType === 'clicked');
    const complaintEvents = events.filter(e => e.eventType === 'complained');
    const unsubscribeEvents = events.filter(e => e.eventType === 'unsubscribed');

    const totalSent = sentEvents.length;
    const totalDelivered = deliveredEvents.length;
    const totalBounced = bouncedEvents.length;

    const uniqueOpens = new Set(openEvents.map(e => e.email)).size;
    const uniqueClicks = new Set(clickEvents.map(e => e.email)).size;

    return {
      campaignId,
      campaignName: '', // Would come from database
      sentAt: sentEvents[0]?.timestamp || new Date(),

      totalSent,
      totalDelivered,
      totalBounced,
      bounceRate: this.calculateRate(totalBounced, totalSent),

      totalOpens: openEvents.length,
      uniqueOpens,
      openRate: this.calculateRate(uniqueOpens, totalDelivered),
      totalClicks: clickEvents.length,
      uniqueClicks,
      clickRate: this.calculateRate(uniqueClicks, totalDelivered),
      clickToOpenRate: this.calculateRate(uniqueClicks, uniqueOpens),

      totalComplaints: complaintEvents.length,
      complaintRate: this.calculateRate(complaintEvents.length, totalDelivered),
      totalUnsubscribes: unsubscribeEvents.length,
      unsubscribeRate: this.calculateRate(unsubscribeEvents.length, totalDelivered),

      totalRevenue: 0, // Would be calculated from order data
      revenuePerEmail: 0,
      conversions: 0,
      conversionRate: 0,

      avgTimeToOpen: this.calculateAvgTimeToOpen(sentEvents, openEvents),
      avgTimeToClick: this.calculateAvgTimeToClick(sentEvents, clickEvents)
    };
  }

  /**
   * Get list health metrics
   */
  getListHealthMetrics(
    totalSubscribers: number,
    subscriberProfiles: any[]
  ): ListHealthMetrics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Calculate segments
    const activeSubscribers = subscriberProfiles.filter(
      p => p.lastOpenedAt && p.lastOpenedAt >= thirtyDaysAgo
    ).length;

    const engagedSubscribers = subscriberProfiles.filter(
      p => p.totalEmailsSent > 0 && (p.totalOpens / p.totalEmailsSent) >= 0.5
    ).length;

    const inactiveSubscribers = subscriberProfiles.filter(
      p => !p.lastOpenedAt || p.lastOpenedAt < sixtyDaysAgo
    ).length;

    const atRiskSubscribers = subscriberProfiles.filter(p => {
      const openRate = p.totalEmailsSent > 0 ? p.totalOpens / p.totalEmailsSent : 0;
      const daysSinceOpen = p.lastOpenedAt
        ? Math.floor((now.getTime() - p.lastOpenedAt.getTime()) / (1000 * 60 * 60 * 24))
        : 999;
      return daysSinceOpen >= 30 && daysSinceOpen < 60 && openRate < 0.3;
    }).length;

    // Growth metrics (would be calculated from time-series data)
    const newSubscribers = 0;
    const unsubscribes = 0;

    // Quality score
    const avgEngagementScore = subscriberProfiles.length > 0
      ? subscriberProfiles.reduce((sum, p) => sum + (p.engagementScore || 0), 0) / subscriberProfiles.length
      : 0;

    const deliverabilityScore = 98.5; // Would be calculated from bounce/complaint rates

    const listQualityScore = Math.round(
      (activeSubscribers / totalSubscribers) * 0.4 * 100 +
      (engagedSubscribers / totalSubscribers) * 0.3 * 100 +
      deliverabilityScore * 0.3
    );

    return {
      totalSubscribers,
      activeSubscribers,
      engagedSubscribers,
      inactiveSubscribers,
      atRiskSubscribers,

      newSubscribers,
      listGrowthRate: this.calculateRate(newSubscribers, totalSubscribers),
      unsubscribes,
      churnRate: this.calculateRate(unsubscribes, totalSubscribers),

      avgEngagementScore,
      deliverabilityScore,
      listQualityScore
    };
  }

  /**
   * Get revenue attribution
   */
  getRevenueAttribution(
    period: 'day' | 'week' | 'month' | 'quarter' | 'year',
    orders: Array<{
      orderId: string;
      customerId: string;
      revenue: number;
      createdAt: Date;
      source: string;
    }>
  ): RevenueAttribution {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    const periodOrders = orders.filter(
      o => o.createdAt >= startDate && o.createdAt <= now
    );

    const emailOrders = periodOrders.filter(o => o.source === 'email');

    const totalRevenue = periodOrders.reduce((sum, o) => sum + o.revenue, 0);
    const emailRevenue = emailOrders.reduce((sum, o) => sum + o.revenue, 0);

    const uniqueCustomers = new Set(emailOrders.map(o => o.customerId));
    const newCustomers = 0; // Would need to check if first purchase
    const returningCustomers = uniqueCustomers.size - newCustomers;

    return {
      period,
      startDate,
      endDate: now,

      totalRevenue,
      emailAttributedRevenue: emailRevenue,
      emailRevenuePercentage: this.calculateRate(emailRevenue, totalRevenue),
      revenuePerSubscriber: 0, // Would need subscriber count
      revenuePerEmail: 0, // Would need email count

      totalOrders: periodOrders.length,
      emailAttributedOrders: emailOrders.length,
      emailConversionRate: 0, // Would need email recipient count

      newCustomers,
      returningCustomers,
      averageOrderValue: emailRevenue / emailOrders.length || 0,
      customerLifetimeValue: 0 // Would need historical data
    };
  }

  /**
   * Analyze A/B test results
   */
  analyzeABTest(
    testId: string,
    variants: ABTestResult['variants'],
    events: EmailEvent[]
  ): ABTestResult {
    const variantMetrics = variants.map(variant => {
      const variantEvents = events.filter(e => e.metadata?.variantId === variant.id);

      const sent = variantEvents.filter(e => e.eventType === 'sent').length;
      const opens = new Set(
        variantEvents.filter(e => e.eventType === 'opened').map(e => e.email)
      ).size;
      const clicks = new Set(
        variantEvents.filter(e => e.eventType === 'clicked').map(e => e.email)
      ).size;

      return {
        variantId: variant.id,
        sent,
        opens,
        openRate: this.calculateRate(opens, sent),
        clicks,
        clickRate: this.calculateRate(clicks, sent),
        conversions: 0, // Would be calculated from order data
        conversionRate: 0,
        revenue: 0
      };
    });

    // Determine winner (simplified - should use proper statistical testing)
    const winner = variantMetrics.reduce((max, current) =>
      current.clickRate > max.clickRate ? current : max
    );

    const statisticalSignificance = this.calculateStatisticalSignificance(variantMetrics);

    return {
      testId,
      testName: '',
      campaignId: '',
      startedAt: new Date(),
      status: statisticalSignificance ? 'completed' : 'running',

      variants,
      variantMetrics,

      winner: statisticalSignificance ? winner.variantId : undefined,
      confidenceLevel: statisticalSignificance ? 95 : undefined,
      statisticalSignificance
    };
  }

  /**
   * Get real-time dashboard data
   */
  getDashboardMetrics(timeRange: '24h' | '7d' | '30d'): {
    overview: {
      totalSent: number;
      openRate: number;
      clickRate: number;
      conversionRate: number;
    };
    topCampaigns: Array<{
      campaignId: string;
      name: string;
      openRate: number;
      clickRate: number;
      revenue: number;
    }>;
    recentActivity: EmailEvent[];
  } {
    const now = new Date();
    let startTime: Date;

    switch (timeRange) {
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    // Get recent events
    const recentEvents: EmailEvent[] = [];
    for (const events of this.events.values()) {
      recentEvents.push(...events.filter(e => e.timestamp >= startTime));
    }

    const totalSent = recentEvents.filter(e => e.eventType === 'sent').length;
    const uniqueOpens = new Set(
      recentEvents.filter(e => e.eventType === 'opened').map(e => e.email)
    ).size;
    const uniqueClicks = new Set(
      recentEvents.filter(e => e.eventType === 'clicked').map(e => e.email)
    ).size;

    return {
      overview: {
        totalSent,
        openRate: this.calculateRate(uniqueOpens, totalSent),
        clickRate: this.calculateRate(uniqueClicks, totalSent),
        conversionRate: 0 // Would be calculated from orders
      },
      topCampaigns: [], // Would be sorted by performance
      recentActivity: recentEvents.slice(0, 50)
    };
  }

  /**
   * Helper: Calculate percentage rate
   */
  private calculateRate(numerator: number, denominator: number): number {
    if (denominator === 0) return 0;
    return Math.round((numerator / denominator) * 10000) / 100;
  }

  /**
   * Helper: Calculate average time to open
   */
  private calculateAvgTimeToOpen(sentEvents: EmailEvent[], openEvents: EmailEvent[]): number {
    const times: number[] = [];

    for (const openEvent of openEvents) {
      const sentEvent = sentEvents.find(e => e.email === openEvent.email);
      if (sentEvent) {
        const diff = openEvent.timestamp.getTime() - sentEvent.timestamp.getTime();
        times.push(diff / (1000 * 60)); // Convert to minutes
      }
    }

    if (times.length === 0) return 0;
    return Math.round(times.reduce((sum, t) => sum + t, 0) / times.length);
  }

  /**
   * Helper: Calculate average time to click
   */
  private calculateAvgTimeToClick(sentEvents: EmailEvent[], clickEvents: EmailEvent[]): number {
    const times: number[] = [];

    for (const clickEvent of clickEvents) {
      const sentEvent = sentEvents.find(e => e.email === clickEvent.email);
      if (sentEvent) {
        const diff = clickEvent.timestamp.getTime() - sentEvent.timestamp.getTime();
        times.push(diff / (1000 * 60)); // Convert to minutes
      }
    }

    if (times.length === 0) return 0;
    return Math.round(times.reduce((sum, t) => sum + t, 0) / times.length);
  }

  /**
   * Helper: Calculate statistical significance (simplified)
   */
  private calculateStatisticalSignificance(
    variantMetrics: ABTestResult['variantMetrics']
  ): boolean {
    // Simplified check - real implementation would use chi-square test
    const minSampleSize = 100;
    const minDifference = 0.1; // 10% minimum difference

    if (variantMetrics.length < 2) return false;

    const allMeetMinimum = variantMetrics.every(v => v.sent >= minSampleSize);
    if (!allMeetMinimum) return false;

    const rates = variantMetrics.map(v => v.clickRate);
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);

    return (maxRate - minRate) >= minDifference;
  }
}

export default AnalyticsEngine;
