/**
 * Security & API Key Management Hub
 * Centralizes security measures, encryption, and access control
 */

import crypto from 'crypto';
import { createHash, createHmac } from 'crypto';
import jwt from 'jsonwebtoken';

// Security Configuration
export interface SecurityConfig {
  encryption: {
    algorithm: string;
    secretKey: string;
    ivLength: number;
  };
  jwt: {
    secret: string;
    expiresIn: string;
    issuer: string;
    audience: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests: boolean;
  };
  cors: {
    origins: string[];
    credentials: boolean;
    methods: string[];
    headers: string[];
  };
  audit: {
    logLevel: 'info' | 'warn' | 'error' | 'debug';
    retentionDays: number;
    logSensitiveData: boolean;
  };
}

export class SecurityHub {
  private config: SecurityConfig;
  private auditLog: Array<{
    timestamp: string;
    level: string;
    event: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    details: any;
  }> = [];

  constructor(config: SecurityConfig) {
    this.config = config;
    this.initializeSecurity();
  }

  private initializeSecurity() {
    // Set up security headers
    this.setupSecurityHeaders();

    // Initialize audit logging
    this.setupAuditLogging();
  }

  // Encryption & Decryption
  encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    try {
      const iv = crypto.randomBytes(this.config.encryption.ivLength);
      const cipher = crypto.createCipher(this.config.encryption.algorithm, this.config.encryption.secretKey);
      cipher.setAAD(Buffer.from('additional-data'));

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  decrypt(encryptedData: { encrypted: string; iv: string; tag: string }): string {
    try {
      const decipher = crypto.createDecipher(this.config.encryption.algorithm, this.config.encryption.secretKey);
      decipher.setAAD(Buffer.from('additional-data'));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed');
    }
  }

  // Hashing
  hash(data: string, salt?: string): { hash: string; salt: string } {
    const generatedSalt = salt || crypto.randomBytes(32).toString('hex');
    const hash = crypto.pbkdf2Sync(data, generatedSalt, 10000, 64, 'sha512').toString('hex');

    return { hash, salt: generatedSalt };
  }

  verifyHash(data: string, hash: string, salt: string): boolean {
    const hashVerify = crypto.pbkdf2Sync(data, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
  }

  // JWT Token Management
  generateToken(payload: any, expiresIn?: string): string {
    try {
      return jwt.sign(payload, this.config.jwt.secret, {
        expiresIn: expiresIn || this.config.jwt.expiresIn,
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience,
      });
    } catch (error) {
      console.error('JWT generation error:', error);
      throw new Error('Token generation failed');
    }
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.config.jwt.secret, {
        issuer: this.config.jwt.issuer,
        audience: this.config.jwt.audience,
      });
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new Error('Token verification failed');
    }
  }

  refreshToken(refreshToken: string): { accessToken: string; refreshToken: string } {
    try {
      const decoded = jwt.verify(refreshToken, this.config.jwt.secret, {
        ignoreExpiration: true,
      }) as any;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = this.generateToken({
        userId: decoded.userId,
        type: 'access',
      });

      const newRefreshToken = this.generateToken({
        userId: decoded.userId,
        type: 'refresh',
      }, '7d');

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Token refresh failed');
    }
  }

  // API Key Management
  generateApiKey(userId: string, permissions: string[]): { apiKey: string; keyId: string } {
    try {
      const keyId = crypto.randomBytes(16).toString('hex');
      const keyData = {
        userId,
        permissions,
        keyId,
        timestamp: Date.now(),
      };

      const apiKey = Buffer.from(JSON.stringify(keyData)).toString('base64');
      const signature = createHmac('sha256', this.config.encryption.secretKey)
        .update(apiKey)
        .digest('hex');

      return {
        apiKey: `${apiKey}.${signature}`,
        keyId,
      };
    } catch (error) {
      console.error('API key generation error:', error);
      throw new Error('API key generation failed');
    }
  }

