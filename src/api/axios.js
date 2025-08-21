// src/api/axios.js
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://poll-app-backend.onrender.com/api"
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // needed if using cookies
});

export default api;
