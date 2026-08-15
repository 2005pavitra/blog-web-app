import React, { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
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

  if (loading) return <p className="text-lg text-gray-500 text-center">Loading blogs...</p>;
  if (error) return <p className="text-lg text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">All Blogs</h1>
      
      {user && (
        <div className="mb-4 p-2 bg-blue-100 rounded">
          <p className="text-sm text-blue-800">
            Logged in as: {user.name} (Role: {user.role})
          </p>
        </div>
      )}
      
      {deleteMessage && (
        <div className={`mb-4 p-2 rounded ${deleteMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          <p className="text-sm">{deleteMessage}</p>
        </div>
      )}
      
      {/* Search and Filter Section */}
      <div className="w-full max-w-6xl mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search blogs by title, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {(searchTerm || selectedCategory) && (
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredBlogs?.length || 0} of {blogs?.length || 0} blogs
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="ml-2 text-blue-500 hover:text-blue-700 underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredBlogs && filteredBlogs.length > 0 ? filteredBlogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300"
          >
            {blog.blogImage && blog.blogImage.url && (
              <img
                src={blog.blogImage.url}
                alt={blog.title}
                className="w-full h-52 object-cover rounded-md mb-4"
              />
            )}

            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{blog.title}</h2>
            <p className="text-gray-600 text-sm mb-4">
              <span className="font-bold">Category:</span> {blog.category}
            </p>
            <p className="text-gray-700">{blog.description}</p>
            <div className="flex justify-between items-center mt-3">
              <p className="text-gray-500 text-sm">Author: <span className="font-medium">{blog.adminName}</span></p>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">❤️ {blog.likeCount || 0}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <Link to={`/blog/${blog._id}`}>
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                  View Details
                </button>
              </Link>
              {user && user.role === 'admin' && (
                <div className="flex gap-2">
                  <Link to={`/editblog/${blog._id}`} className="flex-1">
                    <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition font-semibold">
                      ✏️ Edit
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(blog._id, blog.title)}
                    disabled={deletingBlog === blog._id}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition font-semibold disabled:opacity-50"
                  >
                    {deletingBlog === blog._id ? "🗑️ Deleting..." : "🗑️ Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )) : (
          <p className="text-lg text-gray-500 col-span-3 text-center">
            {searchTerm || selectedCategory ? "No blogs match your search criteria" : "No blogs found"}
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
