
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5001',  // <-- explicit
  headers: {
    'Content-Type': 'application/json'
  }
});

export default API;