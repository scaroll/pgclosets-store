import DOMPurify from "isomorphic-dompurify"

/**
 * Comprehensive XSS protection utilities
 */

// HTML sanitization options
const SANITIZE_OPTIONS = {
  // Strict mode - removes all HTML tags
  strict: {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  // Basic mode - allows safe formatting tags
  basic: {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  },
  // Rich text mode - allows more formatting
  richText: {
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "em", "strong", "u", "ol", "ul", "li",
      "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "code", "pre"
    ],
    ALLOWED_ATTR: ["class"],
    KEEP_CONTENT: true,
  },
  // Comment mode - for user comments with links
  comment: {
    ALLOWED_TAGS: ["p", "br", "b", "i", "em", "strong", "a"],
    ALLOWED_ATTR: ["href", "target", "rel"],
    ALLOWED_URI_REGEXP: /^https?:\/\//,
    ADD_ATTR: { target: "_blank", rel: "noopener noreferrer" },
    KEEP_CONTENT: true,
  }
}

export class XSSProtection {
  /**
   * Sanitize HTML content using DOMPurify
   */
  static sanitizeHTML(
    input: string,
    mode: keyof typeof SANITIZE_OPTIONS = "strict"
  ): string {
    if (!input || typeof input !== "string") {
      return ""
    }

    try {
      return DOMPurify.sanitize(input, SANITIZE_OPTIONS[mode])
    } catch (error) {
      console.error("HTML sanitization failed:", error)
      return ""
    }
  }

  /**
   * Escape HTML characters for safe display
   */
  static escapeHTML(input: string): string {
    if (!input || typeof input !== "string") {
      return ""
    }

    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
  }

  /**
   * Sanitize user input for database storage
   */
  static sanitizeUserInput(input: string): string {
    if (!input || typeof input !== "string") {
      return ""
    }

    // Remove null bytes and control characters
    let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, " ").trim()

    // Remove potentially dangerous patterns
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /on\w+\s*=/gi, // Event handlers like onclick=
    ]

    dangerousPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, "")
    })

    return sanitized
  }

  /**
   * Validate and sanitize URL input
   */
  static sanitizeURL(input: string): string {
    if (!input || typeof input !== "string") {
      return ""
    }

    try {
      // Remove dangerous protocols
      const dangerousProtocols = [
        "javascript:",
        "vbscript:",
        "data:",
        "file:",
        "ftp:",
      ]

      let sanitized = input.trim()

      dangerousProtocols.forEach(protocol => {
        if (sanitized.toLowerCase().startsWith(protocol)) {
          sanitized = ""
        }
      })

      // Validate URL format if not empty
      if (sanitized) {
        // Add https:// if no protocol specified
        if (!/^https?:\/\//i.test(sanitized)) {
          sanitized = `https://${sanitized}`
        }

        // Validate URL format
        new URL(sanitized)
      }

      return sanitized
    } catch (error) {
      console.warn("Invalid URL provided:", input)
      return ""
    }
  }

  /**
   * Sanitize email input
   */
  static sanitizeEmail(input: string): string {
    if (!input || typeof input !== "string") {
      return ""
    }

    // Basic email format validation and sanitization
    let sanitized = input.toLowerCase().trim()

    // Remove any HTML entities
    sanitized = this.escapeHTML(sanitized)

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitized)) {
      return ""
    }

    return sanitized
  }

  /**
   * Sanitize phone number input
   */
  static sanitizePhoneNumber(input: string): string {
    if (!input || typeof input !== "string") {
      return ""
    }

    // Remove all non-digit characters except + - ( ) and spaces
    let sanitized = input.replace(/[^\d+\-() ]/g, "")

    // Normalize spacing
    sanitized = sanitized.trim()

    return sanitized
  }

  /**
   * Sanitize text content (for names, descriptions, etc.)
   */
  static sanitizeText(input: string, maxLength: number = 1000): string {
    if (!input || typeof input !== "string") {
      return ""
    }

    let sanitized = this.sanitizeUserInput(input)

    // Truncate if too long
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength)
    }

    return sanitized
  }

  /**
   * Sanitize JSON data recursively
   */
  static sanitizeJSON(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj
    }

    if (typeof obj === "string") {
      return this.sanitizeUserInput(obj)
    }

    if (typeof obj === "number" || typeof obj === "boolean") {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeJSON(item))
    }

    if (typeof obj === "object") {
      const sanitized: any = {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          // Sanitize key names too
          const sanitizedKey = this.sanitizeUserInput(key)
          sanitized[sanitizedKey] = this.sanitizeJSON(obj[key])
        }
      }
      return sanitized
    }

    return obj
  }

  /**
   * Content Security Policy nonce generator
   */
  static generateCSPNonce(): string {
    const crypto = require("crypto")
    return crypto.randomBytes(16).toString("base64")
  }

  /**
   * Validate file upload content for XSS
   */
  static validateFileContent(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      // Only validate text-based files
      if (!file.type.startsWith("text/") &&
          !file.type.includes("javascript") &&
          !file.type.includes("html")) {
        resolve(true)
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        if (!content) {
          resolve(true)
          return
        }

        // Check for dangerous patterns
        const dangerousPatterns = [
          /<script/gi,
          /javascript:/gi,
          /vbscript:/gi,
          /on\w+\s*=/gi,
          /<iframe/gi,
          /<object/gi,
          /<embed/gi,
        ]

        const hasDangerousContent = dangerousPatterns.some(pattern =>
          pattern.test(content)
        )

        resolve(!hasDangerousContent)
      }

      reader.onerror = () => resolve(false)
      reader.readAsText(file.slice(0, 10000)) // Only read first 10KB
    })
  }
}

// Export common sanitization functions for convenience
export const {
  sanitizeHTML,
  escapeHTML,
  sanitizeUserInput,
  sanitizeURL,
  sanitizeEmail,
  sanitizePhoneNumber,
  sanitizeText,
  sanitizeJSON,
} = XSSProtection

// React hook for XSS protection
export function useXSSProtection() {
  return {
    sanitizeHTML: XSSProtection.sanitizeHTML,
    escapeHTML: XSSProtection.escapeHTML,
    sanitizeUserInput: XSSProtection.sanitizeUserInput,
    sanitizeURL: XSSProtection.sanitizeURL,
    sanitizeEmail: XSSProtection.sanitizeEmail,
    sanitizePhoneNumber: XSSProtection.sanitizePhoneNumber,
    sanitizeText: XSSProtection.sanitizeText,
    sanitizeJSON: XSSProtection.sanitizeJSON,
  }
}

export default XSSProtection