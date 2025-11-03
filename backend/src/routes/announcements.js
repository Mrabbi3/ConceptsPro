const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);

router.get('/courses/:id/announcements', getAnnouncements);
router.post('/courses/:id/announcements', authorize('instructor', 'admin'), createAnnouncement);
router.put('/announcements/:id', authorize('instructor', 'admin'), updateAnnouncement);
router.delete('/announcements/:id', authorize('instructor', 'admin'), deleteAnnouncement);

module.exports = router;

