# Security Incident Response Playbook

## Overview

This playbook provides step-by-step procedures for responding to security incidents at PG Closets. All team members should be familiar with these procedures.

---

## Incident Classification

### Severity Levels

| Level | Description | Examples | Response Time | Escalation |
|-------|-------------|----------|---------------|------------|
| **P0 - Critical** | Active data breach, complete service outage | Customer data exposed, site completely down | Immediate | CEO, CTO, Legal |
| **P1 - High** | Service degradation, active exploitation | Database compromise, API abuse, DDoS attack | <1 hour | CTO, Security Lead |
| **P2 - Medium** | Performance issues, elevated error rates | Slow response times, partial outages | <4 hours | Engineering Manager |
| **P3 - Low** | Minor issues, non-critical warnings | CSP violations, failed auth attempts | <24 hours | On-call engineer |

---

## Incident Response Team

### Roles & Responsibilities

**Incident Commander (IC)**:
- Overall incident coordination
- Communication with stakeholders
- Final decision authority

**Technical Lead**:
- Technical investigation
- Implement fixes
- System recovery

**Communications Lead**:
- Customer communications
- Status page updates
- Post-mortem documentation

**Security Lead**:
- Security analysis
- Threat assessment
- Compliance verification

---

## Response Procedures

### Phase 1: Detection & Triage (0-15 minutes)

#### 1.1 Detect Incident

**Automated Detection**:
- Security alerts via webhook
- Error rate threshold exceeded
- Rate limit violations
- CSP violation patterns
- Uptime monitor alerts

**Manual Detection**:
- User reports
- Team observation
- Security audit findings

#### 1.2 Classify Severity

Use the severity matrix above to classify the incident.

#### 1.3 Assemble Response Team

```bash
# Create incident channel
/incident create --severity P1 --title "DDoS attack detected"

# Notify team
@security-team @engineering-lead Incident P1: DDoS attack in progress
```

#### 1.4 Initial Assessment

**Questions to Answer**:
- What is the impact? (scope, users affected)
- What is the attack vector?
- Is this ongoing or historical?
- Is customer data at risk?
- Is this a known vulnerability?

---

### Phase 2: Containment (15 minutes - 2 hours)

#### 2.1 Immediate Actions

**For DDoS Attack**:
```typescript
import { ddosDetector } from '@/lib/security/rate-limiting'

// Get suspicious IPs
const suspiciousIPs = ddosDetector.getSuspiciousIPs()

// Block top offenders
suspiciousIPs
  .filter(ip => ip.score > 50)
  .forEach(ip => ddosDetector.blockIP(ip.ip, 'DDoS attack'))

// Enable aggressive rate limiting
const adaptiveLimiter = new AdaptiveRateLimiter(RATE_LIMIT_PRESETS.api)
adaptiveLimiter.adjustLimits({ cpuUsage: 90, errorRate: 0.3 })
```

**For Data Breach**:
```typescript
// Immediately rotate all secrets
await rotateJWTSecret()
await rotateEncryptionKey()
await rotateAPIKeys()

// Force logout all users
await invalidateAllSessions()

// Enable audit logging
await enableAuditMode()

// Notify affected users (required by law)
await notifyAffectedUsers(affectedUserIds)
```

**For Unauthorized Access**:
```typescript
// Disable compromised account
await disableUser(userId, 'Security incident - unauthorized access')

// Review access logs
const accessLogs = await getAccessLogs(userId, last24Hours)

// Check for data exfiltration
const dataAccess = await getDataAccessLog(userId, last24Hours)

// Reset passwords for affected accounts
await requirePasswordReset(affectedUserIds)
```

#### 2.2 Preserve Evidence

**System Snapshots**:
```bash
# Database snapshot
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > incident-$(date +%s).sql

# Application logs
vercel logs --since 24h > incident-logs-$(date +%s).txt

# Access logs
aws s3 cp s3://logs/access/ ./incident-access-logs/ --recursive

# Network traffic (if available)
tcpdump -w incident-$(date +%s).pcap
```

**Document Timeline**:
- Time of detection
- Time of initial compromise (if known)
- Actions taken
- Systems affected
- Data accessed

#### 2.3 Communicate Status

**Internal Communication** (every 30 minutes):
```
Incident Update - [Timestamp]
Severity: P1
Status: Containment in progress
Impact: API rate limits reduced by 50%, normal operations restored
Actions: Blocked 15 malicious IPs, enabled aggressive rate limiting
Next Steps: Monitoring for continued attacks, analyzing attack patterns
ETA: 2 hours to full resolution
```

**Customer Communication** (if customer-facing):
```
Service Status Update

We are currently experiencing elevated traffic that may affect service
performance. Our team is actively working to resolve this issue.

Current Status: Degraded Performance
Affected Services: Quote submission forms
Workaround: Please retry in 5 minutes

We apologize for any inconvenience and will provide updates every 30 minutes.

Last updated: [Timestamp]
```

---

