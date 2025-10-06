# Enterprise Security System - Quick Start Guide

> **🔒 Enterprise-grade security framework for PG Closets E-Commerce Platform**
>
> AES-256-GCM Encryption | TOTP 2FA | Real-time Monitoring | GDPR/CCPA/PCI-DSS Compliance

---

## 🚀 Quick Start

### Installation

The security system is already integrated. No additional installation required.

### Basic Usage

```typescript
import {
  SecurityMonitor,
  TwoFactorAuth,
  encrypt,
  decrypt,
  GDPRCompliance
} from '@/lib/security'
```

---

## 📦 Core Features

### 1. Encryption & Data Protection

```typescript
// Encrypt sensitive data
const encrypted = encrypt('sensitive information')

// Decrypt data
const original = decrypt(encrypted)

// Encrypt PII (Personally Identifiable Information)
const encryptedPII = encryptPII({
  email: 'user@example.com',
  phone: '+1-555-0123',
  ssn: '123-45-6789'
})

// Hash passwords (one-way)
const { hash, salt } = await hash('user-password')
const isValid = await verifyHash('user-password', hash, salt)

// Generate secure random tokens
const token = generateSecureToken(32) // 32-byte hex string

// Mask sensitive data for logging
const masked = maskSensitiveData('4111111111111111') // 4111********1111
```

### 2. Two-Factor Authentication

```typescript
// Setup 2FA for a user
const setup = await TwoFactorAuth.setup('user-id', 'PG Closets')
console.log(setup.qrCodeUrl) // Display QR code to user
console.log(setup.backupCodes) // Store backup codes securely

// Enable 2FA after user scans QR code
const result = await TwoFactorAuth.enable('user-id', setup.secret, userToken)
if (result.success) {
  // Show backup codes to user
  console.log(result.backupCodes)
}

// Verify 2FA token during login
const valid = await TwoFactorAuth.verify('user-id', userToken)
if (valid) {
  // Grant access
}

// Disable 2FA (requires password confirmation)
await TwoFactorAuth.disable('user-id', userPassword)
```

### 3. Security Monitoring

```typescript
// Log security events
SecurityMonitor.log({
  type: 'LOGIN_SUCCESS',
  severity: 'low',
  ip: request.ip,
  userId: user.id,
  result: 'success',
  metadata: {
    email: user.email,
    userAgent: request.headers['user-agent']
  }
})

// Check if IP is blocked
if (ThreatDetection.isIPBlocked(clientIP)) {
  return new Response('Access denied', { status: 403 })
}

// Block suspicious IP
ThreatDetection.blockIP(clientIP, 'Brute force attack detected', 3600000) // 1 hour

// Validate request for threats
const { safe, threats } = ThreatDetection.validateRequest(request)
if (!safe) {
  SecurityMonitor.log({
    type: 'SUSPICIOUS_ACTIVITY',
    severity: 'high',
    ip: request.ip,
    result: 'blocked',
    metadata: { threats }
  })
}

// Get security dashboard
const dashboard = SecurityMonitor.getDashboard()
console.log(`Total events: ${dashboard.totalEvents}`)
console.log(`Blocked IPs: ${dashboard.blockedIPs}`)
```

### 4. GDPR Compliance

```typescript
// Export user data (Right to Access)
const userData = await GDPRCompliance.exportUserData('user-id')

// Export as JSON (Right to Data Portability)
const jsonData = await GDPRCompliance.exportToJSON('user-id')

// Update user data (Right to Rectification)
await GDPRCompliance.updateUserData('user-id', {
  name: 'Updated Name',
  email: 'new@email.com'
})

// Delete user data (Right to Erasure)
await GDPRCompliance.eraseUserData('user-id', 'User requested deletion')

// Record consent
await GDPRCompliance.recordConsent('user-id', 'marketing', true)

// Restrict processing
await GDPRCompliance.restrictProcessing('user-id', true)
```

### 5. CCPA Compliance

```typescript
// Set "Do Not Sell" preference
await CCPACompliance.setDoNotSell('user-id', true)

// Get data categories collected
const categories = CCPACompliance.getDataCategories()

// Get data sources
const sources = CCPACompliance.getDataSources()

// Get collection purposes
const purposes = CCPACompliance.getCollectionPurposes()
```

---

## 🛡️ Security Event Types

```typescript
type SecurityEventType =
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
  | 'CSRF_VALIDATION_FAILED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED_ACCESS_ATTEMPT'
  | 'SQL_INJECTION_ATTEMPT'
  | 'XSS_ATTEMPT'
  | 'SUSPICIOUS_ACTIVITY'
  | 'DATA_BREACH_ATTEMPT'
  | 'BRUTE_FORCE_ATTACK'
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Required for production
ENCRYPTION_KEY=<64-char-hex>    # Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<128-char-hex>       # Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
CSRF_SECRET=<64-char-hex>       # Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Optional
SECURITY_ALERT_WEBHOOK=<url>   # Slack webhook for critical alerts
SECURITY_LOG_LEVEL=info         # Logging verbosity
```

### Security Health Check

```typescript
import { performSecurityHealthCheck, validateSecurityConfig } from '@/lib/security'

// Check overall security health
const health = await performSecurityHealthCheck()
console.log(`Status: ${health.status}`) // 'healthy' | 'degraded' | 'critical'
console.log(`Issues: ${health.issues}`)
console.log(`Recommendations: ${health.recommendations}`)

// Validate configuration
const config = validateSecurityConfig()
console.log(config)
```

---

## 📋 Common Use Cases

### Protecting User Registration

