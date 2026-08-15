import { User } from '../models/user.models.js';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import createTokenandSaveCookies from '../jwt/AuthToken.js';
import { v2 as cloudinary } from 'cloudinary';


export const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validate required fields — role is NOT accepted from client
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ error: "Name, email, password, and phone are required" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        // Validate name length
        if (name.trim().length < 2 || name.trim().length > 50) {
            return res.status(400).json({ error: "Name must be between 2 and 50 characters" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle photo upload only if a file is provided
        let uploadedPhoto = null;
        if (req.files && req.files.photo) {
            const { photo } = req.files;
            const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

            if (!allowedFileTypes.includes(photo.mimetype)) {
                return res.status(400).json({ error: "Invalid file type. Allowed: JPEG, PNG" });
            }

            if (photo.size > 5 * 1024 * 1024) {
                return res.status(400).json({ error: "Photo must be under 5MB" });
            }

            const CloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
            if (!CloudinaryResponse || !CloudinaryResponse.public_id) {
                return res.status(500).json({ error: "Error while uploading photo" });
            }

            uploadedPhoto = {
                public_id: CloudinaryResponse.public_id,
                url: CloudinaryResponse.secure_url
            };
        }

        // SECURITY: Always set role to "user" — never trust client-provided role
        const newUser = new User({
            email,
            name: name.trim(),
            password: hashedPassword,
            phone,
            role: "user",
            photo: uploadedPhoto
        });

        await newUser.save();

        // Set JWT as httpOnly cookie — do NOT return token in response body
        await createTokenandSaveCookies(newUser._id, res);

        // Return sanitized user object (no password hash)
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            photo: newUser.photo,
        };

        res.status(201).json({ message: "User registered successfully", user: userResponse });

    } catch (error) {
        console.error("Error in registration:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (!user.password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Set JWT as httpOnly cookie — do NOT return token in response body
        await createTokenandSaveCookies(user._id, res);

        // Return sanitized user object (no password hash)
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            photo: user.photo,
        };

        return res.status(200).json({ message: "User logged in successfully", user: userResponse });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const logout = async (req, res) => {
    try {
        const isProduction = process.env.NODE_ENV === "production";
        res.clearCookie("token", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            path: "/",
        });
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};