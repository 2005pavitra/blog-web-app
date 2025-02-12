import { User } from '../models/user.models.js'
import bcrypt from 'bcryptjs';
import createTokenandSaveCookies from '../jwt/AuthToken.js';
import { v2 as cloudinary } from 'cloudinary';


export const register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Ensure all required fields are present
        if (!name || !email || !password || !phone || !role) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if the user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle photo upload only if a file is provided
        let uploadedPhoto = null;
        if (req.files && req.files.photo) {
            const { photo } = req.files;
            const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

            if (!allowedFileTypes.includes(photo.mimetype)) {
                return res.status(400).json({ error: "Invalid file type" });
            }

            const CloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
            if (!CloudinaryResponse) {
                return res.status(500).json({ error: "Error while uploading photo" });
            }

            uploadedPhoto = {
                public_id: CloudinaryResponse.public_id,
                url: CloudinaryResponse.url
            };
        }

        // Create new user
        const newUser = new User({
            email,
            name,
            password: hashedPassword,
            phone,
            role,
            photo: uploadedPhoto // This will be `null` if no photo was uploaded
        });

        await newUser.save();

        if (newUser) {
            const token = await createTokenandSaveCookies(newUser._id, res);
            console.log("Signup token:", token);
        }

        res.status(201).json({ message: "User registered successfully", newUser, token: newUser.token });

    } catch (error) {
        console.error("Error in registration:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


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

        const token = await createTokenandSaveCookies(user._id, res)
        console.log("login: ", token)
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