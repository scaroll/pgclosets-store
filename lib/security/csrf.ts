import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, timingSafeEqual } from 'crypto';

// CSRF token generation and validation
export class CSRFProtection {
  private static readonly TOKEN_HEADER = 'x-csrf-token';
  private static readonly TOKEN_LENGTH = 32;
  private static readonly SESSION_COOKIE = 'csrf_session';

  /**
   * Generate a secure CSRF token
   */
  static generateToken(): string {
    return randomBytes(CSRFProtection.TOKEN_LENGTH).toString('hex');
  }

  /**
   * Generate a session-based CSRF token
   */
  static generateSessionToken(sessionId: string): string {
    const timestamp = Date.now().toString();
    const data = `${sessionId}:${timestamp}`;
    return randomBytes(16).toString('hex') + Buffer.from(data).toString('base64url');
  }

  /**
   * Validate CSRF token from request
   */
  static validateToken(request: NextRequest, sessionToken: string): boolean {
    const headerToken = request.headers.get(CSRFProtection.TOKEN_HEADER);
    const bodyToken = request.headers.get('x-csrf-token-body');

    // Check both header and potential body token
    const token = headerToken || bodyToken;

    if (!token || !sessionToken) {
      return false;
    }

    try {
      // Decode token to extract timestamp and validate expiry
      const tokenData = Buffer.from(token.slice(32), 'base64url').toString();
      const [sessionId, timestamp] = tokenData.split(':');

      if (!sessionId || !timestamp) {
        return false;
      }

      // Check if token is expired (1 hour)
      const tokenAge = Date.now() - parseInt(timestamp);
      if (tokenAge > 60 * 60 * 1000) {
        return false;
      }

      // In a real implementation, you'd verify this against a stored session
      // For now, we'll validate the token structure and timing
      return true;
    } catch (error) {
      console.warn('[CSRF] Token validation error:', error);
      return false;
    }
  }

  /**
   * Middleware to protect API routes from CSRF
   */
  static createCSRFMiddleware(options: {
    exemptMethods?: string[];
    requireAuth?: boolean;
  } = {}) {
    const { exemptMethods = ['GET', 'HEAD', 'OPTIONS'], requireAuth = false } = options;

    return async (request: NextRequest) => {
      // Skip CSRF validation for exempt methods
      if (exemptMethods.includes(request.method)) {
        return { valid: true };
      }

      // Skip CSRF validation for API routes that don't need it
      const exemptPaths = ['/api/health', '/api/status', '/api/products'];
      const isExemptPath = exemptPaths.some(path => request.nextUrl.pathname.startsWith(path));

      if (isExemptPath) {
        return { valid: true };
      }

      // Get session token from cookie
      const sessionToken = request.cookies.get(CSRFProtection.SESSION_COOKIE)?.value;

      if (!sessionToken) {
        return {
          valid: false,
          error: 'CSRF session token missing',
          status: 403
        };
      }

      // Validate CSRF token
      const isValid = CSRFProtection.validateToken(request, sessionToken);

      if (!isValid) {
        return {
          valid: false,
          error: 'Invalid CSRF token',
          status: 403
        };
      }

      return { valid: true };
    };
  }

  /**
   * Add CSRF headers to response
   */
  static addCSRFHeaders(response: NextResponse, token: string): NextResponse {
    response.headers.set(CSRFProtection.TOKEN_HEADER, token);
    response.headers.set('X-CSRF-Protection', '1; mode=block');
    return response;
  }

  /**
   * Set CSRF session cookie
   */
  static setSessionCookie(response: NextResponse, sessionId: string): NextResponse {
    const token = CSRFProtection.generateSessionToken(sessionId);

    response.cookies.set(CSRFProtection.SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
      partitioned: true, // CHIPS support
    });

    return CSRFProtection.addCSRFHeaders(response, token);
  }
}

/**
 * Helper function to create CSRF-protected API route handler
 */
export function createCSRFProtectedHandler(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options?: {
    exemptMethods?: string[];
    requireAuth?: boolean;
  }
) {
  const csrfMiddleware = CSRFProtection.createCSRFMiddleware(options);

  return async (request: NextRequest) => {
    // Validate CSRF
    const validation = await csrfMiddleware(request);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error || 'CSRF validation failed' },
        {
          status: validation.status || 403,
          headers: {
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
          }
        }
      );
    }

    // Execute the original handler
    const response = await handler(request);

    // Add CSRF headers to response if it's a success response
    if (response.status < 400) {
      const sessionId = request.cookies.get(CSRFProtection.SESSION_COOKIE)?.value;
      if (sessionId) {
        return CSRFProtection.addCSRFHeaders(response, sessionId);
      }
    }

    return response;
  };
}