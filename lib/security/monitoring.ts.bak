/**
 * Security Monitoring & Threat Detection System
 * Real-time security event tracking and alerting
 * Intrusion detection and anomaly detection
 */

import type { NextRequest } from 'next/server'

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGIN_BLOCKED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | '2FA_ENABLED'
  | '2FA_DISABLED'
  | '2FA_FAILED'
  | 'SESSION_CREATED'
  | 'SESSION_EXPIRED'
  | 'SESSION_HIJACK_ATTEMPT'
  | 'CSRF_VALIDATION_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'SQL_INJECTION_ATTEMPT'
  | 'XSS_ATTEMPT'
  | 'SUSPICIOUS_ACTIVITY'
  | 'DATA_BREACH_ATTEMPT'
  | 'API_KEY_COMPROMISED'
  | 'PRIVILEGE_ESCALATION_ATTEMPT'
  | 'FILE_UPLOAD_MALICIOUS'
  | 'BRUTE_FORCE_ATTACK'

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

export interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: SeverityLevel
  timestamp: Date
  userId?: string
  email?: string
  ip: string
  userAgent?: string
  metadata: Record<string, any>
  action?: string
  resource?: string
  result: 'success' | 'failure' | 'blocked'
}

export interface ThreatIndicator {
  type: 'ip' | 'user' | 'pattern'
  value: string
  reason: string
  blockedAt: Date
  expiresAt?: Date
}

/**
 * Security Event Logger
 */
class SecurityLogger {
  private static events: SecurityEvent[] = []
  private static readonly MAX_EVENTS = 10000

  /**
   * Log security event
   */
  static log(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const fullEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date()
    }

    // Add to in-memory store (in production, use database/logging service)
    this.events.unshift(fullEvent)

    // Trim to max size
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(0, this.MAX_EVENTS)
    }

    // Console log for development
    const logLevel = this.getLogLevel(fullEvent.severity)
    console[logLevel](`[SECURITY] ${fullEvent.type}:`, {
      severity: fullEvent.severity,
      userId: fullEvent.userId,
      email: fullEvent.email,
      ip: fullEvent.ip,
      result: fullEvent.result,
      metadata: fullEvent.metadata
    })

    // In production, send to security monitoring service
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoringService(fullEvent)
    }

    // Check for threat patterns
    this.analyzeThreatPatterns(fullEvent)

    // Alert on critical events
    if (fullEvent.severity === 'critical') {
      this.alertSecurityTeam(fullEvent)
    }

    return fullEvent
  }

  /**
   * Get recent events
   */
  static getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events.slice(0, limit)
  }

  /**
   * Search events
   */
  static searchEvents(filters: {
    type?: SecurityEventType
    severity?: SeverityLevel
    userId?: string
    ip?: string
    startDate?: Date
    endDate?: Date
  }): SecurityEvent[] {
    return this.events.filter(event => {
      if (filters.type && event.type !== filters.type) return false
      if (filters.severity && event.severity !== filters.severity) return false
      if (filters.userId && event.userId !== filters.userId) return false
      if (filters.ip && event.ip !== filters.ip) return false
      if (filters.startDate && event.timestamp < filters.startDate) return false
      if (filters.endDate && event.timestamp > filters.endDate) return false
      return true
    })
  }

  /**
   * Generate event ID
   */
  private static generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Get console log level for severity
   */
  private static getLogLevel(severity: SeverityLevel): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'critical':
      case 'high':
        return 'error'
      case 'medium':
        return 'warn'
      default:
        return 'log'
    }
  }

  /**
   * Send to external monitoring service
   */
  private static async sendToMonitoringService(event: SecurityEvent): Promise<void> {
    // Integration with services like Sentry, DataDog, etc.
    // await fetch(process.env.SECURITY_MONITORING_ENDPOINT, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // })
  }

  /**
   * Analyze for threat patterns
   */
  private static analyzeThreatPatterns(event: SecurityEvent): void {
    // Detect brute force attacks
    if (event.type === 'LOGIN_FAILED') {
      const recentFailures = this.searchEvents({
        type: 'LOGIN_FAILED',
        ip: event.ip,
        startDate: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
      })

      if (recentFailures.length >= 5) {
        ThreatDetection.blockIP(event.ip, 'Brute force attack detected', 3600000) // 1 hour
        this.log({
          type: 'BRUTE_FORCE_ATTACK',
          severity: 'high',
          ip: event.ip,
          result: 'blocked',
          metadata: {
            failedAttempts: recentFailures.length
          }
        })
      }
    }

    // Detect suspicious activity patterns
    // Add more pattern detection logic here
  }

  /**
   * Alert security team
   */
  private static async alertSecurityTeam(event: SecurityEvent): Promise<void> {
    const webhookUrl = process.env.SECURITY_ALERT_WEBHOOK

    if (!webhookUrl) {
      console.error('[SECURITY] No alert webhook configured for critical event:', event)
      return
    }

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `🚨 CRITICAL SECURITY EVENT`,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Critical Security Event Detected*\n\n*Type:* ${event.type}\n*Severity:* ${event.severity}\n*IP:* ${event.ip}\n*User:* ${event.userId || 'Unknown'}\n*Time:* ${event.timestamp.toISOString()}`
              }
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Details:*\n\`\`\`${JSON.stringify(event.metadata, null, 2)}\`\`\``
              }
            }
          ]
        })
      })
    } catch (error) {
      console.error('[SECURITY] Failed to send alert:', error)
    }
  }
}

