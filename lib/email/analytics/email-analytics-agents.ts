/**
 * AGENTS 13-14: Email Analytics System
 *
 * Agent 13: Email Performance Tracker
 * Agent 14: Campaign Analytics Dashboard
 */

export interface EmailMetrics {
  emailId: string;
  campaignName: string;
  sentAt: Date;
  recipients: number;
  delivered: number;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  bounces: number;
  complaints: number;
  unsubscribes: number;
  conversions: number;
  revenue: number;
}

// AGENT 13: Email Performance Tracker
export class EmailPerformanceAgent {
  /**
   * Calculate key performance metrics
   */
  calculateMetrics(data: EmailMetrics): PerformanceMetrics {
    const deliveryRate = (data.delivered / data.recipients) * 100;
    const openRate = (data.uniqueOpens / data.delivered) * 100;
    const clickRate = (data.uniqueClicks / data.delivered) * 100;
    const clickToOpenRate = (data.uniqueClicks / data.uniqueOpens) * 100;
    const bounceRate = (data.bounces / data.recipients) * 100;
    const unsubscribeRate = (data.unsubscribes / data.delivered) * 100;
    const conversionRate = (data.conversions / data.delivered) * 100;
    const revenuePerEmail = data.revenue / data.delivered;

    return {
      deliveryRate,
      openRate,
      clickRate,
      clickToOpenRate,
      bounceRate,
      unsubscribeRate,
      conversionRate,
      revenuePerEmail,
      roi: this.calculateROI(data.revenue, data.recipients)
    };
  }

  /**
   * Calculate ROI
   */
  private calculateROI(revenue: number, recipients: number): number {
    const COST_PER_EMAIL = 0.001; // $0.001 per email
    const cost = recipients * COST_PER_EMAIL;
    return ((revenue - cost) / cost) * 100;
  }

  /**
   * Get performance grade
   */
  getPerformanceGrade(metrics: PerformanceMetrics): {
    overall: 'A' | 'B' | 'C' | 'D' | 'F';
    breakdown: Record<string, 'A' | 'B' | 'C' | 'D' | 'F'>;
  } {
    const grades = {
      deliveryRate: this.gradeMetric(metrics.deliveryRate, [98, 95, 90, 85]),
      openRate: this.gradeMetric(metrics.openRate, [25, 20, 15, 10]),
      clickRate: this.gradeMetric(metrics.clickRate, [3, 2, 1, 0.5]),
      conversionRate: this.gradeMetric(metrics.conversionRate, [5, 3, 1, 0.5]),
    };

    // Calculate overall grade
    const gradePoints = { A: 4, B: 3, C: 2, D: 1, F: 0 };
    const avgPoints = Object.values(grades).reduce((sum, grade) => sum + gradePoints[grade], 0) / 4;

    const overall = avgPoints >= 3.5 ? 'A' :
                   avgPoints >= 2.5 ? 'B' :
                   avgPoints >= 1.5 ? 'C' :
                   avgPoints >= 0.5 ? 'D' : 'F';

    return { overall, breakdown: grades };
  }

