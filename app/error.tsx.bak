'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="container-max text-center">
        <div className="max-w-2xl mx-auto">
          {/* Error Icon */}
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="heading-2 text-gray-900 mb-4">Something went wrong!</h1>
          <p className="body-large text-gray-600 mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
            Please try again or contact support if the problem persists.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-red-50 rounded-lg text-left">
              <p className="font-mono text-sm text-red-800 break-all">
                {error.message || 'Unknown error'}
              </p>
              {error.digest && (
                <p className="font-mono text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="btn-primary"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="btn-secondary"
            >
              Go to Home
            </Link>
            <Link
              href="/contact"
              className="btn-ghost"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}