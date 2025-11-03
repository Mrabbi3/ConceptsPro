const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  enrollInCourse,
  unenrollFromCourse,
  getCourseStudents,
} = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateCourse } = require('../middleware/validate');

// All routes require authentication
router.use(authenticate);

router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', authorize('instructor', 'admin'), validateCourse, createCourse);
router.put('/:id', authorize('instructor', 'admin'), updateCourse);
router.post('/:id/enroll', enrollInCourse);
router.post('/:id/unenroll', unenrollFromCourse);
router.get('/:id/students', authorize('instructor', 'admin', 'ta'), getCourseStudents);

module.exports = router;

