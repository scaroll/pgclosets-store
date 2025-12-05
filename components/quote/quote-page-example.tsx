'use client';

/**
 * Example Quote Request Page
 *
 * This is an example implementation showing how to use the QuoteRequestForm component
 * in a full page layout with proper styling and structure.
 */

import { QuoteRequestForm } from './quote-request-form';

export default function QuotePageExample() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-apple-gray-100 to-white dark:from-apple-dark-bg-primary dark:to-apple-dark-bg-secondary">
      {/* Header Section */}
      <div className="bg-white dark:bg-apple-dark-bg-secondary border-b border-apple-gray-200 dark:border-apple-dark-border">
        <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-apple-gray-900 dark:text-apple-dark-text-primary tracking-tight">
              Request a Free Quote
            </h1>
            <p className="text-lg md:text-xl text-apple-gray-600 dark:text-apple-dark-text-secondary max-w-2xl mx-auto">
              Get a personalized quote for your closet doors project. Our team will review your request and contact you within 24-48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <div className="bg-white dark:bg-apple-dark-bg-secondary rounded-3xl shadow-2xl p-6 md:p-10 border border-apple-gray-200 dark:border-apple-dark-border">
          <QuoteRequestForm
            onSuccess={(data) => {
              console.log('Quote request submitted:', data);
              // You can add custom success handling here
              // For example: redirect to a thank you page
              // router.push('/thank-you');
            }}
          />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white dark:bg-apple-dark-bg-secondary rounded-2xl border border-apple-gray-200 dark:border-apple-dark-border">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-950/20 mb-4">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-apple-gray-900 dark:text-apple-dark-text-primary">
              Fast Response
            </h3>
            <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
              Get your quote within 24-48 hours
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-apple-dark-bg-secondary rounded-2xl border border-apple-gray-200 dark:border-apple-dark-border">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-950/20 mb-4">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-apple-gray-900 dark:text-apple-dark-text-primary">
              No Obligation
            </h3>
            <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
              Free quotes with no commitment required
            </p>
          </div>

          <div className="text-center p-6 bg-white dark:bg-apple-dark-bg-secondary rounded-2xl border border-apple-gray-200 dark:border-apple-dark-border">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-950/20 mb-4">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-apple-gray-900 dark:text-apple-dark-text-primary">
              Expert Advice
            </h3>
            <p className="text-sm text-apple-gray-600 dark:text-apple-dark-text-secondary">
              Professional guidance from our team
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="container mx-auto px-4 pb-16 max-w-4xl">
        <div className="bg-blue-50 dark:bg-blue-950/10 border border-blue-200 dark:border-blue-900 rounded-2xl p-8">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 uppercase tracking-wide">
              Why Choose Us?
            </p>
            <p className="text-base text-blue-800 dark:text-blue-200">
              Over 1,000+ satisfied customers in the Ottawa region. Premium quality products from trusted manufacturers like Renin. Professional installation available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
