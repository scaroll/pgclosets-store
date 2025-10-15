/**
 * Email Marketing Integration Example
 *
 * Real-world integration examples for PG Closets website
 */

import WorkflowEngine from './workflow-engine';
import { ALL_WORKFLOWS } from './workflows';
import { SegmentationEngine, PersonalizationEngine, SubscriberProfile } from './segmentation';
import AnalyticsEngine from './analytics';

// Initialize system
const emailEngine = new WorkflowEngine('resend');
ALL_WORKFLOWS.forEach(w => emailEngine.registerWorkflow(w));

const segmentEngine = new SegmentationEngine();
const personalizationEngine = new PersonalizationEngine();
const analyticsEngine = new AnalyticsEngine();

/**
 * EXAMPLE 1: Newsletter Signup with Welcome Series
 */
export async function handleNewsletterSignup(data: {
  email: string;
  firstName?: string;
  lastName?: string;
  source: string;
}) {
  console.log('📧 Processing newsletter signup:', data.email);

  // 1. Store subscriber in database
  const subscriber = await createSubscriber({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    signupSource: data.source,
    signupDate: new Date()
  });

  // 2. Start welcome series workflow
  const result = await emailEngine.startWorkflow('welcome-series', {
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    metadata: {
      signupSource: data.source,
      subscriberId: subscriber.id
    }
  });

  console.log('✅ Welcome series started:', result.instanceId);

  return {
    success: true,
    subscriberId: subscriber.id,
    workflowInstanceId: result.instanceId
  };
}

/**
 * EXAMPLE 2: Quote Abandonment Recovery
 */
export async function handleQuoteAbandonment(data: {
  email: string;
  firstName?: string;
  quoteId: string;
  quoteValue: number;
  abandonedAt: Date;
}) {
  console.log('🛒 Processing quote abandonment:', data.quoteId);

  // Check if user already has active quote abandonment workflow
  const existingInstances = emailEngine.getUserInstances(data.email);
  const hasActiveRecovery = existingInstances.some(
    i => i.workflowId === 'quote-abandonment' && i.status === 'active'
  );

  if (hasActiveRecovery) {
    console.log('⏭️ User already has active recovery workflow');
    return { success: false, reason: 'Already in recovery sequence' };
  }

  // Start quote abandonment workflow
  const result = await emailEngine.startWorkflow('quote-abandonment', {
    email: data.email,
    firstName: data.firstName,
    metadata: {
      quoteId: data.quoteId,
      quoteValue: data.quoteValue,
      abandonedAt: data.abandonedAt,
      checkoutUrl: `https://www.pgclosets.com/quote/${data.quoteId}`
    }
  });

  console.log('✅ Quote recovery started:', result.instanceId);

  return {
    success: true,
    workflowInstanceId: result.instanceId
  };
}

/**
 * EXAMPLE 3: Post-Purchase Nurture
 */
export async function handlePurchaseComplete(data: {
  orderId: string;
  customerId: string;
  email: string;
  firstName: string;
  orderValue: number;
  installationDate?: Date;
}) {
  console.log('🎉 Processing purchase completion:', data.orderId);

  // 1. Cancel any active quote abandonment workflows
  const activeInstances = emailEngine.getUserInstances(data.email);
  activeInstances
    .filter(i => i.workflowId === 'quote-abandonment' && i.status === 'active')
    .forEach(i => emailEngine.cancelWorkflow(i.id));

  // 2. Update customer segment
  await updateCustomerSegment(data.customerId, {
    funnelStage: 'customer',
    lifetimeValue: data.orderValue,
    lastPurchaseDate: new Date()
  });

  // 3. Start post-purchase nurture
  const result = await emailEngine.startWorkflow('post-purchase', {
    email: data.email,
    firstName: data.firstName,
    metadata: {
      orderId: data.orderId,
      orderValue: data.orderValue,
      installationDate: data.installationDate
    }
  });

  console.log('✅ Post-purchase nurture started:', result.instanceId);

  return {
    success: true,
    workflowInstanceId: result.instanceId
  };
}

/**
 * EXAMPLE 4: Seasonal Campaign Launch
 */
