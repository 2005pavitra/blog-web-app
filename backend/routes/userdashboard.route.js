import express from "express";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.get("/userdashboard", isAuthenticated, getUserDashboard);
router.get("/userdashboard/blogs", isAuthenticated, getUserBlogs);
router.get("/userdashboard/blogs/:id", isAuthenticated, getUserBlogById);

