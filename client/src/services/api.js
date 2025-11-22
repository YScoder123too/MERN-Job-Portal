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

// ⚠️ HARDCODED URL FIX: Replace this string with your exact Render Backend URL
// Make sure there is NO slash at the end!
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