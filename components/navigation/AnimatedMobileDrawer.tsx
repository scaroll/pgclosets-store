/**
 * Animated Mobile Drawer
 *
 * Enhanced mobile drawer with Apple-quality animations using framer-motion
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronDown } from 'lucide-react';
import { PGLogo } from '../ui/pg-logo';
import { cn } from '@/lib/utils';
import { drawerTransition, backdropTransition } from '@/lib/animations/transitions';
import { staggerChildrenScroll, staggerItemScroll } from '@/lib/animations/scroll-animations';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const mobileNavItems = [
  {
    label: 'Products',
    items: [
      { label: 'Barn Doors', href: '/collections/renin-barn-doors' },
      { label: 'Bypass Doors', href: '/collections/renin-bypass-doors' },
      { label: 'Bifold Doors', href: '/collections/renin-bifold-doors' },
      { label: 'All Products', href: '/products' },
    ],
  },
  {
    label: 'Services',
    items: [
      { label: 'Design Consultation', href: '/services/consultation' },
      { label: 'Custom Design', href: '/services/custom-design' },
      { label: 'Installation', href: '/services/installation' },
      { label: 'Warranty', href: '/services/warranty' },
    ],
  },
];

export function AnimatedMobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setExpandedSections([]); // Reset expanded sections on close
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with smooth fade */}
          <motion.div
            variants={backdropTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Drawer with slide animation */}
          <motion.div
            variants={drawerTransition.left}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-0 left-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Header with slide animation */}
            <motion.div
              className="sticky top-0 bg-white border-b border-gray-100 z-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between p-4">
                <Link href="/" onClick={onClose} className="flex items-center gap-2 group">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <PGLogo width={32} height={32} withWordmark={false} className="text-black" />
                  </motion.div>
                  <span className="text-lg font-bold tracking-[0.2em]">PG CLOSETS</span>
                </Link>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                  aria-label="Close menu"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.button>
              </div>
            </motion.div>

            {/* Navigation with stagger animation */}
            <motion.nav
              className="p-6"
              variants={staggerChildrenScroll}
              initial="hidden"
              animate="visible"
            >
              <div className="space-y-6">
                {/* Home Link */}
                <motion.div variants={staggerItemScroll}>
                  <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center justify-between py-3 text-base font-medium text-gray-900 hover:text-black transition-colors group"
                  >
                    Home
                    <motion.div
                      className="text-gray-400 group-hover:text-black"
                      whileHover={{ x: 5 }}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </Link>
                </motion.div>

                {/* Expandable Sections */}
                {mobileNavItems.map((section, sectionIndex) => {
                  const isExpanded = expandedSections.includes(section.label);

                  return (
                    <motion.div
                      key={section.label}
                      variants={staggerItemScroll}
                      className="space-y-2"
                    >
                      <motion.button
                        onClick={() => toggleSection(section.label)}
                        className="flex items-center justify-between w-full py-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-black transition-colors"
                        whileTap={{ scale: 0.98 }}
                      >
                        {section.label}
                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </motion.button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                            className="space-y-2 pl-2 overflow-hidden"
                          >
                            {section.items.map((item, itemIndex) => (
                              <motion.li
                                key={item.href}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: itemIndex * 0.05 }}
                              >
                                <Link
                                  href={item.href}
                                  onClick={onClose}
                                  className="flex items-center justify-between py-2.5 text-sm text-gray-700 hover:text-black transition-colors group"
                                >
                                  {item.label}
                                  <motion.div
                                    className="text-gray-300 group-hover:text-black"
                                    whileHover={{ x: 3 }}
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </motion.div>
                                </Link>
                              </motion.li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}

                {/* Simple links */}
                <motion.div
                  variants={staggerItemScroll}
                  className="space-y-2 pt-4 border-t border-gray-100"
                >
                  {['About', 'Gallery', 'Contact'].map((item) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      onClick={onClose}
                      className="flex items-center justify-between py-3 text-base font-medium text-gray-900 hover:text-black transition-colors group"
                    >
                      {item}
                      <motion.div
                        className="text-gray-400 group-hover:text-black"
                        whileHover={{ x: 5 }}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </motion.div>
                    </Link>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  variants={staggerItemScroll}
                  className="pt-6 border-t border-gray-100"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/request-work"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 w-full bg-black text-white px-6 py-4 text-sm font-bold tracking-wide hover:bg-gray-800 transition-colors rounded-lg"
                    >
                      GET FREE QUOTE
                      <motion.svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </motion.svg>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Contact info */}
                <motion.div
                  variants={staggerItemScroll}
                  className="pt-6 pb-8 border-t border-gray-100"
                >
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="block text-center text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Questions? <span className="font-semibold">Email Us</span>
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
