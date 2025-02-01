import express from "express";
import { createBlog } from "../controller/blogs.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";
import { isAdmin } from "../middleware/authUser.js";

const router = express.Router();

router.post("/create",isAuthenticated,isAdmin, createBlog);


export default router;