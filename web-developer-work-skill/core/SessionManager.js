/**
 * Session Manager - Handles work sessions with comprehensive tracking
 * Manages session lifecycle, metadata, and recovery
 */

const crypto = require('crypto');
const EventEmitter = require('events');

class SessionManager extends EventEmitter {
  constructor(storageEngine, config = {}) {
    super();
    this.storage = storageEngine;
    this.config = {
      timeout: 1800000, // 30 minutes
      autoResume: true,
      trackActivity: true,
      maxSessionDuration: 86400000, // 24 hours
      ...config
    };

    this.activeSession = null;
    this.sessionTimer = null;
    this.activityBuffer = [];
    this.lastActivity = null;
  }

  /**
   * Create a new session
   */
  async createSession(name, options = {}) {
    try {
      // End any existing session
      if (this.activeSession) {
        await this.endSession();
      }

      const sessionId = crypto.randomBytes(16).toString('hex');
      const now = new Date().toISOString();

      const session = {
        id: sessionId,
        name: name || `Session ${new Date().toLocaleString()}`,
        startTime: now,
        endTime: null,
        status: 'active',
        metadata: {
          platform: process.platform,
          nodeVersion: process.version,
          workingDirectory: process.cwd(),
          environment: this.getEnvironmentInfo(),
          ...options.metadata
        },
        settings: {
          autoSave: options.autoSave !== false,
          trackFiles: options.trackFiles !== false,
          trackCommands: options.trackCommands !== false,
          ...options.settings
        },
        statistics: {
          duration: 0,
          fileOperations: 0,
          commandsExecuted: 0,
          contextsSaved: 0,
          activities: []
        },
        checkpoints: [],
        tags: options.tags || [],
        description: options.description || ''
      };

      this.activeSession = session;
      this.lastActivity = Date.now();
      this.startSessionTimer();

      // Save session to storage
      await this.storage.saveSession(session);

      // Emit events
      this.emit('sessionCreated', session);
      this.emit('activity', {
        type: 'session_start',
        sessionId: session.id,
        timestamp: now
      });

      return session;
    } catch (error) {
      this.emit('error', { type: 'sessionCreate', error });
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  /**
   * Resume an existing session
   */
  async resumeSession(sessionId) {
    try {
      const session = await this.storage.getSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      if (session.status !== 'active') {
        throw new Error(`Session ${sessionId} is not resumable`);
      }

      // End current session if exists
      if (this.activeSession && this.activeSession.id !== sessionId) {
        await this.endSession();
      }

      // Update session with resume information
      session.lastResumed = new Date().toISOString();
      session.resumeCount = (session.resumeCount || 0) + 1;

      this.activeSession = session;
      this.lastActivity = Date.now();
      this.startSessionTimer();

      // Save updated session
      await this.storage.saveSession(session);

      this.emit('sessionResumed', session);
      this.emit('activity', {
        type: 'session_resume',
        sessionId: session.id,
        timestamp: session.lastResumed
      });

      return session;
    } catch (error) {
      this.emit('error', { type: 'sessionResume', error });
      throw new Error(`Failed to resume session: ${error.message}`);
    }
  }

  /**
   * End the current session
   */
  async endSession(reason = 'manual') {
    if (!this.activeSession) {
      return null;
    }

    try {
      const session = { ...this.activeSession };

      // Update session
      session.endTime = new Date().toISOString();
      session.status = 'completed';
      session.endReason = reason;
      session.statistics.duration = Date.now() - new Date(session.startTime).getTime();

      // Stop session timer
      this.stopSessionTimer();

      // Create final checkpoint
      await this.createCheckpoint('session_end', {
        reason,
        finalDuration: session.statistics.duration
      });

      // Save session
      await this.storage.saveSession(session);

      this.emit('sessionEnded', session);
      this.emit('activity', {
        type: 'session_end',
        sessionId: session.id,
        timestamp: session.endTime,
        reason
      });

      this.activeSession = null;
      this.lastActivity = null;
      this.activityBuffer = [];

      return session;
    } catch (error) {
      this.emit('error', { type: 'sessionEnd', error });
      throw new Error(`Failed to end session: ${error.message}`);
    }
  }

  /**
   * Create a checkpoint in the session
   */
  async createCheckpoint(type, data = {}) {
    if (!this.activeSession) {
      return null;
    }

    try {
      const checkpoint = {
        id: crypto.randomBytes(8).toString('hex'),
        type,
        timestamp: new Date().toISOString(),
        data: {
          ...data,
          sessionDuration: Date.now() - new Date(this.activeSession.startTime).getTime()
        }
      };

      this.activeSession.checkpoints.push(checkpoint);

      // Limit checkpoints to prevent memory issues
      if (this.activeSession.checkpoints.length > 100) {
        this.activeSession.checkpoints = this.activeSession.checkpoints.slice(-50);
      }

      await this.storage.saveSession(this.activeSession);

      this.emit('checkpointCreated', {
        sessionId: this.activeSession.id,
        checkpoint
      });

      return checkpoint;
    } catch (error) {
      this.emit('error', { type: 'checkpointCreate', error });
      throw new Error(`Failed to create checkpoint: ${error.message}`);
    }
  }

  /**
   * Track activity in the session
   */
  trackActivity(type, data = {}) {
    if (!this.activeSession || !this.config.trackActivity) {
      return;
    }

    const activity = {
      type,
      timestamp: new Date().toISOString(),
      data
    };

    this.activityBuffer.push(activity);
    this.lastActivity = Date.now();

    // Update session statistics
    switch (type) {
      case 'file_operation':
        this.activeSession.statistics.fileOperations++;
        break;
      case 'command':
        this.activeSession.statistics.commandsExecuted++;
        break;
      case 'context_save':
        this.activeSession.statistics.contextsSaved++;
        break;
    }

    // Add to session activities (with limit)
    this.activeSession.statistics.activities.push(activity);
    if (this.activeSession.statistics.activities.length > 1000) {
      this.activeSession.statistics.activities = this.activeSession.statistics.activities.slice(-500);
    }

    this.emit('activity', {
      ...activity,
      sessionId: this.activeSession.id
    });
  }

  /**
   * Get session history
   */
  async getSessionHistory(options = {}) {
    try {
      const {
        limit = 50,
        status,
        dateFrom,
        dateTo,
        tags,
        name
      } = options;

      const sessions = await this.storage.getAllSessions({
        status,
        dateFrom,
        dateTo
      });

      let filteredSessions = sessions;

      // Filter by tags
      if (tags && tags.length > 0) {
        filteredSessions = filteredSessions.filter(session =>
          tags.some(tag => session.tags.includes(tag))
        );
      }

      // Filter by name
      if (name) {
        const nameLower = name.toLowerCase();
        filteredSessions = filteredSessions.filter(session =>
          session.name.toLowerCase().includes(nameLower)
        );
      }

      // Sort by start time (newest first)
      filteredSessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

      // Apply limit
      const limitedSessions = filteredSessions.slice(0, limit);

      return {
        sessions: limitedSessions,
        total: filteredSessions.length,
        limit
      };
    } catch (error) {
      this.emit('error', { type: 'sessionHistory', error });
      throw new Error(`Failed to get session history: ${error.message}`);
    }
  }

  /**
   * Get session details
   */
  async getSessionDetails(sessionId) {
    try {
      const session = await this.storage.getSession(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Get related contexts
      const contexts = await this.storage.getContextsBySession(sessionId);

      return {
        session,
        contexts,
        contextCount: contexts.length,
        hasActiveContext: session.status === 'active'
      };
    } catch (error) {
      this.emit('error', { type: 'sessionDetails', error });
      throw new Error(`Failed to get session details: ${error.message}`);
    }
  }

  /**
   * Update session metadata
   */
  async updateSessionMetadata(updates) {
    if (!this.activeSession) {
      throw new Error('No active session to update');
    }

    try {
      const allowedUpdates = ['name', 'description', 'tags', 'metadata', 'settings'];

      for (const [key, value] of Object.entries(updates)) {
        if (allowedUpdates.includes(key)) {
          this.activeSession[key] = value;
        }
      }

      await this.storage.saveSession(this.activeSession);

      this.emit('sessionUpdated', {
        sessionId: this.activeSession.id,
        updates
      });

      return this.activeSession;
    } catch (error) {
      this.emit('error', { type: 'sessionUpdate', error });
      throw new Error(`Failed to update session metadata: ${error.message}`);
    }
  }

  /**
   * Get session statistics
   */
  getSessionStatistics(sessionId = null) {
    if (sessionId) {
      // Return statistics for specific session (would need to load from storage)
      return this.getSessionDetails(sessionId).then(details => details.session.statistics);
    }

    if (!this.activeSession) {
      return null;
    }

    const now = Date.now();
    const sessionStart = new Date(this.activeSession.startTime).getTime();
    const currentDuration = now - sessionStart;

    return {
      ...this.activeSession.statistics,
      currentDuration,
      lastActivity: this.lastActivity,
      idleTime: this.lastActivity ? now - this.lastActivity : 0,
      checkpointCount: this.activeSession.checkpoints.length,
      bufferActivityCount: this.activityBuffer.length
    };
  }

  /**
   * Check session health
   */
  checkSessionHealth() {
    if (!this.activeSession) {
      return { healthy: false, reason: 'No active session' };
    }

    const now = Date.now();
    const sessionStart = new Date(this.activeSession.startTime).getTime();
    const sessionDuration = now - sessionStart;
    const idleTime = this.lastActivity ? now - this.lastActivity : sessionDuration;

    const health = {
      healthy: true,
      sessionId: this.activeSession.id,
      sessionDuration,
      idleTime,
      warnings: []
    };

    // Check for warnings
    if (sessionDuration > this.config.maxSessionDuration) {
      health.warnings.push('Session exceeds maximum duration');
    }

    if (idleTime > this.config.timeout) {
      health.warnings.push('Session idle timeout exceeded');
      health.healthy = false;
    }

    if (this.activityBuffer.length > 1000) {
      health.warnings.push('Activity buffer overflow');
    }

    return health;
  }

  /**
   * Auto-resume last session
   */
  async autoResumeLastSession() {
    if (!this.config.autoResume) {
      return null;
    }

    try {
      const lastSession = await this.storage.getLastSession();

      if (lastSession && lastSession.status === 'active') {
        await this.resumeSession(lastSession.id);
        return lastSession;
      }

      return null;
    } catch (error) {
      this.emit('error', { type: 'autoResume', error });
      return null;
    }
  }

  /**
   * Private methods
   */
  startSessionTimer() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }

    this.sessionTimer = setInterval(() => {
      this.checkSessionTimeout();
    }, 60000); // Check every minute
  }

  stopSessionTimer() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  async checkSessionTimeout() {
    if (!this.activeSession) {
      return;
    }

    const health = this.checkSessionHealth();

    if (!health.healthy) {
      if (health.warnings.includes('Session idle timeout exceeded')) {
        await this.endSession('timeout');
        this.emit('sessionTimeout', this.activeSession);
      }
    }
  }

  getEnvironmentInfo() {
    return {
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
      pid: process.pid,
      cwd: process.cwd(),
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      hasActiveSession: !!this.activeSession,
      activeSession: this.activeSession ? {
        id: this.activeSession.id,
        name: this.activeSession.name,
        startTime: this.activeSession.startTime,
        duration: Date.now() - new Date(this.activeSession.startTime).getTime(),
        lastActivity: this.lastActivity
      } : null,
      statistics: this.getSessionStatistics(),
      health: this.checkSessionHealth(),
      config: {
        timeout: this.config.timeout,
        autoResume: this.config.autoResume,
        trackActivity: this.config.trackActivity
      }
    };
  }

  /**
   * Cleanup resources
   */
  async destroy() {
    this.stopSessionTimer();

    if (this.activeSession) {
      await this.endSession('destroy');
    }

    this.removeAllListeners();
    this.activeSession = null;
    this.activityBuffer = [];
    this.lastActivity = null;
  }
}

module.exports = SessionManager;