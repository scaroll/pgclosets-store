/**
 * Enterprise Security System - Main Export
 * Comprehensive security framework for PG Closets E-Commerce Platform
 *
 * Features:
 * - AES-256-GCM Encryption
 * - Two-Factor Authentication (TOTP)
 * - Real-time Security Monitoring
 * - GDPR/CCPA/PCI-DSS Compliance
 * - Threat Detection & Prevention
 * - Incident Response
 */

// Encryption & Data Protection
export {
  encrypt,
  decrypt,
  hash,
  verifyHash,
  generateSecureToken,
  maskSensitiveData,
  encryptPII,
  decryptPII,
  KeyRotation,
  validateEncryptionConfig
} from './encryption'

// Two-Factor Authentication
export {
  TwoFactorAuth,
  TOTP,
  require2FA
} from './2fa'

// Security Monitoring & Threat Detection
export {
  SecurityMonitor,
  ThreatDetection,
  SecurityMetrics,
  type SecurityEvent,
  type SecurityEventType,
  type SeverityLevel,
  type ThreatIndicator
} from './monitoring'

// Compliance Framework
export {
  GDPRCompliance,
  CCPACompliance,
  PCIDSSCompliance,
  DataRetention,
  PrivacyPolicy,
  ComplianceDashboard,
  DataClassification,
  RETENTION_PERIODS
} from './compliance'

// Security configuration validation
export function validateSecurityConfig(): {
  encryption: { valid: boolean; errors: string[] }
  twoFactor: { enabled: boolean; enforced: boolean }
  monitoring: { active: boolean; alerting: boolean }
  compliance: { gdpr: boolean; ccpa: boolean; pciDss: boolean }
} {
  const { validateEncryptionConfig } = require('./encryption')

  return {
    encryption: validateEncryptionConfig(),
    twoFactor: {
      enabled: true,
      enforced: false // TODO: Enable before production
    },
    monitoring: {
      active: true,
      alerting: !!process.env.SECURITY_ALERT_WEBHOOK
    },
    compliance: {
      gdpr: true,
      ccpa: true,
      pciDss: false // Requires additional configuration
    }
  }
}

// Security health check
export async function performSecurityHealthCheck(): Promise<{
  status: 'healthy' | 'degraded' | 'critical'
  issues: string[]
  recommendations: string[]
}> {
  const issues: string[] = []
  const recommendations: string[] = []

  // Check encryption
  const { validateEncryptionConfig } = require('./encryption')
  const encryptionStatus = validateEncryptionConfig()
  if (!encryptionStatus.valid) {
    issues.push(...encryptionStatus.errors)
  }

  // Check production secrets
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('fallback')) {
      issues.push('Production JWT secret not configured')
    }
    if (!process.env.ENCRYPTION_KEY) {
      issues.push('Production encryption key not configured')
    }
  }

  // Check monitoring
  if (!process.env.SECURITY_ALERT_WEBHOOK) {
    recommendations.push('Configure security alert webhook for critical events')
  }

  // Check 2FA
  recommendations.push('Enable 2FA enforcement for admin users')

  // Determine status
  let status: 'healthy' | 'degraded' | 'critical'
  if (issues.length === 0) {
    status = 'healthy'
  } else if (issues.some(issue => issue.includes('Production'))) {
    status = 'critical'
  } else {
    status = 'degraded'
  }

  return {
    status,
    issues,
    recommendations
  }
}

// Quick reference guide
export const SECURITY_QUICK_REFERENCE = {
  encryption: {
    sensitive_data: 'Use encrypt(data) before storage',
    pii: 'Use encryptPII({ email, phone, ... })',
    passwords: 'Use hash(password) with salt',
  },
  authentication: {
    login: 'Use SessionManager.createSession(user)',
    verify: 'Use SessionManager.getSession(request)',
    two_factor: 'Use TwoFactorAuth.verify(userId, token)',
  },
  monitoring: {
    log_event: 'SecurityMonitor.log({ type, severity, ... })',
    check_threat: 'ThreatDetection.validateRequest(request)',
    block_ip: 'ThreatDetection.blockIP(ip, reason)',
  },
  compliance: {
    gdpr_export: 'GDPRCompliance.exportUserData(userId)',
    gdpr_delete: 'GDPRCompliance.eraseUserData(userId, reason)',
    ccpa_opt_out: 'CCPACompliance.setDoNotSell(userId, true)',
  }
}

// Initialize security system
if (typeof window === 'undefined') {
  // Server-side only
  console.log('[SECURITY] Enterprise Security System Initialized')

  // Validate configuration on startup
  const health = validateSecurityConfig()

  if (!health.encryption.valid) {
    console.error('[SECURITY] ENCRYPTION CONFIGURATION INVALID:', health.encryption.errors)
  }

  if (process.env.NODE_ENV === 'production' && !health.twoFactor.enforced) {
    console.warn('[SECURITY] 2FA not enforced for admin users')
  }

  if (!health.monitoring.alerting) {
    console.warn('[SECURITY] Security alerting not configured')
  }
}
