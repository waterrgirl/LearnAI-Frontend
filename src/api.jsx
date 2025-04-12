import axios from "axios";

const API = axios.create({
  // default to localhost on port 5001.
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
});

export default API;
