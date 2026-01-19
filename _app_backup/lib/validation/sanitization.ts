/**
 * Sanitization utilities to prevent injection attacks
 */

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize string for safe use
 */
export function sanitizeString(input: string, maxLength: number = 10000): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';

  return email
    .toLowerCase()
    .trim()
    .slice(0, 254); // Max email length per RFC 5321
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return '';

  // Keep only digits, spaces, hyphens, parentheses, and plus sign
  return phone
    .replace(/[^\d\s\-\(\)\+]/g, '')
    .trim()
    .slice(0, 20);
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';

  const trimmed = url.trim();

  // Only allow http, https, and relative URLs
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed.slice(0, 2048); // Max URL length
  }

  return '';
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';

  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 255);
}

/**
 * Sanitize an object recursively
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Sanitize an object using a preset configuration
 */
export function sanitizeWithPreset<T extends Record<string, any>>(
  obj: T,
  preset: Record<string, any>
): T {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const sanitizationType = preset[key];

    if (!sanitizationType) {
      // If no preset defined for this field, use default sanitization
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
      continue;
    }

    // Handle nested objects
    if (typeof sanitizationType === 'object' && !Array.isArray(sanitizationType)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeWithPreset(value, sanitizationType);
      } else {
        sanitized[key] = value;
      }
      continue;
    }

    // Apply specific sanitization based on type
    if (typeof value === 'string') {
      switch (sanitizationType) {
        case 'string':
          sanitized[key] = sanitizeString(value);
          break;
        case 'email':
          sanitized[key] = sanitizeEmail(value);
          break;
        case 'phone':
          sanitized[key] = sanitizePhone(value);
          break;
        case 'url':
          sanitized[key] = sanitizeUrl(value);
          break;
        case 'html':
          sanitized[key] = sanitizeHtml(value);
          break;
        case 'filename':
          sanitized[key] = sanitizeFilename(value);
          break;
        default:
          sanitized[key] = sanitizeString(value);
      }
    } else if (sanitizationType === 'number' && typeof value === 'number') {
      sanitized[key] = value;
    } else if (sanitizationType === 'object' && typeof value === 'object') {
      sanitized[key] = value;
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Check for SQL injection patterns
 */
export function hasSqlInjection(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /UNION(\s|\+)+SELECT/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Check for XSS patterns
 */
export function hasXssPatterns(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /data:/gi,
    /vbscript:/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Safe JSON parse with validation
 */
export function safeJsonParse<T>(input: string, fallback: T): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    return fallback;
  }
}

/**
 * Preset sanitization configurations
 */
export const sanitizationPresets = {
  text: (input: string) => sanitizeString(input, 10000),
  email: sanitizeEmail,
  phone: sanitizePhone,
  url: sanitizeUrl,
  filename: sanitizeFilename,
  html: sanitizeHtml,
  strict: (input: string) => sanitizeString(stripHtml(input), 1000),

  // Quote request sanitization preset
  quoteRequest: {
    customer: {
      name: 'string',
      email: 'email',
      phone: 'phone',
      province: 'string',
    },
    product: {
      name: 'string',
      category: 'string',
      price: 'number',
      selectedOptions: 'object',
    },
    notes: 'string',
  },
};
