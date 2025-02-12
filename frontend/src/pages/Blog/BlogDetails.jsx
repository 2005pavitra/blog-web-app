import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);


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


      <p className="mt-4 text-white"><strong>Author:</strong> {blog.adminName}</p>

      <button
        onClick={() => window.history.back()}
        className="mt-6 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
      >
        Go Back
      </button>
    </div>
  );
}

export default BlogDetails;
