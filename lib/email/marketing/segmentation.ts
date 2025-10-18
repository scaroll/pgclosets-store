/**
 * Email Segmentation & Personalization Engine
 *
 * Advanced subscriber segmentation based on:
 * - Behavior (active, inactive, engaged, at-risk)
 * - Funnel stage (subscriber, lead, prospect, customer, advocate)
 * - Interests (product categories, content topics)
 * - Geography (Ottawa regions)
 * - Value (high-value, average, low-value customers)
 * - Recency (recent, 30-60-90 day segments)
 */

export type BehaviorSegment =
  | 'active' // Opened/clicked in last 30 days
  | 'engaged' // Opened/clicked 50%+ of emails
  | 'inactive' // No opens in 60+ days
  | 'at-risk'; // Declining engagement

export type FunnelStage =
  | 'subscriber' // Newsletter subscriber only
  | 'lead' // Requested quote
  | 'prospect' // Quote completed, no purchase
  | 'customer' // Made purchase
  | 'advocate'; // Made purchase + referral/review

export type ValueSegment =
  | 'high-value' // >$10k lifetime value
  | 'medium-value' // $3k-$10k lifetime value
  | 'low-value'; // <$3k lifetime value

export type GeographySegment =
  | 'ottawa-central'
  | 'ottawa-east' // Orleans, Gloucester
  | 'ottawa-west' // Kanata, Stittsville
  | 'ottawa-south' // Barrhaven, Riverside
  | 'ottawa-north' // Rockcliffe, Manor Park
  | 'gatineau'
  | 'other';

export type RecencySegment =
  | 'new' // <7 days
  | 'recent' // 7-30 days
  | 'mid' // 30-60 days
  | 'aging' // 60-90 days
  | 'stale'; // >90 days

export interface SubscriberProfile {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;

  // Segmentation
  behaviorSegment: BehaviorSegment;
  funnelStage: FunnelStage;
  valueSegment?: ValueSegment;
  geographySegment?: GeographySegment;
  recencySegment: RecencySegment;

  // Engagement metrics
  totalEmailsSent: number;
  totalOpens: number;
  totalClicks: number;
  lastOpenedAt?: Date;
  lastClickedAt?: Date;

  // Interests & preferences
  interests: string[]; // ['walk-in-closets', 'garage-storage', 'pantry']
  topics: string[]; // ['organization-tips', 'design-trends', 'diy']
  preferredSendTime?: string; // 'morning' | 'afternoon' | 'evening'
  frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly';

  // Customer data
  lifetimeValue: number;
  totalPurchases: number;
  averageOrderValue: number;
  lastPurchaseDate?: Date;

  // Metadata
  signupDate: Date;
  signupSource: string;
  tags: string[];
  customFields: Record<string, any>;
}

/**
 * Segmentation Engine
 */
