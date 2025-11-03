/**
 * API Service - Handles all HTTP requests to the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token from localStorage
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Make an API request
 */
const request = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    const data = contentType?.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (email, password) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  getMe: () => request('/auth/me'),
  
  updateMe: (userData) => request('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
};

// Courses API
export const coursesAPI = {
  getAll: () => request('/courses'),
  
  getById: (id) => request(`/courses/${id}`),
  
  create: (courseData) => request('/courses', {
    method: 'POST',
    body: JSON.stringify(courseData),
  }),
  
  update: (id, courseData) => request(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(courseData),
  }),
  
  enroll: (id) => request(`/courses/${id}/enroll`, {
    method: 'POST',
  }),
  
  unenroll: (id) => request(`/courses/${id}/unenroll`, {
    method: 'POST',
  }),
  
  getStudents: (id) => request(`/courses/${id}/students`),
};

// Assignments API
export const assignmentsAPI = {
  getByCourse: (courseId) => request(`/courses/${courseId}/assignments`),
  
  getById: (id) => request(`/assignments/${id}`),
  
  create: (courseId, assignmentData) => request(`/courses/${courseId}/assignments`, {
    method: 'POST',
    body: JSON.stringify(assignmentData),
  }),
  
  update: (id, assignmentData) => request(`/assignments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(assignmentData),
  }),
  
  submit: (id, submissionData) => request(`/assignments/${id}/submit`, {
    method: 'POST',
    body: JSON.stringify(submissionData),
  }),
  
  getSubmissions: (id) => request(`/assignments/${id}/submissions`),
};

// Grades API
export const gradesAPI = {
  getMyGrades: () => request('/grades/me'),
  
  getCourseGrades: (courseId) => request(`/courses/${courseId}/grades`),
  
  gradeSubmission: (submissionId, gradeData) => request(`/submissions/${submissionId}/grade`, {
    method: 'POST',
    body: JSON.stringify(gradeData),
  }),
  
  releaseGrade: (submissionId) => request(`/submissions/${submissionId}/release`, {
    method: 'POST',
  }),
};

// Announcements API
export const announcementsAPI = {
  getByCourse: (courseId) => request(`/courses/${courseId}/announcements`),
  
  create: (courseId, announcementData) => request(`/courses/${courseId}/announcements`, {
    method: 'POST',
    body: JSON.stringify(announcementData),
  }),
  
  update: (id, announcementData) => request(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(announcementData),
  }),
  
  delete: (id) => request(`/announcements/${id}`, {
    method: 'DELETE',
  }),
};

// Notifications API
export const notificationsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/notifications${queryString ? `?${queryString}` : ''}`);
  },
  
  getUnreadCount: () => request('/notifications/unread/count'),
  
  markAsRead: (id) => request(`/notifications/${id}/read`, {
    method: 'POST',
  }),
  
  markAllAsRead: () => request('/notifications/read/all', {
    method: 'POST',
  }),
  
  delete: (id) => request(`/notifications/${id}`, {
    method: 'DELETE',
  }),
};

// Files API
export const filesAPI = {
  upload: (file, folder = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getToken();
    
    return fetch(`${API_BASE_URL}/files/upload/${folder}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('File upload failed:', error);
        throw error;
      });
  },
  
  uploadMultiple: (files, folder = 'general') => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    const token = getToken();
    
    return fetch(`${API_BASE_URL}/files/upload/multiple/${folder}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('File upload failed:', error);
        throw error;
      });
  },
  
  getFileUrl: (folder, filename) => `${API_BASE_URL}/files/${folder}/${filename}`,
};

export default {
  auth: authAPI,
  courses: coursesAPI,
  assignments: assignmentsAPI,
  grades: gradesAPI,
  announcements: announcementsAPI,
  notifications: notificationsAPI,
  files: filesAPI,
};

