# Backend Architecture Plan - ConceptsPro LMS

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Database Schema](#database-schema)
4. [User Management System](#user-management-system)
5. [Authentication & Authorization](#authentication--authorization)
6. [API Design](#api-design)
7. [File Storage System](#file-storage-system)
8. [Real-time Features](#real-time-features)
9. [Background Jobs & Workers](#background-jobs--workers)
10. [Security Considerations](#security-considerations)
11. [Performance & Scalability](#performance--scalability)
12. [Monitoring & Analytics](#monitoring--analytics)
13. [Technology Stack Recommendations](#technology-stack-recommendations)
14. [Implementation Phases](#implementation-phases)

---

## Overview

This document outlines a comprehensive backend architecture for ConceptsPro, a Learning Management System (LMS) similar to Blackboard. The system will support:

- **Multi-tenant architecture** (supporting multiple institutions)
- **Role-based access control** (Students, Instructors, Admins, TAs)
- **Course management** (creation, enrollment, content delivery)
- **Assessment system** (assignments, quizzes, exams, grading)
- **Communication tools** (announcements, discussions, messaging)
- **Analytics & reporting** (progress tracking, performance metrics)
- **File management** (document storage, video streaming, submissions)
- **Real-time notifications** (updates, deadlines, messages)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS/REST API + WebSocket
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    API Gateway / Load Balancer               │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌─────▼──────┐ ┌────▼──────┐
│  Auth Service│ │API Services │ │WebSocket  │
│              │ │            │ │Service    │
└───────┬──────┘ └─────┬──────┘ └───────────┘
        │              │
        └──────┬───────┘
               │
┌──────────────▼─────────────────────────────────────────────┐
│                    Application Server Layer                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Course  │  │ Assignment│ │  Grade   │  │ Content  │   │
│  │  Service │  │  Service  │ │ Service  │  │ Service  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  User    │  │ Notification│ Analytics│  │ Search   │   │
│  │  Service │  │  Service    │ Service  │  │ Service  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└──────────────┬──────────────────────────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼───┐ ┌───▼────┐ ┌───▼──────┐
│ Redis │ │PostgreSQL│ │ S3/Cloud │
│Cache  │ │Database  │ │ Storage  │
└───────┘ └─────────┘ └──────────┘
    │          │          │
┌───▼──────────────────────────▼──────────────────▼──────────┐
│              Background Job Queue (RabbitMQ/Celery)          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  Email   │  │  Report  │  │  Backup  │  │  Export  │    │
│  │  Worker  │  │  Worker  │  │  Worker  │  │  Worker  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Core Entities

#### 1. **Users Table**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'student', 'instructor', 'admin', 'ta'
    student_id VARCHAR(50) UNIQUE, -- For students (optional)
    employee_id VARCHAR(50) UNIQUE, -- For instructors/staff
    phone VARCHAR(20),
    profile_image_url TEXT,
    bio TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_suspended BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_student_id ON users(student_id);
```

#### 2. **Institutions Table** (Multi-tenant support)
```sql
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE, -- For email domain validation
    logo_url TEXT,
    settings JSONB, -- Institution-specific settings
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    max_users INTEGER,
    max_courses INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_institutions (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, institution_id)
);
```

#### 3. **Courses Table**
```sql
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL, -- e.g., "CS 101"
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructor_id UUID REFERENCES users(id),
    institution_id UUID REFERENCES institutions(id),
    term VARCHAR(50) NOT NULL, -- "Fall 2024", "Spring 2025"
    academic_year INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    enrollment_start DATE,
    enrollment_end DATE,
    max_enrollment INTEGER,
    current_enrollment INTEGER DEFAULT 0,
    credits DECIMAL(3,1),
    level VARCHAR(50), -- 'undergraduate', 'graduate'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'published', 'archived'
    settings JSONB, -- Course-specific settings
    syllabus_url TEXT,
    banner_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(code, term, institution_id)
);

CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_institution ON courses(institution_id);
CREATE INDEX idx_courses_term ON courses(term);
```

#### 4. **Course Enrollments**
```sql
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'student', -- 'student', 'ta', 'grader'
    enrollment_status VARCHAR(50) DEFAULT 'enrolled', -- 'enrolled', 'dropped', 'withdrawn', 'completed'
    enrollment_type VARCHAR(50) DEFAULT 'regular', -- 'regular', 'audit', 'waitlist'
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    drop_date TIMESTAMP,
    grade VARCHAR(10), -- 'A', 'B', 'C', etc.
    gpa_points DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, user_id)
);

CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_status ON course_enrollments(enrollment_status);
```

#### 5. **Modules Table** (Course Content Organization)
```sql
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    publish_date DATE,
    unlock_date DATE, -- When module becomes accessible
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_modules_order ON modules(course_id, order_index);
```

#### 6. **Module Content Items**
```sql
CREATE TABLE module_contents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'video', 'document', 'interactive', 'quiz', 'assignment', 'link'
    description TEXT,
    content_url TEXT, -- For external content
    video_url TEXT, -- For video content
    document_url TEXT, -- For document files
    interactive_content_id UUID, -- Reference to interactive framework
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    is_required BOOLEAN DEFAULT TRUE,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_contents_module ON module_contents(module_id);
CREATE INDEX idx_contents_order ON module_contents(module_id, order_index);
```

#### 7. **Content Progress Tracking**
```sql
CREATE TABLE content_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content_id UUID REFERENCES module_contents(id) ON DELETE CASCADE,
    completion_percentage INTEGER DEFAULT 0, -- 0-100
    last_position INTEGER, -- For video: last watched second
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    time_spent_seconds INTEGER DEFAULT 0,
    first_accessed_at TIMESTAMP,
    last_accessed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, content_id)
);

CREATE INDEX idx_progress_user ON content_progress(user_id);
CREATE INDEX idx_progress_content ON content_progress(content_id);
```

#### 8. **Assignments Table**
```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    points DECIMAL(10,2) NOT NULL,
    assignment_type VARCHAR(50) DEFAULT 'homework', -- 'homework', 'project', 'essay', 'presentation'
    due_date TIMESTAMP NOT NULL,
    allow_late_submission BOOLEAN DEFAULT TRUE,
    late_penalty_per_day DECIMAL(5,2) DEFAULT 0, -- Percentage penalty per day
    max_late_days INTEGER,
    submission_type VARCHAR(50) DEFAULT 'file', -- 'file', 'text', 'url', 'multiple'
    allowed_file_types TEXT[], -- ['pdf', 'doc', 'docx', 'zip']
    max_file_size_mb INTEGER DEFAULT 10,
    max_submissions INTEGER DEFAULT 1,
    requires_peer_review BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    settings JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_module ON assignments(module_id);
```

#### 9. **Assignment Submissions**
```sql
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    submission_text TEXT, -- For text-based submissions
    submission_url TEXT, -- For URL submissions
    submission_number INTEGER NOT NULL DEFAULT 1,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_draft BOOLEAN DEFAULT FALSE,
    is_late BOOLEAN DEFAULT FALSE,
    days_late INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'graded', 'returned', 'needs_revision'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, user_id, submission_number)
);

CREATE TABLE submission_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_user ON assignment_submissions(user_id);
CREATE INDEX idx_submissions_date ON assignment_submissions(submission_date);
```

#### 10. **Grades Table**
```sql
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES assignment_submissions(id) ON DELETE CASCADE,
    grader_id UUID REFERENCES users(id), -- Instructor or TA who graded
    points_earned DECIMAL(10,2),
    points_possible DECIMAL(10,2),
    percentage DECIMAL(5,2),
    letter_grade VARCHAR(10), -- 'A+', 'A', 'B+', etc.
    feedback TEXT,
    rubric_scores JSONB, -- For rubric-based grading
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP, -- When grade was made visible to student
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(submission_id)
);

CREATE INDEX idx_grades_submission ON grades(submission_id);
CREATE INDEX idx_grades_grader ON grades(grader_id);
```

#### 11. **Announcements Table**
```sql
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    expires_at TIMESTAMP, -- Optional expiration
    attachments JSONB, -- Array of file references
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_announcements_course ON announcements(course_id);
CREATE INDEX idx_announcements_published ON announcements(is_published, published_at);
```

#### 12. **Announcement Views** (Track who has read)
```sql
CREATE TABLE announcement_views (
    announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (announcement_id, user_id)
);
```

#### 13. **Calendar Events**
```sql
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(50) NOT NULL, -- 'assignment', 'exam', 'lecture', 'deadline', 'custom'
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    location VARCHAR(255),
    is_all_day BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT, -- For recurring events (RRULE format)
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_events_course ON calendar_events(course_id);
CREATE INDEX idx_events_dates ON calendar_events(start_date, end_date);
```

#### 14. **Discussions/Forums**
```sql
CREATE TABLE discussion_forums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    is_pinned BOOLEAN DEFAULT FALSE,
    allow_anonymous BOOLEAN DEFAULT FALSE,
    require_moderation BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE discussion_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forum_id UUID REFERENCES discussion_forums(id) ON DELETE CASCADE,
    parent_post_id UUID REFERENCES discussion_posts(id) ON DELETE CASCADE, -- For replies
    author_id UUID REFERENCES users(id),
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_posts_forum ON discussion_posts(forum_id);
CREATE INDEX idx_posts_author ON discussion_posts(author_id);
CREATE INDEX idx_posts_parent ON discussion_posts(parent_post_id);
CREATE INDEX idx_posts_created ON discussion_posts(created_at);
```

#### 15. **Messages/Direct Messaging**
```sql
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL, -- Null for direct messages
    conversation_type VARCHAR(50) DEFAULT 'direct', -- 'direct', 'group', 'course'
    title VARCHAR(255), -- For group conversations
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    attachments JSONB,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);
```

#### 16. **Notifications Table**
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'assignment_due', 'grade_posted', 'announcement', 'message', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link_url TEXT, -- Deep link to relevant content
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    metadata JSONB, -- Additional context data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
```

#### 17. **File Storage Metadata**
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL, -- Name in storage
    file_path TEXT NOT NULL, -- S3 path or local path
    file_url TEXT NOT NULL, -- Public or signed URL
    mime_type VARCHAR(100),
    file_size_bytes BIGINT NOT NULL,
    uploader_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(50) DEFAULT 'private', -- 'public', 'course', 'private'
    expires_at TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_files_uploader ON files(uploader_id);
CREATE INDEX idx_files_course ON files(course_id);
```

#### 18. **Quizzes/Exams**
```sql
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points DECIMAL(10,2) NOT NULL,
    time_limit_minutes INTEGER, -- Null for untimed
    attempt_limit INTEGER DEFAULT 1,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_answers BOOLEAN DEFAULT FALSE,
    show_correct_answers BOOLEAN DEFAULT FALSE,
    show_correct_answers_after TIMESTAMP,
    allow_backtracking BOOLEAN DEFAULT TRUE,
    start_date TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'true_false', 'short_answer', 'essay'
    points DECIMAL(10,2) NOT NULL,
    order_index INTEGER NOT NULL,
    correct_answer TEXT, -- JSON for multiple choice
    options JSONB, -- For multiple choice options
    explanation TEXT, -- Shown after answering
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP,
    time_taken_seconds INTEGER,
    score DECIMAL(10,2),
    percentage DECIMAL(5,2),
    is_completed BOOLEAN DEFAULT FALSE,
    UNIQUE(quiz_id, user_id, attempt_number)
);

CREATE TABLE quiz_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES quiz_questions(id),
    user_answer TEXT,
    is_correct BOOLEAN,
    points_earned DECIMAL(10,2),
    graded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 19. **User Preferences**
```sql
CREATE TABLE user_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications JSONB DEFAULT '{"assignments": true, "grades": true, "announcements": true}',
    push_notifications JSONB DEFAULT '{"assignments": true, "messages": true}',
    ui_preferences JSONB DEFAULT '{"theme": "light", "language": "en"}',
    privacy_settings JSONB DEFAULT '{"show_email": false, "show_phone": false}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 20. **Analytics & Activity Logs**
```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type VARCHAR(100) NOT NULL, -- 'login', 'view_content', 'submit_assignment', etc.
    entity_type VARCHAR(50), -- 'course', 'assignment', 'content'
    entity_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_user ON activity_logs(user_id);
CREATE INDEX idx_logs_type ON activity_logs(activity_type);
CREATE INDEX idx_logs_created ON activity_logs(created_at);
```

---

## User Management System

### User Roles & Permissions

#### **Student**
- View enrolled courses
- Access course content
- Submit assignments
- Take quizzes/exams
- View own grades
- Participate in discussions
- Send/receive messages
- View calendar events

#### **Teaching Assistant (TA)**
- All student permissions +
- Grade assignments (if assigned)
- Moderate discussions
- View course analytics (limited)
- Send announcements (if permitted)

#### **Instructor**
- All TA permissions +
- Create/manage courses
- Create assignments/quizzes
- Grade all submissions
- Manage course content
- View all course analytics
- Manage enrollments
- Send announcements
- Export grade reports

#### **Administrator**
- All instructor permissions +
- Manage all users
- Manage institutions
- System configuration
- View system-wide analytics
- Manage roles & permissions
- Access audit logs

### User Lifecycle

1. **Registration/Invitation**
   - Email verification
   - Account activation
   - Profile setup

2. **Active Usage**
   - Login/authentication
   - Course enrollment
   - Content consumption
   - Assignment submission

3. **Account Management**
   - Profile updates
   - Password changes
   - Email updates
   - Notification preferences

4. **Account Deactivation**
   - Graduation/completion
   - Suspension
   - Deletion (GDPR compliance)

---

## Authentication & Authorization

### Authentication Flow

1. **Login Process**
   ```
   User → POST /api/auth/login
   {
     "email": "user@example.com",
     "password": "password123"
   }
   
   Response:
   {
     "token": "jwt_token_here",
     "refreshToken": "refresh_token_here",
     "user": { ... },
     "expiresIn": 3600
   }
   ```

2. **Token Management**
   - **Access Token**: Short-lived (15-60 minutes), contains user ID and role
   - **Refresh Token**: Long-lived (7-30 days), stored in httpOnly cookie
   - **Token Refresh**: Automatic refresh before expiration

3. **Multi-Factor Authentication (MFA)**
   - Optional 2FA via TOTP (Google Authenticator, Authy)
   - SMS-based verification
   - Email verification codes

### Authorization Middleware

**Role-Based Access Control (RBAC)**
- Check user role
- Verify permissions for resource
- Course-level permissions (enrollment check)
- Resource ownership checks

**Example Authorization Checks:**
- Can user view this course? (enrollment check)
- Can user edit this assignment? (instructor/TA check)
- Can user grade this submission? (permission check)

---

## API Design

### RESTful API Structure

**Base URL**: `https://api.conceptspro.com/v1`

### Authentication Endpoints

```
POST   /api/auth/register          - User registration
POST   /api/auth/login             - User login
POST   /api/auth/logout            - User logout
POST   /api/auth/refresh            - Refresh access token
POST   /api/auth/forgot-password    - Request password reset
POST   /api/auth/reset-password     - Reset password with token
POST   /api/auth/verify-email       - Verify email address
POST   /api/auth/resend-verification - Resend verification email
```

### User Endpoints

```
GET    /api/users/me               - Get current user profile
PUT    /api/users/me               - Update own profile
GET    /api/users/:id              - Get user by ID (limited info)
PUT    /api/users/:id              - Update user (admin only)
GET    /api/users                  - List users (admin only)
DELETE /api/users/:id              - Delete user (admin only)
GET    /api/users/me/preferences   - Get user preferences
PUT    /api/users/me/preferences   - Update preferences
```

### Course Endpoints

```
GET    /api/courses                - List courses (filtered by user)
POST   /api/courses               - Create course (instructor)
GET    /api/courses/:id           - Get course details
PUT    /api/courses/:id           - Update course (instructor)
DELETE /api/courses/:id           - Delete course (instructor)
GET    /api/courses/:id/students  - List enrolled students (instructor)
POST   /api/courses/:id/enroll    - Enroll in course
POST   /api/courses/:id/unenroll  - Drop course
GET    /api/courses/:id/analytics  - Course analytics (instructor)
```

### Module & Content Endpoints

```
GET    /api/courses/:id/modules              - List modules
POST   /api/courses/:id/modules              - Create module (instructor)
GET    /api/modules/:id                     - Get module details
PUT    /api/modules/:id                     - Update module
DELETE /api/modules/:id                     - Delete module
GET    /api/modules/:id/contents            - List module contents
POST   /api/modules/:id/contents            - Add content item
GET    /api/contents/:id                     - Get content item
PUT    /api/contents/:id                     - Update content
DELETE /api/contents/:id                    - Delete content
POST   /api/contents/:id/progress            - Update progress
GET    /api/contents/:id/progress           - Get progress
```

### Assignment Endpoints

```
GET    /api/courses/:id/assignments         - List assignments
POST   /api/courses/:id/assignments         - Create assignment (instructor)
GET    /api/assignments/:id                 - Get assignment details
PUT    /api/assignments/:id                 - Update assignment
DELETE /api/assignments/:id                 - Delete assignment
GET    /api/assignments/:id/submissions     - List submissions (instructor)
POST   /api/assignments/:id/submit          - Submit assignment (student)
GET    /api/submissions/:id                 - Get submission details
PUT    /api/submissions/:id                 - Update submission (draft)
DELETE /api/submissions/:id                 - Delete submission
GET    /api/submissions/:id/files           - Download submission files
```

### Grade Endpoints

```
POST   /api/submissions/:id/grade           - Grade submission (instructor)
PUT    /api/grades/:id                      - Update grade
GET    /api/grades/:id                      - Get grade details
POST   /api/grades/:id/release              - Release grade to student
GET    /api/courses/:id/grades              - Get all grades for course (instructor)
GET    /api/users/me/grades                 - Get own grades (student)
```

### Announcement Endpoints

```
GET    /api/courses/:id/announcements       - List announcements
POST   /api/courses/:id/announcements       - Create announcement (instructor)
GET    /api/announcements/:id               - Get announcement
PUT    /api/announcements/:id               - Update announcement
DELETE /api/announcements/:id               - Delete announcement
POST   /api/announcements/:id/mark-read     - Mark as read
```

### Quiz Endpoints

```
GET    /api/courses/:id/quizzes             - List quizzes
POST   /api/courses/:id/quizzes             - Create quiz (instructor)
GET    /api/quizzes/:id                     - Get quiz details
PUT    /api/quizzes/:id                     - Update quiz
DELETE /api/quizzes/:id                     - Delete quiz
POST   /api/quizzes/:id/attempt             - Start quiz attempt (student)
GET    /api/quizzes/:id/attempts            - List attempts (instructor)
POST   /api/quiz-attempts/:id/submit         - Submit quiz attempt
GET    /api/quiz-attempts/:id               - Get attempt results
```

### File Upload Endpoints

```
POST   /api/files/upload                    - Upload file
GET    /api/files/:id                       - Get file metadata
GET    /api/files/:id/download              - Download file
DELETE /api/files/:id                       - Delete file
POST   /api/files/upload/bulk               - Bulk upload
```

### Notification Endpoints

```
GET    /api/notifications                   - List notifications
GET    /api/notifications/unread            - Get unread count
POST   /api/notifications/:id/mark-read    - Mark as read
POST   /api/notifications/mark-all-read     - Mark all as read
DELETE /api/notifications/:id               - Delete notification
```

### Calendar Endpoints

```
GET    /api/calendar/events                 - List calendar events
POST   /api/calendar/events                 - Create event
GET    /api/calendar/events/:id             - Get event
PUT    /api/calendar/events/:id             - Update event
DELETE /api/calendar/events/:id             - Delete event
GET    /api/calendar/upcoming               - Get upcoming events
```

### Discussion Endpoints

```
GET    /api/courses/:id/discussions         - List discussion forums
POST   /api/courses/:id/discussions         - Create forum
GET    /api/discussions/:id/posts           - List posts
POST   /api/discussions/:id/posts           - Create post
GET    /api/posts/:id                       - Get post
PUT    /api/posts/:id                       - Update post
DELETE /api/posts/:id                       - Delete post
POST   /api/posts/:id/vote                  - Vote on post
```

### Analytics Endpoints (Instructor/Admin)

```
GET    /api/analytics/courses/:id/overview   - Course overview stats
GET    /api/analytics/courses/:id/students  - Student performance
GET    /api/analytics/courses/:id/content   - Content engagement
GET    /api/analytics/courses/:id/assignments - Assignment stats
GET    /api/analytics/system/overview        - System-wide stats (admin)
```

---

## File Storage System

### Storage Strategy

1. **Cloud Storage (Recommended)**
   - AWS S3 / Google Cloud Storage / Azure Blob
   - Private buckets with signed URLs for access
   - CDN integration for faster delivery
   - Automatic backups and versioning

2. **File Organization**
   ```
   /institutions/{institution_id}/
     /courses/{course_id}/
       /assignments/{assignment_id}/
         /submissions/{submission_id}/
           {file_name}
       /content/{module_id}/
         {content_files}
       /announcements/{announcement_id}/
         {attachments}
     /users/{user_id}/
       /profile/
         {profile_image}
       /uploads/
         {user_files}
   ```

3. **File Upload Process**
   - Client uploads to pre-signed URL
   - Server validates file type and size
   - Virus scanning (optional but recommended)
   - Store metadata in database
   - Generate thumbnail for images/videos

4. **Access Control**
   - Private files: Signed URLs (expires in 1 hour)
   - Course files: Check enrollment before generating URL
   - Public files: Direct CDN URLs

5. **File Types Supported**
   - Documents: PDF, DOC, DOCX, PPT, PPTX
   - Images: JPG, PNG, GIF, WebP
   - Videos: MP4, WebM (with transcoding)
   - Archives: ZIP, RAR
   - Code: Various text files

6. **Video Streaming**
   - Use video hosting service (Vimeo, AWS MediaConvert)
   - Or implement HLS (HTTP Live Streaming) for large files
   - Progressive download for smaller videos

---

## Real-time Features

### WebSocket Connection

**Use Cases:**
- Real-time notifications
- Live chat/messaging
- Collaborative editing (if needed)
- Live quiz monitoring (instructor dashboard)

**Implementation:**
- WebSocket server (Socket.io or native WebSocket)
- Separate from HTTP API
- Connection authentication via JWT
- Room-based messaging (course rooms, user rooms)

**Message Types:**
```json
{
  "type": "notification",
  "payload": {
    "notificationId": "uuid",
    "title": "New grade posted",
    "message": "..."
  }
}

{
  "type": "message",
  "payload": {
    "conversationId": "uuid",
    "senderId": "uuid",
    "content": "Hello!"
  }
}
```

### Push Notifications

- Browser push notifications (service workers)
- Mobile push notifications (FCM/APNS)
- Email notifications (as fallback)

---

## Background Jobs & Workers

### Job Types

1. **Email Jobs**
   - Welcome emails
   - Password reset emails
   - Assignment reminders
   - Grade notifications
   - Announcement notifications

2. **Scheduled Tasks**
   - Assignment deadline reminders (1 day before, 1 hour before)
   - Course enrollment notifications
   - Weekly digest emails
   - System maintenance notifications

3. **Data Processing**
   - Generate grade reports
   - Export course data
   - Process video uploads (transcoding)
   - Generate analytics reports
   - Backup operations

4. **Cleanup Jobs**
   - Delete expired tokens
   - Archive old courses
   - Clean up temporary files
   - Purge old activity logs

### Job Queue System

- **RabbitMQ** or **Redis Queue**
- **Celery** (Python) or **Bull** (Node.js)
- Retry failed jobs
- Priority queues for urgent tasks
- Scheduled job execution

---

## Security Considerations

### 1. **Authentication Security**
- Password hashing: bcrypt/argon2 (salt rounds: 12+)
- Rate limiting: Max 5 login attempts per 15 minutes
- Account lockout after failed attempts
- Session timeout after inactivity

### 2. **API Security**
- HTTPS only (TLS 1.3)
- CORS configuration
- Rate limiting per user/IP
- Request size limits
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize user input)

