import axios from 'axios';
import type { ApiResponse } from '@/types';

// All API calls go to /api/* which is proxied to Express in dev
// and served by Vercel serverless in production
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // essential for session cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Unwrap the ApiResponse wrapper so callers get data directly
api.interceptors.response.use(
  (response) => {
    const body = response.data as ApiResponse;
    if (body && typeof body.success === 'boolean') {
      response.data = body.data;
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message ?? error.message ?? 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
