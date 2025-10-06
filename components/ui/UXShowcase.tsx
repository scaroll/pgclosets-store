"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Code, Smartphone, Accessibility, Menu as MenuIcon, ShoppingCart, Star, Heart, Download } from 'lucide-react';
import { UXLibrary } from './UXLibrary';
import { Button } from '../../ui/button';

// Demo data for components
const demoProduct = {
  id: 'demo-product',
  name: 'Premium Sliding Closet Door',
  description: 'Modern sliding door system with premium finishes and hardware.',
  price: 1299,
  comparePrice: 1599,
  images: [
    '/images/closet-door-1.jpg',
    '/images/closet-door-2.jpg',
    '/images/closet-door-3.jpg',
  ],
  category: 'Sliding Doors',
  style: 'Modern',
  material: 'Tempered Glass',
  dimensions: {
    width: '72"',
    height: '80"',
    depth: '1.5"'
  },
  features: [
    'Premium tempered glass panels',
    'Soft-close mechanism',
    'Adjustable track system',
    'Easy installation'
  ],
  inStock: true,
  rating: 4.8,
  reviewCount: 124,
  sku: 'SCD-001'
};

const demoFormFields = [
  {
    id: 'name',
    type: 'text' as const,
    label: 'Full Name',
    placeholder: 'Enter your full name',
    required: true,
    validation: [
      { type: 'required' as const, message: 'Name is required' },
      { type: 'min' as const, value: 2, message: 'Name must be at least 2 characters' },
    ],
  },
  {
    id: 'email',
    type: 'email' as const,
    label: 'Email Address',
    placeholder: 'Enter your email',
    required: true,
    validation: [
      { type: 'required' as const, message: 'Email is required' },
      { type: 'email' as const, message: 'Please enter a valid email address' },
    ],
  },
  {
    id: 'message',
    type: 'textarea' as const,
    label: 'Message',
    placeholder: 'Tell us about your project...',
    rows: 4,
    validation: [
      { type: 'required' as const, message: 'Message is required' },
      { type: 'min' as const, value: 10, message: 'Message must be at least 10 characters' },
    ],
  },
];

const tabItems = [
  { id: 'navigation', label: 'Navigation', icon: <MenuIcon className="h-4 w-4" /> },
  { id: 'product', label: 'Product', icon: <ShoppingCart className="h-4 w-4" /> },
  { id: 'forms', label: 'Forms', icon: <Star className="h-4 w-4" /> },
  { id: 'mobile', label: 'Mobile', icon: <Smartphone className="h-4 w-4" /> },
  { id: 'accessibility', label: 'A11y', icon: <Accessibility className="h-4 w-4" /> },
];

interface ComponentShowcaseProps {
  title: string;
  description: string;
  children: React.ReactNode;
  codeExample?: string;
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({
  title,
  description,
  children,
  codeExample,
}) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCode(!showCode)}
              className="flex items-center space-x-1"
            >
              <Code className="h-4 w-4" />
              <span>{showCode ? 'Hide' : 'Show'} Code</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {children}
      </div>

      {showCode && codeExample && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200 bg-gray-50"
        >
          <pre className="p-6 text-sm overflow-x-auto">
            <code className="text-gray-800">{codeExample}</code>
          </pre>
        </motion.div>
      )}
    </div>
  );
};