### 3. **Data Security**
- Encrypt sensitive data at rest
- Encrypt database backups
- PII (Personally Identifiable Information) encryption
- GDPR compliance (right to deletion, data export)

### 4. **File Upload Security**
- Validate file types (whitelist)
- Scan for malware
- Limit file sizes
- Rename uploaded files (prevent path traversal)
- Store outside web root

### 5. **Authorization Security**
- Principle of least privilege
- Verify ownership before operations
- Audit sensitive actions
- Log all authentication events

### 6. **Network Security**
- Firewall rules
- DDoS protection (Cloudflare)
- IP whitelisting for admin endpoints (optional)

---

## Performance & Scalability

### Database Optimization

1. **Indexing Strategy**
   - Index frequently queried columns
   - Composite indexes for multi-column queries
   - Partial indexes for filtered queries

2. **Query Optimization**
   - Use eager loading to prevent N+1 queries
   - Paginate large result sets
   - Cache frequently accessed data

3. **Database Scaling**
   - Read replicas for read-heavy operations
   - Connection pooling
   - Partition large tables by date/institution

### Caching Strategy

1. **Redis Cache**
   - User sessions
   - Frequently accessed courses
   - Course enrollment lists
   - API response caching (with invalidation)

2. **Cache Invalidation**
   - Clear cache on data updates
   - TTL-based expiration
   - Cache warming for critical paths

