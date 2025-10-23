/**
 * Advanced DDoS Protection & Bot Mitigation System
 * Enterprise-grade protection against sophisticated attacks
 *
 * Features:
 * - Multi-layer DDoS protection
 * - Advanced bot detection and mitigation
 * - Rate limiting with adaptive algorithms
 * - Behavioral analysis and fingerprinting
 * - Real-time attack pattern recognition
 * - Automatic mitigation and response
 */

import { getClientIdentifier } from '@/lib/rate-limit'
import { AdvancedSecurityMonitor, SecurityEventType } from './advanced-monitoring'

export interface DDoSMetrics {
  requestsPerSecond: number
  uniqueIPs: number
  suspiciousPatterns: number
  blockedRequests: number
  attackInProgress: boolean
  attackType?: string
  attackVector?: string
}

export interface BotDetectionResult {
  isBot: boolean
  confidence: number
  botType?: 'simple' | 'sophisticated' | 'malicious' | 'search_engine'
  indicators: string[]
  riskScore: number
  shouldBlock: boolean
}

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  adaptiveLimiting?: boolean
  burstProtection?: boolean
}

/**
 * DDoS Protection System
 */
export class DDoSProtection {
  private static requestHistory = new Map<string, Array<{ timestamp: number; path: string }>>()
  private static ipReputation = new Map<string, { score: number; lastUpdated: number }>()
  private static globalMetrics: DDoSMetrics = {
    requestsPerSecond: 0,
    uniqueIPs: 0,
    suspiciousPatterns: 0,
    blockedRequests: 0,
    attackInProgress: false
  }
  private static rateLimits = new Map<string, RateLimitConfig>()
  private static attackPatterns = new Map<string, number>()
  private static blockedIPs = new Set<string>()

  /**
   * Initialize DDoS protection
   */
  static async initialize(): Promise<void> {
    console.log('[DDoS PROTECTION] Initializing advanced DDoS protection...')

    // Set up default rate limits
    this.setupDefaultRateLimits()

    // Schedule periodic cleanup
    setInterval(() => this.cleanup(), 60 * 1000) // Every minute

    // Schedule metrics calculation
    setInterval(() => this.updateMetrics(), 5 * 1000) // Every 5 seconds

    // Schedule reputation updates
    setInterval(() => this.updateReputation(), 30 * 1000) // Every 30 seconds

    console.log('[DDoS PROTECTION] DDoS protection initialized')
  }

  /**
   * Set up default rate limiting configurations
   */
  private static setupDefaultRateLimits(): void {
    this.rateLimits.set('default', {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100,
      adaptiveLimiting: true,
      burstProtection: true
    })

    this.rateLimits.set('api', {
      windowMs: 60 * 1000,
      maxRequests: 200,
      adaptiveLimiting: true
    })

    this.rateLimits.set('auth', {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 20,
      adaptiveLimiting: true,
      burstProtection: true
    })

    this.rateLimits.set('checkout', {
      windowMs: 10 * 60 * 1000, // 10 minutes
      maxRequests: 50,
      adaptiveLimiting: true
    })
  }

  /**
   * Analyze incoming request for DDoS patterns
   */
  static async analyzeRequest(
    request: Request,
    path: string,
    userAgent?: string
  ): Promise<{
    allowed: boolean
    reason?: string
    riskScore: number
    mitigations: string[]
  }> {
    const ip = getClientIdentifier(request as any)
    const timestamp = Date.now()
    const mitigations: string[] = []

    // Track request
    this.trackRequest(ip, timestamp, path)

    // Bot detection
    const botDetection = this.detectBot(request, userAgent)
    if (botDetection.shouldBlock) {
      await AdvancedSecurityMonitor.createEvent(
        SecurityEventType.DDOS_ATTACK,
        'medium',
        { ip, userAgent: userAgent || 'unknown' },
        { reason: 'Malicious bot detected', botType: botDetection.botType }
      )
      return {
        allowed: false,
        reason: 'Bot detected and blocked',
        riskScore: botDetection.riskScore,
        mitigations: ['Bot blocked']
      }
    }

    // Rate limiting
    const rateLimitResult = this.checkRateLimit(ip, path)
    if (!rateLimitResult.allowed) {
      mitigations.push('Rate limit exceeded')
      await AdvancedSecurityMonitor.createEvent(
        SecurityEventType.DDOS_ATTACK,
        'high',
        { ip, userAgent: userAgent || 'unknown' },
        { reason: 'Rate limit exceeded', requests: rateLimitResult.requestCount }
      )
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        riskScore: 70,
        mitigations
      }
    }

