import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { useTheme } from "../../context/ThemeProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function Home() {
  const { blogs, loading, error, user } = useAuth();
  const { isDark } = useTheme();
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter blogs based on search term and category
  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(blogs?.map(blog => blog.category) || [])];

  const handleDelete = async (blogId, blogTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
      return;
    }

    setDeletingBlog(blogId);
    setDeleteMessage("");

    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/blogs/delete/${blogId}`, {
        withCredentials: true
      });

      setDeleteMessage("Blog deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting blog:", error);
      setDeleteMessage(error.response?.data?.error || "Error deleting blog");
    } finally {
      setDeletingBlog(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium text-lg">Loading stories...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className={`p-8 rounded-lg border text-center max-w-md w-full transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>Oops! Something went wrong</h2>
        <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>{error}</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className={`mb-10 pb-6 border-b transition-colors duration-300 ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Latest Stories
          </h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Discover {blogs?.length || 0} carefully crafted articles and insights.
            </p>
            {user && (
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors duration-300 text-sm shadow-sm ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-white ${isDark ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-amber-400 to-orange-500'}`}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{user.name}</span>
                <span className={`px-2 py-0.5 rounded text-xs tracking-wider uppercase transition-colors duration-300 ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {deleteMessage && (
          <div className={`mb-8 p-4 rounded-lg flex items-center gap-3 shadow-sm transition-colors duration-300 ${deleteMessage.includes("successfully") ? isDark ? "bg-green-900/30 border border-green-700 text-green-300" : "bg-green-50 border border-green-200 text-green-800" : isDark ? "bg-red-900/30 border border-red-700 text-red-300" : "bg-red-50 border border-red-200 text-red-800"}`}>
            <p className="font-medium text-sm">{deleteMessage}</p>
          </div>
        )}
        
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className={`rounded-xl shadow-sm border p-2 flex flex-col md:flex-row gap-2 transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex-1 relative">
              <span className={`absolute inset-y-0 left-0 flex items-center pl-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                🔍
              </span>
              <input
                type="text"
                placeholder="Search articles by title, excerpt, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none font-medium transition-colors ${isDark ? 'text-slate-100 placeholder-slate-500' : 'text-slate-700 placeholder-slate-400'}`}
              />
            </div>
            
            <div className={`w-full md:w-64 border-t md:border-t-0 md:border-l transition-colors ${isDark ? 'border-slate-700' : 'border-slate-100'} relative`}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-4 py-3 bg-transparent focus:outline-none font-medium cursor-pointer appearance-none transition-colors ${isDark ? 'text-slate-100' : 'text-slate-700'}`}
              >
                <option value="">All Topics</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          
          {(searchTerm || selectedCategory) && (
            <div className={`mt-4 flex items-center text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <span>Showing {filteredBlogs?.length || 0} results</span>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className={`ml-4 flex items-center gap-1 transition-colors ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}
              >
                <span>✕</span> Clear filters
              </button>
            </div>
          )}
        </div>
        
        {/* Blog Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {filteredBlogs && filteredBlogs.length > 0 ? filteredBlogs.map((blog) => (
            <motion.div
              key={blog._id}
              className={`group rounded-xl border overflow-hidden flex flex-col h-full transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: 'easeOut' },
                },
              }}
              whileHover={{
                boxShadow: isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' : '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                y: -8,
                transition: { duration: 0.3 },
              }}
            >
              <Link to={`/blog/${blog._id}`} className="block relative overflow-hidden aspect-video">
                {blog.blogImage && blog.blogImage.url ? (
                  <motion.img
                    src={blog.blogImage.url}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center transition-colors ${isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800' : 'bg-gradient-to-br from-slate-100 to-slate-50'}`}>
                    <span className="text-4xl">📷</span>
                  </div>
                )}
                <motion.div 
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.span 
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-colors ${isDark ? 'bg-slate-700 text-slate-100' : 'bg-white/90 backdrop-blur-sm text-slate-800'}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {blog.category}
                  </motion.span>
                </motion.div>
              </Link>

              <motion.div 
                className="p-6 flex flex-col flex-grow"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link to={`/blog/${blog._id}`} className="block mb-3">
                  <motion.h2 
                    className={`text-xl font-bold leading-tight line-clamp-2 transition-colors group-hover:text-amber-500 ${isDark ? 'text-white' : 'text-slate-900'}`}
                    whileHover={{ x: 2 }}
                  >
                    {blog.title}
                  </motion.h2>
                </Link>
                
                <p className={`text-sm leading-relaxed line-clamp-3 mb-6 flex-grow ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {blog.description}
                </p>

                <div className="mt-auto">
                  <div className={`flex justify-between items-center pt-4 border-t transition-colors ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ x: 2 }}
                    >
                      <motion.div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs bg-gradient-to-br from-amber-400 to-orange-500"
                      whileHover={{ scale: 1.1 }}
                    >
                      {blog.adminName ? blog.adminName.charAt(0).toUpperCase() : 'A'}
                    </motion.div>
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{blog.adminName}</span>
                    </motion.div>
                    <motion.div 
                      className={`flex items-center text-sm font-medium gap-1 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}
                      whileHover={{ scale: 1.1 }}
                    >
                      <span>❤️</span> {blog.likeCount || 0}
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <motion.div whileHover={{ x: 4 }}>
                      <Link 
                        to={`/blog/${blog._id}`}
                          className={`font-semibold text-sm flex items-center gap-1 transition-colors ${isDark ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}
                      >
                        Read full story <span>→</span>
                      </Link>
                    </motion.div>

                    {user && user.role === 'admin' && (
                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Link 
                            to={`/editblog/${blog._id}`} 
                            className={`p-2 rounded-full transition-colors ${isDark ? 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>
                          </Link>
                        </motion.div>
                        <motion.button 
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={deletingBlog === blog._id}
                          className={`p-2 rounded-full transition-colors disabled:opacity-50 ${isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
                          title="Delete"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {deletingBlog === blog._id ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )) : (
            <motion.div 
              className="col-span-full py-20 flex flex-col items-center justify-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className={`text-6xl mb-6 p-4 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔍
              </motion.div>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>No stories found</h3>
              <p className={`max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchTerm || selectedCategory 
                  ? "We couldn't find any articles matching your current filters. Try adjusting your search terms or category." 
                  : "It looks like there are no articles published yet. Check back soon!"}
              </p>
              {(searchTerm || selectedCategory) && (
                <motion.button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                  className={`mt-6 px-6 py-2 rounded-full font-medium transition-colors ${isDark ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear all filters
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
