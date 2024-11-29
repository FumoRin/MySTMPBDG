// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import { User } from "./userTypes";

// Define AuthContext type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

// AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Try to retrieve user from localStorage
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check if token exists in localStorage
    return !!localStorage.getItem("token");
  });

  // Login method
  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsAuthenticated(true);

    // Store user and token in localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Logout method
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);

    // Remove user and token from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Provide context values
  const contextValue = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Throw an error if used outside of AuthProvider
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
