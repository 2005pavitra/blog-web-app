import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
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
import {useAuth} from "./context/AuthProvider"
import BlogDetails from "./pages/Blog/BlogDetails";



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
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createblog" element={<CreateBlog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </div>
  )
}

export default App
