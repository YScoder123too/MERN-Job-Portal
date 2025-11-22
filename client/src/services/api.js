// import axios from "axios";

// export const createJob = (data) => api.post("/jobs", data);
// export const getAllJobs = () => api.get("/jobs");

// const api = axios.create({
//   baseURL: "http://localhost:5001/api",
//   headers: { "Content-Type": "application/json" },
// });

// export function setAuth(token) {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     localStorage.setItem("token", token);
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//     localStorage.removeItem("token");
//   }
// }

// // Optional logout helper
// export function logout() {
//   setAuth(null);
// }

// const savedToken = localStorage.getItem("token");
// if (savedToken) {
//   setAuth(savedToken);
// }

// export default api;
import axios from "axios";

// CRITICAL FIX: Use the Environment Variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: `${API_URL}/api`, // Ensure /api is appended if your backend routes start with it
  withCredentials: true,     // Important for cookies/sessions
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token automatically
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

// Helper function for setting auth (used in Login.jsx)
export const setAuth = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};