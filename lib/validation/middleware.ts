import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import type { z } from "zod";
import { sanitizeHeaders, sanitizeIP } from "./sanitization";

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, value] of entries) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const ip = getClientIP(request);
    const key = `rate_limit:${ip}`;
    const now = Date.now();

    const current = rateLimitStore.get(key);

    if (!current || now > current.resetTime) {
      // New window or expired window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return null; // Allow request
    }

    if (current.count >= config.maxRequests) {
      return NextResponse.json(
        {
          error: "Too many requests",
          retryAfter: Math.ceil((current.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((current.resetTime - now) / 1000).toString(),
            "X-RateLimit-Limit": config.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(current.resetTime).toISOString(),
          },
        }
      );
    }

    // Increment counter
    current.count += 1;
    rateLimitStore.set(key, current);

    return null; // Allow request
  };
}

/**
 * Input validation middleware
 */
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return async (request: NextRequest): Promise<{
    data: T;
    error?: NextResponse;
  }> => {
    try {
      let input: any;
      const contentType = request.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        input = await request.json();
      } else if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        input = {};
        const entries = Array.from(formData.entries());
        for (const [key, value] of entries) {
          if (value instanceof File) {
            input[key] = {
              name: value.name,
              type: value.type,
              size: value.size,
              file: value,
            };
          } else {
            input[key] = value;
          }
        }
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        input = Object.fromEntries(Array.from(formData.entries()));
      } else {
        // For GET requests, validate query parameters
        const url = new URL(request.url);
        input = Object.fromEntries(url.searchParams.entries());
      }

      // Validate with schema
      const result = schema.safeParse(input);

      if (!result.success) {
        const errorMessages = result.error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return {
          data: null as any,
          error: NextResponse.json(
            {
              error: "Validation failed",
              details: errorMessages,
            },
            { status: 400 }
          ),
        };
      }

      return { data: result.data };
    } catch (error) {
      return {
        data: null as any,
        error: NextResponse.json(
          {
            error: "Invalid request format",
            details: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 400 }
        ),
      };
    }
  };
}

/**
 * Security headers middleware
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS attacks
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy
  const cspNonce = crypto.randomUUID();
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${cspNonce}' 'strict-dynamic'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ")
  );

  return response;
}

/**
 * Request logging middleware
 */
export function logRequest(request: NextRequest): void {
  const timestamp = new Date().toISOString();
  const method = request.method;
  const url = request.url;
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referer = request.headers.get("referer") || "none";

  // Sanitize sensitive information
  const sanitizedHeaders = sanitizeHeaders(request.headers);

  console.log(
    JSON.stringify({
      timestamp,
      method,
      url: url.replace(/([?&])(password|token|key)=[^&]*/, "$1$2=***"),
      ip: sanitizeIP(ip),
      userAgent: userAgent.substring(0, 200), // Limit length
      referer,
      headers: sanitizedHeaders,
    })
  );
}

/**
 * Extract client IP address
 */
function getClientIP(request: NextRequest): string {
  // Check for forwarded headers (common with reverse proxies)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP.trim();
  }

  // Fallback to remote address
  return request.headers.get("x-forwarded-for") || "unknown";
}

/**
 * File upload validation middleware
 */
