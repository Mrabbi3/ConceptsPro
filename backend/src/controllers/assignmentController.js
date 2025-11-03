const prisma = require('../config/database');
const logger = require('../utils/logger');

const getAssignments = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;
    const { role, userId } = req.user;

    // Verify user has access to course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check enrollment or instructor status
    if (role === 'student') {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: courseId,
            userId: userId,
          },
        },
      });

      if (!enrollment || enrollment.enrollmentStatus !== 'enrolled') {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: courseId,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        dueDate: 'asc',
      },
    });

    // Add submission status for students
    if (role === 'student') {
      for (const assignment of assignments) {
        const submission = await prisma.assignmentSubmission.findFirst({
          where: {
            assignmentId: assignment.id,
            userId: userId,
          },
          orderBy: {
            submissionNumber: 'desc',
          },
          include: {
            grade: true,
          },
        });

        assignment.mySubmission = submission || null;
      }
    }

    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

const getAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.user;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check access
    if (role === 'student') {
      const enrollment = await prisma.courseEnrollment.findUnique({
        where: {
          courseId_userId: {
            courseId: assignment.courseId,
            userId: userId,
          },
        },
      });

      if (!enrollment || enrollment.enrollmentStatus !== 'enrolled') {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Get user's submission
      const submission = await prisma.assignmentSubmission.findFirst({
        where: {
          assignmentId: id,
          userId: userId,
        },
        orderBy: {
          submissionNumber: 'desc',
        },
        include: {
          files: true,
          grade: true,
        },
      });

      assignment.mySubmission = submission || null;
    } else {
      // Instructor: get all submissions
      const submissions = await prisma.assignmentSubmission.findMany({
        where: {
          assignmentId: id,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          files: true,
          grade: true,
        },
      });

      assignment.submissions = submissions;
    }

    res.json(assignment);
  } catch (error) {
    next(error);
  }
};

const createAssignment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { role, userId } = req.user;
    const assignmentData = req.body;

    // Verify user is instructor
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        ...assignmentData,
        courseId: courseId,
        points: parseFloat(assignmentData.points),
        dueDate: new Date(assignmentData.dueDate),
        isPublished: assignmentData.isPublished !== undefined ? assignmentData.isPublished : true,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            code: true,
          },
        },
      },
    });

    logger.info(`Assignment created: ${assignment.id} by user ${userId}`);

    res.status(201).json(assignment);
  } catch (error) {
    next(error);
  }
};

const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, userId } = req.user;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    if (assignment.course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = { ...req.body };
    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);
    if (updateData.points) updateData.points = parseFloat(updateData.points);

    const updated = await prisma.assignment.update({
      where: { id },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const submitAssignment = async (req, res, next) => {
  try {
    const { id: assignmentId } = req.params;
    const { userId } = req.user;
    const { submissionText, submissionUrl, fileUrls = [] } = req.body;

    // Get assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check enrollment
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: assignment.courseId,
          userId: userId,
        },
      },
    });

    if (!enrollment || enrollment.enrollmentStatus !== 'enrolled') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if submission limit reached
    const existingSubmissions = await prisma.assignmentSubmission.count({
      where: {
        assignmentId: assignmentId,
        userId: userId,
      },
    });

    if (existingSubmissions >= assignment.maxSubmissions) {
      return res.status(400).json({ error: 'Maximum submission limit reached' });
    }

    // Check if late
    const now = new Date();
    const isLate = now > new Date(assignment.dueDate);
    const daysLate = isLate
      ? Math.floor((now - new Date(assignment.dueDate)) / (1000 * 60 * 60 * 24))
      : 0;

    // Create submission
    const submission = await prisma.assignmentSubmission.create({
      data: {
        assignmentId: assignmentId,
        userId: userId,
        submissionText,
        submissionUrl,
        submissionNumber: existingSubmissions + 1,
        isLate,
        daysLate,
        status: 'submitted',
      },
    });

    // Create file records
    if (fileUrls.length > 0) {
      await prisma.submissionFile.createMany({
        data: fileUrls.map((url) => ({
          submissionId: submission.id,
          fileName: url.split('/').pop(),
          fileUrl: url,
          fileSizeBytes: 0, // Would need to get from upload
          mimeType: 'application/octet-stream',
        })),
      });
    }

    logger.info(`Assignment submitted: ${submission.id} by user ${userId}`);

    const submissionWithFiles = await prisma.assignmentSubmission.findUnique({
      where: { id: submission.id },
      include: {
        files: true,
      },
    });

    res.status(201).json(submissionWithFiles);
  } catch (error) {
    next(error);
  }
};

const getSubmissions = async (req, res, next) => {
  try {
    const { id: assignmentId } = req.params;
    const { role, userId } = req.user;

    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        course: true,
      },
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Check if instructor
    if (assignment.course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        assignmentId: assignmentId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            studentId: true,
          },
        },
        files: true,
        grade: true,
      },
      orderBy: {
        submissionDate: 'desc',
      },
    });

    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  submitAssignment,
  getSubmissions,
};

