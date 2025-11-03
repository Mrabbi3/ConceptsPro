# Your Specific Database Setup Instructions

## Your PostgreSQL Information
- **Password**: `JK6DY34R`
- **Port**: `5413`
- **Database Name**: `conceptspro`
- **User**: `conceptspro`

---

## ✅ Step 1: Find PostgreSQL (psql command)

First, we need to find where PostgreSQL is installed. Run one of these:

**Option A - If you installed via PostgreSQL.app:**
```bash
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
psql --version
```

**Option B - If you installed via Homebrew:**
```bash
export PATH="/opt/homebrew/bin:$PATH"
psql --version
# OR
export PATH="/usr/local/bin:$PATH"
psql --version
```

**Option C - Find it manually:**
```bash
# Try to find psql
find /Applications -name psql 2>/dev/null
find /usr/local -name psql 2>/dev/null
```

Once you find psql, add it to your PATH for this session:
```bash
export PATH="[PATH_TO_POSTGRESQL_BIN]:$PATH"
```

---

## ✅ Step 2: Connect to PostgreSQL

Try connecting to your PostgreSQL instance:

```bash
# Try connecting as postgres user
psql -h localhost -p 5413 -U postgres

# If that doesn't work, try without specifying user (uses your macOS user)
psql -h localhost -p 5413 -d postgres
```

You might be prompted for a password. Use: `JK6DY34R`

---

## ✅ Step 3: Create Database User and Database

Once connected to PostgreSQL, run these commands:

```sql
-- Create user
CREATE USER conceptspro WITH PASSWORD 'JK6DY34R';

-- Give user permission to create databases
ALTER USER conceptspro CREATEDB;

-- Create the database
CREATE DATABASE conceptspro OWNER conceptspro;

-- Exit
\q
```

---

## ✅ Step 4: Verify .env File is Correct

The `.env` file has already been updated with your credentials. Verify it:

```bash
cd /Users/naimurrifat/ConceptsPro/backend
cat .env | grep DATABASE_URL
```

It should show:
```
DATABASE_URL="postgresql://conceptspro:JK6DY34R@localhost:5413/conceptspro?schema=public"
```

---

## ✅ Step 5: Test Connection

Test if you can connect with the new user:

```bash
# You might need to set PGPASSWORD environment variable
export PGPASSWORD=JK6DY34R
psql -h localhost -p 5413 -U conceptspro -d conceptspro -c "SELECT 1;"
```

You should see output like:
```
 ?column? 
----------
        1
```

---

## ✅ Step 6: Setup Database Schema

Now run the Prisma commands:

```bash
cd /Users/naimurrifat/ConceptsPro/backend

# Generate Prisma Client
npm run db:generate

# Run migrations (creates all tables)
npm run db:migrate
```

---

## ✅ Step 7: Seed Database (Optional)

Add sample data:

```bash
npm run db:seed
```

This creates sample users:
- Admin: `admin@conceptspro.com` / `admin123`
- Instructor: `instructor@conceptspro.com` / `instructor123`
- Student: `student@conceptspro.com` / `student123`

---

## ✅ Step 8: Verify Everything Works

```bash
# View database tables
export PGPASSWORD=JK6DY34R
psql -h localhost -p 5413 -U conceptspro -d conceptspro -c "\dt"

# OR use Prisma Studio (web interface)
npm run db:studio
# Opens at http://localhost:5555
```

---

## ✅ Step 9: Start Backend Server

```bash
npm run dev
```

The server should start on `http://localhost:5000` without database errors!

---

## 🔧 Troubleshooting

### "psql: command not found"
PostgreSQL's `bin` directory is not in your PATH. Add it:
```bash
# For PostgreSQL.app
export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"

# For Homebrew
export PATH="/opt/homebrew/bin:$PATH"
```

### "password authentication failed"
- Make sure you're using password `JK6DY34R`
- The user might need to be created first (run Step 3)

### "connection refused"
- Make sure PostgreSQL is running
- Verify it's running on port 5413 (not 5432)
- Check your PostgreSQL.app settings or service status

### "database does not exist"
- Run the CREATE DATABASE command in Step 3

---

## 🚀 Quick Copy-Paste Commands

Once you have `psql` working, run these in order:

```bash
# 1. Connect and create user/database
export PGPASSWORD=JK6DY34R
psql -h localhost -p 5413 -U postgres -d postgres << EOF
CREATE USER conceptspro WITH PASSWORD 'JK6DY34R';
ALTER USER conceptspro CREATEDB;
CREATE DATABASE conceptspro OWNER conceptspro;
\q
EOF

# 2. Navigate to backend
cd /Users/naimurrifat/ConceptsPro/backend

# 3. Generate and migrate
npm run db:generate
npm run db:migrate

# 4. Seed (optional)
npm run db:seed

# 5. Start server
npm run dev
```

---

## Need Help?

If you get stuck, share the error message and I'll help you fix it!


