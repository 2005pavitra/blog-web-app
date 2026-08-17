import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Hero from './components/Hero';
import Home from './pages/Blog/Home';
import Registration from './pages/Authentication/Registration'
import Login from "./pages/Authentication/Login"
import About from './pages/About'
import Contact from './pages/Contact'
import AdminBlog from './pages/Dashboard/AdminBlog'
import CreateBlog from './pages/Dashboard/CreateBlog'
import EditBlog from './pages/Dashboard/EditBlog'
import {useAuth} from "./context/AuthProvider"
import { useTheme } from './context/ThemeProvider'
import BlogDetails from "./pages/Blog/BlogDetails";
import UserDashboard from './pages/Dashboard/UserDashboard';

function App() {
  const location = useLocation()
  const hideNavbarAndFooter = ["/login", "/registration"].includes(location.pathname); 
  const { isDark } = useTheme()
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      {!hideNavbarAndFooter && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/" element={<Navigate to="/allblogs" replace />} />
          <Route path="/allblogs" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/editblog/:id" element={<EditBlog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      {!hideNavbarAndFooter && <Footer />}
    </div>
  )
}

export default App
