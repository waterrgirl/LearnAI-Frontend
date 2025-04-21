import axios from 'axios';

const API = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include the user ID in requests
API.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.uid) {
          config.headers['X-User-ID'] = user.uid;
        }
      } catch (e) {
        console.error('Error parsing user data from localStorage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add authentication utility functions
export const logout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  const user = localStorage.getItem('user');
  return user !== null;
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error('Error retrieving current user', e);
    return null;
  }
};

export default API;