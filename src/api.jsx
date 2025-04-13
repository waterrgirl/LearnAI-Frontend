// src/api.jsx
import axios from 'axios';

const API = axios.create({
  baseURL: '',                // use relative URLs; Vite will proxy `/api/*` to your Flask backend
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;