### API Optimization

1. **Response Compression**
   - Gzip/Brotli compression
   - JSON response minification

2. **Pagination**
   - Limit results per page (20-50 items)
   - Cursor-based pagination for large datasets

3. **Field Selection**
   - Allow clients to request specific fields
   - GraphQL or query parameters

### CDN & Static Assets

- Serve static assets via CDN
- Cache API responses where appropriate
- Image optimization and lazy loading

### Horizontal Scaling

- Stateless API servers (can scale horizontally)
- Load balancer distribution
- Database clustering/replication

---

## Monitoring & Analytics

### Application Monitoring

1. **Error Tracking**
   - Sentry or similar service
   - Log aggregation (ELK stack)
   - Alert on critical errors

2. **Performance Monitoring**
   - APM tools (New Relic, Datadog)
   - Track response times
   - Database query performance
   - API endpoint metrics

3. **Uptime Monitoring**
   - Health check endpoints
   - Automated uptime monitoring
   - Alert on downtime

### User Analytics

1. **Behavior Tracking**
   - Content engagement metrics
   - Time spent on platform
   - Feature usage statistics
   - Drop-off points

2. **Academic Analytics**
   - Course completion rates
   - Assignment submission rates
   - Average grades
   - Student progress tracking

3. **Business Metrics**
   - Active users (DAU/MAU)
   - User retention
   - Course enrollment trends
   - System usage patterns