### Phase 3: Eradication (2-8 hours)

#### 3.1 Root Cause Analysis

**Investigation Checklist**:
- [ ] Review application logs for errors
- [ ] Check database query patterns
- [ ] Analyze network traffic
- [ ] Review recent deployments
- [ ] Check third-party integrations
- [ ] Scan for vulnerabilities
- [ ] Review access controls

**Tools**:
```bash
# Search logs for suspicious activity
grep -i "unauthorized\|injection\|attack" incident-logs.txt

# Check for SQL injection attempts
grep -i "select\|union\|drop\|insert" incident-logs.txt

# Analyze traffic patterns
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head -20

# Check for credential stuffing
grep "401\|403" access.log | awk '{print $1}' | sort | uniq -c | sort -rn
```

#### 3.2 Patch Vulnerabilities

**Code Fixes**:
```typescript
// Example: Fix SQL injection
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✅ Secure
const query = 'SELECT * FROM users WHERE email = $1'
await db.query(query, [email])

// Example: Fix XSS
// ❌ Vulnerable
dangerouslySetInnerHTML={{ __html: userInput }}

// ✅ Secure
import { sanitizeHTML } from '@/lib/security/input-validation'
dangerouslySetInnerHTML={{ __html: sanitizeHTML(userInput) }}
```

**Dependency Updates**:
```bash
# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Update specific package
npm update <package-name>

# Verify fixes
npm audit --audit-level=moderate
```

#### 3.3 Strengthen Defenses

**Additional Security Measures**:
```typescript
// Enable additional security features
const securityConfig = {
  rateLimiting: {
    enabled: true,
    strictMode: true,
    maxRequests: 50 // Reduced from 100
  },
  authentication: {
    require2FA: true, // Enable 2FA for all users
    sessionTimeout: 15 * 60 * 1000 // Reduce from 30 min to 15 min
  },
  monitoring: {
    suspiciousActivityAlerts: true,
    realTimeLogging: true,
    automaticBlocking: true
  }
}
```

---

### Phase 4: Recovery (8-24 hours)

#### 4.1 Restore Normal Operations

**Service Recovery Checklist**:
- [ ] Verify vulnerabilities patched
- [ ] Test all critical functionality
- [ ] Restore normal rate limits (gradually)
- [ ] Re-enable affected services
- [ ] Verify data integrity
- [ ] Monitor for recurrence

**Gradual Rollout**:
```typescript
// Gradually restore rate limits
const stages = [
  { duration: 1 * 60 * 60 * 1000, limit: 50 },   // 1 hour: 50 req/min
  { duration: 2 * 60 * 60 * 1000, limit: 75 },   // 2 hours: 75 req/min
  { duration: 4 * 60 * 60 * 1000, limit: 100 },  // 4 hours: 100 req/min (normal)
]

for (const stage of stages) {
  await updateRateLimit(stage.limit)
  await sleep(stage.duration)
  await verifySystemHealth()
}
```

#### 4.2 Verify Data Integrity

**Data Verification**:
```sql
-- Check for data corruption
SELECT COUNT(*) FROM users WHERE email IS NULL;
SELECT COUNT(*) FROM orders WHERE total < 0;

-- Verify backup integrity
\copy (SELECT * FROM critical_table) TO '/tmp/verify.csv'
diff /tmp/verify.csv /backup/critical_table.csv

-- Check for unauthorized changes
SELECT * FROM audit_log
WHERE timestamp > '2024-01-01 00:00:00'
AND action IN ('DELETE', 'UPDATE')
AND user_id NOT IN (SELECT id FROM authorized_admins);
```

#### 4.3 Monitor for Recurrence

**Enhanced Monitoring**:
```typescript
// Set up incident-specific monitoring
const monitoring = {
  metrics: [
    'error_rate',
    'request_rate',
    'auth_failures',
    'suspicious_ips',
    'data_access_patterns'
  ],
  alertThresholds: {
    error_rate: 0.01, // Alert if >1% error rate
    auth_failures: 5,  // Alert if >5 failures from same IP
    request_rate: 1000 // Alert if >1000 req/min from single IP
  },
  duration: 7 * 24 * 60 * 60 * 1000 // Monitor for 7 days
}

await setupIncidentMonitoring(monitoring)
```

---

### Phase 5: Post-Incident (24-72 hours)

#### 5.1 Post-Mortem Meeting

**Agenda**:
1. Incident timeline review
2. Root cause analysis
3. Response effectiveness
4. Lessons learned
5. Action items

