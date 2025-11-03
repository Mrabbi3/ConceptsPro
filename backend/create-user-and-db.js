// Script to create database user and database
// This connects as the default postgres user first
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Connection string using postgres superuser
const postgresUrl = 'postgresql://postgres:JK6DY34R@localhost:5413/postgres?schema=public';

async function setupDatabase() {
  console.log('🔧 Setting up ConceptsPro database...');
  console.log('Port: 5413');
  console.log('Password: JK6DY34R');
  console.log('');
  
  // Connect as postgres superuser
  const postgresClient = new PrismaClient({
    datasources: {
      db: {
        url: postgresUrl
      }
    }
  });

  try {
    console.log('1️⃣ Connecting as postgres user...');
    await postgresClient.$connect();
    console.log('✅ Connected!');
    console.log('');

    console.log('2️⃣ Creating user "conceptspro"...');
    // Create user
    await postgresClient.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'conceptspro') THEN
          CREATE USER conceptspro WITH PASSWORD 'JK6DY34R';
          RAISE NOTICE 'User conceptspro created';
        ELSE
          RAISE NOTICE 'User conceptspro already exists';
        END IF;
      END
      $$;
    `);
    console.log('✅ User created or already exists');
    console.log('');

    console.log('3️⃣ Granting permissions...');
    await postgresClient.$executeRawUnsafe('ALTER USER conceptspro CREATEDB;');
    console.log('✅ Permissions granted');
    console.log('');

    console.log('4️⃣ Creating database "conceptspro"...');
    // Check if database exists
    const dbExists = await postgresClient.$queryRawUnsafe(`
      SELECT 1 FROM pg_database WHERE datname = 'conceptspro'
    `);
    
    if (dbExists.length === 0) {
      // Create database - note: CREATE DATABASE cannot run in a transaction
      // So we use a separate connection
      await postgresClient.$executeRawUnsafe('CREATE DATABASE conceptspro OWNER conceptspro');
      console.log('✅ Database created');
    } else {
      console.log('✅ Database already exists');
    }
    console.log('');

    console.log('✅ Database setup complete!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('  cd /Users/naimurrifat/ConceptsPro/backend');
    console.log('  npm run db:generate');
    console.log('  npm run db:migrate');
    console.log('  npm run db:seed  # Optional');
    
  } catch (error) {
    console.error('❌ Error setting up database:');
    console.error('');
    console.error(error.message);
    console.error('');
    console.error('Common issues:');
    console.error('  - PostgreSQL not running');
    console.error('  - Wrong port (should be 5413)');
    console.error('  - Wrong password for postgres user');
    console.error('  - Need to use different superuser');
    console.error('');
    console.error('Try connecting manually with psql:');
    console.error('  psql -h localhost -p 5413 -U postgres');
  } finally {
    await postgresClient.$disconnect();
  }
}

setupDatabase();

