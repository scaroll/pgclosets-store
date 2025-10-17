/**
 * UI Component Showcase
 *
 * Demonstrates all UI components with various configurations
 * Use this as a reference for component usage and styling
 *
 * This is a development-only component for documentation purposes
 */

'use client';

import React, { useState } from 'react';
import {
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalTrigger,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  DropdownCheckboxItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SimpleTooltip,
  KeyboardTooltip,
  RichTooltip,
  TooltipProvider,
} from './index';
import {
  Check,
  Settings,
  User,
  LogOut,
  Star,
  Sparkles,
} from 'lucide-react';

/**
 * Badge Examples
 */
function BadgeExamples() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-apple-21 font-semibold mb-4 text-apple-gray-900 dark:text-apple-dark-text">
          Badges
        </h3>

        {/* Variants */}
        <div className="space-y-4">
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              Variants
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="premium">Premium</Badge>
            </div>
          </div>

          {/* With Dots */}
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              With Status Dots
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" showDot>
                Online
              </Badge>
              <Badge variant="warning" showDot>
                Away
              </Badge>
              <Badge variant="error" showDot>
                Offline
              </Badge>
            </div>
          </div>

          {/* With Icons */}
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              With Icons
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" icon={<Check className="h-3 w-3" />}>
                Verified
              </Badge>
              <Badge variant="premium" icon={<Star className="h-3 w-3" />}>
                Premium
              </Badge>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              Sizes
            </h4>
            <div className="flex items-center flex-wrap gap-2">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Modal Examples
 */
function ModalExamples() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-apple-21 font-semibold mb-4 text-apple-gray-900 dark:text-apple-dark-text">
          Modals
        </h3>

        {/* Basic Modal */}
        <Modal open={isOpen} onOpenChange={setIsOpen}>
          <ModalTrigger asChild>
            <button className="px-4 py-2 bg-apple-blue-600 text-white rounded-apple-sm hover:bg-apple-blue-500 transition-colors">
              Open Modal
            </button>
          </ModalTrigger>
          <ModalContent size="md">
            <ModalHeader>
              <ModalTitle>Confirm Action</ModalTitle>
              <ModalDescription>
                Are you sure you want to proceed with this action? This cannot be
                undone.
              </ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p className="text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                Additional content can go here. This modal demonstrates the glass
                morphism effect with backdrop blur.
              </p>
            </ModalBody>
            <ModalFooter>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-apple-gray-700 dark:text-apple-dark-text-secondary hover:bg-apple-gray-100 dark:hover:bg-apple-dark-bg-tertiary rounded-apple-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-apple-blue-600 text-white rounded-apple-sm hover:bg-apple-blue-500 transition-colors"
              >
                Confirm
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </section>
  );
}

/**
 * Dropdown Examples
 */
function DropdownExamples() {
  const [notifications, setNotifications] = useState(true);

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-apple-21 font-semibold mb-4 text-apple-gray-900 dark:text-apple-dark-text">
          Dropdowns
        </h3>

        {/* Basic Dropdown */}
        <Dropdown>
          <DropdownTrigger asChild>
            <button className="px-4 py-2 bg-apple-gray-200 dark:bg-apple-dark-bg-tertiary text-apple-gray-900 dark:text-apple-dark-text rounded-apple-sm hover:bg-apple-gray-300 dark:hover:bg-apple-dark-bg-secondary transition-colors">
              Open Menu
            </button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>My Account</DropdownLabel>
            <DropdownSeparator />
            <DropdownItem icon={<User className="h-4 w-4" />}>
              Profile
            </DropdownItem>
            <DropdownItem
              icon={<Settings className="h-4 w-4" />}
              shortcut="⌘S"
            >
              Settings
            </DropdownItem>
            <DropdownSeparator />
            <DropdownCheckboxItem
              checked={notifications}
              onCheckedChange={setNotifications}
            >
              Notifications
            </DropdownCheckboxItem>
            <DropdownSeparator />
            <DropdownItem destructive icon={<LogOut className="h-4 w-4" />}>
              Logout
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </section>
  );
}

/**
 * Tabs Examples
 */
