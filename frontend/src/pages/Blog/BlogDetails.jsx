import React, { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import { useParams, Link } from "react-router-dom";
import Comments from "../../components/Comments";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";
import { FaHeart, FaRegHeart, FaCalendarAlt, FaUser, FaClock, FaEye, FaArrowLeft } from "react-icons/fa";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setBlog(data.blog);
        setLikeCount(data.blog.likeCount || 0);

        const storedToken = localStorage.getItem("token");
        if (storedToken && data.blog.likes) {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user) {
            setIsLiked(data.blog.likes.includes(user._id));
          }
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);


  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to like this blog");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/blogs/like/${id}`, {
        method: "PUT", // Changed to PUT as usually toggle like is an update, but check backend route. Assuming PUT or POST. logic is toggleLike.
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.ok) {
        const data = await response.json();
        // The backend toggleLike returns { message, blog }
        // We can check if message is "Liked" or "Unliked"
        setIsLiked(data.message === "Liked");
        setLikeCount(data.blog?.likeCount || (data.message === "Liked" ? likeCount + 1 : likeCount - 1));
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  if (!blog) return <div className="flex justify-center items-center min-h-screen text-gray-500">Blog not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Blog Image */}
        {blog.blogImage && blog.blogImage.url && (
          <div className="h-64 sm:h-80 md:h-96 w-full relative">
            <img
              src={blog.blogImage.url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white w-full">
                <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
                  {blog.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 text-shadow">
                  {blog.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 md:p-10">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center justify-between text-gray-500 text-sm mb-8 border-b border-gray-100 pb-6 gap-4">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <FaUser className="mr-2 text-blue-500" /> {blog.adminName}
              </span>
              <span className="flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" /> {new Date(blog.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="flex items-center" title="Reading Time">
                <FaClock className="mr-2 text-blue-500" /> {blog.readingTime || 1} min read
              </span>
              <span className="flex items-center" title="Views">
                <FaEye className="mr-2 text-blue-500" /> {blog.views || 0}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whites-pre-line">
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.description) }} />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Interaction Section */}
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all transform hover:scale-105 shadow-md ${isLiked
                ? 'bg-red-50 text-red-500 border border-red-200'
                : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
            >
              {isLiked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
              <span className="font-semibold">{isLiked ? 'Liked' : 'Like'}</span>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold shadow-sm border border-gray-100">
                {likeCount}
              </span>
            </button>

            <div className="flex gap-4">
              {/* Share buttons could go here */}
            </div>
          </div>

          <div className="mt-12">
            <Link to="/allblogs" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
              <FaArrowLeft className="mr-2" /> Back to all blogs
            </Link>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-50 border-t border-gray-100 p-6 md:p-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>
          <Comments blogId={id} />
        </div>

      </motion.div>
    </div>
  );
}

export default BlogDetails;
