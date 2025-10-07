/**
 * AGENTS 9-10: Email Personalization System
 *
 * Agent 9: Dynamic Content Engine
 * Agent 10: Product Recommendation Engine
 */

import { CustomerProfile } from '../segmentation/customer-segmentation-agent';

// AGENT 9: Dynamic Content Engine
export class DynamicContentAgent {
  /**
   * Personalize email content based on customer profile
   */
  personalizeContent(template: string, profile: CustomerProfile, context?: Record<string, any>): string {
    let personalized = template;

    // Replace merge tags
    personalized = personalized.replace(/{{firstName}}/g, profile.firstName || 'there');
    personalized = personalized.replace(/{{email}}/g, profile.email);
    personalized = personalized.replace(/{{location}}/g, profile.location || 'Ottawa');

    // Dynamic greeting based on time
    const greeting = this.getTimeBasedGreeting();
    personalized = personalized.replace(/{{greeting}}/g, greeting);

    // Personalized subject lines
    if (context?.subject) {
      personalized = personalized.replace(/{{subject}}/g,
        this.personalizeSubject(context.subject, profile));
    }

    return personalized;
  }

  /**
   * Generate time-based greeting
   */
  private getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  /**
   * Personalize subject line
   */
  personalizeSubject(base: string, profile: CustomerProfile): string {
    // Add name for VIP customers
    if (profile.totalSpent > 5000 && profile.firstName) {
      return `${profile.firstName}, ${base}`;
    }

    // Add location
    if (profile.location && base.includes('[LOCATION]')) {
      return base.replace('[LOCATION]', profile.location);
    }

    // Add urgency for high-intent customers
    if (profile.interests.includes('quote-requested')) {
      return `⏰ ${base}`;
    }

    return base;
  }

  /**
   * Dynamic content blocks based on customer behavior
   */
  getDynamicContentBlock(profile: CustomerProfile): {
    type: 'social-proof' | 'urgency' | 'value-prop' | 'testimonial';
    content: string;
  } {
    // New customers: Social proof
    if (profile.purchaseCount === 0) {
      return {
        type: 'social-proof',
        content: `
          <div style="background: #F0F9FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>⭐ Trusted by 500+ Ottawa homeowners</strong></p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Join our community of satisfied customers who have transformed their spaces.</p>
          </div>
        `
      };
    }

    // Recent buyers: Testimonial
    if (profile.purchaseCount >= 1) {
      return {
        type: 'testimonial',
        content: `
          <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 20px; margin: 20px 0;">
            <p style="font-style: italic; margin: 0;">"PG Closets completely transformed our master bedroom. The quality and attention to detail is exceptional!"</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;"><strong>- Sarah M., Kanata</strong></p>
          </div>
        `
      };
    }

    // High-value customers: VIP treatment
    if (profile.totalSpent > 3000) {
      return {
        type: 'value-prop',
        content: `
          <div style="background: linear-gradient(135deg, var(--color-primary) 0%, #2563EB 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>💎 Valued Customer Benefits</strong></p>
            <p style="margin: 10px 0 0 0;">As a VIP customer, you get: Priority scheduling, exclusive discounts, and lifetime support.</p>
          </div>
        `
      };
    }

    // Default: Urgency
    return {
      type: 'urgency',
      content: `
        <div style="background: #FEE2E2; border-left: 4px solid #EF4444; padding: 20px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⏰ Limited Time Offer</strong></p>
          <p style="margin: 5px 0 0 0;">Schedule your consultation this week and save!</p>
        </div>
      `
    };
  }

  /**
   * Personalize CTA based on customer stage
   */
  getPersonalizedCTA(profile: CustomerProfile): {
    text: string;
    url: string;
  } {
    // New leads: Book consultation
    if (profile.purchaseCount === 0 && !profile.interests.includes('consultation-booked')) {
      return {
        text: 'Book Free Online Quote',
        url: 'https://www.pgclosets.com/book-consultation'
      };
    }

    // Quote requested: Get quote
    if (profile.interests.includes('quote-requested')) {
      return {
        text: 'View My Quote',
        url: 'https://www.pgclosets.com/quote-status'
      };
    }

    // Recent buyers: Shop again
    if (profile.lastPurchase && (Date.now() - profile.lastPurchase.getTime()) < 90 * 24 * 60 * 60 * 1000) {
      return {
        text: 'Browse New Products',
        url: 'https://www.pgclosets.com/products'
      };
    }

    // Default: Get quote
    return {
      text: 'Get Your Free Quote',
      url: 'https://www.pgclosets.com/quote'
    };
  }
}

