import { Blog } from "../models/blogs.models.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';

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



        const { title, category, description } = req.body
        if (!title || !category || !description) {
            return res.status(400).json({ error: "All fields are required" })
        }

          // const {adminName, createdBy} = req.body;
          const adminName = req?.user?.name;
          const createdBy = req?.user?._id;
          

        // if (!mongoose.Types.ObjectId.isValid(createdBy)) {
        //     return res.status(400).json({ error: "Invalid user id" })
        // }

      

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
const updateBlog = async(req,res) => {
    try {
        const {id} = req.params;
        const {title, category, description, blogImage} = req.body;

        const blog = await Blog.findById(id);
        if(!blog){
            console.log("Blog not found")
        }

        blog.title = title || blog.title
        blog.category = category || blog.category
        blog.description = description || blog.description
        blog.blogImage = blogImage || blog.blogImage

        await blog.save();
        return res.status(200).json({message:"Blog updated successfully", blog})

    } catch (error) {
        console.log("error creating allblogs: ", error);
        return res.status(500).json({error: "Internal server error"})
    }
}

//deleteBlog
const deleteBlog = async(req,res) =>{
    try {
        const {id} = req.params;
        console.log(id);

        const blog = await Blog.findById(id);
        // console.log(blog.title)
        if(!blog){
            return res.status(404).json({error:"Blog not found"})
        }

        await blog.deleteOne();
        return res.status(200).json({message:"Blog deleted successfully"})

    } catch (error) {
     console.log("error deleting blog")   
     return res.status(500).json({message:"Internal server error"})
    }
}


//all blogs
const getAllblogs = async(req, res) =>{
    try {
        const allblogs = await Blog.find();
        if(!allblogs || allblogs.length === 0){
            return res.status(500).json({message:"all blogs not found"});
        }

        return res.status(200).json({message:"allblogs retreived successfully", allblogs})

    } catch (error) {
        console.log("error in fetching all blogs")
        return res.status(404).json({message:"Internal server error"})
    }
}


//single blog
const getSingleBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        return res.status(200).json({ message: "Blog retrieved successfully", blog });
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

//my blogs
const getMyBlogs = async(req,res) =>{
    try {
        const blogs = await Blog.find({createdBy:req.user._id});

        if (!blogs) {
            return res.status(404).json({ error: "Blog not found" });
        }

        return res.status(200).json({message:`My Blogs`, blogs})
    } catch (error) {
        console.error("Error fetching blog:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export { createBlog , updateBlog, deleteBlog, getAllblogs, getSingleBlog, getMyBlogs}