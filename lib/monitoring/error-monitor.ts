/**
 * Error Monitoring System
 *
 * Centralized error logging and monitoring with:
 * - Environment-aware logging (dev vs production)
 * - Context preservation for debugging
 * - Integration points for external services (Sentry, DataDog)
 * - Performance tracking
 */

import { AppError, ErrorContext, isAppError } from '../errors/app-errors';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

/**
 * Error monitoring configuration
 */
interface ErrorMonitorConfig {
  /** Enable detailed console logging */
  enableConsoleLogging: boolean;
  /** Enable external service integration */
  enableExternalLogging: boolean;
  /** Log operational errors */
  logOperationalErrors: boolean;
  /** Include stack traces */
  includeStackTraces: boolean;
  /** Environment */
  environment: 'development' | 'production' | 'test';
}

/**
 * Default configuration based on environment
 */
const defaultConfig: ErrorMonitorConfig = {
  enableConsoleLogging: process.env.NODE_ENV !== 'production',
  enableExternalLogging: process.env.NODE_ENV === 'production',
  logOperationalErrors: true,
  includeStackTraces: process.env.NODE_ENV !== 'production',
  environment: (process.env.NODE_ENV as ErrorMonitorConfig['environment']) || 'development',
};

/**
 * Error monitoring statistics
 */
interface ErrorStats {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByCode: Record<string, number>;
  lastError?: Date;
}

/**
 * Error Monitor Class
 * Singleton for centralized error logging
 */
class ErrorMonitor {
  private static instance: ErrorMonitor;
  private config: ErrorMonitorConfig;
  private stats: ErrorStats;

