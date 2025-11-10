# ConceptsPro - Learning Management System

An interactive Learning Management System (LMS) designed for educational institutions, featuring course management, assignments, grading, and interactive data communication framework visualizations.

## 🌟 Overview

ConceptsPro is a full-stack web application that combines traditional LMS functionality with innovative interactive visualizations for data communication concepts. Perfect for computer science and networking courses.

## ✨ Key Features

### 🎓 Learning Management System
- **User Authentication & Authorization** - JWT-based auth with role-based access control (Student, Instructor, Admin, TA)
- **Course Management** - Create, manage, and enroll in courses
- **Assignment System** - Create assignments, submit work, track submissions
- **Grading System** - Grade submissions with feedback and rubric support
- **Announcements** - Course-wide announcements with read tracking
- **Notifications** - Real-time notifications for students and instructors
- **File Upload** - Secure file upload and management for assignments
- **Calendar Integration** - Track important dates and deadlines

### 📊 Interactive Visualizations
- **Encryption/Decryption** - Visualize data security using keys and algorithms
- **Encoding/Decoding** - Understand data format conversion for transmission
- **Modulation/Demodulation** - See digital-to-analog signal conversion
- **Multiplexing/Demultiplexing** - Explore how multiple signals are combined

### 🤖 AI-Powered Features
- **ChatBot Assistant** - Get instant help navigating to concepts and resources
- **Progress Tracking** - Monitor learning journey across all courses
- **Personalized Dashboard** - Role-based views for students and instructors

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 16+
- **Framework:** Express.js
- **Database:** PostgreSQL 12+
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet.js, bcrypt, CORS
- **File Upload:** Multer
- **Validation:** Express Validator

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context API
- **HTTP Client:** Fetch API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 16.x or higher
- **npm** or **yarn**
- **PostgreSQL** 12.x or higher
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ConceptsPro.git
cd ConceptsPro
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Setup database
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run database migrations
npm run db:seed        # (Optional) Seed with sample data

# Start backend server
npm run dev            # Development mode
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env to set VITE_API_URL=http://localhost:5000/api

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **API Health Check:** http://localhost:5000/health

## ⚙️ Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/conceptspro?schema=public"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend Environment Variables

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=ConceptsPro
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user profile | Yes |
| PUT | `/api/auth/me` | Update user profile | Yes |

### Course Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses` | List all courses | Yes |
| GET | `/api/courses/:id` | Get course details | Yes |
| POST | `/api/courses` | Create course | Yes (Instructor/Admin) |
| PUT | `/api/courses/:id` | Update course | Yes (Instructor/Admin) |
| POST | `/api/courses/:id/enroll` | Enroll in course | Yes |
| POST | `/api/courses/:id/unenroll` | Drop course | Yes |

### Assignment Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/courses/:id/assignments` | List assignments | Yes |
| GET | `/api/assignments/:id` | Get assignment details | Yes |
| POST | `/api/courses/:id/assignments` | Create assignment | Yes (Instructor) |
| PUT | `/api/assignments/:id` | Update assignment | Yes (Instructor) |
| POST | `/api/assignments/:id/submit` | Submit assignment | Yes (Student) |
| GET | `/api/assignments/:id/submissions` | Get submissions | Yes (Instructor) |

For complete API documentation, see [BACKEND_SUMMARY.md](./BACKEND_SUMMARY.md)

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - Students, instructors, admins, TAs
- **Institution** - Multi-tenant support
- **Course** - Course information and settings
- **Enrollment** - Student course enrollments
- **Assignment** - Course assignments
- **Submission** - Student assignment submissions
- **Grade** - Assignment grades and feedback
- **Announcement** - Course announcements
- **Notification** - User notifications
- **CalendarEvent** - Important dates

For complete schema details, see [DATABASE_SCHEMA_REFERENCE.md](./DATABASE_SCHEMA_REFERENCE.md)

## 📦 Project Structure

