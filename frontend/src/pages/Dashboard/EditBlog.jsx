import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    blogImage: null
  });
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch blog data on component mount
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/blogs/${id}`, {
          withCredentials: true
        });

        const blog = response.data.blog;
        setFormData({
          title: blog.title || "",
          category: blog.category || "",
          description: blog.description || "",
          blogImage: null
        });
        setCurrentImage(blog.blogImage?.url || "");
      } catch (error) {
        setMessage("Error fetching blog: " + (error.response?.data?.error || error.message));
      } finally {
        setFetchLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({ ...formData, blogImage: e.target.files[0] });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    if (formData.blogImage) {
      data.append("blogImage", formData.blogImage);
    }

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/blogs/update/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true
      });

      setMessage("Blog updated successfully!");
      setTimeout(() => {
        navigate("/allblogs");
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating blog");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center p-8">Loading blog data...</div>;
  }

  return (
    <div className="text-black max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>
      {message && (
        <p className={`p-2 mb-4 rounded ${message.includes("Error") ? "text-red-500 bg-red-100" : "text-green-500 bg-green-100"}`}>
          {message}
        </p>
      )}
      
      {currentImage && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Current Image:</p>
          <img 
            src={currentImage} 
            alt="Current blog" 
            className="w-full h-32 object-cover rounded border"
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="text-black w-full p-2 mb-3 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="text-black w-full p-2 mb-3 border rounded"
          rows="4"
          required
        />
        <div className="mb-3">
          <label className="block text-sm text-gray-600 mb-2">
            New Image (optional - leave empty to keep current image):
          </label>
          <input
            type="file"
            accept="image/jpeg, image/jpg, image/png"
            onChange={handleFileChange}
            className="text-black w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/allblogs")}
            className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog; 