  private constructor(config?: Partial<ErrorMonitorConfig>) {
    this.config = { ...defaultConfig, ...config };
    this.stats = {
      totalErrors: 0,
      errorsByType: {},
      errorsByCode: {},
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: Partial<ErrorMonitorConfig>): ErrorMonitor {
    if (!ErrorMonitor.instance) {
      ErrorMonitor.instance = new ErrorMonitor(config);
    }
    return ErrorMonitor.instance;
  }

  /**
   * Log an error with context
   */
  logError(
    error: Error | AppError | unknown,
    severity: ErrorSeverity = ErrorSeverity.ERROR,
    additionalContext?: Partial<ErrorContext>
  ): void {
    // Convert to AppError if needed
    const appError = isAppError(error)
      ? error
      : new AppError(
          error instanceof Error ? error.message : String(error),
          'UNKNOWN_ERROR',
          500,
          additionalContext as ErrorContext
        );

    // Check if we should log this error
    if (!this.shouldLog(appError)) {
      return;
    }

    // Update statistics
    this.updateStats(appError);

    // Merge contexts
    const context: ErrorContext = {
      ...appError.context,
      ...additionalContext,
      timestamp: new Date(),
    };

    // Console logging (development)
    if (this.config.enableConsoleLogging) {
      this.logToConsole(appError, severity, context);
    }

    // External service logging (production)
    if (this.config.enableExternalLogging) {
      this.logToExternalService(appError, severity, context);
    }
  }

  /**
   * Determine if an error should be logged
   */
  private shouldLog(error: AppError): boolean {
    // Always log non-operational errors
    if (!error.isOperational) {
      return true;
    }

    // Check error's isLoggable flag
    if (!error.isLoggable) {
      return false;
    }

    // Check config
    return this.config.logOperationalErrors;
  }

  /**
   * Log to console with formatting
   */
  private logToConsole(
    error: AppError,
    severity: ErrorSeverity,
    context: ErrorContext
  ): void {
    const logMethod = this.getConsoleMethod(severity);
    const timestamp = new Date().toISOString();

    console.group(`[${timestamp}] ${severity.toUpperCase()}: ${error.name}`);

    logMethod('Message:', error.message);
    logMethod('Code:', error.code);
    logMethod('Status:', error.statusCode);

    if (context.userId) {
      logMethod('User ID:', context.userId);
    }

    if (context.endpoint) {
      logMethod('Endpoint:', `${context.method || 'GET'} ${context.endpoint}`);
    }

    if (context.requestData) {
      logMethod('Request Data:', this.sanitizeData(context.requestData));
    }

    if (context.metadata) {
      logMethod('Metadata:', context.metadata);
    }

    if (this.config.includeStackTraces && error.stack) {
      logMethod('Stack Trace:', error.stack);
    }

    console.groupEnd();
  }

  /**
   * Log to external monitoring service (Sentry, DataDog, etc.)
   */
  private logToExternalService(
    error: AppError,
    severity: ErrorSeverity,
    context: ErrorContext
  ): void {
    // TODO: Implement external service integration
    // Example integrations:

    /*
    // SENTRY INTEGRATION
    if (typeof Sentry !== 'undefined') {
      Sentry.withScope((scope) => {
        // Set severity
        scope.setLevel(this.mapSeverityToSentryLevel(severity));

        // Set context
        scope.setContext('error', {
          code: error.code,
          statusCode: error.statusCode,
          isOperational: error.isOperational,
        });

        if (context.userId) {
          scope.setUser({ id: context.userId });
        }

        if (context.endpoint) {
          scope.setTag('endpoint', context.endpoint);
        }

        if (context.metadata) {
          scope.setContext('metadata', context.metadata);
        }

        // Capture exception
        Sentry.captureException(error);
      });
    }
    */

    /*
    // DATADOG INTEGRATION
    if (typeof window !== 'undefined' && window.DD_LOGS) {
      window.DD_LOGS.logger.error(error.message, {
        error: {
          kind: error.name,
          message: error.message,
          stack: error.stack,
        },
        context: {
          code: error.code,
          statusCode: error.statusCode,
          ...context,
        },
      });
    }
    */

    /*
    // CUSTOM API LOGGING
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.toJSON(),
        severity,
        context: this.sanitizeData(context),
        timestamp: new Date().toISOString(),
      }),
    }).catch((err) => {
      // Silently fail - don't throw errors in error handler
      console.error('Failed to log error to API:', err);
    });
    */

    // For now, just acknowledge that we would log externally
    if (this.config.environment === 'production') {
      // Placeholder for production logging
      console.info('External logging would be triggered:', {
        errorCode: error.code,
        severity,
        timestamp: context.timestamp,
      });
    }
  }

  /**
   * Update error statistics
   */
  private updateStats(error: AppError): void {
    this.stats.totalErrors++;
    this.stats.lastError = new Date();

    // Count by type
    const errorType = error.name;
    this.stats.errorsByType[errorType] = (this.stats.errorsByType[errorType] || 0) + 1;

    // Count by code
    this.stats.errorsByCode[error.code] = (this.stats.errorsByCode[error.code] || 0) + 1;
  }

  /**
   * Get appropriate console method for severity
   */
  private getConsoleMethod(severity: ErrorSeverity): typeof console.log {
    switch (severity) {
      case ErrorSeverity.DEBUG:
        return console.debug;
      case ErrorSeverity.INFO:
        return console.info;
      case ErrorSeverity.WARNING:
        return console.warn;
      case ErrorSeverity.ERROR:
      case ErrorSeverity.CRITICAL:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Sanitize sensitive data before logging
   */
  private sanitizeData(data: Record<string, unknown>): Record<string, unknown> {
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
      'ssn',
      'authorization',
    ];

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some(field => lowerKey.includes(field));

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeData(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Get current error statistics
   */
  getStats(): ErrorStats {
    return { ...this.stats };
  }

  /**
   * Reset error statistics
   */
  resetStats(): void {
    this.stats = {
      totalErrors: 0,
      errorsByType: {},
      errorsByCode: {},
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<ErrorMonitorConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Convenience function to log errors
 */
export function logError(
  error: Error | AppError | unknown,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  context?: Partial<ErrorContext>
): void {
  const monitor = ErrorMonitor.getInstance();
  monitor.logError(error, severity, context);
}

/**
 * Convenience function to log critical errors
 */
export function logCriticalError(
  error: Error | AppError | unknown,
  context?: Partial<ErrorContext>
): void {
  logError(error, ErrorSeverity.CRITICAL, context);
}

/**
 * Get error monitoring statistics
 */
export function getErrorStats(): ErrorStats {
  const monitor = ErrorMonitor.getInstance();
  return monitor.getStats();
}

/**
 * Reset error statistics
 */
export function resetErrorStats(): void {
  const monitor = ErrorMonitor.getInstance();
  monitor.resetStats();
}

/**
 * Initialize error monitor with custom config
 */
export function initializeErrorMonitor(config?: Partial<ErrorMonitorConfig>): void {
  ErrorMonitor.getInstance(config);
}

/**
 * Export the singleton instance getter
 */
export { ErrorMonitor };
