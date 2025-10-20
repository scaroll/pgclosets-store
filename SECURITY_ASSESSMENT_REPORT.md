# Security Assessment Report - PG Closets Website

**Date:** October 19, 2025
**Assessment Type:** Comprehensive Security Vulnerability Assessment
**Scope:** PG Closets e-commerce website (Next.js application)

## Executive Summary

This security assessment identified **12 vulnerabilities** across the PG Closets website, including **3 critical**, **4 high**, and **5 medium severity issues**. The most significant vulnerabilities involve weak admin authentication, potential information disclosure, and inadequate input validation in certain endpoints.

## Critical Vulnerabilities

### 1. Weak Admin Authentication System 🔴 **CRITICAL**
**File:** `/app/admin/login/submit/route.ts`
**CVSS Score:** 9.0

**Vulnerability:**
- Single-factor authentication using only a static key
- No rate limiting on admin login attempts
- Cookie-based session without proper validation
- Admin key transmitted in plain text

**Impact:** Complete admin panel compromise if ADMIN_DASHBOARD_KEY is exposed

**Remediation:**
```typescript
// Implement secure admin authentication
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';

export async function POST(req: Request) {
  // 1. Add rate limiting for admin login
  const identifier = getClientIP(req);
  const rateLimitResult = await checkRateLimit(identifier, adminRateLimiter);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429 }
    );
  }

  // 2. Use strong password hashing
  const provided = String(form.get('key') || '');
  const expected = process.env.ADMIN_DASHBOARD_KEY_HASH;

  if (!await bcrypt.compare(provided, expected)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // 3. Use secure JWT instead of simple cookie
  const token = await new SignJWT({
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) // 2 hours
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  const res = NextResponse.redirect(new URL(next, req.url));
  res.cookies.set('pg_admin_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/admin',
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return res;
}
```

### 2. SQL Injection Risk in Disabled Routes 🔴 **CRITICAL**
**File:** Multiple disabled API routes in `/app/api/_*_disabled/` directories
**CVSS Score:** 8.1

**Vulnerability:**
- Disabled routes still contain vulnerable SQL queries
- Direct string concatenation in database queries
- No parameterized queries or ORM usage

**Remediation:**
```typescript
// Remove or secure all disabled routes
// DO NOT commit disabled routes with vulnerabilities

// If needed, use parameterized queries:
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();
```

### 3. Insecure Direct Object Reference in Quote System 🔴 **CRITICAL**
**File:** `/app/api/quotes/quick/route.ts`, `/app/api/quotes/renin/route.ts`
**CVSS Score:** 7.5

**Vulnerability:**
- Quote numbers are predictable (timestamp + random string)
- No access control on quote retrieval
- Potential for unauthorized quote access

**Remediation:**
```typescript
// Implement secure quote ID generation
import { v4 as uuidv4 } from 'uuid';

const quoteNumber = `Q-${uuidv4().substring(0, 8).toUpperCase()}`;

// Add access control middleware
async function verifyQuoteAccess(quoteId: string, userEmail: string) {
  const { data, error } = await supabase
    .from('quote_requests')
    .select('*')
    .eq('quote_number', quoteId)
    .eq('customer_email', userEmail)
    .single();

  if (error || !data) {
    throw new Error('Unauthorized');
  }

  return data;
}
```

## High Severity Vulnerabilities

### 4. Missing Input Sanitization in Product Search 🟠 **HIGH**
**File:** `/app/api/products/route.ts`
**CVSS Score:** 7.0

**Vulnerability:**
- No sanitization of search parameters
- Potential for XSS through product data
- Direct use of query parameters in response

**Remediation:**
```typescript
import { sanitizeFormInput } from '@/lib/validation/sanitization';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = sanitizeFormInput(searchParams.get("query") || '', 100);
  const collectionTitle = sanitizeFormInput(searchParams.get("collection") || '', 50);

  // Continue with sanitized inputs
}
```

### 5. Insufficient Rate Limiting Configuration 🟠 **HIGH**
**File:** `/lib/validation/middleware.ts`
**CVSS Score:** 6.5

