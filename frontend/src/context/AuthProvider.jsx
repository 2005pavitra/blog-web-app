import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, user might be logged out.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:4000/api/blogs/allblogs", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBlogs(response.data);
      } catch (err) {
        console.error("Error fetching blogs:", err.response ? err.response.data : err.message);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const login = (userData, token) => {
    if (!token) {
      console.error("No token received during login");
      return;
    }
    localStorage.setItem("token", token);
    setUser(userData);
    console.log("Token stored:", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    console.log("User logged out, token removed");
  };

  return (
    <AuthContext.Provider value={{ blogs, loading, error, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
