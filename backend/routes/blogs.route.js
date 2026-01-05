import express from "express";
import { createBlog, deleteBlog, getAllblogs, updateBlog, getMyBlogs, getSingleBlog, toggleLike } from "../controller/blogs.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";
import { isAdmin } from "../middleware/authUser.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin, createBlog);
router.delete("/delete/:id", isAuthenticated, isAdmin, deleteBlog);
router.put("/update/:id", isAuthenticated, isAdmin, updateBlog);
router.get("/allblogs", getAllblogs);
router.get("/:id", getSingleBlog);
router.get("/admin/:id", isAuthenticated, isAdmin, getMyBlogs);
router.post("/like/:id", isAuthenticated, toggleLike);


export default router;