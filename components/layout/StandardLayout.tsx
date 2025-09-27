import React from 'react';
import PgHeader from '@/components/PgHeader';
import PgFooter from '@/components/PgFooter';

interface StandardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Standard layout wrapper that ensures consistent PgHeader/PgFooter
 * across all pages. Use this instead of manually adding header/footer
 * to each page.
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
      <PgFooter />
    </div>
  );
};

export default StandardLayout;