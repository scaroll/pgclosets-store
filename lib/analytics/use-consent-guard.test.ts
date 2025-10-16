/**
 * Tests for Analytics Consent Guard
 *
 * Verifies consent guard functionality with various scenarios.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  withConsentGuard,
  withVoidConsentGuard,
  withAnalyticsGuard,
  isTrackingEnabled,
  hasAnalyticsInstance
} from './use-consent-guard';

describe('Analytics Consent Guard', () => {
  describe('withConsentGuard', () => {
    it('should execute function when consent is granted and analytics exists', () => {
      const mockFn = vi.fn((x: number) => x * 2);
      const guarded = withConsentGuard(true, {}, mockFn);

      const result = guarded(5);

      expect(mockFn).toHaveBeenCalledWith(5);
      expect(result).toBe(10);
    });

    it('should return undefined when consent is not granted', () => {
      const mockFn = vi.fn((x: number) => x * 2);
      const guarded = withConsentGuard(false, {}, mockFn);

      const result = guarded(5);

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined when analytics is null', () => {
      const mockFn = vi.fn((x: number) => x * 2);
      const guarded = withConsentGuard(true, null, mockFn);

      const result = guarded(5);

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined when analytics is undefined', () => {
      const mockFn = vi.fn((x: number) => x * 2);
      const guarded = withConsentGuard(true, undefined, mockFn);

      const result = guarded(5);

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('withVoidConsentGuard', () => {
    it('should execute function when consent is granted and analytics exists', () => {
      const mockFn = vi.fn();
      const guarded = withVoidConsentGuard(true, {}, mockFn);

      guarded('test');

      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should not execute when consent is not granted', () => {
      const mockFn = vi.fn();
      const guarded = withVoidConsentGuard(false, {}, mockFn);

      guarded('test');

      expect(mockFn).not.toHaveBeenCalled();
    });

    it('should not execute when analytics is null', () => {
      const mockFn = vi.fn();
      const guarded = withVoidConsentGuard(true, null, mockFn);

      guarded('test');

      expect(mockFn).not.toHaveBeenCalled();
    });
  });

  describe('withAnalyticsGuard', () => {
    it('should execute function when analytics exists', () => {
      const mockFn = vi.fn((x: number) => x * 2);
      const guarded = withAnalyticsGuard({}, mockFn);

      const result = guarded(5);

      expect(mockFn).toHaveBeenCalledWith(5);
      expect(result).toBe(10);
    });

    it('should return undefined when analytics is null', () => {
      const mockFn = vi.fn((x: number) => x * 2);
      const guarded = withAnalyticsGuard(null, mockFn);

      const result = guarded(5);

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should return undefined when analytics is undefined', () => {
      const mockFn = vi.fn((x: number) => x * 2);
      const guarded = withAnalyticsGuard(undefined, mockFn);

      const result = guarded(5);

      expect(mockFn).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should work regardless of consent status', () => {
      const mockFn = vi.fn();
      const guarded = withAnalyticsGuard({}, mockFn);

      guarded();

      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('isTrackingEnabled', () => {
    it('should return true when both consent and analytics exist', () => {
      expect(isTrackingEnabled(true, {})).toBe(true);
    });

    it('should return false when consent is not granted', () => {
      expect(isTrackingEnabled(false, {})).toBe(false);
    });

    it('should return false when analytics is null', () => {
      expect(isTrackingEnabled(true, null)).toBe(false);
    });

    it('should return false when analytics is undefined', () => {
      expect(isTrackingEnabled(true, undefined)).toBe(false);
    });

    it('should return false when both are false', () => {
      expect(isTrackingEnabled(false, null)).toBe(false);
    });
  });

  describe('hasAnalyticsInstance', () => {
    it('should return true when analytics exists', () => {
      expect(hasAnalyticsInstance({})).toBe(true);
    });

    it('should return false when analytics is null', () => {
      expect(hasAnalyticsInstance(null)).toBe(false);
    });

    it('should return false when analytics is undefined', () => {
      expect(hasAnalyticsInstance(undefined)).toBe(false);
    });

    it('should return false for falsy values', () => {
      expect(hasAnalyticsInstance(0)).toBe(false);
      expect(hasAnalyticsInstance('')).toBe(false);
      expect(hasAnalyticsInstance(false)).toBe(false);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle multiple arguments correctly', () => {
      const mockFn = vi.fn((a: number, b: string, c: boolean) => `${a}-${b}-${c}`);
      const guarded = withConsentGuard(true, {}, mockFn);

      const result = guarded(42, 'test', true);

      expect(mockFn).toHaveBeenCalledWith(42, 'test', true);
      expect(result).toBe('42-test-true');
    });

    it('should preserve function context', () => {
      const mockAnalytics = {
        track: vi.fn()
      };

      const trackEvent = withVoidConsentGuard(
        true,
        mockAnalytics,
        (eventName: string) => {
          mockAnalytics.track(eventName);
        }
      );

      trackEvent('button_click');

      expect(mockAnalytics.track).toHaveBeenCalledWith('button_click');
    });

    it('should work with complex return types', () => {
      interface TrackingResult {
        success: boolean;
        timestamp: number;
      }

      const mockFn = vi.fn((): TrackingResult => ({
        success: true,
        timestamp: Date.now()
      }));

      const guarded = withConsentGuard(true, {}, mockFn);
      const result = guarded();

      expect(mockFn).toHaveBeenCalled();
      expect(result).toHaveProperty('success', true);
      expect(result).toHaveProperty('timestamp');
    });

    it('should handle async functions', async () => {
      const mockFn = vi.fn(async (x: number) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return x * 2;
      });

      const guarded = withConsentGuard(true, {}, mockFn);
      const result = await guarded(5);

      expect(mockFn).toHaveBeenCalledWith(5);
      expect(result).toBe(10);
    });
  });
});
