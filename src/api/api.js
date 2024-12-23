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
    
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {console.log(error)}
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
            sessionStorage.removeItem('user');
        sessionStorage.removeItem('jwt');
    if (!error.response) {
      // Network error or request timeout (e.g., token expired)
      console.error('Network Error:', error.message);

      // If network error occurs (like expired token), redirect to login
      if (error.message.includes('Network Error')) {
        alert(error.message);
        router.push('/404');
      }
    } else {
      const { status, data } = error.response;
      if (status === 401) {
        alert(`Username or password incorrect`);  
        console.warn('Unauthorized. Redirecting to login...');
        router.push('/login')
      } else if (status === 403) {
        console.error(`Error ${status}: ${data.message || 'Unknown error'}`);
        router.push('/404');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
