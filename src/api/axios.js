import axios from "axios";

// This is the ONLY place the API URL should be defined.
// It correctly reads the environment variable provided by Vite.
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // needed if using cookies
});

export default api;