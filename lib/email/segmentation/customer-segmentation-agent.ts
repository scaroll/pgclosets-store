/**
 * AGENTS 7-8: Customer Segmentation System
 *
 * Agent 7: Customer Segmentation Engine
 * Agent 8: Targeting & List Management
 */

export interface CustomerProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  lastPurchase?: Date;
  totalSpent: number;
  purchaseCount: number;
  averageOrderValue: number;
  interests: string[];
  location?: string;
  engagementScore: number;
}

export type Segment =
  | 'vip-customers'
  | 'recent-buyers'
  | 'window-shoppers'
  | 'cart-abandoners'
  | 'lapsed-customers'
  | 'high-intent'
  | 'newsletter-only'
  | 'referral-champions';

// AGENT 7: Customer Segmentation Engine
export class CustomerSegmentationAgent {
  /**
   * Segment customers based on behavior and demographics
   */
  segmentCustomer(profile: CustomerProfile): Segment[] {
    const segments: Segment[] = [];

    // VIP Customers: High lifetime value
    if (profile.totalSpent > 5000 || profile.purchaseCount >= 3) {
      segments.push('vip-customers');
    }

    // Recent Buyers: Purchased within 30 days
    if (profile.lastPurchase) {
      const daysSinceLastPurchase = this.getDaysSince(profile.lastPurchase);
      if (daysSinceLastPurchase <= 30) {
        segments.push('recent-buyers');
      }

      // Lapsed Customers: No purchase in 6+ months
      if (daysSinceLastPurchase > 180) {
        segments.push('lapsed-customers');
      }
    }

    // Window Shoppers: High engagement, no purchases
    if (profile.engagementScore > 50 && profile.purchaseCount === 0) {
      segments.push('window-shoppers');
    }

    // High Intent: Recent quote requests or consultations
    if (profile.interests.includes('quote-requested') || profile.interests.includes('consultation-booked')) {
      segments.push('high-intent');
    }

    // Newsletter Only: Subscribed but minimal engagement
    if (profile.purchaseCount === 0 && profile.engagementScore < 20) {
      segments.push('newsletter-only');
    }

    return segments;
  }

  /**
   * RFM Segmentation (Recency, Frequency, Monetary)
   */
  getRFMScore(profile: CustomerProfile): {
    recency: number;
    frequency: number;
    monetary: number;
    segment: string;
  } {
    // Recency score (1-5, 5 = most recent)
    const recency = profile.lastPurchase
      ? this.calculateRecencyScore(this.getDaysSince(profile.lastPurchase))
      : 0;

    // Frequency score (1-5, 5 = most frequent)
    const frequency = this.calculateFrequencyScore(profile.purchaseCount);

    // Monetary score (1-5, 5 = highest value)
    const monetary = this.calculateMonetaryScore(profile.totalSpent);

    // Determine segment based on scores
    const segment = this.determineRFMSegment(recency, frequency, monetary);

    return { recency, frequency, monetary, segment };
  }

  private calculateRecencyScore(daysSince: number): number {
    if (daysSince <= 30) return 5;
    if (daysSince <= 90) return 4;
    if (daysSince <= 180) return 3;
    if (daysSince <= 365) return 2;
    return 1;
  }

  private calculateFrequencyScore(purchaseCount: number): number {
    if (purchaseCount >= 5) return 5;
    if (purchaseCount >= 3) return 4;
    if (purchaseCount >= 2) return 3;
    if (purchaseCount >= 1) return 2;
    return 1;
  }

  private calculateMonetaryScore(totalSpent: number): number {
    if (totalSpent >= 10000) return 5;
    if (totalSpent >= 5000) return 4;
    if (totalSpent >= 2000) return 3;
    if (totalSpent >= 500) return 2;
    return 1;
  }

  private determineRFMSegment(r: number, f: number, m: number): string {
    const score = r + f + m;

    if (score >= 13) return 'Champions';
    if (score >= 10) return 'Loyal Customers';
    if (r >= 4 && f <= 2) return 'Promising';
    if (r <= 2 && f >= 3) return 'At Risk';
    if (r <= 2 && f <= 2) return 'Lost';
    return 'Potential Loyalists';
  }

