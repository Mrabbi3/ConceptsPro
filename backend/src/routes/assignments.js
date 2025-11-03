const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  submitAssignment,
  getSubmissions,
} = require('../controllers/assignmentController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateAssignment } = require('../middleware/validate');

router.use(authenticate);

router.get('/courses/:id/assignments', getAssignments);
router.get('/assignments/:id', getAssignment);
router.post('/courses/:courseId/assignments', authorize('instructor', 'admin'), validateAssignment, createAssignment);
router.put('/assignments/:id', authorize('instructor', 'admin'), updateAssignment);
router.post('/assignments/:id/submit', submitAssignment);
router.get('/assignments/:id/submissions', authorize('instructor', 'admin', 'ta'), getSubmissions);

module.exports = router;

