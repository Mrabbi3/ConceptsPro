# PostgreSQL 18 Setup Guide for macOS

## Step-by-Step Database Setup Instructions

Follow these steps after installing PostgreSQL 18 on your Mac.

---

## ✅ Step 1: Verify PostgreSQL Installation

Open Terminal and check if PostgreSQL is installed:

```bash
psql --version
```

You should see something like: `psql (PostgreSQL) 18.x`

Check if PostgreSQL service is running:

```bash
brew services list | grep postgresql
# OR
pg_isready
```

If it's not running, start it:

```bash
brew services start postgresql@18
# OR if installed via PostgreSQL.app, just open the app
```

---

## ✅ Step 2: Create Database User

Connect to PostgreSQL as the default superuser:

```bash
psql postgres
```

You'll enter the PostgreSQL prompt (`postgres=#`). Then run:

```sql
-- Create user with password (replace with your desired password)
CREATE USER conceptspro WITH PASSWORD 'password123';

-- Grant necessary privileges
ALTER USER conceptspro CREATEDB;

-- Exit psql
\q
```

**Alternative method (if above doesn't work):**

```bash
# Create user directly from command line
createuser -s conceptspro
```

Then set the password:
```bash
psql postgres -c "ALTER USER conceptspro WITH PASSWORD 'password123';"
```

---

## ✅ Step 3: Create the Database

Create the database for ConceptsPro:

```bash
createdb -O conceptspro conceptspro
```

**Alternative method (using psql):**

```bash
psql postgres
```

Then in psql:
```sql
CREATE DATABASE conceptspro OWNER conceptspro;
\q
```

**Verify database was created:**

```bash
psql -U conceptspro -d conceptspro -c "\l"
```

You should see `conceptspro` in the list.

---

## ✅ Step 4: Update .env File (If Needed)

The `.env` file should already exist in the `backend` directory. Verify it has the correct database URL:

```bash
cd /Users/naimurrifat/ConceptsPro/backend
cat .env | grep DATABASE_URL
```

It should show:
```
DATABASE_URL="postgresql://conceptspro:password123@localhost:5432/conceptspro?schema=public"
```

**If you used a different password** in Step 2, update the `.env` file:

```bash
# Edit the DATABASE_URL line to match your password
nano .env
# OR open in your editor
```

Update the password in the connection string if it's different from `password123`.

---

## ✅ Step 5: Generate Prisma Client

Generate the Prisma Client from your schema:

```bash
cd /Users/naimurrifat/ConceptsPro/backend
npm run db:generate
```

You should see:
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
```

---

## ✅ Step 6: Run Database Migrations

Create all the database tables and structure:

```bash
npm run db:migrate
```

This will:
1. Create a new migration
2. Apply it to your database
3. Generate Prisma Client again

You may be prompted to name the migration - just press Enter to use the default name or type a name like "init".

You should see:
```
✔ Generated Prisma Client (v5.22.0) to ./node_modules/@prisma/client
✔ Applied migration `xxxxx_init` to database `conceptspro`
```

---

## ✅ Step 7: Verify Tables Were Created

Check that all tables were created:

```bash
psql -U conceptspro -d conceptspro -c "\dt"
```

You should see a list of tables like:
- users
- courses
- assignments
- grades
- etc.

---

## ✅ Step 8: Seed Database (Optional but Recommended)

Populate the database with sample data (users, courses, etc.):

```bash
npm run db:seed
```

This creates:
- **Admin user**: `admin@conceptspro.com` / `admin123`
- **Instructor**: `instructor@conceptspro.com` / `instructor123`
- **Student**: `student@conceptspro.com` / `student123`
- Sample course: CS 101

---

## ✅ Step 9: Test Database Connection

Verify everything works:

```bash
# Option 1: Test via Prisma Studio (GUI - recommended)
npm run db:studio
```

This opens a browser at `http://localhost:5555` where you can browse your database.

**OR**

```bash
# Option 2: Test via psql
psql -U conceptspro -d conceptspro -c "SELECT COUNT(*) FROM users;"
```

You should see a number (0 if not seeded, or a count if seeded).

---

## ✅ Step 10: Start the Backend Server

Now you can start the backend server:

```bash
npm run dev
```

The server should start without database connection errors on `http://localhost:5000`.

Test it:
```bash
curl http://localhost:5000/health
```

---

## 🔧 Troubleshooting

### Issue: "password authentication failed"

**Solution:** Make sure the password in `.env` matches what you set in Step 2:

```bash
# Update password in psql
psql postgres
ALTER USER conceptspro WITH PASSWORD 'password123';
\q
```

Or update `.env` to match your password.

---

### Issue: "database does not exist"

**Solution:** Re-run Step 3 to create the database.

---

### Issue: "role does not exist"

**Solution:** Re-run Step 2 to create the user.

---

### Issue: "permission denied"

**Solution:** Grant proper permissions:

```bash
psql postgres
GRANT ALL PRIVILEGES ON DATABASE conceptspro TO conceptspro;
ALTER USER conceptspro WITH SUPERUSER;  # If needed
\q
```

---

### Issue: PostgreSQL not running

**Solution:**

```bash
# Check status
brew services list | grep postgresql

# Start service
brew services start postgresql@18

# OR if using PostgreSQL.app, just open the application
```

---

### Issue: "port 5432 already in use"

**Solution:** Another PostgreSQL instance might be running. Check:

```bash
lsof -i :5432
```

Stop other instances or use a different port in your `.env` file.

---

## 📝 Quick Reference Commands

```bash
# Check PostgreSQL version
psql --version

# Check if running
pg_isready

# Start PostgreSQL
brew services start postgresql@18

# Connect to database
psql -U conceptspro -d conceptspro

# List all databases
psql -U conceptspro -d postgres -c "\l"

# List all tables
psql -U conceptspro -d conceptspro -c "\dt"

# View table structure
psql -U conceptspro -d conceptspro -c "\d users"

# Open Prisma Studio (GUI)
cd backend && npm run db:studio
```

---

## ✅ Success Checklist

- [ ] PostgreSQL 18 installed and running
- [ ] Database user `conceptspro` created
- [ ] Database `conceptspro` created
- [ ] `.env` file has correct `DATABASE_URL`
- [ ] Prisma Client generated
- [ ] Database migrations run successfully
- [ ] Tables visible in database
- [ ] Database seeded (optional)
- [ ] Backend server starts without errors
- [ ] API responds to requests

---

## 🎉 You're All Set!

Once all steps are complete, your backend database is ready to use. You can:
- Start the backend: `npm run dev`
- View data: `npm run db:studio`
- Test API endpoints

For more details, see `SETUP.md` or `QUICK_START.md`.


