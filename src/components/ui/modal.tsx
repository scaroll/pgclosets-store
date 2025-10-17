/**
 * Modal/Dialog Component - Glass morphism modal with animations
 *
 * Features:
 * - Radix UI Dialog primitives for accessibility
 * - Glass morphism backdrop
 * - Framer Motion animations
 * - Dark mode optimized
 * - Keyboard navigation (Esc to close)
 * - Focus trap
 *
 * @example
 * <Modal open={isOpen} onOpenChange={setIsOpen}>
 *   <ModalContent>
 *     <ModalHeader>
 *       <ModalTitle>Confirm Action</ModalTitle>
 *       <ModalDescription>Are you sure?</ModalDescription>
 *     </ModalHeader>
 *     <ModalFooter>
 *       <Button onClick={handleConfirm}>Confirm</Button>
 *     </ModalFooter>
 *   </ModalContent>
 * </Modal>
 */

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;
const ModalPortal = DialogPrimitive.Portal;

/**
 * Modal Overlay - Glass morphism backdrop with blur
 */
const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    asChild
    {...props}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        // Glass morphism backdrop
        'fixed inset-0 z-modal-backdrop',
        'bg-black/40 backdrop-blur-apple',
        'dark:bg-black/60 dark:backdrop-blur-apple-lg',
        className
      )}
    />
  </DialogPrimitive.Overlay>
));
ModalOverlay.displayName = 'ModalOverlay';

/**
 * Modal Content - Main modal container with animations
 */
const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /**
     * Size variant for the modal
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /**
     * Hide the close button
     */
    hideCloseButton?: boolean;
  }
>(({ className, children, size = 'md', hideCloseButton = false, ...props }, ref) => (
  <ModalPortal>
    <AnimatePresence>
      <ModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        asChild
        {...props}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className={cn(
            // Position and z-index
            'fixed left-[50%] top-[50%] z-modal translate-x-[-50%] translate-y-[-50%]',
            // Base styles - Apple card DNA
            'w-full rounded-apple-lg',
            'bg-white dark:bg-apple-dark-bg-secondary',
            'shadow-modal',
            'border border-apple-gray-200 dark:border-apple-dark-border',
            // Size variants
            size === 'sm' && 'max-w-sm',
            size === 'md' && 'max-w-md',
            size === 'lg' && 'max-w-lg',
            size === 'xl' && 'max-w-xl',
            size === 'full' && 'max-w-[95vw] max-h-[95vh]',
            // Focus styles
            'focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:focus:ring-apple-blue-dark',
            className
          )}
        >
          {children}
          {!hideCloseButton && (
            <DialogPrimitive.Close
              className={cn(
                'absolute right-4 top-4 rounded-apple-sm opacity-70',
                'transition-all duration-200',
                'hover:opacity-100 hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary',
                'focus:outline-none focus:ring-2 focus:ring-apple-blue-500 dark:focus:ring-apple-blue-dark',
                'disabled:pointer-events-none',
                'p-1.5'
              )}
              aria-label="Close"
            >
              <X className="h-5 w-5 text-apple-gray-600 dark:text-apple-dark-text-secondary" />
            </DialogPrimitive.Close>
          )}
        </motion.div>
      </DialogPrimitive.Content>
    </AnimatePresence>
  </ModalPortal>
));
ModalContent.displayName = 'ModalContent';

/**
 * Modal Header - Title and description section
 */
const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col gap-1.5 px-6 pt-6 pb-4',
      'border-b border-apple-gray-200 dark:border-apple-dark-border',
      className
    )}
    {...props}
  />
);
ModalHeader.displayName = 'ModalHeader';

/**
 * Modal Title - Main heading
 */
const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-apple-21 font-semibold tracking-tight',
      'text-apple-gray-900 dark:text-apple-dark-text',
      className
    )}
    {...props}
  />
));
ModalTitle.displayName = 'ModalTitle';

/**
 * Modal Description - Supporting text
 */
const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn(
      'text-apple-15 text-apple-gray-600 dark:text-apple-dark-text-secondary',
      className
    )}
    {...props}
  />
));
ModalDescription.displayName = 'ModalDescription';

/**
 * Modal Body - Main content area
 */
const ModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('px-6 py-4', className)}
    {...props}
  />
);
ModalBody.displayName = 'ModalBody';

/**
 * Modal Footer - Action buttons section
 */
const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex items-center justify-end gap-3 px-6 py-4',
      'border-t border-apple-gray-200 dark:border-apple-dark-border',
      className
    )}
    {...props}
  />
);
ModalFooter.displayName = 'ModalFooter';

export {
  Modal,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
};
