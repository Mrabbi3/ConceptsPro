# Backend Implementation Guide - Quick Start

## Overview
This guide provides a simplified, step-by-step approach to implementing the ConceptsPro LMS backend based on the comprehensive architecture document.

## Technology Stack Selection

### Recommended: **Node.js + Express + PostgreSQL**

**Why Node.js?**
- Same language as your React frontend (easier for full-stack developers)
- Excellent for real-time features (WebSocket support)
- Fast development cycle
- Large npm ecosystem
- Good performance for I/O-heavy operations

**Why Express?**
- Simple and flexible
- Large community
- Easy to learn
- Great documentation

**Why PostgreSQL?**
- Robust relational database
- Excellent JSON support (for flexible fields)
- ACID compliance (data integrity)
- Free and open-source
- Great tooling and support

---

## Quick Start: Setting Up Your Backend

### Step 1: Initialize Project

```bash
# Create backend directory
mkdir conceptspro-backend
cd conceptspro-backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express cors dotenv helmet morgan
npm install bcrypt jsonwebtoken
npm install pg prisma @prisma/client
npm install express-validator
npm install multer-s3 aws-sdk  # For file uploads
npm install socket.io           # For real-time features
npm install redis bull          # For job queues
npm install nodemailer          # For emails

# Install development dependencies
npm install -D nodemon typescript @types/node @types/express
npm install -D @types/bcrypt @types/jsonwebtoken @types/pg
```

### Step 2: Project Structure

```
conceptspro-backend/
├── src/
│   ├── config/
│   │   ├── database.js          # DB connection
│   │   ├── redis.js             # Redis connection
│   │   └── aws.js               # AWS S3 config
│   ├── models/                  # Database models
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Assignment.js
│   │   └── ...
│   ├── controllers/             # Request handlers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── assignmentController.js
│   │   └── ...
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── assignments.js
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   ├── authorize.js         # Role-based authorization
│   │   ├── validate.js         # Input validation
│   │   └── errorHandler.js     # Error handling
│   ├── services/               # Business logic
│   │   ├── emailService.js
│   │   ├── fileService.js
│   │   ├── notificationService.js
│   │   └── ...
│   ├── utils/
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   └── constants.js
│   ├── jobs/                   # Background jobs
│   │   ├── emailJobs.js
│   │   └── ...
│   └── server.js               # Entry point
├── .env
├── .gitignore
├── package.json
└── README.md
```

### Step 3: Basic Server Setup

**src/server.js**
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS configuration
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
// ... more routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Core Implementation Steps

### 1. Database Setup

**Option A: Using Prisma (Recommended for beginners)**

```bash
# Install Prisma
npm install -D prisma
npx prisma init
```

**prisma/schema.prisma**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                String   @id @default(uuid())
  email             String   @unique
  passwordHash      String   @map("password_hash")
  firstName         String   @map("first_name")
  lastName          String   @map("last_name")
  role              String
  emailVerified     Boolean  @default(false) @map("email_verified")
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
  
  @@map("users")
}

model Course {
  id            String   @id @default(uuid())
  code          String
  title         String
  description   String?
  instructorId  String   @map("instructor_id")
  term          String
  startDate     DateTime @map("start_date")
  endDate       DateTime @map("end_date")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  
  instructor    User     @relation(fields: [instructorId], references: [id])
  enrollments   CourseEnrollment[]
  
  @@map("courses")
}

// ... more models
```

**Option B: Using Raw SQL**

Create migration files with SQL and use a tool like `node-pg-migrate`.

### 2. Authentication Implementation

**src/middleware/auth.js**
```javascript
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authenticate;
```

**src/controllers/authController.js**
```javascript
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: role || 'student'
      }
    });
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      }
    });
  } catch (error) {
    if (error.code === 'P2002') { // Unique constraint violation
      return res.status(400).json({ error: 'Email already exists' });
    }
    next(error);
  }
};

