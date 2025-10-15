/**
 * Network-Aware Performance Optimization
 * Adapts image quality and resource loading based on network conditions
 *
 * @module lib/mobile/network
 * @agent Agent #15 - Mobile Experience & PWA
 */

export type NetworkSpeed = 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown';
export type ConnectionType = 'wifi' | 'cellular' | 'ethernet' | 'unknown';
export type DataSaverMode = 'enabled' | 'disabled' | 'unknown';

export interface NetworkInfo {
  effectiveType: NetworkSpeed;
  connectionType: ConnectionType;
  downlink: number; // Mbps
  rtt: number; // Round-trip time in ms
  saveData: DataSaverMode;
  isOnline: boolean;
}

export interface ImageQualitySettings {
  quality: number; // 1-100
  format: 'auto' | 'webp' | 'jpeg';
  maxWidth: number;
  enablePlaceholder: boolean;
  lazy: boolean;
}

export interface ResourceLoadingStrategy {
  prefetch: boolean;
  preload: boolean;
  defer: boolean;
  priority: 'high' | 'low' | 'auto';
}

/**
 * Network Information Monitor
 */
export class NetworkMonitor {
  private static instance: NetworkMonitor | null = null;
  private connection: any = null;
  private listeners: Set<(info: NetworkInfo) => void> = new Set();
  private currentInfo: NetworkInfo;

  private constructor() {
    this.currentInfo = this.getNetworkInfo();
    this.initializeMonitoring();
  }

  static getInstance(): NetworkMonitor {
    if (!NetworkMonitor.instance) {
      NetworkMonitor.instance = new NetworkMonitor();
    }
    return NetworkMonitor.instance;
  }

  /**
   * Get current network information
   */
  getNetworkInfo(): NetworkInfo {
    const nav = typeof navigator !== 'undefined' ? navigator : null;
    const connection = this.getConnection();

    return {
      effectiveType: (connection?.effectiveType as NetworkSpeed) || 'unknown',
      connectionType: (connection?.type as ConnectionType) || 'unknown',
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 50,
      saveData: connection?.saveData ? 'enabled' : 'disabled',
      isOnline: nav?.onLine ?? true,
    };
  }