### Logging

- Structured logging (JSON format)
- Log levels: DEBUG, INFO, WARN, ERROR
- Centralized log storage
- Retention policy (90 days recommended)

---

## Technology Stack Recommendations

### Backend Framework Options

#### Option 1: **Node.js/Express**
- **Pros**: Same language as frontend, large ecosystem, fast development
- **Cons**: Single-threaded, requires careful async handling
- **Best for**: Rapid prototyping, small to medium scale

#### Option 2: **Python/Django or FastAPI**
- **Pros**: Excellent for data processing, strong ORM, great libraries
- **Cons**: Slower than Node.js for I/O operations
- **Best for**: Heavy data processing, analytics, AI/ML integration

#### Option 3: **Go**
- **Pros**: Excellent performance, great concurrency, compiled
- **Cons**: Steeper learning curve, smaller ecosystem
- **Best for**: High performance requirements, microservices

#### Option 4: **Java/Spring Boot**
- **Pros**: Enterprise-grade, strong typing, extensive ecosystem
- **Cons**: More verbose, slower development
- **Best for**: Enterprise deployments, large teams

### Recommended Stack (Balanced Approach)

**Backend:**
- **Runtime**: Node.js (Express/Fastify) or Python (FastAPI)
- **Database**: PostgreSQL (primary), Redis (cache)
- **ORM/ODM**: Prisma (Node.js) or SQLAlchemy (Python)
- **Queue**: Bull (Node.js) or Celery (Python)
- **WebSocket**: Socket.io