module.exports = { login, register };
```

**src/routes/auth.js**
```javascript
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const { validateLogin, validateRegister } = require('../middleware/validate');

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);

module.exports = router;
```

### 3. Course Management

**src/controllers/courseController.js**
```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all courses (filtered by user)
const getCourses = async (req, res, next) => {
  try {
    const { role, userId } = req.user;
    
    let courses;
    if (role === 'student') {
      // Get enrolled courses
      courses = await prisma.course.findMany({
        where: {
          enrollments: {
            some: {
              userId: userId,
              enrollmentStatus: 'enrolled'
            }
          }
        },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              assignments: true
            }
          }
        }
      });
    } else if (role === 'instructor') {
      // Get courses taught by instructor
      courses = await prisma.course.findMany({
        where: {
          instructorId: userId
        },
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              assignments: true
            }
          }
        }
      });
    } else {
      // Admin: get all courses
      courses = await prisma.course.findMany({
        include: {
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              enrollments: true,
              assignments: true
            }
          }
        }
      });
    }
    
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

// Create course (instructor only)
const createCourse = async (req, res, next) => {
  try {
    const { code, title, description, term, startDate, endDate } = req.body;
    const { userId } = req.user;
    
    const course = await prisma.course.create({
      data: {
        code,
        title,
        description,
        term,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        instructorId: userId
      },
      include: {
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, createCourse };
```

### 4. File Upload (S3)

**src/services/fileService.js**
```javascript
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'private',
    key: function (req, file, cb) {
      const folder = req.params.folder || 'uploads';
      const filename = `${folder}/${uuidv4()}-${file.originalname}`;
      cb(null, filename);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

const getSignedUrl = async (fileKey, expiresIn = 3600) => {
  return s3.getSignedUrl('getObject', {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
    Expires: expiresIn
  });
};

module.exports = { upload, getSignedUrl, s3 };
```

---

## Environment Variables (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/conceptspro

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-refresh-token-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=conceptspro-uploads

# Redis
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend
FRONTEND_URL=http://localhost:5173

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## Testing Strategy

### 1. Unit Tests
Test individual functions and controllers:
```bash
npm install -D jest supertest @types/jest
```

**Example test:**
```javascript
const { login } = require('../controllers/authController');

describe('Auth Controller', () => {
  test('should login user with valid credentials', async () => {
    // Test implementation
  });
});
```

### 2. Integration Tests
Test API endpoints end-to-end:
```javascript
const request = require('supertest');
const app = require('../server');

describe('Auth API', () => {
  test('POST /api/auth/login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

---

## Deployment Checklist

### Before Deploying

- [ ] Set `NODE_ENV=production`
- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Configure CORS properly
- [ ] Set up SSL/HTTPS
- [ ] Configure database backups
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Test all critical endpoints
- [ ] Load testing
- [ ] Security audit

### Deployment Options

1. **Heroku** (Easiest)
   - Simple deployment
   - Managed PostgreSQL
   - Free tier available

2. **AWS/DigitalOcean** (More control)
   - VPS or EC2
   - More configuration needed
   - More cost-effective at scale

3. **Docker + Kubernetes** (Production)
   - Containerized deployment
   - Auto-scaling
   - High availability

---

## Next Steps

1. **Week 1-2**: Set up project structure and database
2. **Week 3-4**: Implement authentication
3. **Week 5-6**: Build course management
4. **Week 7-8**: Add assignments and submissions
5. **Week 9-10**: Implement grading system
6. **Week 11-12**: Add announcements and notifications
7. **Week 13-14**: Real-time features (WebSocket)
8. **Week 15-16**: Testing and optimization

---

## Resources

- **Express.js Docs**: https://expressjs.com/
- **Prisma Docs**: https://www.prisma.io/docs/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **JWT**: https://jwt.io/
- **AWS S3**: https://docs.aws.amazon.com/s3/

---

**Good luck with your backend implementation! 🚀**

