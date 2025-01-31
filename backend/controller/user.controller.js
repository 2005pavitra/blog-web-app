import { User } from '../models/user.models.js'
import bcrypt from 'bcryptjs';
import createTokenandSaveCookies from '../jwt/AuthToken.js';
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";


export const register = async (req, res) => {
    try {
       
       //photo upload
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: "No files were uploaded" })
        }
        const { photo } = req.files;
        const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedFileTypes.includes(photo.mimetype)) {
            return res.status(400).json({ error: "Invalid File type" })
        }
        const { name, email, password, phone, role } = req.body;
        
        
        
        if (!name || !email || !password || !phone || !role || !photo) {
            return res.status(400).json({ error: "All fields are required" })
        }
        // console.log(name, email, password, phone, role);    

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ error: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const CloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath)
        if(!CloudinaryResponse){
            return res.status(500).json({ error: "Error while uploading photo" });
            console.log("Error while uploading photo");
        }
        const newUser = await new User({
            email, name, password: hashedPassword, phone, role, photo : {
                public_id: CloudinaryResponse.public_id,
                url: CloudinaryResponse.url
            }
        })
        await newUser.save()
        if (newUser) {
            createTokenandSaveCookies(newUser._id, res)
        }
        res.status(201).json({ message: "User registered successfully", newUser, token: newUser.token })
        // console.log("User registered successfully")
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ error: "All fields are required" })
        }
        // console.log(password)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ error: "User does not exist" })
        }
        if (!user.password) {
            return res.status(400).json({ error: "User does not have a password" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" })
        }
        if (user.role !== role) {
            return res.status(400).json({ message: `Given role ${role} is not valid for this user` })
        }
        const token = createTokenandSaveCookies(user._id, res)
        return res.status(200).json({ message: "User logged in successfully", user, token })
    } catch (error) {
        console.log(error)
    }
    return res.status(500).json({ error: "Internal server error" })
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true });
        return res.status(200).json({ message: "User logged out successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal server error" })
    }
}