/**
 * Threat Detection & Prevention
 */
export class ThreatDetection {
  private static blockedIPs = new Map<string, ThreatIndicator>()
  private static blockedUsers = new Map<string, ThreatIndicator>()

  /**
   * Block IP address
   */
  static blockIP(ip: string, reason: string, duration?: number): void {
    const expiresAt = duration ? new Date(Date.now() + duration) : undefined

    this.blockedIPs.set(ip, {
      type: 'ip',
      value: ip,
      reason,
      blockedAt: new Date(),
      expiresAt
    })

    console.warn(`[SECURITY] Blocked IP: ${ip} - ${reason}`)
  }

  /**
   * Block user
   */
  static blockUser(userId: string, reason: string, duration?: number): void {
    const expiresAt = duration ? new Date(Date.now() + duration) : undefined

    this.blockedUsers.set(userId, {
      type: 'user',
      value: userId,
      reason,
      blockedAt: new Date(),
      expiresAt
    })

    console.warn(`[SECURITY] Blocked user: ${userId} - ${reason}`)
  }

  /**
   * Check if IP is blocked
   */
  static isIPBlocked(ip: string): boolean {
    const block = this.blockedIPs.get(ip)

    if (!block) return false

    // Check if block has expired
    if (block.expiresAt && block.expiresAt < new Date()) {
      this.blockedIPs.delete(ip)
      return false
    }

    return true
  }

  /**
   * Check if user is blocked
   */
  static isUserBlocked(userId: string): boolean {
    const block = this.blockedUsers.get(userId)

    if (!block) return false

    // Check if block has expired
    if (block.expiresAt && block.expiresAt < new Date()) {
      this.blockedUsers.delete(userId)
      return false
    }

    return true
  }

  /**
   * Unblock IP
   */
  static unblockIP(ip: string): void {
    this.blockedIPs.delete(ip)
    console.log(`[SECURITY] Unblocked IP: ${ip}`)
  }

  /**
   * Unblock user
   */
  static unblockUser(userId: string): void {
    this.blockedUsers.delete(userId)
    console.log(`[SECURITY] Unblocked user: ${userId}`)
  }

  /**
   * Get all blocks
   */
  static getBlocks(): {
    ips: ThreatIndicator[]
    users: ThreatIndicator[]
  } {
    return {
      ips: Array.from(this.blockedIPs.values()),
      users: Array.from(this.blockedUsers.values())
    }
  }

  /**
   * Detect SQL injection attempt
   */
  static detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
      /(--|\#|\/\*|\*\/)/,
      /(\bOR\b.*=.*|'.*OR.*'|".*OR.*")/i,
      /(\bUNION\b.*\bSELECT\b)/i,
      /(INFORMATION_SCHEMA|sys\.tables|sys\.columns)/i
    ]