  validateApiKey(apiKey: string): any {
    try {
      const [keyData, signature] = apiKey.split('.');
      const expectedSignature = createHmac('sha256', this.config.encryption.secretKey)
        .update(keyData)
        .digest('hex');

      if (signature !== expectedSignature) {
        throw new Error('Invalid API key signature');
      }

      const data = JSON.parse(Buffer.from(keyData, 'base64').toString());

      // Check if key is expired (24 hours)
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        throw new Error('API key expired');
      }

      return data;
    } catch (error) {
      console.error('API key validation error:', error);
      throw new Error('Invalid API key');
    }
  }

  // Rate Limiting
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - this.config.rateLimit.windowMs;

    let rateLimitData = this.rateLimitStore.get(identifier);

    if (!rateLimitData || now > rateLimitData.resetTime) {
      rateLimitData = {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs,
      };
      this.rateLimitStore.set(identifier, rateLimitData);
    } else {
      rateLimitData.count++;
    }

    const allowed = rateLimitData.count <= this.config.rateLimit.maxRequests;
    const remaining = Math.max(0, this.config.rateLimit.maxRequests - rateLimitData.count);

    return {
      allowed,
      remaining,
      resetTime: rateLimitData.resetTime,
    };
  }

  // CORS Configuration
  getCorsConfig() {
    return {
      origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || this.config.cors.origins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      credentials: this.config.cors.credentials,
      methods: this.config.cors.methods,
      allowedHeaders: this.config.cors.headers,
    };
  }

  // Security Headers
  private setupSecurityHeaders() {
    // This would typically be implemented as middleware
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'",
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
  }

  // Audit Logging
  private setupAuditLogging() {
    // Set up audit logging configuration
    // In a real implementation, this would connect to a logging system
  }

  logAuditEvent(event: string, details: any, level: string = 'info', userId?: string, ip?: string, userAgent?: string) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      level,
      event,
      userId,
      ip,
      userAgent,
      details: this.config.audit.logSensitiveData ? details : this.sanitizeData(details),
    };

    this.auditLog.push(auditEntry);

    // In a real implementation, this would be sent to a logging service
    console.log(`[AUDIT] ${level.toUpperCase()}: ${event}`, auditEntry);

    // Clean up old logs
    this.cleanupOldAuditLogs();
  }

  private sanitizeData(data: any): any {
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'key'];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  private cleanupOldAuditLogs() {
    const cutoffDate = new Date(Date.now() - this.config.audit.retentionDays * 24 * 60 * 60 * 1000);
    this.auditLog = this.auditLog.filter(entry => new Date(entry.timestamp) > cutoffDate);
  }

  getAuditLog(filters?: {
    level?: string;
    event?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
  }) {
    let filteredLogs = [...this.auditLog];

    if (filters) {
      if (filters.level) {
        filteredLogs = filteredLogs.filter(entry => entry.level === filters.level);
      }
      if (filters.event) {
        filteredLogs = filteredLogs.filter(entry => entry.event.includes(filters.event));
      }
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(entry => entry.userId === filters.userId);
      }
      if (filters.startDate) {
        filteredLogs = filteredLogs.filter(entry => entry.timestamp >= filters.startDate);
      }
      if (filters.endDate) {
        filteredLogs = filteredLogs.filter(entry => entry.timestamp <= filters.endDate);
      }
    }

    return filteredLogs;
  }

  // Input Validation
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Session Management
  createSession(userId: string, sessionData?: any): { sessionId: string; expiresAt: Date } {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // In a real implementation, this would be stored in Redis or database
    const session = {
      sessionId,
      userId,
      data: sessionData || {},
      createdAt: new Date(),
      expiresAt,
    };

    this.logAuditEvent('session_created', { sessionId, userId }, 'info', userId);

    return {
      sessionId,
      expiresAt,
    };
  }

  validateSession(sessionId: string): any {
    // In a real implementation, this would check against Redis or database
    // For now, just validate the format
    if (sessionId && /^[a-f0-9]{64}$/.test(sessionId)) {
      return { valid: true };
    }
    return { valid: false };
  }

  destroySession(sessionId: string, userId?: string) {
    // In a real implementation, this would remove from Redis or database
    this.logAuditEvent('session_destroyed', { sessionId }, 'info', userId);
  }

  // Security Monitoring
  detectSuspiciousActivity(activity: {
    userId: string;
    action: string;
    ip: string;
    userAgent: string;
    timestamp: Date;
  }): { suspicious: boolean; reason?: string; severity: 'low' | 'medium' | 'high' } {
    const recentActivities = this.auditLog.filter(entry =>
      entry.userId === activity.userId &&
      new Date(entry.timestamp) > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    // Check for rapid successive actions
    if (recentActivities.length > 100) {
      return {
        suspicious: true,
        reason: 'High frequency of actions detected',
        severity: 'high',
      };
    }

    // Check for multiple IP addresses
    const uniqueIPs = new Set(recentActivities.map(entry => entry.ip)).size;
    if (uniqueIPs > 5) {
      return {
        suspicious: true,
        reason: 'Multiple IP addresses detected',
        severity: 'medium',
      };
    }

    // Check for failed login attempts
    const failedLogins = recentActivities.filter(entry =>
      entry.event === 'login_failed'
    ).length;
    if (failedLogins > 5) {
      return {
        suspicious: true,
        reason: 'Multiple failed login attempts',
        severity: 'high',
      };
    }

    return { suspicious: false };
  }

  // Compliance Checks
  checkGDPRCompliance(data: any): { compliant: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for personal data without consent
    if (data.email && !data.consentTimestamp) {
      issues.push('Email stored without consent timestamp');
    }

    // Check for missing privacy policy
    if (!data.privacyPolicyAccepted) {
      issues.push('Privacy policy not accepted');
    }

    // Check for data retention policies
    if (data.createdAt && new Date(data.createdAt) < new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)) {
      issues.push('Data retention period exceeded');
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }

  checkCCPACompliance(data: any): { compliant: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for opt-out mechanism
    if (!data.dataSaleOptOut) {
      issues.push('Data sale opt-out not provided');
    }

    // Check for data deletion capability
    if (!data.deletionRequested || !data.deletionCompleted) {
      issues.push('Data deletion process not available');
    }

    return {
      compliant: issues.length === 0,
      issues,
    };
  }

  // Error Handling
  handleSecurityError(error: any, context: string) {
    console.error(`Security error in ${context}:`, error);

    this.logAuditEvent('security_error', {
      context,
      error: error.message,
      stack: error.stack,
    }, 'error');

    return {
      error: true,
      message: 'A security error occurred',
      code: 'SECURITY_ERROR',
      context,
    };
  }
}

// Configuration Helper
export const getSecurityConfig = (): SecurityConfig => {
  return {
    encryption: {
      algorithm: 'aes-256-gcm',
      secretKey: process.env.ENCRYPTION_SECRET_KEY || crypto.randomBytes(32).toString('hex'),
      ivLength: 16,
    },
    jwt: {
      secret: process.env.JWT_SECRET!,
      expiresIn: '1h',
      issuer: 'pg-closets',
      audience: 'pg-closets-users',
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      skipSuccessfulRequests: false,
    },
    cors: {
      origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
    },
    audit: {
      logLevel: 'info',
      retentionDays: 90,
      logSensitiveData: false,
    },
  };
};