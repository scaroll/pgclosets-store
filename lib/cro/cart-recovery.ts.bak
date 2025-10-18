/**
 * CONVERSION OPTIMIZATION AGENTS #31-35
 * Agent #34: Cart/Quote Abandonment Recovery
 *
 * Comprehensive abandonment recovery system with:
 * - Cart abandonment tracking
 * - Quote form abandonment detection
 * - Multi-channel recovery (email, SMS, push)
 * - Personalized recovery offers
 * - A/B tested recovery messages
 * - Performance analytics
 */

export interface AbandonedCart {
  id: string;
  userId: string;
  sessionId: string;
  email?: string;
  phone?: string;
  items: CartItem[];
  totalValue: number;
  abandonedAt: number;
  lastUpdated: number;
  recoveryAttempts: RecoveryAttempt[];
  recovered: boolean;
  recoveredAt?: number;
  recoveryChannel?: 'email' | 'sms' | 'push' | 'retargeting';
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
}

export interface RecoveryAttempt {
  channel: 'email' | 'sms' | 'push';
  sentAt: number;
  template: string;
  opened?: boolean;
  clicked?: boolean;
  converted?: boolean;
  offer?: RecoveryOffer;
}

export interface RecoveryOffer {
  type: 'discount_percentage' | 'discount_fixed' | 'free_shipping' | 'free_consultation' | 'gift';
  value: number | string;
  code: string;
  expiresAt: number;
}

export interface FormAbandonment {
  id: string;
  userId: string;
  sessionId: string;
  formId: string;
  formName: string;
  completedFields: string[];
  totalFields: number;
  completionPercentage: number;
  abandonedAt: number;
  email?: string;
  phone?: string;
  recoveryAttempts: RecoveryAttempt[];
  recovered: boolean;
}

/**
 * Cart Recovery System
 */