**Template**:
```markdown
# Post-Mortem: [Incident Name]

## Incident Summary
- Date: [Date]
- Duration: [Start] to [End] ([Duration])
- Severity: [P0/P1/P2/P3]
- Impact: [Description of impact]

## Timeline
- [Time]: Initial detection
- [Time]: Team assembled
- [Time]: Containment started
- [Time]: Root cause identified
- [Time]: Patch deployed
- [Time]: Services restored
- [Time]: Incident closed

## Root Cause
[Detailed explanation of what caused the incident]

## What Went Well
- Quick detection through automated alerts
- Effective containment procedures
- Clear communication

## What Went Wrong
- Delayed escalation to security team
- Incomplete testing of patch
- Unclear on-call procedures

## Action Items
- [ ] Update security headers configuration (@security-lead, due: [date])
- [ ] Implement additional monitoring (@devops-lead, due: [date])
- [ ] Conduct security training (@all-team, due: [date])
- [ ] Update incident response playbook (@incident-commander, due: [date])

## Lessons Learned
1. Need better automated testing for security patches
2. On-call rotation needs clearer escalation paths
3. Customer communication templates should be pre-approved
```

#### 5.2 Notification Requirements

**Legal/Regulatory Notifications**:

| Regulation | Notification Required | Timeline | Authority |
|------------|----------------------|----------|-----------|
| **GDPR** | Data breach affecting EU residents | 72 hours | National DPA |
| **CCPA** | Unauthorized access to CA residents | Without unreasonable delay | CA AG |
| **PCI-DSS** | Payment card data breach | Immediately | Card brands, acquirer |
| **PIPEDA** | Breach of security safeguards (Canada) | ASAP | Privacy Commissioner |

**Customer Notifications**:
```
Subject: Important Security Notice - [Company Name]

Dear [Customer Name],

We are writing to inform you about a security incident that may have affected
your account.

What Happened:
On [Date], we detected [brief description of incident]. Our security team
immediately took action to contain the issue.

What Information Was Involved:
[Specific data types: names, emails, phone numbers, etc.]
[Explicitly state what WAS NOT involved: passwords, payment info, etc.]

What We're Doing:
- Immediately patched the vulnerability
- Enhanced security monitoring
- Reviewed all access logs
- Notified appropriate authorities

What You Should Do:
1. Change your password immediately
2. Enable two-factor authentication
3. Monitor your account for suspicious activity
4. Report any concerns to security@pgclosets.com

Questions:
If you have questions, please contact our security team at:
Email: security@pgclosets.com
Phone: [Phone number]
Hours: Monday-Friday, 9am-5pm EST

We sincerely apologize for this incident and any inconvenience it may cause.

Sincerely,
[Name]
[Title]
[Company Name]
```

#### 5.3 Update Security Policies

**Policy Updates**:
```markdown
## Changes to Security Policy (Post-Incident)

### New Requirements:
1. All API endpoints must have rate limiting
2. Two-factor authentication required for admin accounts
3. Security code review required for all PRs
4. Monthly security dependency audits
5. Quarterly penetration testing

### Updated Procedures:
1. Incident escalation path clarified
2. On-call rotation expanded to 24/7
3. Customer notification templates approved
4. Disaster recovery plan updated

### New Tools:
1. Automated security scanning in CI/CD
2. Real-time anomaly detection
3. Enhanced logging and monitoring
4. Incident management platform
```

---

## Incident Templates

### Email: Internal Alert

```
Subject: [P0/P1/P2/P3] Security Incident - [Brief Description]

Priority: [P0/P1/P2/P3]
Status: [Investigating/Containment/Resolution/Closed]
Incident Commander: [Name]

SUMMARY:
[2-3 sentence description of the incident]

IMPACT:
- Systems affected: [List]
- Users affected: [Number/scope]
- Data at risk: [Yes/No - type]
- Service status: [Normal/Degraded/Outage]

ACTIONS TAKEN:
1. [Action 1]
2. [Action 2]
3. [Action 3]

NEXT STEPS:
1. [Next step 1]
2. [Next step 2]

CURRENT NEEDS:
- [Resource/person needed]

Join incident channel: #incident-[timestamp]
```

### Slack: Status Update

```
🚨 INCIDENT UPDATE - [HH:MM]

Severity: P1
Status: 🟡 Containment in progress

Impact:
• API response times elevated (+200ms)
• Quote submission success rate: 85% (normally 99%)
• Estimated users affected: ~50

Progress:
✅ Malicious IPs identified and blocked
✅ Rate limits adjusted
🔄 Deploying additional security measures
⏳ Monitoring for continued attacks

Next update: 30 minutes

Questions? → #incident-2024-01-15-ddos
```

---

## Contact Information

### Emergency Contacts

**Security Team**:
- Email: security@pgclosets.com
- Slack: #security-team
- On-call: [On-call rotation phone]

**Legal/Compliance**:
- Email: legal@pgclosets.com
- Phone: [Phone number]

**External Resources**:
- Cyber Insurance: [Provider contact]
- Legal Counsel: [Law firm contact]
- Forensics Team: [Forensics firm contact]

---

## Annual Review

This playbook should be reviewed and updated:
- After each P0 or P1 incident
- Quarterly (minimum)
- When team structure changes
- When new regulations are introduced

**Last Reviewed**: 2025-10-14
**Next Review Due**: 2026-01-14
**Owner**: Security Team