// AGENT 10: Product Recommendation Engine
export class ProductRecommendationAgent {
  /**
   * Get personalized product recommendations
   */
  getRecommendations(profile: CustomerProfile, context: {
    limit?: number;
    excludeIds?: string[];
  } = {}): ProductRecommendation[] {
    const recommendations: ProductRecommendation[] = [];

    // Based on purchase history
    if (profile.interests.includes('closets')) {
      recommendations.push({
        id: 'renin-sliding-doors',
        name: 'Renin Sliding Doors',
        image: 'https://www.pgclosets.com/images/products/renin-sliding-doors.jpg',
        price: 899,
        reason: 'Perfect complement to your closet system',
        confidence: 0.85
      });
    }

    // Based on browsing behavior
    if (profile.interests.includes('home-office')) {
      recommendations.push({
        id: 'custom-desk-system',
        name: 'Custom Home Office Desk',
        image: 'https://www.pgclosets.com/images/products/home-office.jpg',
        price: 1299,
        reason: 'Complete your home office transformation',
        confidence: 0.78
      });
    }

    // Popular products
    recommendations.push({
      id: 'led-closet-lighting',
      name: 'LED Closet Lighting Kit',
      image: 'https://www.pgclosets.com/images/products/led-lighting.jpg',
      price: 149,
      reason: 'Most popular upgrade for closet systems',
      confidence: 0.92
    });

    // Sort by confidence and apply limit
    return recommendations
      .sort((a, b) => b.confidence - a.confidence)
      .filter(r => !context.excludeIds?.includes(r.id))
      .slice(0, context.limit || 3);
  }

  /**
   * Cross-sell recommendations
   */
  getCrossSellProducts(purchasedProduct: string): ProductRecommendation[] {
    const crossSellMap: Record<string, ProductRecommendation[]> = {
      'closet-system': [
        {
          id: 'led-lighting',
          name: 'LED Closet Lighting',
          image: 'https://www.pgclosets.com/images/products/led-lighting.jpg',
          price: 149,
          reason: 'Enhance visibility in your new closet',
          confidence: 0.95
        },
        {
          id: 'organizer-bins',
          name: 'Premium Storage Bins Set',
          image: 'https://www.pgclosets.com/images/products/bins.jpg',
          price: 79,
          reason: 'Keep small items organized',
          confidence: 0.88
        }
      ]
    };

    return crossSellMap[purchasedProduct] || [];
  }

  /**
   * Generate product recommendation email block
   */
  getRecommendationEmailBlock(recommendations: ProductRecommendation[]): string {
    const productsHtml = recommendations.map(product => `
      <div style="border: 1px solid var(--color-border-default); border-radius: 8px; padding: 15px; margin: 10px 0;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
        <h3 style="margin: 10px 0; color: var(--color-primary);">${product.name}</h3>
        <p style="color: var(--color-text-muted); font-size: 14px; margin: 5px 0;">${product.reason}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
          <span style="font-size: 24px; font-weight: 700; color: var(--color-primary);">$${product.price}</span>
          <a href="https://www.pgclosets.com/products/${product.id}" style="background: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Details</a>
        </div>
      </div>
    `).join('');

    return `
      <div style="margin: 30px 0;">
        <h2 style="color: var(--color-primary); margin-bottom: 20px;">Recommended For You</h2>
        ${productsHtml}
      </div>
    `;
  }
}

export interface ProductRecommendation {
  id: string;
  name: string;
  image: string;
  price: number;
  reason: string;
  confidence: number; // 0-1
}

export const dynamicContentAgent = new DynamicContentAgent();
export const productRecommendationAgent = new ProductRecommendationAgent();
