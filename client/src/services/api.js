// services/api.js
// Single shared Axios instance. Every service file (authService,
// projectService, freelancerService, ...) imports THIS instead of
// calling axios directly, so the base URL and auth token handling
// only ever live in one place.

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attaches the JWT to every outgoing request
// automatically, so individual service functions never handle headers.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('workbridge_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: if the token is invalid/expired, the backend
// returns 401 - clear it locally. AuthContext's session-restore effect
// (and ProtectedRoute) pick up the now-logged-out state and redirect.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('workbridge_token');
    }
    return Promise.reject(error);
  }
);

export default api;
