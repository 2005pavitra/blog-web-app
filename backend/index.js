import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.route.js";
import blogRouter from "./routes/blogs.route.js";
import commentRouter from "./routes/comments.route.js";

import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// CORS — configurable via environment variable
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsers with size limits (express.json replaces body-parser)
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// Cookie parser
app.use(cookieParser());

// File upload with size limit and temp directory
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp/",
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  })
);

// Global rate limiting
app.use("/api", apiLimiter);

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/comments", commentRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Centralized error handler (must be registered after routes)
app.use(errorHandler);

// Start server only after successful database connection
const PORT = process.env.PORT || 4000;
const MONGODB_URL = process.env.MONGODB_URL;

const startServer = async () => {
  try {
    if (!MONGODB_URL) {
      console.error("MONGODB_URL environment variable is not set");
      process.exit(1);
    }

    await mongoose.connect(MONGODB_URL);
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
