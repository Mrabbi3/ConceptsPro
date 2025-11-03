# Quick Setup Checklist - PostgreSQL 18 on macOS

After installing PostgreSQL 18, follow these steps in order:

## 🚀 Quick Steps

```bash
# 1. Verify PostgreSQL is installed
psql --version

# 2. Start PostgreSQL (if not running)
brew services start postgresql@18

# 3. Create database user and database
psql postgres
# Then in psql prompt, run:
CREATE USER conceptspro WITH PASSWORD 'password123';
ALTER USER conceptspro CREATEDB;
CREATE DATABASE conceptspro OWNER conceptspro;
\q

# 4. Navigate to backend directory
cd /Users/naimurrifat/ConceptsPro/backend

# 5. Verify .env file exists (should already be created)
ls -la .env

# 6. Generate Prisma Client
npm run db:generate

# 7. Run migrations
npm run db:migrate

# 8. Seed database (optional - creates sample users)
npm run db:seed

# 9. Verify setup
npm run db:studio
# Opens browser at http://localhost:5555

# 10. Start backend server
npm run dev
```

## 📋 Detailed Instructions

See `POSTGRESQL_18_SETUP.md` for detailed explanations of each step.

## ⚠️ Important Notes

- The default password in `.env` is `password123` - make sure it matches what you set in step 3
- If you use a different password, update the `DATABASE_URL` in `.env`
- The database name is `conceptspro`
- Default user is `conceptspro`

## 🔍 Verify Everything Works

```bash
# Test database connection
psql -U conceptspro -d conceptspro -c "SELECT COUNT(*) FROM users;"

# Check if backend can connect
curl http://localhost:5000/health
```