  private gradeMetric(value: number, thresholds: [number, number, number, number]): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (value >= thresholds[0]) return 'A';
    if (value >= thresholds[1]) return 'B';
    if (value >= thresholds[2]) return 'C';
    if (value >= thresholds[3]) return 'D';
    return 'F';
  }

  /**
   * Compare performance against benchmarks
   */
  compareToBenchmarks(metrics: PerformanceMetrics): {
    metric: string;
    value: number;
    benchmark: number;
    performance: 'above' | 'at' | 'below';
  }[] {
    const INDUSTRY_BENCHMARKS = {
      openRate: 21.5,
      clickRate: 2.3,
      conversionRate: 2.0,
      bounceRate: 0.7,
      unsubscribeRate: 0.1,
    };

    return Object.entries(INDUSTRY_BENCHMARKS).map(([metric, benchmark]) => ({
      metric,
      value: metrics[metric as keyof PerformanceMetrics] as number,
      benchmark,
      performance:
        (metrics[metric as keyof PerformanceMetrics] as number) > benchmark * 1.1 ? 'above' :
        (metrics[metric as keyof PerformanceMetrics] as number) < benchmark * 0.9 ? 'below' : 'at'
    }));
  }

  /**
   * Track email engagement over time
   */
  trackEngagementTrend(campaigns: EmailMetrics[]): {
    date: string;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  }[] {
    return campaigns.map(campaign => {
      const metrics = this.calculateMetrics(campaign);
      return {
        date: campaign.sentAt.toISOString().split('T')[0],
        openRate: metrics.openRate,
        clickRate: metrics.clickRate,
        conversionRate: metrics.conversionRate,
      };
    });
  }

  /**
   * Identify best performing campaigns
   */
  getTopCampaigns(campaigns: EmailMetrics[], limit = 5): {
    campaign: string;
    score: number;
    metrics: PerformanceMetrics;
  }[] {
    return campaigns
      .map(campaign => {
        const metrics = this.calculateMetrics(campaign);
        // Score based on weighted average of key metrics
        const score =
          metrics.openRate * 0.3 +
          metrics.clickRate * 0.3 +
          metrics.conversionRate * 0.4;

        return {
          campaign: campaign.campaignName,
          score,
          metrics,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  /**
   * A/B test analysis
   */
  analyzeABTest(variantA: EmailMetrics, variantB: EmailMetrics): {
    winner: 'A' | 'B' | 'tie';
    confidence: number;
    improvement: number;
    recommendation: string;
  } {
    const metricsA = this.calculateMetrics(variantA);
    const metricsB = this.calculateMetrics(variantB);

    // Simple comparison based on conversion rate
    const improvement = ((metricsB.conversionRate - metricsA.conversionRate) / metricsA.conversionRate) * 100;

    let winner: 'A' | 'B' | 'tie' = 'tie';
    if (improvement > 10) winner = 'B';
    else if (improvement < -10) winner = 'A';

    // Simple confidence calculation (would use chi-square test in production)
    const confidence = Math.min(Math.abs(improvement) * 5, 95);

    const recommendation =
      winner === 'tie' ? 'No clear winner. Continue testing or adjust variables.' :
      winner === 'B' ? `Variant B shows ${improvement.toFixed(1)}% improvement. Recommend using Variant B.` :
      `Variant A shows ${Math.abs(improvement).toFixed(1)}% better performance. Recommend using Variant A.`;

    return { winner, confidence, improvement, recommendation };
  }
}

// AGENT 14: Campaign Analytics Dashboard
export class CampaignAnalyticsAgent {
  /**
   * Generate campaign summary
   */
  generateCampaignSummary(campaigns: EmailMetrics[]): CampaignSummary {
    const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0);
    const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
    const totalOpens = campaigns.reduce((sum, c) => sum + c.uniqueOpens, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.uniqueClicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

    const avgOpenRate = campaigns.reduce((sum, c) => {
      const metrics = new EmailPerformanceAgent().calculateMetrics(c);
      return sum + metrics.openRate;
    }, 0) / campaigns.length;

    const avgClickRate = campaigns.reduce((sum, c) => {
      const metrics = new EmailPerformanceAgent().calculateMetrics(c);
      return sum + metrics.clickRate;
    }, 0) / campaigns.length;

    return {
      totalCampaigns: campaigns.length,
      totalRecipients,
      totalRevenue,
      totalOpens,
      totalClicks,
      totalConversions,
      avgOpenRate,
      avgClickRate,
      revenuePerRecipient: totalRevenue / totalRecipients,
    };
  }

  /**
   * Get insights and recommendations
   */
  getInsights(campaigns: EmailMetrics[]): string[] {
    const insights: string[] = [];
    const performanceAgent = new EmailPerformanceAgent();

    // Calculate average metrics
    const avgMetrics = campaigns.reduce((acc, campaign) => {
      const metrics = performanceAgent.calculateMetrics(campaign);
      return {
        openRate: acc.openRate + metrics.openRate,
        clickRate: acc.clickRate + metrics.clickRate,
        unsubscribeRate: acc.unsubscribeRate + metrics.unsubscribeRate,
      };
    }, { openRate: 0, clickRate: 0, unsubscribeRate: 0 });

    avgMetrics.openRate /= campaigns.length;
    avgMetrics.clickRate /= campaigns.length;
    avgMetrics.unsubscribeRate /= campaigns.length;

    // Generate insights
    if (avgMetrics.openRate < 15) {
      insights.push('⚠️ Low open rate detected. Consider improving subject lines and sender name.');
    }

    if (avgMetrics.clickRate < 1) {
      insights.push('⚠️ Low click rate. Review CTA placement and email content relevance.');
    }

    if (avgMetrics.unsubscribeRate > 0.5) {
      insights.push('⚠️ High unsubscribe rate. Review email frequency and content quality.');
    }

    if (avgMetrics.openRate > 25) {
      insights.push('✅ Excellent open rate! Your subject lines are performing well.');
    }

    if (avgMetrics.clickRate > 3) {
      insights.push('✅ Strong click-through rate! Content is highly engaging.');
    }

    return insights;
  }

  /**
   * Export analytics data
   */
  exportAnalytics(campaigns: EmailMetrics[]): string {
    const performanceAgent = new EmailPerformanceAgent();

    const csvHeader = 'Campaign,Sent Date,Recipients,Opens,Clicks,Conversions,Revenue,Open Rate,Click Rate,Conversion Rate\n';

    const csvRows = campaigns.map(campaign => {
      const metrics = performanceAgent.calculateMetrics(campaign);
      return [
        campaign.campaignName,
        campaign.sentAt.toISOString(),
        campaign.recipients,
        campaign.uniqueOpens,
        campaign.uniqueClicks,
        campaign.conversions,
        campaign.revenue.toFixed(2),
        metrics.openRate.toFixed(2),
        metrics.clickRate.toFixed(2),
        metrics.conversionRate.toFixed(2),
      ].join(',');
    }).join('\n');

    return csvHeader + csvRows;
  }
}

export interface PerformanceMetrics {
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  clickToOpenRate: number;
  bounceRate: number;
  unsubscribeRate: number;
  conversionRate: number;
  revenuePerEmail: number;
  roi: number;
}

export interface CampaignSummary {
  totalCampaigns: number;
  totalRecipients: number;
  totalRevenue: number;
  totalOpens: number;
  totalClicks: number;
  totalConversions: number;
  avgOpenRate: number;
  avgClickRate: number;
  revenuePerRecipient: number;
}

export const emailPerformanceAgent = new EmailPerformanceAgent();
export const campaignAnalyticsAgent = new CampaignAnalyticsAgent();
