import express from "express";
import {createdBlog, getBlogs, getBlogById, updateBlog, deleteBlog} from "../controllers/blogs.controller.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.post("/", createdBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);

export default router;