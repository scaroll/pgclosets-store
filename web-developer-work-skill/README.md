# Web Developer Work Skill

**Persistent context management system for web developers that never loses work between Claude Desktop sessions.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
[![Claude Desktop Compatible](https://img.shields.io/badge/Claude%20Desktop-Compatible-blue.svg)](https://claude.ai/)

## 🚀 Overview

Web Developer Work Skill is a comprehensive persistent context management system designed specifically for web developers using Claude Desktop. It ensures you never lose work context between sessions, providing seamless continuity and intelligent work state management.

### ✨ Key Features

- 🔄 **Persistent Context Storage** - Automatic context backup and restoration
- 💾 **Intelligent Storage System** - File-based memory with automatic versioning
- 🛠️ **CLI Integration** - Full integration with Claude Desktop CLI
- 🚨 **Error Handling & Recovery** - Self-healing mechanisms and automatic recovery
- 📊 **Session Management** - Complete audit trail of development activities
- 🔍 **Advanced Search** - Search through entire work history
- 📈 **Performance Optimization** - Efficient storage and retrieval systems

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [CLI Commands](#cli-commands)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Quick Start

### 1. Installation

```bash
# Clone or download the skill
git clone https://github.com/anthropics/skills.git
cd skills/web-developer-work-skill

# Install dependencies
npm install

# Install globally for CLI access
npm install -g .
```

### 2. Initialize in Your Project

```bash
# Navigate to your project directory
cd your-project

# Initialize the work skill system
claude-work init

# Or use the full command
npx web-developer-work-skill init
```

### 3. Start Your First Session

```bash
# Start a new work session
claude-work start-session "My First Session"

# Check status
claude-work status

# End session when done
claude-work end-session
```

## 📦 Installation

### Prerequisites

- Node.js 14.0.0 or higher
- Claude Desktop CLI installed and configured
- Git (recommended for version control)

### Standard Installation

```bash
# Local installation
npm install web-developer-work-skill

# Global installation (recommended for CLI access)
npm install -g web-developer-work-skill
```

### Claude Desktop Integration

```bash
# Copy skill to Claude skills directory
cp -r web-developer-work-skill ~/.claude/skills/

# Or use the setup script
claude-work setup-claude
```

## 🎯 Usage

### Basic Workflow

1. **Initialize your project**
   ```bash
   claude-work init --name "My Project"
   ```

2. **Start a work session**
   ```bash
   claude-work start-session "Feature Development"
   ```

3. **Work normally with Claude Desktop**
   - Your context is automatically tracked
   - Files changes are monitored
   - Commands are logged

4. **Check your status anytime**
   ```bash
   claude-work status --verbose
   ```

5. **End your session**
   ```bash
   claude-work end-session
   ```

### Claude Desktop Integration

Once integrated, you can use the skill directly in Claude Desktop:

```bash
# Start Claude Desktop with persistent context
claude --with-context web-developer-work-skill

# Resume last session automatically
claude --resume-session

# Use with specific project
claude --project-context ./my-project
```

## 🎮 CLI Commands

### Session Management

```bash
# Start a new session
claude-work start-session [name] [options]

# End current session
claude-work end-session [options]

# Resume previous session
claude-work resume-session [session-id]

# View session history
claude-work history [options]
```

### Context Management

```bash
# Save current context manually
claude-work save-context [options]

# Search through work history
claude-work search <query> [options]

# Create session checkpoint
claude-work checkpoint <type> [options]
```

### Backup & Recovery

```bash
# Create backup
claude-work backup [options]

# Restore from backup
claude-work restore <backup-id> [options]

# List available backups
claude-work list-backups [options]
```

### System Management

```bash
# Check system status
claude-work status [options]

# Perform health check
claude-work health-check [options]

# Cleanup old data
claude-work cleanup [options]

# Manage configuration
claude-work config [key] [value] [options]
```

### Examples

```bash
# Start a session with tags and description
claude-work start-session "Bug Fix" \
  --description "Fix login page issue" \
  --tags "bug,frontend,urgent"

# Search for specific commands
claude-work search "npm install" --limit 10

# Create checkpoint before major changes
claude-work checkpoint "pre-refactor" \
  --data '{"reason": "Before major code refactoring"}'

# View detailed status
claude-work status --verbose

# Clean up data older than 30 days
claude-work cleanup --days 30 --dry-run
```

## ⚙️ Configuration

### Settings File

Configuration is stored in `.claude-work/config/settings.json`:

```json
{
  "autoSave": {
    "enabled": true,
    "interval": 30000,
    "onFileChange": true,
    "onCommand": true
  },
  "backup": {
    "enabled": true,
    "frequency": "hourly",
    "maxBackups": 50,
    "compression": true
  },
  "session": {
    "timeout": 1800000,
    "autoResume": true,
    "trackActivity": true
  },
  "context": {
    "maxContextSize": 1000000,
    "compressionThreshold": 100000,
    "retentionDays": 30
  }
}
```

### Managing Configuration

```bash
# Show current configuration
claude-work config --show

# Update configuration value
claude-work config autoSave.interval 60000

# Reset to defaults
claude-work config --reset
```

### Ignore Rules

Create `.claude-work/config/ignore-rules.json` to exclude files/directories:

```json
{
  "files": [
    "node_modules/**",
    ".git/**",
    "dist/**",
    "build/**",
    "*.log",
    ".env*"
  ],
  "patterns": [
    "*.tmp",
    "*.cache",
    "__pycache__/**"
  ]
}
```

## 🔧 API Reference

### Main Class

```javascript
const WebDeveloperWorkSkill = require('web-developer-work-skill');

// Create instance
const skill = new WebDeveloperWorkSkill(baseDir, config);

// Initialize
await skill.initialize();

// Start session
const session = await skill.startSession('My Session');

// Update context
await skill.updateContext({
  files: [{ path: '/app.js', content: 'new content' }],
  commands: [{ command: 'npm test', result: 'success' }]
});

// Save context
await skill.saveContext();

// End session
await skill.endSession();
```

### Core Components

```javascript
const {
  StorageEngine,
  ContextManager,
  SessionManager,
  StateManager,
  ErrorRecoverySystem
} = require('web-developer-work-skill');

// Use components directly
const storage = new StorageEngine('./my-work-dir');
await storage.initialize();

const contextManager = new ContextManager(storage);
await contextManager.initialize();
```

### Event Handling

```javascript
const skill = new WebDeveloperWorkSkill();

// Listen to events
skill.on('sessionStarted', (session) => {
  console.log('Session started:', session.name);
});

skill.on('contextSaved', (context) => {
  console.log('Context saved:', context.size);
});

skill.on('error', (error) => {
  console.error('Error:', error);
});
```

## 🚀 Advanced Features

### State Management

```javascript
// Create state transitions
await skill.setState({
  files: modifiedFiles,
  activeTab: 'component.jsx'
}, 'file_edit');

// Revert to previous state
await skill.revertToState(stateId, 'user_request');

// Create checkpoint
await skill.createCheckpoint('milestone', {
  description: 'Completed feature X'
});
```

### Search and Query

```javascript
// Search work history
const results = await skill.searchHistory('authentication error', {
  limit: 20,
  contexts: true,
  commands: true,
  notes: true
});

// Get session history
const history = await skill.getSessionHistory({
  limit: 50,
  status: 'completed',
  tags: ['bug', 'frontend']
});
```

### Backup and Restore

```javascript
// Create backup with metadata
const backup = await skill.createBackup('manual', 'Before major refactor');

// Restore from backup
await skill.restoreFromBackup(backupId);

// List available backups
const backups = await skill.storageEngine.listBackups();
```

### Error Recovery

```javascript
// Enable error recovery
const skill = new WebDeveloperWorkSkill(baseDir, {
  enableErrorRecovery: true,
  errorRecovery: {
    autoRepair: true,
    backupOnCriticalError: true
  }
});

// Perform health check
const health = await skill.performHealthCheck();

// Handle errors gracefully
skill.on('error', (error) => {
  console.log('Error handled:', error.type);
});
```

## 🔍 Claude Desktop Integration

### Setup Integration

```bash
# Auto-configure Claude Desktop integration
claude-work setup-claude

# Manual setup
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/web-developer-work-skill
```

### Using with Claude Desktop

```bash
# Start Claude with work skill context
claude skill web-developer-work-skill

# Resume last session
claude skill web-developer-work-skill --resume

# Use specific session
claude skill web-developer-work-skill --session <session-id>
```

### Claude Commands

The skill provides special commands within Claude Desktop:

- `:session start <name>` - Start new session
- `:session end` - End current session
- `:save` - Save current context
- `:search <query>` - Search work history
- `:checkpoint <type>` - Create checkpoint
- `:status` - Show current status

## 🛠️ Troubleshooting

### Common Issues

#### "No .claude-work directory found"
```bash
# Initialize the system
claude-work init
```

#### "Storage write failed"
```bash
# Check permissions
ls -la .claude-work/

# Fix permissions if needed
chmod 755 .claude-work
chmod 644 .claude-work/config/*
```

#### "Session won't resume"
```bash
# Check session status
claude-work status

# Start new session if needed
claude-work start-session "New Session"

# Or force resume last session
claude-work resume-session
```

#### "High memory usage"
```bash
# Run cleanup
claude-work cleanup --days 7

# Optimize storage
claude-work health-check --fix
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=claude-work:* claude-work status

# Verbose output
claude-work --verbose status

# Health check with fixes
claude-work health-check --fix
```

### Recovery Procedures

```bash
# 1. Check system health
claude-work health-check

# 2. Create emergency backup
claude-work backup --description "Before recovery"

# 3. Run repair
claude-work health-check --fix

# 4. If needed, reset configuration
claude-work config --reset

# 5. Reinitialize if necessary
claude-work init --force
```

### Getting Help

```bash
# Show help
claude-work --help
claude-work <command> --help

# Check version
claude-work --version

# Get system information
claude-work status --verbose
```

## 🧪 Testing and Verification

### Run Tests

```bash
# Run complete test suite
npm test

# Run verification
npm run verify

# Run both tests and verification
npm run test:complete
```

### System Verification

```bash
# Perform complete system verification
npm run verify

# Generate test report
npm run test > test-report.txt
```

### Manual Testing

```bash
# Test basic functionality
claude-work init
claude-work start-session "Test Session"
claude-work status
claude-work end-session

# Test backup/restore
claude-work backup --description "Test backup"
claude-work list-backups
```

## 📚 Best Practices

### 1. Regular Sessions

- Start sessions for distinct work periods
- Use descriptive session names
- End sessions when switching contexts

### 2. Context Management

- Keep context focused and relevant
- Use ignore rules to exclude unnecessary files
- Regular cleanup of old data

### 3. Backup Strategy

- Create manual checkpoints before major changes
- Enable automatic backups
- Regular backup rotation

### 4. Performance Optimization

- Monitor storage usage
- Use compression for large contexts
- Regular cleanup and optimization

### 5. Security

- Don't store sensitive information in context
- Use appropriate file permissions
- Regular backup security checks

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/anthropics/skills.git
cd skills/web-developer-work-skill

# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build project
npm run build
```

### Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Claude Desktop users
- Inspired by developer productivity needs
- Community feedback and contributions

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/anthropics/skills/issues)
- **Documentation**: [Wiki](https://github.com/anthropics/skills/wiki)
- **Community**: [Discussions](https://github.com/anthropics/skills/discussions)

---

**Never lose your work context again with Web Developer Work Skill - Your persistent development companion.**