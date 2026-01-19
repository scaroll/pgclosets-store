/**
 * Persistent Context Manager
 * Bulletproof context persistence system for web development work
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ContextManager {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.contextDir = path.join(projectRoot, '.claude-context');
    this.currentSessionFile = path.join(this.contextDir, 'current-session.json');
    this.sessionsDir = path.join(this.contextDir, 'sessions');
    this.decisionsDir = path.join(this.contextDir, 'decisions');
    this.fileChangesDir = path.join(this.contextDir, 'file-changes');
    this.backupsDir = path.join(this.contextDir, 'backups');

    this.currentSession = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the context system
   */
  async initialize() {
    try {
      await this.ensureDirectories();
      await this.loadOrCreateSession();
      this.isInitialized = true;
      console.log('✅ Context system initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize context system:', error);
      throw error;
    }
  }

  /**
   * Ensure all required directories exist
   */
  async ensureDirectories() {
    const dirs = [
      this.contextDir,
      this.sessionsDir,
      this.decisionsDir,
      this.fileChangesDir,
      this.backupsDir
    ];

    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  /**
   * Load existing session or create new one
   */
  async loadOrCreateSession() {
    try {
      const sessionData = await fs.readFile(this.currentSessionFile, 'utf8');
      this.currentSession = JSON.parse(sessionData);
      this.currentSession.lastResumed = new Date().toISOString();
      await this.saveSession();
    } catch (error) {
      // No existing session, create new one
      this.currentSession = {
        id: this.generateId(),
        startTime: new Date().toISOString(),
        lastSaved: new Date().toISOString(),
        projectRoot: this.projectRoot,
        decisions: [],
        fileChanges: [],
        todoLists: [],
        progress: {},
        context: {},
        metadata: {
          version: '1.0.0',
          hostname: require('os').hostname(),
          platform: process.platform
        }
      };
      await this.saveSession();
    }
  }

  /**
   * Save current session to disk
   */
  async saveSession() {
    if (!this.currentSession) return;

    try {
      this.currentSession.lastSaved = new Date().toISOString();
      const sessionData = JSON.stringify(this.currentSession, null, 2);

      // Save current session
      await fs.writeFile(this.currentSessionFile, sessionData);

      // Create backup
      const backupFile = path.join(
        this.backupsDir,
        `session-${this.currentSession.id}-${Date.now()}.json`
      );
      await fs.writeFile(backupFile, sessionData);

      // Cleanup old backups (keep last 50)
      await this.cleanupOldBackups();

    } catch (error) {
      console.error('❌ Failed to save session:', error);
      throw error;
    }
  }

  /**
   * Record a decision with rationale
   */
  async recordDecision(decision) {
    if (!this.isInitialized) await this.initialize();

    const decisionRecord = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type: decision.type || 'general',
      title: decision.title,
      description: decision.description,
      rationale: decision.rationale,
      context: decision.context,
      files: decision.files || [],
      tags: decision.tags || [],
      impact: decision.impact || 'medium'
    };

    this.currentSession.decisions.push(decisionRecord);
    await this.saveSession();
    await this.saveDecisionToFile(decisionRecord);

    console.log(`📝 Decision recorded: ${decision.title}`);
    return decisionRecord;
  }

  /**
   * Record a file change
   */
  async recordFileChange(fileChange) {
    if (!this.isInitialized) await this.initialize();

    const changeRecord = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      filePath: fileChange.filePath,
      operation: fileChange.operation, // 'create', 'modify', 'delete'
      description: fileChange.description,
      beforeState: fileChange.beforeState,
      afterState: fileChange.afterState,
      linesAdded: fileChange.linesAdded || 0,
      linesRemoved: fileChange.linesRemoved || 0,
      checksum: fileChange.checksum
    };

    this.currentSession.fileChanges.push(changeRecord);
    await this.saveSession();
    await this.saveFileChangeToFile(changeRecord);

    console.log(`📁 File change recorded: ${fileChange.operation} ${fileChange.filePath}`);
    return changeRecord;
  }

  /**
   * Update TODO list
   */
  async updateTodoList(todoList) {
    if (!this.isInitialized) await this.initialize();

    const todoRecord = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      todos: todoList.todos,
      completed: todoList.completed || [],
      inProgress: todoList.inProgress || [],
      blocked: todoList.blocked || []
    };

    this.currentSession.todoLists.push(todoRecord);
    await this.saveSession();

    console.log(`✅ TODO list updated: ${todoList.todos.length} items`);
    return todoRecord;
  }

  /**
   * Update progress
   */
  async updateProgress(progressData) {
    if (!this.isInitialized) await this.initialize();

    this.currentSession.progress = {
      ...this.currentSession.progress,
      ...progressData,
      lastUpdated: new Date().toISOString()
    };

    await this.saveSession();
    console.log(`📊 Progress updated: ${progressData.description || 'General progress'}`);
  }

  /**
   * Search through all recorded data
   */
  async search(query, options = {}) {
    if (!this.isInitialized) await this.initialize();

    const results = {
      decisions: [],
      fileChanges: [],
      todoLists: [],
      sessions: []
    };

    const searchLower = query.toLowerCase();
    const searchTerms = query.split(' ').map(term => term.toLowerCase());

    // Search in current session
    results.decisions = this.currentSession.decisions.filter(decision =>
      this.matchesSearch(decision, searchLower, searchTerms)
    );

    results.fileChanges = this.currentSession.fileChanges.filter(change =>
      this.matchesSearch(change, searchLower, searchTerms)
    );

    // Search in historical sessions if requested
    if (options.includeHistory !== false) {
      const historicalSessions = await this.loadHistoricalSessions();
      results.sessions = historicalSessions.filter(session =>
        this.matchesSearch(session, searchLower, searchTerms)
      );
    }

    return results;
  }

  /**
   * Check if an object matches search terms
   */
  matchesSearch(obj, searchLower, searchTerms) {
    const searchable = JSON.stringify(obj).toLowerCase();

    // Match all terms (AND logic)
    return searchTerms.every(term => searchable.includes(term));
  }

  /**
   * Load historical sessions
   */
  async loadHistoricalSessions() {
    try {
      const files = await fs.readdir(this.sessionsDir);
      const sessions = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readFile(path.join(this.sessionsDir, file), 'utf8');
          sessions.push(JSON.parse(data));
        }
      }

      return sessions;
    } catch (error) {
      console.warn('No historical sessions found');
      return [];
    }
  }

  /**
   * Save decision to separate file
   */
  async saveDecisionToFile(decision) {
    const file = path.join(this.decisionsDir, `${decision.id}.json`);
    await fs.writeFile(file, JSON.stringify(decision, null, 2));
  }

  /**
   * Save file change to separate file
   */
  async saveFileChangeToFile(change) {
    const file = path.join(this.fileChangesDir, `${change.id}.json`);
    await fs.writeFile(file, JSON.stringify(change, null, 2));
  }

  /**
   * Cleanup old backup files
   */
  async cleanupOldBackups() {
    try {
      const files = await fs.readdir(this.backupsDir);
      const backupFiles = files
        .filter(f => f.endsWith('.json'))
        .map(f => ({
          name: f,
          path: path.join(this.backupsDir, f),
          time: fs.stat(path.join(this.backupsDir, f)).then(stat => stat.mtime)
        }));

      // Sort by time (newest first)
      const sortedBackups = await Promise.all(
        (await Promise.all(backupFiles)).sort((a, b) => b.time - a.time)
      );

      // Keep only the most recent 50
      const backupsToDelete = sortedBackups.slice(50);

      for (const backup of backupsToDelete) {
        await fs.unlink(backup.path);
      }
    } catch (error) {
      console.warn('Error cleaning up backups:', error.message);
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Generate checksum for data integrity
   */
  generateChecksum(data) {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  /**
   * Get session summary
   */
  getSessionSummary() {
    if (!this.currentSession) return null;

    const duration = Date.now() - new Date(this.currentSession.startTime).getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

    return {
      id: this.currentSession.id,
      startTime: this.currentSession.startTime,
      duration: `${hours}h ${minutes}m`,
      decisionsCount: this.currentSession.decisions.length,
      fileChangesCount: this.currentSession.fileChanges.length,
      todoItemsCount: this.currentSession.todoLists.length,
      lastSaved: this.currentSession.lastSaved
    };
  }

  /**
   * Export all context data
   */
  async exportContext() {
    if (!this.isInitialized) await this.initialize();

    const exportData = {
      session: this.currentSession,
      decisions: this.currentSession.decisions,
      fileChanges: this.currentSession.fileChanges,
      todoLists: this.currentSession.todoLists,
      progress: this.currentSession.progress,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const exportFile = path.join(
      this.contextDir,
      `export-${this.currentSession.id}-${Date.now()}.json`
    );

    await fs.writeFile(exportFile, JSON.stringify(exportData, null, 2));

    console.log(`📦 Context exported to: ${exportFile}`);
    return exportFile;
  }

  /**
   * End current session
   */
  async endSession() {
    if (!this.currentSession) return;

    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.duration = Date.now() - new Date(this.currentSession.startTime).getTime();

    // Save to historical sessions
    const historicalFile = path.join(
      this.sessionsDir,
      `session-${this.currentSession.id}.json`
    );
    await fs.writeFile(historicalFile, JSON.stringify(this.currentSession, null, 2));

    // Clear current session
    await fs.unlink(this.currentSessionFile);
    this.currentSession = null;
    this.isInitialized = false;

    console.log('🏁 Session ended and saved to history');
  }
}

module.exports = ContextManager;