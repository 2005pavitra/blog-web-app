import express from "express";
import { createBlog, deleteBlog, getAllblogs, updateBlog, getMyBlogs, getSingleBlog } from "../controller/blogs.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";
import { isAdmin } from "../middleware/authUser.js";

const router = express.Router();

router.post("/create",isAuthenticated,isAdmin, createBlog);
router.delete("/delete/:id",isAuthenticated,isAdmin, deleteBlog);
router.put("/update/:id",isAuthenticated,isAdmin, updateBlog);
router.get("/allblogs",isAuthenticated, getAllblogs);
router.get("/:id", isAuthenticated, getSingleBlog);
router.get("/admin/:id", isAuthenticated,isAdmin, getMyBlogs);


export default router;