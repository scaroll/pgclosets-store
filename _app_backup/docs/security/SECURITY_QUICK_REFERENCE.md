# Security Quick Reference Guide

## 🚨 Emergency Contacts

**Security Incidents**: [Your security team email]
**Infrastructure Issues**: [Your DevOps team]
**Privacy Requests**: [Your privacy officer]

---

## Common Security Tasks

### 1. Block Malicious IP

```typescript
import { ddosDetector } from '@/lib/security/rate-limiting'

// Block IP address
ddosDetector.blockIP('192.168.1.100', 'Malicious activity detected')

// Unblock IP address
ddosDetector.unblockIP('192.168.1.100')

// Check if IP is blocked
const isBlocked = ddosDetector.isBlocked('192.168.1.100')
```

### 2. Sanitize User Input

```typescript
import { sanitizeUserInput, sanitizeHTML, sanitizeEmail } from '@/lib/security/input-validation'

// Escape HTML entities
const safe = sanitizeUserInput(userInput)

// Sanitize HTML content
const safeHTML = sanitizeHTML(richTextContent)

// Validate and sanitize email
const email = sanitizeEmail(rawEmail)
if (!email) {
  throw new Error('Invalid email')
}
```

### 3. Validate Request Input

```typescript
import { ValidationSchemas, InputSanitizer } from '@/lib/security/input-validation'
import { z } from 'zod'

// Define schema
const QuoteSchema = z.object({
  name: ValidationSchemas.name,
  email: ValidationSchemas.email,
  phone: ValidationSchemas.phone,
  message: z.string().min(10).max(1000)
})

// Validate
const result = InputSanitizer.validateFormData(formData, QuoteSchema)
if (!result.success) {
  return { error: result.errors }
}
```

### 4. Apply Rate Limiting

```typescript
import { withRateLimit, RATE_LIMIT_PRESETS } from '@/lib/security/rate-limiting'

export async function POST(request: NextRequest) {
  return withRateLimit(
    request,
    RATE_LIMIT_PRESETS.forms,
    async () => {
      // Your API logic here
      return Response.json({ success: true })
    }
  )
}
```

### 5. Apply Security Headers

```typescript
import { applySecurityHeaders } from '@/lib/security/headers'

export async function GET(request: NextRequest) {
  const response = NextResponse.json({ data: 'value' })
  return applySecurityHeaders(response, { enableCSP: true })
}
```

---

## Security Incident Response

### Step 1: Identify Threat

**Signs of Security Incident**:
- Unusual spike in 429 errors (rate limit)
- Multiple failed authentication attempts
- Suspicious CSP violation reports
- Abnormal traffic patterns
- Data exfiltration attempts

### Step 2: Assess Severity

| Severity | Description | Response Time |
|----------|-------------|---------------|
| **Critical** | Data breach, complete outage | Immediate |
| **High** | Service degradation, active exploit | 1 hour |
| **Medium** | Performance issues, elevated errors | 4 hours |
| **Low** | Minor issues, warnings | 24 hours |

### Step 3: Contain Threat

```typescript
// Block IP
ddosDetector.blockIP(maliciousIP, 'Security incident')

// Disable compromised user account
await disableUser(userId, 'Security incident')

// Rotate secrets (if compromised)
await rotateJWTSecret()
await rotateEncryptionKey()
```

### Step 4: Document Incident

**Required Information**:
- Incident timestamp
- Affected systems/users
- Attack vector
- Actions taken
- Lessons learned

---

## Privacy & Compliance

### GDPR Data Export

```typescript
import { GDPRCompliance } from '@/lib/security/compliance'

// Export user data
const userData = await GDPRCompliance.exportUserData(userId)

// Return as downloadable JSON
return Response.json(userData, {
  headers: {
    'Content-Disposition': `attachment; filename="user-data-${userId}.json"`
  }
})
```

### GDPR Data Deletion

```typescript
import { GDPRCompliance } from '@/lib/security/compliance'

// Erase user data (right to be forgotten)
await GDPRCompliance.eraseUserData(userId, 'User request')

// Verify deletion
const verification = await GDPRCompliance.verifyErasure(userId)
```

### CCPA Opt-Out

```typescript
import { CCPACompliance } from '@/lib/security/compliance'

// Set do-not-sell preference
await CCPACompliance.setDoNotSell(userId, true)

// Check opt-out status
const optedOut = await CCPACompliance.hasOptedOut(userId)
```

---

## Monitoring & Alerts

### Check Security Health

