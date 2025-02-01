import { Blog } from "../models/blogs.models.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from 'cloudinary';


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

export { createBlog }