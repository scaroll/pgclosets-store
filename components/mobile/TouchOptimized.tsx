"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Touch gesture configurations
interface TouchConfig {
  swipeThreshold: number;
  longPressDelay: number;
  tapDelay: number;
  dragThreshold: number;
  pinchThreshold: number;
}

const defaultTouchConfig: TouchConfig = {
  swipeThreshold: 50,
  longPressDelay: 500,
  tapDelay: 200,
  dragThreshold: 10,
  pinchThreshold: 0.1,
};

// Touch-optimized Button Component
interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  haptic?: boolean;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  children,
  onClick,
  onLongPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className,
  haptic = true,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout>();
  const [longPressTriggered, setLongPressTriggered] = useState(false);

  const triggerHaptic = () => {
    if (haptic && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleTouchStart = () => {
    if (disabled) return;
    setIsPressed(true);
    setLongPressTriggered(false);

    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setLongPressTriggered(true);
        triggerHaptic();
        onLongPress();
      }, defaultTouchConfig.longPressDelay);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    if (!longPressTriggered && onClick && !disabled) {
      triggerHaptic();
      onClick();
    }
  };

  const handleTouchCancel = () => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    setLongPressTriggered(false);
  };

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
    destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
  };

  const sizes = {
    sm: 'h-10 px-3 text-sm',
    md: 'h-12 px-4 text-base',
    lg: 'h-14 px-6 text-lg',
    xl: 'h-16 px-8 text-xl',
  };

  return (
    <motion.button
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150',
        'touch-manipulation select-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchCancel}
      disabled={disabled}
      animate={{
        scale: isPressed ? 0.95 : 1,
      }}
      transition={{
        duration: 0.1,
        ease: 'easeInOut',
      }}
    >
      {children}

      {/* Ripple effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white rounded-lg pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Swipeable Card Component
interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  disabled?: boolean;
  className?: string;
  showIndicators?: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  disabled = false,
  className,
  showIndicators = true,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 0, 100], [10, 0, -10]);
  const rotateY = useTransform(x, [-100, 0, 100], [-10, 0, 10]);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (disabled) return;

    const { offset, velocity } = info;
    const swipeThreshold = defaultTouchConfig.swipeThreshold;

    // Horizontal swipes
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      if (offset.x > swipeThreshold || velocity.x > 300) {
        onSwipeRight?.();
      } else if (offset.x < -swipeThreshold || velocity.x < -300) {
        onSwipeLeft?.();
      }
    }
    // Vertical swipes
    else {
      if (offset.y > swipeThreshold || velocity.y > 300) {
        onSwipeDown?.();
      } else if (offset.y < -swipeThreshold || velocity.y < -300) {
        onSwipeUp?.();
      }
    }

    // Reset position
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden rounded-lg bg-white shadow-lg cursor-grab active:cursor-grabbing',
        disabled && 'cursor-default',
        className
      )}
      drag={!disabled}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        opacity,
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}

      {/* Swipe Indicators */}
      {showIndicators && !disabled && (
        <>
          {/* Left indicator */}
          {onSwipeLeft && (
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-500 text-white p-2 rounded-full"
              style={{ opacity: useTransform(x, [0, -50], [0, 1]) }}
            >
              <X className="h-4 w-4" />
            </motion.div>
          )}

          {/* Right indicator */}
          {onSwipeRight && (
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white p-2 rounded-full"
              style={{ opacity: useTransform(x, [0, 50], [0, 1]) }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          )}

          {/* Up indicator */}
          {onSwipeUp && (
            <motion.div
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white p-2 rounded-full"
              style={{ opacity: useTransform(y, [0, -50], [0, 1]) }}
            >
              <ChevronUp className="h-4 w-4" />
            </motion.div>
          )}

          {/* Down indicator */}
          {onSwipeDown && (
            <motion.div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white p-2 rounded-full"
              style={{ opacity: useTransform(y, [0, 50], [0, 1]) }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
};

// Pull to Refresh Component
interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  threshold = 100,
  className,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const y = useMotionValue(0);

  const handleDrag = (_: any, info: PanInfo) => {
    if (info.offset.y > 0 && window.scrollY === 0) {
      setPullDistance(info.offset.y);
    }
  };

  const handleDragEnd = async (_: any, info: PanInfo) => {
    if (info.offset.y > threshold && window.scrollY === 0 && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        y.set(0);
      }
    } else {
      setPullDistance(0);
      y.set(0);
    }
  };

  const refreshProgress = Math.min(pullDistance / threshold, 1);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-blue-50 text-blue-600"
        style={{
          height: Math.min(pullDistance, threshold),
          y: pullDistance > threshold ? 0 : pullDistance - threshold,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: pullDistance > 20 ? 1 : 0 }}
      >
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{ rotate: isRefreshing ? 360 : refreshProgress * 360 }}
            transition={{ duration: isRefreshing ? 1 : 0, repeat: isRefreshing ? Infinity : 0 }}
            className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
          />
          <span className="text-sm font-medium">
            {isRefreshing ? 'Refreshing...' : pullDistance > threshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="touch-pan-y"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Touch-optimized Slider
interface TouchSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export const TouchSlider: React.FC<TouchSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  showValue = true,
  formatValue = (v) => v.toString(),
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = useCallback((clientX: number) => {
    if (!sliderRef.current || disabled) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newValue = min + percentage * (max - min);
    const steppedValue = Math.round(newValue / step) * step;

    onChange(Math.max(min, Math.min(max, steppedValue)));
  }, [min, max, step, onChange, disabled]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) updateValue(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        updateValue(e.touches[0].clientX);
      }
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, updateValue]);

  return (
    <div className={cn('space-y-3', className)}>
      {showValue && (
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>{formatValue(min)}</span>
          <span className="font-medium text-gray-900">{formatValue(value)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}

      <div
        ref={sliderRef}
        className={cn(
          'relative h-12 bg-gray-200 rounded-full cursor-pointer touch-manipulation',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Track */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-2 bg-blue-600 rounded-full transition-all duration-200"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <motion.div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border-3 border-blue-600 rounded-full shadow-lg',
            'cursor-grab active:cursor-grabbing',
            disabled && 'cursor-not-allowed'
          )}
          style={{ left: `calc(${percentage}% - 1rem)` }}
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
          transition={{ duration: 0.1 }}
        />

        {/* Value tooltip */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-12 bg-gray-900 text-white text-sm px-2 py-1 rounded transform -translate-x-1/2"
              style={{ left: `${percentage}%` }}
            >
              {formatValue(value)}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Touch-optimized Tab Bar
interface TouchTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TouchTabBarProps {
  items: TouchTabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'pills' | 'underline' | 'rounded';
}

export const TouchTabBar: React.FC<TouchTabBarProps> = ({
  items,
  activeTab,
  onChange,
  className,
  variant = 'pills',
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const activeTabElement = tabRefs.current[activeTab];
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeTab]);

  const handleTabChange = (tabId: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onChange(tabId);
  };

  return (
    <div className={cn('relative', className)}>
      <div className={cn(
        'flex space-x-1 p-1 rounded-lg',
        variant === 'pills' && 'bg-gray-100',
        variant === 'underline' && 'border-b border-gray-200',
        variant === 'rounded' && 'bg-gray-50 rounded-xl'
      )}>
        {/* Active indicator */}
        {variant === 'pills' && (
          <motion.div
            className="absolute bg-white rounded-md shadow-sm"
            style={{
              height: 'calc(100% - 8px)',
              top: 4,
            }}
            animate={{
              left: indicatorStyle.left + 4,
              width: indicatorStyle.width - 8,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        {variant === 'underline' && (
          <motion.div
            className="absolute bottom-0 h-0.5 bg-blue-600"
            animate={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}

        {items.map((item) => (
          <button
            key={item.id}
            ref={(el) => (tabRefs.current[item.id] = el)}
            onClick={() => !item.disabled && handleTabChange(item.id)}
            disabled={item.disabled}
            className={cn(
              'relative flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200',
              'touch-manipulation select-none outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              item.disabled && 'opacity-50 cursor-not-allowed',
              activeTab === item.id
                ? variant === 'pills'
                  ? 'text-blue-600 z-10'
                  : 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900',
              variant === 'rounded' && 'rounded-xl'
            )}
          >
            {item.icon && (
              <span className="flex-shrink-0">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {item.badge && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Touch-optimized Bottom Sheet
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  defaultSnap?: number;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.3, 0.6, 0.9],
  defaultSnap = 0.6,
  className,
}) => {
  const [snapIndex, setSnapIndex] = useState(1);
  const y = useMotionValue(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const snapHeight = snapPoints[snapIndex] * window.innerHeight;

  const handleDragEnd = (_: any, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // If dragging down fast or past threshold, close
    if (velocity > 500 || offset > 100) {
      onClose();
      return;
    }

    // Snap to nearest point
    let newSnapIndex = snapIndex;
    if (offset > 50 && snapIndex > 0) {
      newSnapIndex = snapIndex - 1;
    } else if (offset < -50 && snapIndex < snapPoints.length - 1) {
      newSnapIndex = snapIndex + 1;
    }

    setSnapIndex(newSnapIndex);
    y.set(0);
  };

  useEffect(() => {
    if (isOpen) {
      setSnapIndex(1); // Default to middle snap point
      y.set(0);
    }
  }, [isOpen, y]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            className={cn(
              'absolute bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-2xl',
              className
            )}
            style={{ y }}
            initial={{ y: '100%' }}
            animate={{ y: `${100 - snapPoints[snapIndex] * 100}%` }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
          >
            {/* Handle */}
            <div className="flex justify-center p-2">
              <div className="w-8 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="px-6 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              </div>
            )}

            {/* Content */}
            <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default {
  TouchButton,
  SwipeableCard,
  PullToRefresh,
  TouchSlider,
  TouchTabBar,
  BottomSheet,
};