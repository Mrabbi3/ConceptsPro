/**
 * Application constants
 */

export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
  TA: 'ta',
};

export const ENROLLMENT_STATUS = {
  ENROLLED: 'enrolled',
  DROPPED: 'dropped',
  WITHDRAWN: 'withdrawn',
  COMPLETED: 'completed',
};

export const ASSIGNMENT_TYPES = {
  HOMEWORK: 'homework',
  PROJECT: 'project',
  ESSAY: 'essay',
  PRESENTATION: 'presentation',
};

export const SUBMISSION_STATUS = {
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  RETURNED: 'returned',
  NEEDS_REVISION: 'needs_revision',
};

export const CONTENT_TYPES = {
  VIDEO: 'video',
  DOCUMENT: 'document',
  INTERACTIVE: 'interactive',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  LINK: 'link',
};

export const NOTIFICATION_TYPES = {
  ASSIGNMENT_DUE: 'assignment_due',
  GRADE_POSTED: 'grade_posted',
  ANNOUNCEMENT: 'announcement',
  MESSAGE: 'message',
  COURSE_UPDATE: 'course_update',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  COURSES: {
    BASE: '/courses',
    ENROLL: (id) => `/courses/${id}/enroll`,
    UNENROLL: (id) => `/courses/${id}/unenroll`,
  },
  ASSIGNMENTS: {
    BASE: '/assignments',
    SUBMIT: (id) => `/assignments/${id}/submit`,
  },
};

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  COURSE: (id) => `/courses/${id}`,
  CALENDAR: '/calendar',
  HELP: '/help',
};

