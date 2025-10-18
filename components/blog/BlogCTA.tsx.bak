/**
 * Blog CTA Component
 * Conversion-focused call to action within articles
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

interface BlogCTAProps {
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  variant?: 'primary' | 'secondary';
  showPhone?: boolean;
}

export function BlogCTA({
  title,
  description,
  ctaText,
  ctaLink,
  variant = 'primary',
  showPhone = true,
}: BlogCTAProps) {
  const bgGradient =
    variant === 'primary'
      ? 'bg-gradient-to-br from-blue-600 to-blue-800'
      : 'bg-gradient-to-br from-gray-800 to-gray-900';

  return (
    <div className={`${bgGradient} rounded-lg p-8 md:p-10 text-white`}>
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-xl text-blue-100 mb-8">{description}</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors"
          >
            {ctaText}
            <ArrowRight className="w-5 h-5" />
          </Link>

          {showPhone && (
            <a
              href="tel:+16135550100"
              className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              (613) 555-0100
            </a>
          )}
        </div>

        <p className="mt-6 text-sm text-blue-200">
          Free consultation • No obligation • Expert advice
        </p>
      </div>
    </div>
  );
}
