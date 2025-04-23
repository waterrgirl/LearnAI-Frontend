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

export const get = async (url) => {
  // Get the user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData.uid || '';
  const token = userData.token || '';
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
    }
  };
  
  // Add Authorization header if token exists
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await axios.get(`${API_BASE_URL}${url}`, config);
  return response;
};
export default API;