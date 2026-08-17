import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Comments from "../../components/Comments";

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
        console.log("Fetching blog with ID:", id);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched data:", data)
        setBlog(data.blog);
        setLikeCount(data.blog.likeCount || 0);
        // Check if current user has liked this blog
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && data.blog.likes) {
          setIsLiked(data.blog.likes.includes(user?._id));
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
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        // We'll use a cleaner UI message instead of alert if possible, 
        // but keeping logic identical. Could use a state for toast.
        alert("Please login to like this blog");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blogs/like/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mb-4"></div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Error loading article</h2>
        <p className="text-slate-500">{error}</p>
      </div>
    </div>
  );
  
  if (!blog) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-xl text-slate-500 font-medium">Article not found</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 font-sans">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation */}
        <button
          onClick={() => window.history.back()}
          className="group flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium mb-10"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
          Back to articles
        </button>

        {/* Article Header */}
        <header className="mb-10 text-center">
          <div className="mb-6">
            <span className="px-4 py-1.5 bg-amber-100 text-amber-800 text-sm font-bold uppercase tracking-wider rounded-full">
              {blog.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-8">
            {blog.title || "Untitled Article"}
          </h1>

          <div className="flex items-center justify-center gap-4 text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg">
                {blog.adminName ? blog.adminName.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-900">{blog.adminName}</p>
                <p className="text-sm text-slate-500">Author</p>
              </div>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300 mx-2"></div>
            <p className="text-sm text-slate-500">
              Published on BlogSpace
            </p>
          </div>
        </header>

        {/* Hero Image */}
        {blog.blogImage && blog.blogImage.url && (
          <figure className="mb-12">
            <img
              src={blog.blogImage.url}
              alt={blog.title}
              className="w-full h-auto aspect-[16/9] object-cover rounded-2xl shadow-lg border border-slate-100"
            />
          </figure>
        )}

        {/* Article Content */}
        <div className="prose prose-lg prose-slate max-w-none mb-12 prose-headings:font-bold prose-a:text-amber-600 hover:prose-a:text-amber-700">
          <p className="text-xl text-slate-700 leading-relaxed whitespace-pre-line">
            {blog.description}
          </p>
        </div>

        {/* Article Footer & Actions */}
        <div className="flex items-center justify-between py-6 border-t border-b border-slate-200 mb-12">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
              isLiked 
                ? 'bg-red-50 text-red-600 border border-red-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className={`text-xl ${isLiked ? 'scale-110' : ''} transition-transform`}>
              {isLiked ? '❤️' : '🤍'}
            </span>
            <span className="font-medium">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
          </button>
          
          <div className="flex gap-4">
             {/* Placeholder for sharing options if needed in future */}
          </div>
        </div>

        {/* Comments Section */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
          <Comments blogId={id} />
        </section>
        
      </div>
    </div>
  );
}

export default BlogDetails;
