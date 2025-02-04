import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/blogs/allblogs");
        setBlogs(response.data);
        setLoading(false); // stop loading once data is fetched
      } catch (err) {
        setError("Failed to load blogs.");
        setLoading(false); // stop loading in case of error
      }
    };
    fetchBlogs();
  }, []);

  return (
    <AuthContext.Provider value={{ blogs, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = () => useContext(AuthContext);

