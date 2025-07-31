import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-xl font-bold hover:text-gray-300 transition">
            Blog App
          </Link>
          <Link to="/allblogs" className="hover:text-gray-300 transition">
            All Blogs
          </Link>
          <Link to="/about" className="hover:text-gray-300 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-gray-300 transition">
            Contact
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-sm text-gray-300">
                Welcome, {user.name} ({user.role})
              </span>
              {user.role === 'admin' && (
                <Link 
                  to="/createblog" 
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition"
                >
                  Create Blog
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
              >
                Login
              </Link>
              <Link 
                to="/registration" 
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar