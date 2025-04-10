import axios from 'axios';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true, 
  timeout: 60000, // More reasonable timeout (1 minute)
});

// Interceptor to add the Authorization header to every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      // Let the browser set the correct Content-Type with boundary
      // Don't override it manually as it can cause problems
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    console.error("Request preparation error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error handling
      console.error('Network Error:', error.message);
      return Promise.reject(error);
    }

    const { status, config } = error.response;
    
    // Don't redirect on 404 errors for image URLs
    if (status === 404 && config.url.includes('/image')) {
      // Just reject the promise without redirecting
      return Promise.reject(error);
    }
    
    // Handle different error statuses appropriately
    switch (status) {
      case 401: // Unauthorized - not authenticated
        console.warn('Authentication required. Redirecting to login...');
        // Only clear credentials for authentication failures
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('jwt');
        router.push('/login');
        break;
        
      case 403: // Forbidden - not authorized
        console.error('Permission denied. You do not have access to this resource.');
        // Don't clear credentials - user is authenticated but lacks permissions
        
        // Check if this is an admin route
        if (window.location.pathname.includes('/admin')) {
          alert('You do not have administrator privileges required for this action.');
          // Optionally redirect to a permissions error page instead of 404
          // router.push('/permission-denied');
        }
        break;
        
      case 404: // Not found
        console.error('Resource not found');
        router.push('/404');
        break;
        
      default:
        console.error(`Error ${status}: ${config?.message || 'Unknown error'}`);
    }
    
    return Promise.reject(error);
  }
);

export default api;