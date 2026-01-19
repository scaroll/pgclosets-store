/**
 * Storage Engine - Reliable file-based storage with JSON format
 * Handles data persistence, integrity checks, and backup management
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class StorageEngine {
  constructor(baseDir, config = {}) {
    this.baseDir = path.resolve(baseDir);
    this.config = {
      maxBackups: 50,
      compressionEnabled: true,
      integrityChecks: true,
      ...config
    };

    this.directories = {
      sessions: path.join(this.baseDir, 'sessions'),
      contexts: path.join(this.baseDir, 'context'),
      backups: path.join(this.baseDir, 'backups'),
      config: path.join(this.baseDir, 'config')
    };
  }

  /**
   * Initialize storage directories
   */
  async initialize() {
    try {
      await this.ensureDirectory(this.baseDir);

      for (const dir of Object.values(this.directories)) {
        await this.ensureDirectory(dir);
      }

      // Create subdirectories
      await this.ensureDirectory(path.join(this.directories.sessions, 'session-history'));
      await this.ensureDirectory(path.join(this.directories.sessions, 'session-backups'));
      await this.ensureDirectory(path.join(this.directories.contexts, 'context-history'));
      await this.ensureDirectory(path.join(this.directories.contexts, 'context-snapshots'));
      await this.ensureDirectory(path.join(this.directories.backups, 'automatic'));
      await this.ensureDirectory(path.join(this.directories.backups, 'manual'));
      await this.ensureDirectory(path.join(this.directories.backups, 'recovery-points'));

      return { success: true, baseDir: this.baseDir };
    } catch (error) {
      throw new Error(`StorageEngine initialization failed: ${error.message}`);
    }
  }

  /**
   * Session management
   */
  async saveSession(session) {
    try {
      const sessionFile = path.join(this.directories.sessions, 'active-session.json');
      const sessionHistoryFile = path.join(
        this.directories.sessions,
        'session-history',
        `${session.id}.json`
      );

      const sessionData = {
        ...session,
        savedAt: new Date().toISOString(),
        checksum: this.calculateChecksum(session)
      };

      // Save as active session
      await this.writeJsonFile(sessionFile, sessionData);

      // Save to history
      await this.writeJsonFile(sessionHistoryFile, sessionData);

      return sessionData;
    } catch (error) {
      throw new Error(`Failed to save session: ${error.message}`);
    }
  }

  async updateSession(session) {
    return this.saveSession(session);
  }

  async getSession(sessionId) {
    try {
      const sessionFile = path.join(
        this.directories.sessions,
        'session-history',
        `${sessionId}.json`
      );

      const data = await this.readJsonFile(sessionFile);

      if (this.config.integrityChecks) {
        this.verifyIntegrity(data);
      }

      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw new Error(`Failed to get session: ${error.message}`);
    }
  }

  async getActiveSession() {
    try {
      const activeSessionFile = path.join(this.directories.sessions, 'active-session.json');
      const data = await this.readJsonFile(activeSessionFile);

      if (this.config.integrityChecks) {
        this.verifyIntegrity(data);
      }

      return data;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw new Error(`Failed to get active session: ${error.message}`);
    }
  }

  async getLastSession() {
    try {
      const sessionHistoryDir = path.join(this.directories.sessions, 'session-history');
      const files = await fs.readdir(sessionHistoryDir);

      if (files.length === 0) {
        return null;
      }

      // Get the most recent session
      const stats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(sessionHistoryDir, file);
          const stat = await fs.stat(filePath);
          return { file, path: filePath, mtime: stat.mtime };
        })
      );

      stats.sort((a, b) => b.mtime - a.mtime);
      const latestFile = stats[0];

      const sessionData = await this.readJsonFile(latestFile.path);

      if (this.config.integrityChecks) {
        this.verifyIntegrity(sessionData);
      }

      return sessionData;
    } catch (error) {
      throw new Error(`Failed to get last session: ${error.message}`);
    }
  }

  async getAllSessions(filter = {}) {
    try {
      const sessionHistoryDir = path.join(this.directories.sessions, 'session-history');
      const files = await fs.readdir(sessionHistoryDir);

      const sessions = [];

      for (const file of files) {
        try {
          const filePath = path.join(sessionHistoryDir, file);
          const sessionData = await this.readJsonFile(filePath);

          if (this.config.integrityChecks) {
            this.verifyIntegrity(sessionData);
          }

          // Apply filters
          if (filter.status && sessionData.status !== filter.status) {
            continue;
          }

          if (filter.dateFrom && new Date(sessionData.startTime) < new Date(filter.dateFrom)) {
            continue;
          }

          if (filter.dateTo && new Date(sessionData.startTime) > new Date(filter.dateTo)) {
            continue;
          }

          sessions.push(sessionData);
        } catch (error) {
          console.warn(`Failed to load session ${file}:`, error.message);
        }
      }

      return sessions;
    } catch (error) {
      throw new Error(`Failed to get all sessions: ${error.message}`);
    }
  }

  /**
   * Context management
   */
  async saveContext(context) {
    try {
      const contextId = `${context.sessionId}_${Date.now()}`;
      const contextFile = path.join(
        this.directories.contexts,
        'context-snapshots',
        `${contextId}.json`
      );

      const contextData = {
        ...context,
        id: contextId,
        savedAt: new Date().toISOString(),
        checksum: this.calculateChecksum(context)
      };

      await this.writeJsonFile(contextFile, contextData);

      // Also save as latest context for the session
      const latestContextFile = path.join(
        this.directories.contexts,
        `latest_${context.sessionId}.json`
      );
      await this.writeJsonFile(latestContextFile, contextData);

      return contextData;
    } catch (error) {
      throw new Error(`Failed to save context: ${error.message}`);
    }
  }

  async getContextsBySession(sessionId) {
    try {
      const contextSnapshotsDir = path.join(this.directories.contexts, 'context-snapshots');
      const files = await fs.readdir(contextSnapshotsDir);

      const sessionContexts = [];

      for (const file of files) {
        if (file.startsWith(`${sessionId}_`)) {
          try {
            const filePath = path.join(contextSnapshotsDir, file);
            const contextData = await this.readJsonFile(filePath);

            if (this.config.integrityChecks) {
              this.verifyIntegrity(contextData);
            }

            sessionContexts.push(contextData);
          } catch (error) {
            console.warn(`Failed to load context ${file}:`, error.message);
          }
        }
      }

      // Sort by timestamp
      sessionContexts.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      return sessionContexts;
    } catch (error) {
      throw new Error(`Failed to get contexts for session: ${error.message}`);
    }
  }

  async getLatestContext(sessionId) {
    try {
      const latestContextFile = path.join(
        this.directories.contexts,
        `latest_${sessionId}.json`
      );

      const contextData = await this.readJsonFile(latestContextFile);

      if (this.config.integrityChecks) {
        this.verifyIntegrity(contextData);
      }

      return contextData;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw new Error(`Failed to get latest context: ${error.message}`);
    }
  }

  /**
   * Backup management
   */
  async createBackup(data, type = 'manual', description = '') {
    try {
      const backupId = crypto.randomBytes(16).toString('hex');
      const timestamp = new Date().toISOString();
      const backupDir = path.join(this.directories.backups, type);

      const backupData = {
        id: backupId,
        type,
        description,
        timestamp,
        data,
        checksum: this.calculateChecksum(data)
      };

      const backupFile = path.join(backupDir, `${backupId}.json`);
      await this.writeJsonFile(backupFile, backupData);

      // Maintain backup limit
      await this.maintainBackupLimit(type);

      return backupData;
    } catch (error) {
      throw new Error(`Failed to create backup: ${error.message}`);
    }
  }

  async restoreBackup(backupId, type = 'manual') {
    try {
      const backupFile = path.join(
        this.directories.backups,
        type,
        `${backupId}.json`
      );

      const backupData = await this.readJsonFile(backupFile);

      if (this.config.integrityChecks) {
        this.verifyIntegrity(backupData);
      }

      return backupData;
    } catch (error) {
      throw new Error(`Failed to restore backup: ${error.message}`);
    }
  }

  async listBackups(type = null) {
    try {
      const backups = [];

      const backupTypes = type ? [type] : ['automatic', 'manual', 'recovery-points'];

      for (const backupType of backupTypes) {
        const backupDir = path.join(this.directories.backups, backupType);

        try {
          const files = await fs.readdir(backupDir);

          for (const file of files) {
            try {
              const filePath = path.join(backupDir, file);
              const backupData = await this.readJsonFile(filePath);
              backups.push(backupData);
            } catch (error) {
              console.warn(`Failed to load backup ${file}:`, error.message);
            }
          }
        } catch (error) {
          // Directory might not exist, skip it
        }
      }

      // Sort by timestamp (newest first)
      backups.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return backups;
    } catch (error) {
      throw new Error(`Failed to list backups: ${error.message}`);
    }
  }

  /**
   * Search functionality
   */
  async searchHistory(query, options = {}) {
    try {
      const results = {
        sessions: [],
        contexts: [],
        commands: [],
        notes: [],
        total: 0
      };

      const queryLower = query.toLowerCase();

      // Search sessions
      if (options.sessions !== false) {
        const sessions = await this.getAllSessions();
        for (const session of sessions) {
          if (this.matchesQuery(session, queryLower)) {
            results.sessions.push(session);
          }
        }
      }

      // Search contexts
      if (options.contexts !== false) {
        const contextSnapshotsDir = path.join(this.directories.contexts, 'context-snapshots');
        const files = await fs.readdir(contextSnapshotsDir);

        for (const file of files) {
          try {
            const filePath = path.join(contextSnapshotsDir, file);
            const contextData = await this.readJsonFile(filePath);

            if (this.matchesQuery(contextData, queryLower)) {
              results.contexts.push(contextData);

              // Search commands within context
              if (options.commands !== false && contextData.commands) {
                for (const command of contextData.commands) {
                  if (this.matchesQuery(command, queryLower)) {
                    results.commands.push({
                      ...command,
                      contextId: contextData.id,
                      sessionId: contextData.sessionId,
                      timestamp: contextData.timestamp
                    });
                  }
                }
              }

              // Search notes within context
              if (options.notes !== false && contextData.notes) {
                for (const note of contextData.notes) {
                  if (this.matchesQuery(note, queryLower)) {
                    results.notes.push({
                      ...note,
                      contextId: contextData.id,
                      sessionId: contextData.sessionId,
                      timestamp: contextData.timestamp
                    });
                  }
                }
              }
            }
          } catch (error) {
            console.warn(`Failed to search context ${file}:`, error.message);
          }
        }
      }

      // Apply limit
      const limit = options.limit || 20;
      const allResults = [
        ...results.sessions,
        ...results.contexts,
        ...results.commands,
        ...results.notes
      ].slice(0, limit);

      results.total = allResults.length;

      return results;
    } catch (error) {
      throw new Error(`Failed to search history: ${error.message}`);
    }
  }

  /**
   * Cleanup operations
   */
  async cleanupOldData(cutoffDate) {
    try {
      const results = {
        sessionsDeleted: 0,
        contextsDeleted: 0,
        backupsDeleted: 0
      };

      // Clean old sessions
      const sessionHistoryDir = path.join(this.directories.sessions, 'session-history');
      const sessionFiles = await fs.readdir(sessionHistoryDir);

      for (const file of sessionFiles) {
        try {
          const filePath = path.join(sessionHistoryDir, file);
          const stat = await fs.stat(filePath);

          if (stat.mtime < cutoffDate) {
            await fs.unlink(filePath);
            results.sessionsDeleted++;
          }
        } catch (error) {
          console.warn(`Failed to cleanup session ${file}:`, error.message);
        }
      }

      // Clean old contexts
      const contextSnapshotsDir = path.join(this.directories.contexts, 'context-snapshots');
      const contextFiles = await fs.readdir(contextSnapshotsDir);

      for (const file of contextFiles) {
        try {
          const filePath = path.join(contextSnapshotsDir, file);
          const stat = await fs.stat(filePath);

          if (stat.mtime < cutoffDate) {
            await fs.unlink(filePath);
            results.contextsDeleted++;
          }
        } catch (error) {
          console.warn(`Failed to cleanup context ${file}:`, error.message);
        }
      }

      // Clean old automatic backups
      const autoBackupDir = path.join(this.directories.backups, 'automatic');
      const backupFiles = await fs.readdir(autoBackupDir);

      for (const file of backupFiles) {
        try {
          const filePath = path.join(autoBackupDir, file);
          const stat = await fs.stat(filePath);

          if (stat.mtime < cutoffDate) {
            await fs.unlink(filePath);
            results.backupsDeleted++;
          }
        } catch (error) {
          console.warn(`Failed to cleanup backup ${file}:`, error.message);
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Failed to cleanup old data: ${error.message}`);
    }
  }

  /**
   * Utility methods
   */
  async ensureDirectory(dirPath) {
    try {
      await fs.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async writeJsonFile(filePath, data) {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, jsonString, 'utf8');
  }

  async readJsonFile(filePath) {
    const jsonString = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonString);
  }

  calculateChecksum(data) {
    const jsonString = JSON.stringify(data);
    return crypto.createHash('sha256').update(jsonString).digest('hex');
  }

  verifyIntegrity(data) {
    if (!data.checksum) {
      return true; // No checksum to verify
    }

    const calculatedChecksum = this.calculateChecksum(
      Object.fromEntries(
        Object.entries(data).filter(([key]) => key !== 'checksum')
      )
    );

    if (calculatedChecksum !== data.checksum) {
      throw new Error('Data integrity check failed - checksum mismatch');
    }

    return true;
  }

  matchesQuery(obj, query) {
    if (typeof obj !== 'object' || obj === null) {
      return String(obj).toLowerCase().includes(query);
    }

    for (const value of Object.values(obj)) {
      if (typeof value === 'string' && value.toLowerCase().includes(query)) {
        return true;
      }

      if (typeof value === 'object' && this.matchesQuery(value, query)) {
        return true;
      }
    }

    return false;
  }

  async maintainBackupLimit(type) {
    try {
      const backupDir = path.join(this.directories.backups, type);
      const files = await fs.readdir(backupDir);

      if (files.length <= this.config.maxBackups) {
        return;
      }

      // Get file stats and sort by creation time
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(backupDir, file);
          const stat = await fs.stat(filePath);
          return { file, path: filePath, ctime: stat.ctime };
        })
      );

      fileStats.sort((a, b) => b.ctime - a.ctime);

      // Delete oldest files
      const filesToDelete = fileStats.slice(this.config.maxBackups);

      for (const { path: filePath } of filesToDelete) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.warn(`Failed to maintain backup limit for ${type}:`, error.message);
    }
  }

  /**
   * Get storage statistics
   */
  async getStorageStats() {
    try {
      const stats = {
        sessions: 0,
        contexts: 0,
        backups: {
          manual: 0,
          automatic: 0,
          recovery: 0
        },
        totalSize: 0
      };

      // Count sessions
      const sessionHistoryDir = path.join(this.directories.sessions, 'session-history');
      try {
        const sessionFiles = await fs.readdir(sessionHistoryDir);
        stats.sessions = sessionFiles.length;
      } catch (error) {
        // Directory doesn't exist
      }

      // Count contexts
      const contextSnapshotsDir = path.join(this.directories.contexts, 'context-snapshots');
      try {
        const contextFiles = await fs.readdir(contextSnapshotsDir);
        stats.contexts = contextFiles.length;
      } catch (error) {
        // Directory doesn't exist
      }

      // Count backups
      for (const type of ['manual', 'automatic', 'recovery-points']) {
        const backupDir = path.join(this.directories.backups, type);
        try {
          const backupFiles = await fs.readdir(backupDir);
          stats.backups[type === 'recovery-points' ? 'recovery' : type] = backupFiles.length;
        } catch (error) {
          // Directory doesn't exist
        }
      }

      return stats;
    } catch (error) {
      throw new Error(`Failed to get storage stats: ${error.message}`);
    }
  }
}

module.exports = StorageEngine;