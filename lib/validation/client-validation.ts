"use client";

import { z } from "zod";
import {
  emailSchema,
  nameSchema,
  postalCodeSchema,
  passwordSchema,
  fileUploadSchema,
} from "./schemas";

/**
 * Client-side validation utilities for enhanced UX
 * These complement server-side validation but never replace it
 * Uses central validation schemas from ./schemas.ts
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestions?: string[];
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: string) => ValidationResult;
}

/**
 * Real-time field validation class
 */
export class ClientValidator {
  private static commonErrors = {
    required: "This field is required",
    minLength: (min: number) => `Must be at least ${min} characters`,
    maxLength: (max: number) => `Must be no more than ${max} characters`,
    pattern: "Invalid format",
    email: "Please enter a valid email address",
    name: "Name can only contain letters, spaces, hyphens, and apostrophes",
    postalCode: "Please enter a valid Canadian postal code (e.g., K1A 0A6)",
  };

  /**
   * Validate email address with detailed feedback
   * Uses central emailSchema
   */
  static validateEmail(email: string): ValidationResult {
    try {
      emailSchema.parse(email);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const suggestions = [];

        // Common typos and suggestions
        if (!email.includes("@")) {
          suggestions.push("Email must contain an @ symbol");
        } else if (!email.includes(".")) {
          suggestions.push("Email must contain a domain extension (.com, .ca, etc.)");
        } else if (email.includes("..")) {
          suggestions.push("Remove double periods from email");
        } else if (email.startsWith(".") || email.endsWith(".")) {
          suggestions.push("Email cannot start or end with a period");
        }

        return {
          isValid: false,
          error: error.errors[0]?.message || this.commonErrors.email,
          suggestions,
        };
      }
      return { isValid: false, error: this.commonErrors.email };
    }
  }

  /**
   * Validate name fields
   * Uses central nameSchema
   */
  static validateName(name: string, fieldName: string = "Name"): ValidationResult {
    try {
      nameSchema.parse(name);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMsg = error.errors[0]?.message || `${fieldName} is invalid`;
        return {
          isValid: false,
          error: errorMsg.replace("Name", fieldName),
          suggestions: ["Remove numbers and special characters"],
        };
      }
      return { isValid: false, error: `${fieldName} is invalid` };
    }
  }

  /**
   * Validate Canadian postal code
   * Uses central postalCodeSchema
   */
  static validatePostalCode(postalCode: string): ValidationResult {
    try {
      postalCodeSchema.parse(postalCode);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || this.commonErrors.postalCode,
          suggestions: ["Format: K1A 0A6 (Letter-Number-Letter Number-Letter-Number)"],
        };
      }
      return { isValid: false, error: this.commonErrors.postalCode };
    }
  }

  /**
   * Validate file upload
   * Uses central fileUploadSchema
   */
  static validateFile(
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
      allowedExtensions?: string[];
    } = {}
  ): ValidationResult {
    try {
      fileUploadSchema.parse({ file });
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMsg = error.errors[0]?.message || "Invalid file";
        const maxSize = options.maxSize || 10 * 1024 * 1024;

        return {
          isValid: false,
          error: errorMsg,
          suggestions: [
            `Maximum size: ${(maxSize / 1024 / 1024).toFixed(0)}MB`,
            `Allowed types: JPEG, PNG, WebP, GIF, PDF`,
          ],
        };
      }
      return { isValid: false, error: "Invalid file" };
    }
  }

  /**
   * Generic field validation with custom rules
   */
  static validateField(
    value: string,
    rules: FieldValidation,
    fieldName: string = "Field"
  ): ValidationResult {
    if (rules.required && !value.trim()) {
      return { isValid: false, error: `${fieldName} is required` };
    }

    if (rules.minLength && value.length < rules.minLength) {
      return {
        isValid: false,
        error: this.commonErrors.minLength(rules.minLength),
      };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return {
        isValid: false,
        error: this.commonErrors.maxLength(rules.maxLength),
      };
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return { isValid: false, error: this.commonErrors.pattern };
    }

    if (rules.customValidator) {
      return rules.customValidator(value);
    }

    return { isValid: true };
  }

  /**
   * Password strength validation
   * Uses central passwordSchema
   */
  static validatePassword(password: string): ValidationResult & { strength: number } {
    let strength = 0;
    const suggestions: string[] = [];

    // Length check
    if (password.length >= 8) strength += 20;
    else suggestions.push("Use at least 8 characters");

    // Complexity checks
    if (/[a-z]/.test(password)) strength += 15;
    else suggestions.push("Include lowercase letters");

    if (/[A-Z]/.test(password)) strength += 15;
    else suggestions.push("Include uppercase letters");

    if (/\d/.test(password)) strength += 15;
    else suggestions.push("Include numbers");

    if (/[^a-zA-Z\d]/.test(password)) strength += 15;
    else suggestions.push("Include special characters");

    // Bonus points
    if (password.length >= 12) strength += 10;
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/.test(password)) strength += 10;

    // Use central schema for validation
    try {
      passwordSchema.parse(password);
      return {
        isValid: true,
        strength: Math.min(100, strength),
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || "Password is too weak",
          suggestions,
          strength: Math.min(100, strength),
        };
      }
      return {
        isValid: false,
        error: "Password is invalid",
        suggestions,
        strength: Math.min(100, strength),
      };
    }
  }
}

/**
 * Form validation schema validator
 */
export class FormValidator {
  private schema: z.ZodSchema;
  private errors: Record<string, string> = {};

  constructor(schema: z.ZodSchema) {
    this.schema = schema;
  }

  /**
   * Validate entire form data
   */
  validateForm(data: Record<string, any>): { isValid: boolean; errors: Record<string, string> } {
    try {
      this.schema.parse(data);
      this.errors = {};
      return { isValid: true, errors: {} };
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.errors = {};
        error.errors.forEach((err) => {
          const field = err.path.join(".");
          this.errors[field] = err.message;
        });
      }
      return { isValid: false, errors: this.errors };
    }
  }

  /**
   * Validate single field
   */
  validateField(fieldName: string, value: any): { isValid: boolean; error?: string } {
    try {
      // Extract field schema for individual validation
      const result = this.schema.safeParse({ [fieldName]: value });
      if (result.success) {
        delete this.errors[fieldName];
        return { isValid: true };
      } else {
        const fieldError = result.error.errors.find(err => err.path.includes(fieldName));
        const error = fieldError?.message || "Invalid value";
        this.errors[fieldName] = error;
        return { isValid: false, error };
      }
    } catch {
      return { isValid: false, error: "Validation error" };
    }
  }

  /**
   * Get current errors
   */
  getErrors(): Record<string, string> {
    return { ...this.errors };
  }

  /**
   * Clear errors
   */
  clearErrors(): void {
    this.errors = {};
  }
}

/**
 * Real-time input formatter
 */
export class InputFormatter {
  /**
   * Format postal code as user types
   */
  static formatPostalCode(value: string): string {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (cleaned.length <= 3) {
      return cleaned;
    } else {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
    }
  }

  /**
   * Format currency input
   */
  static formatCurrency(value: string): string {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";

    const amount = parseInt(digits) / 100;
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  }

  /**
   * Capitalize name properly
   */
  static formatName(value: string): string {
    return value
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}

/**
 * Security utilities for client-side input handling
 */
export class ClientSecurityUtils {
  /**
   * Sanitize input for display (XSS prevention)
   */
  static sanitizeForDisplay(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/&/g, "&amp;");
  }

  /**
   * Check for suspicious patterns
   */
  static detectSuspiciousInput(input: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
      /(union|select|insert|update|delete|drop|create|alter)\s+/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Rate limit checker (client-side only, not for security)
   */
  static checkSubmissionRate(key: string, maxSubmissions: number = 3, windowMs: number = 60000): boolean {
    const now = Date.now();
    const submissions = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || "[]");

    // Remove old submissions
    const recentSubmissions = submissions.filter((time: number) => now - time < windowMs);

    if (recentSubmissions.length >= maxSubmissions) {
      return false; // Rate limited
    }

    // Add current submission
    recentSubmissions.push(now);
    localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentSubmissions));

    return true; // Allowed
  }
}