import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "smartmess_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if stored auth is still valid
  const isAuthValid = useCallback((authData) => {
    if (!authData || !authData.token || !authData.expiresAt) {
      return false;
    }
    const expiryDate = new Date(authData.expiresAt);
    return expiryDate > new Date();
  }, []);

  // Load auth from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedAuth) {
          const authData = JSON.parse(storedAuth);
          if (isAuthValid(authData)) {
            setUser(authData.user);
            setToken(authData.token);
          } else {
            // Clear expired auth
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error("Error loading auth:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, [isAuthValid]);

  // Save auth to localStorage
  const saveAuth = useCallback((authData) => {
    const dataToStore = {
      token: authData.token,
      expiresAt: authData.expiresAt,
      user: authData.user,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dataToStore));
    localStorage.setItem("token", authData.token); // For API interceptor
  }, []);

  // Login function
  const login = useCallback(
    async (email, password) => {
      const response = await authAPI.login({ email, password });

      if (response.data.success) {
        const authData = {
          token: response.data.token,
          expiresAt: response.data.expiresAt,
          user: response.data.user,
        };

        saveAuth(authData);
        setToken(authData.token);
        setUser(authData.user);
      }

      return response;
    },
    [saveAuth],
  );

  // Register function
  const register = useCallback(
    async (userData) => {
      const response = await authAPI.register(userData);

      if (response.data.success) {
        const authData = {
          token: response.data.token,
          expiresAt: response.data.expiresAt,
          user: response.data.user,
        };

        saveAuth(authData);
        setToken(authData.token);
        setUser(authData.user);
      }

      return response;
    },
    [saveAuth],
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
