# PG Closets Security Implementation

## 🔒 Security Overview

This document outlines the comprehensive security measures implemented in the PG Closets application to protect against common web vulnerabilities and ensure data protection.

## ✅ Security Features Implemented

### 1. Authentication & Authorization

#### JWT-Based Session Management
- **Secure Token Generation**: Using `jose` library with HS256 algorithm
- **Token Expiration**: 7-day expiration with automatic refresh
- **Secure Cookie Storage**: HttpOnly, Secure, SameSite=Strict cookies
- **Role-Based Access Control**: Admin and user roles with proper authorization checks

#### Admin Protection
- **Admin Routes Protected**: All `/admin/*` and `/api/admin/*` routes require admin authentication
- **File Upload Security**: Upload endpoints require authentication
- **File Deletion Security**: Delete operations require admin privileges

### 2. CSRF Protection

#### Token-Based CSRF Protection
- **CSRF Token Generation**: Cryptographically secure random tokens
- **Token Validation**: HMAC-based token verification
- **Automatic Cookie Management**: Secure CSRF cookie handling
- **Form Integration**: React components with automatic CSRF token inclusion

#### Implementation
```typescript
// Automatic CSRF protection in forms
<CSRFForm onSubmit={handleSubmit}>
  {/* Form content */}
</CSRFForm>

// Secure buttons with CSRF protection
<SecureButton onClick={handleAction} requireAdmin>
  Delete File
</SecureButton>
```

### 3. XSS Protection

#### Comprehensive Input Sanitization
- **HTML Sanitization**: Using DOMPurify with configurable modes
- **Input Validation**: All user inputs sanitized before processing
- **Output Encoding**: HTML entities escaped for safe display
- **File Content Validation**: Text files scanned for malicious content

#### Sanitization Modes
- **Strict Mode**: Removes all HTML tags
- **Basic Mode**: Allows safe formatting tags
- **Rich Text Mode**: Supports rich text formatting
- **Comment Mode**: Allows links with security attributes

### 4. Security Headers

#### Content Security Policy (CSP)
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.vercel.com https://www.google-analytics.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

#### Additional Security Headers
- **X-Frame-Options**: DENY (prevents clickjacking)
- **X-Content-Type-Options**: nosniff (prevents MIME sniffing)
- **X-XSS-Protection**: 1; mode=block (legacy XSS protection)
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Restricts access to browser features
- **Strict-Transport-Security**: Enforces HTTPS connections

### 5. Rate Limiting

#### Request Rate Limiting
- **General Endpoints**: 100 requests per 15 minutes per IP
- **Upload Endpoints**: 10 uploads per minute per IP
- **Delete Endpoints**: 5 deletions per minute per IP
- **Login Attempts**: Protected against brute force attacks

#### Implementation
```typescript
// Automatic rate limiting in middleware
const rateLimit = RateLimiter.check(`upload:${ip}`, 10, 60 * 1000)
if (!rateLimit.allowed) {
  return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
}
```

### 6. Input Validation & Sanitization

#### Comprehensive Validation
- **Schema Validation**: Using Zod for type-safe input validation
- **File Upload Validation**: Type, size, and content validation
- **URL Validation**: Protocol and domain restrictions
- **Email Validation**: Format and security validation

#### Security Utilities
```typescript
// Input sanitization
const sanitizedInput = InputValidator.sanitizeString(userInput)

// File validation
const validation = InputValidator.validateFileUpload(file)

// XSS protection
const safeHTML = XSSProtection.sanitizeHTML(content, 'basic')
```

### 7. Secure File Handling

#### Upload Security
- **File Type Validation**: Only allowed image types accepted
- **File Size Limits**: 10MB maximum file size
- **Filename Sanitization**: Secure filename generation
- **Content Scanning**: Text files scanned for malicious content
- **Secure Storage**: Files stored with unique identifiers

#### Delete Security
- **Admin-Only Access**: File deletion requires admin privileges
- **URL Validation**: Only Vercel Blob URLs accepted
- **Audit Logging**: All file operations logged for security monitoring

### 8. Environment Security

#### Secure Configuration
- **Environment Variables**: All sensitive data in environment variables
- **Secret Management**: JWT and CSRF secrets properly configured
- **API Key Security**: All third-party API keys in environment variables
- **Database Security**: Connection strings secured

