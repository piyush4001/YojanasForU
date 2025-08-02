// client/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check initial auth status

  useEffect(() => {
    // Check if the user is already logged in when the app loads
    const checkLoggedIn = async () => {
      try {
        // The cookie is sent automatically by the browser
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/profile`
        );
        setUser(data);
      } catch (error) {
        setUser(null);
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Login function updates the user state
  const login = (userData) => {
    setUser(userData);
  };

  // Logout function
  const logout = async () => {
    // Optional: You can call a backend endpoint to invalidate the cookie/session
    // await axios.post('/api/users/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily in other components
export const useAuth = () => {
  return useContext(AuthContext);
};
