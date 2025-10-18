/**
 * CONVERSION OPTIMIZATION AGENTS #31-35
 * Agent #32: User Behavior Analytics
 *
 * Comprehensive behavior tracking with:
 * - Heatmap integration (Hotjar/Microsoft Clarity)
 * - Session recording
 * - Funnel analysis
 * - User flow tracking
 * - Exit intent detection
 * - Scroll depth tracking
 * - Click tracking and form analytics
 * - Behavior-based segmentation
 */

export interface UserSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  pageViews: PageView[];
  interactions: Interaction[];
  formSubmissions: FormSubmission[];
  device: DeviceInfo;
  location?: GeoLocation;
  referrer?: string;
  utmParams?: UTMParams;
  isBot: boolean;
}

export interface PageView {
  url: string;
  title: string;
  timestamp: number;
  duration: number;
  scrollDepth: number;
  exitPage: boolean;
  bounced: boolean;
}

export interface Interaction {
  type: 'click' | 'hover' | 'scroll' | 'form_field' | 'rage_click' | 'dead_click';
  element: string;
  selector: string;
  timestamp: number;
  x?: number;
  y?: number;
  value?: string;
}

export interface FormSubmission {
  formId: string;
  formName: string;
  timestamp: number;
  duration: number;
  fields: FormField[];
  abandoned: boolean;
  errors: FormError[];
}

export interface FormField {
  name: string;
  value: string;
  timeToFill: number;
  correctionCount: number;
}

export interface FormError {
  field: string;
  errorMessage: string;
  timestamp: number;
}

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screenWidth: number;
  screenHeight: number;
  viewport: { width: number; height: number };
}

export interface GeoLocation {
  country: string;
  region: string;
  city: string;
  timezone: string;
}

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface FunnelStep {
  name: string;
  url: string;
  entered: number;
  completed: number;
  dropped: number;
  avgDuration: number;
  dropReasons: DropReason[];
}

export interface DropReason {
  reason: string;
  count: number;
  percentage: number;
}

export interface HeatmapData {
  url: string;
  clicks: HeatmapPoint[];
  scrollDepth: number[];
  attention: HeatmapPoint[];
  viewport: { width: number; height: number };
}

export interface HeatmapPoint {
  x: number;
  y: number;
  weight: number;
  element?: string;
}

export interface UserSegment {
  id: string;
  name: string;
  criteria: SegmentCriteria;
  users: string[];
  conversions: number;
  revenue: number;
}

export interface SegmentCriteria {
  device?: ('mobile' | 'tablet' | 'desktop')[];
  pageViews?: { min?: number; max?: number };
  sessionDuration?: { min?: number; max?: number };
  interactionCount?: { min?: number; max?: number };
  visitedPages?: string[];
  notVisitedPages?: string[];
  source?: string[];
  hasConverted?: boolean;
  timeOnSite?: { min?: number; max?: number };
}

/**
 * User Behavior Analytics System
 */
