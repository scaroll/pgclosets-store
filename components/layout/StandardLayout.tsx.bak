"use client"

import { EnhancedFooter } from '@/components/navigation/EnhancedFooter';
import PgHeader from '@/components/PgHeader';
import React from 'react';

interface StandardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard layout wrapper that ensures consistent PgHeader/EnhancedFooter
 * across all pages. Use this instead of manually adding header/footer
 * to each page.
 *
 * Updated to use EnhancedFooter with:
 * - Multi-column responsive layout
 * - Newsletter signup
 * - Complete product/service navigation
 * - Trust badges and social links
 * - Scroll to top functionality
 */
const StandardLayout: React.FC<StandardLayoutProps> = ({
  children,
  className = ""
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:z-50"
      >
        Skip to main content
      </a>
      <PgHeader />
      <main id="main-content" className={`flex-grow ${className}`}>
        {children}
      </main>
      <EnhancedFooter />
    </div>
  );
};

export default StandardLayout;