import axios from 'axios';

const api = axios.create({
  // Using VITE_API_URL if defined, otherwise fallback to relative /api in production (if using Vercel rewrites) or localhost in dev.
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Bypasses ngrok's anti-abuse HTML page which causes CORS errors
  },
});

// Interceptor to add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

api.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    // If token is invalid or expired, clear it
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optional: redirect to login if not already there
    if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
});

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return '';
  // Check if it's already an absolute URL
  if (path.startsWith('http')) return path;
  
  const baseURL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000/api');
  const rootURL = baseURL.replace(/\/api$/, '');
  return `${rootURL}${path.startsWith('/') ? '' : '/'}${path}`;
};
