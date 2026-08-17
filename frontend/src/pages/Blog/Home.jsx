import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function Home() {
  const { blogs, loading, error, user } = useAuth();
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg border border-slate-200 text-center max-w-md w-full">
        <span className="text-4xl block mb-4">⚠️</span>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 pb-6 border-b border-slate-200">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Latest Stories
          </h1>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-lg text-slate-500">
              Discover {blogs?.length || 0} carefully crafted articles and insights.
            </p>
            {user && (
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-sm">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-slate-700 font-medium">{user.name}</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs tracking-wider uppercase">
                  {user.role}
                </span>
              </div>
            )}
          </div>
        </div>

        {deleteMessage && (
          <div className={`mb-8 p-4 rounded-lg flex items-center gap-3 shadow-sm ${deleteMessage.includes("successfully") ? "bg-green-50 border border-green-200 text-green-800" : "bg-red-50 border border-red-200 text-red-800"}`}>
            <span className="text-lg">{deleteMessage.includes("successfully") ? "✅" : "⚠️"}</span>
            <p className="font-medium text-sm">{deleteMessage}</p>
          </div>
        )}
        
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search articles by title, excerpt, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>
            
            <div className="w-full md:w-64 border-t md:border-t-0 md:border-l border-slate-100 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-transparent focus:outline-none text-slate-700 font-medium cursor-pointer appearance-none"
              >
                <option value="">All Topics</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          
          {(searchTerm || selectedCategory) && (
            <div className="mt-4 flex items-center text-sm font-medium text-slate-500">
              <span>Showing {filteredBlogs?.length || 0} results</span>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="ml-4 text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
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
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-full"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.4, ease: 'easeOut' },
                },
              }}
              whileHover={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
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
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                    <span className="text-slate-300 text-4xl">📷</span>
                  </div>
                )}
                <motion.div 
                  className="absolute top-4 left-4"
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.span 
                    className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm"
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
                    className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-amber-600 transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    {blog.title}
                  </motion.h2>
                </Link>
                
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {blog.description}
                </p>

                <div className="mt-auto">
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <motion.div 
                      className="flex items-center gap-2"
                      whileHover={{ x: 2 }}
                    >
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center text-slate-500 font-bold text-xs"
                        whileHover={{ scale: 1.1 }}
                      >
                        {blog.adminName ? blog.adminName.charAt(0).toUpperCase() : 'A'}
                      </motion.div>
                      <span className="text-slate-700 text-sm font-medium">{blog.adminName}</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center text-slate-500 text-sm font-medium gap-1"
                      whileHover={{ scale: 1.1 }}
                    >
                      <span>❤️</span> {blog.likeCount || 0}
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <motion.div whileHover={{ x: 4 }}>
                      <Link 
                        to={`/blog/${blog._id}`}
                        className="text-amber-600 font-semibold text-sm hover:text-amber-700 flex items-center gap-1"
                      >
                        Read full story <span>→</span>
                      </Link>
                    </motion.div>

                    {user && user.role === 'admin' && (
                      <div className="flex items-center gap-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                          <Link 
                            to={`/editblog/${blog._id}`} 
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Edit"
                          >
                            ✏️
                          </Link>
                        </motion.div>
                        <motion.button 
                          onClick={() => handleDelete(blog._id, blog.title)}
                          disabled={deletingBlog === blog._id}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          title="Delete"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {deletingBlog === blog._id ? "⏳" : "🗑️"}
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
              <motion.span 
                className="text-6xl mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🔍
              </motion.span>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No stories found</h3>
              <p className="text-slate-500 max-w-md">
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
                  className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
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
