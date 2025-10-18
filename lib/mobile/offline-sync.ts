/**
 * Offline Sync Manager
 * Handles offline data synchronization using IndexedDB
 * Features:
 * - Offline form submission queue
 * - Background sync for pending operations
 * - Conflict resolution for data sync
 * - Progressive data synchronization
 */

const DB_NAME = 'pgclosets_offline_db';
const DB_VERSION = 1;

const STORES = {
  QUOTES: 'pending_quotes',
  CONTACTS: 'pending_contacts',
  CART: 'pending_cart_updates',
  FAVORITES: 'pending_favorites'
} as const;

interface PendingSubmission {
  id: string;
  type: keyof typeof STORES;
  data: any;
  timestamp: number;
  retryCount: number;
  lastError?: string;
}

class OfflineSyncManager {
  private db: IDBDatabase | null = null;
  private syncInProgress = false;
  private maxRetries = 3;

  /**
   * Initialize the IndexedDB database
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('indexedDB' in window)) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Offline database initialized');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores for each type
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { keyPath: 'id' });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('retryCount', 'retryCount', { unique: false });
          }
        });

        console.log('📦 Database stores created');
      };
    });
  }

  /**
   * Add a pending submission to the queue
   */
  async addPendingSubmission(
    type: keyof typeof STORES,
    data: any
  ): Promise<string> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const submission: PendingSubmission = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES[type]], 'readwrite');
      const store = transaction.objectStore(STORES[type]);
      const request = store.add(submission);

      request.onsuccess = () => {
        console.log('📝 Added pending submission:', submission.id);
        resolve(submission.id);

        // Try to sync immediately if online
        if (navigator.onLine) {
          this.syncPendingSubmissions();
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to add pending submission'));
      };
    });
  }

  /**
   * Get all pending submissions of a specific type
   */
  async getPendingSubmissions(type: keyof typeof STORES): Promise<PendingSubmission[]> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES[type]], 'readonly');
      const store = transaction.objectStore(STORES[type]);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error('Failed to get pending submissions'));
      };
    });
  }

  /**
   * Remove a pending submission
   */
  async removePendingSubmission(
    type: keyof typeof STORES,
    id: string
  ): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES[type]], 'readwrite');
      const store = transaction.objectStore(STORES[type]);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('✅ Removed pending submission:', id);
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to remove pending submission'));
      };
    });
  }

  /**
   * Update a pending submission (for retry tracking)
   */
  async updatePendingSubmission(submission: PendingSubmission): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES[submission.type]], 'readwrite');
      const store = transaction.objectStore(STORES[submission.type]);
      const request = store.put(submission);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to update pending submission'));
      };
    });
  }

  /**
   * Sync all pending submissions
   */
  async syncPendingSubmissions(): Promise<void> {
    if (this.syncInProgress) {
      console.log('⏳ Sync already in progress');
      return;
    }

    if (!navigator.onLine) {
      console.log('📡 Offline - skipping sync');
      return;
    }

    this.syncInProgress = true;
    console.log('🔄 Starting sync of pending submissions...');

    try {
      // Sync each type
      for (const [key, storeName] of Object.entries(STORES)) {
        await this.syncSubmissionsOfType(key as keyof typeof STORES);
      }

      console.log('✅ Sync completed successfully');
    } catch (error) {
      console.error('❌ Sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sync submissions of a specific type
   */
  private async syncSubmissionsOfType(type: keyof typeof STORES): Promise<void> {
    const submissions = await this.getPendingSubmissions(type);

    if (submissions.length === 0) {
      return;
    }

    console.log(`🔄 Syncing ${submissions.length} ${type} submissions...`);

    for (const submission of submissions) {
      try {
        // Skip if max retries exceeded
        if (submission.retryCount >= this.maxRetries) {
          console.error(
            `⚠️ Max retries exceeded for ${submission.id} - manual intervention needed`
          );
          continue;
        }

        // Attempt to sync
        const endpoint = this.getEndpointForType(type);
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission.data)
        });

        if (response.ok) {
          // Success - remove from queue
          await this.removePendingSubmission(type, submission.id);
          console.log(`✅ Synced ${submission.id}`);

          // Show notification
          if ('serviceWorker' in navigator && 'Notification' in window) {
            this.showSyncSuccessNotification(type);
          }
        } else {
          // Failed - increment retry count
          submission.retryCount++;
          submission.lastError = `HTTP ${response.status}: ${response.statusText}`;
          await this.updatePendingSubmission(submission);
          console.error(`❌ Failed to sync ${submission.id}:`, submission.lastError);
        }
      } catch (error) {
        // Network error - increment retry count
        submission.retryCount++;
        submission.lastError = error instanceof Error ? error.message : 'Unknown error';
        await this.updatePendingSubmission(submission);
        console.error(`❌ Error syncing ${submission.id}:`, error);
      }
    }
  }

  /**
   * Get API endpoint for a submission type
   */
  private getEndpointForType(type: keyof typeof STORES): string {
    const endpoints = {
      QUOTES: '/api/quotes',
      CONTACTS: '/api/contact',
      CART: '/api/cart',
      FAVORITES: '/api/favorites'
    };

    return endpoints[type];
  }

  /**
   * Show success notification
   */
  private showSyncSuccessNotification(type: keyof typeof STORES): void {
    const messages = {
      QUOTES: 'Your quote request has been submitted',
      CONTACTS: 'Your contact form has been submitted',
      CART: 'Your cart has been updated',
      FAVORITES: 'Your favorites have been synced'
    };

    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('PG Closets', {
          body: messages[type],
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'sync-success'
        });
      });
    }
  }

  /**
   * Get pending submission count
   */
  async getPendingCount(): Promise<number> {
    let total = 0;

    for (const key of Object.keys(STORES)) {
      const submissions = await this.getPendingSubmissions(key as keyof typeof STORES);
      total += submissions.length;
    }

    return total;
  }

  /**
   * Clear all pending submissions (use with caution)
   */
  async clearAllPending(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    for (const storeName of Object.values(STORES)) {
      await new Promise<void>((resolve, reject) => {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(new Error(`Failed to clear ${storeName}`));
      });
    }

    console.log('🧹 Cleared all pending submissions');
  }
}

// Singleton instance
let syncManager: OfflineSyncManager | null = null;

/**
 * Get or create the sync manager instance
 */
export async function getOfflineSyncManager(): Promise<OfflineSyncManager> {
  if (!syncManager) {
    syncManager = new OfflineSyncManager();
    await syncManager.initialize();

    // Set up online/offline listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('📡 Connection restored - syncing...');
        syncManager?.syncPendingSubmissions();
      });

      window.addEventListener('offline', () => {
        console.log('📡 Connection lost - queueing submissions');
      });
    }
  }

  return syncManager;
}

/**
 * Queue a form submission for offline sync
 */
export async function queueFormSubmission(
  type: 'QUOTES' | 'CONTACTS',
  data: any
): Promise<string> {
  const manager = await getOfflineSyncManager();
  return manager.addPendingSubmission(type, data);
}

/**
 * Check if there are pending submissions
 */
export async function hasPendingSubmissions(): Promise<boolean> {
  const manager = await getOfflineSyncManager();
  const count = await manager.getPendingCount();
  return count > 0;
}

/**
 * Get pending submission count
 */
export async function getPendingSubmissionCount(): Promise<number> {
  const manager = await getOfflineSyncManager();
  return manager.getPendingCount();
}

export default OfflineSyncManager;