export async function launchSeasonalCampaign(
  campaignId: 'spring-refresh' | 'summer-sale' | 'fall-renovation' | 'holiday-gifting'
) {
  console.log(`🌟 Launching seasonal campaign: ${campaignId}`);

  // 1. Get target audience (active + engaged subscribers)
  const subscribers = await getAllSubscribers();
  const profiles = subscribers.map(s => mapToSubscriberProfile(s));

  const targetAudience = segmentEngine.queryBySegment(profiles, {
    behavior: ['active', 'engaged'],
    funnel: ['subscriber', 'lead', 'prospect']
  });

  console.log(`📊 Target audience: ${targetAudience.length} subscribers`);

  // 2. Personalize and send to each subscriber
  const results = [];
  for (const profile of targetAudience) {
    const result = await emailEngine.startWorkflow(campaignId, {
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      metadata: {
        segment: segmentEngine.getSegment(profile),
        interests: profile.interests
      }
    });

    results.push(result);

    // Rate limiting: wait 100ms between sends
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`✅ Campaign launched to ${successCount}/${targetAudience.length} subscribers`);

  return {
    success: true,
    sent: successCount,
    total: targetAudience.length
  };
}

/**
 * EXAMPLE 5: Re-engagement for Inactive Users
 */
export async function reengageInactiveUsers() {
  console.log('🔄 Starting re-engagement campaign for inactive users');

  // 1. Identify inactive subscribers
  const subscribers = await getAllSubscribers();
  const profiles = subscribers.map(s => mapToSubscriberProfile(s));

  const inactiveUsers = segmentEngine.queryBySegment(profiles, {
    behavior: ['inactive', 'at-risk']
  });

  console.log(`📊 Found ${inactiveUsers.length} inactive users`);

  // 2. Segment by value (prioritize high-value)
  const highValueInactive = inactiveUsers.filter(p => {
    const segment = segmentEngine.getSegment(p);
    return segment.value === 'high-value';
  });

  const standardInactive = inactiveUsers.filter(p => {
    const segment = segmentEngine.getSegment(p);
    return segment.value !== 'high-value';
  });

  // 3. Send personalized re-engagement
  const results = [];

  // High-value users get VIP treatment
  for (const profile of highValueInactive) {
    const result = await emailEngine.startWorkflow('vip-customer', {
      email: profile.email,
      firstName: profile.firstName,
      metadata: {
        vipTier: 'gold',
        specialOffer: '20% off next purchase',
        reengagement: true
      }
    });
    results.push(result);
  }

  // Standard users get regular re-engagement
  for (const profile of standardInactive) {
    const result = await emailEngine.startWorkflow('re-engagement', {
      email: profile.email,
      firstName: profile.firstName,
      metadata: {
        inactiveDays: Math.floor(
          (Date.now() - (profile.lastOpenedAt?.getTime() || 0)) / (1000 * 60 * 60 * 24)
        )
      }
    });
    results.push(result);
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`✅ Re-engagement sent to ${successCount}/${inactiveUsers.length} users`);

  return {
    success: true,
    highValue: highValueInactive.length,
    standard: standardInactive.length,
    total: successCount
  };
}

/**
 * EXAMPLE 6: Predictive Next Best Action
 */
export async function executeNextBestAction(email: string) {
  console.log(`🎯 Determining next best action for: ${email}`);

  // 1. Get subscriber profile
  const subscriber = await getSubscriber(email);
  if (!subscriber) {
    console.log('❌ Subscriber not found');
    return { success: false };
  }

  const profile = mapToSubscriberProfile(subscriber);

  // 2. Calculate next best action
  const nextAction = segmentEngine.getNextBestAction(profile);
  console.log(`📍 Next best action: ${nextAction.action} (${nextAction.priority} priority)`);

  // 3. Execute action
  let result;
  switch (nextAction.action) {
    case 're-engagement-campaign':
      result = await emailEngine.startWorkflow('re-engagement', {
        email: profile.email,
        firstName: profile.firstName,
        metadata: { reason: nextAction.reason }
      });
      break;

    case 'quote-completion-reminder':
      result = await emailEngine.startWorkflow('quote-abandonment', {
        email: profile.email,
        firstName: profile.firstName,
        metadata: {
          quoteId: profile.customFields.quoteId,
          checkoutUrl: `https://www.pgclosets.com/quote/${profile.customFields.quoteId}`
        }
      });
      break;

    case 'consultation-booking':
      // Send custom email with consultation CTA
      result = await sendConsultationInvite(profile);
      break;

    case 'referral-request':
      // Add to post-purchase workflow at referral stage
      result = await sendReferralRequest(profile);
      break;

    default:
      console.log('✅ No immediate action needed');
      return { success: true, action: 'monitor' };
  }

  console.log(`✅ Action executed: ${nextAction.action}`);

  return {
    success: true,
    action: nextAction.action,
    priority: nextAction.priority,
    result
  };
}

/**
 * EXAMPLE 7: Performance Monitoring & Alerts
 */
