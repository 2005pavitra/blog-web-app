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
import BlogDetails from "./pages/Blog/BlogDetails";
import UserDashboard from './pages/Dashboard/UserDashboard';



function App() {

  const location = useLocation()
  const hideNavbarAndFooter = ["/login", "/registration"].includes(location.pathname); 

  const { loading} = useAuth();
  // console.log(blogs)

  if (loading) {
    return <div>Loading...</div>;
  }
  
  // if (error) {
    // return <div>{error}</div>;
  // }

  return (
    <div>
      {!hideNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/" element={<Navigate to="/registration" />}  replace/>
        <Route path="/allblogs" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createblog" element={<CreateBlog />} />
        <Route path="/editblog/:id" element={<EditBlog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </div>
  )
}

export default App
