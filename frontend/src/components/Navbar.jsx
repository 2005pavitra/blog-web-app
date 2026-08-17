import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthProvider'
import { useTheme } from '../context/ThemeProvider'

function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { name: 'All Blogs', path: '/allblogs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.nav 
      className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
        isDark 
          ? 'bg-slate-800/80 border-slate-700' 
          : 'bg-white/80 border-slate-200'
      } backdrop-blur-lg`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link to="/" className={`flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <motion.div 
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                  isDark ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-amber-400 to-orange-500'
                }`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                B
              </motion.div>
              BlogSpace
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <motion.div 
            className="hidden md:flex md:items-center md:space-x-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={itemVariants}>
                <Link
                  to={link.path}
                  className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors relative group ${
                    location.pathname === link.path 
                      ? isDark ? 'text-amber-400' : 'text-amber-600' 
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                  <motion.span 
                    className={`absolute bottom-0 left-0 w-0 h-0.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-500'} group-hover:w-full`}
                    layoutId={`underline-${link.name}`}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
            
            <motion.div 
              className={`flex items-center space-x-4 border-l transition-colors ${isDark ? 'border-slate-700' : 'border-slate-200'} pl-4 ml-4`}
              variants={itemVariants}
            >
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-slate-700 hover:bg-slate-600 text-amber-400' 
                    : 'bg-slate-100 hover:bg-slate-200 text-amber-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isDark ? 'Light mode' : 'Dark mode'}
              >
                {isDark ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm11.314 0a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM4 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm12 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-1.22 5.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm-11.314 0a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>

              {user ? (
                <>
                  {user.role === 'admin' && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link 
                        to="/createblog" 
                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${
                          isDark 
                            ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                            : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                      >
                        Create Blog
                      </Link>
                    </motion.div>
                  )}
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                        isDark ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </motion.div>
                    <motion.button
                      onClick={handleLogout}
                      className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Logout
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Log in
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link 
                      to="/registration" 
                      className={`text-sm font-medium px-5 py-2 rounded-lg transition-all text-white ${
                        isDark 
                          ? 'bg-slate-700 hover:bg-slate-600' 
                          : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Mobile menu button */}
          <motion.div 
            className="flex items-center gap-3 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-slate-700 hover:bg-slate-600 text-amber-400' 
                  : 'bg-slate-100 hover:bg-slate-200 text-amber-600'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM4.22 4.22a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm11.314 0a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM4 10a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm12 0a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-1.22 5.78a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zm-11.314 0a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM10 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </motion.button>

            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-700' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={`md:hidden border-t overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className={`px-2 pt-2 pb-3 space-y-1`}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      location.pathname === link.path 
                        ? isDark ? 'text-amber-400 bg-slate-700' : 'text-amber-600 bg-slate-100' 
                        : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className={`pt-4 pb-3 border-t ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
              {user ? (
                <div className="px-5">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white ${
                      isDark ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'
                    }`}>
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="ml-3">
                      <div className={`text-base font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</div>
                      <div className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{user.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    {user.role === 'admin' && (
                      <Link
                        to="/createblog"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                          isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        Create Blog
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                        isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-5 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-center px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                      isDark 
                        ? 'text-slate-300 border border-slate-600 hover:text-white hover:bg-slate-700' 
                        : 'text-slate-700 border border-slate-300 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/registration"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-center px-4 py-2 rounded-lg text-base font-medium text-white transition-colors ${
                      isDark 
                        ? 'bg-slate-700 hover:bg-slate-600' 
                        : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar