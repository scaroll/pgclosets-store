import { describe, expect, test, beforeEach } from 'vitest';
import { ClientValidator, FormValidator, InputFormatter } from '../client-validation';
import { sanitizeText, sanitizeEmail, sanitizePhone } from '../sanitization';
import { contactFormSchema, quoteRequestSchema } from '../schemas';

describe('Input Validation Security Tests', () => {
  describe('ClientValidator', () => {
    test('should validate email addresses correctly', () => {
      // Valid emails
      expect(ClientValidator.validateEmail('user@example.com').isValid).toBe(true);
      expect(ClientValidator.validateEmail('test.email+tag@domain.co.uk').isValid).toBe(true);

      // Invalid emails
      expect(ClientValidator.validateEmail('invalid-email').isValid).toBe(false);
      expect(ClientValidator.validateEmail('user@').isValid).toBe(false);
      expect(ClientValidator.validateEmail('@domain.com').isValid).toBe(false);
      expect(ClientValidator.validateEmail('user..double@domain.com').isValid).toBe(false);
    });

    test('should validate phone numbers correctly', () => {
      // Valid phone numbers
      expect(ClientValidator.validatePhone('(613) 555-1234').isValid).toBe(true);
      expect(ClientValidator.validatePhone('613-555-1234').isValid).toBe(true);
      expect(ClientValidator.validatePhone('613.555.1234').isValid).toBe(true);
      expect(ClientValidator.validatePhone('+1 613 555 1234').isValid).toBe(true);

      // Invalid phone numbers
      expect(ClientValidator.validatePhone('123').isValid).toBe(false);
      expect(ClientValidator.validatePhone('abc-def-ghij').isValid).toBe(false);
    });

    test('should validate names correctly', () => {
      // Valid names
      expect(ClientValidator.validateName('John Smith').isValid).toBe(true);
      expect(ClientValidator.validateName("O'Connor").isValid).toBe(true);
      expect(ClientValidator.validateName('Jean-Pierre').isValid).toBe(true);

      // Invalid names
      expect(ClientValidator.validateName('John123').isValid).toBe(false);
      expect(ClientValidator.validateName('John@Smith').isValid).toBe(false);
      expect(ClientValidator.validateName('').isValid).toBe(false);
    });

    test('should validate Canadian postal codes', () => {
      // Valid postal codes
      expect(ClientValidator.validatePostalCode('K1A 0A6').isValid).toBe(true);
      expect(ClientValidator.validatePostalCode('M5V 3L9').isValid).toBe(true);
      expect(ClientValidator.validatePostalCode('k1a0a6').isValid).toBe(true);

      // Invalid postal codes
      expect(ClientValidator.validatePostalCode('12345').isValid).toBe(false);
      expect(ClientValidator.validatePostalCode('A1A1A1').isValid).toBe(false);
      expect(ClientValidator.validatePostalCode('K1A 0A').isValid).toBe(false);
    });

    test('should validate file uploads securely', () => {
      // Mock File objects
      const validImage = new File([''], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(validImage, 'size', { value: 1024 * 1024 }); // 1MB

      const oversizedFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(oversizedFile, 'size', { value: 15 * 1024 * 1024 }); // 15MB

      const invalidType = new File([''], 'script.exe', { type: 'application/exe' });
      Object.defineProperty(invalidType, 'size', { value: 1024 });

      expect(ClientValidator.validateFile(validImage).isValid).toBe(true);
      expect(ClientValidator.validateFile(oversizedFile).isValid).toBe(false);
      expect(ClientValidator.validateFile(invalidType).isValid).toBe(false);
    });

    test('should validate password strength', () => {
      // Strong password
      const strong = ClientValidator.validatePassword('MyStr0ng!Pass');
      expect(strong.isValid).toBe(true);
      expect(strong.strength).toBeGreaterThan(70);

      // Weak password
      const weak = ClientValidator.validatePassword('123');
      expect(weak.isValid).toBe(false);
      expect(weak.strength).toBeLessThan(30);

      // Medium password
      const medium = ClientValidator.validatePassword('password123');
      expect(medium.strength).toBeGreaterThan(30);
      expect(medium.strength).toBeLessThan(70);
    });
  });

  describe('Sanitization Functions', () => {
    test('should sanitize text input safely', () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeText('Normal text')).toBe('Normal text');
      expect(sanitizeText('<b>Bold</b> text')).toBe('Bold text');
      expect(sanitizeText('Text with "quotes" and \'apostrophes\'')).toContain('&quot;');
    });

    test('should sanitize email addresses', () => {
      expect(sanitizeEmail('  USER@EXAMPLE.COM  ')).toBe('user@example.com');
      expect(sanitizeEmail('user+tag@domain.com')).toBe('user+tag@domain.com');
      expect(sanitizeEmail('invalid<script>@domain.com')).toBe('invalidscript@domain.com');
    });

    test('should sanitize phone numbers', () => {
      expect(sanitizePhone('(613) 555-1234')).toBe('(613) 555-1234');
      expect(sanitizePhone('613.555.1234abc')).toBe('613.555.1234');
      expect(sanitizePhone('+1-613-555-1234')).toBe('+1-613-555-1234');
    });
  });

  describe('Schema Validation', () => {
    test('should validate contact form data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '613-555-1234',
        message: 'Test message'
      };

      const result = contactFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('should reject invalid contact form data', () => {
      const invalidData = {
        firstName: '',
        lastName: 'Doe',
        email: 'invalid-email',
        phone: 'abc',
        message: ''
      };

      const result = contactFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors.length).toBeGreaterThan(0);
      }
    });

    test('should validate quote request data', () => {
      const validQuote = {
        product: {
          name: 'Test Product',
          category: 'Doors',
          price: 100
        },
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '613-555-1234'
        },
        notes: 'Test notes'
      };

      const result = quoteRequestSchema.safeParse(validQuote);
      expect(result.success).toBe(true);
    });
  });

  describe('Form Validation Class', () => {
    let validator: FormValidator;

    beforeEach(() => {
      validator = new FormValidator(contactFormSchema);
    });

    test('should validate complete form', () => {
      const validForm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        message: 'Test message'
      };

      const result = validator.validateForm(validForm);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test('should track field errors', () => {
      const invalidForm = {
        firstName: '',
        lastName: 'Doe',
        email: 'invalid',
        message: ''
      };

      const result = validator.validateForm(invalidForm);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });
  });

  describe('Input Formatting', () => {
    test('should format phone numbers correctly', () => {
      expect(InputFormatter.formatPhone('6135551234')).toBe('(613) 555-1234');
      expect(InputFormatter.formatPhone('613555')).toBe('(613) 555');
      expect(InputFormatter.formatPhone('613')).toBe('613');
    });

    test('should format postal codes correctly', () => {
      expect(InputFormatter.formatPostalCode('k1a0a6')).toBe('K1A 0A6');
      expect(InputFormatter.formatPostalCode('K1A')).toBe('K1A');
    });

    test('should capitalize names properly', () => {
      expect(InputFormatter.formatName('john smith')).toBe('John Smith');
      expect(InputFormatter.formatName('jean-pierre')).toBe('Jean-pierre');
    });
  });

  describe('Security Tests', () => {
    test('should prevent XSS attacks', () => {
      const maliciousInputs = [
        '<script>alert("xss")</script>',
        'javascript:alert("xss")',
        '<img src="x" onerror="alert(1)">',
        '"><script>alert("xss")</script>',
        '\'-alert(1)-\'',
      ];

      maliciousInputs.forEach(input => {
        const sanitized = sanitizeText(input);
        expect(sanitized).not.toContain('<script');
        expect(sanitized).not.toContain('javascript:');
        expect(sanitized).not.toContain('onerror');
      });
    });

    test('should prevent SQL injection patterns', () => {
      const sqlInjectionInputs = [
        "'; DROP TABLE users; --",
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT * FROM users --",
      ];

      sqlInjectionInputs.forEach(input => {
        const sanitized = sanitizeText(input);
        expect(sanitized).not.toContain('DROP TABLE');
        expect(sanitized).not.toContain('UNION SELECT');
        expect(sanitized).not.toContain("'='");
      });
    });

    test('should validate file extensions match MIME types', () => {
      // This would require more sophisticated file validation
      // For now, we test basic extension/type mismatches
      const mismatchedFile = new File([''], 'image.jpg', { type: 'application/javascript' });
      const result = ClientValidator.validateFile(mismatchedFile);
      expect(result.isValid).toBe(false);
    });

    test('should enforce maximum lengths to prevent DoS', () => {
      const longString = 'a'.repeat(5000);

      // Name fields should be limited
      expect(ClientValidator.validateName(longString).isValid).toBe(false);

      // Email should be limited
      expect(ClientValidator.validateEmail(longString + '@example.com').isValid).toBe(false);
    });
  });

  describe('Rate Limiting (Client-side)', () => {
    test('should implement basic rate limiting', () => {
      // Clear any existing rate limit data
      localStorage.clear();

      const { ClientSecurityUtils } = require('../client-validation');

      // First few submissions should be allowed
      expect(ClientSecurityUtils.checkSubmissionRate('test', 3, 60000)).toBe(true);
      expect(ClientSecurityUtils.checkSubmissionRate('test', 3, 60000)).toBe(true);
      expect(ClientSecurityUtils.checkSubmissionRate('test', 3, 60000)).toBe(true);

      // Fourth submission should be blocked
      expect(ClientSecurityUtils.checkSubmissionRate('test', 3, 60000)).toBe(false);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle null and undefined inputs safely', () => {
      expect(() => ClientValidator.validateEmail('')).not.toThrow();
      expect(() => ClientValidator.validatePhone('')).not.toThrow();
      expect(() => ClientValidator.validateName('')).not.toThrow();
    });

    test('should handle extremely long inputs', () => {
      const veryLongString = 'a'.repeat(100000);
      expect(() => sanitizeText(veryLongString)).not.toThrow();
      expect(ClientValidator.validateName(veryLongString).isValid).toBe(false);
    });

    test('should handle unicode and special characters', () => {
      const unicodeText = 'José María Azaña-Díaz';
      expect(ClientValidator.validateName(unicodeText).isValid).toBe(false); // Based on current regex

      const unicodeEmail = 'josé@münchen.de';
      expect(ClientValidator.validateEmail(unicodeEmail).isValid).toBe(false); // ASCII-only validation
    });

    test('should validate boundary conditions', () => {
      // Test exact length limits
      expect(ClientValidator.validateName('a'.repeat(50)).isValid).toBe(true);
      expect(ClientValidator.validateName('a'.repeat(51)).isValid).toBe(false);

      // Test email length limits
      const longEmail = 'a'.repeat(310) + '@domain.com'; // 320 chars total
      expect(ClientValidator.validateEmail(longEmail).isValid).toBe(true);

      const tooLongEmail = 'a'.repeat(311) + '@domain.com'; // 321 chars total
      expect(ClientValidator.validateEmail(tooLongEmail).isValid).toBe(false);
    });
  });
});