export const UXShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState('navigation');
  const [showProductQuickView, setShowProductQuickView] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'navigation':
        return (
          <div className="space-y-8">
            <ComponentShowcase
              title="Mega Menu Navigation"
              description="Advanced navigation menu with animations and rich content"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { MegaMenu, PRODUCTS_MEGA_MENU } = UXLibrary.Navigation;

<MegaMenu
  sections={PRODUCTS_MEGA_MENU}
  trigger="Products"
  delay={150}
/>`}
            >
              <div className="relative">
                <UXLibrary.Navigation.MegaMenu
                  sections={UXLibrary.Navigation.PRODUCTS_MEGA_MENU}
                  trigger="Products"
                  delay={150}
                />
              </div>
            </ComponentShowcase>
          </div>
        );

      case 'product':
        return (
          <div className="space-y-8">
            <ComponentShowcase
              title="Product Quick View"
              description="Modal component for quick product preview with rich interactions"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { QuickView } = UXLibrary.Product;

<QuickView
  product={product}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onAddToCart={(id, qty) => console.log('Add to cart:', id, qty)}
/>`}
            >
              <div className="text-center">
                <Button
                  onClick={() => setShowProductQuickView(true)}
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Open Product Quick View</span>
                </Button>

                <UXLibrary.Product.QuickView
                  product={demoProduct}
                  isOpen={showProductQuickView}
                  onClose={() => setShowProductQuickView(false)}
                  onAddToCart={(id, qty) => console.log('Add to cart:', id, qty)}
                  onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                />
              </div>
            </ComponentShowcase>
          </div>
        );

      case 'forms':
        return (
          <div className="space-y-8">
            <ComponentShowcase
              title="Interactive Form"
              description="Advanced form with validation, progress tracking, and accessibility features"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { InteractiveForm } = UXLibrary.Forms;

<InteractiveForm
  id="contact-form"
  title="Contact Us"
  fields={formFields}
  showProgress={true}
  onSubmit={async (data) => {
    // Handle form submission
  }}
/>`}
            >
              <UXLibrary.Forms.InteractiveForm
                id="demo-form"
                title="Demo Contact Form"
                description="Try our interactive form with real-time validation"
                fields={demoFormFields}
                showProgress={true}
                onSubmit={async (data) => {
                  console.log('Form submitted:', data);
                  await new Promise(resolve => setTimeout(resolve, 2000));
                }}
              />
            </ComponentShowcase>
          </div>
        );

      case 'mobile':
        return (
          <div className="space-y-8">
            <ComponentShowcase
              title="Touch-Optimized Button"
              description="Enhanced button with haptic feedback and touch optimizations"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { TouchButton } = UXLibrary.Mobile;

<TouchButton
  variant="primary"
  size="lg"
  onClick={() => console.log('Tapped!')}
  onLongPress={() => console.log('Long pressed!')}
  haptic={true}
>
  Touch Me!
</TouchButton>`}
            >
              <div className="flex flex-wrap gap-4">
                <UXLibrary.Mobile.TouchButton
                  variant="primary"
                  size="lg"
                  onClick={() => console.log('Tapped!')}
                  onLongPress={() => console.log('Long pressed!')}
                  haptic={true}
                >
                  Touch Me!
                </UXLibrary.Mobile.TouchButton>

                <UXLibrary.Mobile.TouchButton
                  variant="secondary"
                  size="md"
                  onClick={() => console.log('Secondary tapped!')}
                >
                  Secondary
                </UXLibrary.Mobile.TouchButton>

                <UXLibrary.Mobile.TouchButton
                  variant="ghost"
                  size="sm"
                  onClick={() => console.log('Ghost tapped!')}
                >
                  Ghost
                </UXLibrary.Mobile.TouchButton>
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Touch Slider"
              description="Mobile-optimized slider with enhanced touch interactions"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { TouchSlider } = UXLibrary.Mobile;

<TouchSlider
  value={value}
  onChange={setValue}
  min={0}
  max={100}
  step={1}
  showValue={true}
  formatValue={(v) => \`\${v}%\`}
/>`}
            >
              <div className="max-w-md">
                <UXLibrary.Mobile.TouchSlider
                  value={sliderValue}
                  onChange={setSliderValue}
                  min={0}
                  max={100}
                  step={1}
                  showValue={true}
                  formatValue={(v) => `${v}%`}
                />
              </div>
            </ComponentShowcase>

            <ComponentShowcase
              title="Swipeable Card"
              description="Card component with swipe gestures and visual feedback"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { SwipeableCard } = UXLibrary.Mobile;

<SwipeableCard
  onSwipeLeft={() => console.log('Swiped left!')}
  onSwipeRight={() => console.log('Swiped right!')}
  showIndicators={true}
