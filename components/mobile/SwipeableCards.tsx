'use client';

/**
 * Swipeable Cards Component (Tinder-style)
 * Touch-optimized card interface for product discovery
 *
 * @module components/mobile/SwipeableCards
 * @agent Agent #15 - Mobile Experience & PWA
 */

import React, { useState, useRef, useCallback } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { HapticFeedback } from '@/lib/mobile/gestures';

export interface SwipeableCard {
  id: string;
  content: React.ReactNode;
}

export interface SwipeableCardsProps {
  cards: SwipeableCard[];
  onSwipeLeft?: (card: SwipeableCard) => void;
  onSwipeRight?: (card: SwipeableCard) => void;
  onSwipeUp?: (card: SwipeableCard) => void;
  onEmpty?: () => void;
  className?: string;
  swipeThreshold?: number; // Distance to trigger swipe (default: 100)
}

export function SwipeableCards({
  cards,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onEmpty,
  className,
  swipeThreshold = 100,
}: SwipeableCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);

  const currentCard = cards[currentIndex];
  const isLastCard = currentIndex === cards.length - 1;

  // Handle swipe completion
  const handleSwipeComplete = useCallback(
    (direction: 'left' | 'right' | 'up') => {
      const card = currentCard;

      if (direction === 'left' && onSwipeLeft) {
        onSwipeLeft(card);
        HapticFeedback.trigger('medium');
      } else if (direction === 'right' && onSwipeRight) {
        onSwipeRight(card);
        HapticFeedback.trigger('success');
      } else if (direction === 'up' && onSwipeUp) {
        onSwipeUp(card);
        HapticFeedback.trigger('light');
      }

      // Move to next card
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setExitDirection(null);
      } else if (onEmpty) {
        onEmpty();
      }
    },
    [currentCard, currentIndex, cards.length, onSwipeLeft, onSwipeRight, onSwipeUp, onEmpty]
  );

  // Reset to show all cards again
  const resetCards = () => {
    setCurrentIndex(0);
    setExitDirection(null);
    HapticFeedback.trigger('light');
  };

  if (!currentCard) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <p className="text-lg font-medium text-gray-900">All done!</p>
          <p className="text-gray-600">You've reviewed all products.</p>
          <button
            onClick={resetCards}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors min-h-[52px]"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full', className)}>
      {/* Card stack - show current and next card */}
      <div className="absolute inset-0 flex items-center justify-center">
        {cards.slice(currentIndex, currentIndex + 2).map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            isTopCard={index === 0}
            onSwipeComplete={handleSwipeComplete}
            swipeThreshold={swipeThreshold}
            exitDirection={index === 0 ? exitDirection : null}
          />
        ))}
      </div>

      {/* Swipe indicators */}
      <div className="absolute inset-x-0 bottom-24 flex justify-center items-center gap-8 pointer-events-none z-10">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-red-500"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Pass</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-500"
            >
              <polyline points="5 12 10 17 20 7" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Save</span>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-green-500"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <span className="text-xs text-gray-600 font-medium">Love</span>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 px-4 z-10 pointer-events-none">
        {cards.map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full transition-colors',
              index < currentIndex
                ? 'bg-green-500'
                : index === currentIndex
                ? 'bg-blue-500'
                : 'bg-gray-300'
            )}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Individual Card Component
 */
interface CardProps {
  card: SwipeableCard;
  index: number;
  isTopCard: boolean;
  onSwipeComplete: (direction: 'left' | 'right' | 'up') => void;
  swipeThreshold: number;
  exitDirection: 'left' | 'right' | 'up' | null;
}

function Card({
  card,
  index,
  isTopCard,
  onSwipeComplete,
  swipeThreshold,
  exitDirection,
}: CardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Transform values for rotation and opacity
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);
  const opacity = useTransform(x, [-200, -swipeThreshold, 0, swipeThreshold, 200], [0.5, 1, 1, 1, 0.5]);

  // Handle drag end
  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeX = info.offset.x;
    const swipeY = info.offset.y;
    const velocityX = info.velocity.x;
    const velocityY = info.velocity.y;

    // Fast swipe
    const isFastSwipeLeft = velocityX < -500;
    const isFastSwipeRight = velocityX > 500;
    const isFastSwipeUp = velocityY < -500;

    // Distance swipe
    const isLeftSwipe = swipeX < -swipeThreshold;
    const isRightSwipe = swipeX > swipeThreshold;
    const isUpSwipe = swipeY < -swipeThreshold && Math.abs(swipeX) < swipeThreshold;

    if (isFastSwipeLeft || isLeftSwipe) {
      onSwipeComplete('left');
    } else if (isFastSwipeRight || isRightSwipe) {
      onSwipeComplete('right');
    } else if (isFastSwipeUp || isUpSwipe) {
      onSwipeComplete('up');
    } else {
      // Snap back to center
      x.set(0);
      y.set(0);
    }
  };

  // Programmatic swipe for button controls
  const swipeLeft = () => {
    x.set(-1000);
    setTimeout(() => onSwipeComplete('left'), 200);
  };

  const swipeRight = () => {
    x.set(1000);
    setTimeout(() => onSwipeComplete('right'), 200);
  };

  return (
    <motion.div
      className="absolute w-full max-w-md"
      style={{
        x: isTopCard ? x : 0,
        y: isTopCard ? y : 0,
        rotate: isTopCard ? rotate : 0,
        opacity: isTopCard ? opacity : 0.8,
        scale: isTopCard ? 1 : 0.95,
        zIndex: isTopCard ? 20 : 10 - index,
      }}
      drag={isTopCard ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragEnd={isTopCard ? handleDragEnd : undefined}
      animate={
        exitDirection
          ? {
              x: exitDirection === 'left' ? -1000 : exitDirection === 'right' ? 1000 : 0,
              y: exitDirection === 'up' ? -1000 : 0,
              opacity: 0,
            }
          : {}
      }
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden touch-none">
        {card.content}
      </div>
    </motion.div>
  );
}