export function validateFileUpload(options: {
  maxSize: number;
  allowedTypes: string[];
  maxFiles?: number;
}) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      const formData = await request.formData();
      const files: File[] = [];

      // Collect all files
      const entries = Array.from(formData.entries());
      for (const [key, value] of entries) {
        if (value instanceof File) {
          files.push(value);
        }
      }

      // Check file count
      if (options.maxFiles && files.length > options.maxFiles) {
        return NextResponse.json(
          {
            error: `Too many files. Maximum allowed: ${options.maxFiles}`,
          },
          { status: 400 }
        );
      }

      // Validate each file
      for (const file of files) {
        // Check file size
        if (file.size > options.maxSize) {
          return NextResponse.json(
            {
              error: `File "${file.name}" is too large. Maximum size: ${
                options.maxSize / 1024 / 1024
              }MB`,
            },
            { status: 400 }
          );
        }

        // Check file type
        if (!options.allowedTypes.includes(file.type)) {
          return NextResponse.json(
            {
              error: `File "${file.name}" has invalid type. Allowed types: ${options.allowedTypes.join(
                ", "
              )}`,
            },
            { status: 400 }
          );
        }

        // Check for malicious file extensions
        const fileName = file.name.toLowerCase();
        const dangerousExtensions = [
          ".exe",
          ".bat",
          ".cmd",
          ".scr",
          ".pif",
          ".vbs",
          ".js",
          ".jar",
          ".sh",
          ".php",
          ".asp",
          ".jsp",
        ];

        if (dangerousExtensions.some((ext) => fileName.endsWith(ext))) {
          return NextResponse.json(
            {
              error: `File "${file.name}" has a potentially dangerous extension`,
            },
            { status: 400 }
          );
        }

        // Verify file content matches extension
        const expectedMimeTypes: Record<string, string[]> = {
          ".jpg": ["image/jpeg"],
          ".jpeg": ["image/jpeg"],
          ".png": ["image/png"],
          ".gif": ["image/gif"],
          ".webp": ["image/webp"],
          ".pdf": ["application/pdf"],
        };

        const fileExtension = fileName.substring(fileName.lastIndexOf("."));
        const expectedTypes = expectedMimeTypes[fileExtension];

        if (expectedTypes && !expectedTypes.includes(file.type)) {
          return NextResponse.json(
            {
              error: `File "${file.name}" content doesn't match its extension`,
            },
            { status: 400 }
          );
        }
      }

      return null; // All files are valid
    } catch (error) {
      return NextResponse.json(
        {
          error: "Failed to validate file upload",
        },
        { status: 400 }
      );
    }
  };
}

/**
 * Compose multiple middleware functions
 */
export function composeMiddleware(
  ...middlewares: Array<(request: NextRequest) => Promise<NextResponse | null>>
) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    for (const middleware of middlewares) {
      const result = await middleware(request);
      if (result) {
        return result; // Stop and return error response
      }
    }
    return null; // All middleware passed
  };
}

/**
 * Create a protected API route with validation and security
 */
export function createProtectedRoute<T>(
  schema: z.ZodSchema<T>,
  handler: (request: NextRequest, data: T) => Promise<NextResponse>,
  options: {
    rateLimit?: RateLimitConfig;
    requireAuth?: boolean;
    logRequests?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Log request if enabled
      if (options.logRequests !== false) {
        logRequest(request);
      }

      // Apply rate limiting
      if (options.rateLimit) {
        const rateLimitResult = await rateLimit(options.rateLimit)(request);
        if (rateLimitResult) {
          return addSecurityHeaders(rateLimitResult);
        }
      }

      // Validate input
      const { data, error } = await validateInput(schema)(request);
      if (error) {
        return addSecurityHeaders(error);
      }

      // Check authentication if required
      if (options.requireAuth) {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return addSecurityHeaders(
            NextResponse.json(
              { error: "Authorization required" },
              { status: 401 }
            )
          );
        }
        // Add your JWT validation logic here
      }

      // Call the actual handler
      const response = await handler(request, data);

      // Add security headers
      return addSecurityHeaders(response);
    } catch (error) {
      console.error("API route error:", error);
      return addSecurityHeaders(
        NextResponse.json(
          { error: "Internal server error" },
          { status: 500 }
        )
      );
    }
  };
}

// Common rate limiting configurations
export const rateLimitConfigs = {
  standard: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  strict: { windowMs: 15 * 60 * 1000, maxRequests: 20 }, // 20 requests per 15 minutes
  upload: { windowMs: 60 * 60 * 1000, maxRequests: 10 }, // 10 uploads per hour
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 auth attempts per 15 minutes
} as const;