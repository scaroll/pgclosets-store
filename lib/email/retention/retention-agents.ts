/**
 * AGENTS 11-12: Customer Retention System
 *
 * Agent 11: Loyalty Program Manager
 * Agent 12: Re-engagement Campaign Manager
 */

import { Resend } from 'resend';
import { CustomerProfile } from '../segmentation/customer-segmentation-agent';

const resend = new Resend(process.env.RESEND_API_KEY);

// AGENT 11: Loyalty Program Manager
export class LoyaltyProgramAgent {
  /**
   * Calculate loyalty points for customer
   */
  calculatePoints(profile: CustomerProfile): LoyaltyStatus {
    const points = Math.floor(profile.totalSpent / 10); // $10 = 1 point
    const tier = this.determineTier(points);

    return {
      points,
      tier,
      nextTier: this.getNextTier(tier),
      pointsToNextTier: this.getPointsToNextTier(points),
      benefits: this.getTierBenefits(tier),
      lifetimeValue: profile.totalSpent
    };
  }

  private determineTier(points: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' {
    if (points >= 1000) return 'Platinum';
    if (points >= 500) return 'Gold';
    if (points >= 200) return 'Silver';
    return 'Bronze';
  }

  private getNextTier(currentTier: string): string | null {
    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];
    const currentIndex = tiers.indexOf(currentTier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  }

  private getPointsToNextTier(points: number): number | null {
    if (points >= 1000) return null; // Already at max tier
    if (points >= 500) return 1000 - points;
    if (points >= 200) return 500 - points;
    return 200 - points;
  }

  private getTierBenefits(tier: string): string[] {
    const benefits = {
      Bronze: [
        'Earn 1 point per $10 spent',
        'Birthday discount',
        'Early access to sales'
      ],
      Silver: [
        'All Bronze benefits',
        'Free shipping on all orders',
        '5% discount on all purchases',
        'Priority customer support'
      ],
      Gold: [
        'All Silver benefits',
        '10% discount on all purchases',
        'Free design consultations',
        'Exclusive product previews'
      ],
      Platinum: [
        'All Gold benefits',
        '15% discount on all purchases',
        'Dedicated account manager',
        'VIP event invitations',
        'Lifetime warranty upgrades'
      ]
    };

    return benefits[tier as keyof typeof benefits] || benefits.Bronze;
  }

