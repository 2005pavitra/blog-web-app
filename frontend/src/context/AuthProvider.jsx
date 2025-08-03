import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token"); 
  
        const response = await fetch("https://blog-web-app-rwce.onrender.com/api/blogs/allblogs", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Blogs fetched:", data);
  
        setBlogs(data.allBlogs); 
      } catch (err) {
        console.error("Error fetching blogs:", err.message);
        setError("Failed to load blogs.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlogs(); 
  }, []);
  

  const login = (userData, token) => {
    console.log("Login function called: ", userData, token);

    if (!token) {
      console.error("No token received during login");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    console.log("Token stored:", localStorage.getItem("token")); // Debugging
    console.log("User stored:", userData); // Debugging
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("User logged out, token removed");
  };

  return (
    <AuthContext.Provider value={{ blogs, loading, error, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// import React, { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [blogs, setBlogs] = useState();

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       const token = localStorage.getItem("token");
//       console.log("Local storage token: ", token)
//       if (!token) {
//         console.warn("No token found, user might be logged out.");
//         return;
//       }

//       try {
//         const response = await axios.get("http://localhost:4000/api/blogs/allblogs", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         });
//         console.log("Blogs fetched:", response.data);
//         setBlogs(response.data);
//       } catch (err) {
//         console.error("Error fetching blogs:", err.response ? err.response.data : err.message);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ blogs }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