    return sqlPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Detect XSS attempt
   */
  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>[\s\S]*?<\/script>/i,
      /<iframe[^>]*>/i,
      /javascript:/i,
      /on\w+\s*=/i, // Event handlers like onclick, onerror
      /<embed[^>]*>/i,
      /<object[^>]*>/i
    ]

    return xssPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Detect path traversal attempt
   */
  static detectPathTraversal(input: string): boolean {
    const pathPatterns = [
      /\.\.\//,
      /\.\.\\/,
      /%2e%2e%2f/i,
      /%2e%2e\//i,
      /\.\.%2f/i
    ]

    return pathPatterns.some(pattern => pattern.test(input))
  }

  /**
   * Validate request for threats
   */
  static validateRequest(request: NextRequest): {
    safe: boolean
    threats: string[]
  } {
    const threats: string[] = []

    // Check IP block
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    if (this.isIPBlocked(ip)) {
      threats.push('IP blocked due to previous security violations')
    }

    // Check query parameters
    const url = new URL(request.url)
    url.searchParams.forEach((value, key) => {
      if (this.detectSQLInjection(value)) {
        threats.push(`SQL injection detected in parameter: ${key}`)
      }
      if (this.detectXSS(value)) {
        threats.push(`XSS attempt detected in parameter: ${key}`)
      }
      if (this.detectPathTraversal(value)) {
        threats.push(`Path traversal detected in parameter: ${key}`)
      }
    })

    // Check path
    if (this.detectPathTraversal(url.pathname)) {
      threats.push('Path traversal detected in URL')
    }

    return {
      safe: threats.length === 0,
      threats
    }
  }
}

/**
 * Security metrics and statistics
 */
export class SecurityMetrics {
  /**
   * Get security dashboard data
   */
  static getDashboard(): {
    totalEvents: number
    criticalEvents: number
    blockedIPs: number
    blockedUsers: number
    recentEvents: SecurityEvent[]
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
  } {
    const events = SecurityLogger.getRecentEvents(1000)
    const blocks = ThreatDetection.getBlocks()

    // Count events by type
    const eventsByType: Record<string, number> = {}
    events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1
    })

    // Count events by severity
    const eventsBySeverity: Record<string, number> = {}
    events.forEach(event => {
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1
    })

    return {
      totalEvents: events.length,
      criticalEvents: events.filter(e => e.severity === 'critical').length,
      blockedIPs: blocks.ips.length,
      blockedUsers: blocks.users.length,
      recentEvents: events.slice(0, 10),
      eventsByType,
      eventsBySeverity
    }
  }

  /**
   * Generate security report
   */
  static generateReport(startDate: Date, endDate: Date): {
    period: { start: Date; end: Date }
    summary: {
      totalEvents: number
      criticalEvents: number
      highSeverityEvents: number
      blockedRequests: number
    }
    topThreats: Array<{ type: SecurityEventType; count: number }>
    topIPs: Array<{ ip: string; events: number }>
  } {
    const events = SecurityLogger.searchEvents({ startDate, endDate })

    // Count events by type
    const eventCounts = new Map<SecurityEventType, number>()
    events.forEach(event => {
      eventCounts.set(event.type, (eventCounts.get(event.type) || 0) + 1)
    })

    // Count events by IP
    const ipCounts = new Map<string, number>()
    events.forEach(event => {
      ipCounts.set(event.ip, (ipCounts.get(event.ip) || 0) + 1)
    })

    // Sort and get top threats
    const topThreats = Array.from(eventCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([type, count]) => ({ type, count }))

    // Sort and get top IPs
    const topIPs = Array.from(ipCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, events]) => ({ ip, events }))

    return {
      period: { start: startDate, end: endDate },
      summary: {
        totalEvents: events.length,
        criticalEvents: events.filter(e => e.severity === 'critical').length,
        highSeverityEvents: events.filter(e => e.severity === 'high').length,
        blockedRequests: events.filter(e => e.result === 'blocked').length
      },
      topThreats,
      topIPs
    }
  }
}

// Export singleton instance
export const SecurityMonitor = {
  log: SecurityLogger.log.bind(SecurityLogger),
  getRecentEvents: SecurityLogger.getRecentEvents.bind(SecurityLogger),
  searchEvents: SecurityLogger.searchEvents.bind(SecurityLogger),
  ...ThreatDetection,
  ...SecurityMetrics
}
