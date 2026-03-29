import axios from "axios";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
console.log("Socket URL:", SOCKET_URL);
// export const API_BASE_URL = "https://smarthoteloperation-backend-production.up.railway.app"
export const API_BASE_URL = SOCKET_URL;
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
