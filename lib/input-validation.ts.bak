/**
 * Input Validation and Sanitization Utilities
 * Prevents XSS, SQL injection, and other input-based attacks
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';

  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .trim();
}

/**
 * Sanitize plain text input
 * Removes control characters and trims whitespace
 */
export function sanitizeText(input: string, maxLength?: number): string {
  if (typeof input !== 'string') return '';

  let sanitized = input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();

  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validate and sanitize product ID
 * Ensures product IDs follow expected format
 */
export function sanitizeProductId(id: string): string {
  if (typeof id !== 'string') {
    throw new Error('Product ID must be a string');
  }

  // Remove any non-alphanumeric characters except hyphens and underscores
  const sanitized = id.replace(/[^a-zA-Z0-9_-]/g, '');

  if (sanitized.length === 0) {
    throw new Error('Invalid product ID');
  }

  if (sanitized.length > 100) {
    throw new Error('Product ID too long');
  }

  return sanitized;
}

/**
 * Validate email address format
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    throw new Error('Email must be a string');
  }

  const sanitized = email.toLowerCase().trim();

  if (!validateEmail(sanitized)) {
    throw new Error('Invalid email format');
  }

  return sanitized;
}

/**
 * Validate phone number format
 * Accepts various formats: (613) 555-1234, 613-555-1234, 6135551234
 */
export function validatePhoneNumber(phone: string): boolean {
  if (typeof phone !== 'string') return false;

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Check if it's a valid North American phone number (10 or 11 digits)
  return digits.length === 10 || digits.length === 11;
}

/**
 * Sanitize phone number
 */
export function sanitizePhoneNumber(phone: string): string {
  if (typeof phone !== 'string') {
    throw new Error('Phone number must be a string');
  }

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  if (!validatePhoneNumber(phone)) {
    throw new Error('Invalid phone number format');
  }

  // Format as (XXX) XXX-XXXX for 10 digits
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // Format as +X (XXX) XXX-XXXX for 11 digits
  return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
}

/**
 * Validate date string format (YYYY-MM-DD)
 */
export function validateDateFormat(date: string): boolean {
  if (typeof date !== 'string') return false;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  // Check if it's a valid date
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
}

/**
 * Validate time string format (HH:MM in 24-hour format)
 */
export function validateTimeFormat(time: string): boolean {
  if (typeof time !== 'string') return false;

  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

/**
 * Sanitize search query
 * Prevents SQL injection and XSS in search queries
 */
export function sanitizeSearchQuery(query: string, maxLength: number = 200): string {
  if (typeof query !== 'string') return '';

  // Remove potentially dangerous characters
  let sanitized = query
    .replace(/[<>'"]/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();

  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value > 0 && isFinite(value);
}

/**
 * Validate non-negative number (allows zero)
 */
export function validateNonNegativeNumber(value: number): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= 0 && isFinite(value);
}

/**
 * Validate integer
 */
export function validateInteger(value: number): boolean {
  return typeof value === 'number' && Number.isInteger(value) && isFinite(value);
}

/**
 * Sanitize number input
 */
export function sanitizeNumber(value: unknown, min?: number, max?: number): number {
  const num = Number(value);

  if (isNaN(num) || !isFinite(num)) {
    throw new Error('Invalid number');
  }

  if (min !== undefined && num < min) {
    throw new Error(`Number must be at least ${min}`);
  }

  if (max !== undefined && num > max) {
    throw new Error(`Number must be at most ${max}`);
  }

  return num;
}

/**
 * Validate array length
 */
export function validateArrayLength<T>(
  arr: T[],
  minLength?: number,
  maxLength?: number
): boolean {
  if (!Array.isArray(arr)) return false;

  if (minLength !== undefined && arr.length < minLength) return false;
  if (maxLength !== undefined && arr.length > maxLength) return false;

  return true;
}

/**
 * Sanitize URL
 * Ensures URL is safe and follows expected protocols
 */
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') {
    throw new Error('URL must be a string');
  }

  const sanitized = url.trim();

  // Check for allowed protocols
  const allowedProtocols = ['http:', 'https:'];

  try {
    const parsedUrl = new URL(sanitized);
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      throw new Error('Invalid URL protocol');
    }
    return sanitized;
  } catch {
    throw new Error('Invalid URL format');
  }
}

/**
 * Check for SQL injection patterns
 * Returns true if suspicious patterns detected
 */
export function detectSqlInjection(input: string): boolean {
  if (typeof input !== 'string') return false;

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(UNION\s+SELECT)/i,
    /(--|\#|\/\*)/,
    /('\s*(OR|AND)\s*'?\d)/i,
    /(;\s*(DROP|DELETE|UPDATE))/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

/**
 * Check for XSS patterns
 * Returns true if suspicious patterns detected
 */
export function detectXss(input: string): boolean {
  if (typeof input !== 'string') return false;

  const xssPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/i,
    /<iframe[^>]*>[\s\S]*?<\/iframe>/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<img[^>]*onerror/i,
    /<svg[^>]*onload/i,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
}

/**
 * Comprehensive input validation
 * Throws error if input is suspicious
 */
export function validateInput(input: string, fieldName: string = 'Input'): void {
  if (typeof input !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  if (detectSqlInjection(input)) {
    throw new Error(`${fieldName} contains potentially malicious SQL patterns`);
  }

  if (detectXss(input)) {
    throw new Error(`${fieldName} contains potentially malicious XSS patterns`);
  }
}

/**
 * Sanitize object keys to prevent prototype pollution
 */
export function sanitizeObjectKeys<T extends Record<string, unknown>>(obj: T): T {
  const dangerous = ['__proto__', 'constructor', 'prototype'];

  const sanitized = Object.keys(obj).reduce((acc, key) => {
    if (!dangerous.includes(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Record<string, unknown>);

  return sanitized as T;
}

/**
 * Rate limit validation for arrays
 */
export function validateArraySize<T>(
  arr: T[],
  maxSize: number,
  itemName: string = 'items'
): void {
  if (!Array.isArray(arr)) {
    throw new Error(`Expected array of ${itemName}`);
  }

  if (arr.length > maxSize) {
    throw new Error(`Too many ${itemName}. Maximum allowed: ${maxSize}`);
  }
}