  /**
   * Subscribe to network changes
   */
  subscribe(callback: (info: NetworkInfo) => void): () => void {
    this.listeners.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Check if connection is slow
   */
  isSlowConnection(): boolean {
    const info = this.getNetworkInfo();
    return (
      info.effectiveType === 'slow-2g' ||
      info.effectiveType === '2g' ||
      info.saveData === 'enabled' ||
      info.downlink < 1
    );
  }

  /**
   * Check if connection is fast
   */
  isFastConnection(): boolean {
    const info = this.getNetworkInfo();
    return (
      (info.effectiveType === '4g' || info.effectiveType === '5g') &&
      info.downlink > 5 &&
      info.saveData === 'disabled'
    );
  }

  /**
   * Get optimal image quality based on network
   */
  getOptimalImageQuality(): ImageQualitySettings {
    const info = this.getNetworkInfo();

    // Data saver mode - minimum quality
    if (info.saveData === 'enabled') {
      return {
        quality: 50,
        format: 'webp',
        maxWidth: 640,
        enablePlaceholder: true,
        lazy: true,
      };
    }

    // Slow connection (2G/3G)
    if (info.effectiveType === 'slow-2g' || info.effectiveType === '2g') {
      return {
        quality: 60,
        format: 'webp',
        maxWidth: 800,
        enablePlaceholder: true,
        lazy: true,
      };
    }

    if (info.effectiveType === '3g') {
      return {
        quality: 70,
        format: 'webp',
        maxWidth: 1024,
        enablePlaceholder: true,
        lazy: true,
      };
    }

    // Fast connection (4G/5G) - high quality
    if (info.effectiveType === '4g' || info.effectiveType === '5g') {
      return {
        quality: 85,
        format: 'auto',
        maxWidth: 1920,
        enablePlaceholder: false,
        lazy: false,
      };
    }

    // Default - moderate quality
    return {
      quality: 75,
      format: 'webp',
      maxWidth: 1200,
      enablePlaceholder: true,
      lazy: true,
    };
  }

  /**
   * Get resource loading strategy based on network
   */
  getResourceLoadingStrategy(): ResourceLoadingStrategy {
    const info = this.getNetworkInfo();

    // Slow connection - defer everything
    if (this.isSlowConnection()) {
      return {
        prefetch: false,
        preload: false,
        defer: true,
        priority: 'low',
      };
    }

    // Fast connection - prefetch aggressively
    if (this.isFastConnection()) {
      return {
        prefetch: true,
        preload: true,
        defer: false,
        priority: 'high',
      };
    }

    // Moderate connection - balanced approach
    return {
      prefetch: false,
      preload: true,
      defer: false,
      priority: 'auto',
    };
  }

  /**
   * Initialize network monitoring
   */
  private initializeMonitoring(): void {
    if (typeof window === 'undefined') return;

    this.connection = this.getConnection();

    // Listen to connection changes
    if (this.connection) {
      this.connection.addEventListener('change', this.handleNetworkChange);
    }

    // Listen to online/offline events
    window.addEventListener('online', this.handleNetworkChange);
    window.addEventListener('offline', this.handleNetworkChange);
  }

  /**
   * Handle network change
   */
  private handleNetworkChange = (): void => {
    const newInfo = this.getNetworkInfo();

    // Only notify if there's a meaningful change
    if (this.hasSignificantChange(this.currentInfo, newInfo)) {
      this.currentInfo = newInfo;
      this.notifyListeners(newInfo);
    }
  };

  /**
   * Check if there's a significant network change
   */
  private hasSignificantChange(old: NetworkInfo, newInfo: NetworkInfo): boolean {
    return (
      old.effectiveType !== newInfo.effectiveType ||
      old.isOnline !== newInfo.isOnline ||
      old.saveData !== newInfo.saveData ||
      Math.abs(old.downlink - newInfo.downlink) > 2
    );
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(info: NetworkInfo): void {
    this.listeners.forEach((listener) => {
      try {
        listener(info);
      } catch (error) {
        console.error('Error in network listener:', error);
      }
    });
  }

  /**
   * Get connection object
   */
  private getConnection(): any {
    if (typeof navigator === 'undefined') return null;

    return (
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection
    );
  }

  /**
   * Clean up listeners
   */
  destroy(): void {
    if (this.connection) {
      this.connection.removeEventListener('change', this.handleNetworkChange);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', this.handleNetworkChange);
      window.removeEventListener('offline', this.handleNetworkChange);
    }

    this.listeners.clear();
  }
}

/**
 * React Hook for network-aware rendering
 */
export function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = React.useState<NetworkInfo>(() =>
    NetworkMonitor.getInstance().getNetworkInfo()
  );

  React.useEffect(() => {
    const monitor = NetworkMonitor.getInstance();
    const unsubscribe = monitor.subscribe(setNetworkInfo);

    return unsubscribe;
  }, []);

  return {
    networkInfo,
    isSlowConnection: NetworkMonitor.getInstance().isSlowConnection(),
    isFastConnection: NetworkMonitor.getInstance().isFastConnection(),
    imageQuality: NetworkMonitor.getInstance().getOptimalImageQuality(),
    loadingStrategy: NetworkMonitor.getInstance().getResourceLoadingStrategy(),
  };
}

/**
 * Image URL builder with network-aware optimization
 */
export function buildOptimizedImageUrl(
  baseUrl: string,
  options?: Partial<ImageQualitySettings>
): string {
  const monitor = NetworkMonitor.getInstance();
  const defaults = monitor.getOptimalImageQuality();
  const settings = { ...defaults, ...options };

  // Parse URL
  const url = new URL(baseUrl, window.location.origin);

  // Add quality parameter
  url.searchParams.set('q', settings.quality.toString());

  // Add format parameter
  if (settings.format !== 'auto') {
    url.searchParams.set('fm', settings.format);
  }

  // Add max width parameter
  url.searchParams.set('w', settings.maxWidth.toString());

  // Add auto format/compression for modern browsers
  url.searchParams.set('auto', 'format,compress');

  return url.toString();
}

/**
 * Prefetch resources based on network conditions
 */
export async function smartPrefetch(urls: string[]): Promise<void> {
  const monitor = NetworkMonitor.getInstance();
  const strategy = monitor.getResourceLoadingStrategy();

  // Don't prefetch on slow connections
  if (!strategy.prefetch) {
    return;
  }

  // Limit concurrent prefetches
  const maxConcurrent = monitor.isFastConnection() ? 6 : 3;

  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);

    await Promise.allSettled(
      batch.map((url) =>
        fetch(url, {
          method: 'GET',
          mode: 'no-cors',
          priority: strategy.priority as any,
        })
      )
    );
  }
}

/**
 * Battery-aware operations
 */
export function isBatteryLow(): boolean {
  if (typeof navigator === 'undefined' || !('getBattery' in navigator)) {
    return false;
  }

  return new Promise<boolean>((resolve) => {
    (navigator as any).getBattery().then((battery: any) => {
      const isLow = battery.level < 0.2 && !battery.charging;
      resolve(isLow);
    }).catch(() => resolve(false));
  }) as any;
}

// Re-export React for hooks
import React from 'react';
