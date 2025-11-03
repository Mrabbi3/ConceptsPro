const prisma = require('../config/database');
const logger = require('../utils/logger');

const getCourses = async (req, res, next) => {
  try {
    const { role, userId } = req.user;

    let courses;

    if (role === 'student') {
      // Get enrolled courses
      courses = await prisma.course.findMany({
        where: {
          enrollments: {
            some: {
              userId: userId,
              enrollmentStatus: 'enrolled',
            },
          },
        },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              assignments: true,
              modules: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (role === 'instructor' || role === 'ta') {
      // Get courses taught by instructor or where user is TA
      courses = await prisma.course.findMany({
        where: {
          OR: [
            { instructorId: userId },
            {
              enrollments: {
                some: {
                  userId: userId,
                  role: 'ta',
                },
              },
            },
          ],
        },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              assignments: true,
              modules: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Admin: get all courses
      courses = await prisma.course.findMany({
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              enrollments: true,
              assignments: true,
              modules: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    res.json(courses);
  } catch (error) {
    next(error);
  }
};

const getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.user;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        modules: {
          where: {
            deletedAt: null,
            isPublished: true,
          },
          orderBy: {
            orderIndex: 'asc',
          },
          include: {
            contents: {
              where: {
                deletedAt: null,
                isPublished: true,
              },
              orderBy: {
                orderIndex: 'asc',
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            assignments: true,
            modules: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user has access
    if (role === 'student') {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: id,
            userId: userId,
          },
        },
      });

      if (!enrollment || enrollment.enrollmentStatus !== 'enrolled') {
        return res.status(403).json({ error: 'Access denied. You are not enrolled in this course.' });
      }
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

const createCourse = async (req, res, next) => {
  try {
    const { code, title, description, term, academicYear, startDate, endDate, credits, level } = req.body;
    const { userId } = req.user;

    const course = await prisma.course.create({
      data: {
        code,
        title,
        description,
        term,
        academicYear: academicYear || new Date().getFullYear(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        credits: credits ? parseFloat(credits) : null,
        level,
        instructorId: userId,
        status: 'published',
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Course created: ${course.id} by user ${userId}`);

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.user;
    const updateData = req.body;

    // Check if user is instructor of this course
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to update this course' });
    }

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.credits) updateData.credits = parseFloat(updateData.credits);

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

const enrollInCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    // Check if already enrolled
    const existingEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: id,
          userId: userId,
        },
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({ error: 'Already enrolled in this course' });
    }

    // Check course exists and get max enrollment
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.maxEnrollment && course.currentEnrollment >= course.maxEnrollment) {
      return res.status(400).json({ error: 'Course is full' });
    }

    // Create enrollment
    const enrollment = await prisma.courseEnrollment.create({
      data: {
        courseId: id,
        userId: userId,
        enrollmentStatus: 'enrolled',
      },
    });

    // Update course enrollment count
    await prisma.course.update({
      where: { id },
      data: {
        currentEnrollment: {
          increment: 1,
        },
      },
    });

    logger.info(`User ${userId} enrolled in course ${id}`);

    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

const unenrollFromCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: id,
          userId: userId,
        },
      },
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    await prisma.courseEnrollment.update({
      where: {
        courseId_userId: {
          courseId: id,
          userId: userId,
        },
      },
      data: {
        enrollmentStatus: 'dropped',
        dropDate: new Date(),
      },
    });

    // Update course enrollment count
    await prisma.course.update({
      where: { id },
      data: {
        currentEnrollment: {
          decrement: 1,
        },
      },
    });

    res.json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    next(error);
  }
};

const getCourseStudents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.user;

    // Check if user is instructor
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        courseId: id,
        enrollmentStatus: 'enrolled',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            studentId: true,
          },
        },
      },
    });

    res.json(enrollments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  enrollInCourse,
  unenrollFromCourse,
  getCourseStudents,
};

