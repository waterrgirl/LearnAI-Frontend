// src/api.jsx
import axios from 'axios';

const API = axios.create({
  baseURL: '',                // relative → Vite will proxy /api
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;
