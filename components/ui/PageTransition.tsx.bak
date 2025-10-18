/**
 * Page Transition Component
 *
 * Smooth page transitions for Next.js App Router
 * Provides various transition effects between route changes
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import {
  fadeTransition,
  slideUpTransition,
  scaleTransition,
  crossfadeTransition,
} from '@/lib/animations/transitions';

type TransitionType = 'fade' | 'slideUp' | 'scale' | 'crossfade';

interface PageTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  className?: string;
}

const transitions = {
  fade: fadeTransition,
  slideUp: slideUpTransition,
  scale: scaleTransition,
  crossfade: crossfadeTransition,
};

/**
 * PageTransition - Wraps page content with smooth transitions
 *
 * @example
 * // In layout.tsx
 * <PageTransition type="slideUp">
 *   {children}
 * </PageTransition>
 */
export function PageTransition({ children, type = 'fade', className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={transitions[type]}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * SectionTransition - For animating sections within a page
 */
interface SectionTransitionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function SectionTransition({ children, delay = 0, className }: SectionTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.4, 0.0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer - For staggered children animations
 */
interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerItem - Child component for StaggerContainer
 */
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ModalTransition - For modal/dialog animations
 */
interface ModalTransitionProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function ModalTransition({ isOpen, children, onClose, className }: ModalTransitionProps) {
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
              className={className}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