  /**
   * Send loyalty tier upgrade email
   */
  async sendTierUpgradeEmail(profile: CustomerProfile, newTier: string) {
    if (!process.env.RESEND_API_KEY) return { success: false };

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 40px; text-align: center;">
          <h1>🎉 Congratulations!</h1>
          <p style="font-size: 24px; margin: 10px 0;">You've Reached ${newTier} Status</p>
        </div>

        <div style="padding: 40px 30px;">
          <p>Hi ${profile.firstName || 'there'},</p>

          <p>We're thrilled to announce that you've been upgraded to <strong>${newTier}</strong> status in our loyalty program!</p>

          <div style="background: var(--color-primary); color: white; padding: 30px; border-radius: 12px; margin: 30px 0;">
            <h2 style="margin-top: 0;">Your New Benefits:</h2>
            ${this.getTierBenefits(newTier).map(b => `<div style="margin: 10px 0;">✓ ${b}</div>`).join('')}
          </div>

          <p>Thank you for being a valued customer. We look forward to continuing to serve you!</p>

          <center>
            <a href="https://www.pgclosets.com/loyalty" style="display: inline-block; background: #F59E0B; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">View My Rewards</a>
          </center>
        </div>
      </div>
    `;

    return await resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <rewards@pgclosets.ca>',
      to: profile.email,
      subject: `🎉 You've Been Upgraded to ${newTier} Status!`,
      html,
      tags: [{ name: 'type', value: 'loyalty-upgrade' }]
    });
  }

  /**
   * Send points balance email
   */
  async sendPointsBalanceEmail(profile: CustomerProfile) {
    const loyaltyStatus = this.calculatePoints(profile);

    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: var(--color-primary); color: white; padding: 30px; text-align: center;">
          <h1>Your Loyalty Points</h1>
        </div>

        <div style="padding: 40px 30px;">
          <p>Hi ${profile.firstName || 'there'},</p>

          <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; text-align: center; padding: 40px; border-radius: 12px; margin: 30px 0;">
            <div style="font-size: 48px; font-weight: 700;">${loyaltyStatus.points}</div>
            <div style="font-size: 18px;">Loyalty Points</div>
            <div style="margin-top: 20px; font-size: 16px; opacity: 0.9;">
              ${loyaltyStatus.tier} Tier Member
            </div>
          </div>

          ${loyaltyStatus.nextTier ? `
            <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Only ${loyaltyStatus.pointsToNextTier} points away from ${loyaltyStatus.nextTier} status!</strong></p>
              <p style="margin: 10px 0 0 0; color: var(--color-text-muted);">Earn points on every purchase.</p>
            </div>
          ` : ''}

          <center>
            <a href="https://www.pgclosets.com/shop" style="display: inline-block; background: #10B981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Start Shopping</a>
          </center>
        </div>
      </div>
    `;

    return await resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <rewards@pgclosets.ca>',
      to: profile.email,
      subject: 'Your Loyalty Points Balance',
      html,
      tags: [{ name: 'type', value: 'loyalty-balance' }]
    });
  }
}

// AGENT 12: Re-engagement Campaign Manager
export class ReengagementAgent {
  /**
   * Identify customers who need re-engagement
   */
  identifyInactiveCustomers(profiles: CustomerProfile[]): CustomerProfile[] {
    const INACTIVE_THRESHOLD_DAYS = 90;
    const now = Date.now();

    return profiles.filter(profile => {
      if (!profile.lastPurchase) return true;

      const daysSinceLastPurchase =
        (now - profile.lastPurchase.getTime()) / (1000 * 60 * 60 * 24);

      return daysSinceLastPurchase > INACTIVE_THRESHOLD_DAYS;
    });
  }

  /**
   * Send win-back campaign
   */
  async sendWinBackEmail(profile: CustomerProfile, incentive: {
    type: 'discount' | 'free-shipping' | 'gift';
    value: string;
    code?: string;
  }) {
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%); color: white; padding: 40px; text-align: center;">
          <h1>We Miss You!</h1>
          <p style="font-size: 18px; margin: 0;">Come back and save big</p>
        </div>

        <div style="padding: 40px 30px;">
          <p>Hi ${profile.firstName || 'there'},</p>

          <p>It's been a while since we've seen you! We wanted to reach out with a special offer just for you.</p>

          <div style="background: var(--color-primary); color: white; text-align: center; padding: 40px; border-radius: 12px; margin: 30px 0;">
            <h2 style="margin: 0; font-size: 32px;">${incentive.value}</h2>
            <p style="margin: 10px 0 20px 0; font-size: 18px;">Welcome Back Offer</p>
            ${incentive.code ? `
              <div style="background: white; color: var(--color-primary); padding: 15px; border-radius: 8px; font-size: 24px; font-weight: 700; letter-spacing: 2px;">
                ${incentive.code}
              </div>
            ` : ''}
          </div>

          <p><strong>What's new since you've been gone:</strong></p>
          <ul style="line-height: 2;">
            <li>New Renin sliding door collection</li>
            <li>Expanded home office solutions</li>
            <li>Enhanced warranty program</li>
            <li>Free design consultations</li>
          </ul>

          <center>
            <a href="https://www.pgclosets.com" style="display: inline-block; background: #10B981; color: white; padding: 18px 50px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px; margin: 20px 0;">Claim My Offer</a>
          </center>

          <p style="color: var(--color-text-muted); font-size: 14px; margin-top: 30px;">Offer expires in 7 days</p>
        </div>
      </div>
    `;

    return await resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <hello@pgclosets.ca>',
      to: profile.email,
      subject: `We Miss You! Here's ${incentive.value} to Come Back`,
      html,
      tags: [
        { name: 'type', value: 'win-back' },
        { name: 'incentive', value: incentive.type }
      ]
    });
  }

  /**
   * Send feedback request to lapsed customers
   */
  async sendFeedbackRequest(profile: CustomerProfile) {
    const html = `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: var(--color-primary); color: white; padding: 30px; text-align: center;">
          <h1>We Want to Hear From You</h1>
        </div>

        <div style="padding: 40px 30px;">
          <p>Hi ${profile.firstName || 'there'},</p>

          <p>We noticed you haven't visited us in a while, and we'd love to know why. Your feedback helps us improve!</p>

          <center>
            <a href="https://www.pgclosets.com/feedback?email=${encodeURIComponent(profile.email)}" style="display: inline-block; background: #10B981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Share Your Feedback</a>
          </center>

          <p style="font-size: 14px; color: var(--color-text-muted);">Takes less than 2 minutes • Get 10% off your next purchase as a thank you</p>
        </div>
      </div>
    `;

    return await resend.emails.send({
      from: process.env.EMAIL_FROM || 'PG Closets <feedback@pgclosets.ca>',
      to: profile.email,
      subject: 'Quick Question: Why Haven\'t We Seen You?',
      html,
      tags: [{ name: 'type', value: 'feedback-request' }]
    });
  }
}

export interface LoyaltyStatus {
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  nextTier: string | null;
  pointsToNextTier: number | null;
  benefits: string[];
  lifetimeValue: number;
}

export const loyaltyProgramAgent = new LoyaltyProgramAgent();
export const reengagementAgent = new ReengagementAgent();
