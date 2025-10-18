/**
 * AGENT 15: Analytics Agent - Search Console Integration
 * Google Search Console integration utilities
 */

/**
 * Search Console metrics structure
 */
export interface SearchConsoleMetrics {
  clicks: number
  impressions: number
  ctr: number
  position: number
  date: string
  page?: string
  query?: string
  country?: string
  device?: string
}

/**
 * Performance data structure
 */
export interface PagePerformance {
  url: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  recommendations: string[]
}

/**
 * Analyze Search Console data for insights
 */
export function analyzeSearchConsoleData(
  data: SearchConsoleMetrics[]
): {
  topPages: PagePerformance[]
  underperformingPages: PagePerformance[]
  opportunities: PagePerformance[]
} {
  // Group by page
  const pageMetrics = new Map<string, SearchConsoleMetrics[]>()

  data.forEach(metric => {
    if (!metric.page) return

    if (!pageMetrics.has(metric.page)) {
      pageMetrics.set(metric.page, [])
    }
    pageMetrics.get(metric.page)!.push(metric)
  })

  // Calculate aggregates
  const pagePerformance: PagePerformance[] = Array.from(pageMetrics.entries()).map(([url, metrics]) => {
    const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0)
    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0)
    const avgCtr = totalClicks / totalImpressions
    const avgPosition = metrics.reduce((sum, m) => sum + m.position, 0) / metrics.length

    const recommendations: string[] = []

    // Generate recommendations
    if (avgPosition > 10 && totalImpressions > 100) {
      recommendations.push('High impressions but low ranking - optimize on-page SEO')
    }

    if (avgCtr < 0.02 && avgPosition < 10) {
      recommendations.push('Good ranking but low CTR - improve title and meta description')
    }

    if (totalImpressions > 1000 && totalClicks < 50) {
      recommendations.push('High visibility but low clicks - enhance SERP snippet appeal')
    }

    if (avgPosition > 3 && avgPosition < 7) {
      recommendations.push('Opportunity to reach top 3 - focus on quality backlinks and content')
    }

    return {
      url,
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: avgCtr,
      position: avgPosition,
      recommendations
    }
  })

  // Sort and categorize
  const topPages = pagePerformance
    .filter(p => p.position <= 5 && p.clicks > 50)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 10)

  const underperformingPages = pagePerformance
    .filter(p => p.position > 10 && p.impressions > 100)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10)

  const opportunities = pagePerformance
    .filter(p => p.position > 3 && p.position <= 10 && p.impressions > 200)
    .sort((a, b) => a.position - b.position)
    .slice(0, 10)

  return {
    topPages,
    underperformingPages,
    opportunities
  }
}

/**
 * Query analysis for keyword optimization
 */
export interface QueryAnalysis {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
  intent: 'informational' | 'navigational' | 'transactional' | 'commercial'
  opportunity: 'high' | 'medium' | 'low'
}

export function analyzeQueries(data: SearchConsoleMetrics[]): QueryAnalysis[] {
  const queryMetrics = new Map<string, SearchConsoleMetrics[]>()

  data.forEach(metric => {
    if (!metric.query) return

    if (!queryMetrics.has(metric.query)) {
      queryMetrics.set(metric.query, [])
    }
    queryMetrics.get(metric.query)!.push(metric)
  })

  return Array.from(queryMetrics.entries()).map(([query, metrics]) => {
    const totalClicks = metrics.reduce((sum, m) => sum + m.clicks, 0)
    const totalImpressions = metrics.reduce((sum, m) => sum + m.impressions, 0)
    const avgCtr = totalClicks / totalImpressions
    const avgPosition = metrics.reduce((sum, m) => sum + m.position, 0) / metrics.length

    // Determine search intent
    const intent = determineSearchIntent(query)

    // Determine opportunity level
    const opportunity = determineOpportunity(avgPosition, totalImpressions, avgCtr)

    return {
      query,
      clicks: totalClicks,
      impressions: totalImpressions,
      ctr: avgCtr,
      position: avgPosition,
      intent,
      opportunity
    }
  })
}

/**
 * Determine search intent from query
 */
