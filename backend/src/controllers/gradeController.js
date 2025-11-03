const prisma = require('../config/database');
const logger = require('../utils/logger');

const gradeSubmission = async (req, res, next) => {
  try {
    const { id: submissionId } = req.params;
    const { userId, role } = req.user;
    const { pointsEarned, pointsPossible, percentage, letterGrade, feedback, rubricScores, release = false } = req.body;

    // Get submission
    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check if user can grade (instructor or TA)
    const course = submission.assignment.course;
    if (course.instructorId !== userId && role !== 'admin' && role !== 'ta') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if already graded
    const existingGrade = await prisma.grade.findUnique({
      where: { submissionId: submissionId },
    });

    let grade;
    if (existingGrade) {
      // Update existing grade
      grade = await prisma.grade.update({
        where: { submissionId: submissionId },
        data: {
          pointsEarned: pointsEarned ? parseFloat(pointsEarned) : null,
          pointsPossible: pointsPossible ? parseFloat(pointsPossible) : submission.assignment.points,
          percentage: percentage ? parseFloat(percentage) : null,
          letterGrade,
          feedback,
          rubricScores: rubricScores ? JSON.parse(JSON.stringify(rubricScores)) : null,
          graderId: userId,
          gradedAt: new Date(),
          releasedAt: release ? new Date() : existingGrade.releasedAt,
        },
      });
    } else {
      // Create new grade
      grade = await prisma.grade.create({
        data: {
          submissionId: submissionId,
          graderId: userId,
          pointsEarned: pointsEarned ? parseFloat(pointsEarned) : null,
          pointsPossible: pointsPossible ? parseFloat(pointsPossible) : submission.assignment.points,
          percentage: percentage ? parseFloat(percentage) : null,
          letterGrade,
          feedback,
          rubricScores: rubricScores ? JSON.parse(JSON.stringify(rubricScores)) : null,
          releasedAt: release ? new Date() : null,
        },
      });
    }

    // Update submission status
    await prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'graded',
      },
    });

    logger.info(`Grade created/updated: ${grade.id} for submission ${submissionId}`);

    res.json(grade);
  } catch (error) {
    next(error);
  }
};

const releaseGrade = async (req, res, next) => {
  try {
    const { id: submissionId } = req.params;
    const { userId, role } = req.user;

    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check permissions
    const course = submission.assignment.course;
    if (course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const grade = await prisma.grade.update({
      where: { submissionId: submissionId },
      data: {
        releasedAt: new Date(),
      },
    });

    // Create notification for student
    await prisma.notification.create({
      data: {
        userId: submission.userId,
        notificationType: 'grade_posted',
        title: 'Grade Posted',
        message: `Your grade for "${submission.assignment.title}" has been posted.`,
        linkUrl: `/courses/${course.id}/assignments/${submission.assignmentId}`,
      },
    });

    res.json(grade);
  } catch (error) {
    next(error);
  }
};

const getMyGrades = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const submissions = await prisma.assignmentSubmission.findMany({
      where: {
        userId: userId,
      },
      include: {
        assignment: {
          include: {
            course: {
              select: {
                id: true,
                code: true,
                title: true,
              },
            },
          },
        },
        grade: {
          where: {
            releasedAt: {
              not: null,
            },
          },
        },
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

const getCourseGrades = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;
    const { userId, role } = req.user;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check permissions
    if (course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        courseId: courseId,
        deletedAt: null,
      },
      include: {
        submissions: {
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
            grade: true,
          },
        },
      },
    });

    res.json(assignments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  gradeSubmission,
  releaseGrade,
  getMyGrades,
  getCourseGrades,
};

