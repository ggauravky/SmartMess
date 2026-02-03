import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;

// API endpoints
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  adminLogin: (data) => api.post("/auth/admin/login", data),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

export const menuAPI = {
  getTodayMenu: () => api.get("/menu/today"),
  getWeeklyMenu: () => api.get("/menu/weekly"),
  getMenuById: (id) => api.get(`/menu/${id}`),
  getMealDetails: (menuId, mealType) => api.get(`/menu/${menuId}/${mealType}`),
  // Admin endpoints
  createMenu: (data) => api.post("/menu", data),
  updateMenu: (id, data) => api.put(`/menu/${id}`, data),
  deleteMenu: (id) => api.delete(`/menu/${id}`),
  getAllMenus: () => api.get("/menu/all"),
};

export const ratingAPI = {
  createRating: (data) => api.post("/ratings", data),
  getMyRatings: () => api.get("/ratings/my-ratings"),
  getRatingsByMenu: (menuId) => api.get(`/ratings/menu/${menuId}`),
  getAverageRating: (menuId, mealType) =>
    api.get(`/ratings/average/${menuId}/${mealType}`),
  updateRating: (id, data) => api.put(`/ratings/${id}`, data),
  deleteRating: (id) => api.delete(`/ratings/${id}`),
  // Admin endpoints
  getAllRatings: () => api.get("/ratings/all"),
  getRatingsStats: () => api.get("/ratings/stats"),
};

// Admin specific APIs
export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),
  getStudents: () => api.get("/admin/students"),
  getStudentById: (id) => api.get(`/admin/students/${id}`),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getReports: (params) => api.get("/admin/reports", { params }),
  exportRatings: (params) =>
    api.get("/admin/export/ratings", { params, responseType: "blob" }),
};