```typescript
import { performSecurityHealthCheck } from '@/lib/security'

const health = await performSecurityHealthCheck()

console.log(`Security Status: ${health.status}`)
console.log(`Issues: ${health.issues.join(', ')}`)
console.log(`Recommendations: ${health.recommendations.join(', ')}`)
```

### Validate Security Headers

```typescript
import { validateSecurityHeaders } from '@/lib/security/headers'

const validation = validateSecurityHeaders(response.headers)

console.log(`Security Score: ${validation.score}/100`)
console.log(`Missing Headers: ${validation.missing.join(', ')}`)
console.log(`Warnings: ${validation.warnings.join(', ')}`)
```

### Monitor Rate Limits

```bash
# Check current rate limit status
curl -i https://www.pgclosets.com/api/health

# Headers to check:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 87
# X-RateLimit-Reset: 1699564800
```

---

## Testing Security

### Test CSP Headers

```bash
# Check CSP header
curl -I https://www.pgclosets.com | grep Content-Security-Policy

# Expected:
# Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...' 'strict-dynamic'; ...
```

### Test Rate Limiting

```bash
# Send rapid requests to trigger rate limit
for i in {1..150}; do
  curl https://www.pgclosets.com/api/quote
done

# Should see 429 Too Many Requests after limit
```

### Test HTTPS Redirect

```bash
# Test non-www to www redirect
curl -I http://pgclosets.com

# Expected: 301 Moved Permanently
# Location: https://www.pgclosets.com

# Test HTTPS enforcement
curl -I http://www.pgclosets.com

# Expected: 301 Moved Permanently
# Location: https://www.pgclosets.com
```

### Test Security Headers

```bash
# Use SecurityHeaders.com
https://securityheaders.com/?q=https://www.pgclosets.com

# Use Mozilla Observatory
https://observatory.mozilla.org/analyze/www.pgclosets.com

# Expected Grade: A or A+
```

---

## Troubleshooting

### Issue: Rate Limit False Positives

**Symptoms**: Legitimate users getting 429 errors

**Solutions**:
1. Check if legitimate user behind NAT/VPN
2. Increase rate limit for specific endpoint
3. Use user-based instead of IP-based limiting
4. Whitelist known IPs (office, partners)

```typescript
// Whitelist IP
const WHITELISTED_IPS = ['1.2.3.4', '5.6.7.8']

if (WHITELISTED_IPS.includes(clientIP)) {
  return NextResponse.next() // Skip rate limit
}
```

### Issue: CSP Violations

**Symptoms**: Scripts/styles blocked, functionality broken

**Solutions**:
1. Check CSP violation reports
2. Add legitimate sources to CSP
3. Use nonce for inline scripts
4. Avoid inline event handlers

```typescript
// Add nonce to inline script
const nonce = generateNonce()
const csp = generateCSP(nonce)

<script nonce={nonce}>
  // Your inline script
</script>
```

### Issue: High Error Rate

**Symptoms**: Error rate >1%

**Solutions**:
1. Check error dashboard for patterns
2. Review recent deployments
3. Check third-party API status
4. Monitor database performance
5. Review application logs

```bash
# Check error logs
vercel logs --follow

# Check specific error type
vercel logs --filter "ERROR"
```

---

## Best Practices

### ✅ Do's

- Always sanitize user inputs
- Use parameterized queries for database
- Validate file uploads (type, size, extension)
- Enable HTTPS everywhere
- Use strong passwords (12+ chars, complexity)
- Rotate secrets regularly
- Keep dependencies updated
- Monitor security alerts
- Test security before deploying
- Document security incidents

### ❌ Don'ts

- Never trust user input
- Never store passwords in plaintext
- Never commit secrets to git
- Never disable security features in production
- Never use `eval()` or similar dangerous functions
- Never skip input validation
- Never ignore security warnings
- Never expose sensitive data in logs
- Never use weak encryption
- Never skip security testing

---

## Resources

**Security Tools**:
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SecurityHeaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)

**Compliance**:
- [GDPR Portal](https://gdpr.eu)
- [CCPA Overview](https://oag.ca.gov/privacy/ccpa)
- [PCI-DSS Standards](https://www.pcisecuritystandards.org)

**Monitoring**:
- [Sentry Documentation](https://docs.sentry.io)
- [Vercel Analytics](https://vercel.com/docs/analytics)
- [Google Analytics 4](https://support.google.com/analytics)

---

**Last Updated**: 2025-10-14
**Version**: 1.0.0
**Owner**: Security Team
