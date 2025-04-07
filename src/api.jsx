import axios from "axios";

const API = axios.create({
  baseURL: "https://3bd9-35-243-232-200.ngrok-free.app", // Replace with your backend URL
});

export default API;