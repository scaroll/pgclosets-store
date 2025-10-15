/**
 * Email Marketing Workflow Definitions
 *
 * All 8 production-ready email sequences:
 * 1. Welcome Series (5 emails, 14 days)
 * 2. Quote Abandonment (3 emails, 7 days)
 * 3. Post-Purchase Nurture (4 emails, 90 days)
 * 4. Re-engagement (3 emails, 30 days)
 * 5. Product Launch (4 emails, 2 weeks)
 * 6. Seasonal Campaigns (4 sequences)
 * 7. Educational Drip (10 emails, 30 days)
 * 8. VIP Customer (ongoing)
 */

import { WorkflowDefinition } from './workflow-engine';

/**
 * 1. WELCOME SERIES
 * Nurtures new subscribers through brand introduction and product education
 */
export const WELCOME_SERIES: WorkflowDefinition = {
  id: 'welcome-series',
  name: 'Welcome Series',
  description: '5-email sequence introducing PG Closets brand and products',
  trigger: 'newsletter_subscribe',
  emails: [
    {
      id: 'welcome-1',
      name: 'Welcome + Brand Story',
      subject: 'Welcome to PG Closets – Transform Your Space',
      templateId: 'welcome-brand-story',
      delay: { type: 'immediate' }
    },
    {
      id: 'welcome-2',
      name: 'Product Education',
      subject: 'Discover Custom Storage Solutions That Fit Your Life',
      templateId: 'welcome-product-education',
      delay: { type: 'days', value: 2 }
    },
    {
      id: 'welcome-3',
      name: 'How to Measure Guide',
      subject: 'Free Guide: How to Measure Your Space for Custom Closets',
      templateId: 'welcome-measuring-guide',
      delay: { type: 'days', value: 5 }
    },
    {
      id: 'welcome-4',
      name: 'Customer Testimonials',
      subject: 'See Why Ottawa Homeowners Choose PG Closets',
      templateId: 'welcome-testimonials',
      delay: { type: 'days', value: 9 }
    },
    {
      id: 'welcome-5',
      name: 'Book Consultation CTA',
      subject: 'Ready to Start? Book Your Free Consultation',
      templateId: 'welcome-consultation-cta',
      delay: { type: 'days', value: 14 },
      condition: (context) => !context.metadata?.hasQuote && !context.metadata?.hasPurchase
    }
  ],
  settings: {
    maxRetries: 3,
    unsubscribeAction: 'stop',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 2. QUOTE ABANDONMENT
 * Recovers incomplete quote submissions with urgency and support
 */
export const QUOTE_ABANDONMENT: WorkflowDefinition = {
  id: 'quote-abandonment',
  name: 'Quote Abandonment Recovery',
  description: '3-email sequence to recover abandoned quote requests',
  trigger: 'quote_abandon',
  emails: [
    {
      id: 'quote-1',
      name: 'Finish Your Quote',
      subject: 'Complete Your Custom Closet Quote in 2 Minutes',
      templateId: 'quote-reminder',
      delay: { type: 'hours', value: 24 }
    },
    {
      id: 'quote-2',
      name: 'Questions & Support',
      subject: 'Have Questions About Your Quote? We\'re Here to Help',
      templateId: 'quote-support',
      delay: { type: 'days', value: 3 }
    },
    {
      id: 'quote-3',
      name: 'Free Consultation Offer',
      subject: 'Limited Time: Free In-Home Consultation',
      templateId: 'quote-consultation-offer',
      delay: { type: 'days', value: 7 },
      condition: (context) => !context.metadata?.hasBookedConsultation
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'stop',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 3. POST-PURCHASE NURTURE
 * Guides customers through installation and maintenance, drives referrals
 */
export const POST_PURCHASE_NURTURE: WorkflowDefinition = {
  id: 'post-purchase',
  name: 'Post-Purchase Nurture',
  description: '4-email sequence for customer education and referral requests',
  trigger: 'purchase_complete',
  emails: [
    {
      id: 'post-1',
      name: 'Thank You + What\'s Next',
      subject: 'Thank You for Choosing PG Closets!',
      templateId: 'post-purchase-thank-you',
      delay: { type: 'immediate' }
    },
    {
      id: 'post-2',
      name: 'Installation Tips',
      subject: 'Preparing for Your Installation Day',
      templateId: 'post-purchase-installation',
      delay: { type: 'days', value: 7 }
    },
    {
      id: 'post-3',
      name: 'Maintenance Guide',
      subject: 'Keep Your Custom Closets Looking Beautiful',
      templateId: 'post-purchase-maintenance',
      delay: { type: 'days', value: 30 }
    },
    {
      id: 'post-4',
      name: 'Referral Request',
      subject: 'Love Your New Closets? Refer a Friend and Save',
      templateId: 'post-purchase-referral',
      delay: { type: 'days', value: 90 }
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'pause',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 4. RE-ENGAGEMENT
 * Reactivates inactive subscribers with personalized offers
 */
export const RE_ENGAGEMENT: WorkflowDefinition = {
  id: 're-engagement',
  name: 'Re-engagement Campaign',
  description: '3-email sequence to reactivate inactive subscribers',
  trigger: 'user_inactive',
  emails: [
    {
      id: 'reengage-1',
      name: 'We Miss You',
      subject: 'We Miss You! See What\'s New at PG Closets',
      templateId: 'reengagement-miss-you',
      delay: { type: 'immediate' }
    },
    {
      id: 'reengage-2',
      name: 'Special Offer',
      subject: 'Exclusive Offer Just for You',
      templateId: 'reengagement-special-offer',
      delay: { type: 'days', value: 15 }
    },
    {
      id: 'reengage-3',
      name: 'Last Chance',
      subject: 'Last Chance to Stay Connected',
      templateId: 'reengagement-last-chance',
      delay: { type: 'days', value: 30 }
    }
  ],
  settings: {
    maxRetries: 1,
    unsubscribeAction: 'stop',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 5. PRODUCT LAUNCH
 * Announces new products with teaser, reveal, and urgency
 */
export const PRODUCT_LAUNCH: WorkflowDefinition = {
  id: 'product-launch',
  name: 'Product Launch Campaign',
  description: '4-email sequence for new product announcements',
  trigger: 'product_launch',
  emails: [
    {
      id: 'launch-1',
      name: 'Teaser Announcement',
      subject: 'Something Exciting is Coming to PG Closets...',
      templateId: 'product-launch-teaser',
      delay: { type: 'immediate' }
    },
    {
      id: 'launch-2',
      name: 'Full Reveal + Specs',
      subject: 'Introducing [Product Name] – Revolutionary Storage Solutions',
      templateId: 'product-launch-reveal',
      delay: { type: 'days', value: 3 }
    },
    {
      id: 'launch-3',
      name: 'Customer Stories',
      subject: 'See [Product Name] in Real Homes',
      templateId: 'product-launch-stories',
      delay: { type: 'days', value: 7 }
    },
    {
      id: 'launch-4',
      name: 'Last Chance',
      subject: 'Last Chance for Launch Pricing',
      templateId: 'product-launch-urgency',
      delay: { type: 'days', value: 14 }
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'pause',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 6A. SEASONAL CAMPAIGN - SPRING REFRESH
 */
export const SPRING_REFRESH: WorkflowDefinition = {
  id: 'spring-refresh',
  name: 'Spring Refresh Campaign',
  description: 'Spring organization and decluttering campaign',
  trigger: 'manual',
  emails: [
    {
      id: 'spring-1',
      name: 'Spring Cleaning Announcement',
      subject: 'Spring Into Organization: Refresh Your Home',
      templateId: 'seasonal-spring-1',
      delay: { type: 'immediate' }
    },
    {
      id: 'spring-2',
      name: 'Decluttering Tips',
      subject: '5 Spring Decluttering Tips from the Pros',
      templateId: 'seasonal-spring-2',
      delay: { type: 'days', value: 7 }
    },
    {
      id: 'spring-3',
      name: 'Spring Sale Announcement',
      subject: 'Spring Sale: Save on Custom Storage Solutions',
      templateId: 'seasonal-spring-3',
      delay: { type: 'days', value: 14 }
    },
    {
      id: 'spring-4',
      name: 'Last Chance',
      subject: 'Final Days: Spring Sale Ends Soon',
      templateId: 'seasonal-spring-4',
      delay: { type: 'days', value: 21 }
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'pause',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 6B. SEASONAL CAMPAIGN - SUMMER SALE
 */
export const SUMMER_SALE: WorkflowDefinition = {
  id: 'summer-sale',
  name: 'Summer Sale Campaign',
  description: 'Summer vacation and home improvement campaign',
  trigger: 'manual',
  emails: [
    {
      id: 'summer-1',
      name: 'Summer Sale Launch',
      subject: 'Summer Sale: Transform Your Home Before Vacation',
      templateId: 'seasonal-summer-1',
      delay: { type: 'immediate' }
    },
    {
      id: 'summer-2',
      name: 'Project Showcase',
      subject: 'Summer Projects: Garage Organization Made Easy',
      templateId: 'seasonal-summer-2',
      delay: { type: 'days', value: 7 }
    },
    {
      id: 'summer-3',
      name: 'Mid-Sale Reminder',
      subject: 'Halfway Through Summer Sale – Don\'t Miss Out',
      templateId: 'seasonal-summer-3',
      delay: { type: 'days', value: 14 }
    },
    {
      id: 'summer-4',
      name: 'Final Weekend',
      subject: 'Final Weekend: Summer Sale Ends Monday',
      templateId: 'seasonal-summer-4',
      delay: { type: 'days', value: 21 }
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'pause',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 6C. SEASONAL CAMPAIGN - FALL RENOVATION
 */
export const FALL_RENOVATION: WorkflowDefinition = {
  id: 'fall-renovation',
  name: 'Fall Renovation Campaign',
  description: 'Fall home improvement and preparation campaign',
  trigger: 'manual',
  emails: [
    {
      id: 'fall-1',
      name: 'Fall Renovation Season',
      subject: 'Fall Home Improvement Season is Here',
      templateId: 'seasonal-fall-1',
      delay: { type: 'immediate' }
    },
    {
      id: 'fall-2',
      name: 'Back to School Organization',
      subject: 'Back to School: Organize for Success',
      templateId: 'seasonal-fall-2',
      delay: { type: 'days', value: 7 }
    },
    {
      id: 'fall-3',
      name: 'Fall Sale',
      subject: 'Fall Sale: Save on Custom Storage Before Winter',
      templateId: 'seasonal-fall-3',
      delay: { type: 'days', value: 14 }
    },
    {
      id: 'fall-4',
      name: 'Holiday Prep',
      subject: 'Get Organized Before the Holiday Rush',
      templateId: 'seasonal-fall-4',
      delay: { type: 'days', value: 21 }
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'pause',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 6D. SEASONAL CAMPAIGN - HOLIDAY GIFTING
 */
export const HOLIDAY_GIFTING: WorkflowDefinition = {
  id: 'holiday-gifting',
  name: 'Holiday Gifting Campaign',
  description: 'Holiday shopping and home preparation campaign',
  trigger: 'manual',
  emails: [
    {
      id: 'holiday-1',
      name: 'Holiday Announcement',
      subject: 'Give the Gift of Organization This Holiday',
      templateId: 'seasonal-holiday-1',
      delay: { type: 'immediate' }
    },
    {
      id: 'holiday-2',
      name: 'Gift Guide',
      subject: 'Holiday Gift Guide: Custom Storage Solutions',
      templateId: 'seasonal-holiday-2',
      delay: { type: 'days', value: 7 }
    },
    {
      id: 'holiday-3',
      name: 'Last Minute Shopping',
      subject: 'Last Minute Gifts: Gift Certificates Available',
      templateId: 'seasonal-holiday-3',
      delay: { type: 'days', value: 14 }
    },
    {
      id: 'holiday-4',
      name: 'New Year Organization',
      subject: 'New Year, New Organization Goals',
      templateId: 'seasonal-holiday-4',
      delay: { type: 'days', value: 28 }
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'pause',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 7. EDUCATIONAL DRIP
 * 10-week educational content series on organization and design
 */
export const EDUCATIONAL_DRIP: WorkflowDefinition = {
  id: 'educational-drip',
  name: 'Educational Drip Campaign',
  description: '10-email educational series on closet organization and design',
  trigger: 'newsletter_subscribe',
  emails: [
    {
      id: 'edu-1',
      name: 'Week 1: Space Planning Basics',
      subject: 'Week 1: Master the Art of Space Planning',
      templateId: 'educational-week-1',
      delay: { type: 'days', value: 7 }
    },
    {
      id: 'edu-2',
      name: 'Week 2: Closet Organization Systems',
      subject: 'Week 2: Choosing the Right Organization System',
      templateId: 'educational-week-2',
      delay: { type: 'days', value: 14 }
    },
    {
      id: 'edu-3',
      name: 'Week 3: Maximizing Vertical Space',
      subject: 'Week 3: Vertical Storage Solutions That Work',
      templateId: 'educational-week-3',
      delay: { type: 'days', value: 21 }
    },
    {
      id: 'edu-4',
      name: 'Week 4: Color Coordination',
      subject: 'Week 4: Color Coordination for Closets',
      templateId: 'educational-week-4',
      delay: { type: 'days', value: 28 }
    },
    {
      id: 'edu-5',
      name: 'Week 5: Seasonal Storage',
      subject: 'Week 5: Seasonal Wardrobe Rotation Tips',
      templateId: 'educational-week-5',
      delay: { type: 'days', value: 35 }
    },
    {
      id: 'edu-6',
      name: 'Week 6: Accessory Organization',
      subject: 'Week 6: Organize Accessories Like a Pro',
      templateId: 'educational-week-6',
      delay: { type: 'days', value: 42 }
    },
    {
      id: 'edu-7',
      name: 'Week 7: Lighting Design',
      subject: 'Week 7: Illuminate Your Closet Space',
      templateId: 'educational-week-7',
      delay: { type: 'days', value: 49 }
    },
    {
      id: 'edu-8',
      name: 'Week 8: Material Selection',
      subject: 'Week 8: Choosing the Right Materials',
      templateId: 'educational-week-8',
      delay: { type: 'days', value: 56 }
    },
    {
      id: 'edu-9',
      name: 'Week 9: Maintenance Tips',
      subject: 'Week 9: Keep Your Closets Looking New',
      templateId: 'educational-week-9',
      delay: { type: 'days', value: 63 }
    },
    {
      id: 'edu-10',
      name: 'Week 10: Ready for Custom Design',
      subject: 'Week 10: Ready to Design Your Custom Closet?',
      templateId: 'educational-week-10',
      delay: { type: 'days', value: 70 }
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'stop',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * 8. VIP CUSTOMER
 * Ongoing engagement for high-value customers
 */
export const VIP_CUSTOMER: WorkflowDefinition = {
  id: 'vip-customer',
  name: 'VIP Customer Program',
  description: 'Exclusive benefits for VIP customers',
  trigger: 'manual',
  emails: [
    {
      id: 'vip-1',
      name: 'VIP Welcome',
      subject: 'Welcome to PG Closets VIP Program',
      templateId: 'vip-welcome',
      delay: { type: 'immediate' }
    },
    {
      id: 'vip-2',
      name: 'Early Access Notification',
      subject: 'VIP Early Access: New Product Preview',
      templateId: 'vip-early-access',
      delay: { type: 'days', value: 30 }
    },
    {
      id: 'vip-3',
      name: 'Exclusive Discount',
      subject: 'VIP Exclusive: 15% Off Your Next Purchase',
      templateId: 'vip-exclusive-discount',
      delay: { type: 'days', value: 60 }
    },
    {
      id: 'vip-4',
      name: 'Birthday Offer',
      subject: 'Happy Birthday! A Special Gift From PG Closets',
      templateId: 'vip-birthday',
      delay: { type: 'days', value: 90 },
      condition: (context) => {
        // Send only if birthday is in context
        return !!context.metadata?.birthday;
      }
    }
  ],
  settings: {
    maxRetries: 2,
    unsubscribeAction: 'pause',
    timezoneAware: true,
    sendTimeOptimization: true
  }
};

/**
 * All workflow definitions
 */
export const ALL_WORKFLOWS: WorkflowDefinition[] = [
  WELCOME_SERIES,
  QUOTE_ABANDONMENT,
  POST_PURCHASE_NURTURE,
  RE_ENGAGEMENT,
  PRODUCT_LAUNCH,
  SPRING_REFRESH,
  SUMMER_SALE,
  FALL_RENOVATION,
  HOLIDAY_GIFTING,
  EDUCATIONAL_DRIP,
  VIP_CUSTOMER
];

/**
 * Get workflow by ID
 */
export function getWorkflow(id: string): WorkflowDefinition | undefined {
  return ALL_WORKFLOWS.find(w => w.id === id);
}

/**
 * Get workflows by trigger
 */
export function getWorkflowsByTrigger(trigger: string): WorkflowDefinition[] {
  return ALL_WORKFLOWS.filter(w => w.trigger === trigger);
}
