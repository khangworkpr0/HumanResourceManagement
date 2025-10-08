import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  // Trên Vercel: dùng '/api' (relative path - cùng domain)
  // Local dev: dùng REACT_APP_API_URL từ .env hoặc fallback
  baseURL: process.env.REACT_APP_API_URL || 
           (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'),
  timeout: 30000, // Tăng timeout cho serverless cold start
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

