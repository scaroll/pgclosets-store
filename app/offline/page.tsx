'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/ui/button'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center text-white">
        <div className="mb-8">
          {/* Offline Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M18 6L6 18"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-light mb-4 text-white">
            You're Currently Offline
          </h1>

          <p className="text-lg text-white mb-8 leading-relaxed">
            Don't worry! You can still browse previously visited pages and
            explore our cached content while offline.
          </p>
        </div>

        {/* Available Actions */}
        <div className="space-y-4 mb-8">
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
            size="lg"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/products"
              className="block p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 backdrop-blur-sm"
            >
              <div className="text-sm font-medium">Products</div>
              <div className="text-xs text-slate-200">Browse catalog</div>
            </Link>

            <Link
              href="/contact"
              className="block p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/20 backdrop-blur-sm"
            >
              <div className="text-sm font-medium">Contact</div>
              <div className="text-xs text-slate-200">Get in touch</div>
            </Link>
          </div>
        </div>

        {/* Features Available Offline */}
        <div className="text-left bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
          <h3 className="text-lg font-medium mb-4 text-center">Available Offline</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Browse cached product pages</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">View business information</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-white">Access saved project gallery</span>
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-slate-200">Form submissions will sync when online</span>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-6 text-center">
          <div id="connection-status" className="text-sm text-slate-300">
            <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-2" />
            Offline - Checking connection...
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Connection status monitoring
            function updateConnectionStatus() {
              const statusElement = document.getElementById('connection-status');
              if (!statusElement) return;

              if (navigator.onLine) {
                statusElement.innerHTML = '<span class="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>Back online - Redirecting...';
                setTimeout(() => {
                  window.location.href = '/';
                }, 1000);
              } else {
                statusElement.innerHTML = '<span class="inline-block w-2 h-2 bg-red-400 rounded-full mr-2"></span>Offline - Will auto-redirect when connected';
              }
            }

            // Monitor connection changes
            window.addEventListener('online', updateConnectionStatus);
            window.addEventListener('offline', updateConnectionStatus);

            // Check connection periodically
            setInterval(updateConnectionStatus, 3000);

            // Initial check
            updateConnectionStatus();

            // Service Worker registration check
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.ready.then(registration => {
                console.log('Service Worker ready:', registration);
              });
            }
          `,
        }}
      />
    </div>
  )
}