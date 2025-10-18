/**
 * Animation Showcase Examples
 *
 * Complete examples demonstrating all animation capabilities
 * Copy-paste ready code for common patterns
 */

'use client';

import { motion } from 'framer-motion';
import {
  slideUpScroll,
  staggerChildrenScroll,
  staggerItemScroll,
  fadeInScroll,
  defaultViewport,
} from './scroll-animations';
import { shadowLiftHover, scaleHover, subtleScaleHover } from './hover-effects';
import {
  RippleEffect,
  RippleButton,
  PullToRefresh,
  HapticButton,
  LinearProgress,
  CircularProgress,
  StepProgress,
  AppleSpinner,
  LoadingScreen,
} from '@/components/ui/interactions';

/**
 * Example 1: Product Card with Scroll + Hover
 */
export function ProductCardExample() {
  return (
    <motion.div
      variants={slideUpScroll}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
    >
      <motion.div {...shadowLiftHover} className="bg-white rounded-lg p-6 shadow-sm">
        <RippleEffect>
          <img
            src="/product.jpg"
            alt="Product"
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        </RippleEffect>
        <h3 className="text-lg font-semibold mb-2">Product Name</h3>
        <p className="text-gray-600 mb-4">$299.99</p>
        <RippleButton variant="primary" className="w-full">
          Add to Cart
        </RippleButton>
      </motion.div>
    </motion.div>
  );
}

/**
 * Example 2: Hero Section with Stagger
 */
export function HeroSectionExample() {
  return (
    <motion.section
      variants={staggerChildrenScroll}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      className="py-20 text-center"
    >
      <motion.h1 variants={staggerItemScroll} className="text-5xl font-bold mb-4">
        Transform Your Space
      </motion.h1>
      <motion.p variants={staggerItemScroll} className="text-xl text-gray-600 mb-8">
        Custom closet solutions designed for your lifestyle
      </motion.p>
      <motion.div variants={staggerItemScroll}>
        <HapticButton hapticType="success" className="bg-black text-white px-8 py-3 rounded-lg">
          Get Free Quote
        </HapticButton>
      </motion.div>
    </motion.section>
  );
}

/**
 * Example 3: Feature List with Icons
 */
export function FeatureListExample() {
  const features = [
    { icon: '🎨', title: 'Custom Design', description: 'Tailored to your needs' },
    { icon: '🔧', title: 'Expert Installation', description: 'Professional service' },
    { icon: '✨', title: 'Premium Quality', description: 'Built to last' },
  ];

  return (
    <motion.div
      variants={staggerChildrenScroll}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      className="grid md:grid-cols-3 gap-6"
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={staggerItemScroll}
          {...scaleHover}
          className="p-6 bg-gray-50 rounded-lg text-center"
        >
          <div className="text-4xl mb-3">{feature.icon}</div>
          <h3 className="font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Example 4: Gallery Grid with Hover
 */
export function GalleryGridExample() {
  const images = Array.from({ length: 6 }, (_, i) => `/gallery-${i + 1}.jpg`);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={defaultViewport}
          transition={{ delay: index * 0.1 }}
          {...shadowLiftHover}
          className="aspect-square rounded-lg overflow-hidden cursor-pointer"
        >
          <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Example 5: Checkout Progress
 */
export function CheckoutProgressExample() {
  const steps = [
    { label: 'Cart', description: 'Review items' },
    { label: 'Shipping', description: 'Enter address' },
    { label: 'Payment', description: 'Complete order' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <StepProgress steps={steps} currentStep={1} variant="horizontal" />
    </div>
  );
}

/**
 * Example 6: Loading States
 */
export function LoadingStatesExample() {
  return (
    <div className="space-y-8">
      {/* Inline spinner */}
      <div className="flex items-center gap-2">
        <AppleSpinner size={20} />
        <span>Loading...</span>
      </div>

      {/* Progress bar */}
      <LinearProgress value={65} showLabel color="primary" />

      {/* Circular progress */}
      <div className="flex justify-center">
        <CircularProgress value={75} showLabel size={60} />
      </div>

      {/* Button loading state */}
      <button
        disabled
        className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2"
      >
        <AppleSpinner size={16} className="text-white" />
        Processing...
      </button>
    </div>
  );
}

/**
 * Example 7: Interactive Cards
 */
export function InteractiveCardsExample() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Card 1: With Ripple */}
      <RippleEffect className="cursor-pointer">
        <motion.div
          {...subtleScaleHover}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h3 className="font-semibold mb-2">Click Me</h3>
          <p className="text-sm text-gray-600">Experience the ripple effect</p>
        </motion.div>
      </RippleEffect>

      {/* Card 2: With Haptic */}
      <HapticButton
        hapticType="medium"
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-left w-full"
      >
        <h3 className="font-semibold mb-2">Press Me</h3>
        <p className="text-sm text-gray-600">Feel the haptic feedback</p>
      </HapticButton>
    </div>
  );
}

/**
 * Example 8: Animated List
 */
export function AnimatedListExample() {
  const items = [
    'Custom closet design consultation',
    'Professional 3D rendering',
    'Premium materials selection',
    'Expert installation service',
    'Lifetime warranty included',
  ];

  return (
    <motion.ul
      variants={staggerChildrenScroll}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      className="space-y-3"
    >
      {items.map((item, index) => (
        <motion.li
          key={index}
          variants={staggerItemScroll}
          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm"
          >
            ✓
          </motion.div>
          <span>{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

/**
 * Example 9: Pull to Refresh (Mobile)
 */
export function PullToRefreshExample() {
  const handleRefresh = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <PullToRefresh onRefresh={handleRefresh} className="h-[500px] border rounded-lg">
      <div className="p-6">
        <h3 className="font-semibold mb-4">Pull down to refresh</h3>
        <p className="text-gray-600">Content will reload after pulling down</p>
      </div>
    </PullToRefresh>
  );
}

/**
 * Example 10: Full Page Loading
 */
export function FullPageLoadingExample() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <button
        onClick={() => setLoading(true)}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Show Loading Screen
      </button>

      {loading && <LoadingScreen message="Loading your custom design..." spinner="ring" />}
    </>
  );
}

/**
 * Complete Page Example
 * Combines multiple animation patterns
 */
export function CompletePageExample() {
  return (
    <div className="min-h-screen">
      {/* Hero with stagger */}
      <HeroSectionExample />

      {/* Feature cards */}
      <section className="py-16 px-4">
        <motion.h2
          variants={fadeInScroll}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-3xl font-bold text-center mb-12"
        >
          Why Choose Us
        </motion.h2>
        <FeatureListExample />
      </section>

      {/* Product grid */}
      <section className="py-16 px-4 bg-gray-50">
        <motion.h2
          variants={fadeInScroll}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-3xl font-bold text-center mb-12"
        >
          Featured Products
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ProductCardExample />
          <ProductCardExample />
          <ProductCardExample />
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-4">
        <motion.h2
          variants={fadeInScroll}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="text-3xl font-bold text-center mb-12"
        >
          Our Work
        </motion.h2>
        <GalleryGridExample />
      </section>
    </div>
  );
}

// Import statement for using these examples
import { useState } from 'react';
