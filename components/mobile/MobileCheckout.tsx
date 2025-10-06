'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Check, Lock, ChevronRight, Apple, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TouchButton } from './TouchOptimized';

interface CheckoutOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  recommended?: boolean;
}

interface MobileCheckoutProps {
  total: number;
  currency?: string;
  onCheckout: (method: string) => Promise<void>;
  className?: string;
}

/**
 * Mobile Checkout Component
 * Optimized for one-tap mobile checkout with popular payment methods
 * Features:
 * - One-tap payment options (Apple Pay, Google Pay, Shop Pay)
 * - Touch-optimized payment method selection
 * - Progressive disclosure for form fields
 * - Haptic feedback on interactions
 * - Secure payment indicators
 * - Fast checkout flow optimization
 */
export function MobileCheckout({
  total,
  currency = 'CAD',
  onCheckout,
  className
}: MobileCheckoutProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('apple-pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const checkoutOptions: CheckoutOption[] = [
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      icon: <Apple className="w-6 h-6" />,
      description: 'Fast & secure with Face ID',
      recommended: true
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      icon: <Wallet className="w-6 h-6" />,
      description: 'One-tap checkout',
      recommended: true
    },
    {
      id: 'card',
      name: 'Credit Card',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, Amex'
    },
    {
      id: 'sms',
      name: 'Shop Pay',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Fast checkout via SMS'
    }
  ];

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }

    try {
      await onCheckout(selectedMethod);
      setShowConfirmation(true);

      // Success haptic
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
      }
    } catch (error) {
      // Error haptic
      if (navigator.vibrate) {
        navigator.vibrate([200]);
      }
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-4 safe-area-inset">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Checkout</h2>
            <p className="text-sm text-gray-600">Secure payment</p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Lock className="w-4 h-4" />
            <span className="text-xs font-medium">Encrypted</span>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-4 bg-gradient-to-br from-pg-navy/5 to-pg-sky/5 border-b border-gray-200">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-gray-600">Total Amount</span>
          <div className="text-right">
            <div className="text-3xl font-bold text-pg-navy">
              {formatCurrency(total)}
            </div>
            <div className="text-xs text-gray-600">Including taxes</div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-900 mb-3">
          Payment Method
        </h3>

        {checkoutOptions.map((option) => (
          <motion.button
            key={option.id}
            onClick={() => {
              setSelectedMethod(option.id);
              if (navigator.vibrate) navigator.vibrate(10);
            }}
            className={cn(
              'w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200',
              'touch-manipulation select-none',
              selectedMethod === option.id
                ? 'border-pg-navy bg-pg-navy/5'
                : 'border-gray-200 bg-white',
              'active:scale-98'
            )}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div className={cn(
                'flex items-center justify-center w-12 h-12 rounded-full',
                selectedMethod === option.id
                  ? 'bg-pg-navy text-white'
                  : 'bg-gray-100 text-gray-600'
              )}>
                {option.icon}
              </div>

              {/* Details */}
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {option.name}
                  </span>
                  {option.recommended && (
                    <span className="px-2 py-0.5 text-xs font-medium text-pg-navy bg-pg-sky/20 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {option.description}
                </p>
              </div>
            </div>

            {/* Selection Indicator */}
            <div className={cn(
              'flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all',
              selectedMethod === option.id
                ? 'border-pg-navy bg-pg-navy'
                : 'border-gray-300'
            )}>
              {selectedMethod === option.id && (
                <Check className="w-full h-full text-white p-0.5" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Security Info */}
      <div className="p-4 mx-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-900">
              Your payment is secure
            </h4>
            <p className="text-xs text-green-700 mt-1">
              All transactions are encrypted and PCI DSS compliant.
              Your card details are never stored on our servers.
            </p>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200 safe-area-inset">
        <TouchButton
          onClick={handleCheckout}
          disabled={isProcessing}
          variant="primary"
          size="lg"
          className="w-full bg-pg-navy text-white hover:bg-pg-navy/90"
          haptic
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <span className="font-semibold">
                Pay {formatCurrency(total)}
              </span>
              <ChevronRight className="w-5 h-5" />
            </div>
          )}
        </TouchButton>

        <p className="text-xs text-center text-gray-600 mt-3">
          By completing this purchase you agree to our{' '}
          <a href="/terms" className="text-pg-navy underline">
            Terms of Service
          </a>
        </p>
      </div>

      {/* Success Confirmation */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                Your order has been confirmed and will be processed shortly.
              </p>
              <TouchButton
                onClick={() => setShowConfirmation(false)}
                variant="primary"
                size="lg"
                className="w-full bg-pg-navy text-white"
              >
                View Order
              </TouchButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MobileCheckout;
