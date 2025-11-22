import axios from "axios";

// ⚠️ HARDCODED FIX: We are forcing it to use Render.
const API_URL = "https://careerkarma.onrender.com";

const api = axios.create({
  baseURL: `${API_URL}/api`, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

// Helper for Login
export const setAuth = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};