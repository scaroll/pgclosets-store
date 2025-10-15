# Development Environment Setup

> **Complete guide to setting up your local development environment for PG Closets**

## 📋 Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20.x or higher | Runtime environment |
| npm | 10.x or higher | Package manager |
| Git | Latest | Version control |
| VS Code | Latest (recommended) | Code editor |
| PostgreSQL | 14.x or higher | Local database (optional) |

### Optional but Recommended

- **Docker** - For local database
- **Postman** - API testing
- **GitHub CLI** - Repository management
- **Vercel CLI** - Deployment testing

## 🚀 Quick Start (5 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/pgclosets/store.git
cd store

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:3000
```

## 📝 Detailed Setup Instructions

### Step 1: Clone the Repository

```bash
# HTTPS
git clone https://github.com/pgclosets/store.git

# OR SSH (if configured)
git clone git@github.com:pgclosets/store.git

# Navigate to project directory
cd store
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - Next.js and React
# - TypeScript and types
# - Tailwind CSS
# - Prisma ORM
# - All development tools
```

**Troubleshooting Installation Issues:**

```bash
# If you encounter permission errors
sudo npm install -g npm@latest

# If installation fails, clear cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# If peer dependency warnings appear
npm install --legacy-peer-deps
```

### Step 3: Environment Variables

Create `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/pgclosets?schema=public"

# Supabase (Required for auth)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Stripe (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Email (Required for contact forms)
RESEND_API_KEY="re_..."

# Analytics (Optional)
NEXT_PUBLIC_GA4_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
NEXT_PUBLIC_POSTHOG_HOST="https://app.posthog.com"

# Development (Optional)
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 4: Database Setup

#### Option A: Using Vercel Postgres (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Link to Vercel project
vercel link

# 3. Pull environment variables
vercel env pull .env.local

# 4. Run Prisma migrations
npx prisma migrate dev

# 5. Generate Prisma client
npx prisma generate
```

#### Option B: Local PostgreSQL with Docker

```bash
# 1. Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:14-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: pgclosets
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: pgclosets
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
EOF

# 2. Start PostgreSQL
docker-compose up -d

# 3. Set DATABASE_URL in .env.local
echo 'DATABASE_URL="postgresql://pgclosets:dev_password@localhost:5432/pgclosets?schema=public"' >> .env.local

# 4. Run migrations
npx prisma migrate dev

# 5. Seed database (optional)
npm run db:seed
```

#### Option C: Local PostgreSQL Installation

**macOS:**
```bash
# Install PostgreSQL
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Create database
createdb pgclosets

# Set DATABASE_URL
echo 'DATABASE_URL="postgresql://$(whoami)@localhost:5432/pgclosets?schema=public"' >> .env.local
```

**Windows:**
```bash
# Download and install PostgreSQL from:
# https://www.postgresql.org/download/windows/

# Create database using pgAdmin or command line
# Set DATABASE_URL in .env.local
```

**Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create user and database
sudo -u postgres createuser --interactive
sudo -u postgres createdb pgclosets

# Set DATABASE_URL
echo 'DATABASE_URL="postgresql://your_user:your_password@localhost:5432/pgclosets?schema=public"' >> .env.local
```

### Step 5: Verify Setup

```bash
# Run all checks
npm run quality

# This runs:
# - ESLint (code linting)
# - TypeScript (type checking)
# - Prettier (code formatting check)

# Run tests
npm run test

# Start development server
npm run dev
```

Visit `http://localhost:3000` - you should see the PG Closets homepage.

## 🔧 VS Code Setup (Recommended)

### Install Required Extensions

```bash
# Install VS Code extensions via command line
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension Prisma.prisma
code --install-extension ms-vscode.vscode-typescript-next
```

**Recommended Extensions:**
- ESLint - Code linting
- Prettier - Code formatting
- Tailwind CSS IntelliSense - Tailwind class suggestions
- Prisma - Prisma schema support
- TypeScript Vue Plugin - Enhanced TypeScript support

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

## 🗄️ Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name description_of_changes

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Open Prisma Studio (GUI for database)
npx prisma studio

# Seed database with test data
npm run db:seed

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

### Database Backup and Restore

```bash
# Backup database
pg_dump -U username -d pgclosets -F c -b -v -f backup.dump

# Restore database
pg_restore -U username -d pgclosets -v backup.dump

# Export to SQL
pg_dump -U username -d pgclosets > backup.sql

# Import from SQL
psql -U username -d pgclosets < backup.sql
```

## 🧪 Testing Setup

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- ProductCard.test.tsx

# Run E2E tests with Playwright
npx playwright test

# Run E2E tests with UI
npx playwright test --ui

