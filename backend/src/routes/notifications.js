const express = require('express');
const router = express.Router();
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', getNotifications);
router.get('/unread/count', getUnreadCount);
router.post('/:id/read', markAsRead);
router.post('/read/all', markAllAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;

