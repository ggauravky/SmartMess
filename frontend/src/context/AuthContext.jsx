import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", user.role || "student");
    setUser(user);
    setIsAuthenticated(true);
    return response.data;
  };

  const adminLogin = async (email, password) => {
    const response = await api.post("/auth/admin/login", { email, password });
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", "admin");
    setUser({ ...user, role: "admin" });
    setIsAuthenticated(true);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post("/auth/register", userData);
    const { token, user } = response.data;
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", "student");
    setUser(user);
    setIsAuthenticated(true);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const isAdmin =
    user?.role === "admin" || localStorage.getItem("userRole") === "admin";

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    adminLogin,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
