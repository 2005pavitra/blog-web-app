import React, { useState } from "react";
import axios from "axios";

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    blogImage: null
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
    data.append("blogImage", formData.blogImage);

    const token = localStorage.getItem("token")

    try {
      const res = await axios.post("http://localhost:4000/api/blogs/create", data, {
        // headers: {
        //   "Content-Type": "multipart/form-data",
        //   Authorization: `Bearer ${token}`,
        // },
        withCredentials: true 
      });

      setMessage(res.data.message);
      setFormData({ title: "", category: "", description: "", blogImage: null });
    } catch (error) {
      setMessage(error.response?.data?.error || "Error creating blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create a Blog</h2>
      {message && <p className="text-red-500">{message}</p>}
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
          required
        />
        <input
          type="file"
          accept="image/jpeg, image/jpg, image/png"
          onChange={handleFileChange}
          className="text-black w-full p-2 mb-3 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
