#!/bin/bash

# Database Setup Script for ConceptsPro Backend
# This script helps set up PostgreSQL database for development

set -e

echo "🚀 ConceptsPro Database Setup"
echo "=============================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo ""
    echo "Please install PostgreSQL using one of the following methods:"
    echo ""
    echo "Option 1: Install via Homebrew (Recommended for macOS)"
    echo "  brew install postgresql@15"
    echo "  brew services start postgresql@15"
    echo ""
    echo "Option 2: Install PostgreSQL.app (macOS GUI)"
    echo "  Download from: https://postgresapp.com/"
    echo ""
    echo "Option 3: Use Docker"
    echo "  docker run --name conceptspro-db \\"
    echo "    -e POSTGRES_USER=conceptspro \\"
    echo "    -e POSTGRES_PASSWORD=password123 \\"
    echo "    -e POSTGRES_DB=conceptspro \\"
    echo "    -p 5432:5432 \\"
    echo "    -d postgres:15"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL is installed"
echo ""

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 &> /dev/null; then
    echo "⚠️  PostgreSQL is not running."
    echo ""
    echo "Please start PostgreSQL:"
    echo "  brew services start postgresql@15"
    echo "  OR"
    echo "  Start PostgreSQL.app"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating one..."
    cat > .env << 'ENVEOF'
# Server
PORT=5000
NODE_ENV=development

# Database - Update with your credentials
DATABASE_URL="postgresql://conceptspro:password123@localhost:5432/conceptspro?schema=public"

# JWT Secrets - CHANGE THESE IN PRODUCTION!
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long-for-development
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret-also-32-chars-minimum-for-development
REFRESH_TOKEN_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# Frontend URL
FRONTEND_URL=http://localhost:5173

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENVEOF
    echo "✅ Created .env file"
    echo ""
fi

# Extract database credentials from .env
DB_USER=$(grep DATABASE_URL .env | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(grep DATABASE_URL .env | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_NAME=$(grep DATABASE_URL .env | sed -n 's/.*@[^/]*\/\([^?]*\).*/\1/p')

echo "Setting up database: $DB_NAME"
echo "User: $DB_USER"
echo ""

# Try to create database (might already exist)
if psql -h localhost -U "$DB_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1; then
    echo "✅ Database '$DB_NAME' already exists"
else
    echo "Creating database '$DB_NAME'..."
    if PGPASSWORD="$DB_PASS" psql -h localhost -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null; then
        echo "✅ Database '$DB_NAME' created"
    else
        echo "⚠️  Could not create database automatically."
        echo "Please create it manually:"
        echo "  createdb $DB_NAME"
        echo "  OR"
        echo "  psql -c 'CREATE DATABASE $DB_NAME;'"
    fi
fi

echo ""
echo "📦 Generating Prisma Client..."
npm run db:generate

echo ""
echo "🔄 Running database migrations..."
npm run db:migrate

echo ""
echo "🌱 Seeding database (optional)..."
read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
    echo "✅ Database seeded!"
    echo ""
    echo "Sample users created:"
    echo "  Admin: admin@conceptspro.com / admin123"
    echo "  Instructor: instructor@conceptspro.com / instructor123"
    echo "  Student: student@conceptspro.com / student123"
else
    echo "⏭️  Skipping database seed"
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "You can now start the backend server with:"
echo "  npm run dev"

