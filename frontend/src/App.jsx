import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Home from "./components/Home"
import Registration from './pages/Authentication/Registration'
import Login from "./pages/Authentication/Login"
import About from './pages/About'
import Contact from './pages/Contact'
import AdminBlog from './pages/Dashboard/AdminBlog'
import CreateBlog from './pages/Dashboard/CreateBlog'



function App() {

  const location = useLocation()
  const hideNavbarAndFooter = ["/login", "/registration"].includes(location.pathname); 

  return (
    <div>
      {!hideNavbarAndFooter && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/adminblog" element={<AdminBlog />} />
        <Route path="/createblog" element={<CreateBlog />} />

      </Routes>
      {!hideNavbarAndFooter && <Footer />}
    </div>
  )
}

export default App
