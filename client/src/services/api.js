import axios from "axios";

export const createJob = (data) => api.post("/jobs", data);
export const getAllJobs = () => api.get("/jobs");

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

export function setAuth(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

// Optional logout helper
export function logout() {
  setAuth(null);
}

const savedToken = localStorage.getItem("token");
if (savedToken) {
  setAuth(savedToken);
}

export default api;