function determineSearchIntent(query: string): 'informational' | 'navigational' | 'transactional' | 'commercial' {
  const lowerQuery = query.toLowerCase()

  // Transactional intent
  if (
    lowerQuery.includes('buy') ||
    lowerQuery.includes('purchase') ||
    lowerQuery.includes('order') ||
    lowerQuery.includes('price')
  ) {
    return 'transactional'
  }

  // Navigational intent
  if (
    lowerQuery.includes('pg closets') ||
    lowerQuery.includes('pgclosets') ||
    lowerQuery.includes('renin ottawa')
  ) {
    return 'navigational'
  }

  // Commercial investigation
  if (
    lowerQuery.includes('best') ||
    lowerQuery.includes('review') ||
    lowerQuery.includes('vs') ||
    lowerQuery.includes('compare') ||
    lowerQuery.includes('affordable')
  ) {
    return 'commercial'
  }

  // Default to informational
  return 'informational'
}

/**
 * Determine opportunity level
 */
function determineOpportunity(
  position: number,
  impressions: number,
  ctr: number
): 'high' | 'medium' | 'low' {
  // High opportunity: Good impressions, room for improvement
  if (position >= 4 && position <= 10 && impressions > 500) {
    return 'high'
  }

  // Medium opportunity: Decent position but low CTR
  if (position <= 5 && ctr < 0.05) {
    return 'medium'
  }

  // Medium opportunity: Okay position with potential
  if (position >= 6 && position <= 15 && impressions > 100) {
    return 'medium'
  }

  return 'low'
}

/**
 * Generate SEO action items from Search Console data
 */
export interface SEOActionItem {
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'technical' | 'content' | 'links' | 'ux'
  action: string
  expectedImpact: string
  page?: string
  query?: string
}

export function generateActionItems(
  pagePerformance: PagePerformance[],
  queries: QueryAnalysis[]
): SEOActionItem[] {
  const actions: SEOActionItem[] = []

  // Actions for underperforming pages
  pagePerformance.forEach(page => {
    if (page.position > 10 && page.impressions > 500) {
      actions.push({
        priority: 'high',
        category: 'content',
        action: `Optimize content for better rankings`,
        expectedImpact: 'Move from position ${Math.round(page.position)} to top 5',
        page: page.url
      })
    }

    if (page.ctr < 0.02 && page.position < 5) {
      actions.push({
        priority: 'medium',
        category: 'ux',
        action: 'Improve title tag and meta description',
        expectedImpact: `Increase CTR from ${(page.ctr * 100).toFixed(2)}% to 5%+`,
        page: page.url
      })
    }
  })

  // Actions for high-opportunity queries
  queries
    .filter(q => q.opportunity === 'high')
    .slice(0, 5)
    .forEach(query => {
      actions.push({
        priority: 'high',
        category: 'content',
        action: `Create dedicated landing page`,
        expectedImpact: `Capture more traffic for "${query.query}"`,
        query: query.query
      })
    })

  return actions.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Track indexing status
 */
export interface IndexingStatus {
  url: string
  status: 'indexed' | 'not-indexed' | 'crawled-not-indexed' | 'error'
  lastCrawled?: string
  coverageState?: string
}

export function analyzeIndexingIssues(
  indexStatus: IndexingStatus[]
): {
  healthy: number
  warnings: number
  errors: number
  recommendations: string[]
} {
  const healthy = indexStatus.filter(s => s.status === 'indexed').length
  const warnings = indexStatus.filter(s => s.status === 'crawled-not-indexed').length
  const errors = indexStatus.filter(s => s.status === 'error').length

  const recommendations: string[]= []

  if (warnings > 0) {
    recommendations.push(`${warnings} pages crawled but not indexed - check content quality and uniqueness`)
  }

  if (errors > 0) {
    recommendations.push(`${errors} pages with indexing errors - review Search Console for details`)
  }

  const totalPages = indexStatus.length
  const indexingRate = healthy / totalPages

  if (indexingRate < 0.8) {
    recommendations.push('Low indexing rate - improve crawlability and fix technical issues')
  }

  return {
    healthy,
    warnings,
    errors,
    recommendations
  }
}
