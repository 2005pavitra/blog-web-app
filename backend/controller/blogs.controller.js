import { Blog } from "../models/blogs.models.js";
import { v2 as cloudinary } from 'cloudinary';
import jwt from "jsonwebtoken";

//create blog
const createBlog = async (req, res) => {
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No files were uploaded" })
        }
        const { blogImage } = req.files;
        const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedFileTypes.includes(blogImage.mimetype)) {
            return res.status(400).json({ error: "Invalid File type" })
        }



        const { title, category, description, tags } = req.body
        if (!title || !category || !description) {
            return res.status(400).json({ error: "All fields are required" })
        }

        // const {adminName, createdBy} = req.body;
        const adminName = req?.user?.name;
        const createdBy = req?.user?._id;


        // Calculate reading time: approx 200 words per minute
        const wordCount = description.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);

        // Parse tags if it's a string (e.g., "tech, reacting")
        let parsedTags = [];
        if (typeof tags === 'string') {
            parsedTags = tags.split(',').map(tag => tag.trim());
        } else if (Array.isArray(tags)) {
            parsedTags = tags;
        }

        const CloudinaryResponse = await cloudinary.uploader.upload(blogImage.tempFilePath)
        if (!CloudinaryResponse) {
            return res.status(500).json({ error: "Error while uploading photo" })
        }

        const newBlog = new Blog(
            {
                title,
                category,
                description,
                adminName,
                createdBy,
                blogImage: {
                    public_id: CloudinaryResponse.public_id,
                    url: CloudinaryResponse.url
                },
                tags: parsedTags,
                readingTime
            }
        )

        await newBlog.save()

        res.status(201).json({ message: "Blog created successfully", newBlog })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error in creating blog" })
    }
}

//update blog
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, description, blogImage, tags } = req.body;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" }); // Fixed: return response
        }

        blog.title = title || blog.title
        blog.category = category || blog.category
        blog.description = description || blog.description
        blog.blogImage = blogImage || blog.blogImage

        // Update tags if provided
        if (tags) {
            if (typeof tags === 'string') {
                blog.tags = tags.split(',').map(tag => tag.trim());
            } else if (Array.isArray(tags)) {
                blog.tags = tags;
            }
        }

        // Recalculate reading time if description changed
        if (description) {
            const wordCount = description.trim().split(/\s+/).length;
            blog.readingTime = Math.ceil(wordCount / 200);
        }

        await blog.save();
        return res.status(200).json({ message: "Blog updated successfully", blog })

    } catch (error) {
        console.log("error updating blog: ", error);
        return res.status(500).json({ error: "Internal server error" })
    }
}

//deleteBlog
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" })
        }

        await blog.deleteOne();
        return res.status(200).json({ message: "Blog deleted successfully" })

    } catch (error) {
        console.log("error deleting blog", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


//all blogs

const getAllblogs = async (req, res) => {
    try {
        // Validation logic removed from here as it should be in middleware, 
        // but keeping it if no middleware is applied globally yet, 
        // assuming standard verifyToken middleware is used in routes.

        const allBlogs = await Blog.find();
        if (!allBlogs || allBlogs.length === 0) {
            return res.status(404).json({ message: "No blogs found" });
        }

        return res.status(200).json({
            message: "All blogs retrieved successfully",
            allBlogs
        });

    } catch (error) {
        console.error("Error fetching all blogs:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default getAllblogs;



//single blog
const getSingleBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        // Increment views
        blog.views = (blog.views || 0) + 1;
        await blog.save({ validateBeforeSave: false }); // skip validation for simple increment

        return res.status(200).json({ message: "Blog retrieved successfully", blog });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//my blogs
const getMyBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ createdBy: req.user._id });

        if (!blogs) {
            return res.status(404).json({ error: "Blog not found" });
        }

        return res.status(200).json({ message: `My Blogs`, blogs })
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const toggleLike = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" })
        }

        const user = req.user._id;
        const isLiked = blog.likes.includes(user);

        if (isLiked) {
            blog.likes = blog.likes.filter(id => id.toString() !== user.toString());
            blog.likeCount = Math.max(0, blog.likeCount - 1);
        } else {
            blog.likes.push(user);
            blog.likeCount += 1;
        }

        await blog.save();
        return res.status(200).json({ message: isLiked ? "Unliked" : "Liked", blog });

    } catch (error) {
        console.error("Error toggling like:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { createBlog, updateBlog, deleteBlog, getAllblogs, getSingleBlog, getMyBlogs, toggleLike }