export class BehaviorAnalytics {
  private sessions: Map<string, UserSession> = new Map();
  private currentSession: UserSession | null = null;
  private hotjarEnabled: boolean = false;
  private clarityEnabled: boolean = false;
  private sessionStorageKey = 'behavior_session';
  private interactionBuffer: Interaction[] = [];
  private bufferFlushInterval: number = 5000; // 5 seconds

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeTracking();
      this.detectBehaviorTools();
    }
  }

  /**
   * Initialize behavior tracking
   */
  private initializeTracking(): void {
    // Load or create session
    this.currentSession = this.loadSession() || this.createSession();

    // Track page view
    this.trackPageView();

    // Setup event listeners
    this.setupEventListeners();

    // Setup buffer flush
    setInterval(() => this.flushInteractionBuffer(), this.bufferFlushInterval);

    // Track session end
    window.addEventListener('beforeunload', () => this.endSession());
  }

  /**
   * Detect behavior tracking tools
   */
  private detectBehaviorTools(): void {
    // Check for Hotjar
    if ((window as any).hj) {
      this.hotjarEnabled = true;
      console.log('Hotjar detected');
    }

    // Check for Microsoft Clarity
    if ((window as any).clarity) {
      this.clarityEnabled = true;
      console.log('Microsoft Clarity detected');
    }
  }

  /**
   * Create new session
   */
  private createSession(): UserSession {
    const session: UserSession = {
      id: this.generateSessionId(),
      userId: this.getUserId(),
      startTime: Date.now(),
      pageViews: [],
      interactions: [],
      formSubmissions: [],
      device: this.getDeviceInfo(),
      location: this.getGeoLocation(),
      referrer: document.referrer,
      utmParams: this.extractUTMParams(),
      isBot: this.detectBot()
    };

    this.sessions.set(session.id, session);
    this.saveSession(session);

    return session;
  }

  /**
   * End current session
   */
  private endSession(): void {
    if (!this.currentSession) return;

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;

    this.saveSession(this.currentSession);
    this.sendSessionData(this.currentSession);
  }

  /**
   * Track page view
   */
  trackPageView(): void {
    if (!this.currentSession) return;

    const pageView: PageView = {
      url: window.location.pathname,
      title: document.title,
      timestamp: Date.now(),
      duration: 0,
      scrollDepth: 0,
      exitPage: false,
      bounced: false
    };

    this.currentSession.pageViews.push(pageView);

    // Update duration when leaving page
    const updateDuration = () => {
      pageView.duration = Date.now() - pageView.timestamp;
      pageView.exitPage = true;

      // Detect bounce (less than 30 seconds, no other interactions)
      if (pageView.duration < 30000 && this.currentSession!.pageViews.length === 1) {
        pageView.bounced = true;
      }
    };

    window.addEventListener('beforeunload', updateDuration);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Click tracking
    document.addEventListener('click', (e) => this.trackClick(e), true);

    // Scroll tracking
    let scrollTimeout: NodeJS.Timeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => this.trackScroll(), 150);
    });

    // Hover tracking (for heatmaps)
    let hoverTimeout: NodeJS.Timeout;
    document.addEventListener('mousemove', (e) => {
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => this.trackHover(e), 500);
    });

    // Form tracking
    this.setupFormTracking();

    // Exit intent
    document.addEventListener('mouseout', (e) => this.trackExitIntent(e));

    // Rage clicks
    this.setupRageClickDetection();
  }

  /**
   * Track click interaction
   */
  private trackClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const selector = this.getElementSelector(target);

    const interaction: Interaction = {
      type: 'click',
      element: target.tagName,
      selector,
      timestamp: Date.now(),
      x: event.clientX,
      y: event.clientY
    };

    this.addInteraction(interaction);

    // Detect dead clicks (clicks that don't result in action)
    setTimeout(() => {
      if (window.location.pathname === this.currentSession?.pageViews[this.currentSession.pageViews.length - 1]?.url) {
        interaction.type = 'dead_click';
      }
    }, 1000);
  }

  /**
   * Track scroll depth
   */
  private trackScroll(): void {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;
    const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

    const currentPage = this.currentSession?.pageViews[this.currentSession.pageViews.length - 1];
    if (currentPage) {
      currentPage.scrollDepth = Math.max(currentPage.scrollDepth, scrollPercent);
    }

    // Track milestone scroll depths
    const milestones = [25, 50, 75, 90, 100];
    milestones.forEach(milestone => {
      if (scrollPercent >= milestone && scrollPercent < milestone + 5) {
        this.sendAnalyticsEvent('scroll_depth', {
          depth: milestone,
          url: window.location.pathname
        });
      }
    });
  }

  /**
   * Track hover interaction
   */
  private trackHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const selector = this.getElementSelector(target);

    const interaction: Interaction = {
      type: 'hover',
      element: target.tagName,
      selector,
      timestamp: Date.now(),
      x: event.clientX,
      y: event.clientY
    };

    this.addInteraction(interaction);
  }

  /**
   * Setup form tracking
   */
  private setupFormTracking(): void {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const formSubmission: FormSubmission = {
        formId: form.id || 'unknown',
        formName: form.getAttribute('name') || 'unknown',
        timestamp: Date.now(),
        duration: 0,
        fields: [],
        abandoned: false,
        errors: []
      };

      // Track field interactions
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const field: FormField = {
          name: (input as HTMLInputElement).name,
          value: '',
          timeToFill: 0,
          correctionCount: 0
        };

        const startTime = Date.now();

        input.addEventListener('focus', () => {
          field.timeToFill = Date.now() - startTime;
        });

        input.addEventListener('input', () => {
          field.correctionCount++;
        });

        input.addEventListener('blur', () => {
          field.value = (input as HTMLInputElement).value;
          formSubmission.fields.push(field);
        });
      });

      // Track form submission
      form.addEventListener('submit', (e) => {
        formSubmission.duration = Date.now() - formSubmission.timestamp;
        formSubmission.abandoned = false;
        this.currentSession?.formSubmissions.push(formSubmission);

        this.sendAnalyticsEvent('form_submit', {
          formId: formSubmission.formId,
          duration: formSubmission.duration,
          fieldCount: formSubmission.fields.length
        });
      });

      // Track form abandonment
      window.addEventListener('beforeunload', () => {
        if (formSubmission.fields.length > 0 && !formSubmission.abandoned) {
          formSubmission.abandoned = true;
          this.currentSession?.formSubmissions.push(formSubmission);

          this.sendAnalyticsEvent('form_abandon', {
            formId: formSubmission.formId,
            fieldsCompleted: formSubmission.fields.length
          });
        }
      });
    });
  }

  /**
   * Track exit intent
   */
  private trackExitIntent(event: MouseEvent): void {
    if (event.clientY <= 0) {
      this.sendAnalyticsEvent('exit_intent', {
        url: window.location.pathname,
        timeOnPage: Date.now() - (this.currentSession?.startTime || Date.now())
      });
    }
  }

  /**
   * Setup rage click detection
   */
  private setupRageClickDetection(): void {
    let clickCount = 0;
    let lastClick: { x: number; y: number; time: number } | null = null;

    document.addEventListener('click', (e) => {
      const now = Date.now();
      const threshold = 1000; // 1 second
      const distanceThreshold = 50; // pixels

      if (lastClick &&
          now - lastClick.time < threshold &&
          Math.abs(e.clientX - lastClick.x) < distanceThreshold &&
          Math.abs(e.clientY - lastClick.y) < distanceThreshold) {
        clickCount++;

        if (clickCount >= 3) {
          const target = e.target as HTMLElement;
          this.addInteraction({
            type: 'rage_click',
            element: target.tagName,
            selector: this.getElementSelector(target),
            timestamp: now,
            x: e.clientX,
            y: e.clientY
          });

          this.sendAnalyticsEvent('rage_click', {
            element: this.getElementSelector(target),
            count: clickCount
          });

          clickCount = 0;
        }
      } else {
        clickCount = 1;
      }

      lastClick = { x: e.clientX, y: e.clientY, time: now };
    });
  }

  /**
   * Add interaction to buffer
   */
  private addInteraction(interaction: Interaction): void {
    this.interactionBuffer.push(interaction);

    if (this.currentSession) {
      this.currentSession.interactions.push(interaction);
    }
  }

  /**
   * Flush interaction buffer
   */
  private flushInteractionBuffer(): void {
    if (this.interactionBuffer.length === 0) return;

    // Send interactions to analytics
    this.sendInteractionsToAnalytics(this.interactionBuffer);

    // Clear buffer
    this.interactionBuffer = [];
  }

  /**
   * Send interactions to analytics
   */
  private async sendInteractionsToAnalytics(interactions: Interaction[]): Promise<void> {
    try {
      await fetch('/api/analytics/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.currentSession?.id,
          userId: this.currentSession?.userId,
          interactions
        })
      });
    } catch (error) {
      console.error('Failed to send interactions:', error);
    }
  }

  /**
   * Analyze funnel
   */
  analyzeFunnel(steps: string[]): FunnelStep[] {
    const funnelSteps: FunnelStep[] = [];

    steps.forEach((stepUrl, index) => {
      const sessionsAtStep = Array.from(this.sessions.values()).filter(session =>
        session.pageViews.some(pv => pv.url === stepUrl)
      );

      const completed = index < steps.length - 1
        ? sessionsAtStep.filter(session =>
            session.pageViews.some(pv => pv.url === steps[index + 1])
          ).length
        : sessionsAtStep.length;

      const dropped = sessionsAtStep.length - completed;

      const durations = sessionsAtStep.map(session => {
        const stepView = session.pageViews.find(pv => pv.url === stepUrl);
        return stepView?.duration || 0;
      });

      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length || 0;

      funnelSteps.push({
        name: stepUrl,
        url: stepUrl,
        entered: sessionsAtStep.length,
        completed,
        dropped,
        avgDuration,
        dropReasons: this.analyzeDropReasons(sessionsAtStep, steps[index + 1])
      });
    });

    return funnelSteps;
  }

  /**
   * Analyze drop reasons
   */
  private analyzeDropReasons(sessions: UserSession[], nextStep?: string): DropReason[] {
    const reasons: Map<string, number> = new Map();

    sessions.forEach(session => {
      if (nextStep && !session.pageViews.some(pv => pv.url === nextStep)) {
        // Analyze why they didn't continue
        const lastPage = session.pageViews[session.pageViews.length - 1];

        if (lastPage.bounced) {
          reasons.set('Bounced (< 30s)', (reasons.get('Bounced (< 30s)') || 0) + 1);
        } else if (lastPage.scrollDepth < 25) {
          reasons.set('Low engagement', (reasons.get('Low engagement') || 0) + 1);
        } else if (session.interactions.some(i => i.type === 'rage_click')) {
          reasons.set('Frustrated (rage clicks)', (reasons.get('Frustrated (rage clicks)') || 0) + 1);
        } else if (session.formSubmissions.some(f => f.abandoned)) {
          reasons.set('Form abandoned', (reasons.get('Form abandoned') || 0) + 1);
        } else {
          reasons.set('Unknown', (reasons.get('Unknown') || 0) + 1);
        }
      }
    });

    const total = Array.from(reasons.values()).reduce((a, b) => a + b, 0);

    return Array.from(reasons.entries()).map(([reason, count]) => ({
      reason,
      count,
      percentage: (count / total) * 100
    }));
  }

  /**
   * Generate heatmap data
   */
  generateHeatmapData(url: string): HeatmapData {
    const sessions = Array.from(this.sessions.values()).filter(session =>
      session.pageViews.some(pv => pv.url === url)
    );

    const clicks: HeatmapPoint[] = [];
    const attention: HeatmapPoint[] = [];
    const scrollDepths: number[] = [];

    sessions.forEach(session => {
      // Collect clicks
      session.interactions
        .filter(i => i.type === 'click' && i.x && i.y)
        .forEach(i => {
          clicks.push({
            x: i.x!,
            y: i.y!,
            weight: 1,
            element: i.selector
          });
        });

      // Collect attention (hover) points
      session.interactions
        .filter(i => i.type === 'hover' && i.x && i.y)
        .forEach(i => {
          attention.push({
            x: i.x!,
            y: i.y!,
            weight: 1,
            element: i.selector
          });
        });

      // Collect scroll depths
      const pageView = session.pageViews.find(pv => pv.url === url);
      if (pageView) {
        scrollDepths.push(pageView.scrollDepth);
      }
    });

    return {
      url,
      clicks,
      scrollDepth: scrollDepths,
      attention,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    };
  }

  /**
   * Segment users
   */
  segmentUsers(criteria: SegmentCriteria): UserSegment {
    const matchingSessions = Array.from(this.sessions.values()).filter(session =>
      this.matchesCriteria(session, criteria)
    );

    const users = [...new Set(matchingSessions.map(s => s.userId))];
    const conversions = matchingSessions.filter(s =>
      s.pageViews.some(pv => pv.url.includes('/thank-you') || pv.url.includes('/confirmation'))
    ).length;

    return {
      id: `segment_${Date.now()}`,
      name: this.generateSegmentName(criteria),
      criteria,
      users,
      conversions,
      revenue: 0 // Would need to integrate with purchase data
    };
  }

  /**
   * Check if session matches criteria
   */
  private matchesCriteria(session: UserSession, criteria: SegmentCriteria): boolean {
    // Device check
    if (criteria.device && !criteria.device.includes(session.device.type)) {
      return false;
    }

    // Page views check
    if (criteria.pageViews) {
      const count = session.pageViews.length;
      if (criteria.pageViews.min && count < criteria.pageViews.min) return false;
      if (criteria.pageViews.max && count > criteria.pageViews.max) return false;
    }

    // Session duration check
    if (criteria.sessionDuration && session.duration) {
      if (criteria.sessionDuration.min && session.duration < criteria.sessionDuration.min) return false;
      if (criteria.sessionDuration.max && session.duration > criteria.sessionDuration.max) return false;
    }

    // Visited pages check
    if (criteria.visitedPages) {
      const hasVisited = criteria.visitedPages.every(url =>
        session.pageViews.some(pv => pv.url === url)
      );
      if (!hasVisited) return false;
    }

    // Not visited pages check
    if (criteria.notVisitedPages) {
      const hasNotVisited = criteria.notVisitedPages.every(url =>
        !session.pageViews.some(pv => pv.url === url)
      );
      if (!hasNotVisited) return false;
    }

    return true;
  }

  /**
   * Generate segment name
   */
  private generateSegmentName(criteria: SegmentCriteria): string {
    const parts: string[] = [];

    if (criteria.device) parts.push(criteria.device.join('/'));
    if (criteria.pageViews) parts.push(`${criteria.pageViews.min || 0}+ pages`);
    if (criteria.hasConverted) parts.push('Converted');

    return parts.join(' - ') || 'Custom Segment';
  }

  /**
   * Utility: Get element selector
   */
  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  }

  /**
   * Utility: Get device info
   */
  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;

    let type: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      type = 'tablet';
    } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/.test(ua)) {
      type = 'mobile';
    }

    return {
      type,
      browser: this.detectBrowser(),
      os: this.detectOS(),
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  /**
   * Detect browser
   */
  private detectBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  /**
   * Detect OS
   */
  private detectOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'MacOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  /**
   * Detect bot
   */
  private detectBot(): boolean {
    const ua = navigator.userAgent.toLowerCase();
    const botPatterns = ['bot', 'crawler', 'spider', 'scraper'];
    return botPatterns.some(pattern => ua.includes(pattern));
  }

  /**
   * Get geo location (from IP)
   */
  private getGeoLocation(): GeoLocation | undefined {
    // Would need to integrate with IP geolocation service
    return undefined;
  }

  /**
   * Extract UTM parameters
   */
  private extractUTMParams(): UTMParams {
    const params = new URLSearchParams(window.location.search);
    return {
      source: params.get('utm_source') || undefined,
      medium: params.get('utm_medium') || undefined,
      campaign: params.get('utm_campaign') || undefined,
      term: params.get('utm_term') || undefined,
      content: params.get('utm_content') || undefined
    };
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user ID
   */
  private getUserId(): string {
    let userId = localStorage.getItem('user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user_id', userId);
    }
    return userId;
  }

  /**
   * Save session
   */
  private saveSession(session: UserSession): void {
    try {
      sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  /**
   * Load session
   */
  private loadSession(): UserSession | null {
    try {
      const data = sessionStorage.getItem(this.sessionStorageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  }

  /**
   * Send session data
   */
  private async sendSessionData(session: UserSession): Promise<void> {
    try {
      await fetch('/api/analytics/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session)
      });
    } catch (error) {
      console.error('Failed to send session data:', error);
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
let analytics: BehaviorAnalytics | null = null;

export function getBehaviorAnalytics(): BehaviorAnalytics {
  if (!analytics) {
    analytics = new BehaviorAnalytics();
  }
  return analytics;
}

/**
 * React Hook for Behavior Analytics
 */
export function useBehaviorAnalytics() {
  const analytics = getBehaviorAnalytics();

  return {
    trackPageView: () => analytics.trackPageView(),
    analyzeFunnel: (steps: string[]) => analytics.analyzeFunnel(steps),
    generateHeatmap: (url: string) => analytics.generateHeatmapData(url),
    segmentUsers: (criteria: SegmentCriteria) => analytics.segmentUsers(criteria)
  };
}
