'use client';

/**
 * PWA Install Prompt Component
 * Smart progressive web app installation promotion
 *
 * @module components/mobile/PWAInstallPrompt
 * @agent Agent #15 - Mobile Experience & PWA
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HapticFeedback } from '@/lib/mobile/gestures';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAInstallPromptProps {
  onInstall?: () => void;
  onDismiss?: () => void;
  className?: string;
  // Show after N page views (default: 3)
  minPageViews?: number;
  // Show after N minutes on site (default: 5)
  minTimeOnSite?: number;
  // Days before showing again after dismiss (default: 7)
  dismissCooldown?: number;
}

export function PWAInstallPrompt({
  onInstall,
  onDismiss,
  className,
  minPageViews = 3,
  minTimeOnSite = 5,
  dismissCooldown = 7,
}: PWAInstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    setIsStandalone(checkStandalone);

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check eligibility to show prompt
    if (!checkStandalone && shouldShowPrompt()) {
      // For Chrome/Edge/Samsung Internet
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      window.addEventListener('beforeinstallprompt', handler);

      // Show prompt after delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
        HapticFeedback.trigger('light');
      }, 2000);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(timer);
      };
    }
  }, []);

  /**
   * Check if we should show the prompt based on user behavior
   */
  function shouldShowPrompt(): boolean {
    try {
      // Check if dismissed recently
      const lastDismissed = localStorage.getItem('pwa-install-dismissed');
      if (lastDismissed) {
        const daysSinceDismiss =
          (Date.now() - parseInt(lastDismissed)) / (1000 * 60 * 60 * 24);
        if (daysSinceDismiss < dismissCooldown) {
          return false;
        }
      }

      // Check if already installed
      if (localStorage.getItem('pwa-installed')) {
        return false;
      }

      // Check page views
      const pageViews = parseInt(localStorage.getItem('page-views') || '0');
      if (pageViews < minPageViews) {
        localStorage.setItem('page-views', (pageViews + 1).toString());
        return false;
      }

      // Check time on site
      const sessionStart = parseInt(localStorage.getItem('session-start') || Date.now().toString());
      if (!sessionStart) {
        localStorage.setItem('session-start', Date.now().toString());
        return false;
      }

      const minutesOnSite = (Date.now() - sessionStart) / (1000 * 60);
      if (minutesOnSite < minTimeOnSite) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking prompt eligibility:', error);
      return false;
    }
  }

  /**
   * Handle install button click
   */
  async function handleInstall() {
    if (!deferredPrompt && !isIOS) return;

    HapticFeedback.trigger('medium');

    if (isIOS) {
      // iOS - show instructions
      return;
    }

    // Chrome/Edge/Samsung
    try {
      await deferredPrompt!.prompt();
      const choiceResult = await deferredPrompt!.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('PWA installed');
        localStorage.setItem('pwa-installed', 'true');
        HapticFeedback.trigger('success');
        onInstall?.();
      } else {
        console.log('PWA installation dismissed');
        handleDismiss();
      }

      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error installing PWA:', error);
    }
  }

  /**
   * Handle dismiss
   */
  function handleDismiss() {
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    setShowPrompt(false);
    HapticFeedback.trigger('light');
    onDismiss?.();
  }

  // Don't show if already installed or not eligible
  if (!showPrompt || isStandalone) {
    return null;
  }

  // iOS-specific prompt
  if (isIOS) {
    return (
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-200 shadow-2xl animate-slide-up safe-area-inset-bottom',
          className
        )}
      >
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Install PG Closets
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Add to your home screen for quick access and offline support.
              </p>

              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-700 mb-2 font-medium">
                  To install:
                </p>
                <ol className="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
                  <li>Tap the Share button in Safari</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" in the top right</li>
                </ol>
              </div>

              <button
                onClick={handleDismiss}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Maybe Later
              </button>
            </div>

            <button
              onClick={handleDismiss}
              className="p-2 -mt-1 -mr-1 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chrome/Edge/Samsung prompt
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl animate-slide-up safe-area-inset-bottom',
        className
      )}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-blue-600"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1">
              Install PG Closets App
            </h3>
            <p className="text-sm text-blue-100">
              Quick access, offline support, and a better experience!
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 active:bg-blue-100 transition-colors min-h-[52px] whitespace-nowrap"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-3 rounded-lg hover:bg-blue-600 transition-colors min-w-[52px] min-h-[52px] flex items-center justify-center"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Check if app is installed
 */
export function useIsPWAInstalled(): boolean {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    setIsInstalled(checkInstalled);
  }, []);

  return isInstalled;
}
