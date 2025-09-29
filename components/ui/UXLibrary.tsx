"use client";

import React from 'react';

// Import all UX components
import MegaMenu, { PRODUCTS_MEGA_MENU } from '../navigation/MegaMenu';
import ProductQuickView from '../product/ProductQuickView';
import { InteractiveForm } from '../forms/InteractiveForm';
import TouchOptimized from '../mobile/TouchOptimized';
import AccessibilityComponents from '../accessibility/AccessibilityComponents';

// Export main UX library
export const UXLibrary = {
  // Navigation Components
  Navigation: {
    MegaMenu,
    PRODUCTS_MEGA_MENU,
  },

  // Product Components
  Product: {
    QuickView: ProductQuickView,
  },

  // Form Components
  Forms: {
    InteractiveForm,
  },

  // Mobile Components
  Mobile: {
    TouchButton: TouchOptimized.TouchButton,
    SwipeableCard: TouchOptimized.SwipeableCard,
    PullToRefresh: TouchOptimized.PullToRefresh,
    TouchSlider: TouchOptimized.TouchSlider,
    TouchTabBar: TouchOptimized.TouchTabBar,
    BottomSheet: TouchOptimized.BottomSheet,
  },

  // Accessibility Components
  Accessibility: {
    Provider: AccessibilityComponents.AccessibilityProvider,
    useAccessibility: AccessibilityComponents.useAccessibility,
    ScreenReaderOnly: AccessibilityComponents.ScreenReaderOnly,
    FocusTrap: AccessibilityComponents.FocusTrap,
    SkipNavigation: AccessibilityComponents.SkipNavigation,
    AccessibleButton: AccessibilityComponents.AccessibleButton,
    AccessibleModal: AccessibilityComponents.AccessibleModal,
    ColorContrastValidator: AccessibilityComponents.ColorContrastValidator,
    AccessibleTable: AccessibilityComponents.AccessibleTable,
    AccessibleProgress: AccessibilityComponents.AccessibleProgress,
    SettingsPanel: AccessibilityComponents.AccessibilitySettingsPanel,
  },
};

// Convenience exports for individual components
export const {
  Navigation,
  Product,
  Forms,
  Mobile,
  Accessibility,
} = UXLibrary;

// Export everything for direct imports
export {
  MegaMenu,
  PRODUCTS_MEGA_MENU,
  ProductQuickView,
  InteractiveForm,
  TouchOptimized,
  AccessibilityComponents,
};

export default UXLibrary;