#### Required Environment Variables
```env
# Security (CRITICAL: Change these in production)
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
CSRF_SECRET=your_super_secret_csrf_key_minimum_32_characters
NEXTAUTH_SECRET=your_nextauth_secret_minimum_32_characters

# File Upload Security
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

## 🛡️ Security Middleware

### Request Processing Pipeline
1. **Rate Limiting**: Check request rate limits per IP
2. **Authentication**: Validate JWT tokens for protected routes
3. **CSRF Validation**: Verify CSRF tokens for state-changing operations
4. **Input Sanitization**: Sanitize all user inputs
5. **Security Headers**: Add comprehensive security headers
6. **Audit Logging**: Log security events for monitoring

### Protected Routes
- `/admin/*` - Admin interface (requires admin authentication)
- `/api/admin/*` - Admin API endpoints (requires admin authentication)
- `/api/upload` - File upload (requires authentication)
- `/api/delete` - File deletion (requires admin authentication)
- `/upload` - Upload interface (requires authentication)
- `/files` - File management (requires authentication)

## 🔐 Authentication System

### Default Admin Account
For demonstration purposes, a default admin account is available:
- **Email**: admin@pgclosets.com
- **Password**: admin123!

**⚠️ SECURITY WARNING**: Change these credentials immediately in production!

### Session Management
- **Token Storage**: Secure HTTP-only cookies
- **Token Refresh**: Automatic token refresh for active sessions
- **Logout Security**: Complete session cleanup on logout
- **Cross-Tab Sync**: Session state synchronized across browser tabs

## 📋 Security Checklist

### ✅ Implemented
- [x] Authentication middleware for admin routes
- [x] CSRF protection for all forms and state-changing operations
- [x] XSS protection with input sanitization and output encoding
- [x] Comprehensive security headers including CSP
- [x] Rate limiting for all API endpoints
- [x] Secure file upload with validation and sanitization
- [x] Admin-only file deletion with audit logging
- [x] Environment variable security configuration
- [x] Input validation with schema validation
- [x] Audit logging for security events

### 🔄 Ongoing Security Measures
- [ ] Regular security audits and penetration testing
- [ ] Dependency vulnerability scanning
- [ ] Security monitoring and alerting
- [ ] SSL/TLS certificate management
- [ ] Database security hardening
- [ ] Regular password policy updates

## 🚨 Security Incident Response

### Monitoring
All security events are logged with the following information:
- **Event Type**: LOGIN_FAILED, FILE_UPLOAD, FILE_DELETE, etc.
- **User Context**: User ID, email, role
- **Request Context**: IP address, User-Agent, timestamp
- **Action Details**: Specific action attempted and result

### Incident Types
1. **Failed Authentication Attempts**: Monitor for brute force attacks
2. **Unauthorized Access Attempts**: Track access to protected resources
3. **File Operation Anomalies**: Monitor unusual file upload/deletion patterns
4. **Rate Limit Violations**: Identify potential DoS attacks
5. **Input Validation Failures**: Detect potential injection attempts

## 🔧 Development Security Guidelines

### Secure Coding Practices
1. **Always Validate Input**: Use schema validation for all user inputs
2. **Sanitize Output**: Escape or sanitize all data before rendering
3. **Use Security Components**: Utilize provided security components (CSRFForm, SecureButton)
4. **Check Authentication**: Always verify authentication for protected operations
5. **Log Security Events**: Log all security-relevant actions for monitoring

### Testing Security
```bash
# Run security tests
npm run test:security

# Check for vulnerabilities
npm audit

# Analyze bundle for security issues
npm run analyze:security
```

## 📞 Security Support

For security-related questions or to report vulnerabilities:
- **Security Team**: security@pgclosets.com
- **Emergency Contact**: +1-613-XXX-XXXX
- **Documentation**: Refer to this SECURITY.md file

## 🔄 Security Updates

This security implementation should be reviewed and updated regularly:
- **Monthly**: Review access logs and security events
- **Quarterly**: Update dependencies and security patches
- **Annually**: Comprehensive security audit and penetration testing

---

**Last Updated**: January 2025
**Security Implementation Version**: 1.0
**Next Review Date**: April 2025