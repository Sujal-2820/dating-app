/**
 * Authentication Utilities
 * @owner: Sujal (Shared - Both review)
 * @purpose: Token management and authentication helpers
 */

const TOKEN_KEY = 'matchmint_auth_token';
const REFRESH_TOKEN_KEY = 'matchmint_refresh_token';
const USER_KEY = 'matchmint_user';

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Set auth token in localStorage
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Set refresh token in localStorage
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * Get user data from localStorage
 */
export const getUser = (): any | null => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set user data in localStorage
 */
export const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Clear all auth data and cached user data
 * CRITICAL: Preserves only language preference
 */
export const clearAuth = (): void => {
  // Save language preference
  const savedLanguage = localStorage.getItem('user_language');

  // Clear EVERYTHING
  localStorage.clear();

  // Restore language preference
  if (savedLanguage) {
    localStorage.setItem('user_language', savedLanguage);
  }
};

import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchUserProfile = async (): Promise<any> => {
  const token = getAuthToken();
  if (!token) throw new Error('No token found');

  const response = await axios.get(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.data.user;
};

