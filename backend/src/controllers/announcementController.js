const prisma = require('../config/database');
const logger = require('../utils/logger');

const getAnnouncements = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;
    const { userId } = req.user;

    // Verify access
    const enrollment = await prisma.courseEnrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: courseId,
          userId: userId,
        },
      },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!enrollment && course.instructorId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const announcements = await prisma.announcement.findMany({
      where: {
        courseId: courseId,
        deletedAt: null,
        isPublished: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: [
        { isPinned: 'desc' },
        { publishedAt: 'desc' },
      ],
    });

    // Mark as viewed
    for (const announcement of announcements) {
      await prisma.announcementView.upsert({
        where: {
          announcementId_userId: {
            announcementId: announcement.id,
            userId: userId,
          },
        },
        create: {
          announcementId: announcement.id,
          userId: userId,
        },
        update: {},
      });
    }

    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const { id: courseId } = req.params;
    const { userId, role } = req.user;
    const { title, content, isPinned, expiresAt, attachments } = req.body;

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

    const announcement = await prisma.announcement.create({
      data: {
        courseId: courseId,
        authorId: userId,
        title,
        content,
        isPinned: isPinned || false,
        isPublished: true,
        publishedAt: new Date(),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        attachments: attachments ? JSON.parse(JSON.stringify(attachments)) : [],
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create notifications for all enrolled students
    const enrollments = await prisma.courseEnrollment.findMany({
      where: {
        courseId: courseId,
        enrollmentStatus: 'enrolled',
        user: {
          role: 'student',
        },
      },
      select: {
        userId: true,
      },
    });

    await prisma.notification.createMany({
      data: enrollments.map((enrollment) => ({
        userId: enrollment.userId,
        notificationType: 'announcement',
        title: `New Announcement: ${title}`,
        message: content.substring(0, 100),
        linkUrl: `/courses/${courseId}/announcements`,
      })),
    });

    logger.info(`Announcement created: ${announcement.id} by user ${userId}`);

    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

const updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    const updateData = req.body;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (announcement.course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (updateData.expiresAt) {
      updateData.expiresAt = new Date(updateData.expiresAt);
    }

    const updated = await prisma.announcement.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        course: true,
      },
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (announcement.course.instructorId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.announcement.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};

