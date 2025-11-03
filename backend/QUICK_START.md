# Quick Database Setup Guide

## 🚀 Fastest Setup Options

### Option 1: Using Docker (Easiest - Recommended)

If you have Docker installed:

```bash
cd backend
docker-compose up -d
```

Then proceed to step 2 below.

### Option 2: Install PostgreSQL Locally

#### For macOS:

**Using Homebrew:**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install PostgreSQL
brew install postgresql@15
brew services start postgresql@15
```

**Or download PostgreSQL.app:**
1. Visit https://postgresapp.com/
2. Download and install the app
3. Click "Initialize" to create a new server
4. Add `/Applications/Postgres.app/Contents/Versions/latest/bin` to your PATH

#### For Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 📝 Setup Steps

Once PostgreSQL is installed and running:

### 1. Create the database

**With Docker (already done if using docker-compose):**
```bash
# Database is automatically created
```

**Without Docker:**
```bash
# Create a PostgreSQL user and database
createuser -s conceptspro
createdb -O conceptspro conceptspro

# OR using psql:
psql postgres
# Then run:
CREATE USER conceptspro WITH PASSWORD 'password123';
CREATE DATABASE conceptspro OWNER conceptspro;
\q
```

### 2. Update .env file

The `.env` file has been created with default values. If you changed the database password, update:

```env
DATABASE_URL="postgresql://conceptspro:password123@localhost:5432/conceptspro?schema=public"
```

### 3. Run migrations

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### 4. (Optional) Seed the database

This creates sample users and data:

```bash
npm run db:seed
```

After seeding, you can login with:
- **Admin**: `admin@conceptspro.com` / `admin123`
- **Instructor**: `instructor@conceptspro.com` / `instructor123`
- **Student**: `student@conceptspro.com` / `student123`

## ✅ Verify Setup

Test the database connection:

```bash
# Check if database exists
psql -U conceptspro -d conceptspro -c "\dt"

# Or test via Prisma Studio (GUI)
npm run db:studio
```

## 🛠️ Troubleshooting

### PostgreSQL not running
```bash
# macOS (Homebrew)
brew services start postgresql@15

# macOS (Postgres.app)
# Just open the Postgres.app

# Linux
sudo systemctl start postgresql
```

### Connection refused
- Make sure PostgreSQL is running on port 5432
- Check your `.env` file has the correct `DATABASE_URL`
- Verify user and password are correct

### Permission denied
```bash
# Grant permissions
psql postgres
GRANT ALL PRIVILEGES ON DATABASE conceptspro TO conceptspro;
\q
```

### Database already exists
```bash
# Drop and recreate (WARNING: deletes all data)
dropdb conceptspro
createdb conceptspro
```

## 🎯 Next Steps

Once the database is set up:

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. The server should start on `http://localhost:5000`

3. Test the API:
   ```bash
   curl http://localhost:5000/health
   ```

