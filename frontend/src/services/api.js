import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const AUTH_STORAGE_KEY = "smartmess_auth";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Check if token is expired
const isTokenExpired = () => {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedAuth) return true;

    const authData = JSON.parse(storedAuth);
    if (!authData.expiresAt) return true;

    return new Date(authData.expiresAt) <= new Date();
  } catch {
    return true;
  }
};

// Clear auth data
const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Check if token is expired before making request
      if (isTokenExpired()) {
        clearAuth();
        return Promise.reject(new Error("Token expired"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      clearAuth();
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  logout: () => api.post("/auth/logout"),
};

// Menu API
export const menuAPI = {
  getTodayMenu: () => api.get("/menu/today"),
  getMenuByDate: (date) => api.get(`/menu/date/${date}`),
  getWeeklyMenu: () => api.get("/menu/weekly"),
  getAllMenus: () => api.get("/menu"),
  createMenu: (menuData) => api.post("/menu", menuData),
  updateMenu: (id, menuData) => api.put(`/menu/${id}`, menuData),
  deleteMenu: (id) => api.delete(`/menu/${id}`),
};

// Rating API
export const ratingAPI = {
  createRating: (ratingData) => api.post("/ratings", ratingData),
  getMyRatings: () => api.get("/ratings/my-ratings"),
  getRatingById: (id) => api.get(`/ratings/${id}`),
  updateRating: (id, ratingData) => api.put(`/ratings/${id}`, ratingData),
  deleteRating: (id) => api.delete(`/ratings/${id}`),
  getMealRatings: (menuId, mealType) =>
    api.get(`/ratings/meal/${menuId}/${mealType}`),
  getAverageRatings: () => api.get("/ratings/analytics/average"),
  getAllRatings: () => api.get("/ratings/all"),
};

// User API
export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  getAllUsers: () => api.get("/users"),
};

export default api;
