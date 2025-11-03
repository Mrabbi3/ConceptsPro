# Database Schema Quick Reference

This document provides a visual overview of the database schema and key relationships.

## Entity Relationship Overview

```
┌─────────────┐
│   Users     │
│─────────────│
│ - id (PK)   │
│ - email     │
│ - role      │
│ - ...       │
└──────┬──────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       ▼                                 ▼
┌──────────────┐              ┌──────────────────┐
│   Courses    │              │Course Enrollments │
│──────────────│              │──────────────────│
│ - id (PK)    │◄─────────────│ - id (PK)        │
│ - code       │              │ - course_id (FK)  │
│ - title      │              │ - user_id (FK)    │
│ - instructor_│              │ - status          │
│   id (FK)    │              │ - grade           │
└──────┬───────┘              └──────────────────┘
       │
       ├─────────────────┐
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│   Modules    │  │ Assignments  │
│──────────────│  │──────────────│
│ - id (PK)    │  │ - id (PK)    │
│ - course_id  │  │ - course_id  │
│   (FK)       │  │   (FK)       │
│ - title      │  │ - title      │
│ - order      │  │ - points     │
└──────┬───────┘  │ - due_date   │
       │          └──────┬────────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│Module Contents│  │  Submissions     │
│──────────────│  │──────────────────│
│ - id (PK)    │  │ - id (PK)        │
│ - module_id  │  │ - assignment_id  │
│   (FK)       │  │   (FK)           │
│ - type       │  │ - user_id (FK)   │
│ - url        │  │ - files          │
└──────┬───────┘  │ - submission_date│
       │          └──────┬────────────┘
       │                 │
       ▼                 ▼
┌──────────────────┐  ┌──────────────┐
│Content Progress  │  │    Grades    │
│──────────────────│  │──────────────│
│ - user_id (FK)   │  │ - id (PK)    │
│ - content_id(FK) │  │ - submission_│
│ - completed      │  │   id (FK)    │
│ - time_spent     │  │ - points     │
└──────────────────┘  │ - feedback    │
                     └──────────────┘
```

## Core Tables Summary

### 1. User Management

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts | id, email, password_hash, role |
| `user_institutions` | Multi-tenant support | user_id, institution_id |
| `user_preferences` | User settings | user_id, email_notifications, ui_preferences |

### 2. Course Structure

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `institutions` | School/university info | id, name, domain |
| `courses` | Course information | id, code, title, instructor_id, term |
| `course_enrollments` | Student enrollment | course_id, user_id, status, grade |
| `modules` | Course sections | id, course_id, title, order_index |
| `module_contents` | Content items | id, module_id, type, url |

### 3. Assessment & Grading

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `assignments` | Assignment details | id, course_id, title, points, due_date |
| `assignment_submissions` | Student submissions | id, assignment_id, user_id, files |
| `submission_files` | Uploaded files | id, submission_id, file_url |
| `grades` | Grade information | id, submission_id, points_earned, feedback |
| `quizzes` | Quiz/exam details | id, course_id, time_limit, attempt_limit |
| `quiz_attempts` | Quiz submissions | id, quiz_id, user_id, score |

### 4. Communication

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `announcements` | Course announcements | id, course_id, title, content, author_id |
| `announcement_views` | Read tracking | announcement_id, user_id, viewed_at |
| `discussion_forums` | Discussion boards | id, course_id, title |
| `discussion_posts` | Forum posts | id, forum_id, author_id, content |
| `conversations` | Direct messages | id, course_id, type |
| `messages` | Message content | id, conversation_id, sender_id, content |

### 5. Calendar & Events

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `calendar_events` | Calendar items | id, course_id, title, start_date, end_date |

### 6. Progress & Analytics

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `content_progress` | Learning progress | user_id, content_id, completion_percentage |
| `activity_logs` | User activity | id, user_id, activity_type, created_at |
| `notifications` | User notifications | id, user_id, type, message, is_read |

### 7. File Management

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `files` | File metadata | id, file_url, file_size, uploader_id |

## Key Relationships

### User → Course Enrollment
```
User (1) ──< (many) CourseEnrollment (many) >── (1) Course
```

### Course → Content Hierarchy
```
Course (1) ──< (many) Module (1) ──< (many) ModuleContent
```

### Assignment → Submission → Grade
```
Assignment (1) ──< (many) Submission (1) ──< (1) Grade
```

### Course → Announcements
```
Course (1) ──< (many) Announcement (many) >── (many) AnnouncementView
```

## Common Query Patterns

