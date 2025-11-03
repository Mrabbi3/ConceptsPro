// Courses Data Structure for LMS
export const courses = [
  {
    id: 'cs101-data-communication',
    code: 'CS 101',
    title: 'Data Communication Fundamentals',
    instructor: {
      id: 'instructor1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu'
    },
    term: 'Fall 2024',
    enrolled: true,
    description: 'Master data communication through interactive visual frameworks. Learn encryption, encoding, modulation, and multiplexing.',
    modules: [
      {
        id: 'module1',
        title: 'Introduction to Data Communication',
        content: [
          {
            id: 'content1',
            type: 'video',
            title: 'Overview of Data Communication',
            duration: '15 min',
            url: '#'
          },
          {
            id: 'content2',
            type: 'document',
            title: 'Course Syllabus',
            url: '#'
          }
        ]
      },
      {
        id: 'module2',
        title: 'Encryption and Security',
        content: [
          {
            id: 'content3',
            type: 'interactive',
            title: 'Encryption/Decryption Framework',
            duration: '20 min',
            conceptId: 'encryption'
          },
          {
            id: 'content4',
            type: 'document',
            title: 'Encryption Reading Materials',
            url: '#'
          }
        ]
      },
      {
        id: 'module3',
        title: 'Encoding and Transmission',
        content: [
          {
            id: 'content5',
            type: 'interactive',
            title: 'Encoding/Decoding Framework',
            duration: '18 min',
            conceptId: 'encoding'
          }
        ]
      },
      {
        id: 'module4',
        title: 'Signal Processing',
        content: [
          {
            id: 'content6',
            type: 'interactive',
            title: 'Modulation/Demodulation Framework',
            duration: '22 min',
            conceptId: 'modulation'
          },
          {
            id: 'content7',
            type: 'interactive',
            title: 'Multiplexing/Demultiplexing Framework',
            duration: '25 min',
            conceptId: 'multiplexing'
          }
        ]
      }
    ],
    assignments: [
      {
        id: 'assignment1',
        title: 'Encryption Analysis Report',
        description: 'Write a 3-page report analyzing different encryption methods.',
        dueDate: '2024-12-15',
        points: 100,
        submitted: false,
        grade: null,
        submissionDate: null
      },
      {
        id: 'assignment2',
        title: 'Encoding Exercise',
        description: 'Complete the encoding exercises from Chapter 3.',
        dueDate: '2024-12-20',
        points: 50,
        submitted: true,
        grade: 85,
        submissionDate: '2024-12-18'
      },
      {
        id: 'assignment3',
        title: 'Final Project',
        description: 'Design and implement a secure communication protocol.',
        dueDate: '2025-01-10',
        points: 200,
        submitted: false,
        grade: null,
        submissionDate: null
      }
    ],
    announcements: [
      {
        id: 'announcement1',
        title: 'Welcome to CS 101!',
        content: 'Welcome to Data Communication Fundamentals. Please review the syllabus and complete the first module by the end of the week.',
        date: '2024-09-01',
        author: 'Dr. Sarah Johnson'
      },
      {
        id: 'announcement2',
        title: 'Assignment 1 Extension',
        content: 'Due to popular request, Assignment 1 deadline has been extended to December 15th.',
        date: '2024-12-10',
        author: 'Dr. Sarah Johnson'
      }
    ],
    events: [
      {
        id: 'event1',
        title: 'Midterm Exam',
        date: '2024-12-05',
        type: 'exam'
      },
      {
        id: 'event2',
        title: 'Assignment 1 Due',
        date: '2024-12-15',
        type: 'assignment'
      },
      {
        id: 'event3',
        title: 'Final Project Due',
        date: '2025-01-10',
        type: 'assignment'
      }
    ]
  },
  {
    id: 'cs201-networks',
    code: 'CS 201',
    title: 'Computer Networks',
    instructor: {
      id: 'instructor2',
      name: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu'
    },
    term: 'Fall 2024',
    enrolled: true,
    description: 'Explore network protocols, architectures, and communication systems.',
    modules: [
      {
        id: 'module1',
        title: 'Network Fundamentals',
        content: [
          {
            id: 'content1',
            type: 'video',
            title: 'Introduction to Networks',
            duration: '20 min',
            url: '#'
          }
        ]
      }
    ],
    assignments: [
      {
        id: 'assignment1',
        title: 'Network Topology Analysis',
        description: 'Analyze different network topologies and their use cases.',
        dueDate: '2024-12-18',
        points: 75,
        submitted: false,
        grade: null,
        submissionDate: null
      }
    ],
    announcements: [
      {
        id: 'announcement1',
        title: 'Course Introduction',
        content: 'Welcome to Computer Networks. Let\'s begin!',
        date: '2024-09-01',
        author: 'Prof. Michael Chen'
      }
    ],
    events: [
      {
        id: 'event1',
        title: 'Assignment 1 Due',
        date: '2024-12-18',
        type: 'assignment'
      }
    ]
  },
  {
    id: 'math301-calculus',
    code: 'MATH 301',
    title: 'Advanced Calculus',
    instructor: {
      id: 'instructor3',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@university.edu'
    },
    term: 'Fall 2024',
    enrolled: false,
    description: 'Advanced topics in calculus and mathematical analysis.',
    modules: [],
    assignments: [],
    announcements: [],
    events: []
  }
];

export const defaultUser = {
  id: 'student1',
  name: 'John Student',
  email: 'john.student@university.edu',
  role: 'student', // 'student' or 'instructor'
  enrolledCourses: ['cs101-data-communication', 'cs201-networks']
};

export const instructors = [
  {
    id: 'instructor1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu'
  },
  {
    id: 'instructor2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@university.edu'
  },
  {
    id: 'instructor3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@university.edu'
  }
];

