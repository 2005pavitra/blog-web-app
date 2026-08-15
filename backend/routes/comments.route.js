import express from "express";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
  replyToComment,
} from "../controller/comments.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.get("/:blogId", getComments);
router.post("/add", isAuthenticated, addComment);
router.post("/:commentId/reply", isAuthenticated, replyToComment);
router.put("/update/:commentId", isAuthenticated, updateComment);
router.delete("/delete/:commentId", isAuthenticated, deleteComment);

export default router;