export class SegmentationEngine {
  /**
   * Calculate behavior segment based on engagement
   */
  calculateBehaviorSegment(profile: SubscriberProfile): BehaviorSegment {
    const now = new Date();
    const daysSinceLastOpen = profile.lastOpenedAt
      ? Math.floor((now.getTime() - profile.lastOpenedAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const openRate = profile.totalEmailsSent > 0
      ? profile.totalOpens / profile.totalEmailsSent
      : 0;

    // Active: Opened in last 30 days
    if (daysSinceLastOpen < 30) {
      return 'active';
    }

    // Engaged: High open rate despite no recent opens
    if (openRate >= 0.5) {
      return 'engaged';
    }

    // At-risk: Declining engagement
    if (daysSinceLastOpen >= 30 && daysSinceLastOpen < 60 && openRate < 0.3) {
      return 'at-risk';
    }

    // Inactive: No opens in 60+ days
    return 'inactive';
  }

  /**
   * Calculate funnel stage
   */
  calculateFunnelStage(profile: SubscriberProfile): FunnelStage {
    if (profile.customFields.hasReferral || profile.customFields.hasReview) {
      return 'advocate';
    }

    if (profile.totalPurchases > 0) {
      return 'customer';
    }

    if (profile.customFields.quoteCompleted) {
      return 'prospect';
    }

    if (profile.customFields.quoteStarted) {
      return 'lead';
    }

    return 'subscriber';
  }

  /**
   * Calculate value segment
   */
  calculateValueSegment(profile: SubscriberProfile): ValueSegment {
    if (profile.lifetimeValue >= 10000) {
      return 'high-value';
    }

    if (profile.lifetimeValue >= 3000) {
      return 'medium-value';
    }

    return 'low-value';
  }

  /**
   * Calculate geography segment from postal code
   */
  calculateGeographySegment(postalCode?: string): GeographySegment {
    if (!postalCode) return 'other';

    const prefix = postalCode.substring(0, 3).toUpperCase();

    // Ottawa central: K1A-K1Z
    if (prefix >= 'K1A' && prefix <= 'K1Z') {
      return 'ottawa-central';
    }

    // Ottawa east: K4A-K4B (Orleans, Gloucester)
    if (prefix >= 'K4A' && prefix <= 'K4B') {
      return 'ottawa-east';
    }

    // Ottawa west: K2K, K2L, K2M (Kanata, Stittsville)
    if (['K2K', 'K2L', 'K2M'].includes(prefix)) {
      return 'ottawa-west';
    }

    // Ottawa south: K2J, K2H (Barrhaven)
    if (['K2J', 'K2H'].includes(prefix)) {
      return 'ottawa-south';
    }

    // Ottawa north: K1H, K1M (Rockcliffe, Manor Park)
    if (['K1H', 'K1M'].includes(prefix)) {
      return 'ottawa-north';
    }

    // Gatineau: J8X-J9J
    if (prefix >= 'J8X' && prefix <= 'J9J') {
      return 'gatineau';
    }

    return 'other';
  }

  /**
   * Calculate recency segment
   */
  calculateRecencySegment(signupDate: Date): RecencySegment {
    const now = new Date();
    const daysSinceSignup = Math.floor(
      (now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceSignup <= 7) return 'new';
    if (daysSinceSignup <= 30) return 'recent';
    if (daysSinceSignup <= 60) return 'mid';
    if (daysSinceSignup <= 90) return 'aging';
    return 'stale';
  }

  /**
   * Get segment for subscriber
   */
  getSegment(profile: SubscriberProfile): {
    behavior: BehaviorSegment;
    funnel: FunnelStage;
    value?: ValueSegment;
    geography?: GeographySegment;
    recency: RecencySegment;
  } {
    return {
      behavior: this.calculateBehaviorSegment(profile),
      funnel: this.calculateFunnelStage(profile),
      value: profile.lifetimeValue > 0 ? this.calculateValueSegment(profile) : undefined,
      geography: this.calculateGeographySegment(profile.customFields.postalCode),
      recency: this.calculateRecencySegment(profile.signupDate)
    };
  }

  /**
   * Query subscribers by segment
   */
  queryBySegment(
    profiles: SubscriberProfile[],
    criteria: {
      behavior?: BehaviorSegment[];
      funnel?: FunnelStage[];
      value?: ValueSegment[];
      geography?: GeographySegment[];
      recency?: RecencySegment[];
      interests?: string[];
      tags?: string[];
    }
  ): SubscriberProfile[] {
    return profiles.filter(profile => {
      const segment = this.getSegment(profile);

      // Check behavior
      if (criteria.behavior && !criteria.behavior.includes(segment.behavior)) {
        return false;
      }

      // Check funnel stage
      if (criteria.funnel && !criteria.funnel.includes(segment.funnel)) {
        return false;
      }

      // Check value
      if (criteria.value && segment.value && !criteria.value.includes(segment.value)) {
        return false;
      }

      // Check geography
      if (criteria.geography && segment.geography && !criteria.geography.includes(segment.geography)) {
        return false;
      }

      // Check recency
      if (criteria.recency && !criteria.recency.includes(segment.recency)) {
        return false;
      }

      // Check interests
      if (criteria.interests) {
        const hasInterest = criteria.interests.some(interest =>
          profile.interests.includes(interest)
        );
        if (!hasInterest) return false;
      }

      // Check tags
      if (criteria.tags) {
        const hasTag = criteria.tags.some(tag => profile.tags.includes(tag));
        if (!hasTag) return false;
      }

      return true;
    });
  }

  /**
   * Get recommended content for subscriber
   */
  getRecommendedContent(profile: SubscriberProfile): {
    productCategories: string[];
    contentTopics: string[];
    sendTime: string;
  } {
    const segment = this.getSegment(profile);

    // Default recommendations
    let productCategories = ['walk-in-closets', 'reach-in-closets'];
    let contentTopics = ['organization-tips', 'design-trends'];
    let sendTime = 'morning'; // 9 AM default

    // Personalize based on interests
    if (profile.interests.length > 0) {
      productCategories = profile.interests;
    }

    if (profile.topics.length > 0) {
      contentTopics = profile.topics;
    }

    // Optimize send time based on historical opens
    if (profile.preferredSendTime) {
      sendTime = profile.preferredSendTime;
    }

    // Funnel-stage specific recommendations
    switch (segment.funnel) {
      case 'subscriber':
        contentTopics = ['getting-started', 'organization-tips', 'design-inspiration'];
        break;
      case 'lead':
        contentTopics = ['measuring-guide', 'product-comparison', 'pricing'];
        break;
      case 'prospect':
        contentTopics = ['customer-stories', 'installation-process', 'warranty'];
        break;
      case 'customer':
        contentTopics = ['maintenance', 'complementary-products', 'referral-program'];
        break;
      case 'advocate':
        contentTopics = ['vip-benefits', 'early-access', 'exclusive-offers'];
        break;
    }

    return {
      productCategories,
      contentTopics,
      sendTime
    };
  }

  /**
   * Calculate engagement score (0-100)
   */
  calculateEngagementScore(profile: SubscriberProfile): number {
    const openRate = profile.totalEmailsSent > 0
      ? profile.totalOpens / profile.totalEmailsSent
      : 0;

    const clickRate = profile.totalOpens > 0
      ? profile.totalClicks / profile.totalOpens
      : 0;

    const recencyScore = (() => {
      const segment = this.calculateRecencySegment(profile.signupDate);
      switch (segment) {
        case 'new': return 100;
        case 'recent': return 75;
        case 'mid': return 50;
        case 'aging': return 25;
        case 'stale': return 10;
      }
    })();

    const behaviorScore = (() => {
      const segment = this.calculateBehaviorSegment(profile);
      switch (segment) {
        case 'active': return 100;
        case 'engaged': return 75;
        case 'at-risk': return 40;
        case 'inactive': return 10;
      }
    })();

    // Weighted score
    return Math.round(
      openRate * 30 +
      clickRate * 20 +
      recencyScore * 0.25 +
      behaviorScore * 0.25
    );
  }

  /**
   * Predict churn probability (0-1)
   */
  predictChurn(profile: SubscriberProfile): number {
    const engagementScore = this.calculateEngagementScore(profile);
    const segment = this.getSegment(profile);

    // Base churn probability from engagement
    let churnProb = (100 - engagementScore) / 100;

    // Adjust for behavior segment
    if (segment.behavior === 'inactive') {
      churnProb += 0.3;
    } else if (segment.behavior === 'at-risk') {
      churnProb += 0.2;
    }

    // Adjust for recency
    if (segment.recency === 'stale') {
      churnProb += 0.2;
    }

    return Math.min(churnProb, 1.0);
  }

  /**
   * Get next best action for subscriber
   */
  getNextBestAction(profile: SubscriberProfile): {
    action: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
  } {
    const segment = this.getSegment(profile);
    const churnProb = this.predictChurn(profile);

    // High churn risk
    if (churnProb > 0.7) {
      return {
        action: 're-engagement-campaign',
        priority: 'high',
        reason: 'High churn risk - immediate re-engagement needed'
      };
    }

    // Inactive behavior
    if (segment.behavior === 'inactive') {
      return {
        action: 'win-back-offer',
        priority: 'high',
        reason: 'No engagement in 60+ days'
      };
    }

    // Lead without quote completion
    if (segment.funnel === 'lead' && profile.customFields.quoteStarted) {
      return {
        action: 'quote-completion-reminder',
        priority: 'high',
        reason: 'Abandoned quote - high conversion opportunity'
      };
    }

    // Prospect without purchase
    if (segment.funnel === 'prospect') {
      return {
        action: 'consultation-booking',
        priority: 'medium',
        reason: 'Quote completed but no purchase - ready for consultation'
      };
    }

    // Customer without referral
    if (segment.funnel === 'customer' && !profile.customFields.hasReferral) {
      return {
        action: 'referral-request',
        priority: 'medium',
        reason: 'Satisfied customer - referral opportunity'
      };
    }

    // Active engagement
    if (segment.behavior === 'active') {
      return {
        action: 'nurture-content',
        priority: 'low',
        reason: 'Engaged subscriber - continue nurture'
      };
    }

    return {
      action: 'monitor',
      priority: 'low',
      reason: 'No immediate action needed'
    };
  }
}

/**
 * Personalization Engine
 */
export class PersonalizationEngine {
  /**
   * Personalize email content
   */
  personalize(
    template: string,
    profile: SubscriberProfile,
    additionalData?: Record<string, any>
  ): string {
    let content = template;

    // Basic personalization
    content = content.replace(/\{\{firstName\}\}/g, profile.firstName || 'there');
    content = content.replace(/\{\{lastName\}\}/g, profile.lastName || '');
    content = content.replace(/\{\{email\}\}/g, profile.email);

    // Location personalization
    if (profile.customFields.city) {
      content = content.replace(/\{\{city\}\}/g, profile.customFields.city);
    }

    // Funnel stage personalization
    const segmentEngine = new SegmentationEngine();
    const segment = segmentEngine.getSegment(profile);

    content = content.replace(/\{\{funnelStage\}\}/g, segment.funnel);

    // Additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
        content = content.replace(regex, String(value));
      });
    }

    return content;
  }

