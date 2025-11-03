const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

module.exports = router;