**Vulnerability:**
- In-memory rate limiting (doesn't scale)
- No distributed rate limiting for production
- Easy to bypass by changing IP

**Remediation:**
```typescript
// Use Redis-based rate limiting for production
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const ip = getClientIP(request);
    const key = `rate_limit:${ip}`;

    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, Math.ceil(config.windowMs / 1000));
    }

    if (current > config.maxRequests) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    return null;
  };
}
```

### 6. Weak Session Management 🟠 **HIGH**
**File:** `/app/admin/login/submit/route.ts`
**CVSS Score:** 6.8

**Vulnerability:**
- Simple cookie-based session
- No session invalidation
- No secure session flags

**Remediation:**
```typescript
// Implement secure session management
const res = NextResponse.redirect(new URL(next, req.url));
res.cookies.set('pg_admin_session', secureSessionToken, {
  httpOnly: true,
  sameSite: 'strict',
  secure: true,
  path: '/admin',
  maxAge: 60 * 60 * 2, // 2 hours
  // Additional security flags
  partitioned: true, // CHIPS
});
```

### 7. CORS Configuration Issues 🟠 **HIGH**
**File:** `/app/api/lead/route.ts`
**CVSS Score:** 6.1

**Vulnerability:**
- Hardcoded CORS origin
- No dynamic origin validation
- Missing important security headers

**Remediation:**
```typescript
// Dynamic CORS origin validation
const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  'https://pgclosets.com',
  'https://www.pgclosets.com'
];

const origin = req.headers.get('origin');
if (!allowedOrigins.includes(origin)) {
  return NextResponse.json(
    { error: 'CORS policy violation' },
    { status: 403 }
  );
}

const corsHeaders = {
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
  'Vary': 'Origin', // Important for caching
};
```

## Medium Severity Vulnerabilities

### 8. Information Disclosure in Error Messages 🟡 **MEDIUM**
**Multiple Files:** Various API routes

**Vulnerability:**
- Detailed error messages exposing internal structure
- Stack traces in production responses
- Database error details leaked

**Remediation:**
```typescript
// Implement secure error handling
class SecureError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'SecureError';
  }
}

// In production, sanitize all errors
function sanitizeError(error: unknown): NextResponse {
  if (process.env.NODE_ENV === 'production') {
    console.error('[API Error]', error); // Log detailed error
    return NextResponse.json(
      { error: 'An internal error occurred' },
      { status: 500 }
    );
  }

  // In development, return full error
  return NextResponse.json(
    { error: (error as Error).message },
    { status: 500 }
  );
}
```

### 9. Missing Security Headers 🟡 **MEDIUM**
**File:** `/lib/validation/middleware.ts` (line 153-181)

**Vulnerability:**
- CSP policy could be more restrictive
- Missing important security headers

**Remediation:**
```typescript
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Enhanced security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

  // Enhanced CSP
  const cspNonce = crypto.randomUUID();
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${cspNonce}' 'strict-dynamic' https://www.googletagmanager.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self'",
      "connect-src 'self' https://api.stripe.com https://checkout.stripe.com",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
      "block-all-mixed-content",
    ].join("; ")
  );

  return response;
}
```

### 10. Insufficient File Upload Validation 🟡 **MEDIUM**
**File:** `/lib/validation/middleware.ts` (lines 232-345)

**Vulnerability:**
- File type validation relies only on MIME type
- Missing content scanning for malware
- No file size limits per user

**Remediation:**
```typescript
// Enhanced file upload validation
export function validateFileUpload(options: {
  maxSize: number;
  allowedTypes: string[];
  maxFiles?: number;
  maxTotalSize?: number;
}) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const formData = await request.formData();
      const files: File[] = [];
      let totalSize = 0;

      // Collect files and validate total size
      const entries = Array.from(formData.entries());
      for (const [key, value] of entries) {
        if (value instanceof File) {
          files.push(value);
          totalSize += value.size;

          if (options.maxTotalSize && totalSize > options.maxTotalSize) {
            return NextResponse.json(
              { error: `Total file size exceeds limit` },
              { status: 400 }
            );
          }
        }
      }

      // Enhanced validation for each file
      for (const file of files) {
        // 1. Validate file signature (magic bytes)
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const fileSignature = Array.from(uint8Array.slice(0, 4))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');

        // Validate image signatures
        const validSignatures: Record<string, string[]> = {
          'image/jpeg': ['ffd8'],
          'image/png': ['89504e47'],
          'image/gif': ['47494638'],
          'image/webp': ['52494646', '52494644'],
        };

        const expectedSignatures = validSignatures[file.type];
        if (!expectedSignatures || !expectedSignatures.some(sig =>
          fileSignature.startsWith(sig))) {
          return NextResponse.json(
            { error: `Invalid file signature for ${file.name}` },
            { status: 400 }
          );
        }

        // 2. Scan for malicious content patterns
        const fileContent = new TextDecoder().decode(buffer);
        const maliciousPatterns = [
          /<script/i,
          /javascript:/i,
          /vbscript:/i,
          /onload=/i,
          /onerror=/i,
        ];

        if (maliciousPatterns.some(pattern => pattern.test(fileContent))) {
          return NextResponse.json(
            { error: `Potentially malicious content in ${file.name}` },
            { status: 400 }
          );
        }
      }

      return null;
    } catch (error) {
      return NextResponse.json(
        { error: "File validation failed" },
        { status: 400 }
      );
    }
  };
}
```

### 11. Weak Password Policy Documentation 🟡 **MEDIUM**
**File:** `.env.example`

**Vulnerability:**
- No strong password requirements documented
- Missing MFA requirements
- No password complexity guidelines

**Remediation:**
```bash
# Add to .env.example:
# ============================================
# Security Requirements
# ============================================
# Admin password requirements:
# - Minimum 16 characters
# - Include uppercase, lowercase, numbers, and special characters
# - Rotate every 90 days
# - Use MFA when available

# JWT secrets must be:
# - Minimum 32 characters for JWT_SECRET
# - Minimum 16 characters for CSRF_SECRET
# - Rotated every 180 days
# - Stored securely in production
```

### 12. Insufficient Logging and Monitoring 🟡 **MEDIUM**
**Multiple Files:** API routes

**Vulnerability:**
- Limited security event logging
- No intrusion detection
- Missing audit trails

**Remediation:**
```typescript
// Implement security logging
interface SecurityEvent {
  type: 'auth_failure' | 'rate_limit' | 'suspicious_request' | 'privilege_escalation';
  ip: string;
  userAgent?: string;
  path: string;
  timestamp: string;
  details: Record<string, any>;
}

export async function logSecurityEvent(event: SecurityEvent) {
  // Log to secure system
  console.warn('[SECURITY]', JSON.stringify(event));

  // In production, send to SIEM
  if (process.env.NODE_ENV === 'production') {
    await fetch(process.env.SECURITY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  }
}

// Usage in admin login
if (provided !== expected) {
  await logSecurityEvent({
    type: 'auth_failure',
    ip: getClientIP(req),
    path: '/admin/login/submit',
    timestamp: new Date().toISOString(),
    details: { reason: 'invalid_admin_key' },
  });

  return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 });
}
```

## Recommendations Summary

### Immediate Actions (Next 24 hours)
1. **Change the admin authentication system** - Implement the secure authentication pattern shown above
2. **Remove all disabled API routes** - Delete the entire `/app/api/_*_disabled/` directories
3. **Rotate all secrets and keys** - Generate new JWT_SECRET, CSRF_SECRET, and ADMIN_DASHBOARD_KEY

### Short-term Actions (Next 7 days)
1. Implement Redis-based rate limiting
2. Add comprehensive input sanitization
3. Enhance file upload validation
4. Implement proper CORS configuration
5. Add security headers middleware

### Long-term Actions (Next 30 days)
1. Implement proper session management
2. Add comprehensive security logging
3. Set up automated security scanning
4. Implement Content Security Policy (CSP)
5. Add Web Application Firewall (WAF)

### Security Best Practices to Implement
1. **Regular security audits** - Quarterly assessments
2. **Dependency scanning** - Automated vulnerability scanning
3. **Penetration testing** - Annual professional assessment
4. **Security training** - Team awareness and best practices
5. **Incident response plan** - Clear procedures for security events

## Compliance Notes

- **PCI DSS**: Ensure payment processing follows PCI compliance if storing card data
- **PIPEDA**: Canadian privacy law compliance for customer data
- **GDPR**: If serving EU customers, ensure GDPR compliance

## Conclusion

The PG Closets website has several critical security vulnerabilities that require immediate attention. The admin authentication system poses the highest risk and should be addressed immediately. While the application does implement some security measures like input validation and rate limiting, these need to be enhanced and consistently applied across all endpoints.

By implementing the recommendations provided, the security posture can be significantly improved, protecting both the business and customer data from potential breaches.

---

**Report Generated By:** Claude Security Assessment
**Next Review Date:** January 19, 2026