**Infrastructure:**
- **Cloud Provider**: AWS / Google Cloud / Azure
- **Storage**: S3 / Cloud Storage / Blob Storage
- **CDN**: Cloudflare / AWS CloudFront
- **Database Hosting**: Managed PostgreSQL (RDS, Cloud SQL)
- **Container**: Docker + Kubernetes (for scaling)

**DevOps:**
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack or CloudWatch
- **Error Tracking**: Sentry

---

## Implementation Phases

### Phase 1: Core Infrastructure (Weeks 1-4)
- [ ] Database schema setup
- [ ] User authentication system
- [ ] Basic API structure
- [ ] File upload functionality
- [ ] Email service integration

### Phase 2: Course Management (Weeks 5-8)
- [ ] Course CRUD operations
- [ ] Enrollment system
- [ ] Module and content management
- [ ] Content progress tracking
- [ ] Basic permissions

### Phase 3: Assignments & Grading (Weeks 9-12)
- [ ] Assignment creation and management
- [ ] Submission system
- [ ] File handling for submissions
- [ ] Grading interface
- [ ] Grade book

### Phase 4: Communication (Weeks 13-14)
- [ ] Announcements system
- [ ] Discussion forums
- [ ] Direct messaging
- [ ] Notification system

### Phase 5: Enhanced Features (Weeks 15-18)
- [ ] Quiz/Exam system
- [ ] Calendar integration
- [ ] Real-time notifications (WebSocket)
- [ ] Analytics dashboard
- [ ] Search functionality

