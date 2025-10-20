import { NextRequest, NextResponse } from 'next/server';
import { applySecurityHeaders, validateRequestSecurity } from './headers';
import { checkRateLimit, getClientIdentifier, generalRateLimiter } from '@/lib/rate-limit';

/**
 * Security audit and middleware for API routes
 */
export class SecurityAudit {
  private static auditLog: Array<{
    timestamp: string;
    ip: string;
    method: string;
    path: string;
    userAgent?: string;
    warnings: string[];
    riskScore: number;
  }> = [];

  /**
   * Perform security audit on request
   */
  static async auditRequest(request: NextRequest): Promise<{
    allowed: boolean;
    riskScore: number;
    warnings: string[];
    issues: string[];
  }> {
    const warnings: string[] = [];
    const issues: string[] = [];
    let riskScore = 0;

    // Basic security validation
    const validation = validateRequestSecurity(request);
    issues.push(...validation.issues);
    warnings.push(...validation.warnings);
    riskScore += issues.length * 10;
    riskScore += warnings.length * 5;

    // Check for suspicious patterns
    const ip = getClientIdentifier(request);
    const userAgent = request.headers.get('user-agent') || '';
    const path = request.nextUrl.pathname;

    // Suspicious User-Agent patterns
    if (!userAgent || userAgent.length < 10) {
      warnings.push('Suspicious or missing User-Agent');
      riskScore += 15;
    }

    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /scanner/i,
      /sqlmap/i,
      /nikto/i,
      /nmap/i,
      /curl/i,
      /wget/i,
      /python/i,
      /java/i,
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(userAgent))) {
      warnings.push('Automated tool detected');
      riskScore += 20;
    }

    // Path traversal attempts
    if (path.includes('../') || path.includes('..\\')) {
      issues.push('Path traversal attempt detected');
      riskScore += 50;
    }

    // SQL injection patterns in query params
    const searchParams = request.nextUrl.searchParams;
    const sqlInjectionPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
      /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
      /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    ];

    for (const [key, value] of searchParams) {
      if (sqlInjectionPatterns.some(pattern => pattern.test(value))) {
        issues.push(`SQL injection attempt detected in parameter: ${key}`);
        riskScore += 40;
      }
    }

    // XSS patterns in query params
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
    ];

    for (const [key, value] of searchParams) {
      if (xssPatterns.some(pattern => pattern.test(value))) {
        issues.push(`XSS attempt detected in parameter: ${key}`);
        riskScore += 35;
      }
    }

    // Large request body detection
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 10 * 1024 * 1024) { // 10MB
      warnings.push('Large request body detected');
      riskScore += 10;
    }

    // Rate limiting check
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
      const rateLimitResult = await checkRateLimit(ip, generalRateLimiter);
      if (!rateLimitResult.allowed) {
        issues.push('Rate limit exceeded');
        riskScore += 60;
      }
    }

    // Log audit entry
    this.auditLog.push({
      timestamp: new Date().toISOString(),
      ip,
      method: request.method,
      path,
      userAgent: userAgent.substring(0, 200),
      warnings,
      riskScore,
    });

    // Keep audit log size manageable
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-500);
    }

    // Determine if request should be blocked
    const allowed = riskScore < 100; // Block high-risk requests

    return {
      allowed,
      riskScore,
      warnings,
      issues,
    };
  }

  /**
   * Get recent audit logs
   */
  static getAuditLogs(limit = 50) {
    return this.auditLog.slice(-limit);
  }

  /**
   * Get security statistics
   */
  static getSecurityStats() {
    const recent = this.auditLog.slice(-100);
    const highRiskCount = recent.filter(entry => entry.riskScore >= 50).length;
    const blockedCount = recent.filter(entry => entry.riskScore >= 100).length;
    const uniqueIPs = new Set(recent.map(entry => entry.ip)).size;

    return {
      totalRequests: recent.length,
      highRiskRequests: highRiskCount,
      blockedRequests: blockedCount,
      uniqueIPs,
      averageRiskScore: recent.reduce((sum, entry) => sum + entry.riskScore, 0) / recent.length,
    };
  }
}

/**
 * Security middleware for API routes
 */
export function createSecurityMiddleware(options: {
  enableAudit?: boolean;
  enableRateLimiting?: boolean;
  riskThreshold?: number;
} = {}) {
  const {
    enableAudit = true,
    enableRateLimiting = true,
    riskThreshold = 100,
  } = options;

  return async (request: NextRequest) => {
    // Skip audit for health checks and static assets
    const exemptPaths = ['/api/health', '/api/status', '/_next/', '/favicon.ico'];
    const isExempt = exemptPaths.some(path => request.nextUrl.pathname.startsWith(path));

    if (isExempt) {
      return { allowed: true, riskScore: 0 };
    }

    // Perform security audit
    if (enableAudit) {
      const audit = await SecurityAudit.auditRequest(request);

      if (!audit.allowed || audit.riskScore >= riskThreshold) {
        return {
          allowed: false,
          reason: 'Security check failed',
          riskScore: audit.riskScore,
          issues: audit.issues,
        };
      }

      return {
        allowed: true,
        riskScore: audit.riskScore,
        warnings: audit.warnings,
      };
    }

    return { allowed: true, riskScore: 0 };
  };
}

/**
 * Create security-enhanced API route handler
 */
export function createSecureHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    enableAudit?: boolean;
    enableRateLimiting?: boolean;
    riskThreshold?: number;
    cors?: {
      allowedOrigins?: string[];
      allowedMethods?: string[];
      allowedHeaders?: string[];
    };
  } = {}
) {
  const securityMiddleware = createSecurityMiddleware(options);

  return async (request: NextRequest) => {
    try {
      // Apply security middleware
      const securityCheck = await securityMiddleware(request);

      if (!securityCheck.allowed) {
        const response = NextResponse.json(
          {
            error: securityCheck.reason || 'Request blocked by security policy',
            riskScore: securityCheck.riskScore,
            issues: securityCheck.issues || [],
          },
          { status: 403 }
        );

        return applySecurityHeaders(response);
      }

      // Execute the original handler
      const response = await handler(request);

      // Apply security headers to response
      return applySecurityHeaders(response);

    } catch (error) {
      console.error('Security middleware error:', error);

      // Return secure error response
      const response = NextResponse.json(
        {
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
        },
        { status: 500 }
      );

      return applySecurityHeaders(response);
    }
  };
}

/**
 * Content Security Policy violation reporter
 */
export async function reportCSPViolation(request: NextRequest) {
  try {
    const violation = await request.json();

    console.error('[CSP VIOLATION]', {
      directive: violation.violatedDirective,
      blockedURI: violation.blockedURI,
      documentURI: violation.documentURI,
      referrer: violation.referrer,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    });

    // Send to external monitoring if configured
    if (process.env.SECURITY_WEBHOOK_URL) {
      await fetch(process.env.SECURITY_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'csp_violation',
          severity: 'warning',
          violation,
          metadata: {
            ip: getClientIdentifier(request),
            userAgent: request.headers.get('user-agent'),
          },
          timestamp: new Date().toISOString(),
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to report CSP violation:', error);
    return NextResponse.json(
      { error: 'Failed to report violation' },
      { status: 500 }
    );
  }
}