  private getDaysSince(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get engagement score (0-100)
   */
  calculateEngagementScore(metrics: {
    emailOpens: number;
    emailClicks: number;
    siteVisits: number;
    pageViews: number;
    timeSinceLastActivity: number; // days
  }): number {
    let score = 0;

    // Email engagement (40 points max)
    score += Math.min(metrics.emailOpens * 2, 20);
    score += Math.min(metrics.emailClicks * 4, 20);

    // Site engagement (40 points max)
    score += Math.min(metrics.siteVisits * 2, 20);
    score += Math.min(metrics.pageViews * 0.5, 20);

    // Recency bonus (20 points max)
    if (metrics.timeSinceLastActivity <= 7) score += 20;
    else if (metrics.timeSinceLastActivity <= 30) score += 10;
    else if (metrics.timeSinceLastActivity <= 90) score += 5;

    return Math.min(Math.round(score), 100);
  }
}

// AGENT 8: Targeting & List Management
export class TargetingAgent {
  /**
   * Get email list for specific segment
   */
  async getSegmentList(segment: Segment): Promise<string[]> {
    // In production, query from database
    console.log(`📋 Retrieving ${segment} segment list`);
    return [];
  }

  /**
   * Get recipients for specific campaign
   */
  async getCampaignRecipients(campaign: {
    type: 'promotional' | 'transactional' | 'educational';
    excludeSegments?: Segment[];
    includeSegments?: Segment[];
  }): Promise<string[]> {
    // Build recipient list based on campaign targeting
    let recipients: string[] = [];

    if (campaign.includeSegments) {
      for (const segment of campaign.includeSegments) {
        const segmentList = await this.getSegmentList(segment);
        recipients = [...recipients, ...segmentList];
      }
    }

    // Remove excluded segments
    if (campaign.excludeSegments) {
      for (const segment of campaign.excludeSegments) {
        const excludeList = await this.getSegmentList(segment);
        recipients = recipients.filter(email => !excludeList.includes(email));
      }
    }

    // Remove duplicates
    return [...new Set(recipients)];
  }

  /**
   * Frequency capping: Don't overwhelm customers
   */
  shouldSendEmail(email: string, emailsSentThisWeek: number): boolean {
    const MAX_EMAILS_PER_WEEK = 3;
    const MAX_EMAILS_PER_DAY = 1;

    if (emailsSentThisWeek >= MAX_EMAILS_PER_WEEK) {
      console.log(`⏸️ Frequency cap reached for ${email}`);
      return false;
    }

    return true;
  }

  /**
   * Optimal send time based on user behavior
   */
  getOptimalSendTime(email: string, historicalEngagement: {
    opensByHour: Record<number, number>;
    opensByDay: Record<string, number>;
  }): Date {
    // Find hour with highest open rate
    const bestHour = Object.entries(historicalEngagement.opensByHour)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '10';

    // Find day with highest open rate
    const bestDay = Object.entries(historicalEngagement.opensByDay)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'Tuesday';

    // Calculate next optimal send time
    const now = new Date();
    const sendTime = new Date();
    sendTime.setHours(parseInt(bestHour), 0, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (sendTime < now) {
      sendTime.setDate(sendTime.getDate() + 1);
    }

    return sendTime;
  }

  /**
   * Dynamic list building based on behavior
   */
  buildDynamicList(criteria: {
    minEngagementScore?: number;
    maxDaysSinceLastPurchase?: number;
    minTotalSpent?: number;
    interests?: string[];
    location?: string;
  }): Promise<string[]> {
    console.log('🎯 Building dynamic list with criteria:', criteria);
    // Query database with criteria
    return Promise.resolve([]);
  }
}

export const customerSegmentationAgent = new CustomerSegmentationAgent();
export const targetingAgent = new TargetingAgent();