### Phase 6: Polish & Optimization (Weeks 19-22)
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Comprehensive testing
- [ ] Documentation
- [ ] Load testing

### Phase 7: Production Readiness (Weeks 23-24)
- [ ] Deployment setup
- [ ] Monitoring and alerting
- [ ] Backup and recovery
- [ ] User acceptance testing
- [ ] Launch preparation

---

## Key Decisions & Best Practices

### 1. **Multi-tenancy Approach**
- **Option A**: Separate databases per institution (highest isolation)
- **Option B**: Shared database with `institution_id` in all tables (easier management)
- **Recommendation**: Start with Option B, migrate to Option A if needed

### 2. **API Versioning**
- Use URL versioning: `/api/v1/`, `/api/v2/`
- Maintain backward compatibility when possible

### 3. **Data Migration Strategy**
- Version-controlled migrations
- Rollback procedures
- Test migrations on staging first

### 4. **Backup Strategy**
- Daily automated backups
- Point-in-time recovery
- Off-site backup storage
- Test restore procedures regularly

### 5. **GDPR Compliance**
- Right to access data
- Right to delete data
- Data export functionality
- Consent management
- Privacy policy and terms

---

## Additional Considerations

### Internationalization (i18n)
- Multi-language support
- Timezone handling
- Date/time formatting
- Currency formatting (if needed)

### Accessibility
- WCAG 2.1 compliance
- Screen reader support
- Keyboard navigation
- Color contrast requirements

### Mobile API Support
- Mobile app API endpoints (future)
- Responsive web design (already in frontend)
- Push notifications for mobile

---

## Conclusion

This architecture provides a comprehensive foundation for building a production-ready LMS backend. The system is designed to be:

- **Scalable**: Can handle growth in users and data
- **Secure**: Multiple layers of security
- **Maintainable**: Clear structure and documentation
- **Extensible**: Easy to add new features
- **Reliable**: Robust error handling and monitoring

Start with Phase 1 and iterate, ensuring each phase is fully tested before moving to the next.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: ConceptsPro Development Team

