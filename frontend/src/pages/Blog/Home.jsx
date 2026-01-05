import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaHeart, FaRegHeart, FaTrash, FaEdit, FaEye, FaClock } from 'react-icons/fa';
import Loader from "../../components/Loader";
import Hero from "../../components/Hero"; // Import Hero

function Home() {
  const { blogs, loading, error, user } = useAuth();
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Filter blogs based on search term and category
  const filteredBlogs = blogs?.filter(blog => {
    const term = searchTerm.toLowerCase();
    const titleMatch = blog.title.toLowerCase().includes(term);
    const descMatch = blog.description.toLowerCase().includes(term);
    const catMatch = blog.category.toLowerCase().includes(term);
    const tagMatch = blog.tags?.some(tag => tag.toLowerCase().includes(term));

    const matchesSearch = titleMatch || descMatch || catMatch || tagMatch;
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
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/blogs/delete/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  if (loading) return <Loader />;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Search and Filter Section - Floating below navbar or part of Hero? 
          Let's put it below Hero for now or sticky under navbar. 
          Actually, placing it in a container after Hero looks good. */}

      {/* Optional: Show Hero only on the "/" route if this was purely Home, but current route is /allblogs maybe? 
         The App.jsx maps /allblogs to Home. So we can show Hero. */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Latest Blogs</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Explore our latest articles and insights.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-10 max-w-4xl mx-auto">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, tag, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {deleteMessage && (
          <div className={`mb-6 p-4 rounded-md text-center ${deleteMessage.includes("successfully") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {deleteMessage}
          </div>
        )}

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredBlogs && filteredBlogs.length > 0 ? filteredBlogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                {blog.blogImage && blog.blogImage.url ? (
                  <img
                    src={blog.blogImage.url}
                    alt={blog.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold uppercase rounded-full shadow-sm">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                  <span className="flex items-center"><FaClock className="mr-1" /> {blog.readingTime || 1} min read</span>
                  {blog.views !== undefined && <span className="flex items-center"><FaEye className="mr-1" /> {blog.views} views</span>}
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </h2>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {blog.description}
                </p>

                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {blog.adminName ? blog.adminName.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 truncate max-w-[100px]">{blog.adminName}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-500 text-sm">
                    <span className="flex items-center text-red-500">
                      <FaHeart className="mr-1" /> {blog.likeCount || 0}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link to={`/blog/${blog._id}`} className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-medium py-2 rounded-lg transition-colors">
                    Read More
                  </Link>
                  {user && user.role === 'admin' && (
                    <>
                      <Link to={`/editblog/${blog._id}`} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition">
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id, blog.title)}
                        disabled={deletingBlog === blog._id}
                        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition disabled:opacity-50"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              <p className="text-lg">No blogs found matching your search.</p>
              <button
                onClick={() => { setSearchTerm(""); setSelectedCategory(""); }}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