    // DDoS pattern detection
    const ddosDetection = this.detectDDoSPatterns(ip, path, timestamp)
    if (ddosDetection.isAttack) {
      mitigations.push('DDoS pattern detected')
      await AdvancedSecurityMonitor.createEvent(
        SecurityEventType.DDOS_ATTACK,
        'critical',
        { ip, userAgent: userAgent || 'unknown' },
        {
          attackType: ddosDetection.attackType,
          attackVector: ddosDetection.attackVector,
          requestsPerSecond: ddosDetection.requestsPerSecond
        }
      )
      return {
        allowed: false,
        reason: `DDoS attack detected: ${ddosDetection.attackType}`,
        riskScore: 95,
        mitigations
      }
    }

    // IP reputation check
    const reputationScore = this.getIPReputation(ip)
    if (reputationScore < -50) {
      mitigations.push('Poor IP reputation')
      return {
        allowed: false,
        reason: 'IP has poor reputation',
        riskScore: 80,
        mitigations
      }
    }

    return {
      allowed: true,
      riskScore: Math.max(0, botDetection.riskScore + (reputationScore < 0 ? Math.abs(reputationScore) : 0))
    }
  }

  /**
   * Track request for analysis
   */
  private static trackRequest(ip: string, timestamp: number, path: string): void {
    if (!this.requestHistory.has(ip)) {
      this.requestHistory.set(ip, [])
    }

    const requests = this.requestHistory.get(ip)!
    requests.push({ timestamp, path })

    // Keep only last hour of requests
    const oneHourAgo = timestamp - 60 * 60 * 1000
    while (requests.length > 0 && requests[0]!.timestamp < oneHourAgo) {
      requests.shift()
    }
  }

  /**
   * Advanced bot detection
   */
  private static detectBot(request: Request, userAgent?: string): BotDetectionResult {
    const indicators: string[] = []
    let confidence = 0
    let riskScore = 0

    if (!userAgent) {
      indicators.push('Missing User-Agent')
      confidence += 30
      riskScore += 40
    } else {
      // Check for common bot patterns
      const botPatterns = [
        /bot/i,
        /crawler/i,
        /spider/i,
        /scraper/i,
        /curl/i,
        /wget/i,
        /python/i,
        /java/i,
        /go-http/,
        /node\.js/i,
        /php/i,
        /ruby/i,
        /perl/i,
        /scrapy/i,
        /selenium/i,
        /phantom/i,
        /headless/i
      ]

      for (const pattern of botPatterns) {
        if (pattern.test(userAgent)) {
          indicators.push(`Bot pattern: ${pattern.source}`)
          confidence += 20
          riskScore += 25
        }
      }

      // Check for suspicious user agent characteristics
      if (userAgent.length < 20) {
        indicators.push('Very short User-Agent')
        confidence += 15
        riskScore += 20
      }

      if (userAgent.includes('http')) {
        indicators.push('HTTP in User-Agent')
        confidence += 25
        riskScore += 30
      }

      // Check for known search engines (allow these)
      const searchEnginePatterns = [
        /googlebot/i,
        /bingbot/i,
        /slurp/i, // Yahoo
        /duckduckbot/i,
        /baiduspider/i,
        /yandexbot/i
      ]

      const isSearchEngine = searchEnginePatterns.some(pattern => pattern.test(userAgent))
      if (isSearchEngine) {
        return {
          isBot: true,
          confidence: 90,
          botType: 'search_engine',
          indicators: ['Search engine bot'],
          riskScore: 5,
          shouldBlock: false
        }
      }
    }

    // Check request headers for bot indicators
    const headers = request.headers
    if (!headers.get('accept')) {
      indicators.push('Missing Accept header')
      confidence += 20
      riskScore += 25
    }

    if (!headers.get('accept-language')) {
      indicators.push('Missing Accept-Language header')
      confidence += 10
      riskScore += 15
    }

    // Check for missing common headers
    const commonHeaders = ['accept-encoding', 'connection', 'host']
    commonHeaders.forEach(header => {
      if (!headers.get(header)) {
        indicators.push(`Missing ${header} header`)
        confidence += 10
        riskScore += 10
      }
    })

    // Determine bot type and block decision
    let botType: BotDetectionResult['botType'] = 'simple'
    let shouldBlock = false

    if (confidence >= 80) {
      botType = 'malicious'
      shouldBlock = true
    } else if (confidence >= 60) {
      botType = 'sophisticated'
      shouldBlock = true
    } else if (confidence >= 30) {
      botType = 'simple'
      shouldBlock = riskScore > 50
    }

    return {
      isBot: confidence > 20,
      confidence: Math.min(100, confidence),
      botType,
      indicators,
      riskScore: Math.min(100, riskScore),
      shouldBlock
    }
  }

  /**
   * Check rate limits with adaptive algorithms
   */
  private static checkRateLimit(ip: string, path: string): {
    allowed: boolean
    requestCount: number
    remaining: number
  } {
    const requests = this.requestHistory.get(ip) || []
    const now = Date.now()

    // Determine rate limit config based on path
    let config = this.rateLimits.get('default')!
    for (const [key, limitConfig] of this.rateLimits.entries()) {
      if (path.includes(key)) {
        config = limitConfig
        break
      }
    }

    const windowStart = now - config.windowMs
    const requestsInWindow = requests.filter(r => r.timestamp > windowStart)

    let maxRequests = config.maxRequests

    // Adaptive rate limiting
    if (config.adaptiveLimiting) {
      const globalRPS = this.calculateGlobalRPS()
      if (globalRPS > 100) {
        maxRequests = Math.floor(maxRequests * 0.5) // Reduce limit during high load
      } else if (globalRPS > 50) {
        maxRequests = Math.floor(maxRequests * 0.7)
      }
    }

    // Burst protection
    if (config.burstProtection) {
      const lastSecond = requests.filter(r => r.timestamp > now - 1000)
      if (lastSecond.length > maxRequests / 10) { // More than 10% of limit in 1 second
        return {
          allowed: false,
          requestCount: requestsInWindow.length,
          remaining: 0
        }
      }
    }

    const allowed = requestsInWindow.length < maxRequests

    return {
      allowed,
      requestCount: requestsInWindow.length,
      remaining: Math.max(0, maxRequests - requestsInWindow.length)
    }
  }

  /**
   * Detect DDoS attack patterns
   */
  private static detectDDoSPatterns(ip: string, path: string, timestamp: number): {
    isAttack: boolean
    attackType: string
    attackVector: string
    requestsPerSecond: number
  } {
    const requests = this.requestHistory.get(ip) || []
    const lastMinute = requests.filter(r => r.timestamp > timestamp - 60 * 1000)
    const lastSecond = requests.filter(r => r.timestamp > timestamp - 1000)

    const requestsPerSecond = lastSecond.length
    const requestsPerMinute = lastMinute.length

    // High volume attack
    if (requestsPerSecond > 100) {
      return {
        isAttack: true,
        attackType: 'Volume-based DDoS',
        attackVector: 'High request rate',
        requestsPerSecond
      }
    }

    // Application layer attack
    const uniquePaths = new Set(lastMinute.map(r => r.path)).size
    if (requestsPerMinute > 200 && uniquePaths < 5) {
      return {
        isAttack: true,
        attackType: 'Application layer DDoS',
        attackVector: 'Targeted endpoint flooding',
        requestsPerSecond
      }
    }

    // Slow POST attack
    if (lastMinute.length > 50 && uniquePaths === 1) {
      return {
        isAttack: true,
        attackType: 'Slow POST attack',
        attackVector: 'Connection exhaustion',
        requestsPerSecond
      }
    }

    // Randomization attack (many different paths)
    if (uniquePaths > 50 && requestsPerMinute > 100) {
      return {
        isAttack: true,
        attackType: 'Randomization attack',
        attackVector: 'Cache exhaustion',
        requestsPerSecond
      }
    }

    return {
      isAttack: false,
      attackType: '',
      attackVector: '',
      requestsPerSecond
    }
  }

  /**
   * Get IP reputation score
   */
  private static getIPReputation(ip: string): number {
    const reputation = this.ipReputation.get(ip)
    if (!reputation) {
      return 0 // Neutral score for unknown IPs
    }

    // Decay reputation over time
    const age = Date.now() - reputation.lastUpdated
    const decay = Math.max(0, age / (24 * 60 * 60 * 1000)) // Decay over 24 hours
    return reputation.score * (1 - decay * 0.5)
  }

  /**
   * Update IP reputation
   */
  static updateIPReputation(ip: string, delta: number): void {
    const current = this.ipReputation.get(ip) || { score: 0, lastUpdated: 0 }
    this.ipReputation.set(ip, {
      score: Math.max(-100, Math.min(100, current.score + delta)),
      lastUpdated: Date.now()
    })

    // Auto-block very poor reputation
    if (current.score < -80) {
      this.blockedIPs.add(ip)
    }
  }

  /**
   * Calculate global requests per second
   */
  private static calculateGlobalRPS(): number {
    const now = Date.now()
    const oneSecondAgo = now - 1000
    let totalRequests = 0

    for (const requests of this.requestHistory.values()) {
      totalRequests += requests.filter(r => r.timestamp > oneSecondAgo).length
    }

    return totalRequests
  }

  /**
   * Update global metrics
   */
  private static updateMetrics(): void {
    const now = Date.now()
    const oneSecondAgo = now - 1000
    const fiveMinutesAgo = now - 5 * 60 * 1000

    let requestsInLastSecond = 0
    const recentIPs = new Set<string>()
    let suspiciousPatterns = 0

    for (const [ip, requests] of this.requestHistory.entries()) {
      const recentRequests = requests.filter(r => r.timestamp > fiveMinutesAgo)
      if (recentRequests.length > 0) {
        recentIPs.add(ip)
      }

      requestsInLastSecond += requests.filter(r => r.timestamp > oneSecondAgo).length

      // Detect suspicious patterns
      if (recentRequests.length > 1000) {
        suspiciousPatterns++
      }
    }

    this.globalMetrics = {
      requestsPerSecond: requestsInLastSecond,
      uniqueIPs: recentIPs.size,
      suspiciousPatterns,
      blockedRequests: this.blockedIPs.size,
      attackInProgress: suspiciousPatterns > 5 || requestsInLastSecond > 1000
    }

    // Update attack status
    if (this.globalMetrics.attackInProgress) {
      console.warn('[DDoS ALERT] Attack in progress!', this.globalMetrics)
    }
  }

  /**
   * Update reputation scores
   */
  private static updateReputation(): void {
    const now = Date.now()
    const fiveMinutesAgo = now - 5 * 60 * 1000

    for (const [ip, requests] of this.requestHistory.entries()) {
      const recentRequests = requests.filter(r => r.timestamp > fiveMinutesAgo)

      // Penalize high-frequency requesters
      if (recentRequests.length > 500) {
        this.updateIPReputation(ip, -10)
      } else if (recentRequests.length > 200) {
        this.updateIPReputation(ip, -5)
      } else if (recentRequests.length < 10) {
        this.updateIPReputation(ip, 1) // Reward well-behaved IPs
      }
    }
  }

  /**
   * Cleanup old data
   */
  private static cleanup(): void {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000

    // Clean request history
    for (const [ip, requests] of this.requestHistory.entries()) {
      const filtered = requests.filter(r => r.timestamp > oneHourAgo)
      if (filtered.length === 0) {
        this.requestHistory.delete(ip)
      } else {
        this.requestHistory.set(ip, filtered)
      }
    }

    // Clean old reputation data
    for (const [ip, reputation] of this.ipReputation.entries()) {
      if (reputation.lastUpdated < oneDayAgo) {
        this.ipReputation.delete(ip)
      }
    }

    // Clean blocked IPs (remove old blocks)
    if (this.blockedIPs.size > 10000) {
      // Keep only recently blocked IPs
      const recentBlocks = new Set<string>()
      for (const ip of this.blockedIPs) {
        const reputation = this.ipReputation.get(ip)
        if (reputation && reputation.lastUpdated > oneDayAgo) {
          recentBlocks.add(ip)
        }
      }
      this.blockedIPs = recentBlocks
    }
  }

  /**
   * Get current DDoS metrics
   */
  static getMetrics(): DDoSMetrics {
    return { ...this.globalMetrics }
  }

  /**
   * Get detailed DDoS dashboard data
   */
  static getDDoSDashboard(): {
    metrics: DDoSMetrics
    topIPs: Array<{ ip: string; requests: number; reputation: number }>
    attackPatterns: Array<{ pattern: string; count: number }>
    blockedIPs: number
    rateLimitStatus: Record<string, any>
  } {
    const now = Date.now()
    const fiveMinutesAgo = now - 5 * 60 * 1000

    // Get top IPs by request count
    const ipCounts = new Map<string, { requests: number; reputation: number }>()
    for (const [ip, requests] of this.requestHistory.entries()) {
      const recentRequests = requests.filter(r => r.timestamp > fiveMinutesAgo)
      if (recentRequests.length > 0) {
        ipCounts.set(ip, {
          requests: recentRequests.length,
          reputation: this.getIPReputation(ip)
        })
      }
    }

    const topIPs = Array.from(ipCounts.entries())
      .map(([ip, data]) => ({ ip, ...data }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 20)

    // Analyze attack patterns
    const patternCounts = new Map<string, number>()
    for (const requests of this.requestHistory.values()) {
      const recentRequests = requests.filter(r => r.timestamp > fiveMinutesAgo)
      for (const req of recentRequests) {
        // Extract pattern (e.g., specific endpoints)
        const pattern = req.path.includes('?') ? req.path.split('?')[0] : req.path
        patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1)
      }
    }

    const attackPatterns = Array.from(patternCounts.entries())
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return {
      metrics: this.globalMetrics,
      topIPs,
      attackPatterns,
      blockedIPs: this.blockedIPs.size,
      rateLimitStatus: {
        totalConfigs: this.rateLimits.size,
        activeConfigs: Array.from(this.rateLimits.entries()).map(([key, config]) => ({
          key,
          maxRequests: config.maxRequests,
          windowMs: config.windowMs,
          adaptiveLimiting: config.adaptiveLimiting
        }))
      }
    }
  }

  /**
   * Block IP address manually
   */
  static blockIP(ip: string, reason?: string): void {
    this.blockedIPs.add(ip)
    this.updateIPReputation(ip, -100)
    console.log(`[DDoS] IP blocked: ${ip}${reason ? ` - ${reason}` : ''}`)
  }

  /**
   * Unblock IP address
   */
  static unblockIP(ip: string): void {
    this.blockedIPs.delete(ip)
    this.updateIPReputation(ip, 50) // Give it a fresh start
    console.log(`[DDoS] IP unblocked: ${ip}`)
  }

  /**
   * Check if IP is blocked
   */
  static isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  /**
   * Add custom rate limit rule
   */
  static addRateLimit(key: string, config: RateLimitConfig): void {
    this.rateLimits.set(key, config)
    console.log(`[DDoS] Rate limit added: ${key}`)
  }

  /**
   * Remove rate limit rule
   */
  static removeRateLimit(key: string): void {
    this.rateLimits.delete(key)
    console.log(`[DDoS] Rate limit removed: ${key}`)
  }

  /**
   * Export DDoS protection data for analysis
   */
  static exportData(): {
    timestamp: Date
    metrics: DDoSMetrics
    topIPs: any[]
    blockedIPs: string[]
    requestHistorySize: number
    reputationData: Array<{ ip: string; score: number; lastUpdated: number }>
  } {
    const reputationData = Array.from(this.ipReputation.entries()).map(([ip, data]) => ({
      ip,
      ...data
    }))

    return {
      timestamp: new Date(),
      metrics: this.globalMetrics,
      topIPs: this.getDDoSDashboard().topIPs,
      blockedIPs: Array.from(this.blockedIPs),
      requestHistorySize: this.requestHistory.size,
      reputationData
    }
  }
}

/**
 * Initialize DDoS protection on module load
 */
if (typeof window === 'undefined') {
  DDoSProtection.initialize().catch(console.error)
}