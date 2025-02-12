import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        console.log("Incoming Cookies: ", req.cookies.token);

        const token = req.cookies?.token;

        console.log("Extracted Token from Cookies: ", token);

        if (!token) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); 
        console.log("Decoded JWT:", decoded);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Invalid token" });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired, please login again" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
};



// Admin Role Middleware
export const isAdmin = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
};
