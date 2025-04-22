import axios from 'axios';
import Cookies from 'js-cookie';

const URL = import.meta.env.VITE_API_URL;
const KEY = import.meta.env.VITE_API_KEY;

const api = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': KEY,
  },
});

// Request interceptor - adds token to all requests
api.interceptors.request.use(
  config => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handles token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        const fullId = Cookies.get('fullId');

        if (!refreshToken || !fullId) {
          throw new Error('Missing refresh token or user ID');
        }

        const response = await api.get(
          `/Users/${fullId}/Authentications?refreshToken=${refreshToken}`
        );

        const newAccessToken = response.data;

        Cookies.set('access_token', newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('fullId');

        // redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
