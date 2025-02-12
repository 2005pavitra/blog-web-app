import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [blogs, setBlogs] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem("token"); 
  
        const response = await fetch("http://localhost:4000/api/blogs/allblogs", {
          method: "GET",
          // headers: {
          //   "Authorization": `Bearer ${token}`, 
          //   "Content-Type": "application/json",
          // },
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
    setUser(userData);
    console.log("Token stored:", localStorage.getItem("token")); // Debugging
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    console.log("User logged out, token removed");
  };

  return (
    <AuthContext.Provider value={{ blogs, loading, error, login, logout }}>
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
