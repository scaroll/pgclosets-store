/**
 * Unified Error Handling System
 *
 * Provides a consistent error class hierarchy for the application with:
 * - Structured error codes and messages
 * - HTTP status code mapping
 * - Rich context preservation
 * - Type-safe error handling
 */

/**
 * Error context interface for preserving debugging information
 */
export interface ErrorContext {
  /** User ID if authenticated */
  userId?: string;
  /** API endpoint or route */
  endpoint?: string;
  /** Request method */
  method?: string;
  /** Request body or parameters (sanitized) */
  requestData?: Record<string, unknown>;
  /** Stack trace (development only) */
  stack?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Timestamp of error */
  timestamp?: Date;
}

/**
 * Base application error class
 * All custom errors should extend this class
 */
export class AppError extends Error {
  /** Unique error code for tracking and categorization */
  public readonly code: string;

  /** HTTP status code for API responses */
  public readonly statusCode: number;

  /** Additional context for debugging */
  public readonly context?: ErrorContext;

  /** Whether this error should be logged */
  public readonly isLoggable: boolean;

  /** Whether this error is safe to expose to users */
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    context?: ErrorContext,
    isOperational = true,
    isLoggable = true
  ) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.context = {
      ...context,
      timestamp: new Date(),
      stack: this.stack,
    };
    this.isOperational = isOperational;
    this.isLoggable = isLoggable;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Converts error to JSON for logging or API responses
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.context?.timestamp,
    };
  }

  /**
   * Returns user-friendly error message (safe to expose)
   */
  toUserMessage(): string {
    return this.message;
  }
}

/**
 * Validation Error
 * Used when input validation fails
 */
export class ValidationError extends AppError {
  public readonly fields?: Record<string, string[]>;

  constructor(
    message: string,
    fields?: Record<string, string[]>,
    context?: ErrorContext
  ) {
    super(
      message,
      'VALIDATION_ERROR',
      400,
      context,
      true,
      false // Don't log validation errors by default
    );
    this.fields = fields;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      fields: this.fields,
    };
  }

  override toUserMessage(): string {
    if (this.fields) {
      const fieldErrors = Object.entries(this.fields)
        .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
        .join('; ');
      return `Validation failed: ${fieldErrors}`;
    }
    return this.message;
  }
}

/**
 * Authentication Error
 * Used when user is not authenticated
 */
export class AuthenticationError extends AppError {
  constructor(
    message = 'Authentication required',
    context?: ErrorContext
  ) {
    super(
      message,
      'AUTHENTICATION_ERROR',
      401,
      context,
      true,
      true
    );
  }

  override toUserMessage(): string {
    return 'Please sign in to continue';
  }
}

/**
 * Authorization Error
 * Used when user lacks necessary permissions
 */
export class AuthorizationError extends AppError {
  public readonly requiredPermission?: string;

  constructor(
    message = 'Insufficient permissions',
    requiredPermission?: string,
    context?: ErrorContext
  ) {
    super(
      message,
      'AUTHORIZATION_ERROR',
      403,
      context,
      true,
      true
    );
    this.requiredPermission = requiredPermission;
  }

  override toUserMessage(): string {
    return 'You do not have permission to perform this action';
  }
}

/**
 * Not Found Error
 * Used when a requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  public readonly resourceType?: string;
  public readonly resourceId?: string;

  constructor(
    message = 'Resource not found',
    resourceType?: string,
    resourceId?: string,
    context?: ErrorContext
  ) {
    super(
      message,
      'NOT_FOUND_ERROR',
      404,
      context,
      true,
      false // Don't log 404s by default
    );
    this.resourceType = resourceType;
    this.resourceId = resourceId;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      resourceType: this.resourceType,
      resourceId: this.resourceId,
    };
  }

  override toUserMessage(): string {
    if (this.resourceType) {
      return `${this.resourceType} not found`;
    }
    return 'The requested resource was not found';
  }
}

/**
 * Payment Error
 * Used for payment processing failures
 */
export class PaymentError extends AppError {
  public readonly paymentProvider?: string;
  public readonly transactionId?: string;
  public readonly amount?: number;

  constructor(
    message: string,
    paymentProvider?: string,
    transactionId?: string,
    amount?: number,
    context?: ErrorContext
  ) {
    super(
      message,
      'PAYMENT_ERROR',
      402,
      context,
      true,
      true // Always log payment errors
    );
    this.paymentProvider = paymentProvider;
    this.transactionId = transactionId;
    this.amount = amount;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      paymentProvider: this.paymentProvider,
      transactionId: this.transactionId,
      amount: this.amount,
    };
  }

  override toUserMessage(): string {
    return 'Payment processing failed. Please try again or use a different payment method';
  }
}