export async function monitorCampaignPerformance(campaignId: string) {
  console.log(`📊 Monitoring campaign: ${campaignId}`);

  const metrics = analyticsEngine.getCampaignMetrics(campaignId);

  if (!metrics) {
    console.log('❌ Campaign not found');
    return;
  }

  // Check for performance issues
  const alerts = [];

  if (metrics.deliverability < 95) {
    alerts.push({
      severity: 'critical',
      message: `Low deliverability: ${metrics.deliverabilityScore}%`,
      action: 'Review domain authentication and sender reputation'
    });
  }

  if (metrics.bounceRate > 5) {
    alerts.push({
      severity: 'warning',
      message: `High bounce rate: ${metrics.bounceRate}%`,
      action: 'Clean email list and implement double opt-in'
    });
  }

  if (metrics.complaintRate > 0.5) {
    alerts.push({
      severity: 'critical',
      message: `High complaint rate: ${metrics.complaintRate}%`,
      action: 'Review email content for spam triggers and improve targeting'
    });
  }

  if (metrics.openRate < 15) {
    alerts.push({
      severity: 'warning',
      message: `Low open rate: ${metrics.openRate}%`,
      action: 'Test new subject lines and optimize send times'
    });
  }

  if (alerts.length > 0) {
    console.log(`🚨 ${alerts.length} alerts detected:`);
    alerts.forEach(alert => {
      console.log(`  [${alert.severity.toUpperCase()}] ${alert.message}`);
      console.log(`  → ${alert.action}`);
    });

    // Send to monitoring system / Slack
    await sendMonitoringAlerts(campaignId, alerts);
  } else {
    console.log('✅ Campaign performing well');
  }

  return {
    campaignId,
    metrics,
    alerts,
    status: alerts.length === 0 ? 'healthy' : 'needs-attention'
  };
}

/**
 * EXAMPLE 8: Automated Weekly Report
 */
export async function generateWeeklyReport() {
  console.log('📈 Generating weekly email marketing report');

  const dashboard = analyticsEngine.getDashboardMetrics('7d');
  const workflows = ALL_WORKFLOWS.map(w => ({
    id: w.id,
    name: w.name,
    stats: emailEngine.getWorkflowStats(w.id)
  }));

  const report = {
    period: 'Last 7 Days',
    generatedAt: new Date(),

    overview: dashboard.overview,

    workflows: workflows.map(w => ({
      name: w.name,
      active: w.stats.activeInstances,
      completed: w.stats.completedInstances,
      openRate: w.stats.avgOpenRate.toFixed(2) + '%',
      clickRate: w.stats.avgClickRate.toFixed(2) + '%'
    })),

    topPerformers: workflows
      .sort((a, b) => b.stats.avgClickRate - a.stats.avgClickRate)
      .slice(0, 3)
      .map(w => w.name),

    recommendations: [
      'Continue A/B testing subject lines for welcome series',
      'Increase frequency of product launch campaigns',
      'Review and update seasonal campaign content'
    ]
  };

  // Send report email to team
  await sendReportEmail(report);

  console.log('✅ Weekly report generated and sent');

  return report;
}

// Helper functions (would be implemented based on your database)
async function createSubscriber(data: any) { return { id: 'sub_123', ...data }; }
async function getSubscriber(email: string) { return null; }
async function getAllSubscribers() { return []; }
async function updateCustomerSegment(id: string, data: any) { return true; }
async function sendConsultationInvite(profile: any) { return { success: true }; }
async function sendReferralRequest(profile: any) { return { success: true }; }
async function sendMonitoringAlerts(id: string, alerts: any[]) { return true; }
async function sendReportEmail(report: any) { return true; }

function mapToSubscriberProfile(subscriber: any): SubscriberProfile {
  return {
    email: subscriber.email,
    firstName: subscriber.firstName,
    lastName: subscriber.lastName,
    behaviorSegment: 'active',
    funnelStage: 'subscriber',
    recencySegment: 'recent',
    totalEmailsSent: 0,
    totalOpens: 0,
    totalClicks: 0,
    interests: [],
    topics: [],
    lifetimeValue: 0,
    totalPurchases: 0,
    averageOrderValue: 0,
    signupDate: new Date(),
    signupSource: 'website',
    tags: [],
    customFields: {}
  };
}

export default {
  handleNewsletterSignup,
  handleQuoteAbandonment,
  handlePurchaseComplete,
  launchSeasonalCampaign,
  reengageInactiveUsers,
  executeNextBestAction,
  monitorCampaignPerformance,
  generateWeeklyReport
};
