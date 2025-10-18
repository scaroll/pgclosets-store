/**
 * Unified Error Handling System - Main Export
 *
 * Centralized export of all error classes and utilities.
 * Import from here for consistent error handling across the application.
 *
 * @example Basic Usage
 * ```typescript
 * import { ValidationError, NotFoundError, logError } from '@/lib/errors';
 *
 * throw new ValidationError('Invalid input', { email: ['Invalid format'] });
 * ```
 *
 * @example API Route Error Handling
 * ```typescript
 * import { isAppError, logError, ErrorSeverity } from '@/lib/errors';
 *
 * try {
 *   // Your code
 * } catch (error) {
 *   logError(error, ErrorSeverity.ERROR);
 *   if (isAppError(error)) {
 *     return NextResponse.json(
 *       { error: error.toUserMessage() },
 *       { status: error.statusCode }
 *     );
 *   }
 * }
 * ```
 */

// Export all error classes
export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  PaymentError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  InternalServerError,
  DatabaseError,
  isAppError,
  isOperationalError,
  normalizeError,
  type ErrorContext,
} from './app-errors';

// Export monitoring utilities
export {
  ErrorMonitor,
  ErrorSeverity,
  logError,
  logCriticalError,
  getErrorStats,
  resetErrorStats,
  initializeErrorMonitor,
} from '../monitoring/error-monitor';
