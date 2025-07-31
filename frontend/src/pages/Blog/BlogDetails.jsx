import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:4000/api/blogs/${id}`, {
          method: "GET",
          // headers: {
          //   "Authorization": `Bearer ${token}`,
          //   "Content-Type": "application/json",
          // },
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
        const storedToken = localStorage.getItem("token");
        if (storedToken && data.blog.likes) {
          const user = JSON.parse(localStorage.getItem("user"));
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to like this blog");
        return;
      }

      const response = await fetch(`http://localhost:4000/api/blogs/like/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
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

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!blog) return <p className="text-center text-gray-500">Blog not found</p>;

  return (
    <div className=" container mx-auto p-6 text-white">
      <h1 className="text-white text-4xl font-bold text-center mb-6">{blog?.title || "Title not found"}</h1>



      {blog.blogImage && blog.blogImage.url && (
        <img
          src={blog.blogImage.url}
          alt={blog.title}
          className=" w-52 h-full object-cover rounded-md mb-4"
        />
      )}
      <p className="mt-4 text-white"><strong>Category:</strong> {blog.category}</p>
      <p className="text-white text-lg">{blog.description}</p>

      {/* Like Button */}
      <div className="mt-6 flex items-center space-x-4">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md transition ${
            isLiked 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <span>{isLiked ? '❤️' : '🤍'}</span>
          <span>{isLiked ? 'Liked' : 'Like'}</span>
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
            {likeCount}
          </span>
        </button>
      </div>

      <p className="mt-4 text-white"><strong>Author:</strong> {blog.adminName}</p>

      <button
        onClick={() => window.history.back()}
        className="mt-6 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
      >
        Go Back
      </button>

      {/* Comments Section */}
      <Comments blogId={id} />
    </div>
  );
}

export default BlogDetails;
