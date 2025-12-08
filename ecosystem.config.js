/**
 * PM2 Ecosystem Configuration
 * Manages development processes for the PG Closets store
 *
 * Usage:
 *   pnpm pm2:start   - Start all services
 *   pnpm pm2:stop    - Stop all services
 *   pnpm pm2:logs    - View logs
 *   pnpm pm2:status  - Check status
 */

module.exports = {
  apps: [
    {
      name: 'pgclosets-dev',
      script: 'pnpm',
      args: 'dev',
      cwd: './',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 1000,
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      error_file: './logs/pm2/dev-error.log',
      out_file: './logs/pm2/dev-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs: true
    },
    {
      name: 'pgclosets-prisma-studio',
      script: 'pnpm',
      args: 'prisma studio',
      cwd: './',
      watch: false,
      autorestart: false,
      env: {
        NODE_ENV: 'development',
        BROWSER: 'none'
      },
      error_file: './logs/pm2/prisma-studio-error.log',
      out_file: './logs/pm2/prisma-studio-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'pgclosets-email-preview',
      script: 'pnpm',
      args: 'email:dev',
      cwd: './',
      watch: false,
      autorestart: false,
      env: {
        NODE_ENV: 'development'
      },
      error_file: './logs/pm2/email-error.log',
      out_file: './logs/pm2/email-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
