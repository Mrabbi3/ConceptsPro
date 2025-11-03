# ConceptsPro Backend API

Complete backend API for the ConceptsPro Learning Management System (LMS).

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Course Management**: Create, manage, and enroll in courses
- **Assignments**: Create assignments, submit work, and track submissions
- **Grading System**: Grade submissions with feedback and rubric support
- **Announcements**: Course-wide announcements with read tracking
- **Notifications**: Real-time notifications for students and instructors
- **File Upload**: Secure file upload and management
- **Database**: PostgreSQL with Prisma ORM

## 📋 Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/conceptspro?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
PORT=5000
FRONTEND_URL=http://localhost:5173
```

3. **Set up database:**
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate
```

4. **Start the server:**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

### Courses
- `GET /api/courses` - List courses (filtered by user role)
- `GET /api/courses/:id` - Get course details
- `POST /api/courses` - Create course (instructor/admin)
- `PUT /api/courses/:id` - Update course (instructor/admin)
- `POST /api/courses/:id/enroll` - Enroll in course
- `POST /api/courses/:id/unenroll` - Drop course
- `GET /api/courses/:id/students` - List enrolled students (instructor)

### Assignments
- `GET /api/courses/:id/assignments` - List assignments for course
- `GET /api/assignments/:id` - Get assignment details
- `POST /api/courses/:courseId/assignments` - Create assignment (instructor)
- `PUT /api/assignments/:id` - Update assignment (instructor)
- `POST /api/assignments/:id/submit` - Submit assignment (student)
- `GET /api/assignments/:id/submissions` - Get all submissions (instructor)

### Grades
- `POST /api/submissions/:id/grade` - Grade submission (instructor/TA)
- `POST /api/submissions/:id/release` - Release grade to student
- `GET /api/grades/me` - Get my grades (student)
- `GET /api/courses/:id/grades` - Get all grades for course (instructor)

### Announcements
- `GET /api/courses/:id/announcements` - List announcements
- `POST /api/courses/:id/announcements` - Create announcement (instructor)
- `PUT /api/announcements/:id` - Update announcement (instructor)
- `DELETE /api/announcements/:id` - Delete announcement (instructor)

### Notifications
- `GET /api/notifications` - List notifications
- `GET /api/notifications/unread/count` - Get unread count
- `POST /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read/all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Files
- `POST /api/files/upload/:folder?` - Upload single file
- `POST /api/files/upload/multiple/:folder?` - Upload multiple files
- `GET /api/files/:folder/:filename` - Download/serve file

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📝 Example API Usage

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "student"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

### Create Course (as Instructor)
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "CS 101",
    "title": "Introduction to Computer Science",
    "description": "Learn the basics of programming",
    "term": "Fall 2024",
    "academicYear": 2024,
    "startDate": "2024-09-01T00:00:00Z",
    "endDate": "2024-12-15T00:00:00Z"
  }'
```

### Submit Assignment
```bash
curl -X POST http://localhost:5000/api/assignments/<assignment-id>/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "submissionText": "This is my assignment submission",
    "fileUrls": ["http://localhost:5000/api/files/assignments/file1.pdf"]
  }'
```

## 🗄️ Database

The database uses Prisma ORM. Key commands:

```bash
# Create a new migration
npm run db:migrate

# View database in Prisma Studio
npm run db:studio

# Generate Prisma client
npm run db:generate
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── routes/         # API routes
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── uploads/            # File upload directory
├── .env                # Environment variables
└── package.json
```

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/conceptspro

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1h

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# CORS
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 🧪 Testing

Health check endpoint:
```bash
curl http://localhost:5000/health
```

## 🐛 Troubleshooting

**Database connection errors:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Run migrations: `npm run db:migrate`

**Authentication errors:**
- Check JWT_SECRET is set
- Verify token is included in Authorization header
- Ensure token hasn't expired

**File upload errors:**
- Check UPLOAD_DIR exists and is writable
- Verify MAX_FILE_SIZE is sufficient
- Check file type is allowed

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please follow the existing code style and add tests for new features.

