# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

**Option A: Using Docker (Recommended)**
```bash
docker run --name conceptspro-db \
  -e POSTGRES_USER=conceptspro \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=conceptspro \
  -p 5432:5432 \
  -d postgres:15
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb conceptspro
```

### 3. Configure Environment

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database - Update with your credentials
DATABASE_URL="postgresql://conceptspro:password123@localhost:5432/conceptspro?schema=public"

# JWT Secrets - CHANGE THESE IN PRODUCTION!
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret-also-32-chars-minimum
REFRESH_TOKEN_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# Frontend URL
FRONTEND_URL=http://localhost:5173

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4. Setup Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### 5. Seed Database (Optional)

```bash
# Add seed script to package.json if not present
npm run db:seed

# Or run directly:
node prisma/seed.js
```

This creates:
- Admin user: `admin@conceptspro.com` / `admin123`
- Instructor: `instructor@conceptspro.com` / `instructor123`
- Student: `student@conceptspro.com` / `student123`
- Sample course: CS 101

### 6. Start Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:5000`

### 7. Test the API

```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "student"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Common Issues

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env` is correct
- Verify database exists: `psql -U conceptspro -d conceptspro`

### Prisma Client Not Generated
```bash
npm run db:generate
```

### Migration Errors
```bash
# Reset database (WARNING: Deletes all data!)
npm run db:migrate reset

# Or create fresh migration
npx prisma migrate dev --name init
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong, unique JWT secrets
3. Configure proper CORS origins
4. Set up database backups
5. Use environment variables for all secrets
6. Enable HTTPS
7. Set up monitoring and logging

## Next Steps

- Connect frontend to backend API
- Set up authentication in frontend
- Test all API endpoints
- Configure file storage (S3, etc.)
- Set up email service
- Add monitoring/logging

