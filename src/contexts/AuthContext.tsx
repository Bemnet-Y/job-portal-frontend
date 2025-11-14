import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types";
import { authAPI } from "../lib/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<any>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("🔄 AuthProvider useEffect running");
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      console.log("📦 Stored auth data:", {
        token: !!token,
        userData: !!userData,
      });

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          console.log("👤 Restoring user from storage:", parsedUser);

          // Verify the token is still valid by making a simple API call
          // For now, we'll just set the user and validate on first API call
          setUser(parsedUser);
        } catch (error) {
          console.error("❌ Error parsing stored user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("❌ Error initializing auth:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      console.log("🔐 AuthContext: Attempting login for", email);

      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      console.log("✅ AuthContext: Login successful", userData);

      if (!token) {
        throw new Error("No token received from server");
      }

      if (!userData) {
        throw new Error("No user data received from server");
      }

      // Check if user is active (for employers)
      if (userData.status !== "active") {
        throw new Error(
          `Your account is ${userData.status}. Please contact administrator.`
        );
      }

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("💾 AuthContext: Data stored in localStorage");

      // Update state
      setUser(userData);

      console.log("👤 AuthContext: User state updated", userData);
    } catch (error: any) {
      console.error("❌ AuthContext: Login failed", error);

      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    try {
      setError(null);
      setLoading(true);

      console.log("📝 AuthContext: Attempting registration for", data.email);

      const response = await authAPI.register(data);
      const { token, user: userData, message } = response.data;

      console.log("✅ AuthContext: Registration response", {
        token: !!token,
        user: userData,
        message,
      });

      // Only auto-login if user is active and token is provided
      if (token && userData && userData.status === "active") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        console.log("🔐 AuthContext: Auto-login completed for active user");
      } else {
        console.log("⏳ AuthContext: User is pending approval, no auto-login");
      }

      // Return the full response so the component can handle pending status
      return response.data;
    } catch (error: any) {
      console.error("❌ AuthContext: Registration failed", error);

      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("🚪 AuthContext: Logging out user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
    console.log("✅ AuthContext: User logged out and storage cleared");
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
