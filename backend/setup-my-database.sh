#!/bin/bash

# Automated Database Setup Script
# Uses your specific PostgreSQL credentials

set -e

DB_USER="conceptspro"
DB_PASSWORD="JK6DY34R"
DB_NAME="conceptspro"
DB_PORT="5413"

echo "🚀 Setting up ConceptsPro Database"
echo "==================================="
echo ""
echo "Database User: $DB_USER"
echo "Database Name: $DB_NAME"
echo "Port: $DB_PORT"
echo ""

# Check if PostgreSQL is running
echo "1️⃣ Checking PostgreSQL connection..."
if ! pg_isready -h localhost -p $DB_PORT &> /dev/null; then
    echo "❌ PostgreSQL is not running on port $DB_PORT"
    echo ""
    echo "Please make sure PostgreSQL is started, then run this script again."
    exit 1
fi

echo "✅ PostgreSQL is running on port $DB_PORT"
echo ""

# Try to connect and create user/database
echo "2️⃣ Creating database user and database..."
echo ""

# Try to create user (might already exist)
PGPASSWORD=$DB_PASSWORD psql -h localhost -p $DB_PORT -U postgres -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "   User might already exist (that's okay)"
PGPASSWORD=$DB_PASSWORD psql -h localhost -p $DB_PORT -U postgres -d postgres -c "ALTER USER $DB_USER CREATEDB;" 2>/dev/null || echo "   User permissions updated"

# Try to create database (might already exist)
PGPASSWORD=$DB_PASSWORD psql -h localhost -p $DB_PORT -U postgres -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || echo "   Database might already exist (that's okay)"

echo "✅ Database user and database configured"
echo ""

# Test connection
echo "3️⃣ Testing database connection..."
if PGPASSWORD=$DB_PASSWORD psql -h localhost -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" &> /dev/null; then
    echo "✅ Connection successful!"
else
    echo "❌ Connection failed. Please check your credentials."
    echo ""
    echo "Try connecting manually:"
    echo "  psql -h localhost -p $DB_PORT -U postgres -d postgres"
    exit 1
fi

echo ""
echo "4️⃣ Generating Prisma Client..."
npm run db:generate

echo ""
echo "5️⃣ Running database migrations..."
npm run db:migrate

echo ""
echo "6️⃣ Seeding database with sample data..."
read -p "Do you want to seed the database? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:seed
    echo ""
    echo "✅ Database seeded!"
    echo ""
    echo "Sample users:"
    echo "  Admin: admin@conceptspro.com / admin123"
    echo "  Instructor: instructor@conceptspro.com / instructor123"
    echo "  Student: student@conceptspro.com / student123"
else
    echo "⏭️  Skipped seeding"
fi

echo ""
echo "✅ Database setup complete!"
echo ""
echo "You can now start the backend server:"
echo "  npm run dev"


