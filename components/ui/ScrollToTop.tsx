/**
 * Scroll to Top Button
 *
 * Apple-quality scroll-to-top button with smooth animations
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopProps {
  threshold?: number;
  smooth?: boolean;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

/**
 * ScrollToTop - Animated button that appears on scroll
 *
 * @example
 * <ScrollToTop threshold={300} position="bottom-right" />
 */
export function ScrollToTop({
  threshold = 300,
  smooth = true,
  className,
  position = 'bottom-right',
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility(); // Check initial scroll position

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const positions = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            duration: 0.2,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          onClick={scrollToTop}
          className={cn(
            'fixed z-50 p-3 rounded-full bg-black text-white shadow-lg',
            'hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
            'transition-colors',
            positions[position],
            className
          )}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * ProgressScrollToTop - Scroll to top with circular progress indicator
 */
interface ProgressScrollToTopProps extends ScrollToTopProps {
  strokeWidth?: number;
}

export function ProgressScrollToTop({
  threshold = 300,
  smooth = true,
  className,
  position = 'bottom-right',
  strokeWidth = 3,
}: ProgressScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrolled / height) * 100;

      setProgress(scrollProgress);
      setIsVisible(scrolled > threshold);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  const positions = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
  };

  const size = 48;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={cn(
            'fixed z-50 rounded-full bg-white shadow-lg',
            'hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black',
            'transition-shadow',
            positions[position],
            className
          )}
          style={{ width: size, height: size }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Scroll to top"
        >
          {/* Progress circle */}
          <svg className="absolute inset-0 transform -rotate-90" width={size} height={size}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-gray-200"
            />
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="text-black"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
              }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.1 }}
            />
          </svg>

          {/* Arrow icon */}
          <div className="relative z-10 flex items-center justify-center w-full h-full">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowUp className="w-5 h-5 text-black" />
            </motion.div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