  /**
   * Generate dynamic subject line
   */
  generateSubjectLine(profile: SubscriberProfile, baseSubject: string): string {
    const segmentEngine = new SegmentationEngine();
    const segment = segmentEngine.getSegment(profile);

    // Add personalization
    let subject = baseSubject.replace(/\{\{firstName\}\}/g, profile.firstName || 'there');

    // Add urgency for at-risk subscribers
    if (segment.behavior === 'at-risk' || segment.behavior === 'inactive') {
      if (!subject.includes('!') && Math.random() > 0.5) {
        subject = `${subject} 🎁`;
      }
    }

    // Add location for geo-targeted campaigns
    if (profile.customFields.city && Math.random() > 0.7) {
      subject = `${profile.customFields.city}: ${subject}`;
    }

    return subject;
  }

  /**
   * Select best send time for user
   */
  optimizeSendTime(profile: SubscriberProfile, scheduledTime: Date): Date {
    const optimizedTime = new Date(scheduledTime);

    // Use historical preference if available
    if (profile.preferredSendTime) {
      switch (profile.preferredSendTime) {
        case 'morning':
          optimizedTime.setHours(9, 0, 0, 0);
          break;
        case 'afternoon':
          optimizedTime.setHours(14, 0, 0, 0);
          break;
        case 'evening':
          optimizedTime.setHours(18, 0, 0, 0);
          break;
      }
    } else {
      // Default to 9 AM for first-time senders
      optimizedTime.setHours(9, 0, 0, 0);
    }

    // Avoid weekends for business emails
    const dayOfWeek = optimizedTime.getDay();
    if (dayOfWeek === 0) {
      // Sunday -> Monday
      optimizedTime.setDate(optimizedTime.getDate() + 1);
    } else if (dayOfWeek === 6) {
      // Saturday -> Monday
      optimizedTime.setDate(optimizedTime.getDate() + 2);
    }

    return optimizedTime;
  }
}

export default {
  SegmentationEngine,
  PersonalizationEngine
};