>
  <div className="p-6">
    Swipe me left or right!
  </div>
</SwipeableCard>`}
            >
              <div className="max-w-sm mx-auto">
                <UXLibrary.Mobile.SwipeableCard
                  onSwipeLeft={() => console.log('Swiped left!')}
                  onSwipeRight={() => console.log('Swiped right!')}
                  showIndicators={true}
                  className="border border-gray-200"
                >
                  <div className="p-6 text-center">
                    <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900">Swipe Me!</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Try swiping left or right
                    </p>
                  </div>
                </UXLibrary.Mobile.SwipeableCard>
              </div>
            </ComponentShowcase>
          </div>
        );

      case 'accessibility':
        return (
          <div className="space-y-8">
            <ComponentShowcase
              title="Accessible Button"
              description="Button with enhanced focus states and screen reader support"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { AccessibleButton } = UXLibrary.Accessibility;

<AccessibleButton
  variant="primary"
  ariaLabel="Download file"
  onClick={() => console.log('Download started')}
>
  <Download className="h-4 w-4 mr-2" />
  Download
</AccessibleButton>`}
            >
              <UXLibrary.Accessibility.Provider>
                <div className="flex flex-wrap gap-4">
                  <UXLibrary.Accessibility.AccessibleButton
                    variant="primary"
                    ariaLabel="Download file"
                    onClick={() => console.log('Download started')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </UXLibrary.Accessibility.AccessibleButton>

                  <UXLibrary.Accessibility.AccessibleButton
                    variant="secondary"
                    onClick={() => console.log('Secondary action')}
                  >
                    Secondary
                  </UXLibrary.Accessibility.AccessibleButton>

                  <UXLibrary.Accessibility.AccessibleButton
                    variant="ghost"
                    loading={true}
                  >
                    Loading...
                  </UXLibrary.Accessibility.AccessibleButton>
                </div>
              </UXLibrary.Accessibility.Provider>
            </ComponentShowcase>

            <ComponentShowcase
              title="Accessible Progress Bar"
              description="Progress indicator with proper ARIA attributes and screen reader support"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { AccessibleProgress } = UXLibrary.Accessibility;

<AccessibleProgress
  value={75}
  max={100}
  label="Upload Progress"
  showValue={true}
/>`}
            >
              <UXLibrary.Accessibility.Provider>
                <div className="max-w-md">
                  <UXLibrary.Accessibility.AccessibleProgress
                    value={75}
                    max={100}
                    label="Upload Progress"
                    showValue={true}
                  />
                </div>
              </UXLibrary.Accessibility.Provider>
            </ComponentShowcase>

            <ComponentShowcase
              title="Color Contrast Validator"
              description="Tool to validate color contrast ratios for accessibility compliance"
              codeExample={`import { UXLibrary } from '@/components/ui/UXLibrary';

const { ColorContrastValidator } = UXLibrary.Accessibility;

<ColorContrastValidator
  foreground="var(--color-primary)"
  background="var(--color-secondary)"
  text="Sample Text"
  level="AA"
/>`}
            >
              <UXLibrary.Accessibility.ColorContrastValidator
                foreground="var(--color-primary)"
                background="var(--color-secondary)"
                text="This is sample text for contrast testing"
                level="AA"
              />
            </ComponentShowcase>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UX Component Library
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Production-ready React/TypeScript components with animations, accessibility,
            and mobile optimization built for modern web applications.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <UXLibrary.Mobile.TouchTabBar
            items={tabItems}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
            className="justify-center"
          />
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Features Overview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MenuIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Navigation</h3>
            <p className="text-sm text-gray-600">
              Advanced navigation components with mega menus and animations
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile First</h3>
            <p className="text-sm text-gray-600">
              Touch-optimized components with haptic feedback and gestures
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Accessibility className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Accessible</h3>
            <p className="text-sm text-gray-600">
              WCAG 2.1 AA compliant with screen reader and keyboard support
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Production Ready</h3>
            <p className="text-sm text-gray-600">
              TypeScript, testing, and documentation included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UXShowcase;