/**
 * Conflict Error
 * Used when there's a conflict with current resource state
 */
export class ConflictError extends AppError {
  public readonly conflictType?: string;

  constructor(
    message: string,
    conflictType?: string,
    context?: ErrorContext
  ) {
    super(
      message,
      'CONFLICT_ERROR',
      409,
      context,
      true,
      true
    );
    this.conflictType = conflictType;
  }

  override toUserMessage(): string {
    return this.message;
  }
}

/**
 * Rate Limit Error
 * Used when rate limits are exceeded
 */
export class RateLimitError extends AppError {
  public readonly retryAfter?: number;

  constructor(
    message = 'Too many requests',
    retryAfter?: number,
    context?: ErrorContext
  ) {
    super(
      message,
      'RATE_LIMIT_ERROR',
      429,
      context,
      true,
      true
    );
    this.retryAfter = retryAfter;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      retryAfter: this.retryAfter,
    };
  }

  override toUserMessage(): string {
    if (this.retryAfter) {
      return `Too many requests. Please try again in ${this.retryAfter} seconds`;
    }
    return 'Too many requests. Please try again later';
  }
}

/**
 * External Service Error
 * Used when external services (Stripe, Supabase, etc.) fail
 */
export class ExternalServiceError extends AppError {
  public readonly serviceName: string;
  public readonly originalError?: Error;

  constructor(
    message: string,
    serviceName: string,
    originalError?: Error,
    context?: ErrorContext
  ) {
    super(
      message,
      'EXTERNAL_SERVICE_ERROR',
      502,
      context,
      true,
      true // Always log external service errors
    );
    this.serviceName = serviceName;
    this.originalError = originalError;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      serviceName: this.serviceName,
      originalError: this.originalError?.message,
    };
  }

  override toUserMessage(): string {
    return 'A service is temporarily unavailable. Please try again later';
  }
}

/**
 * Internal Server Error
 * Used for unexpected errors that shouldn't be exposed to users
 */
export class InternalServerError extends AppError {
  public readonly originalError?: Error;

  constructor(
    message = 'An unexpected error occurred',
    originalError?: Error,
    context?: ErrorContext
  ) {
    super(
      message,
      'INTERNAL_SERVER_ERROR',
      500,
      context,
      false, // Not operational - unexpected
      true // Always log internal errors
    );
    this.originalError = originalError;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      originalError: this.originalError?.message,
      originalStack: this.originalError?.stack,
    };
  }

  override toUserMessage(): string {
    return 'An unexpected error occurred. Please try again later';
  }
}

/**
 * Database Error
 * Used for database operation failures
 */
export class DatabaseError extends AppError {
  public readonly query?: string;
  public readonly originalError?: Error;

  constructor(
    message: string,
    query?: string,
    originalError?: Error,
    context?: ErrorContext
  ) {
    super(
      message,
      'DATABASE_ERROR',
      500,
      context,
      false,
      true // Always log database errors
    );
    this.query = query;
    this.originalError = originalError;
  }

  override toJSON() {
    return {
      ...super.toJSON(),
      // Don't expose full query in production
      originalError: this.originalError?.message,
    };
  }

  override toUserMessage(): string {
    return 'A database error occurred. Please try again later';
  }
}

/**
 * Type guard to check if an error is an AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Type guard to check if an error is operational (expected)
 */
export function isOperationalError(error: unknown): boolean {
  if (isAppError(error)) {
    return error.isOperational;
  }
  return false;
}

/**
 * Converts unknown errors to AppError instances
 */
export function normalizeError(error: unknown, context?: ErrorContext): AppError {
  // Already an AppError
  if (isAppError(error)) {
    return error;
  }

  // Standard Error
  if (error instanceof Error) {
    return new InternalServerError(
      error.message,
      error,
      context
    );
  }

  // String error
  if (typeof error === 'string') {
    return new InternalServerError(error, undefined, context);
  }

  // Unknown error type
  return new InternalServerError(
    'An unknown error occurred',
    undefined,
    {
      ...context,
      metadata: {
        ...context?.metadata,
        errorType: typeof error,
        errorValue: JSON.stringify(error),
      },
    }
  );
}