### Get Student's Enrolled Courses
```sql
SELECT c.*, ce.enrollment_status
FROM courses c
JOIN course_enrollments ce ON c.id = ce.course_id
WHERE ce.user_id = $1 AND ce.enrollment_status = 'enrolled';
```

### Get Course Content with Progress
```sql
SELECT mc.*, cp.completion_percentage, cp.is_completed
FROM module_contents mc
JOIN modules m ON mc.module_id = m.id
LEFT JOIN content_progress cp ON mc.id = cp.content_id AND cp.user_id = $1
WHERE m.course_id = $2
ORDER BY m.order_index, mc.order_index;
```

### Get Assignment Submissions with Grades
```sql
SELECT 
  a.title as assignment_title,
  a.points as max_points,
  s.submission_date,
  g.points_earned,
  g.feedback
FROM assignments a
LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.user_id = $1
LEFT JOIN grades g ON s.id = g.submission_id
WHERE a.course_id = $2;
```

### Get Unread Notifications Count
```sql
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = $1 AND is_read = FALSE;
```

## Indexes Strategy

### Critical Indexes
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Course queries
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_institution ON courses(institution_id);
CREATE INDEX idx_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);

-- Assignment queries
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_user ON assignment_submissions(user_id);

-- Content progress
CREATE INDEX idx_progress_user ON content_progress(user_id);
CREATE INDEX idx_progress_content ON content_progress(content_id);

-- Notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read);

-- Messages
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at);
```

## Data Integrity Constraints

### Foreign Keys
- All foreign keys have `ON DELETE CASCADE` or `ON DELETE SET NULL` as appropriate
- Ensures data consistency when parent records are deleted

### Unique Constraints
- `users.email` - Unique email addresses
- `(course_id, user_id)` - One enrollment per student per course
- `(user_id, content_id)` - One progress record per user per content
- `(assignment_id, user_id, submission_number)` - Unique submissions

### Check Constraints
- `users.role IN ('student', 'instructor', 'admin', 'ta')`
- `course_enrollments.enrollment_status IN ('enrolled', 'dropped', 'withdrawn', 'completed')`
- `content_progress.completion_percentage BETWEEN 0 AND 100`

## Backup & Recovery Strategy

### Daily Backups
- Full database backup at 2 AM UTC
- Incremental backups every 6 hours
- Retain backups for 30 days

### Point-in-Time Recovery
- Transaction logs enable recovery to any point in time
- Test restore procedures monthly

### Data Retention
- Active courses: Keep indefinitely
- Archived courses: 7 years (legal requirement)
- Activity logs: 90 days
- Deleted records: Soft delete with `deleted_at` timestamp

## Migration Strategy

### Version Control
- All schema changes via migration files
- Migration files numbered sequentially: `001_create_users.sql`
- Rollback scripts included

### Example Migration
```sql
-- Migration: 001_create_users.sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  -- ... other fields
);

-- Rollback
DROP TABLE IF EXISTS users;
```

---

## Quick Reference: Common Operations

### Add a Student to a Course
```sql
INSERT INTO course_enrollments (course_id, user_id, enrollment_status)
VALUES ($1, $2, 'enrolled');
```

### Mark Content as Completed
```sql
INSERT INTO content_progress (user_id, content_id, is_completed, completion_percentage)
VALUES ($1, $2, TRUE, 100)
ON CONFLICT (user_id, content_id) 
UPDATE SET is_completed = TRUE, completion_percentage = 100;
```

### Get Student Grade for Course
```sql
SELECT 
  SUM(g.points_earned) as total_earned,
  SUM(a.points) as total_possible,
  (SUM(g.points_earned) / SUM(a.points) * 100) as percentage
FROM assignments a
LEFT JOIN assignment_submissions s ON a.id = s.assignment_id AND s.user_id = $1
LEFT JOIN grades g ON s.id = g.submission_id
WHERE a.course_id = $2;
```

### Create Notification
```sql
INSERT INTO notifications (user_id, notification_type, title, message, link_url)
VALUES ($1, $2, $3, $4, $5);
```

---

**This schema supports:**
- ✅ Multi-tenant architecture (institutions)
- ✅ Role-based access (students, instructors, admins, TAs)
- ✅ Course content hierarchy (modules → content)
- ✅ Assessment system (assignments, quizzes, grades)
- ✅ Communication (announcements, discussions, messaging)
- ✅ Progress tracking (content completion, time spent)
- ✅ File management (uploads, submissions)
- ✅ Analytics (activity logs, engagement metrics)

