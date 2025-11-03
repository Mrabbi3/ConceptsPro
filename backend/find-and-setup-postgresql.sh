#!/bin/bash

# Script to find PostgreSQL and set up the database

echo "🔍 Finding PostgreSQL installation..."
echo ""

# Common PostgreSQL locations on macOS
LOCATIONS=(
    "/Applications/Postgres.app/Contents/Versions/latest/bin"
    "/Applications/Postgres.app/Contents/Versions/15/bin"
    "/Applications/Postgres.app/Contents/Versions/16/bin"
    "/opt/homebrew/bin"
    "/usr/local/bin"
    "/usr/bin"
)

PSQL_PATH=""

for location in "${LOCATIONS[@]}"; do
    if [ -f "$location/psql" ]; then
        PSQL_PATH="$location"
        echo "✅ Found psql at: $PSQL_PATH"
        break
    fi
done

if [ -z "$PSQL_PATH" ]; then
    echo "❌ Could not find psql automatically"
    echo ""
    echo "Please find PostgreSQL manually:"
    echo "  1. If using PostgreSQL.app:"
    echo "     - Open the app"
    echo "     - Go to Settings"
    echo "     - Copy the 'Command Line Tools' path"
    echo "     - Run: export PATH=\"[PATH]:\$PATH\""
    echo ""
    echo "  2. Or find it with:"
    echo "     find /Applications -name psql"
    exit 1
fi

# Add to PATH
export PATH="$PSQL_PATH:$PATH"

echo ""
echo "🔌 Testing PostgreSQL connection on port 5413..."
echo ""

# Test connection
if PGPASSWORD=JK6DY34R psql -h localhost -p 5413 -U postgres -d postgres -c "SELECT 1;" &> /dev/null; then
    echo "✅ Connected successfully!"
    echo ""
    echo "📦 Setting up database..."
    echo ""
    
    # Create user and database
    PGPASSWORD=JK6DY34R psql -h localhost -p 5413 -U postgres -d postgres << SQL
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'conceptspro') THEN
        CREATE USER conceptspro WITH PASSWORD 'JK6DY34R';
    END IF;
END
\$\$;

-- Grant permissions
ALTER USER conceptspro CREATEDB;

-- Create database if not exists
SELECT 'CREATE DATABASE conceptspro OWNER conceptspro'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'conceptspro')\gexec
SQL

    echo ""
    echo "✅ Database setup complete!"
    echo ""
    echo "Next steps:"
    echo "  cd /Users/naimurrifat/ConceptsPro/backend"
    echo "  npm run db:generate"
    echo "  npm run db:migrate"
    echo "  npm run db:seed  # Optional"
    
else
    echo "❌ Cannot connect to PostgreSQL"
    echo ""
    echo "Possible issues:"
    echo "  1. PostgreSQL is not running"
    echo "  2. Wrong port (expected: 5413)"
    echo "  3. Wrong password (expected: JK6DY34R)"
    echo "  4. Wrong host (expected: localhost)"
    echo ""
    echo "Try connecting manually:"
    echo "  $PSQL_PATH/psql -h localhost -p 5413 -U postgres"
    exit 1
fi