export class CartRecoverySystem {
  private abandonedCarts: Map<string, AbandonedCart> = new Map();
  private abandonedForms: Map<string, FormAbandonment> = new Map();
  private storageKey = 'abandoned_carts';
  private recoverySequences = this.getRecoverySequences();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.startAbandonmentDetection();
    }
  }

  /**
   * Track cart creation
   */
  trackCartCreated(cart: {
    userId: string;
    sessionId: string;
    email?: string;
    phone?: string;
    items: CartItem[];
  }): void {
    const abandonedCart: AbandonedCart = {
      id: this.generateId(),
      userId: cart.userId,
      sessionId: cart.sessionId,
      email: cart.email,
      phone: cart.phone,
      items: cart.items,
      totalValue: this.calculateTotal(cart.items),
      abandonedAt: Date.now(),
      lastUpdated: Date.now(),
      recoveryAttempts: [],
      recovered: false
    };

    this.abandonedCarts.set(abandonedCart.id, abandonedCart);
    this.saveToStorage();
  }

  /**
   * Track cart update
   */
  trackCartUpdated(cartId: string, items: CartItem[]): void {
    const cart = this.abandonedCarts.get(cartId);
    if (!cart) return;

    cart.items = items;
    cart.totalValue = this.calculateTotal(items);
    cart.lastUpdated = Date.now();

    this.saveToStorage();
  }

  /**
   * Mark cart as recovered
   */
  markCartRecovered(cartId: string, channel?: string): void {
    const cart = this.abandonedCarts.get(cartId);
    if (!cart) return;

    cart.recovered = true;
    cart.recoveredAt = Date.now();
    cart.recoveryChannel = channel as any;

    this.saveToStorage();

    // Send analytics event
    this.sendAnalyticsEvent('cart_recovered', {
      cartId,
      value: cart.totalValue,
      channel,
      daysSinceAbandonment: (Date.now() - cart.abandonedAt) / (1000 * 60 * 60 * 24)
    });
  }

  /**
   * Track form abandonment
   */
  trackFormAbandonment(form: {
    userId: string;
    sessionId: string;
    formId: string;
    formName: string;
    completedFields: string[];
    totalFields: number;
    email?: string;
    phone?: string;
  }): void {
    const abandonment: FormAbandonment = {
      id: this.generateId(),
      userId: form.userId,
      sessionId: form.sessionId,
      formId: form.formId,
      formName: form.formName,
      completedFields: form.completedFields,
      totalFields: form.totalFields,
      completionPercentage: (form.completedFields.length / form.totalFields) * 100,
      abandonedAt: Date.now(),
      email: form.email,
      phone: form.phone,
      recoveryAttempts: [],
      recovered: false
    };

    // Only track if >25% completed
    if (abandonment.completionPercentage > 25) {
      this.abandonedForms.set(abandonment.id, abandonment);
      this.saveToStorage();
    }
  }

  /**
   * Start abandonment detection
   */
  private startAbandonmentDetection(): void {
    // Check for abandonments every minute
    setInterval(() => {
      this.processAbandonments();
    }, 60000);

    // Also check on page load
    this.processAbandonments();
  }

  /**
   * Process abandoned carts and send recovery messages
   */
  private async processAbandonments(): Promise<void> {
    const now = Date.now();

    // Process abandoned carts
    this.abandonedCarts.forEach(async cart => {
      if (cart.recovered) return;

      const timeSinceAbandonment = now - cart.abandonedAt;
      const hoursAbandoned = timeSinceAbandonment / (1000 * 60 * 60);

      // Get appropriate recovery sequence
      const sequence = this.getNextRecoveryStep(cart, hoursAbandoned);

      if (sequence) {
        await this.sendRecoveryMessage(cart, sequence);
      }
    });

    // Process abandoned forms
    this.abandonedForms.forEach(async form => {
      if (form.recovered) return;

      const timeSinceAbandonment = now - form.abandonedAt;
      const hoursAbandoned = timeSinceAbandonment / (1000 * 60 * 60);

      // Send recovery for high-completion forms (>50%)
      if (form.completionPercentage > 50 && hoursAbandoned >= 1 && form.recoveryAttempts.length === 0) {
        await this.sendFormRecoveryMessage(form);
      }
    });
  }

  /**
   * Get next recovery step based on abandonment time
   */
  private getNextRecoveryStep(cart: AbandonedCart, hoursAbandoned: number): any {
    const sequences = this.recoverySequences.cart;

    for (const sequence of sequences) {
      const attemptsMade = cart.recoveryAttempts.filter(a => a.template === sequence.template).length;

      if (hoursAbandoned >= sequence.delayHours && attemptsMade === 0) {
        return sequence;
      }
    }

    return null;
  }

  /**
   * Send recovery message
   */
  private async sendRecoveryMessage(cart: AbandonedCart, sequence: any): Promise<void> {
    if (!cart.email && !cart.phone) return;

    const offer = this.generateRecoveryOffer(cart, sequence);

    const attempt: RecoveryAttempt = {
      channel: sequence.channel,
      sentAt: Date.now(),
      template: sequence.template,
      offer
    };

    // Send via appropriate channel
    switch (sequence.channel) {
      case 'email':
        await this.sendRecoveryEmail(cart, sequence, offer);
        break;
      case 'sms':
        await this.sendRecoverySMS(cart, sequence, offer);
        break;
      case 'push':
        await this.sendRecoveryPush(cart, sequence, offer);
        break;
    }

    cart.recoveryAttempts.push(attempt);
    this.saveToStorage();

    // Analytics
    this.sendAnalyticsEvent('recovery_sent', {
      cartId: cart.id,
      channel: sequence.channel,
      template: sequence.template,
      offerType: offer.type,
      offerValue: offer.value
    });
  }

  /**
   * Send recovery email
   */
  private async sendRecoveryEmail(
    cart: AbandonedCart,
    sequence: any,
    offer: RecoveryOffer
  ): Promise<void> {
    if (!cart.email) return;

    const emailData = {
      to: cart.email,
      subject: sequence.subject,
      template: sequence.template,
      data: {
        items: cart.items,
        totalValue: cart.totalValue,
        offer,
        recoveryUrl: this.generateRecoveryUrl(cart, offer)
      }
    };

    try {
      await fetch('/api/email/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });
    } catch (error) {
      console.error('Failed to send recovery email:', error);
    }
  }

  /**
   * Send recovery SMS
   */
  private async sendRecoverySMS(
    cart: AbandonedCart,
    sequence: any,
    offer: RecoveryOffer
  ): Promise<void> {
    if (!cart.phone) return;

    const message = this.formatSMSMessage(cart, offer);

    try {
      await fetch('/api/sms/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: cart.phone,
          message
        })
      });
    } catch (error) {
      console.error('Failed to send recovery SMS:', error);
    }
  }

  /**
   * Send recovery push notification
   */
  private async sendRecoveryPush(
    cart: AbandonedCart,
    sequence: any,
    offer: RecoveryOffer
  ): Promise<void> {
    if (!('Notification' in window)) return;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    new Notification(sequence.subject, {
      body: `Save ${offer.value} on your cart! Use code: ${offer.code}`,
      icon: cart.items[0]?.image,
      tag: cart.id
    });
  }

  /**
   * Send form recovery message
   */
  private async sendFormRecoveryMessage(form: FormAbandonment): Promise<void> {
    if (!form.email) return;

    const emailData = {
      to: form.email,
      subject: 'Complete your quote request',
      template: 'form_recovery',
      data: {
        formName: form.formName,
        completionPercentage: form.completionPercentage,
        resumeUrl: this.generateFormResumeUrl(form)
      }
    };

    try {
      await fetch('/api/email/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      });

      form.recoveryAttempts.push({
        channel: 'email',
        sentAt: Date.now(),
        template: 'form_recovery'
      });

      this.saveToStorage();
    } catch (error) {
      console.error('Failed to send form recovery email:', error);
    }
  }

  /**
   * Generate recovery offer
   */
  private generateRecoveryOffer(cart: AbandonedCart, sequence: any): RecoveryOffer {
    const attemptNumber = cart.recoveryAttempts.length + 1;

    // Escalating offers
    let offer: RecoveryOffer;

    if (attemptNumber === 1) {
      // First reminder - no discount, just friendly reminder
      offer = {
        type: 'free_consultation',
        value: 'Free expert consultation',
        code: '',
        expiresAt: Date.now() + (24 * 60 * 60 * 1000)
      };
    } else if (attemptNumber === 2) {
      // Second attempt - moderate discount
      offer = {
        type: 'discount_percentage',
        value: 10,
        code: this.generateDiscountCode('SAVE10'),
        expiresAt: Date.now() + (48 * 60 * 60 * 1000)
      };
    } else {
      // Final attempt - aggressive offer
      offer = {
        type: 'discount_percentage',
        value: 15,
        code: this.generateDiscountCode('FINAL15'),
        expiresAt: Date.now() + (48 * 60 * 60 * 1000)
      };
    }

    return offer;
  }

  /**
   * Generate discount code
   */
  private generateDiscountCode(prefix: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Generate recovery URL
   */
  private generateRecoveryUrl(cart: AbandonedCart, offer: RecoveryOffer): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      cart_id: cart.id,
      code: offer.code,
      source: 'recovery_email'
    });

    return `${baseUrl}/cart?${params.toString()}`;
  }

  /**
   * Generate form resume URL
   */
  private generateFormResumeUrl(form: FormAbandonment): string {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({
      form_id: form.formId,
      resume: 'true'
    });

    return `${baseUrl}/quote?${params.toString()}`;
  }

  /**
   * Format SMS message
   */
  private formatSMSMessage(cart: AbandonedCart, offer: RecoveryOffer): string {
    return `PG Closets: You left ${cart.items.length} item(s) in your cart. Save ${offer.value}${
      offer.type === 'discount_percentage' ? '%' : ''
    } with code ${offer.code}. Shop now: ${this.generateRecoveryUrl(cart, offer)}`;
  }

  /**
   * Calculate cart total
   */
  private calculateTotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * Get recovery sequences
   */
  private getRecoverySequences() {
    return {
      cart: [
        {
          delayHours: 1,
          channel: 'email',
          template: 'cart_reminder_1',
          subject: 'You left something behind...'
        },
        {
          delayHours: 24,
          channel: 'email',
          template: 'cart_reminder_2',
          subject: 'Still interested? Save 10% today'
        },
        {
          delayHours: 72,
          channel: 'email',
          template: 'cart_reminder_3',
          subject: 'Last chance: 15% off your cart'
        }
      ],
      form: [
        {
          delayHours: 1,
          channel: 'email',
          template: 'form_recovery',
          subject: 'Complete your quote in 2 minutes'
        }
      ]
    };
  }

  /**
   * Get recovery statistics
   */
  getRecoveryStats(): {
    totalAbandoned: number;
    recovered: number;
    recoveryRate: number;
    avgRecoveryTime: number;
    totalValue: number;
    recoveredValue: number;
    byChannel: Record<string, { sent: number; recovered: number }>;
  } {
    const carts = Array.from(this.abandonedCarts.values());

    const recovered = carts.filter(c => c.recovered);
    const recoveryTimes = recovered
      .filter(c => c.recoveredAt)
      .map(c => c.recoveredAt! - c.abandonedAt);

    const byChannel: Record<string, { sent: number; recovered: number }> = {};

    carts.forEach(cart => {
      cart.recoveryAttempts.forEach(attempt => {
        if (!byChannel[attempt.channel]) {
          byChannel[attempt.channel] = { sent: 0, recovered: 0 };
        }
        byChannel[attempt.channel].sent++;
        if (cart.recovered && cart.recoveryChannel === attempt.channel) {
          byChannel[attempt.channel].recovered++;
        }
      });
    });

    return {
      totalAbandoned: carts.length,
      recovered: recovered.length,
      recoveryRate: carts.length > 0 ? recovered.length / carts.length : 0,
      avgRecoveryTime: recoveryTimes.length > 0
        ? recoveryTimes.reduce((a, b) => a + b, 0) / recoveryTimes.length
        : 0,
      totalValue: carts.reduce((sum, c) => sum + c.totalValue, 0),
      recoveredValue: recovered.reduce((sum, c) => sum + c.totalValue, 0),
      byChannel
    };
  }

  /**
   * Utility: Generate ID
   */
  private generateId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        carts: Array.from(this.abandonedCarts.entries()),
        forms: Array.from(this.abandonedForms.entries())
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save abandonment data:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.abandonedCarts = new Map(parsed.carts);
        this.abandonedForms = new Map(parsed.forms);
      }
    } catch (error) {
      console.error('Failed to load abandonment data:', error);
    }
  }

  /**
   * Send analytics event
   */
  private sendAnalyticsEvent(event: string, data: Record<string, any>): void {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, data);
    }
  }
}

// Singleton instance
let recoverySystem: CartRecoverySystem | null = null;

export function getCartRecoverySystem(): CartRecoverySystem {
  if (!recoverySystem) {
    recoverySystem = new CartRecoverySystem();
  }
  return recoverySystem;
}

/**
 * React Hook for Cart Recovery
 */
export function useCartRecovery() {
  const system = getCartRecoverySystem();

  return {
    trackCartCreated: (cart: any) => system.trackCartCreated(cart),
    trackCartUpdated: (cartId: string, items: CartItem[]) =>
      system.trackCartUpdated(cartId, items),
    markRecovered: (cartId: string, channel?: string) =>
      system.markCartRecovered(cartId, channel),
    trackFormAbandonment: (form: any) => system.trackFormAbandonment(form),
    getStats: () => system.getRecoveryStats()
  };
}
