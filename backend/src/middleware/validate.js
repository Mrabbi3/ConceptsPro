const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('role').optional().isIn(['student', 'instructor', 'admin', 'ta']),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateCourse = [
  body('code').trim().notEmpty().withMessage('Course code is required'),
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('term').trim().notEmpty().withMessage('Term is required'),
  body('startDate').isISO8601().toDate(),
  body('endDate').isISO8601().toDate(),
  handleValidationErrors,
];

const validateAssignment = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('points').isFloat({ min: 0 }).withMessage('Points must be a positive number'),
  body('dueDate').isISO8601().toDate(),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse,
  validateAssignment,
  handleValidationErrors,
};

