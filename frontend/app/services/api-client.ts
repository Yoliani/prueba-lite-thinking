import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000", // Adjust this to match your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
