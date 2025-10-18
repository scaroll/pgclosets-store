'use client';

/**
 * iOS-Style Bottom Sheet Component
 * Provides native-like bottom sheet UI for mobile actions and filters
 *
 * @module components/mobile/BottomSheet
 * @agent Agent #15 - Mobile Experience & PWA
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { HapticFeedback } from '@/lib/mobile/gestures';
import type { PanInfo } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[]; // Snap points as percentages of viewport height (e.g., [0.3, 0.6, 0.9])
  initialSnapPoint?: number; // Index of snapPoints array
  showHandle?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnSwipeDown?: boolean;
  className?: string;
  backdropClassName?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.5, 0.9],
  initialSnapPoint = 0,
  showHandle = true,
  closeOnBackdropClick = true,
  closeOnSwipeDown = true,
  className,
  backdropClassName,
}: BottomSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(initialSnapPoint);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Calculate sheet height based on current snap point
  const sheetHeight = `${snapPoints[currentSnapPoint] * 100}vh`;

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      HapticFeedback.trigger('light');
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle drag end - snap to nearest point or close
  const handleDragEnd = useCallback(
    (_: any, info: PanInfo) => {
      setIsDragging(false);

      const velocity = info.velocity.y;
      const offset = info.offset.y;

      // Fast swipe down - close immediately
      if (velocity > 500 && closeOnSwipeDown) {
        HapticFeedback.trigger('medium');
        onClose();
        return;
      }

      // Significant drag down - close
      if (offset > 150 && closeOnSwipeDown) {
        HapticFeedback.trigger('medium');
        onClose();
        return;
      }

      // Find nearest snap point
      const viewportHeight = window.innerHeight;
      const currentHeight = viewportHeight - offset;
      const currentPercentage = currentHeight / viewportHeight;

      let nearestSnapPoint = 0;
      let minDistance = Infinity;

      snapPoints.forEach((point, index) => {
        const distance = Math.abs(point - currentPercentage);
        if (distance < minDistance) {
          minDistance = distance;
          nearestSnapPoint = index;
        }
      });

      if (nearestSnapPoint !== currentSnapPoint) {
        HapticFeedback.trigger('light');
      }

      setCurrentSnapPoint(nearestSnapPoint);
    },
    [currentSnapPoint, snapPoints, onClose, closeOnSwipeDown]
  );

  // Handle backdrop click
  const handleBackdropClick = () => {
    if (closeOnBackdropClick && !isDragging) {
      HapticFeedback.trigger('light');
      onClose();
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
              backdropClassName
            )}
            onClick={handleBackdropClick}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            style={{ height: sheetHeight }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-50',
              'bg-white rounded-t-3xl shadow-2xl',
              'flex flex-col overflow-hidden',
              'safe-area-inset-bottom',
              className
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'bottom-sheet-title' : undefined}
          >
            {/* Handle */}
            {showHandle && (
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>
            )}

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2
                  id="bottom-sheet-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              {children}
            </div>

            {/* Snap point indicators (optional) */}
            {snapPoints.length > 1 && (
              <div className="absolute right-4 top-20 flex flex-col gap-2">
                {snapPoints.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSnapPoint(index);
                      HapticFeedback.trigger('light');
                    }}
                    className={cn(
                      'w-2 h-2 rounded-full transition-colors',
                      currentSnapPoint === index
                        ? 'bg-gray-900'
                        : 'bg-gray-300'
                    )}
                    aria-label={`Snap to position ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Bottom Sheet Trigger Component
 */
export interface BottomSheetTriggerProps {
  children: React.ReactNode;
  sheetContent: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  className?: string;
}

export function BottomSheetTrigger({
  children,
  sheetContent,
  title,
  snapPoints,
  className,
}: BottomSheetTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={className}
        type="button"
      >
        {children}
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        snapPoints={snapPoints}
      >
        {sheetContent}
      </BottomSheet>
    </>
  );
}

/**
 * Pre-built Bottom Sheet for Filters
 */
export interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  filters: any;
  onClearFilters: () => void;
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  onApply,
  filters,
  onClearFilters,
}: FilterBottomSheetProps) {
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onApply(tempFilters);
    HapticFeedback.trigger('success');
    onClose();
  };

  const handleClear = () => {
    setTempFilters({});
    onClearFilters();
    HapticFeedback.trigger('light');
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      snapPoints={[0.6, 0.9]}
      initialSnapPoint={0}
    >
      <div className="space-y-6">
        {/* Filter options would go here */}
        <div className="text-gray-600 text-center py-8">
          Filter options will be rendered here
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
          <button
            onClick={handleClear}
            className="px-6 py-4 rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[52px]"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors min-h-[52px]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
