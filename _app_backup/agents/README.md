# PG Closets ChatGPT Agent System

Multi-agent debugging system using ChatGPT and Codex CLI for rapid parallel analysis of the PG Closets deployment.

## Features

🤖 **Multi-Agent Architecture**: 4 specialized agents working in parallel
- **Database Agent**: Product database and routing analysis
- **Frontend Agent**: Authentication and UI debugging  
- **Deployment Agent**: Vercel configuration analysis
- **API Agent**: Data flow and endpoint validation

⚡ **Parallel Processing**: All agents run simultaneously for maximum speed
🔍 **Comprehensive Analysis**: Complete system debugging in one command
📊 **Detailed Reporting**: Full session logs and summaries
🛠️ **Issue Resolution**: Specific fixes and recommendations

## Quick Start

1. **Setup the system:**
   ```bash
   npm run agents:setup
   ```

2. **Configure OpenAI API:**
   ```bash
   cd agents
   cp .env.template .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. **Run debugging session:**
   ```bash
   npm run agents:debug
   ```

## Commands

| Command | Description |
|---------|-------------|
| `npm run agents` | Show available commands |
| `npm run agents:setup` | Install dependencies |
| `npm run agents:debug` | Run full debugging session |
| `npm run agents:status` | Show system status |

## Direct Usage

You can also run the agents directly:

```bash
cd agents
./agents debug          # Full debugging session
./agents status         # System status  
./agents setup          # Setup environment
```

## Agent Specializations

### Database Agent
- Analyzes product database structure
- Verifies URL slug compatibility
- Checks routing patterns
- Validates all 28 products

### Frontend Agent  
- Debugs authentication issues
- Analyzes middleware blocking
- Checks public route access
- Reviews UI/UX functionality

### Deployment Agent
- Reviews Vercel configuration
- Checks build process
- Analyzes access restrictions
- Verifies static generation

### API Agent
- Tests data fetching logic
- Validates API endpoints
- Checks database connectivity
- Analyzes server responses

## Current Issues Being Debugged

1. **401 Authentication Errors**: Pages returning unauthorized access
2. **Product Routing**: Individual product pages may not be accessible  
3. **Public Access**: Site should be publicly viewable without auth
4. **Database Integration**: Ensuring all 28 Renin products are accessible

## Session Output

Each debugging session generates:
- Real-time console output from all agents
- Detailed analysis and recommendations
- Session summary with issue counts
- Complete JSON log file in `logs/` directory

## Example Output

```
🤖 Starting PG Closets Multi-Agent Debug Session
==================================================
⚡ Executing agents in parallel...

📊 Debug Session Results
========================

🤖 DATABASE Agent - Product Database Analysis:
Found 28 products in database. Slug validation: 2 issues detected...

🤖 FRONTEND Agent - Authentication & Routing Debug:  
Authentication middleware blocking public access. Recommended fixes...

🤖 DEPLOYMENT Agent - Vercel Deployment Analysis:
Password protection enabled on deployment. Disable for public access...

🤖 API Agent - Data Flow & API Analysis:
Product endpoints working correctly. No API blocking detected...

📝 Session Summary:
- Total Agents: 4
- Issues Found: 3  
- Solutions Provided: 4
- Recommendation: Issues detected - review agent outputs for fixes
```

## Requirements

- Node.js 18+
- OpenAI API key
- Internet connection for ChatGPT API calls

## Configuration

The `.env` file supports these variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
AGENT_LOG_LEVEL=info
AGENT_MAX_CONCURRENT=5
AGENT_TIMEOUT=60000
PROJECT_PATH=/Users/spencercarroll/Downloads/pgclosets-store
DEPLOYMENT_URL=https://your-deployment-url.vercel.app
```

## Architecture

```
agents/
├── orchestrator.js      # Main orchestration system
├── agents              # CLI wrapper script  
├── package.json        # Agent dependencies
├── .env.template       # Environment configuration
├── config/             # Agent configurations
├── logs/               # Session logs and reports
└── README.md          # This file
```

## Integration with Main Project

The agent system is integrated into the main PG Closets project:

- **package.json scripts**: `npm run agents:*` commands
- **Project context**: Agents understand the full project structure
- **Real deployment**: Agents analyze the live Vercel deployment
- **File analysis**: Direct access to source code and configurations

## Troubleshooting

**"Module not found" errors:**
```bash
cd agents && npm install
```

**"OpenAI API key not found":**
```bash
cd agents && cp .env.template .env
# Edit .env file with your API key
```

**"Command not found":**
```bash
chmod +x agents/agents
chmod +x agents/orchestrator.js
```

This system enables rapid, comprehensive debugging of complex deployment issues using the power of multiple ChatGPT agents working in parallel.