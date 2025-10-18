/**
 * Analytics Consent Guard Hook
 *
 * Provides a reusable pattern for guarding analytics operations with consent checks.
 * Eliminates duplicate consent validation logic across tracking methods.
 *
 * @module lib/analytics/use-consent-guard
 */

/**
 * Creates a consent-guarded wrapper function that only executes if consent is granted
 * and the analytics instance is available.
 *
 * @template TArgs - Tuple type representing the function arguments
 * @template TReturn - Return type of the wrapped function
 *
 * @param hasConsent - Whether user has granted analytics consent
 * @param analytics - Analytics instance (can be null/undefined)
 * @param fn - Function to guard with consent check
 *
 * @returns Wrapped function that performs consent check before execution
 *
 * @example
 * ```typescript
 * const { analytics, hasConsent } = useAnalytics();
 *
 * const trackEvent = withConsentGuard(
 *   hasConsent,
 *   analytics,
 *   (eventName: string, params?: Record<string, any>) => {
 *     analytics.gtag('event', eventName, params);
 *   }
 * );
 *
 * // Safe to call - automatically returns early if no consent
 * trackEvent('button_click', { button_id: 'cta' });
 * ```
 */
export function withConsentGuard<TArgs extends any[], TReturn = void>(
  hasConsent: boolean,
  analytics: any,
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn | undefined {
  return (...args: TArgs): TReturn | undefined => {
    if (!hasConsent || !analytics) {
      return undefined;
    }
    return fn(...args);
  };
}

/**
 * Creates a consent-guarded wrapper function with explicit void return type.
 * Optimized for tracking methods that don't return values.
 *
 * @template TArgs - Tuple type representing the function arguments
 *
 * @param hasConsent - Whether user has granted analytics consent
 * @param analytics - Analytics instance (can be null/undefined)
 * @param fn - Function to guard with consent check
 *
 * @returns Wrapped function that performs consent check before execution
 *
 * @example
 * ```typescript
 * const { analytics, hasConsent } = useAnalytics();
 *
 * const trackPurchase = withVoidConsentGuard(
 *   hasConsent,
 *   analytics,
 *   (transactionId: string, value: number) => {
 *     analytics.trackPurchase({ transaction_id: transactionId, value });
 *   }
 * );
 * ```
 */
export function withVoidConsentGuard<TArgs extends any[]>(
  hasConsent: boolean,
  analytics: any,
  fn: (...args: TArgs) => void
): (...args: TArgs) => void {
  return (...args: TArgs): void => {
    if (!hasConsent || !analytics) {
      return;
    }
    fn(...args);
  };
}

/**
 * Creates a consent-guarded wrapper that allows operations even without consent.
 * Used for operations that should always execute (like user ID management).
 * Only requires analytics instance to be available.
 *
 * @template TArgs - Tuple type representing the function arguments
 * @template TReturn - Return type of the wrapped function
 *
 * @param analytics - Analytics instance (can be null/undefined)
 * @param fn - Function to guard with analytics availability check
 *
 * @returns Wrapped function that checks analytics availability before execution
 *
 * @example
 * ```typescript
 * const { analytics } = useAnalytics();
 *
 * const setUserId = withAnalyticsGuard(
 *   analytics,
 *   (userId: string) => {
 *     analytics.setUserId(userId);
 *   }
 * );
 *
 * // Works regardless of consent status
 * setUserId('user_123');
 * ```
 */
export function withAnalyticsGuard<TArgs extends any[], TReturn = void>(
  analytics: any,
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn | undefined {
  return (...args: TArgs): TReturn | undefined => {
    if (!analytics) {
      return undefined;
    }
    return fn(...args);
  };
}

/**
 * Type guard to check if consent and analytics are available.
 * Useful for inline conditional checks in component code.
 *
 * @param hasConsent - Whether user has granted analytics consent
 * @param analytics - Analytics instance
 *
 * @returns True if both consent is granted and analytics is available
 *
 * @example
 * ```typescript
 * const { analytics, hasConsent } = useAnalytics();
 *
 * if (isTrackingEnabled(hasConsent, analytics)) {
 *   // Safe to call analytics methods directly
 *   analytics.trackCustomEvent('special_action');
 * }
 * ```
 */
export function isTrackingEnabled(hasConsent: boolean, analytics: any): analytics is NonNullable<typeof analytics> {
  return hasConsent && !!analytics;
}

/**
 * Type guard to check if analytics instance is available (regardless of consent).
 *
 * @param analytics - Analytics instance
 *
 * @returns True if analytics instance exists
 *
 * @example
 * ```typescript
 * const { analytics } = useAnalytics();
 *
 * if (hasAnalyticsInstance(analytics)) {
 *   // Safe to call analytics methods
 *   analytics.configure({ debug: true });
 * }
 * ```
 */
export function hasAnalyticsInstance(analytics: any): analytics is NonNullable<typeof analytics> {
  return !!analytics;
}