```
ConceptsPro/
├── backend/                 # Backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Seed data
│   ├── uploads/            # File uploads
│   ├── package.json
│   └── .env
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── assets/        # Images, styles
│   │   ├── components/    # React components
│   │   │   ├── common/    # Reusable components
│   │   │   ├── visuals/   # Visualization components
│   │   │   ├── ChatBot.jsx
│   │   │   └── Navigation.jsx
│   │   ├── config/        # Configuration
│   │   ├── context/       # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🎮 Usage Guide

### For Students

1. **Sign Up/Login** - Create an account or log in
2. **Browse Courses** - View available courses and enroll
3. **View Assignments** - See upcoming assignments and due dates
4. **Submit Work** - Upload assignment files and submit
5. **Check Grades** - View graded assignments with feedback
6. **Track Progress** - Monitor your learning progress
7. **Explore Visuals** - Learn with interactive framework visualizations

### For Instructors

1. **Create Courses** - Set up new courses with details
2. **Manage Students** - View enrolled students
3. **Create Assignments** - Add assignments with due dates
4. **Grade Submissions** - Review and grade student work
5. **Post Announcements** - Communicate with the class
6. **Track Analytics** - Monitor student progress

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Health check
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "student"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Default Login Credentials (After Seeding)

- **Admin:** admin@conceptspro.com / admin123
- **Instructor:** instructor@conceptspro.com / instructor123
- **Student:** student@conceptspro.com / student123

## 🚢 Deployment

### Backend Deployment

Recommended platforms:
- **Heroku** - Easy deployment with PostgreSQL addon
- **Railway** - Modern platform with PostgreSQL support
- **AWS EC2 + RDS** - Full control and scalability
- **DigitalOcean** - App Platform with managed databases

### Frontend Deployment

Recommended platforms:
- **Vercel** - Optimized for React/Vite apps
- **Netlify** - Simple static site hosting
- **AWS S3 + CloudFront** - Scalable CDN hosting
- **GitHub Pages** - Free hosting for public repos

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists and user has permissions

**API Connection Failed**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend `.env`
- Verify CORS settings in backend

**Build Errors**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist` or `rm -rf .next`
- Check Node.js version: `node --version` (should be 16+)

**Authentication Errors**
- Ensure JWT_SECRET is set and at least 32 characters
- Check token expiration settings
- Verify Authorization header format: `Bearer <token>`

## 📖 Documentation

- [Backend README](./backend/README.md) - Backend-specific documentation
- [Frontend README](./frontend/README.md) - Frontend-specific documentation
- [Backend Summary](./BACKEND_SUMMARY.md) - Complete backend implementation details
- [Database Schema](./DATABASE_SCHEMA_REFERENCE.md) - Database structure reference
- [Setup Guide](./SIGNUP_TEST_GUIDE.md) - Detailed testing guide
- [Backend Access Guide](./BACKEND_ACCESS_GUIDE.md) - API access patterns

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Coding Standards

- Follow existing code style
- Write clear commit messages
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

ConceptsPro Team - Building the future of interactive education

## 🙏 Acknowledgments

- React community for excellent documentation
- PostgreSQL team for robust database system
- Prisma team for amazing ORM
- Tailwind CSS for utility-first CSS framework
- All contributors who help improve ConceptsPro

## 📞 Support

Need help? Here's how to get support:

- **Issues:** [GitHub Issues](https://github.com/yourusername/ConceptsPro/issues)
- **Email:** support@conceptspro.com
- **Documentation:** Check our comprehensive docs above

## 🎓 Educational Use

ConceptsPro is designed for educational institutions and is perfect for:
- Universities and colleges
- Online learning platforms
- Computer science courses
- Networking and data communication courses
- Any instructor who wants interactive teaching tools

## 🔮 Future Roadmap

- [ ] Real-time collaboration features
- [ ] Video conferencing integration
- [ ] Mobile app (React Native)
- [ ] Quiz and exam system
- [ ] Discussion forums
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Multi-language support
- [ ] Dark mode

---

**Made with ❤️ for the education community**

*Last Updated: November 2025*
