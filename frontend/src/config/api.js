/**
 * API Configuration
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  PREFERENCES: 'preferences',
};

