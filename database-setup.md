# Database Setup Documentation

## Database Options for pgclosets.com

### Option 1: PostgreSQL (Recommended for Production)
1. Install PostgreSQL locally or use a cloud provider
2. Create a database named `pgclosets`
3. Update the `.env.local` file with your connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/pgclosets"
   ```

### Option 2: SQLite (Good for Local Development)
1. Update your `.env.local` file:
   ```
   DATABASE_URL="file:./dev.db"
   ```
2. Update the Prisma schema provider to `sqlite`
3. Run migrations

### Option 3: Docker PostgreSQL
1. Run PostgreSQL in Docker:
   ```bash
   docker run --name pgclosets-db -e POSTGRES_PASSWORD=password -e POSTGRES_DB=pgclosets -p 5432:5432 -d postgres:15
   ```
2. Update `.env.local`:
   ```
   DATABASE_URL="postgresql://postgres:password@localhost:5432/pgclosets"
   ```

### Option 4: Cloud Database (Vercel, Supabase, etc.)
1. Sign up for a cloud PostgreSQL provider
2. Create a new database
3. Get the connection string
4. Update `.env.local` with the provided connection string

## Setup Commands

After setting up your DATABASE_URL:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Run migrations (production)
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed
```

## Database Schema Validation

The current Prisma schema supports:
- ✅ Product management with variants and images
- ✅ User authentication and accounts
- ✅ Shopping cart and order management
- ✅ Booking system for consultations
- ✅ Review system
- ✅ CMS for pages and blog posts
- ✅ AI features (chat, search, recommendations)

## Connection Issues

If you encounter connection issues:

1. Verify your DATABASE_URL is correct
2. Ensure the database server is running
3. Check network connectivity
4. Verify user permissions
5. Test with `npx prisma db push`