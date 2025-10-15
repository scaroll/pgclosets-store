/**
 * Advanced Touch Gesture System for Mobile-First Experience
 * Provides comprehensive gesture detection with haptic feedback
 *
 * @module lib/mobile/gestures
 * @agent Agent #15 - Mobile Experience & PWA
 */

// Gesture Types
export type GestureType =
  | 'swipe-left'
  | 'swipe-right'
  | 'swipe-up'
  | 'swipe-down'
  | 'pinch-in'
  | 'pinch-out'
  | 'long-press'
  | 'double-tap'
  | 'pan';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

// Gesture Configuration
export interface GestureConfig {
  // Swipe thresholds
  swipeThreshold?: number; // Minimum distance in pixels (default: 50)
  swipeVelocity?: number; // Minimum velocity (default: 0.3)

  // Pinch thresholds
  pinchThreshold?: number; // Minimum scale change (default: 0.1)

  // Long press configuration
  longPressDuration?: number; // Duration in ms (default: 500)
  longPressMoveTolerance?: number; // Max movement in pixels (default: 10)

  // Double tap configuration
  doubleTapDelay?: number; // Max time between taps in ms (default: 300)
  doubleTapDistance?: number; // Max distance between taps (default: 20)

  // Pan configuration
  panThreshold?: number; // Minimum distance to start pan (default: 10)

  // Haptic feedback
  enableHaptics?: boolean; // Enable haptic feedback (default: true)

  // Prevent default behavior
  preventDefault?: boolean; // Prevent default touch behavior (default: false)
}

// Default configuration
const DEFAULT_CONFIG: Required<GestureConfig> = {
  swipeThreshold: 50,
  swipeVelocity: 0.3,
  pinchThreshold: 0.1,
  longPressDuration: 500,
  longPressMoveTolerance: 10,
  doubleTapDelay: 300,
  doubleTapDistance: 20,
  panThreshold: 10,
  enableHaptics: true,
  preventDefault: false,
};

// Touch point interface
interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

// Gesture event callback types
export type SwipeHandler = (direction: 'left' | 'right' | 'up' | 'down', distance: number, velocity: number) => void;
export type PinchHandler = (scale: number, direction: 'in' | 'out') => void;
export type LongPressHandler = (point: { x: number; y: number }) => void;
export type DoubleTapHandler = (point: { x: number; y: number }) => void;
export type PanHandler = (delta: { x: number; y: number }, point: { x: number; y: number }) => void;

/**
 * Haptic Feedback Utility
 */
export class HapticFeedback {
  private static isSupported: boolean | null = null;

  static checkSupport(): boolean {
    if (this.isSupported !== null) return this.isSupported;

    this.isSupported =
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator;

    return this.isSupported;
  }

  static trigger(type: HapticType = 'light'): void {
    if (!this.checkSupport()) return;

    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 30,
      success: [10, 50, 10],
      warning: [10, 30, 10, 30, 10],
      error: [30, 50, 30],
    };

    const pattern = patterns[type];

    try {
      if (Array.isArray(pattern)) {
        navigator.vibrate(pattern);
      } else {
        navigator.vibrate(pattern);
      }
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  static cancel(): void {
    if (!this.checkSupport()) return;

    try {
      navigator.vibrate(0);
    } catch (error) {
      console.warn('Failed to cancel haptic feedback:', error);
    }
  }
}

/**
 * Advanced Gesture Detector
 */
export class GestureDetector {
  private config: Required<GestureConfig>;
  private startPoint: TouchPoint | null = null;
  private currentPoint: TouchPoint | null = null;
  private lastTouchPoints: Touch[] = [];
  private longPressTimer: NodeJS.Timeout | null = null;
  private lastTapTime: number = 0;
  private lastTapPoint: { x: number; y: number } | null = null;
  private isPanning: boolean = false;

  // Event handlers
  private onSwipe: SwipeHandler | null = null;
  private onPinch: PinchHandler | null = null;
  private onLongPress: LongPressHandler | null = null;
  private onDoubleTap: DoubleTapHandler | null = null;
  private onPan: PanHandler | null = null;

