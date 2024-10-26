import axios from 'axios';
import router from '@/router';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  // Allow sending cookies/tokens
  withCredentials: true, 
  timeout: 900000,
});

// Interceptor to add the Authorization header to every request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {console.log(error)}
);

api.interceptors.response.use(
  (response) => response, // Return response for successful requests
  (error) => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('jwt');
    if (!error.response) {
      // Network error or request timeout (e.g., token expired)
      console.error('Network Error:', error.message);

      // If network error occurs (like expired token), redirect to login
      if (error.message.includes('Network Error')) {
        alert('Session expired. Please log in again.');
        router.push('/login')
      }
    } else {
      const { status, data } = error.response;

      // Handle other status codes
      if (status === 403 || status === 401) {
        alert(`Username or password incorrect`);  
        console.warn('Unauthorized. Redirecting to login...');
      } else {
        console.error(`Error ${status}: ${data.message || 'Unknown error'}`);
      }
    }
    // Forward the error if further handling is needed
    return Promise.reject(error);
  }
);

export default api;