function TabsExamples() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-apple-21 font-semibold mb-4 text-apple-gray-900 dark:text-apple-dark-text">
          Tabs
        </h3>

        {/* Line Tabs */}
        <div className="space-y-4">
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              Line Tabs (Default)
            </h4>
            <Tabs defaultValue="tab1">
              <TabsList variant="line">
                <TabsTrigger value="tab1" variant="line">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="tab2" variant="line" badge="3">
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="tab3" variant="line">
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  Overview content goes here.
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  You have 3 new notifications.
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  Settings content goes here.
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Pills Tabs */}
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              Pills Tabs
            </h4>
            <Tabs defaultValue="tab1">
              <TabsList variant="pills">
                <TabsTrigger value="tab1" variant="pills">
                  Features
                </TabsTrigger>
                <TabsTrigger value="tab2" variant="pills">
                  Pricing
                </TabsTrigger>
                <TabsTrigger value="tab3" variant="pills">
                  Support
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  Features content.
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  Pricing content.
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  Support content.
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enclosed Tabs */}
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              Enclosed Tabs
            </h4>
            <Tabs defaultValue="tab1">
              <TabsList variant="enclosed">
                <TabsTrigger value="tab1" variant="enclosed">
                  Day
                </TabsTrigger>
                <TabsTrigger value="tab2" variant="enclosed">
                  Week
                </TabsTrigger>
                <TabsTrigger value="tab3" variant="enclosed">
                  Month
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  Daily statistics.
                </div>
              </TabsContent>
              <TabsContent value="tab2">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  Weekly statistics.
                </div>
              </TabsContent>
              <TabsContent value="tab3">
                <div className="py-4 text-apple-15 text-apple-gray-700 dark:text-apple-dark-text-secondary">
                  Monthly statistics.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Tooltip Examples
 */
function TooltipExamples() {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-apple-21 font-semibold mb-4 text-apple-gray-900 dark:text-apple-dark-text">
          Tooltips
        </h3>

        <div className="space-y-4">
          {/* Simple Tooltip */}
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              Simple Tooltip
            </h4>
            <div className="flex gap-4">
              <SimpleTooltip content="Click to edit">
                <button className="px-4 py-2 bg-apple-gray-200 dark:bg-apple-dark-bg-tertiary rounded-apple-sm">
                  Hover me
                </button>
              </SimpleTooltip>
            </div>
          </div>

          {/* Keyboard Shortcut */}
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              Keyboard Shortcut
            </h4>
            <div className="flex gap-4">
              <KeyboardTooltip keys={['⌘', 'K']} description="Quick search">
                <button className="px-4 py-2 bg-apple-gray-200 dark:bg-apple-dark-bg-tertiary rounded-apple-sm">
                  Search
                </button>
              </KeyboardTooltip>
            </div>
          </div>

          {/* Rich Tooltip */}
          <div>
            <h4 className="text-apple-15 font-medium mb-2 text-apple-gray-700 dark:text-apple-dark-text-secondary">
              Rich Tooltip
            </h4>
            <div className="flex gap-4">
              <RichTooltip
                title="Premium Feature"
                description="Upgrade to access advanced analytics and reporting"
                icon={<Sparkles className="h-4 w-4" />}
              >
                <button className="px-4 py-2 bg-apple-gray-200 dark:bg-apple-dark-bg-tertiary rounded-apple-sm">
                  Analytics
                </button>
              </RichTooltip>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Main Showcase Component
 */
export default function UIShowcase() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-white dark:bg-apple-dark-bg p-8">
        <div className="max-w-apple-content mx-auto space-y-12">
          <header>
            <h1 className="text-apple-48 font-bold text-apple-gray-900 dark:text-apple-dark-text mb-2">
              UI Component Library
            </h1>
            <p className="text-apple-17 text-apple-gray-600 dark:text-apple-dark-text-secondary">
              Apple-inspired React components with TypeScript, dark mode, and
              accessibility
            </p>
          </header>

          <BadgeExamples />
          <ModalExamples />
          <DropdownExamples />
          <TabsExamples />
          <TooltipExamples />

          <footer className="pt-12 border-t border-apple-gray-200 dark:border-apple-dark-border">
            <p className="text-apple-15 text-apple-gray-600 dark:text-apple-dark-text-secondary">
              All components support dark mode, keyboard navigation, and screen
              readers.
            </p>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}
