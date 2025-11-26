import { NextRequest, NextResponse } from 'next/server';

/**
 * Security headers for API responses
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');

  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');

  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

/**
 * Validate request origin
 */
export function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');

  // Allow same-origin requests
  if (!origin) {
    return true;
  }

  // Allow requests from our domains
  const allowedOrigins = [
    'https://www.pgclosets.com',
    'https://pgclosets.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  // Also allow Vercel preview deployments
  if (origin.includes('.vercel.app') || origin.includes('vercel.live')) {
    return true;
  }

  return allowedOrigins.includes(origin) || origin === `https://${host}` || origin === `http://${host}`;
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 10000); // Limit length
}

/**
 * Validate API key if required
 */
export function validateApiKey(req: NextRequest, requiredKey?: string): boolean {
  if (!requiredKey) {
    return true;
  }

  const apiKey = req.headers.get('x-api-key') || req.headers.get('authorization')?.replace('Bearer ', '');

  return apiKey === requiredKey;
}

/**
 * Rate limit check (simple implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

/**
 * Get client IP from request
 */
export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    req.ip ||
    'unknown'
  );
}

/**
 * Log security event
 */
export function logSecurityEvent(event: {
  type: string;
  ip: string;
  path: string;
  details?: any;
}): void {
  console.log('[SECURITY]', JSON.stringify({
    timestamp: new Date().toISOString(),
    ...event,
  }));
}

/**
 * Create a secure handler with rate limiting and validation
 * Alias for withSecurity
 */
export function createSecureHandler(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options?: {
    rateLimit?: { maxRequests: number; windowMs: number };
    validateOrigin?: boolean;
  }
): (req: NextRequest) => Promise<NextResponse> {
  return withSecurity(handler);
}

/**
 * Security middleware wrapper
 */
export function withSecurity(
  handler: (req: NextRequest) => Promise<NextResponse>
): (req: NextRequest) => Promise<NextResponse> {
  return async (req: NextRequest) => {
    // Validate origin
    if (!validateOrigin(req)) {
      logSecurityEvent({
        type: 'ORIGIN_BLOCKED',
        ip: getClientIp(req),
        path: req.nextUrl.pathname,
        details: { origin: req.headers.get('origin') },
      });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Rate limiting
    const ip = getClientIp(req);
    const { allowed, remaining } = checkRateLimit(ip);

    if (!allowed) {
      logSecurityEvent({
        type: 'RATE_LIMITED',
        ip,
        path: req.nextUrl.pathname,
      });
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Execute handler
    const response = await handler(req);

    // Add security headers
    addSecurityHeaders(response);
    response.headers.set('X-RateLimit-Remaining', remaining.toString());

    return response;
  };
}
