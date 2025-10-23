/**
 * State Manager - Advanced state management and work session continuity
 * Handles complex state transitions, persistence, and recovery
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const EventEmitter = require('events');

class StateManager extends EventEmitter {
  constructor(storageEngine, config = {}) {
    super();
    this.storage = storageEngine;
    this.config = {
      stateCompressionThreshold: 100000, // 100KB
      maxStateHistory: 50,
      autoCheckpointInterval: 600000, // 10 minutes
      enableStateDiffing: true,
      enableLazyLoading: true,
      ...config
    };

    this.currentState = null;
    this.stateHistory = [];
    this.stateDiffCache = new Map();
    this.checkpointTimer = null;
    this.stateTransitions = new Map();
    this.lazyLoadQueue = new Set();
  }

  /**
   * Initialize the state manager
   */
  async initialize() {
    try {
      await this.loadLastState();
      this.startAutoCheckpoint();
      this.setupStateTransitions();

      this.emit('initialized', {
        hasState: !!this.currentState,
        stateVersion: this.currentState?.version || 0
      });

      return true;
    } catch (error) {
      this.emit('error', { type: 'initialization', error });
      throw new Error(`StateManager initialization failed: ${error.message}`);
    }
  }

  /**
   * Set current state
   */
  async setState(newState, transition = 'manual') {
    try {
      const previousState = this.currentState;
      const stateVersion = (previousState?.version || 0) + 1;

      // Create state object with metadata
      const stateObject = {
        id: this.generateStateId(),
        version: stateVersion,
        timestamp: new Date().toISOString(),
        transition,
        data: newState,
        metadata: {
          size: this.calculateStateSize(newState),
          checksum: this.calculateStateChecksum(newState),
          previousStateId: previousState?.id || null,
          diff: null
        }
      };

      // Calculate diff if enabled and previous state exists
      if (this.config.enableStateDiffing && previousState) {
        stateObject.metadata.diff = this.calculateStateDiff(previousState.data, newState);
      }

      // Validate state
      this.validateState(stateObject);

      // Update current state
      this.currentState = stateObject;

      // Add to history
      this.addToHistory(stateObject);

      // Persist state
      await this.persistState(stateObject);

      // Emit state change event
      this.emit('stateChanged', {
        stateId: stateObject.id,
        version: stateVersion,
        transition,
        previousStateId: previousState?.id || null
      });

      return stateObject;

    } catch (error) {
      this.emit('error', { type: 'setState', error });
      throw new Error(`Failed to set state: ${error.message}`);
    }
  }

  /**
   * Get current state
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * Get state by ID
   */
  async getState(stateId) {
    try {
      // Check cache first
      if (this.currentState?.id === stateId) {
        return this.currentState;
      }

      // Check history
      const historyState = this.stateHistory.find(s => s.id === stateId);
      if (historyState) {
        return historyState;
      }

      // Load from storage
      const state = await this.loadStateFromStorage(stateId);
      if (state) {
        return state;
      }

      return null;

    } catch (error) {
      this.emit('error', { type: 'getState', error });
      throw new Error(`Failed to get state ${stateId}: ${error.message}`);
    }
  }

  /**
   * Revert to previous state
   */
  async revertToState(stateId, reason = 'manual') {
    try {
      const targetState = await this.getState(stateId);
      if (!targetState) {
        throw new Error(`State ${stateId} not found`);
      }

      return await this.setState(targetState.data, `revert_${reason}`);

    } catch (error) {
      this.emit('error', { type: 'revertToState', error });
      throw new Error(`Failed to revert to state ${stateId}: ${error.message}`);
    }
  }

  /**
   * Create state checkpoint
   */
  async createCheckpoint(type = 'manual', metadata = {}) {
    try {
      const checkpoint = {
        id: this.generateCheckpointId(),
        type,
        timestamp: new Date().toISOString(),
        stateId: this.currentState?.id,
        stateVersion: this.currentState?.version || 0,
        metadata: {
          ...metadata,
          systemInfo: this.getSystemInfo()
        }
      };

      // Save checkpoint
      await this.saveCheckpoint(checkpoint);

      this.emit('checkpointCreated', checkpoint);

      return checkpoint;

    } catch (error) {
      this.emit('error', { type: 'createCheckpoint', error });
      throw new Error(`Failed to create checkpoint: ${error.message}`);
    }
  }

  /**
   * Restore from checkpoint
   */
  async restoreFromCheckpoint(checkpointId) {
    try {
      const checkpoint = await this.loadCheckpoint(checkpointId);
      if (!checkpoint) {
        throw new Error(`Checkpoint ${checkpointId} not found`);
      }

      if (!checkpoint.stateId) {
        throw new Error(`Checkpoint ${checkpointId} has no associated state`);
      }

      return await this.revertToState(checkpoint.stateId, 'checkpoint');

    } catch (error) {
      this.emit('error', { type: 'restoreFromCheckpoint', error });
      throw new Error(`Failed to restore from checkpoint ${checkpointId}: ${error.message}`);
    }
  }

  /**
   * Get state history
   */
  getStateHistory(options = {}) {
    const {
      limit = 20,
      fromVersion = 0,
      toVersion = Infinity,
      transitions = null
    } = options;

    let history = [...this.stateHistory];

    // Add current state if not in history
    if (this.currentState && !history.find(s => s.id === this.currentState.id)) {
      history.unshift(this.currentState);
    }

    // Filter by version range
    history = history.filter(state =>
      state.version >= fromVersion && state.version <= toVersion
    );

    // Filter by transitions
    if (transitions && transitions.length > 0) {
      history = history.filter(state => transitions.includes(state.transition));
    }

    // Sort by version (newest first)
    history.sort((a, b) => b.version - a.version);

    // Apply limit
    return history.slice(0, limit);
  }

  /**
   * Calculate state diff
   */
  calculateStateDiff(oldState, newState) {
    const diff = {
      added: [],
      modified: [],
      deleted: [],
      moved: []
    };

    if (typeof oldState === 'object' && typeof newState === 'object') {
      // Compare objects
      const allKeys = new Set([
        ...Object.keys(oldState || {}),
        ...Object.keys(newState || {})
      ]);

      for (const key of allKeys) {
        const oldValue = oldState?.[key];
        const newValue = newState?.[key];

        if (oldValue === undefined) {
          diff.added.push({ key, value: newValue });
        } else if (newValue === undefined) {
          diff.deleted.push({ key, value: oldValue });
        } else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          diff.modified.push({ key, oldValue, newValue });
        }
      }
    } else {
      // Simple value comparison
      if (oldState !== newState) {
        diff.modified.push({
          key: 'value',
          oldValue,
          newValue
        });
      }
    }

    return diff;
  }

  /**
   * Apply state diff
   */
  applyStateDiff(baseState, diff) {
    if (typeof baseState !== 'object' || baseState === null) {
      return diff.modified.find(m => m.key === 'value')?.newValue || baseState;
    }

    const result = { ...baseState };

    // Apply deletions
    for (const deletion of diff.deleted) {
      delete result[deletion.key];
    }

    // Apply modifications
    for (const modification of diff.modified) {
      result[modification.key] = modification.newValue;
    }

    // Apply additions
    for (const addition of diff.added) {
      result[addition.key] = addition.value;
    }

    return result;
  }

  /**
   * Lazy load state data
   */
  async lazyLoadState(stateId, dataPath = null) {
    if (!this.config.enableLazyLoading) {
      return await this.getState(stateId);
    }

    try {
      // Check if already loading
      if (this.lazyLoadQueue.has(stateId)) {
        return await this.waitForLazyLoad(stateId);
      }

      this.lazyLoadQueue.add(stateId);

      // Load state metadata first
      const stateMetadata = await this.loadStateMetadata(stateId);
      if (!stateMetadata) {
        throw new Error(`State ${stateId} not found`);
      }

      // Load specific data path if requested
      if (dataPath) {
        const specificData = await this.loadStateDataPath(stateId, dataPath);
        return {
          ...stateMetadata,
          data: specificData
        };
      }

      // Load full state
      const fullState = await this.loadStateFromStorage(stateId);
      return fullState;

    } catch (error) {
      this.emit('error', { type: 'lazyLoadState', error });
      throw error;
    } finally {
      this.lazyLoadQueue.delete(stateId);
    }
  }

  /**
   * Merge states
   */
  async mergeStates(stateIds, mergeStrategy = 'latest') {
    try {
      const states = await Promise.all(
        stateIds.map(id => this.getState(id))
      );

      const validStates = states.filter(Boolean);
      if (validStates.length === 0) {
        throw new Error('No valid states to merge');
      }

      let mergedData;

      switch (mergeStrategy) {
        case 'latest':
          mergedData = validStates[validStates.length - 1].data;
          break;

        case 'merge':
          mergedData = this.mergeStateData(validStates.map(s => s.data));
          break;

        case 'diff_merge':
          mergedData = this.mergeStateWithDiffs(validStates);
          break;

        default:
          throw new Error(`Unknown merge strategy: ${mergeStrategy}`);
      }

      return await this.setState(mergedData, `merge_${mergeStrategy}`);

    } catch (error) {
      this.emit('error', { type: 'mergeStates', error });
      throw new Error(`Failed to merge states: ${error.message}`);
    }
  }

  /**
   * Optimize state storage
   */
  async optimizeStorage() {
    try {
      const optimizations = {
        compressedStates: 0,
        deletedStates: 0,
        freedSpace: 0
      };

      // Compress large states
      for (const state of this.stateHistory) {
        if (state.metadata.size > this.config.stateCompressionThreshold) {
          const compressedData = this.compressStateData(state.data);
          await this.updateCompressedState(state.id, compressedData);
          optimizations.compressedStates++;
          optimizations.freedSpace += state.metadata.size - compressedData.size;
        }
      }

      // Clean up old states beyond history limit
      if (this.stateHistory.length > this.config.maxStateHistory) {
        const excessStates = this.stateHistory.slice(this.config.maxStateHistory);
        for (const state of excessStates) {
          await this.deleteStateFromStorage(state.id);
          optimizations.deletedStates++;
        }

        this.stateHistory = this.stateHistory.slice(0, this.config.maxStateHistory);
      }

      this.emit('storageOptimized', optimizations);

      return optimizations;

    } catch (error) {
      this.emit('error', { type: 'optimizeStorage', error });
      throw new Error(`Failed to optimize storage: ${error.message}`);
    }
  }

  /**
   * Export state
   */
  async exportState(format = 'json') {
    try {
      const exportData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          version: '1.0.0',
          currentStateId: this.currentState?.id,
          totalStates: this.stateHistory.length + (this.currentState ? 1 : 0)
        },
        currentState: this.currentState,
        stateHistory: this.stateHistory,
        checkpoints: await this.getAllCheckpoints()
      };

      switch (format) {
        case 'json':
          return JSON.stringify(exportData, null, 2);

        case 'compressed':
          return this.compressExportData(exportData);

        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

    } catch (error) {
      this.emit('error', { type: 'exportState', error });
      throw new Error(`Failed to export state: ${error.message}`);
    }
  }

  /**
   * Import state
   */
  async importState(exportData, format = 'json') {
    try {
      let parsedData;

      switch (format) {
        case 'json':
          parsedData = typeof exportData === 'string' ?
            JSON.parse(exportData) : exportData;
          break;

        case 'compressed':
          parsedData = this.decompressExportData(exportData);
          break;

        default:
          throw new Error(`Unsupported import format: ${format}`);
      }

      // Validate import data
      this.validateImportData(parsedData);

      // Clear current state
      this.currentState = null;
      this.stateHistory = [];

      // Import state history
      for (const state of parsedData.stateHistory || []) {
        await this.persistState(state);
        this.addToHistory(state);
      }

      // Import current state
      if (parsedData.currentState) {
        this.currentState = parsedData.currentState;
        await this.persistState(this.currentState);
      }

      // Import checkpoints
      for (const checkpoint of parsedData.checkpoints || []) {
        await this.saveCheckpoint(checkpoint);
      }

      this.emit('stateImported', {
        totalStates: parsedData.stateHistory?.length || 0,
        hasCurrentState: !!parsedData.currentState,
        totalCheckpoints: parsedData.checkpoints?.length || 0
      });

      return this.currentState;

    } catch (error) {
      this.emit('error', { type: 'importState', error });
      throw new Error(`Failed to import state: ${error.message}`);
    }
  }

  /**
   * Private methods
   */
  async loadLastState() {
    try {
      const lastStateFile = path.join(this.storage.baseDir, 'state', 'last-state.json');
      const data = await this.storage.readJsonFile(lastStateFile);

      this.currentState = data;

      // Load state history
      await this.loadStateHistory();

      return data;

    } catch (error) {
      // No previous state, that's okay
      return null;
    }
  }

  async loadStateHistory() {
    try {
      const historyDir = path.join(this.storage.baseDir, 'state', 'history');
      const files = await fs.readdir(historyDir);

      const states = [];
      for (const file of files) {
        try {
          const filePath = path.join(historyDir, file);
          const state = await this.storage.readJsonFile(filePath);
          states.push(state);
        } catch (error) {
          console.warn(`Failed to load state from ${file}:`, error.message);
        }
      }

      // Sort by version
      states.sort((a, b) => a.version - b.version);

      this.stateHistory = states;

    } catch (error) {
      // History directory doesn't exist
      this.stateHistory = [];
    }
  }

  async persistState(state) {
    const stateDir = path.join(this.storage.baseDir, 'state');
    await this.storage.ensureDirectory(stateDir);

    // Save as last state
    const lastStateFile = path.join(stateDir, 'last-state.json');
    await this.storage.writeJsonFile(lastStateFile, state);

    // Save to history
    const historyDir = path.join(stateDir, 'history');
    await this.storage.ensureDirectory(historyDir);

    const historyFile = path.join(historyDir, `${state.id}.json`);
    await this.storage.writeJsonFile(historyFile, state);
  }

  addToHistory(state) {
    this.stateHistory.push(state);

    // Maintain history limit
    if (this.stateHistory.length > this.config.maxStateHistory) {
      const excess = this.stateHistory.length - this.config.maxStateHistory;
      this.stateHistory.splice(0, excess);
    }
  }

  startAutoCheckpoint() {
    if (this.config.autoCheckpointInterval > 0) {
      this.checkpointTimer = setInterval(async () => {
        try {
          await this.createCheckpoint('auto', {
            triggered: 'timer',
            interval: this.config.autoCheckpointInterval
          });
        } catch (error) {
          this.emit('error', { type: 'autoCheckpoint', error });
        }
      }, this.config.autoCheckpointInterval);
    }
  }

  setupStateTransitions() {
    // Define common state transitions
    this.stateTransitions.set('session_start', {
      description: 'Session started',
      priority: 'high',
      autoCheckpoint: true
    });

    this.stateTransitions.set('session_end', {
      description: 'Session ended',
      priority: 'high',
      autoCheckpoint: true
    });

    this.stateTransitions.set('file_change', {
      description: 'File changed',
      priority: 'low',
      autoCheckpoint: false
    });

    this.stateTransitions.set('command_executed', {
      description: 'Command executed',
      priority: 'medium',
      autoCheckpoint: false
    });
  }

  validateState(state) {
    if (!state.id) {
      throw new Error('State must have an ID');
    }

    if (typeof state.version !== 'number') {
      throw new Error('State must have a numeric version');
    }

    if (!state.timestamp) {
      throw new Error('State must have a timestamp');
    }

    if (state.metadata.checksum) {
      const calculatedChecksum = this.calculateStateChecksum(state.data);
      if (calculatedChecksum !== state.metadata.checksum) {
        throw new Error('State checksum mismatch');
      }
    }
  }

  validateImportData(data) {
    if (!data.metadata) {
      throw new Error('Import data missing metadata');
    }

    if (!Array.isArray(data.stateHistory)) {
      throw new Error('Import data missing valid state history array');
    }
  }

  calculateStateSize(state) {
    return JSON.stringify(state).length;
  }

  calculateStateChecksum(state) {
    const data = JSON.stringify(state);
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  generateStateId() {
    return crypto.randomBytes(16).toString('hex');
  }

  generateCheckpointId() {
    return `ckpt_${crypto.randomBytes(12).toString('hex')}`;
  }

  getSystemInfo() {
    return {
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid,
      uptime: process.uptime(),
      memory: process.memoryUsage()
    };
  }

  mergeStateData(stateDataArray) {
    return stateDataArray.reduce((merged, stateData) => {
      return { ...merged, ...stateData };
    }, {});
  }

  mergeStateWithDiffs(states) {
    if (states.length === 0) {
      return {};
    }

    let result = states[0].data;

    for (let i = 1; i < states.length; i++) {
      const state = states[i];
      if (state.metadata.diff) {
        result = this.applyStateDiff(result, state.metadata.diff);
      } else {
        result = { ...result, ...state.data };
      }
    }

    return result;
  }

  compressStateData(data) {
    const jsonString = JSON.stringify(data);
    return {
      compressed: true,
      originalSize: jsonString.length,
      data: jsonString // In production, use actual compression
    };
  }

  async waitForLazyLoad(stateId) {
    // Simple polling implementation
    while (this.lazyLoadQueue.has(stateId)) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  async loadStateFromStorage(stateId) {
    const stateFile = path.join(this.storage.baseDir, 'state', 'history', `${stateId}.json`);
    try {
      return await this.storage.readJsonFile(stateFile);
    } catch (error) {
      return null;
    }
  }

  async loadStateMetadata(stateId) {
    // Implementation would load only metadata without full data
    return await this.loadStateFromStorage(stateId);
  }

  async loadStateDataPath(stateId, dataPath) {
    const state = await this.loadStateFromStorage(stateId);
    if (!state) return null;

    // Navigate to specific data path
    const pathParts = dataPath.split('.');
    let current = state.data;

    for (const part of pathParts) {
      if (current && typeof current === 'object') {
        current = current[part];
      } else {
        return null;
      }
    }

    return current;
  }

  async saveCheckpoint(checkpoint) {
    const checkpointDir = path.join(this.storage.baseDir, 'checkpoints');
    await this.storage.ensureDirectory(checkpointDir);

    const checkpointFile = path.join(checkpointDir, `${checkpoint.id}.json`);
    await this.storage.writeJsonFile(checkpointFile, checkpoint);
  }

  async loadCheckpoint(checkpointId) {
    const checkpointFile = path.join(this.storage.baseDir, 'checkpoints', `${checkpointId}.json`);
    try {
      return await this.storage.readJsonFile(checkpointFile);
    } catch (error) {
      return null;
    }
  }

  async getAllCheckpoints() {
    const checkpointDir = path.join(this.storage.baseDir, 'checkpoints');
    try {
      const files = await fs.readdir(checkpointDir);
      const checkpoints = [];

      for (const file of files) {
        try {
          const filePath = path.join(checkpointDir, file);
          const checkpoint = await this.storage.readJsonFile(filePath);
          checkpoints.push(checkpoint);
        } catch (error) {
          console.warn(`Failed to load checkpoint ${file}:`, error.message);
        }
      }

      return checkpoints;
    } catch (error) {
      return [];
    }
  }

  async updateCompressedState(stateId, compressedData) {
    const stateFile = path.join(this.storage.baseDir, 'state', 'history', `${stateId}.json`);
    const state = await this.storage.readJsonFile(stateFile);
    state.data = compressedData;
    state.metadata.compressed = true;
    await this.storage.writeJsonFile(stateFile, state);
  }

  async deleteStateFromStorage(stateId) {
    const stateFile = path.join(this.storage.baseDir, 'state', 'history', `${stateId}.json`);
    try {
      await fs.unlink(stateFile);
    } catch (error) {
      // File might not exist
    }
  }

  compressExportData(data) {
    return JSON.stringify(data); // In production, use actual compression
  }

  decompressExportData(compressedData) {
    return JSON.parse(compressedData); // In production, use actual decompression
  }

  /**
   * Cleanup resources
   */
  async destroy() {
    if (this.checkpointTimer) {
      clearInterval(this.checkpointTimer);
      this.checkpointTimer = null;
    }

    this.currentState = null;
    this.stateHistory = [];
    this.stateDiffCache.clear();
    this.lazyLoadQueue.clear();

    this.removeAllListeners();
  }
}

module.exports = StateManager;