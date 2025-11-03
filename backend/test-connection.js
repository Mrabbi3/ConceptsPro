// Quick test script to verify PostgreSQL connection
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('Port: 5413');
    console.log('Password: JK6DY34R');
    console.log('');
    
    await prisma.$connect();
    console.log('✅ Successfully connected to PostgreSQL!');
    console.log('');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT version() as version`;
    console.log('✅ Database version:', result[0]?.version || 'Connected');
    console.log('');
    console.log('📝 Next steps:');
    console.log('  1. Create database user: conceptspro');
    console.log('  2. Create database: conceptspro');
    console.log('  3. Run: npm run db:migrate');
    
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error('');
    console.error('Error details:', error.message);
    console.error('');
    console.error('Common issues:');
    console.error('  - PostgreSQL not running');
    console.error('  - Wrong port (should be 5413)');
    console.error('  - Wrong password (should be JK6DY34R)');
    console.error('  - Database/user doesn\'t exist yet');
    console.error('');
    console.error('Check your .env file:');
    console.error('  DATABASE_URL="postgresql://conceptspro:JK6DY34R@localhost:5413/conceptspro?schema=public"');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

