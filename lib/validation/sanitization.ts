import * as DOMPurify from "isomorphic-dompurify";

/**
 * Input sanitization utilities for preventing XSS and other injection attacks
 */

// HTML sanitization for rich text content
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
  });
}

// Basic text sanitization - removes HTML tags and dangerous characters
export function sanitizeText(input: string): string {
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>'"&]/g, (match) => {
      const entityMap: Record<string, string> = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      };
      return entityMap[match] || match;
    })
    .trim();
}

// SQL injection prevention - escape single quotes and other dangerous characters
export function sanitizeForSQL(input: string): string {
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, "\\;") // Escape semicolons
    .replace(/--/g, "\\--") // Escape SQL comments
    .replace(/\/\*/g, "\\/\\*") // Escape block comments
    .replace(/\*\//g, "\\*\\/")
    .trim();
}

// File name sanitization
export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_") // Replace special chars with underscore
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single
    .replace(/^_+|_+$/g, "") // Remove leading/trailing underscores
    .toLowerCase();
}

// Email sanitization
export function sanitizeEmail(email: string): string {
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, ""); // Keep only valid email characters
}

// URL sanitization
export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid protocol");
    }
    return parsedUrl.toString();
  } catch {
    return "";
  }
}

// Remove null bytes and control characters
export function removeControlCharacters(input: string): string {
  return input.replace(/[\x00-\x1F\x7F]/g, "");
}

// Postal code sanitization (Canadian format)
export function sanitizePostalCode(postalCode: string): string {
  return postalCode
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") // Remove all non-alphanumeric
    .replace(/^([A-Z]\d[A-Z])(\d[A-Z]\d)$/, "$1 $2"); // Add space if valid format
}

// Generic text input sanitization for form fields
export function sanitizeFormInput(input: string, maxLength: number = 1000): string {
  return removeControlCharacters(sanitizeText(input)).substring(0, maxLength);
}

// Deep sanitization for object properties
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  options: {
    preserveStructure?: boolean;
    sanitizers?: Partial<Record<string, (value: any) => any>>;
  } | Partial<Record<string, (value: any) => any>>
): T {
  // Handle backward compatibility
  const sanitizers = 'sanitizers' in options ? options.sanitizers : options;
  const preserveStructure = 'preserveStructure' in options ? options.preserveStructure : false;

  if (preserveStructure) {
    // Deep sanitization that preserves nested structure
    return deepSanitizeObject(obj);
  }

  // Original flat sanitization
  const sanitized = { ...obj };

  if (sanitizers) {
    for (const [key, sanitizer] of Object.entries(sanitizers)) {
      if (key in sanitized && sanitizer) {
        sanitized[key as keyof T] = sanitizer(sanitized[key as keyof T]);
      }
    }
  }

  return sanitized;
}

// Deep sanitization for nested objects
function deepSanitizeObject<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeFormInput(obj) as T : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepSanitizeObject(item)) as T;
  }

  const sanitized = {} as T;
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Apply appropriate sanitization based on key name
      if (key.toLowerCase().includes('email')) {
        (sanitized as any)[key] = sanitizeEmail(value);
      } else if (key.toLowerCase().includes('postalcode') || key.toLowerCase().includes('postal_code')) {
        (sanitized as any)[key] = sanitizePostalCode(value);
      } else {
        (sanitized as any)[key] = sanitizeFormInput(value);
      }
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as any)[key] = deepSanitizeObject(value);
    } else {
      (sanitized as any)[key] = value;
    }
  }

  return sanitized;
}

// Rate limiting helper - sanitize IP addresses
export function sanitizeIP(ip: string): string {
  // IPv4 and IPv6 validation
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}$/i;

  const cleaned = ip.trim();

  if (ipv4Regex.test(cleaned) || ipv6Regex.test(cleaned)) {
    return cleaned;
  }

  return "unknown";
}

// Content Security Policy helper
export function generateCSPNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64");
}

// Safe JSON parsing with sanitization
export function safeParsJSON<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(removeControlCharacters(json));
    return parsed;
  } catch {
    return fallback;
  }
}

// Header sanitization for logging and security
export function sanitizeHeaders(headers: Headers): Record<string, string> {
  const sanitized: Record<string, string> = {};
  const allowedHeaders = [
    "user-agent",
    "referer",
    "origin",
    "accept",
    "accept-language",
    "content-type",
    "content-length",
  ];

  const entries = Array.from(headers.entries());
  for (const [key, value] of entries) {
    if (allowedHeaders.includes(key.toLowerCase())) {
      sanitized[key] = sanitizeText(value);
    }
  }

  return sanitized;
}

// Sanitization presets for common use cases
export const sanitizationPresets = {
  contactForm: {
    firstName: (value: string) => sanitizeFormInput(value, 100),
    lastName: (value: string) => sanitizeFormInput(value, 100),
    email: sanitizeEmail,
    message: (value: string) => sanitizeFormInput(value, 2000),
  },
  quoteRequest: {
    "product.name": (value: string) => sanitizeFormInput(value, 200),
    "product.category": (value: string) => sanitizeFormInput(value, 100),
    "customer.name": (value: string) => sanitizeFormInput(value, 100),
    "customer.email": sanitizeEmail,
    "customer.province": (value: string) => value.toUpperCase().trim(),
    notes: (value: string) => sanitizeFormInput(value, 1000),
  },
  fileUpload: {
    filename: sanitizeFileName,
  },
} as const;