```typescript
import { hash, encrypt, SecurityMonitor } from '@/lib/security'

// Hash password before storage
const { hash: passwordHash, salt } = await hash(userPassword)

// Encrypt sensitive PII
const encryptedEmail = encrypt(userEmail)
const encryptedPhone = encrypt(userPhone)

// Store in database
await database.user.create({
  data: {
    email: encryptedEmail,
    phone: encryptedPhone,
    passwordHash,
    passwordSalt: salt
  }
})

// Log security event
SecurityMonitor.log({
  type: 'SESSION_CREATED',
  severity: 'low',
  ip: request.ip,
  result: 'success',
  metadata: { action: 'user_registration' }
})
```

### Implementing Login with 2FA

```typescript
import { SessionManager, TwoFactorAuth, SecurityMonitor } from '@/lib/security'

// Step 1: Verify credentials
const user = await verifyUserCredentials(email, password)

// Step 2: Check if 2FA is required
const requires2FA = await TwoFactorAuth.isRequired(user.id)

if (requires2FA) {
  // Send to 2FA verification page
  return { requiresTwoFactor: true }
}

// Step 3: Create session
const { token } = await SessionManager.createSession(user)

// Step 4: Log successful login
SecurityMonitor.log({
  type: 'LOGIN_SUCCESS',
  severity: 'low',
  ip: request.ip,
  userId: user.id,
  result: 'success',
  metadata: { email: user.email }
})

return { token, requiresTwoFactor: false }
```

### GDPR Data Export API

```typescript
import { GDPRCompliance, SecurityMonitor } from '@/lib/security'

export async function GET(request: Request) {
  const userId = getUserIdFromSession(request)

  // Export all user data
  const userData = await GDPRCompliance.exportUserData(userId)

  // Log the export
  SecurityMonitor.log({
    type: 'SUSPICIOUS_ACTIVITY',
    severity: 'medium',
    ip: request.ip,
    userId,
    result: 'success',
    metadata: { action: 'gdpr_data_export' }
  })

  return Response.json(userData)
}
```

### Handling Security Incidents

```typescript
import { SecurityMonitor, ThreatDetection } from '@/lib/security'

// Detect and block brute force attacks
export function middleware(request: Request) {
  const ip = request.ip

  // Check recent failed login attempts
  const recentFailures = SecurityMonitor.searchEvents({
    type: 'LOGIN_FAILED',
    ip,
    startDate: new Date(Date.now() - 15 * 60 * 1000) // Last 15 minutes
  })

  if (recentFailures.length >= 5) {
    // Block IP for 1 hour
    ThreatDetection.blockIP(ip, 'Brute force attack detected', 3600000)

    // Log the block
    SecurityMonitor.log({
      type: 'BRUTE_FORCE_ATTACK',
      severity: 'high',
      ip,
      result: 'blocked',
      metadata: { failedAttempts: recentFailures.length }
    })

    return new Response('Too many failed attempts', { status: 429 })
  }

  return NextResponse.next()
}
```

---

## 🎯 Best Practices

### ✅ DO

- **Always encrypt PII** before storing in database
- **Hash passwords** using the provided hash() function
- **Log all security events** using SecurityMonitor
- **Enforce 2FA** for admin and sensitive accounts
- **Validate requests** for threats before processing
- **Use timing-safe comparisons** for sensitive data
- **Rotate encryption keys** quarterly
- **Review security logs** daily
- **Test disaster recovery** procedures regularly

### ❌ DON'T

- **Never store passwords** in plain text
- **Never log sensitive data** (passwords, tokens, PII)
- **Never skip encryption** for sensitive fields
- **Never use default secrets** in production
- **Never disable security features** without review
- **Never ignore security alerts**
- **Never expose internal errors** to users
- **Never trust user input** without validation

---

## 📊 Security Monitoring Dashboard

```typescript
// Get real-time security metrics
const dashboard = SecurityMonitor.getDashboard()

console.log(`
Security Dashboard
==================
Total Events: ${dashboard.totalEvents}
Critical Events: ${dashboard.criticalEvents}
Blocked IPs: ${dashboard.blockedIPs}
Blocked Users: ${dashboard.blockedUsers}

Top Threats:
${dashboard.eventsByType}

Recent Events:
${dashboard.recentEvents.slice(0, 5)}
`)
```

---

## 🆘 Incident Response

### If You Detect a Security Incident:

1. **Immediate Actions:**
   ```typescript
   // Block the threat
   ThreatDetection.blockIP(attackerIP, 'Security incident', 86400000) // 24 hours

   // Log critical event
   SecurityMonitor.log({
     type: 'DATA_BREACH_ATTEMPT',
     severity: 'critical',
     ip: attackerIP,
     result: 'blocked',
     metadata: { details: incidentDetails }
   })
   ```

2. **Escalate:**
   - Contact security team: security@pgclosets.com
   - Follow: `INCIDENT_RESPONSE_PLAN.md`

3. **Document:**
   - Capture all relevant logs
   - Preserve evidence
   - Create incident report

---

## 📚 Additional Resources

- **Full Documentation:** `DIVISION_12_SECURITY.md`
- **Security Audit:** `SECURITY_AUDIT_REPORT.md`
- **Incident Response:** `INCIDENT_RESPONSE_PLAN.md`
- **Compliance:** `COMPLIANCE_CHECKLIST.md`

---

## 🔗 Quick Reference

```typescript
// Import everything
import * as Security from '@/lib/security'

// Use the quick reference guide
console.log(Security.SECURITY_QUICK_REFERENCE)
```

---

## 💡 Support

**Security Team:** security@pgclosets.com
**Emergency:** [Configure emergency hotline]
**Slack:** #security-incidents

---

**Last Updated:** January 2025
**Version:** 1.0
**Maintained by:** Division 12 Security Agents
