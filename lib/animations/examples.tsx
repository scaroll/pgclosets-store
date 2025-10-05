/**
 * Animation Examples
 *
 * Complete examples demonstrating the animation library
 */

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  // Transitions
  fadeTransition,
  slideUpTransition,
  modalTransition,
  // Hover Effects
  liftHover,
  scaleHover,
  shadowLiftHover,
  // Scroll Animations
  slideUpScroll,
  staggerChildrenScroll,
  staggerItemScroll,
  defaultViewport,
  // Loading States
  spinnerVariants,
  pulseVariants,
  dotsVariants,
  skeletonVariants,
  // Micro-Interactions
  buttonPressEffect,
  checkboxVariants,
  toggleSwitchVariants,
  tooltipVariants,
  dropdownVariants,
  accordionVariants,
  likeAnimationVariants,
  successCheckmarkVariants,
  // Utilities
  fade,
  slide,
  combineVariants,
} from './index';

/**
 * Page Transition Example
 */
export function PageTransitionExample() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeTransition}
      className="min-h-screen p-8"
    >
      <h1>Page with Fade Transition</h1>
    </motion.div>
  );
}

/**
 * Button Hover Examples
 */
export function ButtonExamples() {
  return (
    <div className="flex gap-4 p-8">
      {/* Lift hover */}
      <motion.button
        {...liftHover}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Lift on Hover
      </motion.button>

      {/* Scale hover */}
      <motion.button
        {...scaleHover}
        className="px-6 py-3 bg-black text-white rounded-lg"
      >
        Scale on Hover
      </motion.button>

      {/* Shadow lift hover */}
      <motion.button
        {...shadowLiftHover}
        className="px-6 py-3 bg-white border border-gray-200 rounded-lg"
      >
        Shadow Lift
      </motion.button>
    </div>
  );
}

/**
 * Scroll Animation Example
 */
export function ScrollAnimationExample() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];

  return (
    <div className="space-y-8 p-8">
      {/* Single element scroll animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={slideUpScroll}
        className="p-6 bg-gray-100 rounded-lg"
      >
        <h2>Slide Up on Scroll</h2>
      </motion.div>

      {/* Staggered list */}
      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        variants={staggerChildrenScroll}
        className="space-y-4"
      >
        {items.map((item, i) => (
          <motion.li
            key={i}
            variants={staggerItemScroll}
            className="p-4 bg-white rounded-lg shadow"
          >
            {item}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

/**
 * Loading States Example
 */
export function LoadingStatesExample() {
  return (
    <div className="flex gap-8 p-8">
      {/* Spinner */}
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className="w-8 h-8 border-2 border-black border-t-transparent rounded-full"
      />

      {/* Pulse */}
      <motion.div
        variants={pulseVariants}
        animate="animate"
        className="w-8 h-8 bg-black rounded-full"
      />

      {/* Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotsVariants}
            animate="animate"
            custom={i}
            className="w-2 h-2 bg-black rounded-full"
          />
        ))}
      </div>

      {/* Skeleton */}
      <motion.div
        variants={skeletonVariants}
        animate="animate"
        className="w-32 h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded"
        style={{
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}

/**
 * Checkbox Example
 */
export function CheckboxExample() {
  const [checked, setChecked] = useState(false);

  return (
    <button
      onClick={() => setChecked(!checked)}
      className="flex items-center gap-2 p-4"
    >
      <div className="relative w-6 h-6 border-2 border-black rounded">
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute inset-0"
          variants={checkboxVariants}
          initial="unchecked"
          animate={checked ? 'checked' : 'unchecked'}
        >
          <motion.path
            d="M4 12l5 5L20 6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          />
        </motion.svg>
      </div>
      <span>Animated Checkbox</span>
    </button>
  );
}

/**
 * Toggle Switch Example
 */
export function ToggleSwitchExample() {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-black' : 'bg-gray-300'
      }`}
    >
      <motion.div
        variants={toggleSwitchVariants}
        initial="off"
        animate={enabled ? 'on' : 'off'}
        className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"
      />
    </button>
  );
}

/**
 * Tooltip Example
 */
export function TooltipExample() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative p-8">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Hover me
      </button>

      {show && (
        <motion.div
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-full mt-2 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg"
        >
          This is a tooltip
        </motion.div>
      )}
    </div>
  );
}

/**
 * Dropdown Menu Example
 */
export function DropdownExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative p-8">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Menu
      </button>

      <motion.div
        variants={dropdownVariants}
        initial="closed"
        animate={open ? 'open' : 'closed'}
        className="absolute top-full mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden"
      >
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Option 1
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Option 2
        </button>
        <button className="w-full px-4 py-2 text-left hover:bg-gray-100">
          Option 3
        </button>
      </motion.div>
    </div>
  );
}

/**
 * Accordion Example
 */
export function AccordionExample() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full max-w-md p-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 bg-gray-100 text-left rounded-t-lg flex justify-between items-center"
      >
        <span>Click to expand</span>
        <span>{expanded ? '−' : '+'}</span>
      </button>

      <motion.div
        variants={accordionVariants}
        initial="collapsed"
        animate={expanded ? 'expanded' : 'collapsed'}
        className="overflow-hidden bg-white border-x border-b rounded-b-lg"
      >
        <div className="p-4">
          <p>This content is revealed when expanded!</p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Like Button Example
 */
export function LikeButtonExample() {
  const [liked, setLiked] = useState(false);

  return (
    <motion.button
      onClick={() => setLiked(!liked)}
      variants={likeAnimationVariants}
      initial="idle"
      animate={liked ? 'liked' : 'idle'}
      className={`p-4 ${liked ? 'text-red-500' : 'text-gray-400'}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={liked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={2}
        className="w-8 h-8"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </motion.button>
  );
}

/**
 * Success Checkmark Example
 */
export function SuccessCheckmarkExample() {
  const [show, setShow] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setShow(!show)}
        className="px-4 py-2 bg-black text-white rounded mb-4"
      >
        Toggle Success
      </button>

      {show && (
        <motion.svg
          viewBox="0 0 24 24"
          className="w-16 h-16 text-green-500"
          variants={successCheckmarkVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.path
            d="M4 12l5 5L20 6"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </div>
  );
}

/**
 * Modal Example
 */
export function ModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Open Modal
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            variants={modalTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white rounded-lg p-6 max-w-md pointer-events-auto">
              <h2 className="text-xl font-bold mb-4">Modal Title</h2>
              <p className="mb-4">This is a modal with smooth animations.</p>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-black text-white rounded"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

/**
 * Custom Combined Animation Example
 */
export function CustomAnimationExample() {
  const customVariant = combineVariants(
    fade({ from: 0, to: 1, duration: 0.5 }),
    slide({ direction: 'up', distance: 20, duration: 0.5 })
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={customVariant}
      className="p-6 bg-gray-100 rounded-lg"
    >
      <h2>Custom Combined Animation</h2>
      <p>Fade + Slide Up</p>
    </motion.div>
  );
}

/**
 * Complete Demo Page
 */
export function AnimationDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-4">Button Hover Effects</h2>
          <ButtonExamples />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Scroll Animations</h2>
          <ScrollAnimationExample />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Loading States</h2>
          <LoadingStatesExample />
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Form Controls</h2>
          <div className="space-y-4">
            <CheckboxExample />
            <ToggleSwitchExample />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Interactive Elements</h2>
          <div className="space-y-4">
            <TooltipExample />
            <DropdownExample />
            <AccordionExample />
            <LikeButtonExample />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Feedback</h2>
          <SuccessCheckmarkExample />
        </section>
      </div>
    </div>
  );
}