# Generate test coverage report
npm run test:coverage -- --reporter=html
```

### Test Database Setup

Create `.env.test.local`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/pgclosets_test?schema=public"
```

## 🔍 Debugging Setup

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev",
      "serverReadyAction": {
        "pattern": "started server on .+, url: (https?://.+)",
        "uriFormat": "%s",
        "action": "debugWithChrome"
      }
    }
  ]
}
```

### Browser DevTools

**Chrome DevTools Shortcuts:**
- `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows) - Open DevTools
- `Cmd+Option+J` (Mac) / `Ctrl+Shift+J` (Windows) - Console
- `Cmd+P` (Mac) / `Ctrl+P` (Windows) - File search

**React DevTools:**
```bash
# Install React DevTools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

## 📦 Build and Production

### Local Production Build

```bash
# Build for production
npm run build

# Start production server locally
npm run start

# Analyze bundle size
npm run analyze

# Check for production issues
npm run validate:all
```

### Performance Analysis

```bash
# Analyze bundle size
npm run analyze:bundle

# Check performance budget
npm run validate:performance

# Lighthouse audit (requires Chrome)
npm run lighthouse
```

## 🔑 Authentication Setup

### Supabase Configuration

1. **Create Supabase Project**
   - Visit https://supabase.com
   - Create new project
   - Note project URL and anon key

2. **Configure Authentication**
   ```sql
   -- Run in Supabase SQL Editor
   -- Enable email auth
   -- Enable social auth (optional)
   ```

3. **Add Environment Variables**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

## 📧 Email Setup (Resend)

1. **Create Resend Account**
   - Visit https://resend.com
   - Create account and get API key

2. **Add Domain**
   - Add your domain
   - Configure DNS records

3. **Add Environment Variable**
   ```bash
   RESEND_API_KEY="re_your_api_key"
   ```

## 💳 Stripe Setup (Local Development)

1. **Create Stripe Account**
   - Visit https://stripe.com
   - Get test API keys

2. **Install Stripe CLI**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
   scoop install stripe

   # Linux
   wget https://github.com/stripe/stripe-cli/releases/download/v1.17.0/stripe_1.17.0_linux_x86_64.tar.gz
   tar -xvf stripe_1.17.0_linux_x86_64.tar.gz
   ```

3. **Login and Forward Events**
   ```bash
   # Login to Stripe
   stripe login

   # Forward webhook events to local server
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Add Environment Variables**
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..." # From stripe listen command
   ```

## 🐛 Common Setup Issues

### Issue: Port 3000 already in use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Issue: Module not found

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm cache clean --force
npm install
```

### Issue: Prisma Client out of sync

```bash
# Regenerate Prisma Client
npx prisma generate

# If schema changed, run migration
npx prisma migrate dev
```

### Issue: TypeScript errors

```bash
# Clear TypeScript cache
rm -rf .next
npm run type-check

# Update types
npm update @types/node @types/react @types/react-dom
```

### Issue: Environment variables not loading

```bash
# Verify .env.local exists
ls -la .env.local

# Restart development server
# Environment variables are loaded on server start
npm run dev
```

## ✅ Verify Installation Checklist

- [ ] Node.js 20.x+ installed
- [ ] npm 10.x+ installed
- [ ] Git installed and configured
- [ ] Repository cloned successfully
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.local` created and configured
- [ ] Database connected and migrations run
- [ ] Development server starts (`npm run dev`)
- [ ] Homepage loads at http://localhost:3000
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Tests pass (`npm run test`)
- [ ] VS Code extensions installed (recommended)

## 📚 Next Steps

After completing setup:

1. **Read Architecture Documentation** - [System Overview](../architecture/SYSTEM_OVERVIEW.md)
2. **Understand Project Structure** - [Folder Structure](../architecture/FOLDER_STRUCTURE.md)
3. **Learn Development Workflow** - [Contributing Guide](../CONTRIBUTING.md)
4. **Explore Component Library** - [Components](../components/README.md)
5. **Review Code Patterns** - [Best Practices](../knowledge-base/BEST_PRACTICES.md)

## 🆘 Getting Help

If you encounter issues:

1. **Check Documentation** - See [Troubleshooting Guide](../troubleshooting/COMMON_ERRORS.md)
2. **Search Issues** - Check existing GitHub issues
3. **Ask Team** - Post in #development Slack channel
4. **Create Issue** - Open new issue with details

## 📞 Support Contacts

- **Technical Lead**: Spencer Carroll
- **DevOps**: #devops Slack channel
- **General Questions**: #development Slack channel

---

**Ready to contribute?** Check out our [Contributing Guide](../CONTRIBUTING.md) to get started!
