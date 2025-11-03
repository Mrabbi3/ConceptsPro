const express = require('express');
const router = express.Router();
const {
  gradeSubmission,
  releaseGrade,
  getMyGrades,
  getCourseGrades,
} = require('../controllers/gradeController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.post('/submissions/:id/grade', authorize('instructor', 'admin', 'ta'), gradeSubmission);
router.post('/submissions/:id/release', authorize('instructor', 'admin'), releaseGrade);
router.get('/grades/me', getMyGrades);
router.get('/courses/:id/grades', authorize('instructor', 'admin'), getCourseGrades);

module.exports = router;

