const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@conceptspro.com' },
    update: {},
    create: {
      email: 'admin@conceptspro.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: true,
    },
  });

  // Create instructor
  const instructorPassword = await bcrypt.hash('instructor123', 12);
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@conceptspro.com' },
    update: {},
    create: {
      email: 'instructor@conceptspro.com',
      passwordHash: instructorPassword,
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      role: 'instructor',
      emailVerified: true,
    },
  });

  // Create student
  const studentPassword = await bcrypt.hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@conceptspro.com' },
    update: {},
    create: {
      email: 'student@conceptspro.com',
      passwordHash: studentPassword,
      firstName: 'John',
      lastName: 'Student',
      role: 'student',
      emailVerified: true,
    },
  });

  // Create a course
  const course = await prisma.course.create({
    data: {
      code: 'CS 101',
      title: 'Data Communication Fundamentals',
      description: 'Master data communication through interactive visual frameworks.',
      instructorId: instructor.id,
      term: 'Fall 2024',
      academicYear: 2024,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-15'),
      status: 'published',
    },
  });

  // Enroll student in course
  await prisma.courseEnrollment.create({
    data: {
      courseId: course.id,
      userId: student.id,
      enrollmentStatus: 'enrolled',
    },
  });

  // Update course enrollment count
  await prisma.course.update({
    where: { id: course.id },
    data: { currentEnrollment: 1 },
  });

  console.log('Seed data created:');
  console.log('- Admin:', admin.email);
  console.log('- Instructor:', instructor.email);
  console.log('- Student:', student.email);
  console.log('- Course:', course.code, course.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

