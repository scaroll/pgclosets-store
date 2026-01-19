/**
 * Context Manager - Core component for managing work context and session state
 * Handles automatic context saving, loading, and intelligent reconstruction
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const EventEmitter = require('events');

class ContextManager extends EventEmitter {
  constructor(storageEngine, config = {}) {
    super();
    this.storage = storageEngine;
    this.config = {
      autoSave: {
        enabled: true,
        interval: 30000, // 30 seconds
        onFileChange: true,
        onCommand: true,
        ...config.autoSave
      },
      context: {
        maxContextSize: 1000000, // 1MB
        compressionThreshold: 100000, // 100KB
        retentionDays: 30,
        ...config.context
      },
      ...config
    };

    this.currentContext = null;
    this.activeSession = null;
    this.autoSaveTimer = null;
    this.isInitialized = false;
    this.fileWatcher = null;

    this.setupEventHandlers();
  }

  /**
   * Initialize the context manager
   */
  async initialize() {
    try {
      await this.ensureDirectories();
      await this.loadLastSession();
      this.startAutoSave();
      this.setupFileWatcher();
      this.isInitialized = true;

      this.emit('initialized', {
        sessionId: this.activeSession?.id,
        contextSize: this.currentContext?.size || 0
      });

      return {
        success: true,
        sessionId: this.activeSession?.id,
        hasPreviousContext: !!this.currentContext
      };
    } catch (error) {
      this.emit('error', { type: 'initialization', error });
      throw new Error(`ContextManager initialization failed: ${error.message}`);
    }
  }

  /**
   * Start a new work session
   */
  async startSession(sessionName, metadata = {}) {
    try {
      const session = {
        id: this.generateId(),
        name: sessionName,
        startTime: new Date().toISOString(),
        endTime: null,
        metadata: {
          platform: process.platform,
          nodeVersion: process.version,
          workingDirectory: process.cwd(),
          ...metadata
        },
        contextSnapshots: [],
        status: 'active'
      };

      // Save current session if exists
      if (this.activeSession) {
        await this.endSession();
      }

      this.activeSession = session;
      await this.storage.saveSession(session);

      // Initialize empty context for new session
      this.currentContext = {
        sessionId: session.id,
        timestamp: new Date().toISOString(),
        files: new Map(),
        commands: [],
        notes: [],
        bookmarks: [],
        environment: {
          cwd: process.cwd(),
          env: this.sanitizeEnvironment(process.env)
        }
      };

      await this.saveContext('session_start');

      this.emit('sessionStarted', session);

      return session;
    } catch (error) {
      this.emit('error', { type: 'sessionStart', error });
      throw new Error(`Failed to start session: ${error.message}`);
    }
  }

  /**
   * End the current session
   */
  async endSession() {
    if (!this.activeSession) {
      return null;
    }

    try {
      this.activeSession.endTime = new Date().toISOString();
      this.activeSession.status = 'completed';

      // Final context save
      await this.saveContext('session_end');

      // Update session
      await this.storage.updateSession(this.activeSession);

      const endedSession = { ...this.activeSession };
      this.activeSession = null;

      this.emit('sessionEnded', endedSession);

      return endedSession;
    } catch (error) {
      this.emit('error', { type: 'sessionEnd', error });
      throw new Error(`Failed to end session: ${error.message}`);
    }
  }

  /**
   * Save current context
   */
  async saveContext(trigger = 'manual') {
    if (!this.currentContext || !this.activeSession) {
      return null;
    }

    try {
      const contextSnapshot = {
        ...this.currentContext,
        timestamp: new Date().toISOString(),
        trigger,
        size: this.calculateContextSize(),
        checksum: this.calculateChecksum()
      };

      // Compress if necessary
      if (contextSnapshot.size > this.config.context.compressionThreshold) {
        contextSnapshot.files = this.compressContext(contextSnapshot.files);
      }

      // Save to storage
      await this.storage.saveContext(contextSnapshot);

      // Update session with snapshot reference
      this.activeSession.contextSnapshots.push({
        id: this.generateId(),
        timestamp: contextSnapshot.timestamp,
        trigger,
        size: contextSnapshot.size
      });
      await this.storage.updateSession(this.activeSession);

      this.emit('contextSaved', {
        sessionId: this.activeSession.id,
        trigger,
        size: contextSnapshot.size
      });

      return contextSnapshot;
    } catch (error) {
      this.emit('error', { type: 'contextSave', error });
      throw new Error(`Failed to save context: ${error.message}`);
    }
  }

  /**
   * Load context from session
   */
  async loadContext(sessionId) {
    try {
      const session = await this.storage.getSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      const contexts = await this.storage.getContextsBySession(sessionId);
      const latestContext = contexts[contexts.length - 1];

      if (latestContext) {
        this.currentContext = this.decompressContext(latestContext);
        this.activeSession = session;

        this.emit('contextLoaded', {
          sessionId,
          contextSize: this.calculateContextSize()
        });

        return this.currentContext;
      }

      return null;
    } catch (error) {
      this.emit('error', { type: 'contextLoad', error });
      throw new Error(`Failed to load context: ${error.message}`);
    }
  }

  /**
   * Update context with new information
   */
  async updateContext(updates) {
    if (!this.currentContext) {
      return null;
    }

    try {
      const previousState = { ...this.currentContext };

      // Apply updates
      if (updates.files) {
        updates.files.forEach(file => {
          this.currentContext.files.set(file.path, file);
        });
      }

      if (updates.commands) {
        this.currentContext.commands.push(...updates.commands);
      }

      if (updates.notes) {
        this.currentContext.notes.push(...updates.notes);
      }

      if (updates.bookmarks) {
        this.currentContext.bookmarks.push(...updates.bookmarks);
      }

      this.currentContext.timestamp = new Date().toISOString();

      // Auto-save if enabled
      if (this.config.autoSave.onCommand && updates.commands) {
        await this.saveContext('command');
      }

      this.emit('contextUpdated', {
        sessionId: this.activeSession?.id,
        updates,
        previousState
      });

      return this.currentContext;
    } catch (error) {
      this.emit('error', { type: 'contextUpdate', error });
      throw new Error(`Failed to update context: ${error.message}`);
    }
  }

  /**
   * Get session history
   */
  async getSessionHistory(limit = 50, filter = {}) {
    try {
      const sessions = await this.storage.getAllSessions(filter);

      // Apply pagination and sorting
      const sortedSessions = sessions
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .slice(0, limit);

      return {
        sessions: sortedSessions,
        total: sessions.length,
        limit
      };
    } catch (error) {
      this.emit('error', { type: 'sessionHistory', error });
      throw new Error(`Failed to get session history: ${error.message}`);
    }
  }

  /**
   * Search through work history
   */
  async searchHistory(query, options = {}) {
    try {
      const results = await this.storage.searchHistory(query, {
        sessions: options.sessions,
        contexts: options.contexts,
        commands: options.commands !== false,
        notes: options.notes !== false,
        limit: options.limit || 20
      });

      return results;
    } catch (error) {
      this.emit('error', { type: 'searchHistory', error });
      throw new Error(`Failed to search history: ${error.message}`);
    }
  }

  /**
   * Cleanup old data
   */
  async cleanup() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.context.retentionDays);

      await this.storage.cleanupOldData(cutoffDate);

      this.emit('cleanup', { cutoffDate });

      return { success: true, cutoffDate };
    } catch (error) {
      this.emit('error', { type: 'cleanup', error });
      throw new Error(`Failed to cleanup: ${error.message}`);
    }
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      activeSession: this.activeSession ? {
        id: this.activeSession.id,
        name: this.activeSession.name,
        startTime: this.activeSession.startTime,
        duration: this.activeSession.startTime ?
          Date.now() - new Date(this.activeSession.startTime).getTime() : 0
      } : null,
      currentContext: this.currentContext ? {
        sessionId: this.currentContext.sessionId,
        timestamp: this.currentContext.timestamp,
        fileCount: this.currentContext.files.size,
        commandCount: this.currentContext.commands.length,
        noteCount: this.currentContext.notes.length
      } : null,
      autoSaveEnabled: this.config.autoSave.enabled,
      autoSaveTimer: !!this.autoSaveTimer
    };
  }

  /**
   * Private methods
   */
  private async ensureDirectories() {
    const dirs = [
      'sessions',
      'context',
      'backups',
      'config'
    ];

    for (const dir of dirs) {
      await this.storage.ensureDirectory(dir);
    }
  }

  private async loadLastSession() {
    try {
      const lastSession = await this.storage.getLastSession();
      if (lastSession && lastSession.status === 'active') {
        await this.loadContext(lastSession.id);
        this.emit('sessionResumed', lastSession);
      }
    } catch (error) {
      console.warn('Could not load last session:', error.message);
    }
  }

  private startAutoSave() {
    if (!this.config.autoSave.enabled) {
      return;
    }

    this.autoSaveTimer = setInterval(async () => {
      try {
        await this.saveContext('auto');
      } catch (error) {
        this.emit('error', { type: 'autoSave', error });
      }
    }, this.config.autoSave.interval);
  }

  private stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  private setupFileWatcher() {
    if (!this.config.autoSave.onFileChange) {
      return;
    }

    // Implementation would depend on the storage engine
    // This is a placeholder for file watching logic
  }

  private setupEventHandlers() {
    this.on('newListener', (event) => {
      if (event === 'error' && this.listenerCount('error') === 0) {
        // Prevent uncaught error events
        this.on('error', (error) => {
          console.error('ContextManager Error:', error);
        });
      }
    });
  }

  private generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  private calculateContextSize() {
    if (!this.currentContext) return 0;

    return JSON.stringify({
      files: Array.from(this.currentContext.files.entries()),
      commands: this.currentContext.commands,
      notes: this.currentContext.notes,
      bookmarks: this.currentContext.bookmarks
    }).length;
  }

  private calculateChecksum() {
    if (!this.currentContext) return null;

    const data = JSON.stringify(this.currentContext);
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private compressContext(files) {
    // Simple compression - in production, use proper compression
    const compressed = new Map();
    for (const [path, file] of files) {
      if (file.content && file.content.length > 1000) {
        compressed.set(path, {
          ...file,
          content: file.content.substring(0, 100) + '...[compressed]',
          compressed: true
        });
      } else {
        compressed.set(path, file);
      }
    }
    return compressed;
  }

  private decompressContext(context) {
    if (context.files && context.files instanceof Map === false) {
      context.files = new Map(Object.entries(context.files));
    }
    return context;
  }

  private sanitizeEnvironment(env) {
    const sanitized = {};
    const allowedKeys = [
      'PATH', 'NODE_ENV', 'USER', 'HOME', 'LANG',
      'TERM', 'SHELL', 'PWD', 'EDITOR'
    ];

    for (const key of allowedKeys) {
      if (env[key]) {
        sanitized[key] = env[key];
      }
    }

    return sanitized;
  }

  /**
   * Cleanup resources
   */
  async destroy() {
    this.stopAutoSave();

    if (this.activeSession) {
      await this.endSession();
    }

    this.removeAllListeners();
  }
}

module.exports = ContextManager;