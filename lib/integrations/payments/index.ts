/**
 * Payment Processing Integration Hub
 * Centralizes all payment processors and provides unified interface
 */

import Stripe from 'stripe';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { App as SquareApp, Card as SquareCard } from '@square/web-sdk';
import { AdyenCheckout, Card as AdyenCard } from '@adyen/adyen-web';

// Payment Processor Configuration
export interface PaymentConfig {
  stripe?: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  paypal?: {
    clientId: string;
    clientSecret: string;
    sandbox: boolean;
  };
  square?: {
    applicationId: string;
    accessToken: string;
    locationId: string;
  };
  adyen?: {
    clientKey: string;
    environment: 'test' | 'live';
    originKey: string;
  };
  applePay?: {
    merchantId: string;
    countryCode: string;
    currencyCode: string;
  };
  googlePay?: {
    merchantId: string;
    merchantName: string;
    gateway: string;
  };
}

export class PaymentProcessorHub {
  private config: PaymentConfig;
  private stripe: Stripe | null = null;
  private squareApp: SquareApp | null = null;
  private adyenCheckout: AdyenCheckout | null = null;

  constructor(config: PaymentConfig) {
    this.config = config;
    this.initializeProcessors();
  }

  private initializeProcessors() {
    // Initialize Stripe
    if (this.config.stripe) {
      this.stripe = new Stripe(this.config.stripe.secretKey, {
        apiVersion: '2024-06-20',
      });
    }

    // Initialize Square
    if (this.config.square) {
      this.squareApp = new SquareApp({
        applicationId: this.config.square.applicationId,
        locationId: this.config.square.locationId,
      });
    }

    // Initialize Adyen for Afterpay/Klarna
    if (this.config.adyen) {
      this.adyenCheckout = new AdyenCheckout({
        clientKey: this.config.adyen.clientKey,
        environment: this.config.adyen.environment,
      });
    }
  }

  // Stripe Methods
  async createStripePaymentIntent(amount: number, currency: string, metadata?: Record<string, string>) {
    if (!this.stripe) throw new Error('Stripe not initialized');

    return this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  }

