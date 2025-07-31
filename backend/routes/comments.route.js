import express from "express";
import { addComment, getComments, updateComment, deleteComment } from "../controller/comments.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// Get comments for a blog (public route)
router.get("/:blogId", getComments);

// Add comment (requires authentication)
router.post("/add", isAuthenticated, addComment);

// Update comment (requires authentication)
router.put("/update/:commentId", isAuthenticated, updateComment);

// Delete comment (requires authentication)
router.delete("/delete/:commentId", isAuthenticated, deleteComment);

export default router; 