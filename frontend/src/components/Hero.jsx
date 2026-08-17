import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthProvider'
import { useTheme } from '../context/ThemeProvider'

function Hero() {
  const { blogs } = useAuth()
  const { isDark } = useTheme()
  
  // Optional chaining in case blogs is null/undefined initially
  const blogCount = blogs?.length || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const shapeVariants = {
    animate: {
      scale: [1, 1.1, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  return (
    <div className={`relative overflow-hidden transition-colors duration-300 border-b ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-16 sm:pt-24 lg:pt-32 px-4 sm:px-6 lg:px-8">
          <main className="mx-auto max-w-7xl">
            <motion.div 
              className="sm:text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className={`text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl ${isDark ? 'text-white' : 'text-slate-900'}`}
                variants={itemVariants}
              >
                <motion.span 
                  className="block xl:inline"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Discover Stories
                </motion.span>{' '}
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  That Matter
                </motion.span>
              </motion.h1>

              <motion.p 
                className={`mt-3 text-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                variants={itemVariants}
              >
                Read and share insights on technology, career, and beyond. Join a growing community of thinkers and creators.
              </motion.p>
              
              {blogCount > 0 && (
                <motion.div 
                  className={`mt-4 flex items-center justify-center lg:justify-start gap-2 text-sm font-medium py-1.5 px-4 rounded-full w-fit transition-colors ${isDark ? 'text-slate-300 bg-slate-700' : 'text-slate-700 bg-slate-100'}`}
                  variants={itemVariants}
                >
                  <motion.span 
                    className="w-2 h-2 rounded-full bg-amber-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  Explore {blogCount} published articles
                </motion.div>
              )}

              <motion.div 
                className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start gap-4"
                variants={itemVariants}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-md shadow"
                >
                  <Link
                    to="/allblogs"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-slate-900 hover:bg-slate-800 md:py-4 md:text-lg md:px-10 transition-colors shadow-md hover:shadow-lg"
                  >
                    Start Reading
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/registration"
                    className="w-full flex items-center justify-center px-8 py-3 border border-slate-300 text-base font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 md:py-4 md:text-lg md:px-10 transition-colors shadow-sm hover:shadow-md"
                  >
                    Become a Writer
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>

      <motion.div 
        className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-slate-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className={`w-full h-64 sm:h-72 md:h-96 lg:h-full relative overflow-hidden flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-amber-50 to-orange-50'}`}>
          {/* Abstract geometric shapes to represent a modern clean hero image */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-300/30 rounded-full blur-2xl"
            variants={shapeVariants}
            animate="animate"
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl"
            variants={shapeVariants}
            animate="animate"
            transition={{ delay: 0.5 }}
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
          >
            <svg className="w-32 h-32 text-amber-500/20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Hero