  async confirmStripePayment(paymentIntentId: string) {
    if (!this.stripe) throw new Error('Stripe not initialized');

    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  async createStripeCustomer(email: string, name?: string) {
    if (!this.stripe) throw new Error('Stripe not initialized');

    return this.stripe.customers.create({
      email,
      name,
    });
  }

  // PayPal Methods
  createPayPalOrder(amount: number, currency: string) {
    return {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
      }],
    };
  }

  async capturePayPalOrder(orderId: string) {
    const response = await fetch(`/api/paypal/capture/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.json();
  }

  // Square Methods
  async createSquarePayment(amount: number, currency: string, sourceId: string) {
    const response = await fetch('/api/square/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sourceId,
        amountMoney: {
          amount: Math.round(amount * 100),
          currency,
        },
        locationId: this.config.square?.locationId,
      }),
    });

    return response.json();
  }

  // Adyen Methods (for Afterpay/Klarna)
  async createAdyenPayment(amount: number, currency: string, paymentMethod: any) {
    const response = await fetch('/api/adyen/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: {
          value: Math.round(amount * 100),
          currency,
        },
        paymentMethod,
        reference: `order_${Date.now()}`,
        merchantAccount: 'YOUR_MERCHANT_ACCOUNT',
        returnUrl: window.location.href,
      }),
    });

    return response.json();
  }

  // Apple Pay Setup
  setupApplePay(amount: number, currency: string) {
    if (!this.config.applePay) throw new Error('Apple Pay not configured');

    const paymentRequest = {
      countryCode: this.config.applePay.countryCode,
      currencyCode: this.config.applePay.currencyCode,
      supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: 'PG Closets',
        amount: amount.toFixed(2),
      },
    };

    return paymentRequest;
  }

  // Google Pay Setup
  setupGooglePay(amount: number, currency: string) {
    if (!this.config.googlePay) throw new Error('Google Pay not configured');

    const baseRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
    };

    const allowedPaymentMethods = [
      {
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['MASTERCARD', 'VISA'],
        },
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          parameters: {
            gateway: this.config.googlePay.gateway,
            gatewayMerchantId: this.config.googlePay.merchantId,
          },
        },
      },
    ];

    return {
      baseRequest,
      allowedPaymentMethods,
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: amount.toFixed(2),
        currencyCode: currency,
        countryCode: 'US',
      },
      merchantInfo: {
        merchantName: this.config.googlePay.merchantName,
        merchantId: this.config.googlePay.merchantId,
      },
    };
  }

  // Unified Payment Method
  async processPayment(paymentType: string, paymentData: any) {
    try {
      switch (paymentType) {
        case 'stripe':
          return await this.createStripePaymentIntent(
            paymentData.amount,
            paymentData.currency,
            paymentData.metadata
          );

        case 'paypal':
          const paypalOrder = this.createPayPalOrder(
            paymentData.amount,
            paymentData.currency
          );
          return paypalOrder;

        case 'square':
          return await this.createSquarePayment(
            paymentData.amount,
            paymentData.currency,
            paymentData.sourceId
          );

        case 'adyen':
          return await this.createAdyenPayment(
            paymentData.amount,
            paymentData.currency,
            paymentData.paymentMethod
          );

        default:
          throw new Error(`Unsupported payment type: ${paymentType}`);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      throw error;
    }
  }

  // Webhook Handling
  async handleWebhook(provider: string, signature: string, payload: any) {
    try {
      switch (provider) {
        case 'stripe':
          if (!this.config.stripe) throw new Error('Stripe not configured');
          return this.stripe.webhooks.constructEvent(
            payload,
            signature,
            this.config.stripe.webhookSecret
          );

        case 'paypal':
          // PayPal webhook verification
          return this.verifyPayPalWebhook(signature, payload);

        case 'square':
          // Square webhook verification
          return this.verifySquareWebhook(signature, payload);

        default:
          throw new Error(`Webhook handling for ${provider} not implemented`);
      }
    } catch (error) {
      console.error('Webhook handling error:', error);
      throw error;
    }
  }

  private async verifyPayPalWebhook(signature: string, payload: any) {
    // Implement PayPal webhook verification
    return JSON.parse(payload);
  }

  private async verifySquareWebhook(signature: string, payload: any) {
    // Implement Square webhook verification
    return JSON.parse(payload);
  }

  // Payment Method Validation
  validatePaymentMethod(paymentType: string, paymentData: any): boolean {
    switch (paymentType) {
      case 'stripe':
        return !!(paymentData.amount && paymentData.currency);

      case 'paypal':
        return !!(paymentData.amount && paymentData.currency);

      case 'square':
        return !!(paymentData.amount && paymentData.currency && paymentData.sourceId);

      case 'adyen':
        return !!(paymentData.amount && paymentData.currency && paymentData.paymentMethod);

      default:
        return false;
    }
  }

  // Error Handling
  handlePaymentError(error: any, provider: string) {
    console.error(`${provider} payment error:`, error);

    // Standardized error format
    return {
      provider,
      error: true,
      message: error.message || 'Payment failed',
      code: error.code || 'PAYMENT_ERROR',
      details: error,
    };
  }
}

// React Components for Payment Buttons
export const PayPalButton = ({ amount, currency, onSuccess, onError }: any) => {
  return (
    <PayPalButtons
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount.toFixed(2),
              currency_code: currency,
            },
          }],
        });
      }}
      onApprove={async (data, actions) => {
        try {
          const details = await actions.order.capture();
          onSuccess(details);
        } catch (error) {
          onError(error);
        }
      }}
      onError={onError}
    />
  );
};

// Configuration Helper
export const getPaymentConfig = (): PaymentConfig => {
  return {
    stripe: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
      secretKey: process.env.STRIPE_SECRET_KEY!,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    },
    paypal: {
      clientId: process.env.PAYPAL_CLIENT_ID!,
      clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
      sandbox: process.env.NODE_ENV !== 'production',
    },
    square: {
      applicationId: process.env.SQUARE_APPLICATION_ID!,
      accessToken: process.env.SQUARE_ACCESS_TOKEN!,
      locationId: process.env.SQUARE_LOCATION_ID!,
    },
    adyen: {
      clientKey: process.env.ADYEN_CLIENT_KEY!,
      environment: process.env.NODE_ENV === 'production' ? 'live' : 'test',
      originKey: process.env.ADYEN_ORIGIN_KEY!,
    },
    applePay: {
      merchantId: process.env.APPLE_PAY_MERCHANT_ID!,
      countryCode: 'US',
      currencyCode: 'USD',
    },
    googlePay: {
      merchantId: process.env.GOOGLE_PAY_MERCHANT_ID!,
      merchantName: 'PG Closets',
      gateway: 'stripe', // or 'adyen', 'braintree', etc.
    },
  };
};