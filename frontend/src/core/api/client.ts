/**
 * Axios API Client Configuration
 * @owner: Sujal (Shared - Both review)
 * @purpose: Configure Axios for frontend-backend communication
 */

import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../utils/auth';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Remove invalid token
      removeAuthToken();

      // Redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden - Account blocked or insufficient permissions
    if (error.response?.status === 403) {
      // Show error message
      console.error('Access forbidden:', error.response.data.message);
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

