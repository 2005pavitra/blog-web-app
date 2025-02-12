import React from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link } from "react-router-dom";

function Home() {
  const { blogs, loading, error } = useAuth();

  if (loading) return <p className="text-lg text-gray-500 text-center">Loading blogs...</p>;
  if (error) return <p className="text-lg text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">All Blogs</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {blogs && blogs.length > 0 ? (
          blogs.map((blog) => (

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
              <p className="text-gray-500 text-sm mt-3">Author: <span className="font-medium">{blog.adminName}</span></p>
              <Link to={`/blog/${blog._id}`}>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                  View Details
                </button>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-500 col-span-3 text-center">No blogs found</p>
        )}
      </div>
    </div>
  );
}

export default Home;
