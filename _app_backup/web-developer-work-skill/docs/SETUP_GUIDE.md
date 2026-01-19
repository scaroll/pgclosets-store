# Setup Guide

Complete setup instructions for Web Developer Work Skill system.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Initial Setup](#initial-setup)
4. [Claude Desktop Integration](#claude-desktop-integration)
5. [Configuration](#configuration)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## System Requirements

### Required Software

- **Node.js** 14.0.0 or higher
- **npm** 6.0.0 or higher
- **Claude Desktop CLI** (latest version)
- **Git** (recommended)

### Platform Support

- ✅ macOS (Intel and Apple Silicon)
- ✅ Linux (Ubuntu, Debian, CentOS, etc.)
- ✅ Windows 10/11 (with WSL2)

### Hardware Requirements

- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 100MB free space for base installation
- **Additional**: 50MB-1GB for work data (depends on project size)

## Installation

### Option 1: Global Installation (Recommended)

```bash
# Install globally via npm
npm install -g web-developer-work-skill

# Verify installation
claude-work --version
```

### Option 2: Local Installation

```bash
# Clone or download the repository
git clone https://github.com/anthropics/skills.git
cd skills/web-developer-work-skill

# Install dependencies
npm install

# Create symlink for CLI access (optional)
npm link
```

### Option 3: Claude Skills Directory

```bash
# Copy to Claude skills directory
mkdir -p ~/.claude/skills
cp -r web-developer-work-skill ~/.claude/skills/

# Install dependencies in skill directory
cd ~/.claude/skills/web-developer-work-skill
npm install
```

## Initial Setup

### 1. Initialize Your First Project

```bash
# Navigate to your project directory
cd /path/to/your/project

# Initialize the work skill system
claude-work init

# Or with custom options
claude-work init \
  --name "My Awesome Project" \
  --description "A web development project" \
  --force
```

This will create:
- `.claude-work/` directory structure
- Default configuration files
- Project metadata

### 2. Verify Installation

```bash
# Check system status
claude-work status

# Run health check
claude-work health-check

# Test basic functionality
claude-work start-session "Test Session"
claude-work status
claude-work end-session
```

### 3. Basic Configuration

```bash
# Show current configuration
claude-work config --show

# Adjust auto-save interval (milliseconds)
claude-work config autoSave.interval 60000

# Enable more frequent backups
claude-work config backup.frequency "30min"

# Set session timeout (milliseconds)
claude-work config session.timeout 3600000
```

## Claude Desktop Integration

### Automatic Setup

```bash
# Auto-configure Claude Desktop integration
claude-work setup-claude

# This will:
# - Copy skill to Claude skills directory
# - Update Claude configuration
# - Set up CLI integration
# - Create command aliases
```

### Manual Setup

#### 1. Copy Skill to Claude Directory

```bash
# Create Claude skills directory if it doesn't exist
mkdir -p ~/.claude/skills

# Copy skill directory
cp -r /path/to/web-developer-work-skill ~/.claude/skills/
```

#### 2. Update Claude Configuration

```bash
# Edit Claude config file
~/.claude/config.json
```

Add the skill to your configuration:

```json
{
  "skills": [
    {
      "name": "web-developer-work-skill",
      "path": "~/.claude/skills/web-developer-work-skill",
      "enabled": true,
      "auto_load": true
    }
  ]
}
```

#### 3. Create CLI Wrapper

```bash
# Create wrapper script
echo '#!/bin/bash
node ~/.claude/skills/web-developer-work-skill/cli/CLIInterface.js "$@"' > ~/.local/bin/claude-work

# Make it executable
chmod +x ~/.local/bin/claude-work

# Add to PATH if needed
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### Verification

```bash
# Test Claude integration
claude skill web-developer-work-skill --help

# Test session management
claude skill web-developer-work-skill start-session "Integration Test"

# Verify context persistence
claude skill web-developer-work-skill status
```

## Configuration

### Default Configuration

The system creates a default configuration in `.claude-work/config/settings.json`:

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
    "trackActivity": true,
    "maxSessionDuration": 86400000
  },
  "context": {
    "maxContextSize": 1000000,
    "compressionThreshold": 100000,
    "retentionDays": 30
  },
  "errorRecovery": {
    "enabled": true,
    "autoRepair": true,
    "backupOnCriticalError": true,
    "maxRetryAttempts": 3
  }
}
```

### Project-Specific Configuration

Create project-specific overrides in `.claude-work/config/project.json`:

```json
{
  "autoSave": {
    "interval": 15000
  },
  "backup": {
    "frequency": "15min"
  },
  "ignore": {
    "patterns": [
      "*.tmp",
      ".DS_Store",
      "Thumbs.db"
    ]
  }
}
```

### Environment Variables

Set environment variables for system-wide configuration:

```bash
# Add to ~/.bashrc or ~/.zshrc

# Set custom work directory
export CLAUDE_WORK_DIR="/path/to/work/storage"

# Enable debug mode
export DEBUG=claude-work:*

# Set custom configuration path
export CLAUDE_WORK_CONFIG="/path/to/config.json"
```

### Ignore Rules

Configure file and directory exclusions in `.claude-work/config/ignore-rules.json`:

```json
{
  "files": [
    "node_modules/**",
    ".git/**",
    "dist/**",
    "build/**",
    "*.log",
    ".env*",
    "coverage/**"
  ],
  "patterns": [
    "*.tmp",
    "*.cache",
    "*.swp",
    "*.swo",
    "__pycache__/**",
    ".pytest_cache/**"
  ],
  "maxFileSize": "10MB",
  "maxFilesPerSession": 1000
}
```

## Verification

### Complete System Verification

```bash
# Run comprehensive verification
npm run verify

# Or manually
claude-work health-check --fix

# Check all components
claude-work status --verbose
```

### Test Functionality

```bash
# Test session management
claude-work start-session "Verification Test"
claude-work save-context
claude-work create-checkpoint "test-point"
claude-work end-session

# Test backup/restore
claude-work backup --description "Test backup"
BACKUP_ID=$(claude-work list-backups | head -1 | awk '{print $1}')
claude-work restore $BACKUP_ID

# Test search functionality
claude-work search "test" --limit 5
```

### Performance Testing

```bash
# Test storage performance
time claude-work save-context

# Test with large context
echo '{"test": "'$(printf 'x%.0s' {1..100000})'"}' > large-test.json
claude-work update-context --files large-test.json
rm large-test.json

# Check memory usage
claude-work status | grep -i memory
```

### Integration Testing

```bash
# Test Claude Desktop integration
claude skill web-developer-work-skill status

# Test CLI integration
which claude-work
claude-work --help

# Test file monitoring
echo "test change" > test-file.txt
sleep 2
claude-work search "test change"
rm test-file.txt
```

## Troubleshooting

### Common Installation Issues

#### Permission Denied Errors

```bash
# Fix npm global permissions
sudo chown -R $(whoami) ~/.npm

# Or use npx instead of global install
npx web-developer-work-skill init
```

#### Node.js Version Issues

```bash
# Check Node.js version
node --version  # Should be 14.0.0+

# Update Node.js if needed
# Using nvm
nvm install 18
nvm use 18

# Using n
sudo npm install -g n
sudo n 18
```

#### Claude Desktop Not Found

```bash
# Check Claude CLI installation
which claude

# Install Claude Desktop CLI
# Visit https://claude.ai/download for instructions

# Check Claude configuration
ls -la ~/.claude/
cat ~/.claude/config.json
```

### Common Runtime Issues

#### Storage Write Errors

```bash
# Check permissions
ls -la .claude-work/

# Fix permissions
chmod -R 755 .claude-work/
chmod 644 .claude-work/config/*

# Check disk space
df -h .
```

#### Session Won't Start

```bash
# Check system status
claude-work health-check

# Clear corrupted data
rm -rf .claude-work/sessions/session-history/*.corrupted

# Reinitialize
claude-work init --force
```

#### High Memory Usage

```bash
# Run cleanup
claude-work cleanup --days 7

# Optimize storage
claude-work health-check --fix

# Check configuration
claude-work config context.retentionDays 7
```

#### File Monitoring Issues

```bash
# Check file watcher status
claude-work status | grep -i monitoring

# Restart file monitoring
claude-work config autoSave.onFileChange false
claude-work config autoSave.onFileChange true
```

### Debug Mode

Enable comprehensive debugging:

```bash
# Enable debug logging
export DEBUG=claude-work:*

# Run with verbose output
claude-work --verbose status

# Check logs
tail -f .claude-work/logs/system.log
```

### Recovery Procedures

#### Complete System Reset

```bash
# Backup current data (optional)
claude-work backup --description "Before reset"

# Remove corrupted data
rm -rf .claude-work/sessions/quarantine/
rm -rf .claude-work/context/quarantine/

# Reset configuration
claude-work config --reset

# Reinitialize
claude-work init --force
```

#### Emergency Recovery

```bash
# Create emergency backup
cp -r .claude-work .claude-work.backup.$(date +%Y%m%d_%H%M%S)

# Check system integrity
claude-work health-check

# Repair if needed
claude-work health-check --fix

# Restore from backup if necessary
rm -rf .claude-work
mv .claude-work.backup.* .claude-work
```

### Getting Help

```bash
# Show help
claude-work --help
claude-work <command> --help

# Check version
claude-work --version

# Generate diagnostic report
claude-work health-check > diagnostic-report.txt
```

### Support Resources

- **Documentation**: [README.md](../README.md)
- **API Reference**: [API.md](API.md)
- **Issues**: [GitHub Issues](https://github.com/anthropics/skills/issues)
- **Community**: [Discussions](https://github.com/anthropics/skills/discussions)

## Next Steps

After successful setup:

1. **Create your first work session**
   ```bash
   claude-work start-session "Getting Started"
   ```

2. **Configure for your workflow**
   - Adjust auto-save intervals
   - Set up ignore rules
   - Configure backup frequency

3. **Integrate with your tools**
   - Set up Claude Desktop integration
   - Configure IDE extensions
   - Set up automated workflows

4. **Learn advanced features**
   - State management
   - Advanced search
   - Custom recovery strategies

5. **Establish best practices**
   - Regular session management
   - Consistent backup strategy
   - Performance monitoring

Congratulations! You now have a fully functional persistent context management system for your web development work.