  constructor(config: GestureConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Set gesture event handlers
   */
  setHandlers(handlers: {
    onSwipe?: SwipeHandler;
    onPinch?: PinchHandler;
    onLongPress?: LongPressHandler;
    onDoubleTap?: DoubleTapHandler;
    onPan?: PanHandler;
  }): void {
    this.onSwipe = handlers.onSwipe || null;
    this.onPinch = handlers.onPinch || null;
    this.onLongPress = handlers.onLongPress || null;
    this.onDoubleTap = handlers.onDoubleTap || null;
    this.onPan = handlers.onPan || null;
  }

  /**
   * Handle touch start
   */
  handleTouchStart = (event: TouchEvent): void => {
    if (this.config.preventDefault) {
      event.preventDefault();
    }

    const touch = event.touches[0];
    this.startPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    this.currentPoint = { ...this.startPoint };
    this.lastTouchPoints = Array.from(event.touches);
    this.isPanning = false;

    // Start long press timer
    if (this.onLongPress) {
      this.longPressTimer = setTimeout(() => {
        this.handleLongPress();
      }, this.config.longPressDuration);
    }

    // Check for double tap
    if (this.onDoubleTap) {
      const now = Date.now();
      const timeSinceLastTap = now - this.lastTapTime;

      if (
        timeSinceLastTap < this.config.doubleTapDelay &&
        this.lastTapPoint &&
        this.getDistance(
          { x: touch.clientX, y: touch.clientY },
          this.lastTapPoint
        ) < this.config.doubleTapDistance
      ) {
        // Double tap detected
        this.handleDoubleTap(touch.clientX, touch.clientY);
        this.lastTapTime = 0; // Reset to prevent triple tap
        this.lastTapPoint = null;
      } else {
        this.lastTapTime = now;
        this.lastTapPoint = { x: touch.clientX, y: touch.clientY };
      }
    }
  };

  /**
   * Handle touch move
   */
  handleTouchMove = (event: TouchEvent): void => {
    if (!this.startPoint) return;

    if (this.config.preventDefault) {
      event.preventDefault();
    }

    const touch = event.touches[0];
    this.currentPoint = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    // Check if movement exceeds long press tolerance
    const distance = this.getDistance(this.startPoint, this.currentPoint);
    if (distance > this.config.longPressMoveTolerance) {
      this.clearLongPressTimer();
    }

    // Handle pinch gesture (requires 2 touches)
    if (event.touches.length === 2 && this.lastTouchPoints.length === 2 && this.onPinch) {
      this.handlePinch(event.touches);
    }

    // Handle pan gesture
    if (event.touches.length === 1 && this.onPan) {
      const delta = {
        x: this.currentPoint.x - this.startPoint.x,
        y: this.currentPoint.y - this.startPoint.y,
      };

      if (!this.isPanning && this.getDistance(this.startPoint, this.currentPoint) > this.config.panThreshold) {
        this.isPanning = true;
      }

      if (this.isPanning) {
        this.onPan(delta, this.currentPoint);
      }
    }

    this.lastTouchPoints = Array.from(event.touches);
  };

  /**
   * Handle touch end
   */
  handleTouchEnd = (event: TouchEvent): void => {
    if (!this.startPoint || !this.currentPoint) {
      this.reset();
      return;
    }

    if (this.config.preventDefault) {
      event.preventDefault();
    }

    this.clearLongPressTimer();

    // Only check for swipe if not panning and single touch
    if (!this.isPanning && event.changedTouches.length === 1 && this.onSwipe) {
      this.handleSwipe();
    }

    this.reset();
  };

  /**
   * Handle swipe gesture
   */
  private handleSwipe(): void {
    if (!this.startPoint || !this.currentPoint || !this.onSwipe) return;

    const deltaX = this.currentPoint.x - this.startPoint.x;
    const deltaY = this.currentPoint.y - this.startPoint.y;
    const deltaTime = this.currentPoint.timestamp - this.startPoint.timestamp;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Check if swipe meets threshold requirements
    if (distance < this.config.swipeThreshold || velocity < this.config.swipeVelocity) {
      return;
    }

    // Determine swipe direction
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    let direction: 'left' | 'right' | 'up' | 'down';

    if (absX > absY) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    // Trigger haptic feedback
    if (this.config.enableHaptics) {
      HapticFeedback.trigger('light');
    }

    // Call swipe handler
    this.onSwipe(direction, distance, velocity);
  }

  /**
   * Handle pinch gesture
   */
  private handlePinch(touches: TouchList): void {
    if (!this.onPinch || this.lastTouchPoints.length !== 2) return;

    const currentDistance = this.getTouchDistance(touches[0], touches[1]);
    const lastDistance = this.getTouchDistance(
      this.lastTouchPoints[0],
      this.lastTouchPoints[1]
    );

    const scale = currentDistance / lastDistance;
    const scaleChange = Math.abs(1 - scale);

    if (scaleChange < this.config.pinchThreshold) return;

    const direction = scale > 1 ? 'out' : 'in';

    // Trigger haptic feedback
    if (this.config.enableHaptics) {
      HapticFeedback.trigger('light');
    }

    this.onPinch(scale, direction);
  }

  /**
   * Handle long press gesture
   */
  private handleLongPress(): void {
    if (!this.onLongPress || !this.currentPoint) return;

    // Trigger haptic feedback
    if (this.config.enableHaptics) {
      HapticFeedback.trigger('medium');
    }

    this.onLongPress({
      x: this.currentPoint.x,
      y: this.currentPoint.y,
    });

    this.clearLongPressTimer();
  }

  /**
   * Handle double tap gesture
   */
  private handleDoubleTap(x: number, y: number): void {
    if (!this.onDoubleTap) return;

    // Trigger haptic feedback
    if (this.config.enableHaptics) {
      HapticFeedback.trigger('light');
    }

    this.onDoubleTap({ x, y });
  }

  /**
   * Calculate distance between two points
   */
  private getDistance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Calculate distance between two touches
   */
  private getTouchDistance(t1: Touch, t2: Touch): number {
    return this.getDistance(
      { x: t1.clientX, y: t1.clientY },
      { x: t2.clientX, y: t2.clientY }
    );
  }

  /**
   * Clear long press timer
   */
  private clearLongPressTimer(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  /**
   * Reset gesture state
   */
  private reset(): void {
    this.startPoint = null;
    this.currentPoint = null;
    this.lastTouchPoints = [];
    this.isPanning = false;
    this.clearLongPressTimer();
  }

  /**
   * Clean up event listeners
   */
  destroy(): void {
    this.reset();
    this.onSwipe = null;
    this.onPinch = null;
    this.onLongPress = null;
    this.onDoubleTap = null;
    this.onPan = null;
  }
}

/**
 * React Hook for gesture detection
 */
export function useGestures(
  elementRef: React.RefObject<HTMLElement>,
  handlers: {
    onSwipe?: SwipeHandler;
    onPinch?: PinchHandler;
    onLongPress?: LongPressHandler;
    onDoubleTap?: DoubleTapHandler;
    onPan?: PanHandler;
  },
  config?: GestureConfig
) {
  const detectorRef = React.useRef<GestureDetector | null>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Create gesture detector
    const detector = new GestureDetector(config);
    detector.setHandlers(handlers);
    detectorRef.current = detector;

    // Add event listeners
    element.addEventListener('touchstart', detector.handleTouchStart, { passive: !config?.preventDefault });
    element.addEventListener('touchmove', detector.handleTouchMove, { passive: !config?.preventDefault });
    element.addEventListener('touchend', detector.handleTouchEnd, { passive: !config?.preventDefault });

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', detector.handleTouchStart);
      element.removeEventListener('touchmove', detector.handleTouchMove);
      element.removeEventListener('touchend', detector.handleTouchEnd);
      detector.destroy();
    };
  }, [elementRef, handlers, config]);

  return detectorRef;
}

// Re-export React for the hook
import React from 'react';
